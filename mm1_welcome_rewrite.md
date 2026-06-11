# Build Brief — MM1 Welcome Experience Rewrite
**Date:** June 5, 2026
**For:** Claude Code
**Type:** Execute — full rewrite of MM1Explore.tsx
**Priority:** High — first impression of the portal
**Report back:** Confirm all changes complete, commit and push to main

---

## Overview

MM1 is being rewritten from a simple tab tour into a full welcome
and orientation experience. It has five sections:

1. Personal welcome with first name
2. City teaser — preliminary top 3 matches with context
3. Navigator journey — mock portal tab tour (already built, keep it)
4. What makes this different — three differentiators
5. Ready to begin CTA

The tone throughout is warm, personal, and human. This is the
moment the client crosses from quiz taker to Navigator client.
Treat it accordingly.

---

## Section 1 — Personal Welcome

At the very top of MM1, before anything else:

Read first name from session prop or localStorage:
```javascript
const firstName = session?.firstName || 'there'
```

```jsx
<div style={{ marginBottom: '2rem' }}>
  <p style={{
    fontSize: '11px', fontWeight: 600, color: '#B8912A',
    letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px'
  }}>
    Welcome to Your Navigator
  </p>
  <h1 style={{
    fontSize: '28px', fontWeight: 700,
    color: 'var(--color-text-primary)', marginBottom: '16px', lineHeight: 1.3
  }}>
    Welcome{firstName !== 'there' ? `, ${firstName}` : ''}. Your Texas journey starts here.
  </h1>
  <p style={{
    fontSize: '15px', color: 'var(--color-text-secondary)',
    lineHeight: 1.7, maxWidth: '600px', marginBottom: '12px'
  }}>
    This is your private HavenQuest Navigator — your home base for
    the entire relocation journey. Everything you do here is saved
    and waiting for you when you come back.
  </p>
  <p style={{
    fontSize: '15px', color: 'var(--color-text-secondary)',
    lineHeight: 1.7, maxWidth: '600px'
  }}>
    You've taken the first step. Now let us show you what's ahead —
    and give you a first look at where your life fits in Texas.
  </p>
</div>
```

---

## Section 2 — City Teaser

After the welcome, show the client's top 3 city matches as a
preview. Use the existing matches prop already passed into MM1.

```jsx
<div style={{
  background: 'var(--color-background-secondary)',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '2rem',
  border: '0.5px solid var(--color-border-tertiary)'
}}>
  {/* Header */}
  <p style={{
    fontSize: '11px', fontWeight: 600, color: '#B8912A',
    letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '4px'
  }}>
    Your First Look
  </p>
  <h2 style={{
    fontSize: '18px', fontWeight: 600,
    color: 'var(--color-text-primary)', marginBottom: '6px'
  }}>
    Your preliminary Texas matches
  </h2>
  <p style={{
    fontSize: '13px', color: 'var(--color-text-secondary)',
    lineHeight: 1.6, marginBottom: '16px'
  }}>
    Based on what you told us, here's where your life fits in Texas
    right now. These are your first impressions — what the data is
    telling us at this stage.
  </p>

  {/* City cards — reuse existing StoryCityCard or simplified version */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
    {matches.slice(0, 3).map((match, i) => {
      const labels = ['Top Pick', 'Runner-Up', 'Strong Alt']
      return (
        <div key={match.location.id} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 14px',
          background: i === 0 ? '#16120D' : 'var(--color-background-primary)',
          borderRadius: '8px',
          border: '0.5px solid var(--color-border-tertiary)'
        }}>
          <div>
            <p style={{
              fontSize: '10px', fontWeight: 500,
              color: i === 0 ? '#B8912A' : 'var(--color-text-tertiary)',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px'
            }}>
              {labels[i]}
            </p>
            <p style={{
              fontSize: '15px', fontWeight: 600,
              color: i === 0 ? '#E8E2D9' : 'var(--color-text-primary)'
            }}>
              {match.location.name}
            </p>
            <p style={{
              fontSize: '12px',
              color: i === 0 ? 'rgba(232,226,217,0.5)' : 'var(--color-text-tertiary)'
            }}>
              {match.location.metroUsed}
            </p>
          </div>
          <div style={{
            fontSize: '20px', fontWeight: 700,
            color: i === 0 ? '#B8912A' : 'var(--color-text-secondary)'
          }}>
            {match.matchScore}%
          </div>
        </div>
      )
    })}
  </div>

  {/* Forward-looking note */}
  <div style={{
    borderLeft: '3px solid #B8912A',
    paddingLeft: '12px',
    background: 'rgba(184,145,42,0.04)',
    borderRadius: '0 6px 6px 0',
    padding: '10px 12px'
  }}>
    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
      <strong style={{ color: 'var(--color-text-primary)' }}>These are your starting point — not your final answer.</strong>
      {' '}In MileMarker 3 — Discover — you'll dial these in. Adjust your
      priorities, refine your financial picture, and choose the communities
      you want to explore with your Market Director. What you see here
      is just the beginning.
    </p>
  </div>
</div>
```

---

## Section 3 — Navigator Journey (Mock Portal)

Keep the existing mock portal tab tour exactly as built.
Just ensure it comes after Sections 1 and 2.

Add a brief intro above the mock portal:
```jsx
<div style={{ marginBottom: '1rem' }}>
  <p style={{
    fontSize: '11px', fontWeight: 600, color: '#B8912A',
    letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px'
  }}>
    Your Navigator Journey
  </p>
  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
    Your journey unfolds across 10 MileMarkers — from your first city
    matches all the way to closing day. Click each stage below to
    explore what's ahead and who's with you at each step.
  </p>
</div>
```

Then render the existing mock portal component/JSX.

---

## Section 4 — What Makes This Different

Three differentiator cards below the mock portal:

```jsx
<div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
  <p style={{
    fontSize: '11px', fontWeight: 600, color: '#B8912A',
    letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px'
  }}>
    What Makes HavenQuest Different
  </p>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>

    {/* Card 1 */}
    <div style={{
      padding: '16px', borderRadius: '10px',
      border: '0.5px solid var(--color-border-tertiary)',
      background: 'var(--color-background-primary)'
    }}>
      <p style={{ fontSize: '14px', fontWeight: 600,
        color: 'var(--color-text-primary)', marginBottom: '6px' }}>
        Your data is yours
      </p>
      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
        Everything you share stays private and powers your personal
        experience. Nothing is sold. Nothing is shared without your consent.
      </p>
    </div>

    {/* Card 2 */}
    <div style={{
      padding: '16px', borderRadius: '10px',
      border: '0.5px solid var(--color-border-tertiary)',
      background: 'var(--color-background-primary)'
    }}>
      <p style={{ fontSize: '14px', fontWeight: 600,
        color: 'var(--color-text-primary)', marginBottom: '6px' }}>
        A real person joins you
      </p>
      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
        At MileMarker 4, your personal Market Director steps in. They've
        already read your profile and are ready to guide you the rest
        of the way.
      </p>
    </div>

    {/* Card 3 */}
    <div style={{
      padding: '16px', borderRadius: '10px',
      border: '0.5px solid var(--color-border-tertiary)',
      background: 'var(--color-background-primary)'
    }}>
      <p style={{ fontSize: '14px', fontWeight: 600,
        color: 'var(--color-text-primary)', marginBottom: '6px' }}>
        Nothing falls through the cracks
      </p>
      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
        Your Navigator tracks every step — from community discovery to
        closing day. You always know where you are, what's done, and
        what's next.
      </p>
    </div>

  </div>
</div>
```

---

## Section 5 — Ready to Begin CTA

Keep the existing advance button that moves to MM2.
Update the copy around it:

```jsx
<div style={{
  textAlign: 'center',
  padding: '2rem 0',
  borderTop: '0.5px solid var(--color-border-tertiary)',
  marginTop: '1rem'
}}>
  <p style={{
    fontSize: '15px', fontWeight: 500,
    color: 'var(--color-text-primary)', marginBottom: '6px'
  }}>
    Ready to explore your matches in depth?
  </p>
  <p style={{
    fontSize: '13px', color: 'var(--color-text-secondary)',
    marginBottom: '20px'
  }}>
    MileMarker 2 is where your full city reports and affordability
    breakdown are waiting.
  </p>
  {/* Existing advance button renders here — keep unchanged */}
</div>
```

---

## What to Keep Unchanged

- The existing mock portal tab component and all its logic
- The existing advance button and its Supabase write
- The matches prop passing from StarterPortal
- Session prop for firstName

## What to Remove

- The old stacked MileMarker list (if still present)
- Any placeholder text that was there before the mock portal

---

## Acceptance Criteria

- [ ] Section 1: Personal welcome with first name renders correctly
- [ ] Section 1: Falls back gracefully if no first name
- [ ] Section 2: Top 3 city cards show with Top Pick / Runner-Up / Strong Alt labels
- [ ] Section 2: Match scores visible
- [ ] Section 2: Forward-looking note with gold left border renders
- [ ] Section 3: Mock portal tab tour present with intro copy above it
- [ ] Section 4: Three differentiator cards render in grid
- [ ] Section 5: Advance CTA with updated surrounding copy
- [ ] Full page scrolls correctly on mobile
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add components/portal/milemarkers/MM1Explore.tsx
git commit -m "feat: MM1 full welcome experience — personal greeting, city teaser, differentiators"
git push origin main
```

Confirm push — paste commit hash.
