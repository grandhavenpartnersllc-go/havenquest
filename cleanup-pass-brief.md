# Cleanup Pass — Supabase Query Consolidation & Code Health
**Project:** HavenQuest
**Date:** June 2, 2026
**Type:** Refactor only — no UI changes, no new features, no visual changes

---

## Overview

Two changes in this pass:

1. Grammar fix in MM1Explore.tsx (one line)
2. Code cleanup across 4 files — consolidate Supabase queries, remove dead code, fix naming error

---

## Change 1 — Grammar Fix

**File:** `components/portal/milemarkers/MM1Explore.tsx`

Find in the welcome paragraph IIFE (not buildMatchNarrative):
```
`Your top match is ${topCity} — and honestly? We're pretty excited about it.`,
```

Replace with:
```
`Your top match is ${topCity} — and honestly — we're pretty excited about it.`,
```

---

## Change 2 — Code Cleanup

**Goal:** Reduce MM2 load from 3 separate Supabase SELECT queries to 1. No UI changes. No new features.

### 2a — StarterPortal.tsx

**Fix 1 — Add mm2_checklist and portal_notes to existing SELECT:**

Find the existing Supabase SELECT in the useEffect IIFE. It currently selects:
```
'first_name, top_city_matches, annual_income, household_size, housing_preference, moving_timeline, must_haves, nice_to_haves, not_priorities, current_milemarker, onboarding_acknowledged'
```

Add `mm2_checklist, portal_notes` to the select string.

**Fix 2 — Store resolved email for reuse:**

After `supaSession.user.email` is confirmed, store it in a local variable within the IIFE so it can be reused without calling getSession() again.

**Fix 3 — Pass mm2_checklist and portal_notes as state:**

Add two new state variables:
```typescript
const [initialChecklist, setInitialChecklist] = useState<Record<string, boolean>>({})
const [initialNotes, setInitialNotes] = useState<string>('')
```

After fetching ud from Supabase:
```typescript
if (ud?.mm2_checklist) setInitialChecklist(ud.mm2_checklist)
if (ud?.portal_notes) setInitialNotes(ud.portal_notes)
```

**Fix 4 — Fix MILEMARKER_NAMES duplicate:**

Find MILEMARKER_NAMES. Entry 1 currently says 'Explore' — change to 'Welcome':
```typescript
1: 'Welcome',  // was 'Explore'
2: 'Explore',
```

**Fix 5 — Pass new props to MileMarkerContent:**

Add to the MileMarkerContent JSX:
```tsx
initialChecklist={initialChecklist}
initialNotes={initialNotes}
```

---

### 2b — MileMarkerContent.tsx

**Update props interface:**

Add to MileMarkerContentProps:
```typescript
initialChecklist: Record<string, boolean>
initialNotes: string
```

**Pass through to MM2Discover in case 2:**

Add to MM2Discover render:
```tsx
initialChecklist={initialChecklist}
initialNotes={initialNotes}
```

---

### 2c — MM2Discover.tsx

**Fix 1 — Remove unused session prop:**

Remove `session: UserSession` from the props interface and from any destructuring. It is never used — the component re-derives email from getSession() internally.

**Fix 2 — Accept initialChecklist as prop instead of fetching:**

Add to props interface:
```typescript
initialChecklist: Record<string, boolean>
```

Remove the useEffect that fetches mm2_checklist from Supabase on mount. Instead initialize checklist state from the prop:
```typescript
const [checklist, setChecklist] = useState<Record<string, boolean>>(initialChecklist)
```

**Fix 3 — Store user email once on mount:**

Add a ref to store the email:
```typescript
const userEmailRef = useRef<string>('')
```

Add a useEffect that resolves the email once on mount:
```typescript
useEffect(() => {
  const supabase = createClient()
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user?.email) {
      userEmailRef.current = session.user.email.toLowerCase()
    }
  })
}, [])
```

**Fix 4 — Use stored email in handleChecklistChange:**

Replace the getSession() call inside handleChecklistChange with:
```typescript
const email = userEmailRef.current
if (!email) return
await supabase.from('users').update({ mm2_checklist: updated }).eq('email', email)
```

Remove the createClient() call from inside handleChecklistChange — use a single supabase client instance at the top of the component or inside the function.

---

### 2d — NotesArea.tsx

**Fix 1 — Accept initialNotes as prop:**

Add to props interface:
```typescript
initialNotes?: string
```

Initialize state from prop:
```typescript
const [notes, setNotes] = useState(initialNotes ?? '')
```

**Fix 2 — Remove the separate SELECT on mount:**

Remove or simplify the useEffect that fetches portal_notes from Supabase — the initial value now comes from the prop passed down from StarterPortal.

Keep the handleBlur Supabase UPDATE so notes still save when the user stops typing.

---

## Acceptance Criteria

- [ ] MM2 load triggers only 1 Supabase SELECT (from StarterPortal) instead of 3
- [ ] mm2_checklist initializes from StarterPortal data — no separate fetch in MM2Discover
- [ ] portal_notes initializes from StarterPortal data — no separate fetch in NotesArea
- [ ] Checklist saves still work — handleChecklistChange still writes to Supabase
- [ ] Notes saves still work — handleBlur still writes to Supabase
- [ ] session prop removed from MM2Discover interface
- [ ] MILEMARKER_NAMES entry 1 fixed from 'Explore' to 'Welcome'
- [ ] Grammar fix applied — em dash not question mark
- [ ] Zero UI changes — nothing visible to the user changes
- [ ] tsc --noEmit passes clean
- [ ] No any types introduced

---

## Files Changing

| File | Changes |
|---|---|
| `components/portal/milemarkers/MM1Explore.tsx` | Grammar fix only |
| `components/portal/StarterPortal.tsx` | Add columns to SELECT, add state, fix MILEMARKER_NAMES, pass new props |
| `components/portal/MileMarkerContent.tsx` | Add props to interface, pass through to MM2 |
| `components/portal/milemarkers/MM2Discover.tsx` | Remove session prop, accept initialChecklist, store email ref |
| `components/portal/NotesArea.tsx` | Accept initialNotes prop, remove separate SELECT |

---

## What Is NOT Changing

- Any UI, layout, copy, or visual styling
- Any quiz, results, or email flow files
- Any data files or service files
- The checklist write behavior — saves on every toggle
- The notes write behavior — saves on blur

---

*Cleanup pass prepared by Claude (COO) — June 2, 2026.*
