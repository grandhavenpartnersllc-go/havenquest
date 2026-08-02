#!/usr/bin/env node
/**
 * SCHEMA DRIFT CHECK
 *
 * Fails the build when the code references a database column that the committed
 * schema snapshot does not contain.
 *
 * WHAT THIS DOES NOT DO: it never contacts the database. No Postgres connection
 * string exists in this project's env surface, and `information_schema` is not
 * reachable through PostgREST, so a build-time query is impossible. This compares
 * code against `docs/schema/live-schema-2026-07-31.csv` and nothing else.
 *
 * The consequence, stated plainly: this check CANNOT detect the database drifting
 * away from the snapshot. Only a fresh export does that. See docs/schema/README.md.
 *
 * Method: every `.from('table')` is an anchor; column references are attributed to
 * the nearest preceding anchor within the same call chain. Extraction is deliberately
 * conservative — it under-reports rather than over-reports, because a check that
 * raises false alarms gets disabled within a week. Every violation it names is real.
 *
 * Run: node scripts/check-schema-drift.mjs   (fires automatically via `prebuild`)
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const SNAPSHOT = 'docs/schema/live-schema-2026-07-31.csv'
const ALLOWLIST = 'scripts/schema-drift-known.json'
const STALE_AFTER_DAYS = 45

const SCAN_DIRS = ['app', 'lib', 'components', 'services', 'utils']
const SCAN_FILES = ['proxy.ts']
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build', '.vercel'])
const EXTS = ['.ts', '.tsx']

/** `.from()` on these is a JS built-in, not a Supabase table. */
const NOT_TABLES = new Set([
  'Array', 'Buffer', 'Object', 'String', 'Number', 'Boolean', 'Date', 'JSON',
  'Set', 'Map', 'WeakSet', 'WeakMap', 'Promise', 'Reflect', 'Proxy', 'BigInt',
  'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array',
  'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'BigInt64Array',
  'BigUint64Array', 'ArrayBuffer', 'SharedArrayBuffer', 'DataView',
])

/** Filter/order methods whose FIRST string argument is a column name. */
const COLUMN_FIRST_ARG = [
  'eq', 'neq', 'is', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike',
  'order', 'not', 'contains', 'containedBy', 'overlaps',
]

/** Methods whose object-literal keys are column names. */
const PAYLOAD_METHODS = ['insert', 'update', 'upsert', 'match']

/**
 * Max characters between a `.from()` anchor and a reference attributed to it.
 * Guards against a stray `.update({...})` far down a file being misattributed to
 * an unrelated query above it. Chains in this repo are well under this.
 */
const MAX_ATTRIBUTION_DISTANCE = 700

// ─────────────────────────────────────────────────────────────────────────────
// Source masking — blank out comments so example code in them is never scanned,
// while preserving byte offsets so line numbers stay accurate.
// ─────────────────────────────────────────────────────────────────────────────

function maskComments(src) {
  const out = src.split('')
  let i = 0
  const n = src.length
  let state = 'code' // code | line | block | sq | dq | tpl
  while (i < n) {
    const c = src[i]
    const d = src[i + 1]
    if (state === 'code') {
      if (c === '/' && d === '/') { state = 'line'; out[i] = ' '; out[i + 1] = ' '; i += 2; continue }
      if (c === '/' && d === '*') { state = 'block'; out[i] = ' '; out[i + 1] = ' '; i += 2; continue }
      if (c === "'") state = 'sq'
      else if (c === '"') state = 'dq'
      else if (c === '`') state = 'tpl'
      i++; continue
    }
    if (state === 'line') {
      if (c === '\n') { state = 'code'; i++; continue }
      out[i] = ' '; i++; continue
    }
    if (state === 'block') {
      if (c === '*' && d === '/') { state = 'code'; out[i] = ' '; out[i + 1] = ' '; i += 2; continue }
      if (c !== '\n') out[i] = ' '
      i++; continue
    }
    // inside a string literal
    if (c === '\\') { i += 2; continue }
    if ((state === 'sq' && c === "'") || (state === 'dq' && c === '"') || (state === 'tpl' && c === '`')) {
      state = 'code'
    }
    i++
  }
  return out.join('')
}

function lineIndex(src) {
  const starts = [0]
  for (let i = 0; i < src.length; i++) if (src[i] === '\n') starts.push(i + 1)
  return starts
}

function lineOf(starts, offset) {
  let lo = 0, hi = starts.length - 1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (starts[mid] <= offset) lo = mid; else hi = mid - 1
  }
  return lo + 1
}

// ─────────────────────────────────────────────────────────────────────────────
// Snapshot
// ─────────────────────────────────────────────────────────────────────────────

function loadSnapshot(path) {
  const raw = readFileSync(path, 'utf8').replace(/\r\n/g, '\n').trim()
  const lines = raw.split('\n')
  if (!/^table_name\s*,\s*column_count\s*,\s*columns$/i.test(lines[0].trim())) {
    fail(`Snapshot header is not the expected "table_name,column_count,columns": ${lines[0]}`)
  }
  const tables = new Map()
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue
    const c1 = line.indexOf(',')
    const c2 = line.indexOf(',', c1 + 1)
    if (c1 < 0 || c2 < 0) fail(`Malformed snapshot row: ${line.slice(0, 60)}`)
    const table = line.slice(0, c1).trim()
    const declared = Number(line.slice(c1 + 1, c2).trim())
    const cols = line.slice(c2 + 1).split('|').map(s => s.trim().split(/\s+/)[0]).filter(Boolean)
    if (cols.length !== declared) {
      fail(`Snapshot row "${table}" declares ${declared} columns but lists ${cols.length}. ` +
           `The snapshot is corrupt — re-export it before trusting this check.`)
    }
    tables.set(table, new Set(cols))
  }
  return tables
}

function snapshotDate(path) {
  const m = path.match(/live-schema-(\d{4})-(\d{2})-(\d{2})\.csv$/)
  if (!m) return null
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]))
}

// ─────────────────────────────────────────────────────────────────────────────
// Extraction
// ─────────────────────────────────────────────────────────────────────────────

function walk(dir, acc) {
  let entries
  try { entries = readdirSync(dir) } catch { return acc }
  for (const name of entries) {
    if (SKIP_DIRS.has(name)) continue
    const full = join(dir, name)
    let st
    try { st = statSync(full) } catch { continue }
    if (st.isDirectory()) walk(full, acc)
    else if (EXTS.some(e => name.endsWith(e))) acc.push(full)
  }
  return acc
}

const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/

/** Normalise a select-list token: strip PostgREST alias, JSON path, and cast. */
function normaliseColumn(tok) {
  let t = tok.trim()
  if (!t) return null
  if (t.includes(':')) t = t.slice(t.lastIndexOf(':') + 1).trim()  // alias:column
  t = t.split('->')[0].trim()                                       // json ->/->>
  t = t.split('::')[0].trim()                                       // cast
  if (!t || !IDENT.test(t)) return null
  return t
}

/**
 * Collect depth-1 keys of an object literal starting at `open` (index of `{`).
 * Returns { keys, spread, end }. Spread payloads cannot be enumerated statically.
 */
function objectKeys(src, open) {
  const keys = []
  let spread = false
  let i = open + 1
  let depth = 1
  let expectKey = true
  const n = src.length
  while (i < n && depth > 0) {
    const c = src[i]
    if (c === "'" || c === '"' || c === '`') {
      const quote = c
      const start = i + 1
      i++
      while (i < n && src[i] !== quote) { if (src[i] === '\\') i++; i++ }
      if (depth === 1 && expectKey) {
        let j = i + 1
        while (j < n && /\s/.test(src[j])) j++
        if (src[j] === ':') { const k = src.slice(start, i); if (IDENT.test(k)) keys.push(k) }
        expectKey = false
      }
      i++
      continue
    }
    if (c === '{' || c === '[' || c === '(') { depth++; i++; continue }
    if (c === '}' || c === ']' || c === ')') { depth--; i++; if (depth === 1) expectKey = false; continue }
    if (c === ',' && depth === 1) { expectKey = true; i++; continue }
    if (depth === 1 && expectKey) {
      if (/\s/.test(c)) { i++; continue }
      if (c === '.' && src.slice(i, i + 3) === '...') {
        // A spread element. `...(cond && { col: v })` and `...(c ? { col: v } : {})`
        // are enumerable — the object literal is right there. `...formData` is not.
        //
        // Recurse ONLY into spread position, never into value position: in
        // `jsonb_col: cond ? { nested_key: v } : null`, `nested_key` is a key inside a
        // jsonb VALUE and is not a column. Scanning it would invent a false violation.
        let j = i + 3
        let d = 0
        const found = []
        let sawObject = false
        while (j < n) {
          const ch = src[j]
          if (ch === "'" || ch === '"' || ch === '`') {
            const q = ch; j++
            while (j < n && src[j] !== q) { if (src[j] === '\\') j++; j++ }
            j++; continue
          }
          if (ch === '(' || ch === '[') { d++; j++; continue }
          if (ch === ')' || ch === ']') { if (d === 0) break; d--; j++; continue }
          if (ch === '{') {
            const r = objectKeys(src, j)
            sawObject = true
            found.push(...r.keys)
            if (r.spread) spread = true
            j = r.end
            continue
          }
          if (ch === '}') { if (d === 0) break; d--; j++; continue }
          if (ch === ',' && d === 0) break
          j++
        }
        if (sawObject) keys.push(...found)
        else spread = true // e.g. `...formData` — keys live elsewhere, unenumerable
        expectKey = false
        i = j
        continue
      }
      if (c === '[') { expectKey = false; i++; continue } // computed key — unenumerable
      if (/[A-Za-z_$]/.test(c)) {
        let j = i
        while (j < n && /[A-Za-z0-9_$]/.test(src[j])) j++
        const word = src.slice(i, j)
        let k = j
        while (k < n && /\s/.test(src[k])) k++
        // `key:` (explicit) or `key,` / `key}` (shorthand) — both name a column
        if (src[k] === ':' || src[k] === ',' || src[k] === '}') {
          if (IDENT.test(word)) keys.push(word)
        }
        expectKey = false
        i = j
        continue
      }
      expectKey = false
      i++
      continue
    }
    i++
  }
  return { keys, spread, end: i }
}

function extract(files) {
  const refs = []          // { table, column, file, line }
  const starSites = []     // { file, line, table }
  const spreadSites = []   // { file, line, table }
  let anchorCount = 0

  for (const file of files) {
    const rel = relative(ROOT, file).split(sep).join('/')
    let raw
    try { raw = readFileSync(file, 'utf8') } catch { continue }
    if (!raw.includes('.from(')) continue
    const src = maskComments(raw)
    const starts = lineIndex(src)

    // ── anchors ──
    const anchors = []
    const anchorRe = /\.from\(\s*(['"`])([^'"`]*)\1\s*\)/g
    let m
    while ((m = anchorRe.exec(src))) {
      const before = src.slice(Math.max(0, m.index - 60), m.index)
      if (/\.storage\s*$/.test(before)) continue          // storage bucket, not a table
      const idm = before.match(/([A-Za-z0-9_$]+)\s*$/)
      if (idm && NOT_TABLES.has(idm[1])) continue          // Array.from / Buffer.from
      anchors.push({ index: m.index, end: anchorRe.lastIndex, table: m[2] })
      anchorCount++
    }
    if (!anchors.length) continue

    const tableAt = (idx) => {
      let found = null
      for (const a of anchors) {
        if (a.index >= idx) break
        found = a
      }
      if (!found) return null
      if (idx - found.end > MAX_ATTRIBUTION_DISTANCE) return null
      return found.table
    }

    const push = (idx, column) => {
      const table = tableAt(idx)
      if (!table || !column) return
      refs.push({ table, column, file: rel, line: lineOf(starts, idx) })
    }

    // ── .select('a, b, c') ──
    const selRe = /\.select\(\s*(['"`])([^'"`]*)\1/g
    while ((m = selRe.exec(src))) {
      const body = m[2]
      const table = tableAt(m.index)
      if (body.includes('*')) {
        starSites.push({ file: rel, line: lineOf(starts, m.index), table: table || '?' })
        continue
      }
      for (const tok of body.split(',')) {
        const col = normaliseColumn(tok)
        if (col) push(m.index, col)
      }
    }
    // bare .select() — equivalent to select('*')
    const bareRe = /\.select\(\s*\)/g
    while ((m = bareRe.exec(src))) {
      starSites.push({ file: rel, line: lineOf(starts, m.index), table: tableAt(m.index) || '?' })
    }

    // ── .eq('col', …) and friends ──
    const filtRe = new RegExp(`\\.(${COLUMN_FIRST_ARG.join('|')})\\(\\s*(['"\`])([^'"\`]*)\\2`, 'g')
    while ((m = filtRe.exec(src))) {
      const col = normaliseColumn(m[3])
      if (col) push(m.index, col)
    }

    // ── .insert / .update / .upsert / .match object literals ──
    const payRe = new RegExp(`\\.(${PAYLOAD_METHODS.join('|')})\\(`, 'g')
    while ((m = payRe.exec(src))) {
      let j = payRe.lastIndex
      while (j < src.length && /\s/.test(src[j])) j++
      if (src[j] === '[') { j++; while (j < src.length && /\s/.test(src[j])) j++ }
      if (src[j] !== '{') {
        // `.update(variableName)` — payload built elsewhere, cannot be enumerated
        if (/[A-Za-z_$]/.test(src[j] || '')) {
          spreadSites.push({ file: rel, line: lineOf(starts, m.index), table: tableAt(m.index) || '?' })
        }
        continue
      }
      const { keys, spread } = objectKeys(src, j)
      if (spread) spreadSites.push({ file: rel, line: lineOf(starts, m.index), table: tableAt(m.index) || '?' })
      for (const k of keys) push(m.index, k)
    }
  }
  return { refs, starSites, spreadSites, anchorCount }
}

// ─────────────────────────────────────────────────────────────────────────────

function fail(msg) {
  console.error(`\nSCHEMA DRIFT CHECK — ABORTED\n  ${msg}\n`)
  process.exit(1)
}

function main() {
  const snapPath = join(ROOT, SNAPSHOT)
  const tables = loadSnapshot(snapPath)

  let known = []
  try {
    const parsed = JSON.parse(readFileSync(join(ROOT, ALLOWLIST), 'utf8'))
    known = parsed.known_violations || []
  } catch (e) {
    fail(`Could not read ${ALLOWLIST}: ${e.message}`)
  }
  const knownKeys = new Set(known.map(k => `${k.table}.${k.column}`))

  const files = []
  for (const d of SCAN_DIRS) walk(join(ROOT, d), files)
  for (const f of SCAN_FILES) { try { statSync(join(ROOT, f)); files.push(join(ROOT, f)) } catch {} }

  const { refs, starSites, spreadSites, anchorCount } = extract(files)

  // ── compare ──
  const violations = new Map()
  for (const r of refs) {
    const cols = tables.get(r.table)
    const missing = cols ? !cols.has(r.column) : true
    if (!missing) continue
    const key = `${r.table}.${r.column}`
    if (!violations.has(key)) {
      violations.set(key, { ...r, tableMissing: !cols, sites: [] })
    }
    violations.get(key).sites.push(`${r.file}:${r.line}`)
  }

  const newViolations = [...violations.entries()].filter(([k]) => !knownKeys.has(k))
  const hitKnown = [...violations.keys()].filter(k => knownKeys.has(k))
  const staleAllowlist = [...knownKeys].filter(k => !violations.has(k))

  // ── report ──
  const date = snapshotDate(SNAPSHOT)
  const ageDays = date ? Math.floor((Date.now() - date.getTime()) / 86400000) : null
  const asOf = date ? date.toISOString().slice(0, 10) : 'unknown'

  const L = []
  L.push('')
  L.push('SCHEMA DRIFT CHECK')
  L.push(`  snapshot: ${SNAPSHOT} (as of ${asOf}, ${ageDays === null ? '?' : ageDays} days old)`)
  L.push(`  scanned:  ${files.length} files, ${anchorCount} .from() sites, ${refs.length} column references`)
  L.push(`  tables:   ${tables.size} in snapshot`)
  L.push('')
  L.push('  BLIND SPOTS (not covered by this check)')
  L.push(`    ${starSites.length} star-equivalent query sites — name no column, so they can neither fail nor be checked`)
  L.push(`    ${spreadSites.length} spread/variable write payloads — keys not statically enumerable`)
  L.push('    database-vs-snapshot drift (requires re-export)')
  L.push('')
  L.push(`  KNOWN VIOLATIONS (baselined, ${hitKnown.length} of ${knownKeys.size} listed)`)
  if (!hitKnown.length) L.push('    none detected')
  for (const k of hitKnown.sort()) {
    const v = violations.get(k)
    L.push(`    ${k.padEnd(38)} ${v.sites[0]}${v.sites.length > 1 ? ` (+${v.sites.length - 1} more)` : ''}`)
  }
  if (staleAllowlist.length) {
    L.push('')
    L.push(`  ALLOWLIST ENTRIES NO LONGER DETECTED (${staleAllowlist.length}) — remove them; this list may only shrink`)
    for (const k of staleAllowlist.sort()) L.push(`    ${k}`)
  }
  L.push('')
  L.push(`  NEW VIOLATIONS (${newViolations.length})`)
  if (!newViolations.length) {
    L.push('    none')
  } else {
    for (const [k, v] of newViolations.sort((a, b) => a[0].localeCompare(b[0]))) {
      const why = v.tableMissing ? '  [table absent from snapshot]' : ''
      L.push(`    ${k.padEnd(38)} ${v.sites.join(', ')}${why}`)
    }
  }
  L.push('')

  if (ageDays !== null && ageDays > STALE_AFTER_DAYS) {
    L.push('  ' + '!'.repeat(74))
    L.push(`  !! SNAPSHOT IS ${ageDays} DAYS OLD (threshold ${STALE_AFTER_DAYS}).`)
    L.push('  !! Re-export the live schema and commit it — see docs/schema/README.md.')
    L.push('  !! This is a WARNING, not a failure. A stale snapshot silently weakens every')
    L.push('  !! result above: the check is validating against a database that may not exist.')
    L.push('  ' + '!'.repeat(74))
    L.push('')
  }

  const pass = newViolations.length === 0
  L.push(`  RESULT: ${pass ? 'PASS' : 'FAIL'}`)
  L.push('')

  if (!pass) {
    L.push('  ' + '='.repeat(74))
    L.push('  BUILD FAILED — the code references columns the schema snapshot does not have.')
    L.push('')
    L.push('  Each column listed under NEW VIOLATIONS is one of two things:')
    L.push('')
    L.push('    1. A column that SHOULD exist but does not.')
    L.push('       Create it in the Supabase SQL editor, then re-export the snapshot and')
    L.push('       commit it (docs/schema/README.md has the query).')
    L.push('')
    L.push('    2. A code reference that is simply wrong — a typo, or a column that was')
    L.push('       renamed or removed. Fix or delete the reference.')
    L.push('')
    L.push('  Postgres rejects the ENTIRE statement when any named column is unknown, so')
    L.push('  each of these breaks a whole query at runtime, not just one field.')
    L.push('')
    L.push(`  Baselining a violation into ${ALLOWLIST} is a deliberate decision,`)
    L.push('  not a way to make the build green. That list may only shrink.')
    L.push('  ' + '='.repeat(74))
    L.push('')
  }

  console.log(L.join('\n'))
  process.exit(pass ? 0 : 1)
}

main()
