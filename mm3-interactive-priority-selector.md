# HavenQuest — MM3 Interactive Priority Selector in Right Panel
**Date:** June 5, 2026  
**Prepared by:** Claude (COO)  
**Executed by:** Claude Code  
**Branch:** main  

---

## Overview

Replace the read-only "What Shaped Your Rankings" priority tag display in the right panel with a fully interactive priority selector. Users can drag or click to reassign categories between buckets. Rankings update instantly on every change. Remove the full-width priority selector grid that currently sits below both panels entirely.

---

## Current State (to remove)

1. Right panel — "What Shaped Your Rankings" section with read-only Must Have / Important / Nice To Have tag display
2. Below both panels — full-width "ADJUST YOUR PRIORITIES" section with counter bar + icon-in-circle grid

Both of these are replaced by the new interactive selector described below.

---

## New Component — Interactive Priority Selector (right panel)

### Section Header

Keep the existing gold label and body copy:

```
WHAT SHAPED YOUR RANKINGS

These are the priorities you set — and they're what shaped these rankings. Fine-tune them in the priority grid below and watch your results update instantly.
```

Update the body copy to:
```
These are the priorities you set — and they're what shaped these rankings. Drag or click any category to reassign it. Rankings update instantly.
```

---

### Layout

**Three columns across the top (equal width):**

| MUST HAVE | IMPORTANT | NICE TO HAVE |
|---|---|---|
| Cap: 4 | Cap: 5 | No cap |
| Drop zone | Drop zone | Drop zone |

**One full-width row below all three columns:**

| UNASSIGNED |
|---|
| No cap — holds all unassigned categories |

---

### Category Items

Each category renders as a pill/tag with:
- Icon (same Lucide React icon currently used)
- Label text (same as current)
- Same color coding as existing system:
  - Must Have: gold background
  - Important: green background  
  - Nice To Have: blue background
  - Unassigned: dark gray background

Do not change the icon, label, or color of any category item. This is purely a layout and interaction change.

---

### Bucket Zones

Each bucket (Must Have, Important, Nice To Have, Unassigned) is a distinct drop zone with:
- Visible border: `1px solid #D4C5A9` (same as existing card borders)
- Border radius: `8px`
- Minimum height: enough to hold at least 2 category items even when empty
- Background: `#F9F6F1` (light warm — slightly different from page background to indicate it's a drop target)
- When a category is being dragged over a valid drop zone: highlight the zone border in gold (`#C9A84C`) and add a subtle background tint
- Column label above each zone: gold uppercase small-tracking text (MUST HAVE / IMPORTANT / NICE TO HAVE / UNASSIGNED)
- Show current count vs cap below Must Have and Important labels: e.g. "MUST HAVE 3/4"

---

### Interaction — Drag and Drop

Use the HTML5 Drag and Drop API (no external library required):
- `draggable="true"` on each category item
- `onDragStart` — store the category being dragged and its current bucket in state
- `onDragOver` — prevent default, highlight target zone
- `onDrop` — move category to new bucket, clear highlight, trigger re-score
- `onDragLeave` — clear highlight

**Cap enforcement on drop:**
- If user drops a category into Must Have and it already has 4 items: reject the drop, do not move the item, briefly flash the Must Have zone border red to signal it's full
- If user drops a category into Important and it already has 5 items: same behavior
- Nice To Have and Unassigned have no cap — always accept

---

### Interaction — Click to Cycle

Each category item is also clickable. On click, cycle the category through buckets in this order:

```
Unassigned → Nice To Have → Important → Must Have → Unassigned → ...
```

**Cap enforcement on click:**
- If cycling into Must Have would exceed 4: skip Must Have, go directly to Unassigned
- If cycling into Important would exceed 5: skip Important, go to Must Have (or Unassigned if Must Have also full)

---

### Live Rescoring

Every time a category moves buckets (via drag or click), immediately:
1. Recalculate the match scores for all cities using the new priority weights
2. Re-render the city rankings list with updated scores and order
3. Update the affordability dots if applicable

This behavior already exists in the current priority selector — wire the new component to the same rescoring function. Do not rebuild the scoring logic.

---

### Counter Display

Remove the standalone counter bar that currently appears above the full-width grid. Instead, show live counts inline in each bucket label:

```
MUST HAVE  3/4
IMPORTANT  4/5
NICE TO HAVE  2
UNASSIGNED  3
```

Update counts in real time as categories move.

---

## Remove These Elements

1. The full-width "ADJUST YOUR PRIORITIES" section below both panels — remove entirely (counter bar + icon-in-circle grid)
2. The read-only tag display in the right panel — replaced by the interactive selector above
3. Any import or component reference that becomes unused after removal

---

## What NOT to Change

- Do not change the scoring algorithm or weights (Must Have 3x, Important 2x, Nice To Have 1x, Unassigned 0x)
- Do not change any category icons, labels, or colors
- Do not change the left panel in any way
- Do not change the city ranking cards, metro tabs, or Choose This Community buttons
- Do not change the orientation banner, Lock my financials behavior, or financial calculator

---

## Final Step — Commit and Deploy

After changes are complete, tsc clean, and next build passes:

```
git add -A
git commit -m "feat: MM3 interactive priority selector in right panel — drag/click to reassign, live rescoring, removes full-width grid"
git push origin main
```

Confirm push succeeded and Vercel deployment triggered. Report back to Claude chat when complete.
