// Texas-metro stat field-mapping shared by the live "Texas vs. Your Origin"
// comparison chart (components/portal/milemarkers/MM3Discover.tsx) and the
// Phase D comparison-report PDF (services/pdfService.tsx) — a single source
// of truth so the two never drift into showing different numbers for the
// same city. Extracted verbatim from MM3Discover.tsx, no behavior change.

export function txColIndex(metro: string): number {
  if (metro.includes('Houston')) return 98
  if (metro.includes('San Antonio')) return 97
  if (metro.includes('Dallas') || metro.includes('DFW') || metro.includes('Fort Worth')) return 104
  return 108
}

export function txSafety(score: number): string {
  if (score >= 8) return 'Very low'
  if (score >= 6) return 'Low'
  if (score >= 4) return 'Moderate'
  return 'Higher risk'
}

export function txPropertyTax(metro: string): string {
  if (metro.includes('Houston')) return '2.0%'
  if (metro.includes('San Antonio')) return '2.3%'
  if (metro.includes('Dallas') || metro.includes('DFW') || metro.includes('Fort Worth')) return '2.1%'
  return '1.9%'
}

export function txJobMarket(metro: string): string {
  if (metro.includes('Houston') || metro.includes('San Antonio')) return 'Moderate'
  return 'Strong'
}

export function txClimateV2(metro: string): string {
  if (metro.includes('Houston')) return 'Humid subtropical'
  if (metro.includes('Dallas') || metro.includes('DFW') || metro.includes('Fort Worth')) return 'Hot & stormy'
  if (metro.includes('San Antonio')) return 'Hot & dry'
  return 'Hot summers'
}
