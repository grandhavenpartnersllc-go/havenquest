-- Allow authenticated users to read their own row in public.users.
-- The table has no auth_id column; email is unique in both auth.users and public.users.

-- Enable RLS if not already on (safe to run twice)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policy with the same name so this migration is re-runnable
DROP POLICY IF EXISTS "Users can read own record" ON public.users;

CREATE POLICY "Users can read own record"
  ON public.users
  FOR SELECT
  USING (email = auth.jwt() ->> 'email');
