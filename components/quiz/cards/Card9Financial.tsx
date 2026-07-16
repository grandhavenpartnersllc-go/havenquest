'use client'

import { useState } from 'react'
import ButtonSelectRow from '../ButtonSelectRow'
import { NAVY } from '../quizTheme'
import CardShell, { PILL_CLASS } from '../CardShell'
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
  onBack?: () => void
}

export default function Card9Financial({ initialValue, path, onComplete, onBack }: Card9FinancialProps) {
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
    <CardShell
      eyebrow="Your Budget"
      title="Let's make sure your matches are realistic."
      sub={path === 'instate'
        ? 'How do you expect your next Texas move to work financially?'
        : 'We use ranges — no exact numbers needed.'}
      helper="Separate from any home sale proceeds above — savings, investments, gifts, etc."
      onBack={onBack}
      next={
        <button
          type="button"
          disabled={!incomeRange}
          onClick={handleSubmit}
          className={PILL_CLASS}
        >
          Continue
        </button>
      }
    >
      <div>
        <p className="text-sm font-semibold mb-3" style={{ color: NAVY }}>Annual Household Income</p>
        <ButtonSelectRow
          options={INCOME_OPTIONS}
          selected={incomeRange}
          onSelect={v => setIncomeRange(v as IncomeRangeValue)}
        />
      </div>

      <div className="hq-qblock">
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

      <div className="hq-qblock">
        <p className="text-sm font-semibold mb-3" style={{ color: NAVY }}>
          Additional funds available for your move and purchase
        </p>
        <ButtonSelectRow
          options={FUNDS_OPTIONS}
          selected={availableFunds}
          onSelect={v => setAvailableFunds(v as AvailableFundsValue)}
        />
      </div>
    </CardShell>
  )
}
