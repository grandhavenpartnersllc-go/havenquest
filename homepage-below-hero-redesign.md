# HavenQuest — Homepage Below-Hero Redesign & Trust Stats Fix
**Date:** June 7, 2026  
**Prepared by:** Claude (COO)  
**Executed by:** Claude Code  
**Branch:** main  

---

## Overview

Two changes:
1. Fix the vertical dividers between the trust stats in the hero (101 / 4 / 12 / Free) — they are not vertically centered
2. Replace the below-hero sections with a warmer, more editorial layout

The hero itself (full-bleed couple photo, headline, subhead, CTA) is NOT changed.

---

## Fix 1 — Trust Stats Dividers

In the hero content layer, find the trust stats row (101 Texas communities / 4 Major metros / 12 Lifestyle categories / Free To start).

The vertical dividers between each stat must be vertically centered. Fix:
- Each divider: `width: 1px`, `height: 32px`, `background: rgba(255,255,255,0.25)`, `align-self: center`
- The stats row: `display: flex`, `align-items: center`, `gap: 0`
- Each stat item: `display: flex`, `flex-direction: column`, `padding: 0 24px`
- First stat: `padding-left: 0`
- Last stat: `padding-right: 0`

---

## Fix 2 — Below-Hero Sections (full replacement)

Replace everything between the hero and the footer with these sections in order. The footer stays exactly as-is.

---

### Section A — Gold Strip
```css
height: 3px;
background: #C5B783;
width: 100%;
```

---

### Section B — Warm Statement

Full-width, white background, `border-bottom: 0.5px solid var(--color-border-tertiary)`.
Padding: 52px 48px. Text centered.

**Gold rule:** `width: 40px; height: 2px; background: #C5B783; margin: 0 auto 20px`

**H2** (26px, font-weight 500, `#0A1E3D`, line-height 1.35, max-width 620px, centered):
```
Texas is big. Finding your place in it shouldn't be a guessing game.
```

**Subhead** (14px, muted, line-height 1.8, max-width 520px, centered):
```
Whether you're drawn to a thriving suburb, a charming small town, or the energy of a major city — HavenQuest helps you find the community that fits the life you actually want to live.
```

---

### Section C — Promise Strip (softer)

Full-width, `background: #F3F5F8`, `border-bottom: 0.5px solid var(--color-border-tertiary)`.
Four equal columns, `border-right: 0.5px solid var(--color-border-tertiary)` between each.

Each column: padding 22px 20px, flex column, gap 8px.

Icon box: 36×36px, border-radius 10px, `background: white`, `border: 0.5px solid var(--color-border-tertiary)`, Lucide icon in `#0076B6`, 17px.

| Icon | Label | Description |
|---|---|---|
| `BarChart2` | Matched to your life | Verified data across 12 lifestyle categories — not just home prices. |
| `UserCheck` | A real guide at your side | Your Market Director steps in personally at MileMarker 4. |
| `ShieldCheck` | Vetted local experts | Hand-picked Select Agents who specialize in your target market. |
| `Lock` | Your data stays yours | Nothing sold, nothing shared without your consent. Ever. |

Label: 13px, font-weight 500, `#0A1E3D`.
Description: 12px, muted, line-height 1.5.

---

### Section D — How It Works (editorial)

Full-width, white background, `border-bottom: 0.5px solid var(--color-border-tertiary)`.
Padding: 52px 48px.

**Section header row** (flex, align-items baseline, gap 16px, margin-bottom 36px):
- Eyebrow: `HOW IT WORKS` — 11px, letter-spacing 2px, uppercase, `#C5B783`
- Rule: flex 1, height 0.5px, `var(--color-border-tertiary)`

**Four steps** (grid-template-columns: repeat(4,1fr), no gap — use padding and borders instead):

Each step: `padding: 0 28px 0 0`, `border-right: 0.5px solid var(--color-border-tertiary)`, `margin-right: 28px`. Last step: no border, no padding, no margin.

| Step | Title | Description | Note |
|---|---|---|---|
| 01 | Tell us about your life | Income, household size, and the lifestyle priorities that matter most — from schools and safety to walkability and outdoor access. | Add small link: "Takes about 4 minutes →" in `#0076B6`, 12px, margin-top 12px |
| 02 | Get your Texas matches | We rank 101 Texas communities against your priorities and budget. Your top matches are waiting — with full reports inside your portal. | — |
| 03 | Explore and refine | Adjust your financial picture, shift your priorities, and watch your rankings respond in real time. No pressure — just clarity. | — |
| 04 | Meet your Market Director | A real person steps in — reviews your full profile, answers your questions, and introduces you to a vetted Select Agent who knows your market. | — |

Step number: 36px, font-weight 700, `#F3F5F8` (very light — decorative only), line-height 1, margin-bottom 12px.
Title: 15px, font-weight 500, `#0A1E3D`, margin-bottom 8px, line-height 1.3.
Description: 12.5px, muted, line-height 1.65.

---

### Section E — Social Proof

Full-width, `background: #F3F5F8`, `border-bottom: 0.5px solid var(--color-border-tertiary)`.
Padding: 52px 48px.

**Section header row** (flex, align-items baseline, gap 16px, margin-bottom 32px):
- Eyebrow: `WHAT PEOPLE ARE SAYING` — 11px, letter-spacing 2px, uppercase, `#C5B783`
- Rule: flex 1, height 0.5px, `var(--color-border-tertiary)`

**H2** (22px, font-weight 500, `#0A1E3D`, margin-bottom 28px):
```
Built for anyone ready to make Texas home.
```

**Three review cards** (grid-template-columns: repeat(3,1fr), gap 16px):

Each card: white background, `border: 0.5px solid var(--color-border-tertiary)`, border-radius `var(--border-radius-lg)`, padding 24px, `border-top: 2px solid #C5B783`.

| Stars | Quote | Reviewer | Origin |
|---|---|---|---|
| ★★★★★ | "I had no idea where to even start with Texas. HavenQuest narrowed it down to three communities that actually fit our life. We're under contract in Round Rock and couldn't be happier." | Sarah M. | Relocating from Chicago, IL |
| ★★★★★ | "Our Market Director was with us every step of the way. From our first city match to closing day, we never felt lost or overwhelmed. This is how moving should work." | David & Karen T. | Relocating from Denver, CO |
| ★★★★★ | "I was skeptical that an online platform could really understand what I was looking for. HavenQuest proved me wrong. Plano checked every box." | Marcus R. | Relocating from Atlanta, GA |

Stars: `#C5B783`, 13px, letter-spacing 3px, margin-bottom 14px.
Quote: 13px, muted, italic, line-height 1.75, margin-bottom 18px.
Reviewer name: 13px, font-weight 500, `#0A1E3D`.
Origin: 11px, muted, margin-top 2px.
Add code comment: `{/* TODO: Replace sample reviews with real beta feedback */}`
Add small "Sample review" tag bottom-right: 10px, muted, opacity 0.4.

---

### Section F — Market Snapshot (soft cards)

Full-width, white background.
Outer padding: 0 48px 40px.

**Section header row** (flex, align-items baseline, gap 16px, padding 36px 0 20px, border-bottom `0.5px solid var(--color-border-tertiary)`, margin-bottom 20px):
- Eyebrow: `TEXAS MARKET SNAPSHOT · Q2 2026` — 11px, letter-spacing 2px, uppercase, `#C5B783`
- Rule: flex 1, height 0.5px, `var(--color-border-tertiary)`
- Link: "Full Texas Insider →" — 12px, `#0076B6`, links to `/texas/texas-insider`

**Three city cards** (grid-template-columns: repeat(3,1fr), gap 16px):

Each card: padding 20px, `border: 0.5px solid var(--color-border-tertiary)`, border-radius `var(--border-radius-lg)`, `background: #F3F5F8`.

| City | Price | Sub | Badge |
|---|---|---|---|
| Austin | $460,000 | Most corrected major market · -16% from peak | Buyer's market (amber — `#B45309` text, `#FEF3C7` bg) |
| Dallas-Fort Worth | $375,000 | #1 market to watch nationally · PwC/ULI | Rebalancing (amber) |
| Houston | $270,000 | Most affordable major Texas metro | Buyer's market (green — `#3B6D11` text, `#EAF3DE` bg) |

City name: 13px, font-weight 500, `#0A1E3D`, margin-bottom 6px.
Price: 24px, font-weight 500, `#0A1E3D`, margin-bottom 4px.
Sub: 12px, muted, line-height 1.4.
Badge: 10px, padding 2px 8px, border-radius 4px, border 0.5px, margin-top 8px, display inline-block.

---

## What NOT to Change

- Hero (full-bleed image, headline, subhead, CTA) — untouched except trust stat divider fix
- Footer — untouched
- All portal components — untouched
- Texas Insider pages — untouched

---

## Final Step — Commit and Deploy

After changes complete, tsc clean, next build passes:

```
git add -A
git commit -m "feat: homepage below-hero redesign — warm editorial layout, soft promise strip, editorial how it works, soft market snapshot; fix trust stat dividers"
git push origin main
```

Confirm push and Vercel deployment. Report back to Claude chat when complete.
