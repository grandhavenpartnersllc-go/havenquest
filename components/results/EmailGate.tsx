'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { CityMatch, UserProfile, UserSession } from '../../types'
import { TIMELINE_OPTIONS } from '../../utils/constants'

interface EmailGateProps {
  matches: CityMatch[]
  profile: UserProfile
  onSuccess: (session: { userId: string; firstName: string; email: string }) => void
  onClose: () => void
  storedSession?: UserSession | null
}

export default function EmailGate({ matches, profile, onSuccess, onClose, storedSession }: EmailGateProps) {
  const [firstName, setFirstName] = useState(storedSession?.firstName ?? '')
  const [email, setEmail] = useState(storedSession?.email ?? '')
  const [phone, setPhone] = useState('')
  const [timeline, setTimeline] = useState(profile.movingTimeline)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

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
          movingTimeline: timeline,
          annualIncome: profile.annualIncome,
          householdSize: profile.householdSize,
          housingPreference: profile.housingPreference,
          mustHaves: profile.mustHaves,
          niceToHaves: profile.niceToHaves,
          notPriorities: profile.notPriorities,
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
          onSuccess({ userId: storedSession.userId, firstName: firstName.trim(), email: email.trim().toLowerCase() })
          return
        }
        if (res.status === 409) {
          setError('That email is already registered. Sign in to access your portal.')
          return
        }
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      onSuccess({ userId: data.userId, firstName: firstName.trim(), email: email.trim().toLowerCase() })
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

        <div className="mb-5">
          <h2 className="text-xl font-medium text-gray-900 mb-1">Get your free full report</h2>
          <p className="text-sm text-gray-500">
            See complete scores, affordability breakdowns, and your matched realtors.
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
              onChange={e => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone number{' '}
              <span className="text-gray-400 font-normal">Optional — for realtor contact</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="(555) 000-0000"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Moving timeline
            </label>
            <select
              value={timeline}
              onChange={e => setTimeline(e.target.value as typeof timeline)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all bg-white"
            >
              {TIMELINE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

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
      </div>
    </div>
  )
}
