-- MM3 activity-events storage scaffolding (invisible foundation).
-- Append-only journal of high-signal MM3 interactions (pins/unpins, city focus,
-- report opens, archetype changes, priority + non-negotiable edits, glossary opens,
-- Amy questions), later fed to an AI-summarized briefing for the Market Director.
--
-- This migration stands up PLUMBING ONLY. No interactions are instrumented yet; the
-- client helper (utils/activityLog.ts) ships with zero call sites. Emissions must not
-- reach real prospects before the Phase 4 consent/disclosure review.
--
-- Ownership key is user_email (text), matching the working repo identity pattern:
--   * Every API route resolves users by public.users.email. In this project
--     public.users.id is decoupled from auth.uid() (0 of 2 rows match), so an
--     id-based FK / auth.uid() RLS would NOT work here -- email is the identity that
--     actually links to auth.
--   * messages / md_clients likewise key on *_email text with no FK to users.id.
-- All writes go through the service-role server route (app/api/portal/activity),
-- which sets user_email from the authenticated hq_auth session -- never from the body.

CREATE TABLE IF NOT EXISTS public.mm3_activity_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email text NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Per-user, time-ordered access. Composite index covers both user_email lookups
-- (leftmost prefix) and created_at ordering within a user's events.
CREATE INDEX IF NOT EXISTS idx_mm3_activity_events_user_created
  ON public.mm3_activity_events (user_email, created_at);

ALTER TABLE public.mm3_activity_events ENABLE ROW LEVEL SECURITY;

-- A user may read ONLY their own events. Mirrors the one working RLS pattern in this
-- repo (public.users "Users can read own record": email = auth.jwt() ->> 'email').
DROP POLICY IF EXISTS "Users can read own activity events" ON public.mm3_activity_events;
CREATE POLICY "Users can read own activity events"
  ON public.mm3_activity_events
  FOR SELECT
  USING (user_email = auth.jwt() ->> 'email');

-- No INSERT/UPDATE/DELETE policies by design: clients (anon key) cannot write. All
-- writes happen server-side via the service-role client, which bypasses RLS and sets
-- user_email from the authenticated session.

NOTIFY pgrst, 'reload schema';
