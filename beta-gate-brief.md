# Build Brief — Beta Access Gate (Full Page Takeover)

## Objective
Add a full-page beta access gate to HavenQuest. First-time visitors see a branded full-screen overlay requiring a beta access code before they can access the site. Returning visitors on the same device bypass it automatically via localStorage.

---

## Environment Variable
Add to .env.local and flag for Craig to set in Vercel:
```
NEXT_PUBLIC_BETA_ACCESS_CODE=xxxx
```
Craig will set the actual code in Vercel → Project Settings → Environment Variables after deployment.

If the env var is not set, the gate is bypassed entirely (preserves local dev experience).

---

## New Component
Create components/BetaGate.tsx:

The component should:
1. On mount, check localStorage for key `hq_beta_access` = `'granted'`
2. If found → render nothing (return null) — site loads normally
3. If not found → render full-screen overlay

### Full Screen Overlay Design
- Position: fixed, top 0, left 0, width 100vw, height 100vh, z-index 9999
- Background: brand navy #0A1E3D
- Centered content card (max-width 440px, white background, border-radius 12px, padding 40px)
- HavenQuest logo text at top: "Haven**Quest**" in brand styling (navy/blue split)
- Tagline below logo: "We don't help you pick a house. We help you find your home."
- Divider line
- Heading: "Beta Access Required"
- Subheading: "HavenQuest is currently in private beta. Enter your access code to continue."
- 4-digit code input (maxLength=4, type="password", centered, large font, brand blue border on focus)
- "Enter" button (brand blue, full width)
- Error message (red) shown on wrong code: "Incorrect access code. Please try again."
- Footer text at bottom of overlay (outside card): "© 2026 HavenQuest · A Grand Haven Partners Company" in muted white

### On Correct Code
1. Set localStorage key `hq_beta_access` = `'granted'`
2. Unmount the overlay (setGranted(true) → return null)
3. Site becomes fully accessible

### On Wrong Code
- Show error message
- Clear the input
- Allow retry (no lockout for beta)

---

## Integration
Add BetaGate to app/layout.tsx so it wraps the entire application:

```tsx
import BetaGate from '@/components/BetaGate'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <BetaGate />
        {children}
      </body>
    </html>
  )
}
```

The overlay renders on top of everything via z-index. No routes are excluded — the gate covers the entire site including /portal, /compass/meridian, and /compass/admin.

---

## Important Note on Staff Portals
Staff users (MDs, Craig) will also see the beta gate on first visit to a new device. This is acceptable — they receive the beta code directly from Craig. The beta gate code and the portal access codes are separate — staff need both.

---

## Removal Instructions (for when beta ends)
To remove the gate:
1. Delete components/BetaGate.tsx
2. Remove <BetaGate /> from app/layout.tsx
3. Remove NEXT_PUBLIC_BETA_ACCESS_CODE from Vercel env vars
4. Deploy

---

## Commit and Deploy
```
git add -A
git commit -m "feat: add full-page beta access gate with localStorage bypass for returning visitors"
git push origin main
```

Confirm Vercel deployment triggered. Report commit hash.

---

## Report Back
- Confirm BetaGate component created
- Confirm integrated into app/layout.tsx
- Git commit hash
- Reminder for Craig to set NEXT_PUBLIC_BETA_ACCESS_CODE in Vercel
