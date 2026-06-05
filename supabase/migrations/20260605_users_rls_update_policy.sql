-- Allow authenticated users to update their own record in public.users
CREATE POLICY "Users can update own record"
  ON public.users
  FOR UPDATE
  USING (email = auth.jwt() ->> 'email')
  WITH CHECK (email = auth.jwt() ->> 'email');

NOTIFY pgrst, 'reload schema';
