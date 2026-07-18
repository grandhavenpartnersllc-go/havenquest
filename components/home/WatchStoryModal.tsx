'use client'

import { type MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { HQ, SANS } from './theme'

// Homepage "Watch Our Story" video modal — Craig's locked July 14 design (Option 3).
//
// The trigger is the exact hero CTA <a> (label + styling unchanged from Hero.tsx); clicking it
// opens a portal overlay with the portrait (9:16) welcome video. Manual close only — X, Esc, or
// backdrop click; no loop, no auto-close (the video ends on its last frame).
//
// THE TRAP (taken literally): on close the player is UNMOUNTED, not hidden. We pause the video
// and reset currentTime = 0 first (kills audio immediately), then unmount (open -> false -> the
// portal, and with it the <video> node, leaves the DOM). A CSS-hidden <video> would keep the
// narration playing from nowhere.
//
// The overlay is a fixed/portal layer, so opening/closing never reflows the hero — the hero text
// does not move. Desktop: the window sits in the open space to the RIGHT of the hero text
// (Craig's locked placement). Narrow/mobile: it becomes a centered overlay (my responsive call —
// flag for Craig's live eyes).

const WS_CSS = `
.ws-scrim { position:fixed; inset:0; z-index:1100; display:flex; align-items:center; justify-content:center; padding:24px; background:rgba(10,30,61,0.72); animation:wsFade .18s ease-out; }
@supports (backdrop-filter: blur(2px)) { .ws-scrim { backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px); } }
.ws-scrim--closing { animation:wsFadeOut .18s ease-in forwards; }
@media (min-width:981px){ .ws-scrim { justify-content:flex-end; padding-right:clamp(48px,8vw,180px); } }
.ws-window { position:relative; aspect-ratio:9 / 16; height:min(80vh, calc((100vw - 48px) * 16 / 9)); max-height:80vh; border-radius:16px; overflow:hidden; background:#000; box-shadow:0 30px 80px rgba(8,20,38,0.55); animation:wsIn .2s ease-out; }
.ws-window--closing { animation:wsOut .18s ease-in forwards; }
.ws-video { display:block; width:100%; height:100%; object-fit:contain; background:#000; }
.ws-close { position:absolute; top:12px; right:12px; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; background:rgba(10,30,61,0.78); border:1px solid rgba(197,183,131,0.55); padding:0; }
.ws-close:hover { background:#0A1E3D; }
.ws-close:focus-visible { outline:2px solid #C5B783; outline-offset:2px; }
@keyframes wsFade { from{opacity:0} to{opacity:1} }
@keyframes wsFadeOut { from{opacity:1} to{opacity:0} }
@keyframes wsIn { from{opacity:0; transform:translateY(8px) scale(0.98)} to{opacity:1; transform:none} }
@keyframes wsOut { from{opacity:1; transform:none} to{opacity:0; transform:translateY(6px) scale(0.98)} }
@media (prefers-reduced-motion: reduce){ .ws-scrim,.ws-scrim--closing,.ws-window,.ws-window--closing{ animation:none } }
`

export default function WatchStoryModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const triggerRef = useRef<HTMLAnchorElement | null>(null)
  const windowRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const closeTimer = useRef<number | null>(null)

  const handleClose = useCallback(() => {
    const v = videoRef.current
    if (v) { v.pause(); try { v.currentTime = 0 } catch {} } // kill audio immediately (THE TRAP, step 1)
    setIsClosing(true) // play the exit animation while audio is already silenced
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      setIsOpen(false) // unmount → the <video> node leaves the DOM (THE TRAP, step 2)
      setIsClosing(false)
      triggerRef.current?.focus()
    }, 190)
  }, [])

  function handleOpen(e: ReactMouseEvent<HTMLAnchorElement>) {
    e.preventDefault() // trigger is an <a href="#"> placeholder; don't jump to top
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setIsClosing(false)
    setIsOpen(true)
  }

  // Clear any pending close timer if the component unmounts mid-animation.
  useEffect(() => () => { if (closeTimer.current) window.clearTimeout(closeTimer.current) }, [])

  // While fully open: start playback (the click was the user gesture, so audio is allowed),
  // move focus into the dialog, lock background scroll, and wire Esc + a focus trap.
  useEffect(() => {
    if (!isOpen || isClosing) return
    videoRef.current?.play().catch(() => {})
    closeBtnRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); handleClose(); return }
      if (e.key === 'Tab' && windowRef.current) {
        const nodes = windowRef.current.querySelectorAll<HTMLElement>('button, video, [href], [tabindex]:not([tabindex="-1"])')
        if (nodes.length === 0) return
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
    }
  }, [isOpen, isClosing, handleClose])

  return (
    <>
      {/* Trigger — byte-for-byte the hero CTA <a> (label + styling unchanged), now wired to open. */}
      <a
        ref={triggerRef}
        href="#"
        className="hq-btn-outline"
        aria-haspopup="dialog"
        onClick={handleOpen}
        style={{ borderRadius: '9px', padding: '15px 30px', textDecoration: 'none', fontFamily: SANS, fontSize: '15px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '9px', whiteSpace: 'nowrap' }}
      >
        <span
          aria-hidden
          style={{
            width: '22px', height: '22px', borderRadius: '50%', border: `1px solid ${HQ.gold}`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: HQ.gold,
          }}
        >
          &#9654;
        </span>
        Watch Our Story
      </a>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <>
          <style dangerouslySetInnerHTML={{ __html: WS_CSS }} />
          <div
            className={`ws-scrim${isClosing ? ' ws-scrim--closing' : ''}`}
            onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
          >
            <div
              ref={windowRef}
              className={`ws-window${isClosing ? ' ws-window--closing' : ''}`}
              role="dialog"
              aria-modal="true"
              aria-label="Watch Our Story video"
            >
              <video
                ref={videoRef}
                className="ws-video"
                src="/videos/home-welcome.mp4"
                controls
                playsInline
                preload="metadata"
              />
              <button
                ref={closeBtnRef}
                type="button"
                className="ws-close"
                aria-label="Close video"
                onClick={handleClose}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M6 6 L18 18 M18 6 L6 18" stroke="#C5B783" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </button>
            </div>
          </div>
        </>,
        document.body,
      )}
    </>
  )
}
