# Build Brief — Navigator MileMarker Framework
**Project:** HavenQuest
**Date:** June 1, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — core portal architecture
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Build the 10-MileMarker Navigator framework into the existing portal. The existing StarterPortal content becomes MM2 — Discover. All other MileMarkers are scaffolded with placeholder content. The framework must work on desktop (horizontal tabs) and mobile (accordion).

This is a framework build — not a content build. Placeholder content is acceptable everywhere except MM1 and MM2 which already have real content.

---

## The 10 MileMarkers

| # | Name | Status in this build |
|---|---|---|
| 1 | Explore | Placeholder — auto-marked complete |
| 2 | Discover | REAL — existing portal content moves here |
| 3 | Decide | Placeholder with sandbox teaser |
| 4 | Connect | Locked with preview copy |
| 5 | Plan | Locked with preview copy |
| 6 | Prepare | Locked with preview copy |
| 7 | Match | Locked with preview copy |
| 8 | Engage | Locked with preview copy |
| 9 | Contract | Locked with preview copy |
| 10 | Home | Locked with preview copy |

---

## Supabase Migration (Craig runs manually before build)

```sql
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS current_milemarker INTEGER DEFAULT 2;

NOTIFY pgrst, 'reload schema';
```

Default of 2 means every existing user starts at Discover — their portal content is already there.

---

## Files to Create / Modify

| File | Action |
|---|---|
| `components/portal/NavigatorTabs.tsx` | NEW — tab/accordion navigation component |
| `components/portal/MileMarkerContent.tsx` | NEW — renders content for each MileMarker |
| `components/portal/milemarkers/MM1Explore.tsx` | NEW — placeholder |
| `components/portal/milemarkers/MM2Discover.tsx` | NEW — existing portal content moved here |
| `components/portal/milemarkers/MM3Decide.tsx` | NEW — placeholder with sandbox teaser |
| `components/portal/milemarkers/MM4to10.tsx` | NEW — locked state with preview copy |
| `components/portal/StarterPortal.tsx` | MODIFY — wrap existing content in new framework |

---

## Component 1 — NavigatorTabs.tsx

The navigation component. Renders as horizontal tabs on desktop, accordion on mobile.

### Props
```typescript
interface NavigatorTabsProps {
  currentMileMarker: number  // from database, default 2
  activeMileMarker: number   // which tab is currently selected/open
  onSelect: (mm: number) => void
}
```

### Tab data
```typescript
const MILEMARKERS = [
  { number: 1, name: 'Explore' },
  { number: 2, name: 'Discover' },
  { number: 3, name: 'Decide' },
  { number: 4, name: 'Connect' },
  { number: 5, name: 'Plan' },
  { number: 6, name: 'Prepare' },
  { number: 7, name: 'Match' },
  { number: 8, name: 'Engage' },
  { number: 9, name: 'Contract' },
  { number: 10, name: 'Home' },
]
```

### Status logic
```typescript
function getStatus(mmNumber: number, currentMileMarker: number): 'complete' | 'active' | 'locked' {
  if (mmNumber < currentMileMarker) return 'complete'
  if (mmNumber === currentMileMarker) return 'active'
  return 'locked'
}
```

### Visual states

**Complete (green):**
- Green indicator dot or checkmark
- Full opacity
- Clickable — opens that MileMarker's completed summary
- Color: #2D7D4E or Tailwind green-700

**Active (gold/yellow):**
- Gold indicator dot
- Highlighted tab
- Currently selected
- Color: #B8912A (existing GOLD constant)

**Locked (red/gray):**
- Lock icon
- Reduced opacity (0.5)
- Clickable — shows locked preview card, does not navigate away
- Color: muted, not full red — use gray with subtle red tint

### Desktop layout
- Horizontal tab bar below the welcome band
- All 10 tabs visible
- Tabs scroll horizontally if viewport is narrow
- Active tab has gold underline or background highlight

### Mobile layout (< 768px)
- Accordion — vertical stack
- Each row shows: status indicator + MileMarker number + name
- Active MileMarker expanded by default on load
- Completed MileMarkers can be tapped to expand/collapse
- Locked MileMarkers can be tapped — show preview content inline
- Use a chevron icon to indicate expand/collapse state

---

## Component 2 — MileMarkerContent.tsx

Renders the appropriate content component based on which MileMarker is selected and its status.

```typescript
interface MileMarkerContentProps {
  selectedMileMarker: number
  currentMileMarker: number
  matches: CityMatch[]
  profile: UserProfile | null
  session: UserSession
}
```

Logic:
- If selectedMileMarker < currentMileMarker → show completed summary for that MM
- If selectedMileMarker === currentMileMarker → show active content
- If selectedMileMarker > currentMileMarker → show locked preview card

---

## Component 3 — MM1Explore.tsx

**Status in this build:** Always complete. Auto-marked done.

**Completed summary shows:**
- "You discovered HavenQuest and began your relocation journey."
- Date the account was created (from session or Supabase)
- Entry point used (Explore Texas or Metro Mode) if available

**Placeholder is acceptable** — just a simple completed state card.

---

## Component 4 — MM2Discover.tsx

**Status in this build:** Active for all users (currentMileMarker default = 2).

**Content:** Move ALL existing StarterPortal content here verbatim:
- Matched cities section (SavedMatches)
- Download Report / Email Report buttons
- Full reports for each matched city (FullReport)
- RealtorMatchSection per city
- RelocationChecklist
- NotesArea

This is the existing portal — just moved into the MM2 panel. No content changes.

---

## Component 5 — MM3Decide.tsx

**Status in this build:** Locked for all users (currentMileMarker = 2, so MM3 is locked).

**Locked preview card shows:**

Title: "Decide — Coming Next"

Preview copy:
"Once you've explored your results and are ready to commit your direction, this is where it happens. You'll fine-tune your priorities and financial picture in our live sandbox, then lock in your plan. The moment you commit, your Ambassador will be assigned and your journey shifts from discovery to action."

Visual treatment:
- Lock icon (Lucide `Lock`)
- Muted styling — not invisible, just clearly not yet accessible
- No button or CTA — informational only

---

## Component 6 — MM4to10.tsx (Locked Preview)

Single reusable component for all locked MileMarkers (MM4–MM10). Accepts props for the MileMarker number, name, and preview copy.

**Locked preview copy per MileMarker:**

MM4 — Connect:
"Your Ambassador has already reviewed your full profile before reaching out. No 'tell me about yourself' — just real guidance from someone who knows your market and your situation. Expect to hear from them within 24 hours of being assigned."

MM5 — Plan:
"You and your Ambassador will have a real strategy conversation about your timeline, financing, and target city. You'll leave with a clear, confirmed direction — and your Ambassador will have everything they need to prepare your realtor shortlist."

MM6 — Prepare:
"Before you meet your realtor, everything needs to be in place — financing, insurance, logistics, and decision readiness. Your Ambassador guides you through every item on the checklist. Nothing gets left to the last minute."

MM7 — Match:
"Based on everything your Ambassador knows about you, they'll hand-select three of the best realtors in your target market. Equal presentation — no rankings, no paid placement. You choose who you want to work with."

MM8 — Engage:
"Your Ambassador personally introduces you to your chosen realtor — not an automated email, a real human handoff. Your realtor already knows your story, your budget, and your priorities before you speak."

MM9 — Contract:
"When you find the right home and go under contract, the finish line comes into view. Your entire team — Ambassador and realtor — is with you every step of the way through inspection, appraisal, and closing."

MM10 — Home:
"This is what it's all been building toward. When you close on your new Texas home, HavenQuest celebrates with you — and your complete AI-generated Journey Recap will be waiting, telling the story of your entire relocation from first click to closing day."

---

## Modify StarterPortal.tsx

Replace the current single-scroll layout with the Navigator framework.

### New structure:
```tsx
return (
  <div style={{ backgroundColor: CREAM, minHeight: '100vh' }}>
    {/* Portal nav — unchanged */}
    <nav>...</nav>

    {/* Welcome band — unchanged */}
    <div className="welcome-band">...</div>

    {/* Navigator tabs — NEW */}
    <NavigatorTabs
      currentMileMarker={currentMileMarker}
      activeMileMarker={activeMileMarker}
      onSelect={setActiveMileMarker}
    />

    {/* MileMarker content — NEW */}
    <div className="max-w-5xl mx-auto px-5 py-8">
      <MileMarkerContent
        selectedMileMarker={activeMileMarker}
        currentMileMarker={currentMileMarker}
        matches={matches}
        profile={profile}
        session={session}
      />
    </div>

    {/* Footer — unchanged */}
  </div>
)
```

### New state needed in StarterPortal:
```typescript
const [currentMileMarker, setCurrentMileMarker] = useState(2)
const [activeMileMarker, setActiveMileMarker] = useState(2)
```

### Fetch currentMileMarker from Supabase:
In the existing useEffect where user data is fetched from Supabase, also fetch `current_milemarker`:
```typescript
const { data: ud } = await supabase
  .from('users')
  .select('first_name, top_city_matches, annual_income, ..., current_milemarker')
  .eq('email', email)
  .single()

if (ud?.current_milemarker) {
  setCurrentMileMarker(ud.current_milemarker)
  setActiveMileMarker(ud.current_milemarker)
}
```

---

## Styling Notes

Use existing constants from StarterPortal:
```typescript
const WARM_DARK = '#16120D'
const WARM_MID = '#1C1814'
const GOLD = '#B8912A'
const CREAM = '#F0EDE6'
const CARD_BG = '#FDFCFA'
```

Navigator tab bar background: WARM_DARK (matches nav bar)
Active tab: GOLD underline or highlight
Complete tab: green indicator (#2D7D4E)
Locked tab: gray, 50% opacity, lock icon

---

## Acceptance Criteria

- [ ] Supabase migration adds `current_milemarker` column with default 2
- [ ] NavigatorTabs renders as horizontal tabs on desktop
- [ ] NavigatorTabs renders as accordion on mobile (< 768px)
- [ ] All existing portal content renders inside MM2 — Discover tab
- [ ] MM1 shows completed summary card
- [ ] MM2 is active and selected by default for all existing users
- [ ] MM3 shows locked preview card with correct copy
- [ ] MM4–MM10 show locked preview cards with correct copy per MileMarker
- [ ] Clicking a completed tab shows that MileMarker's content
- [ ] Clicking a locked tab shows the locked preview card — does not navigate away
- [ ] currentMileMarker is fetched from Supabase and drives tab states
- [ ] activeMileMarker defaults to currentMileMarker on load
- [ ] Mobile accordion — active MileMarker expanded by default
- [ ] Mobile accordion — completed MileMarkers expand/collapse on tap
- [ ] Mobile accordion — locked MileMarkers show preview on tap
- [ ] No TypeScript errors — tsc --noEmit passes clean
- [ ] No any types introduced
- [ ] All existing portal functionality preserved — download, email, reports, checklist, notes

---

## What Is NOT Being Built in This Brief

- The live sandbox (MM3 Decide) — Phase 2
- The commit button and Ambassador trigger — Phase 2
- The Ambassador dashboard — Phase 2
- The Prepare checklist (MM6) — Phase 2
- The Journey Recap (MM10) — Phase 3
- Any AI-generated content — Phase 2/3

---

*Brief prepared by Claude (COO) — June 1, 2026. Approved by Craig Asbach.*
