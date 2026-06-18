'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import { Check } from 'lucide-react'
import Gateway from '../../components/quiz/Gateway'
import MetroCaptureCard, { type MetroCaptureValue } from '../../components/quiz/MetroCaptureCard'
import QuizProgress from '../../components/quiz/QuizProgress'
import { NAVY, BLUE } from '../../components/quiz/quizTheme'
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
  type MoveTimelineValue,
  type Card9Answers,
} from '../../utils/quizProfileMapping'
import { initSession, updateSessionStep } from '../../services/quizSessionService'
import { trackEvent } from '../../utils/analytics'
import { SESSION_PROFILE_KEY, SESSION_METRO_KEY, SESSION_MATCHES_KEY } from '../../utils/constants'
import { UserProfile } from '../../types'

const LOCAL_SESSION_KEY = 'hq_session'
const PROGRESS_KEY = 'hq_quiz_progress'

const WHAT_YOULL_COVER = [
  'Your household size and home preferences',
  'Your annual household income',
  'Your lifestyle priorities — schools, safety, walkability, and more',
  'Your budget and down payment range',
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
}

export default function BeginPage() {
  const router = useRouter()

  const [phase, setPhase] = useState<Phase>('intent')
  const [intentChecked, setIntentChecked] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [zip, setZip] = useState('')
  const [zipError, setZipError] = useState('')

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
        JSON.stringify({ ...next, sessionId, firstName, originZip: zip })
      )
    } catch {}
  }

  function resumeQuiz() {
    if (!resumeData) return
    setSessionId(resumeData.sessionId)
    setFirstName(resumeData.firstName)
    setZip(resumeData.originZip)
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
    if (!intentChecked) return
    sessionStorage.setItem('hq_journey_intent', 'true')
    sessionStorage.setItem('hq_journey_intent_at', new Date().toISOString())
    setPhase('nameZip')
  }

  async function handleNameZipSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName.trim()) return
    if (!/^\d{5}$/.test(zip)) {
      setZipError('Please enter a valid 5-digit ZIP code')
      return
    }
    setZipError('')
    const trimmedName = firstName.trim()
    const trimmedZip = zip.trim()
    sessionStorage.setItem('hq_first_name', trimmedName)
    sessionStorage.setItem('hq_origin_zip', trimmedZip)
    const rawSession = localStorage.getItem(LOCAL_SESSION_KEY)
    if (rawSession) {
      try {
        const sess = JSON.parse(rawSession)
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ ...sess, firstName: trimmedName }))
      } catch {}
    }
    const id = await initSession({ firstName: trimmedName, originZip: trimmedZip })
    setSessionId(id)
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
    const annualIncome = finalAnswers.card9 ? incomeRangeMidpoint(finalAnswers.card9.incomeRange) : 162_500
    const financial_picture = finalAnswers.card9
      ? buildFinancialPicture(finalAnswers.card9, moveTimeline)
      : undefined

    const profile: UserProfile = {
      annualIncome,
      householdSize,
      movingTimeline,
      mustHaves,
      niceToHaves,
      notPriorities,
      financial_picture,
    }
    sessionStorage.setItem(SESSION_PROFILE_KEY, JSON.stringify(profile))
    sessionStorage.removeItem(SESSION_MATCHES_KEY)

    const metroId = finalAnswers.targetMetro ? METRO_TO_ID[finalAnswers.targetMetro] : null
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
      <Header />
      <main className="flex-1 bg-surface">
        <div className="max-w-3xl mx-auto px-4 py-16 pb-24">

          {phase === 'resume' && resumeData && (
            <div style={{ maxWidth: '480px' }}>
              <h1 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>
                Continue where you left off?
              </h1>
              <p className="text-gray-500 mb-8">
                Looks like you were partway through your HavenQuest assessment.
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
            <div style={{ maxWidth: '600px' }}>
              <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#C5B783', marginBottom: '16px' }}>
                YOUR HAVENQUEST BEGINS HERE
              </p>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: NAVY, marginBottom: '12px' }}>
                Let&apos;s find your Texas.
              </h1>
              <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.8, marginBottom: '24px' }}>
                In the next few minutes, we&apos;ll ask you a few questions about your household, your income, and the lifestyle priorities that matter most to you. There are no wrong answers — just honest ones.
              </p>

              <div style={{
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: '12px',
                padding: '20px 24px',
                background: '#F3F5F8',
                marginBottom: '24px',
              }}>
                <p style={{ fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#6B7280', marginBottom: '14px' }}>
                  WHAT YOU&apos;LL COVER
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {WHAT_YOULL_COVER.map((item) => (
                    <div key={item} style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                      <Check size={14} color={BLUE} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: NAVY }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.7, marginBottom: '28px' }}>
                After you complete the assessment, you&apos;ll see your top Texas community matches — ranked by your priorities and budget. Create your free portal to unlock your full report and begin your Navigator journey.
              </p>

              <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'flex-start', marginBottom: '28px' }}>
                <input
                  type="checkbox"
                  id="intent-confirm"
                  checked={intentChecked}
                  onChange={(e) => setIntentChecked(e.target.checked)}
                  style={{ marginTop: 3, accentColor: BLUE, width: 18, height: 18 }}
                />
                <label htmlFor="intent-confirm" style={{ fontSize: 15, fontWeight: 500, color: NAVY, cursor: 'pointer', lineHeight: 1.5 }}>
                  Sounds good. I&apos;m fixin&apos; to become a Texan.
                </label>
              </div>

              <button
                type="button"
                onClick={handleIntentStart}
                style={{
                  background: BLUE,
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 500,
                  padding: '14px 32px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: intentChecked ? 'pointer' : 'not-allowed',
                  opacity: intentChecked ? 1 : 0.45,
                  pointerEvents: intentChecked ? 'auto' : 'none',
                }}
              >
                Let&apos;s get started →
              </button>
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
                    Your first name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Craig"
                    required
                    autoFocus
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    ZIP code you&apos;re moving from
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
                <Card2MovingReason
                  path={entryPath}
                  onComplete={(key, archetype) =>
                    goNext({ movingReasonKey: key, archetype }, { archetype })
                  }
                />
              )}

              {currentStep.id === 3 && (
                <Card3Priorities
                  onComplete={(result) => goNext({ card3: result }, { priorities: result.priorities })}
                />
              )}

              {currentStep.id === 4 && (
                <Card4CommunityFeel
                  onComplete={(option, personality) => {
                    sessionStorage.setItem('hq_personality_partial', JSON.stringify(personality))
                    goNext({ communityFeel: option, personality }, { communityFeel: option })
                  }}
                />
              )}

              {currentStep.id === 5 && (
                <Card5GrowthProfile
                  onComplete={(v) => goNext({ growthProfile: v }, { growthProfile: v })}
                />
              )}

              {currentStep.id === 6 && (
                <div>
                  <Card6LifestyleOrientation
                    onComplete={(v) => goNext({ lifestyleOrientation: v }, { lifestyleOrientation: v })}
                  />
                  {!currentStep.required && (
                    <div className="max-w-2xl mx-auto px-4 -mt-4">
                      <button type="button" onClick={handleSkip} className="text-sm text-gray-400 hover:text-gray-600">
                        Skip this question →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {currentStep.id === 7 && (
                <div>
                  <Card7Situation
                    path={entryPath}
                    onComplete={(homeStatus, moveTimeline) =>
                      goNext({ homeStatus, moveTimeline }, { homeStatus, movingTimeline: moveTimeline })
                    }
                  />
                  {!currentStep.required && (
                    <div className="max-w-2xl mx-auto px-4 -mt-4">
                      <button type="button" onClick={handleSkip} className="text-sm text-gray-400 hover:text-gray-600">
                        Skip this question →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {currentStep.id === 8 && (
                <div>
                  <Card8WorkLife
                    onComplete={(workSituation) => goNext({ workSituation }, { workSituation })}
                  />
                  {!currentStep.required && (
                    <div className="max-w-2xl mx-auto px-4 -mt-4">
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
                    path={entryPath}
                    onComplete={(card9) => goNext({ card9 }, { financialData: buildQuizFinancialData(card9) })}
                  />
                  {!currentStep.required && (
                    <div className="max-w-2xl mx-auto px-4 -mt-4">
                      <button type="button" onClick={handleSkip} className="text-sm text-gray-400 hover:text-gray-600">
                        Skip this question →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {currentStep.id === 10 && (
                <Card10MetroCuriosity
                  onComplete={(metros) => goNext({ metroPreference: metros }, { metroPreference: metros })}
                />
              )}
            </>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
