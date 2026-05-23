import Link from 'next/link'
import { ArrowRight, Map, MapPin } from 'lucide-react'

export default function TwoFrontDoors() {
  return (
    <section className="py-12 px-4 bg-surface">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-5">

          {/* Exploring Texas */}
          <div className="card-door-blue group relative bg-white rounded-2xl p-7 border border-gray-100/80 overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-transparent to-transparent pointer-events-none rounded-2xl" />
            <div className="relative flex flex-col flex-1">
              <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                <Map size={20} className="text-accent" strokeWidth={1.75} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Exploring Texas</h2>
              <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">
                Find the city that fits your life and budget across all of Texas.
                Perfect if you&apos;re open to any market.
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 bg-accent text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors hover:bg-[#154d8a] w-full justify-center"
                style={{ boxShadow: '0 2px 10px rgba(26,95,168,0.28)' }}
              >
                Find My City <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Metro Mode */}
          <div className="card-door group relative bg-white rounded-2xl p-7 border border-gray-100/80 overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/70 via-transparent to-transparent pointer-events-none rounded-2xl" />
            <div className="relative flex flex-col flex-1">
              <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center mb-5">
                <MapPin size={20} className="text-gray-500" strokeWidth={1.75} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Metro Mode</h2>
              <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">
                Already know your metro? Find the neighborhood that fits within
                Austin, Dallas, Houston, or San Antonio.
              </p>
              <Link
                href="/metro"
                className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:border-accent hover:text-accent hover:bg-blue-50/60 w-full justify-center"
              >
                Explore My Metro <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
