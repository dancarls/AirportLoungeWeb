-- ============================================================
-- Deactivate duplicate Air Canada Café (Gate C50) at YVR
-- Run the SELECT first to confirm names, then the UPDATE.
-- ============================================================

-- STEP 1 — Run this to see exactly which cafés are in the DB
SELECT id, name, slug, is_active, latitude, longitude
FROM lounges
WHERE airport_id = (SELECT id FROM airports WHERE iata_code = 'YVR')
  AND name ILIKE '%caf%'
ORDER BY name;

-- ============================================================
-- STEP 2 — After confirming Step 1 shows two cafés, run this.
-- It deactivates every YVR café whose name does NOT contain
-- "46" or "c46" (i.e. keeps only the Gate C46-C47 one active).
-- If the café names do NOT include gate numbers, stop here and
-- share the Step 1 results so a targeted UPDATE can be written.
-- ============================================================
UPDATE lounges SET is_active = false
WHERE airport_id = (SELECT id FROM airports WHERE iata_code = 'YVR')
  AND name ILIKE '%caf%'
  AND is_active = true
  AND name NOT ILIKE '%46%'
  AND name NOT ILIKE '%c46%';

-- Verify — should show only 1 active café (the Gate C46-C47 one)
SELECT name, is_active, latitude, longitude
FROM lounges
WHERE airport_id = (SELECT id FROM airports WHERE iata_code = 'YVR')
  AND name ILIKE '%caf%';
