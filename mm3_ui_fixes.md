# Fix Brief — MM3 Two UI Fixes
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Execute — make all changes described below
**Priority:** P2
**Report back:** Confirm each fix complete, describe what changed

---

## Fix 1 — "View Full Report" Button in MM3 City Popup Does Nothing

**The problem:**
In the MM3 Live City Rankings panel, each city has a "Learn more →" link that opens
a city detail popup. At the bottom of that popup is a "View full report" button.
When clicked, it closes the popup but does not navigate anywhere.

**The fix:**
Find the city detail popup component used in MM3 (likely inside MM3Discover.tsx or
a child component). Find the "View full report" button/link.

1. Check how the MM2 city cards navigate to the full report — find the href or
   onClick used on the "Full report ↓" button in SavedMatches.tsx or MM2Discover.tsx
2. Apply the same navigation pattern to the "View full report" button in the MM3 popup
3. The city object should already be available in the popup's scope — use the same
   city identifier (cityId, slug, or name) to build the report URL

The button should navigate to the full city report page without closing the popup
first — or navigate directly if that's the existing pattern. Match whatever MM2 does.

---

## Fix 2 — Financial Panel Header Should Show Active City Name

**The problem:**
In MM3, the financial panel (showing estimated monthly costs, affordability breakdown
etc.) updates when the user clicks a different city in the Live City Rankings list.
There is already a small indicator line that says "↑ Financial panel showing this city"
on the selected city row. But the financial panel header itself has no city label —
the user has to look back at the ranked list to know which city's numbers they're
viewing.

**The fix:**
Add the active city name to the financial panel header, in a visually distinct
treatment (different color — use the brand gold #B8912A), so the user always knows
which city's financials they're looking at without looking away from the panel.

**Implementation:**

1. Find the financial panel component in MM3Discover.tsx — the section that shows
   the affordability/cost breakdown for the selected city

2. The selected city is already tracked in state (it's what drives the "Financial
   panel showing this city" indicator). Pass or access that city name in the
   financial panel section.

3. In the financial panel header area, add the city name alongside or beneath the
   existing header label. Example treatment:

   ```
   YOUR FINANCIAL PICTURE          ← existing header label (keep as-is)
   Bee Cave                        ← city name in gold #B8912A, slightly smaller font
   ```

   Or inline if layout permits:
   ```
   YOUR FINANCIAL PICTURE  —  Bee Cave
   ```

   Use whatever layout fits the existing panel design. The key requirements:
   - City name is in gold #B8912A to distinguish it from the section header
   - City name updates dynamically when a different city is selected in the ranked list
   - City name disappears or shows a placeholder if no city is selected

4. When the user clicks a different city in the ranked list, the financial panel
   header city name updates to match — same reactive behavior as the panel content.

---

## Acceptance Criteria

**Fix 1:**
- [ ] "View full report" in MM3 city popup navigates to the full city report
- [ ] Navigation matches the behavior of "Full report" on MM2 city cards
- [ ] Popup behavior on click is consistent — navigates cleanly

**Fix 2:**
- [ ] Financial panel header shows the name of the currently selected city in gold
- [ ] City name updates when a different city is selected in the ranked list
- [ ] Treatment is visually clean and consistent with existing MM3 panel styling
- [ ] No layout breakage on mobile or narrow viewports

**Both:**
- [ ] tsc --noEmit clean
- [ ] Tested with Craig's test account in MM3

---

## Files Likely to Change

- `components/portal/milemarkers/MM3Discover.tsx`
- Any child popup or city detail component used within MM3

Report back: list each file changed, describe what changed, confirm acceptance
criteria tested.
