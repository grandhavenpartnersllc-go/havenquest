# Build Brief — Nav Simplification + Begin Page Rewrite
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Execute — UI and copy changes
**Priority:** Medium — UX improvement, not blocking
**Report back:** Confirm all changes complete, commit and push to main

---

## Change 1 — Simplify the Top Navigation

**File:** `components/shared/Header.tsx`

### Remove these nav links entirely:
- Explore Texas → /explore-texas
- Metro Mode → /metro-start
- Methodology → /methodology

### Keep these two only:
- My Portal → /portal
- Begin My Journey → /journey (change to /begin — see note below)

### Fix the Begin My Journey destination:
The nav "Begin My Journey" currently links to /journey.
Change it to link to /begin — same as the hero button.
Both CTAs should point to the same place.

### Result:
Two items in the nav: **My Portal** and **Begin My Journey**
Clean, simple, no clutter.

---

## Change 2 — Rewrite the /begin Page

**File:** `app/begin/page.tsx`

### Page headline:
Change to something warm and direct. Suggested:
```
Where are you in your Texas journey?
```
Or keep it simple:
```
Let's get started.
```
Use whatever fits the existing visual style best.

### Two path cards — rewrite copy:

**Card 1 — Explorer path (currently "I'm not sure where in Texas yet")**
- New headline: `I'm still exploring`
- New subtext: `Help me find the right Texas community based on my lifestyle, budget, and priorities.`
- CTA button: `Find My Match` → /explore (keep existing route)

**Card 2 — Metro Mode path (currently "I already know my metro")**
- New headline: `I know where I'm headed`
- New subtext: `I have a market in mind. Take me straight there.`
- CTA button: `Choose My Market` → /metro (keep existing route)

---

## Change 3 — Add Name + ZIP Capture After Path Selection

After the user clicks either path card on /begin, before they land on
/explore or /metro, intercept them with a brief personalization screen.

### Option A — Add as a step within /begin (preferred)
Show the two path cards first. When the user clicks one, the page
transitions to show a two-field form before redirecting.

### Option B — Create a new /start page as an interstitial
/begin → user clicks path → /start?path=explore or /start?path=metro
→ /start shows the name + ZIP form → redirects to /explore or /metro

Use whichever approach fits the existing code structure better.

### The name + ZIP screen:

**Headline:** `Before we begin — tell us a little about your move.`

**Field 1:**
- Label: `Your first name`
- Placeholder: `Jennifer`
- Required

**Field 2:**
- Label: `ZIP code you're moving from`
- Placeholder: `60614`
- Required
- Input type: text (not number — allows leading zeros)
- Validate: 5 digits only

**Continue button:** `Let's Go →`

### On submit:
- Store first_name in sessionStorage under key `hq_first_name`
- Store origin_zip in sessionStorage under key `hq_origin_zip`
- Also write both to localStorage session object if hq_session exists
- Redirect to the path the user selected (/explore or /metro)

### Pre-population at email gate:
The email gate (EmailGate.tsx) currently has a first name field.
After this change, that field should pre-populate from
sessionStorage `hq_first_name` if available.
The user can edit it — just pre-fill it so they don't have to
type their name twice.

---

## Change 4 — Retire /journey page

**File:** `app/journey/page.tsx`

The /journey page is a duplicate of /begin and is no longer needed.

Add a redirect at the top of app/journey/page.tsx:
```javascript
import { redirect } from 'next/navigation'
export default function JourneyPage() {
  redirect('/begin')
}
```

This preserves any existing links or bookmarks pointing to /journey
without leaving a dead page.

---

## Do Not Change
- /explore route and its quiz flow
- /metro route and its metro mode flow
- /explore-texas and /metro-start pages (leave in place for now —
  they may be linked from other places. Just remove them from the nav.)
- Portal, login, auth flows
- Any other pages not mentioned above

---

## Acceptance Criteria

- [ ] Nav shows only My Portal and Begin My Journey
- [ ] Both Begin My Journey buttons (nav + hero) link to /begin
- [ ] /begin page shows updated copy — two clear path cards
- [ ] Clicking a path card shows name + ZIP screen before redirecting
- [ ] Name pre-populates at email gate from sessionStorage
- [ ] /journey redirects to /begin
- [ ] tsc --noEmit clean
- [ ] Commit and push to origin/main
- [ ] Vercel deployment confirmed

---

## Commit and Deploy

After all changes confirmed and tsc --noEmit clean:

```
git add components/shared/Header.tsx app/begin/page.tsx app/journey/page.tsx
git add components/results/EmailGate.tsx
git add [any additional files changed]
git commit -m "feat: simplify nav to two items, rewrite begin page copy, add name+ZIP capture, redirect journey to begin"
git push origin main
```

Confirm push completed — paste commit hash.
Vercel auto-deploys from main in 60-90 seconds.
