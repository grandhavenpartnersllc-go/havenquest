# HavenQuest — Returning User Recognition Modal Brief
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 29, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P1 — Beta experience

---

## The Problem

When a returning user submits the email gate, the current flow silently redirects them via a recovery link. They receive no feedback about what happened — no confirmation their matches were updated, no explanation of why they skipped password creation. This is disorienting.

---

## The Fix

When the API returns `isReturningUser: true`, instead of immediately redirecting via `window.location.href = data.setupLink`, show a new state inside the existing email gate modal that:

1. Acknowledges them by first name
2. Confirms their matches were updated
3. Gives them two clear action buttons — sign in or reset password

The recovery link is still used — but as the destination for "Sign in to my portal", not an automatic redirect.

---

## New Modal State — "Welcome Back"

This state replaces the form inside the email gate modal when `isReturningUser: true` is returned. The modal outer shell stays identical — same size, same position, same overlay. Only the inner content changes.

---

### Content

**Icon:** A simple checkmark or house icon — warm, not clinical. Match existing modal icon style.

**Headline:**
```
Welcome back, [first_name].
```
Use the first name from the form submission — it's already available in the component state.

**Body:**
```
We found your existing account and updated your city matches with your latest search.
```

**Two buttons stacked vertically:**

Button 1 — Primary (full width, blue):
```
Sign in to my portal →
```
Action: `window.location.href = data.setupLink`
This uses the recovery link to authenticate and land them in the portal.

Button 2 — Secondary (full width, outlined/ghost style):
```
Forgot my password?
```
Action: `window.location.href = '/auth/forgot-password'`

**Small text below both buttons:**
```
Your matches are saved and ready whenever you sign in.
```

---

## Implementation Instructions for Claude Code

**File:** `components/results/EmailGate.tsx`

**Change:** In the success handler, when `data.isReturningUser === true`:
- Do NOT immediately redirect via `window.location.href`
- Instead set a new state: `setIsReturningUser(true)` and store `setupLink` in state
- Render the "Welcome back" content inside the modal in place of the form

**State additions needed:**
```typescript
const [isReturningUser, setIsReturningUser] = useState(false)
const [returningSetupLink, setReturningSetupLink] = useState<string | null>(null)
```

**Updated success handler:**
```typescript
if (data.isReturningUser && data.setupLink) {
  setIsReturningUser(true)
  setReturningSetupLink(data.setupLink)
  // Do not redirect — show welcome back state in modal
} else {
  onSuccess({ userId: data.userId, ... }) // New user → password creation
}
```

**Conditional render inside modal:**
```typescript
{isReturningUser ? (
  // Welcome back state
  <div>
    <h2>Welcome back, {firstName}.</h2>
    <p>We found your existing account and updated your city matches with your latest search.</p>
    <button onClick={() => window.location.href = returningSetupLink}>
      Sign in to my portal →
    </button>
    <button onClick={() => window.location.href = '/auth/forgot-password'}>
      Forgot my password?
    </button>
    <p>Your matches are saved and ready whenever you sign in.</p>
  </div>
) : (
  // Existing form
  ...
)}
```

---

## Design Notes

- Welcome back state uses the same modal shell — no layout changes outside the content area
- Primary button matches existing CTA button style (full width, blue, same as "Get My Full Report")
- Secondary button is outlined/ghost style — same width, clearly subordinate to primary
- First name is already captured in the form state — use it directly, no additional API call needed
- No close button behavior change — modal can still be dismissed the same way

---

## What Does NOT Change

- New user flow — unchanged, still routes to password creation
- Modal open/close behavior — unchanged
- Form fields and validation — unchanged
- API route — no changes needed, `isReturningUser` is already returned correctly

---

## Implementation Checklist for Claude Code

- [ ] Add `isReturningUser` and `returningSetupLink` state variables to EmailGate
- [ ] Update success handler to set state instead of redirecting
- [ ] Add conditional render for welcome back state inside modal content area
- [ ] Use `firstName` from existing form state in the headline
- [ ] Primary button triggers `window.location.href = returningSetupLink`
- [ ] Secondary button routes to `/auth/forgot-password`
- [ ] Run `tsc --noEmit` after changes
- [ ] Commit and push

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. May 29, 2026.*
