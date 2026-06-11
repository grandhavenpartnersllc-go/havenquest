# Deploy Brief — Commit and Push All Today's Fixes
**Date:** June 3, 2026
**For:** Claude Code
**Type:** Execute — commit and push
**Report back:** Confirm push complete, paste the commit hash

---

## Instructions

All of today's fixes are uncommitted local changes on main. Commit them all
in a single commit and push to origin/main so Vercel deploys them.

Run the following:

```
git add app/explore/page.tsx
git add app/login/page.tsx
git add components/portal/MileMarkerContent.tsx
git add components/portal/StarterPortal.tsx
git add components/portal/milemarkers/MM3Discover.tsx
git add types/index.ts
git commit -m "fix: portal login race, stale matches, MM3 metro inheritance and state fixes

- Portal login: pre-fetch user data before redirect, fix first_name from DB
- StarterPortal: eliminate race condition, setReady only after data confirmed
- StarterPortal: top_city_matches as authoritative match source for returning users
- StarterPortal: logout clears sessionStorage and localStorage
- explore/page: clear stale hq_matches on new quiz run
- MM3Discover: inherit metro and city from MM2 via initialMetro/initialCityIndex props
- MM3Discover: guard prevents metro detection firing on empty matches
- MM3Discover: remove Austin fallback text, show neutral prompt when no metro set
- MM3Discover: full report navigation via router.push
- MM3Discover: financial panel city name in gold header
- MileMarkerContent: compute and pass initialMetro from matches[0] to MM3
- types/index.ts: add currentMileMarker to UserSession interface"
git push origin main
```

---

## Report Back

Confirm:
- [ ] git add completed with no errors
- [ ] git commit completed — paste the commit hash
- [ ] git push completed — paste the push output
- [ ] No errors or conflicts
