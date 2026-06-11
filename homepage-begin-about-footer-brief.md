# Build Brief — Homepage Simplification, Begin Page, About Page & Footer
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — public-facing pages
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Six changes across existing and new files:

1. HeroSection.tsx — simplify to one CTA, update badge date, copy refinement
2. HowItWorks.tsx — update Step 3 copy, fix CTA link
3. app/page.tsx — remove TwoFrontDoors component
4. app/begin/page.tsx — CREATE new two-path choice page
5. app/about/page.tsx — CREATE About page with links to data disclosure and other pages
6. components/shared/Footer.tsx — add About and Data Disclosure links

---

## Change 1 — HeroSection.tsx

### Badge date
Find:
```
4 metros · 100+ cities · Updated May 2026
```
Replace with:
```
4 metros · 101 cities · Updated June 2026
```

### CTA buttons — replace both with one
Find the entire CTAs div:
```tsx
<div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
  <Link href="/explore-texas" ...>Explore Texas</Link>
  <Link href="/metro-start" ...>I Know My City →</Link>
</div>
```

Replace with:
```tsx
<div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
  <Link
    href="/begin"
    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm tracking-tight transition-opacity hover:opacity-85"
    style={{ backgroundColor: '#60B8FF', color: '#08101C', boxShadow: '0 0 0 1px rgba(96,184,255,0.3), 0 8px 24px rgba(96,184,255,0.25)' }}
  >
    Begin My Journey →
  </Link>
</div>
```

### Stats row — update third stat
Find:
```
Texas' Most Sought-After Destinations
```
Replace with:
```
Texas Relocation Intelligence
```

---

## Change 2 — HowItWorks.tsx

### Step 3 description — update realtor language
Find in the STEPS array, step number '03':
```
'Get your top matched cities with verified scores, honest tradeoffs, real cost breakdowns, and vetted realtors ready to help you take the next step.'
```
Replace with:
```
'Get your top matched cities with verified scores, honest tradeoffs, and real affordability breakdowns — then connect with a HavenQuest Select Agent, hand-selected for your zone and ready to help from day one.'
```

### CTA button link
Find:
```tsx
<Link href="/explore" ...>Start My Match →</Link>
```
Replace with:
```tsx
<Link href="/begin" ...>Begin My Journey →</Link>
```

---

## Change 3 — app/page.tsx

Remove TwoFrontDoors import and usage:

Remove:
```tsx
import TwoFrontDoors from '../components/landing/TwoFrontDoors'
```

Remove from JSX:
```tsx
<TwoFrontDoors />
```

---

## Change 4 — app/begin/page.tsx (CREATE)

Create this new file:

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import { ArrowRight, Map, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Begin Your Journey — HavenQuest',
  description: 'Tell us where you are in your Texas relocation journey and we\'ll point you in the right direction.',
}

export default function BeginPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">

        <div className="max-w-3xl mx-auto px-4 py-20">

          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3"
               style={{ color: '#B8912A', letterSpacing: '0.18em' }}>
              Your Navigator Journey
            </p>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
              Where are you starting from?
            </h1>
            <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
              Tell us where you are in your Texas journey and we&apos;ll take it from there.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            {/* Path 1 — Full quiz */}
            <div className="relative bg-white rounded-2xl p-8 border border-gray-100 flex flex-col"
                 style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                   style={{ backgroundColor: 'rgba(184,145,42,0.1)' }}>
                <Map size={22} strokeWidth={1.5} style={{ color: '#B8912A' }} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-3">
                I&apos;m not sure where in Texas yet
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">
                Perfect. Tell us about your income, household, and what matters most to you — and we&apos;ll match you to the Texas communities where your life actually fits. Takes about 5 minutes.
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-85 w-full"
                style={{ backgroundColor: '#B8912A', color: '#16120D' }}
              >
                Find My City <ArrowRight size={14} />
              </Link>
            </div>

            {/* Path 2 — Metro mode */}
            <div className="relative bg-white rounded-2xl p-8 border border-gray-100 flex flex-col"
                 style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)' }}>
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-5">
                <MapPin size={22} strokeWidth={1.5} className="text-gray-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-3">
                I already know my metro
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">
                Already set on Austin, DFW, Houston, or San Antonio? Dive straight into that metro and find the specific community within it that fits your life and budget.
              </p>
              <Link
                href="/metro"
                className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:border-gray-400 hover:text-gray-900 w-full"
              >
                Explore My Metro <ArrowRight size={14} />
              </Link>
            </div>

          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            Free to use · No account required to explore · Private portal included with your results
          </p>

        </div>
      </main>
      <Footer />
    </>
  )
}
```

---

## Change 5 — app/about/page.tsx (CREATE)

Create this new file:

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'

export const metadata: Metadata = {
  title: 'About HavenQuest — Texas Relocation Intelligence',
  description: 'HavenQuest is a Texas relocation intelligence platform that matches people to the right Texas communities based on their life, budget, and priorities.',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">

        <div className="bg-[#08101C] border-b border-white/8 px-4 py-10">
          <div className="max-w-3xl mx-auto">
            <p className="text-blue-400/60 text-[11px] font-bold uppercase tracking-widest mb-3">
              About
            </p>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              What is HavenQuest?
            </h1>
            <p className="text-white/40 text-sm mt-2">
              Texas Relocation Intelligence
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="space-y-5">

            {/* Who we are */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6"
                     style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Who we are</h2>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p>
                  HavenQuest is a Texas relocation intelligence platform. We help people who are moving to Texas — or considering it — figure out where they actually belong. Not just which city is popular. The city where their income, household, lifestyle, and priorities genuinely fit.
                </p>
                <p>
                  More than 500,000 people move to Texas every year. Most of them guess. They browse Reddit threads, watch YouTube videos from realtors with an agenda, and ask a friend who moved there three years ago. Then they guess.
                </p>
                <p>
                  HavenQuest does something different. We match people to Texas communities using real data — housing costs, school district ratings, safety scores, lifestyle indicators — weighted by what they actually care about. Then we connect them with a personal Market Director and a hand-selected local real estate agent who is ready to help from day one.
                </p>
              </div>
            </section>

            {/* How it works */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6"
                     style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">How it works</h2>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p>
                  Users answer four questions — income, household, financial picture, and lifestyle priorities. HavenQuest matches them to Texas communities across 101 cities in 4 metros, scored across 13 lifestyle categories. Results include full city reports, affordability breakdowns, school data, and market conditions.
                </p>
                <p>
                  From there, users enter the HavenQuest Navigator — a private portal that guides them through a 10-step journey from first results to closing day. Each step is designed to prepare them for the next one. By the time a buyer meets their real estate agent, they already know their city, their budget, their priorities, and their plan.
                </p>
                <p>
                  <Link href="/begin" className="text-blue-600 hover:underline font-medium">
                    Start your journey →
                  </Link>
                </p>
              </div>
            </section>

            {/* Our data */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6"
                     style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Our data</h2>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p>
                  HavenQuest uses publicly available data from verified primary sources — Redfin for market data, the Texas Education Agency for school ratings, county appraisal districts for property tax rates, FBI UCR for safety scores, and Walk Score for walkability and transit.
                </p>
                <p>
                  All scores are directional lifestyle guidance — not financial, legal, or real estate advice. We publish our full methodology and disclose every data source, update frequency, and known limitation.
                </p>
                <p>
                  <Link href="/data-disclosure" className="text-blue-600 hover:underline font-medium">
                    Read our full data disclosure →
                  </Link>
                </p>
              </div>
            </section>

            {/* Our standards */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6"
                     style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Our agent standards</h2>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p>
                  Every real estate agent in our network is a HavenQuest Select Agent — licensed in Texas, a member of the National Association of Realtors, and vetted against our production, rating, and experience standards. We don't list every agent. We list the right ones.
                </p>
                <p>
                  No agent pays to rank higher. No city pays to appear in results. Our matching algorithm is not influenced by commercial relationships.
                </p>
                <p>
                  <Link href="/for-realtors" className="text-blue-600 hover:underline font-medium">
                    Learn about joining our network →
                  </Link>
                </p>
              </div>
            </section>

            {/* The team */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6"
                     style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">The team</h2>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p>
                  HavenQuest is founded and led by Craig Asbach, based in Austin, Texas. HavenQuest operates under American Victory Alliance, LLC.
                </p>
                <p>
                  We are an early-stage platform currently in beta. We are building deliberately — prioritizing data integrity, honest guidance, and a product experience worth trusting over growth at any cost.
                </p>
              </div>
            </section>

            {/* Contact and links */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6"
                     style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Contact & resources</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Get in touch</p>
                  <p className="text-gray-500">
                    General inquiries:{' '}
                    <a href="mailto:admin@havenquest.co"
                       className="text-blue-600 hover:underline">
                      admin@havenquest.co
                    </a>
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Useful links</p>
                  <ul className="space-y-1.5 text-gray-500">
                    <li>
                      <Link href="/data-disclosure" className="text-blue-600 hover:underline">
                        Data Sources & Methodology
                      </Link>
                    </li>
                    <li>
                      <Link href="/for-realtors" className="text-blue-600 hover:underline">
                        For Real Estate Agents
                      </Link>
                    </li>
                    <li>
                      <Link href="/legal/privacy-policy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/legal/terms" className="text-blue-600 hover:underline">
                        Terms of Use
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
```

---

## Change 6 — components/shared/Footer.tsx

Find the Company section:
```tsx
<div>
  <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-4">Company</p>
  <ul className="space-y-2.5 text-sm">
    <li><Link href="/methodology" className="hover:text-white/80 transition-colors">Methodology</Link></li>
    <li><Link href="/for-realtors" className="hover:text-white/80 transition-colors">For Realtors</Link></li>
  </ul>
</div>
```

Replace with:
```tsx
<div>
  <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-4">Company</p>
  <ul className="space-y-2.5 text-sm">
    <li><Link href="/about" className="hover:text-white/80 transition-colors">About</Link></li>
    <li><Link href="/data-disclosure" className="hover:text-white/80 transition-colors">Data Disclosure</Link></li>
    <li><Link href="/methodology" className="hover:text-white/80 transition-colors">Methodology</Link></li>
    <li><Link href="/for-realtors" className="hover:text-white/80 transition-colors">For Realtors</Link></li>
  </ul>
</div>
```

Also update the Product section — replace Metro Mode with Begin My Journey:

Find:
```tsx
<li><Link href="/metro" className="hover:text-white/80 transition-colors">Metro Mode</Link></li>
```

Replace with:
```tsx
<li><Link href="/begin" className="hover:text-white/80 transition-colors">Begin My Journey</Link></li>
```

---

## Acceptance Criteria

- [ ] HeroSection shows one CTA only — "Begin My Journey →" linking to /begin
- [ ] Badge shows "101 cities · Updated June 2026"
- [ ] Stats row third item reads "Texas Relocation Intelligence"
- [ ] TwoFrontDoors removed from landing page
- [ ] HowItWorks Step 3 references Select Agents not realtors
- [ ] HowItWorks CTA links to /begin
- [ ] /begin page renders with two path cards — "I'm not sure where yet" and "I already know my metro"
- [ ] /begin Path 1 links to /explore
- [ ] /begin Path 2 links to /metro
- [ ] /about page renders with all 6 sections
- [ ] /about data disclosure link goes to /data-disclosure
- [ ] /about for realtors link goes to /for-realtors
- [ ] Footer Company section includes About and Data Disclosure links
- [ ] Footer Product section includes Begin My Journey link
- [ ] tsc --noEmit passes clean
- [ ] No other files changed

---

## Files Changing / Creating

| File | Action |
|---|---|
| `components/landing/HeroSection.tsx` | Modify |
| `components/landing/HowItWorks.tsx` | Modify |
| `app/page.tsx` | Modify — remove TwoFrontDoors |
| `app/begin/page.tsx` | CREATE |
| `app/about/page.tsx` | CREATE |
| `components/shared/Footer.tsx` | Modify |

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach.*
