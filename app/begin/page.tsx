'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BeginHeader from '../../components/quiz/BeginHeader'
import Footer from '../../components/shared/Footer'
import { Check } from 'lucide-react'
import Gateway from '../../components/quiz/Gateway'
import MetroCaptureCard, { type MetroCaptureValue } from '../../components/quiz/MetroCaptureCard'
import QuizProgress from '../../components/quiz/QuizProgress'
import { NAVY, BLUE, STONE } from '../../components/quiz/quizTheme'
import Card1Household from '../../components/quiz/cards/Card1Household'
import Card2MovingReason from '../../components/quiz/cards/Card2MovingReason'
import Card3Priorities, { type Card3Result } from '../../components/quiz/cards/Card3Priorities'
import Card4CommunityFeel, { type PersonalityScores } from '../../components/quiz/cards/Card4CommunityFeel'
import Card5GrowthProfile from '../../components/quiz/cards/Card5GrowthProfile'
import Card6LifestyleOrientation from '../../components/quiz/cards/Card6LifestyleOrientation'
import Card7Situation from '../../components/quiz/cards/Card7Situation'
import Card8WorkLife from '../../components/quiz/cards/Card8WorkLife'
import Card9Financial from '../../components/quiz/cards/Card9Financial'
import Card10MetroCuriosity from '../../components/quiz/cards/Card10MetroCuriosity'
import { CARD_FLOW, getProgressLabel, type EntryPath } from '../../utils/quizFlow'
import {
  bucketHouseholdSize,
  mapMoveTimeline,
  incomeRangeMidpoint,
  buildFinancialPicture,
  buildQuizFinancialData,
  resolveArchetype,
  type MoveTimelineValue,
  type Card9Answers,
} from '../../utils/quizProfileMapping'
import { initSession, updateSessionStep } from '../../services/quizSessionService'
import { lookupZipCityState } from '../../utils/zipLookup'
import { trackEvent } from '../../utils/analytics'
import { SESSION_PROFILE_KEY, SESSION_METRO_KEY, SESSION_MATCHES_KEY } from '../../utils/constants'
import { UserProfile, PersonalityPreference } from '../../types'

const LOCAL_SESSION_KEY = 'hq_session'
const PROGRESS_KEY = 'hq_quiz_progress'

const WHAT_YOULL_COVER = [
  'Your household size and home preferences',
  'Your annual household income',
  'Your lifestyle priorities — schools, safety, walkability, and more',
  'Your budget and down payment range',
]

// Demo-mode disclosure copy for Discovery Intake screen 1 (the honest split): what the
// working model actually does vs. what is still being built. Copy only — no algorithm
// internals, no scoring mechanics.
const WHATS_REAL = [
  'The communities, and the journey you\'re about to walk',
  'School ratings and property tax rates, from public sources',
  'The matching engine — it genuinely responds to your answers',
]

const WHATS_NOT_YET = [
  'Community scores are expert estimates across a limited dataset, not verified data',
  'Monthly cost figures are rough estimates, never a quote',
  'Some communities carry more data than others, so results skew',
]

const METRO_TO_ID: Record<MetroCaptureValue, string | null> = {
  Austin: 'austin',
  'Dallas–Fort Worth': 'dallas',
  Houston: 'houston',
  'San Antonio': 'sanAntonio',
  'Hill Country': null,
  "I'm not sure yet": null,
}

// MM3 portal logic (components/portal/MileMarkerContent.tsx, app/portal/mm3/page.tsx)
// still keys off the legacy two-way `hq_path` ('explore' | 'metro'). explorer/exploring
// are statewide (closest to the old "explore"); directed/instate already have a
// specific area in mind (closest to the old "metro").
const ENTRY_PATH_TO_LEGACY: Record<EntryPath, 'explore' | 'metro'> = {
  explorer: 'explore',
  exploring: 'explore',
  directed: 'metro',
  instate: 'metro',
}

type Phase = 'intent' | 'nameZip' | 'resume' | 'gateway' | 'metro' | 'cards'

interface QuizAnswers {
  householdSize?: number
  movingReasonKey?: string
  archetype?: string
  card3?: Card3Result
  communityFeel?: string
  personality?: PersonalityScores
  growthProfile?: number
  lifestyleOrientation?: number
  homeStatus?: string
  moveTimeline?: MoveTimelineValue
  workSituation?: string
  card9?: Card9Answers
  metroPreference?: string[]
  targetMetro?: MetroCaptureValue
}

interface StoredProgress {
  entryPath: EntryPath
  cardIndex: number
  answers: QuizAnswers
  sessionId: string
  firstName: string
  originZip: string
  email: string
}

export default function BeginPage() {
  const router = useRouter()

  const [phase, setPhase] = useState<Phase>('intent')
  const [firstName, setFirstName] = useState('')
  const [firstNameError, setFirstNameError] = useState('')
  const [zip, setZip] = useState('')
  const [zipError, setZipError] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const [sessionId, setSessionId] = useState('')
  const [entryPath, setEntryPath] = useState<EntryPath | null>(null)
  const [cardIndex, setCardIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [resumeData, setResumeData] = useState<StoredProgress | null>(null)

  // On mount, offer to resume an in-progress quiz.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PROGRESS_KEY)
      if (raw) {
        const parsed: StoredProgress = JSON.parse(raw)
        if (parsed.sessionId && parsed.entryPath) {
          setResumeData(parsed)
          setPhase('resume')
        }
      }
    } catch {}
  }, [])

  function persistProgress(next: { entryPath: EntryPath; cardIndex: number; answers: QuizAnswers }) {
    try {
      sessionStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({ ...next, sessionId, firstName, originZip: zip, email })
      )
    } catch {}
  }

  function resumeQuiz() {
    if (!resumeData) return
    setSessionId(resumeData.sessionId)
    setFirstName(resumeData.firstName)
    setZip(resumeData.originZip)
    setEmail(resumeData.email ?? '')
    setEntryPath(resumeData.entryPath)
    setCardIndex(resumeData.cardIndex)
    setAnswers(resumeData.answers)
    setPhase('cards')
  }

  function startOver() {
    sessionStorage.removeItem(PROGRESS_KEY)
    sessionStorage.removeItem('hq_entry_path')
    setResumeData(null)
    setPhase('intent')
  }

  function handleIntentStart() {
    sessionStorage.setItem('hq_journey_intent', 'true')
    sessionStorage.setItem('hq_journey_intent_at', new Date().toISOString())
    setPhase('nameZip')
  }

  async function handleNameZipSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName.trim()) {
      setFirstNameError('First name is required')
      return
    }
    setFirstNameError('')
    if (!/^\d{5}$/.test(zip)) {
      setZipError('Please enter a valid 5-digit ZIP code')
      return
    }
    setZipError('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address')
      return
    }
    setEmailError('')
    const trimmedName = firstName.trim()
    const trimmedZip = zip.trim()
    const trimmedEmail = email.trim().toLowerCase()
    sessionStorage.setItem('hq_first_name', trimmedName)
    sessionStorage.setItem('hq_origin_zip', trimmedZip)
    sessionStorage.setItem('hq_email', trimmedEmail)
    void lookupZipCityState(trimmedZip).then(result => {
      if (result?.city) sessionStorage.setItem('hq_origin_city', result.city)
      if (result?.state) sessionStorage.setItem('hq_origin_state', result.state)
    })
    fetch(`/api/origin-market-data?zip=${trimmedZip}`)
      .then(res => res.json())
      .then(data => {
        if (data?.medianHomeValue || data?.medianRealEstateTaxes) {
          sessionStorage.setItem('hq_origin_market_data', JSON.stringify(data))
        }
      })
      .catch(() => {})
    const rawSession = localStorage.getItem(LOCAL_SESSION_KEY)
    if (rawSession) {
      try {
        const sess = JSON.parse(rawSession)
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ ...sess, firstName: trimmedName }))
      } catch {}
    }
    const id = await initSession({ firstName: trimmedName, originZip: trimmedZip, email: trimmedEmail })
    setSessionId(id)
    fetch('/api/quiz-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: trimmedName, email: trimmedEmail }),
    }).catch(() => {})
    setPhase('gateway')
  }

  function handleGatewaySelect(path: EntryPath) {
    setEntryPath(path)
    sessionStorage.setItem('hq_entry_path', path)
    sessionStorage.setItem('hq_path', ENTRY_PATH_TO_LEGACY[path])
    sessionStorage.removeItem(PROGRESS_KEY)
    updateSessionStep(sessionId, 0, { entryPath: path })
  }

  function handleGatewayContinue() {
    if (!entryPath) return
    sessionStorage.removeItem(PROGRESS_KEY)
    trackEvent('gateway_selected', { sessionId, entry_path: entryPath })
    setPhase(entryPath === 'directed' ? 'metro' : 'cards')
    setCardIndex(0)
  }

  function handleMetroComplete(metro: MetroCaptureValue) {
    const metroId = METRO_TO_ID[metro]
    const updatedAnswers = { ...answers, targetMetro: metro }
    setAnswers(updatedAnswers)
    sessionStorage.setItem('hq_target_metro', metro)
    updateSessionStep(sessionId, 1, { targetMetro: metroId ?? metro })
    if (entryPath) {
      persistProgress({ entryPath, cardIndex: 0, answers: updatedAnswers })
    }
    setPhase('cards')
    setCardIndex(0)
  }

  function flowFor(path: EntryPath) {
    return CARD_FLOW[path]
  }

  function screenPosition(path: EntryPath, idx: number) {
    return path === 'directed' ? idx + 2 : idx + 1
  }

  // Mirrors each card's write to the brief's specified hq_* sessionStorage keys
  // (Part 4), independent of the Supabase write — kept for Brief 2 to read from.
  function mirrorToSessionStorage(sessionData: Parameters<typeof updateSessionStep>[2]) {
    const map: [keyof typeof sessionData, string][] = [
      ['householdSize', 'hq_household_size'],
      ['archetype', 'hq_archetype'],
      ['communityFeel', 'hq_community_feel'],
      ['growthProfile', 'hq_growth_profile'],
      ['lifestyleOrientation', 'hq_lifestyle_orientation'],
      ['homeStatus', 'hq_home_status'],
      ['movingTimeline', 'hq_move_timeline'],
      ['workSituation', 'hq_work_situation'],
      ['targetMetro', 'hq_target_metro'],
    ]
    map.forEach(([key, storageKey]) => {
      const value = sessionData[key]
      if (value !== undefined) sessionStorage.setItem(storageKey, String(value))
    })
    if (sessionData.priorities !== undefined) sessionStorage.setItem('hq_priorities', JSON.stringify(sessionData.priorities))
    if (sessionData.financialData !== undefined) sessionStorage.setItem('hq_financial', JSON.stringify(sessionData.financialData))
    if (sessionData.metroPreference !== undefined) sessionStorage.setItem('hq_metro_preference', JSON.stringify(sessionData.metroPreference))
  }

  function goNext(nextAnswers: QuizAnswers, sessionData: Parameters<typeof updateSessionStep>[2]) {
    if (!entryPath) return
    const flow = flowFor(entryPath)
    const merged = { ...answers, ...nextAnswers }
    setAnswers(merged)
    mirrorToSessionStorage(sessionData)

    const cardsAnswered = cardIndex + 1
    const completionPercentage = Math.round((cardsAnswered / flow.length) * 100)
    updateSessionStep(sessionId, cardIndex + 1, sessionData)
    trackEvent('card_completed', {
      sessionId,
      cardId: flow[cardIndex].id,
      entryPath,
      cardsAnswered,
      completionPercentage,
    })

    if (cardIndex + 1 >= flow.length) {
      finishQuiz(merged)
      return
    }
    const next = cardIndex + 1
    setCardIndex(next)
    persistProgress({ entryPath, cardIndex: next, answers: merged })
  }

  function goBack() {
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1)
    }
  }

  function handleSkip() {
    if (!entryPath) return
    const flow = flowFor(entryPath)
    trackEvent('card_skipped', { sessionId, cardId: flow[cardIndex].id, entryPath })
    if (cardIndex + 1 >= flow.length) {
      finishQuiz(answers)
      return
    }
    const next = cardIndex + 1
    setCardIndex(next)
    persistProgress({ entryPath, cardIndex: next, answers })
  }

  function finishQuiz(finalAnswers: QuizAnswers) {
    if (!entryPath) return

    const householdSize = bucketHouseholdSize(finalAnswers.householdSize ?? 2)
    const moveTimeline = finalAnswers.moveTimeline ?? 'exploring'
    const movingTimeline = mapMoveTimeline(moveTimeline)
    const mustHaves = finalAnswers.card3?.mustHaves ?? []
    const niceToHaves = finalAnswers.card3?.niceToHaves ?? []
    const notPriorities = finalAnswers.card3?.notPriorities ?? []
    const unassignedPriorities = finalAnswers.card3?.unassignedPriorities ?? []
    const annualIncome = finalAnswers.card9 ? incomeRangeMidpoint(finalAnswers.card9.incomeRange) : 162_500
    const financial_picture = finalAnswers.card9
      ? buildFinancialPicture(finalAnswers.card9, moveTimeline)
      : undefined

    const archetype = resolveArchetype(finalAnswers.archetype)
    // finalAnswers.personality (Card 4's environment/pace/culture) and the
    // growthProfile/lifestyleOrientation sliders are already camelCase and
    // shaped exactly like PersonalityPreference here — buildPersonalityPreference
    // (utils/quizProfileMapping.ts) is for the snake_case Supabase-row shape used
    // server-side; building it directly is simpler for this client-side source.
    const personalityPreference: PersonalityPreference = {
      growthProfile: finalAnswers.growthProfile ?? 5,
      lifestyleOrientation: finalAnswers.lifestyleOrientation ?? 5,
      environment: finalAnswers.personality?.environment ?? 5,
      pace: finalAnswers.personality?.pace ?? 5,
      culture: finalAnswers.personality?.culture ?? 5,
    }

    const profile: UserProfile = {
      annualIncome,
      householdSize,
      movingTimeline,
      mustHaves,
      niceToHaves,
      notPriorities,
      unassignedPriorities,
      financial_picture,
      archetype,
      personalityPreference,
    }
    sessionStorage.setItem(SESSION_PROFILE_KEY, JSON.stringify(profile))
    sessionStorage.removeItem(SESSION_MATCHES_KEY)

    let metroId = finalAnswers.targetMetro ? METRO_TO_ID[finalAnswers.targetMetro] : null
    // For instate/exploring/explorer paths: no metro capture screen, but card 10 may
    // have captured a single metroPreference. Use it to write hq_metro when unambiguous.
    if (!metroId && finalAnswers.metroPreference?.length === 1) {
      const prefLabel = finalAnswers.metroPreference[0] as MetroCaptureValue
      metroId = METRO_TO_ID[prefLabel] ?? null
    }
    if (metroId) sessionStorage.setItem(SESSION_METRO_KEY, metroId)
    else sessionStorage.removeItem(SESSION_METRO_KEY)

    trackEvent('quiz_completed', { sessionId, entryPath, cardsAnswered: flowFor(entryPath).length })
    sessionStorage.removeItem(PROGRESS_KEY)

    router.push(`/results/${sessionId}`)
  }

  const flow = entryPath ? flowFor(entryPath) : []
  const currentStep = flow[cardIndex]

  return (
    <>
      <BeginHeader />
      <main className="flex-1" style={{ background: STONE }}>
        <div className="mx-auto max-w-[1000px] px-6 pt-[22px] pb-11 max-[460px]:px-[14px] max-[460px]:pt-[18px] max-[460px]:pb-[34px]">

          {phase === 'resume' && resumeData && (
            <div style={{ maxWidth: '480px' }}>
              <h1 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>
                Continue where you left off?
              </h1>
              <p className="text-gray-500 mb-8">
                Looks like you were partway through your HavenQuest Discovery.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resumeQuiz}
                  className="flex-1 py-3 rounded-xl font-bold text-sm"
                  style={{ backgroundColor: BLUE, color: '#FFFFFF' }}
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={startOver}
                  className="flex-1 py-3 rounded-xl font-bold text-sm border-2"
                  style={{ borderColor: '#E5E7EB', color: NAVY }}
                >
                  Start Over
                </button>
              </div>
            </div>
          )}

          {phase === 'intent' && (
            <div style={{ width: 'min(980px, calc(100vw - 48px))', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>
              {/* Break out of the shared max-w-[1000px] page container to a centered ~980px column;
                  scrollbar-safe min() keeps a >=24px gutter and never overflows. Content left-aligned.
                  Intent phase only. */}

              {/* Top matter — constrained for readable line length, left-aligned */}
              <div style={{ maxWidth: '680px' }}>
                {/* Brand line */}
                <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: '18px' }}>
                  <span style={{ color: NAVY }}>Haven</span>
                  <span style={{ color: BLUE }}>Quest</span>
                  <span style={{ color: '#9AA3B0', fontWeight: 600 }}> Navigator</span>
                </p>

                {/* Eyebrow — DEMO MODE, gold-deep (#8A7454) */}
                <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-hq-gold-deep)', fontWeight: 700, marginBottom: '14px' }}>
                  Demo Mode
                </p>

                {/* Headline */}
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: NAVY, letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: '12px' }}>
                  You&apos;re looking at a working model.
                </h1>

                {/* Lede */}
                <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.7, marginBottom: '24px' }}>
                  Everything here runs — the questions, the matching, the numbers.{' '}
                  <span style={{ fontWeight: 600, color: NAVY }}>What sits behind them isn&apos;t finished.</span>{' '}
                  We&apos;re showing you the experience while the data underneath it is still being built.
                </p>
              </div>

              {/* Pair — the two honesty cards argue against each other; equal-height columns */}
              <div className="grid grid-cols-1 min-[900px]:grid-cols-2 gap-[18px] items-stretch">
                {/* What's real */}
                <div style={{ border: '0.5px solid var(--color-border-tertiary)', borderRadius: '12px', padding: '18px 20px', background: '#ffffff' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: NAVY, fontWeight: 700, marginBottom: '12px' }}>
                    What&apos;s real
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                    {WHATS_REAL.map((item) => (
                      <div key={item} style={{ display: 'flex', flexDirection: 'row', gap: '9px', alignItems: 'flex-start' }}>
                        <Check size={13} color={BLUE} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span style={{ fontSize: '13px', color: NAVY, lineHeight: 1.45 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* What isn't yet */}
                <div style={{ border: '0.5px solid var(--color-border-tertiary)', borderRadius: '12px', padding: '18px 20px', background: '#ffffff' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: NAVY, fontWeight: 700, marginBottom: '12px' }}>
                    What isn&apos;t yet
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                    {WHATS_NOT_YET.map((item) => (
                      <div key={item} style={{ display: 'flex', flexDirection: 'row', gap: '9px', alignItems: 'flex-start' }}>
                        <span aria-hidden="true" style={{ flexShrink: 0, width: '5px', height: '5px', borderRadius: '50%', background: 'var(--color-hq-slate-2)', marginTop: '7px' }} />
                        <span style={{ fontSize: '13px', color: '#5B6B80', lineHeight: 1.45 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cover card — orientation, a different kind of thing: full width below the pair */}
              <div style={{ border: '0.5px solid var(--color-border-tertiary)', borderRadius: '12px', padding: '18px 20px', background: '#ffffff', marginTop: '18px' }}>
                <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.7, marginBottom: '16px' }}>
                  In the next few minutes, we&apos;ll ask you a few questions about your
                  household, your income, and the lifestyle priorities that matter most to
                  you. There are no wrong answers — just honest ones.
                </p>
                <p style={{ fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#6B7280', marginBottom: '14px' }}>
                  WHAT YOU&apos;LL COVER
                </p>
                <div className="grid grid-cols-1 min-[900px]:grid-cols-2 gap-x-[30px] gap-y-[9px]">
                  {WHAT_YOULL_COVER.map((item) => (
                    <div key={item} style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                      <Check size={14} color={BLUE} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: NAVY }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Closing — constrained for readable line length, left-aligned */}
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.7, marginTop: '24px', marginBottom: '26px', maxWidth: '760px' }}>
                So look at the experience, not the answers.{' '}
                <span style={{ fontWeight: 600, color: NAVY }}>Please don&apos;t base any real decision on what this tells you</span>{' '}
                — where to live, what you can afford, or anything else. Those numbers will move,
                sometimes a lot, as real data replaces what&apos;s here.
              </p>

              {/* CTA — the click is the acknowledgment (no checkbox) */}
              <button
                type="button"
                onClick={handleIntentStart}
                className="hq-focus"
                style={{
                  background: BLUE,
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 500,
                  padding: '14px 32px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                I understand — let&apos;s find your Texas →
              </button>

              {/* Footer — active-beta note, muted, below the CTA */}
              <p style={{ fontSize: '12px', color: '#9AA3B0', lineHeight: 1.6, marginTop: '16px', maxWidth: '560px' }}>
                HavenQuest is in active beta. This model is being refined continuously, and
                everything you see today is on its way to being sourced, dated, and verifiable.
              </p>

            </div>
          )}

          {phase === 'nameZip' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                  Perfect. Let&apos;s make this personal.
                </h2>
                <p className="text-gray-500">
                  We&apos;ll use this to tailor your experience from the start.
                </p>
              </div>
              <form
                onSubmit={handleNameZipSubmit}
                className="bg-white rounded-2xl p-8 space-y-5 max-w-lg"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)' }}
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Your first name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => { setFirstName(e.target.value); setFirstNameError('') }}
                    placeholder="Craig"
                    required
                    autoFocus
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  />
                  {firstNameError && <p className="mt-1.5 text-xs text-red-500">{firstNameError}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    ZIP code you&apos;re moving from <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={zip}
                    onChange={e => { setZip(e.target.value); setZipError('') }}
                    placeholder="60631"
                    required
                    maxLength={5}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  />
                  {zipError && <p className="mt-1.5 text-xs text-red-500">{zipError}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailError('') }}
                    placeholder="your@email.com"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  />
                  {emailError && <p className="mt-1.5 text-xs text-red-500">{emailError}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#1A5FA8', color: '#FFFFFF' }}
                >
                  Let&apos;s Go
                </button>
              </form>
            </div>
          )}

          {phase === 'gateway' && (
            <Gateway selected={entryPath} onSelect={handleGatewaySelect} onContinue={handleGatewayContinue} />
          )}

          {phase === 'metro' && (
            <>
              <QuizProgress {...getProgressLabel('directed', 1)} />
              <MetroCaptureCard onComplete={handleMetroComplete} />
            </>
          )}

          {phase === 'cards' && entryPath && currentStep && (
            <>
              <QuizProgress {...getProgressLabel(entryPath, screenPosition(entryPath, cardIndex))} />

              {currentStep.id === 1 && (
                <Card1Household
                  initialValue={answers.householdSize}
                  onComplete={(v) => goNext({ householdSize: v }, { householdSize: v })}
                  onChangeJourney={() => {
                    sessionStorage.removeItem('hq_entry_path')
                    setEntryPath(null)
                    setPhase('gateway')
                  }}
                />
              )}

              {currentStep.id === 2 && (
                <>
                  <Card2MovingReason
                    onBack={goBack}
                    initialValue={answers.movingReasonKey}
                    path={entryPath}
                    onComplete={(key, archetype) =>
                      goNext({ movingReasonKey: key, archetype }, { archetype })
                    }
                  />
                </>
              )}

              {currentStep.id === 3 && (
                <>
                  <Card3Priorities
                    onBack={goBack}
                    initialValue={answers.card3}
                    onComplete={(result) => goNext({ card3: result }, { priorities: result.priorities })}
                  />
                </>
              )}

              {currentStep.id === 4 && (
                <>
                  <Card4CommunityFeel
                    onBack={goBack}
                    initialValue={answers.communityFeel}
                    onComplete={(option, personality) => {
                      sessionStorage.setItem('hq_personality_partial', JSON.stringify(personality))
                      goNext(
                        { communityFeel: option, personality },
                        { communityFeel: option, environment: personality.environment, pace: personality.pace, culture: personality.culture }
                      )
                    }}
                  />
                </>
              )}

              {currentStep.id === 5 && (
                <>
                  <Card5GrowthProfile
                    onBack={goBack}
                    initialValue={answers.growthProfile}
                    onComplete={(v) => goNext({ growthProfile: v }, { growthProfile: v })}
                  />
                </>
              )}

              {currentStep.id === 6 && (
                <div>
                  <Card6LifestyleOrientation
                    onBack={goBack}
                    initialValue={answers.lifestyleOrientation}
                    onComplete={(v) => goNext({ lifestyleOrientation: v }, { lifestyleOrientation: v })}
                  />
                  {!currentStep.required && (
                    <div className="max-w-5xl mx-auto px-4 -mt-4">
                      <button type="button" onClick={handleSkip} className="text-sm text-gray-400 hover:text-gray-600">
                        Skip this question →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {currentStep.id === 7 && (
                <div>
                  <Card8WorkLife
                    onBack={goBack}
                    initialValue={answers.workSituation}
                    onComplete={(workSituation) => goNext({ workSituation }, { workSituation })}
                  />
                  {!currentStep.required && (
                    <div className="max-w-5xl mx-auto px-4 -mt-4">
                      <button type="button" onClick={handleSkip} className="text-sm text-gray-400 hover:text-gray-600">
                        Skip this question →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {currentStep.id === 8 && (
                <div>
                  <Card7Situation
                    onBack={goBack}
                    initialValue={
                      answers.homeStatus !== undefined && answers.moveTimeline !== undefined
                        ? { homeStatus: answers.homeStatus, moveTimeline: answers.moveTimeline }
                        : undefined
                    }
                    path={entryPath}
                    onComplete={(homeStatus, moveTimeline) =>
                      goNext({ homeStatus, moveTimeline }, { homeStatus, movingTimeline: moveTimeline })
                    }
                  />
                  {!currentStep.required && (
                    <div className="max-w-5xl mx-auto px-4 -mt-4">
                      <button type="button" onClick={handleSkip} className="text-sm text-gray-400 hover:text-gray-600">
                        Skip this question →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {currentStep.id === 9 && (
                <div>
                  <Card9Financial
                    onBack={goBack}
                    initialValue={answers.card9}
                    path={entryPath}
                    onComplete={(card9) => goNext({ card9 }, { financialData: buildQuizFinancialData(card9) })}
                  />
                  {!currentStep.required && (
                    <div className="max-w-5xl mx-auto px-4 -mt-4">
                      <button type="button" onClick={handleSkip} className="text-sm text-gray-400 hover:text-gray-600">
                        Skip this question →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {currentStep.id === 10 && (
                <>
                  <Card10MetroCuriosity
                    onBack={goBack}
                    initialValue={answers.metroPreference}
                    onComplete={(metros) => goNext({ metroPreference: metros }, { metroPreference: metros })}
                  />
                </>
              )}
            </>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
