'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CityMatch, UserProfile, UserSession } from '../../types'
import {
  SESSION_PROFILE_KEY,
  SESSION_MATCHES_KEY,
  LOCAL_SESSION_KEY,
} from '../../utils/constants'
import { getAllCities } from '../../services/locationService'
import { getTopMatches } from '../../services/matchingService'
import { createClient } from '../../lib/supabase/client'
import NavigatorTabs from './NavigatorTabs'
import MileMarkerContent from './MileMarkerContent'

const WARM_DARK = '#16120D'
const WARM_MID = '#1C1814'
const GOLD = '#B8912A'
const CREAM = '#F0EDE6'

const MILEMARKER_NAMES: Record<number, string> = {
  1: 'Welcome',
  2: 'Explore',
  3: 'Discover',
  4: 'Connect',
  5: 'Plan',
  6: 'Prepare',
  7: 'Match',
  8: 'Engage',
  9: 'Contract',
  10: 'Home',
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function getFormattedDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export default function StarterPortal() {
  const router = useRouter()
  const [session, setSession] = useState<UserSession | null>(null)
  const [matches, setMatches] = useState<CityMatch[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [ready, setReady] = useState(false)
  const [currentMileMarker, setCurrentMileMarker] = useState<number | null>(null)
  const [activeMileMarker, setActiveMileMarker] = useState<number | null>(null)
  const [onboardingAcknowledged, setOnboardingAcknowledged] = useState(false)
  const [initialChecklist, setInitialChecklist] = useState<Record<string, boolean>>({})
  const [initialNotes, setInitialNotes] = useState<string>('')
  const [portalError, setPortalError] = useState<string | null>(null)

  useEffect(() => {
    const rawSession = localStorage.getItem(LOCAL_SESSION_KEY)
    if (!rawSession) {
      router.push('/login')
      return
    }

    const sess: UserSession = JSON.parse(rawSession)
    setSession(sess)

    const rawProfile = sessionStorage.getItem(SESSION_PROFILE_KEY)
    const rawMatches = sessionStorage.getItem(SESSION_MATCHES_KEY)
    const profileWasLoaded = !!rawProfile

    if (rawProfile) {
      const prof: UserProfile = JSON.parse(rawProfile)
      setProfile(prof)

      let m: CityMatch[] = []
      if (rawMatches) {
        try { m = JSON.parse(rawMatches) } catch {}
      }
      if (m.length === 0) {
        m = getTopMatches(prof, getAllCities(), 3)
      }
      setMatches(m)
    }

    // If login pre-fetched the milemarker into localStorage, render immediately
    // while the DB query refreshes state in the background
    if (profileWasLoaded && typeof sess.currentMileMarker === 'number') {
      setCurrentMileMarker(sess.currentMileMarker)
      setActiveMileMarker(sess.currentMileMarker)
      setReady(true)
    }

    ;(async () => {
      try {
        const supabase = createClient()
        const { data: { session: supaSession } } = await supabase.auth.getSession()
        if (!supaSession?.user?.email) {
          if (!profileWasLoaded) {
            setPortalError('Session expired. Please log in again.')
          }
          return
        }

        const { data: ud } = await supabase
          .from('users')
          .select('first_name, top_city_matches, annual_income, household_size, housing_preference, moving_timeline, must_haves, nice_to_haves, not_priorities, current_milemarker, onboarding_acknowledged, mm2_checklist, portal_notes')
          .eq('email', supaSession.user.email.toLowerCase())
          .single()

        if (!ud) {
          if (!profileWasLoaded) {
            setPortalError('Unable to load your profile. Please refresh or log in again.')
          }
          return
        }

        if (ud.first_name && ud.first_name !== sess.firstName) {
          const updated: UserSession = { ...sess, firstName: ud.first_name }
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(updated))
          setSession(updated)
        }

        const savedMM = ud.current_milemarker ?? 2
        setCurrentMileMarker(savedMM)
        setActiveMileMarker(savedMM)

        if (ud.onboarding_acknowledged) {
          setOnboardingAcknowledged(true)
        }

        if (ud.mm2_checklist) setInitialChecklist(ud.mm2_checklist)
        if (ud.portal_notes) setInitialNotes(ud.portal_notes)

        if (!profileWasLoaded && ud.annual_income) {
          const reconstructedProfile: UserProfile = {
            annualIncome: ud.annual_income,
            householdSize: ud.household_size ?? '1',
            movingTimeline: ud.moving_timeline ?? 'exploring',
            mustHaves: ud.must_haves ?? [],
            niceToHaves: ud.nice_to_haves ?? [],
            notPriorities: ud.not_priorities ?? [],
          }

          const allCities = getAllCities()
          let restoredMatches: CityMatch[] = []

          if (ud.top_city_matches?.length) {
            // Use saved matches as authoritative — preserves quiz-time scores and city order
            const savedMatches = ud.top_city_matches as { cityId: string; cityName: string; matchScore: number }[]
            restoredMatches = savedMatches
              .map(saved => {
                const location = allCities.find(c => c.id === saved.cityId)
                if (!location) return null
                const monthlyHousing = Math.round(location.housing.medianHomePrice * 0.007)
                return {
                  location,
                  matchScore: saved.matchScore,
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
              .filter(Boolean) as CityMatch[]
          } else {
            // Fallback — top_city_matches missing, recompute from profile
            restoredMatches = getTopMatches(reconstructedProfile, allCities, 3)
          }

          if (restoredMatches.length > 0) {
            setProfile(reconstructedProfile)
            setMatches(restoredMatches)
          }
        }

        setReady(true)
      } catch (err) {
        console.error('[portal] Load error:', err)
        if (!profileWasLoaded) {
          setPortalError('We had trouble loading your portal. Please refresh or log in again.')
        }
      }
    })()
  }, [router])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeMileMarker])

  async function handleAcknowledge() {
    setOnboardingAcknowledged(true)
    setCurrentMileMarker(2)
    try {
      const supabase = createClient()
      const { data: { session: supaSession } } = await supabase.auth.getSession()
      if (!supaSession?.user?.email) return
      await supabase
        .from('users')
        .update({ onboarding_acknowledged: true, current_milemarker: 2 })
        .eq('email', supaSession.user.email.toLowerCase())
    } catch {}
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: CREAM }}>
        <div className="text-center">
          {portalError ? (
            <div className="max-w-sm mx-auto px-4">
              <p className="text-sm mb-4" style={{ color: '#DC2626' }}>{portalError}</p>
              <a href="/login" className="text-sm font-medium" style={{ color: GOLD }}>
                Log in again →
              </a>
            </div>
          ) : (
            <>
              <div
                className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3"
                style={{ borderColor: GOLD, borderTopColor: 'transparent' }}
              />
              <p className="text-sm" style={{ color: '#9A8E82' }}>Loading your portal…</p>
            </>
          )}
        </div>
      </div>
    )
  }

  if (!session) return null

  const initial = session.firstName.charAt(0).toUpperCase()

  return (
    <div style={{ backgroundColor: CREAM, minHeight: '100vh' }}>

      {/* Portal nav */}
      <nav style={{ backgroundColor: WARM_DARK }} className="sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-[16px] tracking-tight" style={{ color: '#E8E2D9' }}>
            Haven<span style={{ color: GOLD }}>Quest</span>
            <span
              className="ml-2 text-[11px] font-bold tracking-[0.2em] uppercase"
              style={{ color: 'rgba(232,226,217,0.45)' }}
            >
              Navigator
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ backgroundColor: GOLD, color: WARM_DARK }}
            >
              {initial}
            </div>
            <span className="text-sm hidden sm:block" style={{ color: 'rgba(232,226,217,0.55)' }}>
              {session.firstName}
            </span>
            <button
              onClick={async () => {
                sessionStorage.clear()
                localStorage.removeItem(LOCAL_SESSION_KEY)
                await fetch('/api/auth/session', { method: 'DELETE' })
                router.push('/login')
              }}
              className="text-xs transition-colors"
              style={{ color: 'rgba(232,226,217,0.3)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(232,226,217,0.65)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,226,217,0.3)')}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Welcome band */}
      <div style={{ backgroundColor: WARM_MID }} className="px-5 py-10">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-[10px] font-bold uppercase mb-2.5"
            style={{ color: GOLD, letterSpacing: '0.18em' }}
          >
            Private Portal
          </p>
          <h1 className="text-[28px] font-bold tracking-tight" style={{ color: '#EDE7DC' }}>
            {getGreeting()}, {session.firstName}.
          </h1>
          <p className="text-sm mt-1.5" style={{ color: 'rgba(237,231,220,0.38)' }}>
            {getFormattedDate()} · Texas Relocation Intelligence
          </p>

          {/* Journey progress */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold" style={{ color: 'rgba(237,231,220,0.5)', letterSpacing: '0.12em' }}>
                YOUR NAVIGATOR JOURNEY
              </p>
              <p className="text-[11px]" style={{ color: 'rgba(237,231,220,0.4)' }}>
                MileMarker {currentMileMarker!} of 10 — {MILEMARKER_NAMES[currentMileMarker!]}
              </p>
            </div>
            <div
              className="w-full rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', height: '4px' }}
            >
              <div
                className="rounded-full transition-all duration-700"
                style={{
                  backgroundColor: GOLD,
                  height: '4px',
                  width: `${((currentMileMarker! - 1) / 9) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigator + content — cream section */}
      <div className="max-w-5xl mx-auto px-5 pt-6 pb-8">
        <NavigatorTabs
          currentMileMarker={currentMileMarker!}
          activeMileMarker={activeMileMarker!}
          onSelect={(mm) => setActiveMileMarker(mm)}
        />
        <div className="mt-6">
          <MileMarkerContent
            selectedMileMarker={activeMileMarker!}
            currentMileMarker={currentMileMarker!}
            matches={matches}
            profile={profile}
            session={session}
            onboardingAcknowledged={onboardingAcknowledged}
            onAcknowledge={handleAcknowledge}
            onAdvanceToDiscover={() => setActiveMileMarker(2)}
            onAdvanceFromMM2={() => { setCurrentMileMarker(3); setActiveMileMarker(3) }}
            onAdvanceToConnect={() => setActiveMileMarker(4)}
            initialChecklist={initialChecklist}
            initialNotes={initialNotes}
          />
        </div>
      </div>

      <footer className="pb-8 text-center">
        <p className="text-xs" style={{ color: '#9A8E82' }}>
          HavenQuest · Private Member Portal ·{' '}
          <Link href="/methodology" className="underline underline-offset-2" style={{ color: '#9A8E82' }}>
            How scores work
          </Link>
        </p>
      </footer>
    </div>
  )
}
