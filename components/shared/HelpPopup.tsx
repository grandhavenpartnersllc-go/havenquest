'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Reusable "How this works" help popup (Brief INTAKE_THREE_CHANGES, CP3). A small trigger
// link (bordered "?" + label) opens a centred modal card over a scrim. Built generic — pass
// a `title` and a `body` node; future sections cost a paragraph of copy, not a new build.
//
// Rendered through a portal to <body> so it is a true full-viewport overlay, escaping the
// MM3 Lifestyle drawer's 404px overflow:hidden container (CP1 finding #6). Closes on the
// button, on scrim click, and on Esc; focus moves into the dialog on open and returns to the
// trigger on close; the card scrolls when it exceeds the viewport; respects
// prefers-reduced-motion. Styles are injected as a raw <style> (same workaround the shared
// control and Slider use) so the shared globals.css stays untouched.

const HELP_POPUP_CSS = `
.hq-help-trigger { display:inline-flex; align-items:center; gap:6px; background:none; border:0; padding:2px; margin:0; color:#0076B6; font-size:12px; font-weight:500; font-family:inherit; line-height:1.2; cursor:pointer; white-space:nowrap; }
.hq-help-trigger .hq-help-q { display:inline-flex; align-items:center; justify-content:center; width:15px; height:15px; border:1px solid #0076B6; border-radius:50%; font-size:10px; font-weight:700; line-height:1; flex-shrink:0; }
.hq-help-trigger:hover .hq-help-label { text-decoration:underline; }
.hq-help-trigger:focus-visible { outline:2px solid #0076B6; outline-offset:2px; border-radius:4px; }
.hq-help-scrim { position:fixed; inset:0; z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; background:rgba(8,20,38,0.5); }
.hq-help-card { position:relative; width:100%; max-width:500px; max-height:calc(100vh - 40px); overflow-y:auto; background:#fff; border-radius:14px; padding:24px 26px; box-shadow:0 20px 60px rgba(8,20,38,0.30); }
.hq-help-card:focus { outline:none; }
.hq-help-title { font-size:17px; font-weight:700; color:#081426; margin:0 0 12px; }
.hq-help-card p { font-size:13.5px; line-height:1.6; color:#3a4453; margin:0 0 12px; }
.hq-help-card ul { list-style:none; margin:0 0 12px; padding:0; }
.hq-help-card li { font-size:13.5px; line-height:1.55; color:#3a4453; margin:0 0 7px; }
.hq-help-card strong { color:#081426; font-weight:700; }
.hq-help-rule { border:0; border-top:1px solid #e8e6e0; margin:16px 0; }
.hq-help-gotit { margin-top:6px; background:#0076B6; color:#fff; border:0; border-radius:8px; padding:10px 22px; font-size:14px; font-weight:600; font-family:inherit; cursor:pointer; }
.hq-help-gotit:focus-visible { outline:2px solid #081426; outline-offset:2px; }
@media (prefers-reduced-motion: no-preference) {
  .hq-help-scrim { animation: hqHelpFade 0.16s ease-out; }
  .hq-help-card { animation: hqHelpIn 0.18s ease-out; }
}
@keyframes hqHelpFade { from { opacity:0; } to { opacity:1; } }
@keyframes hqHelpIn { from { opacity:0; transform:translateY(8px) scale(0.98); } to { opacity:1; transform:none; } }
`

interface HelpPopupProps {
  title: string
  body: React.ReactNode
  /** Trigger link text. Defaults to the CP3 copy. */
  linkLabel?: string
  /** Dismiss button text. Defaults to the CP3 copy. */
  buttonLabel?: string
}

export default function HelpPopup({ title, body, linkLabel = 'How this works', buttonLabel = 'Got it' }: HelpPopupProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const titleId = useId()

  // Portal target (document.body) only exists client-side; open is never true during SSR.
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!open) return
    const trigger = triggerRef.current
    dialogRef.current?.focus()
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        // Swallow so an underlying surface (e.g. an MM3 drawer) can't also react to Esc.
        e.stopPropagation()
        e.preventDefault()
        setOpen(false)
        return
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) { e.preventDefault(); return }
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      trigger?.focus()
    }
  }, [open])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HELP_POPUP_CSS }} />
      <button
        ref={triggerRef}
        type="button"
        className="hq-help-trigger"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <span className="hq-help-q" aria-hidden="true">?</span>
        <span className="hq-help-label">{linkLabel}</span>
      </button>

      {mounted && open && createPortal(
        <div
          className="hq-help-scrim"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div
            ref={dialogRef}
            className="hq-help-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
          >
            <h2 id={titleId} className="hq-help-title">{title}</h2>
            {body}
            <button type="button" className="hq-help-gotit" onClick={() => setOpen(false)}>
              {buttonLabel}
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
