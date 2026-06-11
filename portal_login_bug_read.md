# Portal Login Bug — Read Audit Instructions
**Date:** June 3, 2026  
**For:** Claude Code  
**Type:** Read only — do not change anything  
**Purpose:** Diagnose why returning users are reset to MileMarker 1 on login instead of restoring their saved portal position

---

## Instructions

Read only. Do not change anything. Report all findings back to Claude chat.

---

## 1. Login Handler

Find the login form and handler. Check these locations:
- `app/login/page.tsx`
- `app/auth/login/page.tsx`
- Any component named `LoginForm.tsx` or similar

**Report:**
- What happens after `signInWithPassword` succeeds?
- Does it fetch user data from `public.users` before redirecting?
- What route does it redirect to after successful login?

---

## 2. Portal Entry Point

Find `app/portal/page.tsx` or `StarterPortal.tsx`.

**Report:**
- On load, does the portal query `public.users` for the current user's record?
- What fields is it actually fetching?
- Does it read a MileMarker or portal progress field? What is it named?
- Does it read `top_city_matches`?
- Does it read `first_name`?

---

## 3. Supabase public.users Schema

Check Supabase migrations or the TypeScript types file for the current schema of `public.users`.

**Report:**
- What columns exist in `public.users`?
- Is there a column storing MileMarker position or portal progress? What is it named exactly?

---

## 4. Session Handling

**Report:**
- Is `supabase.auth.getSession()` or `onAuthStateChange` used in the portal load sequence?
- Is there any sign of a race condition where the portal renders before the session is confirmed?

---

## 5. Redirect Path After Login

**Report:**
- After successful login, what is the exact redirect path?
- Does it pass any state, or does it simply redirect to `/portal`?

---

## What to Paste Back

Paste all findings back into Claude chat as a plain summary. No changes until instructed. Claude will use the findings to write the targeted fix brief.
