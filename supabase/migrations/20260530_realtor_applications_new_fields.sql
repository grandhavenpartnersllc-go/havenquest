ALTER TABLE public.realtor_applications
  ADD COLUMN IF NOT EXISTS market_segments text[],
  ADD COLUMN IF NOT EXISTS transactions jsonb,
  ADD COLUMN IF NOT EXISTS har_profile_url text;

NOTIFY pgrst, 'reload schema';
