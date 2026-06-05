'use client'

import { use, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '../../../components/shared/Header'
import Footer from '../../../components/shared/Footer'
import TeaserResults from '../../../components/results/TeaserResults'
import EmailGate from '../../../components/results/EmailGate'
import PasswordCreation from '../../../components/results/PasswordCreation'
import { CityMatch, UserProfile, UserSession } from '../../../types'
import {
  SESSION_PROFILE_KEY,
  SESSION_METRO_KEY,
  SESSION_MATCHES_KEY,
  LOCAL_SESSION_KEY,
  LOCAL_PENDING_EMAIL_KEY,
} from '../../../utils/constants'
import { getAllCities, getCitiesByMetro } from '../../../services/locationService'
import { getTopMatches } from '../../../services/matchingService'

type FlowStep = 'teaser' | 'password'

export default function SessionResultsPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [matches, setMatches] = useState<CityMatch[]>([])
  const [ready, setReady] = useState(false)
  const [flowStep, setFlowStep] = useState<FlowStep>('teaser')
  const [showGate, setShowGate] = useState(false)
  const [gateSession, setGateSession] = useState<{ userId: string; firstName: string; email: string } | null>(null)
  const [storedSession, setStoredSession] = useState<UserSession | null>(null)
  const [pendingNotice, setPendingNotice] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem(SESSION_PROFILE_KEY)
    if (!raw) {
      router.push('/explore')
      return
    }

    const prof: UserProfile = JSON.parse(raw)
    setProfile(prof)

    const metro = sessionStorage.getItem(SESSION_METRO_KEY)
    const cities = metro ? getCitiesByMetro(metro) : getAllCities()
    const cachedMatches = sessionStorage.getItem(SESSION_MATCHES_KEY)
    const topMatches: CityMatch[] = cachedMatches
      ? JSON.parse(cachedMatches)
      : getTopMatches(prof, cities, 4)
    if (!cachedMatches) sessionStorage.setItem(SESSION_MATCHES_KEY, JSON.stringify(topMatches))
    setMatches(topMatches)

    const sessionRaw = localStorage.getItem(LOCAL_SESSION_KEY)
    if (sessionRaw) {
      try { setStoredSession(JSON.parse(sessionRaw)) } catch {}
    }

    if (localStorage.getItem(LOCAL_PENDING_EMAIL_KEY)) {
      setPendingNotice(true)
    }

    setReady(true)
    if (searchParams.get('gate') === 'open') setShowGate(true)
  }, [router, searchParams])

  const handleGateSuccess = (sess: { userId: string; firstName: string; email: string }) => {
    const session: UserSession = { ...sess, createdAt: new Date().toISOString() }
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session))
    setGateSession(sess)
    setShowGate(false)
    setFlowStep('password')
  }

  if (!ready) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen bg-surface">
          <div className="text-center">
            <div className="w-7 h-7 border-2 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Calculating your matches…</p>
          </div>
        </div>
      </>
    )
  }

  if (!profile) return null

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="bg-[#08101C] border-b border-white/8 px-4 py-10">
          <div className="max-w-3xl mx-auto">
            <p className="text-blue-400/60 text-[11px] font-bold uppercase tracking-widest mb-3">Your Results</p>
            <h1 className="text-3xl font-bold text-white tracking-tight">Your first look at Texas.</h1>
            <p className="text-white/40 text-sm mt-2">These are your preliminary matches — a first peek at where your life fits in Texas. There&apos;s a lot more ahead. Create your free Navigator portal and we&apos;ll take you the rest of the way.</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          {flowStep === 'teaser' && (
            <>
              {pendingNotice && (
                <div
                  className="mb-6 rounded-xl px-5 py-4 flex items-start gap-3"
                  style={{ backgroundColor: 'rgba(26,95,168,0.07)', border: '1px solid rgba(26,95,168,0.15)' }}
                >
                  <div className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: '#1A5FA8' }} />
                  <p className="text-sm" style={{ color: '#1A5FA8' }}>
                    Check your email to set up your portal later — your results will be waiting.
                  </p>
                </div>
              )}
              <p style={{
                fontSize: '13px',
                fontStyle: 'italic',
                color: '#9A8E82',
                textAlign: 'center',
                maxWidth: '600px',
                margin: '0 auto 24px auto',
                lineHeight: 1.7,
              }}>
                We&apos;re just getting started. What you see here is the beginning
                of your discovery — not the end. Your full Navigator experience
                goes much deeper into your finances, your priorities, and the
                communities that truly fit your life.
              </p>
              <TeaserResults matches={matches.slice(0, 3)} onUnlock={() => setShowGate(true)} />
            </>
          )}

          {flowStep === 'password' && gateSession && (
            <PasswordCreation
              userId={gateSession.userId}
              firstName={gateSession.firstName}
              email={gateSession.email}
            />
          )}
        </div>
      </main>

      {showGate && profile && (
        <EmailGate
          matches={matches}
          profile={profile}
          sessionId={sessionId}
          onSuccess={handleGateSuccess}
          onClose={() => setShowGate(false)}
          storedSession={storedSession}
        />
      )}

      <Footer />
    </>
  )
}
