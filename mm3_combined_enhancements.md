# Build Brief — MM3 Financial Enhancements + Full Report Modal
**Date:** June 4, 2026
**For:** Claude Code
**Type:** Execute — all changes to MM3Discover.tsx in one pass
**Priority:** Medium-High
**Report back:** Confirm all changes complete, commit and push to main

---

## Overview

Four changes to MM3Discover.tsx in one pass:
1. Exact amount input fields — stronger gold border + currency auto-formatting
2. 30-year / 15-year loan term toggle
3. Full Report opens as modal popup instead of navigating away
4. Log mortgage types as future build item (no code change needed)

---

## Change 1 — Exact Amount Fields: Border + Currency Formatting

### Border styling:
Find the two exact amount input fields (below Down Payment and
Home Sale Proceeds range selectors). Update their border:

```javascript
border: '1px solid rgba(184,145,42,0.4)',
background: 'rgba(184,145,42,0.04)',
```

Add focus handler to strengthen border on focus:
```javascript
onFocus={e => e.target.style.border = '1px solid #B8912A'}
onBlur={e => e.target.style.border = '1px solid rgba(184,145,42,0.4)'}
```

### Currency auto-formatting:
Add these helper functions near the top of the component:

```javascript
function formatCurrency(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '')
  if (!digits) return ''
  const num = parseInt(digits, 10)
  return '$' + num.toLocaleString('en-US')
}

function parseCurrency(formatted: string): number | null {
  const digits = formatted.replace(/[^0-9]/g, '')
  if (!digits) return null
  const num = parseInt(digits, 10)
  return isNaN(num) ? null : num
}
```

Update both exact amount input onChange handlers:
```javascript
onChange={e => setExactDownPayment(formatCurrency(e.target.value))}
onChange={e => setExactHomeProceeds(formatCurrency(e.target.value))}
```

Update all places that parse exact amounts to use parseCurrency()
instead of parseExactAmount() (or update parseExactAmount to use
the same logic).

Placeholder text for both fields: "e.g. $47,500"

Behavior: typing "47500" displays "$47,500". Backspace and
editing work naturally. Pasting numbers auto-formats.

---

## Change 2 — 30-Year / 15-Year Loan Term Toggle

### New state variable:
```javascript
const [loanTerm, setLoanTerm] = useState<30 | 15>(30)
```

### UI — Toggle component:
Place immediately below or alongside the Rate Assumption slider.
Label: "Loan term"

```jsx
<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
    Loan term
  </span>
  <div style={{
    display: 'flex',
    border: '0.5px solid var(--color-border-tertiary)',
    borderRadius: '6px',
    overflow: 'hidden'
  }}>
    {([30, 15] as const).map(term => (
      <button
        key={term}
        onClick={() => setLoanTerm(term)}
        style={{
          padding: '4px 12px',
          fontSize: '12px',
          fontWeight: loanTerm === term ? 500 : 400,
          background: loanTerm === term ? '#B8912A' : 'transparent',
          color: loanTerm === term ? '#fff' : 'var(--color-text-secondary)',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.15s'
        }}
      >
        {term}-yr
      </button>
    ))}
  </div>
</div>
```

### Update mortgage calculation:
Find where the monthly mortgage payment is calculated.
Currently uses 360 months (30-year hardcoded). Update to:

```javascript
const months = loanTerm * 12  // 360 or 180

// 15-year gets a 0.5% rate reduction (market standard)
const effectiveRate = loanTerm === 15
  ? Math.max(rateAssumption - 0.5, 2.0)
  : rateAssumption

const monthlyRate = (effectiveRate / 100) / 12
const payment = loanAmount *
  (monthlyRate * Math.pow(1 + monthlyRate, months)) /
  (Math.pow(1 + monthlyRate, months) - 1)
```

### Update affordability line:
Currently shows: "Based on [City] · 6.75% rate"
Update to show: "Based on [City] · [effectiveRate]% rate · [loanTerm]-year"
Example: "Based on Round Rock · 6.25% rate · 15-year"

### Add note when 15-year selected:
```jsx
{loanTerm === 15 && (
  <p style={{
    fontSize: '11px',
    color: 'var(--color-text-tertiary)',
    marginTop: '4px'
  }}>
    15-year builds equity faster — higher monthly, less total interest
  </p>
)}
```

### Pass to Supabase on advance:
When client commits direction, add to the Supabase update:
```javascript
loan_term_preference: loanTerm
```

Check if loan_term_preference exists on public.users.
If not, create a migration to add it as integer nullable.

---

## Change 3 — Full Report as Modal Popup

### Problem:
"View Full Report" currently calls router.push() to navigate
away from MM3. This loses the user's sandbox state.

### New state:
```javascript
const [reportCity, setReportCity] = useState<Location | null>(null)
```

### Update the View Full Report button:
Replace router.push() with:
```javascript
onClick={() => {
  setReportCity(cityPopup.location)
  setCityPopup(null)  // close the city detail popup first
}}
```

### Modal:
Add this modal at the bottom of the MM3Discover JSX return,
before the closing fragment:

```jsx
{reportCity && (
  <div
    onClick={() => setReportCity(null)}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.75)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      overflowY: 'auto',
      padding: '40px 16px'
    }}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{
        background: 'var(--color-background-primary)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '800px',
        overflow: 'hidden',
        marginBottom: '40px'
      }}
    >
      {/* Modal Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        background: '#16120D',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div>
          <p style={{
            fontSize: '10px', color: '#9A8E82',
            textTransform: 'uppercase', letterSpacing: '0.12em',
            marginBottom: '2px'
          }}>
            Full Report
          </p>
          <p style={{ fontSize: '16px', fontWeight: 500, color: '#E8E2D9' }}>
            {reportCity.name}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: '6px 14px', fontSize: '12px', fontWeight: 500,
              border: '0.5px solid rgba(232,226,217,0.3)',
              borderRadius: '6px', background: 'transparent',
              color: '#E8E2D9', cursor: 'pointer'
            }}
          >
            Print
          </button>
          <button
            onClick={() => window.open(`/report/${reportCity.id}`, '_blank')}
            style={{
              padding: '6px 14px', fontSize: '12px', fontWeight: 500,
              border: 'none', borderRadius: '6px',
              background: '#B8912A', color: '#fff', cursor: 'pointer'
            }}
          >
            Download ↓
          </button>
          <button
            onClick={() => setReportCity(null)}
            style={{
              padding: '6px 10px', fontSize: '18px',
              border: 'none', background: 'transparent',
              color: '#9A8E82', cursor: 'pointer', lineHeight: 1
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Modal Body */}
      <div style={{ padding: '24px' }}>
        <FullReport
          location={reportCity}
          profile={profile}
          session={session}
        />
      </div>
    </div>
  </div>
)}
```

Import FullReport at the top of MM3Discover.tsx if not
already imported. Check what props MM2Discover passes to
FullReport and replicate — likely location, profile, session,
and possibly matchScore or affordability data.

---

## Acceptance Criteria

**Exact amount fields:**
- [ ] Gold-tinted border on both fields
- [ ] Full gold border on focus
- [ ] Typing "47500" displays "$47,500"
- [ ] Backspace and pasting work correctly
- [ ] Raw number used in calculations

**30/15 toggle:**
- [ ] Toggle renders near Rate Assumption slider
- [ ] Defaults to 30-yr
- [ ] Switching to 15-yr updates mortgage calculation immediately
- [ ] 15-yr rate is 0.5% lower than selected rate assumption
- [ ] Affordability line shows effective rate and loan term
- [ ] "Builds equity faster" note shows for 15-yr
- [ ] loan_term_preference written to Supabase on advance

**Full Report Modal:**
- [ ] "View Full Report" opens modal, does not navigate away
- [ ] City name shown in dark modal header
- [ ] Print button triggers window.print()
- [ ] Download button opens /report/[slug] in new tab
- [ ] ✕ closes modal
- [ ] Clicking overlay closes modal
- [ ] MM3 sandbox state preserved when modal closes
- [ ] Modal scrollable for long reports

**All:**
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add components/portal/milemarkers/MM3Discover.tsx
git add supabase/migrations/[timestamp]_users_loan_term.sql
git commit -m "feat: MM3 currency formatting, 30/15 loan toggle, full report modal"
git push origin main
```

Confirm push — paste commit hash.
