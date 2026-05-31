'use client'

import { useState } from 'react'
import {
  Car, Waves, Home, Trees, Monitor, LayoutDashboard,
  BedDouble, Users, Wifi, ChefHat,
} from 'lucide-react'
import { HOUSEHOLD_OPTIONS } from '../../utils/constants'
import { UserProfile, BuyerProfile, HomeFeature } from '../../types'

interface HouseholdFormProps {
  onComplete: (data: {
    householdSize: UserProfile['householdSize']
    buyerProfile: BuyerProfile
  }) => void
}

const BEDROOM_OPTIONS = [
  { label: '2 bedrooms',    value: 2 as BuyerProfile['bedrooms'] },
  { label: '3 bedrooms',    value: 3 as BuyerProfile['bedrooms'] },
  { label: '4 bedrooms',    value: 4 as BuyerProfile['bedrooms'] },
  { label: '5+ bedrooms',   value: 5 as BuyerProfile['bedrooms'] },
  { label: 'No preference', value: null as BuyerProfile['bedrooms'] },
]

const BATHROOM_OPTIONS = [
  { label: '1 bathroom',    value: 1 as BuyerProfile['bathrooms'] },
  { label: '2 bathrooms',   value: 2 as BuyerProfile['bathrooms'] },
  { label: '3+ bathrooms',  value: 3 as BuyerProfile['bathrooms'] },
  { label: 'No preference', value: null as BuyerProfile['bathrooms'] },
]

const HOME_TYPE_OPTIONS: { label: string; value: BuyerProfile['homeType'] }[] = [
  { label: 'Single family home', value: 'singleFamily' },
  { label: 'Townhome',           value: 'townhome' },
  { label: 'Condo',              value: 'condo' },
  { label: 'No preference',      value: null },
]

const FEATURE_OPTIONS: { value: HomeFeature; label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { value: 'garage',                    label: 'Garage',                  Icon: Car },
  { value: 'pool',                      label: 'Pool',                    Icon: Waves },
  { value: 'singleStory',               label: 'Single story',            Icon: Home },
  { value: 'largeYard',                 label: 'Large yard',              Icon: Trees },
  { value: 'homeOffice',                label: 'Home office',             Icon: Monitor },
  { value: 'openFloorPlan',             label: 'Open floor plan',         Icon: LayoutDashboard },
  { value: 'primaryBedroomDownstairs',  label: 'Primary bed downstairs',  Icon: BedDouble },
  { value: 'guestSuite',                label: 'Guest suite',             Icon: Users },
  { value: 'smartHome',                 label: 'Smart home',              Icon: Wifi },
  { value: 'largeKitchen',              label: 'Large kitchen',           Icon: ChefHat },
]

const SELECT_CLASS =
  'w-full appearance-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 pr-9 cursor-pointer'

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  )
}

export default function HouseholdForm({ onComplete }: HouseholdFormProps) {
  const [householdSize, setHouseholdSize] = useState<UserProfile['householdSize'] | null>(null)
  const [bedroomLabel, setBedroomLabel] = useState('')
  const [bathroomLabel, setBathroomLabel] = useState('')
  const [homeType, setHomeType] = useState<BuyerProfile['homeType'] | undefined>(undefined)
  const [constructionPreference, setConstructionPreference] = useState<BuyerProfile['constructionPreference'] | undefined>(undefined)
  const [features, setFeatures] = useState<HomeFeature[]>([])
  const [dreamHomeNotes, setDreamHomeNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const toggleFeature = (f: HomeFeature) => {
    setFeatures(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!householdSize) next.householdSize = 'Please select your household size.'
    if (!bedroomLabel) next.bedrooms = 'Please select a bedroom count.'
    if (!bathroomLabel) next.bathrooms = 'Please select a bathroom count.'
    if (homeType === undefined) next.homeType = 'Please select a home type.'
    if (constructionPreference === undefined) next.construction = 'Please select new or resale.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const bedroomOpt = BEDROOM_OPTIONS.find(o => o.label === bedroomLabel)
    const bathroomOpt = BATHROOM_OPTIONS.find(o => o.label === bathroomLabel)

    onComplete({
      householdSize: householdSize!,
      buyerProfile: {
        bedrooms: bedroomOpt?.value ?? null,
        bathrooms: bathroomOpt?.value ?? null,
        homeType: homeType ?? null,
        constructionPreference: constructionPreference ?? null,
        features,
        dreamHomeNotes: dreamHomeNotes.trim() || null,
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">

      {/* Section 1 — Household size */}
      <div className="mb-6">
        <label className="block text-base font-bold text-gray-900 tracking-tight mb-3">
          Tell us about your household
        </label>
        <div className="grid grid-cols-2 gap-2">
          {HOUSEHOLD_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setHouseholdSize(opt.value); setErrors(e => ({ ...e, householdSize: '' })) }}
              className={`p-3 rounded-xl border text-left transition-all ${
                householdSize === opt.value
                  ? 'border-accent bg-blue-50 text-accent'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <p className="font-medium text-sm">{opt.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{opt.description}</p>
            </button>
          ))}
        </div>
        {errors.householdSize && <p className="mt-1.5 text-xs text-red-500">{errors.householdSize}</p>}
      </div>

      {/* Section 2 — Bedrooms + bathrooms */}
      <div className="mb-6">
        <label className="block text-base font-bold text-gray-900 tracking-tight mb-3">
          How many bedrooms and bathrooms?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Bedrooms</label>
            <SelectWrapper>
              <select
                value={bedroomLabel}
                onChange={e => { setBedroomLabel(e.target.value); setErrors(er => ({ ...er, bedrooms: '' })) }}
                className={SELECT_CLASS}
              >
                <option value="">Select…</option>
                {BEDROOM_OPTIONS.map(opt => (
                  <option key={opt.label} value={opt.label}>{opt.label}</option>
                ))}
              </select>
            </SelectWrapper>
            {errors.bedrooms && <p className="mt-1 text-xs text-red-500">{errors.bedrooms}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Bathrooms</label>
            <SelectWrapper>
              <select
                value={bathroomLabel}
                onChange={e => { setBathroomLabel(e.target.value); setErrors(er => ({ ...er, bathrooms: '' })) }}
                className={SELECT_CLASS}
              >
                <option value="">Select…</option>
                {BATHROOM_OPTIONS.map(opt => (
                  <option key={opt.label} value={opt.label}>{opt.label}</option>
                ))}
              </select>
            </SelectWrapper>
            {errors.bathrooms && <p className="mt-1 text-xs text-red-500">{errors.bathrooms}</p>}
          </div>
        </div>
      </div>

      {/* Section 3 — Home type */}
      <div className="mb-6">
        <label className="block text-base font-bold text-gray-900 tracking-tight mb-3">
          What type of home?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {HOME_TYPE_OPTIONS.map(opt => (
            <button
              key={opt.label}
              type="button"
              onClick={() => { setHomeType(opt.value); setErrors(er => ({ ...er, homeType: '' })) }}
              className={`p-3 rounded-xl border text-sm font-medium text-center transition-all ${
                homeType === opt.value && homeType !== undefined
                  ? 'border-accent bg-blue-50 text-accent'
                  : opt.value === null && homeType === null
                  ? 'border-accent bg-blue-50 text-accent'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {errors.homeType && <p className="mt-1.5 text-xs text-red-500">{errors.homeType}</p>}
      </div>

      {/* Section 4 — Construction preference */}
      <div className="mb-6">
        <label className="block text-base font-bold text-gray-900 tracking-tight mb-3">
          New construction or existing home?
        </label>
        <div className="flex gap-2">
          {(['new', 'resale'] as const).map(val => (
            <button
              key={val}
              type="button"
              onClick={() => { setConstructionPreference(val); setErrors(er => ({ ...er, construction: '' })) }}
              className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
                constructionPreference === val
                  ? 'border-accent bg-blue-50 text-accent'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {val === 'new' ? 'New construction' : 'Resale / existing'}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => { setConstructionPreference(null); setErrors(er => ({ ...er, construction: '' })) }}
          className={`mt-2 w-full py-2 rounded-xl border text-xs font-medium transition-all ${
            constructionPreference === null
              ? 'border-accent bg-blue-50 text-accent'
              : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
          }`}
        >
          No preference
        </button>
        {errors.construction && <p className="mt-1.5 text-xs text-red-500">{errors.construction}</p>}
      </div>

      {/* Section 5 — Feature tiles (optional) */}
      <div className="mb-6">
        <label className="block text-base font-bold text-gray-900 tracking-tight mb-0.5">
          What features matter to you?
        </label>
        <p className="text-xs text-gray-400 mb-3">Select all that apply — or skip if you&apos;re flexible.</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {FEATURE_OPTIONS.map(({ value, label, Icon }) => {
            const active = features.includes(value)
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleFeature(value)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-center text-xs font-medium transition-all ${
                  active
                    ? 'border-accent bg-blue-50 text-accent'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Icon size={18} className={active ? 'text-accent' : 'text-gray-400'} />
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Section 6 — Free text (optional) */}
      <div className="mb-6">
        <label className="block text-base font-bold text-gray-900 tracking-tight mb-0.5">
          Anything else about your dream home?
        </label>
        <p className="text-xs text-gray-400 mb-2">Share anything the filters above don&apos;t capture.</p>
        <textarea
          value={dreamHomeNotes}
          onChange={e => setDreamHomeNotes(e.target.value)}
          rows={3}
          placeholder="e.g. I'd love a quiet street, a big pantry, and room for a dog..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-accent text-white py-4 rounded-xl font-bold text-base hover:bg-[#154d8a] transition-colors"
      >
        Continue →
      </button>
    </form>
  )
}
