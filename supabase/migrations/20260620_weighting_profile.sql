ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS dna_weighting_profile jsonb;

NOTIFY pgrst, 'reload schema';
