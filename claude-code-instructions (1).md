# Claude Code Instructions — Returning User False Positive Fix

## What You're Fixing

A single-file bug fix in `app/api/users/route.ts`. Read the brief in `returning-user-false-positive-brief.md` completely before touching anything.

---

## Before You Start

1. **Read `returning-user-false-positive-brief.md` completely.**
2. **Read `app/api/users/route.ts` in full** — understand the existing `isExistingAuthUser` detection and `sendWelcomeAndRespond` flow before making any changes.
3. **Confirm back what you are changing and where before writing any code.**

---

## The Change — One File Only

`app/api/users/route.ts` only. No other files.

After the point where `isExistingAuthUser` is set to `true`, add a query to `public.users` to check whether a record exists for the submitted email. Use that result to set `isReturningUser` — not the auth account existence alone.

If `public.users` record exists → `isReturningUser: true` → welcome-back modal (existing behavior, no change)

If `public.users` record does NOT exist → `isReturningUser: false` → create the public record with full quiz data, route to password creation

---

## Critical Rules

- **One file only.** Do not touch `EmailGate.tsx`, `matchingService.ts`, or any other file.
- **No `any` types.** TypeScript strict.
- **Do not break the genuine returning user path.** Users with both `auth.users` and `public.users` records must still see the welcome-back modal.
- **The new `public.users` record must include all quiz data** — name, email, top_city_matches, buyer_profile, financial_picture — same as the standard new user creation path.

---

## When Done

1. Run `tsc --noEmit` — must pass clean
2. Confirm the three test scenarios in the brief all pass
3. Commit and push
4. Report commit hash

---

*Instructions prepared by Claude (COO) — May 30, 2026*
