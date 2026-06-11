# Build Brief — MM3 Discover: Fix Default Metro Selection
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — MM3 defaults to wrong metro
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## The Problem

The `selectedMetro` state initializes from a `defaultMetro` IIFE that runs when the component first mounts. At mount time `profile` is null — the Supabase fetch hasn't completed yet. So `defaultMetro` falls back to 'Austin' (or whichever city is first) regardless of the user's actual quiz results.

Same async timing problem as the priority sync fix (commit 9abe28e). Same solution.

---

## File to Change

`components/portal/milemarkers/MM3Discover.tsx` only.

---

## Change — Fix Default Metro Initialization

### Step 1 — Remove the defaultMetro IIFE and replace useState

Find and remove:
```typescript
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

Replace with:
```typescript
const [selectedMetro, setSelectedMetro] = useState<string>('')
```

---

### Step 2 — Add useEffect to set metro when profile loads

Add this useEffect after the existing profile sync useEffects (the two useEffects that watch [profile]):

```typescript
useEffect(() => {
  if (!profile || selectedMetro !== '') return
  const topMatch = getTopMatches(
    {
      ...profile,
      mustHaves: profile.mustHaves ?? [],
      niceToHaves: profile.niceToHaves ?? [],
      notPriorities: profile.notPriorities ?? [],
    },
    getAllCities(),
    1
  )[0]
  const metro = topMatch?.location.metroUsed ?? ''
  const match = METRO_OPTIONS.find(m => metro.includes(m.label))
  setSelectedMetro(match?.value ?? 'Austin')
}, [profile])
```

The `selectedMetro !== ''` guard ensures this only fires once on first load — not every time profile updates. Once the user manually selects a metro, this useEffect will not override their choice.

---

### Step 3 — Handle empty string initial state in metroCities filter

Find:
```typescript
const metroCities = getAllCities().filter(city => city.metroUsed.includes(selectedMetro))
```

Replace with:
```typescript
const metroCities = selectedMetro
  ? getAllCities().filter(city => city.metroUsed.includes(selectedMetro))
  : getAllCities()
```

This prevents an empty string from accidentally matching everything or nothing while the profile is still loading.

---

## Acceptance Criteria

- [ ] MM3 defaults to the metro of the user's top quiz match city
- [ ] If quiz matched Round Rock — Austin metro is selected by default
- [ ] If quiz matched Plano — DFW metro is selected by default
- [ ] If quiz matched The Woodlands — Houston metro is selected by default
- [ ] If quiz matched New Braunfels — San Antonio metro is selected by default
- [ ] User can still manually click any metro button to switch
- [ ] Manual metro selection is not overridden after the user clicks
- [ ] Rankings show correct metro cities on first load
- [ ] tsc --noEmit passes clean
- [ ] No other files changed

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach.*
