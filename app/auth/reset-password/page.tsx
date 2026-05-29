'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '../../../lib/supabase/client'

type Stage = 'verifying' | 'form' | 'success' | 'expired'

export default function ResetPasswordPage() {
  const [stage, setStage] = useState<Stage>('verifying')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
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
      setError('Passwords do not match')
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

      // Set hq_auth cookie so /portal is accessible immediately
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: session.access_token }),
        })

        // Fire-and-forget PDF report email
        fetch('/api/auth/send-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: session.access_token }),
        }).catch(() => {})
      }

      setStage('success')
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
            <p
              className="text-[10px] font-bold uppercase mb-3"
              style={{ color: '#1A5FA8', letterSpacing: '0.16em' }}
            >
              Account Recovery
            </p>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Link expired</h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              This password reset link has expired or already been used. Request a new one.
            </p>
            <Link
              href="/auth/forgot-password"
              className="block w-full py-3 rounded-xl font-bold text-sm text-white text-center transition-colors hover:opacity-90"
              style={{ backgroundColor: '#1A5FA8' }}
            >
              Request new link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (stage === 'success') {
    return (
      <div className="min-h-screen bg-[#08101C] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <Link href="/" className="block font-bold text-[17px] text-white tracking-tight mb-8">
            Haven<span className="text-blue-400">Quest</span>
          </Link>
          <div className="bg-white rounded-2xl p-8" style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>
            <p
              className="text-[10px] font-bold uppercase mb-3"
              style={{ color: '#1A5FA8', letterSpacing: '0.16em' }}
            >
              Account Recovery
            </p>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Password updated</h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Your password has been updated. You can now sign in to your portal.
            </p>
            <Link
              href="/portal"
              className="block w-full py-3 rounded-xl font-bold text-sm text-white text-center transition-colors hover:opacity-90"
              style={{ backgroundColor: '#1A5FA8' }}
            >
              Go to my portal
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
          <p
            className="text-[10px] font-bold uppercase mb-3"
            style={{ color: '#1A5FA8', letterSpacing: '0.16em' }}
          >
            Account Recovery
          </p>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-1">Set a new password</h1>
          <p className="text-sm text-gray-400 mb-6">
            Choose a strong password for your HavenQuest portal.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">New password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  autoFocus
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-colors disabled:opacity-60"
              style={{ backgroundColor: '#1A5FA8', boxShadow: '0 2px 10px rgba(26,95,168,0.28)' }}
            >
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
