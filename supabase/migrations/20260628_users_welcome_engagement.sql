ALTER TABLE public.users ADD COLUMN IF NOT EXISTS welcome_seen boolean DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS engagement_paid boolean DEFAULT false;
NOTIFY pgrst, 'reload schema';
