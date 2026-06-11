# HavenQuest — Homepage & MM3 Batch Fixes Brief
**Date:** June 7, 2026  
**Prepared by:** Claude (COO)  
**Executed by:** Claude Code  
**Branch:** main  

---

## Overview

Seven fixes across the homepage and MM3. Execute all in one pass. Commit and push at the end.

---

## Fix 1 — Nav: Texas Designator + My Portal Gold

**File:** `components/shared/Header.tsx`

### Texas Designator
Immediately to the right of the HavenQuest logo wordmark, add a state identifier:

```jsx
<span style={{
  fontSize: '10px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: '#C5B783',
  fontWeight: 500,
  marginLeft: '10px',
  paddingLeft: '10px',
  borderLeft: '1px solid rgba(197,183,131,0.4)',
  lineHeight: 1
}}>
  Texas
</span>
```

This sits inline with the logo, separated by a thin gold vertical rule. Will be easy to swap to "Florida" etc. when other states are added.

### My Portal Gold
Find the "My Portal" nav link. Change its color from the current muted white/gray to `#C5B783`.

On hover: `white`.

---

## Fix 2 — Hero: "So, you're" Script Style

**File:** Homepage hero component

The "So, you're" italic line above the headline needs to feel handwritten/script — more stylized than a regular italic.

Import and apply Google Font **Dancing Script** for this element only:

Add to the page or layout file:
```html
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap" rel="stylesheet" />
```

Apply to the "So, you're" element:
```css
font-family: 'Dancing Script', cursive;
font-size: 28px;
font-weight: 600;
color: rgba(255,255,255,0.85);
font-style: normal; /* Dancing Script is already italic in character */
margin-bottom: 8px;
```

---

## Fix 3 — Hero: Trust Stats Dividers Centered

**File:** Homepage hero component

The vertical dividers between the trust stats (101 / 4 / 12 / Free) are not vertically centered.

Fix the trust stats row:
```css
display: flex;
align-items: center;
gap: 0;
```

Each stat item:
```css
display: flex;
flex-direction: column;
padding: 0 24px;
```
First stat: `padding-left: 0`. Last stat: `padding-right: 0`.

Each divider:
```css
width: 1px;
height: 32px;
background: rgba(255,255,255,0.25);
align-self: center;
flex-shrink: 0;
```

---

## Fix 4 — Below-Hero: Contained Layout (max-width 1080px)

**File:** Homepage — all sections below the hero

Wrap all content sections below the hero in a max-width container:
```css
max-width: 1080px;
margin: 0 auto;
padding: 0 40px;
```

Section background colors (white, #F3F5F8) still apply full-width — only the content inside is contained. This means each section has a full-width background div wrapping a contained inner div.

Apply this container pattern to:
- Statement section
- How It Works section
- Social proof section
- Market snapshot section

The footer stays full-width with its own internal padding.

---

## Fix 5 — Statement Section: Stronger Copy and Typography

**File:** Homepage statement section

### Layout
Two-column grid: `grid-template-columns: 1fr 1fr`, gap 60px, align-items start.
Padding: 56px 0 (inside the container).

### Left column
- Gold rule: `width: 36px; height: 2px; background: #C5B783; margin-bottom: 20px`
- H2 (28px, font-weight 700, `#0A1E3D`, line-height 1.3):
```
Texas is big.
Finding your place in it
shouldn't be a guessing game.
```

### Right column
Replace the current weak subhead with this stronger copy structure:

**Paragraph** (14px, muted, line-height 1.85, margin-bottom 24px):
```
You've made the decision. Now the real question is: which Texas is yours?
Whether you're drawn to the energy of a growing suburb, the charm of a historic small town, 
or the pulse of a major city — HavenQuest helps you find the community where your life 
actually fits. Not just the zip code with the right price tag.
```

**Four promise items** stacked below (flex column, gap 14px). Each item: flex row, gap 12px, align-items flex-start.

Icon box: 32×32px, border-radius 8px, `background: #F3F5F8`, `border: 0.5px solid var(--color-border-tertiary)`, Lucide icon in `#0076B6`, 15px.

| Icon | Label (13px, font-weight 600, #0A1E3D) | Description (12px, muted) |
|---|---|---|
| `BarChart2` | Matched to your life | Verified data across 12 lifestyle categories — not just home prices. |
| `UserCheck` | A real guide at your side | Your Market Director steps in personally at MileMarker 4. |
| `ShieldCheck` | Vetted local experts | Hand-picked Select Agents who specialize in your target market. |
| `Lock` | Your data stays yours | Nothing sold, nothing shared without your consent. Ever. |

---

## Fix 6 — How It Works: Editorial Style with Blue Step Rules

**File:** Homepage How It Works section

Keep the contained layout. Update the step cards:

Remove card borders and backgrounds — steps are open, no box styling.

Each step:
- Large muted number: 32px, font-weight 700, `#F3F5F8`, margin-bottom 10px
- Blue rule below number: `width: 24px; height: 2px; background: #0076B6; margin-bottom: 12px`
- Title: **H3**, 15px, font-weight 600, `#0A1E3D`, margin-bottom 8px
- Description: 12.5px, muted, line-height 1.65
- Step 1 only: add small link "Takes about 4 minutes →" in `#0076B6`, 12px, margin-top 10px

Separate steps with a right border (`0.5px solid var(--color-border-tertiary)`) and `padding-right: 28px`, `margin-right: 28px`. Last step: no border, no padding, no margin.

---

## Fix 7 — MM3: Annual Income Input Field

**File:** `components/portal/milemarkers/MM3Discover.tsx`

**Location:** Top of the "Adjust Your Financial Picture" collapsible section, above the Down Payment field.

**Add this field:**

Label: `Annual household income`
- Same label style as "Down payment" and "Home sale proceeds"

Input field:
- Pre-populated with the user's `annualIncome` from their profile (same value used in affordability calculations)
- Type: text with number formatting (display as `$185,000` format, store as number)
- Placeholder: `e.g. $150,000`
- Same visual style as the existing Down Payment exact amount input field
- Make it visually clear it's editable — add a small helper text below: `"Adjust if your income has changed since your initial assessment."`
- Helper text: 11px, muted, italic

**Wiring:**
- Store as local state: `const [incomeOverride, setIncomeOverride] = useState(profile?.annualIncome ?? 100000)`
- On change: parse the input value, update `incomeOverride` state
- Use `incomeOverride` in place of `profile?.annualIncome` for ALL downstream calculations:
  - Affordability percentage (`monthlyHousing / (incomeOverride / 12)`)
  - Affordability status (comfortable / moderate / stretched)
  - Price-to-income ratio (`topCityPrice / incomeOverride`)
  - All city ranking affordability dots
- Rankings and financial summary update in real time as the user types (use debounce of 300ms to avoid excessive recalculation)

**Do NOT save this override back to the database automatically** — only save when the user clicks "Lock my financials." At that point, save the `incomeOverride` value to `public.users` as `annual_income_override` (add this column if it doesn't exist, nullable integer).

---

## Final Step — Commit and Deploy

After all 7 fixes are complete, tsc clean, and next build passes:

```
git add -A
git commit -m "feat: nav Texas designator + My Portal gold, hero script font + divider fix, contained homepage layout, stronger statement copy, editorial how it works, MM3 income input"
git push origin main
```

Confirm push succeeded and Vercel deployment triggered. Report back to Claude chat when complete.
