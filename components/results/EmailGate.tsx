'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, CheckCircle2 } from 'lucide-react'
import { CityMatch, UserProfile, UserSession } from '../../types'
import { completeSession } from '../../services/quizSessionService'

interface EmailGateProps {
  matches: CityMatch[]
  profile: UserProfile
  sessionId: string
  onSuccess: (session: { userId: string; firstName: string; email: string }) => void
  onClose: () => void
  storedSession?: UserSession | null
}

export default function EmailGate({ matches, profile, sessionId, onSuccess, onClose, storedSession }: EmailGateProps) {
  const [firstName, setFirstName] = useState(
    storedSession?.firstName ??
    (typeof window !== 'undefined' ? sessionStorage.getItem('hq_first_name') ?? '' : '')
  )
  const [email, setEmail] = useState(storedSession?.email ?? '')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [returningUser, setReturningUser] = useState(false)
  const [isReturningUser, setIsReturningUser] = useState(false)
  const [returningSetupLink, setReturningSetupLink] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setReturningUser(false)

    if (!firstName.trim() || !email.trim()) {
      setError('First name and email are required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          movingTimeline: profile.movingTimeline,
          annualIncome: profile.annualIncome,
          householdSize: profile.householdSize,
          mustHaves: profile.mustHaves,
          niceToHaves: profile.niceToHaves,
          notPriorities: profile.notPriorities,
          buyerProfile: profile.buyerProfile ?? null,
          financialPicture: profile.financial_picture ?? null,
          topCityMatches: matches.map(m => ({
            cityId: m.location.id,
            cityName: m.location.name,
            matchScore: m.matchScore,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409 && storedSession && storedSession.email === email.trim().toLowerCase()) {
          completeSession(sessionId, email.trim().toLowerCase())
          onSuccess({ userId: storedSession.userId, firstName: firstName.trim(), email: email.trim().toLowerCase() })
          return
        }
        if (res.status === 409) {
          setReturningUser(true)
          return
        }
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      if (data.isReturningUser && data.setupLink) {
        setIsReturningUser(true)
        setReturningSetupLink(data.setupLink)
      } else {
        completeSession(sessionId, email.trim().toLowerCase())
        onSuccess({ userId: data.userId, firstName: firstName.trim(), email: email.trim().toLowerCase() })
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {isReturningUser ? (
          <div className="text-center py-2">
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome back, {firstName}.
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              We found your existing account and updated your city matches with your latest search.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => { window.location.href = '/login' }}
                className="w-full bg-accent text-white py-3.5 rounded-lg font-medium hover:bg-[#154d8a] transition-colors"
              >
                Sign in to my portal →
              </button>
              <button
                onClick={() => { window.location.href = '/auth/forgot-password' }}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Forgot my password?
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Your matches are saved and ready whenever you sign in.
            </p>
          </div>
        ) : (
          <>
        <div className="mb-5">
          <h2 className="text-xl font-medium text-gray-900 mb-1">Get your free full report</h2>
          <p className="text-sm text-gray-500">
            See complete scores, affordability breakdowns, and your full personalized report.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Alex"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setReturningUser(false) }}
              placeholder="alex@example.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone number{' '}
              <span className="text-gray-400 font-normal">Optional</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="(555) 000-0000"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {returningUser && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-blue-900 mb-0.5">Welcome back!</p>
              <p className="text-sm text-blue-700 mb-4">
                Looks like you already have a HavenQuest portal.
              </p>
              <Link
                href={`/login?email=${encodeURIComponent(email.trim())}`}
                className="block w-full text-center bg-accent text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#154d8a] transition-colors mb-2"
              >
                Sign In to My Portal →
              </Link>
              <button
                type="button"
                onClick={() => { setEmail(''); setReturningUser(false) }}
                className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors py-1"
              >
                Continue with a different email
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-3.5 rounded-lg font-medium hover:bg-[#154d8a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Unlocking your report…' : 'Get My Full Report →'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Free. No spam. Unsubscribe anytime.
          </p>
        </form>
          </>
        )}
      </div>
    </div>
  )
}
