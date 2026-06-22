import { NextRequest, NextResponse } from 'next/server'

interface OriginMarketData {
  medianHomeValue: number | null
  medianRealEstateTaxes: number | null
  effectiveTaxRate: number | null
}

const EMPTY_RESULT: OriginMarketData = {
  medianHomeValue: null,
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
async function fetchAcsVariable(
  datasetPath: string,
  variable: string,
  zip: string,
  apiKey: string,
  signal: AbortSignal
): Promise<number | null> {
  const url = `https://api.census.gov/data/${datasetPath}?get=NAME,${variable}&for=zip%20code%20tabulation%20area:${zip}&key=${apiKey}`
  const res = await fetch(url, { signal })
  if (!res.ok) return null
  const rows = await res.json()
  if (!Array.isArray(rows) || rows.length < 2) return null
  const header: string[] = rows[0]
  const dataRow: string[] = rows[1]
  const colIndex = header.indexOf(variable)
  if (colIndex === -1) return null
  return parseAcsValue(dataRow[colIndex])
}

async function lookupOriginMarketData(zip: string): Promise<OriginMarketData> {
  const apiKey = process.env.CENSUS_API_KEY
  if (!apiKey) return EMPTY_RESULT

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const [medianHomeValue, medianRealEstateTaxes] = await Promise.all([
      fetchAcsVariable('2023/acs/acs5/profile', 'DP04_0089E', zip, apiKey, controller.signal),
      fetchAcsVariable('2023/acs/acs5', 'B25103_001E', zip, apiKey, controller.signal),
    ])

    const effectiveTaxRate =
      medianHomeValue && medianRealEstateTaxes && medianHomeValue > 0
        ? medianRealEstateTaxes / medianHomeValue
        : null

    return { medianHomeValue, medianRealEstateTaxes, effectiveTaxRate }
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
