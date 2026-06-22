import { NextRequest, NextResponse } from 'next/server'

interface OriginMarketData {
  medianHomeValue: number | null
  medianMonthlyHousingCost: number | null
  medianRealEstateTaxes: number | null
  effectiveTaxRate: number | null
}

const EMPTY_RESULT: OriginMarketData = {
  medianHomeValue: null,
  medianMonthlyHousingCost: null,
  medianRealEstateTaxes: null,
  effectiveTaxRate: null,
}

const TIMEOUT_MS = 5000

// ACS uses negative sentinel codes (e.g. -666666666) to mean "data not
// available" for this geography — not zero, not missing-key-style absence.
function parseAcsValue(raw: unknown): number | null {
  const n = typeof raw === 'string' ? Number(raw) : typeof raw === 'number' ? raw : NaN
  if (!Number.isFinite(n) || n < 0) return null
  return n
}

// The Census API returns a 2D array: header row + one data row per geography
// match. On a missing/invalid key it 302s to an HTML "Missing Key" page
// instead of JSON — response.json() throws in that case, which the caller
// catches and treats as "no data" rather than a hard error.
// Variables passed together must belong to the same dataset (e.g. DP04_0089E
// and DP04_0101E are both acs5/profile) — that's the only way to combine them
// into one request; a different dataset (e.g. B25103_001E, acs5 base tables)
// needs its own separate call.
async function fetchAcsVariables(
  datasetPath: string,
  variables: string[],
  zip: string,
  apiKey: string,
  signal: AbortSignal
): Promise<Record<string, number | null>> {
  const empty = Object.fromEntries(variables.map(v => [v, null]))
  const url = `https://api.census.gov/data/${datasetPath}?get=NAME,${variables.join(',')}&for=zip%20code%20tabulation%20area:${zip}&key=${apiKey}`
  const res = await fetch(url, { signal })
  if (!res.ok) return empty
  const rows = await res.json()
  if (!Array.isArray(rows) || rows.length < 2) return empty
  const header: string[] = rows[0]
  const dataRow: string[] = rows[1]
  const result: Record<string, number | null> = {}
  for (const v of variables) {
    const colIndex = header.indexOf(v)
    result[v] = colIndex === -1 ? null : parseAcsValue(dataRow[colIndex])
  }
  return result
}

async function lookupOriginMarketData(zip: string): Promise<OriginMarketData> {
  const apiKey = process.env.CENSUS_API_KEY
  if (!apiKey) return EMPTY_RESULT

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const [profileVars, taxVars] = await Promise.all([
      fetchAcsVariables('2023/acs/acs5/profile', ['DP04_0089E', 'DP04_0101E'], zip, apiKey, controller.signal),
      fetchAcsVariables('2023/acs/acs5', ['B25103_001E'], zip, apiKey, controller.signal),
    ])

    const medianHomeValue = profileVars['DP04_0089E']
    const medianMonthlyHousingCost = profileVars['DP04_0101E']
    const medianRealEstateTaxes = taxVars['B25103_001E']

    const effectiveTaxRate =
      medianHomeValue && medianRealEstateTaxes && medianHomeValue > 0
        ? medianRealEstateTaxes / medianHomeValue
        : null

    return { medianHomeValue, medianMonthlyHousingCost, medianRealEstateTaxes, effectiveTaxRate }
  } catch (err) {
    console.error('[origin-market-data] lookup failed:', err)
    return EMPTY_RESULT
  } finally {
    clearTimeout(timeout)
  }
}

function isValidZip(zip: string | null): zip is string {
  return !!zip && /^\d{5}$/.test(zip)
}

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get('zip')
  if (!isValidZip(zip)) return NextResponse.json(EMPTY_RESULT)
  return NextResponse.json(await lookupOriginMarketData(zip))
}

export async function POST(request: NextRequest) {
  try {
    const { zip } = await request.json()
    if (!isValidZip(zip)) return NextResponse.json(EMPTY_RESULT)
    return NextResponse.json(await lookupOriginMarketData(zip))
  } catch {
    return NextResponse.json(EMPTY_RESULT)
  }
}
