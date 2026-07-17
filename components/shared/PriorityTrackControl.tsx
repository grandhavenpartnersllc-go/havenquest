'use client'

import { useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'

// Shared track-and-ball priority control. Extracted verbatim from MM3Discover's inline
// implementation (Brief C CP1) so the Discovery Intake and the MM3 Lifestyle drawer use
// one control. PRESENTATIONAL ONLY: it owns drag/tap + cap/overflow computation, and emits
// the final tier via onAssign. It knows nothing about sandbox_profile, portal sessions,
// quiz sessions, or debounced saves — the caller owns bucket state and persistence.

export interface PriorityTrackItem {
  key: string
  label: string
  Icon: LucideIcon
  whatItIs?: string
  howItCounts?: string
}

interface PriorityTrackControlProps {
  items: PriorityTrackItem[]
  /** Current tier index (0..3) per item key, derived by the caller from its buckets. */
  tierOf: Record<string, number>
  /** Length-4 caps; use Infinity for uncapped. Overflow cascades DOWN to the first tier with room. */
  caps: number[]
  /** Length-4 tier display names, highest leftmost. */
  tierLabels: string[]
  /** Emits the FINAL tier (0..3) after caps/overflow. Caller updates its buckets + persists. */
  onAssign: (key: string, targetTier: number) => void
  /** Desktop shows the what-it-is / how-it-counts hover; mobile shows a plain label. */
  isMobile?: boolean
}

// Carried so the control is self-contained on surfaces that do not already define a tooltip
// style (the Discovery Intake). Injected as a raw <style> — the same workaround Slider.tsx
// uses — because globals.css is shared with the homepage/portal and stays untouched.
const HELP_CSS = `
.ptc-help { position: relative; border-bottom: 1px dotted #a9a69c; cursor: help; }
.ptc-help-tip { position: absolute; left: 0; top: calc(100% + 7px); width: 220px; background: #0A1E3D; color: #fff; font-size: 11px; font-weight: 400; line-height: 1.5; padding: 9px 11px; border-radius: 9px; box-shadow: 0 8px 20px rgba(10,30,61,0.28); opacity: 0; visibility: hidden; transform: translateY(-3px); transition: opacity 0.15s, transform 0.15s; z-index: 40; pointer-events: none; }
.ptc-help:hover .ptc-help-tip { opacity: 1; visibility: visible; transform: none; }
`

function ballStyle(idx: number): React.CSSProperties {
  if (idx === 0) return { background: '#C5B783', border: '2px solid #a48f4e' }
  if (idx === 1) return { background: '#0076B6', border: '2px solid #005e91' }
  if (idx === 2) return { background: '#c9d3df', border: '2px solid #9aa7b8' }
  return { background: '#fff', border: '2px dashed #c3c0b6' }
}

export default function PriorityTrackControl({
  items, tierOf, caps, tierLabels, onAssign, isMobile,
}: PriorityTrackControlProps) {
  const [flashTier, setFlashTier] = useState<number | null>(null)
  const [dragBall, setDragBall] = useState<{ key: string; x: number } | null>(null)
  const dragRef = useRef<{ key: string; trackEl: HTMLElement } | null>(null)

  // Cap enforcement with cascade-down overflow — byte-identical to MM3's retired
  // setPriorityTier (Brief C CP1). Emits the final tier; the caller applies + persists.
  function commit(key: string, band: number) {
    const curIdx = tierOf[key] ?? 3
    const counts = [0, 1, 2, 3].map(i => items.filter(it => (tierOf[it.key] ?? 3) === i).length)
    const aimed = Math.max(0, Math.min(3, band))
    let target = aimed
    let guard = 0
    while (caps[target] !== Infinity && (counts[target] - (curIdx === target ? 1 : 0)) >= caps[target] && guard < 3) {
      target += 1
      guard += 1
    }
    if (target > 3) target = 3
    if (target !== aimed) {
      setFlashTier(aimed)
      setTimeout(() => setFlashTier(null), 700)
    }
    onAssign(key, target)
  }

  function bandFromEvent(trackEl: HTMLElement, clientX: number): number {
    const rect = trackEl.getBoundingClientRect()
    const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    return Math.min(3, Math.floor(x * 4))
  }
  function onBallDown(e: React.PointerEvent, key: string) {
    e.stopPropagation()
    const trackEl = (e.currentTarget as HTMLElement).parentElement as HTMLElement
    dragRef.current = { key, trackEl }
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId) } catch {}
    const rect = trackEl.getBoundingClientRect()
    setDragBall({ key, x: Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)) })
  }
  function onBallMove(e: React.PointerEvent) {
    const d = dragRef.current
    if (!d) return
    const rect = d.trackEl.getBoundingClientRect()
    setDragBall({ key: d.key, x: Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)) })
  }
  function onBallUp(e: React.PointerEvent) {
    const d = dragRef.current
    if (!d) return
    const band = bandFromEvent(d.trackEl, e.clientX)
    dragRef.current = null
    setDragBall(null)
    commit(d.key, band)
  }
  function onTrackTap(e: React.PointerEvent, key: string) {
    // Fires only when the pointer lands on the track itself (the ball stops propagation).
    commit(key, bandFromEvent(e.currentTarget as HTMLElement, e.clientX))
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HELP_CSS }} />

      {/* Tier header — names only; the name flashes red on cascade overflow. */}
      <div style={{ display: 'grid', gridTemplateColumns: '116px 1fr', alignItems: 'end', marginBottom: '6px' }}>
        <div />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {tierLabels.map((label, i) => {
            const flashing = flashTier === i
            return (
              <div key={label} style={{ textAlign: 'center', fontSize: '9px', fontWeight: 600, color: flashing ? '#b5482f' : '#86868b', lineHeight: 1.15, padding: '0 2px', transition: 'color 0.2s' }}>
                {label}
              </div>
            )
          })}
        </div>
      </div>

      {/* One track-and-ball per item. */}
      {items.map(({ key, label, Icon, whatItIs, howItCounts }) => {
        const tierIdx = tierOf[key] ?? 3
        const dragging = dragBall?.key === key
        const leftPct = dragging ? dragBall!.x * 100 : tierIdx * 25 + 12.5
        return (
          <div key={key} style={{ display: 'grid', gridTemplateColumns: '116px 1fr', alignItems: 'center', margin: '9px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', paddingRight: '8px', color: '#1c2430', minWidth: 0 }}>
              <Icon size={14} style={{ flexShrink: 0 }} />
              {isMobile || !whatItIs ? (
                <span style={{ fontSize: '11px', fontWeight: 500, lineHeight: 1.2 }}>{label}</span>
              ) : (
                <span className="ptc-help" style={{ fontSize: '11px', fontWeight: 500, lineHeight: 1.2 }}>
                  {label}
                  <span className="ptc-help-tip">
                    <b>{label}</b> — {whatItIs}
                    <span style={{ display: 'block', marginTop: '5px', opacity: 0.85 }}>How it counts: {howItCounts}</span>
                  </span>
                </span>
              )}
            </div>
            <div
              onPointerDown={(e) => onTrackTap(e, key)}
              style={{ position: 'relative', height: '34px', borderRadius: '9px', background: '#EFEEE9', border: '1px solid #dcdad2', touchAction: 'none', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '0%', width: '25%', background: 'rgba(197,183,131,0.14)', borderRight: '1px dashed #dcdad2' }} />
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '25%', width: '25%', background: 'rgba(0,118,182,0.07)', borderRight: '1px dashed #dcdad2' }} />
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '25%', borderRight: '1px dashed #dcdad2' }} />
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '75%', width: '25%', background: 'repeating-linear-gradient(45deg,transparent,transparent 5px,rgba(0,0,0,0.03) 5px,rgba(0,0,0,0.03) 10px)' }} />
              <div
                onPointerDown={(e) => onBallDown(e, key)}
                onPointerMove={onBallMove}
                onPointerUp={onBallUp}
                aria-label={`${label}: ${tierLabels[tierIdx]}`}
                style={{
                  position: 'absolute', top: '50%', left: `${leftPct}%`, width: '22px', height: '22px',
                  marginTop: '-11px', marginLeft: '-11px', borderRadius: '50%',
                  ...ballStyle(tierIdx),
                  boxShadow: dragging ? '0 3px 8px rgba(0,0,0,0.28)' : '0 1px 3px rgba(0,0,0,0.18)',
                  transition: dragging ? 'none' : 'left 0.18s cubic-bezier(0.34,1.4,0.5,1), background 0.18s, border-color 0.18s',
                  cursor: dragging ? 'grabbing' : 'grab', touchAction: 'none',
                }}
              />
            </div>
          </div>
        )
      })}
    </>
  )
}
