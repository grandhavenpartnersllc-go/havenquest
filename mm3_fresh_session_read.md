# Read Brief — MM3 Still Defaulting to Wrong Metro (Fresh Session)
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Read only — do not change anything
**Priority:** P1 — regression still present after today's fixes
**Report back:** Answer all questions, paste findings to Claude chat

---

## Context

After today's fixes, MM3 is still opening on the wrong metro tab for fresh sessions.
Test scenario: user cleared DB, ran quiz fresh, got Round Rock / San Marcos / Austin
as MM2 top 3 (Austin metro). Advanced to MM3 — it opened on San Antonio tab.

The fix made top_city_matches the authoritative source with a fallback to getTopMatches().
The wrong metro suggests the fallback is still firing, or top_city_matches isn't populated
yet when MM3 mounts.

---

## Questions to Answer

### 1. When is top_city_matches written to Supabase?

Find EmailGate.tsx or wherever top_city_matches is written on quiz completion.

**Report:**
- At what exact point in the user flow is top_city_matches written to public.users?
- Is it written before or after the user is redirected to /portal?
- Is there any async gap where the user could reach MM3 before top_city_matches
  is committed to the database?

### 2. Fresh session path in StarterPortal.tsx

For a brand new user (just completed quiz, sessionStorage populated, first portal load):

**Report:**
- Which path does StarterPortal take — the sessionStorage path or the DB path?
- On the sessionStorage path, what does it set as the matches state?
- Does the sessionStorage path use top_city_matches from DB at all, or does it
  read matches entirely from sessionStorage?
- What key is matches stored under in sessionStorage? What does it contain?

### 3. What does sessionStorage contain at MM3 mount for a fresh user?

**Report:**
- What sessionStorage keys are written during/after quiz completion?
- Is the matches array written to sessionStorage? When and by what?
- Could sessionStorage contain stale or empty matches data that causes
  getTopMatches() to fire as fallback?

### 4. The fixed DB path — when does it run for a fresh user?

In the async DB block that now reads top_city_matches:

**Report:**
- For a user on their very first portal load (fresh session, sessionStorage present):
  does the async DB block run at all, or does it short-circuit because sessionStorage
  data is present?
- If it short-circuits, is setMatches() called with sessionStorage data before MM3
  mounts — and what does that sessionStorage data contain?

### 5. Trace the matches state for this specific scenario

Walk through what happens step by step when:
- User completes quiz, gets Round Rock / San Marcos / Austin as results
- User creates account, is redirected to /portal
- Portal loads for the first time (fresh session)
- User advances from MM2 to MM3

**Report:**
- At each step, what is in the matches state array?
- What is matches[0].location.metroUsed at the point MM3Discover mounts?
- Why would it contain a San Antonio city?

---

## What to Paste Back

Answer all five questions. Include exact code paths where relevant.
Do not make any changes. Claude will write the fix.
