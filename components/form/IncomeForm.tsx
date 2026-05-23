'use client'

import { useState } from 'react'
import { formatIncomeInput, parseIncomeInput } from '../../utils/formatting'

interface IncomeFormProps {
  defaultValue?: number
  onComplete: (annualIncome: number) => void
}

export default function IncomeForm({ defaultValue, onComplete }: IncomeFormProps) {
  const [value, setValue] = useState(
    defaultValue ? defaultValue.toLocaleString('en-US') : ''
  )
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setValue(formatIncomeInput(e.target.value))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const num = parseIncomeInput(value)
    if (!num || num < 20000) {
      setError('Please enter a valid annual household income (min $20,000)')
      return
    }
    onComplete(num)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <label className="block text-xl font-bold text-gray-900 tracking-tight mb-1">
          What is your annual household income?
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Used only to calculate affordability — never shared without permission
        </p>
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-accent focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <span className="pl-4 pr-2 text-gray-400 text-lg font-medium select-none">$</span>
          <input
            type="text"
            inputMode="numeric"
            value={value}
            onChange={handleChange}
            placeholder="85,000"
            className="flex-1 py-4 pr-4 text-lg font-medium text-gray-900 bg-transparent outline-none tabular-nums"
            autoFocus
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
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
