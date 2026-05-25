import Link from 'next/link'
import { getFeaturedCities } from '../../services/locationService'
import MarketBadge from '../shared/MarketBadge'
import TEARatingBadge from '../shared/TEARatingBadge'

const HIGHLIGHTS: Record<string, string> = {
  'frisco-tx':       'Frisco ISD rated A — one of the top school districts in Texas',
  'cedar-park-tx':   'Austin metro living with top-rated Leander ISD schools and a strong sense of community',
  'the-woodlands-tx':'Premier master-planned community with exceptional trails, schools, and amenities',
  'new-braunfels-tx':'Guadalupe River lifestyle meets Hill Country scenery — one of Texas\' fastest-growing cities',
}

export default function FeaturedCities() {
  const cities = getFeaturedCities(4)

  return (
    <section className="py-16 px-4 bg-surface">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-[28px] font-bold text-gray-900 tracking-tight mb-2">Featured Texas cities</h2>
          <p className="text-gray-400 text-sm">A preview of what your matched report looks like</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cities.map((city) => (
            <Link
              key={city.id}
              href={`/texas/${city.id}`}
              className="card-city group bg-white rounded-2xl p-5 border border-gray-100 block"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900 tracking-tight text-[15px]">{city.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{city.county} Co.</p>
                </div>
                <TEARatingBadge rating={city.school.teaRating} size="sm" />
              </div>

              <MarketBadge condition={city.market.marketCondition} />

              <p className="text-xs text-gray-500 mt-3 leading-relaxed line-clamp-2">
                {HIGHLIGHTS[city.id] ?? city.strengths[0]}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-accent font-bold text-sm hover:text-[#154d8a] transition-colors"
          >
            See your personalized matches →
          </Link>
        </div>
      </div>
    </section>
  )
}
