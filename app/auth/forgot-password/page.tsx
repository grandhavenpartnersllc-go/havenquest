'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function sendReset() {
    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/reset-password`,
    })
    return resetError
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const resetError = await sendReset()
    if (resetError) {
      setError('Something went wrong. Please try again.')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  async function handleResend() {
    setLoading(true)
    await sendReset()
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

        <div className="bg-white rounded-2xl p-8" style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>
          {sent ? (
            <div className="text-center py-2">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Check your email</h1>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                We sent a password reset link to <strong>{email}</strong>. Check your inbox and click the link to set a new password.
              </p>
              <p className="text-xs text-gray-400">
                Didn&apos;t receive it? Check your spam folder or{' '}
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className="text-blue-500 hover:text-blue-700 transition-colors disabled:opacity-60"
                >
                  resend
                </button>
              </p>
            </div>
          ) : (
            <>
              <p
                className="text-[10px] font-bold uppercase mb-3"
                style={{ color: '#1A5FA8', letterSpacing: '0.16em' }}
              >
                Account Recovery
              </p>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-1">
                Reset your password
              </h1>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Enter the email address you used to create your portal. We&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  />
                  {error && <p className="text-sm text-red-500 mt-1.5">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white transition-colors disabled:opacity-60"
                  style={{ backgroundColor: '#1A5FA8' }}
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>

              <div className="mt-5 text-center">
                <Link href="/login" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
