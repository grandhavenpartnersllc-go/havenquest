# Build Brief — MM3 Worksheet Orientation Banner
**Date:** June 4, 2026
**For:** Claude Code
**Type:** Execute — add dismissible orientation banner to MM3
**Priority:** Medium
**Report back:** Confirm all changes complete, commit and push to main

---

## Overview

Add a dismissible orientation banner at the very top of MM3
(above everything else including the financial picture and
rankings panels). The banner explains that MM3 is the client's
worksheet and sets expectations before they start interacting.
It dismisses with a "Got it ✓" button and stays dismissed
for the session via sessionStorage.

---

## Implementation

**File:** `components/portal/milemarkers/MM3Discover.tsx`

### New state variable:
```javascript
const [worksheetDismissed, setWorksheetDismissed] = useState(false)
```

### On mount — check sessionStorage:
Inside the component's useEffect (or a dedicated useEffect),
check if the user has already dismissed the banner this session:

```javascript
useEffect(() => {
  if (sessionStorage.getItem('mm3_worksheet_dismissed') === 'true') {
    setWorksheetDismissed(true)
  }
}, [])
```

### Banner JSX:
Render at the very top of the MM3 content area, before the
financial picture / rankings split layout. Only render when
worksheetDismissed === false:

```jsx
{!worksheetDismissed && (
  <div style={{
    borderLeft: '4px solid #B8912A',
    background: 'rgba(184,145,42,0.06)',
    borderRadius: '0 8px 8px 0',
    padding: '16px 20px',
    marginBottom: '24px',
    position: 'relative'
  }}>
    <p style={{
      fontSize: '10px',
      fontWeight: 600,
      color: '#B8912A',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      marginBottom: '8px'
    }}>
      Your Discover Worksheet
    </p>
    <p style={{
      fontSize: '13px',
      color: 'var(--color-text-primary)',
      fontWeight: 500,
      marginBottom: '8px',
      lineHeight: 1.5
    }}>
      This is one of the most important steps in your Navigator journey.
    </p>
    <p style={{
      fontSize: '13px',
      color: 'var(--color-text-secondary)',
      lineHeight: 1.6,
      marginBottom: '8px'
    }}>
      Before your Market Director can guide you effectively, they need
      a clear picture of two things: where you want to be, and what you
      can realistically spend. This worksheet helps you define both.
    </p>
    <p style={{
      fontSize: '13px',
      color: 'var(--color-text-secondary)',
      lineHeight: 1.6
    }}>
      Take your time. Adjust your priorities. Refine your financial
      picture. Explore the cities that match your life. When you're
      ready — lock your financials, choose your top communities, and
      commit your direction. Your Market Director receives everything
      you complete here before your first conversation.
    </p>
    <button
      onClick={() => {
        setWorksheetDismissed(true)
        sessionStorage.setItem('mm3_worksheet_dismissed', 'true')
      }}
      style={{
        position: 'absolute',
        top: '12px',
        right: '16px',
        background: 'transparent',
        border: 'none',
        fontSize: '12px',
        color: '#B8912A',
        cursor: 'pointer',
        fontWeight: 500,
        padding: '4px 8px',
        borderRadius: '4px'
      }}
    >
      Got it ✓
    </button>
  </div>
)}
```

---

## Behavior

- Banner appears at top of MM3 on first load
- "Got it ✓" button in top right corner of banner
- Clicking "Got it ✓" collapses the banner immediately
- Collapsed state persists for the session via sessionStorage
- If user navigates away and returns to MM3 in the same session,
  banner stays collapsed
- On a fresh session (new login), banner reappears

---

## Acceptance Criteria

- [ ] Banner renders at top of MM3 above all other content
- [ ] Gold left border and warm gold-tinted background
- [ ] "YOUR DISCOVER WORKSHEET" label in gold uppercase
- [ ] All four copy blocks render correctly
- [ ] "Got it ✓" button positioned top right of banner
- [ ] Clicking "Got it ✓" dismisses banner immediately
- [ ] sessionStorage key 'mm3_worksheet_dismissed' set on dismiss
- [ ] Banner stays dismissed within the same session
- [ ] Banner reappears on fresh session
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add components/portal/milemarkers/MM3Discover.tsx
git commit -m "feat: MM3 worksheet orientation banner with Got it dismiss"
git push origin main
```

Confirm push — paste commit hash.
