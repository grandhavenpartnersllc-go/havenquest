import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import { LIFESTYLE_CATEGORIES } from '../../utils/constants'

export const metadata: Metadata = {
  title: 'How HavenQuest Scores Texas Cities | Methodology',
  description: 'Understand how HavenQuest scores Texas cities — data sources, scoring methodology, the 12 lifestyle categories, and the matching algorithm explained.',
  openGraph: {
    title: 'HavenQuest Methodology — How We Score Texas Cities',
    description: 'Transparent scoring methodology for Texas city and neighborhood ratings.',
    url: 'https://havenquest.co/methodology',
    siteName: 'HavenQuest',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HavenQuest Methodology',
    description: 'How HavenQuest scores Texas cities for relocation.',
  },
}

const dataSources = [
  { source: 'Redfin', url: 'redfin.com', usage: 'Median sale price, days on market, sale-to-list ratio, YOY price change', updated: '02/2026–04/2026', frequency: 'Monthly' },
  { source: 'TEA (Texas Education Agency)', url: 'tea.texas.gov', usage: 'School district letter grades (A–F)', updated: '2024-25', frequency: 'Annual' },
  { source: 'FBI/NeighborhoodScout', url: 'neighborhoodscout.com', usage: 'Crime rate per 100K population', updated: '2024', frequency: 'Annual' },
  { source: 'Walk Score', url: 'walkscore.com', usage: 'Walkability and transit scores', updated: '2026', frequency: 'Continuous' },
  { source: 'Zillow', url: 'zillow.com', usage: 'Backup rent and home price data where Redfin unavailable', updated: '2026', frequency: 'Monthly' },
  { source: 'BLS / City data', url: 'bls.gov', usage: 'Monthly utilities, groceries, transportation estimates', updated: '2025', frequency: 'Annual' },
]

const cardStyle = { boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }

export default function MethodologyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="bg-[#08101C] border-b border-white/8 px-4 py-10">
          <div className="max-w-3xl mx-auto">
            <p className="text-blue-400/60 text-[11px] font-bold uppercase tracking-widest mb-3">Methodology</p>
            <h1 className="text-3xl font-bold text-white tracking-tight">How HavenQuest scores Texas cities</h1>
            <p className="text-white/40 text-sm mt-2">Transparent methodology. Real data. Honest tradeoffs.</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="space-y-5">

            <section className="bg-white rounded-2xl border border-gray-100 p-6" style={cardStyle}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">The 12 lifestyle categories</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {LIFESTYLE_CATEGORIES.map(cat => (
                  <div key={cat.key} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-xl shrink-0">{cat.icon}</span>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{cat.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6" style={cardStyle}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Data sources</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 pr-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Source</th>
                      <th className="text-left py-2 pr-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Used for</th>
                      <th className="text-left py-2 pr-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Updated</th>
                      <th className="text-left py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Frequency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dataSources.map(ds => (
                      <tr key={ds.source}>
                        <td className="py-2.5 pr-4 font-bold text-gray-900 text-xs whitespace-nowrap">{ds.source}</td>
                        <td className="py-2.5 pr-4 text-gray-500 text-xs">{ds.usage}</td>
                        <td className="py-2.5 pr-4 text-gray-400 tabular-nums text-xs whitespace-nowrap">{ds.updated}</td>
                        <td className="py-2.5 text-gray-400 text-xs">{ds.frequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6" style={cardStyle}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Scoring scale — 1 to 10</h2>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {[
                  { score: '1–2', label: 'Poor', bg: '#FCEBEB', text: '#A32D2D' },
                  { score: '3–4', label: 'Below Avg', bg: '#F7F6F3', text: '#6B7280' },
                  { score: '5–6', label: 'Average', bg: '#EBF3FB', text: '#1A5FA8' },
                  { score: '7–8', label: 'Good', bg: '#EAF3DE', text: '#3B6D11' },
                  { score: '9–10', label: 'Excellent', bg: '#EAF3DE', text: '#3B6D11' },
                ].map(s => (
                  <div key={s.score} className="text-center p-2.5 rounded-xl" style={{ background: s.bg }}>
                    <p className="font-bold text-sm" style={{ color: s.text }}>{s.score}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: s.text }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Scores are directional and relative — a 9/10 in Traffic means minimal congestion vs Texas peers,
                not absolute zero traffic. Compare cities against each other, not against a national standard.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6" style={cardStyle}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">How the matching algorithm works</h2>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p>Each city receives a <strong className="text-gray-700">weighted match score</strong> based on your three priority buckets:</p>
                <div className="bg-[#F8F9FB] rounded-xl p-4 font-mono text-xs space-y-1.5 border border-gray-100">
                  <p><span className="text-accent font-bold">Must Have</span> categories → score × <strong>3x weight</strong></p>
                  <p><span className="text-gray-600 font-bold">Nice to Have</span> categories → score × <strong>1.5x weight</strong></p>
                  <p><span className="text-gray-400 font-bold">Not a Priority</span> categories → score × <strong>1x weight</strong></p>
                </div>
                <p>
                  The raw weighted score is divided by the maximum possible score to produce a
                  percentage (0–100%). Cities are ranked by this score, highest first.
                </p>
                <p>
                  Must Have categories you don&apos;t fill are excluded from scoring,
                  so the algorithm adapts to however many priorities you set.
                </p>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6" style={cardStyle}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-3">The 40% affordability threshold</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">
                HavenQuest flags any city where your selected housing option would cost more than
                <strong className="text-gray-700"> 40% of your gross monthly income</strong>. This threshold comes from standard
                housing affordability guidelines used by HUD and most financial planners.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                The flag is <em>informational, not disqualifying</em>. A city can still match your
                lifestyle priorities even if housing is tight — you may have other income sources,
                low debt, or prioritize lifestyle over savings rate.
              </p>
            </section>

            <section className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
              <h2 className="font-bold text-amber-900 tracking-tight mb-2">Disclaimer</h2>
              <p className="text-sm text-amber-800 leading-relaxed">
                Scores represent directional lifestyle guidance. Not authoritative financial, legal,
                or real estate advice. Verify all data independently before making relocation decisions.
                Market data, school ratings, and cost estimates are updated periodically but may not
                reflect current conditions. Data last updated <strong>05/2026</strong>.
              </p>
            </section>

          </div>

          <div className="text-center mt-10">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 bg-accent text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-[#154d8a] transition-colors"
              style={{ boxShadow: '0 2px 10px rgba(26,95,168,0.28)' }}
            >
              Find My Texas City →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
