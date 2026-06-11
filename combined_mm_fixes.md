# Build Brief — MM3 Live City Cards + MM1 Reorder + MM2 Enhancements + Image Fallback
**Date:** June 5, 2026
**For:** Claude Code
**Type:** Execute — four files, multiple changes
**Priority:** Medium-High
**Report back:** Confirm all changes complete, commit and push to main

---

## Change 1 — MM3 Replace Anchor Panel With Live City Cards
**File:** `components/portal/milemarkers/MM3Discover.tsx`

### Current state:
The "YOUR TOP MATCHES" anchor panel shows a simple text list
of city names, metro, and percentages.

### Replace with three city cards matching MM1/MM2 style:
Remove the text list and replace with three city cards that:
- Match the same card style used in MM1 and MM2 (consistent look)
- Update in real time as the user adjusts sandbox priorities/financials
- Show: city image, rank (#1/#2/#3), city name, metro, match score, affordability dot

### Card data source:
Use `displayedMatches` (already computed) — this is the live
sandbox result that updates in real time. So the cards start
showing MM2 saved matches and update as the user adjusts things.

```jsx
{/* Replace the current text list with this */}
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px',
  marginBottom: '12px'
}}>
  {displayedMatches.slice(0, 3).map((match, i) => (
    <div
      key={match.location.id}
      style={{
        borderRadius: '10px',
        border: selectedCityIndex === i
          ? '1.5px solid #B8912A'
          : '0.5px solid var(--color-border-tertiary)',
        background: 'var(--color-background-primary)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.15s'
      }}
      onClick={() => setSelectedCityIndex(i)}
    >
      {/* City image */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        background: 'var(--color-background-tertiary)'
      }}>
        <Image
          src={`/images/cities/${match.location.id}.jpg`}
          alt={`${match.location.name}, Texas`}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            if (!target.src.includes('default-tx')) {
              target.src = '/images/cities/default-tx.jpg'
            }
          }}
        />
      </div>
      {/* Card content */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <p style={{
              fontSize: '10px', fontWeight: 500, color: '#B8912A',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: '2px'
            }}>
              #{i + 1} Match
            </p>
            <p style={{
              fontSize: '14px', fontWeight: 600,
              color: 'var(--color-text-primary)', marginBottom: '1px'
            }}>
              {match.location.name}
            </p>
            <p style={{
              fontSize: '11px', color: 'var(--color-text-tertiary)'
            }}>
              {match.location.metroUsed}
            </p>
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-end', gap: '4px'
          }}>
            <span style={{
              fontSize: '18px', fontWeight: 700, color: '#B8912A'
            }}>
              {match.matchScore}%
            </span>
            {/* Affordability dot */}
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: /* use existing affordability color logic */
                'var(--color-text-tertiary)'
            }} />
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
```

Clicking a card sets selectedCityIndex to that card's index —
updating the financial panel to show that city's numbers.

Keep the label above: "YOUR TOP MATCHES" and the subtitle
"From your full assessment of all 101 Texas communities."
Keep the footer line: "Use the explorer below to dig deeper..."

### Remove:
The old text-list rendering of matches (name + metro + percentage in rows).

---

## Change 2 — MM1 Section Reorder + MM3 Tab Highlight
**File:** `components/portal/milemarkers/MM1Explore.tsx`

### Reorder sections:
Move "Your Navigator Journey" (mock portal) ABOVE "Your First Look"
(city matches). New order:
1. Personal Welcome
2. Navigator Journey (mock portal) ← moved up
3. Your First Look (city matches) ← moved down
4. What Makes This Different
5. Portal Ownership Statement
6. CTA

### MM3 tab visual distinction in mock portal:
Find the MM3 Discover tab in the MOCK_TABS array rendering.
Add a subtle visual indicator to distinguish it as "coming up next":

```jsx
// For the MM3 tab only (index 2), add a small gold dot above
// or a slightly warmer tab background:
{tab.id === 3 && (
  <div style={{
    position: 'absolute', top: '6px', right: '6px',
    width: '6px', height: '6px', borderRadius: '50%',
    background: '#B8912A'
  }} />
)}
```

Or alternatively add a small label: "Up next" in tiny gold text
below the tab label for MM3 only.

---

## Change 3 — MM2 Report Enhancements
**File:** `components/portal/milemarkers/MM2Discover.tsx`

### 3a — Budget Fit label + status next to city name
In the FullReport component rendered inside the active tab panel,
find where the city name and location display at the top of the report.

Add a "Budget Fit" indicator badge next to the city name:

```jsx
<div style={{ display: 'flex', alignItems: 'center',
  gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
  {/* City name block */}
  <div>
    <h1 style={{ fontSize: '22px', fontWeight: 700,
      color: 'var(--color-text-primary)' }}>
      {location.name}, TX
    </h1>
    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
      {location.metroUsed} · {location.county}
    </p>
  </div>

  {/* Budget Fit badge */}
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '6px 12px', borderRadius: '8px',
    border: '0.5px solid var(--color-border-tertiary)',
    background: 'var(--color-background-secondary)'
  }}>
    <p style={{
      fontSize: '9px', fontWeight: 600,
      color: 'var(--color-text-tertiary)',
      textTransform: 'uppercase', letterSpacing: '0.1em',
      marginBottom: '3px'
    }}>
      Budget Fit
    </p>
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <div style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: affordabilityColor
      }} />
      <span style={{ fontSize: '12px', fontWeight: 500,
        color: 'var(--color-text-primary)' }}>
        {affordabilityStatus}
      </span>
    </div>
  </div>
</div>
```

Use the same affordability calculation already in the codebase.
Pass affordabilityStatus and its color as props or compute inline.

### 3b — Download and Print buttons in tab report area
Above the FullReport component inside the active tab panel,
add action buttons in the upper right:

```jsx
<div style={{
  display: 'flex', justifyContent: 'flex-end',
  gap: '8px', marginBottom: '16px'
}}>
  <button
    onClick={() => window.print()}
    style={{
      padding: '6px 14px', fontSize: '12px', fontWeight: 500,
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: '6px', background: 'transparent',
      color: 'var(--color-text-secondary)', cursor: 'pointer'
    }}
  >
    Print
  </button>
  <button
    onClick={() => window.open(
      `/report/${matches[activeReportIndex]?.location.id}`,
      '_blank'
    )}
    style={{
      padding: '6px 14px', fontSize: '12px', fontWeight: 500,
      border: 'none', borderRadius: '6px',
      background: '#B8912A', color: '#fff', cursor: 'pointer'
    }}
  >
    Download ↓
  </button>
</div>
```

No Email button.

---

## Change 4 — City Image Fallback Fix
**Files:** `components/portal/SavedMatches.tsx`,
`components/results/CityMatchCard.tsx`,
`components/portal/milemarkers/MM1Explore.tsx`

### Fix the onError handler in all city image components:

```jsx
onError={(e) => {
  const target = e.target as HTMLImageElement
  if (!target.src.includes('default-tx')) {
    target.src = '/images/cities/default-tx.jpg'
  }
}}
```

The `!target.src.includes('default-tx')` guard prevents
an infinite error loop if the default image itself fails.

Also confirm `public/images/cities/default-tx.jpg` exists.
Run: `ls public/images/cities/default-tx.jpg`
If missing, copy any existing city image and name it default-tx.jpg.

---

## Acceptance Criteria

**MM3 city cards:**
- [ ] Three city cards replace the text list in anchor panel
- [ ] Cards show image, rank, city name, metro, score, affordability dot
- [ ] Cards update in real time as sandbox priorities/financials change
- [ ] Clicking a card updates the financial panel
- [ ] Consistent visual style with MM1 and MM2 cards

**MM1 reorder:**
- [ ] Navigator Journey appears before city matches
- [ ] MM3 tab has subtle gold visual indicator
- [ ] All content and functionality unchanged

**MM2 report:**
- [ ] "Budget Fit" label and status badge next to city name
- [ ] Print and Download buttons in upper right of tab panel
- [ ] No Email button

**Image fallback:**
- [ ] default-tx.jpg exists and is committed
- [ ] onError fires correctly with infinite-loop guard
- [ ] Default image shows for cities without dedicated image

**All:**
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add components/portal/milemarkers/MM3Discover.tsx
git add components/portal/milemarkers/MM1Explore.tsx
git add components/portal/milemarkers/MM2Discover.tsx
git add components/portal/SavedMatches.tsx
git add components/results/CityMatchCard.tsx
git add public/images/cities/default-tx.jpg
git commit -m "feat: MM3 live city cards, MM1 reorder, MM2 budget fit and report actions, image fallback fix"
git push origin main
```

Confirm push — paste commit hash.
