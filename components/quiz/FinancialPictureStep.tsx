'use client'

import { useState } from 'react'
import { Lock, Zap, Clock, Calendar, Compass } from 'lucide-react'
import { FinancialPicture } from '../../types'

interface FinancialPictureStepProps {
  onNext: (data: FinancialPicture) => void
  onBack: () => void
  initialData?: FinancialPicture
}

const PROCEEDS_OPTIONS = [
  'Under $50,000',
  '$50,000 – $100,000',
  '$100,000 – $200,000',
  '$200,000 – $350,000',
  '$350,000 – $500,000',
  '$500,000 – $750,000',
  '$750,000+',
  "I'm not sure yet",
]

const DOWN_PAYMENT_OPTIONS = [
  'Under $20,000',
  '$20,000 – $50,000',
  '$50,000 – $100,000',
  '$100,000 – $200,000',
  '$200,000 – $500,000',
  '$500,000+',
  "I'm not sure yet",
]

const TIMELINE_OPTIONS: { value: FinancialPicture['purchase_timeline']; label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { value: '0-3months',     label: 'Within 3 months', Icon: Zap },
  { value: '3-6months',     label: '3 – 6 months',    Icon: Clock },
  { value: '6-12months',    label: '6 – 12 months',   Icon: Calendar },
  { value: 'exploring',     label: '12+ months · Just exploring', Icon: Compass },
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

export default function FinancialPictureStep({ onNext, onBack, initialData }: FinancialPictureStepProps) {
  const [isHomeowner, setIsHomeowner] = useState<boolean | null>(
    initialData ? initialData.is_homeowner : null
  )
  const [proceeds, setProceeds] = useState(initialData?.home_sale_proceeds ?? '')
  const [downPayment, setDownPayment] = useState(initialData?.down_payment_available ?? '')
  const [timeline, setTimeline] = useState<FinancialPicture['purchase_timeline'] | null>(
    initialData?.purchase_timeline ?? null
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (isHomeowner === null) next.homeowner = 'Please select Yes or No.'
    if (isHomeowner === true && !proceeds) next.proceeds = 'Please estimate your home sale proceeds.'
    if (!downPayment) next.downPayment = 'Please select your available down payment funds.'
    if (!timeline) next.timeline = 'Please select a purchase timeline.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onNext({
      is_homeowner: isHomeowner!,
      home_sale_proceeds: isHomeowner ? proceeds : null,
      down_payment_available: downPayment,
      purchase_timeline: timeline!,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Privacy note */}
      <p className="flex items-start gap-1.5 text-xs text-gray-400 italic mb-6 leading-relaxed">
        <Lock size={13} className="shrink-0 mt-0.5 text-gray-400" />
        This helps us match you to cities where your full financial picture actually fits — not just your income. We use this information only for matching. It is never sold, never shared with realtors without your consent, and never stored beyond what&apos;s needed to generate your results.
      </p>

      {/* Field 1 — Homeowner toggle */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Are you currently a homeowner?
        </label>
        <div className="flex gap-3">
          {(['Yes', 'No'] as const).map(opt => {
            const val = opt === 'Yes'
            const active = isHomeowner === val
            return (
              <button
                key={opt}
                type="button"
                onClick={() => { setIsHomeowner(val); setErrors(e => ({ ...e, homeowner: '' })) }}
                className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  active
                    ? 'border-accent bg-blue-50 text-accent'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {opt}
              </button>
            )
          })}
        </div>
        {errors.homeowner && <p className="mt-1.5 text-xs text-red-500">{errors.homeowner}</p>}
      </div>

      {/* Field 2 — Home sale proceeds (conditional, smooth reveal) */}
      <div
        style={{
          maxHeight: isHomeowner === true ? '160px' : '0',
          overflow: 'hidden',
          transition: 'max-height 150ms ease',
        }}
      >
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-800 mb-0.5">
            Estimated proceeds from your home sale
          </label>
          <p className="text-xs text-gray-400 mb-2">The equity you&apos;ll walk away with after paying off your mortgage and selling costs — this counts toward your down payment</p>
          <SelectWrapper>
            <select
              value={proceeds}
              onChange={e => { setProceeds(e.target.value); setErrors(er => ({ ...er, proceeds: '' })) }}
              className={SELECT_CLASS}
            >
              <option value="">Select an estimate…</option>
              {PROCEEDS_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </SelectWrapper>
          {errors.proceeds && <p className="mt-1.5 text-xs text-red-500">{errors.proceeds}</p>}
        </div>
      </div>

      {/* Field 3 — Down payment */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 mb-0.5">
          Any additional funds you&apos;re bringing to the table?
        </label>
        <p className="text-xs text-gray-400 mb-2">Beyond your home sale proceeds — savings, gifts, investments, or other sources</p>
        <SelectWrapper>
          <select
            value={downPayment}
            onChange={e => { setDownPayment(e.target.value); setErrors(er => ({ ...er, downPayment: '' })) }}
            className={SELECT_CLASS}
          >
            <option value="">Select an amount…</option>
            {DOWN_PAYMENT_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </SelectWrapper>
        {errors.downPayment && <p className="mt-1.5 text-xs text-red-500">{errors.downPayment}</p>}
      </div>

      {/* Field 4 — Purchase timeline tiles */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          When are you planning to buy?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TIMELINE_OPTIONS.map(({ value, label, Icon }) => {
            const active = timeline === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => { setTimeline(value); setErrors(er => ({ ...er, timeline: '' })) }}
                className={`flex flex-col items-center gap-1.5 py-4 px-2 rounded-xl border text-center text-sm font-medium transition-all ${
                  active
                    ? 'border-accent bg-blue-50 text-accent'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Icon size={20} className={active ? 'text-accent' : 'text-gray-400'} />
                {label}
              </button>
            )
          })}
        </div>
        {errors.timeline && <p className="mt-1.5 text-xs text-red-500">{errors.timeline}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-accent text-white py-4 rounded-xl font-bold text-base hover:bg-[#154d8a] transition-colors"
      >
        Continue →
      </button>

      <button
        type="button"
        onClick={onBack}
        className="mt-4 w-full text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium"
      >
        ← Back
      </button>
    </form>
  )
}
