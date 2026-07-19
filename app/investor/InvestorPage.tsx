'use client'

/**
 * Investor landing page — faithful React port of havenquest_investor_page_mockup_v2.html (Stage 1).
 *
 * Scope (per INVESTOR_PAGE_stage1_build_brief.md): the page only. Nothing is wired — the
 * "Investor Portal" / "Request access" buttons stay href="#", there is no popup, form, email,
 * Supabase write, or token gate. Real project images replace the mockup's placeholder blocks.
 *
 * The left milestone rail is a scrollspy: an IntersectionObserver watches sections s1–s10 and
 * highlights the active milestone while the "Your Progress" bar fills to the furthest section
 * reached. In-page anchor jumps scroll smoothly (scroll-behavior applied for this page's lifetime).
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
  { id: 's2', label: 'Why Now' },
  { id: 's3', label: 'Our Solution' },
  { id: 's4', label: 'The Technology' },
  { id: 's5', label: 'Business Model' },
  { id: 's6', label: 'Market Opportunity' },
  { id: 's7', label: 'Our Vision (Atlas)' },
  { id: 's8', label: 'The Team' },
  { id: 's9', label: 'Why Texas' },
  { id: 's10', label: 'Investment Opportunity' },
] as const

const ORDER = MILESTONES.map((m) => m.id)

// The compass-star wordmark — inline SVG (no logo image file exists, per the brief).
function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 1 L19 13 L31 16 L19 19 L16 31 L13 19 L1 16 L13 13 Z" fill="none" stroke="#C5B783" strokeWidth={1.4} />
      <circle cx="16" cy="16" r="2.2" fill="#C5B783" />
    </svg>
  )
}

export default function InvestorPage() {
  const [activeId, setActiveId] = useState<string>('s1')
  const [maxReached, setMaxReached] = useState(1)
  const [metro, setMetro] = useState<MetroKey>('austin')
  const [introOpen, setIntroOpen] = useState(false)

  useEffect(() => {
    // Smooth in-page anchor scrolling, applied only while this page is mounted.
    const prevScrollBehavior = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'smooth'

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = ORDER.indexOf(e.target.id as (typeof ORDER)[number])
            if (i >= 0) {
              setActiveId(e.target.id)
              setMaxReached((m) => Math.max(m, i + 1))
            }
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )

    ORDER.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })

    return () => {
      obs.disconnect()
      document.documentElement.style.scrollBehavior = prevScrollBehavior
    }
  }, [])

  const pct = Math.round((maxReached / 10) * 100)

  return (
    <div className={styles.page}>
      {/* Calendly popup assets — CSS hoisted by React 19; JS via next/script. Used by the
          "Schedule a conversation" CTA in the Investment section (window.Calendly at click-time). */}
      <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" />
      {/* ---- TOP NAV ---- */}
      <div className={styles.topnav}>
        <div className={styles.topnavIn}>
          <div className={styles.brand}>
            {/* Wordmark only, matching the homepage header (HomeHeader.tsx) — mark dropped. */}
            <div className={styles.wordmark}>
              <span className={styles.wmHaven}>Haven</span><span className={styles.wmQuest}>Quest</span>
              <small className={styles.wmTag}>Clarity. Confidence. Peace of Mind.</small>
            </div>
          </div>
          <div className={styles.topnavLinks}>
            <a href="#s1">The Opportunity</a>
            <a href="#s3">Our Solution</a>
            <a href="#s5">Business Model</a>
            <a href="#s-trac">Traction</a>
            <a href="#s8">Team</a>
            <a href="#s10">Investment</a>
          </div>
          {/* Not wired in Stage 1 — anchors to the Investment section. */}
          <a className={styles.portalBtn} href="#s10">🔒 Investor Portal</a>
        </div>
      </div>

      <div className={styles.shell}>
        {/* ---- LEFT RAIL (scrollspy) ---- */}
        <aside className={styles.rail}>
          <div className={styles.lbl}>Milestones</div>
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
              <span>{maxReached}</span> of 10 milestones explored
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
                <a className={styles.btnGold} href="#s10">Begin the conversation →</a>
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
              <div className={styles.k}>Texas gained</div>
              <div className={styles.n}>473K+</div>
              <div className={styles.l}>new residents in 2023</div>
              <div className={styles.src}>Source: U.S. Census Bureau</div>
            </div>
          </section>

          {/* PRODUCT TOUR */}
          <section className={styles.light} id="s-tour">
            <p className={styles.eyebrow}>
              <span className={`${styles.num} ${styles.emGold}`}>03</span> <span className={styles.emGold}>Experience HavenQuest</span>
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
            <h2>Nobody owns the decision.</h2>
            <p className={styles.lead}>
              Lenders, movers, listing portals, school-rating sites, insurance carriers — somebody, somewhere owns a piece
              of each of these. But no one connects them, and no one owns the decision itself.
            </p>
            <div className={`${styles.grid} ${styles.g4}`}>
              <div className={styles.card}><h3>Listings</h3><p>Show houses. Not whether the place fits your life.</p></div>
              <div className={styles.card}><h3>Realtors</h3><p>Close a transaction. Rarely guide the whole move.</p></div>
              <div className={styles.card}><h3>Best-cities lists</h3><p>Generic rankings — not your family, your budget, your priorities.</p></div>
              <div className={styles.card} style={{ borderColor: 'var(--gold)', background: 'rgba(197,183,131,.08)' }}>
                <h3 className={styles.gold}>Relocation coordination</h3>
                <p style={{ color: '#d8cfb3' }}>No one connecting the pieces — much less the destination.</p>
              </div>
            </div>
          </section>

          {/* 02 WHY NOW */}
          <section className={styles.light} id="s2">
            <p className={styles.eyebrow}>
              <span className={`${styles.num} ${styles.emBlue}`}>02</span> <span className={styles.emBlue}>Why Now</span>
            </p>
            <h2>Five forces converging at once.</h2>
            <div className={`${styles.grid} ${styles.g3}`}>
              <div className={styles.card}><div className={styles.idx}>01</div><h3>Record migration</h3><p>Relocation is at all-time highs, concentrated in a handful of states.</p></div>
              <div className={styles.card}><div className={styles.idx}>02</div><h3>Remote work</h3><p>Location independence is the norm, not the exception.</p></div>
              <div className={styles.card}><div className={styles.idx}>03</div><h3>Information overload</h3><p>More relocation information than ever — and less confidence than ever.</p></div>
              <div className={styles.card}><div className={styles.idx}>04</div><h3>Housing complexity</h3><p>The decision keeps getting harder for the average buyer.</p></div>
              <div className={styles.card}><div className={styles.idx}>05</div><h3>Booming job market</h3><p>Major employers keep expanding into Texas, drawing new residents with them.</p></div>
              <div className={styles.card} style={{ background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className={`${styles.gold} ${styles.ital}`} style={{ fontSize: '16px', textAlign: 'center', color: 'var(--gold)' }}>All at once — and in our favor.</p>
              </div>
            </div>
          </section>

          {/* 03 SOLUTION */}
          <section className={styles.dark} id="s3">
            <p className={styles.eyebrow}>
              <span className={`${styles.num} ${styles.emGold}`}>03</span> <span className={styles.emGold}>Our Solution</span>
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
                <div className={styles.imgph}><Image src="/images/home/breathe.jpg" alt="Breathe — settled in Texas" fill className="object-cover" /></div>
                <div className={styles.kick}>04 — Breathe</div>
                <h3>Home, Texan.</h3>
                <p>Settled, rooted, and finally able to exhale — not just a closed transaction, but a life that fits.</p>
                <div className={styles.close}>You&apos;re finally home.</div>
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

          {/* 04 TECHNOLOGY */}
          <section className={styles.dark2} id="s4">
            <p className={styles.eyebrow}>
              <span className={`${styles.num} ${styles.emGold}`}>04</span> <span className={styles.emGold}>The Technology</span>
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

          {/* 05 BUSINESS MODEL */}
          <section className={styles.light} id="s5">
            <p className={styles.eyebrow}>
              <span className={`${styles.num} ${styles.emBlue}`}>05</span> <span className={styles.emBlue}>Business Model</span>
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
              <div className={styles.cap}>What one client looks like · illustrative $450K closing at a 2.5% buy-side commission</div>
              <div className={styles.row2}>
                <span><b>$5,700</b> Engagement fee</span>
                <span className={styles.plus}>+</span>
                <span><b>~$3,938</b> 35% of the $11,250 commission</span>
                <span className={styles.plus}>=</span>
                <span><b style={{ color: 'var(--gold-label)' }}>~$9,638</b> per completed relocation</span>
              </div>
            </div>
          </section>

          {/* 06 MARKET */}
          <section className={styles.dark2} id="s6">
            <p className={styles.eyebrow}>
              <span className={`${styles.num} ${styles.emGold}`}>06</span> <span className={styles.emGold}>Market Opportunity</span>
            </p>
            <h2>
              A once-in-a-generation opportunity <span className={`${styles.gold} ${styles.ital}`}>in Texas.</span>
            </h2>
            <div className={styles.mkt}>
              <div>
                <div className={styles.statrow} style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className={styles.stat}>
                    <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM3 21v-2a6 6 0 0112 0v2" /></svg>
                    <div className={styles.n}>473K+</div>
                    <div className={styles.l}>new Texas residents in 2023</div>
                    <div className={styles.s}>U.S. Census</div>
                  </div>
                  <div className={styles.stat}>
                    <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M4 21V5h9v16M13 9h7v12M7 9h2M7 13h2M16 13h1" /></svg>
                    <div className={styles.n}>250+</div>
                    <div className={styles.l}>companies relocated since 2020</div>
                    <div className={styles.s}>CBRE</div>
                  </div>
                  <div className={styles.stat}>
                    <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
                    <div className={styles.n}>$580B+</div>
                    <div className={styles.l}>in-migration economic impact by 2030</div>
                    <div className={styles.s}>Texas Real Estate Research Center</div>
                  </div>
                  <div className={styles.stat}>
                    <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M3 11l9-8 9 8M5 9v11h14V9" /></svg>
                    <div className={styles.n}>1.7M</div>
                    <div className={styles.l}>new housing units needed by 2030</div>
                    <div className={styles.s}>Texas A&amp;M Real Estate Research Center</div>
                  </div>
                </div>
              </div>
              <div className={styles.txmap}>
                <TexasMap selected={metro} onSelect={setMetro} />
                <div className={styles.cap}>
                  <b>Texas is leading the nation</b>
                  <span>in population growth, jobs, and business relocations — and we&apos;re just getting started.</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '26px', fontSize: '13px', color: '#93a3c2' }}>
              Demand isn&apos;t theoretical: <span className={styles.gold}>~152,000</span> new-resident home purchases in year
              one, and Texas issued <span className={styles.gold}>781,020</span> new single-family permits (2020–24) — 16.5%
              of the entire U.S. <span style={{ color: '#6a7c9e' }}>(StorageCafe / Texas A&amp;M RERC)</span>
            </div>
          </section>

          {/* 07 VISION / ATLAS */}
          <section className={styles.dark} id="s7">
            <p className={styles.eyebrow}>
              <span className={`${styles.num} ${styles.emGold}`}>07</span> <span className={styles.emGold}>Our Vision — Atlas</span>
            </p>
            <h2>Beyond Texas.</h2>
            <p className={styles.lead} style={{ maxWidth: '70ch' }}>
              Today, HavenQuest guides where to live in Texas. The vision is{' '}
              <span className={styles.gold}>the first platform built to guide the entire relocation decision</span> — with
              Atlas, an intelligence layer that compounds: every relocation makes the next one smarter. The same playbook
              extends outward, funded by Texas revenue, not a fresh raise.
            </p>
            <div className={styles.tl}>
              <div className={`${styles.step} ${styles.first}`}><b>Texas</b><span>The proving ground</span></div>
              <div className={styles.step}><b>High-growth states</b><span>FL · TN · The Carolinas</span></div>
              <div className={styles.step}><b>National relocation</b><span>Coast to coast</span></div>
              <div className={styles.step}><b>Relocation intelligence</b><span>The platform layer</span></div>
            </div>
          </section>

          {/* TRACTION */}
          <section className={styles.light} id="s-trac">
            <p className={styles.eyebrow}>
              <span className={styles.emBlue}>Traction</span>
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
              Live across 4 Texas metros, with 100+ communities mapped and hundreds more staged.
            </p>
          </section>

          {/* 08 TEAM */}
          <section className={styles.light} id="s8">
            <p className={styles.eyebrow}>
              <span className={`${styles.num} ${styles.emBlue}`}>08</span> <span className={styles.emBlue}>The Team</span>
            </p>
            <h2>The people behind it.</h2>
            <div className={styles.team}>
              <div className={styles.member}>
                <div className={styles.ph}><Image src="/images/team/craig.jpg" alt="Craig Asbach" fill className="object-cover" /></div>
                <div className={styles.b}>
                  <h3>Craig Asbach</h3>
                  <div className={styles.role}>Founder &amp; CEO</div>
                  <p>Vision, capital formation, and day-to-day operator.</p>
                </div>
              </div>
              <div className={styles.member}>
                <div className={styles.ph}><Image src="/images/team/jim.jpg" alt="Jim Pica" fill className="object-cover" /></div>
                <div className={styles.b}>
                  <h3>Jim Pica</h3>
                  <div className={styles.role}>Incoming CTO</div>
                  <p>Full technical ownership of the platform. Cash + Services SAFE.</p>
                </div>
              </div>
              <div className={styles.member}>
                <div className={styles.ph}>recruiting</div>
                <div className={styles.b}>
                  <h3>State Director · Broker</h3>
                  <div className={styles.role}>Actively recruiting</div>
                  <p>Holds the Texas broker&apos;s license, oversees compliance, and leads Market Director recruitment and training statewide.</p>
                </div>
              </div>
              <div className={styles.member}>
                <div className={styles.ph}>recruiting</div>
                <div className={styles.b}>
                  <h3>Market Director — Austin</h3>
                  <div className={styles.role}>Actively recruiting</div>
                  <p>The trained local guide at the heart of the model — first market, Austin.</p>
                </div>
              </div>
            </div>
            <div className={styles.advisory}>
              <div className={styles.lbl}>Advisory Board</div>
              <div className={styles.who}>
                <div style={{ textAlign: 'center' }}>
                  <div className={styles.adot}><Image src="/images/team/dave.jpg" alt="Dave Willard" fill className="object-cover" /></div>
                  <div style={{ fontSize: '10.5px', color: '#c9d4e8', marginTop: '6px' }}>Dave Willard</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className={`${styles.adot} ${styles.open}`} />
                  <div style={{ fontSize: '10.5px', color: '#7f90b0', marginTop: '6px' }}>Forming</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className={`${styles.adot} ${styles.open}`} />
                  <div style={{ fontSize: '10.5px', color: '#7f90b0', marginTop: '6px' }}>Forming</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className={`${styles.adot} ${styles.open}`} />
                  <div style={{ fontSize: '10.5px', color: '#7f90b0', marginTop: '6px' }}>Forming</div>
                </div>
              </div>
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

          {/* 09 WHY TEXAS */}
          <section className={styles.dark2} id="s9">
            <p className={styles.eyebrow}>
              <span className={`${styles.num} ${styles.emGold}`}>09</span> <span className={styles.emGold}>Why Texas</span>
            </p>
            <h2>Legendary companies call Texas home.</h2>
            <p className={styles.lead}>The biggest names in tech and industry are growing in Texas — and bringing their people with them.</p>
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

          {/* 10 INVESTMENT */}
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
                <a href="#">Keep me updated</a>
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
                <Mark className={styles.mark} />
                <div className={styles.txt} style={{ fontSize: '15px' }}>Haven<span>Quest</span></div>
              </div>
              <div>© 2026 HavenQuest. All rights reserved. &nbsp;·&nbsp; Privacy · Terms · Contact</div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
