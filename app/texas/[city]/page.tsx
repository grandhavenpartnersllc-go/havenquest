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

// city.name is "City" for standalone cities, or "City: Subarea" for neighborhoods
// (per the Austin dedup/labeling fix) — reorder into "Moving to City, TX[: Subarea]"
function movingToLabel(name: string): string {
  const sep = name.indexOf(': ')
  if (sep === -1) return `Moving to ${name}, TX`
  return `Moving to ${name.slice(0, sep)}, TX: ${name.slice(sep + 2)}`
}

export async function generateStaticParams() {
  return getAllCities().map(city => ({ city: city.id }))
}

export async function generateMetadata(
  props: { params: Promise<{ city: string }> }
): Promise<Metadata> {
  const { city: citySlug } = await props.params
  const city = getCityBySlug(citySlug)
  if (!city) return { title: 'City Not Found | HavenQuest' }
  return {
    title: `${movingToLabel(city.name)} — Relocation Guide | HavenQuest`,
    description: `Everything you need to know about moving to ${city.name}, TX — cost of living, best neighborhoods, school districts, housing market, and top realtors.`,
    openGraph: {
      title: `${movingToLabel(city.name)} | HavenQuest`,
      description: `Cost of living, schools, and housing data for ${city.name}, TX.`,
      url: `https://havenquest.co/texas/${citySlug}`,
      siteName: 'HavenQuest',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${movingToLabel(city.name)} | HavenQuest`,
      description: `Texas relocation guide for ${city.name}.`,
    },
  }
}

export default async function CityPage(
  props: { params: Promise<{ city: string }> }
) {
  const { city: citySlug } = await props.params
  const city = getCityBySlug(citySlug)
  if (!city) notFound()

  const affordabilityScore = city.scores.affordability * 10

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        {/* Dark banner */}
        <div className="bg-[#08101C] border-b border-white/8 px-4 py-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-5">
              <Link href="/" className="text-blue-400/50 hover:text-blue-400/70 transition-colors">HavenQuest</Link>
              <span className="text-white/20">·</span>
              <Link href="/explore" className="text-blue-400/50 hover:text-blue-400/70 transition-colors">Texas</Link>
              <span className="text-white/20">·</span>
              <span className="text-white/40">{city.name}</span>
            </div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  {movingToLabel(city.name)}
                </h1>
                <p className="text-white/40 text-sm mt-1.5">{city.county} County · {city.character ?? TIER_LABELS[city.tier]}</p>
              </div>
              <TEARatingBadge rating={city.school.teaRating} size="lg" />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <MarketBadge condition={city.market.marketCondition} />
              <span className="bg-white/8 text-white/60 text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10">
                Affordability {affordabilityScore}/100
              </span>
            </div>
            <p className="text-white/45 text-sm leading-relaxed mt-4 max-w-xl">{city.description}</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <article
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-5"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.07)' }}
          >
            <div className="p-6 space-y-8">
              <div>
                <h2 className="font-bold text-gray-900 tracking-tight mb-1">
                  Cost of living in {city.name}, Texas
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  Key housing costs for families moving to {city.name} from out of state.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Avg rent 1BR', value: `${formatCurrency(city.housing.avgRent1BR)}/mo` },
                    { label: 'Avg rent 2BR', value: `${formatCurrency(city.housing.avgRent2BR)}/mo` },
                    { label: 'Median home price', value: formatCurrency(city.housing.medianHomePrice) },
                    { label: 'Starter home', value: formatCurrency(city.housing.starterHomePrice) },
                    { label: 'Property tax rate', value: formatPercentPlain(city.housing.propertyTaxRate * 100, 2) },
                    { label: 'Price per sq ft', value: formatCurrency(city.housing.pricePerSqFt) },
                  ].map(item => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                      <p className="font-bold text-gray-900 tabular-nums text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-gray-100" />

              <div>
                <h2 className="font-bold text-gray-900 tracking-tight mb-4">
                  Best neighborhoods in {city.name} — lifestyle scores
                </h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {LIFESTYLE_CATEGORIES.map(cat => (
                    <ScoreBar key={cat.key} label={cat.label} icon={cat.key} score={city.scores[cat.key]} />
                  ))}
                </div>
              </div>

              <hr className="border-gray-100" />

              <StrengthWeaknessGrid city={city} />

              <hr className="border-gray-100" />

              {/* Dark CTA block */}
              <div className="bg-[#08101C] rounded-2xl p-6 text-center">
                <h3 className="font-bold text-white tracking-tight mb-1">
                  Does {city.name} fit your income and lifestyle?
                </h3>
                <p className="text-white/45 text-sm mb-5">
                  Get a personalized affordability breakdown and matched realtors — free.
                </p>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 bg-white text-gray-950 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
                  style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 4px 14px rgba(0,0,0,0.35)' }}
                >
                  Start My Texas Relocation Report →
                </Link>
              </div>
            </div>
          </article>

          <p className="text-xs text-gray-400 text-center">
            Data last updated 05/2026 ·{' '}
            <Link href="/methodology" className="text-accent font-semibold hover:text-[#154d8a] transition-colors">
              How HavenQuest scores cities
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
