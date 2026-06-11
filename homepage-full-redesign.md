# HavenQuest — Homepage Full Redesign Brief
**Date:** June 6, 2026  
**Prepared by:** Claude (COO)  
**Executed by:** Claude Code  
**Branch:** main  

---

## Overview

Replace the current homepage hero and all sections between the nav and the existing footer with the new full-page layout described below. Use the correct HavenQuest brand palette throughout. Do not touch portal styles or components.

---

## Brand Palette (public site only)

```
Brand Navy:  #0A1E3D  — nav, headlines, buttons, dark fields
Brand Blue:  #0076B6  — CTAs, accents, step tops, rule
Navy Gold:   #C5B783  — logo accent, icons, links, strips
White:       #FFFFFF
Mist:        #F3F5F8  — subtle surfaces and panels
```

Do NOT apply these to portal components. Portal gold scheme is unchanged.

---

## Section 1 — Navigation Bar

Update nav background to `#0A1E3D`. Keep all existing nav items and links.

- Logo: "Haven" white, "Quest" `#C5B783`
- Nav links: `rgba(255,255,255,0.65)`
- "Begin My Journey" button: white background, `#0A1E3D` text, border-radius 6px, padding 8px 18px

---

## Section 2 — Hero (Split Layout)

Two-column grid: `grid-template-columns: 54% 46%`. Min-height 420px.

### Left Panel (white background)
Padding: 52px top/bottom, 48px right, 32px left.

**Italic intro line** (17px, `var(--color-text-secondary)`, italic, margin-bottom 4px):
```
So, you're
```

**H1 headline** (46px, font-weight 500, `#0A1E3D`, line-height 1.1, margin-bottom 22px):
```
Choosin' Texas.
```
"Texas." in `#0076B6`. Rest in `#0A1E3D`.

**Subhead** (14px, `var(--color-text-secondary)`, line-height 1.85, max-width 400px, margin-bottom 28px):
```
Great choice. Now let's make sure you land in exactly the right community — the one that fits your life, your budget, and the way you want to live. That's what HavenQuest is here for.
```

**CTA row** (flex, gap 16px, margin-bottom 32px):
- Primary: `background: #0076B6`, white text, "Begin My Journey →", 13px font-weight 500, padding 13px 28px, border-radius 8px, links to `/begin`
- Secondary: color `#0A1E3D`, opacity 0.7, Lucide `Map` icon + "Explore Texas markets", links to `/texas/texas-insider`

**Trust stats row** (flex, padding-top 22px, border-top `0.5px solid var(--color-border-tertiary)`):
Four stats, separated by vertical dividers. Number: 20px font-weight 500 `#0A1E3D`. Label: 11px muted.

| Number | Label |
|---|---|
| 101 | Texas communities |
| 4 | Major metros |
| 12 | Lifestyle categories |
| Free | To start |

### Right Panel (hero image)
- `border-left: 0.5px solid var(--color-border-tertiary)`, overflow hidden
- Next.js Image component, `fill`, `object-fit: cover`
- Image src: `/images/relocation-couple.jpg`
- Alt: "Couple with confident smiles surrounded by moving boxes — ready for their Texas move"
- **Bottom gradient:** `background: linear-gradient(transparent, rgba(10,30,61,0.55))`, height 110px, absolute bottom
- **Pill badge** (absolute, bottom 16px, left 16px, z-index 1):
  - `background: rgba(10,30,61,0.18)`, `border: 1px solid rgba(255,255,255,0.35)`, border-radius 20px, padding 5px 12px, 11px white text
  - Gold dot (6px circle `#C5B783`) + "4 metros · 101 cities · Updated June 2026"

---

## Section 3 — Gold Strip

```css
height: 3px;
background: #C5B783;
```
Full width, no margin.

---

## Section 4 — Promise Strip

Full-width, `background: #F3F5F8`, `border-bottom: 0.5px solid var(--color-border-tertiary)`.
Four equal columns, `border-right: 0.5px solid var(--color-border-tertiary)` between each.

Each column: padding 16px 18px, flex row, gap 10px.

Icon box: 30×30px, border-radius 6px, `background: #0A1E3D`, Lucide icon in `#C5B783`, 15px.

| Lucide Icon | Label | Description |
|---|---|---|
| `BarChart2` | Matched to your life | Verified data across 12 lifestyle categories |
| `UserCheck` | A real guide at your side | Your Market Director steps in at MileMarker 4 |
| `ShieldCheck` | Vetted local experts | Hand-picked Select Agents who know your market |
| `Lock` | Your data stays yours | Nothing sold, nothing shared without consent |

Label: 12px font-weight 500 `#0A1E3D`. Description: 11px muted, line-height 1.45.

---

## Section 5 — Blue Rule

```css
height: 2px;
background: #0076B6;
```
Full width, no margin.

---

## Section 6 — How It Works

Padding: 28px 32px.

Eyebrow: `HOW IT WORKS` — 11px, letter-spacing 2px, uppercase, muted, margin-bottom 16px.

Four equal cards, `grid-template-columns: repeat(4,1fr)`, gap 10px.

Each card: `border: 0.5px solid var(--color-border-tertiary)`, `border-top: 2px solid #0076B6`, `border-radius: var(--border-radius-lg)`, padding 14px, white background.

| Step | Title | Description |
|---|---|---|
| 01 · Discover | Tell us about your life | Income, household, and what matters most to you in a community. |
| 02 · Match | Get your Texas matches | Your top communities ranked by your priorities and budget. |
| 03 · Explore | Go deeper in your portal | Full reports, financial breakdown, and community intelligence. |
| 04 · Connect | Meet your Market Director | A real guide steps in — then introduces your Select Agent. |

Step label: 11px, `#0076B6`, font-weight 500, margin-bottom 6px.
Title: 13px, font-weight 500, `#0A1E3D`, margin-bottom 4px.
Description: 11px, muted, line-height 1.5.

---

## Section 7 — Social Proof

Keep the existing social proof section exactly as-is. Do not rebuild it. Only update:
- Eyebrow color to `#C5B783` (gold) if it isn't already
- Headline color to `#0A1E3D` if it isn't already
- Star color to `#C5B783` if it isn't already

Note in code comment: `{/* TODO: Replace sample reviews with real beta feedback */}`

---

## Section 8 — Texas Market Snapshot

Margin: 0 32px 28px. Border: `0.5px solid var(--color-border-tertiary)`. Border-radius: `var(--border-radius-lg)`. Overflow hidden.

**Header:** `background: #0A1E3D`, padding 11px 16px, flex space-between.
- Left: "Texas market snapshot · Q2 2026" — 12px, font-weight 500, white
- Right: "Full Texas Insider →" — 11px, `#C5B783`, links to `/texas/texas-insider`

**Three-column data row** (`grid-template-columns: repeat(3,1fr)`, `border-right: 0.5px solid var(--color-border-tertiary)` between columns):

Each cell: padding 12px 16px.

| Label | Value | Sub |
|---|---|---|
| Austin median | $460,000 | Buyer's market · -16% from peak |
| DFW median | $375,000 | #1 market to watch nationally |
| Houston median | $270,000 | Most affordable major metro |

Label: 10px uppercase letter-spacing muted. Value: 16px font-weight 500 `#0A1E3D`. Sub: 11px muted.

---

## Section 9 — Footer

Update existing footer:
- Background: `#0A1E3D`
- Logo: "Haven" white, "Quest" `#C5B783`
- Links: `rgba(255,255,255,0.5)` — Privacy, Terms, Texas Insider, For Realtors
- Copyright: `© 2026 HavenQuest` — `rgba(255,255,255,0.4)`, 11px

Remove any reference to "American Victory Alliance" or "Grand Haven Partners" from the footer.

---

## Mobile Responsive (md: breakpoint and below)

- Hero: image first (height 220px), text below — single column
- CTA row: primary button full-width, secondary link centered below
- Trust stats: 2×2 grid
- Promise strip: 2×2 grid
- How it works: 2×2 grid
- Market snapshot: single column stack

---

## What NOT to Change

- Portal components, layouts, or styles — completely untouched
- Texas Insider pages — untouched
- All existing routes and functionality
- Existing sections below the hero that are NOT listed above — keep as-is, only add the new sections between nav and the first existing section below

---

## Final Step — Commit and Deploy

After changes are complete, tsc clean, and next build passes:

```
git add -A
git commit -m "feat: homepage full redesign — Choosin Texas hero, brand palette, promise strip, how it works, market snapshot"
git push origin main
```

Confirm push succeeded and Vercel deployment triggered. Report back to Claude chat when complete.
