# HavenQuest — MM3 Mobile Responsive Layout Fix
**Date:** June 6, 2026  
**Prepared by:** Claude (COO)  
**Executed by:** Claude Code  
**Branch:** main  

---

## Overview

MM3 Discover currently uses a side-by-side two-panel desktop layout that breaks completely on mobile. This brief fixes the responsive layout so MM3 works correctly on all screen sizes. The desktop layout is not changed — mobile only.

Breakpoint: apply mobile layout at `max-width: 768px` (Tailwind `md` breakpoint).

---

## Target Mobile Layout (single column, top to bottom)

```
1. Worksheet orientation banner (if not dismissed)
2. YOUR TOP MATCHES — city cards (horizontal scroll or stacked)
3. YOUR FINANCIAL PICTURE — full width card
4. ADJUST YOUR FINANCIAL PICTURE — collapsible, full width
5. Affordability alert — full width
6. Lock my financials button — full width
7. LIVE CITY RANKINGS — full width (metro tabs + city cards)
8. WHAT SHAPED YOUR RANKINGS — full width
9. Interactive priority selector — full width (reflowed)
10. Commit section (confirmation checkbox + advance button)
```

---

## Detailed Instructions

### 1. Two-panel grid → single column on mobile

The desktop layout uses a two-column grid (`grid-cols-2` or similar flex row) for the left financial panel and right rankings panel.

On mobile (`md:` breakpoint and below):
- Stack panels vertically — financial panel first, rankings panel second
- Each panel takes full width (`w-full`)
- Remove any fixed heights on panels — let content determine height
- Remove `overflow-y: auto` or `overflow-y: scroll` from panels on mobile — let the page scroll naturally

### 2. Financial picture cards — reflow on mobile

The financial summary cards (Down payment, Est. mortgage, Est. property tax, Total housing, Price-to-income ratio, Est. closing costs, Total cash to close) currently use a 2-column grid.

On mobile:
- Keep 2-column grid for the cards — this works at mobile width
- Ensure card text doesn't overflow — wrap if needed
- Reduce font size on values if needed to prevent overflow (minimum 14px)

### 3. Top matches city cards — horizontal scroll on mobile

The three top match city cards at the top of MM3.

On mobile:
- Render as a horizontal scroll row (`overflow-x: auto`, `flex-row`, `flex-nowrap`)
- Each card: fixed width `160px`, image height `100px`
- Add subtle right-fade gradient to indicate scrollability
- Cards should NOT stack vertically — horizontal scroll is correct here

### 4. Metro tab row — scroll on mobile

The metro tabs (State / Austin / DFW / Houston / San Antonio).

On mobile:
- Horizontal scroll row — same pattern as city cards
- Tabs should not wrap to second line
- Active tab stays visible (scroll to active tab on load)

### 5. City ranking cards — full width on mobile

Each city ranking card (rank number, city name, metro, score bar, affordability dot, Learn more, Choose This Community button).

On mobile:
- Full width cards — no changes needed beyond removing the panel constraint
- "Choose This Community" button — ensure it is full width or at minimum 44px tall for touch targets
- "Learn more →" link — ensure adequate touch target size

### 6. Interactive priority selector — reflow on mobile

The priority selector currently has three equal columns across the top (Must Have / Important / Nice To Have) with Unassigned full-width below.

On mobile, three columns at ~120px each is too narrow. Reflow as follows:

**Option A — 2×2 grid (preferred):**
```
[ MUST HAVE    ] [ IMPORTANT     ]
[ NICE TO HAVE ] [ UNASSIGNED    ]
```
Each zone takes 50% width. Unassigned moves from full-width-below to the bottom-right cell.

**Option B — single column stack (fallback if 2×2 is too cramped):**
```
[ MUST HAVE    ]
[ IMPORTANT    ]
[ NICE TO HAVE ]
[ UNASSIGNED   ]
```

Use Option A unless the category pills are too cramped — in that case use Option B.

Each zone:
- Minimum height: `80px` (enough for 2-3 pills)
- Pills: same icon + label, reduce font to 12px on mobile if needed
- Touch targets: each pill must be at least 36px tall for tap interaction
- Click-to-cycle must work on mobile (tap = click)
- Drag and drop will not work on mobile touch — that is acceptable per previous brief

### 7. Collapsible financial calculator — default collapsed on mobile

On desktop the calculator defaults to expanded. On mobile, default to **collapsed** to keep the page manageable. User can tap to expand.

### 8. Commit section — full width on mobile

The confirmation checkbox and "Connect me with my Market Director" advance button at the bottom.

On mobile:
- Full width button
- Minimum height 52px
- Checkbox and label text wrap correctly — do not overflow

### 9. General mobile rules

- All section labels (gold uppercase) — no change needed
- All body copy — ensure `word-break: break-word` or equivalent to prevent overflow
- No horizontal page scroll — the page must not overflow the viewport width at any point
- Padding: use `px-4` (16px) horizontal padding on mobile instead of desktop padding values
- The orientation banner (worksheet banner) — full width, stacks normally

---

## What NOT to Change

- Desktop layout — no changes at `md:` and above
- Any scoring logic, data, or algorithm
- City selection behavior (Choose This Community, max 3, confirmation gate)
- Lock my financials behavior
- The collapsible open/close behavior (just change default state on mobile)

---

## Testing Checklist

After building, verify on a 390px wide viewport (iPhone 14 size):

- [ ] Page does not overflow horizontally
- [ ] Financial panel renders full width above rankings panel
- [ ] City ranking cards are readable and Choose button is tappable
- [ ] Priority selector renders in 2×2 or single column — no overflow
- [ ] Tapping a priority pill cycles it correctly
- [ ] Collapsible calculator is collapsed by default on mobile
- [ ] Metro tabs scroll horizontally without wrapping
- [ ] Commit section button is full width and tappable
- [ ] No content is cut off or hidden

---

## Final Step — Commit and Deploy

After changes are complete, tsc clean, and next build passes:

```
git add -A
git commit -m "fix: MM3 mobile responsive layout — single column stack, priority selector reflow, touch targets"
git push origin main
```

Confirm push succeeded and Vercel deployment triggered. Report back to Claude chat when complete.
