import React from 'react'
import * as ReactPDF from '@react-pdf/renderer'
import { CityMatch, LifestyleScores, UserProfile } from '../types'
import { getMonthlyPropertyTax, getTotalMonthlyEstimate, getMonthlyIncomeRemaining } from './affordabilityService'
import { DNA_CATEGORIES } from '../utils/constants'

const { Document, Page, View, Text, StyleSheet } = ReactPDF

const DARK = '#16120D'
const WARM = '#1C1814'
const GOLD = '#B8912A'
const CREAM = '#F0EDE6'
const MUTED = '#9A8E82'
const CARD = '#F4F1EC'
const WHITE = '#FFFFFF'
const DIVIDER = '#DDD8D0'

const s = StyleSheet.create({
  page: { backgroundColor: WHITE, fontFamily: 'Helvetica', paddingBottom: 56, paddingTop: 20 },

  // Header
  header: { backgroundColor: DARK, paddingHorizontal: 40, paddingTop: 10, paddingBottom: 26 },
  logoLine: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 6 },
  logoBlack: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: WHITE },
  logoGold: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: GOLD },
  headerSub: { fontSize: 9, color: CREAM, opacity: 0.6, marginBottom: 4 },
  headerMeta: { fontSize: 9, color: GOLD },

  body: { paddingHorizontal: 40, paddingTop: 26 },

  // City separator
  cityDivider: { height: 2, backgroundColor: DARK, marginBottom: 24, marginTop: 14 },

  // Section label
  sectionLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: GOLD,
    letterSpacing: 1,
    marginBottom: 5,
    marginTop: 13,
  },

  // City header
  cityTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  badge: { backgroundColor: GOLD, borderRadius: 3, paddingHorizontal: 6, paddingVertical: 2, marginRight: 8 },
  badgeText: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: DARK, letterSpacing: 0.6 },
  cityName: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: WARM },
  cityMeta: { fontSize: 8, color: MUTED, marginBottom: 8, letterSpacing: 0.2 },
  description: { fontSize: 8.5, color: '#4A3F35', lineHeight: 1.65 },

  // Table base
  table: { backgroundColor: CARD, borderRadius: 4, overflow: 'hidden' },
  tr: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
  },
  trLast: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 5 },
  trTotal: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 7, backgroundColor: WARM },
  trGreen: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
    backgroundColor: '#EEF6F2',
  },
  trGreenLast: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 5, backgroundColor: '#EEF6F2' },
  tdLabel: { flex: 1, fontSize: 8, color: MUTED },
  tdVal: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: WARM },
  tdLabelTotal: { flex: 1, fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: CREAM },
  tdValTotal: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: GOLD },

  // Score grid (two columns)
  twoCol: { flexDirection: 'row' },
  scoreColL: { flex: 1, marginRight: 8, backgroundColor: CARD, borderRadius: 4, overflow: 'hidden' },
  scoreColR: { flex: 1, backgroundColor: CARD, borderRadius: 4, overflow: 'hidden' },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
  },
  scoreRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  scoreLabel: { fontSize: 8, color: '#4A3F35' },
  scoreNum: { fontSize: 9, fontFamily: 'Helvetica-Bold' },

  // Strengths & Weaknesses
  swColL: { flex: 1, marginRight: 8, backgroundColor: CARD, borderRadius: 4, padding: 10 },
  swColR: { flex: 1, backgroundColor: CARD, borderRadius: 4, padding: 10 },
  swHeader: { fontSize: 7, fontFamily: 'Helvetica-Bold', letterSpacing: 0.8, marginBottom: 6 },
  swItem: { flexDirection: 'row', marginBottom: 4 },
  swBullet: { fontSize: 8, width: 10, marginTop: 0.5 },
  swText: { fontSize: 8, lineHeight: 1.5, flex: 1, color: '#3A3530' },

  // School block
  schoolBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: CARD,
    borderRadius: 4,
    padding: 12,
  },
  schoolBadge: {
    borderRadius: 4,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  schoolGrade: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: WHITE },
  schoolInfo: { flex: 1 },
  schoolName: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: WARM, marginBottom: 3 },
  schoolDesc: { fontSize: 8, color: MUTED, lineHeight: 1.5 },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: DIVIDER,
    paddingTop: 8,
  },
  footerText: { fontSize: 7.5, color: MUTED },

  // Compare document
  cmpIntroRow: { flexDirection: 'row', marginBottom: 20 },
  cmpCityBlockA: { flex: 1, paddingRight: 14, borderRightWidth: 1, borderRightColor: DIVIDER },
  cmpCityBlockB: { flex: 1, paddingLeft: 14 },
  cmpCityName: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: WARM },
  cmpCityCounty: { fontSize: 7.5, color: MUTED, marginTop: 1 },
  cmpMatchBadge: { backgroundColor: CARD, borderRadius: 3, paddingHorizontal: 6, paddingVertical: 2, marginTop: 5, alignSelf: 'flex-start' },
  cmpMatchText: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: WARM },
  cmpTr: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: DIVIDER },
  cmpTrLast: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 5 },
  cmpTdLabel: { flex: 1, fontSize: 8, color: MUTED },
  cmpTdVal: { width: 88, fontSize: 8, fontFamily: 'Helvetica-Bold', color: WARM, textAlign: 'right' },
  cmpTdDim: { width: 88, fontSize: 8, fontFamily: 'Helvetica', color: MUTED, textAlign: 'right' },
  cmpSummaryBox: { backgroundColor: DARK, borderRadius: 5, padding: 12, marginTop: 14 },
  cmpSummaryLabel: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: GOLD, letterSpacing: 1, marginBottom: 4 },
  cmpSummaryText: { fontSize: 8.5, color: CREAM, lineHeight: 1.65 },
})

// ─── Helpers ────────────────────────────────────────────────────────────────

function scoreColor(n: number): string {
  if (n >= 8) return '#2D7A4F'
  if (n >= 5) return '#B8912A'
  return '#DC2626'
}

function gradeColor(g: string): string {
  if (g === 'A') return '#2D7A4F'
  if (g === 'B') return '#3B82F6'
  if (g === 'C') return '#D97706'
  if (g === 'D') return '#EA580C'
  return '#DC2626'
}

function schoolDescription(g: string): string {
  switch (g) {
    case 'A': return 'Exemplary performance — top academic outcomes across the district.'
    case 'B': return 'Recognized performance — strong schools with above-average outcomes.'
    case 'C': return 'Acceptable performance — meets minimum standards; campus quality varies.'
    case 'D': return 'Improvement required — below-standard outcomes at multiple campuses.'
    default:  return 'Failing status — significant improvement needed across the district.'
  }
}

function marketDescription(condition: string): string {
  switch (condition) {
    case 'Sellers Market': return 'High demand, low inventory — prices and competition are elevated.'
    case 'Buyers Market':  return 'More supply than demand — buyers have negotiating leverage.'
    default:               return 'Supply and demand are balanced — fair conditions for buyers and sellers.'
  }
}

function marketColor(condition: string): string {
  if (condition === 'Sellers Market') return '#EA580C'
  if (condition === 'Buyers Market')  return '#2D7A4F'
  return '#D97706'
}

function rankLabel(i: number): string {
  return i === 0 ? 'TOP PICK' : i === 1 ? 'RUNNER-UP' : 'STRONG ALT'
}

function money(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

const SCORE_LABELS: [keyof LifestyleScores, string][] = [
  ['affordability', 'Affordability'],
  ['schools', 'Schools'],
  ['safety', 'Safety'],
  ['walkability', 'Walkability'],
  ['transit', 'Transit'],
  ['nightlife', 'Nightlife'],
  ['outdoors', 'Outdoors'],
  ['familyFriendly', 'Family Friendly'],
  ['remoteWork', 'Remote Work'],
  ['lowTaxes', 'Low Taxes'],
  ['weather', 'Weather'],
  ['traffic', 'Traffic'],
]

// ─── Document ────────────────────────────────────────────────────────────────

interface Props {
  firstName: string
  matches: CityMatch[]
  profile: UserProfile
  generatedDate: string
}

function ReportDocument({ firstName, matches, profile, generatedDate }: Props) {
  return (
    <Document title={`HavenQuest Report — ${firstName}`} author="HavenQuest">
      <Page size="A4" style={s.page}>

        {/* ── Page header ───────────────────────────────────────── */}
        <View style={s.header}>
          <View style={s.logoLine}>
            <Text style={s.logoBlack}>Haven</Text>
            <Text style={s.logoGold}>Quest</Text>
          </View>
          <Text style={s.headerSub}>Texas Relocation Intelligence Report</Text>
          <Text style={s.headerMeta}>Prepared for {firstName}  ·  {generatedDate}</Text>
        </View>

        {/* ── City sections ─────────────────────────────────────── */}
        <View style={s.body}>
          {matches.map((match, i) => {
            const city = match.location
            const tax        = getMonthlyPropertyTax(city)
            const total      = getTotalMonthlyEstimate(city, profile)
            const remaining  = getMonthlyIncomeRemaining(city, profile)
            const monthlyInc = Math.round(profile.annualIncome / 12)
            const leftScores  = SCORE_LABELS.slice(0, 6)
            const rightScores = SCORE_LABELS.slice(6)

            return (
              <View key={city.id}>

                {i > 0 && <View style={s.cityDivider} />}

                {/* City name + description */}
                <View wrap={false}>
                  <View style={s.cityTopRow}>
                    <View style={s.badge}><Text style={s.badgeText}>{rankLabel(i)}</Text></View>
                    <Text style={s.cityName}>{city.name}, TX</Text>
                  </View>
                  <Text style={s.cityMeta}>{city.county} County  ·  Match Score: {match.matchScore}%</Text>
                  <Text style={s.description}>{city.description}</Text>
                </View>

                {/* ── 1. Affordability ─────────────────────────── */}
                <View wrap={false}>
                <Text style={s.sectionLabel}>AFFORDABILITY</Text>
                <View style={s.table}>
                  <View style={s.tr}>
                    <Text style={s.tdLabel}>Est. Monthly Housing</Text>
                    <Text style={s.tdVal}>{money(match.estimatedMonthlyHousing)}/mo</Text>
                  </View>
                  <View style={s.tr}>
                    <Text style={s.tdLabel}>Monthly Groceries</Text>
                    <Text style={s.tdVal}>{money(city.housing.monthlyGroceries)}/mo</Text>
                  </View>
                  <View style={s.tr}>
                    <Text style={s.tdLabel}>Monthly Transportation</Text>
                    <Text style={s.tdVal}>{money(city.housing.monthlyTransportation)}/mo</Text>
                  </View>
                  <View style={s.tr}>
                    <Text style={s.tdLabel}>Utilities</Text>
                    <Text style={s.tdVal}>{money(city.housing.monthlyUtilities)}/mo</Text>
                  </View>
                  <View style={s.tr}>
                    <Text style={s.tdLabel}>Property Tax (est.)</Text>
                    <Text style={s.tdVal}>{money(tax)}/mo</Text>
                  </View>
                  <View style={s.trTotal}>
                    <Text style={s.tdLabelTotal}>Total All-In (est.)</Text>
                    <Text style={s.tdValTotal}>{money(total)}/mo</Text>
                  </View>
                  <View style={s.trGreen}>
                    <Text style={[s.tdLabel, { color: '#2D6A50' }]}>Monthly Income</Text>
                    <Text style={[s.tdVal, { color: '#2D6A50' }]}>{money(monthlyInc)}/mo</Text>
                  </View>
                  <View style={s.trGreenLast}>
                    <Text style={[s.tdLabel, { color: remaining >= 0 ? '#2D6A50' : '#DC2626' }]}>Income Remaining</Text>
                    <Text style={[s.tdVal, { color: remaining >= 0 ? '#2D6A50' : '#DC2626' }]}>{money(remaining)}/mo</Text>
                  </View>
                </View>
                </View>

                {/* ── 2. Lifestyle scores ──────────────────────── */}
                <View wrap={false}>
                <Text style={s.sectionLabel}>LIFESTYLE SCORES</Text>
                <View style={s.twoCol}>
                  <View style={s.scoreColL}>
                    {leftScores.map(([key, label], idx) => (
                      <View key={key} style={idx === leftScores.length - 1 ? s.scoreRowLast : s.scoreRow}>
                        <Text style={s.scoreLabel}>{label}</Text>
                        <Text style={[s.scoreNum, { color: scoreColor(city.scores[key]) }]}>{city.scores[key]}/10</Text>
                      </View>
                    ))}
                  </View>
                  <View style={s.scoreColR}>
                    {rightScores.map(([key, label], idx) => (
                      <View key={key} style={idx === rightScores.length - 1 ? s.scoreRowLast : s.scoreRow}>
                        <Text style={s.scoreLabel}>{label}</Text>
                        <Text style={[s.scoreNum, { color: scoreColor(city.scores[key]) }]}>{city.scores[key]}/10</Text>
                      </View>
                    ))}
                  </View>
                </View>
                </View>

                {/* ── 3. Strengths & Weaknesses ────────────────── */}
                <View wrap={false}>
                <Text style={s.sectionLabel}>STRENGTHS & WEAKNESSES</Text>
                <View style={s.twoCol}>
                  <View style={s.swColL}>
                    <Text style={[s.swHeader, { color: '#2D7A4F' }]}>STRENGTHS</Text>
                    {city.strengths.map((str, idx) => (
                      <View key={idx} style={s.swItem}>
                        <Text style={[s.swBullet, { color: '#2D7A4F' }]}>+</Text>
                        <Text style={s.swText}>{str}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={s.swColR}>
                    <Text style={[s.swHeader, { color: '#DC2626' }]}>WEAKNESSES</Text>
                    {city.weaknesses.map((wk, idx) => (
                      <View key={idx} style={s.swItem}>
                        <Text style={[s.swBullet, { color: '#DC2626' }]}>-</Text>
                        <Text style={s.swText}>{wk}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                </View>

                {/* ── 4. Price Intelligence ────────────────────── */}
                <View wrap={false}>
                <Text style={s.sectionLabel}>PRICE INTELLIGENCE</Text>
                <View style={s.table}>
                  <View style={s.tr}>
                    <Text style={s.tdLabel}>Price per Sq Ft</Text>
                    <Text style={s.tdVal}>{money(city.housing.pricePerSqFt)}</Text>
                  </View>
                  <View style={s.tr}>
                    <Text style={s.tdLabel}>Starter Home Price</Text>
                    <Text style={s.tdVal}>{money(city.housing.starterHomePrice)}</Text>
                  </View>
                  <View style={s.tr}>
                    <Text style={s.tdLabel}>Median Home Price</Text>
                    <Text style={s.tdVal}>{money(city.housing.medianHomePrice)}</Text>
                  </View>
                  <View style={s.tr}>
                    <Text style={s.tdLabel}>Property Tax Rate</Text>
                    <Text style={s.tdVal}>{(city.housing.propertyTaxRate * 100).toFixed(2)}%</Text>
                  </View>
                  <View style={s.trLast}>
                    <Text style={s.tdLabel}>Est. Monthly Tax (median home)</Text>
                    <Text style={s.tdVal}>{money(tax)}/mo</Text>
                  </View>
                </View>
                </View>

                {/* ── 5. Market Snapshot ───────────────────────── */}
                <View wrap={false}>
                <Text style={s.sectionLabel}>MARKET SNAPSHOT</Text>
                <View style={s.table}>
                  <View style={s.tr}>
                    <Text style={s.tdLabel}>Median Sale Price</Text>
                    <Text style={s.tdVal}>{money(city.market.redfinMedianPrice)}</Text>
                  </View>
                  <View style={s.tr}>
                    <Text style={s.tdLabel}>Days on Market</Text>
                    <Text style={s.tdVal}>{city.market.daysOnMarket} days</Text>
                  </View>
                  <View style={s.tr}>
                    <Text style={s.tdLabel}>Sale to List Ratio</Text>
                    <Text style={s.tdVal}>{city.market.saleToListRatio}%</Text>
                  </View>
                  <View style={s.tr}>
                    <Text style={s.tdLabel}>Price Change YOY</Text>
                    <Text style={[s.tdVal, { color: city.market.priceYOY >= 0 ? '#2D7A4F' : '#DC2626' }]}>
                      {city.market.priceYOY >= 0 ? '+' : ''}{city.market.priceYOY}%
                    </Text>
                  </View>
                  <View style={s.tr}>
                    <Text style={s.tdLabel}>Market Type</Text>
                    <Text style={[s.tdVal, { color: marketColor(city.market.marketCondition) }]}>
                      {city.market.marketCondition}
                    </Text>
                  </View>
                  <View style={s.trLast}>
                    <Text style={[s.tdLabel, { color: '#4A3F35', flex: 1 }]}>
                      {marketDescription(city.market.marketCondition)}
                    </Text>
                  </View>
                </View>
                </View>

                {/* ── 6. School District ───────────────────────── */}
                <View wrap={false}>
                <Text style={s.sectionLabel}>SCHOOL DISTRICT</Text>
                <View style={s.schoolBlock}>
                  <View style={[s.schoolBadge, { backgroundColor: gradeColor(city.school.teaRating) }]}>
                    <Text style={s.schoolGrade}>{city.school.teaRating}</Text>
                  </View>
                  <View style={s.schoolInfo}>
                    <Text style={s.schoolName}>{city.school.primaryISD}  ·  TEA Rating: {city.school.teaRating}</Text>
                    <Text style={s.schoolDesc}>{schoolDescription(city.school.teaRating)}</Text>
                  </View>
                </View>
                </View>

              </View>
            )
          })}
        </View>

        {/* ── Footer (every page) ───────────────────────────────── */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Generated by HavenQuest · havenquest.co</Text>
          <Text style={s.footerText}>{generatedDate}</Text>
        </View>

      </Page>
    </Document>
  )
}

export function createReportDocument(props: Props): React.ReactElement<ReactPDF.DocumentProps> {
  return <ReportDocument {...props} />
}

// ─── Compare Document ────────────────────────────────────────────────────────

interface CompareProps {
  cityA: CityMatch
  cityB: CityMatch
  profile: UserProfile
  summary: string
  generatedDate: string
}

function CompareDocument({ cityA, cityB, profile, summary, generatedDate }: CompareProps) {
  const priorityCats = [
    ...profile.mustHaves.map(k => ({ key: k, tag: 'Must Have' })),
    ...profile.niceToHaves.map(k => ({ key: k, tag: 'Important' })),
  ]

  const domA = cityA.location.market.daysOnMarket
  const domB = cityB.location.market.daysOnMarket
  const domAWins = domA < domB
  const domBWins = domB < domA

  return (
    <Document
      title={`HavenQuest — ${cityA.location.name} vs ${cityB.location.name}`}
      author="HavenQuest"
    >
      <Page size="A4" style={s.page}>

        <View style={s.header}>
          <View style={s.logoLine}>
            <Text style={s.logoBlack}>Haven</Text>
            <Text style={s.logoGold}>Quest</Text>
          </View>
          <Text style={s.headerSub}>City Comparison</Text>
          <Text style={s.headerMeta}>
            {cityA.location.name} vs {cityB.location.name}  ·  {generatedDate}
          </Text>
        </View>

        <View style={s.body}>

          {/* City intro */}
          <View style={s.cmpIntroRow}>
            <View style={s.cmpCityBlockA}>
              <Text style={s.cmpCityName}>{cityA.location.name}</Text>
              <Text style={s.cmpCityCounty}>{cityA.location.county} County, TX</Text>
              <View style={s.cmpMatchBadge}>
                <Text style={s.cmpMatchText}>{cityA.matchScore}% match</Text>
              </View>
            </View>
            <View style={s.cmpCityBlockB}>
              <Text style={s.cmpCityName}>{cityB.location.name}</Text>
              <Text style={s.cmpCityCounty}>{cityB.location.county} County, TX</Text>
              <View style={s.cmpMatchBadge}>
                <Text style={s.cmpMatchText}>{cityB.matchScore}% match</Text>
              </View>
            </View>
          </View>

          {/* Affordability */}
          <Text style={s.sectionLabel}>AFFORDABILITY</Text>
          <View style={s.table}>
            {([
              { label: 'Est. monthly housing', a: cityA.estimatedMonthlyHousing, b: cityB.estimatedMonthlyHousing },
              { label: 'Est. monthly total', a: cityA.estimatedMonthlyTotal, b: cityB.estimatedMonthlyTotal },
            ] as const).map((row, idx, arr) => {
              const aWins = row.a < row.b
              const bWins = row.b < row.a
              const isLast = idx === arr.length - 1
              return (
                <View key={row.label} style={isLast ? s.cmpTrLast : s.cmpTr}>
                  <Text style={s.cmpTdLabel}>{row.label}</Text>
                  <Text style={aWins ? s.cmpTdVal : s.cmpTdDim}>{money(row.a)}</Text>
                  <Text style={bWins ? s.cmpTdVal : s.cmpTdDim}>{money(row.b)}</Text>
                </View>
              )
            })}
            <View style={s.cmpTrLast}>
              <Text style={s.cmpTdLabel}>Housing burden</Text>
              <Text style={[s.cmpTdVal, { color: cityA.affordabilityFlag ? '#EA580C' : '#2D7A4F' }]}>
                {cityA.affordabilityFlag ? '>40%' : 'OK'}
              </Text>
              <Text style={[s.cmpTdVal, { color: cityB.affordabilityFlag ? '#EA580C' : '#2D7A4F' }]}>
                {cityB.affordabilityFlag ? '>40%' : 'OK'}
              </Text>
            </View>
          </View>

          {/* Your priorities */}
          {priorityCats.length > 0 && (
            <View>
              <Text style={s.sectionLabel}>YOUR PRIORITIES</Text>
              <View style={s.table}>
                {priorityCats.map(({ key, tag }, idx) => {
                  const cat = DNA_CATEGORIES.find(c => c.key === key)
                  const scoreA = cityA.location.dna[key]
                  const scoreB = cityB.location.dna[key]
                  const aWins = scoreA > scoreB
                  const bWins = scoreB > scoreA
                  const isLast = idx === priorityCats.length - 1
                  return (
                    <View key={key} style={isLast ? s.cmpTrLast : s.cmpTr}>
                      <Text style={s.cmpTdLabel}>{cat?.label ?? key} ({tag})</Text>
                      <Text style={aWins ? [s.cmpTdVal, { color: scoreColor(scoreA) }] : s.cmpTdDim}>
                        {scoreA}/10
                      </Text>
                      <Text style={bWins ? [s.cmpTdVal, { color: scoreColor(scoreB) }] : s.cmpTdDim}>
                        {scoreB}/10
                      </Text>
                    </View>
                  )
                })}
              </View>
            </View>
          )}

          {/* Market & Schools */}
          <Text style={s.sectionLabel}>MARKET & SCHOOLS</Text>
          <View style={s.table}>
            <View style={s.cmpTr}>
              <Text style={s.cmpTdLabel}>Market</Text>
              <Text style={[s.cmpTdVal, { color: marketColor(cityA.location.market.marketCondition) }]}>
                {cityA.location.market.marketCondition.replace(' Market', '')}
              </Text>
              <Text style={[s.cmpTdVal, { color: marketColor(cityB.location.market.marketCondition) }]}>
                {cityB.location.market.marketCondition.replace(' Market', '')}
              </Text>
            </View>
            <View style={s.cmpTr}>
              <Text style={s.cmpTdLabel}>Days on market</Text>
              <Text style={domAWins ? s.cmpTdVal : s.cmpTdDim}>{domA}d</Text>
              <Text style={domBWins ? s.cmpTdVal : s.cmpTdDim}>{domB}d</Text>
            </View>
            <View style={s.cmpTr}>
              <Text style={s.cmpTdLabel}>School (TEA)</Text>
              <Text style={[s.cmpTdVal, { color: gradeColor(cityA.location.school.teaRating) }]}>
                {cityA.location.school.teaRating}
              </Text>
              <Text style={[s.cmpTdVal, { color: gradeColor(cityB.location.school.teaRating) }]}>
                {cityB.location.school.teaRating}
              </Text>
            </View>
            <View style={s.cmpTrLast}>
              <Text style={s.cmpTdLabel}>District</Text>
              <Text style={s.cmpTdDim}>{cityA.location.school.primaryISD}</Text>
              <Text style={s.cmpTdDim}>{cityB.location.school.primaryISD}</Text>
            </View>
          </View>

          {/* Bottom line */}
          {summary ? (
            <View style={s.cmpSummaryBox}>
              <Text style={s.cmpSummaryLabel}>BOTTOM LINE</Text>
              <Text style={s.cmpSummaryText}>{summary}</Text>
            </View>
          ) : null}

        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>Generated by HavenQuest · havenquest.co</Text>
          <Text style={s.footerText}>{generatedDate}</Text>
        </View>

      </Page>
    </Document>
  )
}

export function createCompareDocument(props: CompareProps): React.ReactElement<ReactPDF.DocumentProps> {
  return <CompareDocument {...props} />
}
