'use client'

// End-of-demo popup — fired by MM3's "Schedule your consultation" CTA during the interim in
// which real MM4 scheduling is replaced by this "you've reached the end of the demo" moment.
// Copy + visual design are LOCKED (approved mockup havenquest_mm4_endofdemo_mockup.html).
//
// Mirrors the FinZone "How is this calculated?" popup (portal + navy scrim + Esc + backdrop
// close + unmount-on-close). Adds focus trap, body-scroll lock, and focus return to the CTA
// (captured from document.activeElement at open, since either the desktop or mobile CTA can be
// the trigger). Display-only: no scorer, no persistence, no navigation.

import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

const EOD_CSS = `
.eod-scrim { position:fixed; inset:0; z-index:1200; display:flex; align-items:center; justify-content:center; padding:24px; background:rgba(10,30,61,.6); animation:eodFade .18s ease-out; }
@supports (backdrop-filter: blur(2px)) { .eod-scrim { backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); } }
.eod-card { position:relative; width:100%; max-width:544px; max-height:calc(100vh - 48px); overflow-y:auto; background:#FCFAF6; border-radius:22px; padding:52px 52px 44px; box-shadow:0 4px 14px rgba(10,30,61,.10), 0 26px 64px rgba(10,30,61,.24); animation:eodIn .2s ease-out; outline:none; font-family:var(--font-poppins), system-ui, -apple-system, sans-serif; }
@media (max-width:560px){ .eod-card { border-radius:18px; padding:38px 26px 32px; } }
.eod-eyebrow { font-size:11px; letter-spacing:.22em; text-transform:uppercase; color:#a48f4e; font-weight:600; margin:0 0 14px; }
.eod-headline { font-size:27px; line-height:1.22; color:#0A1E3D; font-weight:600; margin:0 0 14px; }
@media (max-width:560px){ .eod-headline { font-size:23px; } }
.eod-lede { font-size:15.5px; line-height:1.6; color:#5c6a80; margin:0 0 22px; }
.eod-rule { height:1px; border:0; background:linear-gradient(90deg, #C5B783, rgba(197,183,131,0)); margin:0 0 24px; }
.eod-item { position:relative; padding-left:18px; margin:0 0 18px; }
.eod-item::before { content:''; position:absolute; left:0; top:2px; bottom:2px; width:3px; border-radius:2px; background:#C5B783; }
.eod-item-label { font-size:15px; font-weight:600; color:#0A1E3D; margin:0 0 3px; }
.eod-item-desc { font-size:14px; line-height:1.55; color:#5c6a80; margin:0; }
.eod-closing { font-size:14px; font-style:italic; line-height:1.6; color:rgba(10,30,61,.85); margin:24px 0 26px; }
.eod-actions { display:flex; justify-content:flex-end; }
@media (max-width:560px){ .eod-actions { justify-content:stretch; } }
.eod-btn { background:#0A1E3D; color:#C5B783; border:0; border-radius:9px; padding:13px 30px; font-size:14.5px; font-weight:600; font-family:inherit; cursor:pointer; transition:transform .12s ease, background .12s ease; }
.eod-btn:hover { transform:translateY(-1px); background:#16305a; }
.eod-btn:focus-visible { outline:2px solid #C5B783; outline-offset:2px; }
@media (max-width:560px){ .eod-btn { width:100%; } }
@keyframes eodFade { from{opacity:0} to{opacity:1} }
@keyframes eodIn { from{opacity:0; transform:translateY(10px) scale(.985)} to{opacity:1; transform:none} }
@media (prefers-reduced-motion: reduce){ .eod-scrim,.eod-card{ animation:none } }
`

export default function EndOfDemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose })
  const headlineId = useId()

  useEffect(() => {
    if (!open) return
    // Remember the CTA that opened this so focus can return to it on close.
    returnFocusRef.current = (document.activeElement as HTMLElement) ?? null
    cardRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); onCloseRef.current(); return }
      if (e.key === 'Tab' && cardRef.current) {
        const nodes = cardRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        if (nodes.length === 0) { e.preventDefault(); return }
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      document.body.style.overflow = prevOverflow
      returnFocusRef.current?.focus?.()
    }
  }, [open])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <>
      <style dangerouslySetInnerHTML={{ __html: EOD_CSS }} />
      <div
        className="eod-scrim"
        onClick={(e) => { if (e.target === e.currentTarget) onCloseRef.current() }}
      >
        <div
          ref={cardRef}
          className="eod-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby={headlineId}
          tabIndex={-1}
        >
          <p className="eod-eyebrow">HavenQuest</p>
          <h2 className="eod-headline" id={headlineId}>You&rsquo;ve reached the end of the demo — for now.</h2>
          <p className="eod-lede">This is the moment where HavenQuest goes from <em>exploring</em> to real. Here&rsquo;s what happens next:</p>
          <hr className="eod-rule" />

          <div className="eod-item">
            <p className="eod-item-label">Meet your Market Director</p>
            <p className="eod-item-desc">A local expert who knows the communities on your shortlist and personally guides the rest of your move.</p>
          </div>
          <div className="eod-item">
            <p className="eod-item-label">Your relocation portal launches</p>
            <p className="eod-item-desc">A private space built around your family, your budget, and your top matches — your whole move, in one place.</p>
          </div>
          <div className="eod-item">
            <p className="eod-item-label">We map the path to the keys</p>
            <p className="eod-item-desc">From your final decision to move-in day, with a guide beside you the whole way.</p>
          </div>

          <p className="eod-closing">We&rsquo;re building this next chapter right now. Thanks for exploring HavenQuest — the best is yet to come.</p>

          <div className="eod-actions">
            <button type="button" className="eod-btn" onClick={() => onCloseRef.current()}>Got it</button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}
