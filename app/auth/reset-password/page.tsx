'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase/client'

type Stage = 'verifying' | 'form' | 'expired'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('verifying')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()

    // Supabase fires PASSWORD_RECOVERY once the code in the URL is exchanged.
    // detectSessionInUrl is true by default so the client handles the exchange.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log('[reset-password] auth event:', event)
      if (event === 'PASSWORD_RECOVERY') {
        setStage('form')
      }
    })

    // Also check if a session already exists (handles cases where the client
    // exchanged the code before the listener was registered).
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[reset-password] getSession — session present:', !!session)
      if (session) setStage('form')
    })

    // If neither fires within 6 seconds the link is invalid or expired.
    const timeout = setTimeout(() => {
      setStage(prev => prev === 'verifying' ? 'expired' : prev)
    }, 6000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError("Passwords don't match")
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(updateError.message)
        return
      }

      // Fire-and-forget — send PDF report email without blocking navigation
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.access_token) {
          fetch('/api/auth/send-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: session.access_token }),
          }).catch(() => {})
        }
      })

      router.push('/login?message=password-updated')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (stage === 'verifying') {
    return (
      <div className="min-h-screen bg-[#08101C] flex items-center justify-center">
        <div className="text-center">
          <div className="w-7 h-7 border-2 border-blue-400/20 border-t-blue-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Verifying reset link…</p>
        </div>
      </div>
    )
  }

  if (stage === 'expired') {
    return (
      <div className="min-h-screen bg-[#08101C] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <Link href="/" className="block font-bold text-[17px] text-white tracking-tight mb-8">
            Haven<span className="text-blue-400">Quest</span>
          </Link>
          <div className="bg-white rounded-2xl p-8" style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>
            <p className="text-3xl mb-3">⏱️</p>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Link expired</h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              This reset link is no longer valid. Request a new one from the sign-in page.
            </p>
            <Link
              href="/login"
              className="block w-full py-3 rounded-xl font-bold text-sm text-white text-center transition-colors hover:opacity-90"
              style={{ backgroundColor: '#1A5FA8' }}
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#08101C] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center font-bold text-[17px] text-white tracking-tight mb-8">
          Haven<span className="text-blue-400">Quest</span>
        </Link>

        <div className="bg-white rounded-2xl p-8" style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-1">Set a new password</h1>
          <p className="text-sm text-gray-400 mb-6">
            Choose a password for your HavenQuest portal.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">New password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                autoFocus
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-colors disabled:opacity-60"
              style={{ backgroundColor: '#1A5FA8', boxShadow: '0 2px 10px rgba(26,95,168,0.28)' }}
            >
              {loading ? 'Updating…' : 'Set New Password →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
