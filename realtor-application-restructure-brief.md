# Build Brief — Realtor Application Restructure
**Project:** HavenQuest  
**Date:** May 30, 2026  
**Status:** PENDING — Ready for Claude Code  
**Priority:** High — affects all realtor acquisition  
**Prepared by:** Claude (COO)  
**Approved by:** Craig Asbach  

---

## Overview

Restructure the realtor application flow into two stages:

**Stage 1 — Interest Form** (public, on `/for-realtors`)
Simple form. Name, email, phone, market, referral source. On submit → sends Craig's personal founder email to the realtor with a private link to the full application. Notifies Craig at craig.asbach@havenquest.co.

**Stage 2 — Full Application** (private, at `/realtors/applywithhavenquest`)
Complete application form. Pre-populated from Stage 1 data via token. Includes partner standards with required acknowledgment checkbox. On submit → sends confirmation email to realtor, notifies Craig with full application details.

---

## Architecture

### New database table — `public.realtor_interest`
Stores Stage 1 submissions and the token used to pre-populate Stage 2.

```sql
CREATE TABLE public.realtor_interest (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  market_specialty TEXT,
  referral_source TEXT,
  token TEXT NOT NULL UNIQUE,
  token_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Updated table — `public.realtor_applications`
Add new columns for volume-based transaction history and acknowledgment:

```sql
ALTER TABLE public.realtor_applications
ADD COLUMN IF NOT EXISTS buyer_transaction_count INTEGER,
ADD COLUMN IF NOT EXISTS buyer_transaction_volume NUMERIC,
ADD COLUMN IF NOT EXISTS seller_transaction_count INTEGER,
ADD COLUMN IF NOT EXISTS seller_transaction_volume NUMERIC,
ADD COLUMN IF NOT EXISTS market_segments TEXT[],
ADD COLUMN IF NOT EXISTS standards_acknowledged BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS interest_token TEXT;
```

Run after migration:
```sql
NOTIFY pgrst, 'reload schema';
```

---

## Stage 1 — Interest Form

### Page: `/for-realtors`

Replace the current full application form in `ForRealtorsClient.tsx` with a simple interest form.

**Keep** all existing page content above the form — the hero section, value proposition, partner tiers, commitment list. These stay exactly as they are.

**Replace** the full application form (currently lines 312–611 in `ForRealtorsClient.tsx`) with the interest form below.

### Interest Form Fields

| Field | Type | Required | Label |
|---|---|---|---|
| First name | Text input | Yes | First name |
| Last name | Text input | Yes | Last name |
| Email | Email input | Yes | Email address |
| Phone | Tel input | No | Phone number (optional) |
| Market specialty | Dropdown | No | Primary market zone |
| Referral source | Dropdown | No | How did you hear about HavenQuest? |

**Market specialty dropdown:** Same options as the current full application — all 51 zones across Austin, DFW, Houston, San Antonio, Standalone, Gulf Coast groups.

**Referral source options:**
- Google search
- Social media
- Referral from another agent
- HavenQuest outreach
- Real estate association or event
- Other

**Submit button label:** `Request to Apply →`

**Below submit button (small, muted text):**
*"We review every application personally. Submitting this form does not guarantee acceptance."*

### Stage 1 API — `POST /api/realtor-interest`

New API route. On submit:

1. Generate a secure random token (use `crypto.randomUUID()`)
2. Insert record into `public.realtor_interest` with all form fields + token
3. Send Stage 1 email to realtor (see email template below)
4. Send Craig notification email to `craig.asbach@havenquest.co`
5. Return `{ success: true }`

**Stage 1 email to realtor — from Craig personally:**

```
From name: Craig Asbach, Founder — HavenQuest
From address: craig.asbach@havenquest.co
Reply-to: craig.asbach@havenquest.co
Subject: Your invitation to apply — HavenQuest Partner Network
```

Email body (HTML, matches HavenQuest brand style):

```
[HavenQuest header — dark background, logo]

Hi [First Name],

Thank you for your interest in joining the HavenQuest Partner Network.

I started HavenQuest because I believe the best realtors in Texas deserve better than chasing cold leads. You deserve to be introduced to buyers who have already been matched to your market — people who are serious, prepared, and ready to move.

We are building something genuinely different here, and we are selective about who we invite in. Our partner network is limited by design. Every realtor we work with is vetted personally, and every introduction we make is one we stand behind.

I'd like to invite you to complete your application. The link below is private and was created specifically for you.

[Complete My Application →]  (links to /realtors/applywithhavenquest?token=[TOKEN])

Please note — submitting your application does not guarantee acceptance. We review every application personally and reach out within 5 business days with a decision or next steps.

I'm looking forward to learning more about you.

Craig Asbach
Founder, HavenQuest
craig.asbach@havenquest.co

[footer — havenquest.co]
```

**Craig notification email:**

```
From: HavenQuest <admin@send.havenquest.co>
To: craig.asbach@havenquest.co
Subject: New Realtor Interest — [First Name] [Last Name]

Simple table showing: name, email, phone, market specialty, referral source, timestamp.
```

---

## Stage 2 — Full Application

### New Page: `/realtors/applywithhavenquest`

New Next.js page. Not linked from nav. Not indexed (add `noindex` meta tag). Only accessible via the token link in the Stage 1 email.

On page load:
- Read `token` from URL query parameter
- Fetch pre-fill data from `public.realtor_interest` where `token = token AND token_used = FALSE`
- If token not found or already used → show "This link has expired or is invalid. Please visit havenquest.co/for-realtors to request a new invitation."
- If token valid → render full application with pre-populated fields

### Full Application — Page Structure

**Section 1 — Page header**
```
HavenQuest Partner Application
[HavenQuest logo/wordmark]
```

**Section 2 — Welcome copy (Craig's voice)**
```
Thank you for taking the next step.

Before you complete your application, please take a moment to read what it means to be a HavenQuest partner. We hold our network to a high standard — not to be exclusive for exclusivity's sake, but because the buyers we serve deserve the best.

Every person who comes through HavenQuest has made a major life decision. They've chosen Texas. They've matched to a city. They trust us to connect them with someone who will take care of them.

That someone is you — if you're the right fit.
```

**Section 3 — Pre-populated fields (from Stage 1)**
- First name (pre-populated, editable)
- Last name (pre-populated, editable)
- Email (pre-populated, editable)
- Phone (pre-populated, editable)
- Primary market zone (pre-populated, editable — same dropdown as Stage 1)

**Section 4 — Professional credentials**
- Brokerage name (text input, required)
- Years licensed in Texas (number input, required)
- TREC license number (text input, required)
- License type (select: Salesperson / Broker, required)
- Profile URL — Zillow, HAR, Realtor.com, or personal site (text input, optional)
  - Note: HAR profile URL required if market is in Houston Metro zones

**Section 5 — Market segment specialty**
- Same checkbox group as current application (up to 2 adjacent segments)
- Starter / Mid-Market / High / Luxury / Estate

**Section 6 — Transaction history (last 12 months)**

Label: *"Your production in the last 12 months"*
Sublabel (small, muted): *"We verify production as part of our review process. Please be accurate."*

Two rows:

| | Transactions | Total dollar volume |
|---|---|---|
| **Buyer side** | Number input | Dollar input |
| **Seller side** | Number input | Dollar input |

Total row (auto-calculated, read-only):
| **Total** | [sum] | [sum] |

**Section 7 — Partner Standards & Commitment**

Label: *"Our standards and your commitment"*

Display the full partner standards copy (see below) in a scrollable card with a light background — making it clearly readable, not buried.

Below the standards card:

Checkbox (required to submit):
☐ *"I have read and understand the HavenQuest Partner Standards. I commit to upholding these standards in every interaction with HavenQuest buyers."*

**Section 8 — Fit question**

Label: *"What makes you the right fit for relocating buyers?"*
Sublabel (small, muted): *"This is your opportunity to tell us about yourself. Be specific — we read every response."*
Input: Textarea, 5 rows, required.
Placeholder: *"Tell us about your experience with relocation buyers, how you approach the buyer relationship, and what makes you different..."*

**Submit button:** `Submit My Application →`

---

## Partner Standards Copy

Display this in Section 7 of the full application. This is the authoritative text:

---

**HavenQuest Partner Standards**

*What we expect. What we promise. What this partnership means.*

**Who we serve**
Every buyer who reaches HavenQuest has made a serious decision. They are relocating to Texas — many from out of state, many without the ability to tour homes in person. They are trusting us, and trusting you, with one of the most significant financial and personal decisions of their lives. We do not take that lightly, and we expect our partners to hold that same standard.

**Response time**
You commit to responding to every HavenQuest introduction within 24 hours — no exceptions. Relocating buyers move quickly. A delayed response is not just poor service — it breaks trust with a buyer who is already navigating significant uncertainty. If you cannot commit to 24-hour response times, HavenQuest is not the right partnership for you.

**Buyer-first representation**
HavenQuest buyers are your clients — not transactions. You commit to representing their interests fully, advising them honestly even when the honest answer is difficult, and never pressuring them toward a decision that serves your commission over their wellbeing.

**Relocation expertise**
Relocating buyers need more than a standard buyer's agent. They need someone who can paint a picture of daily life in a neighborhood, who knows which school districts are genuinely excellent, who can close remotely, and who can be a trusted guide from a distance. You represent that you have this expertise and commit to delivering it.

**Production standards**
HavenQuest partners are among the top 5% of Texas real estate agents in their market segment. We verify production as part of the application process. Partners are expected to maintain these standards throughout the relationship.

**Exclusivity and integrity**
HavenQuest introductions are made in good faith. You commit to never soliciting additional referrals through a HavenQuest introduction, never circumventing the introduction process, and always representing your relationship with HavenQuest accurately to clients.

**The referral fee**
HavenQuest operates on a referral fee model. On every closed transaction originating from a HavenQuest introduction, a referral fee is due to HavenQuest as agreed in the Partner Agreement. This is not optional and is not negotiable after the introduction is made.

**What you can expect from us**
We commit to sending you qualified, matched buyers — not cold leads. Every buyer we introduce has completed our matching process, understands the market, and has a genuine intention to purchase. We will brief you on each buyer before the introduction. We will support you throughout the relationship. And we will hold this network to the standard that makes your participation valuable.

---

**Section 9 — Acknowledgment checkbox** (required, as specified above)

---

## Stage 2 API — `POST /api/realtor-applications`

Update the existing API route to handle the new data structure:

1. Validate token — check `public.realtor_interest` where `token = token AND token_used = FALSE`. If invalid → return 400.
2. Insert full application into `public.realtor_applications` with all fields including:
   - `buyer_transaction_count`, `buyer_transaction_volume`
   - `seller_transaction_count`, `seller_transaction_volume`
   - `market_segments` (array)
   - `standards_acknowledged` (must be true — validate server-side)
   - `interest_token` (the token used)
3. Mark token as used: `UPDATE public.realtor_interest SET token_used = TRUE WHERE token = token`
4. Send confirmation email to realtor (updated — see below)
5. Send Craig notification with full application details to `craig.asbach@havenquest.co`
6. Return `{ success: true }`

**Update all `grandhavenpartners.llc@gmail.com` references to `craig.asbach@havenquest.co`**

### Updated confirmation email to realtor:

```
From name: Craig Asbach, Founder — HavenQuest
From address: craig.asbach@havenquest.co
Reply-to: craig.asbach@havenquest.co
Subject: Application received — HavenQuest Partner Network
```

Body:
```
[HavenQuest header]

Hi [First Name],

Your application has been received.

I review every application personally. You can expect to hear from me within 5 business days with a decision or next steps.

In the meantime — thank you for taking the time to share your story. The question we ask — what makes you the right fit for relocating buyers — matters more to us than your production numbers. We are looking for partners who genuinely care about the people they serve.

Craig Asbach
Founder, HavenQuest
craig.asbach@havenquest.co
```

### Craig notification email (full application):

```
From: HavenQuest <admin@send.havenquest.co>
To: craig.asbach@havenquest.co
Subject: New Realtor Application — [First Name] [Last Name] — [Market Zone]
```

Table showing all fields: name, email, phone, market zone, segments, brokerage, TREC number, license type, years licensed, buyer transactions + volume, seller transactions + volume, total volume, profile URL, fit response (full text), standards acknowledged, timestamp.

---

## New Page — `/realtors/applywithhavenquest`

Create:
- `app/realtors/applywithhavenquest/page.tsx` — server component, passes token from searchParams to client
- `components/realtors/FullApplicationClient.tsx` — client component, handles token fetch, form state, submission

Add to `app/realtors/applywithhavenquest/page.tsx`:
```typescript
export const metadata = {
  robots: { index: false, follow: false }
}
```

---

## Updated Files

| File | Change |
|---|---|
| `components/for-realtors/ForRealtorsClient.tsx` | Replace full form with interest form |
| `app/api/realtor-applications/route.ts` | Update to handle new fields, token validation, updated emails |
| `services/emailService.ts` | Add Stage 1 email, update confirmation email, update admin notification |
| `app/realtors/applywithhavenquest/page.tsx` | New file |
| `components/realtors/FullApplicationClient.tsx` | New file |
| `app/api/realtor-interest/route.ts` | New file |
| Supabase | Create `realtor_interest` table, alter `realtor_applications` table |

---

## Acceptance Criteria

- [ ] `/for-realtors` renders simplified interest form — 6 fields only
- [ ] Interest form submits to `/api/realtor-interest`
- [ ] Token generated and stored in `public.realtor_interest` on submit
- [ ] Stage 1 email sends from `craig.asbach@havenquest.co` with correct copy and token link
- [ ] Craig notification sends to `craig.asbach@havenquest.co` on interest form submit
- [ ] `/realtors/applywithhavenquest?token=[TOKEN]` loads and pre-populates fields from token
- [ ] Invalid or used token shows error message with link back to `/for-realtors`
- [ ] Full application renders all 8 sections in correct order
- [ ] Partner standards copy displays in full in Section 7
- [ ] Acknowledgment checkbox is required — form cannot submit without it
- [ ] Transaction history calculates totals automatically
- [ ] Full application submits to `/api/realtor-applications` with all new fields
- [ ] Token marked as used after successful submission
- [ ] Confirmation email sends from `craig.asbach@havenquest.co` with updated copy
- [ ] Craig notification sends to `craig.asbach@havenquest.co` with full application details
- [ ] No references to `grandhavenpartners.llc@gmail.com` remain in codebase
- [ ] `/realtors/applywithhavenquest` has noindex meta tag
- [ ] `tsc --noEmit` passes clean
- [ ] Supabase migration runs clean — both table changes confirmed
- [ ] `NOTIFY pgrst` executed after migration

---

## What This Brief Does NOT Cover

- Admin dashboard for reviewing applications (Phase 2 — Jim builds)
- Automated approval/decline emails (Phase 2)
- Realtor portal after acceptance (Phase 2)
- Email sending domain verification for `craig.asbach@havenquest.co` in Resend — Craig must verify this domain in Resend dashboard before emails send correctly from that address

---

## Pre-Launch Checklist (Craig completes before going live)

- [ ] Verify `havenquest.co` domain in Resend for `craig.asbach@havenquest.co` sending
- [ ] Test full flow end-to-end with a personal email before going live
- [ ] Review partner standards copy — approve or request edits
- [ ] Confirm `/realtors/applywithhavenquest` URL is correct

---

*Brief prepared by Claude (COO) — May 30, 2026. Approved by Craig Asbach.*
