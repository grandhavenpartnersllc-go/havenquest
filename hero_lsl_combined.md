# Build Brief — Hero Overlay + Text Fix + Lone Star Lifestyle Branding
**Date:** June 4, 2026
**For:** Claude Code
**Type:** Execute — two files, multiple changes
**Priority:** Medium-High
**Report back:** Confirm all changes complete, commit and push to main

---

## File 1 — components/landing/HeroSection.tsx

### Fix 1 — Darker overlay
Find the overlay div. Change background from rgba(0,0,0,0.65) to rgba(0,0,0,0.80).

### Fix 2 — Text z-index above overlay
Confirm the z-index layering is correct:
- Background image container: z-0
- Overlay div: z-10
- Text content wrapper div: z-20

If text content is not at z-20 or higher, fix it. The text must sit
ABOVE the overlay, not under it.

### Fix 3 — Full white text
All text in the hero should be full white — not muted or semi-transparent.
Find any text with opacity, text-white/70, text-white/60, or similar
and change to text-white or color: '#FFFFFF'. This includes the subtext
paragraph and any secondary lines.

### Fix 4 — Add Lone Star Lifestyle label above headline
Add a small gold label as the very first element inside the text
content wrapper, above "So, you're":

```jsx
<p
  className="text-xs font-bold uppercase mb-4"
  style={{ color: '#B8912A', letterSpacing: '0.18em' }}
>
  Find Your Lone Star Lifestyle™
</p>
```

---

## File 2 — app/page.tsx

### Fix 5 — How It Works section label
Find the section label above the three cards.
Change from: "YOUR JOURNEY WITH HAVENQUEST"
Change to: "FIND YOUR LONE STAR LIFESTYLE™"

### Fix 6 — Final CTA headline
Find: "Your next chapter starts here."
Change to: "Your Lone Star Lifestyle starts here."

---

## Acceptance Criteria

- [ ] Hero overlay is noticeably darker — text clearly readable
- [ ] Hero text sits visually above the overlay — not dimmed by it
- [ ] All hero text is full white — no muted or semi-transparent text
- [ ] "Find Your Lone Star Lifestyle™" label appears in gold above hero headline
- [ ] How It Works section label updated
- [ ] Final CTA headline updated
- [ ] tsc --noEmit clean

---

## Commit and Deploy

```
git add components/landing/HeroSection.tsx app/page.tsx
git commit -m "feat: darker hero overlay, hero text above overlay, full white text, Lone Star Lifestyle branding"
git push origin main
```

Confirm push — paste commit hash.
