# Fix Brief — MM3 Worksheet Banner + Household Placeholder + MM1 Divider + Committed Direction Summary
**Date:** June 4, 2026
**For:** Claude Code
**Type:** Execute — four fixes across three files
**Priority:** Medium
**Report back:** Confirm all changes complete, commit and push to main

---

## Fix 1 — MM3 Worksheet Orientation Banner
**File:** `components/portal/milemarkers/MM3Discover.tsx`

Add a dismissible orientation banner at the very top of MM3
content area — above everything else including the financial
picture and rankings panels.

### New state variable:
```javascript
const [worksheetDismissed, setWorksheetDismissed] = useState(false)
```

### On mount — check sessionStorage:
```javascript
useEffect(() => {
  if (sessionStorage.getItem('mm3_worksheet_dismissed') === 'true') {
    setWorksheetDismissed(true)
  }
}, [])
```

### Banner JSX — render when worksheetDismissed === false:
```jsx
{!worksheetDismissed && (
  <div style={{
    borderLeft: '4px solid #B8912A',
    background: 'rgba(184,145,42,0.06)',
    borderRadius: '0 8px 8px 0',
    padding: '16px 20px',
    marginBottom: '24px',
    position: 'relative'
  }}>
    <p style={{
      fontSize: '10px', fontWeight: 600, color: '#B8912A',
      letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px'
    }}>
      Your Discover Worksheet
    </p>
    <p style={{
      fontSize: '13px', color: 'var(--color-text-primary)',
      fontWeight: 500, marginBottom: '8px', lineHeight: 1.5
    }}>
      This is one of the most important steps in your Navigator journey.
    </p>
    <p style={{
      fontSize: '13px', color: 'var(--color-text-secondary)',
      lineHeight: 1.6, marginBottom: '8px'
    }}>
      Before your Market Director can guide you effectively, they need
      a clear picture of two things: where you want to be, and what you
      can realistically spend. This worksheet helps you define both.
    </p>
    <p style={{
      fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6
    }}>
      Take your time. Adjust your priorities. Refine your financial
      picture. Explore the cities that match your life. When you're
      ready — lock your financials, choose your top communities, and
      commit your direction. Your Market Director receives everything
      you complete here before your first conversation.
    </p>
    <button
      onClick={() => {
        setWorksheetDismissed(true)
        sessionStorage.setItem('mm3_worksheet_dismissed', 'true')
      }}
      style={{
        position: 'absolute', top: '12px', right: '16px',
        background: 'transparent', border: 'none',
        fontSize: '12px', color: '#B8912A', cursor: 'pointer',
        fontWeight: 500, padding: '4px 8px', borderRadius: '4px'
      }}
    >
      Got it ✓
    </button>
  </div>
)}
```

---

## Fix 2 — Committed Direction Summary
**File:** `components/portal/milemarkers/MM3Discover.tsx`

The committed direction card (shown after the user advances)
has three issues to fix:

### 2a — Show both chosen cities, not just top match
Find where "YOUR COMMITTED DIRECTION / TOP MATCH" renders.
Currently shows only the algorithm's top match city.

Replace with the user's chosen cities from the chosenCities
state array:

```jsx
<div>
  <p style={{ fontSize: '10px', fontWeight: 600, color: '#B8912A',
    letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
    Your Committed Direction
  </p>
  <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>
    {chosenCities.length === 1 ? 'Selected community' : 'Selected communities'}
  </p>
  {chosenCities.map(cityId => {
    const city = getAllCities().find(c => c.id === cityId)
    const match = displayedMatches.find(m => m.location.id === cityId)
    return city ? (
      <div key={cityId} style={{ marginBottom: '6px' }}>
        <span style={{ fontSize: '15px', fontWeight: 600,
          color: 'var(--color-text-primary)' }}>
          {city.name}
        </span>
        {match && (
          <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)',
            marginLeft: '8px' }}>
            {match.matchScore}% match
          </span>
        )}
        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)',
          marginTop: '1px' }}>
          {city.metroUsed}
        </p>
      </div>
    ) : null
  })}
</div>
```

### 2b — Show exact financial amounts if provided
Find where the Financial Picture summary line renders
(currently shows "Down payment: $20,000 – $50,000 · Proceeds: ...").

Update to show exact amounts when available:

```javascript
const downDisplay = parseCurrency(exactDownPayment)
  ? `$${parseCurrency(exactDownPayment)!.toLocaleString('en-US')}`
  : downPayment

const proceedsDisplay = parseCurrency(exactHomeProceeds)
  ? `$${parseCurrency(exactHomeProceeds)!.toLocaleString('en-US')}`
  : homeProceeds
```

Use downDisplay and proceedsDisplay in the summary line instead
of the raw range strings.

### 2c — Add loan term to financial summary
After the rate assumption, add the loan term:

Current: "Rate assumption: 6.75%"
Updated: "Rate assumption: 6.75% · {loanTerm}-year"

---

## Fix 3 — Household Size 2-Person Placeholder
**File:** `app/explore/page.tsx`

Find the household size field or selector in Step 2
(Household & Dream Home). Find the option, description,
or placeholder text for 2-person household.

Change the descriptive text or placeholder to:
"Spouse, partner, or roommate"

Report the exact line changed.

---

## Fix 4 — MM1 Mock Portal Phase Divider Glitch
**File:** `components/portal/milemarkers/MM1Explore.tsx`

The "→ Property Decision" phase divider label between the
Plan and Prepare tabs is blocking clicks in that area.

Fix:
1. Add `pointerEvents: 'none'` to the divider element so
   clicks pass through it
2. Change its position to `position: 'absolute'` so it
   floats above the tab bar without occupying space in
   the tab flow
3. Adjust top/left positioning so it sits visually above
   the gap between Plan and Prepare tabs without affecting
   the tab click areas

The divider should be purely decorative — zero interactive
area, no impact on tab clicks.

---

## Acceptance Criteria

**Fix 1 — Worksheet banner:**
- [ ] Banner renders at top of MM3 above all content
- [ ] Gold left border, warm gold-tinted background
- [ ] All copy renders correctly
- [ ] "Got it ✓" button top right dismisses banner
- [ ] sessionStorage key set on dismiss
- [ ] Banner stays dismissed within same session

**Fix 2 — Committed direction:**
- [ ] Both chosen cities show with name, match score, metro
- [ ] Exact amounts show in financial summary when entered
- [ ] Loan term appears next to rate assumption
- [ ] Falls back to ranges gracefully if no exact amounts

**Fix 3 — Household placeholder:**
- [ ] 2-person household option shows "Spouse, partner, or roommate"

**Fix 4 — Phase divider:**
- [ ] Clicking between Plan and Prepare tabs works correctly
- [ ] Divider label still visible but non-interactive
- [ ] No layout shift from the fix

**All:**
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add components/portal/milemarkers/MM3Discover.tsx
git add components/portal/milemarkers/MM1Explore.tsx
git add app/explore/page.tsx
git commit -m "fix: MM3 worksheet banner, committed direction summary, household placeholder, MM1 phase divider"
git push origin main
```

Confirm push — paste commit hash.
