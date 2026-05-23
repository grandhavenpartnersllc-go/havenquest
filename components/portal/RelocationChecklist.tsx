'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { LOCAL_CHECKLIST_KEY } from '../../utils/constants'

interface RelocationChecklistProps {
  cityName: string
}

const makeItems = (cityName: string) => [
  `Research neighborhoods in ${cityName}`,
  `Connect with your matched realtor`,
  `Plan a visit to ${cityName}`,
  `Research school enrollment requirements`,
  `Compare cost of living to your current city`,
  `Get mortgage pre-approval`,
  `Join local Facebook and Reddit communities for ${cityName}`,
  `Research commute routes from ${cityName} to your employer`,
]

export default function RelocationChecklist({ cityName }: RelocationChecklistProps) {
  const items = makeItems(cityName)
  const [checked, setChecked] = useState<boolean[]>(() => Array(items.length).fill(false))

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_CHECKLIST_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as boolean[]
        if (parsed.length === items.length) setChecked(parsed)
      } catch {}
    }
  }, [items.length])

  const toggle = (i: number) => {
    setChecked(prev => {
      const next = [...prev]
      next[i] = !next[i]
      localStorage.setItem(LOCAL_CHECKLIST_KEY, JSON.stringify(next))
      return next
    })
  }

  const done = checked.filter(Boolean).length
  const pct = Math.round((done / items.length) * 100)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm" style={{ color: '#1C1814' }}>Progress</h3>
        <span
          className="text-xs font-bold tabular-nums px-2.5 py-1 rounded-full"
          style={{ backgroundColor: 'rgba(184,145,42,0.1)', color: '#B8912A' }}
        >
          {done}/{items.length}
        </span>
      </div>

      <div className="h-1 rounded-full overflow-hidden mb-4" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: pct === 100 ? '#5A8A2A' : '#B8912A' }}
        />
      </div>

      <div className="space-y-1.5">
        {items.map((item, i) => (
          <label
            key={i}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
            style={{
              backgroundColor: checked[i] ? 'rgba(90,138,42,0.07)' : 'rgba(0,0,0,0.025)',
            }}
          >
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all"
              style={{
                backgroundColor: checked[i] ? '#5A8A2A' : 'transparent',
                border: checked[i] ? '1.5px solid #5A8A2A' : '1.5px solid rgba(0,0,0,0.18)',
              }}
              onClick={() => toggle(i)}
            >
              {checked[i] && <Check size={11} className="text-white" strokeWidth={3} />}
            </div>
            <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} className="sr-only" />
            <span
              className="text-sm"
              style={{
                color: checked[i] ? '#5A8A2A' : '#4A3E34',
                textDecoration: checked[i] ? 'line-through' : 'none',
              }}
            >
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
