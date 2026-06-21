'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'
import { getAllCities } from '../../../services/locationService'
import { getTopMatches } from '../../../services/matchingService'
import type { CityMatch, UserProfile, UserSession, DNAScores } from '../../../types'
import {
  LOCAL_SESSION_KEY,
  SESSION_PROFILE_KEY,
  SESSION_MATCHES_KEY,
} from '../../../utils/constants'
import { resolveArchetype, buildPersonalityPreference } from '../../../utils/quizProfileMapping'

interface PortalContextValue {
  session: UserSession | null
  profile: UserProfile | null
  matches: CityMatch[]
  currentMM: number
  onboardingAcknowledged: boolean
  initialChecklist: Record<string, boolean>
  initialNotes: string
  ready: boolean
  error: string | null
  handleAcknowledge: () => Promise<void>
}

const PortalDataContext = createContext<PortalContextValue | null>(null)

export function usePortalData(): PortalContextValue {
  const ctx = useContext(PortalDataContext)
  if (!ctx) throw new Error('usePortalData must be used within PortalDataProvider')
  return ctx
}

interface UserRow {
  first_name: string | null
  top_city_matches: Array<{ cityId: string; cityName: string; matchScore: number }> | null
  annual_income: number | null
  household_size: string | null
  moving_timeline: string | null
  // Typed as DNAScores keys going forward (Brief 2a) — rows saved before this
  // brief may still contain old LifestyleScores key strings; those simply won't
  // match any DNA category and are silently ignored by buildClientBuckets/
  // calculateFunctionalFitScore until the client retakes the quiz.
  must_haves: Array<keyof DNAScores> | null
  nice_to_haves: Array<keyof DNAScores> | null
  not_priorities: Array<keyof DNAScores> | null
  archetype: string | null
  growth_profile: number | null
  lifestyle_orientation: number | null
  environment: number | null
  pace: number | null
  culture: number | null
  current_milemarker: number | null
  onboarding_acknowledged: boolean | null
  mm2_checklist: Record<string, boolean> | null
  portal_notes: string | null
}

export default function PortalDataProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [session, setSession] = useState<UserSession | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [matches, setMatches] = useState<CityMatch[]>([])
  const [currentMM, setCurrentMM] = useState<number>(2)
  const [onboardingAcknowledged, setOnboardingAcknowledged] = useState(false)
  const [initialChecklist, setInitialChecklist] = useState<Record<string, boolean>>({})
  const [initialNotes, setInitialNotes] = useState('')
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const rawSession = localStorage.getItem(LOCAL_SESSION_KEY)
    if (!rawSession) {
      router.push('/login')
      return
    }

    const sess: UserSession = JSON.parse(rawSession) as UserSession
    setSession(sess)

    const rawProfile = sessionStorage.getItem(SESSION_PROFILE_KEY)
    const rawMatches = sessionStorage.getItem(SESSION_MATCHES_KEY)
    const profileWasLoaded = !!rawProfile

    if (rawProfile) {
      const prof = JSON.parse(rawProfile) as UserProfile
      setProfile(prof)

      let m: CityMatch[] = []
      if (rawMatches) {
        try { m = JSON.parse(rawMatches) as CityMatch[] } catch {}
      }
      if (m.length === 0) {
        m = getTopMatches(prof, getAllCities(), 3).topMatches
      }
      setMatches(m)
    }

    if (profileWasLoaded && typeof sess.currentMileMarker === 'number') {
      setCurrentMM(sess.currentMileMarker)
      setReady(true)
    }

    ;(async () => {
      try {
        const supabase = createClient()
        const email = sess.email.toLowerCase()

        const { data, error: fetchError } = await supabase
          .from('users')
          .select('first_name, top_city_matches, annual_income, household_size, moving_timeline, must_haves, nice_to_haves, not_priorities, archetype, growth_profile, lifestyle_orientation, environment, pace, culture, current_milemarker, onboarding_acknowledged, mm2_checklist, portal_notes')
          .eq('email', email)
          .single()

        if (fetchError) {
          console.error('Profile fetch error:', fetchError.code, fetchError.message)
        }

        const ud = data as UserRow | null
        if (!ud) {
          if (!profileWasLoaded) setError(`Unable to load your profile. Please refresh or log in again. [${fetchError?.code ?? 'no-error'}: ${fetchError?.message ?? 'no-data-no-error'}]`)
          setReady(true)
          return
        }

        if (ud.first_name && ud.first_name !== sess.firstName) {
          const updated: UserSession = { ...sess, firstName: ud.first_name }
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(updated))
          setSession(updated)
        }

        const savedMM = ud.current_milemarker ?? 1
        setCurrentMM(savedMM)

        if (ud.onboarding_acknowledged) setOnboardingAcknowledged(true)
        if (ud.mm2_checklist) setInitialChecklist(ud.mm2_checklist)
        if (ud.portal_notes) setInitialNotes(ud.portal_notes)

        if (!profileWasLoaded && ud.annual_income) {
          const reconstructedProfile: UserProfile = {
            annualIncome: ud.annual_income,
            householdSize: (ud.household_size as UserProfile['householdSize']) ?? '1',
            movingTimeline: (ud.moving_timeline as UserProfile['movingTimeline']) ?? 'exploring',
            mustHaves: ud.must_haves ?? [],
            niceToHaves: ud.nice_to_haves ?? [],
            notPriorities: ud.not_priorities ?? [],
            archetype: resolveArchetype(ud.archetype ?? undefined),
            personalityPreference: buildPersonalityPreference(ud),
          }

          const allCities = getAllCities()
          let restoredMatches: CityMatch[] = []

          if (ud.top_city_matches?.length) {
            restoredMatches = ud.top_city_matches
              .map((saved): CityMatch | null => {
                const location = allCities.find(c => c.id === saved.cityId)
                if (!location) return null
                const monthlyHousing = Math.round(location.housing.medianHomePrice * 0.007)
                return {
                  location,
                  matchScore: saved.matchScore,
                  // saved.matchScore predates Brief 2's component-score breakdown —
                  // no historical financial/functional/emotional split exists for it.
                  financialFitScore: 0,
                  functionalFitScore: 0,
                  emotionalFitScore: 0,
                  affordabilityScore: Math.round(location.scores.affordability * 10),
                  affordabilityFlag: false,
                  estimatedMonthlyHousing: monthlyHousing,
                  estimatedMonthlyTotal:
                    monthlyHousing +
                    location.housing.monthlyUtilities +
                    location.housing.monthlyGroceries +
                    location.housing.monthlyTransportation,
                  zillowSearchUrl: '',
                  segment: 'Mid-Market' as CityMatch['segment'],
                }
              })
              .filter((m): m is CityMatch => m !== null)
          } else {
            restoredMatches = getTopMatches(reconstructedProfile, allCities, 3).topMatches
          }

          if (restoredMatches.length > 0) {
            setProfile(reconstructedProfile)
            setMatches(restoredMatches)
          }
        }

        setReady(true)
      } catch (err) {
        console.error('[PortalDataProvider] load error:', err)
        if (!profileWasLoaded) setError('We had trouble loading your portal. Please refresh or log in again.')
        setReady(true)
      }
    })()
  }, [router])

  async function handleAcknowledge(): Promise<void> {
    setOnboardingAcknowledged(true)
    setCurrentMM(2)
    try {
      const supabase = createClient()
      const { data: { session: supaSession } } = await supabase.auth.getSession()
      if (!supaSession?.user?.email) return
      const email = supaSession.user.email.toLowerCase()
      const { data, error: writeError } = await supabase
        .from('users')
        .update({ onboarding_acknowledged: true, current_milemarker: 2 })
        .eq('email', email)
        .select('current_milemarker')
      console.log('[MM1→2] current_milemarker write result:', { data, error: writeError })
      if (!writeError && (!data || data.length === 0)) {
        console.warn('[MM1→2] write affected 0 rows — RLS UPDATE policy missing or JWT email mismatch for', email)
      }
    } catch (err) {
      console.error('[PortalDataProvider] handleAcknowledge write failed:', err)
    }
  }

  return (
    <PortalDataContext.Provider
      value={{
        session,
        profile,
        matches,
        currentMM,
        onboardingAcknowledged,
        initialChecklist,
        initialNotes,
        ready,
        error,
        handleAcknowledge,
      }}
    >
      {children}
    </PortalDataContext.Provider>
  )
}
