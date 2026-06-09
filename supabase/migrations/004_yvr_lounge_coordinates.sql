-- ============================================================
-- YVR Lounge Coordinates (name-based matching, safe to re-run)
-- Run in Supabase SQL Editor.
-- ============================================================

-- Add columns (idempotent — migration 003 may not have been run)
ALTER TABLE lounges ADD COLUMN IF NOT EXISTS latitude  DECIMAL(10, 6);
ALTER TABLE lounges ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 6);
CREATE INDEX IF NOT EXISTS idx_lounges_coords ON lounges(latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- ============================================================
-- SET COORDINATES — matched by name pattern, not slug,
-- so it works regardless of what slugs exist in the live DB.
-- ============================================================

-- Plaza Premium — Pier C / Gate C29 area (domestic)
UPDATE lounges SET latitude=49.194538, longitude=-123.181280
  WHERE airport_id=(SELECT id FROM airports WHERE iata_code='YVR')
  AND name ILIKE '%plaza premium%'
  AND (name ILIKE '%c29%' OR name ILIKE '%pier c%' OR name ILIKE '%gate c2%' OR name ILIKE '%pier-c%');

-- Air Canada Maple Leaf — Domestic
UPDATE lounges SET latitude=49.195063, longitude=-123.181670
  WHERE airport_id=(SELECT id FROM airports WHERE iata_code='YVR')
  AND name ILIKE '%maple leaf%' AND name ILIKE '%domestic%';

-- Air Canada Café — Gates C46–C47 (gate 46, the CORRECT one to keep)
UPDATE lounges SET latitude=49.195515, longitude=-123.184459
  WHERE airport_id=(SELECT id FROM airports WHERE iata_code='YVR')
  AND name ILIKE '%caf%'
  AND (name ILIKE '%46%' OR name ILIKE '%c46%');

-- DEACTIVATE the duplicate Air Canada Café (Gate C50)
UPDATE lounges SET is_active=false
  WHERE airport_id=(SELECT id FROM airports WHERE iata_code='YVR')
  AND name ILIKE '%caf%'
  AND (name ILIKE '%c50%' OR name ILIKE '%50%')
  AND name NOT ILIKE '%c46%'
  AND name NOT ILIKE '%46%';

-- Plaza Premium — Domestic Terminal main level / Gate B15
UPDATE lounges SET latitude=49.192691, longitude=-123.181204
  WHERE airport_id=(SELECT id FROM airports WHERE iata_code='YVR')
  AND name ILIKE '%plaza premium%'
  AND name ILIKE '%domestic%'
  AND NOT (name ILIKE '%c29%' OR name ILIKE '%pier c%' OR name ILIKE '%us%');

-- Air Canada Signature Suite
UPDATE lounges SET latitude=49.196097, longitude=-123.178282
  WHERE airport_id=(SELECT id FROM airports WHERE iata_code='YVR')
  AND name ILIKE '%signature%';

-- Air Canada Maple Leaf — International
UPDATE lounges SET latitude=49.196314, longitude=-123.178199
  WHERE airport_id=(SELECT id FROM airports WHERE iata_code='YVR')
  AND name ILIKE '%maple leaf%' AND name ILIKE '%international%';

-- Plaza Premium — US Departures
UPDATE lounges SET latitude=49.197075, longitude=-123.177096
  WHERE airport_id=(SELECT id FROM airports WHERE iata_code='YVR')
  AND name ILIKE '%plaza premium%' AND name ILIKE '%us%';

-- Air Canada Maple Leaf — Transborder
UPDATE lounges SET latitude=49.197158, longitude=-123.175719
  WHERE airport_id=(SELECT id FROM airports WHERE iata_code='YVR')
  AND name ILIKE '%maple leaf%'
  AND (name ILIKE '%transborder%' OR name ILIKE '%trans-border%' OR name ILIKE '%trans border%');

-- SkyTeam Lounge
UPDATE lounges SET latitude=49.197719, longitude=-123.178674
  WHERE airport_id=(SELECT id FROM airports WHERE iata_code='YVR')
  AND name ILIKE '%skyteam%';

-- Cathay Pacific Lounge
UPDATE lounges SET latitude=49.198236, longitude=-123.179171
  WHERE airport_id=(SELECT id FROM airports WHERE iata_code='YVR')
  AND name ILIKE '%cathay%';

-- Plaza Premium — International Departures, Pier D (not First)
UPDATE lounges SET latitude=49.199043, longitude=-123.181889
  WHERE airport_id=(SELECT id FROM airports WHERE iata_code='YVR')
  AND name ILIKE '%plaza premium%'
  AND name ILIKE '%international%'
  AND name NOT ILIKE '%first%';

-- Plaza Premium First — International, Pier D
UPDATE lounges SET latitude=49.199158, longitude=-123.182534
  WHERE airport_id=(SELECT id FROM airports WHERE iata_code='YVR')
  AND (
    (name ILIKE '%plaza premium first%')
    OR (name ILIKE '%plaza premium%' AND name ILIKE '%first%')
  );

-- Catch-all: any remaining Maple Leaf lounge at YVR without a coordinate yet
-- (handles the simple 'Air Canada Maple Leaf Lounge' entry from the seed)
UPDATE lounges SET latitude=49.196314, longitude=-123.178199
  WHERE airport_id=(SELECT id FROM airports WHERE iata_code='YVR')
  AND name ILIKE '%maple leaf%'
  AND latitude IS NULL;

-- ============================================================
-- Verify — run this SELECT after to confirm coordinates applied
-- ============================================================
SELECT name, latitude, longitude, is_active
FROM lounges l
JOIN airports a ON l.airport_id = a.id
WHERE a.iata_code = 'YVR'
ORDER BY latitude;
