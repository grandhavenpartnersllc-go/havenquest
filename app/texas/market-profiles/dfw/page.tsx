import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import ProfileExpander from '@/components/texas/ProfileExpander'

export const metadata: Metadata = {
  title: 'Dallas-Fort Worth Market Profile 2026 | HavenQuest',
  description: 'The complete Dallas-Fort Worth relocation guide — market conditions, neighborhoods, school districts, and what homeownership costs in DFW in 2026.',
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

function DFWFullArticle() {
  return (
    <>
      {/* 1. Opening prose */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85, marginBottom: '20px' }}>
          Dallas-Fort Worth is the most resilient major Texas market in 2026. While Austin corrected sharply and Houston softened on affordability concerns, DFW has held its ground — and the reason is not luck. It is the breadth and depth of an economic base that no single sector can shake. Finance, technology, healthcare, logistics, aerospace, and defense all employ hundreds of thousands of people in this metro. When one sector pulls back, the others absorb the shock.
        </p>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85, marginBottom: '20px' }}>
          PwC and the Urban Land Institute named DFW the #1 real estate market to watch nationally heading into 2026 — and the data supports the designation. The metro added more net new jobs than any other in America this decade: 450,000 net new positions since 2020. AT&T&apos;s new $1.35 billion headquarters campus in downtown Dallas anchored the corporate relocation wave. Google committed $40 billion in AI infrastructure investment with a major DFW data center component. The Dallas Fed projects 1.9% job growth in 2026, well above the national average.
        </p>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85 }}>
          The housing market is rebalancing rather than correcting. Median prices are down a modest 0.3% to 0.6% year-over-year — a far cry from Austin&apos;s 16% pullback. Days on market have stretched from pandemic-era single digits to 36 days, returning the market to pre-pandemic norms rather than entering distress. For buyers who relocated to DFW for corporate positions or who have been watching from the sidelines, 2026 is a better entry point than any year since 2019.
        </p>
      </div>

      {/* 2. Pull quote */}
      <div style={{ borderLeft: `4px solid ${GOLD}`, paddingLeft: '24px', marginBottom: '40px' }}>
        <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '20px', fontStyle: 'italic', color: DARK, lineHeight: 1.6, marginBottom: '10px' }}>
          &ldquo;DFW added more net new jobs than any other metro in America this decade. That kind of growth doesn&apos;t happen to a market in structural trouble.&rdquo;
        </p>
        <p style={{ fontSize: '11px', color: '#9A8E82', letterSpacing: '0.1em', textTransform: 'uppercase' }}>— HavenQuest Texas Market Intelligence, Q2 2026</p>
      </div>

      {/* 3. Full market snapshot callout */}
      <div style={{ border: `1px solid ${GOLD}`, borderRadius: '12px', padding: '24px', background: '#FDFAF4', marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '16px' }}>Market Snapshot · Q2 2026</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard label="Median Price" value="$375K" sub="DFW MSA" />
          <StatCard label="YoY Change" value="−0.4%" sub="Rebalancing, not collapsing" color="#3B6D11" />
          <StatCard label="Market Status" value="Rebalancing" sub="Buyer-favorable" color="#3B6D11" />
          <StatCard label="Avg. Days on Market" value="36" sub="Q2 2026" />
          <StatCard label="State Income Tax" value="None" sub="Texas advantage" color="#3B6D11" />
          <StatCard label="Homestead Exemption" value="$140K" sub="Raised by 2024 ballot" color="#3B6D11" />
        </div>
      </div>

      {/* 4. Lifestyle image */}
      <div style={{ marginBottom: '40px' }}>
        <ImgPlaceholder caption="Dallas skyline — Uptown or downtown Dallas Arts District" height={200} />
      </div>

      {/* 5. Economy section */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '14px' }}>Economy & Jobs</p>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85, marginBottom: '20px' }}>
          DFW is now a genuine global corporate headquarters city. The 2020s relocation wave brought Charles Schwab, McKesson, HPE, Oracle (DFW operations), CBRE, and others. Combined with legacy anchors like AT&T, American Airlines, Toyota North America, and Lockheed Martin, the metro has a Fortune 500 presence that rivals Chicago. The finance sector — anchored by Goldman Sachs, JP Morgan, and a growing alternative investment community — has become the second-largest financial hub in the country after New York. Healthcare employs nearly 400,000 workers across hospitals, research, and health tech.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard label="Net New Jobs (decade)" value="450K+" sub="Most of any US metro" color="#3B6D11" />
          <StatCard label="AT&T HQ Campus" value="$1.35B" sub="Downtown Dallas investment" />
          <StatCard label="Google AI Investment" value="$40B" sub="DFW data center component" />
          <StatCard label="Dallas Fed Job Growth" value="1.9%" sub="Projected 2026" color="#3B6D11" />
          <StatCard label="Largest Employers" value="AT&T, AA" sub="+ Lockheed, Toyota, CBRE" />
          <StatCard label="Unemployment" value="3.6%" sub="Below US average" color="#3B6D11" />
        </div>
      </div>

      {/* 6. Image pair */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '40px' }}>
        <div>
          <ImgPlaceholder caption="Frisco or Plano suburban neighborhood" />
          <p style={{ fontSize: '11px', color: '#9A8E82', marginTop: '8px', fontStyle: 'italic' }}>DFW&apos;s suburbs offer newer construction and strong school districts</p>
        </div>
        <div>
          <ImgPlaceholder caption="Southlake Town Square or Fort Worth Sundance Square" />
          <p style={{ fontSize: '11px', color: '#9A8E82', marginTop: '8px', fontStyle: 'italic' }}>Walkable town centers are a hallmark of DFW&apos;s best suburbs</p>
        </div>
      </div>

      {/* 7. Neighborhoods */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>Submarket Breakdown</p>
        <p style={{ fontSize: '14px', color: WARM_GRAY, lineHeight: 1.75, marginBottom: '20px' }}>
          DFW is a massive metro spanning 9,000 square miles. The Collin County suburbs to the north (Frisco, Plano, McKinney, Allen) are the primary family relocation destination. The Tarrant County markets (Fort Worth, Keller, Colleyville) offer more value with similar quality of life. Prosper and Celina represent the frontier — fast-growing, newer construction, longer commutes.
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
                ['Frisco', 'Master-planned, family hub', 'Corporate families, school priority', '$450K–$800K'],
                ['Plano', 'Established, corporate campus', 'Finance/tech workers', '$400K–$750K'],
                ['McKinney', 'Historic downtown + growing suburbs', 'Families, value seekers', '$380K–$650K'],
                ['Allen', 'Tight-knit suburb, great schools', 'Families', '$380K–$620K'],
                ['Colleyville', 'Affluent, smaller feel', 'High-income families, DFW airport access', '$650K–$1.2M'],
                ['Southlake', 'Premium suburb, top-rated schools', 'Affluent families', '$800K–$2M+'],
                ['Fort Worth', 'Urban + sprawling west suburbs', 'Value buyers, urban seekers', '$280K–$550K'],
                ['Celina / Prosper', 'Fastest-growing, new construction', 'Young families, value seekers', '$380K–$600K'],
                ['Grand Prairie / Arlington', 'Central, accessible, value', 'Commuters, first-time buyers', '$270K–$430K'],
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

      {/* 8. Schools */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>School Districts</p>
        <p style={{ fontSize: '14px', color: WARM_GRAY, lineHeight: 1.75, marginBottom: '20px' }}>
          DFW has some of the best suburban school districts in Texas. Carroll ISD in Southlake consistently ranks among the top 10 in the state. Frisco and Plano are regarded nationally as models for suburban public education. These ISDs are a primary factor driving relocation demand.
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
                ['Carroll ISD', 'Southlake, Grapevine area', 'Exceptional', '#3B6D11'],
                ['Frisco ISD', 'Frisco, portions of Plano', 'Excellent', '#3B6D11'],
                ['Plano ISD', 'Plano, Allen (partial)', 'Excellent', '#3B6D11'],
                ['Allen ISD', 'Allen', 'Very good', '#3B6D11'],
                ['McKinney ISD', 'McKinney', 'Very good', '#3B6D11'],
                ['Keller ISD', 'Keller, Fort Worth north suburbs', 'Very good', '#3B6D11'],
                ['Lewisville ISD', 'Flower Mound, Lewisville, Coppell', 'Good–Very good', '#BA7517'],
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
        <p style={{ fontSize: '13px', color: '#9A8E82', fontStyle: 'italic', marginTop: '12px' }}>
          Note: DFW sits in tornado country. The metro averages 10–15 tornado events per year. Quality home construction and storm shelters are standard in newer builds; verify before purchase.
        </p>
      </div>

      {/* 9. Second image */}
      <div style={{ marginBottom: '40px' }}>
        <ImgPlaceholder caption="DFW suburban master-planned community or Legacy West, Plano" height={180} />
      </div>

      {/* 10. True cost */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>True Cost of Homeownership</p>
        <p style={{ fontSize: '14px', color: WARM_GRAY, lineHeight: 1.75, marginBottom: '20px' }}>
          The example below models a $375,000 purchase at the metro median, with 20% down ($75,000), a 6.75% 30-year mortgage, and DFW&apos;s typical 1.8–2.1% effective property tax rate. The $140,000 homestead exemption provides meaningful annual savings for primary residents.
        </p>
        <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '20px' }}>
          {[
            { label: 'Est. Monthly Mortgage', value: '$1,955', sub: '$300K balance · 6.75% · 30yr', bold: false },
            { label: 'Est. Property Tax', value: '~$500/mo', sub: 'After $140K homestead exemption', bold: false },
            { label: 'Est. Homeowner\'s Insurance', value: '~$140/mo', sub: 'Standard coverage', bold: false },
            { label: 'Total Monthly Housing', value: '~$2,595', sub: 'Before HOA or utilities', bold: true },
          ].map(item => (
            <div key={item.label} style={{ background: '#F4F2EF', borderRadius: '10px', padding: '18px' }}>
              <p style={{ fontSize: '10px', color: '#9A8E82', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</p>
              <p style={{ fontSize: '20px', fontWeight: item.bold ? 700 : 500, color: item.bold ? GOLD : DARK, marginBottom: '4px' }}>{item.value}</p>
              <p style={{ fontSize: '10px', color: '#9A8E82' }}>{item.sub}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '13px', color: '#9A8E82', fontStyle: 'italic' }}>
          HOA fees are common in DFW suburban communities: $50–$200/mo in most master-planned developments. Utilities average $180–$260/mo.
        </p>
      </div>

      {/* 11. Honest assessment */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '16px' }}>Honest Assessment</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div style={{ background: '#EAF3DE', borderRadius: '12px', padding: '22px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#3B6D11', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>Strong fit if...</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'You relocated for a corporate position or expect to',
                'You need DFW Airport access (one of the world\'s busiest)',
                'Suburban family lifestyle is your priority',
                'Top-rated school districts are a decision driver',
                'You work in finance, tech, healthcare, or logistics',
                'You value newer construction and master-planned amenities',
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
                'You strongly prefer urban, walkable neighborhoods',
                'Outdoor / nature access is your top lifestyle priority',
                'You dislike suburban sprawl and long drives',
                'You prefer smaller-city feel over metro scale',
                'Tornado risk is a significant personal concern',
                'You need a coastal or Hill Country lifestyle',
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

export default function DFWProfile() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px 64px' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#9A8E82' }}>
          <Link href="/texas/market-profiles" style={{ color: GOLD, textDecoration: 'none', fontWeight: 500 }}>Texas Market Intelligence</Link>
          <span>/</span>
          <span>Dallas-Fort Worth</span>
        </div>

        {/* Hero image */}
        <div style={{ position: 'relative', height: '260px', borderRadius: '12px', overflow: 'hidden', marginBottom: '28px' }}>
          <Image src="/images/cities/dallas-tx.jpg" alt="Dallas-Fort Worth, Texas" fill className="object-cover" priority />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)' }} />
          <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(201,168,76,0.92)', borderRadius: '6px', padding: '4px 12px', fontSize: '11px', fontWeight: 700, color: DARK }}>Q2 2026</div>
          <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px', color: 'white' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8, marginBottom: '6px' }}>Dallas-Fort Worth Metro · Q2 2026</p>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '32px', fontWeight: 500, lineHeight: 1.2, marginBottom: '5px' }}>Dallas-Fort Worth</h1>
            <p style={{ fontSize: '14px', opacity: 0.85 }}>#1 real estate market to watch nationally — here&apos;s why</p>
          </div>
        </div>

        {/* Lede */}
        <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '16px', fontStyle: 'italic', color: DARK, lineHeight: 1.75, marginBottom: '20px' }}>
          Dallas-Fort Worth is the most resilient major Texas market in 2026 — named the #1 real estate market to watch nationally by PwC and the Urban Land Institute. It&apos;s correcting, not collapsing, and the economic diversity that drove a decade of explosive growth is still fully intact. DFW added more net new jobs than any other metro in America this decade. That doesn&apos;t happen to a market in trouble.
        </p>

        <div style={{ height: '1px', background: `linear-gradient(to right, ${GOLD}, transparent)`, marginBottom: '28px' }} />

        {/* 6-stat grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3" style={{ marginBottom: '24px' }}>
          <StatCard label="Median Home Price" value="$375K" sub="DFW MSA · Q2 2026" />
          <StatCard label="YoY Change" value="−0.4%" sub="Rebalancing steadily" color="#3B6D11" />
          <StatCard label="Market Status" value="Rebalancing" sub="Buyer-favorable" color="#3B6D11" />
          <StatCard label="Days on Market" value="36 days" sub="Normalized from pandemic lows" />
          <StatCard label="State Income Tax" value="None" sub="Texas advantage" color="#3B6D11" />
          <StatCard label="Homestead Exemption" value="$140K" sub="On assessed value" color="#3B6D11" />
        </div>

        {/* Economy + Best Fit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '24px' }}>
          <div style={{ border: `0.5px solid ${BORDER}`, borderRadius: '10px', padding: '18px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>Economy Snapshot</p>
            {[
              ['Net new jobs (decade)', '450,000+'],
              ['AT&T HQ campus', '$1.35B investment'],
              ['Google AI investment', '$40B (DFW component)'],
              ['Dallas Fed job growth', '1.9% (2026 projected)'],
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
              {['Corporate relocators', 'Suburban families', 'Finance / tech workers', 'Frequent travelers', 'School-priority families'].map((tag, i) => (
                <span key={tag} style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, background: i < 3 ? 'rgba(201,168,76,0.15)' : '#F4F2EF', color: i < 3 ? '#8A6010' : WARM_GRAY, border: i < 3 ? `0.5px solid ${GOLD}` : '0.5px solid #E0DAD0' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p style={{ fontSize: '11px', color: '#9A8E82', marginBottom: '36px' }}>
          Sources: TRERC · Redfin · Dallas Fed · PwC Emerging Trends in Real Estate 2026 · U.S. Census · Updated Q2 2026
        </p>

        <ProfileExpander
          cityName="Dallas-Fort Worth"
          teaser="From the corporate relocation story to the best suburbs by family profile, the school districts that drive decisions, tornado considerations, and the real monthly cost of homeownership in DFW."
        >
          <DFWFullArticle />
        </ProfileExpander>

      </main>
      <Footer />
    </div>
  )
}
