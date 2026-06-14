'use client'

import { useState } from 'react'
import { createClient } from '../../../../lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

      const { data: userRecord } = await supabase
        .from('users')
        .select('user_role')
        .eq('email', email.toLowerCase())
        .single()

      if (userRecord?.user_role !== 'admin') {
        await supabase.auth.signOut()
        setError('Admin access only. If you are a Market Director, visit /compass/meridian/login.')
        return
      }

      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: data.session.access_token }),
      })

      window.location.assign('/compass/admin')
    } catch (err) {
      console.error('[compass/admin/login]', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#08101C', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '4px', letterSpacing: '-0.01em' }}>
          <span>Haven</span><span style={{ color: '#0076B6' }}>Quest</span>
        </p>
        <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, letterSpacing: '0.16em', color: '#C5B783', textTransform: 'uppercase', marginBottom: '32px' }}>
          COMPASS Admin
        </p>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 4px' }}>
            Admin Portal
          </h1>
          <p style={{ fontSize: '13px', color: '#9A8E82', margin: '0 0 24px' }}>
            Authorized personnel only
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
        </div>
      </div>
    </div>
  )
}
