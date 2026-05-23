'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import FormProgress from '../../components/form/FormProgress'
import ModeSelector from '../../components/form/ModeSelector'
import IncomeForm from '../../components/form/IncomeForm'
import HouseholdForm from '../../components/form/HouseholdForm'
import TimelineForm from '../../components/form/TimelineForm'
import PrioritySelector from '../../components/form/PrioritySelector'
import { UserProfile, LifestyleScores } from '../../types'
import { SESSION_PROFILE_KEY, SESSION_METRO_KEY, SESSION_ID_KEY } from '../../utils/constants'

const STEPS = ['Metro', 'Income', 'Household', 'Timeline', 'Priorities']

const METRO_LABELS: Record<string, string> = {
  austin: 'Austin Metro',
  dallas: 'Dallas-Fort Worth',
  houston: 'Houston Metro',
  sanAntonio: 'San Antonio Metro',
}

type PartialProfile = Partial<Omit<UserProfile, 'mustHaves' | 'niceToHaves' | 'notPriorities'>>

export default function MetroPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [metro, setMetro] = useState('')
  const [profile, setProfile] = useState<PartialProfile>({})

  const handleMetro = (metroId: string) => {
    setMetro(metroId)
    setStep(1)
  }

  const handleIncome = (annualIncome: number) => {
    setProfile(p => ({ ...p, annualIncome }))
    setStep(2)
  }

  const handleHousehold = (data: {
    householdSize: UserProfile['householdSize']
    housingPreference: UserProfile['housingPreference']
  }) => {
    setProfile(p => ({ ...p, ...data }))
    setStep(3)
  }

  const handleTimeline = (movingTimeline: UserProfile['movingTimeline']) => {
    setProfile(p => ({ ...p, movingTimeline }))
    setStep(4)
  }

  const handlePriorities = (
    mustHaves: (keyof LifestyleScores)[],
    niceToHaves: (keyof LifestyleScores)[],
    notPriorities: (keyof LifestyleScores)[]
  ) => {
    const finalProfile: UserProfile = {
      ...(profile as UserProfile),
      mustHaves,
      niceToHaves,
      notPriorities,
    }
    sessionStorage.setItem(SESSION_PROFILE_KEY, JSON.stringify(finalProfile))
    sessionStorage.setItem(SESSION_METRO_KEY, metro)
    const sessionId = crypto.randomUUID()
    sessionStorage.setItem(SESSION_ID_KEY, sessionId)
    router.push(`/results/${sessionId}`)
  }

  const subtitle = metro && step > 0
    ? `Finding the best cities in ${METRO_LABELS[metro] ?? metro}`
    : 'Match to the best city in your chosen metro'

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="bg-[#08101C] border-b border-white/8 px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <p className="text-blue-400/60 text-[11px] font-bold uppercase tracking-widest mb-3">
              Step {step + 1} of {STEPS.length} · {STEPS[step]}
            </p>
            <h1 className="text-2xl font-bold text-white tracking-tight">Metro Mode</h1>
            <p className="text-white/40 text-sm mt-1.5">{subtitle}</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div
            className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100"
            style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.08)' }}
          >
            <FormProgress step={step} totalSteps={STEPS.length} stepLabels={STEPS} />

            {step === 0 && <ModeSelector onComplete={handleMetro} />}
            {step === 1 && <IncomeForm onComplete={handleIncome} defaultValue={profile.annualIncome} />}
            {step === 2 && <HouseholdForm onComplete={handleHousehold} />}
            {step === 3 && <TimelineForm onComplete={handleTimeline} />}
            {step === 4 && <PrioritySelector onComplete={handlePriorities} />}

            {step > 0 && step < 4 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="mt-4 w-full text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium"
              >
                ← Back
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
