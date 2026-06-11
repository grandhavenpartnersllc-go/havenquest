# Build Brief — Homepage Image Fix, Footer Separation, Texas Identity Copy
**Date:** June 4, 2026
**For:** Claude Code
**Type:** Execute — three fixes in one pass
**Priority:** Medium-High
**Report back:** Confirm all changes complete, commit and push to main

---

## Fix 1 — Image Not Showing

**File:** `app/page.tsx` and/or the split section component

The image at /images/relocation-couple.png is not displaying.

Check:
1. Does /public/images/relocation-couple.png exist on disk?
   Run: ls public/images/
2. Is the Next.js Image component using the correct src path?
3. Is there a next.config.ts or next.config.js that needs to allow
   local images? Check if images.domains or images.remotePatterns
   is blocking local static files.
4. Is the parent container giving the image a height? The fill prop
   requires the parent to have a defined height or aspect ratio.

Fix whatever is causing the image not to render. The parent container
should have aspect-video (16:9) with relative positioning and the
Image should use fill with object-cover.

---

## Fix 2 — CTA Section and Footer Running Together

**File:** `app/page.tsx` and `components/shared/Footer.tsx`

Both the Final CTA section and the footer have dark/black backgrounds
and are visually indistinguishable from each other.

Fix: Add a clear visual separator between them. Options in order
of preference:

Option A — Add a top border to the footer:
In Footer.tsx, add a top border to the footer element:
style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}

Option B — Change the Final CTA background to the warm dark tone:
In app/page.tsx, ensure the Final CTA section uses #16120D
(WARM_DARK) not pure black #000000 or #08101C.
The footer should stay darker — pure #0A0A0A or similar.

Apply both A and B together for maximum separation.

---

## Fix 3 — Texas Identity Throughout Homepage Copy

**Files:** `app/page.tsx`, `components/landing/HeroSection.tsx`,
`components/landing/HowItWorks.tsx`

Texas needs to appear naturally throughout the page — not just
in the hero headline. Update copy in each section as follows:

### Section 2 — Problem Section (app/page.tsx)
Current opening: "HavenQuest is not just another relocation platform."

Replace the full problem section copy with:

---
HavenQuest is built specifically for one of the biggest moves
in America — relocating to Texas.

Whether you're coming from Chicago, California, or across the
state line, Texas is not one place. It's 101 distinct communities
across four major metros — each with its own cost of living,
school systems, lifestyle, and character.

Relocating is one of the most stressful decisions a family makes.
Not because finding a home is hard — but because there are a
hundred other decisions happening at the same time, and most
people are making them alone.

Schools. Neighborhoods. Timelines. Realtors. Lenders. Movers.
Community connections. All of it, all at once, with no one in
your corner.

HavenQuest changes that — for Texas.
---

### Section 3 — How It Works Cards (components/landing/HowItWorks.tsx)
Update the three card copy blocks to include Texas references:

Card 1 — CLARITY
Headline: Find your Texas community.
Copy: Tell us about your life — your income, your household, and
what matters most to you. Our platform matches you to the Texas
communities where your life genuinely fits across 4 metros and
101 cities. No guesswork. No endless tabs. Just clarity.

Card 2 — CONFIDENCE
Headline: Meet your Market Director.
Copy: When you're ready to go deeper, your personal Market Director
steps in. A real person who knows your Texas destination market,
has read your profile, and guides you from community discovery
through closing day. You'll always know who to call.

Card 3 — PEACE OF MIND
Headline: Every step. Handled.
Copy: From your Texas neighborhood search to your moving checklist,
your Market Director keeps every piece of your relocation organized,
tracked, and moving forward. Nothing falls through the cracks.
You arrive in Texas prepared, connected, and at home.

### Section 4 — Differentiator (app/page.tsx)
Current: "Other platforms give you data. HavenQuest gives you confidence."

Update to:
Line 1 (muted): Other platforms give you a list of Texas cities.
Line 2 (bold, large): HavenQuest guides you all the way there.

### Split Section — "The HavenQuest Difference" (app/page.tsx)
Update the headline:
Current: "This isn't just data. It's a guided experience."
New: "Texas is big. We help you find exactly where you belong."

Update the body copy first paragraph:
Current: "Most relocation platforms hand you a list of cities..."
New: "Most platforms hand you a list of Texas cities and leave
you to figure out the rest. With 101 communities across Austin,
DFW, Houston, and San Antonio — plus everything in between —
that list can feel overwhelming. HavenQuest is different."

Keep remaining paragraphs (Market Director, peace of mind) unchanged.

### Section 6 — Final CTA (app/page.tsx)
Update subtext:
Current: "Two paths. One destination. Begin when you're ready."
New: "Two paths into Texas. One guided experience. Begin when
you're ready."

---

## Acceptance Criteria

- [ ] Image renders correctly in the split section
- [ ] Final CTA section and footer are visually distinct
- [ ] "Texas" appears naturally in Sections 2, 3, 4, split section,
      and final CTA — not just in the hero
- [ ] 101 cities and 4 metros referenced in Section 3
- [ ] Copy still feels warm and human — not a geography lesson
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add app/page.tsx components/landing/HeroSection.tsx
git add components/landing/HowItWorks.tsx components/shared/Footer.tsx
git commit -m "fix: homepage image, footer separation, Texas identity copy throughout"
git push origin main
```

Confirm push — paste commit hash.
