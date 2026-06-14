# Build Brief — Rename /md → /compass/meridian

## Objective
Move the Market Director portal from /md to /compass/meridian. This is a route rename only — no functional changes to any components or logic.

---

## Step 1 — Audit All /md References
Before touching anything, search the entire codebase for every reference to the current route. Run each of these searches and list every file and line found:

```
grep -r '"/md"' . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" -n
grep -r "'/md'" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" -n
grep -r '/md/login' . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" -n
grep -r '/md/clients' . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" -n
grep -r 'pathname.*md' . --include="*.ts" --include="*.tsx" -n
```

Report all findings before making any changes.

---

## Step 2 — Rename the Directory
Rename the App Router directory:
```
app/md/ → app/compass/meridian/
```

Create the /compass/ folder if it doesn't exist. Move all contents of app/md/ into app/compass/meridian/ preserving the full subdirectory structure.

---

## Step 3 — Update All Internal References
In every file identified in Step 1, replace:
- `/md/login` → `/compass/meridian/login`
- `/md/clients` → `/compass/meridian/clients`
- `"/md"` → `"/compass/meridian"`
- `'/md'` → `'/compass/meridian'`
- Any other /md route references found in Step 1

Also check and update:
- Any `redirect()` calls referencing /md
- Any `router.push()` calls referencing /md
- Any `href` values referencing /md
- middleware.ts if it exists — check for /md route matching
- Any auth layout files that check pathname against /md

---

## Step 4 — Update Supabase Auth Redirect URLs
The Supabase Auth dashboard has allowed redirect URLs configured. The MD auth callback may reference /md. Check the auth callback route at app/auth/callback/route.ts for any /md references and update to /compass/meridian.

Note: The Supabase dashboard redirect URLs must also be updated manually by Craig at supabase.com → Authentication → URL Configuration. Add:
- https://havenquest.co/compass/meridian
- https://havenquest.co/compass/meridian/login
- http://localhost:3000/compass/meridian
- http://localhost:3000/compass/meridian/login

Flag this clearly in your report so Craig knows to do it.

---

## Step 5 — Add Redirect from Old Route
Add a redirect in next.config.js so any bookmark or link to /md/login automatically forwards to /compass/meridian/login:

```javascript
async redirects() {
  return [
    {
      source: '/md',
      destination: '/compass/meridian',
      permanent: true,
    },
    {
      source: '/md/login',
      destination: '/compass/meridian/login',
      permanent: true,
    },
    {
      source: '/md/:path*',
      destination: '/compass/meridian/:path*',
      permanent: true,
    },
  ]
},
```

---

## Step 6 — Verify
Run the same searches from Step 1 again. Confirm zero remaining references to the old /md routes (except the redirects added in next.config.js).

---

## Step 7 — Commit and Deploy
```
git add -A
git commit -m "feat: rename /md portal to /compass/meridian — Meridian route migration"
git push origin main
```

Confirm push succeeded and Vercel deployment triggered.

---

## Step 8 — Report Back
Paste into Claude chat:
- Full list of files changed
- Confirmation zero /md references remain (outside redirects)
- Supabase dashboard URL update reminder flagged
- Git commit hash
- Any issues encountered
