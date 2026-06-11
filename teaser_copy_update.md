# Build Brief — Teaser Results Page Copy Update
**Date:** June 5, 2026
**For:** Claude Code
**Type:** Execute — copy changes only
**Priority:** Medium — first impression after quiz completion
**Report back:** Confirm all changes complete, commit and push to main

---

## Overview

The teaser results page (shown after quiz, before email gate) needs
copy that creates excitement and frames these as preliminary results —
not a final report. The tone should feel like a friend saying
"okay, look at this — but wait until you see what else we found."

---

## File

`app/results/[sessionId]/page.tsx`

---

## Change 1 — Page Headline

Find the main headline on the results page.

**Change from:** "Your Texas matches"
**Change to:** "Your first look at Texas."

---

## Change 2 — Subtext Below Headline

Find the subtext/description paragraph below the headline.

**Change to:**
"These are your preliminary matches — a first peek at where your
life fits in Texas. There's a lot more ahead. Create your free
Navigator portal and we'll take you the rest of the way."

---

## Change 3 — Teaser Note Above City Cards

Add a warm note between the header section and the first city card.

```jsx
<p style={{
  fontSize: '13px',
  fontStyle: 'italic',
  color: '#9A8E82',
  textAlign: 'center',
  maxWidth: '600px',
  margin: '0 auto 24px auto',
  lineHeight: 1.7
}}>
  We're just getting started. What you see here is the beginning
  of your discovery — not the end. Your full Navigator experience
  goes much deeper into your finances, your priorities, and the
  communities that truly fit your life.
</p>
```

Place this immediately above the city cards grid/list,
below any existing section labels.

---

## Acceptance Criteria

- [ ] Headline reads "Your first look at Texas."
- [ ] Subtext updated with preliminary matches framing
- [ ] Teaser note renders above city cards in muted italic style
- [ ] Page still shows city cards correctly below the new copy
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add "app/results/[sessionId]/page.tsx"
git commit -m "fix: teaser results page copy — first peek framing, excitement over data delivery"
git push origin main
```

Confirm push — paste commit hash.
