import Link from 'next/link'

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden pt-24 pb-24 px-4"
      style={{ backgroundColor: '#08101C' }}
    >
      {/* Radial blue glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 55% at 50% -5%, rgba(26,95,168,0.28) 0%, transparent 65%)',
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #F4F5F7, transparent)' }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 border border-white/10 bg-white/5 text-blue-300/80 text-xs font-semibold px-4 py-1.5 rounded-full mb-9 tracking-wide">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          4 metros · 101 cities · Updated June 2026
        </div>

        {/* Headline */}
        <h1
          className="font-bold tracking-tight mb-6 text-white leading-[1.1]"
          style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}
        >
          Move with confidence.
          <br />
          <span className="gradient-text-light">Arrive with peace of mind.</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-white/45 max-w-[580px] mx-auto leading-relaxed mb-11">
          HavenQuest guides your entire relocation journey — from discovering the right Texas community
          to settling into your new home — so you never have to navigate it alone.
        </p>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            href="/begin"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm tracking-tight transition-opacity hover:opacity-85"
            style={{ backgroundColor: '#60B8FF', color: '#08101C', boxShadow: '0 0 0 1px rgba(96,184,255,0.3), 0 8px 24px rgba(96,184,255,0.25)' }}
          >
            Begin My Journey →
          </Link>
        </div>
      </div>
    </section>
  )
}
