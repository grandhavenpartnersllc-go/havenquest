# Build Brief — Homepage Sample Testimonials, Split Image Section, Footer Fixes
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Execute — three homepage updates in one pass
**Priority:** Medium
**Report back:** Confirm all changes complete, commit and push to main

---

## Change 1 — Replace Empty Testimonial Cards with Sample Reviews

**File:** `app/page.tsx` (social proof section)

Replace the three empty placeholder cards with three sample review
cards. Each card should include a very light, small, inconspicuous
label reading "Sample review" — use opacity-40 or a muted gray,
text-xs, so it's present but not distracting.

**Card 1:**
Name: Sarah M.
Origin: Relocating from Chicago, IL
Quote: "I had no idea where to even start with Texas. HavenQuest
narrowed it down to three communities that actually fit our life.
We're under contract in Round Rock and couldn't be happier."
Rating: 5 stars

**Card 2:**
Name: David & Karen T.
Origin: Relocating from Denver, CO
Quote: "Our Market Director was with us every step of the way.
From our first city match to closing day, we never felt lost
or overwhelmed. This is how moving should work."
Rating: 5 stars

**Card 3:**
Name: Marcus R.
Origin: Relocating from Atlanta, GA
Quote: "I was skeptical that an online platform could really
understand what I was looking for. HavenQuest proved me wrong.
Plano checked every box."
Rating: 5 stars

**Card styling:**
- White or light card background with subtle shadow
- Name in bold, origin in muted small text below name
- Quote in regular weight body text
- 5 gold stars above or below the quote
- "Sample review" label in text-xs, opacity-40, bottom right
  of each card

---

## Change 2 — Split Section with Image

**File:** `app/page.tsx` — add a new section between the Problem
section (Section 2) and the How It Works section (Section 3).

**Layout:** Two columns, 50/50 split on desktop, stacked on mobile.
Left column: text. Right column: image.

**Left column copy:**

Small label (gold, uppercase, tracked):
THE HAVENQUEST DIFFERENCE

Headline:
This isn't just data.
It's a guided experience.

Body:
Most relocation platforms hand you a list of cities and leave
you to figure out the rest. HavenQuest is different.

From the moment you begin, you're building toward something
real — a community that fits your life, a home that fits your
budget, and a team that stays with you until you're settled in.

Your Market Director isn't a chatbot. They're a real person
who knows your destination market, has read your profile, and
is ready to walk beside you through every decision — from
neighborhood exploration to closing day.

This is what peace of mind actually looks like.

**Right column:**
Display the image at `/images/relocation-couple.png`
- Use Next.js Image component with appropriate sizing
- 16:9 aspect ratio — preserve it
- Rounded corners (rounded-2xl)
- Slight shadow for depth
- Alt text: "Couple relaxed and confident during their Texas relocation"
- On mobile, image stacks below the text

**Section background:** white or very light warm off-white
**Vertical padding:** generous — py-20 or similar

---

## Change 3 — Footer and CTA Section Fixes

**Files:** `app/page.tsx` and `components/shared/Footer.tsx`

### 3a — Separate Final CTA from Footer visually
In app/page.tsx, change the Final CTA section background from
pure black/dark to a slightly warmer dark tone — use #16120D
(the existing WARM_DARK constant used in the portal nav).
This creates visual separation from the footer's darker background.

### 3b — Remove empty testimonial placeholder cards
Already handled by Change 1 above — confirm the empty card grid
is fully removed.

### 3c — Update footer tagline
In components/shared/Footer.tsx, change:
"Relocation intelligence with a human touch."
To:
"Your guide to Texas, start to finish."

### 3d — Update footer Product column
Remove "Explore Texas" link from the Product column.
Replace with: "How It Works" — anchor link to /#how-it-works
or just remove it if no clean anchor exists on the page.

---

## Image Reference
The image file is located at: `/public/images/relocation-couple.png`
It has been placed there by Craig. Reference it in the component as:
`/images/relocation-couple.png`

---

## Acceptance Criteria

- [ ] Three sample review cards visible with "Sample review" label
- [ ] Split section visible between Problem and How It Works sections
- [ ] Image loads correctly from /images/relocation-couple.png
- [ ] Text is left-aligned in left column, image fills right column
- [ ] Section stacks correctly on mobile
- [ ] Final CTA section visually distinct from footer
- [ ] Footer tagline updated
- [ ] Footer Product column updated
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add app/page.tsx components/shared/Footer.tsx
git add [any new component files created]
git commit -m "feat: sample testimonials, split image section, footer fixes"
git push origin main
```

Confirm push — paste commit hash.
