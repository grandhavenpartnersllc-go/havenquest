'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Download, Mail, Map } from 'lucide-react'
import { CityMatch, UserProfile } from '../../../types'
import { getDownPaymentMidpoint, getProceedsMidpoint } from '../../../services/matchingService'
import { createClient } from '../../../lib/supabase/client'
import SavedMatches from '../SavedMatches'
import NotesArea from '../NotesArea'
import FullReport from '../../results/FullReport'

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
  initialChecklist: Record<string, boolean>
  initialNotes: string
  onAdvanceToDiscover: () => void
  email?: string
}

export default function MM2Discover({ matches, profile, initialChecklist, initialNotes, onAdvanceToDiscover, email }: MM2DiscoverProps) {
  const [dlState, setDlState] = useState<BtnState>('idle')
  const [emailState, setEmailState] = useState<BtnState>('idle')
  const [scorePopupOpen, setScorePopupOpen] = useState(false)
  const [activeReportIndex, setActiveReportIndex] = useState(0)

  const topCity = matches[0]?.location ?? null

  function getCityAffordabilityStatus(cityMedianPrice: number, cityTaxRate: number): 'comfortable' | 'moderate' | 'stretched' {
    const grossMonthlyIncome = (profile?.annualIncome ?? 100000) / 12
    const fp = profile?.financial_picture
    const downMid = fp?.down_payment_available
      ? getDownPaymentMidpoint(fp.down_payment_available)
      : 30000
    const procMid = fp?.home_sale_proceeds && fp.is_homeowner
      ? getProceedsMidpoint(fp.home_sale_proceeds)
      : 0
    const balance = Math.max(0, cityMedianPrice - downMid - procMid)
    if (balance === 0) return 'comfortable'
    const monthlyRate = 0.07 / 12
    const payment = Math.round(
      (balance * monthlyRate * Math.pow(1 + monthlyRate, 360)) /
      (Math.pow(1 + monthlyRate, 360) - 1)
    )
    const tax = Math.round((cityMedianPrice * (cityTaxRate ?? 0.018)) / 12)
    const pct = (payment + tax) / grossMonthlyIncome
    if (pct <= 0.30) return 'comfortable'
    if (pct <= 0.40) return 'moderate'
    return 'stretched'
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
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase mb-2"
           style={{ color: GOLD, letterSpacing: '0.18em' }}>
          Welcome to Your Matched Cities
        </p>
        <h2 className="text-[20px] font-bold tracking-tight mb-3" style={{ color: WARM_DARK }}>
          Meet your top Texas matches.
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
          Based on everything you told us, these are the communities where your life
          genuinely fits. This is your introduction to each of them — their schools,
          their markets, their lifestyle scores, and what it actually costs to live there.
          Take your time. Read the reports. Get a feel for each place. When something
          catches your attention, that&apos;s worth paying attention to.
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
            <div className="mb-4"><Map size={48} style={{ color: 'var(--color-text-tertiary)' }} /></div>
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

      {/* Community Reports section break */}
      {matches.length > 0 && (
        <div style={{ marginTop: '32px', marginBottom: '24px' }}>
          <hr style={{ border: 'none', borderTop: '1px solid var(--panel-border)', marginBottom: '24px' }} />
          <div style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px', lineHeight: 1.2 }}>
              Your Community Reports
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
              Below are your full intelligence reports for each matched city. Select a tab to explore schools, housing costs, cost of living, lifestyle scores, and neighborhood character. These are the places the HavenQuest algorithm identified as your strongest matches — take your time and get to know them.
            </p>
          </div>
        </div>
      )}

      {/* Tabbed city reports */}
      {matches.length > 0 && (
        <div style={{ marginTop: '8px', marginBottom: '0' }}>

          {/* Tab row — 3 columns matching city cards grid above */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
            {matches.slice(0, 3).map((match, i) => {
              const isActive = activeReportIndex === i
              return (
                <button
                  key={match.location.id}
                  onClick={() => setActiveReportIndex(i)}
                  style={isActive ? {
                    borderTop: '1.5px solid #B8912A',
                    borderLeft: '1.5px solid #B8912A',
                    borderRight: '1.5px solid #B8912A',
                    borderBottom: 'none',
                    borderRadius: '8px 8px 0 0',
                    background: 'var(--color-background-primary)',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  } : {
                    borderTop: '1.5px solid var(--color-border-secondary)',
                    borderLeft: '1.5px solid var(--color-border-secondary)',
                    borderRight: '1.5px solid var(--color-border-secondary)',
                    borderBottom: '1.5px solid #B8912A',
                    borderRadius: '8px 8px 0 0',
                    background: 'var(--color-background-secondary)',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <p style={{
                    fontSize: '10px', fontWeight: 500,
                    color: isActive ? '#B8912A' : 'var(--color-text-tertiary)',
                    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px',
                  }}>
                    {['Top Pick', 'Runner-Up', 'Strong Alt'][i]}
                  </p>
                  <p style={{
                    fontSize: '13px', fontWeight: 600,
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  }}>
                    {match.location.name}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Report content area */}
          <div
            id="report-section"
            style={{
              borderLeft: '1.5px solid #B8912A',
              borderRight: '1.5px solid #B8912A',
              borderBottom: '1.5px solid #B8912A',
              borderTop: 'none',
              borderRadius: '0 0 12px 12px',
              padding: '24px',
              background: 'var(--color-background-primary)',
            }}
          >
            {matches[activeReportIndex] && profile && (
              <div className="relative">
                {(() => {
                  const activeMatch = matches[activeReportIndex]
                  const status = getCityAffordabilityStatus(
                    activeMatch.location.housing.medianHomePrice,
                    activeMatch.location.housing.propertyTaxRate ?? 0.018
                  )
                  const statusLabel = status === 'comfortable' ? 'Comfortable'
                    : status === 'moderate' ? 'Moderate' : 'Stretched'
                  const dotColor = status === 'comfortable' ? '#1D9E75'
                    : status === 'moderate' ? '#C9A84C' : '#E53E3E'
                  return (
                    <>
                      {/* Print / Download buttons — top-right, alone */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '12px' }}>
                        <button
                          onClick={() => window.print()}
                          style={{ padding: '6px 14px', fontSize: '12px', fontWeight: 500, border: '0.5px solid var(--color-border-tertiary)', borderRadius: '6px', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                        >
                          Print
                        </button>
                        <button
                          onClick={() => window.open(`/report/${activeMatch.location.id}`, '_blank')}
                          style={{ padding: '6px 14px', fontSize: '12px', fontWeight: 500, border: 'none', borderRadius: '6px', background: '#B8912A', color: '#fff', cursor: 'pointer' }}
                        >
                          Download ↓
                        </button>
                      </div>
                      {/* Budget Fit indicator — left-aligned, above report body */}
                      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', padding: '6px 12px', borderRadius: '8px', border: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-secondary)', marginBottom: '16px' }}>
                        <p style={{ fontSize: '9px', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>
                          Budget Fit
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: dotColor }} />
                          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{statusLabel}</span>
                        </div>
                      </div>
                    </>
                  )
                })()}
                <FullReport
                  match={matches[activeReportIndex]}
                  profile={profile}
                  rank={activeReportIndex}
                />
              </div>
            )}
          </div>

        </div>
      )}

      {/* Notes */}
      {topCity && (
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
              <NotesArea initialNotes={initialNotes} />
            </Card>
          </div>
        </section>
      )}

      {/* Advance to Discover */}
      <div className="mt-10 pt-6" style={{ borderTop: '1px solid #E5E7EB' }}>
        <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
          Taken a look at your matches? When you&apos;re ready to dial in your
          direction, Discover is waiting.
        </p>
        <button
          onClick={async () => {
            if (email) {
              try {
                const supabase = createClient()
                await supabase
                  .from('users')
                  .update({ current_milemarker: 3 })
                  .eq('email', email.toLowerCase())
              } catch (err) {
                console.error('[MM2→3] write failed:', err)
              }
            }
            onAdvanceToDiscover()
          }}
          className="w-full py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: GOLD, color: '#16120D' }}
        >
          I&apos;m ready to go deeper →
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
