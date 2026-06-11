# Build Brief — MM1 Explore: Welcome & Summary Experience
**Project:** HavenQuest
**Date:** June 1, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — first impression of the Navigator portal
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Build the MM1 — Explore content as a rich welcome and summary experience. MM1 currently shows a simple completed-state card. Replace it with a full welcome section, horizontal city match cards, a static narrative summary, a Navigator process overview, and an onboarding acknowledgment checkbox.

MM2 — Discover keeps everything exactly as it is. The existing SavedMatches vertical cards with compare feature stay in MM2.

---

## Supabase Migration (already run)
```sql
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS onboarding_acknowledged BOOLEAN DEFAULT FALSE;
```
Column is live. Default FALSE.

---

## Files to Modify

| File | Change |
|---|---|
| `components/portal/milemarkers/MM1Explore.tsx` | Full replacement — new welcome experience |
| `components/portal/StarterPortal.tsx` | Fetch + save `onboarding_acknowledged` from Supabase |

No other files touched.

---

## MM1Explore.tsx — Full Replacement

Replace the current simple completed-state card with the following 5 sections.

### Props needed
```typescript
interface MM1ExploreProps {
  matches: CityMatch[]
  profile: UserProfile
  session: UserSession
  onAdvanceToDiscover: () => void
  onboardingAcknowledged: boolean
  onAcknowledge: () => void
}
```

---

### Section 1 — Welcome

```tsx
<div className="mb-8">
  <p className="text-[10px] font-bold uppercase mb-3"
     style={{ color: GOLD, letterSpacing: '0.18em' }}>
    Welcome to Your Navigator
  </p>
  <h2 className="text-[22px] font-bold tracking-tight mb-3"
      style={{ color: WARM_DARK }}>
    {session.firstName}, here's what we found for you.
  </h2>
  <p className="text-sm leading-relaxed max-w-2xl" style={{ color: '#6B7280' }}>
    Based on your income, household, financial picture, and lifestyle priorities,
    HavenQuest has matched you to the Texas communities where your life fits best.
    Below is your personalized summary. When you're ready to go deeper,
    your full reports are waiting in Discover.
  </p>
</div>
```

---

### Section 2 — Horizontal City Match Cards

Three city cards displayed horizontally (flex row, wraps on mobile). These are new simplified cards — NOT the existing SavedMatches component (that stays in MM2).

Each horizontal card shows:
- Rank label (Top Pick / Runner-Up / Strong Alt)
- Match score badge
- City name
- Metro label
- Buyer segment badge (derived from profile — see below)
- Top 2 Must Have scores for that city with mini score bars
- Est. monthly cost
- "View Full Reports →" button that calls `onAdvanceToDiscover()`

**Buyer segment derivation (static — use profile data):**
```typescript
function getBuyerSegment(profile: UserProfile): string {
  // Use annualIncome as proxy — same logic as matchingService
  const income = profile.annualIncome
  if (income >= 300000) return 'Estate'
  if (income >= 200000) return 'Luxury'
  if (income >= 130000) return 'High'
  if (income >= 80000) return 'Mid-Market'
  return 'Starter'
}
```

**Card layout (horizontal — flex row):**
```tsx
<div className="flex flex-col sm:flex-row gap-3 mb-8">
  {matches.map((match, i) => (
    <HorizontalCityCard
      key={match.location.id}
      match={match}
      rank={i}
      profile={profile}
      onViewReports={onAdvanceToDiscover}
    />
  ))}
</div>
```

**HorizontalCityCard design:**
- Width: `flex-1` (equal width, side by side on desktop)
- Background: CARD_BG (#FDFCFA) with CARD_SHADOW for all three
- Top Pick gets a gold top border (2px) to distinguish it
- Padding: p-4
- Rounded: rounded-xl
- No compare feature — that lives in MM2

**Card content structure:**
```
[RANK LABEL]                    [SCORE BADGE]
[City Name — large, bold]
[Metro — gold, small]
[Segment badge — pill]

[Must Have scores — top 2 only]
  Icon  Category    ████░░  7/10

[Est. $X,XXX/mo]

[View Full Reports →]  (gold text button, full width)
```

**"View Full Reports →" button:**
```tsx
<button
  onClick={onAdvanceToDiscover}
  className="w-full mt-3 pt-3 text-xs font-bold text-left transition-opacity hover:opacity-70"
  style={{ color: GOLD, borderTop: `1px solid #F0EDE6` }}
>
  View Full Reports →
</button>
```

**Must Have scores — show top 2 from profile.mustHaves:**
```tsx
{profile.mustHaves.slice(0, 2).map(key => {
  const cat = LIFESTYLE_CATEGORIES.find(c => c.key === key)
  const Icon = CATEGORY_ICONS[key]
  const score = match.location.scores[key]
  const color = getScoreColor(score)
  return (
    <div key={key} className="flex items-center gap-2 mt-1.5">
      <Icon size={11} strokeWidth={1.5} style={{ color: '#9A8E82' }} />
      <span className="text-xs flex-1 truncate" style={{ color: '#4B5563' }}>{cat?.label}</span>
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-10 h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#E5E7EB' }}>
          <div className="h-full rounded-full" style={{ width: `${score * 10}%`, backgroundColor: color }} />
        </div>
        <span className="text-xs font-bold tabular-nums w-6 text-right" style={{ color }}>{score}/10</span>
      </div>
    </div>
  )
})}
```

---

### Section 3 — What We Found For You (Static Narrative)

A static narrative paragraph built from profile data. Use template string interpolation — no API call.

```typescript
function buildMatchNarrative(profile: UserProfile, matches: CityMatch[]): string {
  const topCity = matches[0]?.location.name ?? 'your top match'
  const segment = getBuyerSegment(profile)
  const mustHaveLabels = profile.mustHaves
    .map(k => LIFESTYLE_CATEGORIES.find(c => c.key === k)?.label ?? k)
    .join(', ')
  const income = profile.annualIncome.toLocaleString()

  const householdMap: Record<string, string> = {
    'just-me': 'an individual',
    'couple': 'a couple',
    'small-family': 'a small family',
    'growing-family': 'a growing family',
    'multigenerational': 'a multigenerational household',
  }
  const household = householdMap[profile.householdSize] ?? 'your household'

  return `Based on your priorities — ${mustHaveLabels} — and a household income of $${income}, we focused on Texas communities that deliver where it matters most to you. Your financial picture places you in the ${segment} buyer segment. As ${household}, ${topCity} emerged as your strongest match across all criteria. The three cities below consistently outperformed the rest of our 101-city database for your specific profile.`
}
```

Render as:
```tsx
<div className="rounded-xl p-4 mb-8" style={{ backgroundColor: '#F7F6F3' }}>
  <p className="text-[10px] font-bold uppercase mb-2"
     style={{ color: GOLD, letterSpacing: '0.16em' }}>
    What We Found For You
  </p>
  <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>
    {buildMatchNarrative(profile, matches)}
  </p>
</div>
```

---

### Section 4 — Your Navigator Journey

A visual overview of all 10 MileMarkers with one-line descriptions. Functions as both a process overview and an instruction guide.

```tsx
<div className="mb-8">
  <p className="text-[10px] font-bold uppercase mb-4"
     style={{ color: GOLD, letterSpacing: '0.18em' }}>
    Your Navigator Journey
  </p>
  <div className="space-y-2">
    {NAVIGATOR_STEPS.map((step, i) => (
      <div key={step.number} className="flex items-start gap-3">
        {/* Step number circle */}
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold"
          style={{
            backgroundColor: step.number <= currentMileMarker ? GOLD : '#F0EDE6',
            color: step.number <= currentMileMarker ? '#16120D' : '#9A8E82',
          }}
        >
          {step.number <= currentMileMarker ? '✓' : step.number}
        </div>
        {/* Step content */}
        <div className="flex-1">
          <span className="text-xs font-bold" style={{ color: '#1C1814' }}>
            {step.name}
          </span>
          <span className="text-xs ml-2" style={{ color: '#9A8E82' }}>
            — {step.description}
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
```

**NAVIGATOR_STEPS constant (define at top of MM1Explore.tsx):**
```typescript
const NAVIGATOR_STEPS = [
  { number: 1, name: 'Explore', description: 'Review your personalized city matches and understand your Navigator journey.' },
  { number: 2, name: 'Discover', description: 'Dive into full city reports, affordability breakdowns, school data, and matched realtors.' },
  { number: 3, name: 'Decide', description: 'Fine-tune your priorities in the sandbox and commit your direction when ready.' },
  { number: 4, name: 'Connect', description: 'Your personal Ambassador is assigned and reaches out within 24 hours.' },
  { number: 5, name: 'Plan', description: 'Strategy session with your Ambassador — city, zone, timeline, and direction confirmed.' },
  { number: 6, name: 'Prepare', description: 'Get pre-approval, insurance, and logistics in place before your realtor introduction.' },
  { number: 7, name: 'Match', description: 'Your Ambassador hand-selects three vetted realtors for your zone. You choose.' },
  { number: 8, name: 'Engage', description: 'Warm personal introduction to your chosen realtor. They already know your story.' },
  { number: 9, name: 'Contract', description: 'Under contract — the finish line is in sight. Your team is with you.' },
  { number: 10, name: 'Home', description: 'Closed. You\'re home. Your Journey Recap is waiting.' },
]
```

---

### Section 5 — Onboarding Acknowledgment

```tsx
<div className="rounded-xl border p-4" style={{ borderColor: '#E5E7EB' }}>
  {!onboardingAcknowledged ? (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        className="mt-0.5 shrink-0"
        onChange={onAcknowledge}
      />
      <div>
        <p className="text-sm font-medium" style={{ color: '#1C1814' }}>
          I've reviewed my matches and understand how the HavenQuest Navigator works.
        </p>
        <p className="text-xs mt-1" style={{ color: '#9A8E82' }}>
          Check this to unlock the button below and begin exploring your full reports.
        </p>
      </div>
    </label>
  ) : (
    <div className="flex items-center gap-2">
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: '#2D7D4E' }}
      >
        <span className="text-white text-[10px]">✓</span>
      </div>
      <p className="text-sm font-medium" style={{ color: '#2D7D4E' }}>
        You're all set. Your full reports are ready in Discover.
      </p>
    </div>
  )}

  {onboardingAcknowledged && (
    <button
      onClick={onAdvanceToDiscover}
      className="w-full mt-4 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
      style={{ backgroundColor: GOLD, color: '#16120D' }}
    >
      Explore My Full Reports → Discover
    </button>
  )}
</div>
```

---

## StarterPortal.tsx Changes

### 1 — Add onboardingAcknowledged state
```typescript
const [onboardingAcknowledged, setOnboardingAcknowledged] = useState(false)
```

### 2 — Fetch from Supabase in existing useEffect
Add `onboarding_acknowledged` to the existing Supabase select:
```typescript
.select('first_name, top_city_matches, annual_income, ..., current_milemarker, onboarding_acknowledged')
```

Then:
```typescript
if (ud?.onboarding_acknowledged) {
  setOnboardingAcknowledged(true)
}
```

### 3 — Save to Supabase on acknowledge
```typescript
async function handleAcknowledge() {
  setOnboardingAcknowledged(true)
  try {
    const supabase = createClient()
    const { data: { session: supaSession } } = await supabase.auth.getSession()
    if (!supaSession?.user?.email) return
    await supabase
      .from('users')
      .update({ onboarding_acknowledged: true })
      .eq('email', supaSession.user.email.toLowerCase())
  } catch {}
}
```

### 4 — Pass props to MileMarkerContent
MileMarkerContent needs to pass through to MM1Explore:
- `matches`
- `profile`
- `session`
- `onboardingAcknowledged`
- `onAcknowledge={handleAcknowledge}`
- `onAdvanceToDiscover={() => setActiveMileMarker(2)}`

Update MileMarkerContent.tsx to accept and pass these props to MM1Explore.

---

## Acceptance Criteria

- [ ] MM1 shows welcome heading with user's first name
- [ ] MM1 shows 3 horizontal city cards side by side (flex row)
- [ ] Each card shows rank, score, city name, metro, segment badge, top 2 Must Have scores, monthly cost
- [ ] "View Full Reports →" on each card advances to MM2
- [ ] Static narrative paragraph renders with user's actual priorities, segment, income, household, top city
- [ ] Navigator Journey section shows all 10 steps with descriptions
- [ ] Completed steps (≤ currentMileMarker) show gold circle with checkmark
- [ ] Future steps show numbered gray circle
- [ ] Acknowledgment checkbox shows when onboarding_acknowledged is false
- [ ] Checking the box saves true to Supabase onboarding_acknowledged column
- [ ] After acknowledging — green confirmed state + "Explore My Full Reports" button appears
- [ ] "Explore My Full Reports" button advances to MM2
- [ ] MM2 — Discover is completely unchanged
- [ ] tsc --noEmit passes clean
- [ ] No any types

---

## What Is NOT Changing

- SavedMatches.tsx — untouched
- MM2Discover.tsx — untouched
- All other MileMarker components — untouched
- All existing portal functionality

---

*Brief prepared by Claude (COO) — June 1, 2026. Approved by Craig Asbach.*
