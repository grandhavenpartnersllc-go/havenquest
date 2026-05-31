'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import FormProgress from '../../components/form/FormProgress'
import IncomeForm from '../../components/form/IncomeForm'
import HouseholdForm from '../../components/form/HouseholdForm'
import FinancialPictureStep from '../../components/quiz/FinancialPictureStep'
import TimelineForm from '../../components/form/TimelineForm'
import PrioritySelector from '../../components/form/PrioritySelector'
import BuyerProfileStep from '../../components/form/BuyerProfileStep'
import { UserProfile, BuyerProfile, LifestyleScores, FinancialPicture } from '../../types'
import { SESSION_PROFILE_KEY } from '../../utils/constants'
import { initSession, updateSessionStep } from '../../services/quizSessionService'

const STEPS = ['Income', 'Household', 'Financial Picture', 'Timeline', 'Priorities', 'Buyer Profile']

const STEP_HEADLINES = [
  "Let's find your Texas city",
  'Tell us about your household',
  "Now let's talk about your purchasing power.",
  'What matters most to you?',
  'Set your priorities',
  "Now let's talk about your home",
]

type PartialProfile = Partial<UserProfile>

export default function ExplorePage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<PartialProfile>({})
  const [sessionId, setSessionId] = useState<string>('')

  useEffect(() => {
    initSession().then(id => setSessionId(id))
  }, [])

  const handleIncome = (annualIncome: number) => {
    setProfile(p => ({ ...p, annualIncome }))
    updateSessionStep(sessionId, 1, { annualIncome })
    setStep(1)
  }

  const handleHousehold = (data: {
    householdSize: UserProfile['householdSize']
    housingPreference: UserProfile['housingPreference']
  }) => {
    setProfile(p => ({ ...p, ...data }))
    updateSessionStep(sessionId, 2, { housingPreference: data.housingPreference })
    setStep(2)
  }

  const handleFinancialPicture = (financial_picture: FinancialPicture) => {
    setProfile(p => ({ ...p, financial_picture }))
    updateSessionStep(sessionId, 3, {})
    setStep(3)
  }

  const handleTimeline = (movingTimeline: UserProfile['movingTimeline']) => {
    setProfile(p => ({ ...p, movingTimeline }))
    updateSessionStep(sessionId, 4, { movingTimeline })
    setStep(4)
  }

  const handlePriorities = (
    mustHaves: (keyof LifestyleScores)[],
    niceToHaves: (keyof LifestyleScores)[],
    notPriorities: (keyof LifestyleScores)[]
  ) => {
    setProfile(p => ({ ...p, mustHaves, niceToHaves, notPriorities }))
    updateSessionStep(sessionId, 5, { mustHaves, niceToHaves, notPriorities })
    setStep(5)
  }

  const handleBuyerProfile = (buyerProfile: BuyerProfile) => {
    const finalProfile: UserProfile = {
      ...(profile as UserProfile),
      buyerProfile,
    }
    sessionStorage.setItem(SESSION_PROFILE_KEY, JSON.stringify(finalProfile))
    sessionStorage.removeItem('hq_metro')
    updateSessionStep(sessionId, 6, { buyerProfile })
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
            <h1 className="text-2xl font-bold text-white tracking-tight">{STEP_HEADLINES[step]}</h1>
            <p className="text-white/40 text-sm mt-1.5">Matching you to the right Texas city</p>
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
            {step === 2 && (
              <FinancialPictureStep
                onNext={handleFinancialPicture}
                onBack={() => setStep(1)}
                initialData={profile.financial_picture}
              />
            )}
            {step === 3 && <TimelineForm onComplete={handleTimeline} />}
            {step === 4 && <PrioritySelector onComplete={handlePriorities} />}
            {step === 5 && <BuyerProfileStep onComplete={handleBuyerProfile} />}

            {step > 0 && step < STEPS.length - 1 && step !== 2 && (
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
