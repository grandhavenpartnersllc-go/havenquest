'use client'

/**
 * Investor landing page — faithful React port of havenquest_investor_page_mockup_v2.html (Stage 1).
 *
 * Scope (per INVESTOR_PAGE_stage1_build_brief.md): the page only. Nothing is wired — the
 * "Investor Portal" / "Request access" buttons stay href="#", there is no popup, form, email,
 * Supabase write, or token gate. Real project images replace the mockup's placeholder blocks.
 *
 * The left rail is a scrollspy over two groups: the JUMPS destinations (Home, Experience
 * HavenQuest) and the ten numbered MILESTONES. An IntersectionObserver watches every id from
 * both, and any of them can light its row. Only MILESTONES ids advance "Your Progress" — the
 * bar and the "N of 10 sections explored" counter stay out of ten, so the jump destinations
 * are navigable without inflating progress. Section ids do not match display numbers (Why
 * Texas is id s9); read the id, never infer it. In-page anchor jumps scroll smoothly
 * (scroll-behavior applied for this page's lifetime); Home uses scrollTo(0) instead of its
 * anchor, because scroll-margin-top would stop #top 74px short of true top.
 */

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Script from 'next/script'
import TexasMap, { type MetroKey } from '@/components/home/TexasMap'
import InvestorIntroModal from '@/components/investor/InvestorIntroModal'
import styles from './investor.module.css'

// Calendly's widget.js attaches this at runtime (loaded via next/script below).
declare global {
  interface Window {
    Calendly?: { initPopupWidget: (options: { url: string }) => void }
  }
}

const CALENDLY_URL = 'https://calendly.com/craig-asbach-havenquest/30min'

const MILESTONES = [
  { id: 's1', label: 'The Problem' },
  { id: 's9', label: 'Why Texas' },
  { id: 's6', label: 'Market Opportunity' },
  { id: 's3', label: 'Our Solution' },
  { id: 's4', label: 'The Technology' },
  { id: 's-trac', label: 'Traction' },
  { id: 's5', label: 'Business Model' },
  { id: 's7', label: 'Our Vision (Atlas)' },
  { id: 's8', label: 'The Team' },
  { id: 's10', label: 'Investment Opportunity' },
] as const

// Non-slide rail destinations. Deliberately NOT part of MILESTONES: these must be able to
// light the rail without advancing progress, and adding them to MILESTONES would renumber
// the deck's badges and skew pct / the counter, which stay out of 10. Both ids already
// exist on their sections — nothing here creates or renames an anchor.
const JUMPS = [
  { id: 'top', label: 'Home' },
  { id: 's-tour', label: 'Experience HavenQuest' },
] as const

const ORDER = MILESTONES.map((m) => m.id)

// Progress is scored against these ten only — index+1 is the "N of 10" numerator.
const OBSERVED_SLIDE_IDS: readonly string[] = ORDER

// Everything the scrollspy watches. Derived from both arrays rather than naming the two jump
// ids inline, so growing JUMPS automatically extends the observer.
const OBSERVED_IDS: readonly string[] = [...JUMPS.map((j) => j.id), ...ORDER]

/**
 * Open-role seat glyph, used by the two unfilled cards in section 08. Deliberately the same
 * visual family as the open advisory seats below — a seat waiting, not a missing image.
 * aria-hidden because the card's own <h3> already names the role.
 */
function OpenSeatMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 12a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4zm0 1.9c-3.6 0-7.2 1.85-7.2 4.15V21h14.4v-2.95c0-2.3-3.6-4.15-7.2-4.15z" />
    </svg>
  )
}

/**
 * LinkedIn glyph, used only by section 08 (team cards + advisory seat one). Inline SVG so
 * there is no new asset file and no icon-library dependency; a local component rather than
 * three copies of the path string. aria-hidden because the accessible name lives on the
 * wrapping <a> (aria-label), which names whose profile it is.
 */
function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

export default function InvestorPage() {
  // Seeded to 'top', not 's1': the page loads at the hero, and seeding to the first slide lit
  // "The Problem" while the visitor was still above it. maxReached stays at 1 deliberately —
  // dropping it to 0 would introduce a 0% progress state nobody has seen. Consequence: at page
  // top the rail lights Home while the counter already reads "1 of 10".
  const [activeId, setActiveId] = useState<string>('top')
  const [maxReached, setMaxReached] = useState(1)
  const [metro, setMetro] = useState<MetroKey>('austin')
  const [introOpen, setIntroOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  // Brief 2 — "Keep me updated" opt-in. The visitor's token comes from the ?token= link they arrived on;
  // no token (e.g. Craig via beta code) means the button no-ops. optedIn flips to the green confirmed pill.
  const [investorToken, setInvestorToken] = useState<string | null>(null)
  const [optedIn, setOptedIn] = useState(false)
  const [optingIn, setOptingIn] = useState(false)

  useEffect(() => {
    // Smooth in-page anchor scrolling, applied only while this page is mounted.
    const prevScrollBehavior = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'smooth'

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            // Lit state and counted state are deliberately separate. ANY observed section can
            // light its row — that is what makes the jump destinations behave like the rest of
            // the rail. Only MILESTONES sections advance progress, so the counter and pct stay
            // out of ten. Letting a JUMPS id reach setMaxReached would make both wrong.
            setActiveId(e.target.id)
            const i = OBSERVED_SLIDE_IDS.indexOf(e.target.id)
            if (i >= 0) setMaxReached((m) => Math.max(m, i + 1))
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )

    OBSERVED_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })

    return () => {
      obs.disconnect()
      document.documentElement.style.scrollBehavior = prevScrollBehavior
    }
  }, [])

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        setShowBackToTop(window.scrollY > window.innerHeight * 0.6)
        raf = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Read the visitor's token from the ?token= they arrived on (client-side), so "Keep me updated" can opt in.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token')
    if (t) setInvestorToken(t)
  }, [])

  const handleKeepUpdated = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!investorToken || optingIn || optedIn) return // no token (beta-code viewer) → no-op gracefully
    setOptingIn(true)
    try {
      const res = await fetch('/api/investor-interest/opt-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: investorToken }),
      })
      if (res.ok) setOptedIn(true)
    } catch {
      // silent — the visitor can retry; nothing destructive happened
    } finally {
      setOptingIn(false)
    }
  }

  const pct = Math.round((maxReached / MILESTONES.length) * 100)

  return (
    <div className={styles.page}>
      {/* Calendly popup assets — CSS hoisted by React 19; JS via next/script. Used by the
          "Schedule a conversation" CTA in the Investment section (window.Calendly at click-time). */}
      <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" />
      {/* ---- TOP NAV ---- */}
      <div className={styles.topnav}>
        <div className={styles.topnavIn}>
          <div className={styles.masthead}>
            <div
              className={styles.brand}
              role="button"
              tabIndex={0}
              aria-label="Back to top"
              style={{ cursor: 'pointer' }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
            >
              {/* Wordmark only, matching the homepage header (HomeHeader.tsx) — mark dropped. Click scrolls to top. */}
              <div className={styles.wordmark}>
                <span className={styles.wmHaven}>Haven</span><span className={styles.wmQuest}>Quest</span>
                <small className={styles.wmTag}>Clarity. Confidence. Peace of Mind.</small>
              </div>
            </div>
            {/* Masthead designation — non-interactive "you are here" marker, right of the logo block. */}
            <span className={styles.mastheadBar} aria-hidden="true" />
            <span className={styles.designation}>Investor Overview</span>
          </div>
          <div className={styles.topnavLinks}>
            <a href="#s1">The Opportunity</a>
            <a href="#s3">Our Solution</a>
            <a href="#s-trac">Traction</a>
            <a href="#s5">Business Model</a>
            <a href="#s8">Team</a>
            <a href="#s10">Investment</a>
          </div>
          {/* Returns to the public homepage (same tab). Gated homepage expected during beta review. */}
          <a className={styles.returnBtn} href="/">← Back to HavenQuest.co</a>
        </div>
      </div>

      <div className={styles.shell}>
        {/* ---- LEFT RAIL (scrollspy) ---- */}
        <aside className={styles.rail}>
          {/* Jump group — no header, no badge (approved mockup option B). Labels start at the
              rail's left padding rather than aligning with the numbered rows. */}
          <div className={styles.railJump}>
            {JUMPS.map((j) => (
              <a
                key={j.id}
                href={`#${j.id}`}
                className={activeId === j.id ? `${styles.ms} ${styles.active}` : styles.ms}
                // Home scrolls to true top. The anchor alone would stop 74px short, because
                // scroll-margin-top:var(--nav-h) applies to .page section and the hero starts
                // at y=0. Same call the back-to-top button uses.
                onClick={
                  j.id === 'top'
                    ? (e) => {
                        e.preventDefault()
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }
                    : undefined
                }
              >
                <div className={styles.t}>{j.label}</div>
              </a>
            ))}
          </div>
          <div className={styles.lbl}>The Overview</div>
          {MILESTONES.map((m, i) => (
            <a
              key={m.id}
              href={`#${m.id}`}
              className={activeId === m.id ? `${styles.ms} ${styles.active}` : styles.ms}
            >
              <div className={styles.dot}>{String(i + 1).padStart(2, '0')}</div>
              <div className={styles.t}>{m.label}</div>
            </a>
          ))}
          <div className={styles.progWrap}>
            <div className={styles.top}>
              <span>Your Progress</span>
              <span>{pct}%</span>
            </div>
            <div className={styles.prog}>
              <i style={{ width: `${pct}%` }} />
            </div>
            <div className={styles.cnt}>
              <span>{maxReached}</span> of {MILESTONES.length} sections explored
            </div>
          </div>
        </aside>

        {/* ---- MAIN ---- */}
        <main className={styles.main}>
          {/* HERO */}
          <section className={styles.hero} id="top" style={{ padding: 0 }}>
            <div className={styles.sky}>
              <Image
                src="/images/home/hero-austin-skyline.jpg"
                alt="Austin skyline at dusk"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className={styles.heroScrim} />
            <div className={styles.heroIn}>
              <p className={`${styles.eyebrow} ${styles.emGold}`}>Find Your Texas &nbsp;·&nbsp; Investor Overview</p>
              <h1>
                Relocation is more than a move. It&apos;s a <span className={`${styles.gold} ${styles.ital}`}>new life.</span>
              </h1>
              <p className={styles.sub}>
                The current process is fragmented, outdated, and focused on real estate — not people. HavenQuest changes
                that.
              </p>
              <div className={styles.heroCta}>
                <a
                  className={styles.btnGold}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    window.Calendly?.initPopupWidget({ url: CALENDLY_URL })
                  }}
                >Begin the conversation →</a>
                <a
                  className={styles.watch}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setIntroOpen(true)
                  }}
                >
                  <span className={styles.pl}>▶</span> Watch intro video (1:34)
                </a>
              </div>
              <InvestorIntroModal open={introOpen} onClose={() => setIntroOpen(false)} />
            </div>
            <div className={styles.heroStat}>
              <div className={styles.k}>Every year in the U.S.</div>
              <div className={styles.n}>40M+</div>
              <div className={styles.l}>people relocate</div>
              <div className={styles.k}>Texas has gained nearly</div>
              <div className={styles.n}>1.5M</div>
              <div className={styles.l}>new Texans since 2022</div>
              <div className={styles.src}>Source: U.S. Census Bureau</div>
            </div>
          </section>

          {/* PRODUCT TOUR */}
          <section className={styles.light} id="s-tour">
            <p className={styles.eyebrow}>
              <span className={styles.emGold}>Experience HavenQuest</span>
            </p>
            <div className={styles.tour}>
              <div>
                <h2>
                  Find strong Texas community matches in <span className={styles.gold}>about three minutes.</span>
                </h2>
                <p className={styles.lead}>
                  Answer a few questions about what matters to you — schools, budget, lifestyle, commute — and get a strong
                  shortlist of Texas communities to explore. Your Market Director helps you refine from there.
                </p>
                <a className={styles.btnGold} href="/begin" style={{ marginTop: '22px' }}>Start the Discovery Intake →</a>
              </div>
              <div className={styles.demo}>
                <div className={styles.quiz}>
                  <div className={styles.step}>
                    <span>Step 1 of 5</span>
                    <span className={styles.pips}>
                      <i className={styles.on} />
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                  <h4>What matters most in a community?</h4>
                  <div className={styles.hint}>Choose up to 3 priorities</div>
                  <div className={styles.pri}>
                    <div className={styles.sel}><span className={styles.ic}>🎓</span>Great Schools</div>
                    <div className={styles.sel}><span className={styles.ic}>👨‍👩‍👧</span>Family Friendly</div>
                    <div><span className={styles.ic}>💼</span>Career</div>
                    <div><span className={styles.ic}>🌳</span>Outdoors</div>
                    <div><span className={styles.ic}>🍽️</span>Dining</div>
                    <div><span className={styles.ic}>🛡️</span>Low Crime</div>
                  </div>
                </div>
                <div className={styles.matches}>
                  <div className={styles.hd}>
                    <b>Your Top Matches</b>
                    <span>▸ Based on your priorities</span>
                  </div>
                  <div className={styles.mrow}>
                    <div className={styles.th}>
                      <Image src="/images/cities/georgetown-tx.jpg" alt="Georgetown, Texas" fill className="object-cover" />
                    </div>
                    <div className={styles.nm}><b>Georgetown</b><span>Williamson County</span></div>
                    <div className={styles.sc}>92</div>
                  </div>
                  <div className={styles.mrow}>
                    <div className={styles.th}>
                      <Image src="/images/cities/round-rock-tx.jpg" alt="Round Rock, Texas" fill className="object-cover" />
                    </div>
                    <div className={styles.nm}><b>Round Rock</b><span>Williamson County</span></div>
                    <div className={styles.sc}>89</div>
                  </div>
                  <div className={styles.mrow}>
                    <div className={styles.th}>
                      <Image src="/images/cities/dripping-springs-tx.jpg" alt="Dripping Springs, Texas" fill className="object-cover" />
                    </div>
                    <div className={styles.nm}><b>Dripping Springs</b><span>Hays County</span></div>
                    <div className={styles.sc}>87</div>
                  </div>
                  <div className={styles.mrow}>
                    <div className={styles.th}>
                      <Image src="/images/cities/westlake-tx.jpg" alt="Westlake, Texas" fill className="object-cover" />
                    </div>
                    <div className={styles.nm}><b>Westlake</b><span>Travis County</span></div>
                    <div className={styles.sc}>86</div>
                  </div>
                  <div className={styles.mrow} style={{ borderBottom: 0 }}>
                    <div className={styles.th}>
                      <Image src="/images/cities/lakeway-tx.jpg" alt="Lakeway, Texas" fill className="object-cover" />
                    </div>
                    <div className={styles.nm}><b>Lakeway</b><span>Travis County</span></div>
                    <div className={styles.sc}>84</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 01 PROBLEM */}
          <section className={styles.dark2} id="s1">
            <p className={styles.eyebrow}>
              <span className={`${styles.num} ${styles.emGold}`}>01</span> <span className={styles.emGold}>The Problem</span>
            </p>
            <p className={styles.p1Spoken}>“We’re moving to Texas.”</p>
            <h2>Nobody owns that moment.</h2>
            <div className={styles.p1Seq}>
              <div className={styles.p1SeqLabel}>And then</div>
              <p className={styles.p1SeqLine}>The decision is real. The job starts in six weeks.</p>
              <p className={styles.p1SeqLine}>The house has to go on the market.</p>
              <p className={styles.p1SeqLine}>The kids ask which school they’ll go to.</p>
              <p className={styles.p1SeqLine}>Somebody has to decide where in Texas to live — a state bigger than most countries, and none of it familiar.</p>
              <p className={styles.p1SeqLast}>And there is no one there.</p>
            </div>
            <div className={styles.secHead}>
              <span className={styles.secHeadLabel}>Everyone else arrives later</span>
              <span className={styles.secHeadRule} aria-hidden="true"></span>
            </div>
            <div className={`${styles.grid} ${styles.g4}`}>
              <div className={styles.card}><h3>Listings</h3><p>Show houses. Not whether the place fits your life.</p></div>
              <div className={styles.card}><h3>Realtors</h3><p>Close a transaction. Rarely guide the whole move.</p></div>
              <div className={styles.card}><h3>Best-cities lists</h3><p>Generic rankings — not your family, your budget, your priorities.</p></div>
              <div className={styles.card}><h3>Lenders, movers, insurers</h3><p>Each owns a piece of what comes after. None own the beginning.</p></div>
            </div>
            <div className={styles.p1Own}>
              <div className={styles.p1OwnBig}>HavenQuest owns that moment.</div>
              <div className={styles.p1OwnSub}>From those words to the front porch — one relationship, the whole way.</div>
            </div>
          </section>

          {/* 03 WHY TEXAS */}
          <section className={styles.dark2} id="s9">
            <p className={styles.eyebrow}>
              <span className={`${styles.num} ${styles.emGold}`}>02</span> <span className={styles.emGold}>Why Texas</span>
            </p>
            <h2>Half a million people arrive every year. <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>They’re following the jobs.</em></h2>
            <p className={`${styles.lead} ${styles.leadWide}`}>Texas draws more new residents from other states than anywhere else in the country — and the biggest names in tech and industry are the reason.</p>
            <div className={styles.s3Panel}>
              <div>
                <div className={styles.s3Fig}>556,156<span className={styles.s3Moe}>±23,072</span></div>
                <div className={styles.s3Lab}>people moved to Texas from another state last year</div>
                <div className={styles.s3Src}>U.S. Census Bureau · ACS 2024 1-year estimates</div>
              </div>
              <div className={styles.s3Rows}>
                <div className={styles.s3RowsHead}>What that arrival rate looks like</div>
                <div className={styles.s3Row}>
                  <div className={styles.s3RowFig}>~46,000</div>
                  <div className={styles.s3RowTxt}>every month</div>
                </div>
                <div className={styles.s3Row}>
                  <div className={styles.s3RowFig}>~1,500</div>
                  <div className={styles.s3RowTxt}>every day</div>
                </div>
              </div>
            </div>
            <p className={styles.s3Frame}>Net migration is the number that makes headlines, and it moves with the economy. <b>Gross arrivals are the market.</b> Every one of those 556,156 people has to figure out where in Texas to live — whether or not someone else left.</p>
            <div className={styles.secHead}>
              <span className={styles.secHeadLabel}>Legendary companies call Texas home</span>
              <span className={styles.secHeadRule} aria-hidden="true"></span>
            </div>
            <div className={`${styles.grid} ${styles.g4}`}>
              <div className={styles.card}><h3>Tesla</h3><p>HQ + Gigafactory · Austin · ~3,400 employees</p></div>
              <div className={styles.card}><h3>Samsung</h3><p>$40B fab · Taylor · ~2,000 direct + 20,000+ regional jobs</p></div>
              <div className={styles.card}><h3>Apple</h3><p>$1B campus · Austin · 5,000+ jobs, growing toward 15,000</p></div>
              <div className={styles.card}><h3>Chevron</h3><p>HQ · Houston · ~7,000 Houston-area employees</p></div>
              <div className={styles.card}><h3>SpaceX</h3><p>Starbase · South Texas</p></div>
              <div className={styles.card}><h3>Toyota</h3><p>North American HQ · Plano</p></div>
              <div className={styles.card}><h3>Caterpillar</h3><p>HQ · Irving</p></div>
              <div className={styles.card}><h3>HPE</h3><p>HQ · Houston (Spring)</p></div>
            </div>
            <p style={{ marginTop: '18px', fontSize: '11px', color: '#6a7c9e' }}>Company names are trademarks of their respective owners.</p>
          </section>

          {/* 04 MARKET */}
          <section className={styles.dark2} id="s6">
            <div className={styles.eyebrow}><span className={styles.num}>03</span> <span className={styles.emGold}>Market Opportunity</span></div>
            <h2>A once-in-a-generation opportunity <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>in Texas.</em></h2>

            <div className={styles.mkt}>
              <div className={styles.moChain}>
                <div className={styles.moStep}>
                  <div className={styles.moBig}>556,000<span className={styles.moU}>+</span></div>
                  <div className={styles.moLab}>people relocate to Texas from out of state every year</div>
                  <div className={styles.moSrc}>Texas REALTORS® · U.S. Census ACS</div>
                </div>
                <div className={styles.moArrow}>↓</div>
                <div className={styles.moStep}>
                  <div className={styles.moBig}>~75,000</div>
                  <div className={styles.moLab}>buy a home within their first year</div>
                  <div className={styles.moSrc}>StorageCafe migration study</div>
                </div>
                <div className={styles.moArrow}>↓</div>
                <div className={styles.moStep}>
                  <div className={styles.moBig}><span className={styles.moU}>~$25</span> billion</div>
                  <div className={styles.moLab}>in annual relocation home purchases</div>
                  <div className={styles.moSrc}>$335K median · Texas REALTORS® 2025</div>
                </div>
              </div>

              <div className={styles.txmap}>
                <TexasMap selected={metro} onSelect={setMetro} />
                <div className={styles.cap}>
                  <b>Our four launch markets</b>
                  <span>the majority of Texas relocation demand</span>
                </div>
              </div>
            </div>

            <div className={styles.moPivot}>
              <div className={styles.moPivotQ}>Every one of them must first answer the same question: <em>“Where should we live?”</em></div>
              <div className={styles.moPivotP}><b>No platform exists to guide that decision</b> — it happens before an agent is ever hired. HavenQuest is built for exactly that moment, before the home search begins.</div>
            </div>

            <div className={styles.moLadder}>
              <div className={styles.moLhead}>Even a sliver is a real business <span>· ~$8,600 revenue per family served</span></div>
              <div className={styles.moRungs}>
                <div className={styles.moRung}><div className={styles.moRungPct}>0.25%</div><div className={styles.moRungFam}>188 <span>families / yr</span></div><div className={styles.moRungRev}>~$1.6M</div></div>
                <div className={styles.moRung}><div className={styles.moRungPct}>0.5%</div><div className={styles.moRungFam}>375 <span>families / yr</span></div><div className={styles.moRungRev}>~$3.2M</div></div>
                <div className={styles.moRung}><div className={styles.moRungPct}>1%</div><div className={styles.moRungFam}>750 <span>families / yr</span></div><div className={styles.moRungRev}>~$6.5M</div></div>
                <div className={`${styles.moRung} ${styles.moRungStretch}`}><div className={styles.moRungPct}>2%</div><div className={styles.moRungFam}>1,500 <span>families / yr</span></div><div className={styles.moRungRev}>~$12.9M</div><div className={styles.moRungTag}>Stretch</div></div>
              </div>
            </div>
          </section>

          {/* 05 SOLUTION */}
          <section className={styles.dark} id="s3">
            <p className={styles.eyebrow}>
              <span className={`${styles.num} ${styles.emGold}`}>04</span> <span className={styles.emGold}>Our Solution</span>
            </p>
            <h2>
              One relationship, <span className={styles.gold}>four steps.</span>
            </h2>
            <p className={styles.lead}>From first curiosity to truly home — a single continuous journey, not a series of handoffs.</p>
            <div className={`${styles.grid} ${styles.g4}`}>
              <div className={styles.card}>
                <div className={styles.imgph}><Image src="/images/home/explore.jpg" alt="Explore Texas" fill className="object-cover" /></div>
                <div className={styles.kick}>01 — Explore</div>
                <h3>Find Your Texas</h3>
                <p>Answer a few questions and watch the map narrow to the places that fit your money and your life. Nobody calls you until you ask.</p>
                <div className={styles.close}>Have fun exploring.</div>
              </div>
              <div className={styles.card}>
                <div className={styles.imgph}><Image src="/images/home/connect.jpg" alt="Connect with your Market Director" fill className="object-cover" /></div>
                <div className={styles.kick}>02 — Connect</div>
                <h3>Meet your Market Director</h3>
                <p>A dedicated guide becomes your partner for the whole journey — learning your family, your priorities, and your worries.</p>
                <div className={styles.close}>Now you have a partner.</div>
              </div>
              <div className={styles.card}>
                <div className={styles.imgph}><Image src="/images/home/navigate.jpg" alt="Navigate the move" fill className="object-cover" /></div>
                <div className={styles.kick}>03 — Navigate</div>
                <h3>The whole move, handled</h3>
                <p>Your guide steers the real work — home purchase, financing, vendors, schools, and the move itself — so nothing falls through.</p>
                <div className={styles.close}>We help carry the load.</div>
              </div>
              <div className={styles.card}>
                <div className={styles.imgph}><Image src="/images/home/breathe.jpg" alt="Belong — settled in Texas" fill className="object-cover" /></div>
                <div className={styles.kick}>04 — Belong</div>
                <h3>Home, Texan.</h3>
                <p>Settled, rooted, and part of the place — not just a closed transaction, but a life that fits.</p>
                <div className={styles.close}>You&apos;re home.</div>
              </div>
            </div>
            <div className={styles.atlasBand} style={{ background: 'transparent', borderColor: 'rgba(197,183,131,.3)' }}>
              <b className={styles.gold}>Why we stand alone:</b>
              <span style={{ color: '#c4d0e6', fontSize: '13.5px' }}>
                a hand-selected team &amp; partner network · a proven, repeatable process · the whole move in one view. The
                ecosystem, not the algorithm.
              </span>
            </div>
          </section>

          {/* 06 TECHNOLOGY */}
          <section className={styles.dark2} id="s4">
            <p className={styles.eyebrow}>
              <span className={`${styles.num} ${styles.emGold}`}>05</span> <span className={styles.emGold}>The Technology</span>
            </p>
            <h2>How it all connects.</h2>
            <p className={styles.lead}>
              Compass is the core platform every role works from — and Atlas is the living knowledge layer that makes it
              smarter with every relocation.
            </p>
            <div className={styles.tech}>
              {/* Role boxes */}
              <div className={styles.r4}>
                <div className={styles.node}><b>Navigator</b><span>Client</span></div>
                <div className={styles.node}><b>Meridian</b><span>Market Director</span></div>
                <div className={styles.node}><b>SARAH</b><span>Select Agent</span></div>
                <div className={styles.node}><b>Compass Admin</b><span>HavenQuest team</span></div>
              </div>
              {/* Each role box → its own thin two-way arrow into COMPASS */}
              <div className={styles.arrowRow4}>
                <span className={styles.vArrowThin} />
                <span className={styles.vArrowThin} />
                <span className={styles.vArrowThin} />
                <span className={styles.vArrowThin} />
              </div>
              <div className={styles.hub}>
                COMPASS <small>HavenQuest Relocation Intelligence Center</small>
              </div>
              {/* COMPASS → cloud tools: two thin arrows above each tool per side,
                  with the thick hero arrow running down the clear center lane to Atlas */}
              <div className={styles.midBand}>
                <div className={styles.midSide}>
                  <div className={styles.midArrows}>
                    <span className={styles.vArrowThin} />
                    <span className={styles.vArrowThin} />
                  </div>
                  <div className={styles.midTools}>
                    <div className={styles.node}><b>Supabase</b><span>data &amp; storage</span></div>
                    <div className={styles.node}><b>Vercel</b><span>hosting</span></div>
                  </div>
                </div>
                <div className={styles.midCenter}>
                  <span className={styles.vArrowThick} />
                </div>
                <div className={styles.midSide}>
                  <div className={styles.midArrows}>
                    <span className={styles.vArrowThin} />
                    <span className={styles.vArrowThin} />
                  </div>
                  <div className={styles.midTools}>
                    <div className={styles.node}><b>GitHub</b><span>code</span></div>
                    <div className={styles.node}><b>Resend</b><span>client email</span></div>
                  </div>
                </div>
              </div>
              <div className={styles.atlasNode}>
                <b>Atlas</b> <span style={{ fontSize: '12px' }}>— the data + intelligence layer, extensible beyond relocation</span>
                <div className={styles.cols}>
                  <div className={styles.repoCol}>
                    <b>Repository</b> — all data, housed &amp; ever-growing
                    <span className={styles.notionTag}>Notion · today</span>
                  </div>
                  <span className={styles.hArrowIntel} aria-hidden="true" />
                  <div><b>Intelligence</b> — turns data into insight</div>
                </div>
              </div>
              {/* Public + market data feeds UP into Atlas */}
              <div className={styles.upArrowRow}>
                <span className={styles.vArrowUp} />
              </div>
              <div className={styles.datafeed}>Public + market data · Zillow · Redfin · Census · +more</div>
            </div>
            <p className={styles.honest}>
              Navigator is live today on real infrastructure. Compass, the role portals, and Atlas are in active build —
              shown here as the architecture, not a finished system.
            </p>
          </section>

          {/* 07 TRACTION */}
          <section className={styles.light} id="s-trac">
            <p className={styles.eyebrow}>
              <span className={`${styles.num} ${styles.emBlue}`}>06</span> <span className={styles.emBlue}>Traction</span>
            </p>
            <h2>What&apos;s live today.</h2>
            <p className={styles.lead}>
              Navigator runs live in beta at havenquest.co, carrying clients all the way to the Market Director handoff.
              The operational layer beyond that — and Atlas — are in active build.
            </p>
            <div className={`${styles.grid} ${styles.g3}`}>
              <div className={styles.card}>
                <div className={styles.kick} style={{ color: '#1f9d55' }}>● Live today (beta)</div>
                <h3>Navigator</h3>
                <p>The full self-guided journey — intake, matching, refinement, and scheduling a consultation — on real cloud infrastructure.</p>
              </div>
              <div className={styles.card}>
                <div className={styles.kick} style={{ color: 'var(--blue)' }}>◑ In active build</div>
                <h3>The operational layer</h3>
                <p>Compass and the role portals — everything that takes over after the consultation is scheduled.</p>
              </div>
              <div className={styles.card}>
                <div className={styles.kick} style={{ color: 'var(--gold-label)' }}>○ Started, earliest stage</div>
                <h3>Atlas</h3>
                <p>Data collection and the knowledge base have begun — the foundation is being laid.</p>
              </div>
            </div>
            <p style={{ marginTop: '20px', fontSize: '12.5px', color: 'var(--ink-soft)' }}>
              Live across 4 Texas metros, with 115 communities mapped.
            </p>
          </section>

          {/* 08 BUSINESS MODEL */}
          <section className={styles.light} id="s5">
            <p className={styles.eyebrow}>
              <span className={`${styles.num} ${styles.emBlue}`}>07</span> <span className={styles.emBlue}>Business Model</span>
            </p>
            <h2>
              Multiple revenue streams. <span className={styles.gold}>One powerful ecosystem.</span>
            </h2>
            <p className={styles.lead}>Simple. One-time-plus-share. Not a subscription. Not listing fees.</p>
            <div className={`${styles.grid} ${styles.g4}`}>
              <div className={styles.card}>
                <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM3 21v-2a6 6 0 0112 0v2" /></svg>
                <h3>Client Revenue</h3>
                <p>The $5,700 HavenQuest Engagement fee, paid at commitment.</p>
              </div>
              <div className={styles.card}>
                <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M8 12l3 3 5-6M4 6h16v12H4z" /></svg>
                <h3>Referral Revenue</h3>
                <p>A 35% referral on the home closing — Select Agents keep 65%.</p>
              </div>
              <div className={styles.card}>
                <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" /><path d="M3 11v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" /><path d="M5 18v2" /><path d="M19 18v2" /></svg>
                <h3>Market Seats</h3>
                <p>Licensed seats for Select Agents in exclusive market segments.</p>
              </div>
              <div className={styles.card}>
                <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
                <h3>Future Revenue</h3>
                <p>Data insights, partner network, and corporate solutions.</p>
              </div>
            </div>
            <div className={styles.math}>
              <div className={styles.cap}>What one client looks like · illustrative $335K closing at a 2.5% buy-side commission</div>
              <div className={styles.row2}>
                <span><b>$5,700</b> Engagement fee</span>
                <span className={styles.plus}>+</span>
                <span><b>~$2,930</b> 35% of the $8,375 commission</span>
                <span className={styles.plus}>=</span>
                <span><b style={{ color: 'var(--gold-label)' }}>~$8,630</b> per completed relocation</span>
                <span className={styles.bmMathDiv} aria-hidden="true"></span>
                <span className={styles.plus} style={{ opacity: 0.5 }}>+</span>
                <span className={styles.bmPartner}>
                  <b>Partner Revenue</b>
                  <span className={styles.bmPartnerCap}>movers, storage, utilities — not counted</span>
                </span>
              </div>
            </div>
          </section>

          {/* 09 VISION / ATLAS */}
          <section className={`${styles.dark} ${styles.v7section}`} id="s7">
            <div className={styles.eyebrow}><span className={styles.num}>08</span> <span className={styles.emGold}>Our Vision — Atlas</span> <span className={styles.v7tag}>Five-year vision</span></div>
            <h2>Relocation is the wedge. <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Atlas is the platform.</em></h2>

            <div className={styles.v7engine}>
              <span className={styles.v7mark}>ATLAS</span>
              <span className={styles.v7desc}>the Texas Intelligence platform — every branch below draws on it</span>
              <span className={styles.v7rule} aria-hidden="true"></span>
            </div>

            <div className={styles.v7layer}>
              <div className={styles.v7lname}><div className={styles.v7ln}>Service</div><div className={styles.v7ld}>Cash today</div></div>
              <div className={`${styles.v7chips} ${styles.v7c2}`}>
                <div className={`${styles.v7chip} ${styles.v7today}`}><h4>Consumer Relocation</h4><p>Guide families through the “where should we live?” decision.</p><div className={styles.v7todayTag}>Today&apos;s business</div></div>
                <div className={styles.v7chip}><h4>Geographic Expansion</h4><p>One repeatable playbook: TX → FL → TN → Carolinas → national.</p></div>
              </div>
            </div>
            <div className={styles.v7layer}>
              <div className={styles.v7lname}><div className={styles.v7ln}>Network</div><div className={styles.v7ld}>Network effects</div></div>
              <div className={`${styles.v7chips} ${styles.v7c3}`}>
                <div className={styles.v7chip}><h4>Employer Relocation</h4><p>The intelligence layer for HR and talent teams.</p></div>
                <div className={styles.v7chip}><h4>Builder Intelligence</h4><p>Who&apos;s moving, when, and what they&apos;re looking for.</p></div>
                <div className={styles.v7chip}><h4>Services Marketplace</h4><p>Movers, insurance, utilities, home services — the whole journey.</p></div>
              </div>
            </div>
            <div className={styles.v7layer}>
              <div className={styles.v7lname}><div className={styles.v7ln}>Platform</div><div className={styles.v7ld}>Long-term moat</div></div>
              <div className={`${styles.v7chips} ${styles.v7c3}`}>
                <div className={styles.v7chip}><h4>Market Intelligence</h4><p>Proprietary relocation data for developers, lenders, and cities.</p></div>
                <div className={styles.v7chip}><h4>Decision Intelligence</h4><p>Sharper “where to live” decisions from everything Atlas learns.</p></div>
                <div className={styles.v7chip}><h4>Partner Ecosystem</h4><p>The network connecting agents, builders, lenders, employers.</p></div>
              </div>
            </div>
          </section>

          {/* 10 TEAM */}
          <section className={styles.light} id="s8">
            <p className={styles.eyebrow}>
              <span className={`${styles.num} ${styles.emBlue}`}>09</span> <span className={styles.emBlue}>The Team</span>
            </p>
            <h2>The people behind it.</h2>
            <div className={styles.team}>
              <div className={styles.member}>
                <div className={styles.ph}><Image src="/images/team/craig.jpg" alt="Craig Asbach" fill className="object-cover" /></div>
                <div className={styles.b}>
                  <h3>Craig Asbach</h3>
                  <div className={styles.role}>Founder &amp; CEO</div>
                  <p>Vision, capital formation, and day-to-day operator.</p>
                  <a
                    className={styles.liLink}
                    href="https://www.linkedin.com/in/craigasbach/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Craig Asbach on LinkedIn"
                  >
                    <LinkedInMark />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
              <div className={styles.member}>
                <div className={styles.ph}><Image src="/images/team/jim.jpg" alt="Jim Pica" fill className="object-cover" /></div>
                <div className={styles.b}>
                  <h3>Jim Pica</h3>
                  <div className={styles.role}>Incoming CTO</div>
                  <p>Full technical ownership of the platform.</p>
                  <a
                    className={styles.liLink}
                    href="https://www.linkedin.com/in/picajames/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Jim Pica on LinkedIn"
                  >
                    <LinkedInMark />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
              <div className={styles.member}>
                <div className={`${styles.ph} ${styles.phOpen}`}>
                  <div className={styles.phRing}><OpenSeatMark /></div>
                </div>
                <div className={styles.b}>
                  <h3>State Director</h3>
                  <div className={`${styles.role} ${styles.roleOpen}`}>Broker · Open role</div>
                  <p>Holds the Texas broker&apos;s license, oversees compliance, and leads Market Director recruitment and training statewide.</p>
                </div>
              </div>
              <div className={styles.member}>
                <div className={`${styles.ph} ${styles.phOpen}`}>
                  <div className={styles.phRing}><OpenSeatMark /></div>
                </div>
                <div className={styles.b}>
                  <h3>Market Director</h3>
                  <div className={`${styles.role} ${styles.roleOpen}`}>Austin · Open role</div>
                  <p>The trained local guide at the heart of the model — first market, Austin.</p>
                </div>
              </div>
            </div>
            <div className={styles.advHead}>
              <div className={styles.advLbl}>Advisory Board</div>
              <h3 className={styles.advTitle}>Five seats. One filled.</h3>
              <p className={styles.advLead}>
                We are building a board of five — operators with the depth to guide HavenQuest as it scales across
                Texas, and the standing to open doors we could not open alone. Dave Willard is the first.
              </p>
            </div>
            <div className={styles.advisory}>
              <div className={styles.seat}>
                <div className={styles.adot}><Image src="/images/team/dave.jpg" alt="Dave Willard" fill className="object-cover" /></div>
                <div className={styles.seatName}>Dave Willard</div>
                <div className={styles.seatRole}>Advisor</div>
                <a
                  className={styles.liLink}
                  href="https://www.linkedin.com/in/davidwillard/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Dave Willard on LinkedIn"
                >
                  <LinkedInMark />
                  <span>LinkedIn</span>
                </a>
              </div>
              {(['Seat two', 'Seat three', 'Seat four', 'Seat five'] as const).map((label) => (
                <div className={styles.seat} key={label}>
                  <div className={`${styles.adot} ${styles.open}`} />
                  <div className={styles.seatLbl}>{label}</div>
                  <div className={styles.seatOpen}>Open</div>
                </div>
              ))}
            </div>
            <div className={styles.founder}>
              <p className={`${styles.eyebrow} ${styles.emGold}`} style={{ marginBottom: '14px' }}>Why Craig</p>
              <blockquote>
                For over twenty years, I&apos;ve guided families through big, complex, emotional home decisions — designing
                high-end home technology for people building custom homes, and two decades on the radio before that,
                learning how to put people at ease. HavenQuest is that <span className={styles.gold}>same calling, bigger</span>:
                helping people not just find a house, but truly land, belong, and become Texans. It&apos;s the same thing
                I&apos;ve done my whole career — guide people home. This time it just matters more.
              </blockquote>
              <p className={styles.sig}>
                — <b>Craig Asbach</b>, Founder &amp; CEO
              </p>
            </div>
          </section>

          {/* 11 INVESTMENT */}
          <section className={styles.dark} id="s10">
            <p className={styles.eyebrow}>
              <span className={`${styles.num} ${styles.emGold}`}>10</span> <span className={styles.emGold}>Investment Opportunity</span>
            </p>
            <h2>
              Let&apos;s build the future of relocation <span className={`${styles.gold} ${styles.ital}`}>together.</span>
            </h2>
            <p className={styles.lead}>
              We&apos;re raising a <b style={{ color: '#fff', fontWeight: 600 }}>$200K SAFE round</b> to prove the model across
              Texas — the proving ground for a platform that guides the entire relocation decision.
            </p>
            <div className={styles.ns}>
              <div className={styles.c}>
                <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M4 4h16v12H5.2L4 17.5z" /></svg>
                <h4>Just curious</h4>
                <p>Send me occasional updates and progress.</p>
                {optedIn ? (
                  <span
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '7px', marginTop: 'auto', alignSelf: 'flex-start',
                      fontSize: '12px', letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600,
                      padding: '11px 18px', borderRadius: '8px',
                      background: 'rgba(72,199,142,0.14)', border: '1px solid #48c78e', color: '#48c78e',
                    }}
                  >
                    <span aria-hidden="true">✓</span> You&apos;re on the list
                  </span>
                ) : (
                  <a href="#" onClick={handleKeepUpdated}>{optingIn ? 'Adding you…' : 'Keep me updated'}</a>
                )}
              </div>
              <div className={`${styles.c} ${styles.hot}`}>
                <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M7 3v3M17 3v3M4 8h16M4 8v12h16V8" /></svg>
                <h4>I&apos;d like to learn more</h4>
                <p>Schedule a time to talk directly with Craig.</p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    window.Calendly?.initPopupWidget({ url: CALENDLY_URL })
                  }}
                >Schedule a conversation</a>
              </div>
              <div className={styles.c}>
                <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
                <h4>Have a question?</h4>
                <p>Text Craig directly.</p>
                <a href="sms:+18157900909">(815) 790-0909</a>
              </div>
            </div>
            <p style={{ marginTop: '22px', fontSize: '11.5px', color: '#5f7196', fontStyle: 'italic' }}>
              Specific terms (cap, use-of-funds detail) shared in the conversation.
            </p>
          </section>

          <footer>
            <div className={styles.footIn}>
              <div className={styles.brand}>
                <div className={styles.txt} style={{ fontSize: '15px' }}>Haven<span>Quest</span></div>
              </div>
              <div>© 2026 HavenQuest. All rights reserved. &nbsp;·&nbsp; Privacy · Terms · Contact</div>
            </div>
          </footer>
        </main>
      </div>
      <button
        type="button"
        aria-label="Back to top"
        className={`${styles.backToTop} ${showBackToTop ? styles.btVisible : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
          <path d="M12 19V6" strokeLinecap="round"/>
          <path d="M6 12l6-6 6 6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
