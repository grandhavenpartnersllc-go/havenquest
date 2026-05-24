import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import * as ReactPDF from '@react-pdf/renderer'
import { getAllCities } from '../../../../services/locationService'
import { getTopMatches } from '../../../../services/matchingService'
import { createReportDocument } from '../../../../services/pdfService'
import { buildReportReadyEmailHtml } from '../../../../services/emailService'
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
  let email = ''
  try {
    const body = await request.json().catch(() => ({}))
    const force: boolean = body.force ?? false

    // 1. Cookie check
    const token = request.cookies.get('hq_auth')?.value
    console.log('[send-report] hq_auth cookie present:', !!token, '| force:', force)
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const supabase = getSupabase()

    // 2. Token → user
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token)
    console.log('[send-report] getUser result — email:', user?.email ?? 'none', '| authErr:', authErr?.message ?? 'none')
    if (authErr || !user?.email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    email = user.email.toLowerCase()

    const { data: ud, error: dbErr } = await supabase
      .from('users')
      .select('first_name, report_emailed, annual_income, household_size, housing_preference, moving_timeline, must_haves, nice_to_haves, not_priorities')
      .eq('email', email)
      .single()

    console.log('[send-report] DB lookup — found:', !!ud, '| dbErr:', dbErr?.message ?? 'none', '| report_emailed:', ud?.report_emailed)
    if (dbErr || !ud) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (ud.report_emailed && !force) {
      console.log('[send-report] skipping — already sent')
      return NextResponse.json({ skipped: 'already_sent' })
    }

    if (!ud.annual_income) {
      console.log('[send-report] skipping — no profile data')
      return NextResponse.json({ skipped: 'no_profile' })
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
    console.log('[send-report] matches computed:', matches.length, matches.map(m => m.location.name))
    if (matches.length === 0) {
      return NextResponse.json({ skipped: 'no_matches' })
    }

    const firstName = ud.first_name ?? email.split('@')[0]
    const generatedDate = formattedDate()
    const resendKey = process.env.RESEND_API_KEY
    console.log('[send-report] RESEND_API_KEY present:', !!resendKey, '| key prefix:', resendKey?.slice(0, 8) ?? 'missing')

    if (resendKey) {
      try {
        // 3. PDF generation
        console.log('[send-report] generating PDF...')
        const pdfBuffer = await ReactPDF.renderToBuffer(
          createReportDocument({ firstName, matches, profile, generatedDate })
        )
        console.log('[send-report] PDF generated — bytes:', pdfBuffer.length)

        // 4. Resend
        const resend = new Resend(resendKey)
        const cityNames = matches.map(m => m.location.name)
        console.log('[send-report] sending email to:', email, '| from: HavenQuest <admin@send.havenquest.co>')

        const { data: sendData, error: sendErr } = await resend.emails.send({
          from: 'HavenQuest <admin@send.havenquest.co>',
          to: email,
          subject: `Your HavenQuest Report is Ready, ${firstName}`,
          html: buildReportReadyEmailHtml(firstName, cityNames),
          attachments: [{ filename: 'HavenQuest-Report.pdf', content: pdfBuffer }],
        })

        console.log('[send-report] Resend response — id:', sendData?.id ?? 'none', '| error:', JSON.stringify(sendErr) ?? 'none')

        if (sendErr) {
          console.error('[send-report] Resend send failed:', JSON.stringify(sendErr))
        } else {
          await supabase.from('users').update({ report_emailed: true }).eq('email', email)
          console.log('[send-report] report_emailed flag set for', email)
        }
      } catch (pdfErr) {
        console.error('[send-report] PDF/send exception:', pdfErr)
      }
    } else {
      console.warn('[send-report] RESEND_API_KEY not set — email skipped')
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[send-report] unexpected error for', email, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
