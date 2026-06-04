'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import { Plane, MapPin, Map, Compass, ArrowRight } from 'lucide-react'

const GOLD = '#B8912A'
const LOCAL_SESSION_KEY = 'hq_session'

type OriginType = 'outofstate' | 'instate'

export default function BeginPage() {
  const router = useRouter()

  // Step 1
  const [originType, setOriginType] = useState<OriginType | null>(null)

  // Step 2
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  // Step 3
  const [firstName, setFirstName] = useState('')
  const [zip, setZip] = useState('')
  const [zipError, setZipError] = useState('')

  // Animation flags — set via useEffect so transitions fire after DOM paint
  const [step2Animate, setStep2Animate] = useState(false)
  const [step3Animate, setStep3Animate] = useState(false)

  useEffect(() => {
    if (originType) {
      const t = setTimeout(() => setStep2Animate(true), 20)
      return () => clearTimeout(t)
    }
    setStep2Animate(false)
  }, [originType])

  useEffect(() => {
    if (selectedPath) {
      const t = setTimeout(() => setStep3Animate(true), 20)
      return () => clearTimeout(t)
    }
    setStep3Animate(false)
  }, [selectedPath])

  function handleOriginSelect(type: OriginType) {
    if (originType !== type) {
      // Switching answer — reset downstream selections
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
      // Switching answer — re-animate step 3
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
    sessionStorage.setItem('hq_first_name', firstName.trim())
    sessionStorage.setItem('hq_origin_zip', zip.trim())
    sessionStorage.setItem('hq_origin_type', originType!)
    const rawSession = localStorage.getItem(LOCAL_SESSION_KEY)
    if (rawSession) {
      try {
        const sess = JSON.parse(rawSession)
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ ...sess, firstName: firstName.trim() }))
      } catch {}
    }
    router.push(selectedPath!)
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="max-w-3xl mx-auto px-4 py-16 pb-24">

          {/* ── Step 1 — Always visible ── */}
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-2"
               style={{ color: GOLD, letterSpacing: '0.18em' }}>
              Your Navigator Journey
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-6">
              First, tell us about your move.
            </h2>
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
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Jennifer"
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
                  className="w-full py-3.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90 inline-flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#1A5FA8', color: '#FFFFFF' }}
                >
                  Let&apos;s Go <ArrowRight size={14} />
                </button>
              </form>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
