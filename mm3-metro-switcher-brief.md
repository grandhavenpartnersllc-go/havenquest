# Build Brief — MM3 Discover: Metro Switcher, Priority Labels & Icon Fixes
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — MM3 core UX
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Four changes to MM3Discover.tsx only:

1. Metro switcher — filter live city rankings to selected metro, default to user's top match metro, add Austin/DFW/Houston/San Antonio toggle buttons
2. Priority summary labels — add "Must Have" and "Important" section labels above badge groups
3. Priority summary icons — replace emoji with Lucide icons
4. City popup icons — replace emoji with Lucide icons in priority scores section

---

## File to Change

`components/portal/milemarkers/MM3Discover.tsx` only.

---

## Change 1 — Metro Switcher

### New state

Add after the existing state declarations:

```typescript
const METRO_OPTIONS = [
  { label: 'Austin', value: 'Austin, TX metro area' },
  { label: 'DFW', value: 'Dallas, TX metro area' },
  { label: 'Houston', value: 'Houston, TX metro area' },
  { label: 'San Antonio', value: 'San Antonio, TX metro area' },
]

const defaultMetro = (() => {
  if (!profile) return 'Austin, TX metro area'
  const topMatch = getTopMatches(
    { ...profile, mustHaves: profile.mustHaves ?? [], niceToHaves: profile.niceToHaves ?? [], notPriorities: profile.notPriorities ?? [] },
    getAllCities(),
    1
  )[0]
  const metro = topMatch?.location.metroUsed ?? 'Austin, TX metro area'
  const match = METRO_OPTIONS.find(m => metro.includes(m.label))
  return match?.value ?? 'Austin, TX metro area'
})()

const [selectedMetro, setSelectedMetro] = useState<string>(defaultMetro)
```

### Update sandboxMatches computation

Find line 149:
```typescript
const sandboxMatches = getTopMatches(sandboxProfile, getAllCities(), 5)
```

Replace with:
```typescript
const metroCities = getAllCities().filter(city => city.metroUsed === selectedMetro)
const sandboxMatches = getTopMatches(sandboxProfile, metroCities, 5)
```

### Add metro switcher buttons to rankings panel header

Find the rankings panel header:
```tsx
<p className="text-[10px] font-bold uppercase mb-3"
   style={{ color: GOLD, letterSpacing: '0.18em' }}>
  Live city rankings
</p>
```

Replace with:
```tsx
<div className="flex items-center justify-between mb-3">
  <p className="text-[10px] font-bold uppercase"
     style={{ color: GOLD, letterSpacing: '0.18em' }}>
    Live city rankings
  </p>
  <div className="flex gap-1">
    {METRO_OPTIONS.map(metro => {
      const isActive = selectedMetro === metro.value
      return (
        <button
          key={metro.value}
          onClick={() => setSelectedMetro(metro.value)}
          className="px-2 py-0.5 rounded-full text-[10px] font-bold transition-all"
          style={{
            backgroundColor: isActive ? GOLD : 'transparent',
            color: isActive ? '#16120D' : '#9A8E82',
            border: isActive ? 'none' : '1px solid #E5E7EB',
          }}
        >
          {metro.label}
        </button>
      )
    })}
  </div>
</div>
```

---

## Change 2 — Priority Summary Labels

Find the priority summary section in the left panel. It currently renders mustHaves badges then niceToHaves badges with no labels.

Replace the entire priority summary div content (inside the borderTop div) with:

```tsx
<div style={{ borderTop: '1px solid #F0EDE6', paddingTop: '10px' }}>
  <p className="text-[10px] font-bold uppercase mb-2"
     style={{ color: '#9A8E82', letterSpacing: '0.08em' }}>
    Priority summary
  </p>

  {mustHaves.length > 0 && (
    <div className="mb-2">
      <p className="text-[9px] font-bold uppercase mb-1"
         style={{ color: GOLD, letterSpacing: '0.1em' }}>
        Must Have
      </p>
      <div className="flex flex-wrap gap-1">
        {mustHaves.map(k => {
          const cat = LIFESTYLE_CATEGORIES.find(c => c.key === k)!
          const Icon = CATEGORY_ICONS[k]
          return (
            <span key={k}
                  className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: 'rgba(184,145,42,0.12)', color: GOLD }}>
              <Icon size={10} strokeWidth={2} />
              {cat.label}
            </span>
          )
        })}
      </div>
    </div>
  )}

  {niceToHaves.length > 0 && (
    <div className="mb-2">
      <p className="text-[9px] font-bold uppercase mb-1"
         style={{ color: '#4B7A5E', letterSpacing: '0.1em' }}>
        Important
      </p>
      <div className="flex flex-wrap gap-1">
        {niceToHaves.map(k => {
          const cat = LIFESTYLE_CATEGORIES.find(c => c.key === k)!
          const Icon = CATEGORY_ICONS[k]
          return (
            <span key={k}
                  className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: '#E8F5EE', color: '#2D7D4E' }}>
              <Icon size={10} strokeWidth={2} />
              {cat.label}
            </span>
          )
        })}
      </div>
    </div>
  )}

  {notPriorities.length > 0 && (
    <div>
      <p className="text-[9px] font-bold uppercase mb-1"
         style={{ color: '#9A8E82', letterSpacing: '0.1em' }}>
        Nice to Have
      </p>
      <div className="flex flex-wrap gap-1">
        {notPriorities.map(k => {
          const cat = LIFESTYLE_CATEGORIES.find(c => c.key === k)!
          const Icon = CATEGORY_ICONS[k]
          return (
            <span key={k}
                  className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: '#F7F6F3', color: '#6B7280' }}>
              <Icon size={10} strokeWidth={2} />
              {cat.label}
            </span>
          )
        })}
      </div>
    </div>
  )}
</div>
```

---

## Change 3 — City Popup Icons

In the city snapshot popup, find the priority scores section (around line 892):

```tsx
<span className="text-xs w-4">{cat.icon}</span>
```

Replace with:

```tsx
{(() => {
  const Icon = CATEGORY_ICONS[key]
  return <Icon size={12} strokeWidth={1.5} style={{ color: isMustHave ? GOLD : '#4B7A5E' }} />
})()}
```

---

## Acceptance Criteria

- [ ] Metro switcher buttons appear to the right of "Live city rankings" label
- [ ] Default metro matches user's top quiz match metro
- [ ] Active metro button shows gold filled background
- [ ] Clicking a metro button filters rankings to that metro's cities only
- [ ] Rankings update in real time when metro changes
- [ ] Rankings still update in real time when priorities or financials change
- [ ] Priority summary shows "Must Have" label in gold above Must Have badges
- [ ] Priority summary shows "Important" label in green above Important badges
- [ ] Priority summary shows "Nice to Have" label in gray above Nice to Have badges (if any)
- [ ] All priority summary badges use Lucide icons — no emoji
- [ ] City popup priority scores use Lucide icons — no emoji
- [ ] tsc --noEmit passes clean
- [ ] No any types
- [ ] No other files changed

---

## What Is NOT Changing

- All financial computations
- All Supabase save logic
- Commit button and post-commit view
- Bucket counter bar and flash behavior
- Column grid assignment logic
- City popup content other than the icon fix

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach.*
