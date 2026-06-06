import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import ProfileExpander from '@/components/texas/ProfileExpander'

export const metadata: Metadata = {
  title: 'San Antonio Market Profile 2026 | HavenQuest',
  description: 'The complete San Antonio relocation guide — market conditions, neighborhoods, military resources, Hill Country access, and homeownership costs in 2026.',
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


function SanAntonioFullArticle() {
  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85, marginBottom: '20px' }}>
          San Antonio is a city with three distinct growth engines — and all three are firing simultaneously. The first is population: the city added more than 30,000 net new residents last year, making it the third-largest numeric gainer in the United States. The second is value migration: an increasing share of those arrivals are coming from Austin, where a family earning $120,000 was discovering that their income went considerably further in a city where the median home price is $260,000 rather than $460,000. The third is employment diversification: the military complex at Joint Base San Antonio has been joined by a growing cybersecurity sector, major corporate headquarters, and a healthcare industry that now employs over 150,000 people.
        </p>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85, marginBottom: '20px' }}>
          The numbers tell a straightforward story. San Antonio&apos;s median home price of $260,000 is roughly half of Austin&apos;s. The cost of living sits 9% below the national average. The homestead exemption is the same $140,000 available statewide. And the market is buyer-favorable, with 98 days on market and sellers actively negotiating. For a household earning $70,000 — the most common relocation income bracket from Austin — the difference between renting in Austin and owning in San Antonio can be less than $200 a month.
        </p>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85 }}>
          What surprises most people who move to San Antonio is how much they stay. The city has an unusually high retention rate for a relocation destination — a combination of deep cultural roots, a lower cost of living that enables financial flexibility, proximity to the Hill Country, and a city that, unlike Austin, does not feel like it is constantly being outrun by its own growth.
        </p>
      </div>

      {/* Pull quote */}
      <div style={{ borderLeft: `4px solid ${GOLD}`, paddingLeft: '24px', marginBottom: '40px' }}>
        <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '20px', fontStyle: 'italic', color: DARK, lineHeight: 1.6, marginBottom: '10px' }}>
          &ldquo;People who move to San Antonio almost never leave — and the data bears that out. The combination of affordability, culture, military community, and Hill Country access creates a lifestyle that is genuinely hard to replicate elsewhere in Texas.&rdquo;
        </p>
        <p style={{ fontSize: '11px', color: '#9A8E82', letterSpacing: '0.1em', textTransform: 'uppercase' }}>— HavenQuest Texas Market Intelligence, Q2 2026</p>
      </div>

      {/* Market snapshot callout */}
      <div style={{ border: `1px solid ${GOLD}`, borderRadius: '12px', padding: '24px', background: '#FDFAF4', marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '16px' }}>Market Snapshot · Q2 2026</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard label="Median Price" value="$260K" sub="San Antonio MSA" />
          <StatCard label="YoY Change" value="−3.3%" sub="Buyer-favorable correction" color="#3B6D11" />
          <StatCard label="Market Status" value="Buyer's" sub="Longer DOM, negotiable" color="#3B6D11" />
          <StatCard label="Avg. Days on Market" value="98" sub="Q2 2026" />
          <StatCard label="Cost of Living" value="−9%" sub="vs. national average" color="#3B6D11" />
          <StatCard label="Homestead Exemption" value="$140K" sub="Raised by 2024 ballot" color="#3B6D11" />
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <div style={{ position: 'relative', width: '100%', height: 200, borderRadius: '10px', overflow: 'hidden' }}>
          <Image src="/images/texas-intel/san-antonio-riverwalk.jpg" alt="San Antonio River Walk or King William Historic District" fill className="object-cover" />
        </div>
      </div>

      {/* Economy */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '14px' }}>Economy & Jobs</p>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85, marginBottom: '20px' }}>
          Joint Base San Antonio is the largest military installation in the United States, employing more than 80,000 active duty, reserve, civilian, and contractor personnel across Lackland, Fort Sam Houston, and Randolph. USAA, the financial services company built to serve the military community, operates its global headquarters in San Antonio with over 19,000 employees. Valero Energy and H-E-B — two Fortune 500 companies — are headquartered here. A growing cybersecurity sector has emerged around the military&apos;s cyber operations command. And healthcare, anchored by the UT Health San Antonio and South Texas Veterans Health Care System, employs over 150,000 people. San Antonio&apos;s economy is not dependent on a single sector — and has never suffered the boom-bust cycles of a petrostate city.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard label="JBSA Personnel" value="80K+" sub="Largest US military base" color="#3B6D11" />
          <StatCard label="USAA HQ" value="19K jobs" sub="Military financial services" />
          <StatCard label="Fortune 500 HQs" value="Valero, H-E-B" sub="Both based in San Antonio" />
          <StatCard label="COL vs. national" value="−9%" sub="Below national average" color="#3B6D11" />
          <StatCard label="Cybersecurity sector" value="Growing" sub="Anchored by DoD cyber ops" />
          <StatCard label="Population growth" value="30K/year" sub="3rd largest US gain" color="#3B6D11" />
        </div>
      </div>

      {/* Image pair */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '40px' }}>
        <div>
          <div style={{ position: 'relative', width: '100%', height: 160, borderRadius: '10px', overflow: 'hidden' }}>
            <Image src="/images/texas-intel/san-antonio-neighborhood.jpg" alt="Alamo Heights or Olmos Park neighborhood" fill className="object-cover" />
          </div>
          <p style={{ fontSize: '11px', color: '#9A8E82', marginTop: '8px', fontStyle: 'italic' }}>San Antonio&apos;s premium neighborhoods offer charm at a fraction of Austin prices</p>
        </div>
        <div>
          <div style={{ position: 'relative', width: '100%', height: 160, borderRadius: '10px', overflow: 'hidden' }}>
            <Image src="/images/texas-intel/san-antonio-hill-country.jpg" alt="Texas Hill Country — Boerne or New Braunfels gateway" fill className="object-cover" />
          </div>
          <p style={{ fontSize: '11px', color: '#9A8E82', marginTop: '8px', fontStyle: 'italic' }}>Hill Country access is a 20–30 minute drive from most San Antonio suburbs</p>
        </div>
      </div>

      {/* Neighborhoods */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>Submarket Breakdown</p>
        <p style={{ fontSize: '14px', color: WARM_GRAY, lineHeight: 1.75, marginBottom: '20px' }}>
          San Antonio&apos;s geography is shaped by the military bases to the east and the Hill Country to the northwest. The most desirable neighborhoods — Alamo Heights, Olmos Park — sit in the central north. Stone Oak and Helotes are the premium family suburbs. Boerne and New Braunfels are Hill Country gateway communities growing fast as San Antonio satellites.
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
                ['Alamo Heights', 'Established, prestigious inner suburb', 'High-income professionals', '$450K–$1.2M'],
                ['Olmos Park', 'Exclusive enclave, walkable', 'Professionals, retirees', '$500K–$1.5M'],
                ['Southtown', 'Urban, arts district, walkable', 'Young professionals, creatives', '$320K–$600K'],
                ['Stone Oak', 'Premium north suburb, family hub', 'Corporate families, school priority', '$350K–$650K'],
                ['Helotes', 'Hill Country lifestyle, suburban', 'Families, outdoor enthusiasts', '$330K–$600K'],
                ['Alamo Ranch', 'Master-planned, family-oriented', 'Families, value seekers', '$290K–$480K'],
                ['Boerne', 'Hill Country town, fast-growing', 'Retirees, Hill Country seekers', '$380K–$750K'],
                ['New Braunfels', 'Fastest-growing city in US (recent)', 'Families, outdoor lifestyle', '$300K–$550K'],
                ['Schertz / Cibolo', 'Military-adjacent, suburban value', 'Military families, commuters', '$260K–$440K'],
                ['Fair Oaks Ranch', 'Affluent Hill Country enclave', 'Equestrian, Hill Country lifestyle', '$500K–$1.2M'],
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
          The outer suburban ISDs — Comal, Boerne, Alamo Heights — are the strongest in the metro and frequently rank among the best in Texas. SAISD serves the urban core and has highly variable quality; families should research individual campuses carefully rather than relying on district-level ratings.
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
                ['Comal ISD', 'New Braunfels, Bulverde, Canyon Lake', 'Excellent', '#3B6D11'],
                ['Boerne ISD', 'Boerne, Fair Oaks Ranch', 'Excellent', '#3B6D11'],
                ['Alamo Heights ISD', 'Alamo Heights, Olmos Park', 'Exceptional', '#3B6D11'],
                ['North East ISD', 'Stone Oak, Far North San Antonio', 'Very good', '#3B6D11'],
                ['Northside ISD', 'West/Northwest San Antonio, Helotes', 'Good–Very good', '#BA7517'],
                ['Schertz-Cibolo-UC ISD', 'Schertz, Cibolo, Universal City', 'Good', '#BA7517'],
                ['SAISD', 'Urban core of San Antonio', 'Variable — research by campus', '#BA7517'],
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

      {/* Military / VA loan note */}
      <div style={{ background: 'rgba(201,168,76,0.08)', border: `1px solid ${GOLD}`, borderRadius: '12px', padding: '22px', marginBottom: '40px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#7A5A1A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Military Buyers — VA Loan Note</p>
        <p style={{ fontSize: '14px', color: '#5A4010', lineHeight: 1.75 }}>
          San Antonio is the most VA loan-friendly major metro in Texas. VA loans require no down payment, no PMI, and offer competitive rates — making them the most powerful purchase tool for eligible active duty, veterans, and surviving spouses. With a $260,000 median price and VA loan eligibility, monthly payments can be as low as $1,450–$1,600/mo (principal + interest) before property tax and insurance. Connect with a VA-experienced lender before beginning your search — the process and timeline differ from conventional financing.
        </p>
      </div>

      {/* Second image */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ position: 'relative', width: '100%', height: 180, borderRadius: '10px', overflow: 'hidden' }}>
          <Image src="/images/texas-intel/san-antonio-landscape.jpg" alt="Texas Hill Country landscape — Guadalupe River or Enchanted Rock" fill className="object-cover" />
        </div>
      </div>

      {/* True cost */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>True Cost of Homeownership</p>
        <p style={{ fontSize: '14px', color: WARM_GRAY, lineHeight: 1.75, marginBottom: '20px' }}>
          The example below models a $260,000 purchase at the metro median, with 20% down ($52,000), a 6.75% 30-year mortgage, and San Antonio&apos;s typical 1.9–2.2% effective property tax rate. VA loan buyers can eliminate the down payment and PMI entirely, making this market particularly accessible to military families.
        </p>
        <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '20px' }}>
          {[
            { label: 'Est. Monthly Mortgage', value: '$1,353', sub: '$208K balance · 6.75% · 30yr', bold: false },
            { label: 'Est. Property Tax', value: '~$330/mo', sub: 'After $140K homestead exemption', bold: false },
            { label: 'Est. Homeowner\'s Insurance', value: '~$130/mo', sub: 'Standard coverage', bold: false },
            { label: 'Total Monthly Housing', value: '~$1,813', sub: 'Before HOA or utilities', bold: true },
          ].map(item => (
            <div key={item.label} style={{ background: '#F4F2EF', borderRadius: '10px', padding: '18px' }}>
              <p style={{ fontSize: '10px', color: '#9A8E82', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</p>
              <p style={{ fontSize: '20px', fontWeight: item.bold ? 700 : 500, color: item.bold ? GOLD : DARK, marginBottom: '4px' }}>{item.value}</p>
              <p style={{ fontSize: '10px', color: '#9A8E82' }}>{item.sub}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '13px', color: '#9A8E82', fontStyle: 'italic' }}>
          VA loan buyers eliminate the $52,000 down payment and PMI, reducing total cash to close to approximately $6,000–$10,000 in closing costs only. HOA fees vary ($0–$150/mo in most suburban communities).
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
                'You are active duty, veteran, or military family',
                'Value per dollar is your primary decision driver',
                'Hill Country lifestyle access is important to you',
                'You are relocating from Austin for affordability',
                'Retiree-friendly city with culture appeals to you',
                'Your household income is $60,000–$100,000',
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
                'You need a large tech sector job market',
                'You strongly prefer a world-class food and arts scene',
                'Dense urban walkability is a must-have',
                'You depend on a major international airport hub',
                'You need proximity to coastal lifestyle',
                'Corporate relocation package targets Austin or DFW',
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

export default function SanAntonioProfile() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px 64px' }}>
        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#9A8E82' }}>
          <Link href="/texas/texas-insider" style={{ color: GOLD, textDecoration: 'none', fontWeight: 500 }}>Texas Insider</Link>
          <span>/</span><span>San Antonio</span>
        </div>

        <div style={{ position: 'relative', height: '260px', borderRadius: '12px', overflow: 'hidden', marginBottom: '28px' }}>
          <Image src="/images/texas-intel/san-antonio-hero.jpg" alt="San Antonio, Texas" fill className="object-cover" priority />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)' }} />
          <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(201,168,76,0.92)', borderRadius: '6px', padding: '4px 12px', fontSize: '11px', fontWeight: 700, color: DARK }}>Q2 2026</div>
          <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px', color: 'white' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8, marginBottom: '6px' }}>San Antonio Metro · Q2 2026</p>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '32px', fontWeight: 500, lineHeight: 1.2, marginBottom: '5px' }}>San Antonio</h1>
            <p style={{ fontSize: '14px', opacity: 0.85 }}>Texas&apos;s most underrated relocation destination</p>
          </div>
        </div>

        <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '16px', fontStyle: 'italic', color: DARK, lineHeight: 1.75, marginBottom: '20px' }}>
          San Antonio is the third-largest city in Texas with the smallest price tag among major metros. The median home runs at roughly half Austin&apos;s price. The cost of living sits 9% below the national average. And the city is adding around 30,000 new residents a year — the third-largest numeric gain of any U.S. city — almost entirely from domestic migration. People who move here almost never leave.
        </p>

        <div style={{ height: '1px', background: `linear-gradient(to right, ${GOLD}, transparent)`, marginBottom: '28px' }} />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3" style={{ marginBottom: '24px' }}>
          <StatCard label="Median Home Price" value="$260K" sub="San Antonio MSA · Q2 2026" />
          <StatCard label="YoY Change" value="−3.3%" sub="Favorable for buyers" color="#3B6D11" />
          <StatCard label="Market Status" value="Buyer's" sub="98 avg. days on market" color="#3B6D11" />
          <StatCard label="Days on Market" value="98 days" sub="Strong negotiating position" />
          <StatCard label="Cost of Living" value="−9% vs. US" sub="Below national average" color="#3B6D11" />
          <StatCard label="Homestead Exemption" value="$140K" sub="On assessed value" color="#3B6D11" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '24px' }}>
          <div style={{ border: `0.5px solid ${BORDER}`, borderRadius: '10px', padding: '18px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>Economy Snapshot</p>
            {[
              ['JBSA', 'Largest US military base'],
              ['USAA HQ', '19,000 employees'],
              ['Fortune 500 HQs', 'Valero Energy, H-E-B'],
              ['Cybersecurity sector', 'Fast-growing, DoD-anchored'],
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
              {['Military families', 'Budget-conscious buyers', 'Retirees', 'Hill Country seekers', 'Value relocators'].map((tag, i) => (
                <span key={tag} style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, background: i < 3 ? 'rgba(201,168,76,0.15)' : '#F4F2EF', color: i < 3 ? '#8A6010' : WARM_GRAY, border: i < 3 ? `0.5px solid ${GOLD}` : '0.5px solid #E0DAD0' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p style={{ fontSize: '11px', color: '#9A8E82', marginBottom: '36px' }}>
          Sources: TRERC · Redfin · Zillow · U.S. Census · VA Home Loan data · JBSA · Updated Q2 2026
        </p>

        <ProfileExpander
          cityName="San Antonio"
          teaser="From the three growth drivers to the best suburbs by family profile, VA loan advantages, school district breakdown, Hill Country access guide, and the real monthly cost of homeownership at San Antonio prices."
        >
          <SanAntonioFullArticle />
        </ProfileExpander>
      </main>
      <Footer />
    </div>
  )
}
