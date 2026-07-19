'use client'

import { useEffect, useRef, useState } from 'react'

// Brand palette for the gate (matches the site's navy/gold treatment).
const NAVY = '#0A1E3D'
const GOLD = '#C9A961'
const CREAM = '#F6F4EF'
const SANS = 'var(--font-poppins), system-ui, -apple-system, sans-serif'

export default function BetaGate() {
  const [granted, setGranted] = useState(true)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const boxRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    const requiredCode = process.env.NEXT_PUBLIC_BETA_ACCESS_CODE
    if (!requiredCode) {
      setGranted(true)
      setMounted(true)
      return
    }
    if (localStorage.getItem('hq_beta_access') === 'granted') {
      setGranted(true)
    } else {
      setGranted(false)
    }
    setMounted(true)
  }, [])

  if (!mounted || granted) return null

  // ---- Validation / remember behavior — UNCHANGED (do not alter). ----
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const requiredCode = process.env.NEXT_PUBLIC_BETA_ACCESS_CODE ?? ''
    if (code.trim() === requiredCode.trim()) {
      localStorage.setItem('hq_beta_access', 'granted')
      setGranted(true)
    } else {
      setError('Incorrect access code. Please try again.')
      setCode('')
    }
  }

  // ---- Four-box input: purely a way to populate the SAME `code` string the
  //      validator above checks. `code` stays a left-packed digit string; the
  //      submit button stays gated on code.length === 4, so the only submittable
  //      state is all four filled = the exact string handleSubmit compares. ----
  function setDigit(i: number, digit: string) {
    setError('')
    setCode((prev) => {
      const slots = [prev[0] ?? '', prev[1] ?? '', prev[2] ?? '', prev[3] ?? '']
      slots[i] = digit
      return slots.join('')
    })
  }

  function handleBoxChange(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const digit = e.target.value.replace(/\D/g, '').slice(-1)
    if (e.target.value !== '' && !digit) return // ignore non-digit keystrokes
    setDigit(i, digit)
    if (digit && i < 3) boxRefs.current[i + 1]?.focus()
  }

  function handleBoxKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !e.currentTarget.value && i > 0) {
      e.preventDefault()
      setDigit(i - 1, '')
      boxRefs.current[i - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const txt = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (!txt) return
    e.preventDefault()
    setError('')
    setCode(txt)
    boxRefs.current[Math.min(txt.length, 3)]?.focus()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: NAVY, zIndex: 9999, overflowY: 'auto', fontFamily: SANS }}>
      <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', boxSizing: 'border-box' }}>
        <div style={{ width: '100%', maxWidth: '452px', textAlign: 'center' }}>
          {/* Wordmark */}
          <p style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1, margin: '0 0 8px' }}>
            <span style={{ color: CREAM }}>Haven</span>
            <span style={{ color: GOLD }}>Quest</span>
          </p>

          {/* Tagline */}
          <p style={{ fontSize: '12.5px', color: 'rgba(246,244,239,0.55)', margin: '0 0 26px', lineHeight: 1.5 }}>
            We don&apos;t help you pick a house. We help you find your home.
          </p>

          {/* Eyebrow */}
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, margin: '0 0 12px' }}>
            Early Access
          </p>

          {/* Heading */}
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: CREAM, letterSpacing: '-0.01em', lineHeight: 1.25, margin: '0 0 16px' }}>
            Welcome — you&apos;re one of the first to see this.
          </h1>

          {/* Body */}
          <p style={{ fontSize: '14px', color: 'rgba(246,244,239,0.82)', lineHeight: 1.7, maxWidth: '40ch', margin: '0 auto' }}>
            HavenQuest is a <b style={{ color: CREAM, fontWeight: 600 }}>working model, still under active development.</b> Some
            parts are live and working; others are still being built, and a few things may not yet behave exactly as planned.
            That&apos;s expected at this stage — you&apos;re seeing the real thing as it comes together, not a finished product.
            Look around, try things out, and don&apos;t worry if something&apos;s a little rough.{' '}
            <b style={{ color: CREAM, fontWeight: 600 }}>Your honest reactions are exactly what help us shape it.</b>
          </p>

          {/* Divider */}
          <div style={{ width: '48px', height: '2px', borderRadius: '2px', backgroundColor: GOLD, opacity: 0.7, margin: '28px auto' }} />

          {/* Form — code label, four boxes, gold button */}
          <form onSubmit={handleSubmit}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(246,244,239,0.6)', margin: '0 0 14px' }}>
              Enter your 4-digit access code
            </label>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '18px' }}>
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  ref={(el) => {
                    boxRefs.current[i] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  aria-label={`Access code digit ${i + 1}`}
                  value={code[i] ?? ''}
                  onChange={(e) => handleBoxChange(i, e)}
                  onKeyDown={(e) => handleBoxKeyDown(i, e)}
                  onPaste={handlePaste}
                  maxLength={1}
                  autoFocus={i === 0}
                  style={{
                    width: '54px',
                    height: '62px',
                    border: '1.5px solid rgba(201,169,97,0.4)',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: CREAM,
                    fontSize: '26px',
                    fontWeight: 700,
                    textAlign: 'center',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: SANS,
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = GOLD
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201,169,97,0.28)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201,169,97,0.4)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              ))}
            </div>

            {error && (
              <p style={{ fontSize: '13px', color: '#E7B4A6', margin: '0 0 14px', textAlign: 'center' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={code.length !== 4}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '9px',
                border: 'none',
                backgroundColor: code.length === 4 ? GOLD : 'rgba(201,169,97,0.35)',
                color: NAVY,
                fontSize: '14px',
                fontWeight: 600,
                cursor: code.length === 4 ? 'pointer' : 'not-allowed',
                fontFamily: SANS,
                letterSpacing: '0.01em',
                transition: 'background-color 0.15s',
              }}
            >
              Enter the preview →
            </button>
          </form>

          {/* Footer */}
          <p style={{ fontSize: '11.5px', color: 'rgba(246,244,239,0.4)', lineHeight: 1.6, margin: '28px 0 0' }}>
            Access is by invitation while we&apos;re in beta. Questions? Reach Craig at{' '}
            <a href="mailto:craig.asbach@havenquest.co" style={{ color: 'rgba(201,169,97,0.85)', textDecoration: 'none' }}>
              craig.asbach@havenquest.co
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
