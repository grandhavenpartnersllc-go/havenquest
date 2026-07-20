import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Investor Access capture — clone of app/api/realtor-interest/route.ts. Writes an investor_interest
// row via the ANON client (the table's anon INSERT policy), mints a crypto.randomUUID() token, and
// Resends (1) the applicant their private tokenized link and (2) a notification to Craig. From-addresses
// mirror the realtor route EXACTLY: applicant from craig.asbach@havenquest.co (replyTo same); Craig
// notification from admin@send.havenquest.co. Every DB op beyond this anon INSERT lives in the
// validate / opt-in routes (service-role). Returns { success: true }.

function getSupabaseAnon() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key)
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function buildInvestorEmailHtml(name: string, link: string): string {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;max-width:600px;margin:0 auto;color:#1A1A1A;">
      <div style="padding:40px 40px 38px;">
        <p style="color:#4A4A4A;line-height:1.75;margin:0 0 22px;">Hi ${name},</p>
        <p style="color:#4A4A4A;line-height:1.75;margin:0 0 26px;">Thank you for your interest in HavenQuest. As promised, here&apos;s your private link to the full overview:</p>
        <p style="margin:0 0 12px;text-align:center;"><a href="${link}" style="display:inline-block;background:#0A1E3D;color:#C5B783;padding:15px 30px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14.5px;">Open the HavenQuest overview &rarr;</a></p>
        <p style="text-align:center;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#a48f4e;font-weight:600;margin:0 0 8px;">Your private link</p>
        <p style="color:#6B7280;font-size:12.5px;line-height:1.55;margin:0 0 30px;word-break:break-all;background:#F7F5F0;border:1px solid #ECE8DE;border-radius:8px;padding:12px 14px;text-align:center;">${link}</p>
        <p style="color:#4A4A4A;line-height:1.75;margin:0 0 20px;">It&apos;s an honest look at where we are today and where we&apos;re headed — no obligation, just a chance to see what we&apos;re building. If it resonates and you&apos;d like to talk, you can reach me directly from the page.</p>
        <p style="color:#4A4A4A;line-height:1.75;margin:0 0 30px;">The link is unique to you, so please don&apos;t forward it.</p>
        <p style="color:#4A4A4A;line-height:1.7;margin:0 0 3px;">Warm regards,</p>
        <p style="color:#4A4A4A;line-height:1.7;margin:0 0 3px;font-weight:600;">Craig Asbach</p>
        <p style="color:#6B7280;font-size:14px;margin:0 0 3px;">Founder, HavenQuest</p>
        <p style="margin:0;font-size:14px;"><a href="mailto:craig.asbach@havenquest.co" style="color:#B8912A;">craig.asbach@havenquest.co</a></p>
      </div>
    </div>
  `
}

function buildInvestorNotificationHtml(data: { name: string; email: string; phone: string }): string {
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  return `
    <div style="font-family:monospace;max-width:600px;margin:0 auto;color:#1A1A1A;">
      <h2 style="font-size:16px;margin:0 0 12px;">New Investor Interest</h2>
      <p style="margin:0 0 6px;"><b>Name:</b> ${data.name}</p>
      <p style="margin:0 0 6px;"><b>Email:</b> ${data.email}</p>
      <p style="margin:0 0 6px;"><b>Phone:</b> ${data.phone || '—'}</p>
      <p style="margin:12px 0 0;color:#6B7280;">${timestamp} CT</p>
    </div>
  `
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone } = body ?? {}

    if (!name || !email || !phone || !EMAIL_RE.test(String(email))) {
      return NextResponse.json({ error: 'Name, a valid email, and phone are required' }, { status: 400 })
    }

    const token = crypto.randomUUID()
    const supabase = getSupabaseAnon()

    await supabase.from('investor_interest').insert({
      name,
      email: String(email).toLowerCase(),
      phone: phone || null,
      token,
    })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://havenquest.co'
    const link = `${siteUrl}/investor-9k2x7q?token=${token}`

    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      const resend = new Resend(resendKey)

      try {
        await resend.emails.send({
          from: 'Craig Asbach, Founder - HavenQuest <craig.asbach@havenquest.co>',
          replyTo: 'craig.asbach@havenquest.co',
          to: String(email).toLowerCase(),
          subject: 'Your private link to the HavenQuest overview',
          html: buildInvestorEmailHtml(name, link),
        })
      } catch (err) {
        console.error('Resend investor applicant email error:', err)
      }

      try {
        await resend.emails.send({
          from: 'HavenQuest <admin@send.havenquest.co>',
          to: 'craig.asbach@havenquest.co',
          subject: `New Investor Interest — ${name}`,
          html: buildInvestorNotificationHtml({ name, email: String(email).toLowerCase(), phone }),
        })
      } catch (err) {
        console.error('Resend investor Craig notification error:', err)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Investor interest route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
