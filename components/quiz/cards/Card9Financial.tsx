'use client'

import { useState } from 'react'
import ButtonSelectRow from '../ButtonSelectRow'
import { NAVY, BLUE } from '../quizTheme'
import type { EntryPath } from '../../../utils/quizFlow'
import type {
  Card9Answers,
  IncomeRangeValue,
  HomeProceedsValue,
  AvailableFundsValue,
} from '../../../utils/quizProfileMapping'

const INCOME_OPTIONS: { value: IncomeRangeValue; label: string }[] = [
  { value: 'under75k', label: 'Under $75K' },
  { value: '75to125k', label: '$75K–$125K' },
  { value: '125to200k', label: '$125K–$200K' },
  { value: '200to300k', label: '$200K–$300K' },
  { value: '300plus', label: '$300K+' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
]

const PROCEEDS_APPLICABLE_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not_sure', label: 'Not sure yet' },
]

const PROCEEDS_RANGE_OPTIONS: { value: HomeProceedsValue; label: string }[] = [
  { value: 'under50k', label: 'Under $50K' },
  { value: '50to150k', label: '$50K–$150K' },
  { value: '150to300k', label: '$150K–$300K' },
  { value: '300to500k', label: '$300K–$500K' },
  { value: '500plus', label: '$500K+' },
]

const FUNDS_OPTIONS: { value: AvailableFundsValue; label: string }[] = [
  { value: 'under25k', label: 'Under $25K' },
  { value: '25to75k', label: '$25K–$75K' },
  { value: '75to150k', label: '$75K–$150K' },
  { value: '150to300k', label: '$150K–$300K' },
  { value: '300plus', label: '$300K+' },
  { value: 'not_sure', label: 'Not sure yet' },
]

interface Card9FinancialProps {
  initialValue?: Card9Answers
  path: EntryPath
  onComplete: (answers: Card9Answers) => void
}

export default function Card9Financial({ initialValue, path, onComplete }: Card9FinancialProps) {
  const [incomeRange, setIncomeRange] = useState<IncomeRangeValue | null>(initialValue?.incomeRange ?? null)
  const [proceedsApplicable, setProceedsApplicable] = useState<'yes' | 'no' | 'not_sure' | null>(initialValue?.proceedsApplicable ?? null)
  const [homeProceeds, setHomeProceeds] = useState<HomeProceedsValue | null>(initialValue?.homeProceeds ?? null)
  const [availableFunds, setAvailableFunds] = useState<AvailableFundsValue | null>(initialValue?.availableFunds ?? null)

  const handleSubmit = () => {
    if (!incomeRange) return
    onComplete({
      incomeRange,
      proceedsApplicable: proceedsApplicable ?? 'not_sure',
      homeProceeds: proceedsApplicable === 'yes' ? homeProceeds : null,
      availableFunds: availableFunds ?? 'not_sure',
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: NAVY }}>
        Let&apos;s make sure your matches are realistic.
      </h1>
      <p className="text-gray-500 mb-8">
        {path === 'instate'
          ? 'How do you expect your next Texas move to work financially?'
          : 'We use ranges — no exact numbers needed.'}
      </p>

      <div className="mb-8">
        <p className="text-sm font-semibold mb-3" style={{ color: NAVY }}>Annual Household Income</p>
        <ButtonSelectRow
          options={INCOME_OPTIONS}
          selected={incomeRange}
          onSelect={v => setIncomeRange(v as IncomeRangeValue)}
        />
      </div>

      <div className="mb-8">
        <p className="text-sm font-semibold mb-3" style={{ color: NAVY }}>
          Will proceeds from your current home be part of your Texas purchase?
        </p>
        <ButtonSelectRow
          options={PROCEEDS_APPLICABLE_OPTIONS}
          selected={proceedsApplicable}
          onSelect={v => setProceedsApplicable(v as 'yes' | 'no' | 'not_sure')}
        />
        {proceedsApplicable === 'yes' && (
          <div className="mt-3">
            <ButtonSelectRow
              options={PROCEEDS_RANGE_OPTIONS}
              selected={homeProceeds}
              onSelect={v => setHomeProceeds(v as HomeProceedsValue)}
            />
          </div>
        )}
      </div>

      <div className="mb-10">
        <p className="text-sm font-semibold mb-1" style={{ color: NAVY }}>
          Additional funds available for your move and purchase
        </p>
        <p className="text-sm text-gray-500 mb-3">
          Separate from any home sale proceeds above — savings, investments, gifts, etc.
        </p>
        <ButtonSelectRow
          options={FUNDS_OPTIONS}
          selected={availableFunds}
          onSelect={v => setAvailableFunds(v as AvailableFundsValue)}
        />
      </div>

      <button
        type="button"
        disabled={!incomeRange}
        onClick={handleSubmit}
        className="w-full py-3.5 rounded-xl font-bold text-sm transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: BLUE, color: '#FFFFFF' }}
      >
        Continue
      </button>
    </div>
  )
}
