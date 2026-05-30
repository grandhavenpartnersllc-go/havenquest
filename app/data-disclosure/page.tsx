import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'

export const metadata: Metadata = {
  title: 'Data Sources & Methodology Disclosure | HavenQuest',
  description: 'Full transparency into how HavenQuest collects, scores, and uses data — sources, methodology, scoring logic, matching algorithm, and platform limitations.',
  openGraph: {
    title: 'HavenQuest — Data Sources & Methodology Disclosure',
    description: 'Full transparency into how HavenQuest scores Texas cities and matches users to communities.',
    url: 'https://havenquest.co/data-disclosure',
    siteName: 'HavenQuest',
    type: 'website',
  },
}

const cardStyle = { boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }

const TableHeader = ({ cols }: { cols: string[] }) => (
  <thead>
    <tr className="border-b border-gray-100">
      {cols.map((col, i) => (
        <th key={i} className="text-left py-2 pr-4 last:pr-0 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          {col}
        </th>
      ))}
    </tr>
  </thead>
)

export default function DataDisclosurePage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="bg-[#08101C] border-b border-white/8 px-4 py-10">
          <div className="max-w-3xl mx-auto">
            <p className="text-blue-400/60 text-[11px] font-bold uppercase tracking-widest mb-3">Disclosure</p>
            <h1 className="text-3xl font-bold text-white tracking-tight">Data Sources &amp; Methodology Disclosure</h1>
            <p className="text-white/40 text-sm mt-2">Version 1.0 — May 2026</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="space-y-5">

            {/* Purpose */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6" style={cardStyle}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Purpose</h2>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p>This document provides full transparency into how HavenQuest collects, scores, and uses data to generate city match results for users. It is intended for users, realtors, investors, and any party who wants to understand how the platform works.</p>
                <p>HavenQuest is a relocation intelligence tool. Our goal is to help people find the Texas city that best fits their lifestyle, budget, and priorities. We do not guarantee outcomes. All scores are directional guidance — not financial, legal, or real estate advice.</p>
              </div>
            </section>

            {/* Section 1 */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6" style={cardStyle}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Section 1 — What Data We Use</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">HavenQuest uses publicly available data from the following sources. All data is researched and verified at the city level wherever possible. Where city-level data is unavailable, county-level or metro-level data is used and disclosed.</p>

              <h3 className="text-sm font-bold text-gray-800 mb-3">1.1 Housing &amp; Market Data</h3>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <TableHeader cols={['Data Point', 'Primary Source', 'Frequency']} />
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ['Median home price', 'Redfin city-level (preferred), Zillow ZHVI, Orchard', 'Monthly'],
                      ['Price per square foot', 'Redfin city-level', 'Monthly'],
                      ['Days on market', 'Redfin city-level', 'Monthly'],
                      ['Sale-to-list ratio', 'Redfin city-level, Orchard', 'Monthly'],
                      ['Price YOY change', 'Redfin city-level', 'Monthly'],
                      ['Market condition', 'Derived from DOM and sale-to-list ratio', 'Monthly'],
                      ['Property tax rate', 'County appraisal district records', 'Annually (January)'],
                      ['Estimated rent (1BR/2BR/3BR)', 'Zillow Rent Estimates, Apartments.com', 'Quarterly'],
                    ].map(([point, source, freq]) => (
                      <tr key={point}>
                        <td className="py-2.5 pr-4 font-medium text-gray-700 text-xs">{point}</td>
                        <td className="py-2.5 pr-4 text-gray-500 text-xs">{source}</td>
                        <td className="py-2.5 text-gray-400 text-xs whitespace-nowrap">{freq}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mb-6 space-y-1.5 text-xs text-gray-500">
                <p className="font-bold text-gray-700 mb-1">Market condition definitions:</p>
                <p><strong className="text-gray-700">Seller&apos;s Market</strong> — homes selling in under 30 days, sale-to-list above 99%</p>
                <p><strong className="text-gray-700">Balanced Market</strong> — 30–60 days on market, sale-to-list 97–99%</p>
                <p><strong className="text-gray-700">Buyer&apos;s Market</strong> — over 60 days on market, sale-to-list below 97%</p>
              </div>

              <h3 className="text-sm font-bold text-gray-800 mb-3">1.2 School Data</h3>
              <div className="overflow-x-auto mb-3">
                <table className="w-full text-sm">
                  <TableHeader cols={['Data Point', 'Primary Source', 'Frequency']} />
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-gray-700 text-xs">TEA A–F district rating</td>
                      <td className="py-2.5 pr-4 text-gray-500 text-xs">Texas Education Agency (TEA)</td>
                      <td className="py-2.5 text-gray-400 text-xs whitespace-nowrap">Annually (August)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-gray-700 text-xs">Primary ISD name</td>
                      <td className="py-2.5 pr-4 text-gray-500 text-xs">TEA district records</td>
                      <td className="py-2.5 text-gray-400 text-xs whitespace-nowrap">Annually</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mb-6 space-y-2 text-xs text-gray-500 leading-relaxed">
                <p>TEA ratings are assigned A through F based on three domains: Student Achievement, School Progress, and Closing the Gaps. Scores are based primarily on STAAR standardized test performance, graduation rates, and college/career readiness.</p>
                <p><strong className="text-gray-700">Note:</strong> TEA ratings reflect the 2024–2025 school year, released August 15, 2025. HavenQuest will update all ISD ratings following each annual TEA release.</p>
              </div>

              <h3 className="text-sm font-bold text-gray-800 mb-3">1.3 Safety Data</h3>
              <div className="overflow-x-auto mb-3">
                <table className="w-full text-sm">
                  <TableHeader cols={['Data Point', 'Primary Source', 'Frequency']} />
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-gray-700 text-xs">Crime rate (per 100K residents)</td>
                      <td className="py-2.5 pr-4 text-gray-500 text-xs">FBI UCR, City-level crime reports, NeighborhoodScout</td>
                      <td className="py-2.5 text-gray-400 text-xs whitespace-nowrap">Annually</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-gray-700 text-xs">Crime trend direction</td>
                      <td className="py-2.5 pr-4 text-gray-500 text-xs">Year-over-year comparison from same sources</td>
                      <td className="py-2.5 text-gray-400 text-xs whitespace-nowrap">Annually</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">Safety scores are derived from violent crime rates and property crime rates relative to Texas and national averages. Cities are scored on a 1–10 scale where 10 represents the lowest crime rate relative to peers.</p>

              <h3 className="text-sm font-bold text-gray-800 mb-3">1.4 Cost of Living Data</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <TableHeader cols={['Data Point', 'Primary Source', 'Frequency']} />
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ['Monthly utilities estimate', 'EnergyBot, City utility reports', 'Annually'],
                      ['Monthly groceries estimate', 'Bureau of Labor Statistics CPI regional data', 'Annually'],
                      ['Monthly transportation estimate', 'AAA, Bureau of Transportation Statistics', 'Annually'],
                    ].map(([point, source, freq]) => (
                      <tr key={point}>
                        <td className="py-2.5 pr-4 font-medium text-gray-700 text-xs">{point}</td>
                        <td className="py-2.5 pr-4 text-gray-500 text-xs">{source}</td>
                        <td className="py-2.5 text-gray-400 text-xs whitespace-nowrap">{freq}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-sm font-bold text-gray-800 mb-3">1.5 Lifestyle &amp; Walkability Data</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <TableHeader cols={['Data Point', 'Primary Source', 'Frequency']} />
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ['Walkability score', 'Walk Score city-level', 'Annually'],
                      ['Transit score', 'Walk Score, city transit authority data', 'Annually'],
                      ['Traffic/commute data', 'TomTom Traffic Index, Google Maps commute data', 'Annually'],
                      ['Outdoor recreation', 'AllTrails, Texas Parks and Wildlife, city parks departments', 'Annually'],
                      ['Nightlife/dining density', 'Yelp business density data, local knowledge', 'Annually'],
                    ].map(([point, source, freq]) => (
                      <tr key={point}>
                        <td className="py-2.5 pr-4 font-medium text-gray-700 text-xs">{point}</td>
                        <td className="py-2.5 pr-4 text-gray-500 text-xs">{source}</td>
                        <td className="py-2.5 text-gray-400 text-xs whitespace-nowrap">{freq}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-sm font-bold text-gray-800 mb-3">1.6 Climate Data</h3>
              <div className="overflow-x-auto mb-3">
                <table className="w-full text-sm">
                  <TableHeader cols={['Data Point', 'Primary Source', 'Frequency']} />
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-gray-700 text-xs">Weather score</td>
                      <td className="py-2.5 pr-4 text-gray-500 text-xs">NOAA climate normals, Texas climatology data</td>
                      <td className="py-2.5 text-gray-400 text-xs whitespace-nowrap">Evergreen</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">Weather scores reflect average annual temperature range, humidity, number of extreme heat days, and storm exposure (hurricane, tornado, flooding risk).</p>
            </section>

            {/* Section 2 */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6" style={cardStyle}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Section 2 — How Scores Are Calculated</h2>

              <h3 className="text-sm font-bold text-gray-800 mb-3">2.1 The 12 Lifestyle Category Scores</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">Every city in the HavenQuest database is scored on 12 lifestyle categories on a scale of 1 to 10. These scores are editorially assigned by HavenQuest based on the underlying data sources listed in Section 1. They are directional indicators, not precise measurements.</p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <TableHeader cols={['Category', 'What It Measures', 'Data Basis']} />
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ['Affordability', 'How accessible the housing market is for typical buyers', 'Median home price relative to Texas average; property tax rate'],
                      ['Schools', 'Quality of the primary public school district', 'TEA A–F rating (A=9-10, B=7-8, C=5-6, D=3-4, F=1-2)'],
                      ['Safety', 'Violent and property crime rate relative to Texas average', 'FBI UCR, city crime reports'],
                      ['Walkability', 'Ability to accomplish daily tasks without a car', 'Walk Score city-level'],
                      ['Transit', 'Access to public transportation', 'Walk Score transit index, city transit routes'],
                      ['Nightlife', 'Density and quality of restaurants, bars, and entertainment', 'Yelp business density, local editorial review'],
                      ['Outdoors', 'Access to parks, trails, lakes, and natural recreation', 'AllTrails, Texas Parks and Wildlife, proximity to state parks'],
                      ['Family Friendly', 'Overall suitability for families with children', 'School quality, safety, parks, community programming'],
                      ['Remote Work', 'Infrastructure and environment for remote workers', 'Internet availability, coworking space access, cost of living'],
                      ['Low Taxes', 'Property tax burden relative to Texas average', 'County appraisal district effective tax rates'],
                      ['Weather', 'Climate comfort and storm risk', 'NOAA climate normals, hurricane/tornado/flood risk'],
                      ['Traffic', 'Commute times and congestion', 'TomTom Traffic Index, peak hour commute estimates'],
                    ].map(([cat, what, basis]) => (
                      <tr key={cat}>
                        <td className="py-2.5 pr-4 font-bold text-gray-900 text-xs whitespace-nowrap">{cat}</td>
                        <td className="py-2.5 pr-4 text-gray-500 text-xs">{what}</td>
                        <td className="py-2.5 text-gray-400 text-xs">{basis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-sm font-bold text-gray-800 mb-2">2.2 Score Calibration</h3>
              <div className="space-y-2 text-sm text-gray-500 leading-relaxed mb-5">
                <p>Scores are calibrated relative to the full HavenQuest database of 100+ Texas cities. A score of 10 represents the best-performing city in the database for that category. A score of 1 represents the lowest-performing city.</p>
                <p>Scores are not absolute — they are relative to the Texas cities in our database. A city scoring 8/10 on Safety is very safe compared to other Texas cities. The same city may score differently if compared to a national database.</p>
              </div>

              <h3 className="text-sm font-bold text-gray-800 mb-2">2.3 Affordability Score Logic</h3>
              <div className="space-y-2 text-sm text-gray-500 leading-relaxed">
                <p>The affordability score is calculated based on median home price relative to the Texas average ($341,800 as of March 2026), property tax rate, and estimated monthly ownership cost.</p>
                <p><strong className="text-gray-700">Affordability flag:</strong> If a user&apos;s estimated monthly housing cost (principal, interest, and property tax at 7% down and 30-year fixed) exceeds 40% of their declared monthly gross income, an affordability flag is displayed on that city&apos;s result. This flag is a warning, not a disqualification. Users who select &quot;Luxury&quot; as a priority bypass this flag.</p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6" style={cardStyle}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Section 3 — The Matching Algorithm</h2>

              <h3 className="text-sm font-bold text-gray-800 mb-3">3.1 How User Priorities Are Weighted</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">Users assign each of the 12 lifestyle categories to one of three priority levels:</p>
              <div className="overflow-x-auto mb-3">
                <table className="w-full text-sm">
                  <TableHeader cols={['Priority Level', 'Weight', 'Max Assignments']} />
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ['Must Have', '3×', 'Up to 3 categories'],
                      ['Important to Me', '2×', 'Up to 5 categories'],
                      ['Would Be Nice', '1×', 'Unlimited'],
                      ['Unassigned', '0×', 'Not included in score'],
                    ].map(([level, weight, max]) => (
                      <tr key={level}>
                        <td className="py-2.5 pr-4 font-bold text-gray-900 text-xs">{level}</td>
                        <td className="py-2.5 pr-4 text-gray-500 text-xs">{weight}</td>
                        <td className="py-2.5 text-gray-400 text-xs">{max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">Categories left unassigned receive zero weight and do not influence results. This means a user who does not assign a category is explicitly saying &quot;this does not matter to me&quot; — and the algorithm honors that.</p>

              <h3 className="text-sm font-bold text-gray-800 mb-3">3.2 Match Score Calculation</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">For each city, a weighted match score is calculated as follows:</p>
              <div className="bg-[#F8F9FB] rounded-xl p-4 font-mono text-xs border border-gray-100 mb-3 space-y-2">
                <p>Match Score = Σ (Category Score × Priority Weight)</p>
                <p className="text-gray-400">Example: Schools = Must Have (3×), Safety = Must Have (3×), Affordability = Important to Me (2×), Outdoors = Would Be Nice (1×)</p>
                <p>City scores: Schools=9, Safety=8, Affordability=7, Outdoors=6</p>
                <p>(9×3) + (8×3) + (7×2) + (6×1) = 27 + 24 + 14 + 6 = <strong>71</strong></p>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">Cities are ranked by their match score. The top results are presented to the user as their best matches.</p>

              <h3 className="text-sm font-bold text-gray-800 mb-3">3.3 What the Algorithm Does Not Do</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                {[
                  'It does not use personal demographic data (race, religion, national origin) in any scoring calculation',
                  'It does not weight results based on price point unless affordability is explicitly assigned as a priority',
                  'It does not favor or suppress any city based on realtor relationships or commercial arrangements',
                  'It does not use machine learning or AI inference — all scores are human-researched and editorially assigned',
                ].map(item => (
                  <li key={item} className="flex gap-2.5">
                    <span className="text-gray-300 shrink-0 mt-0.5">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 4 */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6" style={cardStyle}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Section 4 — Data Integrity &amp; Maintenance</h2>

              <h3 className="text-sm font-bold text-gray-800 mb-3">4.1 Data Freshness</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">HavenQuest maintains a scheduled data review process:</p>
              <div className="overflow-x-auto mb-3">
                <table className="w-full text-sm">
                  <TableHeader cols={['Review Type', 'Frequency', 'What Is Updated']} />
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ['Market data audit', 'Monthly (1st of each month)', 'Median price, DOM, sale-to-list, market condition'],
                      ['TEA ratings update', 'Annually (August)', 'All 100+ ISD ratings'],
                      ['Property tax rate review', 'Annually (January)', 'All 100+ city tax rates'],
                      ['Crime data update', 'Annually', 'All 100+ city safety scores'],
                    ].map(([type, freq, what]) => (
                      <tr key={type}>
                        <td className="py-2.5 pr-4 font-bold text-gray-900 text-xs whitespace-nowrap">{type}</td>
                        <td className="py-2.5 pr-4 text-gray-500 text-xs whitespace-nowrap">{freq}</td>
                        <td className="py-2.5 text-gray-400 text-xs">{what}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">Each city entry includes a <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">lastUpdated</code> field indicating when that city&apos;s data was last verified. Data that has not been verified within 90 days is flagged for review.</p>

              <h3 className="text-sm font-bold text-gray-800 mb-3">4.2 Data Sources We Do Not Use</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">HavenQuest does not use the following as primary data sources:</p>
              <ul className="space-y-2 text-sm text-gray-500 mb-6">
                {[
                  ['User-generated reviews', '(Yelp ratings, Nextdoor posts, Reddit threads) — these are subject to bias and cannot be verified'],
                  ['Real estate agent recommendations', '— realtors in our network do not influence city scores'],
                  ['Advertiser-influenced rankings', '— no city pays to appear in results or receive higher scores'],
                  ['Automated scraping without verification', '— all data points are manually verified against primary sources'],
                ].map(([label, rest]) => (
                  <li key={label} className="flex gap-2.5">
                    <span className="text-gray-300 shrink-0 mt-0.5">—</span>
                    <span><strong className="text-gray-700">{label}</strong> {rest}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-sm font-bold text-gray-800 mb-3">4.3 Limitations We Disclose</h3>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p><strong className="text-gray-700">City-level vs. neighborhood-level data:</strong> HavenQuest scores reflect city-wide averages. Significant variation can exist between neighborhoods within the same city. A city scoring 5/10 on Safety may have neighborhoods that score significantly higher or lower. Users should conduct neighborhood-level research before making any purchasing decision.</p>
                <p><strong className="text-gray-700">Small market data:</strong> For smaller cities (population under 20,000) and some newer communities, city-level Redfin data may be unavailable. In these cases we use county-level data or local MLS data and disclose the source.</p>
                <p><strong className="text-gray-700">Score subjectivity:</strong> The 12 lifestyle scores involve editorial judgment in their assignment. Two researchers reviewing the same data may assign slightly different scores. We calibrate scores annually and adjust for material changes.</p>
                <p><strong className="text-gray-700">Market volatility:</strong> Texas housing market conditions in 2026 are more volatile than historical norms. Price data can change materially within a 30–60 day period. Users should verify current market conditions with a licensed real estate professional before making any purchasing decisions.</p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6" style={cardStyle}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Section 5 — What HavenQuest Is Not</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">HavenQuest is a relocation intelligence and city-matching platform. It is not:</p>
              <ul className="space-y-1.5 text-sm text-gray-500 mb-5">
                {[
                  'A licensed real estate brokerage',
                  'A mortgage lender or financial advisor',
                  'A legal advisor',
                  'A school enrollment service',
                  'A guarantee of any housing outcome',
                ].map(item => (
                  <li key={item} className="flex gap-2.5">
                    <span className="text-gray-300 shrink-0 mt-0.5">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 leading-relaxed">All city match results, scores, and descriptions are provided for informational purposes only. HavenQuest does not guarantee the accuracy of any data point and recommends users verify all information independently before making any relocation or purchasing decision.</p>
            </section>

            {/* Section 6 */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6" style={cardStyle}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Section 6 — Realtor Network Disclosure</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">Realtors featured in HavenQuest&apos;s network are vetted against the following published standards:</p>

              <div className="space-y-3 mb-5">
                {[
                  {
                    title: 'Tier 1 — Major Metro Markets (DFW, Houston, Austin, San Antonio)',
                    items: [
                      'Active TREC license in good standing',
                      '40+ verified transactions per year',
                      '4.8+ star rating with 50+ reviews on Google or Zillow',
                      '15+ years licensed experience',
                      'Credible recognition (team, awards, production ranking)',
                    ],
                  },
                  {
                    title: 'Tier 2 — Secondary Markets',
                    items: [
                      'Active TREC license in good standing',
                      '25+ verified transactions per year',
                      '4.8+ star rating with 30+ reviews',
                      '10+ years licensed experience',
                    ],
                  },
                  {
                    title: 'Tier 3 — Smaller Markets',
                    items: [
                      'Active TREC license in good standing',
                      '20+ verified transactions per year',
                      '4.7+ star rating with 20+ reviews',
                      '7+ years licensed experience',
                    ],
                  },
                  {
                    title: 'All tiers require',
                    items: [
                      'Clean TREC disciplinary record (verified at application)',
                      '24-hour response commitment to HavenQuest-referred clients',
                      'Paid subscription to the HavenQuest realtor network',
                    ],
                  },
                ].map(tier => (
                  <div key={tier.title} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-bold text-gray-800 mb-2">{tier.title}</p>
                    <ul className="space-y-1">
                      {tier.items.map(item => (
                        <li key={item} className="flex gap-2 text-xs text-gray-500">
                          <span className="text-gray-300 shrink-0 mt-0.5">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Important disclosure:</strong> Realtors pay a monthly subscription to be listed in the HavenQuest network. Subscription tier (Standard $99, Professional $199, Elite $349/month) affects placement prominence but does not affect city match scores or which users are matched to which cities. No realtor can pay to influence the matching algorithm.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6" style={cardStyle}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Section 7 — Contact &amp; Corrections</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">If you believe any data point in the HavenQuest database is inaccurate, outdated, or misleading, please contact us:</p>
              <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1.5 mb-4">
                <p><strong className="text-gray-700">Email:</strong> <span className="text-gray-500">grandhavenpartners.llc@gmail.com</span></p>
                <p><strong className="text-gray-700">Subject line:</strong> <span className="text-gray-500">Data Correction Request — [City Name]</span></p>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">We will review all correction requests and update data within 30 days if the correction is substantiated by a verifiable primary source.</p>
            </section>

            {/* Disclaimer */}
            <section className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
              <h2 className="font-bold text-amber-900 tracking-tight mb-2">Disclaimer</h2>
              <p className="text-sm text-amber-800 leading-relaxed mb-2">
                HavenQuest is operated by American Victory Alliance, LLC — Austin, TX. All data is provided for informational purposes only and does not constitute financial, legal, or real estate advice. Scores are directional lifestyle guidance.
              </p>
              <p className="text-xs text-amber-700">Document version 1.0 — May 29, 2026. Subject to revision as platform data and methodology evolve.</p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
