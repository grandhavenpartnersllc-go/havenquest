import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'
import HeroSection from '../components/landing/HeroSection'
import HowItWorks from '../components/landing/HowItWorks'

export const metadata: Metadata = {
  title: 'HavenQuest — Find Where Your Life Fits in Texas',
  description: 'Match your income and lifestyle to the right Texas city or neighborhood. Free relocation intelligence platform — best cities to live in Texas, cost of living, school data, and top realtors.',
  openGraph: {
    title: 'HavenQuest — Find Where Your Life Fits in Texas',
    description: 'Moving to Texas? Find the city that fits your income, household, and lifestyle priorities — then connect with top realtors.',
    url: 'https://havenquest.co',
    siteName: 'HavenQuest',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HavenQuest — Texas Relocation Intelligence',
    description: 'Find where your income and lifestyle actually fit in Texas.',
  },
}

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    origin: 'Relocating from Chicago, IL',
    quote: "I had no idea where to even start with Texas. HavenQuest narrowed it down to three communities that actually fit our life. We're under contract in Round Rock and couldn't be happier.",
  },
  {
    name: 'David & Karen T.',
    origin: 'Relocating from Denver, CO',
    quote: "Our Market Director was with us every step of the way. From our first city match to closing day, we never felt lost or overwhelmed. This is how moving should work.",
  },
  {
    name: 'Marcus R.',
    origin: 'Relocating from Atlanta, GA',
    quote: "I was skeptical that an online platform could really understand what I was looking for. HavenQuest proved me wrong. Plano checked every box.",
  },
]

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">

        {/* Section 1 — Hero */}
        <HeroSection />

        {/* Section 2 — The Problem */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              HavenQuest is not just another relocation platform. It&apos;s a guided
              experience built around the reality of what moving actually involves.
            </p>
            <p className="text-gray-500 leading-relaxed mb-6">
              Relocating is one of the most stressful decisions a family makes.
              Not because finding a home is hard — but because there are a hundred
              other decisions happening at the same time, and most people are
              making them alone.
            </p>
            <p className="text-gray-500 leading-relaxed mb-6">
              Schools. Neighborhoods. Timelines. Realtors. Lenders. Movers.
              Community connections. All of it, all at once, with no one in
              your corner.
            </p>
            <p className="text-xl font-bold text-gray-900 tracking-tight">
              HavenQuest changes that.
            </p>
          </div>
        </section>

        {/* Section 2b — Split: Difference */}
        <section className="py-20 px-4" style={{ backgroundColor: '#FDFCFA' }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

              {/* Left — Text */}
              <div>
                <p
                  className="text-xs font-bold uppercase mb-4 tracking-widest"
                  style={{ color: '#B8912A', letterSpacing: '0.18em' }}
                >
                  The HavenQuest Difference
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
                  This isn&apos;t just data.
                  <br />
                  It&apos;s a guided experience.
                </h2>
                <div className="space-y-4 text-gray-500 leading-relaxed">
                  <p>
                    Most relocation platforms hand you a list of cities and leave
                    you to figure out the rest. HavenQuest is different.
                  </p>
                  <p>
                    From the moment you begin, you&apos;re building toward something
                    real — a community that fits your life, a home that fits your
                    budget, and a team that stays with you until you&apos;re settled in.
                  </p>
                  <p>
                    Your Market Director isn&apos;t a chatbot. They&apos;re a real person
                    who knows your destination market, has read your profile, and
                    is ready to walk beside you through every decision — from
                    neighborhood exploration to closing day.
                  </p>
                  <p className="font-semibold text-gray-700">
                    This is what peace of mind actually looks like.
                  </p>
                </div>
              </div>

              {/* Right — Image */}
              <div
                className="relative aspect-video rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)' }}
              >
                <Image
                  src="/images/relocation-couple.png"
                  alt="Couple relaxed and confident during their Texas relocation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

            </div>
          </div>
        </section>

        {/* Section 3 — How It Works */}
        <div id="how-it-works">
          <HowItWorks />
        </div>

        {/* Section 4 — The Differentiator */}
        <section
          className="py-24 px-4"
          style={{ backgroundColor: '#08101C' }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <p
              className="text-xl md:text-2xl mb-4"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Other platforms give you data.
            </p>
            <p
              className="font-bold tracking-tight leading-tight"
              style={{ fontSize: 'clamp(32px, 5vw, 60px)', color: '#FFFFFF' }}
            >
              HavenQuest gives you confidence.
            </p>
          </div>
        </section>

        {/* Section 5 — Social Proof */}
        <section className="py-20 px-4 bg-surface">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p
                className="text-xs font-bold uppercase mb-4"
                style={{ color: '#B8912A', letterSpacing: '0.18em' }}
              >
                Trusted by People Relocating to Texas
              </p>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Built for anyone ready to make Texas home.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="bg-white rounded-2xl p-8 flex flex-col relative"
                  style={{
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
                    border: '1px solid #F0EDE6',
                  }}
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4" aria-label="5 stars">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} style={{ color: '#B8912A', fontSize: '14px' }}>★</span>
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-5">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  {/* Name + origin */}
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.origin}</p>
                  </div>
                  {/* Sample review label */}
                  <span
                    className="absolute bottom-4 right-5 text-xs text-gray-400"
                    style={{ opacity: 0.4 }}
                  >
                    Sample review
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6 — Final CTA */}
        <section
          className="py-24 px-4"
          style={{ backgroundColor: '#16120D' }}
        >
          <div className="max-w-xl mx-auto text-center">
            <h2
              className="font-bold tracking-tight mb-4 text-white"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
            >
              Your next chapter starts here.
            </h2>
            <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Two paths. One destination. Begin when you&apos;re ready.
            </p>
            <p
              className="text-xs mb-6 mx-auto max-w-sm leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.25)' }}
            >
              No cost to you. HavenQuest is compensated through our Select Agent
              network — only when you close.
            </p>
            <Link
              href="/begin"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm tracking-tight transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#60B8FF', color: '#08101C', boxShadow: '0 0 0 1px rgba(96,184,255,0.3), 0 8px 24px rgba(96,184,255,0.25)' }}
            >
              Begin My Journey →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
