# HavenQuest — UX Fix Brief
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 28, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P1 — Pre-beta expansion

---

## Summary

This brief documents all UX, copy, and flow issues identified during the May 28, 2026 end-to-end audit of the quiz-to-portal flow. Issues are organized by location in the user flow. All fixes are copy, component, or logic changes — no data changes (those were handled in the Data Correction Brief).

---

## Issue Index

| # | Location | Type | Priority |
|---|----------|------|----------|
| 1 | /explore-texas | Copy | P2 |
| 2 | Quiz Step 3 | Copy | P2 |
| 3 | Quiz Step 4 | Copy/Bug | P1 |
| 4 | Quiz Step 4 | UI Bug | P1 |
| 5 | Results page | Copy | P2 |
| 6 | Email gate card | Copy | P1 |
| 7 | Email gate card | Copy | P2 |
| 8 | Email modal | Copy | P1 |
| 9 | Email modal | Copy | P1 |
| 10 | Password creation | UX/Logic | P1 |
| 12 | Portal — compare subhead | Copy | P2 |
| 14 | Portal — affordability score | UX | P2 |
| 15 | Portal — mortgage assumption | Copy | P2 |
| 16 | Portal — transit/traffic | UX | P2 |
| 17 | Portal — Must Have legend | UX | P2 |
| 18 | Portal — weather score | UX | P2 |
| 19 | Portal — price figures | Copy | P1 |
| 20 | Portal — market data source | Copy | P2 |
| 21 | Portal — Zillow filter claim | Copy/Logic | P1 |

---

## Section 1 — /explore-texas Page

### Issue 1 — Missing first bullet in "What You Get" section
**Location:** /explore-texas page, "What You Get" list  
**Problem:** The first bullet point is missing — the list appears to start mid-way through.  
**Fix:** Audit the "What You Get" component and restore the missing first bullet. Expected first bullet based on product context: *"Personalized city match scores based on your income and lifestyle priorities"*  
**Type:** Content/component fix

---

## Section 2 — Quiz Flow

### Issue 2 — Realtor language in Quiz Step 3 subhead
**Location:** Quiz Step 3 subhead  
**Problem:** Subhead references realtors before the user has reached the portal or opted in to realtor contact. Premature and off-message at this stage of the flow.  
**Fix:** Remove realtor reference from Step 3 subhead. Replace with copy focused on the city match and report, not the realtor connection.  
**Type:** Copy fix

---

### Issue 3 — Duplicate italic paragraph in Quiz Step 4
**Location:** Quiz Step 4 (priority selector)  
**Problem:** An italic paragraph appears twice — once where it belongs and once as a duplicate below it.  
**Fix:** Remove the duplicate paragraph. Keep only the first instance.  
**Type:** Copy/rendering bug

---

### Issue 4 — Last dragged card stays grayed out in Quiz Step 4
**Location:** Quiz Step 4 drag-and-drop priority selector  
**Problem:** After dragging the final card into a priority bucket, it remains visually grayed out as if unselected or disabled. All other cards render correctly after being dragged.  
**Fix:** Investigate the drag-and-drop state logic for the last card. Ensure the final card receives the same active/selected visual treatment as all other cards once placed.  
**Type:** UI bug

---

## Section 3 — Results & Email Gate

### Issue 5 — Results page subhead could be stronger
**Location:** Results page, subhead below the match headline  
**Problem:** Current subhead is functional but not compelling. Misses an opportunity to reinforce the value of the full report before the email gate.  
**Fix:** Update subhead copy to something like: *"Your full report includes affordability breakdowns, school data, market conditions, and everything you need to make a confident decision."*  
**Type:** Copy improvement

---

### Issue 6 — Email gate card references "matched realtors"
**Location:** Email gate card, "What's inside" or benefit list  
**Problem:** "Complete scores, cost breakdowns, school data, and matched realtors — free" — realtors are not yet in the portal. This is a false promise that will be immediately visible to any user who enters.  
**Fix:** Remove "matched realtors" from this copy. Replace with: *"Complete scores, cost breakdowns, school data, and your full personalized report — free"*  
**Type:** Copy fix — P1 credibility issue

---

### Issue 7 — Email gate card headline could be more compelling
**Location:** Email gate card headline  
**Problem:** "Your full HavenQuest report is ready" is functional but flat.  
**Fix:** Consider: *"Your Texas match is waiting"* or *"See your complete results"* with a one-line benefit statement below.  
**Type:** Copy improvement

---

### Issue 8 — Email modal subhead references "matched realtors"
**Location:** Email capture modal, subhead  
**Problem:** "See complete scores, affordability breakdowns, and your matched realtors." — same problem as Issue 6. Realtors are not in the portal.  
**Fix:** Remove realtor reference. Replace with: *"See complete scores, affordability breakdowns, and your full personalized report."*  
**Type:** Copy fix — P1 credibility issue

---

### Issue 9 — Phone number label "for realtor contact"
**Location:** Email capture modal, phone number field label  
**Problem:** Label reads "Optional — for realtor contact" — this tells the user their phone will be shared with a realtor before they've consented to that. Premature disclosure, potentially alarming to privacy-conscious users.  
**Fix:** Change label to simply "Optional" — remove "for realtor contact" entirely.  
**Type:** Copy fix — P1 trust issue

---

## Section 4 — Password Creation

### Issue 10 — Remove "I'll set my password later"
**Location:** Password creation screen, below the "Create My Portal" button  
**Problem:** This escape hatch creates orphaned accounts with no recovery path. Users who click it will have no way to log back in from another device or browser session. Bad data hygiene, bad UX.  
**Fix:** Remove the "I'll set my password later" link entirely. Password creation is required to proceed.  
**Type:** UX/logic fix — P1

---

## Section 5 — Portal Report

### Issue 12 — "Select + Compare" subhead grammatically awkward
**Location:** Portal, above the matched cities cards  
**Problem:** "Select + Compare on any two cities to compare them side by side" — the "+" is doing double duty as a UI element label and punctuation. Reads awkwardly.  
**Fix:** Change to: *"Select any two cities to compare them side by side"*  
**Type:** Copy fix

---

### Issue 14 — Affordability score feels inconsistent with breakdown
**Location:** Portal, Lifestyle scores grid, Affordability tile  
**Problem:** Users who see a healthy "Income remaining" figure in green and then see Affordability scored 3–5/10 will feel a disconnect without context. The score measures absolute market cost, not personal fit — but that's not obvious.  
**Fix:** Add a tooltip or small subtext to the Affordability score tile explaining what the score measures: *"Reflects market price level — not your personal budget fit"* or similar.  
**Type:** UX clarification

---

### Issue 15 — Mortgage estimate has no assumption disclosure
**Location:** Portal, Affordability breakdown, "Est. monthly mortgage" line  
**Problem:** $4,340/month for Frisco with no explanation of what assumptions were used. Users will immediately ask "based on what down payment and rate?"  
**Fix:** Add a footnote or tooltip below the affordability breakdown: *"Assumes 20% down payment, 6.5% 30-year fixed rate, median home price. Rates as of 05/2026."*  
**Type:** Copy/UX addition — P1 credibility

---

### Issue 16 — Transit 1/10 and Traffic 6–8/10 appear contradictory
**Location:** Portal, Lifestyle scores grid  
**Problem:** Users will ask: "If there's no transit, how is traffic decent?" These scores feel contradictory without explanation. The real answer — good road infrastructure despite no public transit — is not surfaced.  
**Fix:** Add tooltip to Transit score: *"Reflects public transit availability — bus, rail, light rail. Does not reflect road conditions or commute time."*  
Add tooltip to Traffic score: *"Reflects road congestion and commute conditions — separate from public transit availability."*  
**Type:** UX clarification

---

### Issue 17 — Must Have legend appears below the scores grid
**Location:** Portal, Lifestyle scores grid, legend text  
**Problem:** "Scores highlighted in blue are your Must Haves." appears below the grid. Users need the key before they read the data, not after.  
**Fix:** Move the legend line to above the scores grid, not below it.  
**Type:** UX layout fix

---

### Issue 18 — Weather 5/10 with no context
**Location:** Portal, Lifestyle scores grid, Weather tile  
**Problem:** A 5/10 weather score with no explanation will raise anxiety for relocating users, especially those coming from mild climates. Texas weather is a known concern.  
**Fix:** Add tooltip to Weather score: *"Texas summers are hot and humid. Most cities average 90°F+ from June–September. Winters are mild with rare freezes."*  
**Type:** UX clarification

---

### Issue 19 — Three price figures with no differentiation
**Location:** Portal, Price intelligence section  
**Problem:** "Starter home $X", "Median home $Y", "Median sale price $Z" — three different price figures with no explanation of what distinguishes them. Users will be confused about which number to use.  
**Fix:** Add brief descriptive labels to each figure:
- Starter home → add subtext: *"Entry-level inventory"*
- Median home → add subtext: *"All home types"*
- Median sale price → add subtext: *"Recent closed sales"*  
**Type:** Copy clarification — P1 credibility

---

### Issue 20 — Market snapshot data source label
**Location:** Portal, Market snapshot section, source attribution line  
**Problem:** For cities using metro-level Redfin data (now corrected to city-level for most), the attribution should clearly state the source and date. Currently some cities still show metro-level attribution even where city-level data is now used.  
**Fix:** Audit all `redfinDataSource` strings. Ensure any remaining metro-level attributions include a note: *"Metro-area data — city-specific figures updated as available."* All cities corrected in the data brief should already show city-level attribution — verify this is rendering correctly.  
**Type:** Copy audit/fix

---

### Issue 21 — "Filtered to your budget and bedroom preference" Zillow claim
**Location:** Portal, "See available homes" CTA section, subtext  
**Problem:** "Filtered to your budget and bedroom preference" — this implies the Zillow link actually filters by user-specific parameters. If the link is a generic city search on Zillow (not filtered), this is a false promise.  
**Fix:** 
- **If the Zillow link IS filtered:** Keep the copy, no change needed.
- **If the Zillow link is NOT filtered:** Change subtext to: *"Browse available homes in [City Name]"* — remove the filter claim entirely until filtering is built.  
**Action required:** Craig to verify whether Zillow links are actually filtered before Claude Code touches this. If not filtered, Claude Code removes the claim.  
**Type:** Copy fix — P1 credibility issue

---

## Implementation Notes for Claude Code

1. Apply all P1 fixes first (Issues 3, 4, 6, 8, 9, 10, 15, 21)
2. Apply P2 fixes second (all remaining issues)
3. Issue 21 requires Craig's input before touching — do not change Zillow subtext until confirmed
4. Issue 4 (drag-and-drop bug) may require investigation before fix — flag if the root cause is unclear
5. Run `tsc --noEmit` after all changes
6. Do not touch any data files — this brief covers UI, copy, and logic only

---

## Claude Code Prompt

See bottom of document.

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. All issues identified during live end-to-end audit, May 28, 2026.*
