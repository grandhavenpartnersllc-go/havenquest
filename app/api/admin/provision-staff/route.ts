import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { cookies } from 'next/headers'
import { createServerClient } from '../../../../lib/supabase/server'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createSupabaseClient(url, key, { auth: { persistSession: false } })
}

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#'
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function buildWelcomeEmail(fullName: string, email: string, tempPassword: string, metro: string): string {
  const metroLabel: Record<string, string> = {
    austin: 'Austin', dfw: 'DFW', houston: 'Houston', san_antonio: 'San Antonio', all: 'All Metros',
  }
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Welcome to HavenQuest COMPASS</title></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">
        <tr>
          <td style="background:#0A1E3D;border-radius:12px 12px 0 0;padding:28px 36px 24px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.14em;color:#C5B783;text-transform:uppercase;font-weight:600;">HavenQuest · COMPASS</p>
            <p style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;">Welcome to the team.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;padding:36px;border-radius:0 0 12px 12px;">
            <p style="margin:0 0 20px;font-size:15px;color:#1a1a2e;line-height:1.65;">${fullName},</p>
            <p style="margin:0 0 20px;font-size:15px;color:#1a1a2e;line-height:1.65;">
              Your HavenQuest Market Director account has been created. You've been assigned to the <strong>${metroLabel[metro] ?? metro}</strong> metro.
            </p>
            <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#0A1E3D;">Your login credentials:</p>
            <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:16px;width:100%;">
              <tr><td style="font-size:13px;color:#6B7280;padding-bottom:6px;">Email</td></tr>
              <tr><td style="font-size:14px;color:#0A1E3D;font-weight:600;padding-bottom:14px;">${email}</td></tr>
              <tr><td style="font-size:13px;color:#6B7280;padding-bottom:6px;">Temporary Password</td></tr>
              <tr><td style="font-size:14px;color:#0A1E3D;font-weight:600;letter-spacing:0.08em;">${tempPassword}</td></tr>
            </table>
            <p style="margin:0 0 16px;font-size:14px;color:#1a1a2e;line-height:1.65;">
              Please sign in and change your password on first login.
            </p>
            <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr>
                <td style="border-radius:8px;background:#0076B6;">
                  <a href="https://havenquest.co/compass/meridian/login" target="_blank"
                     style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">
                    Sign In to COMPASS Meridian →
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#0A1E3D;">Your onboarding checklist:</p>
            <ul style="margin:0 0 24px;padding:0 0 0 20px;">
              <li style="font-size:13px;color:#1a1a2e;line-height:1.75;margin-bottom:4px;">✅ Supabase account created</li>
              <li style="font-size:13px;color:#1a1a2e;line-height:1.75;margin-bottom:4px;">✅ Market Director role assigned</li>
              <li style="font-size:13px;color:#6B7280;line-height:1.75;margin-bottom:4px;">🔲 Microsoft 365 account — contact Craig</li>
              <li style="font-size:13px;color:#6B7280;line-height:1.75;margin-bottom:4px;">🔲 Set up your Calendly calendar</li>
              <li style="font-size:13px;color:#6B7280;line-height:1.75;margin-bottom:4px;">🔲 Complete the COMPASS Meridian walkthrough</li>
            </ul>
            <p style="margin:0;font-size:14px;color:#0A1E3D;font-weight:600;">Craig Asbach</p>
            <p style="margin:2px 0 0;font-size:13px;color:#8a93a0;">HavenQuest</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('hq_auth')?.value
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const callerClient = createServerClient(accessToken)
    const { data: caller } = await callerClient.from('users').select('user_role, email').single()
    if (caller?.user_role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json() as { full_name: string; email: string; metro: string; start_date?: string }
    const { full_name, email, metro } = body

    if (!full_name?.trim() || !email?.trim() || !metro?.trim()) {
      return NextResponse.json({ error: 'full_name, email, and metro are required' }, { status: 400 })
    }

    const supabase = getServiceClient()
    const tempPassword = generateTempPassword()

    const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    })

    if (createError || !authUser.user) {
      return NextResponse.json({ error: createError?.message ?? 'Failed to create auth user' }, { status: 500 })
    }

    await supabase.from('users').upsert({
      id: authUser.user.id,
      email: email.toLowerCase(),
      user_role: 'market_director',
      current_milemarker: 1,
    }, { onConflict: 'email' })

    await supabase.from('staff_accounts').upsert({
      email: email.toLowerCase(),
      full_name,
      role: 'market_director',
      metro,
      status: 'active',
    }, { onConflict: 'email' })

    const key = process.env.RESEND_API_KEY
    if (key) {
      const resend = new Resend(key)
      await resend.emails.send({
        from: 'Craig Asbach, HavenQuest <craig.asbach@havenquest.co>',
        to: email,
        subject: 'Welcome to HavenQuest — Your COMPASS login is ready',
        html: buildWelcomeEmail(full_name, email, tempPassword, metro),
      }).catch(err => console.error('[provision-staff] welcome email error:', err))
    }

    await supabase.from('admin_audit_log').insert({
      admin_email: caller.email,
      action: 'provision_staff',
      target_email: email,
      details: { full_name, metro, role: 'market_director' },
    })

    return NextResponse.json({
      ok: true,
      checklist: { accountCreated: true, roleSet: true },
    })
  } catch (err) {
    console.error('[provision-staff] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
