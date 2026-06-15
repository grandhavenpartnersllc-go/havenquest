# Build Brief — COMPASS Admin Portal (Phase 1)

## Overview
Build the COMPASS Admin portal at /compass/admin — Craig's super admin interface for provisioning staff accounts, managing Market Directors and Select Agents, and overseeing the full platform. This is a Phase 1 gate item — it must exist before the first real Market Director is onboarded.

## Route
/compass/admin

## Auth
- user_role = 'admin' required — most restrictive role in the system
- If no admin session: redirect to /compass/admin/login
- Login uses Supabase Auth (email + password) — same auth system as the rest of the platform
- After login: verify user_role = 'admin' — if not admin, redirect to /portal with an error

## Brand / Styling
- Use the existing HavenQuest brand palette: Navy #0A1E3D, Blue #0076B6, Gold #C5B783
- Dark sidebar, clean card-based content area
- Follow the same TailwindCSS patterns already used in the Meridian portal
- Label the portal "COMPASS Admin" in the header/nav

---

## Phase 1 Scope — What to Build

### 1. Database Migrations
Create two new Supabase tables via migration files in /supabase/migrations/:

```sql
-- Table: public.staff_accounts
CREATE TABLE public.staff_accounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role varchar(20) NOT NULL CHECK (role IN ('market_director', 'state_director', 'admin')),
  metro varchar(20) CHECK (metro IN ('austin', 'dfw', 'houston', 'san_antonio', 'all')),
  status varchar(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  calendly_url text,
  microsoft_365_provisioned boolean DEFAULT false,
  compass_walkthrough_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS: Only admin role can read/write
ALTER TABLE public.staff_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only" ON public.staff_accounts
  USING (auth.jwt()->>'user_role' = 'admin');

-- Table: public.admin_audit_log
CREATE TABLE public.admin_audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email text NOT NULL,
  action text NOT NULL,
  target_email text,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- RLS: Only admin role can read
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only" ON public.admin_audit_log
  USING (auth.jwt()->>'user_role' = 'admin');
```

### 2. File Structure to Create
```
app/compass/admin/
  layout.tsx              — auth guard (user_role = 'admin'), sidebar nav
  login/
    page.tsx              — admin login form
  page.tsx                — dashboard home (platform health summary)
  staff/
    page.tsx              — staff roster (all MDs and State Directors)
    new/
      page.tsx            — provision new staff account form
  clients/
    page.tsx              — all active Navigator clients, MileMarker status, MD assignment
  agents/
    page.tsx              — Select Agent application queue + active agents list
  system/
    page.tsx              — system config (access code management, metro toggles)
  components/
    AdminSidebar.tsx      — nav sidebar
    AdminTopBar.tsx       — top bar with Craig's name and sign out
    StaffCard.tsx         — reusable staff member card
    ClientRow.tsx         — reusable client table row
    AgentRow.tsx          — reusable agent table row
```

### 3. API Routes to Create
```
app/api/admin/
  provision-staff/
    route.ts     — POST: create new staff Supabase Auth account + set role + insert staff_accounts + send welcome email + log to audit
  update-staff/
    route.ts     — PATCH: update role, metro, status on existing staff account + log to audit
  assign-client/
    route.ts     — PATCH: assign or reassign a Navigator client to an MD + log to audit
```

All admin API routes must:
- Use the Supabase service role client (bypasses RLS)
- Verify the calling user has user_role = 'admin' before executing
- Log every action to public.admin_audit_log

### 4. Staff Provisioning Flow
The "Add Market Director" form at /compass/admin/staff/new collects:
- Full name
- @havenquest.co email address
- Assigned metro (Austin / DFW / Houston / San Antonio)
- Start date

On submit, /api/admin/provision-staff:
1. Calls supabase.auth.admin.createUser() with email and a temporary password
2. Sets user_role = 'market_director' on public.users
3. Inserts record into public.staff_accounts
4. Sends welcome email via Resend to the new MD with:
   - Their login credentials
   - Link to /compass/meridian/login
   - Onboarding checklist
5. Logs action to public.admin_audit_log
6. Returns success — admin UI shows onboarding checklist:
   - ✅ Supabase account created
   - ✅ user_role set to market_director
   - 🔲 Microsoft 365 account provisioned (manual — admin.microsoft.com)
   - 🔲 Calendly calendar set up for new MD
   - 🔲 First client assigned
   - 🔲 COMPASS Meridian walkthrough completed

### 5. Staff Roster Page (/compass/admin/staff)
Table showing all staff accounts from public.staff_accounts:
- Name, email, role, metro, status, created date
- Actions: Edit metro, Deactivate, Reset password
- Filter by role (Market Director / State Director) and metro

### 6. Client Assignment Page (/compass/admin/clients)
Table showing all Navigator clients from public.users:
- Name, email, current MileMarker, assigned MD, last active date
- Highlight unassigned clients (completed MM4 intake but no MD assigned)
- Assign or reassign MD via dropdown

### 7. Select Agent Queue (/compass/admin/agents)
Table showing all applications from public.realtor_applications:
- Name, email, metro, application date, status
- Approve or reject buttons
- On approve: update status in realtor_applications, send approval email via Resend

### 8. System Config (/compass/admin/system)
- MD Portal Access Code — display current NEXT_PUBLIC_MD_ACCESS_CODE value, allow update (writes to Vercel env via API if possible, otherwise display instructions)
- Metro toggles — active/inactive per metro (store in a new public.system_config table or as a simple JSON field)

### 9. Craig's Account — Set to Admin Role
After building the auth guard, run this SQL in Supabase to set Craig's role:
```sql
UPDATE public.users
SET user_role = 'admin'
WHERE email = 'craig.asbach@havenquest.co';
```
Note: Craig must have a record in public.users first. If not, he needs to sign up at /portal once to create the Supabase Auth record, then run this SQL.

### 10. Add /compass/admin Redirect URLs to Supabase
Using the SUPABASE_ACCESS_TOKEN already in .env.local, PATCH the Supabase auth config to add:
- https://havenquest.co/compass/admin
- https://havenquest.co/compass/admin/login
- http://localhost:3000/compass/admin
- http://localhost:3000/compass/admin/login

---

## Security Requirements
- /compass/admin is not linked from anywhere public — no nav links, no footer links
- All admin routes server-side verify user_role = 'admin' — client-side check alone is not sufficient
- All admin actions log to public.admin_audit_log — who, what, when, target
- No destructive action (deactivate, delete) executes without a confirmation step in the UI

---

## What Phase 1 Does NOT Include
- Revenue dashboard with financial data (Phase 2)
- Full platform analytics (Phase 2)
- Email template editor (Phase 2)
- SARAH (Select Agent portal) management — SARAH doesn't exist yet

---

## Commit and Deploy
After all files are created and tested locally:
```
git add -A
git commit -m "feat: COMPASS Admin portal Phase 1 — staff provisioning, client assignment, agent queue"
git push origin main
```
Confirm Vercel deployment triggered.

---

## Report Back
Paste into Claude chat:
- All files created (list)
- Migration file names
- Any issues encountered
- SQL needed to set Craig's account to admin role (if public.users record exists)
- Git commit hash
