# Build Brief — Quiz Consolidation (6 Steps → 4 Steps)
**Project:** HavenQuest  
**Date:** May 30, 2026  
**Status:** PENDING — Ready for Claude Code  
**Priority:** High  
**Prepared by:** Claude (COO)  
**Approved by:** Craig Asbach  

---

## Overview

Consolidate the quiz from 6 steps to 4 steps by:
- Removing the standalone Timeline step (Step 4)
- Removing the standalone Buyer Profile step (Step 6)
- Removing the housing preference question (Starter/Median/Luxury/Estate)
- Absorbing household + buyer profile into one richer "Household & Dream Home" step
- Deriving `movingTimeline` from `financial_picture.purchase_timeline` rather than collecting it separately
- Removing the timeline field from the Email Gate
- Expanding `BuyerProfile` with 10 optional feature filters and a free text field
- Replacing `isLuxuryPreference` logic with segment-based luxury check

---

## New Step Structure

| Index | UI Label | Component | Status |
|---|---|---|---|
| 0 | Step 1 of 4 — Income | IncomeForm | Unchanged |
| 1 | Step 2 of 4 — Household & Dream Home | HouseholdForm (rebuilt) | Major update |
| 2 | Step 3 of 4 — Financial Picture | FinancialPictureStep | Minor update (timeline label) |
| 3 | Step 4 of 4 — Priorities | PrioritySelector | Unchanged |

---

## Files to Modify

| File | Change |
|---|---|
| `types/index.ts` | Update `UserProfile`, `BuyerProfile`, `FinancialPicture` |
| `utils/constants.ts` | Remove `HOUSING_OPTIONS`, `isLuxuryPreference`, `TIMELINE_OPTIONS` |
| `utils/zillowUrl.ts` | Add garage + pool params, remove housingPreference price logic |
| `components/form/HouseholdForm.tsx` | Full rebuild — absorb buyer profile + feature filters |
| `components/form/BuyerProfileStep.tsx` | Delete entirely |
| `components/form/TimelineForm.tsx` | Delete entirely |
| `components/results/EmailGate.tsx` | Remove timeline field, derive movingTimeline silently |
| `services/matchingService.ts` | Replace isLuxury check with segment check, simplify getMonthlyHousingCost |
| `services/quizSessionService.ts` | Update step labels to 4-step structure |
| `app/explore/page.tsx` | Remove steps 4 and 6, update handlers, derive movingTimeline |

---

## Detailed Changes

---

### 1. `types/index.ts`

#### `BuyerProfile` — expand with feature filters and free text

```typescript
export interface BuyerProfile {
  // Required fields
  bedrooms: 2 | 3 | 4 | 5 | null
  bathrooms: 1 | 2 | 3 | null
  homeType: 'singleFamily' | 'townhome' | 'condo' | null
  constructionPreference: 'new' | 'resale' | null
  // Optional feature filters
  features: HomeFeature[]
  // Optional free text
  dreamHomeNotes: string | null
}

export type HomeFeature =
  | 'garage'
  | 'pool'
  | 'singleStory'
  | 'largeYard'
  | 'homeOffice'
  | 'openFloorPlan'
  | 'primaryBedroomDownstairs'
  | 'guestSuite'
  | 'smartHome'
  | 'largeKitchen'
```

#### `UserProfile` — remove `housingPreference`, keep `movingTimeline`

Remove:
```typescript
housingPreference: 'buyStarter' | 'buyMedian' | 'luxuryHome' | 'luxuryEstate'
```

Keep `movingTimeline` — it will be derived from `financial_picture.purchase_timeline` in the handler, not collected in a separate step.

#### `FinancialPicture` — update purchase_timeline values

```typescript
export interface FinancialPicture {
  is_homeowner: boolean
  home_sale_proceeds: string | null
  down_payment_available: string
  purchase_timeline: '0-3months' | '3-6months' | '6-12months' | 'exploring'
}
```

Note: `'12plus_months'` is replaced by `'exploring'`. Update the tile label in `FinancialPictureStep.tsx` accordingly (see section 8 below).

#### `QuizSessionData` — remove `housingPreference`

Remove `housingPreference?: string` from `QuizSessionData`.

---

### 2. `utils/constants.ts`

**Remove entirely:**
- `HOUSING_OPTIONS` array
- `isLuxuryPreference` function
- `TIMELINE_OPTIONS` array
- `LUXURY_HOME_PRICE` constant
- `LUXURY_ESTATE_PRICE` constant

**Keep everything else unchanged.**

---

### 3. `utils/zillowUrl.ts`

**Remove:** All `housingPreference` price logic (the luxury home / luxury estate price range blocks).

**Update:** Price range now uses income-based budget only:
```typescript
const maxBudget = Math.round(profile.annualIncome * 4.5)
let url = `https://www.zillow.com/homes/for_sale/${citySlug}-TX_rb/?price=0-${maxBudget}`
```

**Add:** Garage and pool parameters:
```typescript
if (bp?.features?.includes('garage')) {
  url += `&hasGarage=true`
}
if (bp?.features?.includes('pool')) {
  url += `&hasPool=true`
}
```

**Keep:** beds, baths, home type, construction preference parameters — unchanged.

**Update function signature:** Remove `profile.housingPreference` references. Function should compile cleanly with `housingPreference` removed from `UserProfile`.

---

### 4. `components/form/HouseholdForm.tsx` — Full Rebuild

This component is rebuilt from scratch. It now collects household size, buyer profile (required fields), optional feature filters, and a free text field.

#### Section 1 — Household Size (required, unchanged)
Label: "Tell us about your household"
Options: Just me / 2 people / Family of 3–4 / Family of 5+
Same tile grid as current implementation.

#### Section 2 — Home Size (required)
Label: "How many bedrooms and bathrooms?"
Two dropdowns side by side (same layout as current BuyerProfileStep):
- Bedrooms: 2 / 3 / 4 / 5+ / No preference
- Bathrooms: 1 / 2 / 3+ / No preference

#### Section 3 — Home Type (required)
Label: "What type of home?"
Tile selector (not dropdown):
- Single family home
- Townhome
- Condo
- No preference

#### Section 4 — Construction (required)
Label: "New construction or existing home?"
Two-button toggle:
- New construction
- Resale / existing
- No preference (third option, smaller/secondary style)

#### Section 5 — Dream Home Features (optional, multi-select)
Label: "What features matter to you?"
Sublabel (small, muted): "Select all that apply — or skip if you're flexible."

10 feature tiles, multi-select, no limit. Visual style: icon + label tiles, same grid pattern as timeline tiles in FinancialPictureStep (2×2 on mobile, up to 5-across on desktop).

| Feature | Label | Icon (Lucide) |
|---|---|---|
| garage | Garage | `Car` |
| pool | Pool | `Waves` |
| singleStory | Single story | `Home` |
| largeYard | Large yard | `Trees` |
| homeOffice | Home office | `Monitor` |
| openFloorPlan | Open floor plan | `LayoutDashboard` |
| primaryBedroomDownstairs | Primary bed downstairs | `BedDouble` |
| guestSuite | Guest suite | `Users` |
| smartHome | Smart home | `Wifi` |
| largeKitchen | Large kitchen | `ChefHat` |

Selected state: same blue accent border + background as other selected tiles.
Unselected state: gray border, hover state.

#### Section 6 — Free Text (optional)
Label: "Anything else about your dream home?"
Sublabel (small, muted): "Share anything the filters above don't capture."
Input: `<textarea>` — 3 rows, same border/focus style as other inputs. No character limit. Placeholder: "e.g. I'd love a quiet street, a big pantry, and room for a dog..."

#### Validation
- Household size: required
- Bedrooms: required (but "No preference" is a valid selection)
- Bathrooms: required (but "No preference" is a valid selection)
- Home type: required (but "No preference" is a valid selection)
- Construction: required (but "No preference" is a valid selection)
- Features: not required
- Free text: not required

Show inline validation on submit attempt only. Do not show errors on initial render.

#### onComplete payload
```typescript
onComplete({
  householdSize,
  buyerProfile: {
    bedrooms,
    bathrooms,
    homeType,
    constructionPreference,
    features,        // string[] of selected HomeFeature values
    dreamHomeNotes,  // string | null
  }
})
```

Update the HouseholdForm props interface accordingly:
```typescript
interface HouseholdFormProps {
  onComplete: (data: {
    householdSize: UserProfile['householdSize']
    buyerProfile: BuyerProfile
  }) => void
}
```

---

### 5. `components/form/BuyerProfileStep.tsx`

**Delete this file entirely.** All functionality is now in HouseholdForm.

---

### 6. `components/form/TimelineForm.tsx`

**Delete this file entirely.** Timeline is collected in FinancialPictureStep.

---

### 7. `components/results/EmailGate.tsx`

**Remove:** The timeline `<select>` field and its associated state (`timeline`, `setTimeline`).

**Remove:** The `TIMELINE_OPTIONS` import from constants.

**Update:** The API payload — replace `movingTimeline: timeline` with `movingTimeline: profile.movingTimeline`. The value is already on the profile object by the time the gate opens — it was derived from `financial_picture.purchase_timeline` in the explore page handler.

**Keep everything else unchanged.**

---

### 8. `components/quiz/FinancialPictureStep.tsx`

**One change only:** Update the last timeline tile.

Find the tile currently labeled `"12+ months"` with value `'12plus_months'`. Update to:
- Label: `"12+ months · Just exploring"`
- Value: `'exploring'`

This aligns `FinancialPicture.purchase_timeline` with `UserProfile.movingTimeline` values.

---

### 9. `services/matchingService.ts`

#### Remove `isLuxuryPreference` usage

Replace all calls to `isLuxuryPreference(profile.housingPreference)` with a segment-based check:

```typescript
const isLuxury = segment === 'Luxury' || segment === 'Estate'
```

Note: `segment` is derived from `computeAffordability()` which already runs before this check in `getTopMatches`. Use the derived segment value — do not re-compute.

#### Simplify `getMonthlyHousingCost`

This function currently switches on `housingPreference`. With that field removed, simplify to:

```typescript
export function getMonthlyHousingCost(city: Location): number {
  return Math.round(city.housing.medianHomePrice * 0.007)
}
```

Update all call sites that currently pass `profile.housingPreference` as a second argument — remove that argument.

#### Remove `isLuxuryPreference` import

The function is removed from `constants.ts` — remove the import.

#### `checkAffordabilityFlag` — update signature

This function currently calls `isLuxuryPreference`. Replace with segment check:

```typescript
export function checkAffordabilityFlag(city: Location, profile: UserProfile): boolean {
  const { segment, affordabilityFlag } = computeAffordability(
    city.housing.medianHomePrice,
    profile.annualIncome,
    profile.financial_picture
  )
  const isLuxury = segment === 'Luxury' || segment === 'Estate'
  if (isLuxury) return false
  return affordabilityFlag
}
```

---

### 10. `services/quizSessionService.ts`

Update step labels to reflect 4-step structure:

| step | label |
|---|---|
| 1 | household_income |
| 2 | household_dream_home |
| 3 | financial_picture |
| 4 | priorities |

---

### 11. `app/explore/page.tsx`

#### Update STEPS array
```typescript
const STEPS = ['Income', 'Household & Dream Home', 'Financial Picture', 'Priorities']
```

#### Update STEP_HEADLINES array
```typescript
const STEP_HEADLINES = [
  "Let's find your Texas city",
  'Tell us about your household and dream home',
  "Now let's talk about your purchasing power.",
  'What matters most to you?',
]
```

#### Update `handleHousehold`
Now receives both `householdSize` and `buyerProfile`:
```typescript
const handleHousehold = (data: {
  householdSize: UserProfile['householdSize']
  buyerProfile: BuyerProfile
}) => {
  setProfile(p => ({ ...p, householdSize: data.householdSize, buyerProfile: data.buyerProfile }))
  updateSessionStep(sessionId, 2, { householdSize: data.householdSize })
  setStep(2)
}
```

#### Update `handleFinancialPicture`
Derive `movingTimeline` from `purchase_timeline`:
```typescript
const handleFinancialPicture = (financial_picture: FinancialPicture) => {
  // Map purchase_timeline to movingTimeline
  const timelineMap: Record<FinancialPicture['purchase_timeline'], UserProfile['movingTimeline']> = {
    '0-3months': '0-3months',
    '3-6months': '3-6months',
    '6-12months': '6-12months',
    'exploring': 'exploring',
  }
  const movingTimeline = timelineMap[financial_picture.purchase_timeline]
  setProfile(p => ({ ...p, financial_picture, movingTimeline }))
  updateSessionStep(sessionId, 3, {})
  setStep(3)
}
```

#### Update `handlePriorities`
This was Step 4, now Step 3 (index 3). On completion, save to sessionStorage and route to results — same as `handleBuyerProfile` did previously:
```typescript
const handlePriorities = (
  mustHaves: (keyof LifestyleScores)[],
  niceToHaves: (keyof LifestyleScores)[],
  notPriorities: (keyof LifestyleScores)[]
) => {
  const finalProfile: UserProfile = {
    ...(profile as UserProfile),
    mustHaves,
    niceToHaves,
    notPriorities,
  }
  sessionStorage.setItem(SESSION_PROFILE_KEY, JSON.stringify(finalProfile))
  sessionStorage.removeItem('hq_metro')
  updateSessionStep(sessionId, 4, { mustHaves, niceToHaves, notPriorities })
  router.push(`/results/${sessionId}`)
}
```

#### Remove handlers
- `handleTimeline` — remove entirely
- `handleBuyerProfile` — remove entirely

#### Update step renders
```typescript
{step === 0 && <IncomeForm onComplete={handleIncome} defaultValue={profile.annualIncome} />}
{step === 1 && <HouseholdForm onComplete={handleHousehold} />}
{step === 2 && (
  <FinancialPictureStep
    onNext={handleFinancialPicture}
    onBack={() => setStep(1)}
    initialData={profile.financial_picture}
  />
)}
{step === 3 && <PrioritySelector onComplete={handlePriorities} />}
```

#### Remove imports
- `TimelineForm`
- `BuyerProfileStep`

#### Update back button logic
Back button renders for steps 1 and 2 only (FinancialPictureStep and PrioritySelector handle their own back buttons):
```typescript
{step === 1 && (
  <button onClick={() => setStep(s => s - 1)} className="mt-4 w-full text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium">
    ← Back
  </button>
)}
```

---

## No Database Changes Required

`buyer_profile` JSONB column already exists in `public.users`. The expanded `BuyerProfile` (with `features` array and `dreamHomeNotes`) will serialize cleanly into the existing JSONB column. No migration needed.

---

## Acceptance Criteria

- [ ] Quiz renders exactly 4 steps — Income, Household & Dream Home, Financial Picture, Priorities
- [ ] Step indicator reads "Step X of 4" throughout
- [ ] Progress bar shows 4 segments throughout
- [ ] HouseholdForm collects: household size (required), bedrooms (required), bathrooms (required), home type (required), construction (required), features (optional multi-select), dream home notes (optional free text)
- [ ] All 10 feature filter tiles render and multi-select correctly
- [ ] Free text field renders and saves correctly
- [ ] Garage and pool features pass `&hasGarage=true` and `&hasPool=true` to Zillow URL
- [ ] Housing preference question is completely removed — no trace in UI or code
- [ ] TimelineForm is deleted — no imports remain
- [ ] BuyerProfileStep is deleted — no imports remain
- [ ] Email Gate has no timeline field — timeline derived silently from profile
- [ ] `movingTimeline` derives correctly from `financial_picture.purchase_timeline` in all cases
- [ ] Last timeline tile in Financial Picture reads "12+ months · Just exploring" with value `'exploring'`
- [ ] Affordability flag suppressed for Luxury and Estate segments (not based on housingPreference)
- [ ] `getMonthlyHousingCost` simplified — no housingPreference argument
- [ ] `isLuxuryPreference` function completely removed from codebase
- [ ] `HOUSING_OPTIONS` completely removed from codebase
- [ ] `TIMELINE_OPTIONS` completely removed from codebase
- [ ] `tsc --noEmit` passes with zero errors
- [ ] Full quiz flow completes end-to-end and routes to results
- [ ] `buyer_profile` saves to Supabase with features array and dreamHomeNotes populated
- [ ] Back navigation works correctly across all 4 steps
- [ ] Mobile responsive — feature tiles 2×2 on mobile

---

## Testing Instructions

1. Run full quiz end-to-end with a test email
2. Verify all 4 steps render correctly
3. On Step 2 — select household size, fill required fields, select 3–4 feature tiles, add free text
4. On Step 3 — select "12+ months · Just exploring" — verify it saves as `'exploring'`
5. Complete priorities and verify results page loads
6. Check Supabase `public.users` — confirm `buyer_profile` contains `features` array and `dreamHomeNotes`
7. Check Zillow URL on a result card — if garage or pool selected, confirm parameters appear in URL
8. Run with a high-income / high-down-payment profile — verify Luxury/Estate segment suppresses affordability flag
9. Run `tsc --noEmit` — must pass clean

---

## What This Brief Does NOT Cover

- Portal display of dream home preferences (Phase 2)
- Ambassador dashboard showing feature filter data (Phase 2)
- Neighborhood-level filtering by features (Phase 2)

---

*Brief prepared by Claude (COO) — May 30, 2026. Approved by Craig Asbach.*
