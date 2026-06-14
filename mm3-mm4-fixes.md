# MM3 Remaining Tweaks + MM4 Form Fixes Brief

**Date:** June 12, 2026
**Stack:** Next.js 14, TypeScript strict, TailwindCSS, Supabase, CSS variables
**Deploy:** Vercel via GitHub origin/main — commit and push after completion

---

## Phase 0 — Audit

Before touching anything read and report on:
1. MM3Discover.tsx — current position and styling of both lock buttons
2. MM3Discover.tsx — current labels on the exact amount fields for Down Payment and Home Sale Proceeds
3. app/portal/mm4/components/MM4IntakeForm.tsx — how adults/household_size is currently pre-populated and what input type is used
4. app/portal/mm4/components/Section1Identity.tsx — the adults field implementation
5. app/portal/mm4/components/Section3Employment.tsx — how income is pre-populated and formatted
6. app/portal/mm4/components/Section4TexasDirection.tsx — how confirmed_target_city is currently populated and displayed
7. public.users schema — confirm column names for household_size, top_city_matches, chosen_communities, origin_zip

Report findings before proceeding.

---

## MM3 Tweak #5 — Lock Buttons Bottom Right

**Current:** Lock buttons may be centered or inconsistently positioned.

**Change:** Both lock buttons — "Lock my financials" and "Lock my city choices" — should be positioned at the bottom RIGHT of their respective panels. Same styling on both:
- Right-aligned
- Same button style — navy background (#0A1E3D), white text, lock icon
- When locked: green lock indicator, right-aligned, same position
- Both panels mirror each other exactly in button position and styling

---

## MM3 Tweak #6 — Exact Amount Field Labels

**Current:** Both exact amount fields say "Or enter exact amount (optional)"

**Change:**
- Under Down Payment: change label to **"Or enter exact Down Payment amount"**
- Under Home Sale Proceeds: change label to **"Or enter exact Home Sale Proceeds amount"**

Remove "(optional)" from both. The specific label makes the field self-explanatory.

---

## MM4 Fix #1 — Adults in Household Wrong Pre-population and Not Editable

**Current issues:**
- Field pre-populates with 1 instead of the value from the quiz
- Field is not editable — user cannot change the value

**Fix:**
- Pre-populate from `public.users.household_size` — this is the field set during the quiz
- Ensure the field is a properly controlled number input with working onChange handler
- Min: 1, Max: 10
- Field must be fully editable

---

## MM4 Fix #2 — Income Field Loses Formatting on Edit

**Current:** Annual household income pre-populates correctly as formatted currency (e.g. $125,000) but when user clicks to edit, formatting disappears — no dollar sign, no comma separators.

**Fix:** Implement proper currency formatting on the income field:
- On display/blur: format as $XXX,XXX
- On focus: strip to raw number for editing (remove $ and commas)
- On blur: reformat to currency display
- Store raw number value in state, display formatted value

Pattern to follow — same as the exact amount fields in MM3 that already have this behavior.

---

## MM4 Fix #3 — Direction Section Shows Only Top City

**Current:** Section 4 (Texas Direction) pre-populates `confirmed_target_city` with only the #1 match city.

**Fix:** Show all three cities the client locked in MM3. Source: `public.users.chosen_communities` (text array) — these are the cities the client selected and locked in the MM3 commitment panel.

**New design for the Direction section city display:**

Replace the single text field with three city cards — one per locked community. Each card contains:
- City name (from chosen_communities array)
- Metro area (look up from city data if available, or omit)
- An optional open text field: **"Why does [City Name] appeal to you?"**
  - Placeholder: "What draws you to this community?"
  - No character limit
  - Optional — not required to advance
  - Saves to mm4_profiles — add three new columns: `city1_reasoning`, `city2_reasoning`, `city3_reasoning`

If chosen_communities is empty or null, fall back to top_city_matches[0].cityName for a single city display.

**New Supabase columns needed — run in SQL editor:**
```sql
ALTER TABLE public.mm4_profiles
ADD COLUMN IF NOT EXISTS city1_reasoning text,
ADD COLUMN IF NOT EXISTS city2_reasoning text,
ADD COLUMN IF NOT EXISTS city3_reasoning text;
```

Run this migration first and confirm success before building.

---

## MM4 Fix #4 — ZIP Code Not Pre-populating

**Current:** current_zip renders blank. origin_zip only exists in sessionStorage under `hq_origin_zip` — it was never saved to public.users.

**Fix — two parts:**

Part A: On the client side in MM4IntakeForm.tsx, on mount read `sessionStorage.getItem('hq_origin_zip')` and pre-populate the current_zip field if it exists.

Part B: Also save origin_zip to public.users when it's available. In the MM4 form submission route (app/api/mm4/submit/route.ts), if origin_zip is provided in the profile, also update public.users SET origin_zip = $1 for this user.

This requires adding the column to public.users if it doesn't exist:
```sql
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS origin_zip varchar(10);
```

Run this migration first.

---

## MM4 Layout Fix #1 — Inset Centered Panel

**Current:** The form is full page width with a scrolling layout that feels like a generic form.

**Change:** The form content should sit inside a centered inset card/panel:
- Max-width: 860px
- Centered horizontally with auto margins
- Background: var(--card-bg)
- Border: 0.5px solid var(--card-border)
- Border-radius: 16px
- Padding: 32px
- The portal background (var(--portal-bg)) shows on the sides
- The form content scrolls inside this panel if needed

---

## MM4 Layout Fix #2 — Progress Bar Full Width

**Current:** The step progress bar (1-2-3-4-5 with Identity/The Move/Employment/Direction/Notes labels) is constrained to the form content width.

**Change:** The progress bar spans the full width of the workspace panel — not constrained to the inset card. It sits above the inset card as a full-width header for the workspace. Visually it feels like a progress header for the entire MM4 stage.

---

## MM4 Layout Fix #3 — Continue Button Below Panel

**Current:** The Continue/Next button is inside the scrollable form section.

**Change:** Move the Continue button to sit below the inset card — outside the scrollable area. It should always be visible at the bottom of the workspace without requiring the user to scroll to find it. Back button sits on the left, Continue button sits on the right, below the inset panel.

---

## Commit and Deploy

After all fixes are complete:

```
npx tsc --noEmit && git add -A && git commit -m "fix: MM3 lock button alignment, MM4 form fixes — household size, income formatting, city reasoning, ZIP pre-pop, inset layout" && git push origin main
```

Confirm Vercel deployment triggered. Report back when complete.

---

## Summary

| Item | Change |
|---|---|
| MM3 #5 | Lock buttons bottom right, matching style |
| MM3 #6 | Exact amount field labels updated |
| MM4 #1 | Adults field — correct pre-pop from household_size, editable |
| MM4 #2 | Income field — currency formatting preserved on edit |
| MM4 #3 | Direction — show all 3 cities with reasoning fields |
| MM4 #4 | ZIP code — pre-pop from sessionStorage, save to DB |
| MM4 Layout #1 | Inset centered panel 860px max-width |
| MM4 Layout #2 | Progress bar full width above panel |
| MM4 Layout #3 | Continue button below panel, always visible |

**Report back after Phase 0 audit before making any changes.**
