import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import ProfileExpander from '@/components/texas/ProfileExpander'

export const metadata: Metadata = {
  title: 'Austin Texas Market Profile 2026 | HavenQuest',
  description: 'The complete Austin relocation guide — market conditions, neighborhoods, school districts, property taxes, and what homeownership really costs in 2026.',
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


function AustinFullArticle() {
  return (
    <>
      {/* 1. Opening prose */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85, marginBottom: '20px' }}>
          Austin is a city that corrected. Between 2020 and 2022, median prices in the Austin MSA surged from $335,000 to $550,000 — a 64% increase in 24 months driven by a wave of remote workers from California and the Pacific Northwest, supercharged by historically low rates and Apple&apos;s announcement of a $1 billion campus in North Austin. The market became untethered from local income. Buyers made offers sight-unseen. Sellers chose from 15 offers in a weekend.
        </p>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85, marginBottom: '20px' }}>
          Then rates rose sharply through 2022 and 2023, and the market reset. By Q2 2026, the median home price in the Austin MSA sits at $460,000 — down 16.4% from its 2022 peak. That correction has been faster and deeper than any other major Texas metro, which is exactly why this is the moment Austin-curious buyers have been waiting for. Days on market have stretched to 76. Sellers are negotiating on more than half of all listings. The buyer who felt priced out three years ago is back in a position of genuine leverage.
        </p>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85 }}>
          The long-term fundamentals have not changed. Apple&apos;s campus is open and hiring. Tesla&apos;s Gigafactory continues to expand east of the city. Oracle relocated its global headquarters here. The University of Texas at Austin continues to funnel engineering and business talent into a tech ecosystem that now rivals any city outside San Francisco and New York. The lifestyle advantages — Hill Country access, live music culture, a restaurant scene that genuinely earns its reputation — remain fully intact. The price tag finally recalibrated.
        </p>
      </div>

      {/* 2. Pull quote */}
      <div style={{ borderLeft: `4px solid ${GOLD}`, paddingLeft: '24px', marginBottom: '40px' }}>
        <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '20px', fontStyle: 'italic', color: DARK, lineHeight: 1.6, marginBottom: '10px' }}>
          &ldquo;The Austin correction is not a sign of structural weakness — it&apos;s the market price-discovering its way back to reality after a historic anomaly. The buyers who act in 2026 are buying the city&apos;s long-term trajectory at a discount.&rdquo;
        </p>
        <p style={{ fontSize: '11px', color: '#9A8E82', letterSpacing: '0.1em', textTransform: 'uppercase' }}>— HavenQuest Texas Market Intelligence, Q2 2026</p>
      </div>

      {/* 3. Full market snapshot callout */}
      <div style={{ border: `1px solid ${GOLD}`, borderRadius: '12px', padding: '24px', background: '#FDFAF4', marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '16px' }}>Market Snapshot · Q2 2026</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard label="Median Price" value="$460K" sub="Austin MSA" />
          <StatCard label="From Peak" value="−16.4%" sub="vs. 2022 high" color="#3B6D11" />
          <StatCard label="Market Status" value="Buyer's" sub="Since Q3 2023" color="#3B6D11" />
          <StatCard label="Avg. Days on Market" value="76" sub="Q2 2026" />
          <StatCard label="State Income Tax" value="None" sub="Texas advantage" color="#3B6D11" />
          <StatCard label="Homestead Exemption" value="$140K" sub="Raised by 2024 ballot" color="#3B6D11" />
        </div>
      </div>

      {/* 4. Full-width lifestyle image */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ position: 'relative', width: '100%', height: 200, borderRadius: '10px', overflow: 'hidden' }}>
          <Image src="/images/texas-intel/austin-neighborhood.jpg" alt="Austin neighborhood street scene — South Congress or Mueller District" fill className="object-cover" />
        </div>
      </div>

      {/* 5. Economy section */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '14px' }}>Economy & Jobs</p>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85, marginBottom: '20px' }}>
          Austin added 28,500 net new jobs over the past 12 months — a growth rate that continues to outpace the national average despite the market correction. The job base has diversified significantly from its early tech-centric identity: Apple, Tesla, Oracle, Samsung Semiconductor, Meta, and Dell now anchor a corporate ecosystem alongside government employment centered on the state capitol and UT Austin. Healthcare and education are stable secondary pillars. The median household income of $109,000 reflects a workforce skewed toward high-earning professionals, which is precisely why the housing correction happened — price growth far outpaced even this income level.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard label="Jobs Added (12 mo)" value="28,500" sub="Net new positions" color="#3B6D11" />
          <StatCard label="Median HH Income" value="$109K" sub="Austin MSA" />
          <StatCard label="Property Tax Rate" value="1.8–2.2%" sub="Effective rate" />
          <StatCard label="Comfortable Income" value="$90K+" sub="To own at median" />
          <StatCard label="Largest Employers" value="Apple, Tesla" sub="+ Oracle, Dell, UT" />
          <StatCard label="Unemployment" value="3.4%" sub="Below US average" color="#3B6D11" />
        </div>
      </div>

      {/* 6. Image pair */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '40px' }}>
        <div>
          <div style={{ position: 'relative', width: '100%', height: 160, borderRadius: '10px', overflow: 'hidden' }}>
            <Image src="/images/texas-intel/austin-barton-springs.jpg" alt="Barton Springs or Barton Creek Greenbelt" fill className="object-cover" />
          </div>
          <p style={{ fontSize: '11px', color: '#9A8E82', marginTop: '8px', fontStyle: 'italic' }}>Austin&apos;s outdoor corridor — a major quality-of-life differentiator</p>
        </div>
        <div>
          <div style={{ position: 'relative', width: '100%', height: 160, borderRadius: '10px', overflow: 'hidden' }}>
            <Image src="/images/texas-intel/austin-hill-country.jpg" alt="Texas Hill Country landscape — near Bee Cave or Lakeway" fill className="object-cover" />
          </div>
          <p style={{ fontSize: '11px', color: '#9A8E82', marginTop: '8px', fontStyle: 'italic' }}>Hill Country access within 30 minutes of downtown</p>
        </div>
      </div>

      {/* 7. Neighborhood breakdown */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>Neighborhood Breakdown</p>
        <p style={{ fontSize: '14px', color: WARM_GRAY, lineHeight: 1.75, marginBottom: '20px' }}>
          Austin&apos;s suburbs are where most families land. The city proper has been increasingly expensive and dense; the surrounding communities offer better value, newer construction, and often stronger school districts. The Hill Country towns to the west have become a lifestyle destination in their own right.
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
                ['Round Rock', 'Established suburb, family-friendly', 'Families, commuters', '$320K–$550K'],
                ['Cedar Park', 'Growing suburb, newer development', 'Young families, tech workers', '$340K–$580K'],
                ['Georgetown', 'Historic downtown, Hill Country edge', 'Retirees, families', '$300K–$520K'],
                ['Westlake Hills', 'Affluent enclave, wooded hills', 'High-income professionals', '$900K–$2M+'],
                ['Bee Cave / Lakeway', 'Hill Country lifestyle, resort feel', 'Outdoor-focused families', '$600K–$1.2M'],
                ['East Austin', 'Urban, creative, walkable', 'Young professionals, remote workers', '$450K–$800K'],
                ['Kyle / Buda', 'Most affordable suburbs, fast-growing', 'First-time buyers, value seekers', '$280K–$420K'],
              ].map(([community, character, best, price], i) => (
                <tr key={community} style={{ borderBottom: `1px solid #F0EDE6`, background: i % 2 === 0 ? 'transparent' : CREAM }}>
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

      {/* 8. Schools section */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>School Districts</p>
        <p style={{ fontSize: '14px', color: WARM_GRAY, lineHeight: 1.75, marginBottom: '20px' }}>
          Austin ISD itself is large and variable — quality ranges significantly by campus. The surrounding suburban ISDs are consistently stronger and are a primary driver of family relocation decisions. Eanes ISD (Westlake Hills) is the gold standard. Leander and Round Rock are excellent and more affordable.
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
                ['Eanes ISD', 'Westlake Hills, Rollingwood', 'Exceptional', '#3B6D11'],
                ['Lake Travis ISD', 'Bee Cave, Lakeway, Spicewood', 'Excellent', '#3B6D11'],
                ['Leander ISD', 'Leander, Cedar Park, Liberty Hill', 'Very good', '#3B6D11'],
                ['Round Rock ISD', 'Round Rock, Pflugerville, Hutto', 'Very good', '#3B6D11'],
                ['Georgetown ISD', 'Georgetown', 'Good', '#BA7517'],
                ['Dripping Springs ISD', 'Dripping Springs, Bee Cave west', 'Excellent', '#3B6D11'],
                ['Austin ISD', 'City of Austin core', 'Variable by campus', '#BA7517'],
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

      {/* 9. Second lifestyle image */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ position: 'relative', width: '100%', height: 180, borderRadius: '10px', overflow: 'hidden' }}>
          <Image src="/images/texas-intel/austin-community.jpg" alt="Austin community park or Barton Springs Pool" fill className="object-cover" />
        </div>
      </div>

      {/* 10. True cost of homeownership */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>True Cost of Homeownership</p>
        <p style={{ fontSize: '14px', color: WARM_GRAY, lineHeight: 1.75, marginBottom: '20px' }}>
          The example below models a $420,000 purchase — slightly below the metro median — with a 20% down payment ($84,000), a 6.75% 30-year fixed mortgage, and Austin&apos;s typical 2.0% effective property tax rate. The $140,000 homestead exemption reduces your assessed taxable value significantly — a meaningful benefit for long-term owners.
        </p>
        <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '20px' }}>
          {[
            { label: 'Est. Monthly Mortgage', value: '$2,190', sub: '$336K balance · 6.75% · 30yr', bold: false },
            { label: 'Est. Property Tax', value: '~$560/mo', sub: 'After $140K homestead exemption', bold: false },
            { label: 'Est. Homeowner\'s Insurance', value: '~$150/mo', sub: 'Standard coverage', bold: false },
            { label: 'Total Monthly Housing', value: '~$2,900', sub: 'Before HOA or utilities', bold: true },
          ].map(item => (
            <div key={item.label} style={{ background: '#F4F2EF', borderRadius: '10px', padding: '18px' }}>
              <p style={{ fontSize: '10px', color: '#9A8E82', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</p>
              <p style={{ fontSize: '20px', fontWeight: item.bold ? 700 : 500, color: item.bold ? GOLD : DARK, marginBottom: '4px' }}>{item.value}</p>
              <p style={{ fontSize: '10px', color: '#9A8E82' }}>{item.sub}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '13px', color: '#9A8E82', fontStyle: 'italic' }}>
          To comfortably carry this payment, most financial planners recommend a gross household income of $90,000–$100,000+. HOA fees vary by community ($0–$250/mo in most Austin suburbs).
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
                'You work in tech, healthcare, or remotely at a coastal salary',
                'Schools are a primary decision driver',
                'You value outdoor lifestyle: Hill Country, parks, greenbelt',
                'You want a city with genuine cultural energy',
                'You plan to hold the home 5+ years',
                'Your household income is $90,000 or above',
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
                'Your household income is under $75,000',
                'You need a starter home under $280,000',
                'You prefer a quieter, less traffic-heavy environment',
                "You don't plan to stay at least 5 years",
                'You find large-city traffic and density frustrating',
                'You want suburban calm without urban premium pricing',
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

export default function AustinProfile() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px 64px' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#9A8E82' }}>
          <Link href="/texas/market-profiles" style={{ color: GOLD, textDecoration: 'none', fontWeight: 500 }}>Texas Market Intelligence</Link>
          <span>/</span>
          <span>Austin</span>
        </div>

        {/* Section A — Snapshot */}

        {/* Hero image */}
        <div style={{ position: 'relative', height: '260px', borderRadius: '12px', overflow: 'hidden', marginBottom: '28px' }}>
          <Image
            src="/images/texas-intel/austin-hero.jpg"
            alt="Austin, Texas"
            fill
            className="object-cover"
            priority
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)' }} />
          <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(201,168,76,0.92)', borderRadius: '6px', padding: '4px 12px', fontSize: '11px', fontWeight: 700, color: DARK }}>
            Q2 2026
          </div>
          <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px', color: 'white' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8, marginBottom: '6px' }}>
              Austin Metro · Q2 2026
            </p>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '32px', fontWeight: 500, lineHeight: 1.2, marginBottom: '5px' }}>
              Austin
            </h1>
            <p style={{ fontSize: '14px', opacity: 0.85 }}>The city that reset — and what that means for you</p>
          </div>
        </div>

        {/* Lede */}
        <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '16px', fontStyle: 'italic', color: DARK, lineHeight: 1.75, marginBottom: '20px' }}>
          Austin is the most corrected major Texas market right now — and for buyers, that&apos;s actually good news. Prices are down 16% from their 2022 peak, sellers are negotiating on more than half of all listings, and the city that felt out of reach three years ago has become genuinely accessible again. The long-term fundamentals have not changed. The price tag finally did.
        </p>

        {/* Gold rule */}
        <div style={{ height: '1px', background: `linear-gradient(to right, ${GOLD}, transparent)`, marginBottom: '28px' }} />

        {/* 6-stat grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3" style={{ marginBottom: '24px' }}>
          <StatCard label="Median Home Price" value="$460K" sub="Austin MSA · Q2 2026" />
          <StatCard label="From Peak" value="−16.4%" sub="vs. 2022 high" color="#3B6D11" />
          <StatCard label="Market Status" value="Buyer's" sub="Favorable conditions" color="#3B6D11" />
          <StatCard label="Days on Market" value="76 days" sub="Avg. to close offer" />
          <StatCard label="State Income Tax" value="None" sub="Texas advantage" color="#3B6D11" />
          <StatCard label="Homestead Exemption" value="$140K" sub="On assessed value" color="#3B6D11" />
        </div>

        {/* Economy + Best Fit 2-col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '24px' }}>
          <div style={{ border: `0.5px solid ${BORDER}`, borderRadius: '10px', padding: '18px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>Economy Snapshot</p>
            {[
              ['Jobs added (12 mo)', '28,500'],
              ['Median HH income', '$109,000'],
              ['Property tax rate', '1.8–2.2% eff.'],
              ['Income to own comfortably', '$90,000+'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid #F0EDE6' }}>
                <span style={{ fontSize: '13px', color: WARM_GRAY }}>{k}</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: DARK }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ border: `0.5px solid ${BORDER}`, borderRadius: '10px', padding: '18px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>Best Fit For</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['Tech workers', 'Remote workers', 'School-priority families', 'Culture seekers', 'Outdoor lifestyle', 'Hill Country lovers'].map((tag, i) => (
                <span key={tag} style={{
                  padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500,
                  background: i < 3 ? 'rgba(201,168,76,0.15)' : '#F4F2EF',
                  color: i < 3 ? '#8A6010' : WARM_GRAY,
                  border: i < 3 ? `0.5px solid ${GOLD}` : '0.5px solid #E0DAD0',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Meta */}
        <p style={{ fontSize: '11px', color: '#9A8E82', marginBottom: '36px' }}>
          Sources: TRERC · Redfin · Zillow · Dallas Fed · U.S. Census · Updated Q2 2026
        </p>

        {/* Section B + C — ProfileExpander */}
        <ProfileExpander
          cityName="Austin"
          teaser="From the correction story to the neighborhood breakdown, the school districts that drive family decisions, and what owning a $420K home actually costs per month — everything you need before you commit."
        >
          <AustinFullArticle />
        </ProfileExpander>

      </main>

      <Footer />
    </div>
  )
}
