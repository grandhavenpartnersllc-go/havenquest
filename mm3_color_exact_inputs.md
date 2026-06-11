# Build Brief — MM3 Nice to Have Color Fix + Exact Number Inputs
**Date:** June 4, 2026
**For:** Claude Code
**Type:** Execute — two fixes and one enhancement
**Priority:** Medium
**Report back:** Confirm all changes complete, commit and push to main

---

## Fix 1 — Nice to Have Color References

**File:** `components/portal/milemarkers/MM3Discover.tsx`

Nice to Have was changed from gray to blue in the priority grid.
Two places still reference gray — update both to blue.

### 1a — Priority Summary tags
Find where Priority Summary renders the "Nice to Have" category
tags (the pills showing categories like Nightlife, Affordability
under NICE TO HAVE label). These tags are currently styled gray.
Change their background and text color to match the blue used in
the priority grid column.

Use the same blue values already used for Nice to Have circles
in the grid — likely a blue from the existing color constants
in the file. Report what blue hex is used for Nice to Have in
the grid and apply the same to these tags.

### 1b — Instruction text under "Adjust Your Priorities"
Find the instruction line:
"Gold = Must Have · Green = Important · Gray = Nice to Have"

Change "Gray = Nice to Have" to "Blue = Nice to Have"

---

## Enhancement — Optional Exact Number Inputs

**File:** `components/portal/milemarkers/MM3Discover.tsx`

Add optional exact number input fields below the Down Payment
and Home Sale Proceeds range selectors in the "Adjust Your
Financial Picture" section.

### New state variables:
```javascript
const [exactDownPayment, setExactDownPayment] = useState<string>('')
const [exactHomeProceeds, setExactHomeProceeds] = useState<string>('')
```

### UI — below each range selector, add:
```jsx
<div style={{ marginTop: '6px' }}>
  <label style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
    Or enter exact amount (optional)
  </label>
  <input
    type="text"
    placeholder="e.g. $47,500"
    value={exactDownPayment}
    onChange={e => setExactDownPayment(e.target.value)}
    style={{
      width: '100%',
      fontSize: '13px',
      padding: '6px 10px',
      borderRadius: '6px',
      border: '0.5px solid var(--color-border-tertiary)',
      background: 'var(--color-background-primary)',
      color: 'var(--color-text-primary)'
    }}
  />
</div>
```

Apply the same pattern for Home Sale Proceeds using
exactHomeProceeds state.

### Override logic:
The financial calculation currently uses getDownPaymentMidpoint()
and similar helpers to extract a number from the range string.

Add a helper to parse the exact input:
```javascript
function parseExactAmount(val: string): number | null {
  if (!val.trim()) return null
  const num = parseFloat(val.replace(/[$,\s]/g, ''))
  return isNaN(num) ? null : num
}
```

Where downMid is computed, update to:
```javascript
const downMid = parseExactAmount(exactDownPayment) ?? getDownPaymentMidpoint(downPayment)
```

Apply the same pattern for home sale proceeds.

### Pass to Market Director:
When the advance/commit button fires (writing to Supabase),
include exact values if provided:
```javascript
exact_down_payment: parseExactAmount(exactDownPayment) ?? null,
exact_home_proceeds: parseExactAmount(exactHomeProceeds) ?? null,
```

Check if these fields exist on public.users. If not, add them
as numeric nullable columns in a migration file.

### Validation:
- Accept any numeric input with optional $ and commas
- Strip formatting before parsing
- If the parsed value is not a valid positive number, ignore it
  and fall back to the range midpoint (do not show an error —
  just treat invalid input as empty)
- No minimum or maximum enforcement — the user knows their
  situation better than we do

---

## Acceptance Criteria

- [ ] Priority Summary "Nice to Have" tags display in blue
- [ ] Instruction text reads "Blue = Nice to Have" not "Gray"
- [ ] Exact amount fields appear below Down Payment and Home
      Sale Proceeds range selectors
- [ ] Fields are clearly labeled as optional
- [ ] When exact amount is entered, financial panel updates
      to reflect exact number (not range midpoint)
- [ ] When exact amount is cleared, reverts to range midpoint
- [ ] Exact values passed to Supabase on advance
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add components/portal/milemarkers/MM3Discover.tsx
git add supabase/migrations/[timestamp]_users_exact_financials.sql
git commit -m "fix: Nice to Have blue color, exact financial inputs in MM3 sandbox"
git push origin main
```

Confirm push — paste commit hash.
