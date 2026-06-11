# Build Brief — MM1/MM2/MM3 Copy & UX Updates (Comprehensive)
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — copy, UX, and personalization
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Supabase Migration (already executed)

```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS preferred_city TEXT DEFAULT NULL;
```

---

## Files Changing

| File | Changes |
|---|---|
| `components/portal/milemarkers/MM1Explore.tsx` | Navigator Journey orienting paragraph |
| `components/portal/milemarkers/MM2Discover.tsx` | Welcome copy, remove checklist, metro context line, city selection |
| `components/portal/milemarkers/MM3Discover.tsx` | Metro context line, city preliminary choice on ranking cards |
| `components/quiz/FinancialPictureStep.tsx` | Homeowner question reframe |

---

## Change 1 — MM1Explore.tsx: Navigator Journey Orienting Paragraph

### Location
In `components/portal/milemarkers/MM1Explore.tsx` — the Section 4 Navigator Journey block. Find the section label:

```tsx
<p className="text-[10px] font-bold uppercase mb-6"
   style={{ color: GOLD, letterSpacing: '0.18em' }}>
  Your Navigator Journey
</p>
```

### Add orienting paragraph after the label, before the cards:

```tsx
<p className="text-sm leading-relaxed mb-6" style={{ color: '#6B7280' }}>
  Your journey with HavenQuest unfolds across 10 MileMarkers — from your
  first city matches all the way to closing day. Each step builds on the last.
  Below is your complete path. You&apos;re at MileMarker 1 today, and
  everything ahead is designed to get you home.
</p>
```

---

## Change 2 — MM2Discover.tsx: Welcome Section Copy

### Location
Find the forward-looking intro paragraph at the top of MM2 content. It currently reads:

```tsx
<div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#F7F6F3' }}>
  <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>
    These are your matched cities...
  </p>
</div>
```

### Replace with:

```tsx
<div className="mb-6">
  <p className="text-[10px] font-bold uppercase mb-2"
     style={{ color: GOLD, letterSpacing: '0.18em' }}>
    Welcome to Your Matched Cities
  </p>
  <h2 className="text-[20px] font-bold tracking-tight mb-3" style={{ color: WARM_DARK }}>
    Meet your top Texas matches.
  </h2>
  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
    Based on everything you told us, these are the communities where your life
    genuinely fits. This is your introduction to each of them — their schools,
    their markets, their lifestyle scores, and what it actually costs to live there.
    Take your time. Read the reports. Get a feel for each place. When something
    catches your attention, that&apos;s worth paying attention to.
  </p>
</div>
```

---

## Change 3 — MM2Discover.tsx: Remove Checklist, Replace with Clean Advance Button

### Remove entirely:
- The `CHECKLIST_ITEMS` constant
- The `checklist` state variable
- The `handleChecklistChange` function
- The checklist useEffect that fetches mm2_checklist from Supabase
- The entire checklist JSX section (the "Your Explore Checklist" div)

### Keep:
- The `userEmailRef` and email-resolver useEffect
- The advance button and `onAdvanceToDiscover` prop
- All other MM2 content

### Replace the checklist section and advance button with:

```tsx
<div className="mt-10 pt-6" style={{ borderTop: '1px solid #E5E7EB' }}>
  <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
    Taken a look at your matches? When you&apos;re ready to dial in your
    direction, Discover is waiting.
  </p>
  <button
    onClick={onAdvanceToDiscover}
    className="w-full py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
    style={{ backgroundColor: GOLD, color: '#16120D' }}
  >
    I&apos;m ready to go deeper →
  </button>
</div>
```

### Update MileMarkerContent.tsx
Since MM2 no longer needs `initialChecklist` prop, remove it from the MM2Discover call in case 2. Keep `initialNotes` and `session` and `onAdvanceToDiscover`.

Also remove `initialChecklist` from the MileMarkerContentProps interface.

Also remove `initialChecklist` state and its setter from StarterPortal.tsx — it's no longer needed.

---

## Change 4 — MM3Discover.tsx: Metro Context Line

### Location
In the rankings panel, find the metro switcher header row. Currently:

```tsx
<div className="flex items-center justify-between mb-3">
  <p className="text-[10px] font-bold uppercase"
     style={{ color: GOLD, letterSpacing: '0.18em' }}>
    Live city rankings
  </p>
  <div className="flex gap-1">
    {METRO_OPTIONS.map(...)}
  </div>
</div>
```

### Add a context line between the header row and the affordability legend:

```tsx
{/* Metro context line */}
<p className="text-xs mb-2" style={{ color: '#9A8E82' }}>
  {(() => {
    const topMetroLabel = METRO_OPTIONS.find(m => m.value === selectedMetro)?.label ?? 'Austin'
    const isOriginalMetro = !sandboxTouched
    return isOriginalMetro
      ? `${topMetroLabel} is your top match — you can also explore other Texas metros below.`
      : `Showing ${topMetroLabel} metro — adjust priorities or switch metros to explore.`
  })()}
</p>
```

---

## Change 5 — MM3Discover.tsx: Preliminary City Choice on Ranking Cards

### New state
```typescript
const [preferredCity, setPreferredCity] = useState<string | null>(null)
```

### Load preferred city from Supabase on mount
Add to the existing Supabase load useEffect (the one that checks sandbox_committed):

```typescript
if (data?.preferred_city) setPreferredCity(data.preferred_city)
```

### Save preferred city function
```typescript
async function handleCityChoice(cityId: string) {
  const newChoice = preferredCity === cityId ? null : cityId
  setPreferredCity(newChoice)
  try {
    const supabase = createClient()
    const { data: { session: s } } = await supabase.auth.getSession()
    if (!s?.user?.email) return
    await supabase
      .from('users')
      .update({ preferred_city: newChoice })
      .eq('email', s.user.email.toLowerCase())
  } catch {}
}
```

### Add city choice UI to each ranking card
Find the city card bottom row (metro + Learn more):

```tsx
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
```

Replace with:

```tsx
<div className="flex items-center justify-between mt-1">
  <p className="text-[10px]" style={{ color: '#9A8E82' }}>
    {match.location.metroUsed}
  </p>
  <div className="flex items-center gap-2">
    <button
      onClick={() => setCityPopup(match)}
      className="text-[10px] font-semibold underline underline-offset-2"
      style={{ color: GOLD }}
    >
      Learn more →
    </button>
    <button
      onClick={() => handleCityChoice(match.location.id)}
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all"
      style={{
        backgroundColor: preferredCity === match.location.id
          ? 'rgba(184,145,42,0.15)'
          : 'transparent',
        color: preferredCity === match.location.id ? GOLD : '#C5BFB8',
        border: `1px solid ${preferredCity === match.location.id ? GOLD : '#E5E7EB'}`,
      }}
    >
      {preferredCity === match.location.id ? '✓ My Choice' : 'Choose'}
    </button>
  </div>
</div>
{preferredCity === match.location.id && (
  <p className="text-[9px] mt-1 font-medium" style={{ color: GOLD }}>
    Your Market Director will see this preference.
  </p>
)}
```

---

## Change 6 — FinancialPictureStep.tsx: Homeowner Question Reframe

### Location
`components/quiz/FinancialPictureStep.tsx`

### Change 1 — Question label
Find:
```tsx
<label className="block text-sm font-semibold text-gray-800 mb-2">
  Are you currently a homeowner?
</label>
```

Replace with:
```tsx
<label className="block text-sm font-semibold text-gray-800 mb-2">
  Will you be selling a home and applying the proceeds to your new purchase?
</label>
```

### Change 2 — Yes/No button labels stay the same — no change needed

### Change 3 — Proceeds field label and subtext
Find:
```tsx
<label className="block text-sm font-semibold text-gray-800 mb-0.5">
  Estimated proceeds from your home sale
</label>
<p className="text-xs text-gray-400 mb-2">
  The equity you'll walk away with after paying off your mortgage and selling costs...
</p>
```

Replace subtext with:
```tsx
<p className="text-xs text-gray-400 mb-2">
  The equity you expect to walk away with after paying off your mortgage and selling costs — this goes toward your new purchase.
</p>
```

---

## Acceptance Criteria

### MM1
- [ ] Orienting paragraph appears between "Your Navigator Journey" label and first MileMarker card
- [ ] Paragraph mentions 10 MileMarkers, current position, and destination

### MM2
- [ ] "Welcome to Your Matched Cities" label in gold caps
- [ ] "Meet your top Texas matches." headline
- [ ] Warm introduction paragraph with "introduction" language
- [ ] 7-item checklist removed entirely
- [ ] Clean advance section with "Taken a look at your matches?" copy
- [ ] Button reads "I'm ready to go deeper →"
- [ ] Advance button still writes current_milemarker: 3 to Supabase
- [ ] initialChecklist prop removed from MM2Discover, MileMarkerContent, StarterPortal

### MM3
- [ ] Metro context line appears between metro buttons and affordability legend
- [ ] Context line reads "[Metro] is your top match — you can also explore other Texas metros below." on first load
- [ ] Context line updates to "Showing [Metro] metro — adjust priorities or switch metros to explore." after sandbox is touched
- [ ] "Choose" button appears on each city ranking card
- [ ] Clicking "Choose" selects that city — button shows "✓ My Choice" in gold
- [ ] Clicking again deselects
- [ ] Only one city can be chosen at a time
- [ ] "Your Market Director will see this preference." note appears under chosen city
- [ ] Choice saves to Supabase preferred_city column
- [ ] Choice loads on return visit

### Quiz
- [ ] Financial Picture question reads "Will you be selling a home and applying the proceeds to your new purchase?"
- [ ] Yes/No buttons unchanged
- [ ] Proceeds field still shows conditionally when Yes is selected
- [ ] Proceeds subtext updated

### Code quality
- [ ] tsc --noEmit passes clean
- [ ] No any types
- [ ] No other files changed beyond the 4 listed

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach. Supabase migration already executed.*
