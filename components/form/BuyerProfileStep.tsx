'use client'

import { useState } from 'react'
import { BuyerProfile } from '../../types'

interface BuyerProfileStepProps {
  onComplete: (buyerProfile: BuyerProfile) => void
}

const BEDROOM_OPTIONS: { label: string; value: BuyerProfile['bedrooms'] }[] = [
  { label: '2 bedrooms', value: 2 },
  { label: '3 bedrooms', value: 3 },
  { label: '4 bedrooms', value: 4 },
  { label: '5+ bedrooms', value: 5 },
  { label: 'No preference', value: null },
]

const BATHROOM_OPTIONS: { label: string; value: BuyerProfile['bathrooms'] }[] = [
  { label: '1 bathroom', value: 1 },
  { label: '2 bathrooms', value: 2 },
  { label: '3 bathrooms', value: 3 },
  { label: '3+ bathrooms', value: 3 },
  { label: 'No preference', value: null },
]

const HOME_TYPE_OPTIONS: { label: string; value: BuyerProfile['homeType'] }[] = [
  { label: 'Single family home', value: 'singleFamily' },
  { label: 'Townhome', value: 'townhome' },
  { label: 'Condo', value: 'condo' },
  { label: 'No preference', value: null },
]

const CONSTRUCTION_OPTIONS: { label: string; value: BuyerProfile['constructionPreference'] }[] = [
  { label: 'New construction', value: 'new' },
  { label: 'Resale', value: 'resale' },
  { label: 'No preference', value: null },
]

const SELECT_CLASS =
  'w-full appearance-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 pr-9 cursor-pointer'

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg
          className="w-4 h-4 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  )
}

export default function BuyerProfileStep({ onComplete }: BuyerProfileStepProps) {
  const [bedroomLabel, setBedroomLabel] = useState('No preference')
  const [bathroomLabel, setBathroomLabel] = useState('No preference')
  const [homeTypeLabel, setHomeTypeLabel] = useState('No preference')
  const [constructionLabel, setConstructionLabel] = useState('No preference')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const bedroomOpt = BEDROOM_OPTIONS.find(o => o.label === bedroomLabel)
    const bathroomOpt = BATHROOM_OPTIONS.find(o => o.label === bathroomLabel)
    const homeTypeOpt = HOME_TYPE_OPTIONS.find(o => o.label === homeTypeLabel)
    const constructionOpt = CONSTRUCTION_OPTIONS.find(o => o.label === constructionLabel)
    onComplete({
      bedrooms: bedroomOpt?.value ?? null,
      bathrooms: bathroomOpt?.value ?? null,
      homeType: homeTypeOpt?.value ?? null,
      constructionPreference: constructionOpt?.value ?? null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-blue-400/60 mb-3">
          STEP 5 OF 5 · BUYER PROFILE
        </p>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-3">
          Now let&apos;s talk about your home.
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-3">
          You&apos;ve told us what matters most. Now tell us what home looks like for you.
          This is where your search gets personal — and where we start making sure
          the right listings are waiting when you arrive.
        </p>
        <p className="text-xs text-gray-400 italic">
          All fields optional — select &quot;No preference&quot; to skip any question.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Bedrooms</label>
          <SelectWrapper>
            <select
              value={bedroomLabel}
              onChange={e => setBedroomLabel(e.target.value)}
              className={SELECT_CLASS}
            >
              {BEDROOM_OPTIONS.map(opt => (
                <option key={opt.label} value={opt.label}>{opt.label}</option>
              ))}
            </select>
          </SelectWrapper>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Bathrooms</label>
          <SelectWrapper>
            <select
              value={bathroomLabel}
              onChange={e => setBathroomLabel(e.target.value)}
              className={SELECT_CLASS}
            >
              {BATHROOM_OPTIONS.map(opt => (
                <option key={opt.label} value={opt.label}>{opt.label}</option>
              ))}
            </select>
          </SelectWrapper>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Home Type</label>
          <SelectWrapper>
            <select
              value={homeTypeLabel}
              onChange={e => setHomeTypeLabel(e.target.value)}
              className={SELECT_CLASS}
            >
              {HOME_TYPE_OPTIONS.map(opt => (
                <option key={opt.label} value={opt.label}>{opt.label}</option>
              ))}
            </select>
          </SelectWrapper>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Construction</label>
          <SelectWrapper>
            <select
              value={constructionLabel}
              onChange={e => setConstructionLabel(e.target.value)}
              className={SELECT_CLASS}
            >
              {CONSTRUCTION_OPTIONS.map(opt => (
                <option key={opt.label} value={opt.label}>{opt.label}</option>
              ))}
            </select>
          </SelectWrapper>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-accent text-white py-4 rounded-xl font-bold text-base hover:bg-[#154d8a] transition-colors"
      >
        See My Matches →
      </button>
    </form>
  )
}
