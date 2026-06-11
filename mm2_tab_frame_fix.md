# Fix Brief — MM2 Tab Border Complete Frame
**Date:** June 5, 2026
**For:** Claude Code
**Type:** Execute — border logic update on MM2 tabbed reports
**Priority:** Medium
**Report back:** Confirm fix complete, commit and push to main

---

## Overview

The MM2 tab borders need to form a complete connected frame
at all times. When any tab is active, the full perimeter of
the tab row + report container should be outlined in gold.

The active tab gets gold on top, left, right (no bottom —
connects to report). Inactive tabs get a gold bottom border
only — completing the line across the bottom of the tab row
on either side of the active tab. The report container has
gold on left, right, bottom (no top — connects to active tab).

---

## The Logic

For each tab at index i, where activeReportIndex is the active tab:

```
Active tab (i === activeReportIndex):
  borderTop: '1.5px solid #B8912A'
  borderLeft: '1.5px solid #B8912A'
  borderRight: '1.5px solid #B8912A'
  borderBottom: 'none'

Inactive tab (i !== activeReportIndex):
  borderTop: '1.5px solid var(--color-border-secondary)'
  borderLeft: '1.5px solid var(--color-border-secondary)'  
  borderRight: '1.5px solid var(--color-border-secondary)'
  borderBottom: '1.5px solid #B8912A'  ← gold bottom completes the frame
```

Report container (always):
```
  borderLeft: '1.5px solid #B8912A'
  borderRight: '1.5px solid #B8912A'
  borderBottom: '1.5px solid #B8912A'
  borderTop: 'none'
```

---

## Visual Result

When Top Pick (index 0) is active:
```
╔═══════════════════╗  ┌───────────────────┐  ┌───────────────────┐
║  TOP PICK         ║  │  RUNNER-UP        │  │  STRONG ALT       │
║  Corpus Christi   ║  │  Denton           │  │  Plano            │
╚═══════════════════    ════════════════════   ════════════════════╝
╔══════════════════════════════════════════════════════════════════╗
║  Full report content                                             ║
╚══════════════════════════════════════════════════════════════════╝
```

When Runner-Up (index 1) is active:
```
┌───────────────────┐  ╔═══════════════════╗  ┌───────────────────┐
│  TOP PICK         │  ║  RUNNER-UP        ║  │  STRONG ALT       │
│  Corpus Christi   │  ║  Denton           ║  │  Plano            │
════════════════════╝  ╚═══════════════════    ════════════════════╝
╔══════════════════════════════════════════════════════════════════╗
║  Full report content                                             ║
╚══════════════════════════════════════════════════════════════════╝
```

When Strong Alt (index 2) is active:
```
┌───────────────────┐  ┌───────────────────┐  ╔═══════════════════╗
│  TOP PICK         │  │  RUNNER-UP        │  ║  STRONG ALT       ║
│  Corpus Christi   │  │  Denton           │  ║  Plano            ║
════════════════════╝  ════════════════════╝  ╚═══════════════════
╔══════════════════════════════════════════════════════════════════╗
║  Full report content                                             ║
╚══════════════════════════════════════════════════════════════════╝
```

The gold border forms a complete unbroken perimeter in all cases.

---

## Implementation

**File:** `components/portal/milemarkers/MM2Discover.tsx`

Find the tab button map. Update the style object to use
conditional logic per tab:

```javascript
const isActive = activeReportIndex === i

// Tab border style:
const tabBorderStyle = isActive ? {
  borderTop: '1.5px solid #B8912A',
  borderLeft: '1.5px solid #B8912A',
  borderRight: '1.5px solid #B8912A',
  borderBottom: 'none',
} : {
  borderTop: '1.5px solid var(--color-border-secondary)',
  borderLeft: '1.5px solid var(--color-border-secondary)',
  borderRight: '1.5px solid var(--color-border-secondary)',
  borderBottom: '1.5px solid #B8912A',
}
```

The report container border stays:
```javascript
{
  borderLeft: '1.5px solid #B8912A',
  borderRight: '1.5px solid #B8912A',
  borderBottom: '1.5px solid #B8912A',
  borderTop: 'none',
  borderRadius: '0 0 12px 12px',
}
```

---

## Gap Between Tabs

If there is a gap between tabs in the grid, the gold bottom
border on inactive tabs may not visually connect cleanly.
Check the gap value between tabs. If gap > 0, consider
reducing to gap: '2px' or '0' between the tab columns
so the borders connect seamlessly. The visual separation
between tabs can come from the left/right borders meeting
rather than a gap.

---

## Acceptance Criteria

- [ ] Top Pick active: gold border wraps top/left/right of tab,
      Runner-Up and Strong Alt have gold bottom border
- [ ] Runner-Up active: gold border wraps its top/left/right,
      Top Pick and Strong Alt have gold bottom border
- [ ] Strong Alt active: gold border wraps its top/left/right,
      Top Pick and Runner-Up have gold bottom border
- [ ] Report container always has gold left/right/bottom border
- [ ] Complete unbroken gold perimeter visible in all three states
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add components/portal/milemarkers/MM2Discover.tsx
git commit -m "fix: MM2 tab borders form complete gold frame around active tab and report"
git push origin main
```

Confirm push — paste commit hash.
