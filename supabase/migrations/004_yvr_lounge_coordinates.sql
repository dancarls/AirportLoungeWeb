-- ============================================================
-- YVR Lounge Coordinates + Missing Lounges
-- Run this in the Supabase SQL editor.
-- It is fully idempotent — safe to run more than once.
-- ============================================================

-- Add lat/lng columns (migration 003 may not have been run yet)
ALTER TABLE lounges ADD COLUMN IF NOT EXISTS latitude  DECIMAL(10, 6);
ALTER TABLE lounges ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 6);

CREATE INDEX IF NOT EXISTS idx_lounges_coords ON lounges(latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- ============================================================
-- UPDATE coordinates for existing YVR lounges
-- ============================================================

UPDATE lounges SET latitude = 49.194538, longitude = -123.181280
  WHERE slug = 'plaza-premium-domestic-pier-c-yvr';

UPDATE lounges SET latitude = 49.192691, longitude = -123.181204
  WHERE slug = 'plaza-premium-domestic-yvr';

UPDATE lounges SET latitude = 49.196314, longitude = -123.178199
  WHERE slug = 'ac-maple-leaf-lounge-yvr';

UPDATE lounges SET latitude = 49.197075, longitude = -123.177096
  WHERE slug = 'plaza-premium-us-yvr';

UPDATE lounges SET latitude = 49.197719, longitude = -123.178674
  WHERE slug = 'skyteam-lounge-yvr';

UPDATE lounges SET latitude = 49.199043, longitude = -123.181889
  WHERE slug = 'plaza-premium-international-yvr';

UPDATE lounges SET latitude = 49.199158, longitude = -123.182534
  WHERE slug = 'plaza-premium-first-yvr';

-- ============================================================
-- INSERT missing YVR lounges (or update coordinates if they
-- were added manually with a different slug — unlikely).
-- ON CONFLICT ensures this is safe to re-run.
-- ============================================================

-- Air Canada Maple Leaf Lounge (Domestic) — Pier A/B area
INSERT INTO lounges (
  name, slug, description, airport_id, terminal, location_detail,
  access_types, opening_hours, guest_fee, guest_fee_currency,
  capacity, is_active, website, latitude, longitude
)
SELECT
  'Air Canada Maple Leaf Lounge (Domestic)',
  'ac-maple-leaf-lounge-domestic-yvr',
  'The Air Canada Maple Leaf Lounge at Vancouver International domestic departures serves Air Canada Altitude members and eligible business class passengers with a full bar, hot food, and comfortable seating.',
  id,
  'Domestic',
  'Domestic Terminal, Level 3, post-security (near Pier A/B)',
  '[
    {"type":"airline_status","name":"Air Canada Altitude Elite 50K / Super Elite","details":"Complimentary for Elite 50K, Super Elite 75K, and Super Elite 100K members"},
    {"type":"class_of_service","name":"Air Canada Business Class","details":"Business class passengers on Air Canada domestic flights"},
    {"type":"credit_card","name":"TD Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"},
    {"type":"credit_card","name":"CIBC Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"}
  ]'::jsonb,
  '{"monday":"05:30-22:00","tuesday":"05:30-22:00","wednesday":"05:30-22:00","thursday":"05:30-22:00","friday":"05:30-22:00","saturday":"05:30-22:00","sunday":"05:30-22:00","notes":"Open daily; hours may vary on holidays"}'::jsonb,
  30.00, 'CAD', 150, true,
  'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges/vancouver.html',
  49.195063, -123.181670
FROM airports WHERE iata_code = 'YVR'
ON CONFLICT (slug) DO UPDATE SET
  latitude  = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude;

-- Air Canada Café (by gate 46)
INSERT INTO lounges (
  name, slug, description, airport_id, terminal, location_detail,
  access_types, opening_hours, guest_fee, guest_fee_currency,
  capacity, is_active, website, latitude, longitude
)
SELECT
  'Air Canada Café',
  'ac-cafe-yvr',
  'The Air Canada Café at Vancouver International is a lighter lounge experience near gate 46, offering coffee, snacks, and beverages for eligible Air Canada travellers departing on domestic flights.',
  id,
  'Domestic',
  'Domestic Terminal, near gate 46',
  '[
    {"type":"airline_status","name":"Air Canada Altitude Elite 25K+","details":"Complimentary for Altitude Elite 25K and above"},
    {"type":"class_of_service","name":"Air Canada Comfort / Latitude fare","details":"Passengers booked in eligible fare classes"},
    {"type":"credit_card","name":"TD Aeroplan Visa Infinite","details":"Primary cardholders"}
  ]'::jsonb,
  '{"monday":"05:30-21:00","tuesday":"05:30-21:00","wednesday":"05:30-21:00","thursday":"05:30-21:00","friday":"05:30-21:00","saturday":"05:30-21:00","sunday":"05:30-21:00","notes":"Hours follow domestic departure schedule"}'::jsonb,
  0.00, 'CAD', 60, true,
  'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges/vancouver.html',
  49.195515, -123.184459
FROM airports WHERE iata_code = 'YVR'
ON CONFLICT (slug) DO UPDATE SET
  latitude  = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude;

-- Air Canada Signature Suite (International)
INSERT INTO lounges (
  name, slug, description, airport_id, terminal, location_detail,
  access_types, opening_hours, guest_fee, guest_fee_currency,
  capacity, is_active, website, latitude, longitude
)
SELECT
  'Air Canada Signature Suite',
  'ac-signature-suite-yvr',
  'The Air Canada Signature Suite at Vancouver International is the airline''s ultra-premium lounge, offering à la carte dining, private suites, spa services, and dedicated concierge for international business and first class passengers.',
  id,
  'International',
  'International Terminal, Level 3, post-security',
  '[
    {"type":"class_of_service","name":"Air Canada International Business Class","details":"Business class passengers on Air Canada international flights"},
    {"type":"airline_status","name":"Air Canada Altitude Super Elite 100K","details":"Complimentary for Super Elite 100K members on international flights"}
  ]'::jsonb,
  '{"monday":"05:30-23:59","tuesday":"05:30-23:59","wednesday":"05:30-23:59","thursday":"05:30-23:59","friday":"05:30-23:59","saturday":"05:30-23:59","sunday":"05:30-23:59","notes":"Open daily when international flights operate"}'::jsonb,
  0.00, 'CAD', 50, true,
  'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges/vancouver.html',
  49.196097, -123.178282
FROM airports WHERE iata_code = 'YVR'
ON CONFLICT (slug) DO UPDATE SET
  latitude  = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude;

-- Air Canada Maple Leaf Lounge (Transborder / US Departures)
INSERT INTO lounges (
  name, slug, description, airport_id, terminal, location_detail,
  access_types, opening_hours, guest_fee, guest_fee_currency,
  capacity, is_active, website, latitude, longitude
)
SELECT
  'Air Canada Maple Leaf Lounge (Transborder)',
  'ac-maple-leaf-lounge-transborder-yvr',
  'The Air Canada Maple Leaf Lounge for US-bound travellers at Vancouver International, located in the US departures pre-clearance area with food, beverages, and business facilities.',
  id,
  'International',
  'US Departures (Transborder), post-customs pre-clearance area',
  '[
    {"type":"airline_status","name":"Air Canada Altitude Elite 50K / Super Elite","details":"Complimentary for eligible Altitude members on US transborder flights"},
    {"type":"class_of_service","name":"Air Canada Transborder Business Class","details":"Business class passengers on Air Canada US transborder flights"},
    {"type":"credit_card","name":"TD Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"},
    {"type":"credit_card","name":"CIBC Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"}
  ]'::jsonb,
  '{"monday":"05:00-22:00","tuesday":"05:00-22:00","wednesday":"05:00-22:00","thursday":"05:00-22:00","friday":"05:00-22:00","saturday":"05:00-22:00","sunday":"05:00-22:00","notes":"Hours follow US transborder departure schedule"}'::jsonb,
  30.00, 'CAD', 100, true,
  'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges/vancouver.html',
  49.197158, -123.175719
FROM airports WHERE iata_code = 'YVR'
ON CONFLICT (slug) DO UPDATE SET
  latitude  = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude;

-- Cathay Pacific Lounge (International)
INSERT INTO lounges (
  name, slug, description, airport_id, terminal, location_detail,
  access_types, opening_hours, guest_fee, guest_fee_currency,
  capacity, is_active, website, latitude, longitude
)
SELECT
  'Cathay Pacific Lounge',
  'cathay-pacific-lounge-yvr',
  'The Cathay Pacific Lounge at Vancouver International serves Cathay Pacific business and first class passengers with a full bar, hot Asian and Western cuisine, showers, and comfortable seating overlooking the terminal.',
  id,
  'International',
  'International Terminal, Level 3, post-security',
  '[
    {"type":"class_of_service","name":"Cathay Pacific First Class","details":"First class passengers on Cathay Pacific flights"},
    {"type":"class_of_service","name":"Cathay Pacific Business Class","details":"Business class passengers on Cathay Pacific flights"},
    {"type":"airline_status","name":"Marco Polo Club Diamond / Gold","details":"Elite status members on Cathay Pacific flights"},
    {"type":"airline_status","name":"oneworld Emerald / Sapphire","details":"oneworld top-tier members on Cathay Pacific flights"}
  ]'::jsonb,
  '{"monday":"09:00-01:00","tuesday":"09:00-01:00","wednesday":"09:00-01:00","thursday":"09:00-01:00","friday":"09:00-01:00","saturday":"09:00-01:00","sunday":"09:00-01:00","notes":"Hours vary based on Cathay Pacific flight schedule"}'::jsonb,
  0.00, 'CAD', 80, true,
  'https://www.cathaypacific.com/cx/en_CA/airport-lounge.html',
  49.198236, -123.179171
FROM airports WHERE iata_code = 'YVR'
ON CONFLICT (slug) DO UPDATE SET
  latitude  = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude;

-- ============================================================
-- Verify (optional — you can run this SELECT to confirm)
-- ============================================================
-- SELECT slug, name, latitude, longitude
-- FROM lounges l
-- JOIN airports a ON l.airport_id = a.id
-- WHERE a.iata_code = 'YVR'
-- ORDER BY latitude;
