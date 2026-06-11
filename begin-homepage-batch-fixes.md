# HavenQuest — Begin Page & Homepage Batch Fixes Brief
**Date:** June 7, 2026  
**Prepared by:** Claude (COO)  
**Executed by:** Claude Code  
**Branch:** main  

---

## Overview

Five fixes across the homepage and /begin flow. Execute all in one pass.

---

## Fix 1 — Homepage: Tagline alongside eyebrow

**File:** Homepage statement section

The current eyebrow reads: `WELCOME TO THE LONE STAR STATE`

Keep that eyebrow label exactly as-is. Directly below it, add the official HavenQuest tagline as a second line:

```
We don't help you pick a house. We help you find a home.
```

Style:
- Font-size: 15px
- Font-weight: 500
- Color: `#0A1E3D`
- Font-style: italic
- Margin-top: 6px
- Margin-bottom: 20px (replaces the existing margin-bottom on the eyebrow)

The two lines together read as:
```
WELCOME TO THE LONE STAR STATE
We don't help you pick a house. We help you find a home.
```

---

## Fix 2 — /begin page: Placeholder name change

**File:** The /begin page quiz component (search for "Jennifer")

Find every instance of the placeholder name "Jennifer" and replace with "Craig".

---

## Fix 3 — /begin page: Mobile auto-scroll on question advance

**File:** The /begin page quiz component

When a user taps/clicks a question and the next question animates open, the page must automatically scroll down to bring the newly revealed question into view on mobile.

After the next question becomes visible (after any open/reveal animation completes), call:

```javascript
nextQuestionRef.current?.scrollIntoView({ 
  behavior: 'smooth', 
  block: 'start' 
})
```

Or use `window.scrollTo` with the element's offset position plus a small offset (e.g. -80px to account for the sticky nav).

Apply this scroll behavior whenever a new question section is revealed — not just on mobile, but on all screen sizes. It improves the experience universally.

---

## Fix 4 — /begin flow: Add Step 0 Welcome/Intent Screen

**File:** The /begin page quiz flow

Before any quiz questions are shown, add a new Step 0 screen that appears first when a user arrives at /begin. This is a welcome and intent confirmation screen.

### Layout

Clean, centered, max-width 600px, white background. No quiz question UI — just a welcoming intro card.

**Top section:**
- Gold eyebrow: `YOUR HAVENQUEST BEGINS HERE` — 11px, letter-spacing 2px, uppercase, `#C5B783`
- H1 (24px, font-weight 700, `#0A1E3D`, margin-bottom 12px):
```
Let's find your Texas.
```
- Subhead (15px, muted, line-height 1.8, margin-bottom 24px):
```
In the next few minutes, we'll ask you a few questions about your household, your income, and the lifestyle priorities that matter most to you. There are no wrong answers — just honest ones.
```

**What to expect section** (border: `0.5px solid var(--color-border-tertiary)`, border-radius 12px, padding 20px 24px, background `#F3F5F8`, margin-bottom 24px):

Label: `WHAT YOU'LL COVER` — 10px, letter-spacing 1.5px, uppercase, muted, margin-bottom 14px

Four items in a simple list (flex column, gap 10px). Each item: flex row, gap 10px, align-items center.
- Checkmark icon (Lucide `Check`, 14px, `#0076B6`) + text (13px, `#0A1E3D`)

| Item |
|---|
| Your household size and home preferences |
| Your annual household income |
| Your lifestyle priorities — schools, safety, walkability, and more |
| Your budget and down payment range |

**Next steps note** (13px, muted, line-height 1.7, margin-bottom 28px):
```
After you complete the assessment, you'll see your top Texas community matches — ranked by your priorities and budget. Create your free portal to unlock your full report and begin your Navigator journey.
```

**Checkbox confirmation** (flex row, gap 12px, align-items flex-start, margin-bottom 28px):

```jsx
<input 
  type="checkbox" 
  id="intent-confirm"
  checked={intentConfirmed}
  onChange={(e) => setIntentConfirmed(e.target.checked)}
  style={{ marginTop: 3, accentColor: '#0076B6', width: 18, height: 18 }}
/>
<label htmlFor="intent-confirm" style={{ fontSize: 15, fontWeight: 500, color: '#0A1E3D', cursor: 'pointer', lineHeight: 1.5 }}>
  Sounds good. I'm fixin' to become a Texan.
</label>
```

**CTA Button:**
- Text: `Let's get started →`
- Background: `#0076B6`
- Color: white
- Font-size: 15px, font-weight 500
- Padding: 14px 32px
- Border-radius: 8px
- **Disabled state** when checkbox is unchecked: `opacity: 0.45`, `cursor: not-allowed`, `pointer-events: none`
- **Enabled state** when checkbox is checked: full opacity, clickable
- On click: advance to Step 1 (first quiz question) AND save intent confirmation to Supabase

### Supabase — Save Intent Confirmation

When the user clicks "Let's get started" with the checkbox checked:

1. Check if a user record exists for this session (by email if already captured, or by session/anonymous ID)
2. If record exists: update `journey_intent_confirmed = true` and `journey_intent_confirmed_at = NOW()`
3. If no record yet: store in local state and write to Supabase when the email gate is completed

Add these columns to `public.users` if they don't exist:
```sql
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS journey_intent_confirmed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS journey_intent_confirmed_at timestamptz;
```

Run this in Supabase SQL editor and include in a migration file at `supabase/migrations/` with today's date.

### Step numbering

The existing quiz steps (household, income, priorities, etc.) remain unchanged. Step 0 is purely a pre-quiz welcome screen — it does not count as a numbered quiz step in the progress indicator.

---

## Final Step — Commit and Deploy

After all fixes complete, tsc clean, next build passes:

```
git add -A
git commit -m "feat: homepage tagline, begin page Step 0 welcome screen with intent checkbox, mobile scroll fix, placeholder name fix"
git push origin main
```

Confirm push and Vercel deployment. Report back to Claude chat when complete.
