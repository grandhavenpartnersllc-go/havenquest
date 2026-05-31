# HavenQuest — Step 5 Buyer Profile & Rental Removal Brief
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 28, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P1 — Pre-beta expansion

---

## Summary

This brief covers two related changes:

1. **Add Quiz Step 5** — "Tell us about your home" — a buyer profile step collecting bedrooms, bathrooms, home type, and construction preference. Inserted after Step 4 (priority selector), before results.

2. **Remove all rental paths** — HavenQuest is a home buyers platform. All rental logic, rental housing preference options, and rental Zillow URL modes are to be removed entirely.

Both changes should be implemented in a single Claude Code session and committed together.

---

## Part 1 — Remove Rental Paths

### What to remove

**In the quiz housing preference options:**
- Remove `rent1BR`, `rent2BR`, `rent3BR` as selectable options
- If these are the only rental options, remove the entire rental housing preference section
- If the quiz has a "buy vs rent" question anywhere, remove it — everyone is a buyer

**In `matchingService.ts` / `generateZillowUrl`:**
- Remove the rental URL mode entirely
- Remove rental-specific URL construction logic (`price=0-{maxBudget}` with `/homes/for_rent/` path)
- Keep luxury for-sale mode unchanged
- Keep standard for-sale mode unchanged

**In `ListingsButton.tsx`:**
- Remove the rental subtext branch added in the previous session
- The subtext now has two states only: standard for-sale and luxury
- Update standard for-sale subtext to: `"Filtered to your budget and bedroom preference"` — this will be fully accurate once Step 5 bedroom data is wired in (see Part 2)

**In any other components:**
- Search for any remaining rental references in copy, labels, or logic and remove

---

## Part 2 — Add Quiz Step 5: Buyer Profile

### Step design

**Step label:** Step 5 of 5  
**Headline:** "Tell us about your home"  
**Subhead:** "This helps us match listings to your preferences."  
**Layout:** Four question groups, each with visual tile selectors  
**Skip behavior:** No skip button. Every question includes a "No preference" tile. Users must submit the step but can select "No preference" for any or all questions.

---

### Question 1 — Bedrooms

**Label:** Bedrooms  
**Options (tiles):**
- 2 bedrooms
- 3 bedrooms
- 4 bedrooms
- 5+ bedrooms
- No preference

**Field name:** `bedrooms`  
**Stored value:** `2 | 3 | 4 | 5 | null` (null = No preference)

---

### Question 2 — Bathrooms

**Label:** Bathrooms  
**Options (tiles):**
- 1 bathroom
- 2 bathrooms
- 3 bathrooms
- 3+ bathrooms
- No preference

**Field name:** `bathrooms`  
**Stored value:** `1 | 2 | 3 | null` (null = No preference)

---

### Question 3 — Home Type

**Label:** Home type  
**Options (tiles):**
- Single family
- Townhome
- Condo
- No preference

**Field name:** `homeType`  
**Stored value:** `'singleFamily' | 'townhome' | 'condo' | null`

---

### Question 4 — New or Resale

**Label:** Construction  
**Options (tiles):**
- New construction
- Resale
- No preference

**Field name:** `constructionPreference`  
**Stored value:** `'new' | 'resale' | null`

---

### Step 5 component

Create `components/form/BuyerProfileStep.tsx`

- Follows the same visual pattern as existing quiz steps
- Four question groups rendered as tile selector grids
- All four fields tracked in local state
- "Continue" button submits all four values and advances to results
- Continue button is always enabled — "No preference" is a valid answer for all fields
- Pass collected values up to the parent quiz state via props/callback

---

### Quiz flow update

Update the parent quiz component to:
1. Add Step 5 as the final step before results
2. Update step counter display (now 5 steps total)
3. Store all four new fields in the quiz session/profile state alongside existing fields

---

## Part 3 — Zillow URL Updates

### Pass bedroom and bathroom count to Zillow for-sale URL

Update `generateZillowUrl` in `matchingService.ts`:

**Standard for-sale URL (updated):**
```
https://www.zillow.com/homes/for_sale/{City-Name}-TX_rb/?price=0-{maxBudget}&beds={bedrooms}&baths={bathrooms}
```

**Parameter logic:**
- `beds` — only append if `bedrooms` is not null. Use value as-is (2, 3, 4, 5)
- `baths` — only append if `bathrooms` is not null. Use value as-is (1, 2, 3)
- `price` — unchanged, derived from `annualIncome × 4.5`
- If both are null (No preference selected for both) — pass price only, no beds/baths params

**Home type mapping to Zillow:**
- `singleFamily` → append `&home_type=house` to URL
- `townhome` → append `&home_type=townhouse`
- `condo` → append `&home_type=condo_co-op`
- `null` — do not append home_type param

**Construction preference:**
- `new` → append `&built_since_year=2015` (captures most new construction inventory)
- `resale` → append `&built_before_year=2015`
- `null` — do not append

**Luxury for-sale URL:** unchanged — no bedroom/bathroom filtering applied to luxury path

---

## Part 4 — Data Storage

### Update user profile schema

The four new fields need to be saved to the user's profile in Supabase alongside existing match data.

**Add to the user profile object passed to Supabase on account creation:**
```typescript
buyerProfile: {
  bedrooms: number | null,
  bathrooms: number | null,
  homeType: 'singleFamily' | 'townhome' | 'condo' | null,
  constructionPreference: 'new' | 'resale' | null,
}
```

**Storage options (Claude Code to determine best fit):**
- Add as a `buyer_profile` JSONB column to `public.users` table in Supabase, OR
- Add as individual columns if the schema supports it cleanly

**Note:** These fields are stored for two purposes:
1. Immediate use — Zillow URL parameter construction
2. Future use — Phase 2 IDX listing filters and Ambassador/realtor profile view

If adding a new Supabase column, update the RLS policies to allow the user to read their own `buyer_profile` field (same pattern as existing `top_city_matches` policy).

---

## Part 5 — TypeScript Interface Updates

Add the following to `/types/index.ts`:

```typescript
export interface BuyerProfile {
  bedrooms: 2 | 3 | 4 | 5 | null
  bathrooms: 1 | 2 | 3 | null
  homeType: 'singleFamily' | 'townhome' | 'condo' | null
  constructionPreference: 'new' | 'resale' | null
}
```

Update the `UserProfile` or equivalent interface to include `buyerProfile: BuyerProfile`

Update `generateZillowUrl` signature to accept `buyerProfile` as a parameter.

---

## Implementation Order for Claude Code

1. Remove rental paths (Part 1) — simplest, no new components
2. Update TypeScript interfaces (Part 5) — establish types before building
3. Create `BuyerProfileStep.tsx` component (Part 2)
4. Update quiz parent to include Step 5 (Part 2)
5. Update Supabase schema for `buyer_profile` storage (Part 4)
6. Update `generateZillowUrl` to accept and use buyer profile data (Part 3)
7. Update `ListingsButton` subtext (Part 1 cleanup)
8. Run `tsc --noEmit` — verify clean
9. Commit and push

---

## Implementation Notes

- Do not change any existing quiz steps (1–4) — Step 5 is additive only
- Do not change any data files in `/data`
- Do not change matching algorithm logic
- The `buyerProfile` data does not affect city match scores — it only affects Zillow URL construction and profile storage
- If Supabase schema change requires a migration, create the migration file and note it in the commit message
- Visual design of Step 5 tiles should match existing quiz step tile patterns exactly — no new design patterns

---

## Claude Code Prompt

See bottom of document.

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. May 28, 2026.*
