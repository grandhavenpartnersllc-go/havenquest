'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Download, Mail } from 'lucide-react'
import { CityMatch, UserProfile, UserSession } from '../../../types'
import { createClient } from '../../../lib/supabase/client'
import SavedMatches from '../SavedMatches'
import RelocationChecklist from '../RelocationChecklist'
import NotesArea from '../NotesArea'
import FullReport from '../../results/FullReport'
import RealtorMatchSection from '../../results/RealtorMatchSection'

const WARM_DARK = '#16120D'
const GOLD = '#B8912A'
const CARD_BG = '#FDFCFA'
const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.07)'

const CHECKLIST_ITEMS = [
  { key: 'reviewed_top_city', label: 'I reviewed my top city match report' },
  { key: 'checked_affordability', label: 'I checked the affordability breakdown' },
  { key: 'looked_at_schools', label: 'I looked at school data for at least one city' },
  { key: 'read_strengths', label: 'I read the strengths and tradeoffs' },
  { key: 'explored_second_city', label: 'I explored a second city match' },
  { key: 'understand_scores', label: 'I have a sense of what the scores mean' },
  { key: 'ready_for_next', label: 'I feel ready to go deeper and start shaping my plan' },
]

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
  session: UserSession
  onAdvanceToDiscover: () => void
}

export default function MM2Discover({ matches, profile, onAdvanceToDiscover }: MM2DiscoverProps) {
  const [dlState, setDlState] = useState<BtnState>('idle')
  const [emailState, setEmailState] = useState<BtnState>('idle')
  const [scorePopupOpen, setScorePopupOpen] = useState(false)
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})

  const topCity = matches[0]?.location ?? null

  useEffect(() => {
    ;(async () => {
      try {
        const supabase = createClient()
        const { data: { session: supaSession } } = await supabase.auth.getSession()
        if (!supaSession?.user?.email) return
        const { data: ud } = await supabase
          .from('users')
          .select('mm2_checklist')
          .eq('email', supaSession.user.email.toLowerCase())
          .single()
        if (ud?.mm2_checklist) setChecklist(ud.mm2_checklist)
      } catch {}
    })()
  }, [])

  async function handleChecklistChange(key: string, checked: boolean) {
    const updated = { ...checklist, [key]: checked }
    setChecklist(updated)
    try {
      const supabase = createClient()
      const { data: { session: supaSession } } = await supabase.auth.getSession()
      if (!supaSession?.user?.email) return
      await supabase
        .from('users')
        .update({ mm2_checklist: updated })
        .eq('email', supaSession.user.email.toLowerCase())
    } catch {}
  }

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

      {/* Forward-looking intro */}
      <div className="p-4 rounded-xl" style={{ backgroundColor: '#F7F6F3' }}>
        <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>
          These are your matched cities — and everything you need to explore them is right here.
          As you flip through the reports, pay attention to what excites you and what gives you pause.
          The scores, the numbers, the schools — it&apos;s all here to help you get a feel for each place.
          And when you&apos;re ready to go deeper and start shaping your plan,{' '}
          <strong>Discover</strong> is waiting with a live sandbox where you can move things around
          and watch your matches respond in real time.
        </p>
      </div>

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
          <button
            onClick={() => setScorePopupOpen(true)}
            className="text-xs font-medium underline underline-offset-2 mb-4 block"
            style={{ color: GOLD }}
          >
            How are scores calculated? →
          </button>
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
            <div className="mt-6">
              <p className="text-[10px] font-bold uppercase mb-2"
                 style={{ color: GOLD, letterSpacing: '0.18em' }}>
                Your Notes
              </p>
              <p className="text-xs mb-3" style={{ color: '#9A8E82' }}>
                Jot down questions, thoughts, or anything you want to remember.
                Your Market Director will see these when they review your profile.
              </p>
              <Card>
                <NotesArea />
              </Card>
            </div>
          </section>
        </>
      )}

      {/* Explore Checklist */}
      <div className="mt-10 pt-8" style={{ borderTop: '1px solid #E5E7EB' }}>
        <p className="text-[10px] font-bold uppercase mb-4"
           style={{ color: GOLD, letterSpacing: '0.18em' }}>
          Your Explore Checklist
        </p>
        <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
          Check these off as you go. There&apos;s no rush — but when you&apos;ve worked through them,
          you&apos;ll know you&apos;re ready for what comes next.
        </p>
        <div className="space-y-3">
          {CHECKLIST_ITEMS.map(item => (
            <label key={item.key} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!checklist[item.key]}
                onChange={e => handleChecklistChange(item.key, e.target.checked)}
                className="mt-0.5 shrink-0"
              />
              <span className="text-sm" style={{ color: checklist[item.key] ? '#2D7D4E' : '#4B5563' }}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Advance to Discover */}
      <div className="mt-8 pt-6" style={{ borderTop: '1px solid #E5E7EB' }}>
        <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
          Explored enough to know you&apos;re ready to go deeper?
        </p>
        <button
          onClick={onAdvanceToDiscover}
          className="w-full py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: GOLD, color: '#16120D' }}
        >
          I&apos;m ready — take me to Discover →
        </button>
      </div>

      {/* Score explanation popup */}
      {scorePopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setScorePopupOpen(false)}
        >
          <div
            className="rounded-2xl p-6 max-w-md w-full"
            style={{ backgroundColor: '#FDFCFA' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base" style={{ color: '#16120D' }}>
                Understanding Your Scores
              </h3>
              <button
                onClick={() => setScorePopupOpen(false)}
                className="text-sm"
                style={{ color: '#9A8E82' }}
              >
                ✕
              </button>
            </div>

            <p className="text-sm leading-relaxed mb-4" style={{ color: '#4B5563' }}>
              Every category is scored from <strong>0 to 10</strong>. Higher is always better —
              a 9 in Traffic means great traffic conditions, not bad ones. A 9 in Affordability
              means housing is very affordable for your income.
            </p>

            <div className="space-y-2 mb-4">
              {[
                { label: 'Affordability', desc: 'How well housing costs fit your income' },
                { label: 'Schools', desc: 'Public school district quality and TEA ratings' },
                { label: 'Safety', desc: 'Crime rates — higher score means safer' },
                { label: 'Walkability', desc: 'How much you can do on foot day to day' },
                { label: 'Transit', desc: 'Bus, rail, and commute options available' },
                { label: 'Nightlife', desc: 'Bars, music, restaurants, entertainment' },
                { label: 'Outdoors', desc: 'Parks, trails, lakes, and nature access' },
                { label: 'Family Friendly', desc: 'Overall environment for raising children' },
                { label: 'Remote Work', desc: 'Broadband quality, tech culture, coworking' },
                { label: 'Low Taxes', desc: 'Property tax rates — higher score means lower taxes' },
                { label: 'Weather', desc: 'Climate comfort and sunshine' },
                { label: 'Traffic', desc: 'Commute times — higher score means less congestion' },
                { label: 'Healthcare', desc: 'Hospital access, specialists, medical quality' },
              ].map(item => (
                <div key={item.label} className="flex gap-3">
                  <span className="text-xs font-semibold w-28 shrink-0" style={{ color: '#16120D' }}>
                    {item.label}
                  </span>
                  <span className="text-xs" style={{ color: '#6B7280' }}>
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-3" style={{ backgroundColor: '#F0EDE6' }}>
              <p className="text-xs leading-relaxed" style={{ color: '#4B5563' }}>
                <strong>How priorities affect your match score:</strong> Categories you marked
                as Must Have count 3× more than others. Important to Me counts 2×.
                Would Be Nice counts 1×. Unassigned categories don&apos;t affect your score at all.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
