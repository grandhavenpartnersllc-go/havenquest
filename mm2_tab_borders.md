# Build Brief — MM2 Distinctive Tab Borders + Active Report Outline
**Date:** June 5, 2026
**For:** Claude Code
**Type:** Execute — styling update to MM2 tabbed reports
**Priority:** Medium
**Report back:** Confirm all changes complete, commit and push to main

---

## Overview

The MM2 tabbed city report interface needs more visual distinction.
Currently tabs may look too subtle. Update styling so:

1. All tabs have a visible outlined border — clearly readable as
   distinct clickable elements
2. The active tab has a gold border that connects seamlessly into
   the report container below — creating a unified focused panel effect

---

## Tab Styling Updates

**File:** `components/portal/milemarkers/MM2Discover.tsx`

Find the tab button elements in the tabbed report section.

### Default (inactive) tab:
```javascript
{
  border: '1.5px solid var(--color-border-secondary)',
  borderRadius: '8px 8px 0 0',
  background: 'var(--color-background-secondary)',
  padding: '10px 12px',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.15s'
}
```

Rank label (Top Pick / Runner-Up / Strong Alt):
- color: 'var(--color-text-tertiary)'
- fontSize: '10px', fontWeight: 500, textTransform: 'uppercase'

City name:
- color: 'var(--color-text-secondary)'
- fontSize: '13px', fontWeight: 600

### Active tab:
```javascript
{
  borderTop: '1.5px solid #B8912A',
  borderLeft: '1.5px solid #B8912A',
  borderRight: '1.5px solid #B8912A',
  borderBottom: 'none',  // connects to report container below
  borderRadius: '8px 8px 0 0',
  background: 'var(--color-background-primary)',
  padding: '10px 12px',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.15s'
}
```

Active rank label:
- color: '#B8912A'

Active city name:
- color: 'var(--color-text-primary)'

---

## Report Container Styling Update

Find the report content container div that wraps the FullReport
component. Update its border to connect with the active tab:

```javascript
{
  borderLeft: '1.5px solid #B8912A',
  borderRight: '1.5px solid #B8912A',
  borderBottom: '1.5px solid #B8912A',
  borderTop: 'none',  // connects seamlessly to active tab above
  borderRadius: '0 0 12px 12px',
  padding: '24px',
  background: 'var(--color-background-primary)'
}
```

---

## Visual Result

The active tab and report content form one connected panel:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Top Pick       │  │  Runner-Up      │  │  Strong Alt     │
│  Round Rock     │  │  San Marcos     │  │  Cedar Park     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
  (muted border)       (muted border)       (muted border)

When Top Pick is active:
╔═════════════════╗  ┌─────────────────┐  ┌─────────────────┐
║  Top Pick       ║  │  Runner-Up      │  │  Strong Alt     │
║  Round Rock     ║  │  San Marcos     │  │  Cedar Park     │
╚═════════════════    └─────────────────┘  └─────────────────┘
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║  Full Report content for Round Rock                         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

The gold border forms a U-shape around the active tab + report —
top and sides of the tab, then left, right, bottom of the report.
The borderBottom: none on the tab and borderTop: none on the report
creates the seamless connection.

---

## Acceptance Criteria

- [ ] All three tabs have visible outlined borders when inactive
- [ ] Active tab has gold border on top, left, right — no bottom border
- [ ] Report container has gold border on left, right, bottom — no top border
- [ ] Active tab and report appear as one connected focused panel
- [ ] City name and rank label color updates correctly on active state
- [ ] Switching tabs updates both the tab styling and report content
- [ ] No visual gap or overlap between active tab and report container
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add components/portal/milemarkers/MM2Discover.tsx
git commit -m "fix: MM2 tab distinctive borders, active tab connects to report with gold outline"
git push origin main
```

Confirm push — paste commit hash.
