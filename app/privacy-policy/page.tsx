import type { Metadata } from 'next'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | HavenQuest',
  description: 'HavenQuest privacy policy — how we collect, use, and protect your personal information.',
}

const NAVY = '#0A1E3D'
const MUTED = '#6B7280'
const GOLD = '#C5B783'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: NAVY, marginTop: '36px', marginBottom: '12px' }}>{title}</h2>
      <div style={{ fontSize: '14px', color: MUTED, lineHeight: 1.85 }}>{children}</div>
    </section>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1" style={{ background: '#fff' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 32px 80px' }}>

          <h1 style={{ fontSize: '32px', fontWeight: 700, color: NAVY, marginBottom: '8px' }}>Privacy Policy</h1>
          <p style={{ fontSize: '13px', color: MUTED, marginBottom: '24px' }}>Effective Date: June 7, 2026</p>

          {/* Attorney review notice */}
          <div style={{
            background: '#FDFAF4',
            border: `1px solid ${GOLD}`,
            borderRadius: '8px',
            padding: '14px 18px',
            marginBottom: '32px',
            fontSize: '13px',
            color: MUTED,
          }}>
            This policy is currently under attorney review and will be updated prior to public launch. The information below represents our current practices and intent.
          </div>

          <p style={{ fontSize: '14px', color: MUTED, lineHeight: 1.85, marginBottom: '4px' }}>
            <em>Last Updated: June 7, 2026</em><br />
            <em>Operated by: HavenQuest | Grand Haven Partners</em>
          </p>

          <Section title="1. Introduction">
            <p>HavenQuest (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is a Texas relocation intelligence platform operated by Grand Haven Partners. We are committed to protecting your personal information and being transparent about how we use it.</p>
            <p style={{ marginTop: '12px' }}>This Privacy Policy explains what information we collect, how we use it, who we share it with, and your rights regarding your data. By using HavenQuest, you agree to the practices described in this policy.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p style={{ fontWeight: 500, color: NAVY, marginBottom: '8px' }}>Information you provide directly:</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li>Name and email address (collected at account creation)</li>
              <li>Household size and home type preferences</li>
              <li>Annual household income and financial information</li>
              <li>Lifestyle priorities and preferences</li>
              <li>Down payment range and home sale proceeds</li>
              <li>Any information submitted through the HavenQuest Navigator quiz</li>
            </ul>
            <p style={{ fontWeight: 500, color: NAVY, marginBottom: '8px' }}>Information collected automatically:</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li>Device type, browser type, and operating system</li>
              <li>IP address and general geographic location</li>
              <li>Pages visited and actions taken within the platform</li>
              <li>Session duration and navigation patterns</li>
            </ul>
            <p style={{ fontWeight: 500, color: NAVY, marginBottom: '8px' }}>Information from third parties:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>We do not currently purchase or receive personal data from third-party data brokers.</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <p style={{ marginBottom: '12px' }}>We use the information we collect to:</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li>Match you to Texas communities based on your stated priorities and financial profile</li>
              <li>Personalize your Navigator experience and portal content</li>
              <li>Connect you with your assigned Market Director and Select Agent</li>
              <li>Send you relevant communications about your relocation journey</li>
              <li>Improve our matching algorithm and platform features</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p style={{ fontWeight: 500, color: NAVY, marginBottom: '8px' }}>We do not use your information to:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Sell advertising</li>
              <li>Build profiles for sale to third parties</li>
              <li>Send unsolicited marketing from partner companies</li>
            </ul>
          </Section>

          <Section title="4. How We Share Your Information">
            <p style={{ fontWeight: 500, color: NAVY, marginBottom: '8px' }}>With Market Directors and Select Agents:</p>
            <p style={{ marginBottom: '16px' }}>When you reach the appropriate stage in your Navigator journey, your profile information — including your community preferences, financial picture, and lifestyle priorities — is shared with your assigned Market Director and Select Agent. This is the core function of the platform. You will be notified before this introduction occurs.</p>
            <p style={{ fontWeight: 500, color: NAVY, marginBottom: '8px' }}>With service providers:</p>
            <p style={{ marginBottom: '8px' }}>We use the following third-party services to operate the platform:</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Supabase</strong> — database and authentication</li>
              <li><strong>Vercel</strong> — hosting and deployment</li>
              <li><strong>Resend</strong> — transactional email delivery</li>
            </ul>
            <p style={{ marginBottom: '16px' }}>These providers access your information only as necessary to provide their services and are bound by confidentiality obligations.</p>
            <p style={{ fontWeight: 500, color: NAVY, marginBottom: '8px' }}>For legal compliance:</p>
            <p style={{ marginBottom: '16px' }}>We may disclose your information if required by law, court order, or to protect the rights and safety of HavenQuest, our users, or the public.</p>
            <p><strong style={{ color: NAVY }}>We do not sell your personal information.</strong> Ever.</p>
          </Section>

          <Section title="5. Data Security">
            <p style={{ marginBottom: '12px' }}>We implement industry-standard security measures to protect your information, including:</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Secure database storage via Supabase with row-level security policies</li>
              <li>Access controls limiting which team members can view personal data</li>
              <li>Regular security review of our platform and infrastructure</li>
            </ul>
            <p>No method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security, but we take reasonable measures to protect your information.</p>
          </Section>

          <Section title="6. Data Retention">
            <p>We retain your personal information for as long as your account is active or as needed to provide services. If you request deletion of your account, we will delete or anonymize your personal data within 30 days, except where retention is required by law or legitimate business purposes (such as completed transaction records).</p>
          </Section>

          <Section title="7. Your Rights">
            <p style={{ marginBottom: '12px' }}>You have the right to:</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong style={{ color: NAVY }}>Access</strong> the personal information we hold about you</li>
              <li><strong style={{ color: NAVY }}>Correct</strong> inaccurate or incomplete information</li>
              <li><strong style={{ color: NAVY }}>Delete</strong> your account and associated personal data</li>
              <li><strong style={{ color: NAVY }}>Export</strong> your data in a portable format</li>
              <li><strong style={{ color: NAVY }}>Opt out</strong> of non-essential communications at any time</li>
            </ul>
            <p>To exercise any of these rights, contact us at: <strong style={{ color: NAVY }}>privacy@havenquest.co</strong></p>
          </Section>

          <Section title="8. Cookies and Tracking">
            <p style={{ marginBottom: '12px' }}>HavenQuest uses cookies and similar technologies to:</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li>Maintain your login session</li>
              <li>Remember your Navigator progress</li>
              <li>Analyze platform usage to improve the experience</li>
            </ul>
            <p style={{ marginBottom: '12px' }}>You can control cookie settings through your browser. Disabling cookies may affect platform functionality, including the ability to stay logged in.</p>
            <p>We do not currently use third-party advertising cookies or tracking pixels.</p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>HavenQuest is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately at privacy@havenquest.co.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email or by posting a notice on the platform. Your continued use of HavenQuest after changes are posted constitutes your acceptance of the updated policy.</p>
          </Section>

          <Section title="11. Contact Us">
            <p style={{ marginBottom: '4px' }}>If you have questions about this Privacy Policy or our privacy practices, please contact us:</p>
            <p style={{ marginTop: '12px' }}>
              <strong style={{ color: NAVY }}>HavenQuest | Grand Haven Partners</strong><br />
              Email: privacy@havenquest.co<br />
              Website: havenquest.co
            </p>
          </Section>

          <p style={{ fontSize: '13px', color: MUTED, fontStyle: 'italic', marginTop: '40px', paddingTop: '24px', borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
            This policy is pending final review by a licensed Texas attorney. It will be updated prior to full public launch.
          </p>

        </div>
      </main>
      <Footer />
    </>
  )
}
