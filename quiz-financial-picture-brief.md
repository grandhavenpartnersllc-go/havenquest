# Build Brief — Quiz Financial Picture Step
**Project:** HavenQuest  
**Date:** May 30, 2026  
**Status:** PENDING — Ready for Claude Code  
**Priority:** High  
**Prepared by:** Claude (COO)  
**Approved by:** Craig Asbach  

---

## Overview

Add a new quiz step — **Step 2: Financial Picture** — between the existing Step 1 (Household & Income) and the existing Step 2 (Lifestyle Priorities, which becomes Step 3 after this insert).

This step collects the user's purchasing power beyond income alone. A $75K/year buyer with $400K in home sale proceeds is a fundamentally different buyer than a $75K/year buyer with $15K saved. This data is used to run a real affordability test against each matched city's median home price, replace the income-only segment assignment, and improve city match accuracy.

---

## Step Numbering After This Change

| Before | After |
|---|---|
| Step 1 — Household & Income | Step 1 — Household & Income (unchanged) |
| Step 2 — Lifestyle Priorities | **Step 2 — Financial Picture (NEW)** |
| Step 3 — Must Haves | Step 3 — Lifestyle Priorities |
| Step 4 — Priority Ranking | Step 4 — Must Haves |
| Step 5 — Buyer Profile | Step 5 — Priority Ranking |
| — | Step 6 — Buyer Profile |

Update all step indicators, progress bars, and step count references throughout the quiz to reflect 6 steps total.

---

## New Step — Financial Picture

### Headline
```
Now let's talk about your purchasing power.
```

### Subhead (Privacy Framing — Required)
```
This helps us match you to cities where your full financial picture actually fits — not just your income. We use this information only for matching. It is never sold, never shared with realtors without your consent, and never stored beyond what's needed to generate your results.
```

Display the subhead in a visually distinct privacy note style — small text, muted color, with a small lock icon (Lucide `Lock` icon) preceding the text. This should feel like a reassurance, not a warning.

---

## Fields

### Field 1 — Current Homeowner
**Label:** Are you currently a homeowner?  
**Type:** Two-button toggle (Yes / No)  
**Default:** No selection  
**Behavior:** If "Yes" → reveal Field 2 (home sale proceeds) with smooth expand animation (150ms ease). If "No" → Field 2 stays hidden.

---

### Field 2 — Estimated Home Sale Proceeds *(conditional — shown only if homeowner = Yes)*
**Label:** Estimated proceeds from your home sale  
**Sublabel:** After paying off your mortgage and selling costs  
**Type:** Dropdown (single select)  
**Options:**
```
Under $50,000
$50,000 – $100,000
$100,000 – $200,000
$200,000 – $350,000
$350,000 – $500,000
$500,000 – $750,000
$750,000+
I'm not sure yet
```

---

### Field 3 — Down Payment Available
**Label:** Total down payment funds available  
**Sublabel:** Include savings, equity, gifts, or any other source  
**Type:** Dropdown (single select)  
**Options:**
```
Under $20,000
$20,000 – $50,000
$50,000 – $100,000
$100,000 – $200,000
$200,000 – $500,000
$500,000+
I'm not sure yet
```

---

### Field 4 — Purchase Timeline
**Label:** When are you planning to buy?  
**Type:** Four-option tile selector (same visual style as other tile selectors in the quiz)  
**Options:**
```
Within 3 months     [icon: Zap]
3 – 6 months        [icon: Clock]
6 – 12 months       [icon: Calendar]
12+ months          [icon: Compass]
```

---

## Validation Rules

- **Field 1 (homeowner):** Required. Must select Yes or No before proceeding.
- **Field 2 (proceeds):** Required only if homeowner = Yes. If homeowner = No, skip entirely — do not validate.
- **Field 3 (down payment):** Required.
- **Field 4 (timeline):** Required.

Show inline validation on attempt to proceed. Do not show errors on initial render.

---

## Data Storage

### Type Interface Addition — `/types/index.ts`

Add `FinancialPicture` interface:

```typescript
export interface FinancialPicture {
  is_homeowner: boolean;
  home_sale_proceeds: string | null; // null if not homeowner
  down_payment_available: string;
  purchase_timeline: '0-3months' | '3-6months' | '6-12months' | '12plus_months';
}
```

Add to the existing user/quiz state type:
```typescript
financial_picture?: FinancialPicture;
```

### Supabase Migration

```sql
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS financial_picture JSONB;
```

Immediately after running the migration, execute:
```sql
NOTIFY pgrst, 'reload schema';
```

⚠️ Do not skip the NOTIFY step — failure to run it will cause PGRST204 schema cache errors.

### Save Behavior
Save `financial_picture` to Supabase `public.users` alongside the existing quiz data save. Follow the same save pattern used for `buyer_profile` (JSONB column, upsert on email conflict).

---

## Affordability Algorithm Update

Update affordability logic in `services/locationService.ts`.

### How the Algorithm Works

The algorithm runs **after** city matching, against each matched city's actual median home price. It is a directional affordability filter — not an underwriting decision. The Ambassador handles real qualification.

**Step-by-step for each matched city:**

1. Look up city median home price from `cities.ts`
2. Calculate total funds available: `downPaymentMidpoint + proceedsMidpoint`
3. Calculate estimated mortgage balance: `cityMedian - totalFunds` (floor at $0 — never negative)
4. Calculate estimated monthly payment using 30-year conventional loan at 7.0% fixed rate
5. Calculate 40% threshold: `(annualIncome / 12) * 0.40`
6. If monthly payment exceeds threshold → fire affordability flag on that city's result card
7. Derive segment from the monthly payment result (see Segment Derivation below)

### Mortgage Payment Formula

Standard amortization. Monthly rate = 7.0% / 12. Term = 360 months.

```typescript
function calculateMonthlyPayment(principal: number): number {
  if (principal <= 0) return 0;
  const monthlyRate = 0.07 / 12;
  const numPayments = 360;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
}
```

### Down Payment Midpoints

Convert dropdown selection to numeric value for calculation:

| Selection | Midpoint Used |
|---|---|
| Under $20,000 | $10,000 |
| $20,000 – $50,000 | $35,000 |
| $50,000 – $100,000 | $75,000 |
| $100,000 – $200,000 | $150,000 |
| $200,000 – $500,000 | $350,000 |
| $500,000+ | $600,000 |
| I'm not sure yet | $30,000 |

### Home Sale Proceeds Midpoints

| Selection | Midpoint Used |
|---|---|
| Under $50,000 | $25,000 |
| $50,000 – $100,000 | $75,000 |
| $100,000 – $200,000 | $150,000 |
| $200,000 – $350,000 | $275,000 |
| $350,000 – $500,000 | $425,000 |
| $500,000 – $750,000 | $625,000 |
| $750,000+ | $850,000 |
| I'm not sure yet | $0 |
| Not a homeowner | $0 |

### Special Cases

- **Down payment = $500K+:** Skip affordability flag entirely. These buyers are not price-constrained by Texas medians. Assign Luxury or Estate segment based on income.
- **Mortgage balance = $0 or negative:** User can pay cash. Skip affordability flag. Assign Estate segment.
- **"I'm not sure yet" on down payment:** Use $30,000 (national first-time buyer average). Conservative but not punitive.
- **"I'm not sure yet" on proceeds:** Use $0.
- **Not a homeowner:** Proceeds = $0.

### Segment Derivation

Segment is derived from monthly payment as a percentage of gross monthly income, calculated against the user's top matched city median.

| Monthly Payment as % of Gross Monthly Income | Segment |
|---|---|
| 0% (cash buyer or balance ≤ $0) | Estate |
| 1% – 25% | Luxury |
| 26% – 35% | High |
| 36% – 40% | Mid-Market |
| Above 40% | Starter (affordability flag fires) |

**Note:** Segment is directional guidance for realtor matching and lead prioritization only. It is never shown to the user by name.

### Results Page Disclosure (Required)

Display beneath each city's affordability breakdown:

> *Affordability estimates assume a 30-year conventional loan at 7.0% fixed rate. FHA, VA, and USDA loan options may expand your range. Your Ambassador will walk through your actual numbers with you.*

### Lead Priority Flag

Add `is_active_buyer: boolean` to the user record.
- Set `true` if `purchase_timeline` = `0-3months` or `3-6months`
- Used in Phase 2 to flag hot leads for realtor matching
- Do NOT surface this flag to the user anywhere

---

## UX & Visual Standards

Match exactly the visual style of existing quiz steps:

- Same card container, padding, and border radius as Steps 1 and 5
- Same progress bar — update to show 6 total steps
- Same step indicator format: "Step 2 of 6"
- Same "Back" / "Continue →" button pattern
- Privacy note: small text (text-sm), muted color (text-muted-foreground or equivalent), Lucide `Lock` icon inline left, italic preferred
- Homeowner toggle: two pill buttons side by side (Yes / No), same style as binary selectors used elsewhere in the quiz
- Conditional reveal of Field 2: smooth height transition (150ms ease), not a hard show/hide snap
- Dropdown fields: same dropdown style used in Step 5 (Buyer Profile)
- Timeline tiles: same tile style used in Step 5 — icon + label, 2×2 grid on mobile, 4-across on desktop

---

## Quiz Session Tracking Update

Update step labels in `quizSessionService.ts` to reflect the new 6-step structure:

| step | label |
|---|---|
| 1 | household_income |
| 2 | financial_picture |
| 3 | lifestyle_priorities |
| 4 | must_haves |
| 5 | priority_ranking |
| 6 | buyer_profile |

Update `quizSessionService.ts` step tracking calls in `app/explore/page.tsx` to pass the correct step label at each transition.

---

## Files to Modify

| File | Change |
|---|---|
| `app/explore/page.tsx` | Insert Step 2 component, renumber steps 2–5 → 3–6, update step tracking calls |
| `components/quiz/FinancialPictureStep.tsx` | **New file** — full step component |
| `types/index.ts` | Add `FinancialPicture` interface, add `financial_picture` to quiz state type |
| `services/locationService.ts` | Replace income-bucket segment logic with affordability math |
| `services/quizSessionService.ts` | Update step labels |
| Supabase | Run migration — add `financial_picture JSONB` column to `public.users` |

### New Component — `components/quiz/FinancialPictureStep.tsx`

Props:

```typescript
interface FinancialPictureStepProps {
  onNext: (data: FinancialPicture) => void;
  onBack: () => void;
  initialData?: FinancialPicture;
}
```

Component manages its own local state. Calls `onNext(data)` on valid form submission. Calls `onBack()` on back button click.

---

## What This Brief Does NOT Cover

- Displaying financial picture data in the portal (Phase 2 — portal report enhancement)
- Realtor lead scoring using `is_active_buyer` flag (Phase 2 — realtor dashboard)
- Saving financial picture to quiz_sessions table (not needed — quiz_sessions tracks step progression only, not form data)

---

## Acceptance Criteria

- [ ] Step 2 renders between Step 1 and Step 3 with correct headline, subhead, and privacy note
- [ ] Privacy note displays with Lucide Lock icon
- [ ] Homeowner toggle works — Yes reveals proceeds field with smooth 150ms animation
- [ ] All four fields validate correctly before allowing Continue
- [ ] "I'm not sure yet" is selectable on both dropdown fields without blocking progression
- [ ] Data saves to `financial_picture` JSONB column in Supabase on email gate submission
- [ ] Affordability test runs against each matched city's actual median home price
- [ ] Monthly payment calculated using 30-year conventional, 7.0% fixed rate formula
- [ ] Down payment and proceeds midpoints convert correctly from dropdown selections
- [ ] $500K+ down payment skips affordability flag — segment assigned from income tier only
- [ ] Cash buyer (balance ≤ $0) skips affordability flag, assigned Estate segment
- [ ] Affordability flag fires correctly when monthly payment exceeds 40% of gross monthly income
- [ ] Segment derives from monthly payment as % of income (not income buckets)
- [ ] Results page disclosure note renders beneath affordability breakdown on each city card
- [ ] `is_active_buyer` flag set correctly based on timeline selection, not surfaced to user
- [ ] Progress bar shows 6 steps throughout quiz
- [ ] Step indicator reads "Step 2 of 6" on this step
- [ ] Back/forward navigation works correctly across all 6 steps
- [ ] Supabase schema cache refreshed after migration (NOTIFY pgrst run immediately)
- [ ] Mobile responsive — timeline tiles 2×2, dropdowns full width

---

*Brief prepared by Claude (COO) — May 30, 2026. Approved by Craig Asbach.*
