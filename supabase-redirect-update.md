# Build Brief — Update Supabase Auth Redirect URLs

## Objective
Add the new /compass/meridian redirect URLs to the Supabase project's allowed redirect URLs using the Supabase Management API. This is required for the Meridian MD portal auth flow to work correctly after the route rename.

---

## Step 1 — Read Current Redirect URLs
Run the following to fetch the current Supabase project auth config. Replace PROJECT_REF with the actual project ref (gsxiqberewwzoohhuphn):

```
curl -s -X GET "https://api.supabase.com/v1/projects/gsxiqberewwzoohhuphn/config/auth" \
  -H "Authorization: Bearer $env:SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

Report the current value of the `additional_redirect_urls` field exactly as returned.

---

## Step 2 — Check .env.local for Supabase Access Token
Check .env.local for a variable named SUPABASE_ACCESS_TOKEN or similar personal access token (not the anon key — a personal access token from supabase.com/account/tokens).

If not found, report that the token is missing and stop — Craig will need to add it to .env.local before proceeding. The token can be created at https://supabase.com/dashboard/account/tokens

---

## Step 3 — Update Redirect URLs
Once the current list is confirmed and the access token is available, PATCH the auth config to add the new URLs. The new list must INCLUDE all existing URLs plus the four new ones below — do not remove any existing entries:

New URLs to add:
- https://havenquest.co/compass/meridian
- https://havenquest.co/compass/meridian/login
- http://localhost:3000/compass/meridian
- http://localhost:3000/compass/meridian/login

```
curl -s -X PATCH "https://api.supabase.com/v1/projects/gsxiqberewwzoohhuphn/config/auth" \
  -H "Authorization: Bearer $env:SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "additional_redirect_urls": "[FULL LIST INCLUDING EXISTING + NEW URLs]"
  }'
```

---

## Step 4 — Verify
Re-run the GET from Step 1 and confirm all four new URLs appear in the response.

---

## Step 5 — Report Back
Paste into Claude chat:
- The original redirect URL list
- The updated redirect URL list
- Confirmation all four new URLs are present
- Whether the SUPABASE_ACCESS_TOKEN was found or missing
