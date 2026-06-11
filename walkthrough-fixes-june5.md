# HavenQuest — Walkthrough Fix Brief
**Date:** June 5, 2026  
**Prepared by:** Claude (COO)  
**Executed by:** Claude Code  
**Branch:** main  

---

## Overview

Seven fixes identified during live walkthrough. Execute in order. Commit and push to origin/main after all fixes are complete.

---

## Fix 1 — Teaser Results Page: Layout and Copy

**File:** The teaser results page component (search for `TOP PICK` or `#1 TOP PICK` label to locate)

**Problems:**
- 3 cards not rendering in a single horizontal row on all screen sizes
- Header copy is centered and too light — feels informal
- Page lacks the weight of a real results page

**Changes:**

1. Ensure all 3 city cards render in a single horizontal row (`flex-row`, no wrapping). Card 1 fully visible, Cards 2 and 3 blurred with lock overlay. This should already be built — verify it is rendering correctly on desktop.

2. Replace the existing header copy block with this exact copy and styling:

```
Section label (gold, uppercase, small tracking):
YOUR RESULTS

H1 headline (dark, bold, left-aligned, large):
Here are your top Texas matches.

Subheadline (dark gray, left-aligned, normal weight):
Based on your income, household, and priorities — this is where your life fits in Texas right now. Your full Navigator report goes much deeper.
```

3. Left-align the entire header block. Remove center alignment.

4. The italic teaser note below the cards ("We're just getting started...") — make it left-aligned, slightly larger, and darker. Not italic — use normal weight. Keep the copy as-is.

---

## Fix 2 — MM1: "What Makes HavenQuest Different" Section

**File:** MM1 welcome component (search for `What Makes HavenQuest Different` or `WHAT MAKES HAVENQUEST DIFFERENT`)

**Problems:**
- Three differentiator cards (Your data is yours / A real person joins you / Nothing falls through the cracks) float on the page with no visual container
- Headers are too light

**Changes:**

1. Wrap all three cards in a single container with:
   - Background: `#F0EBE1` (warm tan, slightly darker than page background)
   - Border: `1px solid #D4C5A9`
   - Border radius: `12px`
   - Padding: `32px`

2. Make each card header (`Your data is yours`, `A real person joins you`, `Nothing falls through the cracks`) bold and slightly larger — `font-weight: 700`, `font-size: 1rem` minimum.

3. Add the section label above the container:
```
WHAT MAKES HAVENQUEST DIFFERENT
```
In gold, uppercase, small tracking — same style as other section labels. If it already exists, ensure it sits outside and above the new container, not inside it.

---

## Fix 3 — MM1: Phase Divider Glitch

**File:** MM1 mock portal tab tour component (search for `Property Decision` or phase divider logic)

**Problem:**
A "Property Decision" label is floating over the nav bar between the Plan and Prepare tabs, blocking clicks on those tabs.

**Fix:**
Locate the phase divider element that renders the "Property Decision" label. Either:
- Remove it entirely if it serves no functional purpose in the current implementation, OR
- Ensure it is positioned below the nav bar, not overlapping it — `z-index` lower than the nav, or positioned within the tab content area not above the nav

The nav tabs (Welcome, Explore, Discover, Connect, Plan, Prepare, Match, Engage, Contract, Home) must all be fully clickable with no overlapping elements.

---

## Fix 4 — MM2: City Reveal Copy

**File:** MM2 Explore component (search for `Your preliminary Texas matches` or `YOUR FIRST LOOK`)

**Problem:**
The city reveal moment is flat. This is the first time the user sees places that could be their new home — the copy needs to match that emotional weight.

**Replace the existing header block with this exact copy:**

```
Section label (gold, uppercase, small tracking):
YOUR FIRST LOOK

H2 headline (dark, bold):
Meet your Texas matches.

Subheadline (dark gray, normal weight):
These communities rose to the top based on everything you told us. Take a look — one of these could be where you plant your flag.
```

**Replace the existing disclaimer block** (the gold-bordered callout at the bottom of the cards) with:

```
These are your starting point — and they're a good one. In MileMarker 3, you'll dial these in with your full financial picture and priorities. Your Market Director will take it from there.
```

Keep the gold left-border styling on the callout. Just update the copy.

---

## Fix 5 — MM2: Budget Fit Indicator Overlapping Print Button

**File:** MM2 city report tab component (search for `Budget Fit` or `BUDGET FIT` label near Print button)

**Problem:**
The Budget Fit indicator (green dot + "Comfortable" label) is positioned in the upper right of the report header, directly overlapping the Print button.

**Fix:**
Move the Budget Fit indicator. Place it immediately below the city name / above the report body — left-aligned, not in the top-right corner. The top-right corner of the report header should contain only the Print and Download buttons with clear space around them.

---

## Fix 6 — MM3: City Selection — Limit, Button Visibility, Instructions

**File:** MM3 Discover component (search for `Choose` button or `max 2` or city selection logic)

**Changes:**

1. **Increase selection limit from 2 to 3.** Find every reference to the selection cap (likely `maxSelected === 2` or similar) and change to 3. Update any copy that references "up to 2 cities" to "up to 3 communities."

2. **Make the Choose button more prominent:**
   - Current: likely a small outlined button
   - Change to: solid gold background (`#C9A84C`), white text, bold, full-width or significantly wider than current, border radius `8px`
   - Button label: `Choose This Community`

3. **Add selection instructions** above the city rankings list. Insert this copy in a clearly visible callout (light gold background, gold border, `12px` border radius):

```
Choose up to 3 communities you want to explore.
Hit "Choose This Community" on any city card to select it. Your selections tell your Market Director exactly where to focus.
```

4. **Selected state:** When a city is chosen, the card should show a clear gold checkmark or "✓ Selected" badge so the user has no doubt their selection registered. Ensure this is visually distinct and obvious.

---

## Fix 7 — MileMarker Write to Supabase (current_milemarker not saving)

**Files:** Portal MileMarker components, Supabase write logic (search for `current_milemarker` writes)

**Problem:**
The `current_milemarker` field in `public.users` is staying at 1 regardless of how far the user advances through the Navigator. The RLS UPDATE policy fix from a previous commit (`a5d450e`) did not resolve this in production.

**Diagnosis steps:**
1. Check the Supabase client write for `current_milemarker` — confirm it is being called with `await` and that errors are being caught and logged
2. Confirm the RLS UPDATE policy on `public.users` allows authenticated users to update their own record. The policy should be: `USING (auth.uid() = id)` with `WITH CHECK (auth.uid() = id)`
3. Confirm the user's `id` column in `public.users` matches `auth.uid()` — if the table uses `email` as the primary key instead of the Supabase auth UUID, the RLS policy will always fail silently
4. Add console logging temporarily: log the result and error of every `current_milemarker` write so we can see in the browser console whether the write is succeeding or failing

**Fix:**
Once the failure point is identified, correct it. The expected behavior: every time a user advances to a new MileMarker, `current_milemarker` updates in Supabase. On next login, the portal reads `current_milemarker` and restores the user to the correct MM.

If the RLS policy is the issue, provide the exact SQL to run in the Supabase dashboard SQL editor.

---

## Final Step — Commit and Deploy

After all 7 fixes are complete and verified locally:

```
git add -A
git commit -m "fix: walkthrough fixes — teaser layout, MM1 differentiators, MM1 phase divider, MM2 city reveal copy, MM2 budget fit position, MM3 city selection UX, milemarker Supabase write"
git push origin main
```

Confirm push succeeded and Vercel deployment triggered. Report back to Claude chat when complete.
