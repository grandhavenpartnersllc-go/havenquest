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
          20 Texas cities analyzed · Updated 2025
        </div>

        {/* Headline */}
        <h1
          className="font-bold text-white leading-[1.03] tracking-tight mb-6"
          style={{ fontSize: 'clamp(42px, 7vw, 80px)' }}
        >
          Find where your
          <br />
          life fits in{' '}
          <span className="gradient-text-light">Texas</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-white/45 max-w-[520px] mx-auto leading-relaxed mb-11">
          Match your income and lifestyle to the right Texas city —
          then connect with the best realtors in your market.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
          <Link
            href="/explore"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-950 px-8 py-4 rounded-xl font-bold text-sm tracking-tight hover:bg-gray-100 transition-colors"
            style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.40)' }}
          >
            Find My City →
          </Link>
          <Link
            href="/metro"
            className="inline-flex items-center justify-center gap-2 bg-white/5 text-white/70 border border-white/10 px-8 py-4 rounded-xl font-semibold text-sm tracking-tight transition-all hover:bg-white/10 hover:text-white hover:border-white/20"
          >
            I know my metro
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-5 text-xs text-white/30 font-medium tracking-wide">
          <span>Free analysis</span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span>No account required</span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span>20 cities analyzed</span>
        </div>
      </div>
    </section>
  )
}
