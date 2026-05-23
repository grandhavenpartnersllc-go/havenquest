'use client'

import { useState } from 'react'
import { HOUSEHOLD_OPTIONS, HOUSING_OPTIONS } from '../../utils/constants'
import { UserProfile } from '../../types'

interface HouseholdFormProps {
  onComplete: (data: {
    householdSize: UserProfile['householdSize']
    housingPreference: UserProfile['housingPreference']
  }) => void
}

export default function HouseholdForm({ onComplete }: HouseholdFormProps) {
  const [householdSize, setHouseholdSize] = useState<UserProfile['householdSize'] | null>(null)
  const [housingPreference, setHousingPreference] = useState<UserProfile['housingPreference'] | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!householdSize || !housingPreference) {
      setError('Please make a selection for both questions')
      return
    }
    onComplete({ householdSize, housingPreference })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <label className="block text-xl font-bold text-gray-900 tracking-tight mb-4">
          Tell us about your household
        </label>
        <div className="grid grid-cols-2 gap-2">
          {HOUSEHOLD_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setHouseholdSize(opt.value); setError('') }}
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
      </div>

      <div className="mb-6">
        <label className="block text-base font-medium text-gray-900 mb-4">
          What type of housing are you looking for?
        </label>
        <div className="grid grid-cols-1 gap-2">
          {HOUSING_OPTIONS.filter(opt => !opt.group).map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setHousingPreference(opt.value); setError('') }}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                housingPreference === opt.value
                  ? 'border-accent bg-blue-50 text-accent'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="font-medium text-sm">{opt.label}</span>
              <span className="text-xs text-gray-400">{opt.description}</span>
            </button>
          ))}
          <div className="pt-3 pb-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-amber-600">Luxury</p>
          </div>
          {HOUSING_OPTIONS.filter(opt => opt.group === 'Luxury').map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setHousingPreference(opt.value); setError('') }}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                housingPreference === opt.value
                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                  : 'border-amber-200/60 text-gray-700 hover:border-amber-300'
              }`}
            >
              <span className="font-medium text-sm">{opt.label}</span>
              <span className="text-xs text-gray-400">{opt.description}</span>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="w-full bg-accent text-white py-4 rounded-xl font-bold text-base hover:bg-[#154d8a] transition-colors"
      >
        Continue →
      </button>
    </form>
  )
}
