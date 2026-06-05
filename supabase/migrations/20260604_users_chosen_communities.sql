ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS chosen_communities text[];

NOTIFY pgrst, 'reload schema';
