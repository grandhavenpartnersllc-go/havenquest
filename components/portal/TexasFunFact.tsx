'use client'

import { useState, useEffect, useRef } from 'react'
import { TEXAS_FACTS, type TexasFact } from '../../data/texasFacts'

function getRandomFact(exclude?: TexasFact): TexasFact {
  const pool = exclude
    ? TEXAS_FACTS.filter(f => f.fact !== exclude.fact)
    : TEXAS_FACTS
  return pool[Math.floor(Math.random() * pool.length)]
}

const CATEGORY_COLORS: Record<TexasFact['category'], { color: string; bg: string }> = {
  geography: { color: '#2e7d32', bg: '#f0faf4' },
  history:   { color: '#7B4F00', bg: '#FEF3C7' },
  culture:   { color: '#0076B6', bg: '#EBF5FB' },
  economy:   { color: '#4C1D95', bg: '#F5F3FF' },
  relocation:{ color: '#C5B783', bg: '#FDFAF2' },
  food:      { color: '#B45309', bg: '#FFF7ED' },
  weird:     { color: '#9D174D', bg: '#FDF2F8' },
}

export default function TexasFunFact() {
  const [open, setOpen] = useState(false)
  const [currentFact, setCurrentFact] = useState<TexasFact | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  function handleOpen() {
    setCurrentFact(getRandomFact())
    setOpen(true)
  }

  function handleAnother() {
    setCurrentFact(getRandomFact(currentFact ?? undefined))
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onMouseDown(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [open])

  const categoryStyle = currentFact ? CATEGORY_COLORS[currentFact.category] : null

  return (
    <div ref={popupRef} style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 200 }}>
      {/* Popup card */}
      {open && currentFact && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 10px)',
          right: 0,
          width: '320px',
          backgroundColor: '#ffffff',
          border: '1.5px solid #0A1E3D',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(10,30,61,0.18)',
          padding: '20px',
        }}>
          {/* Gold label */}
          <p style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#C5B783', margin: '0 0 12px',
          }}>
            ⭐ Lone Star Fact
          </p>

          {/* Fact text */}
          <p style={{
            fontSize: '14px', color: '#0A1E3D', lineHeight: 1.65,
            margin: '0 0 14px', fontWeight: 400,
          }}>
            {currentFact.fact}
          </p>

          {/* Category badge */}
          {categoryStyle && (
            <span style={{
              fontSize: '11px', fontWeight: 600,
              color: categoryStyle.color, backgroundColor: categoryStyle.bg,
              padding: '3px 10px', borderRadius: '20px',
              display: 'inline-block', marginBottom: '16px',
              textTransform: 'capitalize',
            }}>
              {currentFact.category}
            </span>
          )}

          {/* Bottom row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: '12px', borderTop: '1px solid #e2e6ea',
          }}>
            <button
              onClick={handleAnother}
              style={{
                background: 'none', border: 'none', padding: 0,
                fontSize: '13px', fontWeight: 600, color: '#0076B6',
                cursor: 'pointer',
              }}
            >
              Another one →
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none', border: 'none', padding: 0,
                fontSize: '13px', color: '#8a93a0', cursor: 'pointer',
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={open ? () => setOpen(false) : handleOpen}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 14px',
          backgroundColor: '#0A1E3D',
          color: '#C5B783',
          border: 'none',
          borderRadius: '20px',
          fontSize: '12px', fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 12px rgba(10,30,61,0.25)',
          whiteSpace: 'nowrap',
          letterSpacing: '0.01em',
        }}
      >
        ⭐ Texas Fun Fact
      </button>
    </div>
  )
}
