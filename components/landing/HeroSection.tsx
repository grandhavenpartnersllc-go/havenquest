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

      {/* Bottom fade into surface */}
      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #F4F5F7, transparent)' }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 border border-white/10 bg-white/5 text-blue-300/80 text-xs font-semibold px-4 py-1.5 rounded-full mb-9 tracking-wide">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          4 metros · 101 cities · Updated May 2026
        </div>

        {/* Headline */}
        <h1 className="font-bold leading-[1.05] tracking-tight mb-6">
          <span
            className="block text-white italic"
            style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontFamily: '"Times New Roman", Georgia, serif', fontWeight: 300 }}
          >
            So, you&apos;re
          </span>
          <span
            className="block gradient-text-light"
            style={{ fontSize: 'clamp(48px, 8.5vw, 96px)' }}
          >
            Choosin&apos; Texas.
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-white/45 max-w-[560px] mx-auto leading-relaxed mb-11">
          Let&apos;s find your perfect Texas homestead — matched to your life, your budget, and your priorities.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
          <Link
            href="/explore-texas"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm tracking-tight transition-opacity hover:opacity-85"
            style={{ backgroundColor: '#60B8FF', color: '#08101C', boxShadow: '0 0 0 1px rgba(96,184,255,0.3), 0 8px 24px rgba(96,184,255,0.25)' }}
          >
            Explore Texas
          </Link>
          <Link
            href="/metro-start"
            className="inline-flex items-center justify-center gap-2 bg-white/5 text-white/70 border border-white/10 px-8 py-4 rounded-xl font-semibold text-sm tracking-tight transition-all hover:bg-white/10 hover:text-white hover:border-white/20"
          >
            I Know My City →
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-5 text-xs text-white/30 font-medium tracking-wide">
          <span>Free Personalized Report</span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span>Private Portal Included</span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span>Texas&apos; Most Sought-After Destinations</span>
        </div>
      </div>
    </section>
  )
}
