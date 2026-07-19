'use client'

import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// Controlled intro-video modal for the /investor page. Modeled on the homepage
// WatchStoryModal's mechanics (portal, X / Esc / backdrop close, scroll lock, play-on-open),
// but the window HUGS the video (no fixed aspect, no object-fit:fill) so a landscape or
// portrait source shows at its native ratio with no bars and no distortion.
//
// Teardown: when `open` goes false the component returns null, so the <video> node leaves the
// DOM and audio stops. requestClose() also pauses first, killing sound instantly on the click.

const IIM_CSS = `
.iim-scrim{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(10,30,61,0.78);animation:iimFade .18s ease-out;}
@supports (backdrop-filter: blur(2px)){.iim-scrim{backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);}}
.iim-window{position:relative;display:inline-flex;border-radius:16px;overflow:hidden;background:#000;border:1px solid rgba(197,183,131,0.35);box-shadow:0 30px 80px rgba(8,20,38,0.55);animation:iimIn .2s ease-out;font-family:var(--font-poppins),system-ui,sans-serif;}
.iim-video{display:block;width:auto;height:auto;max-width:min(90vw,960px);max-height:86vh;background:#000;}
.iim-close{position:absolute;top:12px;right:12px;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;background:rgba(10,30,61,0.78);border:1px solid rgba(197,183,131,0.55);padding:0;z-index:2;}
.iim-close:hover{background:#0A1E3D;}
.iim-close:focus-visible{outline:2px solid #C5B783;outline-offset:2px;}
@keyframes iimFade{from{opacity:0}to{opacity:1}}
@keyframes iimIn{from{opacity:0;transform:translateY(8px) scale(0.98)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion: reduce){.iim-scrim,.iim-window{animation:none}}
`

export default function InvestorIntroModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  const requestClose = useCallback(() => {
    videoRef.current?.pause() // kill audio immediately; the unmount below removes the node
    onClose()
  }, [onClose])

  // While open: play with sound (opening was a user gesture), focus the close button,
  // lock background scroll, and wire Esc. Cleanup restores scroll + removes the listener.
  useEffect(() => {
    if (!open) return
    videoRef.current?.play().catch(() => {})
    closeBtnRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        e.preventDefault()
        requestClose()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      document.body.style.overflow = prevOverflow
    }
  }, [open, requestClose])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <>
      <style dangerouslySetInnerHTML={{ __html: IIM_CSS }} />
      <div
        className="iim-scrim"
        onClick={(e) => {
          if (e.target === e.currentTarget) requestClose()
        }}
      >
        <div className="iim-window" role="dialog" aria-modal="true" aria-label="HavenQuest investor intro video">
          <video
            ref={videoRef}
            className="iim-video"
            src="/videos/investor-intro.mp4"
            controls
            playsInline
            preload="metadata"
          />
          <button ref={closeBtnRef} type="button" className="iim-close" aria-label="Close video" onClick={requestClose}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M6 6 L18 18 M18 6 L6 18" stroke="#C5B783" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </button>
        </div>
      </div>
    </>,
    document.body,
  )
}
