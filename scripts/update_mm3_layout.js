'use strict'
const fs = require('fs')
const path = require('path')

// ── page.tsx: fix initialMetro to default to Austin ──
const PAGE = path.resolve(__dirname, '../app/portal/mm3/page.tsx')
let pageSrc = fs.readFileSync(PAGE, 'utf8')
pageSrc = pageSrc.replace(
  `  let initialMetro: string | undefined\n  if (hqPath === 'explore') {\n    initialMetro = 'State'\n  } else {\n    const topMetro = matches[0]?.location.metroUsed ?? ''\n    initialMetro = ['Dallas', 'Houston', 'San Antonio', 'Austin'].find(v => topMetro.includes(v))\n  }`,
  `  let initialMetro: string\n  if (hqPath === 'explore') {\n    initialMetro = 'State'\n  } else {\n    const topMetro = matches[0]?.location.metroUsed ?? ''\n    initialMetro = ['Dallas', 'Houston', 'San Antonio', 'Austin'].find(v => topMetro.includes(v)) ?? 'Austin'\n  }`
)
fs.writeFileSync(PAGE, pageSrc)
console.log('✓ page.tsx: initialMetro defaults to Austin')

// ── MM3Discover.tsx ──
const MM3 = path.resolve(__dirname, '../components/portal/milemarkers/MM3Discover.tsx')
let src = fs.readFileSync(MM3, 'utf8')
const orig = src

function requireReplace(label, old, next) {
  if (!src.includes(old)) {
    console.error(`✗ FAILED [${label}]: pattern not found`)
    process.exit(1)
  }
  src = src.replace(old, next)
  console.log(`✓ ${label}`)
}

// 1. BUG 2: default metro
requireReplace('BUG 2: selectedMetro default → Austin',
  `useState(initialMetro ?? 'State')`,
  `useState(initialMetro ?? 'Austin')`)

// 2. Remove origin debug console.log
requireReplace('Remove origin debug log',
  `      console.log('[OriginDebug] origin_city:', data.origin_city, 'origin_zip:', data.origin_zip)\n\n`,
  `\n`)

// 3. Header renames — multi-line headings use content-line matching
requireReplace("Header: Your direction → Your Direction",
  `                Your direction\n`,
  `                Your Direction\n`)
requireReplace("Header: What matters most → What Matters Most",
  `                  What matters most\n`,
  `                  What Matters Most\n`)
requireReplace("Header: Buying power → Your Buying Power",
  `                Buying power\n`,
  `                Your Buying Power\n`)
requireReplace("Header: Your personality → Your Personality",
  `                  Your personality\n`,
  `                  Your Personality\n`)
// Single-line headings
requireReplace("Header: Your communities → Your Communities",
  `>Your communities<`,
  `>Your Communities<`)
requireReplace("Header: Your priorities → Your Lifestyle",
  `>Your priorities<`,
  `>Your Lifestyle<`)
requireReplace("Header: Your numbers → Your Financials",
  `>Your numbers<`,
  `>Your Financials<`)

// 4. Pin slot contrast (Layout Change 5)
requireReplace('Pin slot border contrast',
  `border: '0.5px dashed rgba(255,255,255,0.14)', borderRadius: '8px', padding: '10px 12px'`,
  `border: '0.5px dashed rgba(197,183,131,0.3)', borderRadius: '8px', padding: '10px 12px'`)
requireReplace('Pin slot text contrast',
  `fontSize: '10px', color: 'rgba(255,255,255,0.22)', fontStyle: 'italic', margin: 0`,
  `fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', margin: 0`)

// 5. Right panel: make flex column
requireReplace('Right panel: flex column',
  `{/* Right: preview card — 50/50 square photo + info */}\n              <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>`,
  `{/* Right: preview card + Your Lifestyle */}\n              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>`)
requireReplace('Preview card: remove height 100%',
  `<div style={{ display: 'flex', height: '100%', minHeight: '220px' }}>`,
  `<div style={{ display: 'flex', minHeight: '220px' }}>`)

// 6. Comparison chart: remove logs, always show, use pinnedCols
requireReplace('Comparison chart: always visible guard',
  `              console.log('[ComparisonChart] pinnedCities:', pinnedCities)\n              console.log('[ComparisonChart] originCity resolved to:', originCity)\n              console.log('[ComparisonChart] should render:', pinnedCities.length > 0 && !!originCity)\n\n              if (pinnedCities.length === 0 || !originCity) return null\n\n              const originData = lookupOriginCity(originCity)\n              if (!originData) {\n                console.log('[ComparisonChart] no lookup match for:', originCity)\n                return null\n              }\n\n              const pinnedMatches = pinnedCities.map(id => getAllCities().find(c => c.id === id)).filter(Boolean)`,
  `              if (!originCity) return null\n\n              const originData = lookupOriginCity(originCity)\n              if (!originData) return null\n\n              const col0 = pinnedCities[0] ? (getAllCities().find(c => c.id === pinnedCities[0]) ?? null) : null\n              const col1 = pinnedCities[1] ? (getAllCities().find(c => c.id === pinnedCities[1]) ?? null) : null\n              const col2 = pinnedCities[2] ? (getAllCities().find(c => c.id === pinnedCities[2]) ?? null) : null\n              const pinnedCols = [col0, col1, col2]\n              const pinnedMatches = pinnedCols.filter((c): c is NonNullable<typeof c> => c !== null)`)

// 7. chartRows txVals → pinnedCols
requireReplace('chartRows: COL Index',
  `                  txVals: pinnedMatches.map(c => String(txColIndex(c!.metroUsed))),\n                  better: (txVal) => parseInt(txVal) < originData.colIndex,`,
  `                  txVals: pinnedCols.map(c => c ? String(txColIndex(c.metroUsed)) : '—'),\n                  better: (txVal) => txVal !== '—' && parseInt(txVal) < originData.colIndex,`)
requireReplace('chartRows: Median Home',
  `                  txVals: pinnedMatches.map(c => fmtK(c!.housing.medianHomePrice)),\n                  better: (_txVal, idx) => pinnedMatches[idx] ? pinnedMatches[idx]!.housing.medianHomePrice < parseHomePrice(originData.medianHome) : false,`,
  `                  txVals: pinnedCols.map(c => c ? fmtK(c.housing.medianHomePrice) : '—'),\n                  better: (_txVal, idx) => !!pinnedCols[idx] && pinnedCols[idx]!.housing.medianHomePrice < parseHomePrice(originData.medianHome),`)
requireReplace('chartRows: Property Tax',
  `                  txVals: pinnedMatches.map(c => txPropertyTax(c!.metroUsed)),`,
  `                  txVals: pinnedCols.map(c => c ? txPropertyTax(c.metroUsed) : '—'),`)
requireReplace('chartRows: State Inc Tax',
  `                  txVals: pinnedMatches.map(() => 'None (TX)'),`,
  `                  txVals: pinnedCols.map(c => c ? 'None (TX)' : '—'),`)
requireReplace('chartRows: Schools',
  `                  txVals: pinnedMatches.map(c => c!.school?.teaRating ?? '—'),`,
  `                  txVals: pinnedCols.map(c => c ? (c.school?.teaRating ?? '—') : '—'),`)
requireReplace('chartRows: Crime/Safety',
  `                  txVals: pinnedMatches.map(c => txSafety(c!.scores.safety)),`,
  `                  txVals: pinnedCols.map(c => c ? txSafety(c.scores.safety) : '—'),`)
requireReplace('chartRows: Job Market',
  `                  txVals: pinnedMatches.map(c => txJobMarket(c!.metroUsed)),`,
  `                  txVals: pinnedCols.map(c => c ? txJobMarket(c.metroUsed) : '—'),`)
requireReplace('chartRows: Climate',
  `                  txVals: pinnedMatches.map(c => txClimateV2(c!.metroUsed)),`,
  `                  txVals: pinnedCols.map(c => c ? txClimateV2(c.metroUsed) : '—'),`)

// 8. Table headers: placeholder for empty cols
requireReplace('Table headers: placeholder for empty cols',
  `                          {pinnedMatches.map(c => (\n                            <th key={c!.id} style={{ fontSize: '9px', color: '#C5B783', padding: '4px 6px', textAlign: 'right', fontWeight: 500, whiteSpace: 'nowrap' }}>\n                              {c!.name}\n                            </th>\n                          ))}`,
  `                          {pinnedCols.map((c, i) => (\n                            <th key={i} style={{ fontSize: '9px', color: c ? '#C5B783' : 'rgba(255,255,255,0.2)', padding: '4px 6px', textAlign: 'right', fontWeight: 500, whiteSpace: 'nowrap' }}>\n                              {c ? c.name : 'Pin a city'}\n                            </th>\n                          ))}`)

// 9. tbody: handle empty placeholder cells
requireReplace('tbody: handle empty cols',
  `                            {row.txVals.map((val, ci) => {\n                              const isBetter = row.alwaysGreen === true || (row.better ? row.better(val, ci) : false)\n                              return (\n                                <td key={ci} style={{\n                                  fontSize: '10px',\n                                  color: isBetter ? '#48c78e' : 'rgba(255,255,255,0.7)',\n                                  fontWeight: isBetter ? 500 : 400,\n                                  padding: '5px 6px',\n                                  textAlign: 'right',\n                                  whiteSpace: 'nowrap',\n                                }}>\n                                  {isBetter && row.prefix ? \`\${row.prefix} \` : ''}{val}\n                                </td>\n                              )\n                            })}`,
  `                            {row.txVals.map((val, ci) => {\n                              const isEmpty = val === '—' && !pinnedCols[ci]\n                              const isBetter = !isEmpty && (row.alwaysGreen === true || (row.better ? row.better(val, ci) : false))\n                              return (\n                                <td key={ci} style={{\n                                  fontSize: '10px',\n                                  color: isEmpty ? 'rgba(255,255,255,0.2)' : isBetter ? '#48c78e' : 'rgba(255,255,255,0.7)',\n                                  fontWeight: isBetter ? 500 : 400,\n                                  padding: '5px 6px',\n                                  textAlign: 'right',\n                                  whiteSpace: 'nowrap',\n                                }}>\n                                  {isBetter && row.prefix && !isEmpty ? \`\${row.prefix} \` : ''}{val}\n                                </td>\n                              )\n                            })}`)

// 10. BIG STRUCTURAL CHANGE:
//     Move Lifestyle (priorities + personality) into right panel, below preview card
//     Replace lower 2-col grid with full-width Financials panel

const OLD_LOWER = `                )}
              </div>
            </div>
          </div>

          {/* Lower 2-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'stretch' }}>

            {/* PRIORITIES PANEL */}
            <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden', padding: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 500, color: '#0A1E3D', margin: '0 0 2px' }}>Your Lifestyle</p>
              <p style={{ fontSize: '10px', color: '#888', margin: '0 0 8px' }}>Click to move between columns</p>

              <p style={{ fontSize: '10px', color: '#6B6A65', margin: '0 0 8px' }}>
                <span style={{ color: mustHaves.length >= 3 ? '#1a6b35' : undefined, fontWeight: mustHaves.length >= 3 ? 500 : undefined }}>
                  {mustHaves.length}/3 Must Haves{mustHaves.length >= 3 ? ' ✓' : ''}
                </span>
                {' · '}{niceToHaves.length} Important{' · '}{lessImportant.length} Nice
              </p>

              {mustHaveError && (
                <p style={{ fontSize: '10px', color: '#F5A623', fontStyle: 'italic', margin: '0 0 6px' }}>
                  Must Have is limited to 3. Move one first.
                </p>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0', margin: '0 -12px -12px' }}>
                {/* Must Have — warm tint */}
                <div style={{ background: '#FDFAF4', borderRight: '0.5px solid rgba(0,0,0,0.08)', padding: '10px 8px' }}>
                  <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em', color: '#8a6f00', textTransform: 'uppercase', margin: '0 0 2px' }}>Must have</p>
                  <p style={{ fontSize: '8px', color: '#aaa', margin: '0 0 8px' }}>Up to 3 · 3× weight</p>
                  {mustHaves.length === 0 && <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.22)', fontStyle: 'italic', margin: 0 }}>Empty</p>}
                  {mustHaves.map(key => {
                    const cat = DNA_CATEGORIES.find(c => c.key === key)!
                    return (
                      <div key={key} onClick={() => movePriority(key, 'down')}
                        style={{ background: 'rgba(197,183,131,0.15)', borderRadius: '4px', padding: '4px 6px', marginBottom: '3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: '3px', border: '0.5px solid rgba(197,183,131,0.3)' }}>
                        <span style={{ fontSize: '9px', color: '#5a4a00', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.icon} {cat.label}</span>
                        <span style={{ color: '#0076B6', fontSize: '9px', flexShrink: 0 }}>→</span>
                      </div>
                    )
                  })}
                </div>

                {/* Important to Me — neutral */}
                <div style={{ background: '#FAFAFA', borderRight: '0.5px solid rgba(0,0,0,0.08)', padding: '10px 8px' }}>
                  <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em', color: '#444', textTransform: 'uppercase', margin: '0 0 2px' }}>Important to me</p>
                  <p style={{ fontSize: '8px', color: '#aaa', margin: '0 0 8px' }}>Up to 5 · 2× weight</p>
                  {niceToHaves.length === 0 && <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.22)', fontStyle: 'italic', margin: 0 }}>Empty</p>}
                  {niceToHaves.map(key => {
                    const cat = DNA_CATEGORIES.find(c => c.key === key)!
                    return (
                      <div key={key} style={{ background: '#F0F0F0', borderRadius: '4px', padding: '3px 4px', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <button type="button" onClick={() => movePriority(key, 'up')}
                          style={{ color: '#0076B6', fontSize: '9px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 1px', lineHeight: 1, flexShrink: 0 }}>←</button>
                        <span style={{ flex: 1, fontSize: '9px', color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.icon} {cat.label}</span>
                        <button type="button" onClick={() => movePriority(key, 'down')}
                          style={{ color: '#0076B6', fontSize: '9px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 1px', lineHeight: 1, flexShrink: 0 }}>→</button>
                      </div>
                    )
                  })}
                </div>

                {/* Would Be Nice — lightest */}
                <div style={{ background: '#F7F7F7', padding: '10px 8px' }}>
                  <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em', color: '#666', textTransform: 'uppercase', margin: '0 0 2px' }}>Would be nice</p>
                  <p style={{ fontSize: '8px', color: '#aaa', margin: '0 0 8px' }}>1× weight</p>
                  {lessImportant.length === 0 && <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.22)', fontStyle: 'italic', margin: 0 }}>Empty</p>}
                  {lessImportant.map(key => {
                    const cat = DNA_CATEGORIES.find(c => c.key === key)!
                    return (
                      <div key={key} style={{ background: 'rgba(0,0,0,0.04)', borderRadius: '4px', padding: '3px 4px', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <button type="button" onClick={() => movePriority(key, 'up')}
                          style={{ color: '#0076B6', fontSize: '9px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 1px', lineHeight: 1, flexShrink: 0 }}>←</button>
                        <span style={{ flex: 1, fontSize: '9px', color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.icon} {cat.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Personality sliders */}
              <div style={{
                borderTop: '0.5px solid rgba(0,0,0,0.08)',
                padding: '12px 12px 4px',
                marginTop: '4px',
              }}>
                <p style={{
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: '#666',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}>
                  Your Personality
                </p>
                {([
                  { key: 'growthProfile', left: 'Established', right: 'Up-and-Coming' },
                  { key: 'lifestyleOrientation', left: 'Practical', right: 'Upscale & Aspirational' },
                  { key: 'environment', left: 'Urban', right: 'Rural' },
                  { key: 'pace', left: 'Relaxed', right: 'Fast-paced' },
                ] as const).map(({ key, left, right }) => (
                  <SliderRow
                    key={key}
                    leftLabel={left}
                    rightLabel={right}
                    value={personalityPreference[key]}
                    onChange={(v) => handlePersonalityChange(key, v)}
                  />
                ))}
              </div>
            </div>

            {/* NUMBERS PANEL */}
            <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden', padding: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 500, color: '#0A1E3D', margin: '0 0 2px' }}>Your Financials</p>
              <p style={{ fontSize: '10px', color: '#888', margin: '0 0 10px' }}>Adjust to update buying power live</p>`

const NEW_LOWER = `                )}

                {/* YOUR LIFESTYLE */}
                <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', padding: '12px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 500, color: '#0A1E3D', margin: '0 0 2px' }}>Your Lifestyle</p>
                  <p style={{ fontSize: '10px', color: '#888', margin: '0 0 8px' }}>Click to move between columns</p>

                  <p style={{ fontSize: '10px', color: '#6B6A65', margin: '0 0 8px' }}>
                    <span style={{ color: mustHaves.length >= 3 ? '#1a6b35' : undefined, fontWeight: mustHaves.length >= 3 ? 500 : undefined }}>
                      {mustHaves.length}/3 Must Haves{mustHaves.length >= 3 ? ' ✓' : ''}
                    </span>
                    {' · '}{niceToHaves.length} Important{' · '}{lessImportant.length} Nice
                  </p>

                  {mustHaveError && (
                    <p style={{ fontSize: '10px', color: '#F5A623', fontStyle: 'italic', margin: '0 0 6px' }}>
                      Must Have is limited to 3. Move one first.
                    </p>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0', margin: '0 -12px 0' }}>
                    {/* Must Have — warm tint */}
                    <div style={{ background: '#FDFAF4', borderRight: '0.5px solid rgba(0,0,0,0.08)', padding: '10px 8px' }}>
                      <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em', color: '#8a6f00', textTransform: 'uppercase', margin: '0 0 2px' }}>Must have</p>
                      <p style={{ fontSize: '8px', color: '#aaa', margin: '0 0 8px' }}>Up to 3 · 3× weight</p>
                      {mustHaves.length === 0 && <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.22)', fontStyle: 'italic', margin: 0 }}>Empty</p>}
                      {mustHaves.map(key => {
                        const cat = DNA_CATEGORIES.find(c => c.key === key)!
                        return (
                          <div key={key} onClick={() => movePriority(key, 'down')}
                            style={{ background: 'rgba(197,183,131,0.15)', borderRadius: '4px', padding: '4px 6px', marginBottom: '3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: '3px', border: '0.5px solid rgba(197,183,131,0.3)' }}>
                            <span style={{ fontSize: '9px', color: '#5a4a00', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.icon} {cat.label}</span>
                            <span style={{ color: '#0076B6', fontSize: '9px', flexShrink: 0 }}>→</span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Important to Me — neutral */}
                    <div style={{ background: '#FAFAFA', borderRight: '0.5px solid rgba(0,0,0,0.08)', padding: '10px 8px' }}>
                      <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em', color: '#444', textTransform: 'uppercase', margin: '0 0 2px' }}>Important to me</p>
                      <p style={{ fontSize: '8px', color: '#aaa', margin: '0 0 8px' }}>Up to 5 · 2× weight</p>
                      {niceToHaves.length === 0 && <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.22)', fontStyle: 'italic', margin: 0 }}>Empty</p>}
                      {niceToHaves.map(key => {
                        const cat = DNA_CATEGORIES.find(c => c.key === key)!
                        return (
                          <div key={key} style={{ background: '#F0F0F0', borderRadius: '4px', padding: '3px 4px', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <button type="button" onClick={() => movePriority(key, 'up')}
                              style={{ color: '#0076B6', fontSize: '9px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 1px', lineHeight: 1, flexShrink: 0 }}>←</button>
                            <span style={{ flex: 1, fontSize: '9px', color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.icon} {cat.label}</span>
                            <button type="button" onClick={() => movePriority(key, 'down')}
                              style={{ color: '#0076B6', fontSize: '9px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 1px', lineHeight: 1, flexShrink: 0 }}>→</button>
                          </div>
                        )
                      })}
                    </div>

                    {/* Would Be Nice — lightest */}
                    <div style={{ background: '#F7F7F7', padding: '10px 8px' }}>
                      <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em', color: '#666', textTransform: 'uppercase', margin: '0 0 2px' }}>Would be nice</p>
                      <p style={{ fontSize: '8px', color: '#aaa', margin: '0 0 8px' }}>1× weight</p>
                      {lessImportant.length === 0 && <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.22)', fontStyle: 'italic', margin: 0 }}>Empty</p>}
                      {lessImportant.map(key => {
                        const cat = DNA_CATEGORIES.find(c => c.key === key)!
                        return (
                          <div key={key} style={{ background: 'rgba(0,0,0,0.04)', borderRadius: '4px', padding: '3px 4px', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <button type="button" onClick={() => movePriority(key, 'up')}
                              style={{ color: '#0076B6', fontSize: '9px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 1px', lineHeight: 1, flexShrink: 0 }}>←</button>
                            <span style={{ flex: 1, fontSize: '9px', color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.icon} {cat.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Personality sliders */}
                  <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', padding: '12px 0 4px', marginTop: '4px' }}>
                    <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', color: '#666', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Your Personality
                    </p>
                    {([
                      { key: 'growthProfile', left: 'Established', right: 'Up-and-Coming' },
                      { key: 'lifestyleOrientation', left: 'Practical', right: 'Upscale & Aspirational' },
                      { key: 'environment', left: 'Urban', right: 'Rural' },
                      { key: 'pace', left: 'Relaxed', right: 'Fast-paced' },
                    ] as const).map(({ key, left, right }) => (
                      <SliderRow
                        key={key}
                        leftLabel={left}
                        rightLabel={right}
                        value={personalityPreference[key]}
                        onChange={(v) => handlePersonalityChange(key, v)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* YOUR FINANCIALS */}
          <div style={{ marginTop: '10px', background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden', padding: '12px' }}>
            <p style={{ fontSize: '12px', fontWeight: 500, color: '#0A1E3D', margin: '0 0 2px' }}>Your Financials</p>
            <p style={{ fontSize: '10px', color: '#888', margin: '0 0 10px' }}>Adjust to update buying power live</p>`

requireReplace('Structural: Lifestyle → right panel, Financials → below frame', OLD_LOWER, NEW_LOWER)

// 11. Remove the old lower-grid closing wrapper (now just closes the financials panel)
requireReplace('Remove lower grid wrapper',
  `\n          </div>{/* end lower 2-col grid */}`,
  ``)

console.log(`\n✓ All replacements complete (${src.length} chars)`)
fs.writeFileSync(MM3, src)
console.log('✓ MM3Discover.tsx written')
