# Read Audit — MM2 vs MM3 City Match Discrepancy
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Read only — do not change anything
**Priority:** P1 — data inconsistency visible to users
**Report back:** Answer every question below. Paste findings to Claude chat.

---

## The Problem

MileMarker 2 shows the user's top 3 city matches:
- Round Rock (66%)
- San Marcos (66%)
- Cedar Park (65%)

When the user advances to MileMarker 3, the Live City Rankings panel shows a different list:
- Bee Cave (#1, 68%) — was NOT in MM2 results
- Round Rock (#2, 66%)
- San Marcos (#3, 66%)
- Cedar Park (#4, 65%)
- Lakeway (#5, 65%)

The top pick changed. The list expanded. These two views are not showing the same data.

---

## Questions to Answer

### 1. MileMarker 2 — Where do the top 3 cities come from?

Find the component that renders the MM2 city match cards (Round Rock / San Marcos / Cedar Park as TOP PICK / RUNNER-UP / STRONG ALT).

**Report:**
- What is the component name and file path?
- Where does it get its city data? Does it read from:
  - `top_city_matches` in Supabase `public.users`?
  - localStorage or sessionStorage?
  - A prop passed from StarterPortal?
  - A live re-run of the scoring algorithm?
- How many results does it display — is it always exactly 3?
- What determines which city is TOP PICK vs RUNNER-UP vs STRONG ALT?

---

### 2. MileMarker 3 — Where does the Live City Rankings list come from?

Find the component that renders the MM3 Live City Rankings panel (the ranked list with Austin / DFW / Houston / San Antonio metro tabs and the numbered city list with scores).

**Report:**
- What is the component name and file path?
- Where does it get its city data? Does it read from:
  - `top_city_matches` in Supabase `public.users`?
  - A live re-run of the scoring algorithm?
  - A different field or data source entirely?
- Is Bee Cave in `top_city_matches` at all? Or is it being surfaced from a separate source?
- What is the scoring logic that produces the ranked list in MM3 — is it the same algorithm as MM2 or different?

---

### 3. Are MM2 and MM3 using the same data source?

**Report:**
- Do MM2 and MM3 read from the same source (same field, same query, same state variable)?
- If not — what is different between them?
- Is there any intentional design reason for them to show different results, or is this a bug?

---

### 4. Where is `top_city_matches` written to Supabase?

Find where `top_city_matches` is saved to `public.users`.

**Report:**
- What file and function writes `top_city_matches`?
- What data does it write — how many cities, what fields per city?
- Does Bee Cave appear in `top_city_matches` for this test user, or only in the MM3 live ranking?

---

### 5. The scoring algorithm

**Report:**
- Where is the city scoring algorithm defined? What file?
- Is it run once and saved, or re-run on each view?
- Could different inputs (e.g. different priority weights or affordability flags) produce different scores at MM2 vs MM3?

---

## What to Paste Back

Answer all five questions above. Include file paths and component names. 
Do not make any changes. Claude will use the findings to write the fix brief.
