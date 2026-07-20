'use client'

// MM3 onboarding coach-mark tour (MM3TUT, CP2 — engine).
//
// A guided hybrid tour that walks a first-time user through the MM3 Navigator: drawer
// stops (1/2/3/9) OPEN the relevant control drawer and spotlight its contents; result
// stops (4–8) just spotlight + explain. Nine stops, fixed order, locked copy.
//
// Reuses the plumbing pattern from components/shared/HelpPopup.tsx: rendered through a
// portal to <body> (so it escapes MM3's nested overflow/stacking contexts), a scrim,
// Esc-to-close (capture + stopPropagation), focus moved into the dialog and returned on
// close, focus-trap on Tab, and prefers-reduced-motion respected.
//
// It cannot open a drawer from outside MM3Discover (drawer state is that component's
// internal `openDrawer`), so the per-step actions are wired in through props — the tour
// is rendered BY MM3Discover and calls its `setOpenDrawer` / `setShowAllCities`.
//
// CP2 is the engine only: it is controlled by the `open` prop and is never auto-opened
// here. The first-visit trigger, the localStorage "seen" flag, and the quiet reopen
// control are CP3 (owned by the parent). This file writes NO localStorage.
//
// Spotlight technique: a single fixed element positioned over the target with a large
// box-shadow spread paints the dim everywhere EXCEPT a gold-ringed cut-out at the target
// rect. This is stacking-context-agnostic — it never mutates the target's z-index — so it
// works over the desktop push-drawer AND the mobile bottom sheet without special-casing
// MM3's own stacking. A separate transparent blocker swallows background clicks.

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type DrawerKey = 'lifestyle' | 'financials' | 'nonneg' | 'guide'
type Placement = 'above' | 'below' | 'left' | 'right'

interface TourStep {
  /** data-tour value of the spotlight target on desktop. */
  target: string
  /** data-tour value on touch, when the element differs (drawers/Amy → the bottom sheet). */
  mobileTarget?: string
  /** Drawer stops: open this drawer as the step's action. */
  drawer?: DrawerKey
  /** Stop 7: expand the ranks 4–10 list. */
  showAll?: boolean
  /** Preferred bubble placement relative to the target (with viewport fallback). */
  place: Placement
  title: string
  body: string
}

// Locked copy (MM3TUT build brief). Titles = bold line; body = the sentence under it.
const STEPS: TourStep[] = [
  {
    drawer: 'lifestyle', target: 'left-drawer', mobileTarget: 'mobile-sheet', place: 'right',
    title: 'Lifestyle — set what matters',
    body: 'Start here. Sort what matters most into tiers, then slide toward the feel you want. This drawer is the main way you steer your matches.',
  },
  {
    drawer: 'financials', target: 'left-drawer', mobileTarget: 'mobile-sheet', place: 'right',
    title: 'Money — your budget',
    body: 'Enter your income and funds. Every affordability number on the page comes from here. Open Advanced for interest rate and loan term.',
  },
  {
    drawer: 'nonneg', target: 'left-drawer', mobileTarget: 'mobile-sheet', place: 'right',
    title: 'Limits — your dealbreakers',
    body: "Rule out what you won't accept and set your minimums, like school rating or a cap on property tax. Anything you rule out drops from your matches.",
  },
  {
    target: 'metro-pills', place: 'below',
    title: 'Filter by region',
    body: 'See All Texas at once, or focus on one metro. This filters your whole shortlist below.',
  },
  {
    target: 'top-matches', place: 'below',
    title: 'Your top matches',
    body: 'Your strongest matches, ranked. These re-rank live as you adjust the drawers, and the badge shows how comfortably each one fits your budget.',
  },
  {
    target: 'finzone', place: 'above',
    title: 'Your buying power',
    body: 'The most home you could comfortably afford, with the monthly payment behind it. It moves as you change your budget.',
  },
  {
    showAll: true, target: 'show-all-cities', place: 'above',
    title: 'The rest of your ranking',
    body: "Your top three aren't the whole list. Open this to see cities four through ten.",
  },
  {
    target: 'comparison', place: 'above',
    title: 'Compare side by side',
    body: 'See how your picks stack up against where you live now — taxes, schools, and cost, line by line.',
  },
  {
    drawer: 'guide', target: 'amy-panel', mobileTarget: 'mobile-sheet', place: 'left',
    title: 'Ask Amy anytime',
    body: 'Questions about Texas or the move? Ask Amy for plain answers. She points you to your Market Director for the personal stuff.',
  },
]

const INTRO_BODY =
  "Your Texas shortlist lives here. In under a minute, we'll open each control on the left, then show you how to read your matches. You can leave anytime."

// Palette (portal tokens + the tour mockup's paper/line values).
const GOLD = '#C5B783'
const GOLD_LABEL = '#a48f4e'
const NAVY = '#0A1E3D'
const INK = '#20293a'
const MUTED = '#6a7180'
const PAPER = '#FBF9F4'
const STONE = '#e3ddce'
const DIM = 'rgba(8,22,44,0.80)'

const Z = 4000 // blocker; dim = Z+1, bubble/intro = Z+2. Above MM3's own modals (z<=1000).
const PAD = 6 // breathing room around the spotlighted rect
const BUBBLE_W = 322

const CSS = `
.mm3tour-go, .mm3tour-later, .mm3tour-skip, .mm3tour-btn { font-family: inherit; cursor: pointer; }
.mm3tour-go { background:${GOLD}; border:none; color:${NAVY}; font-weight:600; font-size:15px; border-radius:11px; padding:13px 26px; }
.mm3tour-later { display:block; margin:12px auto 0; background:none; border:none; color:${MUTED}; font-size:13px; }
.mm3tour-skip { background:none; border:none; color:${MUTED}; font-size:12px; padding:5px 2px; }
.mm3tour-btn { font-weight:600; font-size:12.5px; border-radius:9px; padding:8px 14px; border:1px solid ${STONE}; background:#fff; color:${NAVY}; }
.mm3tour-btn-primary { background:${GOLD}; border-color:${GOLD}; }
.mm3tour-go:hover, .mm3tour-btn:hover { filter: brightness(0.97); }
.mm3tour-go:focus-visible, .mm3tour-later:focus-visible, .mm3tour-skip:focus-visible, .mm3tour-btn:focus-visible { outline:2px solid ${NAVY}; outline-offset:2px; }
@media (prefers-reduced-motion: no-preference) {
  .mm3tour-intro { animation: mm3tourIntroIn .22s ease-out; }
}
@keyframes mm3tourIntroIn { from { opacity:0; } to { opacity:1; } }
`

function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(v, b))
}

function trapTab(e: KeyboardEvent, container: HTMLElement | null) {
  if (!container) return
  const f = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  if (f.length === 0) { e.preventDefault(); return }
  const first = f[0]
  const last = f[f.length - 1]
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
}

interface Rect { top: number; left: number; width: number; height: number }
interface BubblePos { top: number; left: number; arrow: { edge: 'top' | 'bottom' | 'left' | 'right'; offset: number } | null }

interface MM3TourProps {
  /** Controlled visibility. CP3 flips this on first visit / reopen. */
  open: boolean
  /** Called on Finish, Skip, "explore on my own", or Esc. CP3 writes the seen flag here. */
  onClose: () => void
  isMobile: boolean
  setOpenDrawer: (k: DrawerKey | null) => void
  setShowAllCities: (v: boolean) => void
}

export default function MM3Tour({ open, onClose, isMobile, setOpenDrawer, setShowAllCities }: MM3TourProps) {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState<'intro' | 'running'>('intro')
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)
  const [bubblePos, setBubblePos] = useState<BubblePos | null>(null)
  const [reduced, setReduced] = useState(false)

  const bubbleRef = useRef<HTMLDivElement | null>(null)
  const introRef = useRef<HTMLDivElement | null>(null)
  const nextBtnRef = useRef<HTMLButtonElement | null>(null)
  const goBtnRef = useRef<HTMLButtonElement | null>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  const lastStep = STEPS.length - 1

  useEffect(() => { setMounted(true) }, [])

  // prefers-reduced-motion (inherited behavior from HelpPopup).
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  // On open: remember focus, reset to the intro, and put MM3 back to a clean baseline.
  useEffect(() => {
    if (!open) return
    restoreFocusRef.current = (document.activeElement as HTMLElement) ?? null
    setPhase('intro')
    setStep(0)
    setRect(null)
    setBubblePos(null)
    setOpenDrawer(null)
    setShowAllCities(false)
  }, [open, setOpenDrawer, setShowAllCities])

  // Dismiss (Finish / Skip / explore-on-own / Esc): restore MM3 state + return focus.
  const finish = useCallback(() => {
    setOpenDrawer(null)
    setShowAllCities(false)
    onClose()
    const el = restoreFocusRef.current
    if (el) setTimeout(() => { try { el.focus() } catch { /* element may be gone */ } }, 0)
  }, [onClose, setOpenDrawer, setShowAllCities])

  // Measure the current step's target into the spotlight rect.
  const measure = useCallback(() => {
    const s = STEPS[step]
    const sel = isMobile && s.mobileTarget ? s.mobileTarget : s.target
    const el = document.querySelector<HTMLElement>(`[data-tour="${sel}"]`)
    if (!el) { setRect(null); return }
    const r = el.getBoundingClientRect()
    if (r.width === 0 && r.height === 0) { setRect(null); return }
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
  }, [step, isMobile])

  // Enter a running step: apply its action, scroll the target into view, then measure.
  useEffect(() => {
    if (!open || phase !== 'running') return
    const s = STEPS[step]
    if (s.drawer) setOpenDrawer(s.drawer)
    else setOpenDrawer(null)
    setShowAllCities(!!s.showAll)

    const timers: ReturnType<typeof setTimeout>[] = []
    const openDelay = s.drawer ? 340 : 60 // let the drawer/sheet finish animating before measuring
    timers.push(setTimeout(() => {
      const sel = isMobile && s.mobileTarget ? s.mobileTarget : s.target
      const el = document.querySelector<HTMLElement>(`[data-tour="${sel}"]`)
      if (el) {
        try { el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }) } catch { /* noop */ }
      }
      timers.push(setTimeout(measure, reduced ? 20 : 320))
    }, openDelay))
    return () => timers.forEach(clearTimeout)
  }, [open, phase, step, isMobile, reduced, measure, setOpenDrawer, setShowAllCities])

  // Keep the spotlight aligned while the user scrolls (nested scroll containers → capture) or resizes.
  useEffect(() => {
    if (!open || phase !== 'running') return
    let ticking = false
    const onMove = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => { ticking = false; measure() })
    }
    window.addEventListener('resize', onMove)
    document.addEventListener('scroll', onMove, true)
    return () => {
      window.removeEventListener('resize', onMove)
      document.removeEventListener('scroll', onMove, true)
    }
  }, [open, phase, measure])

  // Position the bubble once the rect (and the bubble's own size) are known.
  useEffect(() => {
    if (!open || phase !== 'running') return
    const bubble = bubbleRef.current
    if (!bubble) return
    const bw = bubble.offsetWidth || BUBBLE_W
    const bh = bubble.offsetHeight || 180
    const vw = window.innerWidth
    const vh = window.innerHeight
    const m = 14

    if (!rect) {
      setBubblePos({ top: Math.max(m, (vh - bh) / 2), left: Math.max(m, (vw - bw) / 2), arrow: null })
      return
    }

    const s = STEPS[step]
    // On touch, drawer/Amy stops spotlight the bottom sheet (fills the lower ~75vh), so the
    // bubble goes above it regardless of the desktop preference.
    let place: Placement = isMobile && s.drawer ? 'above' : s.place
    const r = rect
    if (place === 'below' && r.top + r.height + m + bh > vh) place = 'above'
    if (place === 'above' && r.top - m - bh < 0) place = 'below'
    if (place === 'right' && r.left + r.width + m + bw > vw) place = isMobile ? 'above' : 'below'
    if (place === 'left' && r.left - m - bw < 0) place = isMobile ? 'above' : 'below'

    let top = 0
    let left = 0
    if (place === 'below') { top = r.top + r.height + m; left = r.left }
    else if (place === 'above') { top = r.top - m - bh; left = r.left }
    else if (place === 'right') { top = r.top; left = r.left + r.width + m }
    else { top = r.top; left = r.left - m - bw }

    left = clamp(left, m, Math.max(m, vw - bw - m))
    top = clamp(top, m, Math.max(m, vh - bh - m))

    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    let arrow: BubblePos['arrow'] = null
    if (place === 'below') arrow = { edge: 'top', offset: clamp(cx - left, 18, bw - 18) }
    else if (place === 'above') arrow = { edge: 'bottom', offset: clamp(cx - left, 18, bw - 18) }
    else if (place === 'right') arrow = { edge: 'left', offset: clamp(cy - top, 18, bh - 18) }
    else arrow = { edge: 'right', offset: clamp(cy - top, 18, bh - 18) }

    setBubblePos({ top, left, arrow })
  }, [rect, open, phase, step, isMobile])

  // Move focus into the active surface (bubble Next / intro Show-me-around).
  useEffect(() => {
    if (!open) return
    const id = setTimeout(() => {
      if (phase === 'running') nextBtnRef.current?.focus()
      else goBtnRef.current?.focus()
    }, 60)
    return () => clearTimeout(id)
  }, [open, phase, step])

  // Keyboard: →/Next, ←/Back, Esc/dismiss, Tab trapped in the active surface.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        e.preventDefault()
        finish()
        return
      }
      if (phase === 'running') {
        if (e.key === 'ArrowRight') { e.preventDefault(); if (step < lastStep) setStep(step + 1); else finish() }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); if (step > 0) setStep(step - 1) }
        else if (e.key === 'Tab') trapTab(e, bubbleRef.current)
      } else if (e.key === 'Tab') {
        trapTab(e, introRef.current)
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [open, phase, step, lastStep, finish])

  if (!mounted || !open) return null

  const s = STEPS[step]

  return createPortal(
    <div>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Transparent blocker — swallows background clicks so the page can't be edited mid-tour. */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: Z, background: 'transparent' }}
        onClick={(e) => e.stopPropagation()}
        aria-hidden="true"
      />

      {/* Dim + spotlight. The box-shadow spread paints the dim everywhere except the gold-ringed
          cut-out at the target rect; a plain full-screen dim is used when there is no target. */}
      {phase === 'intro' || !rect ? (
        <div style={{ position: 'fixed', inset: 0, zIndex: Z + 1, background: DIM, pointerEvents: 'none' }} aria-hidden="true" />
      ) : (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            borderRadius: 14,
            boxShadow: `0 0 0 3px ${GOLD}, 0 0 0 9999px ${DIM}`,
            zIndex: Z + 1,
            pointerEvents: 'none',
            transition: reduced ? 'none' : 'top 0.25s ease, left 0.25s ease, width 0.25s ease, height 0.25s ease',
          }}
        />
      )}

      {/* Intro (welcome) — centered card, Show me around / explore on my own. */}
      {phase === 'intro' && (
        <div
          ref={introRef}
          className="mm3tour-intro"
          role="dialog"
          aria-modal="true"
          aria-label="Navigator tour"
          style={{
            position: 'fixed', zIndex: Z + 2, left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
            maxWidth: '430px', width: 'calc(100% - 48px)', background: PAPER, borderRadius: '18px',
            boxShadow: '0 24px 60px rgba(8,22,44,0.5)', padding: '30px 30px 26px', textAlign: 'center',
            borderTop: `5px solid ${GOLD}`, fontFamily: 'inherit',
          }}
        >
          <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD_LABEL, fontWeight: 600 }}>Welcome</div>
          <h2 style={{ margin: '8px 0 10px', fontSize: '23px', color: NAVY, fontWeight: 600 }}>This is your Navigator</h2>
          <p style={{ margin: '0 0 20px', fontSize: '14px', lineHeight: 1.55, color: INK }}>{INTRO_BODY}</p>
          <button ref={goBtnRef} type="button" className="mm3tour-go" onClick={() => setPhase('running')}>Show me around</button>
          <button type="button" className="mm3tour-later" onClick={finish}>{"I'll explore on my own"}</button>
        </div>
      )}

      {/* Coach bubble */}
      {phase === 'running' && (
        <div
          ref={bubbleRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mm3tour-title"
          style={{
            position: 'fixed', zIndex: Z + 2,
            top: bubblePos ? bubblePos.top : -9999,
            left: bubblePos ? bubblePos.left : -9999,
            visibility: bubblePos ? 'visible' : 'hidden',
            maxWidth: `${BUBBLE_W}px`, width: 'calc(100vw - 28px)',
            background: PAPER, borderRadius: '14px', boxShadow: '0 18px 44px rgba(8,22,44,0.42)',
            padding: '17px 17px 15px', borderTop: `4px solid ${GOLD}`, fontFamily: 'inherit',
          }}
        >
          {bubblePos?.arrow && (
            <span
              aria-hidden="true"
              style={{
                position: 'absolute', width: '13px', height: '13px', background: PAPER, transform: 'rotate(45deg)',
                ...(bubblePos.arrow.edge === 'top' ? { top: '-6px', left: `${bubblePos.arrow.offset}px` }
                  : bubblePos.arrow.edge === 'bottom' ? { bottom: '-6px', left: `${bubblePos.arrow.offset}px` }
                  : bubblePos.arrow.edge === 'left' ? { left: '-6px', top: `${bubblePos.arrow.offset}px` }
                  : { right: '-6px', top: `${bubblePos.arrow.offset}px` }),
              }}
            />
          )}
          <div style={{ fontSize: '10.5px', letterSpacing: '0.13em', textTransform: 'uppercase', color: GOLD_LABEL, fontWeight: 600 }}>
            {`Step ${step + 1} of ${STEPS.length}`}
          </div>
          <h5 id="mm3tour-title" style={{ margin: '5px 0 6px', fontSize: '15.5px', color: NAVY, fontWeight: 600 }}>{s.title}</h5>
          <p style={{ margin: '0 0 13px', fontSize: '13px', lineHeight: 1.5, color: INK }}>{s.body}</p>
          <div style={{ display: 'flex', gap: '5px', marginBottom: '13px', flexWrap: 'wrap' }}>
            {STEPS.map((_, n) => (
              <span key={n} aria-hidden="true" style={{ width: '6px', height: '6px', borderRadius: '50%', background: n === step ? GOLD : STONE }} />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button type="button" className="mm3tour-skip" onClick={finish}>Skip tour</button>
            <div style={{ display: 'flex', gap: '7px' }}>
              {step > 0 && (
                <button type="button" className="mm3tour-btn" onClick={() => setStep(step - 1)}>Back</button>
              )}
              <button
                ref={nextBtnRef}
                type="button"
                className="mm3tour-btn mm3tour-btn-primary"
                onClick={() => { if (step < lastStep) setStep(step + 1); else finish() }}
              >
                {step === lastStep ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  )
}
