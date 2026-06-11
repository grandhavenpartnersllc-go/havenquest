# Build Brief — Wire City Images Into City Cards
**Date:** June 5, 2026
**For:** Claude Code
**Type:** Execute — add city images to existing city card components
**Priority:** Medium
**Report back:** Confirm all changes complete, commit and push to main

---

## Overview

29 city images are now available at `/public/images/cities/[city-id].jpg`.
Wire these images into every city card component that currently shows
a placeholder, gray box, or no image. Add a fallback for cities that
don't have an image yet.

---

## Step 1 — Check for Placeholder Image

Check if `/public/images/cities/placeholder.jpg` exists.

If it does not exist, copy any one of the existing city images
and save it as `placeholder.jpg` in the same folder. This serves
as the fallback for cities without a dedicated image.

---

## Step 2 — Find All City Card Components With Image Placeholders

Check these files for city image placeholder areas:

1. `components/portal/milemarkers/MM1Explore.tsx`
2. `components/portal/SavedMatches.tsx`
3. `components/portal/milemarkers/MM2Discover.tsx`
4. `app/results/[sessionId]/page.tsx`
5. `components/portal/milemarkers/MM3Discover.tsx` (city popup if it has an image area)

For each file, report what currently renders in the city image
area before making any changes.

---

## Step 3 — Add City Images

For each city card that has an image placeholder or empty image area,
add a Next.js Image component using this pattern:

```jsx
import Image from 'next/image'

// Inside the city card, in the image container:
<div style={{ position: 'relative', width: '100%', aspectRatio: '16/9',
  borderRadius: '8px', overflow: 'hidden', background: 'var(--color-background-tertiary)' }}>
  <Image
    src={`/images/cities/${location.id}.jpg`}
    alt={`${location.name}, Texas`}
    fill
    className="object-cover"
    onError={(e) => {
      e.currentTarget.src = '/images/cities/placeholder.jpg'
    }}
  />
</div>
```

**Notes:**
- Use `location.id` or `match.location.id` depending on the prop
  structure in each component
- The city ID format matches the image filename exactly
  (e.g. `austin-tx` → `/images/cities/austin-tx.jpg`)
- If the card already has an image container div, replace its
  contents with the Image component
- If no image container exists, add one above or below the
  city name — use judgment based on the existing card layout
- Keep image size proportional to the card — don't make images
  too large and overwhelm the card content

---

## Step 4 — next.config handling

Check `next.config.ts` or `next.config.js`. Local static images
in `/public/` do not require any special configuration in Next.js —
they are served automatically. No changes needed to next.config
for local images.

---

## Acceptance Criteria

- [ ] City images render in MM1 city teaser cards
- [ ] City images render in MM2 SavedMatches city cards
- [ ] City images render in results/teaser page city cards
- [ ] placeholder.jpg exists and loads for cities without images
- [ ] Images are sized appropriately — not too large, not distorted
- [ ] object-cover prevents stretching
- [ ] Fallback fires correctly for cities without dedicated images
- [ ] No layout breakage on any card
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add components/portal/milemarkers/MM1Explore.tsx
git add components/portal/SavedMatches.tsx
git add components/portal/milemarkers/MM2Discover.tsx
git add "app/results/[sessionId]/page.tsx"
git add public/images/cities/placeholder.jpg
git add [any other files changed]
git commit -m "feat: wire city images into city cards with fallback placeholder"
git push origin main
```

Confirm push — paste commit hash.
