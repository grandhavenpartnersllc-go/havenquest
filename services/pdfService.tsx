import React from 'react'
import * as ReactPDF from '@react-pdf/renderer'
import { CityMatch, LifestyleScores, UserProfile } from '../types'
import { getMonthlyPropertyTax, getTotalMonthlyEstimate, getMonthlyIncomeRemaining } from './affordabilityService'

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
  page: { backgroundColor: WHITE, fontFamily: 'Helvetica', paddingBottom: 56 },

  // Header
  header: { backgroundColor: DARK, paddingHorizontal: 40, paddingTop: 30, paddingBottom: 26 },
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
            const tax        = getMonthlyPropertyTax(city, profile.housingPreference)
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
                <Text style={s.sectionLabel}>AFFORDABILITY</Text>
                <View style={s.table} wrap={false}>
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

                {/* ── 2. Lifestyle scores ──────────────────────── */}
                <Text style={s.sectionLabel}>LIFESTYLE SCORES</Text>
                <View style={s.twoCol} wrap={false}>
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

                {/* ── 3. Strengths & Weaknesses ────────────────── */}
                <Text style={s.sectionLabel}>STRENGTHS & WEAKNESSES</Text>
                <View style={s.twoCol} wrap={false}>
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

                {/* ── 4. Price Intelligence ────────────────────── */}
                <Text style={s.sectionLabel}>PRICE INTELLIGENCE</Text>
                <View style={s.table} wrap={false}>
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

                {/* ── 5. Market Snapshot ───────────────────────── */}
                <Text style={s.sectionLabel}>MARKET SNAPSHOT</Text>
                <View style={s.table} wrap={false}>
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

                {/* ── 6. School District ───────────────────────── */}
                <Text style={s.sectionLabel}>SCHOOL DISTRICT</Text>
                <View style={s.schoolBlock} wrap={false}>
                  <View style={[s.schoolBadge, { backgroundColor: gradeColor(city.school.teaRating) }]}>
                    <Text style={s.schoolGrade}>{city.school.teaRating}</Text>
                  </View>
                  <View style={s.schoolInfo}>
                    <Text style={s.schoolName}>{city.school.primaryISD}  ·  TEA Rating: {city.school.teaRating}</Text>
                    <Text style={s.schoolDesc}>{schoolDescription(city.school.teaRating)}</Text>
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
