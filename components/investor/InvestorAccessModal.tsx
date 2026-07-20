'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { formatPhone } from '../../utils/formatters'

// Investor Access request modal — two screens (request form → confirmation), mounted via portal.
// Modeled on InvestorIntroModal / WatchStoryModal mechanics (portal, scrim, Esc, backdrop click,
// scroll lock, unmount on close), plus a focus trap and first-field focus on open. Brand-faithful:
// navy #0A1E3D, gold #C5B783, Poppins — same visual language as the investor page / BetaGate.
//
// BRIEF 1 SCOPE: front-end only. On a valid submit we advance locally to the confirmation screen.
// No network, no Supabase, no Resend, no token yet — see the marked hook in handleSubmit. Brief 2
// wires POST /api/investor-interest (clone of realtor-interest): investor_interest row +
// crypto.randomUUID() token, Resend the tokenized link, visit tracking, "Keep me posted" opt-in.

const IAM_CSS = `
.iam-scrim{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(10,30,61,0.78);animation:iamFade .18s ease-out;font-family:var(--font-poppins),system-ui,sans-serif;}
@supports (backdrop-filter: blur(2px)){.iam-scrim{backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);}}
.iam-window{position:relative;width:100%;max-width:468px;max-height:88vh;overflow-y:auto;border-radius:16px;background:linear-gradient(180deg,#0f2648,#0A1E3D);border:1px solid rgba(197,183,131,0.30);box-shadow:0 30px 80px rgba(8,20,38,0.55);animation:iamIn .2s ease-out;color:#eaf0fb;}
.iam-close{position:absolute;top:12px;right:12px;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;background:rgba(10,30,61,0.6);border:1px solid rgba(197,183,131,0.45);padding:0;z-index:2;}
.iam-close:hover{background:#0A1E3D;border-color:rgba(197,183,131,0.7);}
.iam-close:focus-visible{outline:2px solid #C5B783;outline-offset:2px;}
.iam-body{padding:36px 30px 28px;}
.iam-eyebrow{font-size:11.5px;letter-spacing:.2em;text-transform:uppercase;font-weight:600;color:#a48f4e;margin:0 0 12px;}
.iam-h{font-size:24px;font-weight:600;letter-spacing:-0.01em;line-height:1.15;color:#fff;margin:0 0 12px;}
.iam-lead{font-size:13.5px;line-height:1.6;color:#b9c6df;font-weight:300;margin:0 0 20px;}
.iam-lead b{color:#f6f4ef;font-weight:500;}
.iam-fields{display:flex;flex-direction:column;gap:13px;}
.iam-label{display:block;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:rgba(246,244,239,0.62);}
.iam-input{width:100%;margin-top:6px;padding:11px 13px;border-radius:9px;border:1.5px solid rgba(197,183,131,0.35);background:rgba(255,255,255,0.04);color:#f6f4ef;font-size:14px;font-family:inherit;outline:none;box-sizing:border-box;transition:border-color .15s, box-shadow .15s;}
.iam-input::placeholder{color:rgba(246,244,239,0.35);}
.iam-input:focus{border-color:#C5B783;box-shadow:0 0 0 3px rgba(197,183,131,0.22);}
.iam-error{font-size:12.5px;color:#e7b4a6;margin:12px 0 0;}
.iam-btn{width:100%;margin-top:20px;padding:13px;border-radius:9px;border:none;background:#C5B783;color:#0A1E3D;font-size:14px;font-weight:600;font-family:inherit;letter-spacing:.01em;cursor:pointer;transition:background-color .15s;}
.iam-btn:hover{background:#d8ca9a;}
.iam-btn:focus-visible{outline:2px solid #C5B783;outline-offset:2px;}
.iam-micro{text-align:center;font-size:11.5px;color:rgba(246,244,239,0.5);margin:13px 0 0;font-style:italic;}
@keyframes iamFade{from{opacity:0}to{opacity:1}}
@keyframes iamIn{from{opacity:0;transform:translateY(8px) scale(0.98)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion: reduce){.iam-scrim,.iam-window{animation:none}}
`

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function InvestorAccessModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [screen, setScreen] = useState<'form' | 'sent'>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const windowRef = useRef<HTMLDivElement | null>(null)
  const firstFieldRef = useRef<HTMLInputElement | null>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  const isValid = name.trim() !== '' && EMAIL_RE.test(email.trim()) && phone.trim() !== ''

  const handleSubmit = async () => {
    if (!isValid || submitting) {
      if (!isValid) setError('Please enter your name, a valid email, and a phone number.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/investor-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim() }),
      })
      if (res.ok) {
        setScreen('sent')
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // On open: remember what to restore focus to, reset to a fresh form, focus the first field,
  // lock background scroll, and wire Esc + a focus trap. Cleanup restores scroll/focus + listener.
  useEffect(() => {
    if (!open) return
    restoreFocusRef.current = (document.activeElement as HTMLElement) ?? null
    setScreen('form')
    setName('')
    setEmail('')
    setPhone('')
    setError('')
    setSubmitting(false)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 0)

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'Tab' && windowRef.current) {
        const nodes = windowRef.current.querySelectorAll<HTMLElement>(
          'button, input, [href], [tabindex]:not([tabindex="-1"])',
        )
        if (nodes.length === 0) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey, true)

    return () => {
      document.removeEventListener('keydown', onKey, true)
      document.body.style.overflow = prevOverflow
      window.clearTimeout(focusTimer)
      restoreFocusRef.current?.focus?.()
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <>
      <style dangerouslySetInnerHTML={{ __html: IAM_CSS }} />
      <div
        className="iam-scrim"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div className="iam-window" ref={windowRef} role="dialog" aria-modal="true" aria-label="Investor Access">
          <button type="button" className="iam-close" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M6 6 L18 18 M18 6 L6 18" stroke="#C5B783" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </button>

          {screen === 'form' ? (
            <div className="iam-body">
              <p className="iam-eyebrow">Investor Access</p>
              <h2 className="iam-h">A look at where we&apos;re headed.</h2>
              <p className="iam-lead">
                HavenQuest is early — a working platform in private beta, proving the model in Austin before we expand
                across Texas&apos;s major metros. This is an honest look at where we are and what&apos;s next. Leave your
                details and I&apos;ll send you a private link to the full overview. If it resonates and you&apos;d like to
                talk, you can reach me directly from there. — Craig Asbach, Founder
              </p>

              <div className="iam-fields">
                <label className="iam-label">
                  Full name
                  <input
                    ref={firstFieldRef}
                    className="iam-input"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (error) setError('')
                    }}
                    autoComplete="name"
                    placeholder="Jane Investor"
                  />
                </label>
                <label className="iam-label">
                  Email
                  <input
                    className="iam-input"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError('')
                    }}
                    autoComplete="email"
                    placeholder="jane@example.com"
                  />
                </label>
                <label className="iam-label">
                  Phone
                  <input
                    className="iam-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(formatPhone(e.target.value))
                      if (error) setError('')
                    }}
                    autoComplete="tel"
                    placeholder="(555) 000-0000"
                  />
                </label>
              </div>

              {error && <p className="iam-error">{error}</p>}

              <button type="button" className="iam-btn" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Sending…' : 'Send me the private link'}
              </button>
              <p className="iam-micro">An overview and an open door — no obligation.</p>
            </div>
          ) : (
            <div className="iam-body">
              <h2 className="iam-h">Check your email.</h2>
              <p className="iam-lead">
                Thanks — a private link to the HavenQuest overview is on its way to <b>{email}</b>. Open it whenever
                you&apos;re ready. Talk soon. — Craig
              </p>
              <button type="button" className="iam-btn" onClick={onClose}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body,
  )
}
