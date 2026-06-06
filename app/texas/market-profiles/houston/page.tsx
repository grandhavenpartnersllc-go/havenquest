import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import ProfileExpander from '@/components/texas/ProfileExpander'

export const metadata: Metadata = {
  title: 'Houston Texas Market Profile 2026 | HavenQuest',
  description: 'The complete Houston relocation guide — market conditions, neighborhoods, flood risk, schools, and what homeownership really costs in Houston in 2026.',
}

const GOLD = '#C9A84C'
const DARK = '#1A1A1A'
const WARM_GRAY = '#6B6560'
const BORDER = '#D4C5A9'
const CREAM = '#FAF8F4'

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div style={{ background: '#F4F2EF', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
      <p style={{ fontSize: '10px', color: '#9A8E82', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
      <p style={{ fontSize: '19px', fontWeight: 500, color: color ?? DARK, marginBottom: '4px', lineHeight: 1.2 }}>{value}</p>
      <p style={{ fontSize: '10px', color: '#9A8E82' }}>{sub}</p>
    </div>
  )
}

function ImgPlaceholder({ caption, height = 160 }: { caption: string; height?: number }) {
  return (
    <div style={{ width: '100%', height, background: '#DDD8CF', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A8280" strokeWidth="1.5">
        <rect x="3" y="8" width="18" height="13" rx="2" />
        <circle cx="12" cy="14.5" r="3" />
        <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" />
      </svg>
      <p style={{ fontSize: '11px', color: '#8A8280', fontStyle: 'italic', textAlign: 'center', padding: '0 16px' }}>{caption}</p>
    </div>
  )
}

function HoustonFullArticle() {
  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85, marginBottom: '20px' }}>
          Houston is the most economically diverse city in Texas — and arguably in the United States. The energy sector that built the city is now one of many pillars rather than the only one. The Texas Medical Center employs 106,000 people and is the largest medical complex on earth. The Port of Houston is the #1 U.S. port by foreign tonnage. NASA&apos;s Johnson Space Center anchors a growing aerospace ecosystem. The combined result is a job market that doesn&apos;t rise and fall with oil prices the way it once did, and a cost of living that remains 7% below the national average despite the city&apos;s scale.
        </p>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85, marginBottom: '20px' }}>
          For buyers, the 2026 Houston market offers a combination that is genuinely rare among major American cities: a buyer&apos;s market, a broad inventory, a median price of $270,000, and a cost of living that makes a $270,000 home feel like far more than it would anywhere else. Prices are down 2.8% year-over-year, days on market have extended to 64 days, and sellers are active negotiators. This is a city where the entry point to homeownership is real for households earning $65,000 or more.
        </p>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85 }}>
          The caveat that every honest Houston profile must lead with: flooding. Houston sits on a flat coastal plain with inadequate natural drainage and a history of significant flood events. The 2017 Hurricane Harvey flood affected more than 154,000 homes. This is not a reason to avoid Houston — millions of people live here successfully — but it is a reason to do your homework. FEMA flood maps, elevation certificates, and flood insurance premiums should be part of every purchase decision, not an afterthought.
        </p>
      </div>

      {/* Pull quote */}
      <div style={{ borderLeft: `4px solid ${GOLD}`, paddingLeft: '24px', marginBottom: '40px' }}>
        <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '20px', fontStyle: 'italic', color: DARK, lineHeight: 1.6, marginBottom: '10px' }}>
          &ldquo;No Texas city offers first-time buyers and budget-conscious relocators more value per dollar. The question isn&apos;t whether Houston makes sense — it&apos;s which Houston neighborhood is right for you.&rdquo;
        </p>
        <p style={{ fontSize: '11px', color: '#9A8E82', letterSpacing: '0.1em', textTransform: 'uppercase' }}>— HavenQuest Texas Market Intelligence, Q2 2026</p>
      </div>

      {/* Market snapshot callout */}
      <div style={{ border: `1px solid ${GOLD}`, borderRadius: '12px', padding: '24px', background: '#FDFAF4', marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '16px' }}>Market Snapshot · Q2 2026</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard label="Median Price" value="$270K" sub="Houston MSA" />
          <StatCard label="YoY Change" value="−2.8%" sub="Cooling gradually" color="#BA7517" />
          <StatCard label="Market Status" value="Buyer's" sub="Broad inventory" color="#3B6D11" />
          <StatCard label="Avg. Days on Market" value="64" sub="Q2 2026" />
          <StatCard label="Cost of Living" value="−7%" sub="vs. national average" color="#3B6D11" />
          <StatCard label="Homestead Exemption" value="$140K" sub="Raised by 2024 ballot" color="#3B6D11" />
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <ImgPlaceholder caption="The Woodlands Town Center or Sugar Land suburban neighborhood" height={200} />
      </div>

      {/* Economy */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '14px' }}>Economy & Jobs</p>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85, marginBottom: '20px' }}>
          Houston&apos;s economy has diversified dramatically over the past two decades. Energy remains important — Chevron, ExxonMobil, Shell, BP, and ConocoPhillips all have significant operations here — but healthcare, aerospace, maritime, manufacturing, and international trade now employ comparable numbers. The Texas Medical Center alone generates more than $20 billion in economic output annually. NASA&apos;s Johnson Space Center has anchored a space and aerospace corridor that includes SpaceX operations. The port&apos;s activity supports tens of thousands of logistics and trade jobs. Houston is genuinely a post-oil city that still benefits from oil.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard label="Texas Medical Center" value="106K jobs" sub="World's largest medical complex" color="#3B6D11" />
          <StatCard label="Port of Houston" value="#1 US Port" sub="By foreign tonnage" color="#3B6D11" />
          <StatCard label="NASA JSC" value="Aerospace hub" sub="Johnson Space Center" />
          <StatCard label="COL vs. National" value="−7%" sub="Below US average" color="#3B6D11" />
          <StatCard label="Energy Anchors" value="5 majors" sub="Chevron, Exxon, Shell, BP, COP" />
          <StatCard label="Unemployment" value="4.1%" sub="Near US average" />
        </div>
      </div>

      {/* Image pair */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '40px' }}>
        <div>
          <ImgPlaceholder caption="Houston Heights or Montrose neighborhood — urban lifestyle" />
          <p style={{ fontSize: '11px', color: '#9A8E82', marginTop: '8px', fontStyle: 'italic' }}>Inner-loop Houston offers walkability and urban amenities</p>
        </div>
        <div>
          <ImgPlaceholder caption="Katy or Cypress master-planned community" />
          <p style={{ fontSize: '11px', color: '#9A8E82', marginTop: '8px', fontStyle: 'italic' }}>The suburbs deliver the best value and school access</p>
        </div>
      </div>

      {/* Neighborhoods */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>Submarket Breakdown</p>
        <p style={{ fontSize: '14px', color: WARM_GRAY, lineHeight: 1.75, marginBottom: '20px' }}>
          Houston&apos;s suburbs are organized by geography: northwest (Katy, Cypress, Fulshear), north (The Woodlands, Spring, Conroe), southwest (Sugar Land, Missouri City), and southeast (Pearland, League City). Each corridor has its own character. The inner loop offers urban lifestyle at a premium. Master-planned communities are a Houston signature — from The Woodlands to Fulshear, these are fully designed live-work-play environments.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['Community', 'Character', 'Best For', 'Price Tier'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#9A8E82', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['The Woodlands', 'Premium master-planned, wooded', 'Families, executives, Medical Center', '$380K–$900K'],
                ['Sugar Land', 'Established suburb, diverse', 'Families, energy workers', '$320K–$650K'],
                ['Katy', 'Value master-planned, fast-growing', 'Families, first-time buyers', '$280K–$520K'],
                ['Cypress', 'Suburban, newer development', 'Young families, commuters', '$270K–$480K'],
                ['Fulshear', 'Fastest-growing, new construction', 'Young families, value seekers', '$340K–$600K'],
                ['The Heights / Montrose', 'Urban, walkable, historic', 'Young professionals, urban buyers', '$450K–$900K'],
                ['West University / River Oaks', 'Affluent, urban', 'High-income professionals', '$900K–$3M+'],
                ['Pearland', 'Southeast suburb, value', 'Families, Medical Center workers', '$260K–$440K'],
                ['League City / Clear Lake', 'NASA corridor, waterfront options', 'Aerospace workers, families', '$270K–$500K'],
                ['Conroe', 'North suburb, Lake Conroe access', 'Retirees, families, value seekers', '$220K–$420K'],
              ].map(([community, character, best, price], i) => (
                <tr key={community} style={{ borderBottom: '1px solid #F0EDE6', background: i % 2 === 0 ? 'transparent' : CREAM }}>
                  <td style={{ padding: '11px 12px', fontWeight: 500, color: DARK }}>{community}</td>
                  <td style={{ padding: '11px 12px', color: WARM_GRAY }}>{character}</td>
                  <td style={{ padding: '11px 12px', color: WARM_GRAY }}>{best}</td>
                  <td style={{ padding: '11px 12px', color: WARM_GRAY }}>{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schools */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>School Districts</p>
        <p style={{ fontSize: '14px', color: WARM_GRAY, lineHeight: 1.75, marginBottom: '20px' }}>
          The suburban ISDs around Houston are consistently strong and are the primary driver of family suburb selection. Houston ISD (HISD) serves the city proper and is the largest district in Texas — quality varies enormously by campus, and families should research individual schools rather than relying on the district rating alone.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['District', 'Coverage Area', 'Reputation'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#9A8E82', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Katy ISD', 'Katy, portions of Cypress, Fulshear', 'Excellent', '#3B6D11'],
                ['Fort Bend ISD', 'Sugar Land, Missouri City, Richmond', 'Excellent', '#3B6D11'],
                ['Conroe ISD', 'The Woodlands, Spring, Conroe', 'Very good', '#3B6D11'],
                ['Clear Creek ISD', 'League City, Clear Lake, Friendswood', 'Very good', '#3B6D11'],
                ['Cy-Fair ISD', 'Cypress, parts of NW Houston', 'Good–Very good', '#BA7517'],
                ['Houston ISD', 'City of Houston core', 'Variable — research by campus', '#BA7517'],
              ].map(([district, coverage, rep, color], i) => (
                <tr key={district} style={{ borderBottom: '1px solid #F0EDE6', background: i % 2 === 0 ? 'transparent' : CREAM }}>
                  <td style={{ padding: '11px 12px', fontWeight: 500, color: DARK }}>{district}</td>
                  <td style={{ padding: '11px 12px', color: WARM_GRAY }}>{coverage}</td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ background: color + '18', color, padding: '3px 9px', borderRadius: '5px', fontSize: '11px', fontWeight: 600 }}>{rep}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flood risk — critical section */}
      <div style={{ background: '#FEF3CD', border: '1px solid #F0A500', borderRadius: '12px', padding: '22px', marginBottom: '40px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>⚠ Flood Risk — Read Before You Buy</p>
        <p style={{ fontSize: '14px', color: '#78350F', lineHeight: 1.75, marginBottom: '12px' }}>
          Houston sits on a flat coastal plain with clay-heavy soil and a history of major flood events — most notably Hurricane Harvey (2017), which flooded over 154,000 homes. Many communities have since invested heavily in drainage infrastructure, but flood risk remains a real factor in purchasing decisions.
        </p>
        <p style={{ fontSize: '14px', color: '#78350F', lineHeight: 1.75 }}>
          <strong>Before you close:</strong> Check the property&apos;s FEMA flood zone designation, order an elevation certificate, get flood insurance quotes for all flood zones (not just Zone AE), and ask the seller for flood history. Homes in Zones X (low risk), C, and B are generally insurable at standard rates. Flood insurance through the NFIP averages $800–$2,400/year depending on elevation and zone. This is a non-negotiable line item in any Houston budget.
        </p>
      </div>

      {/* Second image */}
      <div style={{ marginBottom: '40px' }}>
        <ImgPlaceholder caption="Houston master-planned community clubhouse or The Woodlands waterway" height={180} />
      </div>

      {/* True cost */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>True Cost of Homeownership</p>
        <p style={{ fontSize: '14px', color: WARM_GRAY, lineHeight: 1.75, marginBottom: '20px' }}>
          The example below models a $270,000 purchase at the metro median, with 20% down ($54,000), a 6.75% 30-year mortgage, and Houston&apos;s typical 2.0% effective property tax rate. Flood insurance is included as a separate line item for Zone AE properties — verify before assuming Zone X applies to your specific address.
        </p>
        <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '20px' }}>
          {[
            { label: 'Est. Monthly Mortgage', value: '$1,405', sub: '$216K balance · 6.75% · 30yr', bold: false },
            { label: 'Est. Property Tax', value: '~$360/mo', sub: 'After $140K homestead exemption', bold: false },
            { label: 'Est. Homeowner\'s Insurance', value: '~$160/mo', sub: 'Incl. flood ins. for Zone AE', bold: false },
            { label: 'Total Monthly Housing', value: '~$1,925', sub: 'Before HOA or utilities', bold: true },
          ].map(item => (
            <div key={item.label} style={{ background: '#F4F2EF', borderRadius: '10px', padding: '18px' }}>
              <p style={{ fontSize: '10px', color: '#9A8E82', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</p>
              <p style={{ fontSize: '20px', fontWeight: item.bold ? 700 : 500, color: item.bold ? GOLD : DARK, marginBottom: '4px' }}>{item.value}</p>
              <p style={{ fontSize: '10px', color: '#9A8E82' }}>{item.sub}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '13px', color: '#9A8E82', fontStyle: 'italic' }}>
          Flood insurance cost varies significantly by property elevation and FEMA zone. Confirm zone status and get a quote before closing — it can range from $400/year (Zone X) to $2,500+/year (Zone AE, low elevation).
        </p>
      </div>

      {/* Honest assessment */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '16px' }}>Honest Assessment</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div style={{ background: '#EAF3DE', borderRadius: '12px', padding: '22px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#3B6D11', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>Strong fit if...</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'You are a first-time buyer or budget-conscious relocator',
                'You work in energy, healthcare, aerospace, or maritime',
                'Master-planned communities appeal to your lifestyle',
                'You understand and can manage flood risk properly',
                'Value per dollar is a primary decision factor',
                'Your household income is $65,000–$100,000',
              ].map(item => (
                <li key={item} style={{ fontSize: '13px', color: '#2D5A0E', paddingLeft: '18px', position: 'relative', lineHeight: 1.5 }}>
                  <span style={{ position: 'absolute', left: 0, color: '#3B6D11' }}>✓</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: '#FFFBEB', borderRadius: '12px', padding: '22px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#BA7517', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>May not be the right fit if...</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Flooding or hurricane risk is a non-starter concern',
                'You prioritize outdoor / hiking / mountains lifestyle',
                'You strongly prefer walkable urban neighborhoods',
                'Heat and humidity are a major quality-of-life factor',
                'You need a Hill Country or coastal proximity lifestyle',
                'You dislike sprawling freeway-dependent geography',
              ].map(item => (
                <li key={item} style={{ fontSize: '13px', color: '#92400E', paddingLeft: '18px', position: 'relative', lineHeight: 1.5 }}>
                  <span style={{ position: 'absolute', left: 0, color: '#BA7517' }}>—</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default function HoustonProfile() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px 64px' }}>
        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#9A8E82' }}>
          <Link href="/texas/market-profiles" style={{ color: GOLD, textDecoration: 'none', fontWeight: 500 }}>Texas Market Intelligence</Link>
          <span>/</span><span>Houston</span>
        </div>

        <div style={{ position: 'relative', height: '260px', borderRadius: '12px', overflow: 'hidden', marginBottom: '28px' }}>
          <Image src="/images/cities/houston-tx.jpg" alt="Houston, Texas" fill className="object-cover" priority />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)' }} />
          <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(201,168,76,0.92)', borderRadius: '6px', padding: '4px 12px', fontSize: '11px', fontWeight: 700, color: DARK }}>Q2 2026</div>
          <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px', color: 'white' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8, marginBottom: '6px' }}>Houston Metro · Q2 2026</p>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '32px', fontWeight: 500, lineHeight: 1.2, marginBottom: '5px' }}>Houston</h1>
            <p style={{ fontSize: '14px', opacity: 0.85 }}>The most accessible entry point into Texas homeownership</p>
          </div>
        </div>

        <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '16px', fontStyle: 'italic', color: DARK, lineHeight: 1.75, marginBottom: '20px' }}>
          Houston is the most affordable major metro in Texas — and in 2026, that affordability comes with a buyer&apos;s market on top of it. The most economically diversified city in the state, anchored by the world&apos;s largest medical complex, the #1 U.S. port by foreign tonnage, and a job market that doesn&apos;t rise and fall with oil prices the way it once did. For first-time buyers and budget-conscious relocators, no Texas city offers more.
        </p>

        <div style={{ height: '1px', background: `linear-gradient(to right, ${GOLD}, transparent)`, marginBottom: '28px' }} />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3" style={{ marginBottom: '24px' }}>
          <StatCard label="Median Home Price" value="$270K" sub="Houston MSA · Q2 2026" />
          <StatCard label="YoY Change" value="−2.8%" sub="Cooling buyer's market" color="#BA7517" />
          <StatCard label="Market Status" value="Buyer's" sub="Broad inventory available" color="#3B6D11" />
          <StatCard label="Days on Market" value="64 days" sub="Q2 2026 average" />
          <StatCard label="Cost of Living" value="−7% vs. US" sub="Below national average" color="#3B6D11" />
          <StatCard label="Homestead Exemption" value="$140K" sub="On assessed value" color="#3B6D11" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '24px' }}>
          <div style={{ border: `0.5px solid ${BORDER}`, borderRadius: '10px', padding: '18px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>Economy Snapshot</p>
            {[
              ['Texas Medical Center', 'World\'s largest (106K jobs)'],
              ['Port of Houston', '#1 US by foreign tonnage'],
              ['NASA Johnson Space Center', 'Aerospace anchor'],
              ['COL vs. national', '7% below average'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid #F0EDE6', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: WARM_GRAY }}>{k}</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: DARK, textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ border: `0.5px solid ${BORDER}`, borderRadius: '10px', padding: '18px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>Best Fit For</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['First-time buyers', 'Energy / healthcare workers', 'Budget-conscious families', 'Investors', 'Master-planned seekers'].map((tag, i) => (
                <span key={tag} style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, background: i < 3 ? 'rgba(201,168,76,0.15)' : '#F4F2EF', color: i < 3 ? '#8A6010' : WARM_GRAY, border: i < 3 ? `0.5px solid ${GOLD}` : '0.5px solid #E0DAD0' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p style={{ fontSize: '11px', color: '#9A8E82', marginBottom: '36px' }}>
          Sources: TRERC · Redfin · Zillow · U.S. Census · FEMA Flood Maps · Texas Medical Center · Port of Houston · Updated Q2 2026
        </p>

        <ProfileExpander
          cityName="Houston"
          teaser="From the economic diversification story to the flood risk section you must read before buying, the best suburbs by family profile, ISD breakdown, and what a $270K Houston home actually costs per month."
        >
          <HoustonFullArticle />
        </ProfileExpander>
      </main>
      <Footer />
    </div>
  )
}
