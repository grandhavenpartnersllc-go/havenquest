'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import { LOCAL_SESSION_KEY } from '../../utils/constants'

function LoginPageContent() {
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) setEmail(emailParam)

    if (searchParams.get('error') === 'expired') {
      setError('That link has expired. Use "Forgot password?" to get a new one.')
    }
  }, [searchParams])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('[login] Signing in:', email)
      const supabase = createClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      console.log('[login] signInWithPassword done — session:', !!data?.session, 'error:', signInError?.message)

      if (signInError) {
        setError(
          signInError.message === 'Invalid login credentials'
            ? 'Incorrect email or password.'
            : signInError.message
        )
        return
      }

      if (!data.session) {
        console.warn('[login] No session returned — email confirmation may be required')
        setError('Unable to sign in. Check your inbox for a confirmation link.')
        return
      }

      console.log('[login] Setting hq_auth cookie...')
      const cookieRes = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: data.session.access_token }),
      })
      console.log('[login] Cookie response status:', cookieRes.status)

      // Pre-fetch real user data so the portal can render immediately
      let firstName = email.split('@')[0]
      let currentMileMarker = 2
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('first_name, current_milemarker')
          .eq('email', email.toLowerCase())
          .single()
        if (userData?.first_name) firstName = userData.first_name
        if (userData?.current_milemarker) currentMileMarker = userData.current_milemarker
      } catch {}

      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({
        userId: data.user.id,
        firstName,
        email: email.toLowerCase(),
        currentMileMarker,
        createdAt: new Date().toISOString(),
      }))

      console.log('[login] Redirecting to /portal')
      window.location.assign('/portal')
    } catch (err) {
      console.error('[login] Unexpected error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1E3D] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="block text-center font-bold text-[17px] text-white tracking-tight mb-8"
        >
          Haven<span style={{ color: '#C5B783' }}>Quest</span>
        </Link>

        <div className="rounded-2xl p-8 mb-6" style={{ backgroundColor: '#F4F1EA', border: '1px solid rgba(197,183,131,0.35)', boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-1">
            Sign in to your portal
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Access your saved matches and relocation tools.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={e => { e.currentTarget.style.borderColor = '#C5B783'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197,183,131,0.28)' }}
                onBlur={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = '' }}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none transition-shadow"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={e => { e.currentTarget.style.borderColor = '#C5B783'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197,183,131,0.28)' }}
                onBlur={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = '' }}
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none transition-shadow"
              />
              <div className="text-right mt-1.5">
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-gray-400 transition-colors"
                  onMouseEnter={e => { e.currentTarget.style.color = '#C5B783' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '' }}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-60"
              style={{ backgroundColor: '#0A1E3D', color: '#C5B783', border: '1px solid rgba(197,183,131,0.55)' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.45)' }}>
          New to HavenQuest?{' '}
          <Link
            href="/begin"
            className="text-[#C5B783] transition-colors font-medium"
            onMouseEnter={e => { e.currentTarget.style.color = '#DCC088' }}
            onMouseLeave={e => { e.currentTarget.style.color = '' }}
          >
            Get your free report →
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  )
}
