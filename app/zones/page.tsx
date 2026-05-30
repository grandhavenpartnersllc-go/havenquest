import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'

export const metadata: Metadata = {
  title: 'HavenQuest Market Zones | All 51 Texas Market Zones',
  description: 'Every HavenQuest market zone and the cities it covers. Find the zone that best represents your primary market when applying to join the HavenQuest Realtor Network.',
  openGraph: {
    title: 'HavenQuest Market Zones',
    description: 'All 51 Texas market zones and the cities each covers.',
    url: 'https://havenquest.co/zones',
    siteName: 'HavenQuest',
    type: 'website',
  },
}

const cardStyle = { boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }

interface Zone {
  name: string
  cities: string[] | null
  note?: string
}

interface Metro {
  label: string
  zones: Zone[]
}

const METROS: Metro[] = [
  {
    label: 'Austin Metro',
    zones: [
      { name: 'Urban Core Austin', cities: ['Austin'] },
      { name: 'Northwest Austin / Cedar Park / Leander', cities: ['Cedar Park', 'Leander', 'Liberty Hill'] },
      { name: 'Round Rock / Pflugerville / Hutto Corridor', cities: ['Round Rock', 'Pflugerville', 'Hutto', 'Taylor'] },
      { name: 'Georgetown / North Growth Corridor', cities: ['Georgetown'] },
      { name: 'East Austin', cities: ['Manor'] },
      { name: 'South Austin', cities: null },
      { name: 'Southwest Austin / Dripping Springs', cities: ['Dripping Springs'] },
      { name: 'Lake Travis / Hill Country Galleria', cities: ['Lakeway', 'Bee Cave'] },
      { name: 'Kyle / Buda / South Growth Corridor', cities: ['Kyle', 'Buda', 'San Marcos', 'Bastrop', 'Lockhart'] },
      { name: 'Westlake / West Austin', cities: null },
      { name: 'Austin Hill Country', cities: ['Wimberley', 'Marble Falls'] },
    ],
  },
  {
    label: 'Dallas-Fort Worth Metro',
    zones: [
      { name: 'Urban Core Dallas', cities: ['Dallas'] },
      { name: 'North Dallas / Platinum Corridor', cities: ['Plano', 'Richardson', 'Carrollton'] },
      { name: 'Collin County Growth Corridor', cities: ['Frisco', 'McKinney', 'Allen', 'Prosper', 'Celina', 'Anna'] },
      { name: 'Luxury North Suburbs', cities: ['Southlake', 'Keller', 'Colleyville', 'Trophy Club'] },
      { name: 'Mid-Cities / Airport Corridor', cities: ['Irving', 'Grapevine', 'Coppell', 'Arlington', 'Grand Prairie'] },
      { name: 'Fort Worth Urban Core', cities: ['Fort Worth'] },
      { name: 'Alliance / North Fort Worth', cities: null },
      { name: 'West Fort Worth & Parker County', cities: null },
      { name: 'South Fort Worth / Mansfield Corridor', cities: ['Mansfield', 'Burleson', 'Midlothian'] },
      { name: 'Denton County Growth Belt', cities: ['Flower Mound', 'Argyle', 'Denton', 'Lewisville', 'Little Elm'] },
      { name: 'East Dallas & Lake Communities', cities: ['Rockwall', 'Wylie', 'Forney', 'Heath', 'Garland', 'Mesquite'] },
      { name: 'Southern Sector / Best Southwest', cities: ['Cedar Hill', 'DeSoto', 'Waxahachie'] },
    ],
  },
  {
    label: 'Houston Metro',
    zones: [
      { name: 'Inner Loop / Urban Core Houston', cities: ['Houston'] },
      { name: 'The Heights / Inner Northwest', cities: null },
      { name: 'West University / Bellaire / Memorial', cities: null },
      { name: 'The Woodlands / North Houston', cities: ['The Woodlands'] },
      { name: 'Spring / Klein / Champions Corridor', cities: ['Spring', 'Tomball'] },
      { name: 'Katy / Fulshear / West Houston Energy Corridor', cities: ['Katy', 'Fulshear'] },
      { name: 'Sugar Land / Fort Bend County', cities: ['Sugar Land', 'Missouri City'] },
      { name: 'Pearland / South Houston', cities: ['Pearland', 'Manvel', 'Alvin'] },
      { name: 'Clear Lake / NASA / Southeast Houston', cities: ['League City', 'Friendswood', 'Dickinson', 'Webster'] },
      { name: 'Cypress / Northwest Houston', cities: ['Cypress'] },
      { name: 'Kingwood / Lake Houston Corridor', cities: ['Humble'] },
      { name: 'Baytown / East Houston Industrial Corridor', cities: ['Baytown', 'Pasadena', 'Deer Park'] },
      { name: 'Richmond / Rosenberg / Southwest Growth Corridor', cities: ['Richmond', 'Rosenberg'] },
      { name: 'Conroe / Montgomery County North Growth Belt', cities: ['Conroe'] },
      { name: 'Galveston Island / Gulf Coast', cities: ['Galveston', 'Texas City'] },
      { name: 'Brazosport / Gulf Coast South', cities: ['Lake Jackson'] },
    ],
  },
  {
    label: 'San Antonio Metro',
    zones: [
      { name: 'Urban Core / Central San Antonio', cities: ['San Antonio'] },
      { name: 'Alamo Heights / Terrell Hills / Olmos Park', cities: ['Alamo Heights'] },
      { name: 'North Central San Antonio', cities: null },
      { name: 'Stone Oak / Far North San Antonio', cities: null },
      { name: 'The Dominion / I-10 Luxury Corridor', cities: null },
      { name: 'Northwest San Antonio / Helotes', cities: ['Helotes'] },
      { name: 'Boerne / Fair Oaks Ranch / Hill Country Corridor', cities: ['Boerne', 'Fair Oaks Ranch'] },
      { name: 'New Braunfels / I-35 Northeast Growth Corridor', cities: ['New Braunfels', 'Seguin'] },
      { name: 'Schertz / Cibolo / Universal City', cities: ['Schertz', 'Cibolo', 'Universal City'] },
      { name: 'South San Antonio / Mission Corridor', cities: ['Pleasanton'] },
      { name: 'West San Antonio / Alamo Ranch', cities: ['Leon Valley'] },
      { name: 'East San Antonio / Converse Corridor', cities: ['Converse'] },
      { name: 'San Antonio Hill Country', cities: ['Kerrville', 'Fredericksburg', 'Canyon Lake'], note: 'Includes Hill Country cities with a San Antonio metro orientation' },
    ],
  },
  {
    label: 'Standalone Markets',
    zones: [
      { name: 'Waco', cities: ['Waco'] },
      { name: 'Corpus Christi', cities: ['Corpus Christi'] },
    ],
  },
]

export default function ZonesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="bg-[#08101C] border-b border-white/8 px-4 py-10">
          <div className="max-w-3xl mx-auto">
            <p className="text-blue-400/60 text-[11px] font-bold uppercase tracking-widest mb-3">Realtor Network</p>
            <h1 className="text-3xl font-bold text-white tracking-tight">HavenQuest Market Zones</h1>
            <p className="text-white/40 text-sm mt-2">Every zone and the cities it covers. Select the zone that best represents your primary market when applying to join the network.</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="space-y-8">

            {METROS.map(metro => (
              <section key={metro.label}>
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-blue-500/70 mb-3 px-1">
                  {metro.label}
                </h2>
                <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100" style={cardStyle}>
                  {metro.zones.map(zone => (
                    <div key={zone.name} className="px-5 py-4 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                      <div className="shrink-0 sm:w-72">
                        <p className="text-sm font-semibold text-gray-900">{zone.name}</p>
                        {zone.note && <p className="text-xs text-gray-400 mt-0.5">{zone.note}</p>}
                      </div>
                      {zone.cities ? (
                        <p className="text-sm text-gray-500">{zone.cities.join(', ')}</p>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Expanding soon</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}

          </div>

          <div className="text-center mt-10">
            <Link
              href="/for-realtors"
              className="inline-flex items-center gap-2 bg-accent text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-[#154d8a] transition-colors"
              style={{ boxShadow: '0 2px 10px rgba(26,95,168,0.28)' }}
            >
              Ready to apply? Join the HavenQuest Realtor Network →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
