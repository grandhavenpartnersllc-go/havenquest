# Build Brief — MM1 Welcome Page Revision

## Objective
Remove the "Your First Look" city section from MM1 and replace it with richer orientation content that walks the client through the Navigator process. MM2 already shows city matches — MM1 should be pure orientation and context.

---

## Step 1 — Read Current MM1
Read app/portal/mm1/page.tsx completely. Report:
- Every section currently on the page
- The exact component or JSX block that renders "Your First Look" or city cards
- Any data fetching tied to city matches on this page

---

## Step 2 — Remove City Section
Remove the "Your First Look" section and any associated city card components or data fetching from MM1. Do not touch MM2.

---

## Step 3 — Replace With Orientation Content
Replace the removed section with the following content. Match the existing MM1 styling patterns — use the same heading styles, section labels, and spacing already in use on the page.

### Section: WELCOME TO YOUR NAVIGATOR
Heading (large, brand blue): Welcome, [First Name]. Your Texas journey starts here.

Body copy:
"This is your private HavenQuest Navigator — your home base for the entire relocation process. Everything you do here is saved, your progress is tracked, and your team works alongside you from right here."

---

### Section: HOW YOUR JOURNEY WORKS
Section label: HOW YOUR JOURNEY WORKS

Intro line: "Your journey unfolds across 10 MileMarkers. Each one has a clear purpose, a set of actions, and the right people in place to help you move forward."

Render a clean styled table or card grid showing all 10 MileMarkers:

| MileMarker | Name | What Happens |
|---|---|---|
| MM1 | Welcome | You're here — get oriented |
| MM2 | Explore | Review your matched Texas communities |
| MM3 | Decide | Commit to your target city |
| MM4 | Connect | Meet your Market Director |
| MM5 | Plan | Build your relocation strategy |
| MM6 | Prepare | Get financially and logistically ready |
| MM7 | Match | Meet your HavenQuest Select Agent |
| MM8 | Engage | Start your home search |
| MM9 | Contract | Go under contract |
| MM10 | Home | Close and celebrate |

Style the current MileMarker (MM1) as highlighted/active. Style completed MileMarkers differently from upcoming ones.

---

### Section: WHAT'S WAITING FOR YOU
Section label: WHAT'S WAITING FOR YOU

Body copy:
"Your city matches are ready in MM2. They were built from everything you told us — your income, your household, your priorities. Take your time reviewing them. There's no rush."

CTA line (styled as a prompt, not a button):
"When you're ready, click Explore in the left nav to see where your life fits in Texas. →"

Style the word "Explore" as a clickable link that navigates to /portal/mm2.

---

## Step 4 — Remove Any Unused Imports
After removing the city section, clean up any unused imports or data fetching calls that were only used by the removed section.

---

## Step 5 — Commit and Deploy
```
git add -A
git commit -m "feat: MM1 Welcome — remove city preview, add full Navigator orientation content"
git push origin main
```

Confirm Vercel deployment triggered. Report commit hash.

---

## Report Back
- Sections removed
- Sections added
- Any unused imports cleaned up
- Git commit hash
