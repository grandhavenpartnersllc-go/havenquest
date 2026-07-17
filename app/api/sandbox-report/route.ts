import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      email, firstName, topCity, topScore,
      mustHaves, niceToHaves,
      downPayment, proceeds, interestRate,
      monthlyMortgage, monthlyPropertyTax, totalMonthlyHousing,
      topCities,
    } = body

    const citiesHtml = topCities.map((c: { name: string; metro: string; score: number }, i: number) =>
      `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #F0EDE6;font-weight:600;color:#16120D;">#${i+1} ${c.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #F0EDE6;color:#6B7280;">${c.metro}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #F0EDE6;font-weight:700;color:#B8912A;">${c.score}</td>
      </tr>`
    ).join('')

    await resend.emails.send({
      from: 'HavenQuest <admin@send.havenquest.co>',
      to: email,
      replyTo: 'admin@havenquest.co',
      subject: `${firstName}, your HavenQuest plan summary`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#F7F6F3;margin:0;padding:32px 16px;">
          <div style="max-width:560px;margin:0 auto;background:#FDFCFA;border-radius:16px;overflow:hidden;">

            <div style="background:#16120D;padding:32px;text-align:center;">
              <p style="color:#B8912A;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">HavenQuest Navigator</p>
              <h1 style="color:#FFFFFF;font-size:22px;font-weight:700;margin:0;">${firstName}, your plan is locked in.</h1>
              <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:12px 0 0;">Here's a summary of your committed direction.</p>
            </div>

            <div style="padding:32px;">

              <div style="background:#F0FAF4;border:1px solid #C6E8D4;border-radius:12px;padding:16px;margin-bottom:24px;">
                <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#2D7D4E;margin:0 0 4px;">Top match</p>
                <p style="font-size:20px;font-weight:700;color:#16120D;margin:0;">${topCity}</p>
                <p style="font-size:13px;color:#4B7A5E;margin:4px 0 0;">Match score: ${topScore}</p>
              </div>

              <div style="margin-bottom:24px;">
                <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#9A8E82;margin:0 0 8px;">Your top 5 cities</p>
                <table style="width:100%;border-collapse:collapse;background:#F7F6F3;border-radius:12px;overflow:hidden;">
                  <thead>
                    <tr style="background:#F0EDE6;">
                      <th style="padding:8px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#9A8E82;">City</th>
                      <th style="padding:8px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#9A8E82;">Metro</th>
                      <th style="padding:8px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#9A8E82;">Score</th>
                    </tr>
                  </thead>
                  <tbody>${citiesHtml}</tbody>
                </table>
              </div>

              ${mustHaves.length > 0 ? `
              <div style="margin-bottom:24px;">
                <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#9A8E82;margin:0 0 8px;">Top priority</p>
                <p style="font-size:14px;color:#16120D;margin:0;">${mustHaves.join(' · ')}</p>
              </div>` : ''}

              ${niceToHaves.length > 0 ? `
              <div style="margin-bottom:24px;">
                <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#9A8E82;margin:0 0 8px;">Really matters</p>
                <p style="font-size:14px;color:#16120D;margin:0;">${niceToHaves.join(' · ')}</p>
              </div>` : ''}

              <div style="background:#F7F6F3;border-radius:12px;padding:16px;margin-bottom:24px;">
                <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#9A8E82;margin:0 0 12px;">Financial picture</p>
                <table style="width:100%;">
                  <tr><td style="font-size:13px;color:#6B7280;padding:3px 0;">Down payment</td><td style="font-size:13px;font-weight:600;color:#16120D;text-align:right;">${downPayment}</td></tr>
                  ${proceeds ? `<tr><td style="font-size:13px;color:#6B7280;padding:3px 0;">Home proceeds</td><td style="font-size:13px;font-weight:600;color:#16120D;text-align:right;">${proceeds}</td></tr>` : ''}
                  <tr><td style="font-size:13px;color:#6B7280;padding:3px 0;">Rate assumption</td><td style="font-size:13px;font-weight:600;color:#16120D;text-align:right;">${Number(interestRate).toFixed(2)}%</td></tr>
                  <tr><td style="font-size:13px;color:#6B7280;padding:3px 0;">Est. monthly mortgage</td><td style="font-size:13px;font-weight:600;color:#16120D;text-align:right;">$${Number(monthlyMortgage).toLocaleString()}/mo</td></tr>
                  <tr><td style="font-size:13px;color:#6B7280;padding:3px 0;">Est. property tax</td><td style="font-size:13px;font-weight:600;color:#16120D;text-align:right;">$${Number(monthlyPropertyTax).toLocaleString()}/mo</td></tr>
                  <tr style="border-top:1px solid #E5E7EB;"><td style="font-size:13px;font-weight:700;color:#16120D;padding:6px 0 3px;">Total monthly housing</td><td style="font-size:13px;font-weight:700;color:#B8912A;text-align:right;padding:6px 0 3px;">$${Number(totalMonthlyHousing).toLocaleString()}/mo</td></tr>
                </table>
              </div>

              <div style="background:#16120D;border-radius:12px;padding:20px;text-align:center;">
                <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0 0 4px;">Your Market Director will be in touch within 24 hours.</p>
                <p style="color:#B8912A;font-size:13px;font-weight:600;margin:0;">The wheel stays in your hands. We just help you find the best route.</p>
              </div>

            </div>

            <div style="padding:16px 32px;border-top:1px solid #F0EDE6;text-align:center;">
              <p style="font-size:11px;color:#C5BFB8;margin:0;">HavenQuest · Texas Relocation Intelligence · <a href="https://havenquest.co" style="color:#B8912A;">havenquest.co</a></p>
            </div>

          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
