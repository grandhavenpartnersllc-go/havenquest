# MM3 — Commitment Panel Redesign & City Lock Build Brief

**Date:** June 12, 2026
**File:** components/portal/milemarkers/MM3Discover.tsx
**Stack:** Next.js 14, TypeScript strict, TailwindCSS, CSS variables
**Deploy:** Vercel via GitHub origin/main — commit and push after completion

---

## Overview

Redesign the MM3 commitment panel at the bottom of the Discover workspace. The panel shows a full two-column summary of the client's locked financials (left) and locked city selections (right). Both sides start muted and become vivid as the client locks each section. The confirmation checkbox only activates when both are locked. The submit button only activates when the checkbox is checked.

Also included in this brief:
- Fix the React 18 race condition preventing MM3 → MM4 navigation
- Update button copy to "I'm ready to build my relocation plan →"

---

## Phase 0 — Audit

Read MM3Discover.tsx in full before touching anything. Identify:
1. How the financial lock state is currently tracked (variable name, where it's set)
2. How selected cities are currently tracked (variable name, how they're added/removed)
3. Where the existing commitment panel/box renders in the component
4. The exact current button copy and its onClick handler
5. The existing onAdvanceToConnect prop and where it's called

Report findings before proceeding.

---

## Phase 1 — City Lock State

### Add city lock state
Add a new state variable alongside the existing financial lock:

```typescript
const [citiesLocked, setCitiesLocked] = useState<boolean>(false)
```

On mount, if restoring from a saved Supabase record where communities were previously locked, restore `citiesLocked` to true.

### City lock button
Add a "Lock in my city choices" button that appears in the city selections area (near the existing community pills) when at least one city has been selected.

**Button states:**
- If 0 cities selected: button not shown
- If 1+ cities selected and not locked: button shown — brand navy background, white text, lock icon
- If cities locked: button replaced by a locked indicator — green lock icon + "City choices locked" label. Clicking it does nothing (locked is permanent once set, same as financials)

**On click:**
```typescript
setCitiesLocked(true)
// Also save citiesLocked state to Supabase sandbox_profile or chosen_communities — 
// use whichever field already tracks city selections
```

---

## Phase 2 — Commitment Panel Redesign

### Location
Replace the entire existing commitment box/panel at the bottom of MM3Discover with the new two-column summary panel described below.

### Panel structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR RELOCATION PLAN                         │
│              (section label — small caps, muted)                │
├────────────────────────────┬────────────────────────────────────┤
│   FINANCIAL SUMMARY        │   YOUR COMMUNITIES                 │
│   (left column)            │   (right column)                   │
│                            │                                    │
│   Annual Income            │   [City Pill] [City Pill]          │
│   Monthly Budget           │   [City Pill]                      │
│   Down Payment             │                                    │
│   Est. Monthly Payment     │                                    │
│   Affordability Status     │                                    │
├────────────────────────────┴────────────────────────────────────┤
│   ☐  I've reviewed my plan and I'm ready to take the next step  │
├─────────────────────────────────────────────────────────────────┤
│   [I'm ready to build my relocation plan →]                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 3 — Five Progressive States

Implement the following states using CSS opacity and pointer-events. Do NOT hide/show sections — always show the full panel. Use opacity and color transitions to communicate lock state.

### State 1 — Nothing locked
- Entire panel visible
- Financial column: `opacity: 0.35`, values shown as `—` placeholders or actual values but grayed
- City column: `opacity: 0.35`, city pills shown but grayed out
- Lock icons: open padlock icon on both columns
- Status message below columns: *"Lock in your financials and cities above to confirm your plan"* — small, muted text
- Checkbox: `disabled`, `opacity: 0.4`, cursor not-allowed
- Submit button: `disabled`, `opacity: 0.4`, cursor not-allowed, grayed background

### State 2 — Financials locked only
- Financial column: `opacity: 1.0`, full color, vivid
- Financial column header: green lock icon + "Financials locked"
- City column: `opacity: 0.35`, still muted
- Status message: *"Lock in your city choices above to continue"*
- Checkbox: still disabled
- Submit button: still disabled

### State 3 — Cities locked only
- City column: `opacity: 1.0`, full color, vivid city pills
- City column header: green lock icon + "Cities locked"
- Financial column: `opacity: 0.35`, still muted
- Status message: *"Lock in your financials above to continue"*
- Checkbox: still disabled
- Submit button: still disabled

### State 4 — Both locked
- Both columns: `opacity: 1.0`, fully vivid
- Both column headers: green lock icons
- Status message replaced with: *"Your plan is set. Confirm below to continue."* — slightly more prominent, brand navy text
- Checkbox: **enabled**, full opacity, cursor pointer
- Submit button: still disabled until checkbox checked
- Transition: smooth opacity transition 300ms ease on all elements

### State 5 — Both locked + checkbox checked
- Submit button: **fully active**
- Background: brand gold `#C5B783`
- Text: brand navy `#0A1E3D`, font-weight 600
- Text: *"I'm ready to build my relocation plan →"*
- Cursor: pointer
- Hover: slight darkening
- onClick: triggers the commit flow

---

## Phase 4 — Financial Summary Content (Left Column)

Pull these values from the existing financial state in the component:

| Label | Value source |
|---|---|
| Annual Income | From profile/financial state — format as "$XXX,XXX" |
| Monthly Budget | Calculated monthly housing budget |
| Down Payment | From financial state |
| Est. Monthly Payment | Calculated all-in monthly estimate |
| Affordability | Current affordability status badge (green/yellow/red) |

If financials are not yet locked: show the values but the entire column is at `opacity: 0.35`
If financials are locked: show values at full opacity with a green lock indicator in the column header

---

## Phase 5 — City Summary Content (Right Column)

Display the client's selected communities as styled pills:

```tsx
// Each selected city rendered as a pill
<span className="city-pill">{cityName}</span>
```

**Pill styles:**
- Not locked: muted background, muted text, `opacity: 0.35` on the column
- Locked: brand gold background `#C5B783`, brand navy text `#0A1E3D`, full opacity

If no cities selected yet: show placeholder text *"Select communities above"* at low opacity

Column header label: "YOUR COMMUNITIES"
If cities locked: header shows green lock icon + "Cities locked"

---

## Phase 6 — React 18 Navigation Fix

Apply the useEffect fix for the race condition between setCommitted(true) and onAdvanceToConnect():

```typescript
// Add at component level
const justCommittedRef = useRef(false)

// In handleCommit, replace:
//   setCommitted(true)
//   onAdvanceToConnect()
// With:
justCommittedRef.current = true
setCommitted(true)

// Add new useEffect:
useEffect(() => {
  if (committed && justCommittedRef.current) {
    justCommittedRef.current = false
    onAdvanceToConnect()
  }
}, [committed, onAdvanceToConnect])
```

This ensures navigation fires in a clean React frame after the state update is committed to the DOM.

---

## Phase 7 — Styling

Use CSS variables throughout — no hardcoded colors except brand constants.

**Key styles:**
```css
/* Muted state */
.commitment-column-muted {
  opacity: 0.35;
  transition: opacity 300ms ease;
  pointer-events: none;
}

/* Active state */
.commitment-column-active {
  opacity: 1.0;
  transition: opacity 300ms ease;
}

/* City pill — unlocked */
.city-pill-unlocked {
  background: var(--card-bg);
  border: 1.5px solid var(--panel-border);
  color: var(--text-muted);
  border-radius: 20px;
  padding: 4px 14px;
  font-size: 13px;
}

/* City pill — locked */
.city-pill-locked {
  background: #C5B783;
  border: none;
  color: #0A1E3D;
  border-radius: 20px;
  padding: 4px 14px;
  font-size: 13px;
  font-weight: 500;
}

/* Submit button — disabled */
.submit-btn-disabled {
  background: var(--text-muted);
  color: var(--panel-bg);
  opacity: 0.4;
  cursor: not-allowed;
}

/* Submit button — active */
.submit-btn-active {
  background: #C5B783;
  color: #0A1E3D;
  font-weight: 600;
  cursor: pointer;
  opacity: 1.0;
}
.submit-btn-active:hover {
  background: #b8a96e;
}
```

---

## Phase 8 — TypeScript Check, Commit, Deploy

```
npx tsc --noEmit && git add -A && git commit -m "feat: MM3 commitment panel redesign — city lock, two-column summary, progressive states, nav fix" && git push origin main
```

Confirm Vercel deployment triggered. Report production URL.

---

## Summary of Deliverables

| Phase | Deliverable |
|---|---|
| 0 | Audit report |
| 1 | City lock state + lock button |
| 2 | Two-column commitment panel structure |
| 3 | Five progressive states with opacity transitions |
| 4 | Financial summary content wired to existing state |
| 5 | City summary pills wired to selected communities |
| 6 | React 18 navigation fix |
| 7 | Styling with CSS variables |
| 8 | TypeScript check, commit, deploy |

**Report back to Claude chat at the end of Phase 0 before proceeding.**
