import React from 'react'
import * as ReactPDF from '@react-pdf/renderer'
import { CityMatch, UserProfile } from '../types'
import { getMonthlyPropertyTax } from './affordabilityService'

const { Document, Page, View, Text, StyleSheet } = ReactPDF

const DARK = '#16120D'
const WARM = '#1C1814'
const GOLD = '#B8912A'
const CREAM = '#F0EDE6'
const MUTED = '#9A8E82'
const CARD = '#F4F1EC'
const ROW_ALT = '#EAE6DF'
const WHITE = '#FFFFFF'

const s = StyleSheet.create({
  page: {
    backgroundColor: WHITE,
    fontFamily: 'Helvetica',
    paddingBottom: 56,
  },
  header: {
    backgroundColor: DARK,
    paddingHorizontal: 40,
    paddingTop: 30,
    paddingBottom: 26,
  },
  logoLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  logoBlack: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
  },
  logoGold: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: GOLD,
  },
  headerSub: {
    fontSize: 9,
    color: CREAM,
    opacity: 0.6,
    marginBottom: 4,
  },
  headerMeta: {
    fontSize: 9,
    color: GOLD,
  },
  body: {
    paddingHorizontal: 40,
    paddingTop: 26,
  },
  cityBlock: {
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD8D0',
    marginBottom: 22,
  },
  cityTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  badge: {
    backgroundColor: GOLD,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: DARK,
    letterSpacing: 0.6,
  },
  cityName: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: WARM,
  },
  cityMeta: {
    fontSize: 8,
    color: MUTED,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 8.5,
    color: '#4A3F35',
    lineHeight: 1.65,
    marginBottom: 10,
  },
  table: {
    backgroundColor: CARD,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 9,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD8D0',
  },
  tableRowTotal: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: ROW_ALT,
  },
  tableLabel: {
    flex: 1,
    fontSize: 8.5,
    color: MUTED,
  },
  tableVal: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: WARM,
  },
  tableLabelTotal: {
    flex: 1,
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: WARM,
  },
  tableValTotal: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: DARK,
  },
  schoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  schoolBadge: {
    borderRadius: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginRight: 8,
  },
  schoolGrade: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
  },
  schoolLabel: {
    fontSize: 8.5,
    color: MUTED,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#DDD8D0',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7.5,
    color: MUTED,
  },
})

function gradeColor(g: string): string {
  if (g === 'A') return '#2D7A4F'
  if (g === 'B') return '#3B82F6'
  if (g === 'C') return '#D97706'
  if (g === 'D') return '#EA580C'
  return '#DC2626'
}

function rankLabel(i: number): string {
  return i === 0 ? 'TOP PICK' : i === 1 ? 'RUNNER-UP' : 'STRONG ALT'
}

function money(n: number): string {
  return '$' + n.toLocaleString('en-US')
}

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

        <View style={s.header}>
          <View style={s.logoLine}>
            <Text style={s.logoBlack}>Haven</Text>
            <Text style={s.logoGold}>Quest</Text>
          </View>
          <Text style={s.headerSub}>Texas Relocation Intelligence Report</Text>
          <Text style={s.headerMeta}>Prepared for {firstName}  ·  {generatedDate}</Text>
        </View>

        <View style={s.body}>
          {matches.map((match, i) => {
            const city = match.location
            const tax = getMonthlyPropertyTax(city, profile.housingPreference)

            return (
              <View key={city.id} style={s.cityBlock} wrap={false}>
                {i > 0 && <View style={s.divider} />}

                <View style={s.cityTopRow}>
                  <View style={s.badge}>
                    <Text style={s.badgeText}>{rankLabel(i)}</Text>
                  </View>
                  <Text style={s.cityName}>{city.name}, TX</Text>
                </View>

                <Text style={s.cityMeta}>
                  {city.county} County  ·  Match Score: {match.matchScore}%
                </Text>

                <Text style={s.description}>{city.description}</Text>

                <View style={s.table}>
                  <View style={s.tableRow}>
                    <Text style={s.tableLabel}>Est. Monthly Housing</Text>
                    <Text style={s.tableVal}>{money(match.estimatedMonthlyHousing)}/mo</Text>
                  </View>
                  <View style={s.tableRow}>
                    <Text style={s.tableLabel}>Property Tax (est.)</Text>
                    <Text style={s.tableVal}>{money(tax)}/mo</Text>
                  </View>
                  <View style={s.tableRow}>
                    <Text style={s.tableLabel}>Utilities</Text>
                    <Text style={s.tableVal}>{money(city.housing.monthlyUtilities)}/mo</Text>
                  </View>
                  <View style={s.tableRowTotal}>
                    <Text style={s.tableLabelTotal}>Total All-In (est.)</Text>
                    <Text style={s.tableValTotal}>{money(match.estimatedMonthlyTotal)}/mo</Text>
                  </View>
                </View>

                <View style={s.schoolRow}>
                  <View style={[s.schoolBadge, { backgroundColor: gradeColor(city.school.teaRating) }]}>
                    <Text style={s.schoolGrade}>{city.school.teaRating}</Text>
                  </View>
                  <Text style={s.schoolLabel}>
                    TEA School Rating  ·  {city.school.primaryISD}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>

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
