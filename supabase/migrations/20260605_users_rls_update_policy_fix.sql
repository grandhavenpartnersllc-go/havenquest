-- Fix: milemarker advances (current_milemarker) were silently not persisting.
--
-- Root cause: public.users is keyed by email (no auth_id/id-based RLS). The SELECT
-- policy works, so reads succeed — but the UPDATE policy either was never applied in
-- production (the prior migration lacked DROP POLICY IF EXISTS, so a re-run errors and
-- the apply can fail) or the JWT email claim differed in case from the stored lowercase
-- email. A blocked UPDATE affects 0 rows and returns NO error, so it looked like success.
--
-- This migration is re-runnable and makes both policies case-insensitive on email.
-- Safe to paste directly into the Supabase dashboard SQL editor.

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own record" ON public.users;
DROP POLICY IF EXISTS "Users can update own record" ON public.users;

CREATE POLICY "Users can read own record"
  ON public.users
  FOR SELECT
  USING (lower(email) = lower(auth.jwt() ->> 'email'));

CREATE POLICY "Users can update own record"
  ON public.users
  FOR UPDATE
  USING (lower(email) = lower(auth.jwt() ->> 'email'))
  WITH CHECK (lower(email) = lower(auth.jwt() ->> 'email'));

NOTIFY pgrst, 'reload schema';
