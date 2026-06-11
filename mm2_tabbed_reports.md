# Build Brief — MM2 Tabbed City Reports
**Date:** June 5, 2026
**For:** Claude Code
**Type:** Execute — replace stacked reports with tabbed interface
**Priority:** Medium-High — major UX improvement
**Report back:** Confirm all changes complete, commit and push to main

---

## Overview

MM2 currently stacks all three full city reports vertically below
the city match cards — requiring the user to scroll extensively
to see all three reports. Replace this with a tabbed interface
where the three city names are tabs perfectly aligned below the
three city cards. Clicking a tab reveals that city's full report
in a single content area below.

---

## Current Structure to Replace

Find in `components/portal/milemarkers/MM2Discover.tsx`:
The section that maps over matches and renders a `<FullReport>`
or equivalent component for each city:

```jsx
{profile && matches.slice(0, 3).map((match, i) => (
  <section key={match.location.id} id={`report-${match.location.id}`}>
    ...FullReport...
  </section>
))}
```

Remove this stacked rendering entirely. Replace with the
tabbed interface described below.

---

## New Structure — Tabbed Reports

### New state variable:
```javascript
const [activeReportIndex, setActiveReportIndex] = useState(0)
// 0 = Top Pick, 1 = Runner-Up, 2 = Strong Alt
```

### Tab Bar:
A three-tab row that sits immediately below the city match cards,
perfectly aligned with them. Each tab corresponds to one city.

**Layout:** 3-column grid matching the city cards above.
Each tab column is the same width as the card above it.

```jsx
{matches.length > 0 && (
  <div style={{ marginTop: '8px', marginBottom: '0' }}>

    {/* Tab row — 3 columns matching card grid */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',  // match the gap used in the city cards grid
    }}>
      {matches.slice(0, 3).map((match, i) => {
        const isActive = activeReportIndex === i
        return (
          <button
            key={match.location.id}
            onClick={() => setActiveReportIndex(i)}
            style={{
              padding: '10px 12px',
              borderRadius: '8px 8px 0 0',
              border: '0.5px solid var(--color-border-tertiary)',
              borderBottom: isActive
                ? '2px solid #B8912A'
                : '0.5px solid var(--color-border-tertiary)',
              background: isActive
                ? 'var(--color-background-primary)'
                : 'var(--color-background-secondary)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s'
            }}
          >
            <p style={{
              fontSize: '10px', fontWeight: 500,
              color: isActive ? '#B8912A' : 'var(--color-text-tertiary)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: '2px'
            }}>
              {['Top Pick', 'Runner-Up', 'Strong Alt'][i]}
            </p>
            <p style={{
              fontSize: '13px', fontWeight: 600,
              color: isActive
                ? 'var(--color-text-primary)'
                : 'var(--color-text-secondary)'
            }}>
              {match.location.name}
            </p>
          </button>
        )
      })}
    </div>

    {/* Report content area */}
    <div style={{
      border: '0.5px solid var(--color-border-tertiary)',
      borderTop: 'none',
      borderRadius: '0 0 12px 12px',
      padding: '24px',
      background: 'var(--color-background-primary)'
    }}>
      {matches[activeReportIndex] && profile && (
        <FullReport
          location={matches[activeReportIndex].location}
          profile={profile}
          session={session}
          matchScore={matches[activeReportIndex].matchScore}
        />
      )}
    </div>

  </div>
)}
```

---

## Alignment Note

The tab grid must use the same column count and gap as the
city match cards grid above it. Check what grid styling the
city cards use and match it exactly so tabs align perfectly
below their corresponding cards.

If the city cards use `sm:grid-cols-3` with Tailwind, use the
same approach for the tab row, or use inline CSS grid with
matching column widths.

On mobile (single column), tabs should stack vertically and
full width, with the active tab highlighted.

---

## Remove

- All `<section id="report-...">` stacked report blocks
- The `{profile && matches.slice(0, 3).map(...FullReport...)}` render
- Any "Full report" anchor links that scroll to the stacked sections
  (since the sections no longer exist)

---

## Keep

- The city match cards at the top (TOP PICK / RUNNER-UP / STRONG ALT)
- All other MM2 content above the reports
- The FullReport component itself — just rendering it differently
- The `id` on the tab content area can be `id="report-section"` if
  any external links reference it

---

## Acceptance Criteria

- [ ] Three tabs render immediately below the three city cards
- [ ] Tab labels show city name and rank (Top Pick / Runner-Up / Strong Alt)
- [ ] Active tab highlighted with gold bottom border and text
- [ ] Clicking a tab switches the report content below
- [ ] Top Pick tab (index 0) active by default on load
- [ ] Report content renders correctly for all three cities
- [ ] No more stacked reports requiring excessive scrolling
- [ ] Tabs and cards are visually aligned on desktop
- [ ] Mobile — tabs stack or scroll appropriately
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add components/portal/milemarkers/MM2Discover.tsx
git commit -m "feat: MM2 tabbed city reports — replace stacked scroll with aligned tab interface"
git push origin main
```

Confirm push — paste commit hash.
