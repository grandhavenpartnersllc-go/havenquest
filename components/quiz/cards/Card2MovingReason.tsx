'use client'

import { useState } from 'react'
import OptionCard from '../OptionCard'
import PhotoOptionCard from '../PhotoOptionCard'
import { NAVY, BLUE } from '../quizTheme'
import type { EntryPath } from '../../../utils/quizFlow'
import { Home, GraduationCap, Briefcase, Car, Users, Compass } from 'lucide-react'

const STANDARD_OPTIONS = [
  { key: 'raising_family', image: '/images/quiz/raising-family.JPG', label: "We're raising a family and looking for the right place to put down roots" },
  { key: 'first_home', image: '/images/quiz/first-home.JPG', label: "We're buying our first home and want to maximize opportunity" },
  { key: 'career', image: '/images/quiz/career-move.JPG', label: 'My career is driving this move' },
  { key: 'luxury', image: '/images/quiz/luxury-lifestyle.JPG', label: "We're looking for a higher-end lifestyle or luxury community" },
  { key: 'next_chapter', image: '/images/quiz/next-chapter.JPG', label: "We're preparing for our next chapter and simplifying life" },
  { key: 'freedom', image: '/images/quiz/lifestyle-freedom.JPG', label: "We're looking for more freedom, flexibility, and a lifestyle change" },
] as const

const INSTATE_OPTIONS = [
  { key: 'schools', icon: GraduationCap, label: 'Better schools for my family' },
  { key: 'more_house', icon: Home, label: 'More house for the money' },
  { key: 'commute', icon: Car, label: 'Shorter commute or better access' },
  { key: 'closer_family', icon: Users, label: 'I want to be closer to family' },
  { key: 'lifestyle_change', icon: Compass, label: "I'm ready for a lifestyle change" },
  { key: 'new_career', icon: Briefcase, label: 'A new career opportunity' },
] as const

export const ARCHETYPE_MAP: Record<string, string> = {
  raising_family: 'family',
  first_home: 'firsttime',
  career: 'executive',
  luxury: 'luxury',
  next_chapter: 'retiree',
  freedom: 'youngpro',
}

interface Card2MovingReasonProps {
  initialValue?: string
  path: EntryPath
  onComplete: (optionKey: string, archetype?: string) => void
}

export default function Card2MovingReason({ initialValue, path, onComplete }: Card2MovingReasonProps) {
  const [selected, setSelected] = useState<string | null>(initialValue ?? null)

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: NAVY }}>
        {path === 'instate' ? "What's driving your next move?" : "What's bringing you to Texas?"}
      </h1>
      <p className="text-gray-500 mb-8">We&apos;ll use this to tailor your community recommendations.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {path === 'instate'
          ? INSTATE_OPTIONS.map(opt => (
              <OptionCard
                key={opt.key}
                icon={opt.icon}
                title={opt.label}
                selected={selected === opt.key}
                onClick={() => setSelected(opt.key)}
              />
            ))
          : STANDARD_OPTIONS.map(opt => (
              <PhotoOptionCard
                key={opt.key}
                imageUrl={opt.image}
                title={opt.label}
                selected={selected === opt.key}
                onClick={() => setSelected(opt.key)}
              />
            ))}
      </div>

      <button
        type="button"
        disabled={!selected}
        onClick={() => selected && onComplete(selected, path === 'instate' ? undefined : ARCHETYPE_MAP[selected])}
        className="w-full py-3.5 rounded-xl font-bold text-sm transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: BLUE, color: '#FFFFFF' }}
      >
        Continue
      </button>
    </div>
  )
}
