'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Download, Mail } from 'lucide-react'
import { CityMatch, UserProfile } from '../../../types'
import SavedMatches from '../SavedMatches'
import RelocationChecklist from '../RelocationChecklist'
import NotesArea from '../NotesArea'
import FullReport from '../../results/FullReport'
import RealtorMatchSection from '../../results/RealtorMatchSection'

const WARM_DARK = '#16120D'
const GOLD = '#B8912A'
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

type BtnState = 'idle' | 'loading' | 'done' | 'error'

interface MM2DiscoverProps {
  matches: CityMatch[]
  profile: UserProfile | null
}

export default function MM2Discover({ matches, profile }: MM2DiscoverProps) {
  const [dlState, setDlState] = useState<BtnState>('idle')
  const [emailState, setEmailState] = useState<BtnState>('idle')

  const topCity = matches[0]?.location ?? null

  async function handleDownload() {
    setDlState('loading')
    try {
      const res = await fetch('/api/auth/download-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })
      if (!res.ok) throw new Error('Failed')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'HavenQuest-Report.pdf'
      a.click()
      URL.revokeObjectURL(url)

      setDlState('done')
    } catch {
      setDlState('error')
    } finally {
      setTimeout(() => setDlState('idle'), 3000)
    }
  }

  async function handleEmailReport() {
    setEmailState('loading')
    try {
      const res = await fetch('/api/auth/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force: true }),
      })
      if (!res.ok) throw new Error('Failed')

      setEmailState('done')
    } catch {
      setEmailState('error')
    } finally {
      setTimeout(() => setEmailState('idle'), 3000)
    }
  }

  return (
    <div className="space-y-10">

      {/* Match summary cards — or prompt to start a new search */}
      {matches.length > 0 ? (
        <section>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-bold uppercase" style={{ color: GOLD, letterSpacing: '0.18em' }}>
              Your Matched Cities
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                disabled={dlState === 'loading'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-50"
                style={{
                  borderColor: dlState === 'error' ? '#E05252' : dlState === 'done' ? '#4CAF50' : GOLD,
                  color: dlState === 'error' ? '#E05252' : dlState === 'done' ? '#4CAF50' : GOLD,
                  backgroundColor: 'transparent',
                }}
              >
                <Download size={13} />
                {dlState === 'loading' ? 'Generating…' : dlState === 'done' ? 'Downloaded!' : dlState === 'error' ? 'Failed' : 'Download Report'}
              </button>
              <button
                onClick={handleEmailReport}
                disabled={emailState === 'loading'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-50"
                style={{
                  borderColor: emailState === 'error' ? '#E05252' : emailState === 'done' ? '#4CAF50' : GOLD,
                  color: emailState === 'error' ? '#E05252' : emailState === 'done' ? '#4CAF50' : GOLD,
                  backgroundColor: 'transparent',
                }}
              >
                <Mail size={13} />
                {emailState === 'loading' ? 'Sending…' : emailState === 'done' ? 'Sent!' : emailState === 'error' ? 'Failed' : 'Email Report'}
              </button>
            </div>
          </div>
          <p className="text-xs mb-3" style={{ color: '#9A8E82' }}>
            Select any two cities to compare them side by side
          </p>
          {profile && <SavedMatches matches={matches} profile={profile} />}
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

    </div>
  )
}
