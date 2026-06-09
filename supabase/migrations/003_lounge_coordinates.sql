-- Add per-lounge GPS coordinates so the navigate map can zoom to exact lounge locations.
-- Run this in the Supabase SQL editor, then populate lat/lng for each lounge manually.
ALTER TABLE lounges ADD COLUMN IF NOT EXISTS latitude  DECIMAL(10, 6);
ALTER TABLE lounges ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 6);

CREATE INDEX IF NOT EXISTS idx_lounges_coords ON lounges(latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
