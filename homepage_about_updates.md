# Build Brief — Homepage + About Page Copy Updates

## Overview
This brief covers three sets of copy updates across two pages. No layout or styling changes — copy only. All existing component structure, classes, and styling stay exactly as-is.

---

## Page 1 — Homepage (app/page.tsx or components/landing/)

### Update 1A — How It Works Section (4 steps)

Find the "How It Works" section with the four numbered steps. Update the title and body copy for each step as follows. Do not change step numbers, icons, layout, or styling.

**Step 01 — Keep exactly as-is**

**Step 02 — Update title and body:**
- Title: `Find your Texas communities`
- Body: `We rank 101 Texas communities against your priorities and budget. Your top matches are ready — with full Community Profiles and real affordability data waiting in your private portal.`

**Step 03 — Update title and body:**
- Title: `Explore, refine, and commit`
- Body: `Adjust your financial picture, shift your priorities, and watch your rankings respond in real time. When something clicks — choose your communities and commit to your direction.`

**Step 04 — Update title and body:**
- Title: `Get guided all the way home`
- Body: `A dedicated Market Director steps in — reviews your full profile, builds your relocation plan, assembles your team, and guides you from direction to closing day. This is where the journey gets personal.`

Remove the "Takes about 4 minutes →" link from Step 01 only if it currently appears under Step 04. If it appears under Step 01, keep it there.

---

### Update 1B — Section 2 Promise Cards

Find the section below the headline "Texas is big. Finding your place in it shouldn't be a guessing game." with the four feature cards. Update cards 02 and 03 only. Cards 01 and 04 stay exactly as-is.

**Card 02 — Update title and body:**
- Title: `A real guide at your side`
- Body: `When you're ready to take the next step, your personal Market Director steps in — having already reviewed your full profile, your priorities, and your financial picture. They don't sell you. They guide you — from direction to closing day and beyond.`

**Card 03 — Update title and body:**
- Title: `Guided all the way home`
- Body: `HavenQuest doesn't hand you off at the closing table. From your first quiz to your first night in your new Texas home — and beyond — your team is with you every step of the way.`

Keep the existing icon for Card 03 as-is, or use the closest appropriate Lucide React icon if a replacement is needed.

---

## Page 2 — About Page (app/about/page.tsx)

Replace the entire page content with the following. Preserve all existing page layout, nav, and footer components. Only the main content body changes.

**Page title tag:** `About HavenQuest — Guided Texas Relocation`

**Meta description:** `HavenQuest is a Texas transition management company. We guide families from uncertainty about where to live through a successful relocation and integration into their new community.`

**Update og:title:** `About HavenQuest — Guided Texas Relocation`
**Update og:description:** `HavenQuest guides families from uncertainty about where to live through a successful relocation and integration into their new Texas community.`
**Update twitter:title:** `About HavenQuest — Guided Texas Relocation`
**Update twitter:description:** `HavenQuest guides families from uncertainty about where to live through a successful Texas relocation.`

---

### Main Content Body

Replace all body content between the nav and footer with the following sections:

---

**Page eyebrow label:** `About`

**H1:** `What is HavenQuest?`

**Subheading:** `Texas Transition Management`

---

**Section: Who we are**

`HavenQuest is a Texas transition management company. We help people who are moving to Texas — or seriously considering it — find where they actually belong and guide them all the way there.`

`More than 500,000 people move to Texas every year. Most of them guess. They browse Reddit threads, watch YouTube videos from realtors with an agenda, and ask a friend who moved there three years ago. Then they guess.`

`HavenQuest does something different. We combine real data intelligence with dedicated human guidance — because finding the right community is only half the job. Getting there confidently, with a real plan and a real team, is the other half.`

---

**Section: How it works**

`Clients answer four questions — income, household, financial picture, and lifestyle priorities. HavenQuest matches them to Texas communities across 101 cities in 4 metros, scored across 13 lifestyle categories. Results include full Community Profiles, affordability breakdowns, school data, and market conditions.`

`From there, clients enter the HavenQuest Navigator — a private portal that guides them through a 10-step journey from first results to closing day. Each step prepares them for the next one. A dedicated Market Director steps in to build their relocation plan, assemble their team, and guide them through every milestone. By the time a client is ready to search for a home, they know their community, their budget, their priorities, and their plan — and they have the right people around them to execute it.`

CTA link: `Start your journey →` pointing to `/begin`

---

**Section: Our data**

`HavenQuest uses publicly available data from verified primary sources — Redfin for market data, the Texas Education Agency for school ratings, county appraisal districts for property tax rates, FBI UCR for safety scores, and Walk Score for walkability and transit.`

`All scores are directional lifestyle guidance — not financial, legal, or real estate advice. We publish our full methodology and disclose every data source, update frequency, and known limitation.`

CTA link: `Read our full data disclosure →` pointing to `/data-disclosure`

---

**Section: Our Select Agents**

`Every real estate agent in our network is a HavenQuest Select Agent — licensed in Texas, a member of the National Association of Realtors, and vetted against our production, rating, and experience standards. Select Agents are introduced at the right moment in the guided journey — after the client's direction is confirmed, their financial picture is established, and their Market Director has prepared them to move forward. We don't list every agent. We select the right one for each client.`

`No agent pays to rank higher. No city pays to appear in results. Our matching algorithm is not influenced by commercial relationships.`

CTA link: `Learn about joining our network →` pointing to `/for-realtors`

---

**Section: Contact & resources**

Keep this section exactly as it currently exists — do not change any links or contact information. Only remove any reference to "American Victory Alliance, LLC" if it appears anywhere in this section.

---

**Remove entirely:** The "The team" section — delete it completely.

**Remove entirely:** Any sentence or line referencing "American Victory Alliance, LLC" anywhere on the page.

---

## Final Step
After all changes are complete:
1. Commit all changed files with message: `update: homepage How It Works, promise cards, about page full rewrite`
2. Push to origin/main
3. Confirm Vercel deployment triggered
4. Report back to Claude chat listing every file changed
