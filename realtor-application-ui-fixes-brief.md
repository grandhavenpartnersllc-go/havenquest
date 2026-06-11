# Build Brief — Realtor Application UI Fixes
**Project:** HavenQuest  
**Date:** May 30, 2026  
**Status:** PENDING — Ready for Claude Code  
**Priority:** High — affects live realtor application flow  
**Prepared by:** Claude (COO)  
**Approved by:** Craig Asbach  

---

## Overview

Six targeted fixes across two components following end-to-end testing of the realtor application flow. No new features — all fixes to existing UI and validation.

---

## Files to Modify

| File | Changes |
|---|---|
| `components/for-realtors/ForRealtorsClient.tsx` | Phone required + formatted, zones modal, backslash bug fix |
| `components/realtors/FullApplicationClient.tsx` | Phone required + formatted, TREC validation, dollar volume formatting |

---

## Fix 1 — Phone Number Required + Formatted (Both Files)

### ForRealtorsClient.tsx
- Make phone required — add validation: if phone is empty on submit show inline error "Phone number is required"
- Format as user types — as user enters digits, format display as `(XXX) XXX-XXXX`
- Store raw digits in state, display formatted value in input
- Change label from "Phone number (optional)" to "Phone number *" with red asterisk

### FullApplicationClient.tsx
- Same changes — make phone required with same validation message
- Same formatting pattern `(XXX) XXX-XXXX` as user types
- Change label to show required indicator

### Phone formatting function (use in both files):
```typescript
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}
```

Store raw digits for API submission. Display formatted value in input field.

---

## Fix 2 — TREC License Number Validation (`FullApplicationClient.tsx`)

- Validate that TREC license number is exactly 6 digits — numbers only, no letters, no dashes
- Show inline error on submit attempt: "TREC license number must be exactly 6 digits"
- Do not block typing — validate on submit only
- Add `maxLength={6}` to the input field
- Change `type="text"` to `type="text"` with `inputMode="numeric"` and `pattern="[0-9]{6}"`

---

## Fix 3 — Dollar Volume Formatting (`FullApplicationClient.tsx`)

Convert buyer and seller transaction volume inputs from raw `type="number"` to formatted currency inputs.

### Behavior
- Display: formatted with `$` prefix and comma separators as user types — `$3,200,000`
- Storage: store raw numeric value in state for calculations and API submission
- Input type: change from `type="number"` to `type="text"` with `inputMode="numeric"`
- Placeholder: change from `"0"` to `"$0"`

### Formatting function:
```typescript
function formatCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  return '$' + parseInt(digits, 10).toLocaleString()
}

function parseCurrencyInput(formatted: string): number {
  return parseInt(formatted.replace(/\D/g, ''), 10) || 0
}
```

### State handling
Keep a separate display state for each volume field:
- `buyerVolumeDisplay` — formatted string shown in input
- `sellerVolumeDisplay` — formatted string shown in input
- `formData.buyerTransactionVolume` — raw number used for total calculation and API submission
- `formData.sellerTransactionVolume` — raw number used for total calculation and API submission

Update `onChange` handlers to update both display state and raw state simultaneously.

The total row already formats correctly — no change needed there.

---

## Fix 4 — Zones Modal (`ForRealtorsClient.tsx`)

Replace the "View all market zones →" link (currently opens `/zones` in new tab) with a modal that opens inline on the page.

### Current code to replace:
```tsx
<a href="\zones" target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">
  View all market zones →
</a>
```

### Replace with:
```tsx
<button
  type="button"
  onClick={() => setZonesModalOpen(true)}
  className="text-xs text-accent hover:underline"
>
  View all market zones →
</button>
```

### Modal content
Add a modal component inline in ForRealtorsClient.tsx. When open, shows all 51 zones organized by metro group — same groups and options as the market specialty dropdown. Read-only reference only — no selection from the modal.

Modal structure:
- Overlay: dark semi-transparent background
- Card: white, rounded, max-width 600px, scrollable content
- Header: "Texas Market Zones" + close button (X)
- Content: zones listed by metro group with group headers (AUSTIN METRO, DALLAS-FORT WORTH METRO, etc.)
- Close: X button top right + click outside to close

Add `zonesModalOpen` boolean state. Set to false by default.

---

## Fix 5 — Backslash Bug (`ForRealtorsClient.tsx`)

The "View all market zones" link has `href="\zones"` — backslash instead of forward slash. This is now resolved by replacing the link with a modal button (Fix 4), but verify no other backslash path references exist in this file.

---

## Acceptance Criteria

- [ ] Phone required on interest form — shows error if empty on submit
- [ ] Phone required on full application — shows error if empty on submit
- [ ] Phone formats as `(XXX) XXX-XXXX` as user types on both forms
- [ ] Raw phone digits stored and submitted to API (not formatted string)
- [ ] TREC number validates as exactly 6 digits on submit
- [ ] TREC error message shows correctly on invalid input
- [ ] Buyer volume input displays with `$` and comma formatting as user types
- [ ] Seller volume input displays with `$` and comma formatting as user types
- [ ] Raw numeric values used for total calculation and API submission
- [ ] Total row continues to calculate and display correctly
- [ ] "View all market zones" opens modal inline — does not navigate away
- [ ] Modal shows all 51 zones organized by metro group
- [ ] Modal closes on X button click and on click outside
- [ ] No backslash path references remain in ForRealtorsClient.tsx
- [ ] `tsc --noEmit` passes clean

---

*Brief prepared by Claude (COO) — May 30, 2026. Approved by Craig Asbach.*
