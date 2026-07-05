import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '../../../components/shared/Header'
import Footer from '../../../components/shared/Footer'
import { getCityBySlug, getAllCities } from '../../../services/locationService'
import { LIFESTYLE_CATEGORIES, TIER_LABELS } from '../../../utils/constants'
import { formatCurrency, formatPercentPlain } from '../../../utils/formatting'
import MarketBadge from '../../../components/shared/MarketBadge'
import TEARatingBadge from '../../../components/shared/TEARatingBadge'
import ScoreBar from '../../../components/shared/ScoreBar'
import StrengthWeaknessGrid from '../../../components/results/StrengthWeaknessGrid'
import MarketSnapshot from '../../../components/results/MarketSnapshot'
import SchoolSnapshot from '../../../components/results/SchoolSnapshot'
import CityReportCTA from '../../../components/results/CityReportCTA'

export async function generateStaticParams() {
  return getAllCities().map(city => ({ citySlug: city.id }))
}

export async function generateMetadata(
  props: { params: Promise<{ citySlug: string }> }
): Promise<Metadata> {
  const { citySlug } = await props.params
  const city = getCityBySlug(citySlug)
  if (!city) return { title: 'City Not Found | HavenQuest' }
  return {
    title: `${city.name}, TX — Relocation Report | HavenQuest`,
    description: `Complete relocation data for ${city.name}, Texas — housing costs, school district, market conditions, lifestyle scores, and top realtors.`,
    openGraph: {
      title: `${city.name}, TX — HavenQuest Relocation Report`,
      description: `Scores, affordability, schools, and market data for ${city.name}, TX.`,
      url: `https://havenquest.co/report/${citySlug}`,
      siteName: 'HavenQuest',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${city.name}, TX — HavenQuest`,
      description: `Relocation intelligence for ${city.name}, Texas.`,
    },
  }
}

const statCells = (items: { label: string; value: string }[]) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
    {items.map(item => (
      <div key={item.label} className="bg-gray-50 rounded-xl p-3">
        <p className="text-xs text-gray-400 mb-1">{item.label}</p>
        <p className="font-bold text-gray-900 tabular-nums text-sm">{item.value}</p>
      </div>
    ))}
  </div>
)

export default async function CityReportPage(
  props: { params: Promise<{ citySlug: string }> }
) {
  const { citySlug } = await props.params
  const city = getCityBySlug(citySlug)
  if (!city) notFound()

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        {/* Dark banner */}
        <div className="bg-[#08101C] border-b border-white/8 px-4 py-10">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/"
              className="text-blue-400/50 text-[11px] font-bold uppercase tracking-widest hover:text-blue-400/70 transition-colors mb-5 inline-block"
            >
              ← HavenQuest
            </Link>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  {city.name}, {city.state}
                </h1>
                <p className="text-white/40 text-sm mt-1.5">{city.county} County · {city.character ?? TIER_LABELS[city.tier]}</p>
              </div>
              <TEARatingBadge rating={city.school.teaRating} size="lg" />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <MarketBadge condition={city.market.marketCondition} />
            </div>
            <p className="text-white/45 text-sm leading-relaxed mt-4 max-w-xl">{city.description}</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <article
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.07)' }}
          >
            <div className="p-6 space-y-8">
              <div>
                <h2 className="font-bold text-gray-900 tracking-tight mb-4">Housing costs</h2>
                {statCells([
                  { label: 'Avg rent 1BR', value: `${formatCurrency(city.housing.avgRent1BR)}/mo` },
                  { label: 'Avg rent 2BR', value: `${formatCurrency(city.housing.avgRent2BR)}/mo` },
                  { label: 'Avg rent 3BR', value: `${formatCurrency(city.housing.avgRent3BR)}/mo` },
                  { label: 'Starter home', value: formatCurrency(city.housing.starterHomePrice) },
                  { label: 'Median home', value: formatCurrency(city.housing.medianHomePrice) },
                  { label: 'Property tax', value: formatPercentPlain(city.housing.propertyTaxRate * 100, 2) },
                ])}
              </div>

              <hr className="border-gray-100" />

              <div>
                <h2 className="font-bold text-gray-900 tracking-tight mb-4">Lifestyle scores</h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {LIFESTYLE_CATEGORIES.map(cat => (
                    <ScoreBar key={cat.key} label={cat.label} icon={cat.key} score={city.scores[cat.key]} />
                  ))}
                </div>
              </div>

              <hr className="border-gray-100" />

              <StrengthWeaknessGrid city={city} />

              <hr className="border-gray-100" />

              <MarketSnapshot city={city} />

              <hr className="border-gray-100" />

              <SchoolSnapshot city={city} />

              <hr className="border-gray-100" />

              {/* CTA block */}
              <CityReportCTA />
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}
