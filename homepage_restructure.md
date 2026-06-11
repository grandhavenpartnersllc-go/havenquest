# Build Brief — Homepage Copy Restructure + Footer Cities Removal
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Execute — copy and UI changes
**Priority:** Medium
**Report back:** Confirm all changes complete, commit and push to main

---

## Part 1 — Remove Cities Section from Footer

**File:** Find the Footer component — likely `components/shared/Footer.tsx`
or `components/layout/Footer.tsx`

Find the section listing Texas cities in the footer. Remove it entirely.
Do not replace it with anything — just remove the cities block cleanly
so the footer still looks balanced.

Report what the footer currently contains so we can confirm the right
section is being removed.

---

## Part 2 — Homepage Copy Restructure

**File:** `app/page.tsx` and any components it imports for sections
(HeroSection, HomeSection, etc.)

Restructure the homepage to match the following copy and section order
exactly. Keep existing visual styling, colors, and layout patterns —
this is a copy update, not a design overhaul. Match the warm dark /
light section alternating pattern that currently exists.

---

### SECTION 1 — Hero
Background: warm dark (existing hero treatment)

Headline:
Move with confidence. Arrive with peace of mind.

Subtext:
HavenQuest guides your entire relocation journey — from discovering
the right Texas community to settling into your new home — so you
never have to navigate it alone.

CTA Button: Begin My Journey → /begin

---

### SECTION 2 — The Problem
Background: light

No section label. Centered text. Generous whitespace.

Body copy:
HavenQuest is not just another relocation platform. It's a guided
experience built around the reality of what moving actually involves.

Relocating is one of the most stressful decisions a family makes.
Not because finding a home is hard — but because there are a hundred
other decisions happening at the same time, and most people are
making them alone.

Schools. Neighborhoods. Timelines. Realtors. Lenders. Movers.
Community connections. All of it, all at once, with no one in
your corner.

HavenQuest changes that.

---

### SECTION 3 — How It Works
Background: warm light or off-white

Section label: YOUR JOURNEY WITH HAVENQUEST

Three cards or columns side by side (or stacked on mobile):

Card 1 — CLARITY
Headline: Find where you belong.
Copy: Tell us about your life — your income, your household, and
what matters most to you. Our intelligence platform matches you
to the Texas communities where your life genuinely fits. No
guesswork. No endless tabs. Just clarity.

Card 2 — CONFIDENCE
Headline: Meet your Market Director.
Copy: When you're ready to go deeper, your personal Market Director
steps in. A real person who knows your destination market, knows
your profile, and guides you from community discovery through
closing day. You'll always know who to call.

Card 3 — PEACE OF MIND
Headline: Every step. Handled.
Copy: From your neighborhood search to your moving checklist, your
Market Director keeps every piece of your relocation organized,
tracked, and moving forward. Nothing falls through the cracks.
You arrive prepared, connected, and at home.

Card headers (CLARITY / CONFIDENCE / PEACE OF MIND) in gold #B8912A.

---

### SECTION 4 — The Differentiator
Background: warm dark

Large centered type. Statement moment. No section label.

Line 1 (muted/secondary): Other platforms give you data.
Line 2 (bold/primary, larger): HavenQuest gives you confidence.

---

### SECTION 5 — Social Proof
Background: light

Section label: TRUSTED BY PEOPLE RELOCATING TO TEXAS

Placeholder copy (until real testimonials collected from beta):
Built for anyone ready to make Texas home.

Leave space for 2-3 testimonial cards — render as empty placeholder
cards or just the headline for now.

---

### SECTION 6 — Final CTA
Background: warm dark (bookend matching hero)

Headline: Your next chapter starts here.

Subtext: Two paths. One destination. Begin when you're ready.

Disclosure line (small, muted, above button):
No cost to you. HavenQuest is compensated through our Select Agent
network — only when you close.

CTA Button: Begin My Journey → /begin

---

## Important Notes

- The word "free" does not appear anywhere on the page
- "families" appears only in Section 2 where it fits — not used
  as a catch-all demographic elsewhere
- "Select Agent" appears exactly once — in the Section 6 disclosure
- "Market Director" appears first in Section 3 Beat 2
- CLARITY / CONFIDENCE / PEACE OF MIND are the three card headers
  in Section 3 — these are the core product delivery words
- Do not add or change any navigation elements
- Do not change /begin page or any other pages

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add app/page.tsx components/shared/Footer.tsx
git add [any additional component files changed]
git commit -m "feat: homepage copy restructure — confidence/peace of mind positioning, footer cities removed"
git push origin main
```

Confirm push — paste commit hash.
