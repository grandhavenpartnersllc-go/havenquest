import React from 'react'
import * as ReactPDF from '@react-pdf/renderer'
import { CityMatch, LifestyleScores, PersonalityProfile, UserProfile } from '../types'
import { getMonthlyPropertyTax, getTotalMonthlyEstimate, getMonthlyIncomeRemaining } from './affordabilityService'
import { DNA_CATEGORIES } from '../utils/constants'
import { getStateIncomeTaxRate } from '../utils/stateIncomeTax'
import { txColIndex, txSafety, txPropertyTax, txJobMarket, txClimateV2 } from '../utils/txComparisonStats'

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
  // Wider value column for the financial-picture section (Phase D) — dollar
  // ranges like "+$180–$260/mo" need more room than the 88px score/price columns.
  cmpTdValWide: { width: 140, fontSize: 8, fontFamily: 'Helvetica-Bold', color: WARM, textAlign: 'right' },
  cmpTdDimWide: { width: 140, fontSize: 8, fontFamily: 'Helvetica', color: MUTED, textAlign: 'right' },
  cmpSubLabel: { fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: MUTED, letterSpacing: 0.8, marginTop: 8, marginBottom: 2, marginLeft: 12 },
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

function moneyK(n: number): string {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return '$' + Math.round(n / 1_000) + 'K'
  return n ? money(n) : '$0'
}

// Mirrors MM3Discover.tsx's calcMonthly (standard fixed-rate amortization).
// Duplicated intentionally rather than imported — it's a small, pure formula
// and this keeps pdfService.tsx free of any import from a 'use client' UI
// component. Keep in sync if the amortization formula ever changes.
function calcMonthlyPayment(principal: number, annualRatePercent: number, termYears: number): number {
  if (principal <= 0) return 0
  const r = annualRatePercent / 100 / 12
  const n = termYears * 12
  if (r === 0) return Math.round(principal / n)
  return Math.round(principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
}

// Net-Inflow Cash Mirror (Phase D) — estimated state income tax "savings" vs
// the client's origin state, presented as a range rather than a precise
// figure. STATE_INCOME_TAX_RATE (utils/stateIncomeTax.ts) is a top-marginal/
// flat-rate simplification — actual liability depends on income level and
// filing status — so we present a defensible band (70%-100% of the naive
// marginal-rate calculation) instead of implying false precision, consistent
// with this app's existing range-based financial presentations elsewhere
// (the live interest-rate market band, quiz-bucket midpoints). Returns null
// when the origin state is unknown or itself has no income tax (nothing to
// compare).
function taxSavingsRange(annualIncome: number, originState: string | null): [number, number] | null {
  const rate = getStateIncomeTaxRate(originState)
  if (rate === null || rate <= 0) return null
  const highAnnual = rate * annualIncome
  const lowAnnual = highAnnual * 0.7
  return [Math.round(lowAnnual / 12), Math.round(highAnnual / 12)]
}

function taxSavingsLabel(annualIncome: number, originState: string | null): string {
  if (!originState) return 'Origin state not on file'
  const range = taxSavingsRange(annualIncome, originState)
  if (!range) return `No state income tax where you're moving from (${originState})`
  const [lo, hi] = range
  return `+${money(lo)}–${money(hi)}/mo vs ${originState}`
}

// Which index/indices among a row of per-city values is "winning" — lower-is-
// better for cost/time figures, higher-is-better for scores. A universal tie
// highlights nobody (mirrors CompareModal.tsx's on-screen bestIndices).
function pdfBestIndices(values: number[], lowerIsBetter: boolean): boolean[] {
  if (values.length === 0) return []
  const best = lowerIsBetter ? Math.min(...values) : Math.max(...values)
  const count = values.filter(v => v === best).length
  if (count === values.length) return values.map(() => false)
  return values.map(v => v === best)
}

const PERSONALITY_LABELS: [keyof PersonalityProfile, string][] = [
  ['growthProfile', 'Growth Profile (Established – Emerging)'],
  ['pace', 'Pace (Relaxed – Fast-Paced)'],
  ['culture', 'Culture (Private – Community-Oriented)'],
  ['environment', 'Environment (Urban – Rural)'],
  ['lifestyleOrientation', 'Lifestyle (Practical – Luxury)'],
]

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

// ─── Comparison Report Document (Phase D) ─────────────────────────────────────
// Supersedes the old, stripped-down CompareDocument/createCompareDocument
// (single-page, priority-only DNA subset, no financial picture, no personality
// traits). Array-driven over `cities` (2 today, N-ready) rather than fixed
// cityA/cityB props — matches CompareModal.tsx's restructuring. Column widths
// (cmpTdVal/cmpTdDim, 88/140px) are still tuned for exactly 2 columns, same
// caveat as the on-screen modal.

interface ComparisonReportProps {
  cities: CityMatch[]
  profile: UserProfile
  totalFunds: number
  interestRate: number
  loanTerm: 30 | 15
  originState: string | null
  originCity: string | null
  summary: string
  generatedDate: string
}

function ComparisonReportDocument({
  cities, profile, totalFunds, interestRate, loanTerm, originState, originCity, summary, generatedDate,
}: ComparisonReportProps) {
  const priorityCats = [
    ...profile.mustHaves.map(k => ({ key: k, tag: 'Must Have' })),
    ...profile.niceToHaves.map(k => ({ key: k, tag: 'Important' })),
  ]

  const cityNames = cities.map(c => c.location.name).join(' vs ')
  const budgetStr = totalFunds > 0 ? moneyK(totalFunds) : '—'
  const taxSavings = taxSavingsLabel(profile.annualIncome, originState)

  return (
    <Document title={`HavenQuest — ${cityNames}`} author="HavenQuest">
      <Page size="A4" style={s.page}>

        <View style={s.header}>
          <View style={s.logoLine}>
            <Text style={s.logoBlack}>Haven</Text>
            <Text style={s.logoGold}>Quest</Text>
          </View>
          <Text style={s.headerSub}>Comparison Report</Text>
          <Text style={s.headerMeta}>{cityNames}  ·  {generatedDate}</Text>
        </View>

        <View style={s.body}>

          {/* City intro */}
          <View style={s.cmpIntroRow} wrap={false}>
            {cities.map((city, i) => (
              <View key={city.location.id} style={i === cities.length - 1 ? s.cmpCityBlockB : s.cmpCityBlockA}>
                <Text style={s.cmpCityName}>{city.location.name}</Text>
                <Text style={s.cmpCityCounty}>{city.location.county} County, TX</Text>
                <View style={s.cmpMatchBadge}>
                  <Text style={s.cmpMatchText}>{city.matchScore}% match</Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── Your Financial Picture (incl. Net-Inflow Cash Mirror) ── */}
          <View wrap={false}>
            <Text style={s.sectionLabel}>YOUR FINANCIAL PICTURE</Text>
            <View style={s.table}>
              <View style={s.cmpTr}>
                <Text style={s.cmpTdLabel}>Est. budget (buying power)</Text>
                {cities.map(city => (
                  <Text key={city.location.id} style={s.cmpTdValWide}>{budgetStr}</Text>
                ))}
              </View>
              {(() => {
                const payments = cities.map(city => {
                  const balance = Math.max(0, city.location.housing.medianHomePrice - totalFunds)
                  return calcMonthlyPayment(balance, interestRate, loanTerm)
                })
                const wins = pdfBestIndices(payments, true)
                return (
                  <View style={s.cmpTrLast}>
                    <Text style={s.cmpTdLabel}>Est. monthly payment</Text>
                    {cities.map((city, i) => (
                      <Text key={city.location.id} style={wins[i] ? s.cmpTdValWide : s.cmpTdDimWide}>
                        {payments[i] > 0 ? `${money(payments[i])}/mo` : '—'}
                      </Text>
                    ))}
                  </View>
                )
              })()}
            </View>

            <Text style={s.cmpSubLabel}>NET-INFLOW CASH MIRROR</Text>
            <View style={s.table}>
              <View style={s.cmpTrLast}>
                <Text style={s.cmpTdLabel}>
                  Est. state tax savings{originCity ? ` vs ${originCity}` : ''}
                </Text>
                {cities.map(city => (
                  <Text key={city.location.id} style={s.cmpTdValWide}>{taxSavings}</Text>
                ))}
              </View>
            </View>
          </View>

          {/* ── Stats table — same field-mapping as the live "Texas vs. Your
              Origin" chart (components/portal/milemarkers/MM3Discover.tsx),
              via utils/txComparisonStats.ts ── */}
          <View wrap={false}>
            <Text style={s.sectionLabel}>COST OF LIVING &amp; STATS</Text>
            <View style={s.table}>
              {(() => {
                const rows: { label: string; values: string[] }[] = [
                  { label: 'COL Index', values: cities.map(c => String(txColIndex(c.location.metroUsed))) },
                  { label: 'Median Home', values: cities.map(c => moneyK(c.location.housing.medianHomePrice)) },
                  { label: 'Property Tax', values: cities.map(c => txPropertyTax(c.location.metroUsed)) },
                  { label: 'State Inc. Tax', values: cities.map(() => 'None (TX)') },
                  { label: 'Schools', values: cities.map(c => c.location.school?.teaRating ?? '—') },
                  { label: 'Crime/Safety', values: cities.map(c => txSafety(c.location.scores.safety)) },
                  { label: 'Job Market', values: cities.map(c => txJobMarket(c.location.metroUsed)) },
                  { label: 'Climate', values: cities.map(c => txClimateV2(c.location.metroUsed)) },
                ]
                return rows.map((row, idx) => (
                  <View key={row.label} style={idx === rows.length - 1 ? s.cmpTrLast : s.cmpTr}>
                    <Text style={s.cmpTdLabel}>{row.label}</Text>
                    {row.values.map((v, i) => (
                      <Text key={cities[i].location.id} style={s.cmpTdVal}>{v}</Text>
                    ))}
                  </View>
                ))
              })()}
            </View>
          </View>

          {/* ── DNA (functional) scores — all 7, not just priority-flagged ── */}
          <View wrap={false}>
            <Text style={s.sectionLabel}>DNA SCORES</Text>
            <View style={s.table}>
              {DNA_CATEGORIES.map((cat, idx) => {
                const values = cities.map(c => c.location.dna[cat.key])
                const wins = pdfBestIndices(values, false)
                const isLast = idx === DNA_CATEGORIES.length - 1
                return (
                  <View key={cat.key} style={isLast ? s.cmpTrLast : s.cmpTr}>
                    <Text style={s.cmpTdLabel}>{cat.label}</Text>
                    {cities.map((city, i) => (
                      <Text
                        key={city.location.id}
                        style={wins[i] ? [s.cmpTdVal, { color: scoreColor(values[i]) }] : s.cmpTdDim}
                      >
                        {values[i]}/10
                      </Text>
                    ))}
                  </View>
                )
              })}
            </View>
          </View>

          {/* ── Personality (lifestyle) scores — all 5 ── */}
          <View wrap={false}>
            <Text style={s.sectionLabel}>PERSONALITY SCORES</Text>
            <View style={s.table}>
              {PERSONALITY_LABELS.map(([key, label], idx) => {
                const values = cities.map(c => c.location.personality[key])
                const wins = pdfBestIndices(values, false)
                const isLast = idx === PERSONALITY_LABELS.length - 1
                return (
                  <View key={key} style={isLast ? s.cmpTrLast : s.cmpTr}>
                    <Text style={s.cmpTdLabel}>{label}</Text>
                    {cities.map((city, i) => (
                      <Text
                        key={city.location.id}
                        style={wins[i] ? [s.cmpTdVal, { color: scoreColor(values[i]) }] : s.cmpTdDim}
                      >
                        {values[i]}/10
                      </Text>
                    ))}
                  </View>
                )
              })}
            </View>
          </View>

          {/* Your priorities (unchanged from the prior compare PDF) */}
          {priorityCats.length > 0 && (
            <View wrap={false}>
              <Text style={s.sectionLabel}>YOUR PRIORITIES</Text>
              <View style={s.table}>
                {priorityCats.map(({ key, tag }, idx) => {
                  const cat = DNA_CATEGORIES.find(c => c.key === key)
                  const values = cities.map(c => c.location.dna[key])
                  const wins = pdfBestIndices(values, false)
                  const isLast = idx === priorityCats.length - 1
                  return (
                    <View key={key} style={isLast ? s.cmpTrLast : s.cmpTr}>
                      <Text style={s.cmpTdLabel}>{cat?.label ?? key} ({tag})</Text>
                      {cities.map((city, i) => (
                        <Text
                          key={city.location.id}
                          style={wins[i] ? [s.cmpTdVal, { color: scoreColor(values[i]) }] : s.cmpTdDim}
                        >
                          {values[i]}/10
                        </Text>
                      ))}
                    </View>
                  )
                })}
              </View>
            </View>
          )}

          {/* Market & Schools (market condition + days-on-market, unchanged) */}
          <View wrap={false}>
            <Text style={s.sectionLabel}>MARKET SNAPSHOT</Text>
            <View style={s.table}>
              <View style={s.cmpTr}>
                <Text style={s.cmpTdLabel}>Market</Text>
                {cities.map(city => (
                  <Text
                    key={city.location.id}
                    style={[s.cmpTdVal, { color: marketColor(city.location.market.marketCondition) }]}
                  >
                    {city.location.market.marketCondition.replace(' Market', '')}
                  </Text>
                ))}
              </View>
              {(() => {
                const values = cities.map(c => c.location.market.daysOnMarket)
                const wins = pdfBestIndices(values, true)
                return (
                  <View style={s.cmpTrLast}>
                    <Text style={s.cmpTdLabel}>Days on market</Text>
                    {cities.map((city, i) => (
                      <Text key={city.location.id} style={wins[i] ? s.cmpTdVal : s.cmpTdDim}>{values[i]}d</Text>
                    ))}
                  </View>
                )
              })()}
            </View>
          </View>

          {/* Bottom line */}
          {summary ? (
            <View style={s.cmpSummaryBox} wrap={false}>
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

export function createComparisonReportDocument(props: ComparisonReportProps): React.ReactElement<ReactPDF.DocumentProps> {
  return <ComparisonReportDocument {...props} />
}
