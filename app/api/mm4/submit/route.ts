import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import type { MM4Profile } from '../../../../types'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key, { auth: { persistSession: false } })
}

const MD_EMAIL = 'craig.asbach@havenquest.co'
const BOOKINGS_URL =
  'https://calendly.com/craig-asbach-havenquest/havenquest-consulation'

// ─── Label helpers ────────────────────────────────────────────────────────────

function v(val: unknown): string {
  if (val === null || val === undefined || val === '') return '—'
  if (typeof val === 'boolean') return val ? 'Yes' : 'No'
  return String(val)
}

function fmtContact(val?: string) {
  return { phone: 'Phone call', text: 'Text message', email: 'Email' }[val ?? ''] ?? v(val)
}
function fmtTime(val?: string) {
  return { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening', anytime: 'Anytime' }[val ?? ''] ?? v(val)
}
function fmtTimeline(val?: string) {
  return {
    hard_deadline: 'Hard deadline',
    flexible_few_months: 'Flexible — within a few months',
    very_flexible: 'Very flexible',
  }[val ?? ''] ?? v(val)
}
function fmtOrigin(val?: string) {
  return {
    selling: 'Selling my home',
    renting: 'Currently renting',
    own_no_sale: 'Own — not selling',
    other: 'Other',
  }[val ?? ''] ?? v(val)
}
function fmtEmployment(val?: string) {
  return {
    employed_w2: 'Employed (W-2)',
    self_employed: 'Self-employed',
    retired: 'Retired',
    employer_relocation: 'Employer relocation',
    other: 'Other',
  }[val ?? ''] ?? v(val)
}
function fmtWorkArrangement(val?: string) {
  return {
    fully_remote: 'Fully remote',
    hybrid: 'Hybrid',
    in_person: 'In-person',
    na: 'Not applicable',
  }[val ?? ''] ?? v(val)
}
function fmtContingent(val?: string) {
  return { yes: 'Yes', no: 'No', possibly: 'Possibly', na: 'Not applicable' }[val ?? ''] ?? v(val)
}

// ─── Client confirmation email ────────────────────────────────────────────────

function buildClientHtml(profile: MM4Profile): string {
  const firstName = profile.primary_first_name ?? 'there'
  const targetCity = profile.confirmed_target_city ?? 'Texas'

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your HavenQuest Profile is Complete</title></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#0A1E3D;border-radius:12px 12px 0 0;padding:28px 36px 24px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.14em;color:#C5B783;text-transform:uppercase;font-weight:600;">HavenQuest Navigator</p>
            <p style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.25;">Your profile is complete.</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:36px 36px 28px;">
            <p style="margin:0 0 20px;font-size:15px;color:#1a1a2e;line-height:1.65;">${firstName},</p>
            <p style="margin:0 0 20px;font-size:15px;color:#1a1a2e;line-height:1.65;">
              Your Navigator profile is complete — and I've already started reviewing it.
            </p>
            <p style="margin:0 0 28px;font-size:15px;color:#1a1a2e;line-height:1.65;">
              I'm looking forward to our conversation. Based on what you've shared, I have a lot to discuss with you about <strong>${targetCity}</strong> and what your move is going to look like.
            </p>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr>
                <td style="border-radius:8px;background:#0076B6;">
                  <a href="${BOOKINGS_URL}" target="_blank"
                     style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.01em;">
                    Book My Consultation →
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 8px;font-size:13px;color:#8a93a0;line-height:1.5;">
              Or copy this link: <a href="${BOOKINGS_URL}" style="color:#0076B6;word-break:break-all;">${BOOKINGS_URL}</a>
            </p>
            <p style="margin:24px 0 0;font-size:15px;color:#1a1a2e;line-height:1.65;">
              It's a 60-minute Teams call. Come ready to talk about the life you're building in Texas — the more we dig in, the better I can guide you.
            </p>
          </td>
        </tr>

        <!-- Signature -->
        <tr>
          <td style="background:#ffffff;border-top:1px solid #e8eaf0;padding:24px 36px 32px;border-radius:0 0 12px 12px;">
            <p style="margin:0;font-size:15px;color:#1a1a2e;line-height:1.65;">See you soon.</p>
            <p style="margin:12px 0 0;font-size:14px;color:#0A1E3D;font-weight:600;">Craig Asbach</p>
            <p style="margin:2px 0 0;font-size:13px;color:#8a93a0;">Market Director — HavenQuest</p>
            <a href="mailto:${MD_EMAIL}" style="font-size:13px;color:#0076B6;text-decoration:none;">${MD_EMAIL}</a>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── MD notification email ────────────────────────────────────────────────────

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:7px 12px 7px 0;font-size:13px;color:#8a93a0;white-space:nowrap;vertical-align:top;width:200px;">${label}</td>
    <td style="padding:7px 0;font-size:13px;color:#1a1a2e;line-height:1.55;">${value}</td>
  </tr>`
}

function sectionHeader(title: string): string {
  return `<tr><td colspan="2" style="padding:20px 0 8px;">
    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#0076B6;border-bottom:1px solid #e8eaf0;padding-bottom:6px;">${title}</p>
  </td></tr>`
}

function buildMDHtml(profile: MM4Profile): string {
  const fullName = [profile.primary_first_name, profile.primary_last_name].filter(Boolean).join(' ') || '—'
  const partnerName = [profile.partner_first_name, profile.partner_last_name].filter(Boolean).join(' ') || '—'
  const address = [profile.current_address, profile.current_city, profile.current_state, profile.current_zip]
    .filter(Boolean).join(', ') || '—'

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New MM4 Profile</title></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#0A1E3D;border-radius:12px 12px 0 0;padding:24px 32px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.14em;color:#C5B783;text-transform:uppercase;font-weight:600;">HavenQuest Navigator — MM4 Alert</p>
            <p style="margin:8px 0 0;font-size:20px;font-weight:700;color:#ffffff;line-height:1.25;">New Client Profile Submitted</p>
            <p style="margin:6px 0 0;font-size:14px;color:#b0b8c1;">${fullName} · ${v(profile.email)}</p>
          </td>
        </tr>

        <!-- Quick facts bar -->
        <tr>
          <td style="background:#EBF5FB;border:1px solid #bde0f5;padding:14px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:12px;color:#0076B6;">
                  <strong>Target city:</strong> ${v(profile.confirmed_target_city)}
                </td>
                <td style="font-size:12px;color:#0076B6;text-align:center;">
                  <strong>Target date:</strong> ${v(profile.target_move_date)}
                </td>
                <td style="font-size:12px;color:#0076B6;text-align:right;">
                  <strong>Submitted:</strong> ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Profile body -->
        <tr>
          <td style="background:#ffffff;border-radius:0 0 12px 12px;padding:24px 32px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">

              ${sectionHeader('Section 1 — Identity &amp; Household')}
              ${row('Primary contact', fullName)}
              ${row('Partner/Spouse', partnerName)}
              ${row('Current address', address)}
              ${row('Phone', v(profile.phone))}
              ${row('Email', v(profile.email))}
              ${row('Preferred contact', fmtContact(profile.preferred_contact))}
              ${row('Best time to reach', fmtTime(profile.best_time_to_reach))}
              ${row('Adults in household', v(profile.num_adults))}
              ${row('Children', profile.num_children ? `${profile.num_children} (ages: ${v(profile.children_ages)})` : '0')}
              ${row('Pets', profile.has_pets ? `Yes — ${v(profile.pet_details)}` : 'No')}

              ${sectionHeader('Section 2 — The Move')}
              ${row('Why Texas?', v(profile.why_texas))}
              ${row('Why now?', v(profile.why_now))}
              ${row('Target move date', v(profile.target_move_date))}
              ${row('Timeline flexibility', fmtTimeline(profile.timeline_flexibility))}
              ${row('Current situation', fmtOrigin(profile.origin_situation))}
              ${profile.origin_situation === 'selling' ? row('Home listed?', profile.home_listed ? 'Yes' : 'Not yet') : ''}
              ${profile.origin_situation === 'selling' ? row('Approximate equity', v(profile.approximate_equity)) : ''}
              ${profile.origin_situation === 'selling' ? row('Purchase contingent?', fmtContingent(profile.purchase_contingent)) : ''}

              ${sectionHeader('Section 3 — Employment &amp; Finances')}
              ${row('Employment status', fmtEmployment(profile.employment_status))}
              ${profile.employment_status === 'employer_relocation' ? row('Relocation package?', v(profile.relocation_package)) : ''}
              ${row('Work arrangement', fmtWorkArrangement(profile.work_arrangement))}
              ${row('Annual household income', v(profile.income_range_confirmed))}

              ${sectionHeader('Section 4 — Texas Direction')}
              ${row('Confirmed target city', v(profile.confirmed_target_city))}
              ${row('Ruled-out cities', v(profile.ruled_out_cities))}
              ${row('Areas researched', v(profile.areas_researched))}
              ${row('Additional must-haves', v(profile.additional_must_haves))}
              ${row('Deal-breakers', v(profile.deal_breakers))}

              ${sectionHeader('Section 5 — Notes')}
              ${row('Notes for MD', v(profile.special_notes))}

            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 0 0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#b0b8c1;">HavenQuest Navigator · MM4 automated notification</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { profile: MM4Profile }
    const { profile } = body

    if (!profile?.email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    const key = process.env.RESEND_API_KEY
    if (!key) {
      console.error('[MM4/submit] RESEND_API_KEY not configured — emails skipped')
      return NextResponse.json({ ok: true })
    }

    const resend = new Resend(key)
    const fullName = [profile.primary_first_name, profile.primary_last_name].filter(Boolean).join(' ') || 'Client'

    // Client confirmation
    try {
      await resend.emails.send({
        from: 'Craig Asbach, HavenQuest <craig.asbach@havenquest.co>',
        replyTo: MD_EMAIL,
        to: profile.email,
        subject: 'Your HavenQuest profile is complete — let\'s connect',
        html: buildClientHtml(profile),
      })
    } catch (err) {
      console.error('[MM4/submit] client email error:', err)
    }

    // MD notification
    try {
      await resend.emails.send({
        from: 'HavenQuest <admin@send.havenquest.co>',
        to: MD_EMAIL,
        subject: `New MM4 Profile Submitted — ${fullName}`,
        html: buildMDHtml(profile),
      })
    } catch (err) {
      console.error('[MM4/submit] MD notification error:', err)
    }

    // Persist origin_zip to public.users so it's available for future queries
    if (profile.current_zip && profile.email) {
      try {
        const supabase = getSupabase()
        await supabase
          .from('users')
          .update({ origin_zip: profile.current_zip })
          .eq('email', profile.email.toLowerCase())
      } catch (err) {
        console.error('[MM4/submit] origin_zip save error:', err)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[MM4/submit] route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
