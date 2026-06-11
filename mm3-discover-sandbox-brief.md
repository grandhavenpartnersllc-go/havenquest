# Build Brief — MM3 Discover: Full Sandbox Experience
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — core Navigator Decision Engine
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Replace the current MM3Decide.tsx locked preview with a full live sandbox experience. This is the Decision Engine — the centerpiece of the Navigator.

**Two phases within MM3:**
1. **Pre-commit** — Live sandbox with financial sliders and priority drag-and-drop. City rankings update in real time.
2. **Post-commit** — Profile locked, summary generated, what happens next shown. MM4 gate activated.

**All math runs client-side** — no API calls on slider movement. Uses existing functions from matchingService.ts imported directly.

---

## Supabase Migration Required (Craig runs before build)

```sql
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS sandbox_profile JSONB DEFAULT NULL;
ADD COLUMN IF NOT EXISTS sandbox_committed BOOLEAN DEFAULT FALSE;
ADD COLUMN IF NOT EXISTS sandbox_committed_at TIMESTAMPTZ DEFAULT NULL;

NOTIFY pgrst, 'reload schema';
```

---

## Files to Create / Modify

| File | Action |
|---|---|
| `components/portal/milemarkers/MM3Discover.tsx` | CREATE — full sandbox component |
| `components/portal/milemarkers/MM3Decide.tsx` | MODIFY — replace with redirect to MM3Discover or rename |
| `components/portal/MileMarkerContent.tsx` | MODIFY — route case 3 to MM3Discover |
| `types/index.ts` | MODIFY — add SandboxProfile interface |

---

## New Type — SandboxProfile

Add to `types/index.ts`:

```typescript
export interface SandboxProfile {
  // Financial adjustments
  downPaymentOverride: string        // same options as FinancialPicture.down_payment_available
  proceedsOverride: string | null    // same options as FinancialPicture.home_sale_proceeds
  interestRateOverride: number       // 3.0 to 10.0, step 0.25, default 7.0

  // Priority overrides — full reassignment
  mustHaves: (keyof LifestyleScores)[]
  niceToHaves: (keyof LifestyleScores)[]
  notPriorities: (keyof LifestyleScores)[]
  unassigned: (keyof LifestyleScores)[]
}
```

---

## MM3Discover.tsx — Full Component

### Props
```typescript
interface MM3DiscoverProps {
  matches: CityMatch[]
  profile: UserProfile | null
  session: UserSession
  onAdvanceToConnect: () => void  // called when commit button advances to MM4
}
```

### State
```typescript
// Financial sliders
const [downPayment, setDownPayment] = useState<string>(
  profile?.financial_picture?.down_payment_available ?? '$20,000 – $50,000'
)
const [proceeds, setProceeds] = useState<string | null>(
  profile?.financial_picture?.home_sale_proceeds ?? null
)
const [interestRate, setInterestRate] = useState<number>(7.0)

// Priority buckets — initialized from original profile
const [mustHaves, setMustHaves] = useState<(keyof LifestyleScores)[]>(
  profile?.mustHaves ?? []
)
const [niceToHaves, setNiceToHaves] = useState<(keyof LifestyleScores)[]>(
  profile?.niceToHaves ?? []
)
const [notPriorities, setNotPriorities] = useState<(keyof LifestyleScores)[]>(
  profile?.notPriorities ?? []
)
const [unassigned, setUnassigned] = useState<(keyof LifestyleScores)[]>(
  // All categories not in any bucket
  ALL_CATEGORY_KEYS.filter(k =>
    !profile?.mustHaves.includes(k) &&
    !profile?.niceToHaves.includes(k) &&
    !profile?.notPriorities.includes(k)
  )
)

// Committed state
const [committed, setCommitted] = useState(false)
const [committing, setCommitting] = useState(false)
```

Where:
```typescript
const ALL_CATEGORY_KEYS = LIFESTYLE_CATEGORIES.map(c => c.key)
```

### Live city rankings computation

Compute sandbox profile and run rankings on every render (client-side, instant):

```typescript
// Build sandbox UserProfile from current slider/priority state
const sandboxProfile: UserProfile = {
  annualIncome: profile?.annualIncome ?? 100000,
  householdSize: profile?.householdSize ?? '1',
  movingTimeline: profile?.movingTimeline ?? 'exploring',
  mustHaves,
  niceToHaves,
  notPriorities,
  financial_picture: {
    is_homeowner: profile?.financial_picture?.is_homeowner ?? false,
    home_sale_proceeds: proceeds,
    down_payment_available: downPayment,
    purchase_timeline: profile?.financial_picture?.purchase_timeline ?? 'exploring',
  }
}

// Get all cities and compute scores
const allCities = getAllCities()
const sandboxMatches = getTopMatches(sandboxProfile, allCities, 5)
```

Import `getAllCities` from `services/locationService` and `getTopMatches` from `services/matchingService`.

---

## Layout — Pre-Commit

### Section 1 — Header

```tsx
<div className="mb-6">
  <p className="text-[10px] font-bold uppercase mb-2"
     style={{ color: GOLD, letterSpacing: '0.18em' }}>
    Your Discover Sandbox
  </p>
  <h2 className="text-[20px] font-bold tracking-tight mb-2" style={{ color: WARM_DARK }}>
    Move things around. See what changes.
  </h2>
  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
    Your original matches are your starting point — not your final answer.
    Adjust your financial picture and priorities below and watch your city rankings
    respond in real time. When something clicks, commit your direction and
    your Market Director steps in as your copilot.
  </p>
</div>
```

---

### Section 2 — Live City Rankings

Show top 5 cities updating in real time as sliders and priorities change.

```tsx
<div className="mb-8 rounded-xl p-4" style={{ backgroundColor: '#F7F6F3' }}>
  <p className="text-[10px] font-bold uppercase mb-3"
     style={{ color: GOLD, letterSpacing: '0.18em' }}>
    Your Current Rankings
  </p>
  <div className="space-y-2">
    {sandboxMatches.map((match, i) => (
      <div key={match.location.id} className="flex items-center gap-3">
        <span className="text-xs font-bold w-5 text-right shrink-0"
              style={{ color: '#9A8E82' }}>
          {i + 1}
        </span>
        <div className="flex-1 flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: WARM_DARK }}>
            {match.location.name}
          </span>
          <span className="text-xs" style={{ color: '#9A8E82' }}>
            {match.location.metroUsed}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Score bar */}
          <div className="w-20 h-1.5 rounded-full overflow-hidden"
               style={{ backgroundColor: '#E5E7EB' }}>
            <div className="h-full rounded-full"
                 style={{ width: `${match.matchScore}%`, backgroundColor: GOLD }} />
          </div>
          <span className="text-xs font-bold tabular-nums w-8 text-right"
                style={{ color: GOLD }}>
            {match.matchScore}
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
```

---

### Section 3 — Financial Sliders

```tsx
<div className="mb-8">
  <p className="text-[10px] font-bold uppercase mb-4"
     style={{ color: GOLD, letterSpacing: '0.18em' }}>
    Adjust Your Financial Picture
  </p>

  {/* Down payment */}
  <div className="mb-5">
    <label className="block text-sm font-semibold mb-1" style={{ color: WARM_DARK }}>
      Down payment available
    </label>
    <p className="text-xs mb-2" style={{ color: '#9A8E82' }}>
      Including additional savings, gifts, or other sources
    </p>
    <select
      value={downPayment}
      onChange={e => setDownPayment(e.target.value)}
      className="w-full rounded-xl border px-4 py-2.5 text-sm appearance-none"
      style={{ borderColor: '#E5E7EB', color: WARM_DARK }}
    >
      {DOWN_PAYMENT_OPTIONS.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>

  {/* Home sale proceeds */}
  <div className="mb-5">
    <label className="block text-sm font-semibold mb-1" style={{ color: WARM_DARK }}>
      Estimated home sale proceeds
    </label>
    <p className="text-xs mb-2" style={{ color: '#9A8E82' }}>
      Leave as "None" if you're not selling a home
    </p>
    <select
      value={proceeds ?? 'None'}
      onChange={e => setProceeds(e.target.value === 'None' ? null : e.target.value)}
      className="w-full rounded-xl border px-4 py-2.5 text-sm appearance-none"
      style={{ borderColor: '#E5E7EB', color: WARM_DARK }}
    >
      <option value="None">None</option>
      {PROCEEDS_OPTIONS.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>

  {/* Interest rate */}
  <div className="mb-5">
    <div className="flex items-center justify-between mb-1">
      <label className="text-sm font-semibold" style={{ color: WARM_DARK }}>
        Interest rate assumption
      </label>
      <span className="text-sm font-bold" style={{ color: GOLD }}>
        {interestRate.toFixed(2)}%
      </span>
    </div>
    <p className="text-xs mb-2" style={{ color: '#9A8E82' }}>
      Default is 7.0% — adjust to model different scenarios
    </p>
    <input
      type="range"
      min={3.0}
      max={10.0}
      step={0.25}
      value={interestRate}
      onChange={e => setInterestRate(parseFloat(e.target.value))}
      className="w-full accent-amber-600"
    />
    <div className="flex justify-between text-xs mt-1" style={{ color: '#9A8E82' }}>
      <span>3.00%</span>
      <span>10.00%</span>
    </div>
  </div>
</div>
```

**Add these option arrays at the top of the file:**

```typescript
const DOWN_PAYMENT_OPTIONS = [
  'Under $20,000',
  '$20,000 – $50,000',
  '$50,000 – $100,000',
  '$100,000 – $200,000',
  '$200,000 – $500,000',
  '$500,000+',
  "I'm not sure yet",
]

const PROCEEDS_OPTIONS = [
  'Under $50,000',
  '$50,000 – $100,000',
  '$100,000 – $200,000',
  '$200,000 – $350,000',
  '$350,000 – $500,000',
  '$500,000 – $750,000',
  '$750,000+',
  "I'm not sure yet",
]
```

---

### Section 4 — Priority Drag-and-Drop

Four buckets: Must Have (max 4), Important to Me (max 5), Would Be Nice (no limit), Unassigned.

Use a simple click-to-move approach rather than drag-and-drop for reliability — each category shows which bucket it's in, with buttons to move it between buckets. True drag-and-drop can be added in Phase 2.

```tsx
<div className="mb-8">
  <p className="text-[10px] font-bold uppercase mb-2"
     style={{ color: GOLD, letterSpacing: '0.18em' }}>
    Adjust Your Priorities
  </p>
  <p className="text-xs mb-4" style={{ color: '#9A8E82' }}>
    Move categories between buckets and watch your city rankings update instantly.
    Must Have counts 3×. Important to Me counts 2×. Would Be Nice counts 1×.
  </p>

  {/* Four bucket columns */}
  {[
    { key: 'mustHaves', label: 'Must Have', max: 4, current: mustHaves, color: '#B8912A' },
    { key: 'niceToHaves', label: 'Important', max: 5, current: niceToHaves, color: '#4B7A5E' },
    { key: 'notPriorities', label: 'Nice to Have', max: null, current: notPriorities, color: '#6B7280' },
    { key: 'unassigned', label: 'Unassigned', max: null, current: unassigned, color: '#9A8E82' },
  ].map(bucket => (
    <div key={bucket.key} className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold" style={{ color: bucket.color }}>
          {bucket.label}
          {bucket.max && ` (max ${bucket.max})`}
        </span>
        <span className="text-xs" style={{ color: '#9A8E82' }}>
          {bucket.current.length} selected
        </span>
      </div>
      <div className="flex flex-wrap gap-2 min-h-10 p-2 rounded-xl"
           style={{ backgroundColor: '#F7F6F3', border: '1.5px dashed #E5E7EB' }}>
        {bucket.current.map(key => {
          const cat = LIFESTYLE_CATEGORIES.find(c => c.key === key)!
          return (
            <div key={key}
                 className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                 style={{ backgroundColor: 'white', border: `1px solid ${bucket.color}44`, color: WARM_DARK }}>
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              {/* Move buttons */}
              <div className="flex gap-0.5 ml-1">
                {bucket.key !== 'mustHaves' && (
                  <button
                    onClick={() => moveCategory(key, bucket.key as BucketKey, 'mustHaves')}
                    disabled={mustHaves.length >= 4}
                    className="text-[10px] px-1 rounded hover:bg-gray-100 disabled:opacity-30"
                    title="Move to Must Have"
                  >↑M</button>
                )}
                {bucket.key !== 'unassigned' && (
                  <button
                    onClick={() => moveCategory(key, bucket.key as BucketKey, 'unassigned')}
                    className="text-[10px] px-1 rounded hover:bg-gray-100"
                    title="Move to Unassigned"
                  >✕</button>
                )}
              </div>
            </div>
          )
        })}
        {bucket.current.length === 0 && (
          <span className="text-xs italic" style={{ color: '#C5BFB8' }}>
            {bucket.key === 'unassigned' ? 'No unassigned categories' : 'Drop categories here'}
          </span>
        )}
      </div>
    </div>
  ))}
</div>
```

**Move category helper function:**

```typescript
type BucketKey = 'mustHaves' | 'niceToHaves' | 'notPriorities' | 'unassigned'

function moveCategory(key: keyof LifestyleScores, from: BucketKey, to: BucketKey) {
  const bucketSetters: Record<BucketKey, React.Dispatch<React.SetStateAction<(keyof LifestyleScores)[]>>> = {
    mustHaves: setMustHaves,
    niceToHaves: setNiceToHaves,
    notPriorities: setNotPriorities,
    unassigned: setUnassigned,
  }
  const bucketGetters: Record<BucketKey, (keyof LifestyleScores)[]> = {
    mustHaves,
    niceToHaves,
    notPriorities,
    unassigned,
  }
  // Max checks
  if (to === 'mustHaves' && mustHaves.length >= 4) return
  if (to === 'niceToHaves' && niceToHaves.length >= 5) return
  // Remove from source
  bucketSetters[from](prev => prev.filter(k => k !== key))
  // Add to destination
  bucketSetters[to](prev => [...prev, key])
}
```

---

### Section 5 — Commit Button

```tsx
<div className="mt-8 pt-6" style={{ borderTop: '1px solid #E5E7EB' }}>
  <p className="text-sm font-medium mb-2" style={{ color: '#4B5563' }}>
    Found your direction? Lock it in and your Market Director steps in as your copilot.
  </p>
  <p className="text-xs mb-4" style={{ color: '#9A8E82' }}>
    Your original profile is always preserved. This becomes your new starting point —
    not a contract, not a cage.
  </p>
  <button
    onClick={handleCommit}
    disabled={committing}
    className="w-full py-4 rounded-xl font-bold text-base transition-opacity hover:opacity-90 disabled:opacity-50"
    style={{ backgroundColor: GOLD, color: '#16120D' }}
  >
    {committing ? 'Locking in your plan...' : 'This is my plan — connect me with my Market Director →'}
  </button>
</div>
```

---

### handleCommit function

```typescript
async function handleCommit() {
  setCommitting(true)
  try {
    const supabase = createClient()
    const { data: { session: s } } = await supabase.auth.getSession()
    if (!s?.user?.email) return

    const sandboxData: SandboxProfile = {
      downPaymentOverride: downPayment,
      proceedsOverride: proceeds,
      interestRateOverride: interestRate,
      mustHaves,
      niceToHaves,
      notPriorities,
      unassigned,
    }

    await supabase
      .from('users')
      .update({
        sandbox_profile: sandboxData,
        sandbox_committed: true,
        sandbox_committed_at: new Date().toISOString(),
      })
      .eq('email', s.user.email.toLowerCase())

    setCommitted(true)
  } catch {}
  finally { setCommitting(false) }
}
```

**Note:** The commit does NOT update `current_milemarker` to 4. MM4 is gated by the Market Director. The commit saves the sandbox profile and sets `sandbox_committed: true`. MM4 remains locked.

---

## Post-Commit View

When `committed === true`, replace the entire sandbox UI with the post-commit content:

### Post-commit Section 1 — Confirmation

```tsx
<div className="mb-8 rounded-xl p-5"
     style={{ backgroundColor: '#F0FAF4', border: '1.5px solid #C6E8D4' }}>
  <div className="flex items-center gap-3 mb-3">
    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
         style={{ backgroundColor: '#2D7D4E' }}>
      <span className="text-white text-sm">✓</span>
    </div>
    <div>
      <p className="font-bold text-sm" style={{ color: '#2D7D4E' }}>
        Your direction is locked in.
      </p>
      <p className="text-xs" style={{ color: '#4B7A5E' }}>
        Your Market Director will be in touch within 24 hours.
      </p>
    </div>
  </div>
  <p className="text-sm leading-relaxed" style={{ color: '#4B7A5E' }}>
    Your plan is saved as your new starting point. Your original profile is preserved
    alongside it — your Market Director will see both. The wheel is still in your hands.
    Now you have a copilot.
  </p>
</div>
```

### Post-commit Section 2 — Committed Profile Summary

Build a readable summary from the committed sandbox state:

```tsx
<div className="mb-8 rounded-xl p-5"
     style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}>
  <p className="text-[10px] font-bold uppercase mb-3"
     style={{ color: GOLD, letterSpacing: '0.18em' }}>
    Your Committed Direction
  </p>

  {/* Top city */}
  <div className="mb-4">
    <p className="text-xs font-semibold mb-1" style={{ color: '#9A8E82' }}>TOP MATCH</p>
    <p className="text-lg font-bold" style={{ color: WARM_DARK }}>
      {sandboxMatches[0]?.location.name} — {sandboxMatches[0]?.matchScore} points
    </p>
    <p className="text-xs" style={{ color: '#9A8E82' }}>
      {sandboxMatches[0]?.location.metroUsed}
    </p>
  </div>

  {/* Must Haves */}
  <div className="mb-4">
    <p className="text-xs font-semibold mb-1" style={{ color: '#9A8E82' }}>MUST HAVES</p>
    <div className="flex flex-wrap gap-2">
      {mustHaves.map(key => {
        const cat = LIFESTYLE_CATEGORIES.find(c => c.key === key)!
        return (
          <span key={key}
                className="px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: 'rgba(184,145,42,0.12)', color: GOLD }}>
            {cat.icon} {cat.label}
          </span>
        )
      })}
    </div>
  </div>

  {/* Financial picture summary */}
  <div>
    <p className="text-xs font-semibold mb-1" style={{ color: '#9A8E82' }}>FINANCIAL PICTURE</p>
    <p className="text-sm" style={{ color: '#4B5563' }}>
      Down payment: {downPayment}
      {proceeds && proceeds !== 'None' && ` · Proceeds: ${proceeds}`}
      {' '}· Rate assumption: {interestRate.toFixed(2)}%
    </p>
  </div>
</div>
```

### Post-commit Section 3 — What's Coming Next

```tsx
<div className="rounded-xl p-5" style={{ backgroundColor: '#F7F6F3' }}>
  <p className="text-[10px] font-bold uppercase mb-3"
     style={{ color: GOLD, letterSpacing: '0.18em' }}>
    What Happens Next
  </p>
  <p className="text-sm leading-relaxed mb-4" style={{ color: '#4B5563' }}>
    Your Market Director is being assigned. Before they reach out, they'll read
    everything — your original profile, what you changed in the sandbox, and your
    committed direction. Expect to hear from them within 24 hours.
  </p>
  <div className="rounded-xl p-4"
       style={{ backgroundColor: 'rgba(184,145,42,0.08)', border: `1px solid ${GOLD}33` }}>
    <p className="text-sm font-medium" style={{ color: '#7A5A1A' }}>
      🔒 Connect (MM4) will unlock when your Market Director initiates contact.
    </p>
  </div>
</div>
```

---

## MileMarkerContent.tsx Updates

Update case 3:

```typescript
case 3:
  if (selectedMileMarker < currentMileMarker) {
    return (
      <CompletedCard
        name="Discover"
        description="You explored your options and committed your direction."
      />
    )
  }
  if (selectedMileMarker === currentMileMarker) {
    return (
      <MM3Discover
        matches={matches}
        profile={profile}
        session={session}
        onAdvanceToConnect={() => setActiveMileMarker(4)}
      />
    )
  }
  return <MM4to10 mmNumber={3} name="Discover" />
```

Also add `onAdvanceToConnect` and `session` to MileMarkerContentProps if not already present. Pass `session` through — it should already be there from MM4Connect work.

---

## Acceptance Criteria

- [ ] MM3Discover.tsx created
- [ ] SandboxProfile interface added to types/index.ts
- [ ] Supabase columns added: sandbox_profile, sandbox_committed, sandbox_committed_at
- [ ] Pre-commit: live city rankings render (top 5) and update on every state change
- [ ] Pre-commit: down payment dropdown works and updates rankings
- [ ] Pre-commit: proceeds dropdown works and updates rankings
- [ ] Pre-commit: interest rate slider works (3.0–10.0, step 0.25) and updates rankings
- [ ] Pre-commit: all 13 categories distributed across 4 buckets on load
- [ ] Pre-commit: move category buttons work — categories move between buckets
- [ ] Pre-commit: Must Have capped at 4, Important to Me capped at 5
- [ ] Pre-commit: rankings update when categories move buckets
- [ ] Commit button saves sandbox_profile, sandbox_committed, sandbox_committed_at to Supabase
- [ ] Commit does NOT update current_milemarker — MM4 gate stays locked
- [ ] Post-commit: confirmation card renders
- [ ] Post-commit: committed direction summary renders with top city and Must Haves
- [ ] Post-commit: What Happens Next section renders
- [ ] On reload when sandbox_committed is true — post-commit view loads directly
- [ ] MileMarkerContent case 3 routes correctly
- [ ] tsc --noEmit passes clean
- [ ] No any types

---

## Imports Required in MM3Discover.tsx

```typescript
import { useState, useEffect } from 'react'
import { CityMatch, UserProfile, UserSession, SandboxProfile } from '../../../types'
import { LifestyleScores } from '../../../types'
import { LIFESTYLE_CATEGORIES } from '../../../utils/constants'
import { getAllCities } from '../../../services/locationService'
import { getTopMatches } from '../../../services/matchingService'
import { createClient } from '../../../lib/supabase/client'
```

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach. Run Supabase migration before Claude Code starts.*
