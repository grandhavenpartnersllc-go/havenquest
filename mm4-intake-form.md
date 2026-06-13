# MM4 — Navigator Intake Form & Client Profile Build Brief

**Date:** June 12, 2026
**Stack:** Next.js 14 App Router, TypeScript strict, TailwindCSS, Supabase, Resend
**Deploy:** Vercel via GitHub origin/main — commit and push after completion

---

## Overview

Build the MM4 intake form inside the existing Navigator portal workspace at `/portal/mm4`. The form collects the client's full profile before their Market Director consultation. On submission it creates a Client Profile record in Supabase, sends a confirmation email via Resend with a Microsoft Bookings consultation link, and displays a confirmation screen with the same booking link.

The form uses a sliding section-by-section layout — one section visible at a time, advancing left-to-right, backing up right-to-left. Progress is saved to Supabase after each section so the client can return and resume.

---

## Phase 0 — Audit Before Building

Read the following before writing any code:

1. `/app/portal/mm4/page.tsx` — current MM4 workspace
2. `/app/portal/providers/PortalDataProvider.tsx` — how client data is loaded
3. `/app/portal/hooks/usePortalState.ts` — MM state management
4. `/types/index.ts` — existing TypeScript interfaces
5. `/services/locationService.ts` — data access patterns
6. Current `public.users` schema in Supabase — what columns exist

Report findings back to Claude chat before proceeding.

---

## Phase 1 — Database Migration

Run these SQL statements in the Supabase SQL editor for project `gsxiqberewwzoohhuphn`. Run each separately and confirm "Success. No rows returned" before proceeding.

```sql
-- MM4 intake profile table
CREATE TABLE IF NOT EXISTS public.mm4_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,

  -- Section 1: Identity and Household
  primary_first_name text,
  primary_last_name text,
  partner_first_name text,
  partner_last_name text,
  current_address text,
  current_city text,
  current_state text,
  current_zip text,
  phone text,
  preferred_contact text, -- 'phone' | 'text' | 'email'
  best_time_to_reach text, -- 'morning' | 'afternoon' | 'evening' | 'anytime'
  num_adults integer,
  num_children integer,
  children_ages text, -- comma-separated or JSON array
  has_pets boolean DEFAULT false,
  pet_details text,

  -- Section 2: The Move
  why_texas text,
  why_now text,
  target_move_date text, -- month/year string e.g. "March 2027"
  timeline_flexibility text, -- 'hard_deadline' | 'flexible_few_months' | 'very_flexible'
  origin_situation text, -- 'selling' | 'renting' | 'own_no_sale' | 'other'
  home_listed boolean,
  approximate_equity text, -- range string e.g. '$100K-$200K'
  purchase_contingent text, -- 'yes' | 'no' | 'possibly' | 'na'

  -- Section 3: Employment and Financial Context
  employment_status text, -- 'employed_w2' | 'self_employed' | 'retired' | 'employer_relocation' | 'other'
  relocation_package boolean,
  work_arrangement text, -- 'fully_remote' | 'hybrid' | 'in_person' | 'na'
  income_range_confirmed text,

  -- Section 4: Texas Direction
  confirmed_target_city text,
  ruled_out_cities text,
  areas_researched text,
  additional_must_haves text,
  deal_breakers text,

  -- Section 5: Special Notes
  special_notes text,

  -- Meta
  last_completed_section integer DEFAULT 0,
  submitted boolean DEFAULT false,
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS policies
ALTER TABLE public.mm4_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own mm4 profile"
  ON public.mm4_profiles FOR INSERT
  WITH CHECK (email = (SELECT email FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can read own mm4 profile"
  ON public.mm4_profiles FOR SELECT
  USING (email = (SELECT email FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can update own mm4 profile"
  ON public.mm4_profiles FOR UPDATE
  USING (email = (SELECT email FROM public.users WHERE id = auth.uid()));
```

After running migrations, refresh the Supabase schema cache:
- Go to Supabase Dashboard → Settings → API → click "Reload schema"

Report confirmation back to Claude chat before proceeding.

---

## Phase 2 — TypeScript Interfaces

Add to `/types/index.ts`:

```typescript
export interface MM4Profile {
  id?: string;
  user_id?: string;
  email: string;

  // Section 1
  primary_first_name?: string;
  primary_last_name?: string;
  partner_first_name?: string;
  partner_last_name?: string;
  current_address?: string;
  current_city?: string;
  current_state?: string;
  current_zip?: string;
  phone?: string;
  preferred_contact?: 'phone' | 'text' | 'email';
  best_time_to_reach?: 'morning' | 'afternoon' | 'evening' | 'anytime';
  num_adults?: number;
  num_children?: number;
  children_ages?: string;
  has_pets?: boolean;
  pet_details?: string;

  // Section 2
  why_texas?: string;
  why_now?: string;
  target_move_date?: string;
  timeline_flexibility?: 'hard_deadline' | 'flexible_few_months' | 'very_flexible';
  origin_situation?: 'selling' | 'renting' | 'own_no_sale' | 'other';
  home_listed?: boolean;
  approximate_equity?: string;
  purchase_contingent?: 'yes' | 'no' | 'possibly' | 'na';

  // Section 3
  employment_status?: 'employed_w2' | 'self_employed' | 'retired' | 'employer_relocation' | 'other';
  relocation_package?: boolean;
  work_arrangement?: 'fully_remote' | 'hybrid' | 'in_person' | 'na';
  income_range_confirmed?: string;

  // Section 4
  confirmed_target_city?: string;
  ruled_out_cities?: string;
  areas_researched?: string;
  additional_must_haves?: string;
  deal_breakers?: string;

  // Section 5
  special_notes?: string;

  // Meta
  last_completed_section?: number;
  submitted?: boolean;
  submitted_at?: string;
}
```

---

## Phase 3 — The Intake Form Component

### File structure

```
/app/portal/mm4/
  page.tsx                    ← updated to render intake form or confirmation
  components/
    MM4IntakeForm.tsx          ← main form shell with sliding sections
    sections/
      Section1Identity.tsx
      Section2TheMove.tsx
      Section3Employment.tsx
      Section4TexasDirection.tsx
      Section5Notes.tsx
    MM4Confirmation.tsx        ← post-submission confirmation screen
```

### Form Shell — MM4IntakeForm.tsx

**Layout:**
- Full width inside the WorkspacePanel
- One section visible at a time
- Progress bar at top showing 5 steps — current step highlighted in brand blue #0076B6
- Section label and step count: "Step 2 of 5 — The Move"
- Back and Continue buttons at the bottom of each section
- "Save progress" happens automatically on Continue — no manual save button needed

**Sliding animation:**
- Use CSS transitions with `transform: translateX()`
- Advancing: current section slides left (-100%), next section slides in from right (+100% → 0)
- Going back: current section slides right (+100%), previous section slides in from left (-100% → 0)
- Transition duration: 300ms ease-in-out
- Use `useRef` to manage animation state without layout shift

**Progress persistence:**
- On each section completion, upsert to `public.mm4_profiles` with `last_completed_section` updated
- On mount, check if an existing `mm4_profiles` record exists for this user — if so, pre-populate all fields and restore to last completed section
- Use the user's email from `PortalDataProvider` for the query

**Pre-populated fields:**
The following fields should be pre-populated from existing data in `public.users`:
- `confirmed_target_city` — from `top_city_matches[0].city` (first match from quiz)
- `current_zip` — from `origin_zip` if it exists in public.users
- `income_range_confirmed` — from `annual_income` in public.users
- All pre-populated fields must be editable

**Validation:**
- Section 1 required fields: primary_first_name, primary_last_name, phone, preferred_contact, num_adults
- Section 2 required fields: why_texas, origin_situation, timeline_flexibility
- Section 3 required fields: employment_status, work_arrangement
- Section 4 required fields: confirmed_target_city
- Section 5: all optional
- Show inline validation errors on Continue attempt — do not block typing
- Required field indicator: subtle asterisk in brand blue

**Styling:**
- Use CSS variables throughout — `var(--portal-bg)`, `var(--card-bg)`, `var(--text-primary)` etc.
- Input fields: standard Tailwind form inputs, consistent height 42px
- Labels: 13px, `var(--text-secondary)`, margin-bottom 6px
- Section headings: 18px, font-weight 500, `var(--text-primary)`, margin-bottom 4px
- Section subheadings: 13px, `var(--text-secondary)`, margin-bottom 20px
- Textarea fields: min-height 100px, resize vertical only
- Radio/select groups: consistent pill-style selection with brand blue active state
- Continue button: brand blue #0076B6, full width on mobile, right-aligned on desktop
- Back button: ghost style, left-aligned

---

## Phase 4 — Section Content

### Section 1 — Identity and Household
**Heading:** "Let's start with your household"
**Subheading:** "Your Market Director will review this before your first conversation."

Fields:
- Primary first name (text, required)
- Primary last name (text, required)
- Partner/spouse first name (text, optional) — label: "Partner or spouse first name (if applicable)"
- Partner/spouse last name (text, optional)
- Current street address (text, optional)
- City, State, ZIP — three fields on one row
- Phone number (text, required) — format hint: "(555) 555-5555"
- Preferred contact method (radio pills): Phone / Text / Email
- Best time to reach (radio pills): Morning / Afternoon / Evening / Anytime
- Number of adults in household (number input, min 1, max 10)
- Number of children (number input, min 0, max 15) — label: "Children in household"
- If num_children > 0: Children's ages (text, placeholder: "e.g. 4, 7, 12")
- Do you have pets? (toggle Yes/No)
- If yes: Pet details (text, placeholder: "e.g. 1 large dog, 2 cats")

---

### Section 2 — The Move
**Heading:** "Tell us about your move"
**Subheading:** "The more you share, the better prepared your Market Director will be."

Fields:
- Why Texas? (textarea, required) — label: "Why Texas?" — placeholder: "In your own words — what's drawing you to Texas?"
- Why now? (textarea, optional) — label: "What's driving your timeline?" — placeholder: "A job change, lifestyle decision, family reason — whatever feels right to share"
- Target move date (month/year select — dropdowns for Month and Year, range: next 24 months)
- Timeline flexibility (radio pills, required):
  - "Hard deadline — I need to be there by a specific date"
  - "Flexible — within a few months either way"
  - "Very flexible — whenever the right home appears"
- Current living situation (radio pills, required) — label: "Your current situation":
  - "I own a home I'll be selling"
  - "I'm renting — I'll vacate when I move"
  - "I own a home but won't be selling"
  - "Other"
- If 'selling': Have you listed your home? (radio pills): Not yet / Listed / Under contract
- If 'selling': Approximate equity (select dropdown): Under $50K / $50K–$100K / $100K–$200K / $200K–$300K / $300K–$500K / Over $500K / Prefer not to say
- If 'selling': Is your Texas purchase contingent on your home sale? (radio pills): Yes / No / Possibly

---

### Section 3 — Employment and Financial Context
**Heading:** "Your employment and financial picture"
**Subheading:** "This helps your Market Director prepare for your financial conversation in MM5."

Fields:
- Employment status (radio pills, required):
  - "Employed (W-2)"
  - "Self-employed"
  - "Retired"
  - "Employer relocation"
  - "Other"
- If 'employer_relocation': Is there a relocation package? (radio pills): Yes / No / Partial
- Work arrangement (radio pills, required):
  - "Fully remote"
  - "Hybrid"
  - "In-person — I'll commute"
  - "Not applicable"
- Income range (pre-populated from quiz, editable) — label: "Annual household income" — display as range selector matching quiz options. Note beneath field: "Pre-filled from your quiz — update if anything has changed."

---

### Section 4 — Your Texas Direction
**Heading:** "Where you're headed"
**Subheading:** "Your Market Director will refine this with you during the consultation."

Fields:
- Target city or metro (text, required, pre-populated from MM3 commitment) — label: "Your target community" — note: "Pre-filled from your community selection — you can update this."
- Cities or areas you've ruled out (textarea, optional) — placeholder: "Any communities you've already decided aren't right for you, and why"
- Areas or neighborhoods you've already researched (textarea, optional) — placeholder: "Specific neighborhoods, suburbs, or areas you've looked into"
- Must-haves beyond your quiz priorities (textarea, optional) — placeholder: "Anything important to you that didn't fully come through in the quiz"
- Deal-breakers (textarea, optional) — placeholder: "Anything that would immediately eliminate a property or community"

---

### Section 5 — Anything Else
**Heading:** "Anything else we should know?"
**Subheading:** "This is your space. Your Market Director reads every word."

Fields:
- Special notes (textarea, optional, no character limit) — label: "Notes for your Market Director" — placeholder: "Anything about your family, your situation, your concerns, or your hopes for this move that you'd like your Market Director to know before you speak. There are no wrong answers here."

**Submit button:** "Complete My Profile" — brand navy #0A1E3D, full width

---

## Phase 5 — Submission Flow

On form submission:

### Step 1 — Save to Supabase
Upsert the complete `mm4_profiles` record with `submitted: true` and `submitted_at: new Date().toISOString()`

### Step 2 — Send confirmation email via Resend

**To:** client's email address
**From:** craig.asbach@havenquest.co
**Subject:** Your HavenQuest profile is complete — let's connect

**Email body:**

```
[First Name],

Your Navigator profile is complete — and I've already started reviewing it.

I'm looking forward to our conversation. Based on what you've shared, I have a lot to discuss with you about [confirmed_target_city] and what your move is going to look like.

Book your Navigator Consultation here:

[BOOK MY CONSULTATION — button linking to Bookings URL]

https://outlook.office.com/bookwithme/user/9a412f58e59e46ae9bf9f54031af467f@havenquest.co/meetingtype/w8HhBk-yU0GuOyM2a_QZrw2?bookingcode=53a8c306-a5c8-47b0-8989-bed4a6495e44&anonymous&ismsaljsauthenabled

It's a 60-minute Teams call. Come ready to talk about the life you're building in Texas — the more we dig in, the better I can guide you.

See you soon.

Craig Asbach
Market Director — Austin, TX
HavenQuest
craig.asbach@havenquest.co
```

Use Resend's existing configuration. Use the same Resend client pattern as the realtor application emails already in the codebase.

### Step 3 — Send MD notification email via Resend

**To:** craig.asbach@havenquest.co
**From:** craig.asbach@havenquest.co
**Subject:** New MM4 Profile Submitted — [First Name] [Last Name]

**Body:** Plain summary of submitted profile data — all fields, formatted cleanly for quick review.

### Step 4 — Update Supabase
Update `public.users` set `current_milemarker = 4` for this user if not already set. MM4 stays open — do not advance to 5. MM5 advances only on payment confirmation (Phase 2 — Stripe).

### Step 5 — Show confirmation screen
Replace the form with `MM4Confirmation.tsx`

---

## Phase 6 — Confirmation Screen (MM4Confirmation.tsx)

Display after successful submission inside the WorkspacePanel.

**Content:**
- Checkmark icon in brand green
- Heading: "Your profile is complete."
- Subheading: "Your Market Director has been notified and will reach out within 24 hours. In the meantime, book your consultation below."
- Prominent "Book My Consultation" button — links to Bookings URL — brand navy background, gold text
- Bookings URL: `https://outlook.office.com/bookwithme/user/9a412f58e59e46ae9bf9f54031af467f@havenquest.co/meetingtype/w8HhBk-yU0GuOyM2a_QZrw2?bookingcode=53a8c306-a5c8-47b0-8989-bed4a6495e44&anonymous&ismsaljsauthenabled`
- Secondary text: "A confirmation email with your booking link has been sent to [email address]."
- Note at bottom: "Once your consultation is complete and your Navigator Activation is confirmed, MM5 will unlock automatically."

**If client returns to MM4 after submitting:**
Show the confirmation screen again — not the form. Add a "View my profile" link that shows a read-only summary of their submitted intake data.

---

## Phase 7 — Commit and Deploy

After all phases are complete and verified locally:

```
git add -A && git commit -m "feat: MM4 intake form, client profile creation, Bookings confirmation flow" && git push origin main
```

Confirm Vercel deployment triggered and successful. Report production URL.

---

## Summary of Deliverables

| Phase | Deliverable |
|---|---|
| 0 | Audit report |
| 1 | Supabase mm4_profiles table + RLS policies |
| 2 | TypeScript MM4Profile interface |
| 3 | Sliding intake form shell with save progress |
| 4 | All 5 form sections with pre-populated fields |
| 5 | Submission flow — Supabase + Resend emails |
| 6 | Confirmation screen with Bookings link |
| 7 | Commit and deploy |

**Report back to Claude chat at the end of each phase before starting the next.**
