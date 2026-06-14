'use client'

import { useState } from 'react'
import { createClient } from '../../../lib/supabase/client'

export default function MDLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError || !data.session) {
        setError(signInError?.message === 'Invalid login credentials'
          ? 'Incorrect email or password.'
          : signInError?.message ?? 'Unable to sign in.')
        return
      }

      // Check role
      const { data: userRecord } = await supabase
        .from('users')
        .select('user_role')
        .eq('email', email.toLowerCase())
        .single()

      if (userRecord?.user_role !== 'market_director') {
        await supabase.auth.signOut()
        setError('This portal is for Market Directors only. Please visit havenquest.co/portal for client access.')
        return
      }

      // Optional access code gate
      const requiredCode = process.env.NEXT_PUBLIC_MD_ACCESS_CODE
      if (requiredCode && accessCode.trim().toLowerCase() !== requiredCode.toLowerCase()) {
        await supabase.auth.signOut()
        setError('Invalid access code.')
        return
      }

      // Set hq_auth cookie
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: data.session.access_token }),
      })

      window.location.assign('/compass/meridian/clients')
    } catch (err) {
      console.error('[md/login]', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#08101C', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        {/* Wordmark */}
        <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '4px', letterSpacing: '-0.01em' }}>
          <span>Haven</span><span style={{ color: '#0076B6' }}>Quest</span>
        </p>
        <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, letterSpacing: '0.16em', color: '#C5B783', textTransform: 'uppercase', marginBottom: '32px' }}>
          COMPASS — Market Director Portal
        </p>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 4px' }}>
            Market Director Portal
          </h1>
          <p style={{ fontSize: '13px', color: '#9A8E82', margin: '0 0 24px' }}>
            COMPASS — HavenQuest Operating System
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#4B5563', marginBottom: '6px', letterSpacing: '0.04em' }}>
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@havenquest.co"
                required
                style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#0A1E3D', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#4B5563', marginBottom: '6px', letterSpacing: '0.04em' }}>
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#0A1E3D', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#4B5563', marginBottom: '6px', letterSpacing: '0.04em' }}>
                ACCESS CODE
              </label>
              <input
                type="text"
                value={accessCode}
                onChange={e => setAccessCode(e.target.value)}
                placeholder="6-character code"
                maxLength={6}
                style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#0A1E3D', outline: 'none', boxSizing: 'border-box', letterSpacing: '0.12em' }}
              />
            </div>

            {error && (
              <p style={{ fontSize: '13px', color: '#DC2626', margin: 0, lineHeight: 1.5 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: loading ? '#5B7EA6' : '#0A1E3D',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '4px',
              }}
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <p style={{ fontSize: '12px', color: '#9A8E82', textAlign: 'center', marginTop: '20px', marginBottom: 0 }}>
            Need access?{' '}
            <a href="mailto:craig.asbach@havenquest.co" style={{ color: '#0076B6', textDecoration: 'none' }}>
              craig.asbach@havenquest.co
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
