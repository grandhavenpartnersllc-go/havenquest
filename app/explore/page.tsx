'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import FormProgress from '../../components/form/FormProgress'
import IncomeForm from '../../components/form/IncomeForm'
import HouseholdForm from '../../components/form/HouseholdForm'
import TimelineForm from '../../components/form/TimelineForm'
import PrioritySelector from '../../components/form/PrioritySelector'
import BuyerProfileStep from '../../components/form/BuyerProfileStep'
import { UserProfile, BuyerProfile, LifestyleScores } from '../../types'
import { SESSION_PROFILE_KEY, SESSION_ID_KEY } from '../../utils/constants'

const STEPS = ['Income', 'Household', 'Timeline', 'Priorities', 'Buyer Profile']

type PartialProfile = Partial<UserProfile>

export default function ExplorePage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<PartialProfile>({})

  const handleIncome = (annualIncome: number) => {
    setProfile(p => ({ ...p, annualIncome }))
    setStep(1)
  }

  const handleHousehold = (data: {
    householdSize: UserProfile['householdSize']
    housingPreference: UserProfile['housingPreference']
  }) => {
    setProfile(p => ({ ...p, ...data }))
    setStep(2)
  }

  const handleTimeline = (movingTimeline: UserProfile['movingTimeline']) => {
    setProfile(p => ({ ...p, movingTimeline }))
    setStep(3)
  }

  const handlePriorities = (
    mustHaves: (keyof LifestyleScores)[],
    niceToHaves: (keyof LifestyleScores)[],
    notPriorities: (keyof LifestyleScores)[]
  ) => {
    setProfile(p => ({ ...p, mustHaves, niceToHaves, notPriorities }))
    setStep(4)
  }

  const handleBuyerProfile = (buyerProfile: BuyerProfile) => {
    const finalProfile: UserProfile = {
      ...(profile as UserProfile),
      buyerProfile,
    }
    sessionStorage.setItem(SESSION_PROFILE_KEY, JSON.stringify(finalProfile))
    sessionStorage.removeItem('hq_metro')
    const sessionId = crypto.randomUUID()
    sessionStorage.setItem(SESSION_ID_KEY, sessionId)
    router.push(`/results/${sessionId}`)
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="bg-[#08101C] border-b border-white/8 px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <p className="text-blue-400/60 text-[11px] font-bold uppercase tracking-widest mb-3">
              Step {step + 1} of {STEPS.length} · {STEPS[step]}
            </p>
            <h1 className="text-2xl font-bold text-white tracking-tight">Find your Texas city</h1>
            <p className="text-white/40 text-sm mt-1.5">Across 5 Texas metros and 48 submarkets</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div
            className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100"
            style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.08)' }}
          >
            <FormProgress step={step} totalSteps={STEPS.length} stepLabels={STEPS} />

            {step === 0 && <IncomeForm onComplete={handleIncome} defaultValue={profile.annualIncome} />}
            {step === 1 && <HouseholdForm onComplete={handleHousehold} />}
            {step === 2 && <TimelineForm onComplete={handleTimeline} />}
            {step === 3 && <PrioritySelector onComplete={handlePriorities} />}
            {step === 4 && <BuyerProfileStep onComplete={handleBuyerProfile} />}

            {step > 0 && step < STEPS.length - 1 && (
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
