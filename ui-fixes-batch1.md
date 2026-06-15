# Build Brief — UI Fixes Batch 1

## Overview
Four UI fixes to be applied in one commit. Read all relevant files before making any changes.

---

## Fix 1 — MM4 Phone Number Auto-Format

### File: app/portal/mm4/components/sections/Section1Identity.tsx (or wherever the phone input lives — find it)

Add auto-formatting to the phone number input so it displays as (XXX) XXX-XXXX as the user types.

Add a handler function:
```typescript
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}
```

On the phone input onChange, apply the formatter:
```typescript
onChange={(e) => updateField('phone', formatPhone(e.target.value))}
```

The formatted value is what gets saved. The placeholder should remain `(555) 000-0000`.

---

## Fix 2 — MM4 Background Color

### File: app/portal/mm4/page.tsx

Find the outer wrapper div that has `style={{ backgroundColor: '#0A1E3D' }}` (added in the portal-bg-fix). 

First, read app/portal/components/CommandCenter.tsx and find the exact background color hex value used on the Next Action card or box. Use that exact value for the MM4 background.

If the Next Action card uses a CSS variable, resolve it to its hex value by checking portal.css.

Replace `#0A1E3D` on the MM4 wrapper with the Next Action card background color. This should be a soft light blue — approximately `#EFF6FF` or similar. Use whatever the exact value is from the codebase.

---

## Fix 3 — MM4 Bottom Fields Alignment

### File: app/portal/mm4/components/sections/Section6Notes.tsx (or wherever "Additional must-haves" and "Deal breakers" text areas live — find it)

The two text area fields "Additional must-haves not covered by your quiz" and "Deal breakers" are not vertically aligned. 

Fix: wrap both fields in a flex row container with `alignItems: 'flex-start'` so they sit at the same vertical position. Both text areas should be equal width (50/50 split) with a gap between them. Both labels and helper text should align at the top.

---

## Fix 4 — Command Center Progress Ring Border

### File: app/portal/components/CommandCenter.tsx

Find the Journey Status card — the div at approximately line 191 with `backgroundColor: 'var(--card-bg)', borderRadius: '10px', padding: '12px'`. 

Add to that div's style: `border: '1.5px solid var(--brand-blue, #0076B6)'`

The existing `borderRadius: '10px'` gives the rounded corners. Do not change any other styling on this card.

---

## Step — Verify
After all four fixes, confirm:
- Phone input formats correctly as user types
- MM4 background is the light blue from the Next Action card (not navy)
- Bottom two text areas in Section 6 are vertically aligned
- Command Center Journey Status card has a visible blue border with rounded corners

---

## Commit and Deploy
```
git add -A
git commit -m "fix: UI batch — MM4 phone format, background color, field alignment, Command Center card border"
git push origin main
```

Confirm Vercel deployment triggered. Report commit hash.

---

## Report Back
- Exact background color hex used for MM4 (sourced from Next Action card)
- Files changed
- Git commit hash
