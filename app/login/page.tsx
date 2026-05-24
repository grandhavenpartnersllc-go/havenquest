'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import { LOCAL_SESSION_KEY } from '../../utils/constants'

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')

  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(
    errorParam === 'expired' ? 'That link has expired. Enter your email to get a new one.' : ''
  )
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'forgot'>(
    errorParam === 'expired' ? 'forgot' : 'login'
  )
  const [forgotSent, setForgotSent] = useState(false)

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

      // Write localStorage immediately using email prefix — do NOT block on a
      // DB round-trip here, that was causing the login to hang when the users
      // table query was slow or blocked by RLS.
      const firstName = email.split('@')[0]
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({
        userId: data.user.id,
        firstName,
        email: email.toLowerCase(),
        createdAt: new Date().toISOString(),
      }))

      // Enrich firstName from DB after navigation — fire and forget.
      ;(async () => {
        try {
          const { data: ud } = await supabase
            .from('users')
            .select('first_name')
            .eq('email', email.toLowerCase())
            .single()
          if (ud?.first_name) {
            const raw = localStorage.getItem(LOCAL_SESSION_KEY)
            if (raw) {
              localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ ...JSON.parse(raw), firstName: ud.first_name }))
            }
          }
        } catch {}
      })()

      console.log('[login] Redirecting to /portal')
      router.push('/portal')
    } catch (err) {
      console.error('[login] Unexpected error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })

    if (resetError) {
      setError(resetError.message)
    } else {
      setForgotSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#08101C] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="block text-center font-bold text-[17px] text-white tracking-tight mb-8"
        >
          Haven<span className="text-blue-400">Quest</span>
        </Link>

        <div className="bg-white rounded-2xl p-8 mb-6" style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>
          {mode === 'login' ? (
            <>
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
                    placeholder="you@example.com"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white transition-colors disabled:opacity-60"
                  style={{ backgroundColor: '#1A5FA8' }}
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

              <div className="mt-5 text-center">
                <button
                  onClick={() => { setMode('forgot'); setError('') }}
                  className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-1">
                Reset your password
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                We'll email you a link to set a new password.
              </p>

              {forgotSent ? (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-600 mb-4">
                    Check your inbox — we sent a reset link to <strong>{email}</strong>.
                  </p>
                  <button
                    onClick={() => { setMode('login'); setForgotSent(false); setError('') }}
                    className="text-blue-500 text-sm hover:text-blue-700 transition-colors"
                  >
                    Back to sign in
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    />
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white transition-colors disabled:opacity-60"
                    style={{ backgroundColor: '#1A5FA8' }}
                  >
                    {loading ? 'Sending…' : 'Send reset link'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError('') }}
                    className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors text-center py-1"
                  >
                    Back to sign in
                  </button>
                </form>
              )}
            </>
          )}
        </div>
        <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.45)' }}>
          New to HavenQuest?{' '}
          <Link href="/explore" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
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
