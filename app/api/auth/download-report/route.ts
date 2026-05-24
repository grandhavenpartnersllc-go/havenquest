import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as ReactPDF from '@react-pdf/renderer'
import { getAllCities } from '../../../../services/locationService'
import { getTopMatches } from '../../../../services/matchingService'
import { createReportDocument } from '../../../../services/pdfService'
import { UserProfile } from '../../../../types'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key, { auth: { persistSession: false } })
}

function formattedDate(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('hq_auth')?.value
    if (!token) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 })
    }

    const supabase = getSupabase()

    const { data: { user }, error: authErr } = await supabase.auth.getUser(token)
    if (authErr || !user?.email) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 })
    }
    const email = user.email.toLowerCase()

    const { data: ud, error: dbErr } = await supabase
      .from('users')
      .select('first_name, annual_income, household_size, housing_preference, moving_timeline, must_haves, nice_to_haves, not_priorities')
      .eq('email', email)
      .single()

    if (dbErr || !ud || !ud.annual_income) {
      return new Response(JSON.stringify({ error: 'No report data found' }), { status: 404 })
    }

    const profile: UserProfile = {
      annualIncome: ud.annual_income,
      householdSize: ud.household_size ?? '1',
      housingPreference: ud.housing_preference ?? 'rent2br',
      movingTimeline: ud.moving_timeline ?? 'exploring',
      mustHaves: ud.must_haves ?? [],
      niceToHaves: ud.nice_to_haves ?? [],
      notPriorities: ud.not_priorities ?? [],
    }

    const matches = getTopMatches(profile, getAllCities(), 3)
    if (matches.length === 0) {
      return new Response(JSON.stringify({ error: 'No matches found' }), { status: 404 })
    }

    const firstName = ud.first_name ?? email.split('@')[0]
    const pdfBuffer = await ReactPDF.renderToBuffer(
      createReportDocument({ firstName, matches, profile, generatedDate: formattedDate() })
    )

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="HavenQuest-Report.pdf"',
      },
    })
  } catch (err) {
    console.error('[download-report] error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
