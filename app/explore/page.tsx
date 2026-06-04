'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import FormProgress from '../../components/form/FormProgress'
import IncomeForm from '../../components/form/IncomeForm'
import HouseholdForm from '../../components/form/HouseholdForm'
import FinancialPictureStep from '../../components/quiz/FinancialPictureStep'
import PrioritySelector from '../../components/form/PrioritySelector'
import { UserProfile, BuyerProfile, LifestyleScores, FinancialPicture } from '../../types'
import { SESSION_PROFILE_KEY, SESSION_MATCHES_KEY } from '../../utils/constants'
import { initSession, updateSessionStep } from '../../services/quizSessionService'

const STEPS = ['Income', 'Household & Dream Home', 'Financial Picture', 'Priorities']

const STEP_HEADLINES = [
  "Let's find your Texas city",
  'Tell us about your household and dream home',
  "Now let's talk about your purchasing power.",
  'What matters most to you?',
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
    buyerProfile: BuyerProfile
  }) => {
    setProfile(p => ({ ...p, householdSize: data.householdSize, buyerProfile: data.buyerProfile }))
    updateSessionStep(sessionId, 2, {})
    setStep(2)
  }

  const handleFinancialPicture = (financial_picture: FinancialPicture) => {
    const timelineMap: Record<FinancialPicture['purchase_timeline'], UserProfile['movingTimeline']> = {
      '0-3months':  '0-3months',
      '3-6months':  '3-6months',
      '6-12months': '6-12months',
      'exploring':  'exploring',
    }
    const movingTimeline = timelineMap[financial_picture.purchase_timeline]
    setProfile(p => ({ ...p, financial_picture, movingTimeline }))
    updateSessionStep(sessionId, 3, {})
    setStep(3)
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
    sessionStorage.removeItem('hq_metro')
  sessionStorage.removeItem(SESSION_MATCHES_KEY)
    updateSessionStep(sessionId, 4, { mustHaves, niceToHaves, notPriorities })
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
            {step === 3 && <PrioritySelector onComplete={handlePriorities} />}

            {step === 1 && (
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
