# MM3 + MM4 + Email Fixes Brief

**Date:** June 12, 2026
**Stack:** Next.js 14, TypeScript strict, TailwindCSS, Supabase, Resend
**Deploy:** Vercel via GitHub origin/main — commit and push after completion

---

## Phase 0 — Audit

Before touching anything read and report on:
1. MM3Discover.tsx — exact current position and styling of both lock buttons
2. MM3Discover.tsx — exact current label text on Down Payment and Home Sale Proceeds exact amount fields
3. app/portal/mm4/components/sections/Section1Identity.tsx — current field layout and where "Best time to reach" is NOT present
4. app/portal/mm4/components/sections/Section2Household.tsx — where "Best time to reach" currently renders, adults/children field implementation
5. app/portal/mm4/components/sections/Section4TexasDirection.tsx — current city display implementation
6. app/api/mm4/submit/route.ts — current email body for the client confirmation email
7. app/portal/components/portal.css or globals.css — where --portal-bg CSS variable is defined

Report findings before proceeding.

---

## MM3 Fix #1 — Lock Buttons Bottom Right

Both "Lock my financials" and "Lock my city choices" buttons must be:
- Positioned at the bottom RIGHT of their respective panels
- Same color scheme — navy background (#0A1E3D), white text, lock icon when unlocked
- When locked: green background tint, green lock icon, right-aligned in same position
- Both panels visually symmetric — identical button position and treatment

---

## MM3 Fix #2 — Exact Amount Field Labels

- Under Down Payment: change "Or enter exact amount (optional)" to **"Or enter exact Down Payment amount"**
- Under Home Sale Proceeds: change "Or enter exact amount (optional)" to **"Or enter exact Home Sale Proceeds amount"**
- Remove "(optional)" from both labels

---

## MM4 Fix #1 — Move "Best time to reach" to Section 1

Remove "Best time to reach" from Section 2 (Household) and add it to Section 1 (Identity) in the Contact row.

**Section 1 bottom rows after fix:**
- Row: Phone number (left) / Preferred contact method pills (right) — Phone Call / Text / Email
- Row: Best time to reach pills (left) — Morning / Afternoon / Evening / Anytime / right column empty or used for another field

---

## MM4 Fix #2 — Adults and Children Fields Editable

Both `num_adults` and `num_children` fields in Section 2 are pre-populated from the quiz but not editable. Make both fully editable number inputs.
- `num_adults`: min 1, max 20, pre-populate from profile.householdSize
- `num_children`: min 0, max 20, pre-populate from quiz household data
- Both must accept user input and update formData state on change
- Remove any readonly or disabled attributes

---

## MM4 Fix #3 — Household Members Table in Section 2

Add a dynamic household members section below the adults/children fields.

**Design:**
- Section label: "HOUSEHOLD MEMBERS"
- Subtext: "Tell us a little about everyone making this move — your Market Director will use this to personalize your community search."
- One row per household member (excluding the primary contact already captured in Section 1)
- Each row contains three fields in a grid:
  - First name (text input)
  - Age (number input, min 0, max 120)
  - Relationship (pill selector or dropdown): Spouse/Partner / Child / Parent / Other
- "Add another person" button at the bottom — adds a new row
- "Remove" button (×) on each row after the first
- Maximum 10 rows

**Data storage:**
Save household members as a JSON array in `mm4_profiles.household_members`:
```json
[
  {"first_name": "Sarah", "age": 48, "relationship": "spouse"},
  {"first_name": "Emma", "age": 16, "relationship": "child"},
  {"first_name": "Jack", "age": 13, "relationship": "child"}
]
```

Add this column to mm4_profiles if it doesn't exist — run in Supabase SQL editor:
```sql
ALTER TABLE public.mm4_profiles
ADD COLUMN IF NOT EXISTS household_members jsonb;
```

Add `household_members?: Array<{first_name: string, age: number, relationship: string}>` to the MM4Profile TypeScript interface in /types/index.ts.

---

## MM4 Fix #4 — ZIP Code Pre-population

Verify that Section 1 `current_zip` pre-populates from `sessionStorage.getItem('hq_origin_zip')` on mount. This was implemented in a previous commit but may have been lost during the 6-section form rebuild.

If not wired: add a useEffect on mount in MM4IntakeForm.tsx that reads sessionStorage and sets current_zip in the initial form state.

---

## MM4 Fix #5 — Section Title and Description Text Contrast

All 6 section headings and description paragraphs are too light — increase contrast:
- Section heading (e.g. "Your Information", "The Move"): `font-weight: 600`, `color: var(--color-text-primary)`
- Section description/subheading: `color: var(--color-text-secondary)` — must be clearly readable, not muted
- Apply consistently across all 6 sections

---

## MM4 Fix #6 — Direction Section Three City Cards

Replace the single "Confirmed target city" text field in Section 5 (Direction) with three side-by-side city cards — one per community locked in MM3.

**Source:** `chosen_communities` array from `public.users` — already loaded in the component.

**Layout:** Three equal-width cards in a row, each taking approximately one-third of the panel width.

**Each card contains:**
- City name as card header (bold, 16px)
- Metro area label below (13px, muted) — look up from city data if available
- Label: "Why does [City Name] appeal to you?" (13px, muted)
- Open textarea: placeholder "What draws you to this community?" — optional, no character limit, min-height 80px
- Saves to city1_reasoning / city2_reasoning / city3_reasoning on mm4_profiles

**Fallback:** If chosen_communities is empty or null, show the original single text field for confirmed_target_city.

**Note:** city1_reasoning, city2_reasoning, city3_reasoning columns already exist on mm4_profiles from a previous migration.

---

## Portal Fix — Workspace Background Color

Update the portal workspace background color from stark white to a warm off-white.

Find where `--portal-bg` is defined in the CSS (likely portal.css or globals.css).

Change the light theme value to: `#F5F4F1`

This applies to the main workspace area across all MileMarker workspaces — the area between the Journey Rail and Command Center panels where the inset card sits. The inset card itself stays white (var(--card-bg)) so it pops against the tinted background.

Do not change the dark theme value.

---

## Email Fix — Client Confirmation Email Rewrite

File: `app/api/mm4/submit/route.ts`

Find the client confirmation email HTML template and make these changes:

**Fix 1 — Remove false statement:**
Remove: "Your Navigator profile is complete — and I've already started reviewing it."
Replace with: "Your Navigator profile has been submitted and sent to your Market Director. We're looking forward to reviewing it with you and can't wait to meet you."

**Fix 2 — Show all three cities:**
The email currently references only the top city (confirmed_target_city). Update it to reference all three chosen communities from `profile.confirmed_target_city` and the city reasoning data if available.
Replace the single city reference with: "Based on what you've shared, I'm looking forward to discussing your top communities — [city1], [city2], and [city3] — and what each one could mean for you and your family."
If only one city exists, fall back to the single city reference.

**Fix 3 — Reframe Calendly CTA:**
Change the booking prompt to a conditional reminder:
"If you haven't scheduled your initial consultation yet, click below to find a time that works:"

**Fix 4 — Add consultation expectations section:**
Add a section after the booking button:

```
What we'll cover in your consultation:

• Your target communities and what makes each one right — or wrong — for your family
• Your financial picture and what it means for your Texas search  
• The full Navigator journey — all 10 stages and what to expect at each one
• Your timeline, your concerns, and anything else on your mind
• The Navigator Activation — what it unlocks and what your journey looks like from here

Come ready to talk about the life you're building in Texas. The more you share, the better I can guide you.
```

---

## SQL Migration — Run First

Before building, run this in the Supabase SQL editor and confirm success:

```sql
ALTER TABLE public.mm4_profiles
ADD COLUMN IF NOT EXISTS household_members jsonb;
```

Then reload schema cache:
```sql
NOTIFY pgrst, 'reload schema';
```

Report confirmation before proceeding with code changes.

---

## Commit and Deploy

After all fixes complete:

```
npx tsc --noEmit && git add -A && git commit -m "fix: MM3 lock buttons, MM4 section 1/2 fixes, city cards, household members, portal bg, email rewrite" && git push origin main
```

Confirm Vercel deployment triggered. Report back when complete.

---

## Summary

| Item | Change |
|---|---|
| MM3 #1 | Lock buttons bottom right, matching navy/green style |
| MM3 #2 | Exact amount field labels specific to each field |
| MM4 #1 | "Best time to reach" moved to Section 1 |
| MM4 #2 | Adults and children fields fully editable |
| MM4 #3 | Household members dynamic table in Section 2 |
| MM4 #4 | ZIP code pre-population verified and fixed |
| MM4 #5 | Section title and description text contrast increased |
| MM4 #6 | Direction section three city cards with reasoning fields |
| Portal | Workspace background warm off-white #F5F4F1 |
| Email #1 | Remove false "already reviewing" statement |
| Email #2 | Show all three cities not just top one |
| Email #3 | Calendly CTA reframed as conditional reminder |
| Email #4 | Consultation expectations section added |

**Report back after Phase 0 audit and SQL migration before making any code changes.**
