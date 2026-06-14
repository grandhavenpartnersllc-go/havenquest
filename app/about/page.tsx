import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'

export const metadata: Metadata = {
  title: 'About HavenQuest — Guided Texas Relocation',
  description: 'HavenQuest is a Texas transition management company. We guide families from uncertainty about where to live through a successful relocation and integration into their new community.',
  openGraph: {
    title: 'About HavenQuest — Guided Texas Relocation',
    description: 'HavenQuest guides families from uncertainty about where to live through a successful relocation and integration into their new Texas community.',
  },
  twitter: {
    title: 'About HavenQuest — Guided Texas Relocation',
    description: 'HavenQuest guides families from uncertainty about where to live through a successful Texas relocation.',
  },
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
              Texas Transition Management
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
                  HavenQuest is a Texas transition management company. We help people who are moving to Texas — or seriously considering it — find where they actually belong and guide them all the way there.
                </p>
                <p>
                  More than 500,000 people move to Texas every year. Most of them guess. They browse Reddit threads, watch YouTube videos from realtors with an agenda, and ask a friend who moved there three years ago. Then they guess.
                </p>
                <p>
                  HavenQuest does something different. We combine real data intelligence with dedicated human guidance — because finding the right community is only half the job. Getting there confidently, with a real plan and a real team, is the other half.
                </p>
              </div>
            </section>

            {/* How it works */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6"
                     style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">How it works</h2>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p>
                  Clients answer four questions — income, household, financial picture, and lifestyle priorities. HavenQuest matches them to Texas communities across 101 cities in 4 metros, scored across 13 lifestyle categories. Results include full Community Profiles, affordability breakdowns, school data, and market conditions.
                </p>
                <p>
                  From there, clients enter the HavenQuest Navigator — a private portal that guides them through a 10-step journey from first results to closing day. Each step prepares them for the next one. A dedicated Market Director steps in to build their relocation plan, assemble their team, and guide them through every milestone. By the time a client is ready to search for a home, they know their community, their budget, their priorities, and their plan — and they have the right people around them to execute it.
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

            {/* Our Select Agents */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6"
                     style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Our Select Agents</h2>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p>
                  Every agent in the HavenQuest network is a HavenQuest Select Agent — licensed in Texas, vetted against our production, rating, and experience standards, and specialized in your target communities.
                </p>
                <p>
                  When you reach the agent introduction stage, your Market Director presents three Select Agent profiles — real names, real photos, real track records — each matched specifically to your submarket and your needs. You review their experience and their approach, then you choose the one who feels right. Only then does HavenQuest make the introduction.
                </p>
                <p>
                  No agent pays to rank higher. No city pays to appear in results. Your selection is based entirely on fit.
                </p>
                <p>
                  <Link href="/for-realtors" className="text-blue-600 hover:underline font-medium">
                    Learn about joining our network →
                  </Link>
                </p>
              </div>
            </section>

            {/* Contact and links */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6"
                     style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Contact &amp; resources</h2>
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
                        Data Sources &amp; Methodology
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
