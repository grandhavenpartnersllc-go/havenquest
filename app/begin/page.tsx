'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import { Plane, MapPin, Map, Compass, ArrowRight, Check } from 'lucide-react'

const GOLD = '#B8912A'
const NAVY = '#0A1E3D'
const BLUE = '#0076B6'
const LOCAL_SESSION_KEY = 'hq_session'

const WHAT_YOULL_COVER = [
  'Your household size and home preferences',
  'Your annual household income',
  'Your lifestyle priorities — schools, safety, walkability, and more',
  'Your budget and down payment range',
]

type OriginType = 'outofstate' | 'instate'

export default function BeginPage() {
  const router = useRouter()

  // Step 0 — Intent gate
  const [intentChecked, setIntentChecked] = useState(false)
  const [intentConfirmed, setIntentConfirmed] = useState(false)

  // Step 1
  const [originType, setOriginType] = useState<OriginType | null>(null)

  // Step 2
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  // Step 3
  const [firstName, setFirstName] = useState('')
  const [zip, setZip] = useState('')
  const [zipError, setZipError] = useState('')

  useEffect(() => {
    const savedFirstName = sessionStorage.getItem('hq_quiz_firstname')
    const savedZip = sessionStorage.getItem('hq_quiz_zip')
    if (savedFirstName) setFirstName(savedFirstName)
    if (savedZip) setZip(savedZip)
  }, [])

  // Animation flags — set via useEffect so transitions fire after DOM paint
  const [step2Animate, setStep2Animate] = useState(false)
  const [step3Animate, setStep3Animate] = useState(false)

  // Scroll refs for auto-scroll after reveal animation
  const step2Ref = useRef<HTMLDivElement>(null)
  const step3Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (originType) {
      const t1 = setTimeout(() => setStep2Animate(true), 20)
      const t2 = setTimeout(() => {
        step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 450)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
    setStep2Animate(false)
  }, [originType])

  useEffect(() => {
    if (selectedPath) {
      const t1 = setTimeout(() => setStep3Animate(true), 20)
      const t2 = setTimeout(() => {
        step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 450)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
    setStep3Animate(false)
  }, [selectedPath])

  function handleIntentStart() {
    if (!intentChecked) return
    sessionStorage.setItem('hq_journey_intent', 'true')
    sessionStorage.setItem('hq_journey_intent_at', new Date().toISOString())
    setIntentConfirmed(true)
  }

  function handleOriginSelect(type: OriginType) {
    if (originType !== type) {
      setSelectedPath(null)
      setStep3Animate(false)
      setFirstName('')
      setZip('')
      setZipError('')
    }
    setOriginType(type)
  }

  function handlePathSelect(path: string) {
    if (selectedPath !== path) {
      setStep3Animate(false)
      setFirstName('')
      setZip('')
      setZipError('')
    }
    setSelectedPath(path)
  }

  function handleSubmit(e: React.FormEvent) {
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
    sessionStorage.setItem('hq_origin_type', originType!)
    sessionStorage.setItem('hq_path', selectedPath === '/explore' ? 'explore' : 'metro')
    sessionStorage.setItem('hq_quiz_firstname', trimmedName)
    sessionStorage.setItem('hq_quiz_zip', trimmedZip)
    sessionStorage.setItem('hq_quiz_step', '1')
    const rawSession = localStorage.getItem(LOCAL_SESSION_KEY)
    if (rawSession) {
      try {
        const sess = JSON.parse(rawSession)
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ ...sess, firstName: trimmedName }))
      } catch {}
    }
    fetch('/api/quiz-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: trimmedName, originZip: trimmedZip }),
    }).catch(() => {})
    router.push(selectedPath!)
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="max-w-3xl mx-auto px-4 py-16 pb-24">

          {/* ── Step 0 — Intent gate (pre-quiz welcome screen) ── */}
          {!intentConfirmed ? (
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

              {/* What you'll cover panel */}
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

              {/* Checkbox confirmation */}
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

              {/* CTA */}
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
          ) : (
            <>
              {/* ── Step 1 — Always visible ── */}
              <div className="mb-10">
                <p className="text-xs font-bold uppercase tracking-widest mb-2"
                   style={{ color: GOLD, letterSpacing: '0.18em' }}>
                  Your Navigator Journey
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-4">
                  So, you&apos;ve decided on Texas. Welcome.
                </h2>
                <p className="text-base text-gray-500 leading-relaxed max-w-lg mb-8">
                  We&apos;re glad you&apos;re here. Before we match you to the right Texas community, we just need to understand a little about your move. It&apos;ll only take a minute — and everything from here gets more personal.
                </p>
                <div className="grid md:grid-cols-2 gap-4">

                  {/* Card A — Out of state */}
                  <button
                    type="button"
                    onClick={() => handleOriginSelect('outofstate')}
                    className="relative flex flex-col items-start p-7 rounded-2xl bg-white border-2 text-left transition-all hover:shadow-md"
                    style={{
                      borderColor: originType === 'outofstate' ? GOLD : '#E5E7EB',
                      backgroundColor: originType === 'outofstate' ? 'rgba(184,145,42,0.04)' : '#FFFFFF',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                         style={{ backgroundColor: originType === 'outofstate' ? 'rgba(184,145,42,0.12)' : '#F3F4F6' }}>
                      <Plane size={20} strokeWidth={1.5}
                             style={{ color: originType === 'outofstate' ? GOLD : '#6B7280' }} />
                    </div>
                    <h3 className="font-bold text-gray-900 tracking-tight mb-1">
                      I&apos;m moving from out of state
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Texas is new to me and I want to find the right place to land.
                    </p>
                    {originType === 'outofstate' && (
                      <span className="absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: 'rgba(184,145,42,0.12)', color: GOLD }}>
                        ✓
                      </span>
                    )}
                  </button>

                  {/* Card B — In state */}
                  <button
                    type="button"
                    onClick={() => handleOriginSelect('instate')}
                    className="relative flex flex-col items-start p-7 rounded-2xl bg-white border-2 text-left transition-all hover:shadow-md"
                    style={{
                      borderColor: originType === 'instate' ? GOLD : '#E5E7EB',
                      backgroundColor: originType === 'instate' ? 'rgba(184,145,42,0.04)' : '#FFFFFF',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                         style={{ backgroundColor: originType === 'instate' ? 'rgba(184,145,42,0.12)' : '#F3F4F6' }}>
                      <MapPin size={20} strokeWidth={1.5}
                              style={{ color: originType === 'instate' ? GOLD : '#6B7280' }} />
                    </div>
                    <h3 className="font-bold text-gray-900 tracking-tight mb-1">
                      I&apos;m relocating within Texas
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      I&apos;m already in Texas and looking for the right community.
                    </p>
                    {originType === 'instate' && (
                      <span className="absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: 'rgba(184,145,42,0.12)', color: GOLD }}>
                        ✓
                      </span>
                    )}
                  </button>

                </div>
              </div>

              {/* ── Step 2 — Fades in after Step 1 ── */}
              {originType && (
                <div
                  ref={step2Ref}
                  className="mb-10"
                  style={{
                    transition: 'opacity 0.4s ease, transform 0.4s ease',
                    opacity: step2Animate ? 1 : 0,
                    transform: step2Animate ? 'translateY(0)' : 'translateY(14px)',
                  }}
                >
                  <div className="border-t border-gray-100 mb-8" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-6">
                    And where are you in your decision?
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">

                    {/* Card A — Still exploring */}
                    <button
                      type="button"
                      onClick={() => handlePathSelect('/explore')}
                      className="relative flex flex-col items-start p-7 rounded-2xl bg-white border-2 text-left transition-all hover:shadow-md"
                      style={{
                        borderColor: selectedPath === '/explore' ? GOLD : '#E5E7EB',
                        backgroundColor: selectedPath === '/explore' ? 'rgba(184,145,42,0.04)' : '#FFFFFF',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                           style={{ backgroundColor: selectedPath === '/explore' ? 'rgba(184,145,42,0.12)' : '#F3F4F6' }}>
                        <Map size={20} strokeWidth={1.5}
                             style={{ color: selectedPath === '/explore' ? GOLD : '#6B7280' }} />
                      </div>
                      <h3 className="font-bold text-gray-900 tracking-tight mb-1">
                        I&apos;m still exploring
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Help me find the right Texas community based on my lifestyle and priorities.
                      </p>
                      {selectedPath === '/explore' && (
                        <span className="absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: 'rgba(184,145,42,0.12)', color: GOLD }}>
                          ✓
                        </span>
                      )}
                    </button>

                    {/* Card B — Know where headed */}
                    <button
                      type="button"
                      onClick={() => handlePathSelect('/metro')}
                      className="relative flex flex-col items-start p-7 rounded-2xl bg-white border-2 text-left transition-all hover:shadow-md"
                      style={{
                        borderColor: selectedPath === '/metro' ? GOLD : '#E5E7EB',
                        backgroundColor: selectedPath === '/metro' ? 'rgba(184,145,42,0.04)' : '#FFFFFF',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                           style={{ backgroundColor: selectedPath === '/metro' ? 'rgba(184,145,42,0.12)' : '#F3F4F6' }}>
                        <Compass size={20} strokeWidth={1.5}
                                 style={{ color: selectedPath === '/metro' ? GOLD : '#6B7280' }} />
                      </div>
                      <h3 className="font-bold text-gray-900 tracking-tight mb-1">
                        I know where I&apos;m headed
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        I have a market in mind. Take me straight there.
                      </p>
                      {selectedPath === '/metro' && (
                        <span className="absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: 'rgba(184,145,42,0.12)', color: GOLD }}>
                          ✓
                        </span>
                      )}
                    </button>

                  </div>
                </div>
              )}

              {/* ── Step 3 — Fades in after Step 2 ── */}
              {selectedPath && (
                <div
                  ref={step3Ref}
                  style={{
                    transition: 'opacity 0.4s ease, transform 0.4s ease',
                    opacity: step3Animate ? 1 : 0,
                    transform: step3Animate ? 'translateY(0)' : 'translateY(14px)',
                  }}
                >
                  <div className="border-t border-gray-100 mb-8" />
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                      Perfect. Let&apos;s make this personal.
                    </h2>
                    <p className="text-gray-500">
                      We&apos;ll use this to tailor your experience from the start.
                    </p>
                  </div>
                  <form
                    onSubmit={handleSubmit}
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
                        onChange={e => {
                          setFirstName(e.target.value)
                          sessionStorage.setItem('hq_quiz_firstname', e.target.value)
                        }}
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
                        onChange={e => {
                          setZip(e.target.value)
                          setZipError('')
                          sessionStorage.setItem('hq_quiz_zip', e.target.value)
                        }}
                        placeholder="60631"
                        required
                        maxLength={5}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                      />
                      {zipError && <p className="mt-1.5 text-xs text-red-500">{zipError}</p>}
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90 inline-flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#1A5FA8', color: '#FFFFFF' }}
                    >
                      Let&apos;s Go <ArrowRight size={14} />
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
