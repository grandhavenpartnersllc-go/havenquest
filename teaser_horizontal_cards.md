# Build Brief — Teaser Results Page Horizontal City Cards
**Date:** June 5, 2026
**For:** Claude Code
**Type:** Execute — layout change to teaser results page
**Priority:** Medium-High — conversion page
**Report back:** Confirm all changes complete, commit and push to main

---

## Overview

The teaser results page (`app/results/[sessionId]/page.tsx`)
currently shows city cards stacked vertically requiring scrolling.
Replace with a horizontal three-card layout where the top pick
is fully visible and the runner-up and strong alt are blurred/locked
to create intrigue and drive account creation.

---

## New Layout

### Three cards side by side (horizontal grid):

**Card 1 — Top Pick:** Fully visible
- City image (top)
- "#1 Top Pick" label in gold
- City name, metro, county
- Match score %
- Est. monthly cost all-in
- Affordability dot + status

**Card 2 — Runner-Up:** Blurred / locked
- Same card structure underneath
- Blur overlay: `filter: blur(4px)` on card content
- Dark semi-transparent overlay on top
- Lock icon centered on overlay
- Text: "Unlock your full results"

**Card 3 — Strong Alt:** Blurred / locked
- Same treatment as Card 2

### Card grid:
```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '16px',
  marginBottom: '32px',
  maxWidth: '900px',
  margin: '0 auto 32px auto'
}}>
  {matches.slice(0, 3).map((match, i) => {
    const isLocked = i > 0
    const labels = ['#1 Top Pick', '#2 Runner-Up', '#3 Strong Alt']

    return (
      <div
        key={match.location.id}
        style={{
          borderRadius: '12px',
          border: i === 0
            ? '1.5px solid #B8912A'
            : '0.5px solid var(--color-border-tertiary)',
          background: 'var(--color-background-primary)',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: i === 0
            ? '0 4px 20px rgba(184,145,42,0.15)'
            : '0 1px 4px rgba(0,0,0,0.06)'
        }}
      >
        {/* City image */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          background: 'var(--color-background-tertiary)',
          filter: isLocked ? 'blur(3px)' : 'none'
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
        <div style={{
          padding: '14px 16px',
          filter: isLocked ? 'blur(3px)' : 'none'
        }}>
          <p style={{
            fontSize: '10px', fontWeight: 600, color: '#B8912A',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            marginBottom: '4px'
          }}>
            {labels[i]}
          </p>
          <p style={{
            fontSize: '17px', fontWeight: 700,
            color: 'var(--color-text-primary)', marginBottom: '2px'
          }}>
            {match.location.name}
          </p>
          <p style={{
            fontSize: '12px', color: 'var(--color-text-secondary)',
            marginBottom: '10px'
          }}>
            {match.location.metroUsed}
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: '22px', fontWeight: 700, color: '#B8912A'
            }}>
              {match.matchScore}%
            </span>
            <span style={{
              fontSize: '11px', color: 'var(--color-text-tertiary)'
            }}>
              match
            </span>
          </div>
        </div>

        {/* Lock overlay for cards 2 and 3 */}
        {isLocked && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(var(--color-background-primary-rgb, 253,252,250), 0.75)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backdropFilter: 'blur(2px)'
          }}>
            <div style={{
              width: '36px', height: '36px',
              borderRadius: '50%',
              background: 'rgba(184,145,42,0.12)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Lock icon — use Lucide Lock */}
              <Lock size={18} style={{ color: '#B8912A' }} />
            </div>
            <p style={{
              fontSize: '12px', fontWeight: 500,
              color: 'var(--color-text-primary)',
              textAlign: 'center', maxWidth: '120px',
              lineHeight: 1.4
            }}>
              Create your free portal to unlock
            </p>
          </div>
        )}
      </div>
    )
  })}
</div>
```

Import `Lock` from `lucide-react` at the top of the file.

---

## Email Gate Position

The email gate / account creation CTA should appear
immediately below the three cards — no scrolling required.

If the email gate is a separate component (`<EmailGate />`
or similar), ensure it renders directly below the card grid
with no large gaps.

If there is currently a lot of vertical space or other content
between the cards and the email gate, reduce or remove it so
the progression is: cards → CTA → account creation — all
visible without scrolling on a standard desktop viewport.

---

## Remove

- The old vertical stacked card layout
- Any large spacer or section between the cards and the email gate

## Keep

- The "Your first look at Texas." headline and subtext
- The italic teaser note above the cards (already added)
- The email gate component and all its functionality
- The 3-city limit (.slice(0, 3))

---

## Mobile

On mobile (< 640px), stack cards to single column.
Locked cards still show the blur + lock overlay.
Use: `gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'`

---

## Acceptance Criteria

- [ ] Three cards display horizontally side by side on desktop
- [ ] Card 1 (Top Pick) fully visible with gold border and shadow
- [ ] Cards 2 and 3 have blur filter on image and content
- [ ] Lock overlay with Lock icon and "Create your free portal to unlock" text
- [ ] Email gate appears immediately below cards — no scrolling needed
- [ ] City images show with default-tx.jpg fallback
- [ ] Mobile — cards stack to single column
- [ ] Locked cards still show city name/info blurred (not hidden entirely)
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add "app/results/[sessionId]/page.tsx"
git commit -m "feat: teaser results page horizontal cards with blur lock on runner-up and strong alt"
git push origin main
```

Confirm push — paste commit hash.
