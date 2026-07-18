'use client'

// Ask Amy — Part 2 browse/read UI (glossary + curated Q&A).
//
// Part 1 was the shell: Amy's avatar/identity header, a first-person scope intro, a DISABLED
// free-form box ("Soon"), and a footer scope line. Part 2 adds real, educational content in
// two modes toggled at the top of the body — a Glossary and Common Questions — sourced from
// utils/glossary.ts. The free-form box STAYS disabled (guardrails are Phase 3); the header,
// intro, and footer are unchanged.
//
// This component is display-only: it imports the static content array and NOTHING else with
// side effects — no matching engine, no scorer, no Supabase, no activity logging. It renders
// inside MM3Discover's right-side <aside> (desktop) and bottom-sheet (mobile), so everything
// below the fixed header lives in one vertical scroll region that works in either mount.

import { useMemo, useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import {
  AMY_ENTRIES,
  CATEGORY_LABELS,
  GLOSSARY_CATEGORIES,
  QUESTION_CATEGORIES,
  type AmyCategory,
  type AmyKind,
} from '../../../utils/glossary'

const NAVY = '#0A1E3D'
const GOLD = '#C5B783'
const INK = '#1c2430'
const MUTED = '#6a7180'
const LINE = '#dcdad2'

type CategoryFilter = AmyCategory | 'all'

export default function AmyPanel({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<AmyKind>('term')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())

  const categoriesForMode = mode === 'term' ? GLOSSARY_CATEGORIES : QUESTION_CATEGORIES

  const visibleEntries = useMemo(() => {
    const q = query.trim().toLowerCase()
    return AMY_ENTRIES.filter(e => {
      if (e.kind !== mode) return false
      if (category !== 'all' && e.category !== category) return false
      if (q === '') return true
      // Search matches the label; for terms it also matches the abbreviation, so "utility
      // district" finds MUD. (Brief: "filters entries within the active mode by label text.")
      return e.label.toLowerCase().includes(q) || (e.abbr?.toLowerCase().includes(q) ?? false)
    })
  }, [mode, category, query])

  // Switching mode resets the category (Glossary vs Q&A tabs differ), clears the search, and
  // collapses any open entries so the new mode starts clean.
  function switchMode(next: AmyKind) {
    if (next === mode) return
    setMode(next)
    setCategory('all')
    setQuery('')
    setExpanded(new Set())
  }

  function toggleEntry(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const modeTabs: { key: AmyKind; label: string }[] = [
    { key: 'term', label: 'Glossary' },
    { key: 'question', label: 'Common Questions' },
  ]
  const categoryTabs: CategoryFilter[] = ['all', ...categoriesForMode]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Header — Amy's identity + close (distinct from the Refine drawer's DRAWER_META header) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '18px 20px 14px', borderBottom: '0.5px solid rgba(0,0,0,0.1)', flexShrink: 0 }}>
        <img
          src="/images/amy.jpg"
          alt="Amy"
          style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `1.5px solid ${GOLD}` }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: NAVY }}>Amy</p>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: MUTED }}>Your Texas relocation guide</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{ width: '30px', height: '30px', flexShrink: 0, borderRadius: '8px', border: '0.5px solid rgba(0,0,0,0.1)', background: '#fff', color: MUTED, fontSize: '15px', lineHeight: 1, cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>

      {/* Body — single vertical scroll region (safe in both the desktop aside and mobile sheet) */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '18px 20px 20px' }}>
        {/* First-person scope intro — Amy's voice (unchanged from Part 1) */}
        <p style={{ fontSize: '13px', color: INK, lineHeight: 1.6, margin: '0 0 12px' }}>
          Hi, I&rsquo;m Amy — your relocation guide. I can explain Texas terms and how the
          home-buying process works here, in plain language, right in this panel.
        </p>
        <p style={{ fontSize: '13px', color: INK, lineHeight: 1.6, margin: '0 0 18px' }}>
          For anything specific to your move — what you can afford, an offer, or anything legal —
          your Market Director is the right person, and I&rsquo;ll point you to them.
        </p>

        {/* Mode toggle — Glossary / Common Questions (segmented control) */}
        <div style={{ display: 'flex', background: '#F2F1EE', borderRadius: '9px', padding: '3px', gap: '3px', marginBottom: '12px' }}>
          {modeTabs.map(({ key, label }) => {
            const active = mode === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => switchMode(key)}
                aria-pressed={active}
                style={{
                  flex: 1, padding: '7px 8px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 600, fontFamily: 'inherit',
                  background: active ? '#fff' : 'transparent', color: active ? NAVY : MUTED,
                  boxShadow: active ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Search — filters the active mode by label (and abbr for terms) */}
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: MUTED, pointerEvents: 'none' }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={mode === 'term' ? 'Search terms…' : 'Search questions…'}
            aria-label={mode === 'term' ? 'Search glossary terms' : 'Search common questions'}
            style={{
              width: '100%', boxSizing: 'border-box', padding: '9px 12px 9px 32px',
              fontSize: '13px', fontFamily: 'inherit', color: INK,
              background: '#fff', border: `1px solid ${LINE}`, borderRadius: '10px',
            }}
          />
        </div>

        {/* Category tabs — wrap rather than scroll (portal forbids horizontal overflow) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          {categoryTabs.map(cat => {
            const active = category === cat
            const label = cat === 'all' ? 'All' : CATEGORY_LABELS[cat]
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                aria-pressed={active}
                style={{
                  padding: '5px 10px', borderRadius: '999px', cursor: 'pointer',
                  fontSize: '11px', fontWeight: 500, fontFamily: 'inherit',
                  border: `1px solid ${active ? NAVY : LINE}`,
                  background: active ? NAVY : '#fff', color: active ? '#fff' : MUTED,
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Entry list — expandable */}
        {visibleEntries.length === 0 ? (
          <p style={{ fontSize: '12.5px', color: MUTED, textAlign: 'center', padding: '18px 0', margin: 0 }}>
            No matches — try a different word or category.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {visibleEntries.map(e => {
              const open = expanded.has(e.id)
              return (
                <div key={e.id} style={{ border: `1px solid ${LINE}`, borderRadius: '10px', background: '#fff', overflow: 'hidden' }}>
                  <button
                    type="button"
                    onClick={() => toggleEntry(e.id)}
                    aria-expanded={open}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '11px 13px', background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left', fontFamily: 'inherit',
                    }}
                  >
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: NAVY, lineHeight: 1.35 }}>{e.label}</span>
                      {e.abbr && <span style={{ display: 'block', fontSize: '11px', color: MUTED, marginTop: '1px' }}>{e.abbr}</span>}
                    </span>
                    <ChevronDown
                      size={16}
                      style={{ flexShrink: 0, color: MUTED, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s' }}
                    />
                  </button>
                  {open && (
                    <div style={{ padding: '0 13px 13px' }}>
                      <p style={{ fontSize: '12.5px', color: INK, lineHeight: 1.6, margin: '0 0 10px' }}>{e.body}</p>
                      {e.fact && (
                        <div style={{ background: '#FAF9F5', borderLeft: `2px solid ${GOLD}`, borderRadius: '6px', padding: '9px 11px', marginBottom: e.handoff ? '10px' : 0 }}>
                          <p style={{ fontSize: '12px', color: INK, lineHeight: 1.55, margin: 0 }}>{e.fact}</p>
                        </div>
                      )}
                      {/* Handoff line — hidden when empty (only the "summers" question) */}
                      {e.handoff && (
                        <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: '9px' }}>
                          <p style={{ fontSize: '11.5px', color: MUTED, lineHeight: 1.55, margin: 0 }}>{e.handoff}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Free-form box — present but DISABLED ("Soon"); no live call wired (Phase 3). Kept as-is. */}
        <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
          <div style={{ position: 'relative', marginBottom: '8px' }}>
            <input
              type="text"
              disabled
              placeholder="Ask Amy anything…"
              style={{
                width: '100%', boxSizing: 'border-box', padding: '11px 62px 11px 13px',
                fontSize: '13px', fontFamily: 'inherit', color: MUTED,
                background: '#F7F7F5', border: `1px solid ${LINE}`, borderRadius: '10px',
                cursor: 'not-allowed',
              }}
            />
            <span
              style={{
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                fontSize: '10px', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase',
                color: NAVY, background: GOLD, borderRadius: '6px', padding: '3px 7px', pointerEvents: 'none',
              }}
            >
              Soon
            </span>
          </div>
          <p style={{ fontSize: '11px', color: MUTED, lineHeight: 1.5, margin: 0 }}>
            Free-form questions turn on once Amy&rsquo;s answer guardrails are in place.
          </p>
        </div>
      </div>

      {/* Footer scope line (unchanged from Part 1) */}
      <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', padding: '12px 20px', flexShrink: 0 }}>
        <p style={{ fontSize: '10.5px', color: MUTED, lineHeight: 1.5, margin: 0 }}>
          Amy shares general, educational info only. Your Market Director handles anything specific to your move.
        </p>
      </div>
    </div>
  )
}
