# Build Brief — MM3 Discover: Full Dashboard Redesign
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — core Navigator Decision Engine
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Complete layout redesign of MM3Discover.tsx. Replace the current vertical stack layout with a structured dashboard experience:

1. **Header** — title and description (keep existing)
2. **Split dashboard panel** — financial summary left / live city rankings right
3. **Financial adjustments row** — three controls below the dashboard
4. **Priority grid** — bucket counter bar + 4-column icon-in-circle assignment grid
5. **Commit button** — full width at bottom
6. **City snapshot popup** — modal triggered from city ranking cards
7. **Post-commit enhancements** — download button + email trigger

All existing state, logic, Supabase saves, and the committed view stay. This is a layout and UX redesign — the underlying data flow is unchanged.

---

## File to Change

`components/portal/milemarkers/MM3Discover.tsx` — primary file

`services/matchingService.ts` — export 2 helper functions needed for computed financials

`app/api/sandbox-report/route.ts` — CREATE new API route for post-commit email

---

## Part 1 — Export Affordability Helpers from matchingService.ts

The computed financial outputs need `getDownPaymentMidpoint` and `getProceedsMidpoint`. These are currently private. Export them:

```typescript
export function getDownPaymentMidpoint(selection: string): number { ... }
export function getProceedsMidpoint(selection: string | null): number { ... }
```

Also export `calculateMonthlyPayment`:
```typescript
export function calculateMonthlyPayment(principal: number): number { ... }
```

---

## Part 2 — MM3Discover.tsx Redesign

### New state additions

```typescript
const [cityPopup, setCityPopup] = useState<CityMatch | null>(null)
const [emailSent, setEmailSent] = useState(false)
const [sendingEmail, setSendingEmail] = useState(false)
```

### Computed financial outputs

Add these computed values (recalculate on every render — all client-side):

```typescript
import { getDownPaymentMidpoint, getProceedsMidpoint, calculateMonthlyPayment } from '../../../services/matchingService'

const topCity = sandboxMatches[0]?.location
const topCityPrice = topCity?.housing?.medianHomePrice ?? 341800

const downMid = getDownPaymentMidpoint(downPayment)
const procMid = proceeds ? getProceedsMidpoint(proceeds) : 0
const totalFunds = downMid + procMid
const mortgageBalance = Math.max(0, topCityPrice - totalFunds)

// Use interestRate state for display — Phase 2 will wire into ranking math
const monthlyRate = interestRate / 100 / 12
const numPayments = 360
const monthlyMortgage = mortgageBalance > 0
  ? Math.round((mortgageBalance * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1))
  : 0

const monthlyPropertyTax = topCity
  ? Math.round((topCityPrice * (topCity.housing.propertyTaxRate / 100)) / 12)
  : 0

const totalMonthlyHousing = monthlyMortgage + monthlyPropertyTax

const grossMonthlyIncome = (profile?.annualIncome ?? 100000) / 12
const affordabilityPct = grossMonthlyIncome > 0
  ? (totalMonthlyHousing / grossMonthlyIncome) * 100
  : 0

const affordabilityStatus =
  affordabilityPct <= 30 ? 'comfortable'
  : affordabilityPct <= 40 ? 'moderate'
  : 'stretched'
```

---

### New layout — pre-commit view

Replace the existing pre-commit return JSX entirely with this structure:

#### Section 1 — Header (keep existing, no change)

#### Section 2 — Split Dashboard Panel

```tsx
<div className="grid grid-cols-2 gap-3 mb-3">

  {/* LEFT — Financial Summary */}
  <div className="rounded-xl p-4"
       style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}>
    <p className="text-[10px] font-bold uppercase mb-3"
       style={{ color: GOLD, letterSpacing: '0.18em' }}>
      Your financial picture
    </p>

    {/* 4 metric tiles */}
    <div className="grid grid-cols-2 gap-2 mb-4">
      <div className="rounded-xl p-2.5" style={{ backgroundColor: '#F7F6F3' }}>
        <p className="text-[10px] mb-1" style={{ color: '#9A8E82' }}>Down payment</p>
        <p className="text-sm font-bold" style={{ color: WARM_DARK }}>
          ${(downMid + procMid).toLocaleString()}
        </p>
      </div>
      <div className="rounded-xl p-2.5" style={{ backgroundColor: '#F7F6F3' }}>
        <p className="text-[10px] mb-1" style={{ color: '#9A8E82' }}>Est. mortgage</p>
        <p className="text-sm font-bold" style={{ color: WARM_DARK }}>
          ${monthlyMortgage.toLocaleString()}/mo
        </p>
      </div>
      <div className="rounded-xl p-2.5" style={{ backgroundColor: '#F7F6F3' }}>
        <p className="text-[10px] mb-1" style={{ color: '#9A8E82' }}>Est. property tax</p>
        <p className="text-sm font-bold" style={{ color: WARM_DARK }}>
          ${monthlyPropertyTax.toLocaleString()}/mo
        </p>
      </div>
      <div
        className="rounded-xl p-2.5"
        style={{
          backgroundColor:
            affordabilityStatus === 'comfortable' ? '#F0FAF4'
            : affordabilityStatus === 'moderate' ? '#FFFBEB'
            : '#FEF2F2',
        }}
      >
        <p className="text-[10px] mb-1" style={{ color: '#9A8E82' }}>Total housing</p>
        <p className="text-sm font-bold"
           style={{
             color: affordabilityStatus === 'comfortable' ? '#2D7D4E'
               : affordabilityStatus === 'moderate' ? '#B45309'
               : '#DC2626',
           }}>
          ${totalMonthlyHousing.toLocaleString()}/mo
        </p>
      </div>
    </div>

    {/* Affordability status bar */}
    <div className="mb-3 rounded-lg p-2.5"
         style={{
           backgroundColor:
             affordabilityStatus === 'comfortable' ? '#F0FAF4'
             : affordabilityStatus === 'moderate' ? '#FFFBEB'
             : '#FEF2F2',
           border: `1px solid ${
             affordabilityStatus === 'comfortable' ? '#C6E8D4'
             : affordabilityStatus === 'moderate' ? '#FDE68A'
             : '#FECACA'
           }`,
         }}>
      <p className="text-xs font-semibold"
         style={{
           color: affordabilityStatus === 'comfortable' ? '#2D7D4E'
             : affordabilityStatus === 'moderate' ? '#B45309'
             : '#DC2626',
         }}>
        {affordabilityStatus === 'comfortable'
          ? `✓ Comfortable — ${Math.round(affordabilityPct)}% of monthly income`
          : affordabilityStatus === 'moderate'
          ? `⚠ Moderate — ${Math.round(affordabilityPct)}% of monthly income`
          : `⚠ Stretched — ${Math.round(affordabilityPct)}% of monthly income`}
      </p>
      <p className="text-[10px] mt-0.5" style={{ color: '#9A8E82' }}>
        Based on {topCity?.name ?? 'your top city'} · {interestRate.toFixed(2)}% rate
      </p>
    </div>

    {/* Priority summary */}
    <div style={{ borderTop: '1px solid #F0EDE6', paddingTop: '10px' }}>
      <p className="text-[10px] font-bold uppercase mb-2"
         style={{ color: '#9A8E82', letterSpacing: '0.08em' }}>
        Priority summary
      </p>
      {mustHaves.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {mustHaves.map(k => {
            const cat = LIFESTYLE_CATEGORIES.find(c => c.key === k)!
            return (
              <span key={k} className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: 'rgba(184,145,42,0.12)', color: GOLD }}>
                {cat.icon} {cat.label}
              </span>
            )
          })}
        </div>
      )}
      {niceToHaves.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {niceToHaves.map(k => {
            const cat = LIFESTYLE_CATEGORIES.find(c => c.key === k)!
            return (
              <span key={k} className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: '#E8F5EE', color: '#2D7D4E' }}>
                {cat.icon} {cat.label}
              </span>
            )
          })}
        </div>
      )}
    </div>
  </div>

  {/* RIGHT — Live City Rankings */}
  <div className="rounded-xl p-4"
       style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}>
    <p className="text-[10px] font-bold uppercase mb-3"
       style={{ color: GOLD, letterSpacing: '0.18em' }}>
      Live city rankings
    </p>
    <div className="space-y-2">
      {sandboxMatches.map((match, i) => (
        <div
          key={match.location.id}
          className="rounded-xl p-3"
          style={{
            backgroundColor: '#F7F6F3',
            borderLeft: i === 0 ? `3px solid ${GOLD}` : '3px solid transparent',
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold"
                    style={{ color: i === 0 ? GOLD : '#9A8E82' }}>
                #{i + 1}
              </span>
              <span className="text-sm font-bold" style={{ color: WARM_DARK }}>
                {match.location.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-12 h-1.5 rounded-full overflow-hidden"
                   style={{ backgroundColor: '#E5E7EB' }}>
                <div className="h-full rounded-full"
                     style={{ width: `${match.matchScore}%`, backgroundColor: GOLD }} />
              </div>
              <span className="text-xs font-bold" style={{ color: GOLD }}>
                {match.matchScore}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[10px]" style={{ color: '#9A8E82' }}>
              {match.location.metroUsed}
            </p>
            <button
              onClick={() => setCityPopup(match)}
              className="text-[10px] font-semibold underline underline-offset-2"
              style={{ color: GOLD }}
            >
              Learn more →
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>

</div>
```

---

#### Section 3 — Financial Adjustments Row (below dashboard)

```tsx
<div className="rounded-xl p-4 mb-6"
     style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}>
  <p className="text-[10px] font-bold uppercase mb-3"
     style={{ color: GOLD, letterSpacing: '0.18em' }}>
    Adjust your financial picture
  </p>
  <div className="grid grid-cols-3 gap-4">
    {/* Down payment */}
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: WARM_DARK }}>
        Down payment
      </label>
      <select
        value={downPayment}
        onChange={e => setDownPayment(e.target.value)}
        className="w-full rounded-xl border px-3 py-2 text-xs appearance-none"
        style={{ borderColor: '#E5E7EB', color: WARM_DARK }}
      >
        {DOWN_PAYMENT_OPTIONS.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>

    {/* Proceeds */}
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: WARM_DARK }}>
        Home sale proceeds
      </label>
      <select
        value={proceeds ?? 'None'}
        onChange={e => setProceeds(e.target.value === 'None' ? null : e.target.value)}
        className="w-full rounded-xl border px-3 py-2 text-xs appearance-none"
        style={{ borderColor: '#E5E7EB', color: WARM_DARK }}
      >
        <option value="None">None</option>
        {PROCEEDS_OPTIONS.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>

    {/* Interest rate */}
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-semibold" style={{ color: WARM_DARK }}>
          Rate assumption
        </label>
        <span className="text-xs font-bold" style={{ color: GOLD }}>
          {interestRate.toFixed(2)}%
        </span>
      </div>
      <input
        type="range"
        min={3.0}
        max={10.0}
        step={0.25}
        value={interestRate}
        onChange={e => setInterestRate(parseFloat(e.target.value))}
        className="w-full accent-amber-600 mt-2"
      />
      <div className="flex justify-between text-[10px] mt-0.5" style={{ color: '#9A8E82' }}>
        <span>3%</span>
        <span>10%</span>
      </div>
    </div>
  </div>
</div>
```

---

#### Section 4 — Priority Grid (replace existing slider section)

Keep the bucket counter bar exactly as-is. Replace the slider legend and sliders with the column grid:

```tsx
{/* Column headers */}
<div className="grid mb-2" style={{ gridTemplateColumns: '150px 1fr 1fr 1fr 1fr', gap: '4px' }}>
  <div />
  {[
    { label: 'Unassigned', color: '#C5BFB8' },
    { label: 'Nice to Have', color: '#9A8E82' },
    { label: 'Important', color: '#4B7A5E' },
    { label: 'Must Have', color: GOLD },
  ].map(col => (
    <div key={col.label} style={{ textAlign: 'center' }}>
      <span className="text-[10px] font-bold uppercase"
            style={{ color: col.color, letterSpacing: '0.08em' }}>
        {col.label}
      </span>
    </div>
  ))}
</div>

{/* Divider */}
<div className="mb-3" style={{ borderBottom: '1px solid #F0EDE6' }} />

{/* Category rows */}
<div className="space-y-2">
  {LIFESTYLE_CATEGORIES.map(cat => {
    const currentBucket = getBucket(cat.key)

    const BUCKET_ORDER: BucketKey[] = ['unassigned', 'notPriorities', 'niceToHaves', 'mustHaves']
    const BUCKET_COLORS: Record<BucketKey, string> = {
      unassigned: '#E5E7EB',
      notPriorities: '#9CA3AF',
      niceToHaves: '#4B7A5E',
      mustHaves: GOLD,
    }

    return (
      <div key={cat.key}
           className="grid items-center"
           style={{ gridTemplateColumns: '150px 1fr 1fr 1fr 1fr', gap: '4px' }}>

        {/* Category label */}
        <div className="flex items-center gap-2">
          <span className="text-sm">{cat.icon}</span>
          <span className="text-xs font-semibold" style={{ color: WARM_DARK }}>
            {cat.label}
          </span>
        </div>

        {/* 4 column cells */}
        {BUCKET_ORDER.map(bucket => {
          const isActive = currentBucket === bucket
          const isFull = (bucket === 'mustHaves' && mustHaves.length >= 4 && !isActive)
                      || (bucket === 'niceToHaves' && niceToHaves.length >= 5 && !isActive)
          const isFlashingThis = flashBucket === bucket

          return (
            <div
              key={bucket}
              className="flex justify-center items-center"
              style={{ height: '36px' }}
            >
              <button
                onClick={() => {
                  if (isActive) return
                  if (bucket === 'mustHaves' && mustHaves.length >= 4) {
                    setFlashBucket('mustHaves')
                    setTimeout(() => setFlashBucket(null), 600)
                    return
                  }
                  if (bucket === 'niceToHaves' && niceToHaves.length >= 5) {
                    setFlashBucket('niceToHaves')
                    setTimeout(() => setFlashBucket(null), 600)
                    return
                  }
                  // Move category
                  const setters: Record<BucketKey, React.Dispatch<React.SetStateAction<(keyof LifestyleScores)[]>>> = {
                    mustHaves: setMustHaves,
                    niceToHaves: setNiceToHaves,
                    notPriorities: setNotPriorities,
                    unassigned: setUnassigned,
                  }
                  setters[currentBucket](prev => prev.filter(k => k !== cat.key))
                  setters[bucket](prev => [...prev, cat.key])
                }}
                className="transition-all"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  cursor: isActive ? 'default' : isFull ? 'not-allowed' : 'pointer',
                  backgroundColor: isActive
                    ? BUCKET_COLORS[bucket]
                    : isFlashingThis
                    ? '#FEE2E2'
                    : 'transparent',
                  border: isActive
                    ? 'none'
                    : `1.5px dashed ${isFull ? '#FCA5A5' : '#E5E7EB'}`,
                  opacity: isFull ? 0.4 : 1,
                  transform: isFlashingThis ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {isActive ? cat.icon : ''}
              </button>
            </div>
          )
        })}
      </div>
    )
  })}
</div>
```

**Remove** the old `handleSliderChange` function — the click handler is now inline in the grid cells above. Keep `getBucket`, `setters`, and all bucket state exactly as-is.

---

#### Section 5 — Commit Button (keep existing, no change)

---

### City Snapshot Popup

Add this modal at the end of the pre-commit return, just before the closing `</div>`:

```tsx
{cityPopup && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    onClick={() => setCityPopup(null)}
  >
    <div
      className="rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
      style={{ backgroundColor: '#FDFCFA' }}
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg" style={{ color: WARM_DARK }}>
            {cityPopup.location.name}, {cityPopup.location.state}
          </h3>
          <p className="text-xs" style={{ color: GOLD }}>
            {cityPopup.location.metroUsed}
          </p>
          <p className="text-xs" style={{ color: '#9A8E82' }}>
            {cityPopup.location.county} County · {cityPopup.location.tier}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ color: GOLD }}>
            {cityPopup.matchScore}
          </p>
          <p className="text-[10px] font-semibold uppercase"
             style={{ color: '#9A8E82', letterSpacing: '0.1em' }}>
            match score
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-4" style={{ color: '#4B5563' }}>
        {cityPopup.location.description}
      </p>

      {/* Priority-relevant scores — show Must Haves and Important first */}
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase mb-2"
           style={{ color: '#9A8E82', letterSpacing: '0.1em' }}>
          Your priority scores
        </p>
        <div className="space-y-1.5">
          {[...mustHaves, ...niceToHaves].slice(0, 6).map(key => {
            const cat = LIFESTYLE_CATEGORIES.find(c => c.key === key)!
            const score = cityPopup.location.scores[key]
            const isMustHave = mustHaves.includes(key)
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs w-4">{cat.icon}</span>
                <span className="text-xs w-24 shrink-0" style={{ color: WARM_DARK }}>
                  {cat.label}
                </span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                     style={{ backgroundColor: '#E5E7EB' }}>
                  <div className="h-full rounded-full"
                       style={{
                         width: `${score * 10}%`,
                         backgroundColor: isMustHave ? GOLD : '#4B7A5E',
                       }} />
                </div>
                <span className="text-xs font-bold w-8 text-right"
                      style={{ color: isMustHave ? GOLD : '#4B7A5E' }}>
                  {score}/10
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* School + Market snapshot */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl p-3" style={{ backgroundColor: '#F7F6F3' }}>
          <p className="text-[10px] font-bold uppercase mb-1"
             style={{ color: '#9A8E82', letterSpacing: '0.08em' }}>
            Schools
          </p>
          <p className="text-sm font-bold" style={{ color: WARM_DARK }}>
            TEA {cityPopup.location.school.teaRating}
          </p>
          <p className="text-xs" style={{ color: '#9A8E82' }}>
            {cityPopup.location.school.primaryISD}
          </p>
        </div>
        <div className="rounded-xl p-3" style={{ backgroundColor: '#F7F6F3' }}>
          <p className="text-[10px] font-bold uppercase mb-1"
             style={{ color: '#9A8E82', letterSpacing: '0.08em' }}>
            Market
          </p>
          <p className="text-sm font-bold" style={{ color: WARM_DARK }}>
            {cityPopup.location.market.marketCondition}
          </p>
          <p className="text-xs" style={{ color: '#9A8E82' }}>
            ${cityPopup.location.housing.medianHomePrice.toLocaleString()} median
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => setCityPopup(null)}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
          style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
        >
          Close
        </button>
        <button
          onClick={() => setCityPopup(null)}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: GOLD, color: '#16120D' }}
        >
          View Full Report →
        </button>
      </div>
    </div>
  </div>
)}
```

---

### Post-Commit Enhancements

Add to the post-commit view after the existing confirmation card:

**Download button:**
```tsx
<button
  onClick={() => window.print()}
  className="w-full py-3 rounded-xl font-bold text-sm border mb-3"
  style={{ borderColor: GOLD, color: GOLD, backgroundColor: 'transparent' }}
>
  Download My Plan Summary
</button>
```

**Email button:**
```tsx
<button
  onClick={handleSendEmail}
  disabled={emailSent || sendingEmail}
  className="w-full py-3 rounded-xl font-bold text-sm mb-6"
  style={{
    backgroundColor: emailSent ? '#F0FAF4' : GOLD,
    color: emailSent ? '#2D7D4E' : '#16120D',
    opacity: sendingEmail ? 0.6 : 1,
  }}
>
  {emailSent ? '✓ Plan summary sent to your email'
   : sendingEmail ? 'Sending...'
   : 'Email Me My Plan Summary'}
</button>
```

**handleSendEmail function:**
```typescript
async function handleSendEmail() {
  setSendingEmail(true)
  try {
    const res = await fetch('/api/sandbox-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: session.email,
        firstName: session.firstName,
        topCity: sandboxMatches[0]?.location.name,
        topScore: sandboxMatches[0]?.matchScore,
        mustHaves: mustHaves.map(k => LIFESTYLE_CATEGORIES.find(c => c.key === k)?.label ?? k),
        niceToHaves: niceToHaves.map(k => LIFESTYLE_CATEGORIES.find(c => c.key === k)?.label ?? k),
        downPayment,
        proceeds,
        interestRate,
        monthlyMortgage,
        monthlyPropertyTax,
        totalMonthlyHousing,
        topCities: sandboxMatches.map(m => ({
          name: m.location.name,
          metro: m.location.metroUsed,
          score: m.matchScore,
        })),
      }),
    })
    if (res.ok) setEmailSent(true)
  } catch {}
  finally { setSendingEmail(false) }
}
```

---

## Part 3 — New API Route: app/api/sandbox-report/route.ts

Create this file:

```typescript
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      email, firstName, topCity, topScore,
      mustHaves, niceToHaves,
      downPayment, proceeds, interestRate,
      monthlyMortgage, monthlyPropertyTax, totalMonthlyHousing,
      topCities,
    } = body

    const citiesHtml = topCities.map((c: { name: string; metro: string; score: number }, i: number) =>
      `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #F0EDE6;font-weight:600;color:#16120D;">#${i+1} ${c.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #F0EDE6;color:#6B7280;">${c.metro}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #F0EDE6;font-weight:700;color:#B8912A;">${c.score}</td>
      </tr>`
    ).join('')

    await resend.emails.send({
      from: 'HavenQuest <admin@send.havenquest.co>',
      to: email,
      replyTo: 'admin@havenquest.co',
      subject: `${firstName}, your HavenQuest plan summary`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#F7F6F3;margin:0;padding:32px 16px;">
          <div style="max-width:560px;margin:0 auto;background:#FDFCFA;border-radius:16px;overflow:hidden;">

            <div style="background:#16120D;padding:32px;text-align:center;">
              <p style="color:#B8912A;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">HavenQuest Navigator</p>
              <h1 style="color:#FFFFFF;font-size:22px;font-weight:700;margin:0;">${firstName}, your plan is locked in.</h1>
              <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:12px 0 0;">Here's a summary of your committed direction.</p>
            </div>

            <div style="padding:32px;">

              <div style="background:#F0FAF4;border:1px solid #C6E8D4;border-radius:12px;padding:16px;margin-bottom:24px;">
                <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#2D7D4E;margin:0 0 4px;">Top match</p>
                <p style="font-size:20px;font-weight:700;color:#16120D;margin:0;">${topCity}</p>
                <p style="font-size:13px;color:#4B7A5E;margin:4px 0 0;">Match score: ${topScore}</p>
              </div>

              <div style="margin-bottom:24px;">
                <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#9A8E82;margin:0 0 8px;">Your top 5 cities</p>
                <table style="width:100%;border-collapse:collapse;background:#F7F6F3;border-radius:12px;overflow:hidden;">
                  <thead>
                    <tr style="background:#F0EDE6;">
                      <th style="padding:8px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#9A8E82;">City</th>
                      <th style="padding:8px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#9A8E82;">Metro</th>
                      <th style="padding:8px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#9A8E82;">Score</th>
                    </tr>
                  </thead>
                  <tbody>${citiesHtml}</tbody>
                </table>
              </div>

              ${mustHaves.length > 0 ? `
              <div style="margin-bottom:24px;">
                <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#9A8E82;margin:0 0 8px;">Must haves</p>
                <p style="font-size:14px;color:#16120D;margin:0;">${mustHaves.join(' · ')}</p>
              </div>` : ''}

              ${niceToHaves.length > 0 ? `
              <div style="margin-bottom:24px;">
                <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#9A8E82;margin:0 0 8px;">Important to me</p>
                <p style="font-size:14px;color:#16120D;margin:0;">${niceToHaves.join(' · ')}</p>
              </div>` : ''}

              <div style="background:#F7F6F3;border-radius:12px;padding:16px;margin-bottom:24px;">
                <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#9A8E82;margin:0 0 12px;">Financial picture</p>
                <table style="width:100%;">
                  <tr><td style="font-size:13px;color:#6B7280;padding:3px 0;">Down payment</td><td style="font-size:13px;font-weight:600;color:#16120D;text-align:right;">${downPayment}</td></tr>
                  ${proceeds ? `<tr><td style="font-size:13px;color:#6B7280;padding:3px 0;">Home proceeds</td><td style="font-size:13px;font-weight:600;color:#16120D;text-align:right;">${proceeds}</td></tr>` : ''}
                  <tr><td style="font-size:13px;color:#6B7280;padding:3px 0;">Rate assumption</td><td style="font-size:13px;font-weight:600;color:#16120D;text-align:right;">${Number(interestRate).toFixed(2)}%</td></tr>
                  <tr><td style="font-size:13px;color:#6B7280;padding:3px 0;">Est. monthly mortgage</td><td style="font-size:13px;font-weight:600;color:#16120D;text-align:right;">$${Number(monthlyMortgage).toLocaleString()}/mo</td></tr>
                  <tr><td style="font-size:13px;color:#6B7280;padding:3px 0;">Est. property tax</td><td style="font-size:13px;font-weight:600;color:#16120D;text-align:right;">$${Number(monthlyPropertyTax).toLocaleString()}/mo</td></tr>
                  <tr style="border-top:1px solid #E5E7EB;"><td style="font-size:13px;font-weight:700;color:#16120D;padding:6px 0 3px;">Total monthly housing</td><td style="font-size:13px;font-weight:700;color:#B8912A;text-align:right;padding:6px 0 3px;">$${Number(totalMonthlyHousing).toLocaleString()}/mo</td></tr>
                </table>
              </div>

              <div style="background:#16120D;border-radius:12px;padding:20px;text-align:center;">
                <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0 0 4px;">Your Market Director will be in touch within 24 hours.</p>
                <p style="color:#B8912A;font-size:13px;font-weight:600;margin:0;">The wheel stays in your hands. We just help you find the best route.</p>
              </div>

            </div>

            <div style="padding:16px 32px;border-top:1px solid #F0EDE6;text-align:center;">
              <p style="font-size:11px;color:#C5BFB8;margin:0;">HavenQuest · Texas Relocation Intelligence · <a href="https://havenquest.co" style="color:#B8912A;">havenquest.co</a></p>
            </div>

          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
```

---

## Acceptance Criteria

### Dashboard
- [ ] Split panel renders — financial left, rankings right
- [ ] 4 financial metric tiles show down payment total, monthly mortgage, property tax, total housing
- [ ] Affordability status indicator shows green/amber/red with percentage
- [ ] Priority summary shows Must Have and Important badges
- [ ] Top 5 city ranking cards update in real time as adjustments change
- [ ] #1 city has gold left border accent
- [ ] Financial adjustments row renders below dashboard with 3 controls
- [ ] All adjustments update the dashboard instantly

### Priority Grid
- [ ] Bucket counter bar unchanged — still shows flash/full states
- [ ] Column headers show Unassigned / Nice to Have / Important / Must Have
- [ ] All 13 category rows render with icon + label
- [ ] Active bucket shows filled circle with icon in correct color (gold/green/gray)
- [ ] Empty columns show dashed empty circle
- [ ] Clicking a column moves the icon instantly
- [ ] Full bucket flash still works

### City Snapshot Popup
- [ ] "Learn more →" link appears on each city card
- [ ] Clicking opens modal with city name, score, description
- [ ] Priority-relevant scores shown first (Must Haves then Important)
- [ ] School and market snapshot shown
- [ ] Close button and View Full Report button render
- [ ] Clicking outside modal closes it

### Post-commit
- [ ] Download button triggers window.print()
- [ ] Email button fires POST to /api/sandbox-report
- [ ] Email sends via Resend with full plan summary
- [ ] Email button shows "✓ Sent" after success
- [ ] Email not sent twice — button disabled after first send

### Code quality
- [ ] matchingService.ts exports 3 functions
- [ ] tsc --noEmit passes clean
- [ ] No any types
- [ ] handleSliderChange removed — replaced by inline column click handlers

---

## Files Changing

| File | Action |
|---|---|
| `components/portal/milemarkers/MM3Discover.tsx` | Major layout redesign |
| `services/matchingService.ts` | Export 3 helper functions |
| `app/api/sandbox-report/route.ts` | CREATE — new email API route |

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach.*
