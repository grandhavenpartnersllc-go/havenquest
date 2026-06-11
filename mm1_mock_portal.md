# Build Brief — MM1 Mock Portal Orientation with Tabs
**Date:** June 4, 2026
**For:** Claude Code
**Type:** Execute — rewrite MM1 orientation UI
**Priority:** Medium
**Report back:** Confirm all changes complete, commit and push to main

---

## Overview

MM1 (Welcome) currently shows a vertical stacked list of MileMarker
cards explaining the journey. Replace this with an interactive mock
portal that looks and feels like the real portal the client will use
throughout their journey. Each of the 10 MileMarkers is a clickable
tab. Clicking a tab shows a brief orientation explanation for that
stage. This builds familiarity with the portal interface before
the client advances to MM2.

---

## Design Spec

### The Mock Portal Container
Style the orientation section to look like the actual portal:
- Dark nav bar at top matching the real portal nav (#16120D background)
- "HavenQuest NAVIGATOR" wordmark in the nav — same styling as the
  real portal nav (Haven in #E8E2D9, Quest in #B8912A, NAVIGATOR
  in small gold tracked caps)
- Tab bar below the nav showing all 10 MileMarkers
- Content area below showing the active tab's explanation

### The Tab Bar
10 tabs in order:
1. Welcome
2. Explore
3. Discover
4. Connect
5. Plan
6. Prepare
7. Match
8. Engage
9. Contract
10. Home

Tab styling:
- Default tab: small text, muted color (#9A8E82), no background
- Active tab: gold text (#B8912A), gold bottom border (2px),
  slightly brighter
- Locked tabs (MM4 onward): show a small lock icon before the
  label — these are visible but grayed out more heavily (#6B6560)
  to indicate they unlock as the journey progresses
- MM1 (Welcome) is active by default on load
- Tabs are clickable — clicking any tab switches the content area

Tab bar should scroll horizontally on mobile if needed.

### Content Area — Per Tab Copy

**Tab 1 — Welcome (active on load)**
Icon: 🏠
Headline: Welcome to your Navigator.
Body: This is your private HavenQuest portal — your home base for
the entire relocation journey. Everything you do here is saved and
waiting for you when you come back. Start by exploring your Texas
city matches in the next step.
Role badge: Your first step

**Tab 2 — Explore**
Icon: 🔍
Headline: Discover your top Texas matches.
Body: Answer four quick questions about your income, household,
financial picture, and priorities. The HavenQuest intelligence
platform scores all 101 Texas communities and surfaces your top
matches — the places where your life genuinely fits.
Role badge: You + the platform

**Tab 3 — Discover**
Icon: 🗺️
Headline: Refine your direction.
Body: Dig deeper into your matches. Adjust your priorities and
financial picture in real time and watch how your rankings change.
Choose up to 2 communities to highlight. When you're ready,
commit your direction and your Market Director steps in.
Role badge: You + the platform

**Tab 4 — Connect**
Icon: 🤝
Headline: Meet your Market Director.
Body: Your personal Market Director reviews your full profile and
reaches out within 24 hours. They know your priorities, your
budget, and your target communities before the first call. This
is where the human guidance begins.
Role badge: Market Director

**Tab 5 — Plan**
Icon: 📋
Headline: Narrow your communities.
Body: Your Market Director helps you refine your shortlist to
specific neighborhoods and introduces you to a lender for
pre-qualification. By the end of this stage you know exactly
where you're headed and what you can spend.
Role badge: You + Market Director

**Tab 6 — Prepare**
Icon: 🏘️
Headline: Meet your Select Agent.
Body: Your Market Director personally introduces you to a vetted
HavenQuest Select Agent in your target market. They've already
read your profile. Your first conversation picks up where your
Market Director left off.
Role badge: Market Director + Select Agent

**Tab 7 — Match**
Icon: 🔑
Headline: Find your home.
Body: Your Select Agent schedules showings in your target
communities. Properties you tour appear in your Property Decision
Workspace — with financial comparisons, lifestyle alignment scores,
and space for your notes and theirs.
Role badge: Select Agent + Market Director

**Tab 8 — Engage**
Icon: 📝
Headline: Make your move.
Body: When you find the right home, your Select Agent prepares
and submits your offer. Your Market Director keeps your portal
checklist current and stays by your side through inspection,
appraisal, and option period decisions.
Role badge: Select Agent + Market Director

**Tab 9 — Contract**
Icon: 🗓️
Headline: Close with confidence.
Body: Your Market Director coordinates every piece of the closing
process — insurance, movers, utilities, school enrollment, change
of address. Nothing falls through the cracks. You arrive in Texas
prepared and ready.
Role badge: You + Market Director + Select Agent

**Tab 10 — Home**
Icon: ⭐
Headline: You're home in Texas.
Body: Your Market Director delivers your Welcome Home moment and
schedules a 30-day check-in to make sure everything is going well.
Your Lone Star Lifestyle™ begins here.
Role badge: Journey complete

### Role Badge Styling
Small pill below the headline:
- "You + the platform" — teal/green pill
- "Market Director" — gold pill
- "Select Agent" — blue pill
- "You + Market Director" — split green/gold pill or just list both
- "Journey complete" — dark pill with star

Use existing brand colors:
- Client/You: #1D9E75 (green)
- Market Director: #B8912A (gold)
- Select Agent: #185FA5 (blue)

### Phase Dividers
Add a subtle visual divider or label between MM5 and MM6 in the
tab bar to indicate the phase transition:
- Between MM5 and MM6: a thin vertical separator line with
  "→ Property Decision" label above MM6 in very small muted text
- Or simply a gap between the two groups

---

## What to Keep from Current MM1

Keep the existing MM1 welcome message and headline above the mock
portal — the "Welcome to your Navigator" intro copy that currently
exists. The mock portal sits below the intro text as the orientation
section.

Keep the advance button that moves the client to MM2. It should
sit below the mock portal, after they've had a chance to explore
the tabs.

---

## Acceptance Criteria

- [ ] Mock portal renders with dark nav bar matching real portal
- [ ] HavenQuest Navigator wordmark in mock nav
- [ ] All 10 MileMarker tabs visible and clickable
- [ ] MM1 tab active by default on load
- [ ] MM4+ tabs show lock icon
- [ ] Clicking any tab updates content area with that tab's copy
- [ ] Role badges render in correct colors
- [ ] Phase divider visible between MM5 and MM6
- [ ] Existing welcome copy and advance button preserved
- [ ] Looks consistent with real portal styling
- [ ] Mobile — tabs scroll horizontally
- [ ] tsc --noEmit clean

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add components/portal/milemarkers/MM1Explore.tsx
git add [any new component files created]
git commit -m "feat: MM1 mock portal orientation with 10 MileMarker tabs"
git push origin main
```

Confirm push — paste commit hash.
