# HavenQuest — Homepage Hero Redesign Brief (Texas Flag Color System)
**Date:** June 6, 2026  
**Prepared by:** Claude (COO)  
**Executed by:** Claude Code  
**Branch:** main  

---

## Overview

Replace the current dark full-bleed homepage hero with a clean split layout using the Texas flag color system. Public site uses navy + red + gold. Portal stays gold-dominant — do not touch portal styles.

**Texas flag color palette (public site only):**
```
--tx-navy:  #002868  (primary dark — nav, headlines, buttons, step tops)
--tx-red:   #BF0A30  (accent only — eyebrow rules, step numbers, flag stripe, badge dot)
--tx-gold:  #C9A84C  (premium accent — logo, icons, links)
```

---

## Current State (to replace)

Find the homepage hero component — likely `app/page.tsx`, `components/home/Hero.tsx`, or `components/Hero.tsx`. The current hero has:
- Full-bleed dark overlay background with road sign photo
- "So, you're Choosin' Texas." headline in large blue type
- "FIND YOUR LONE STAR LIFESTYLE™" eyebrow
- Blue "Begin My Journey" CTA button

Replace the entire hero section and everything immediately below it (up to the existing city cards or testimonials section) with the new layout described below.

---

## New Section 1 — Navigation Bar

Keep existing nav bar. Update background color to `#002868` (Texas navy). Keep all existing nav items and links. "Begin My Journey" button stays white with `#002868` text.

---

## New Section 2 — Hero (Split Layout)

Two-column CSS grid: `grid-template-columns: 55% 45%`. Min-height 400px on desktop.

### Left Panel (white background)
Padding: 52px top/bottom, 44px right, 32px left.

**Eyebrow row** (flex, gap 8px, align-items center):
- Red horizontal rule: `width: 28px; height: 1.5px; background: #BF0A30; flex-shrink: 0`
- Text: `TEXAS RELOCATION INTELLIGENCE` — 11px, letter-spacing 2px, uppercase, color `#BF0A30`

**Headline** (Playfair Display serif, 34px, font-weight 500, line-height 1.25, color `#002868`):
```
Find your place
in the Lone Star State.
```
"Lone Star State." in `#BF0A30`. Rest in `#002868`.

**Subhead** (13.5px, `var(--color-text-secondary)`, line-height 1.8, max-width 400px, margin-bottom 28px):
```
HavenQuest matches you to the right Texas community based on your income, priorities, and lifestyle — then guides you every step of the way to your front door.
```

**CTA row** (flex, gap 16px, margin-bottom 32px):
- Primary button: `background: #002868`, white text, "Begin My Journey →", 13px font-weight 500, padding 12px 24px, border-radius 8px. Links to `/begin`
- Secondary link: color `#002868`, border-bottom `1px solid #002868`, "Explore Texas markets" with Lucide `Map` icon, 13px. Links to `/texas/texas-insider`

**Trust stats row** (flex, padding-top 24px, border-top `0.5px solid var(--color-border-tertiary)`):
Four stats. Each has a number (20px, font-weight 500, `#002868`) and label (11px, muted). Separated by vertical dividers (`0.5px solid var(--color-border-tertiary)`), gap 20px each side.

| Number | Label |
|---|---|
| 101 | Texas communities |
| 4 | Major metros |
| 12 | Lifestyle categories |
| Free | To start |

### Right Panel (lifestyle image)
- `border-left: 0.5px solid var(--color-border-tertiary)`
- Next.js Image component, `fill`, `object-fit: cover`
- Image src: `/images/texas-intel/state-hero.jpg`
- Alt: "Texas lifestyle — community life in the Lone Star State"
- **Bottom gradient overlay:** `background: linear-gradient(transparent, rgba(0,40,104,0.55))` — height 120px, absolute bottom
- **Badge** (absolute, bottom 16px, left 16px, z-index 1):
  - `background: rgba(0,40,104,0.15)`, `border: 1px solid rgba(255,255,255,0.4)`, border-radius 20px, padding 5px 12px
  - Red dot (6px circle, `#BF0A30`) + text: `4 metros · 101 cities · Updated June 2026`, 11px, white

---

## New Section 3 — Texas Flag Stripe

Immediately below the hero. Three equal horizontal bars, total height 4px:
```
Red:   #BF0A30  (flex: 1)
White: #FFFFFF  with 0.5px top and bottom border in var(--color-border-tertiary)  (flex: 1)
Navy:  #002868  (flex: 1)
```
Display as `display: flex; height: 4px`.

---

## New Section 4 — Proof Strip

Full-width, `background: #002868`. Four equal columns, each separated by `border-right: 0.5px solid rgba(255,255,255,0.1)`.

Each column: padding 16px 20px, flex row with icon box + text block, gap 10px.

Icon box: 30×30px, border-radius 6px, `background: rgba(255,255,255,0.1)`, icon in gold (`#C9A84C`) using Lucide React, font-size 15px.

| Icon (Lucide) | Label | Description |
|---|---|---|
| `BarChart2` | Data-driven matching | Verified data across 12 lifestyle categories |
| `UserCheck` | A real person guides you | Your Market Director steps in at MileMarker 4 |
| `ShieldCheck` | Vetted Select Agents | Hand-picked realtors who know your market |
| `Lock` | Your data stays yours | Nothing sold, nothing shared without consent |

Label: 12px, font-weight 500, white.
Description: 11px, `rgba(255,255,255,0.6)`, line-height 1.4.

---

## New Section 5 — Red Rule

```css
height: 2px;
background: #BF0A30;
```
Full width, no margin.

---

## New Section 6 — How It Works

Padding: 28px 32px.

Section eyebrow: `HOW IT WORKS` — 11px, letter-spacing 2px, uppercase, `var(--color-text-secondary)`, margin-bottom 16px.

Four equal cards, `grid-template-columns: repeat(4, 1fr)`, gap 10px.

Each card: `border: 0.5px solid var(--color-border-tertiary)`, `border-top: 2px solid #002868`, `border-radius: var(--border-radius-lg)`, padding 14px, white background.

| Step label | Title | Description |
|---|---|---|
| 01 · Discover | Tell us about your life | Income, household, and what matters most to you in a community. |
| 02 · Match | Get your Texas matches | Your top communities ranked by your priorities and budget. |
| 03 · Explore | Go deeper in your portal | Full reports, financial breakdown, and community intelligence. |
| 04 · Connect | Meet your Market Director | A real guide steps in — then introduces your Select Agent. |

Step label: 11px, `#BF0A30`, font-weight 500, margin-bottom 6px.
Title: 13px, font-weight 500, `#002868`, margin-bottom 4px.
Description: 11px, muted, line-height 1.5.

---

## New Section 7 — Texas Market Snapshot Strip

Margin: 0 32px 28px. Border: `0.5px solid var(--color-border-tertiary)`. Border-radius: `var(--border-radius-lg)`. Overflow hidden.

**Header bar:** `background: #002868`, padding 12px 16px, flex row space-between.
- Left: "Texas market snapshot · Q2 2026" — 12px, font-weight 500, white
- Right: "Full Texas Insider →" link — 11px, `#C9A84C`, links to `/texas/texas-insider`

**Three-column data row** (grid-template-columns: repeat(3, 1fr), border-right `0.5px solid var(--color-border-tertiary)` between columns):

Each cell: padding 12px 16px.
- Label: 10px, letter-spacing 1px, uppercase, muted
- Value: 16px, font-weight 500, `#002868`
- Sub: 11px, muted, margin-top 2px

| Label | Value | Sub |
|---|---|---|
| Austin median | $460,000 | Buyer's market · -16% from peak |
| DFW median | $375,000 | #1 market to watch nationally |
| Houston median | $270,000 | Most affordable major metro |

---

## Mobile Responsive (md: breakpoint and below)

- Hero: stack vertically — image first (height 220px), then text below
- CTA row: primary button full-width, secondary link centered below
- Trust stats: 2×2 grid
- Proof strip: 2×2 grid
- How it works steps: 2×2 grid
- Market snapshot: single column stack

---

## Color Application Summary

| Element | Color |
|---|---|
| Nav background | `#002868` |
| Nav "Begin My Journey" button | white bg, `#002868` text |
| Eyebrow rules | `#BF0A30` |
| Headlines | `#002868` |
| Headline accent ("Lone Star State.") | `#BF0A30` |
| Primary CTA button | `#002868` bg, white text |
| Secondary link | `#002868` |
| Trust stat numbers | `#002868` |
| Flag stripe | red / white / navy |
| Proof strip background | `#002868` |
| Proof strip icons | `#C9A84C` |
| Red rule | `#BF0A30` |
| Step card top border | `#002868` |
| Step numbers | `#BF0A30` |
| Step titles | `#002868` |
| Snapshot header | `#002868` |
| Snapshot values | `#002868` |
| Snapshot "Texas Insider" link | `#C9A84C` |
| Logo "Quest" | `#C9A84C` |

**Do NOT apply these colors to portal components.** Portal gold scheme is unchanged.

---

## What NOT to Change

- Portal components, layouts, or styles — untouched
- Everything below the new sections (existing city cards, testimonials, realtor section, footer)
- All existing routes and functionality
- Texas Insider pages — separate color system, untouched

---

## Final Step — Commit and Deploy

After changes are complete, tsc clean, and next build passes:

```
git add -A
git commit -m "feat: homepage hero redesign — Texas flag color system, split layout, proof strip, how it works, market snapshot"
git push origin main
```

Confirm push succeeded and Vercel deployment triggered. Report back to Claude chat when complete.
