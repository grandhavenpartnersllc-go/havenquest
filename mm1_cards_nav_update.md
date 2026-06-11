# Build Brief — MM1 City Cards + Navigator Journey Enhancement
**Date:** June 5, 2026
**For:** Claude Code
**Type:** Execute — layout and copy updates to MM1Explore.tsx
**Priority:** Medium-High — first portal experience
**Report back:** Confirm all changes complete, commit and push to main

---

## Overview

Two updates to MM1:
1. Replace the current city match display with a consistent
   three-card grid matching MM2's layout — but softer, no hierarchy
2. Enhance the Navigator Journey section with more emphasis,
   clear instructions, and onboarding framing

---

## Change 1 — City Match Cards (Soft Three-Card Grid)

### Replace current layout:
Find the "YOUR FIRST LOOK" section in MM1Explore.tsx.
Currently shows a large single full-width image card.
Replace with a three-card grid matching MM2's SavedMatches
card layout — but with softer styling (no dark TOP PICK card).

### New card grid:
```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '12px',
  marginBottom: '16px'
}}>
  {matches.slice(0, 3).map((match, i) => {
    const labels = ['#1 Match', '#2 Match', '#3 Match']
    return (
      <div
        key={match.location.id}
        style={{
          borderRadius: '12px',
          border: '0.5px solid var(--color-border-tertiary)',
          background: 'var(--color-background-primary)',
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}
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
              e.currentTarget.src = '/images/cities/default-tx.jpg'
            }}
          />
        </div>

        {/* Card content */}
        <div style={{ padding: '12px 14px' }}>
          <p style={{
            fontSize: '10px', fontWeight: 500,
            color: '#B8912A', textTransform: 'uppercase',
            letterSpacing: '0.1em', marginBottom: '4px'
          }}>
            {labels[i]}
          </p>
          <p style={{
            fontSize: '15px', fontWeight: 600,
            color: 'var(--color-text-primary)', marginBottom: '2px'
          }}>
            {match.location.name}
          </p>
          <p style={{
            fontSize: '12px',
            color: 'var(--color-text-tertiary)',
            marginBottom: '8px'
          }}>
            {match.location.metroUsed}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{
              fontSize: '12px',
              color: 'var(--color-text-tertiary)'
            }}>
              Match score
            </span>
            <span style={{
              fontSize: '18px', fontWeight: 700,
              color: '#B8912A'
            }}>
              {match.matchScore}%
            </span>
          </div>
        </div>
      </div>
    )
  })}
</div>
```

### Important — no links or report access:
- No "Full report" button
- No "Learn more" link
- No "View full report" link
- No compare functionality
- Cards are display only — informational, not interactive
  (except the city image which can have a subtle hover effect
  if desired but no click action)

### Mobile:
On mobile (screen width < 640px), stack cards to single column.
Use responsive grid: `gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'`

---

## Change 2 — Navigator Journey Section Enhancement

Find the "YOUR NAVIGATOR JOURNEY" section heading and the
intro text above the mock portal tab tour.

### Update the section header:
Make it more prominent — larger text, more visual weight.

```jsx
<div style={{ marginBottom: '20px' }}>
  <p style={{
    fontSize: '11px', fontWeight: 600, color: '#B8912A',
    letterSpacing: '0.14em', textTransform: 'uppercase',
    marginBottom: '8px'
  }}>
    Your Navigator Journey
  </p>
  <h2 style={{
    fontSize: '22px', fontWeight: 700,
    color: 'var(--color-text-primary)', marginBottom: '12px',
    lineHeight: 1.3
  }}>
    This portal is where you'll live throughout the entire process.
  </h2>
  <p style={{
    fontSize: '14px', color: 'var(--color-text-secondary)',
    lineHeight: 1.7, marginBottom: '8px'
  }}>
    From your first city matches all the way to closing day —
    everything happens here. Your progress is saved, your Market
    Director works from this portal, and every step of your
    relocation is tracked in one place.
  </p>
  <p style={{
    fontSize: '14px', color: 'var(--color-text-secondary)',
    lineHeight: 1.7, marginBottom: '4px'
  }}>
    Your journey unfolds across 10 MileMarkers. Each one has a
    purpose, a set of actions, and a guide.
  </p>
  <p style={{
    fontSize: '13px', fontWeight: 500,
    color: '#B8912A', marginBottom: '16px'
  }}>
    Click any stage below to see what's included and who's
    with you at each step. →
  </p>
</div>
```

### Keep the mock portal tab tour unchanged below this intro.

---

## Change 3 — Portal Ownership Statement

At the very bottom of MM1, above the "Ready to begin" CTA,
add a short closing statement that reinforces the portal
as their home:

```jsx
<div style={{
  background: 'rgba(184,145,42,0.05)',
  borderRadius: '10px',
  padding: '16px 20px',
  marginBottom: '24px',
  borderLeft: '3px solid #B8912A'
}}>
  <p style={{
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.7
  }}>
    <strong style={{ color: 'var(--color-text-primary)' }}>
      This is your space.
    </strong>
    {' '}Come back anytime. Your matches, your financial picture,
    your progress — it's all here waiting for you. And when your
    Market Director joins you at MileMarker 4, they'll be working
    from this same portal, seeing exactly what you see.
  </p>
</div>
```

---

## Acceptance Criteria

- [ ] Three city cards render in a soft equal-height grid
- [ ] Cards show city image, rank label (#1/#2/#3 Match), city name,
      metro, and match score
- [ ] No links, no report access, no compare buttons on MM1 cards
- [ ] Cards use default-tx.jpg fallback for missing images
- [ ] Mobile — cards stack to single column
- [ ] Navigator Journey section has larger headline
- [ ] New intro copy explains portal as home base
- [ ] "Click any stage below" instruction renders in gold
- [ ] Portal ownership statement renders above CTA
- [ ] Mock portal tab tour still works correctly
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add components/portal/milemarkers/MM1Explore.tsx
git commit -m "feat: MM1 soft city card grid, navigator journey enhancement, portal ownership statement"
git push origin main
```

Confirm push — paste commit hash.
