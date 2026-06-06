import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import ProfileExpander from '@/components/texas/ProfileExpander'

export const metadata: Metadata = {
  title: 'Texas Homeowner Guide 2026 | HavenQuest',
  description: 'Everything you need to know about Texas before you move — property taxes, homestead exemptions, new laws, housing market conditions, and the honest truth about living here.',
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

function TexasStatewideFullArticle() {
  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85, marginBottom: '20px' }}>
          Texas is the second-largest economy in the United States — and it is growing faster than any state its size. A GDP of $2.769 trillion, a population of 31.7 million, 53 Fortune 500 company headquarters, no personal state income tax, and a 2025–2026 legislative session that delivered the strongest package of homeowner protections in state history. If you are evaluating Texas as a relocation destination, you are evaluating a state that has structured itself, intentionally and over decades, to attract exactly the kind of people who are now considering moving here.
        </p>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85, marginBottom: '20px' }}>
          The growth is not random. It is driven by a tax structure that rewards income and investment, a regulatory environment that allows business to move faster than in most states, a land supply that keeps housing more affordable than coastal alternatives, and a cultural identity — the Lone Star ethos — that happens to resonate deeply with a generation of Americans seeking more space, more ownership, and more control over their financial lives. Texas added more residents than any other state last year. The people choosing to move here are not settling. They are making a deliberate choice.
        </p>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85 }}>
          Understanding Texas as a homeowner requires understanding three things: the tax structure (no income tax, but meaningful property taxes), the homestead exemption system (which significantly reduces your effective tax burden on your primary residence), and the recent legislative changes that have tilted the balance of power meaningfully toward homeowners and away from investors, foreign buyers, and abusive HOAs. This profile covers all three — and the market conditions in each major metro — so you can move forward with clarity rather than uncertainty.
        </p>
      </div>

      {/* Pull quote */}
      <div style={{ borderLeft: `4px solid ${GOLD}`, paddingLeft: '24px', marginBottom: '40px' }}>
        <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '20px', fontStyle: 'italic', color: DARK, lineHeight: 1.6, marginBottom: '10px' }}>
          &ldquo;Texas isn&apos;t just growing — it&apos;s attracting exactly the kind of residents who will compound its growth for another generation. The tax structure, the land, and the culture are self-reinforcing.&rdquo;
        </p>
        <p style={{ fontSize: '11px', color: '#9A8E82', letterSpacing: '0.1em', textTransform: 'uppercase' }}>— HavenQuest Texas Market Intelligence, Q2 2026</p>
      </div>

      {/* Market snapshot */}
      <div style={{ border: `1px solid ${GOLD}`, borderRadius: '12px', padding: '24px', background: '#FDFAF4', marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '16px' }}>Texas Statewide Snapshot · Q2 2026</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard label="Population" value="31.7M" sub="2nd fastest growing state" color="#3B6D11" />
          <StatCard label="GDP" value="$2.769T" sub="2nd largest US state economy" color="#3B6D11" />
          <StatCard label="State Income Tax" value="None" sub="Permanent constitutional prohibition" color="#3B6D11" />
          <StatCard label="Fortune 500 HQs" value="53" sub="2nd most of any US state" color="#3B6D11" />
          <StatCard label="Homestead Exemption" value="$140K" sub="Raised to $140K by 2024 ballot" color="#3B6D11" />
          <StatCard label="Population Growth" value="1.2%/yr" sub="2× the national average" color="#3B6D11" />
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <ImgPlaceholder caption="Texas landscape — Hill Country or bluebonnet fields" height={200} />
      </div>

      {/* Legislative changes — the most important section */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '14px' }}>2025–2026 Legislative Changes — What Changed for Homeowners</p>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85, marginBottom: '20px' }}>
          The 89th Texas Legislature passed a historic set of bills that materially changed the homeownership landscape. If you are buying in 2026, these laws directly affect your rights, your costs, and your investment.
        </p>
        {[
          {
            title: 'Foreign Buyer Ban (SB 147)',
            body: 'Texas now prohibits citizens of China, Russia, Iran, North Korea, Cuba, Venezuela, and Syria from purchasing real property within 25 miles of any U.S. military installation. This affects significant portions of the San Antonio metro (Joint Base San Antonio), the DFW metro (NAS Fort Worth, Dyess), and others. Buyers from these countries anywhere in Texas also face heightened disclosure and approval requirements. For U.S. citizen buyers, this law reduces competition from foreign investor pools.',
          },
          {
            title: 'Homestead Exemption Increased to $140,000',
            body: 'Texas voters approved increasing the homestead exemption from $40,000 to $140,000 in November 2024. On a home with a $300,000 assessed value, this reduces your taxable value to $160,000 — cutting your property tax bill by more than half for state school district purposes. This is one of the most significant property tax relief measures in state history for primary homeowners.',
          },
          {
            title: '10% Homestead Cap (Existing Law, Key Context)',
            body: 'Your homesteaded property\'s appraised value cannot increase more than 10% per year for tax purposes — regardless of how fast market values rise. This is a crucial long-term protection: if your neighborhood appreciates 30% in a year, your taxable value rises no more than 10%. The cap applies from the first January 1st after you establish your homestead exemption.',
          },
          {
            title: 'No Capital Gains Tax',
            body: 'Texas has no state capital gains tax. When you sell your home, you pay only the federal capital gains tax (0%, 15%, or 20% depending on income and holding period) plus the federal $250,000/$500,000 primary residence exclusion. Many buyers from California, New York, or other high-capital-gains states realize significant tax savings on home sales after moving to Texas.',
          },
          {
            title: 'HOA Reform Package',
            body: 'The legislature passed significant HOA crackdown legislation, including: mandatory itemized billing for all HOA fees, mandatory reserve fund disclosures, restrictions on fines and collection practices, enhanced homeowner appeal rights, and requirements for board meeting transparency. If you are buying in an HOA community, these new rights apply immediately.',
          },
          {
            title: 'Squatter Law (SB 2)**',
            body: 'Texas now has a fast-track eviction process for unauthorized occupants (squatters). Property owners can contact local law enforcement for removal within 5 days rather than going through the months-long civil eviction process. This is significant for investors and for owners who may need to address unauthorized occupancy quickly.',
          },
        ].map(item => (
          <div key={item.title} style={{ borderBottom: '1px solid #F0EDE6', paddingBottom: '20px', marginBottom: '20px' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: DARK, marginBottom: '8px' }}>{item.title}</p>
            <p style={{ fontSize: '14px', color: WARM_GRAY, lineHeight: 1.75 }}>{item.body}</p>
          </div>
        ))}
      </div>

      {/* Image pair */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '40px' }}>
        <div>
          <ImgPlaceholder caption="Texas urban skyline — downtown Dallas or Austin" />
          <p style={{ fontSize: '11px', color: '#9A8E82', marginTop: '8px', fontStyle: 'italic' }}>Urban Texas is growing faster than any comparable metros nationally</p>
        </div>
        <div>
          <ImgPlaceholder caption="Texas small town or rural landscape" />
          <p style={{ fontSize: '11px', color: '#9A8E82', marginTop: '8px', fontStyle: 'italic' }}>Beyond the metros, Texas offers genuine small-town character at affordable prices</p>
        </div>
      </div>

      {/* Metro comparison table */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>Metro Comparison — Q2 2026</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['Metro', 'Median Price', 'Market Status', 'Days on Market', 'COL vs. National', 'Primary Economy'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#9A8E82', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Austin', '$460K', "Buyer's (corrected)", '76 days', 'Similar', 'Tech, government, education'],
                ['Dallas-Fort Worth', '$375K', 'Rebalancing', '36 days', 'Similar', 'Finance, tech, healthcare, logistics'],
                ['Houston', '$270K', "Buyer's (softening)", '64 days', '−7%', 'Energy, medical, port, aerospace'],
                ['San Antonio', '$260K', "Buyer's (most room)", '98 days', '−9%', 'Military, corporate HQs, healthcare'],
              ].map(([metro, price, status, dom, col, economy], i) => (
                <tr key={metro} style={{ borderBottom: '1px solid #F0EDE6', background: i % 2 === 0 ? 'transparent' : CREAM }}>
                  <td style={{ padding: '11px 12px', fontWeight: 600, color: GOLD }}>
                    <Link href={`/texas/market-profiles/${metro.toLowerCase().replace(' / ', '/').replace('dallas-fort worth', 'dfw').replace('san antonio', 'san-antonio').replace('austin', 'austin').replace('houston', 'houston')}`} style={{ color: GOLD, textDecoration: 'none' }}>{metro}</Link>
                  </td>
                  <td style={{ padding: '11px 12px', fontWeight: 500, color: DARK }}>{price}</td>
                  <td style={{ padding: '11px 12px', color: WARM_GRAY }}>{status}</td>
                  <td style={{ padding: '11px 12px', color: WARM_GRAY }}>{dom}</td>
                  <td style={{ padding: '11px 12px', color: WARM_GRAY }}>{col}</td>
                  <td style={{ padding: '11px 12px', color: WARM_GRAY }}>{economy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Climate & infrastructure */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '14px' }}>Climate, Weather & Infrastructure — What You Need to Know</p>
        <p style={{ fontSize: '15px', color: WARM_GRAY, lineHeight: 1.85, marginBottom: '20px' }}>
          Texas is a geographically diverse state. The Hill Country and central Texas have a Mediterranean-like climate with hot summers and mild winters. Houston and the Gulf Coast are subtropical — hot, humid, and hurricane-exposed. DFW and North Texas have a continental climate with genuine winter cold and tornado exposure. West Texas is arid semi-desert. Climate should be a factor in your metro selection, not an afterthought.
        </p>
        <div style={{ background: '#FEF3CD', border: '1px solid #F0A500', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#92400E', marginBottom: '8px' }}>ERCOT Grid — What You Need to Know</p>
          <p style={{ fontSize: '13px', color: '#78350F', lineHeight: 1.75 }}>
            Texas operates its own electrical grid (ERCOT), largely independent of the national grid. The February 2021 winter storm event caused widespread power failures. Since then, Texas has weatherized significant generation capacity and added over 40 GW of solar and battery storage. However, ERCOT remains a distinct grid with its own supply/demand dynamics. Most buyers in newer construction will not face significant grid exposure, but older homes without insulated pipes or whole-home generators benefit from upgrades. This is a manageable risk, not a dealbreaker — millions of Texans live and work here comfortably year-round.
          </p>
        </div>
      </div>

      {/* Second image */}
      <div style={{ marginBottom: '40px' }}>
        <ImgPlaceholder caption="Texas Hill Country — bluebonnets or Pedernales Falls" height={180} />
      </div>

      {/* True cost of ownership in Texas */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>Understanding Property Taxes in Texas</p>
        <p style={{ fontSize: '14px', color: WARM_GRAY, lineHeight: 1.75, marginBottom: '20px' }}>
          Texas has no state income tax. Its primary mechanism for funding local government — schools, roads, emergency services — is the property tax. Effective rates range from 1.7% to 2.5% of appraised value depending on the county and the overlapping taxing entities (city, county, school district, hospital district, MUD). The $140,000 homestead exemption applies specifically to school district taxes, which are typically the largest component.
        </p>
        <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '20px' }}>
          {[
            { label: 'Effective Tax Rate (Austin area)', value: '1.8–2.2%', sub: 'Of appraised value annually' },
            { label: 'Effective Tax Rate (DFW)', value: '1.8–2.1%', sub: 'Of appraised value annually' },
            { label: 'Effective Tax Rate (Houston)', value: '2.0–2.5%', sub: 'Of appraised value annually' },
            { label: 'Effective Tax Rate (San Antonio)', value: '1.9–2.2%', sub: 'Of appraised value annually' },
          ].map(item => (
            <div key={item.label} style={{ background: '#F4F2EF', borderRadius: '10px', padding: '18px' }}>
              <p style={{ fontSize: '10px', color: '#9A8E82', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</p>
              <p style={{ fontSize: '20px', fontWeight: 500, color: DARK, marginBottom: '4px' }}>{item.value}</p>
              <p style={{ fontSize: '10px', color: '#9A8E82' }}>{item.sub}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '13px', color: '#9A8E82', fontStyle: 'italic' }}>
          Apply for your homestead exemption in the first year of ownership. It reduces your school district taxable value by $140,000 and caps future assessment increases at 10%/year. File with your county appraisal district — typically due April 30th of the year following purchase.
        </p>
      </div>

      {/* Honest assessment */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '16px' }}>Honest Assessment — Is Texas Right for You?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div style={{ background: '#EAF3DE', borderRadius: '12px', padding: '22px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#3B6D11', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>Strong fit if...</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'You are relocating from a high-income-tax state (CA, NY, IL)',
                'Homeownership with space and land is a priority',
                'Career is in tech, finance, energy, healthcare, or defense',
                'You value the Lone Star lifestyle — big sky, independence, community',
                'Cost of living matters and you want more for your money',
                'You want to build equity in a growing, job-rich market',
              ].map(item => (
                <li key={item} style={{ fontSize: '13px', color: '#2D5A0E', paddingLeft: '18px', position: 'relative', lineHeight: 1.5 }}>
                  <span style={{ position: 'absolute', left: 0, color: '#3B6D11' }}>✓</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: '#FFFBEB', borderRadius: '12px', padding: '22px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#BA7517', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>Consider carefully if...</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Coastal proximity or ocean lifestyle is non-negotiable',
                'You depend on state-specific public programs (Medi-Cal, etc.)',
                'Very dense, walkable urban core is your top priority',
                'Heat and humidity are a significant quality-of-life concern',
                'Hurricane or tornado risk is a dealbreaker for you',
                'You prefer a state with a large existing personal network',
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

export default function TexasStatewideProfile() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px 64px' }}>

        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#9A8E82' }}>
          <Link href="/texas/market-profiles" style={{ color: GOLD, textDecoration: 'none', fontWeight: 500 }}>Texas Market Intelligence</Link>
          <span>/</span><span>Texas Statewide</span>
        </div>

        {/* Hero — placeholder since no statewide image */}
        <div style={{ height: '260px', borderRadius: '12px', overflow: 'hidden', marginBottom: '28px', background: 'linear-gradient(135deg, #1A1A1A 0%, #3A2800 60%, #C9A84C 100%)', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '0' }}>
          <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(201,168,76,0.92)', borderRadius: '6px', padding: '4px 12px', fontSize: '11px', fontWeight: 700, color: DARK }}>Q2 2026</div>
          <div style={{ padding: '24px', color: 'white' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.7, marginBottom: '6px' }}>Texas Statewide · Q2 2026</p>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '32px', fontWeight: 500, lineHeight: 1.2, marginBottom: '5px' }}>Texas Statewide</h1>
            <p style={{ fontSize: '14px', opacity: 0.8 }}>The full picture — before you commit to anything</p>
          </div>
        </div>

        <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '16px', fontStyle: 'italic', color: DARK, lineHeight: 1.75, marginBottom: '20px' }}>
          Texas added more residents than any other state last year, reaching 31.7 million people. Its economy is the second largest in the country. There is no state income tax. And in 2026, a historic set of legislative changes gave homeowners the strongest protections and tax relief in state history. This is the profile that explains the rules of the game — so you can play it well.
        </p>

        <div style={{ height: '1px', background: `linear-gradient(to right, ${GOLD}, transparent)`, marginBottom: '28px' }} />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3" style={{ marginBottom: '24px' }}>
          <StatCard label="Population" value="31.7M" sub="2nd fastest growing US state" color="#3B6D11" />
          <StatCard label="GDP" value="$2.769T" sub="2nd largest US economy" color="#3B6D11" />
          <StatCard label="State Income Tax" value="None" sub="Constitutional prohibition" color="#3B6D11" />
          <StatCard label="Fortune 500 HQs" value="53" sub="2nd most in US" color="#3B6D11" />
          <StatCard label="Homestead Exemption" value="$140K" sub="Raised by 2024 ballot" color="#3B6D11" />
          <StatCard label="Pop. Growth Rate" value="1.2%/yr" sub="2× the national average" color="#3B6D11" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '24px' }}>
          <div style={{ border: `0.5px solid ${BORDER}`, borderRadius: '10px', padding: '18px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, marginBottom: '12px' }}>Economy Snapshot</p>
            {[
              ['Key sectors', 'Energy, tech, healthcare, finance'],
              ['Aerospace & defense', 'Major DoD presence statewide'],
              ['Manufacturing', 'Fastest-growing sector 2024–25'],
              ['International trade', 'Largest US-Mexico trade corridor'],
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
              {['Anyone relocating to Texas', 'First-time Texas buyers', 'Investors', 'Retirees', 'Remote workers', 'Career relocators'].map((tag, i) => (
                <span key={tag} style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, background: i < 3 ? 'rgba(201,168,76,0.15)' : '#F4F2EF', color: i < 3 ? '#8A6010' : WARM_GRAY, border: i < 3 ? `0.5px solid ${GOLD}` : '0.5px solid #E0DAD0' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p style={{ fontSize: '11px', color: '#9A8E82', marginBottom: '36px' }}>
          Sources: U.S. Census Bureau · Texas Comptroller · TRERC · Texas Legislative Council · Texas.gov · Updated Q2 2026
        </p>

        <ProfileExpander
          cityName="Texas"
          teaser="The complete statewide guide — property tax mechanics, the 2025–2026 legislative changes that matter for homeowners, metro-by-metro comparison, climate by region, ERCOT infrastructure context, and the honest assessment of who Texas is right for."
        >
          <TexasStatewideFullArticle />
        </ProfileExpander>

      </main>
      <Footer />
    </div>
  )
}
