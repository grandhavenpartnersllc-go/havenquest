# HavenQuest — Homepage Sections 2 & 3 Redesign Brief
**Date:** June 7, 2026  
**Prepared by:** Claude (COO)  
**Executed by:** Claude Code  
**Branch:** main  

---

## Overview

Two section updates on the homepage. Everything else stays as-is.

---

## Fix 1 — "So, you're" Font

**File:** Homepage hero component

Remove the Dancing Script Google Font import. Replace with:

```css
font-family: Georgia, 'Times New Roman', serif;
font-style: italic;
font-size: 26px;
font-weight: 400;
color: rgba(255,255,255,0.85);
margin-bottom: 8px;
```

Clean, classic, editorial — not handwritten.

---

## Section 2 — Statement + Promise Blocks (full replacement)

**File:** Homepage statement section

### Layout
Single column, full width within the container. White background. Padding: 60px 0 48px. Border-bottom: `0.5px solid var(--color-border-tertiary)`.

### Top block (headline + description)
**Gold rule:** `width: 36px; height: 2px; background: #C5B783; margin-bottom: 20px`

**H2** (36px, font-weight 700, `#0A1E3D`, line-height 1.25, max-width 640px, margin-bottom 12px):
```
Texas is big. Finding your place
in it shouldn't be a guessing game.
```

**Description paragraph** (16px, muted, line-height 1.8, max-width 680px, margin-bottom 48px):
```
You've made the decision. Now the real question is: which Texas is yours? Whether you're drawn to the energy of a growing suburb, the charm of a historic small town, or the pulse of a major city — HavenQuest helps you find the community where your life actually fits. Not just the zip code with the right price tag.
```

### Promise blocks row
Four equal blocks in a grid: `grid-template-columns: repeat(4,1fr)`, gap 20px.

Each block:
- Background: `#F3F5F8`
- Border: `0.5px solid var(--color-border-tertiary)`
- Border-radius: 12px
- Padding: 24px 20px
- Border-top: `2px solid #0076B6`

Each block contains:

**Icon box** (44×44px, border-radius 10px, white background, `border: 0.5px solid var(--color-border-tertiary)`, margin-bottom 16px):
- Lucide icon, 20px, color `#0076B6`

**Title** (H3, 15px, font-weight 700, `#0A1E3D`, margin-bottom 8px, line-height 1.3)

**Description** (13px, muted, line-height 1.65)

| Icon | Title | Description |
|---|---|---|
| `BarChart2` | Matched to your life | We score every Texas community across 12 lifestyle categories — schools, safety, walkability, weather, healthcare, and more — weighted by what matters most to you. |
| `UserCheck` | A real guide at your side | At MileMarker 4, your personal Market Director steps in. They've already read your full profile and are ready to guide you — not sell you — the rest of the way. |
| `ShieldCheck` | Vetted Select Agents | Every Select Agent in the HavenQuest network is hand-picked for your market. They're not leads — they're specialists who know your target communities inside and out. |
| `Lock` | Your data stays yours | Everything you share powers your personal experience. Nothing is sold. Nothing is shared without your consent. Your profile is private by default — always. |

---

## Section 3 — How It Works (navy background)

**File:** Homepage How It Works section

### Container
Full-width section. Background: `#0A1E3D`. Padding: 56px 0.

### Section header row (inside container, flex, align-items center, gap 16px, margin-bottom 40px):
- Eyebrow: `HOW IT WORKS` — 11px, letter-spacing 2px, uppercase, `#C5B783`
- Rule: flex 1, height 0.5px, `rgba(255,255,255,0.15)`

### Four steps (grid-template-columns: repeat(4,1fr), no gap)

Each step separated by: `border-right: 0.5px solid rgba(255,255,255,0.1)`

Step padding: `padding-right: 32px`. Steps 2-4: `padding-left: 32px`. Last step: no border-right, no padding-right.

**Step number** (48px, font-weight 700, `rgba(255,255,255,0.18)` — slightly more opaque than before so numbers are subtly visible, line-height 1, margin-bottom 8px)

**Gold rule** (`width: 24px; height: 2px; background: #C5B783; margin-bottom: 16px`)

**Title** (H3, 16px, font-weight 600, white, margin-bottom 10px, line-height 1.3)

**Description** (13px, `rgba(255,255,255,0.6)`, line-height 1.7)

**Step 1 only — add link below description:**
- Text: "Takes about 4 minutes →"
- Color: `#C5B783`
- Font-size: 12px
- Margin-top: 12px

| Number | Title | Description |
|---|---|---|
| 01 | Tell us about your life | Income, household size, and the lifestyle priorities that matter most to you — from top-rated schools and safety to walkability and outdoor access. |
| 02 | Get your Texas matches | We rank 101 Texas communities against your priorities and budget. Your top matches are ready — with full reports waiting inside your private portal. |
| 03 | Explore and refine | Adjust your financial picture, shift your priorities, and watch your rankings respond in real time. No pressure — just clarity about where you actually fit. |
| 04 | Meet your Market Director | A real person steps in — reviews your full profile, answers your questions, and introduces you to a vetted Select Agent who knows your market cold. |

---

## What NOT to Change

- Hero (image, headline, CTA, trust stats)
- Nav
- Social proof section
- Market snapshot section
- Footer
- All portal components — untouched

---

## Final Step — Commit and Deploy

After changes complete, tsc clean, next build passes:

```
git add -A
git commit -m "feat: homepage sections 2+3 redesign — promise blocks full width, navy how it works, Georgia italic So you're, richer copy"
git push origin main
```

Confirm push and Vercel deployment. Report back to Claude chat when complete.
