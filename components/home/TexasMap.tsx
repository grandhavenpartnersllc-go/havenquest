'use client'

import { HQ, SANS } from './theme'

export type MetroKey = 'dallas' | 'austin' | 'houston' | 'sanAntonio'

// Stylized positions (viewBox 0 0 640 660) — NOT pin-accurate (the city data has no
// lat/lng). DFW north-central, Austin center, San Antonio just below Austin, Houston
// to the southeast.
const METROS: { key: MetroKey; label: string; x: number; y: number }[] = [
  { key: 'dallas', label: 'Dallas–Fort Worth', x: 360, y: 206 },
  { key: 'houston', label: 'Houston', x: 452, y: 392 },
  { key: 'austin', label: 'Austin', x: 322, y: 372 },
  { key: 'sanAntonio', label: 'San Antonio', x: 280, y: 432 },
]

// Stylized Texas silhouette.
const TX_PATH =
  'M 196 40 L 300 40 L 300 152 L 362 166 L 420 150 L 470 172 L 506 150 L 542 178 ' +
  'L 542 252 L 526 298 L 506 302 L 506 356 ' +
  'C 468 402 424 442 366 478 C 336 498 314 522 300 558 ' +
  'C 282 508 244 482 224 448 C 196 460 180 452 168 470 ' +
  'C 150 452 138 452 132 470 C 104 402 74 360 44 300 ' +
  'L 176 238 L 196 150 Z'

export default function TexasMap({
  selected,
  onSelect,
}: {
  selected: MetroKey
  onSelect: (key: MetroKey) => void
}) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg viewBox="0 0 640 660" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }} aria-hidden>
        <defs>
          <linearGradient id="hq-tx-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={HQ.navy3} />
            <stop offset="55%" stopColor={HQ.navy2} />
            <stop offset="100%" stopColor={HQ.navy} />
          </linearGradient>
          <radialGradient id="hq-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={HQ.goldGlow} stopOpacity="0.9" />
            <stop offset="45%" stopColor={HQ.gold} stopOpacity="0.35" />
            <stop offset="100%" stopColor={HQ.gold} stopOpacity="0" />
          </radialGradient>
        </defs>

        <path d={TX_PATH} fill="url(#hq-tx-fill)" stroke="rgba(201,169,97,0.30)" strokeWidth="1.5" />

        {/* City-light glows */}
        {METROS.map((m) => {
          const isSel = m.key === selected
          return (
            <g key={m.key}>
              <circle cx={m.x} cy={m.y} r={isSel ? 40 : 30} fill="url(#hq-glow)" className={isSel ? undefined : 'hq-glow'} />
              <circle cx={m.x} cy={m.y} r={isSel ? 6 : 4} fill={isSel ? HQ.goldBright : HQ.gold} />
            </g>
          )
        })}
      </svg>

      {/* Chip labels — the actual interactive metro selector */}
      {METROS.map((m) => {
        const isSel = m.key === selected
        return (
          <button
            key={m.key}
            type="button"
            className="hq-metro-region"
            onClick={() => onSelect(m.key)}
            onMouseEnter={() => onSelect(m.key)}
            aria-pressed={isSel}
            aria-label={`Show ${m.label} communities`}
            style={{
              position: 'absolute',
              left: `${(m.x / 640) * 100}%`,
              top: `${(m.y / 660) * 100}%`,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '6px 12px',
              borderRadius: '999px',
              whiteSpace: 'nowrap',
              fontFamily: SANS,
              fontSize: '12.5px',
              fontWeight: isSel ? 600 : 500,
              color: isSel ? HQ.navy : HQ.offwhite,
              background: isSel ? HQ.gold : 'rgba(8,20,38,0.72)',
              border: `1px solid ${isSel ? HQ.goldBright : 'rgba(201,169,97,0.45)'}`,
              boxShadow: isSel ? '0 6px 20px rgba(201,169,97,0.4)' : '0 4px 14px rgba(8,20,38,0.35)',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
                background: isSel ? HQ.navy : HQ.gold,
              }}
            />
            {m.label}
          </button>
        )
      })}
    </div>
  )
}
