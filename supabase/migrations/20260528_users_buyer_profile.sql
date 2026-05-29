-- Add buyer_profile JSONB column to store Step 5 quiz answers.
-- Stores bedrooms, bathrooms, homeType, constructionPreference.
-- Used for Zillow URL construction and future IDX/realtor profile features.
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS buyer_profile JSONB;
