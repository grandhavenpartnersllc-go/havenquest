# HavenQuest — Homepage Hero Full-Bleed Overlay Redesign
**Date:** June 7, 2026  
**Prepared by:** Claude (COO)  
**Executed by:** Claude Code  
**Branch:** main  

---

## Overview

Replace the current split-panel hero with a full-bleed image hero where text overlays the photo — similar to the Robert Half homepage. The couple photo fills the entire hero area edge to edge. A dark semi-transparent overlay sits on top of the image for text readability. All headline and copy content is overlaid on top of the image.

Everything below the hero (gold strip, promise strip, how it works, social proof, market snapshot, footer) stays exactly as-is.

---

## Hero Section — Full Bleed Overlay Layout

### Container
- Full viewport width
- Min-height: 560px on desktop
- Position: relative
- Overflow: hidden

### Background Image
- Next.js Image component
- src: `/images/relocation-couple.png`
- fill prop: true
- style: `object-fit: 'cover', object-position: 'center'`
- alt: "Couple with confident smiles surrounded by moving boxes — ready for their Texas move"
- priority: true (above the fold)

### Dark Overlay
- Position: absolute, inset 0
- Background: `rgba(10, 30, 61, 0.55)` — dark navy overlay, same warmth as Robert Half example
- z-index: 1

### Content Layer
- Position: absolute, inset 0
- z-index: 2
- Display: flex, flex-direction: column, justify-content: center
- Padding: 80px 64px on desktop, 40px 24px on mobile
- Max-width of text content: 680px (left-aligned, not centered)

---

## Content Inside Hero

**Italic intro line:**
- Text: `So, you're`
- Font-size: 20px
- Font-style: italic
- Color: rgba(255,255,255,0.8)
- Margin-bottom: 8px

**H1 Headline:**
- Text: `Choosin' Texas.`
- Font-size: 72px on desktop, 48px on mobile
- Font-weight: 700
- Line-height: 1.05
- Color: white
- "Texas." in `#C5B783` (navy gold — warm against the dark overlay)
- Margin-bottom: 24px

**Subhead:**
- Text: `Great choice. Now let's make sure you land in exactly the right community — the one that fits your life, your budget, and the way you want to live. That's what HavenQuest is here for.`
- Font-size: 18px
- Color: rgba(255,255,255,0.85)
- Line-height: 1.7
- Max-width: 560px
- Margin-bottom: 36px

**CTA Button:**
- Text: `Begin My Journey →`
- Background: `#0076B6`
- Color: white
- Font-size: 15px
- Font-weight: 500
- Padding: 14px 32px
- Border-radius: 8px
- Links to `/begin`
- Margin-bottom: 48px

**Trust Stats Row:**
- Display: flex, gap 32px
- Four stats, each with number and label
- Number: 28px, font-weight 700, white
- Label: 13px, rgba(255,255,255,0.7)
- A subtle white vertical divider (1px, rgba(255,255,255,0.2)) between each stat

| Number | Label |
|---|---|
| 101 | Texas communities |
| 4 | Major metros |
| 12 | Lifestyle categories |
| Free | To start |

**Pill badge:**
- Position: absolute, bottom 24px, right 32px
- Background: rgba(10,30,61,0.3)
- Border: 1px solid rgba(255,255,255,0.3)
- Border-radius: 20px
- Padding: 6px 14px
- Font-size: 12px, white
- Gold dot (6px circle, `#C5B783`) + "4 metros · 101 cities · Updated June 2026"

---

## Remove

- The old split-panel hero layout (left text panel / right image panel)
- Any remnant of the welcome-to-texas.jpg reference

---

## Mobile Responsive

- Min-height: 500px
- H1: 48px
- Subhead: 15px
- Padding: 40px 24px
- Trust stats: 2×2 grid, gap 16px
- Pill badge: bottom 16px, right 16px

---

## What NOT to Change

- Gold strip below hero
- Promise strip
- Blue rule
- How It Works section
- Social proof section
- Market snapshot
- Footer
- All portal components — untouched

---

## Final Step — Commit and Deploy

After changes complete, tsc clean, next build passes:

```
git add -A
git commit -m "feat: homepage hero full-bleed overlay — couple photo, dark navy overlay, large bold headline"
git push origin main
```

Confirm push and Vercel deployment. Report back to Claude chat when complete.
