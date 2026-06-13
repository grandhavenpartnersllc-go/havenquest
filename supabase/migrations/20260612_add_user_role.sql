ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS user_role varchar(20) DEFAULT 'client';
