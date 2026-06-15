-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policy: users can upload their own photo
CREATE POLICY "Users can upload own profile photo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-photos' AND
  auth.email() = split_part(name, '/', 1)
);

-- RLS policy: users can update their own photo
CREATE POLICY "Users can update own profile photo"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-photos' AND
  auth.email() = split_part(name, '/', 1)
);

-- RLS policy: users can read their own photo
CREATE POLICY "Users can read own profile photo"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'profile-photos' AND
  auth.email() = split_part(name, '/', 1)
);
