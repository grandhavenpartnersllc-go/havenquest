# HavenQuest — Phase 1 MD Portal (COMPASS) Build Brief

**Date:** June 12, 2026
**Stack:** Next.js 14 App Router, TypeScript strict, TailwindCSS, Supabase, Resend
**Deploy:** Vercel via GitHub origin/main — commit and push after each phase

---

## Overview

Build a separate, hidden Market Director portal at `/md` — distinct from the client portal at `/portal`. The MD portal uses the same Supabase Auth system as the client portal but routes users with the `market_director` role to the MD workspace instead of the client journey.

This is a Phase 1 functional build — enough for Craig to manage the Austin pilot clients. The full COMPASS MD Dashboard is a Phase 2 build. This brief establishes the foundation that Phase 2 builds on.

**Architecture principle:** All MD-to-client communication is logged in Supabase and flows through the platform. Resend handles email notifications. The MD never needs to leave COMPASS to communicate with a client.

---

## Phase 0 — Audit

Before writing any code, read and report on:

1. Current Supabase Auth setup — how user roles are handled, what columns exist on `auth.users` or `public.users` that could indicate role
2. Current `/portal` layout and auth guard — how the client portal detects and redirects unauthenticated users
3. Current `public.messages` table — does it exist? If so, what columns?
4. Current `public.users` schema — confirm all columns, especially any role-related fields
5. Existing Resend email pattern — confirm import and send pattern from the codebase

Report findings before proceeding.

---

## Phase 1 — Database Migration

Run each SQL block separately in Supabase SQL editor for project `gsxiqberewwzoohhuphn`. Confirm "Success. No rows returned" after each before proceeding.

### Block 1 — Add role column to public.users
```sql
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS user_role varchar(20) DEFAULT 'client';
```

### Block 2 — Messages table
```sql
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_email text NOT NULL,
  md_email text NOT NULL,
  sender_role varchar(20) NOT NULL, -- 'md' | 'client'
  subject text,
  body text NOT NULL,
  read boolean DEFAULT false,
  notification_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- MD can read and insert messages for their clients
CREATE POLICY "MD can read messages"
  ON public.messages FOR SELECT
  USING (
    md_email = (SELECT email FROM public.users WHERE id = auth.uid())
    OR
    client_email = (SELECT email FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "MD can insert messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    md_email = (SELECT email FROM public.users WHERE id = auth.uid())
    OR
    client_email = (SELECT email FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update own messages read status"
  ON public.messages FOR UPDATE
  USING (
    client_email = (SELECT email FROM public.users WHERE id = auth.uid())
    OR
    md_email = (SELECT email FROM public.users WHERE id = auth.uid())
  );
```

### Block 3 — MD client assignments table
```sql
CREATE TABLE IF NOT EXISTS public.md_clients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  md_email text NOT NULL,
  client_email text NOT NULL,
  assigned_at timestamptz DEFAULT now(),
  status varchar(20) DEFAULT 'active', -- 'active' | 'closed' | 'paused'
  journey_health varchar(20) DEFAULT 'on_track', -- 'on_track' | 'needs_attention' | 'at_risk'
  internal_notes text, -- MD private notes — never visible to client
  shared_notes text,   -- MD notes visible to client in My Profile
  UNIQUE(md_email, client_email)
);

ALTER TABLE public.md_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "MD can read own client assignments"
  ON public.md_clients FOR SELECT
  USING (md_email = (SELECT email FROM public.users WHERE id = auth.uid()));

CREATE POLICY "MD can update own client records"
  ON public.md_clients FOR UPDATE
  USING (md_email = (SELECT email FROM public.users WHERE id = auth.uid()));

CREATE POLICY "MD can insert client assignments"
  ON public.md_clients FOR INSERT
  WITH CHECK (md_email = (SELECT email FROM public.users WHERE id = auth.uid()));

-- Clients can read their own shared_notes
CREATE POLICY "Clients can read own shared notes"
  ON public.md_clients FOR SELECT
  USING (client_email = (SELECT email FROM public.users WHERE id = auth.uid()));
```

After all blocks succeed, reload Supabase schema cache:
Dashboard → Settings → API → Reload schema

Report confirmation before proceeding.

---

## Phase 2 — TypeScript Interfaces

Add to `/types/index.ts`:

```typescript
export interface MDClient {
  id?: string;
  md_email: string;
  client_email: string;
  assigned_at?: string;
  status: 'active' | 'closed' | 'paused';
  journey_health: 'on_track' | 'needs_attention' | 'at_risk';
  internal_notes?: string;
  shared_notes?: string;
}

export interface Message {
  id?: string;
  client_email: string;
  md_email: string;
  sender_role: 'md' | 'client';
  subject?: string;
  body: string;
  read: boolean;
  notification_sent: boolean;
  created_at?: string;
}

export interface MDClientWithProfile {
  assignment: MDClient;
  profile: UserProfile;
  mm4Profile?: MM4Profile;
  currentMM: number;
  unreadMessages: number;
}
```

---

## Phase 3 — File Structure

Create the following directory structure:

```
/app/md/
  layout.tsx              ← MD portal shell — auth guard, MD-only access
  login/
    page.tsx              ← MD login page
  page.tsx                ← redirects to /md/clients
  clients/
    page.tsx              ← client roster
  clients/[email]/
    page.tsx              ← individual client workspace
  components/
    MDTopBar.tsx          ← top navigation bar
    ClientRoster.tsx      ← client list component
    ClientWorkspace.tsx   ← individual client detail view
    ClientProfile.tsx     ← full MM4 intake profile display
    MDNotes.tsx           ← internal + shared notes editor
    MessageComposer.tsx   ← new message composer
    MessageThread.tsx     ← conversation history
    MilemarkerAdvance.tsx ← advance client to next MM
    JourneyHealthBadge.tsx
```

---

## Phase 4 — MD Authentication

### MD Login Page — `/app/md/login/page.tsx`

**URL:** `/md/login` — not linked from anywhere public. Access by direct URL only.

**Design:**
- Clean centered card — same brand palette as client portal
- HavenQuest logo at top
- Heading: "Market Director Portal"
- Subheading: "COMPASS — HavenQuest Operating System"
- Email and password fields
- Sign in button — brand navy
- No "sign up" link — MD accounts are provisioned by Craig only
- No "forgot password" link on the visible form — add a subtle text link below the button: "Contact craig.asbach@havenquest.co for access"
- Optional access code field below email/password — a simple 6-character alphanumeric code that must match a value stored in an environment variable `MD_ACCESS_CODE`. This is an obscurity gate, not a security feature. If `MD_ACCESS_CODE` is not set in env, skip the check.

**Auth flow:**
1. User submits email + password + access code
2. Authenticate via `supabase.auth.signInWithPassword()`
3. After successful auth, read `user_role` from `public.users`
4. If `user_role === 'market_director'` → redirect to `/md/clients`
5. If `user_role === 'client'` or any other role → sign out and show error: "This portal is for Market Directors only. Please visit havenquest.co/portal for client access."
6. If auth fails → show standard error message

### MD Layout Auth Guard — `/app/md/layout.tsx`

Server component. Reads the session cookie (same `hq_auth` cookie pattern as the client portal). Checks `user_role` on `public.users`. If not `market_director` → redirect to `/md/login`.

Wraps all `/md/*` routes.

---

## Phase 5 — MD Top Bar

File: `/app/md/components/MDTopBar.tsx`

**Height:** 48px. Background: `#0A1E3D` (brand navy — always, regardless of theme).

**Left:**
- HavenQuest wordmark — "Haven" white, "Quest" brand blue
- Separator
- "COMPASS" label in gold `#C5B783`, font-size 12px, letter-spacing
- Separator
- "Market Director Portal" in rgba white 0.45

**Right:**
- Active clients count badge — "X Active Clients"
- Notification bell with unread count
- MD name from session
- Sign out button

**No theme toggle** — MD portal is always light theme in Phase 1.

---

## Phase 6 — Client Roster

File: `/app/md/clients/page.tsx` and `/app/md/components/ClientRoster.tsx`

**Data query:**
```typescript
// Get all clients assigned to this MD
const { data: assignments } = await supabase
  .from('md_clients')
  .select('*')
  .eq('md_email', mdEmail)
  .eq('status', 'active')
  .order('assigned_at', { ascending: false })

// For each assignment, get the client's public.users record and mm4_profiles record
// and unread message count from public.messages
```

**Roster layout:**
Clean table/card list. Each client row shows:

| Field | Source |
|---|---|
| Full name | mm4_profiles.primary_first_name + primary_last_name |
| Target city | mm4_profiles.confirmed_target_city |
| Current MileMarker | public.users.current_milemarker — shown as "MM4 — Connect" |
| Journey health | md_clients.journey_health — color badge |
| Submission date | mm4_profiles.submitted_at |
| Unread messages | Count from public.messages where read = false |
| Quick actions | "View Profile" button |

**Journey health badges:**
- 🟢 On Track — green
- 🟡 Needs Attention — amber
- 🔴 At Risk — red

MD can click the badge to change journey health status directly from the roster.

**Empty state:**
If no clients assigned yet: centered message — "No active clients assigned. New clients will appear here when they complete their MM4 intake."

---

## Phase 7 — Individual Client Workspace

File: `/app/md/clients/[email]/page.tsx`

URL pattern: `/md/clients/client@email.com`

The email is URL-encoded. Decode it to get the client's email, then query all relevant data.

**Layout:** Two-column — main content left (70%), sidebar right (30%)

### Main content (left):

**Section 1 — Client Profile**
Display the full MM4 intake in clean labeled sections matching the 5 intake form sections. Read-only. All fields visible. Clearly organized with section headings.

**Section 2 — MileMarker Advancement**
Current MM displayed prominently.
Dropdown to advance to next MM — only allows advancing one stage at a time.
"Advance to MM[N]" button — navy, requires confirmation modal before executing.
On confirm: updates `public.users.current_milemarker` for that client.
Log the advancement in a simple audit trail (can use messages table with sender_role: 'system').

**Section 3 — Message Thread**
Full conversation history between MD and client.
Messages displayed chronologically — MD messages right-aligned (navy), client messages left-aligned (light blue).
Shows read/unread status.
"New Message" button opens MessageComposer.

### Sidebar (right):

**Journey Health**
Current status badge — MD can change it here.
Last updated timestamp.

**Quick Stats**
- Days in current stage
- Total days in journey
- Submission date
- Target move date (from mm4_profiles)

**MD Notes — Two sections:**

*Internal Notes (private):*
- Label: "Internal Notes — Not visible to client"
- Textarea — MD can type freely
- Auto-saves on blur
- Saves to `md_clients.internal_notes`
- Red/amber visual indicator to remind MD these are private

*Shared Notes (client-visible):*
- Label: "Shared Notes — Visible to client in their portal"
- Textarea — MD writes notes intended for the client
- "Save & Share" button — explicit action, not auto-save
- On save: updates `md_clients.shared_notes` + updates `public.users.market_director_notes` if that column exists, or saves to a new `shared_notes` column on `public.users`
- Saves to `md_clients.shared_notes`
- Blue visual indicator — "Client can see this"

---

## Phase 8 — Message Composer

File: `/app/md/components/MessageComposer.tsx`

**Fields:**
- Subject (optional text input)
- Message body (textarea, min-height 120px)
- Send button — brand navy

**On send:**
1. Insert record into `public.messages`:
   ```typescript
   {
     client_email: clientEmail,
     md_email: mdEmail,
     sender_role: 'md',
     subject: subject,
     body: messageBody,
     read: false,
     notification_sent: false
   }
   ```

2. Send email notification to client via Resend:
   - **From:** craig.asbach@havenquest.co
   - **To:** client email
   - **Subject:** "New message from your Market Director — HavenQuest"
   - **Body:**
     ```
     [First Name],

     Your Market Director has sent you a message in your HavenQuest portal.

     [Subject if provided]

     Log in to read your message and reply:
     [View Message — button linking to /portal/mm4 or current MM URL]

     HavenQuest | havenquest.co
     ```

3. Update `notification_sent: true` on the message record
4. Display message immediately in the thread (optimistic update)

---

## Phase 9 — Client-Side Message Visibility

The client portal Command Center already has a Messages section that shows "0 unread messages." Wire this up now.

In `/app/portal/components/CommandCenter.tsx`:

Update the messages query to read from `public.messages` where `client_email = userEmail AND read = false`. This query already exists as a stub — activate it with the real table now that it exists.

When a client clicks "View all" in the Command Center messages section:
- For Phase 1: navigate to `/portal/mm4` (their current active workspace) with a `#messages` hash
- For Phase 2: dedicated messages view inside the portal

The client's unread message count should update in real time using Supabase realtime subscription if feasible, or on page load/navigation at minimum.

---

## Phase 10 — Provision First MD Account

After build is complete, provision Craig's MD account:

1. Craig already has a client account via Supabase Auth (email: craig.asbach@havenquest.co or the test account email)
2. Run in Supabase SQL editor:
   ```sql
   UPDATE public.users
   SET user_role = 'market_director'
   WHERE email = 'craig.asbach@havenquest.co';
   ```
3. Create an md_clients assignment for any existing test client:
   ```sql
   INSERT INTO public.md_clients (md_email, client_email, status, journey_health)
   VALUES ('craig.asbach@havenquest.co', 'test-client@email.com', 'active', 'on_track');
   ```
   Replace test-client@email.com with an actual beta client email from public.users.

4. Set MD_ACCESS_CODE in Vercel environment variables — a simple 6-character code Craig will use to access the MD login page.

Report the MD portal URL and confirm login works before closing out.

---

## Phase 11 — TypeScript Check, Commit, Deploy

```
npx tsc --noEmit && git add -A && git commit -m "feat: Phase 1 COMPASS MD portal — client roster, workspace, notes, messaging" && git push origin main
```

Confirm Vercel deployment triggered and successful.

---

## Summary of Deliverables

| Phase | Deliverable |
|---|---|
| 0 | Audit report |
| 1 | DB migration — messages, md_clients, user_role |
| 2 | TypeScript interfaces — MDClient, Message, MDClientWithProfile |
| 3 | File structure created |
| 4 | MD login page + auth guard |
| 5 | MD top bar |
| 6 | Client roster |
| 7 | Individual client workspace — profile, MileMarker advance, message thread, notes |
| 8 | Message composer + Resend notification |
| 9 | Client-side message visibility in Command Center |
| 10 | Craig's MD account provisioned |
| 11 | TypeScript check, commit, deploy |

**Report back to Claude chat at the end of each phase before starting the next.**

---

## Phase 2 COMPASS Features (Not In This Brief — Future Build)
- Full two-layer notes system with richer UI
- Notification center with all journey triggers
- Metro intelligence panel
- Performance dashboard
- Automated MileMarker advancement triggers
- Client-to-MD reply messaging from inside the client portal
- Multiple MD assignment and routing logic
