# HavenQuest — Password Recovery Brief
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 28, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P1 — Beta blocker

---

## Summary

HavenQuest has no password recovery flow. Users who forget their password are permanently locked out of their portal. This brief implements a complete forgot password / reset password flow using Supabase Auth's built-in `resetPasswordForEmail()` method.

The Supabase redirect URL `https://havenquest.co/auth/reset-password` is already configured. No Supabase dashboard changes are required.

---

## What Gets Built

1. **"Forgot password?" link** on the existing login page
2. **Forgot password page** — `/app/auth/forgot-password/page.tsx` — user enters email, triggers reset email
3. **Reset password page** — `/app/auth/reset-password/page.tsx` — user sets new password after clicking email link
4. **Supabase Auth integration** — `resetPasswordForEmail()` and `updateUser()` calls

---

## Section 1 — Login Page Update

**File:** Find the existing login page (likely `/app/login/page.tsx` or `/app/portal/login/page.tsx`)

**Change:** Add a "Forgot password?" link below the password field.

**Placement:** Below the password input, above the sign in button. Right-aligned or centered.

**Copy:** `Forgot password?`

**Link destination:** `/auth/forgot-password`

**Styling:** Small, muted — should not compete with the primary Sign In button. Match existing form styling.

---

## Section 2 — Forgot Password Page

**File:** Create `/app/auth/forgot-password/page.tsx`

**URL:** `havenquest.co/auth/forgot-password`

### Layout

Centered card, same visual treatment as the password creation screen.

**Step label:** `ACCOUNT RECOVERY`

**Headline:** `Reset your password`

**Subhead:** `Enter the email address you used to create your portal. We'll send you a link to reset your password.`

### Form

Single input field:
- Label: `Email address`
- Placeholder: `you@example.com`
- Type: `email`

Submit button:
- Label: `Send reset link`
- Full width, primary blue — matches existing CTA buttons

### States

**Default:** Form as described above.

**Loading:** Button shows `Sending...` and is disabled while the Supabase call is in flight.

**Success:** Hide the form entirely. Show:
- Headline: `Check your email`
- Body: `We sent a password reset link to [email]. Check your inbox and click the link to set a new password.`
- Small note below: `Didn't receive it? Check your spam folder or` [resend link that re-triggers the call]

**Error:** Show inline error below the email field:
- If email not found: `No account found with that email address.`
- Generic error: `Something went wrong. Please try again.`

### Supabase call

```typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: 'https://havenquest.co/auth/reset-password',
})
```

**Note:** For local development, redirectTo should use the environment variable:
```typescript
redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
```

Where `NEXT_PUBLIC_SITE_URL=https://havenquest.co` in production and `http://localhost:3000` in local `.env.local`.

---

## Section 3 — Reset Password Page

**File:** Create `/app/auth/reset-password/page.tsx`

**URL:** `havenquest.co/auth/reset-password`

This page is reached when the user clicks the link in the reset email. Supabase appends a token to the URL automatically. The page must handle the token and allow the user to set a new password.

### Layout

Same centered card treatment as forgot password page.

**Step label:** `ACCOUNT RECOVERY`

**Headline:** `Set a new password`

**Subhead:** `Choose a strong password for your HavenQuest portal.`

### Form

Two fields:
- New password — label `New password`, placeholder `At least 8 characters`, type `password`, show/hide toggle (match existing password creation screen)
- Confirm password — label `Confirm password`, placeholder `Re-enter password`, type `password`, show/hide toggle

Submit button:
- Label: `Update password`
- Full width, primary blue

### Validation

- Minimum 8 characters
- Passwords must match
- Show inline error if they don't match: `Passwords do not match`

### Supabase call

```typescript
const { error } = await supabase.auth.updateUser({
  password: newPassword
})
```

### States

**Loading:** Button shows `Updating...` and is disabled.

**Success:** Hide the form. Show:
- Headline: `Password updated`
- Body: `Your password has been updated. You can now sign in to your portal.`
- Button: `Go to my portal` — links to `/portal`

**Error — invalid or expired token:**
- Headline: `Link expired`
- Body: `This password reset link has expired or already been used. Request a new one.`
- Button: `Request new link` — links to `/auth/forgot-password`

**Error — generic:**
- Show inline: `Something went wrong. Please try again.`

### Token handling

Supabase sends the reset token as a URL fragment (`#access_token=...&type=recovery`). The page must handle this on mount:

```typescript
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Token is valid — show the reset form
        setIsValidToken(true)
      }
    }
  )
  return () => subscription.unsubscribe()
}, [])
```

If the token is not present or invalid, show the expired link state immediately.

---

## Section 4 — Email Template (Supabase)

The reset email is sent by Supabase automatically. The default Supabase template is functional but generic. This is a low priority for now — the default template will work for beta. Note for future: customize the Supabase email template in the Supabase dashboard under Authentication > Email Templates > Reset Password to match HavenQuest branding.

---

## Implementation Order for Claude Code

1. Update login page — add "Forgot password?" link (Section 1)
2. Create `/app/auth/forgot-password/page.tsx` (Section 2)
3. Create `/app/auth/reset-password/page.tsx` (Section 3)
4. Verify `NEXT_PUBLIC_SITE_URL` is set in `.env.local` for local dev
5. Run `tsc --noEmit` — verify clean
6. Commit and push

---

## Testing Checklist (Craig to verify after deployment)

- [ ] "Forgot password?" link appears on login page
- [ ] Clicking it navigates to `/auth/forgot-password`
- [ ] Entering a valid email shows success state and sends email
- [ ] Entering an invalid email shows appropriate error
- [ ] Clicking the link in the email navigates to `/auth/reset-password`
- [ ] Setting a new password updates successfully
- [ ] "Go to my portal" button redirects to `/portal` after reset
- [ ] Expired/reused link shows the expired state correctly
- [ ] Full flow works end to end on mobile

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. May 28, 2026.*
