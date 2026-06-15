ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS profile_photo_url text,
ADD COLUMN IF NOT EXISTS origin_city text,
ADD COLUMN IF NOT EXISTS origin_state text,
ADD COLUMN IF NOT EXISTS partner_name text;

-- phone already exists in the users table (added at quiz time)
-- this migration is a no-op for that column
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS phone text;
