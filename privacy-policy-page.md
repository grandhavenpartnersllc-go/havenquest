# HavenQuest — Privacy Policy Page Build Brief
**Date:** June 7, 2026  
**Prepared by:** Claude (COO)  
**Executed by:** Claude Code  
**Branch:** main  

---

## Overview

Create a new public-facing Privacy Policy page at `/privacy-policy`. Update the footer Privacy link to point to this page. The page contains a substantive placeholder policy pending final attorney review.

---

## Page Route

Create: `app/privacy-policy/page.tsx`

This is a public page — no authentication required. Uses the standard public site layout (same nav and footer as homepage).

---

## SEO Metadata

```typescript
export const metadata = {
  title: 'Privacy Policy | HavenQuest',
  description: 'HavenQuest privacy policy — how we collect, use, and protect your personal information.',
}
```

---

## Page Design

Clean, document-style layout. Max-width 760px, centered, generous padding. White background. No hero image. Standard nav and footer.

- Page title (H1, 32px, font-weight 700, `#0A1E3D`): `Privacy Policy`
- Effective date line (13px, muted): `Effective Date: June 7, 2026`
- Attorney review notice (gold-bordered callout box, `background: #FDFAF4`, `border: 1px solid #C5B783`, border-radius 8px, padding 14px 18px, margin-bottom 32px, font-size 13px, muted):
  `This policy is currently under attorney review and will be updated prior to public launch. The information below represents our current practices and intent.`
- Section headings: H2, 18px, font-weight 600, `#0A1E3D`, margin-top 36px
- Body text: 14px, muted, line-height 1.85

---

## Privacy Policy Content

Use this exact content:

---

**Privacy Policy**

*Effective Date: June 7, 2026*
*Last Updated: June 7, 2026*
*Operated by: HavenQuest | Grand Haven Partners*

---

### 1. Introduction

HavenQuest ("we," "us," or "our") is a Texas relocation intelligence platform operated by Grand Haven Partners. We are committed to protecting your personal information and being transparent about how we use it.

This Privacy Policy explains what information we collect, how we use it, who we share it with, and your rights regarding your data. By using HavenQuest, you agree to the practices described in this policy.

---

### 2. Information We Collect

**Information you provide directly:**
- Name and email address (collected at account creation)
- Household size and home type preferences
- Annual household income and financial information
- Lifestyle priorities and preferences
- Down payment range and home sale proceeds
- Any information submitted through the HavenQuest Navigator quiz

**Information collected automatically:**
- Device type, browser type, and operating system
- IP address and general geographic location
- Pages visited and actions taken within the platform
- Session duration and navigation patterns

**Information from third parties:**
- We do not currently purchase or receive personal data from third-party data brokers.

---

### 3. How We Use Your Information

We use the information we collect to:

- Match you to Texas communities based on your stated priorities and financial profile
- Personalize your Navigator experience and portal content
- Connect you with your assigned Market Director and Select Agent
- Send you relevant communications about your relocation journey
- Improve our matching algorithm and platform features
- Comply with legal obligations

**We do not use your information to:**
- Sell advertising
- Build profiles for sale to third parties
- Send unsolicited marketing from partner companies

---

### 4. How We Share Your Information

**With Market Directors and Select Agents:**
When you reach the appropriate stage in your Navigator journey, your profile information — including your community preferences, financial picture, and lifestyle priorities — is shared with your assigned Market Director and Select Agent. This is the core function of the platform. You will be notified before this introduction occurs.

**With service providers:**
We use the following third-party services to operate the platform:
- **Supabase** — database and authentication
- **Vercel** — hosting and deployment
- **Resend** — transactional email delivery

These providers access your information only as necessary to provide their services and are bound by confidentiality obligations.

**For legal compliance:**
We may disclose your information if required by law, court order, or to protect the rights and safety of HavenQuest, our users, or the public.

**We do not sell your personal information.** Ever.

---

### 5. Data Security

We implement industry-standard security measures to protect your information, including:

- Encrypted data transmission (HTTPS/TLS)
- Secure database storage via Supabase with row-level security policies
- Access controls limiting which team members can view personal data
- Regular security review of our platform and infrastructure

No method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security, but we take reasonable measures to protect your information.

---

### 6. Data Retention

We retain your personal information for as long as your account is active or as needed to provide services. If you request deletion of your account, we will delete or anonymize your personal data within 30 days, except where retention is required by law or legitimate business purposes (such as completed transaction records).

---

### 7. Your Rights

You have the right to:

- **Access** the personal information we hold about you
- **Correct** inaccurate or incomplete information
- **Delete** your account and associated personal data
- **Export** your data in a portable format
- **Opt out** of non-essential communications at any time

To exercise any of these rights, contact us at: **privacy@havenquest.co**

---

### 8. Cookies and Tracking

HavenQuest uses cookies and similar technologies to:

- Maintain your login session
- Remember your Navigator progress
- Analyze platform usage to improve the experience

You can control cookie settings through your browser. Disabling cookies may affect platform functionality, including the ability to stay logged in.

We do not currently use third-party advertising cookies or tracking pixels.

---

### 9. Children's Privacy

HavenQuest is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately at privacy@havenquest.co.

---

### 10. Changes to This Policy

We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email or by posting a notice on the platform. Your continued use of HavenQuest after changes are posted constitutes your acceptance of the updated policy.

---

### 11. Contact Us

If you have questions about this Privacy Policy or our privacy practices, please contact us:

**HavenQuest | Grand Haven Partners**
Email: privacy@havenquest.co
Website: havenquest.co

---

*This policy is pending final review by a licensed Texas attorney. It will be updated prior to full public launch.*

---

## Footer Link Update

In the footer component, update the Privacy link:
- **From:** current href (whatever it points to now)
- **To:** `/privacy-policy`
- Label stays: `Privacy`

---

## Final Step — Commit and Deploy

```
git add -A
git commit -m "feat: privacy policy page at /privacy-policy, footer link updated"
git push origin main
```

Confirm push and Vercel deployment. Report back to Claude chat when complete.
