# HavenQuest — Returning User Routing Fix Brief
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 29, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P0 — Beta blocker

---

## The Problem

When a returning user (existing Supabase Auth account) completes the quiz and submits the email gate, the API correctly detects them as returning and upserts their record. However the client-side response handler does not distinguish between a new user and a returning user — it routes everyone to password creation regardless.

**Correct behavior:**
- New user → password creation screen
- Returning user (already has password) → skip password creation → go directly to `/portal`

---

## The Fix

Two changes required:

1. **API route** — add `isReturningUser: true` to the response payload when an existing auth account is detected
2. **Client** — check for `isReturningUser` in the response and route accordingly

---

## Section 1 — API Route Update

**File:** `app/api/users/route.ts`

**Where:** In the response payload returned by `sendWelcomeAndRespond` or the final JSON response (lines 158–160 per current file)

**Change:** Add `isReturningUser` flag to the response:

```typescript
// Current response (approximate):
return NextResponse.json({ 
  success: true, 
  authUserId, 
  setupLink 
})

// Updated response:
return NextResponse.json({ 
  success: true, 
  authUserId,
  setupLink,
  isReturningUser: isExistingAuthUser // boolean — true if auth account already existed
})
```

**How to determine `isExistingAuthUser`:**
In the auth layer (lines 68–99), when `createUser` fails and the `authError` branch runs (generating a recovery link for the existing user), set a boolean flag:

```typescript
let isExistingAuthUser = false

// When createUser fails and recovery link is generated:
isExistingAuthUser = true
```

Pass this flag through to the final response.

---

## Section 2 — Client-Side Routing Update

**File:** `components/results/EmailGate.tsx` (or wherever the API response from the email gate POST is handled)

**Find:** The section that handles the successful API response and routes to password creation.

**Current behavior (approximate):**
```typescript
if (response.success) {
  // Always routes to password creation
  router.push(`/results/${sessionId}/password`)
  // or similar routing to password creation
}
```

**Updated behavior:**
```typescript
if (response.success) {
  if (response.isReturningUser) {
    // Returning user — already has a password, go straight to portal
    router.push('/portal')
  } else {
    // New user — route to password creation
    router.push(`/results/${sessionId}/password`)
    // or existing password creation route
  }
}
```

---

## Section 3 — Sign In the Returning User Before Redirecting

**Important:** When routing a returning user directly to `/portal`, they need to be authenticated in the browser session. The API returns a recovery `setupLink` for returning users — this is a Supabase magic link that can be used to establish a session.

**Option A — Use the recovery link (simplest):**
Redirect the returning user to the `setupLink` URL instead of `/portal` directly. Supabase will process the recovery token and then redirect to the configured redirect URL (`/portal`). The user lands in the portal authenticated without needing to enter their password.

```typescript
if (response.isReturningUser && response.setupLink) {
  // Redirect through the recovery link — Supabase handles auth and redirects to /portal
  window.location.href = response.setupLink
}
```

**Option B — Prompt to sign in (fallback):**
If Option A has complications, show a message on the password creation screen:

*"Welcome back. Your results have been updated. Sign in to access your portal."*

With a "Sign in" button that routes to `/login`.

**Recommendation:** Try Option A first. If the recovery link redirect causes issues in testing, fall back to Option B.

---

## Section 4 — Suppress Duplicate Welcome Email for Returning Users

Currently when a returning user submits the email gate, `sendWelcomeAndRespond` fires another welcome email. For a returning user this is redundant and potentially confusing — they've already received a welcome email.

**Fix:** In the API route, conditionally send a different email for returning users — or suppress the welcome email entirely and send nothing for returning users whose matches were simply updated.

This is a lower priority than the routing fix. Implement after the routing is confirmed working. If time is limited, skip this for now and note it as a follow-up.

---

## Implementation Order for Claude Code

1. Add `isExistingAuthUser` boolean flag to the auth layer in `route.ts`
2. Pass `isReturningUser` in the API response JSON
3. Update the client-side response handler in `EmailGate.tsx` to check `isReturningUser`
4. Implement Option A routing (recovery link redirect) for returning users
5. Run `tsc --noEmit` — verify clean
6. Commit and push
7. Note Section 4 (duplicate welcome email) as a follow-up — do not implement in this session unless time permits

---

## Testing After Deployment (Craig to verify)

- [ ] New user completes quiz → email gate → password creation screen ✅ (existing behavior preserved)
- [ ] Returning user completes quiz → email gate → no password creation → lands in portal authenticated
- [ ] Returning user's `top_city_matches` in Supabase reflects the new quiz results
- [ ] Portal shows updated city matches for returning user

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. May 29, 2026.*
