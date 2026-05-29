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
  { label: 'Single family', value: 'singleFamily' },
  { label: 'Townhome', value: 'townhome' },
  { label: 'Condo', value: 'condo' },
  { label: 'No preference', value: null },
]

const CONSTRUCTION_OPTIONS: { label: string; value: BuyerProfile['constructionPreference'] }[] = [
  { label: 'New construction', value: 'new' },
  { label: 'Resale', value: 'resale' },
  { label: 'No preference', value: null },
]

type BedroomState = BuyerProfile['bedrooms'] | undefined
type HomeTypeState = BuyerProfile['homeType'] | undefined
type ConstructionState = BuyerProfile['constructionPreference'] | undefined

function tileClass(selected: boolean): string {
  return `p-4 rounded-xl border text-left transition-all ${
    selected ? 'border-accent bg-blue-50' : 'border-gray-200 hover:border-gray-300'
  }`
}

function labelClass(selected: boolean): string {
  return `font-medium text-sm ${selected ? 'text-accent' : 'text-gray-900'}`
}

export default function BuyerProfileStep({ onComplete }: BuyerProfileStepProps) {
  const [bedrooms, setBedrooms] = useState<BedroomState>(undefined)
  const [bathroomLabel, setBathroomLabel] = useState<string | null>(null)
  const [homeType, setHomeType] = useState<HomeTypeState>(undefined)
  const [constructionPreference, setConstructionPreference] = useState<ConstructionState>(undefined)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const bathroomOpt = BATHROOM_OPTIONS.find(o => o.label === bathroomLabel)
    onComplete({
      bedrooms: bedrooms ?? null,
      bathrooms: bathroomOpt?.value ?? null,
      homeType: homeType ?? null,
      constructionPreference: constructionPreference ?? null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <label className="block text-xl font-bold text-gray-900 tracking-tight mb-2">
          Tell us about your home
        </label>
        <p className="text-sm text-gray-500 mb-5">
          This helps us match listings to your preferences.
        </p>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Bedrooms</p>
        <div className="flex flex-col gap-2">
          {BEDROOM_OPTIONS.map(opt => {
            const selected = bedrooms === opt.value
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => setBedrooms(opt.value)}
                className={tileClass(selected)}
              >
                <span className={labelClass(selected)}>{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Bathrooms</p>
        <div className="flex flex-col gap-2">
          {BATHROOM_OPTIONS.map(opt => {
            const selected = bathroomLabel === opt.label
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => setBathroomLabel(opt.label)}
                className={tileClass(selected)}
              >
                <span className={labelClass(selected)}>{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Home type</p>
        <div className="flex flex-col gap-2">
          {HOME_TYPE_OPTIONS.map(opt => {
            const selected = homeType === opt.value
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => setHomeType(opt.value)}
                className={tileClass(selected)}
              >
                <span className={labelClass(selected)}>{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Construction</p>
        <div className="flex flex-col gap-2">
          {CONSTRUCTION_OPTIONS.map(opt => {
            const selected = constructionPreference === opt.value
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => setConstructionPreference(opt.value)}
                className={tileClass(selected)}
              >
                <span className={labelClass(selected)}>{opt.label}</span>
              </button>
            )
          })}
        </div>
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
