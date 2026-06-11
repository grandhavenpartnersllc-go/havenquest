# HavenQuest Navigator Portal — Full UX Rebuild Brief

**Date:** June 11, 2026  
**Scope:** Replace the existing /portal with a full three-panel Navigator experience  
**Stack:** Next.js 14 App Router, TypeScript strict, TailwindCSS, Supabase, Framer Motion  
**Deploy:** Vercel via GitHub origin/main — commit and push after every phase  

---

## Overview

Replace the existing /portal page with a full-width, three-panel Navigator portal. The new design has three persistent sections: a left Journey Rail, a center Workspace, and a right Command Center. A top command bar spans the full width. A theme toggle (Light / Dark / System) is always accessible and persists to the user's Supabase record.

MM1–MM4 are functional. MM5–MM10 show informational placeholder workspaces describing what each stage is designed to do.

**Design references:**
- Dark theme: saved screenshot in project root as `portal-dark-reference.jpg`
- Light theme: saved screenshot in project root as `portal-light-reference.jpg`
- Brand colors: Navy `#0A1E3D`, Blue `#0076B6`, Gold `#C5B783`

---

## Critical Architecture Rules

1. Full viewport width — no max-width containers inside the portal shell
2. Three panels are ALWAYS visible — no collapsing on desktop
3. Journey Rail width: 200px fixed
4. Command Center width: 240px fixed
5. Workspace: flex-1, takes all remaining width
6. Portal height: 100vh — no full-page scroll, workspace panel scrolls internally
7. Theme is stored in `public.users` table column `theme_preference` (varchar: 'light' | 'dark' | 'system')
8. If `theme_preference` column does not exist, add it via migration before building
9. All components use CSS variables for colors — no hardcoded hex values except brand accents
10. TypeScript strict — no `any` types

---

## Phase 0 — Audit and Database Migration

**Before touching any UI files:**

### 0A — Codebase Audit
Read and report on:
- Current /portal page structure and all components it uses
- All Supabase queries in the portal (what data is fetched, what tables)
- Current auth flow and session handling
- Any existing CSS/Tailwind theme configuration
- Current routing structure under /portal

Report findings back to Claude chat before proceeding.

### 0B — Database Migration
Add `theme_preference` column to `public.users` if it does not exist:

```sql
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS theme_preference varchar(10) DEFAULT 'system';
```

Run via Supabase SQL editor. Confirm success before proceeding.

### 0C — Commit audit baseline
```
git add -A && git commit -m "audit: document existing portal before UX rebuild" && git push origin main
```

---

## Phase 1 — Portal Shell and Theme System

### 1A — Theme Provider

Create `/app/portal/providers/ThemeProvider.tsx`

```typescript
'use client'
// Reads theme_preference from user Supabase record
// Applies 'light' | 'dark' | 'system' to <html> data-theme attribute
// Exports useTheme() hook returning { theme, setTheme }
// setTheme saves to Supabase public.users.theme_preference
// System mode listens to window.matchMedia('(prefers-color-scheme: dark)')
// Wrap portal layout with this provider
```

### 1B — Global CSS Theme Variables

In `/app/portal/portal.css` (or global.css if already exists), define:

```css
/* Light theme — default */
[data-theme="light"], :root {
  --portal-bg: #f4f6f9;
  --panel-bg: #ffffff;
  --panel-border: #e2e6ea;
  --topbar-bg: #0A1E3D;
  --text-primary: #0A1E3D;
  --text-secondary: #8a93a0;
  --text-muted: #b0b8c1;
  --accent-blue: #0076B6;
  --accent-navy: #0A1E3D;
  --accent-gold: #C5B783;
  --accent-blue-light: #EBF5FB;
  --card-bg: #ffffff;
  --card-border: #e2e6ea;
  --active-row-bg: #EBF5FB;
  --active-row-border: #0076B6;
  --success-color: #2e7d32;
  --warning-color: #BA7517;
  --warning-bg: #FAEEDA;
  --warning-text: #633806;
}

/* Dark theme */
[data-theme="dark"] {
  --portal-bg: #0f1117;
  --panel-bg: #1a1d27;
  --panel-border: #2a2d3a;
  --topbar-bg: #0A1E3D;
  --text-primary: #e8eaf0;
  --text-secondary: #8a93a0;
  --text-muted: #4a5060;
  --accent-blue: #0076B6;
  --accent-navy: #0A1E3D;
  --accent-gold: #C5B783;
  --accent-blue-light: #0d2035;
  --card-bg: #1a1d27;
  --card-border: #2a2d3a;
  --active-row-bg: #0d2035;
  --active-row-border: #0076B6;
  --success-color: #4caf50;
  --warning-color: #EF9F27;
  --warning-bg: #2a1f0a;
  --warning-text: #FAC775;
}
```

### 1C — Portal Layout Shell

Replace `/app/portal/layout.tsx` with the three-panel shell:

```
/app/portal/
  layout.tsx          ← portal shell (three panels + topbar)
  page.tsx            ← redirects to /portal/mm1 or current MM
  providers/
    ThemeProvider.tsx
  components/
    TopCommandBar.tsx
    JourneyRail.tsx
    WorkspacePanel.tsx  ← wrapper, children swap per MM
    CommandCenter.tsx
```

**Layout structure (layout.tsx):**
```tsx
<ThemeProvider>
  <div style full viewport width and height, bg: var(--portal-bg), display flex flex-col>
    <TopCommandBar />
    <div style flex-1 overflow-hidden, display flex, flex-row>
      <JourneyRail />
      <WorkspacePanel>
        {children}  {/* MM workspace pages render here */}
      </WorkspacePanel>
      <CommandCenter />
    </div>
  </div>
</ThemeProvider>
```

**No max-width. No container. Full 100vw at all times.**

### 1D — Top Command Bar (`TopCommandBar.tsx`)

Height: 48px. Background: `var(--topbar-bg)` (#0A1E3D always — never changes with theme).

Left side:
- HavenQuest wordmark: "Haven" in white, "Quest" in #0076B6, font-size 17px, font-weight 500
- Separator pipe (rgba white 0.2)
- "Navigator Portal" label in rgba white 0.45, font-size 12px

Center: empty

Right side (left to right):
- Theme toggle: three buttons "Light" | "Dark" | "System" — active state has white text and rgba white 0.2 background, inactive is rgba white 0.55. Calls setTheme() on click.
- Icon buttons: bell, message, calendar, file, help — each rgba white 0.6, hover rgba white 1.0
- User avatar circle: initials from user first_name + last_name, background #0076B6, 30px diameter

### 1E — Commit Phase 1
```
git add -A && git commit -m "feat: portal shell, theme system, top command bar" && git push origin main
```

---

## Phase 2 — Journey Rail

File: `/app/portal/components/JourneyRail.tsx`

**Dimensions:** 200px fixed width, full height, background `var(--panel-bg)`, right border `0.5px solid var(--panel-border)`

**Data:** Read `current_milesmarker` from `public.users` where id = auth user id. This determines which MM is active and which are complete vs upcoming.

**MileMarker list:**

| MM | Label | Icon (active) | Icon (complete) | Icon (locked) |
|---|---|---|---|---|
| MM1 | Welcome | play circle | check circle | circle |
| MM2 | Explore | play circle | check circle | circle |
| MM3 | Discover | play circle | check circle | circle |
| MM4 | Connect | play circle | check circle | circle |
| MM5 | Plan | play circle | check circle | circle |
| MM6 | Prepare | play circle | check circle | circle |
| MM7 | Match | play circle | check circle | circle |
| MM8 | Engage | play circle | check circle | circle |
| MM9 | Transition | play circle | check circle | circle |
| MM10 | Home | house icon always | house icon always | house icon in gold |

**Row states:**

COMPLETE: green check icon, normal text color, document icon on right (links to deliverable)  
ACTIVE: blue play icon, blue text (#0076B6), 3px left border in #0076B6, background `var(--active-row-bg)`, border-radius 0  
UPCOMING/LOCKED: gray circle icon, muted text color `var(--text-muted)`, no interaction  
MM10 HOME: gold house icon (#C5B783), gold text always regardless of state  

**Clicking a completed MM** navigates to that MM's workspace (allows revisiting)  
**Clicking active MM** stays on current workspace  
**Clicking locked MM** does nothing (no hover state, cursor default)  

**Section label** at top: "YOUR JOURNEY" in 10px uppercase letter-spacing, `var(--text-secondary)`

**Commit Phase 2:**
```
git add -A && git commit -m "feat: journey rail with live MM state from Supabase" && git push origin main
```

---

## Phase 3 — Migrate MM1–MM4 Workspaces

Each MM gets its own page under `/app/portal/mm[n]/page.tsx`

The WorkspacePanel wrapper provides:
- Breadcrumb: "Your journey › MM[N] — [Name]"
- Stage title (h1)
- Internal scroll if content overflows

### MM1 — Welcome Workspace
Route: `/app/portal/mm1`  
Migrate existing welcome content into this workspace.  
Components: Welcome video/message, top 3 city preview cards, mock Navigator tour overview, journey overview showing all 10 MMs  
Deliverable badge: "Journey Introduction"

### MM2 — Explore Workspace  
Route: `/app/portal/mm2`  
Migrate existing city exploration content.  
Components: Community Profile Cards, school data, housing data, cost of living, lifestyle scores, favorites  
Deliverable badge: "Community Profile"

### MM3 — Discover Workspace
Route: `/app/portal/mm3`  
Migrate existing city reveal / priority selector / financial calculator content.  
Components: Priority ranking tool, financial sandbox, community ranking engine, city comparison, community selection, commitment gate  
Deliverable badge: "Committed Direction Package"

### MM4 — Connect Workspace
Route: `/app/portal/mm4`  
Migrate existing family profile intake and Market Director intro card.  
Components: Family profile intake, household info, employment info, relocation goals, strategy session scheduling, Navigator Activation payment gate  
Deliverable badge: "Relocation Roadmap"

**Important:** Do not change the underlying logic or Supabase queries for MM1–MM4. Only move them into the new workspace component structure. Preserve all existing functionality exactly.

**Commit Phase 3:**
```
git add -A && git commit -m "feat: MM1-MM4 migrated to new workspace shell" && git push origin main
```

---

## Phase 4 — MM5–MM10 Placeholder Workspaces

Each locked stage shows a clean informational workspace explaining what that stage is designed to do. Style: centered content, stage icon, stage name, description paragraph, feature list, locked badge.

**Locked workspace UI pattern:**
```
[Large lock icon + stage icon]
[MM number badge in navy]
[Stage name — large heading]
[One paragraph description]
[Feature list — what happens in this stage]
[Status badge: "Unlocks when MM[N-1] is complete"]
[Subtle "Coming in your journey" label]
```

Use `var(--card-bg)` with `var(--card-border)`. Not dark/heavy. Clean and encouraging, not a hard wall.

---

### MM5 — Plan Placeholder

**Description:**  
"Your Move Blueprint starts here. Your Market Director guides you through a complete financial picture review — down payment, monthly budget, timeline, and debt. You'll get connected to a trusted lender for pre-qualification, and together you'll build a written Move Blueprint that becomes the foundation for everything that follows."

**Feature list:**
- Community refinement with your Market Director
- Housing strategy — budget, home type, timeline
- Move Timeline creation
- Lender-Ready Checklist
- Warm lender introduction and pre-qualification
- Move Blueprint document delivered

**Unlocks:** When Market Director confirms MM4 complete and Navigator Activation fee is paid

---

### MM6 — Prepare Placeholder

**Description:**  
"Before you search for a single home, your entire support team is assembled and ready. Your Market Director coordinates every vendor you'll need — title company, home inspector, insurance, movers, and more. You'll receive a Move Readiness Certification when every position is filled. No scrambling during the transaction."

**Feature list:**
- Pre-qualification verification
- Community and budget confirmation
- Full vendor team assembly — title, inspector, insurance, movers
- Move Readiness Certification issued
- Every role filled before home search begins

**Unlocks:** When Move Blueprint is complete and pre-qualification letter received

---

### MM7 — Match Placeholder

**Description:**  
"The right agent for the right buyer in the right market. You'll be presented with three anonymous HavenQuest Select Agent profiles matched to your target submarket. You choose one — we make the warm introduction. Active home search begins inside SARAH, your search hub, with MLS listings, showing notes, lifestyle match scoring, and a shortlist builder."

**Feature list:**
- Three anonymous Select Agent profiles matched to your submarket
- You select your agent — HavenQuest makes the introduction
- Active MLS search hub with lifestyle match scoring
- Showing activity tracking and notes
- Property shortlist and comparison tools
- Market Director monitors all search activity

**Unlocks:** When Move Readiness Certification is issued

---

### MM8 — Engage Placeholder

**Description:**  
"From offer to clear to close — every step is managed. Your Select Agent leads the transaction and your Market Director monitors every stage. Offer, negotiation, contract, inspection, appraisal, financing — nothing falls through the cracks. If a deal doesn't work out before clear to close, you return to active search immediately with full momentum."

**Feature list:**
- Offer package preparation and submission
- Negotiation tracking
- Contract and timeline management
- Inspection issue tracking
- Appraisal review
- Financing and clear-to-close monitoring

**Unlocks:** When Select Agent and client mutually confirm a property for offer

---

### MM9 — Transition Placeholder

**Description:**  
"Two tracks run at the same time: closing your home and physically moving your life. Your Transition Checklist — built from your Move Blueprint — is executed item by item. Closing documents, fund transfer, keys. Movers, utilities, address changes, school enrollment. You arrive in Texas ready, not scrambling."

**Feature list:**
- Final walkthrough coordination
- Closing disclosure and fund transfer
- Closing day coordination
- Mover coordination from your vendor team
- Utility transfers and address changes
- School enrollment and community connections

**Unlocks:** When clear to close is confirmed — the only trigger for MM9

---

### MM10 — Home Placeholder

**Description:**  
"The journey ends. The relationship doesn't. Your Journey Recap — a permanent record of everything you accomplished — is generated and saved in your portal forever. Check-ins at 7, 30, 90, and 365 days keep HavenQuest connected to your new life. And through HavenQuest Home, you'll have access to a curated network of vetted local service providers for years to come."

**Feature list:**
- Journey Recap — AI-generated summary of your full journey, saved permanently
- Welcome Home Portfolio
- Community connection resources
- Check-ins at 7, 30, 90, and 365 days
- HavenQuest Home — exclusive vetted vendor and service network
- Referral program

**Unlocks:** When keys are received at closing

---

**Commit Phase 4:**
```
git add -A && git commit -m "feat: MM5-MM10 placeholder workspaces" && git push origin main
```

---

## Phase 5 — Command Center

File: `/app/portal/components/CommandCenter.tsx`

**Dimensions:** 240px fixed width, full height, background `var(--panel-bg)`, left border `0.5px solid var(--panel-border)`, internal scroll

**Section label** at top: "COMMAND CENTER" in 10px uppercase, `var(--text-secondary)`

**Sections (top to bottom):**

### Journey Status
Card with background `var(--portal-bg)`, border-radius 10px, padding 12px  
- Status dot (green = on track, amber = waiting on client, red = action required)
- Status text: "On track" / "Waiting on you" / "Action required"
- Circular progress ring showing % complete (calculate from current MM / 10)
- "X% complete" text
- "Current: MM[N] [Name]" in muted text, MM name in blue

### Next Action
Highlighted card with background `var(--accent-blue-light)`, border-radius 10px  
- "NEXT ACTION" label in 10px uppercase blue
- Action text in 13px font-weight 500 navy
- "Mark complete" button in #0076B6 full width
- Data source: hardcode per MM for now, wire to real data in Phase 2

Next action copy per MM:
- MM1: "Begin your Navigator journey"
- MM2: "Explore your matched communities"  
- MM3: "Select your target community"
- MM4: "Complete your family profile"
- MM5–MM10: "Awaiting Market Director — your team will be in touch"

### Upcoming Events
Two placeholder events (static for now, real calendar integration in Phase 2)  
Each event: month label, day number, event title, event subtitle  
Separator lines between events

### Your Team
Three rows: Market Director, Select Agent, Lender  
Each row: avatar circle with initials, role label (10px uppercase muted), name  
If not yet assigned: avatar shows user icon in muted gray, name shows "Pending assignment" in muted text  
Data source: read from `public.users` — `market_director_name`, `select_agent_name`, `lender_name` columns  
If columns don't exist, add them via migration (nullable varchar) and show "Pending assignment" as default

### Messages
Unread count badge + "View all" link  
Read from Supabase `public.messages` table if it exists, otherwise show static "0 unread messages"

**Commit Phase 5:**
```
git add -A && git commit -m "feat: command center with journey status, next action, team" && git push origin main
```

---

## Phase 6 — Portal Routing and MM State

### 6A — Default Route
`/app/portal/page.tsx` should:
1. Read `current_milesmarker` from `public.users` for the authenticated user
2. Redirect to `/portal/mm[n]` based on current MM
3. Default to `/portal/mm1` if no MM is set

### 6B — MM State Management
Create `/app/portal/hooks/usePortalState.ts`:
```typescript
// Returns: currentMM, completedMMs[], userProfile, teamMembers
// Reads from public.users single query
// Memoized — only re-fetches on auth change
```

### 6C — Protected Routes
All /portal/* routes must:
1. Check auth session
2. Redirect to /login if no session
3. Redirect to /portal/mm1 if authenticated but no MM state set

**Commit Phase 6:**
```
git add -A && git commit -m "feat: portal routing, MM state management, protected routes" && git push origin main
```

---

## Phase 7 — Final Polish and Deploy

### 7A — Responsive behavior
- Minimum supported width: 1024px (desktop only for now)
- Below 1024px: show a "best viewed on desktop" message rather than a broken layout
- Do not attempt mobile layout — that is Phase 2

### 7B — Loading states
- Journey Rail: skeleton loaders for MM rows while Supabase loads
- Workspace: skeleton card placeholders
- Command Center: skeleton loaders for status and team sections

### 7C — Transitions
- MM workspace changes: subtle fade transition (150ms) when navigating between stages
- Theme toggle: instant switch, no transition needed
- Active MM row in Journey Rail: smooth background color transition

### 7D — Final audit
Before final commit:
- Check all TypeScript errors — zero tolerance
- Check all console errors
- Verify theme toggle works in all three modes
- Verify Journey Rail reflects correct state for a test user
- Verify MM1–MM4 all function correctly with real data
- Verify MM5–MM10 placeholder workspaces render correctly in both themes
- Verify Command Center renders correctly in both themes

### 7E — Final commit and deploy
```
git add -A && git commit -m "feat: navigator portal UX rebuild complete — full three-panel shell, theme toggle, MM1-MM10" && git push origin main
```

Confirm Vercel deployment triggered and successful. Report the production URL.

---

## Summary of Deliverables

| Phase | Deliverable |
|---|---|
| 0 | Audit report + DB migration |
| 1 | Portal shell + theme system + top bar |
| 2 | Journey Rail with live MM state |
| 3 | MM1–MM4 migrated to new shell |
| 4 | MM5–MM10 placeholder workspaces |
| 5 | Command Center |
| 6 | Routing and MM state management |
| 7 | Polish, loading states, final deploy |

**Report back to Claude chat at the end of each phase before starting the next.**
