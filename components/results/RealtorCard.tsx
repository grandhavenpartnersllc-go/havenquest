'use client'

import { Phone, Globe, Star, Award } from 'lucide-react'
import { Realtor, UserSession } from '../../types'
import { logRealtorContact } from '../../services/listingsService'
import { LOCAL_SESSION_KEY } from '../../utils/constants'

interface RealtorCardProps {
  realtor: Realtor
  cityName: string
  profile?: { movingTimeline?: string; annualIncome?: number; housingPreference?: string }
}

export default function RealtorCard({ realtor, cityName, profile }: RealtorCardProps) {
  const initials = realtor.name
    .split(' ')
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleContact = () => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_SESSION_KEY) : null
    const session: UserSession | null = raw ? JSON.parse(raw) : null
    logRealtorContact(session?.userId ?? null, cityName, realtor.id)

    if (session && profile) {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.userId,
          city: cityName,
          realtorId: realtor.id,
          eventType: 'realtor_contact',
          firstName: session.firstName,
          email: session.email,
          movingTimeline: profile.movingTimeline,
          realtorName: realtor.name,
          realtorPhone: realtor.phone,
          realtorWebsite: realtor.website,
        }),
      }).catch(() => {})
    }
  }

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-5"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: 'linear-gradient(135deg, #1A5FA8 0%, #2D7DD2 100%)' }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <p className="font-bold text-gray-900 tracking-tight">{realtor.name}</p>
            {realtor.isRelocationSpecialist && (
              <span className="bg-blue-50 text-accent text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">
                Relocation Specialist
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">{realtor.brokerage}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-gray-500">
        <span>{realtor.yearsExperience} yrs experience</span>
        <span>{realtor.transactionsLast12mo} transactions / 12mo</span>
        <span className="flex items-center gap-1">
          <Star size={11} className="text-gold fill-gold" />
          {realtor.rating.toFixed(1)} ({realtor.reviewCount})
        </span>
      </div>

      {realtor.designations.length > 0 && (
        <div className="flex items-center gap-1.5 mb-3">
          <Award size={12} className="text-gray-300 shrink-0" />
          <span className="text-xs text-gray-400">{realtor.designations[0]}</span>
        </div>
      )}

      <p className="text-sm text-gray-500 leading-relaxed mb-4">
        {realtor.bio.slice(0, 120)}{realtor.bio.length > 120 ? '…' : ''}
      </p>

      <div className="flex gap-2">
        <a
          href={`tel:${realtor.phone}`}
          onClick={handleContact}
          className="flex-1 flex items-center justify-center gap-1.5 bg-accent text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#154d8a] transition-colors"
          style={{ boxShadow: '0 2px 8px rgba(26,95,168,0.22)' }}
        >
          <Phone size={13} />
          Call {realtor.name.split(' ')[0]}
        </a>
        <a
          href={`https://${realtor.website}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleContact}
          className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-bold hover:border-accent hover:text-accent hover:bg-blue-50/50 transition-all"
        >
          <Globe size={13} />
          Website
        </a>
      </div>
    </div>
  )
}
