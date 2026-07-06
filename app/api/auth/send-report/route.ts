import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import * as ReactPDF from '@react-pdf/renderer'
import { getAllCities } from '../../../../services/locationService'
import { getTopMatches } from '../../../../services/matchingService'
import { createReportDocument } from '../../../../services/pdfService'
import { buildReportReadyEmailHtml } from '../../../../services/emailService'
import { UserProfile } from '../../../../types'
import { resolveArchetype, buildPersonalityPreference } from '../../../../utils/quizProfileMapping'

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
  let email = ''
  try {
    const body = await request.json().catch(() => ({}))
    const force: boolean = body.force ?? false

    const token = request.cookies.get('hq_auth')?.value
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const supabase = getSupabase()

    const { data: { user }, error: authErr } = await supabase.auth.getUser(token)
    if (authErr || !user?.email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    email = user.email.toLowerCase()

    const { data: ud, error: dbErr } = await supabase
      .from('users')
      .select('first_name, report_emailed, annual_income, household_size, housing_preference, moving_timeline, must_haves, nice_to_haves, not_priorities, unassigned_priorities, archetype, growth_profile, lifestyle_orientation, environment, pace, culture, financial_picture')
      .eq('email', email)
      .single()

    if (dbErr || !ud) {
      console.error('[send-report] user lookup failed:', dbErr?.message)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (ud.report_emailed && !force) {
      return NextResponse.json({ skipped: 'already_sent' })
    }

    if (!ud.annual_income) {
      return NextResponse.json({ skipped: 'no_profile' })
    }

    const profile: UserProfile = {
      annualIncome: ud.annual_income,
      householdSize: ud.household_size ?? '1',
      movingTimeline: ud.moving_timeline ?? 'exploring',
      mustHaves: ud.must_haves ?? [],
      niceToHaves: ud.nice_to_haves ?? [],
      notPriorities: ud.not_priorities ?? [],
      unassignedPriorities: ud.unassigned_priorities ?? [],
      archetype: resolveArchetype(ud.archetype),
      personalityPreference: buildPersonalityPreference(ud),
      financial_picture: ud.financial_picture ?? undefined,
    }

    const { topMatches: matches } = getTopMatches(profile, getAllCities(), 3)
    if (matches.length === 0) {
      return NextResponse.json({ skipped: 'no_matches' })
    }

    const firstName = ud.first_name ?? email.split('@')[0]
    const generatedDate = formattedDate()
    const resendKey = process.env.RESEND_API_KEY

    if (resendKey) {
      try {
        const pdfBuffer = await ReactPDF.renderToBuffer(
          createReportDocument({ firstName, matches, profile, generatedDate })
        )

        const resend = new Resend(resendKey)
        const cityNames = matches.map(m => m.location.name)

        const { error: sendErr } = await resend.emails.send({
          from: 'HavenQuest <admin@send.havenquest.co>',
          to: email,
          subject: `Your HavenQuest Report is Ready, ${firstName}`,
          html: buildReportReadyEmailHtml(firstName, cityNames),
          attachments: [{ filename: 'HavenQuest-Report.pdf', content: pdfBuffer }],
        })

        if (sendErr) {
          console.error('[send-report] Resend error:', sendErr)
        } else {
          await supabase.from('users').update({ report_emailed: true }).eq('email', email)
        }
      } catch (pdfErr) {
        console.error('[send-report] PDF/send error:', pdfErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[send-report] unexpected error for', email, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
