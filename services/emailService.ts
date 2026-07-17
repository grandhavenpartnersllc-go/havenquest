import { CityMatch, UserProfile } from '../types'

export interface WelcomeEmailData {
  firstName: string
  email: string
  matches: CityMatch[]
  setupLink?: string
}

export interface RealtorIntroEmailData {
  firstName: string
  email: string
  city: string
  realtorName: string
  realtorPhone: string
  realtorWebsite: string
}

export interface LeadNotificationData {
  firstName: string
  city: string
  profile: UserProfile
  matchScore: number
  timeline: string
}

export interface Stage1NotificationData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  marketSpecialty?: string
  referralSource?: string
}

export interface RealtorApplicationEmailData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  marketSpecialty?: string
  brokerage?: string
  trecLicenseNumber: string
  licenseType?: string
  yearsExperience?: string | number
  profileUrl?: string
  marketSegments?: string[]
  buyerTransactionCount?: number
  buyerTransactionVolume?: number
  sellerTransactionCount?: number
  sellerTransactionVolume?: number
  whyJoin?: string
  standardsAcknowledged?: boolean
}

export function buildWelcomeEmailHtml(data: WelcomeEmailData): string {
  const matchList = data.matches
    .map(m => `<li style="margin-bottom:6px;"><strong style="color:#1C1814;">${m.location.name}, TX</strong> <span style="color:#9A8E82;">— ${m.matchScore}% match</span></li>`)
    .join('')

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;max-width:600px;margin:0 auto;color:#1A1A1A;">
      <div style="background:#16120D;padding:32px;border-radius:12px 12px 0 0;">
        <p style="color:#B8912A;font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 8px;">Texas Relocation Intelligence</p>
        <h1 style="color:#F0EDE6;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.02em;">Haven<span style="color:#B8912A;">Quest</span></h1>
      </div>
      <div style="padding:32px;background:#FFFFFF;border:1px solid #E5E7EB;border-top:none;">
        <h2 style="font-size:20px;font-weight:700;margin:0 0 8px;color:#16120D;letter-spacing:-0.01em;">Your report is ready, ${data.firstName}.</h2>
        <p style="color:#4A4A4A;line-height:1.6;margin:0 0 20px;">Here are your top Texas city matches based on your income and priorities:</p>
        <ul style="background:#F7F5F2;border-radius:8px;padding:16px 16px 16px 32px;margin:0 0 24px;border-left:3px solid #B8912A;">
          ${matchList}
        </ul>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/results" style="display:inline-block;background:#B8912A;color:#16120D;padding:13px 26px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">View Full Report →</a>
        ${data.setupLink ? `
        <div style="margin-top:24px;padding:20px;background:#F7F5F2;border-radius:8px;border:1px solid #DDD8D0;">
          <p style="margin:0 0 4px;font-weight:700;color:#16120D;">Set up your HavenQuest portal</p>
          <p style="margin:0 0 16px;color:#6B7280;font-size:14px;line-height:1.5;">Create a password to access your full report, city guides, and relocation tools — from any device, anytime.</p>
          <a href="${data.setupLink}" style="display:inline-block;background:#16120D;color:#F0EDE6;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Set My Portal Password →</a>
        </div>
        ` : `<p style="margin-top:24px;"><a href="${process.env.NEXT_PUBLIC_SITE_URL}/portal" style="color:#B8912A;font-weight:600;">Go to your HavenQuest portal →</a></p>`}
      </div>
      <div style="padding:16px 32px;background:#F7F5F2;border-radius:0 0 12px 12px;text-align:center;">
        <p style="color:#9A8E82;font-size:12px;margin:0;">The HavenQuest Team · <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color:#9A8E82;">havenquest.co</a></p>
      </div>
    </div>
  `
}

export function buildRealtorIntroHtml(data: RealtorIntroEmailData): string {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;max-width:600px;margin:0 auto;color:#1A1A1A;">
      <div style="background:#16120D;padding:32px;border-radius:12px 12px 0 0;">
        <p style="color:#B8912A;font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 8px;">Texas Relocation Intelligence</p>
        <h1 style="color:#F0EDE6;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.02em;">Haven<span style="color:#B8912A;">Quest</span></h1>
      </div>
      <div style="padding:32px;background:#FFFFFF;border:1px solid #E5E7EB;border-top:none;">
        <h2 style="font-size:20px;font-weight:700;margin:0 0 8px;color:#16120D;letter-spacing:-0.01em;">Your matched realtor in ${data.city}, ${data.firstName}.</h2>
        <p style="color:#4A4A4A;line-height:1.6;margin:0 0 20px;">You expressed interest in connecting with a local expert. Here is your matched professional in ${data.city}:</p>
        <div style="background:#F7F5F2;border-radius:8px;padding:20px;margin-bottom:24px;border-left:3px solid #B8912A;">
          <p style="font-weight:700;margin:0 0 2px;color:#16120D;">${data.realtorName}</p>
          <p style="color:#9A8E82;margin:0 0 12px;font-size:13px;">${data.city}, TX</p>
          <p style="margin:4px 0;font-size:14px;"><a href="tel:${data.realtorPhone}" style="color:#B8912A;font-weight:600;">${data.realtorPhone}</a></p>
          <p style="margin:4px 0;font-size:14px;"><a href="https://${data.realtorWebsite}" style="color:#B8912A;">${data.realtorWebsite}</a></p>
        </div>
        <p style="color:#6B7280;font-size:14px;line-height:1.6;margin:0;">Tip: When you reach out, mention you came through HavenQuest and share your income range, timeline, and the neighborhoods you're most interested in.</p>
      </div>
      <div style="padding:16px 32px;background:#F7F5F2;border-radius:0 0 12px 12px;text-align:center;">
        <p style="color:#9A8E82;font-size:12px;margin:0;">The HavenQuest Team · <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color:#9A8E82;">havenquest.co</a></p>
      </div>
    </div>
  `
}

export function buildLeadNotificationHtml(data: LeadNotificationData): string {
  return `
    <div style="font-family: monospace; max-width: 600px; margin: 0 auto; color: #1A1A1A;">
      <h2>New HavenQuest Lead — ${data.city}</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Name</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.firstName}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">City</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.city}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Income</td><td style="padding: 8px; border: 1px solid #E5E7EB;">$${data.profile.annualIncome.toLocaleString()}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Household</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.profile.householdSize}</td></tr>
<tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Timeline</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.timeline}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Top priority</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.profile.mustHaves.join(', ')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Match Score</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.matchScore}%</td></tr>
      </table>
    </div>
  `
}

export function buildReportReadyEmailHtml(firstName: string, cityNames: string[]): string {
  const cityList = cityNames.map(n => `<li style="margin-bottom:4px;">${n}, TX</li>`).join('')
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;max-width:600px;margin:0 auto;color:#1A1A1A;">
      <div style="background:#16120D;padding:32px;border-radius:12px 12px 0 0;">
        <h1 style="color:#F0EDE6;margin:0;font-size:22px;font-weight:700;">Haven<span style="color:#B8912A;">Quest</span></h1>
      </div>
      <div style="padding:32px;background:#FFFFFF;border:1px solid #E5E7EB;">
        <h2 style="font-size:20px;font-weight:600;margin:0 0 12px;">Welcome to HavenQuest, ${firstName}.</h2>
        <p style="color:#4A4A4A;line-height:1.6;margin:0 0 16px;">Your Texas relocation report is ready and attached to this email as a PDF. It covers your top three matched cities based on your income, household, and priorities.</p>
        <p style="color:#4A4A4A;line-height:1.6;margin:0 0 8px;">Your matches:</p>
        <ul style="background:#F7F5F2;border-radius:8px;padding:14px 14px 14px 32px;margin:0 0 20px;">${cityList}</ul>
        <p style="color:#4A4A4A;line-height:1.6;margin:0 0 20px;">Your private portal has the full breakdown — affordability, schools, market conditions, and local realtor connections — all in one place.</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/portal" style="display:inline-block;background:#1A5FA8;color:#FFFFFF;padding:13px 26px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Go to My Portal →</a>
      </div>
      <div style="padding:16px 32px;background:#F7F5F2;border-radius:0 0 12px 12px;text-align:center;">
        <p style="color:#9A8E82;font-size:12px;margin:0;">The HavenQuest Team · <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color:#9A8E82;">havenquest.co</a></p>
      </div>
    </div>
  `
}

export function buildStage1RealtorEmailHtml(firstName: string, token: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://havenquest.co'
  const applicationLink = `${siteUrl}/realtors/applywithhavenquest?token=${token}`
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;max-width:600px;margin:0 auto;color:#1A1A1A;">
      <div style="background:#16120D;padding:32px;border-radius:12px 12px 0 0;">
        <p style="color:#B8912A;font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 8px;">Texas Relocation Intelligence</p>
        <h1 style="color:#F0EDE6;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.02em;">Haven<span style="color:#B8912A;">Quest</span></h1>
      </div>
      <div style="padding:32px;background:#FFFFFF;border:1px solid #E5E7EB;border-top:none;">
        <p style="color:#4A4A4A;line-height:1.7;margin:0 0 16px;">Hi ${firstName},</p>
        <p style="color:#4A4A4A;line-height:1.7;margin:0 0 16px;">Something new is happening in Texas real estate, and I think you're exactly the kind of agent who will get it immediately.</p>
        <p style="color:#4A4A4A;line-height:1.7;margin:0 0 16px;">HavenQuest is a relocation intelligence platform built for people moving to Texas. Not tourists. Not tire-kickers. People who have made a serious decision, matched themselves to a specific Texas city based on their income, lifestyle, and priorities — and are now ready to find a home.</p>
        <p style="color:#4A4A4A;line-height:1.7;margin:0 0 16px;">By the time they reach you, they already know which city they want. They already understand the market. They've already run their numbers. All they need is the right agent to take them across the finish line.</p>
        <p style="color:#4A4A4A;line-height:1.7;margin:0 0 16px;">We curate a small shortlist of three partners per market segment per zone. Buyers read your profile and choose who they want to work with. When they choose you, that introduction is warm, informed, and intentional — not a cold lead dropped in your lap.</p>
        <p style="color:#4A4A4A;line-height:1.7;margin:0 0 24px;">This is not a lead service. This is a partnership.</p>
        <p style="color:#4A4A4A;line-height:1.7;margin:0 0 24px;">You've taken the first step by expressing interest. The next step is your application. The link below is private and was created specifically for you — it takes about 10 minutes to complete.</p>
        <a href="${applicationLink}" style="display:inline-block;background:#B8912A;color:#16120D;padding:13px 26px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">Complete My Application →</a>
        <p style="color:#4A4A4A;line-height:1.7;margin:24px 0 16px;">I want to be straightforward with you — we don't accept everyone. Every application is reviewed personally, and we limit the number of partners in each market by design. But if you're the right fit, this is an opportunity worth your attention.</p>
        <p style="color:#4A4A4A;line-height:1.7;margin:0 0 24px;">You'll hear from me within 5 business days.</p>
        <p style="color:#4A4A4A;line-height:1.7;margin:0 0 2px;font-weight:600;">Craig Asbach</p>
        <p style="color:#6B7280;font-size:14px;margin:0 0 2px;">Founder, HavenQuest</p>
        <p style="margin:0;font-size:14px;"><a href="mailto:craig.asbach@havenquest.co" style="color:#B8912A;">craig.asbach@havenquest.co</a></p>
      </div>
      <div style="padding:16px 32px;background:#F7F5F2;border-radius:0 0 12px 12px;text-align:center;">
        <p style="color:#9A8E82;font-size:12px;margin:0;">The HavenQuest Team · <a href="${siteUrl}" style="color:#9A8E82;">havenquest.co</a></p>
      </div>
    </div>
  `
}

export function buildStage1CraigNotificationHtml(data: Stage1NotificationData): string {
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' })
  return `
    <div style="font-family: monospace; max-width: 600px; margin: 0 auto; color: #1A1A1A;">
      <h2>New Realtor Interest — ${data.firstName} ${data.lastName}</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Name</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.firstName} ${data.lastName}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Email</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.email}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Phone</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.phone || '—'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Market Specialty</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.marketSpecialty || '—'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Referral Source</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.referralSource || '—'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Submitted</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${timestamp} CT</td></tr>
      </table>
    </div>
  `
}

export function buildRealtorApplicationHtml(data: RealtorApplicationEmailData): string {
  const totalCount = (data.buyerTransactionCount ?? 0) + (data.sellerTransactionCount ?? 0)
  const totalVolume = (data.buyerTransactionVolume ?? 0) + (data.sellerTransactionVolume ?? 0)
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' })
  return `
    <div style="font-family: monospace; max-width: 600px; margin: 0 auto; color: #1A1A1A;">
      <h2>New Realtor Application — ${data.firstName} ${data.lastName} — ${data.marketSpecialty || 'No market specified'}</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Name</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.firstName} ${data.lastName}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Email</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.email}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Phone</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.phone || '—'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Market Zone</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.marketSpecialty || '—'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Market Segments</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.marketSegments?.join(', ') || '—'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Brokerage</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.brokerage || '—'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">TREC License #</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.trecLicenseNumber}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">License Type</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.licenseType || '—'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Years Licensed</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.yearsExperience || '—'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Profile URL</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.profileUrl || '—'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Buyer Transactions</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.buyerTransactionCount ?? 0} deals · $${(data.buyerTransactionVolume ?? 0).toLocaleString()}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Seller Transactions</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.sellerTransactionCount ?? 0} deals · $${(data.sellerTransactionVolume ?? 0).toLocaleString()}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Total Production</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${totalCount} deals · $${totalVolume.toLocaleString()}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Standards Acknowledged</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${data.standardsAcknowledged ? 'Yes' : 'No'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500; vertical-align: top;">Fit Response</td><td style="padding: 8px; border: 1px solid #E5E7EB; white-space: pre-wrap;">${data.whyJoin || '—'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 500;">Submitted</td><td style="padding: 8px; border: 1px solid #E5E7EB;">${timestamp} CT</td></tr>
      </table>
    </div>
  `
}

export function buildRealtorConfirmationHtml(firstName: string): string {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;max-width:600px;margin:0 auto;color:#1A1A1A;">
      <div style="background:#16120D;padding:32px;border-radius:12px 12px 0 0;">
        <p style="color:#B8912A;font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 8px;">Texas Relocation Intelligence</p>
        <h1 style="color:#F0EDE6;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.02em;">Haven<span style="color:#B8912A;">Quest</span></h1>
      </div>
      <div style="padding:32px;background:#FFFFFF;border:1px solid #E5E7EB;border-top:none;">
        <p style="color:#4A4A4A;line-height:1.7;margin:0 0 16px;">Hi ${firstName},</p>
        <p style="color:#4A4A4A;line-height:1.7;margin:0 0 16px;">Your application has been received.</p>
        <p style="color:#4A4A4A;line-height:1.7;margin:0 0 16px;">I review every application personally. You can expect to hear from me within 5 business days with a decision or next steps.</p>
        <p style="color:#4A4A4A;line-height:1.7;margin:0 0 24px;">In the meantime — thank you for taking the time to share your story. The question we ask — what makes you the right fit for relocating buyers — matters more to us than your production numbers. We are looking for partners who genuinely care about the people they serve.</p>
        <p style="color:#4A4A4A;line-height:1.7;margin:0 0 2px;font-weight:600;">Craig Asbach</p>
        <p style="color:#6B7280;font-size:14px;margin:0 0 2px;">Founder, HavenQuest</p>
        <p style="margin:0;font-size:14px;"><a href="mailto:craig.asbach@havenquest.co" style="color:#B8912A;">craig.asbach@havenquest.co</a></p>
      </div>
      <div style="padding:16px 32px;background:#F7F5F2;border-radius:0 0 12px 12px;text-align:center;">
        <p style="color:#9A8E82;font-size:12px;margin:0;">— The HavenQuest Team</p>
      </div>
    </div>
  `
}
