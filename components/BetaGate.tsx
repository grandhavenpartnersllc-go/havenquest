'use client'

import { useEffect, useState } from 'react'

export default function BetaGate() {
  const [granted, setGranted] = useState(true)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

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

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#0A1E3D',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 8px 48px rgba(0,0,0,0.4)',
      }}>
        {/* Logo */}
        <p style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.01em', textAlign: 'center' }}>
          <span style={{ color: '#0A1E3D' }}>Haven</span>
          <span style={{ color: '#0076B6' }}>Quest</span>
        </p>

        {/* Tagline */}
        <p style={{ fontSize: '13px', color: '#9A8E82', textAlign: 'center', margin: '0 0 20px', lineHeight: 1.5 }}>
          We don&apos;t help you pick a house. We help you find your home.
        </p>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '0 0 24px' }} />

        {/* Heading */}
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 8px', textAlign: 'center' }}>
          Beta Access Required
        </h1>
        <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', margin: '0 0 24px', lineHeight: 1.6 }}>
          HavenQuest is currently in private beta. Enter your access code to continue.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <input
            type="password"
            value={code}
            onChange={e => {
              setError('')
              setCode(e.target.value.replace(/\D/g, '').slice(0, 4))
            }}
            placeholder="••••"
            maxLength={4}
            autoFocus
            style={{
              width: '140px',
              border: '2px solid #E5E7EB',
              borderRadius: '10px',
              padding: '14px',
              fontSize: '28px',
              fontWeight: 700,
              color: '#0A1E3D',
              outline: 'none',
              textAlign: 'center',
              letterSpacing: '0.2em',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#0076B6' }}
            onBlur={e => { e.currentTarget.style.borderColor = '#E5E7EB' }}
          />

          {error && (
            <p style={{ fontSize: '13px', color: '#DC2626', margin: 0, textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={code.length !== 4}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: code.length === 4 ? '#0076B6' : '#93C5D8',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: code.length === 4 ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.15s',
              letterSpacing: '0.01em',
            }}
          >
            Enter
          </button>
        </form>
      </div>

      {/* Footer */}
      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '24px', textAlign: 'center' }}>
        © 2026 HavenQuest · A Grand Haven Partners Company
      </p>
    </div>
  )
}
