# Build Brief — FullReport Card Contrast Improvements
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** Medium — visual polish
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Three visual changes to FullReport.tsx to improve contrast and readability. No logic changes. No copy changes.

**Design intent:**
- Warm tones for the emotional/narrative sections (header)
- Cool tones for the data sections (stat tiles)
- Clear visual separation between card and page background

---

## File to Change

`components/results/FullReport.tsx`

No other files.

---

## Change 1 — Report Header Background

The current header background `#F0EDE6` is too close to the cream page background. Darken it to create clear separation.

Find:
```
<div className="bg-[#F0EDE6] border-b border-gray-200 p-6">
```

Replace with:
```
<div className="bg-[#E8E3DB] border-b border-gray-300 p-6">
```

---

## Change 2 — Outer Card Border

Strengthen the outer card border so the card lifts clearly off the cream page background.

Find:
```
<article className="bg-white rounded-2xl border border-gray-200 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 24px rgba(0,0,0,0.10)' }}>
```

Replace with:
```
<article className="bg-white rounded-2xl border border-gray-300 overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 6px 24px rgba(0,0,0,0.12)' }}>
```

---

## Change 3 — Data Section Tile Backgrounds

The stat tiles inside Price Intelligence, Market Snapshot, and any other data sections use a light background that is too close to white. Darken to a cool blue-gray that is psychologically calm and clearly readable.

Search the file for any of these background values used on stat tiles or data grid cells:
- `bg-gray-50`
- `bg-[#F8F9FB]`
- `bg-[#F9FAFB]`

Replace all instances with:
```
bg-[#F0F2F5]
```

This applies to all data tile backgrounds throughout the report — Price Intelligence tiles, Market Snapshot tiles, and any other stat grid cells. Do not change section header backgrounds or card backgrounds — only the individual stat tile cells.

---

## Acceptance Criteria

- [ ] Report header is visibly darker than the cream page background
- [ ] Header border-bottom is stronger — clearly separates header from white body
- [ ] Outer card border is stronger — card has clear definition against page background
- [ ] All data stat tiles use `#F0F2F5` cool blue-gray background
- [ ] White body section remains white — only tiles change
- [ ] No copy changes
- [ ] No logic changes
- [ ] tsc --noEmit passes clean

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach.*
