ALTER TABLE public.quiz_sessions
ADD COLUMN IF NOT EXISTS environment integer,
ADD COLUMN IF NOT EXISTS pace integer,
ADD COLUMN IF NOT EXISTS culture integer;

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS environment integer,
ADD COLUMN IF NOT EXISTS pace integer,
ADD COLUMN IF NOT EXISTS culture integer;

NOTIFY pgrst, 'reload schema';
