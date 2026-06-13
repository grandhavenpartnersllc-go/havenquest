import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { createServerClient } from '../../../../lib/supabase/server'
import type { Message } from '../../../../types'

const FROM_ADDRESS = 'Craig Asbach, HavenQuest <craig.asbach@havenquest.co>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://havenquest.co'

function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

function buildNotificationEmail(firstName: string, subject: string | undefined, body: string): string {
  const subjectLine = subject ? `<p style="margin:0 0 16px;font-size:14px;font-weight:600;color:#0A1E3D;">${subject}</p>` : ''
  const portalUrl = `${SITE_URL}/portal`

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New message from your Market Director</title></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#0A1E3D;border-radius:12px 12px 0 0;padding:24px 32px 20px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.14em;color:#C5B783;text-transform:uppercase;font-weight:600;">HavenQuest Navigator</p>
            <p style="margin:8px 0 0;font-size:20px;font-weight:700;color:#ffffff;line-height:1.25;">New message from your Market Director</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px 32px 24px;">
            <p style="margin:0 0 20px;font-size:15px;color:#1a1a2e;line-height:1.65;">${firstName},</p>
            ${subjectLine}
            <p style="margin:0 0 24px;font-size:15px;color:#1a1a2e;line-height:1.65;">
              Your Market Director has sent you a message in your HavenQuest Navigator portal.
            </p>

            <!-- Message preview -->
            <div style="background:#F8FAFC;border-left:3px solid #0076B6;border-radius:0 8px 8px 0;padding:14px 16px;margin-bottom:28px;">
              <p style="margin:0;font-size:14px;color:#374151;line-height:1.65;white-space:pre-wrap;">${body.length > 300 ? body.slice(0, 300) + '…' : body}</p>
            </div>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
              <tr>
                <td style="border-radius:8px;background:#0A1E3D;">
                  <a href="${portalUrl}" target="_blank"
                     style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#C5B783;text-decoration:none;letter-spacing:0.01em;">
                    View Message in Portal →
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#8a93a0;line-height:1.5;">
              Log in to reply and continue your conversation with your Market Director.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#ffffff;border-top:1px solid #e8eaf0;padding:20px 32px 28px;border-radius:0 0 12px 12px;">
            <p style="margin:0;font-size:14px;color:#0A1E3D;font-weight:600;">Craig Asbach</p>
            <p style="margin:2px 0 0;font-size:13px;color:#8a93a0;">Market Director — HavenQuest</p>
            <a href="mailto:craig.asbach@havenquest.co" style="font-size:13px;color:#0076B6;text-decoration:none;">craig.asbach@havenquest.co</a>
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
    // Verify caller is authenticated as an MD
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('hq_auth')?.value
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const callerClient = createServerClient(accessToken)
    const { data: callerUser } = await callerClient
      .from('users')
      .select('user_role, email')
      .single()

    if (callerUser?.user_role !== 'market_director') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json() as {
      mdEmail: string
      clientEmail: string
      clientFirstName: string
      subject?: string
      body: string
    }

    const { mdEmail, clientEmail, clientFirstName, subject, body: messageBody } = body

    if (!mdEmail || !clientEmail || !messageBody?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify the md_email matches the authenticated user
    if (callerUser.email?.toLowerCase() !== mdEmail.toLowerCase()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const service = createServiceClient()

    // Insert message record
    const { data: inserted, error: insertError } = await service
      .from('messages')
      .insert({
        client_email: clientEmail,
        md_email: mdEmail,
        sender_role: 'md',
        subject: subject ?? null,
        body: messageBody.trim(),
        read: false,
        notification_sent: false,
      })
      .select()
      .single()

    if (insertError || !inserted) {
      console.error('[md/send-message] insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }

    // Send Resend notification — fire and update flag
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      try {
        const resend = new Resend(resendKey)
        await resend.emails.send({
          from: FROM_ADDRESS,
          replyTo: 'craig.asbach@havenquest.co',
          to: clientEmail,
          subject: 'New message from your Market Director — HavenQuest',
          html: buildNotificationEmail(clientFirstName, subject, messageBody.trim()),
        })

        await service
          .from('messages')
          .update({ notification_sent: true })
          .eq('id', inserted.id)

        inserted.notification_sent = true
      } catch (emailErr) {
        console.error('[md/send-message] Resend error:', emailErr)
      }
    } else {
      console.warn('[md/send-message] RESEND_API_KEY not set — notification skipped')
    }

    return NextResponse.json({ message: inserted as Message })
  } catch (err) {
    console.error('[md/send-message] route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
