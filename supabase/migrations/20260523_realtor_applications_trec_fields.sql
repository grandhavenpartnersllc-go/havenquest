-- Add TREC license fields to realtor_applications
ALTER TABLE realtor_applications
  ADD COLUMN IF NOT EXISTS trec_license_number text,
  ADD COLUMN IF NOT EXISTS license_type        text,
  ADD COLUMN IF NOT EXISTS why_join            text,
  ADD COLUMN IF NOT EXISTS preferred_tier      text;
