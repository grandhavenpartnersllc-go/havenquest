# Build Brief — Navigator Portal Updates (Comprehensive)
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — major portal UX and brand updates
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Before You Start

Read this brief completely. Then read these files:
1. `components/portal/StarterPortal.tsx`
2. `components/portal/NavigatorTabs.tsx`
3. `components/portal/MileMarkerContent.tsx`
4. `components/portal/milemarkers/MM1Explore.tsx`
5. `components/portal/milemarkers/MM2Discover.tsx`
6. `components/portal/milemarkers/MM3Decide.tsx`
7. `components/portal/milemarkers/MM4to10.tsx`

Confirm back exactly what files you are changing before writing any code.

---

## Supabase Migrations (already run — columns are live)

```sql
-- Already executed:
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS mm2_checklist JSONB DEFAULT '{}';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS portal_notes TEXT DEFAULT '';
```

---

## Change 1 — Portal Header: "HavenQuest NAVIGATOR"

### File: `components/portal/StarterPortal.tsx`

Find the nav bar Link that renders the HavenQuest logo:
```tsx
<Link href="/" className="font-bold text-[16px] tracking-tight" style={{ color: '#E8E2D9' }}>
  Haven<span style={{ color: GOLD }}>Quest</span>
</Link>
```

Replace with:
```tsx
<Link href="/" className="font-bold text-[16px] tracking-tight" style={{ color: '#E8E2D9' }}>
  Haven<span style={{ color: GOLD }}>Quest</span>
  <span
    className="ml-2 text-[11px] font-bold tracking-[0.2em] uppercase"
    style={{ color: 'rgba(232,226,217,0.45)' }}
  >
    Navigator
  </span>
</Link>
```

---

## Change 2 — MM1 Welcome Label

### File: `components/portal/milemarkers/MM1Explore.tsx`

Find the section label at the top of Section 1:
```tsx
<p className="text-[10px] font-bold uppercase mb-3"
   style={{ color: GOLD, letterSpacing: '0.18em' }}>
  Welcome to Your Navigator
</p>
```

Replace with:
```tsx
<p className="text-[10px] font-bold uppercase mb-3"
   style={{ color: GOLD, letterSpacing: '0.18em' }}>
  Welcome to Your Navigator Journey
</p>
```

---

## Change 3 — MileMarker Name Swaps

MM2 renamed from **Discover** to **Explore**
MM3 renamed from **Decide** to **Discover**

### File: `components/portal/NavigatorTabs.tsx`

Find the MILEMARKERS array. Update:
```typescript
{ number: 2, name: 'Discover' }  →  { number: 2, name: 'Explore' }
{ number: 3, name: 'Decide' }    →  { number: 3, name: 'Discover' }
```

### File: `components/portal/milemarkers/MM1Explore.tsx`

Find the NAVIGATOR_STEPS array. Update:
```typescript
{ number: 2, name: 'Discover', description: '...' }  →  { number: 2, name: 'Explore', description: 'Spread out the map. Flip through your matched city reports, explore affordability numbers, school ratings, and market conditions. Dream a little. This is your brochure phase — and there\'s no rush. Pay attention to what moves you, because in your next step you\'ll get to dial it all in.' }
{ number: 3, name: 'Decide', description: '...' }    →  { number: 3, name: 'Discover', description: 'Time to load up the car. You\'ve explored the options — now you\'re narrowing in. Use the sandbox to move your priorities around, adjust your financial picture, and watch your city matches respond in real time. When the right picture emerges, your Market Director jumps in as your copilot and the journey shifts into gear.' }
```

### File: `components/portal/MileMarkerContent.tsx`

Find where MM3 content is routed (case 3). The component rendered is MM3Decide — rename the file reference if needed, or leave the routing as-is if the component name doesn't need to match the display name. No logic changes needed here beyond confirming routing still works after name changes.

---

## Change 4 — MM3 Locked Preview Copy Update

### File: `components/portal/milemarkers/MM3Decide.tsx`

Find the locked preview heading and paragraph. Update:

**Heading:** Change from "Decide — Coming Next" to "Discover — Coming Next"

**Paragraph:** Replace with:
```
"You've explored the possibilities. Now it's time to make them yours. The Discover sandbox is where the real fun begins — move your priorities around, adjust your financial picture, watch your cities respond in real time. Try different configurations. See what opens up. Every adjustment reveals something new about what you actually want. When the right picture emerges and the direction feels right, your Market Director jumps in as your copilot and the road trip begins. The wheel stays in your hands. We just help you find the best route."
```

---

## Change 5 — MM2 Explore: Forward-Looking Line

### File: `components/portal/milemarkers/MM2Discover.tsx`

Find the top of the MM2 content — before the matched cities section. Add a warm introductory paragraph:

```tsx
<div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#F7F6F3' }}>
  <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>
    These are your matched cities — and everything you need to explore them is right here.
    As you flip through the reports, pay attention to what excites you and what gives you pause.
    The scores, the numbers, the schools — it's all here to help you get a feel for each place.
    And when you're ready to go deeper and start shaping your plan,{' '}
    <strong>Discover</strong> is waiting with a live sandbox where you can move things around
    and watch your matches respond in real time.
  </p>
</div>
```

---

## Change 6 — Score Explanation Popup

### File: `components/portal/milemarkers/MM2Discover.tsx`

Add a "How scores work" popup somewhere near the top of the matched cities section — before the city cards render.

**Trigger link:**
```tsx
<button
  onClick={() => setScorePopupOpen(true)}
  className="text-xs font-medium underline underline-offset-2 mb-4 block"
  style={{ color: GOLD }}
>
  How are scores calculated? →
</button>
```

**State:**
```typescript
const [scorePopupOpen, setScorePopupOpen] = useState(false)
```

**Popup modal:**
```tsx
{scorePopupOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    onClick={() => setScorePopupOpen(false)}
  >
    <div
      className="rounded-2xl p-6 max-w-md w-full"
      style={{ backgroundColor: '#FDFCFA' }}
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base" style={{ color: '#16120D' }}>
          Understanding Your Scores
        </h3>
        <button
          onClick={() => setScorePopupOpen(false)}
          className="text-sm"
          style={{ color: '#9A8E82' }}
        >
          ✕
        </button>
      </div>

      <p className="text-sm leading-relaxed mb-4" style={{ color: '#4B5563' }}>
        Every category is scored from <strong>0 to 10</strong>. Higher is always better —
        a 9 in Traffic means great traffic conditions, not bad ones. A 9 in Affordability
        means housing is very affordable for your income.
      </p>

      <div className="space-y-2 mb-4">
        {[
          { label: 'Affordability', desc: 'How well housing costs fit your income' },
          { label: 'Schools', desc: 'Public school district quality and TEA ratings' },
          { label: 'Safety', desc: 'Crime rates — higher score means safer' },
          { label: 'Walkability', desc: 'How much you can do on foot day to day' },
          { label: 'Transit', desc: 'Bus, rail, and commute options available' },
          { label: 'Nightlife', desc: 'Bars, music, restaurants, entertainment' },
          { label: 'Outdoors', desc: 'Parks, trails, lakes, and nature access' },
          { label: 'Family Friendly', desc: 'Overall environment for raising children' },
          { label: 'Remote Work', desc: 'Broadband quality, tech culture, coworking' },
          { label: 'Low Taxes', desc: 'Property tax rates — higher score means lower taxes' },
          { label: 'Weather', desc: 'Climate comfort and sunshine' },
          { label: 'Traffic', desc: 'Commute times — higher score means less congestion' },
          { label: 'Healthcare', desc: 'Hospital access, specialists, medical quality' },
        ].map(item => (
          <div key={item.label} className="flex gap-3">
            <span className="text-xs font-semibold w-28 shrink-0" style={{ color: '#16120D' }}>
              {item.label}
            </span>
            <span className="text-xs" style={{ color: '#6B7280' }}>
              {item.desc}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-3" style={{ backgroundColor: '#F0EDE6' }}>
        <p className="text-xs leading-relaxed" style={{ color: '#4B5563' }}>
          <strong>How priorities affect your match score:</strong> Categories you marked
          as Must Have count 3× more than others. Important to Me counts 2×.
          Would Be Nice counts 1×. Unassigned categories don't affect your score at all.
        </p>
      </div>
    </div>
  </div>
)}
```

---

## Change 7 — MM2 Progress Checklist

### File: `components/portal/milemarkers/MM2Discover.tsx`

Add state for checklist and Supabase save function:

```typescript
const CHECKLIST_ITEMS = [
  { key: 'reviewed_top_city', label: 'I reviewed my top city match report' },
  { key: 'checked_affordability', label: 'I checked the affordability breakdown' },
  { key: 'looked_at_schools', label: 'I looked at school data for at least one city' },
  { key: 'read_strengths', label: 'I read the strengths and tradeoffs' },
  { key: 'explored_second_city', label: 'I explored a second city match' },
  { key: 'understand_scores', label: 'I have a sense of what the scores mean' },
  { key: 'ready_for_next', label: 'I feel ready to go deeper and start shaping my plan' },
]

const [checklist, setChecklist] = useState<Record<string, boolean>>({})
```

**Fetch checklist from Supabase on mount** (add to existing useEffect or create new one):
```typescript
const { data: ud } = await supabase
  .from('users')
  .select('mm2_checklist')
  .eq('email', email)
  .single()
if (ud?.mm2_checklist) setChecklist(ud.mm2_checklist)
```

**Save function:**
```typescript
async function handleChecklistChange(key: string, checked: boolean) {
  const updated = { ...checklist, [key]: checked }
  setChecklist(updated)
  try {
    const supabase = createClient()
    const { data: { session: supaSession } } = await supabase.auth.getSession()
    if (!supaSession?.user?.email) return
    await supabase
      .from('users')
      .update({ mm2_checklist: updated })
      .eq('email', supaSession.user.email.toLowerCase())
  } catch {}
}
```

**Render checklist at the bottom of MM2, before the advance button:**
```tsx
<div className="mt-10 pt-8" style={{ borderTop: '1px solid #E5E7EB' }}>
  <p className="text-[10px] font-bold uppercase mb-4"
     style={{ color: GOLD, letterSpacing: '0.18em' }}>
    Your Explore Checklist
  </p>
  <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
    Check these off as you go. There's no rush — but when you've worked through them,
    you'll know you're ready for what comes next.
  </p>
  <div className="space-y-3">
    {CHECKLIST_ITEMS.map(item => (
      <label key={item.key} className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={!!checklist[item.key]}
          onChange={e => handleChecklistChange(item.key, e.target.checked)}
          className="mt-0.5 shrink-0"
        />
        <span className="text-sm" style={{ color: checklist[item.key] ? '#2D7D4E' : '#4B5563' }}>
          {item.label}
        </span>
      </label>
    ))}
  </div>
</div>
```

---

## Change 8 — MM2 Advance Button

### File: `components/portal/milemarkers/MM2Discover.tsx`

Add an advance button at the very bottom of MM2, below the checklist. This is the self-selection trigger to advance to MM3 Discover.

```tsx
<div className="mt-8 pt-6" style={{ borderTop: '1px solid #E5E7EB' }}>
  <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
    Explored enough to know you're ready to go deeper?
  </p>
  <button
    onClick={onAdvanceToDiscover}
    className="w-full py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
    style={{ backgroundColor: GOLD, color: '#16120D' }}
  >
    I'm ready — take me to Discover →
  </button>
</div>
```

**Props needed:** MM2Discover needs an `onAdvanceToDiscover` prop passed from MileMarkerContent that calls `setActiveMileMarker(3)`.

Update MileMarkerContent.tsx to pass `onAdvanceToDiscover={() => setActiveMileMarker(3)}` to MM2Discover.

Update MM2Discover props interface:
```typescript
interface MM2DiscoverProps {
  matches: CityMatch[]
  profile: UserProfile | null
  session: UserSession
  onAdvanceToDiscover: () => void
}
```

---

## Change 9 — Notes Area Label Update

### File: `components/portal/milemarkers/MM2Discover.tsx`

Find wherever the NotesArea component is rendered in MM2. Add a label above it:

```tsx
<div className="mt-6">
  <p className="text-[10px] font-bold uppercase mb-2"
     style={{ color: GOLD, letterSpacing: '0.18em' }}>
    Your Notes
  </p>
  <p className="text-xs mb-3" style={{ color: '#9A8E82' }}>
    Jot down questions, thoughts, or anything you want to remember.
    Your Market Director will see these when they review your profile.
  </p>
  <NotesArea />
</div>
```

Also confirm whether NotesArea currently saves to Supabase. If it saves to a `notes` column — good, leave it. If it is session-only, update it to save to the `portal_notes` column added in the migration.

---

## Acceptance Criteria

- [ ] Portal nav bar shows "HavenQuest NAVIGATOR" with Navigator in smaller muted caps
- [ ] MM1 section label reads "Welcome to Your Navigator Journey"
- [ ] MM2 tab displays "2. Explore" — not "2. Discover"
- [ ] MM3 tab displays "3. Discover" — not "3. Decide"
- [ ] MM1 NAVIGATOR_STEPS updated — step 2 is "Explore", step 3 is "Discover" with new descriptions
- [ ] MM3 locked preview heading says "Discover — Coming Next"
- [ ] MM3 locked preview paragraph updated with new sandbox-energy copy
- [ ] MM2 forward-looking intro paragraph appears at top of content
- [ ] "How are scores calculated?" link appears in MM2
- [ ] Score popup opens on click showing all 13 categories with plain-English descriptions
- [ ] Score popup closes on ✕ click or clicking outside
- [ ] Weighting explanation appears at bottom of popup
- [ ] Progress checklist appears at bottom of MM2 with 7 items
- [ ] Checking an item saves to Supabase mm2_checklist column
- [ ] Checklist state persists across sessions — reloading shows previously checked items
- [ ] Checked items display in green text
- [ ] "I'm ready — take me to Discover →" button appears below checklist
- [ ] Clicking advance button sets activeMileMarker to 3
- [ ] Notes area has new label and Market Director context line above it
- [ ] NotesArea saves to Supabase (confirm existing behavior or update to portal_notes column)
- [ ] tsc --noEmit passes clean
- [ ] No any types introduced

---

## Files Changing

| File | Changes |
|---|---|
| `components/portal/StarterPortal.tsx` | Portal header — add NAVIGATOR |
| `components/portal/NavigatorTabs.tsx` | MM2 → Explore, MM3 → Discover |
| `components/portal/MileMarkerContent.tsx` | Pass onAdvanceToDiscover to MM2 |
| `components/portal/milemarkers/MM1Explore.tsx` | Welcome label, NAVIGATOR_STEPS name swap + descriptions |
| `components/portal/milemarkers/MM2Discover.tsx` | Intro paragraph, score popup, checklist, advance button, notes label |
| `components/portal/milemarkers/MM3Decide.tsx` | Heading and copy update |

---

## What Is NOT Changing

- MM4 through MM10 locked preview copy — already updated in previous build
- Any quiz, results, or email flow files
- Any data files or service files
- Any TypeScript interfaces (no new fields needed — Supabase columns already added)

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach. Supabase migrations already executed.*
