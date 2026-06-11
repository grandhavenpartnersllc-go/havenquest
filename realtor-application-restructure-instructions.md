# Claude Code Instructions — Realtor Application Restructure

## What You're Building

A two-stage realtor application flow. This is a significant build touching multiple files and creating new ones. Read `realtor-application-restructure-brief.md` completely before writing a single line of code.

---

## Before You Start — Required Reading

1. `realtor-application-restructure-brief.md` — read completely
2. `components/for-realtors/ForRealtorsClient.tsx` — read completely
3. `app/api/realtor-applications/route.ts` — read completely
4. `services/emailService.ts` — read completely

Confirm back the full scope of what you are building before writing any code.

---

## Order of Operations

### Step 1 — Supabase migrations (do this first)
Run both SQL blocks in the brief in Supabase SQL Editor:
1. Create `public.realtor_interest` table
2. Alter `public.realtor_applications` to add new columns
3. Run `NOTIFY pgrst, 'reload schema'` immediately after both

Confirm both ran clean before proceeding.

### Step 2 — Email service
Add Stage 1 email template and update confirmation email in `services/emailService.ts`. Update all `grandhavenpartners.llc@gmail.com` references to `craig.asbach@havenquest.co`.

### Step 3 — Stage 1 API
Create `app/api/realtor-interest/route.ts` — handles interest form submission, token generation, Stage 1 emails.

### Step 4 — Stage 1 form
Update `components/for-realtors/ForRealtorsClient.tsx` — replace full application form with interest form. Keep all content above the form unchanged.

### Step 5 — Stage 2 page and component
Create `app/realtors/applywithhavenquest/page.tsx` and `components/realtors/FullApplicationClient.tsx`.

### Step 6 — Stage 2 API
Update `app/api/realtor-applications/route.ts` — add token validation, new fields, updated emails.

### Step 7 — Verify
Walk all acceptance criteria. Run `tsc --noEmit`. Test full flow end-to-end.

---

## Critical Rules

- **No `any` types.** TypeScript strict throughout.
- **Run `NOTIFY pgrst` immediately after migrations.** Non-negotiable.
- **No references to `grandhavenpartners.llc@gmail.com` anywhere.** Replace all with `craig.asbach@havenquest.co`.
- **Token validation is server-side only.** Never trust the client to validate the token.
- **`standards_acknowledged` must be validated server-side** — return 400 if false. Don't rely on the checkbox alone.
- **`/realtors/applywithhavenquest` must have noindex meta tag.**
- **Keep all existing content above the form on `/for-realtors` unchanged.** Only replace the form section.
- **Partner standards copy in the brief is final.** Do not paraphrase or shorten it.

---

## The Hardest Parts

**Token pre-population:** On page load, the full application client fetches pre-fill data from Supabase using the token from the URL. Handle loading state, invalid token state, and expired token state gracefully. The user should never see a blank broken page.

**Transaction history auto-total:** The total row calculates automatically from buyer + seller inputs. Use controlled inputs and derive totals in real time — do not wait for form submission.

**Email from address:** The brief specifies `craig.asbach@havenquest.co` as the from address. Use this in the email templates. Note in your confirmation that Craig must verify this domain in Resend before emails will send correctly.

---

## When Done

Confirm:
1. Both Supabase migrations ran clean + NOTIFY executed
2. Full flow tested end-to-end — interest form → email → token link → full application → submission → Craig notification
3. No `grandhavenpartners.llc@gmail.com` references remain
4. `tsc --noEmit` passes clean
5. Commit hash

---

*Instructions prepared by Claude (COO) — May 30, 2026*
