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
import SavedMatches from './SavedMatches'
import RelocationChecklist from './RelocationChecklist'
import NotesArea from './NotesArea'
import FullReport from '../results/FullReport'
import RealtorMatchSection from '../results/RealtorMatchSection'

const WARM_DARK = '#16120D'
const WARM_MID = '#1C1814'
const GOLD = '#B8912A'
const CREAM = '#F0EDE6'
const CARD_BG = '#FDFCFA'
const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.07)'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] font-bold uppercase mb-3"
      style={{ color: GOLD, letterSpacing: '0.18em' }}
    >
      {children}
    </p>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-6 ${className}`}
      style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}
    >
      {children}
    </div>
  )
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

    setReady(true)

    // Capture whether profile came from sessionStorage so the IIFE below
    // knows whether it needs to restore matches from the DB.
    const profileWasLoaded = !!rawProfile

    // Fire-and-forget: refresh first_name and, when sessionStorage was empty
    // (browser restart / new device), restore profile + matches from DB.
    // Matches by email — public.users has no auth_id column.
    ;(async () => {
      try {
        const supabase = createClient()
        const { data: { session: supaSession } } = await supabase.auth.getSession()
        if (!supaSession?.user?.email) return

        const { data: ud } = await supabase
          .from('users')
          .select('first_name, top_city_matches, annual_income, household_size, housing_preference, moving_timeline, must_haves, nice_to_haves, not_priorities')
          .eq('email', supaSession.user.email.toLowerCase())
          .single()
        if (!ud) return

        // Refresh greeting name
        if (ud.first_name && ud.first_name !== sess.firstName) {
          const updated: UserSession = { ...sess, firstName: ud.first_name }
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(updated))
          setSession(updated)
        }

        // Restore saved matches when sessionStorage was cleared (browser restart)
        if (!profileWasLoaded && ud.annual_income && ud.top_city_matches?.length) {
          const reconstructedProfile: UserProfile = {
            annualIncome: ud.annual_income,
            householdSize: ud.household_size ?? '1',
            housingPreference: ud.housing_preference ?? 'rent2br',
            movingTimeline: ud.moving_timeline ?? 'exploring',
            mustHaves: ud.must_haves ?? [],
            niceToHaves: ud.nice_to_haves ?? [],
            notPriorities: ud.not_priorities ?? [],
          }
          const restoredMatches = getTopMatches(reconstructedProfile, getAllCities(), 3)
          if (restoredMatches.length > 0) {
            setProfile(reconstructedProfile)
            setMatches(restoredMatches)
          }
        }
      } catch {}
    })()
  }, [router])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: CREAM }}>
        <div className="text-center">
          <div
            className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3"
            style={{ borderColor: GOLD, borderTopColor: 'transparent' }}
          />
          <p className="text-sm" style={{ color: '#9A8E82' }}>Loading your portal…</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const topCity = matches[0]?.location ?? null
  const initial = session.firstName.charAt(0).toUpperCase()

  return (
    <div style={{ backgroundColor: CREAM, minHeight: '100vh' }}>

      {/* Portal nav */}
      <nav style={{ backgroundColor: WARM_DARK }} className="sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-[16px] tracking-tight" style={{ color: '#E8E2D9' }}>
            Haven<span style={{ color: GOLD }}>Quest</span>
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
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-5 py-8 space-y-10">

        {/* Match summary cards — or prompt to start a new search */}
        {matches.length > 0 ? (
          <section>
            <SectionLabel>Your Matched Cities</SectionLabel>
            <SavedMatches matches={matches} />
          </section>
        ) : (
          <section>
            <Card className="text-center py-10">
              <div className="text-4xl mb-4">🗺️</div>
              <h2
                className="font-bold text-lg tracking-tight mb-2"
                style={{ color: WARM_DARK }}
              >
                Start a new search to find your Texas match
              </h2>
              <p className="text-sm mb-6 max-w-xs mx-auto leading-relaxed" style={{ color: '#9A8E82' }}>
                Your previous results aren&apos;t saved in this session. Run a quick search to regenerate your personalised city matches.
              </p>
              <Link
                href="/explore"
                className="inline-block px-6 py-3 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: GOLD }}
              >
                Start My Search →
              </Link>
            </Card>
          </section>
        )}

        {/* Full report for each matched city */}
        {profile && matches.map((match, i) => (
          <section key={match.location.id} id={`report-${match.location.id}`}>
            <SectionLabel>
              {i === 0 ? 'Top Pick' : i === 1 ? 'Runner-Up' : 'Strong Alt'} — {match.location.name}
            </SectionLabel>
            <FullReport match={match} profile={profile} />
            <RealtorMatchSection city={match.location} profile={profile} />
          </section>
        ))}

        {/* Relocation tools */}
        {topCity && (
          <>
            <section>
              <SectionLabel>Relocation Checklist — {topCity.name}</SectionLabel>
              <Card>
                <RelocationChecklist cityName={topCity.name} />
              </Card>
            </section>

            <section>
              <SectionLabel>Notes</SectionLabel>
              <Card>
                <NotesArea />
              </Card>
            </section>
          </>
        )}

        <footer className="pt-4 pb-8 text-center">
          <p className="text-xs" style={{ color: '#9A8E82' }}>
            HavenQuest · Private Member Portal ·{' '}
            <Link href="/methodology" className="underline underline-offset-2" style={{ color: '#9A8E82' }}>
              How scores work
            </Link>
          </p>
        </footer>
      </div>
    </div>
  )
}
