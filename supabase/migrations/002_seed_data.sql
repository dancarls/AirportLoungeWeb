-- ============================================================
-- Seed data: Canadian Airports & Lounges
-- Run AFTER 001_initial.sql
-- ============================================================

-- NOTE: The image folder was named YSJ but contains YYT (St. John's NL) images.
-- We create YYT here. YSJ (Saint John NB) is too small to have a Maple Leaf Lounge.

-- ============================================================
-- AIRPORTS
-- ============================================================
INSERT INTO airports (name, iata_code, icao_code, city, country, country_code, timezone, latitude, longitude, website) VALUES
  ('Edmonton International Airport',                             'YEG', 'CYEG', 'Edmonton',   'Canada', 'CA', 'America/Edmonton',  53.309723, -113.580278, 'https://www.flyeia.com'),
  ('Ottawa Macdonald-Cartier International Airport',             'YOW', 'CYOW', 'Ottawa',     'Canada', 'CA', 'America/Toronto',   45.322498, -75.669197,  'https://www.ottawaairport.ca'),
  ('St. John''s International Airport',                         'YYT', 'CYYT', 'St. John''s','Canada', 'CA', 'America/St_Johns',  47.618598, -52.751900,  'https://stjohnsairport.com'),
  ('Billy Bishop Toronto City Airport',                          'YTZ', 'CYTZ', 'Toronto',   'Canada', 'CA', 'America/Toronto',   43.627499, -79.396194,  'https://www.billybishopairport.com'),
  ('Montréal-Pierre Elliott Trudeau International Airport',      'YUL', 'CYUL', 'Montreal',  'Canada', 'CA', 'America/Toronto',   45.470600, -73.740799,  'https://www.admtl.com'),
  ('Vancouver International Airport',                            'YVR', 'CYVR', 'Vancouver', 'Canada', 'CA', 'America/Vancouver', 49.193901, -123.184402, 'https://www.yvr.ca'),
  ('Winnipeg James Armstrong Richardson International Airport',  'YWG', 'CYWG', 'Winnipeg',  'Canada', 'CA', 'America/Winnipeg',  49.909999, -97.239799,  'https://www.waa.ca'),
  ('Toronto Pearson International Airport',                      'YYZ', 'CYYZ', 'Toronto',   'Canada', 'CA', 'America/Toronto',   43.677200, -79.630600,  'https://www.torontopearson.com')
ON CONFLICT (iata_code) DO NOTHING;

-- ============================================================
-- AMENITY IDs (reference the seeded amenities by slug)
-- ============================================================
-- We'll use them in the lounge_amenities inserts below via subqueries.

-- ============================================================
-- LOUNGES
-- ============================================================

-- YEG — Edmonton
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'Air Canada Maple Leaf Lounge',
  'ac-maple-leaf-lounge-yeg',
  'The Air Canada Maple Leaf Lounge at Edmonton International offers a comfortable retreat with complimentary food, beverages, and WiFi for eligible travellers.',
  id,
  '1',
  'Concourse C, post-security (departures level)',
  '[
    {"type":"airline_status","name":"Air Canada Altitude Elite 50K / Super Elite","details":"Complimentary for Elite 50K, Super Elite 75K, and Super Elite 100K members"},
    {"type":"class_of_service","name":"Air Canada Business Class","details":"Business class passengers on Air Canada flights departing YEG"},
    {"type":"credit_card","name":"TD Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"},
    {"type":"credit_card","name":"CIBC Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"},
    {"type":"membership","name":"Priority Pass","details":"Access available; day pass fee may apply"}
  ]'::jsonb,
  '{"monday":"05:30-22:00","tuesday":"05:30-22:00","wednesday":"05:30-22:00","thursday":"05:30-22:00","friday":"05:30-22:00","saturday":"05:30-22:00","sunday":"05:30-22:00","notes":"Hours subject to change based on flight schedules"}'::jsonb,
  30.00, 'CAD', 80, true, 'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges/edmonton.html'
FROM airports WHERE iata_code = 'YEG';

-- YOW — Ottawa
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'Air Canada Maple Leaf Lounge',
  'ac-maple-leaf-lounge-yow',
  'The Air Canada Maple Leaf Lounge at Ottawa offers a peaceful space with food, drinks, and business amenities before your flight.',
  id,
  '1',
  'Post-security, Pier B/C junction',
  '[
    {"type":"airline_status","name":"Air Canada Altitude Elite 50K / Super Elite","details":"Complimentary for eligible Altitude members"},
    {"type":"class_of_service","name":"Air Canada Business Class","details":"Business class passengers on Air Canada flights"},
    {"type":"credit_card","name":"TD Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"},
    {"type":"credit_card","name":"CIBC Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"}
  ]'::jsonb,
  '{"monday":"05:30-21:00","tuesday":"05:30-21:00","wednesday":"05:30-21:00","thursday":"05:30-21:00","friday":"05:30-21:00","saturday":"05:30-21:00","sunday":"05:30-21:00","notes":"Hours subject to change based on flight schedules"}'::jsonb,
  30.00, 'CAD', 60, true, 'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges/ottawa.html'
FROM airports WHERE iata_code = 'YOW';

-- YYT — St. John's
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'Air Canada Maple Leaf Lounge',
  'ac-maple-leaf-lounge-yyt',
  'The Air Canada Maple Leaf Lounge at St. John''s International offers a relaxing environment with complimentary refreshments and WiFi.',
  id,
  '1',
  'Post-security, departures level',
  '[
    {"type":"airline_status","name":"Air Canada Altitude Elite 50K / Super Elite","details":"Complimentary for eligible Altitude members"},
    {"type":"class_of_service","name":"Air Canada Business Class","details":"Business class passengers on Air Canada flights"},
    {"type":"credit_card","name":"TD Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"},
    {"type":"credit_card","name":"CIBC Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"}
  ]'::jsonb,
  '{"monday":"05:30-20:00","tuesday":"05:30-20:00","wednesday":"05:30-20:00","thursday":"05:30-20:00","friday":"05:30-20:00","saturday":"05:30-20:00","sunday":"05:30-20:00","notes":"Hours subject to change based on flight schedules"}'::jsonb,
  30.00, 'CAD', 50, true, 'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges.html'
FROM airports WHERE iata_code = 'YYT';

-- YTZ — Billy Bishop (Air Canada Café)
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'Air Canada Café',
  'ac-cafe-ytz',
  'A relaxed café-style lounge at Billy Bishop Toronto City Airport offering complimentary snacks, beverages, and WiFi for eligible Air Canada passengers.',
  id,
  '1',
  'Departures area, post-security',
  '[
    {"type":"airline_status","name":"Air Canada Altitude Elite 35K and above","details":"Complimentary for Altitude Elite members and above"},
    {"type":"class_of_service","name":"Air Canada Business Class","details":"Business class passengers on Air Canada flights"},
    {"type":"credit_card","name":"TD Aeroplan Visa Infinite Privilege","details":"Primary cardholders"}
  ]'::jsonb,
  '{"monday":"05:30-21:00","tuesday":"05:30-21:00","wednesday":"05:30-21:00","thursday":"05:30-21:00","friday":"05:30-21:00","saturday":"05:30-21:00","sunday":"05:30-21:00","notes":"Hours follow flight operations"}'::jsonb,
  NULL, 'CAD', 40, true, 'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges.html'
FROM airports WHERE iata_code = 'YTZ';

-- YUL — Montréal Maple Leaf Lounge
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'Air Canada Maple Leaf Lounge',
  'ac-maple-leaf-lounge-yul',
  'The Air Canada Maple Leaf Lounge at Montréal-Trudeau features an elevated dining experience with local Québec cuisine, an open bar, showers, and panoramic runway views. Serving US transborder and international departures.',
  id,
  '1',
  'Post-security, Level 4, US Transborder and International departures',
  '[
    {"type":"airline_status","name":"Air Canada Altitude Elite 50K / Super Elite","details":"Complimentary for eligible Altitude members"},
    {"type":"class_of_service","name":"Air Canada International/Transborder Business Class","details":"Business class passengers on Air Canada international and US transborder flights"},
    {"type":"credit_card","name":"TD Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"},
    {"type":"credit_card","name":"CIBC Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"},
    {"type":"membership","name":"Priority Pass","details":"Priority Pass members; fee may apply"}
  ]'::jsonb,
  '{"monday":"05:30-23:30","tuesday":"05:30-23:30","wednesday":"05:30-23:30","thursday":"05:30-23:30","friday":"05:30-23:30","saturday":"05:30-23:30","sunday":"05:30-23:30","notes":"Hours subject to change based on flight schedules"}'::jsonb,
  30.00, 'CAD', 120, true, 'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges/montreal.html'
FROM airports WHERE iata_code = 'YUL';

-- YUL — Montréal Air Canada Café
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'Air Canada Café',
  'ac-cafe-yul',
  'The Air Canada Café at Montréal-Trudeau offers a comfortable space with light refreshments and WiFi for eligible travellers on domestic flights.',
  id,
  '1',
  'Domestic departures, post-security',
  '[
    {"type":"airline_status","name":"Air Canada Altitude Elite 35K and above","details":"Complimentary for Altitude Elite members and above on domestic flights"},
    {"type":"class_of_service","name":"Air Canada Domestic Business Class","details":"Business class passengers on domestic Air Canada flights"},
    {"type":"credit_card","name":"TD Aeroplan Visa Infinite Privilege","details":"Primary cardholders"}
  ]'::jsonb,
  '{"monday":"05:30-22:00","tuesday":"05:30-22:00","wednesday":"05:30-22:00","thursday":"05:30-22:00","friday":"05:30-22:00","saturday":"05:30-22:00","sunday":"05:30-22:00","notes":"Hours follow domestic flight operations"}'::jsonb,
  NULL, 'CAD', 60, true, 'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges/montreal.html'
FROM airports WHERE iata_code = 'YUL';

-- YVR — Air Canada Maple Leaf Lounge
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'Air Canada Maple Leaf Lounge',
  'ac-maple-leaf-lounge-yvr',
  'The Air Canada Maple Leaf Lounge at Vancouver International is one of the largest Maple Leaf Lounges in Canada, offering panoramic mountain views, full bar service, a hot buffet, showers, and quiet rest areas.',
  id,
  'International',
  'International Terminal, Level 3, post-security',
  '[
    {"type":"airline_status","name":"Air Canada Altitude Elite 50K / Super Elite","details":"Complimentary for Elite 50K, Super Elite 75K, and Super Elite 100K members"},
    {"type":"class_of_service","name":"Air Canada Business Class","details":"Business class passengers on Air Canada flights"},
    {"type":"credit_card","name":"TD Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"},
    {"type":"credit_card","name":"CIBC Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"},
    {"type":"membership","name":"Priority Pass","details":"Priority Pass members; day pass fee may apply"}
  ]'::jsonb,
  '{"monday":"05:30-23:59","tuesday":"05:30-23:59","wednesday":"05:30-23:59","thursday":"05:30-23:59","friday":"05:30-23:59","saturday":"05:30-23:59","sunday":"05:30-23:59","notes":"Open daily; hours may vary on holidays"}'::jsonb,
  30.00, 'CAD', 200, true, 'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges/vancouver.html'
FROM airports WHERE iata_code = 'YVR';

-- YVR — Plaza Premium First (International, Pier D)
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'Plaza Premium First Lounge',
  'plaza-premium-first-yvr',
  'The Plaza Premium First Lounge at Vancouver International offers premium amenities including à la carte dining, a full bar, spa treatments, private shower suites, and dedicated workspaces in a luxurious setting.',
  id,
  'International',
  'International Terminal, Pier D, post-security (Level 3)',
  '[
    {"type":"membership","name":"Priority Pass","details":"Priority Pass members with Plaza Premium access"},
    {"type":"membership","name":"DragonPass","details":"DragonPass members"},
    {"type":"membership","name":"LoungeKey","details":"LoungeKey members"},
    {"type":"credit_card","name":"Scotiabank Passport Visa Infinite","details":"Primary cardholders"},
    {"type":"credit_card","name":"American Express Platinum","details":"Centurion and Platinum cardholders"},
    {"type":"day_pass","name":"Day Pass","details":"Available for purchase; approx. $50–$70 CAD"}
  ]'::jsonb,
  '{"is_24_7":true,"notes":"Open 24 hours daily"}'::jsonb,
  65.00, 'CAD', 80, true, 'https://www.plazapremiumlounge.com/en-uk/find/canada/vancouver/vancouver-international-airport/plaza-premium-first-lounge'
FROM airports WHERE iata_code = 'YVR';

-- YVR — Plaza Premium Lounge (Domestic Departures)
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'Plaza Premium Lounge (Domestic Departures)',
  'plaza-premium-domestic-yvr',
  'The Plaza Premium Lounge at Vancouver''s domestic departures area offers complimentary food and beverages, high-speed WiFi, and comfortable seating for eligible travellers.',
  id,
  'Domestic',
  'Domestic Terminal, post-security departures level',
  '[
    {"type":"membership","name":"Priority Pass","details":"Priority Pass members"},
    {"type":"membership","name":"DragonPass","details":"DragonPass members"},
    {"type":"membership","name":"LoungeKey","details":"LoungeKey members"},
    {"type":"credit_card","name":"Scotiabank Passport Visa Infinite","details":"Primary cardholders"},
    {"type":"day_pass","name":"Day Pass","details":"Available for purchase at the door"}
  ]'::jsonb,
  '{"monday":"05:30-22:00","tuesday":"05:30-22:00","wednesday":"05:30-22:00","thursday":"05:30-22:00","friday":"05:30-22:00","saturday":"05:30-22:00","sunday":"05:30-22:00","notes":"Hours follow domestic flight operations"}'::jsonb,
  50.00, 'CAD', 100, true, 'https://www.plazapremiumlounge.com/en-uk/find/canada/vancouver/vancouver-international-airport'
FROM airports WHERE iata_code = 'YVR';

-- YVR — Plaza Premium Lounge (Domestic, Pier C)
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'Plaza Premium Lounge (Domestic Pier C)',
  'plaza-premium-domestic-pier-c-yvr',
  'A second domestic departures lounge at Vancouver International located in Pier C, offering the same Plaza Premium amenities with food, drinks, and WiFi.',
  id,
  'Domestic',
  'Domestic Terminal, Pier C, post-security',
  '[
    {"type":"membership","name":"Priority Pass","details":"Priority Pass members"},
    {"type":"membership","name":"DragonPass","details":"DragonPass members"},
    {"type":"membership","name":"LoungeKey","details":"LoungeKey members"},
    {"type":"credit_card","name":"Scotiabank Passport Visa Infinite","details":"Primary cardholders"},
    {"type":"day_pass","name":"Day Pass","details":"Available for purchase at the door"}
  ]'::jsonb,
  '{"monday":"05:30-22:00","tuesday":"05:30-22:00","wednesday":"05:30-22:00","thursday":"05:30-22:00","friday":"05:30-22:00","saturday":"05:30-22:00","sunday":"05:30-22:00","notes":"Hours follow domestic flight operations"}'::jsonb,
  50.00, 'CAD', 90, true, 'https://www.plazapremiumlounge.com/en-uk/find/canada/vancouver/vancouver-international-airport'
FROM airports WHERE iata_code = 'YVR';

-- YVR — Plaza Premium Lounge (International, Pier D)
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'Plaza Premium Lounge (International Departures)',
  'plaza-premium-international-yvr',
  'The Plaza Premium Lounge in Vancouver''s international departures area (Pier D) offers hot food, an open bar, showers, and comfortable seating for international travellers.',
  id,
  'International',
  'International Terminal, Pier D, post-security (Level 2)',
  '[
    {"type":"membership","name":"Priority Pass","details":"Priority Pass members"},
    {"type":"membership","name":"DragonPass","details":"DragonPass members"},
    {"type":"membership","name":"LoungeKey","details":"LoungeKey members"},
    {"type":"credit_card","name":"Scotiabank Passport Visa Infinite","details":"Primary cardholders"},
    {"type":"credit_card","name":"American Express Platinum","details":"Centurion and Platinum cardholders"},
    {"type":"day_pass","name":"Day Pass","details":"Available for purchase; approx. $50–$70 CAD"}
  ]'::jsonb,
  '{"is_24_7":true,"notes":"Open 24 hours daily"}'::jsonb,
  55.00, 'CAD', 110, true, 'https://www.plazapremiumlounge.com/en-uk/find/canada/vancouver/vancouver-international-airport'
FROM airports WHERE iata_code = 'YVR';

-- YVR — Plaza Premium Lounge (US Departures)
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'Plaza Premium Lounge (US Departures)',
  'plaza-premium-us-yvr',
  'The Plaza Premium Lounge in Vancouver''s US departures area caters to travellers heading to American destinations, offering food, beverages, and WiFi.',
  id,
  'International',
  'US Departures area, post-customs security',
  '[
    {"type":"membership","name":"Priority Pass","details":"Priority Pass members"},
    {"type":"membership","name":"DragonPass","details":"DragonPass members"},
    {"type":"membership","name":"LoungeKey","details":"LoungeKey members"},
    {"type":"credit_card","name":"Scotiabank Passport Visa Infinite","details":"Primary cardholders"},
    {"type":"day_pass","name":"Day Pass","details":"Available for purchase at the door"}
  ]'::jsonb,
  '{"monday":"05:00-22:00","tuesday":"05:00-22:00","wednesday":"05:00-22:00","thursday":"05:00-22:00","friday":"05:00-22:00","saturday":"05:00-22:00","sunday":"05:00-22:00","notes":"Hours follow US departure flight schedules"}'::jsonb,
  50.00, 'CAD', 80, true, 'https://www.plazapremiumlounge.com/en-uk/find/canada/vancouver/vancouver-international-airport'
FROM airports WHERE iata_code = 'YVR';

-- YVR — SkyTeam Lounge
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'SkyTeam Lounge',
  'skyteam-lounge-yvr',
  'The SkyTeam Lounge at Vancouver International serves passengers flying with SkyTeam alliance airlines, offering a full bar, hot food, shower suites, and business facilities.',
  id,
  'International',
  'International Terminal, post-security (near SkyTeam gates)',
  '[
    {"type":"airline_status","name":"SkyTeam Elite Plus","details":"SkyTeam Elite Plus members on same-day SkyTeam flight"},
    {"type":"class_of_service","name":"SkyTeam Business or First Class","details":"Business and First class passengers on SkyTeam member airlines"},
    {"type":"airline_status","name":"Air France / KLM Gold","details":"Flying Blue Gold and Platinum members"}
  ]'::jsonb,
  '{"monday":"06:00-22:00","tuesday":"06:00-22:00","wednesday":"06:00-22:00","thursday":"06:00-22:00","friday":"06:00-22:00","saturday":"06:00-22:00","sunday":"06:00-22:00","notes":"Access only on day of travel with SkyTeam carrier"}'::jsonb,
  NULL, 'CAD', 150, true, 'https://www.skyteam.com/en/lounge'
FROM airports WHERE iata_code = 'YVR';

-- YWG — Winnipeg
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'Air Canada Maple Leaf Lounge',
  'ac-maple-leaf-lounge-ywg',
  'The Air Canada Maple Leaf Lounge at Winnipeg Richardson International offers complimentary food, drinks, and WiFi in a comfortable setting for eligible travellers.',
  id,
  '1',
  'Post-security, Level 2 departures',
  '[
    {"type":"airline_status","name":"Air Canada Altitude Elite 50K / Super Elite","details":"Complimentary for eligible Altitude members"},
    {"type":"class_of_service","name":"Air Canada Business Class","details":"Business class passengers on Air Canada flights"},
    {"type":"credit_card","name":"TD Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"},
    {"type":"credit_card","name":"CIBC Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"}
  ]'::jsonb,
  '{"monday":"05:30-21:00","tuesday":"05:30-21:00","wednesday":"05:30-21:00","thursday":"05:30-21:00","friday":"05:30-21:00","saturday":"05:30-21:00","sunday":"05:30-21:00","notes":"Hours subject to change based on flight schedules"}'::jsonb,
  30.00, 'CAD', 60, true, 'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges/winnipeg.html'
FROM airports WHERE iata_code = 'YWG';

-- YYZ — Air Canada Signature Suite
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'Air Canada Signature Suite',
  'ac-signature-suite-yyz',
  'The most exclusive Air Canada lounge experience. The Signature Suite at Toronto Pearson offers à la carte dining by a dedicated chef, premium wine and spirits, private suites, a spa, showers, and personalized service. Invitation only — reserved for Super Elite 100K members and select international Business Class passengers.',
  id,
  '1',
  'Terminal 1, International departures, Level 4 (above the Maple Leaf Lounge)',
  '[
    {"type":"airline_status","name":"Air Canada Super Elite 100K","details":"Complimentary for Super Elite 100K members"},
    {"type":"class_of_service","name":"Air Canada International Business Class","details":"Eligible international Business class passengers on select routes — check aircanada.com for qualifying flights"}
  ]'::jsonb,
  '{"monday":"05:30-23:59","tuesday":"05:30-23:59","wednesday":"05:30-23:59","thursday":"05:30-23:59","friday":"05:30-23:59","saturday":"05:30-23:59","sunday":"05:30-23:59","notes":"Access is strictly controlled. Day passes are not available."}'::jsonb,
  NULL, 'CAD', 40, true, 'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges/toronto-pearson.html'
FROM airports WHERE iata_code = 'YYZ';

-- YYZ — Maple Leaf Lounge Domestic
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'Air Canada Maple Leaf Lounge (Domestic)',
  'ac-maple-leaf-lounge-domestic-yyz',
  'The Air Canada Maple Leaf Lounge for domestic travellers at Toronto Pearson offers a full bar, hot food buffet, WiFi, and quiet workspaces.',
  id,
  '1',
  'Terminal 1, Domestic departures, post-security (Level 3)',
  '[
    {"type":"airline_status","name":"Air Canada Altitude Elite 50K / Super Elite","details":"Complimentary for eligible Altitude members on domestic flights"},
    {"type":"class_of_service","name":"Air Canada Domestic Business Class","details":"Business class passengers on domestic Air Canada flights"},
    {"type":"credit_card","name":"TD Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"},
    {"type":"credit_card","name":"CIBC Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"}
  ]'::jsonb,
  '{"monday":"05:30-23:00","tuesday":"05:30-23:00","wednesday":"05:30-23:00","thursday":"05:30-23:00","friday":"05:30-23:00","saturday":"05:30-23:00","sunday":"05:30-23:00","notes":"Hours subject to change"}'::jsonb,
  30.00, 'CAD', 160, true, 'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges/toronto-pearson.html'
FROM airports WHERE iata_code = 'YYZ';

-- YYZ — Maple Leaf Lounge International
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'Air Canada Maple Leaf Lounge (International)',
  'ac-maple-leaf-lounge-international-yyz',
  'The Air Canada Maple Leaf Lounge for international travellers at Toronto Pearson features an expansive layout with an open bar, hot buffet, shower suites, and panoramic airside views.',
  id,
  '1',
  'Terminal 1, International departures, Level 3, post-security',
  '[
    {"type":"airline_status","name":"Air Canada Altitude Elite 50K / Super Elite","details":"Complimentary for eligible Altitude members on international flights"},
    {"type":"class_of_service","name":"Air Canada International Business Class","details":"Business class passengers on Air Canada international flights"},
    {"type":"credit_card","name":"TD Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"},
    {"type":"credit_card","name":"CIBC Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"},
    {"type":"membership","name":"Priority Pass","details":"Priority Pass members; fee may apply"}
  ]'::jsonb,
  '{"monday":"05:30-23:59","tuesday":"05:30-23:59","wednesday":"05:30-23:59","thursday":"05:30-23:59","friday":"05:30-23:59","saturday":"05:30-23:59","sunday":"05:30-23:59","notes":"Open late to accommodate evening international departures"}'::jsonb,
  30.00, 'CAD', 200, true, 'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges/toronto-pearson.html'
FROM airports WHERE iata_code = 'YYZ';

-- YYZ — Maple Leaf Lounge Transborder
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'Air Canada Maple Leaf Lounge (Transborder)',
  'ac-maple-leaf-lounge-transborder-yyz',
  'The Air Canada Maple Leaf Lounge for US-bound travellers at Toronto Pearson, located in the transborder pre-clearance area with food, beverages, and WiFi.',
  id,
  '1',
  'Terminal 1, US Transborder (pre-clearance), post-security',
  '[
    {"type":"airline_status","name":"Air Canada Altitude Elite 50K / Super Elite","details":"Complimentary for eligible Altitude members on US transborder flights"},
    {"type":"class_of_service","name":"Air Canada Transborder Business Class","details":"Business class passengers on Air Canada US transborder flights"},
    {"type":"credit_card","name":"TD Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"},
    {"type":"credit_card","name":"CIBC Aeroplan Visa Infinite Privilege","details":"Primary cardholders and one guest"}
  ]'::jsonb,
  '{"monday":"05:30-22:00","tuesday":"05:30-22:00","wednesday":"05:30-22:00","thursday":"05:30-22:00","friday":"05:30-22:00","saturday":"05:30-22:00","sunday":"05:30-22:00","notes":"Access is for US-bound flights only; NEXUS/trusted traveller recommended"}'::jsonb,
  30.00, 'CAD', 120, true, 'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges/toronto-pearson.html'
FROM airports WHERE iata_code = 'YYZ';

-- YYZ — Air Canada Café
INSERT INTO lounges (name, slug, description, airport_id, terminal, location_detail, access_types, opening_hours, guest_fee, guest_fee_currency, capacity, is_active, website)
SELECT
  'Air Canada Café',
  'ac-cafe-yyz',
  'The Air Canada Café at Toronto Pearson offers a relaxed café-style setting with light refreshments and WiFi for eligible Air Canada travellers.',
  id,
  '1',
  'Terminal 1, domestic departures — check Air Canada website for exact gate location',
  '[
    {"type":"airline_status","name":"Air Canada Altitude Elite 35K and above","details":"Complimentary for Altitude Elite 35K and above on domestic flights"},
    {"type":"class_of_service","name":"Air Canada Domestic Business Class","details":"Business class passengers on domestic Air Canada flights"},
    {"type":"credit_card","name":"TD Aeroplan Visa Infinite Privilege","details":"Primary cardholders"}
  ]'::jsonb,
  '{"monday":"05:30-22:00","tuesday":"05:30-22:00","wednesday":"05:30-22:00","thursday":"05:30-22:00","friday":"05:30-22:00","saturday":"05:30-22:00","sunday":"05:30-22:00","notes":"Hours follow domestic flight operations"}'::jsonb,
  NULL, 'CAD', 50, true, 'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges/toronto-pearson.html'
FROM airports WHERE iata_code = 'YYZ';

-- ============================================================
-- LOUNGE AMENITIES
-- ============================================================

-- Helper: assign amenities to lounges by slug
DO $$
DECLARE
  wifi_id      UUID; bar_id     UUID; hot_food_id UUID; snacks_id UUID;
  coffee_id    UUID; shower_id  UUID; spa_id      UUID; quiet_id  UUID;
  print_id     UUID; tv_id      UUID; news_id     UUID; wifi_access_id UUID;
  flight_id    UUID;
BEGIN
  SELECT id INTO wifi_id      FROM amenities WHERE slug = 'free-wifi';
  SELECT id INTO bar_id       FROM amenities WHERE slug = 'bar';
  SELECT id INTO hot_food_id  FROM amenities WHERE slug = 'hot-food';
  SELECT id INTO snacks_id    FROM amenities WHERE slug = 'snacks';
  SELECT id INTO coffee_id    FROM amenities WHERE slug = 'coffee-tea';
  SELECT id INTO shower_id    FROM amenities WHERE slug = 'shower';
  SELECT id INTO spa_id       FROM amenities WHERE slug = 'spa';
  SELECT id INTO quiet_id     FROM amenities WHERE slug = 'quiet-room';
  SELECT id INTO print_id     FROM amenities WHERE slug = 'printing';
  SELECT id INTO tv_id        FROM amenities WHERE slug = 'tv-news';
  SELECT id INTO news_id      FROM amenities WHERE slug = 'newspapers';
  SELECT id INTO flight_id    FROM amenities WHERE slug = 'flight-screens';

  -- Standard Maple Leaf Lounges (YEG, YOW, YYT, YWG)
  INSERT INTO lounge_amenities (lounge_id, amenity_id)
  SELECT l.id, a FROM lounges l,
    UNNEST(ARRAY[wifi_id, bar_id, hot_food_id, coffee_id, tv_id, news_id, print_id, flight_id]) a
  WHERE l.slug IN (
    'ac-maple-leaf-lounge-yeg','ac-maple-leaf-lounge-yow',
    'ac-maple-leaf-lounge-yyt','ac-maple-leaf-lounge-ywg'
  )
  ON CONFLICT DO NOTHING;

  -- Air Canada Cafés (light amenities)
  INSERT INTO lounge_amenities (lounge_id, amenity_id)
  SELECT l.id, a FROM lounges l,
    UNNEST(ARRAY[wifi_id, snacks_id, coffee_id, tv_id, flight_id]) a
  WHERE l.slug IN ('ac-cafe-ytz','ac-cafe-yul','ac-cafe-yyz')
  ON CONFLICT DO NOTHING;

  -- YUL Maple Leaf (showers + all standard)
  INSERT INTO lounge_amenities (lounge_id, amenity_id)
  SELECT l.id, a FROM lounges l,
    UNNEST(ARRAY[wifi_id, bar_id, hot_food_id, coffee_id, shower_id, tv_id, news_id, print_id, flight_id]) a
  WHERE l.slug = 'ac-maple-leaf-lounge-yul'
  ON CONFLICT DO NOTHING;

  -- YVR Maple Leaf (large lounge, showers, quiet room)
  INSERT INTO lounge_amenities (lounge_id, amenity_id)
  SELECT l.id, a FROM lounges l,
    UNNEST(ARRAY[wifi_id, bar_id, hot_food_id, coffee_id, shower_id, quiet_id, tv_id, news_id, print_id, flight_id]) a
  WHERE l.slug = 'ac-maple-leaf-lounge-yvr'
  ON CONFLICT DO NOTHING;

  -- Plaza Premium First (full premium amenities)
  INSERT INTO lounge_amenities (lounge_id, amenity_id)
  SELECT l.id, a FROM lounges l,
    UNNEST(ARRAY[wifi_id, bar_id, hot_food_id, coffee_id, shower_id, spa_id, quiet_id, print_id, tv_id, news_id, flight_id]) a
  WHERE l.slug = 'plaza-premium-first-yvr'
  ON CONFLICT DO NOTHING;

  -- Plaza Premium standard lounges
  INSERT INTO lounge_amenities (lounge_id, amenity_id)
  SELECT l.id, a FROM lounges l,
    UNNEST(ARRAY[wifi_id, bar_id, hot_food_id, coffee_id, shower_id, tv_id, news_id, print_id, flight_id]) a
  WHERE l.slug IN (
    'plaza-premium-domestic-yvr','plaza-premium-domestic-pier-c-yvr',
    'plaza-premium-international-yvr','plaza-premium-us-yvr'
  )
  ON CONFLICT DO NOTHING;

  -- SkyTeam Lounge YVR
  INSERT INTO lounge_amenities (lounge_id, amenity_id)
  SELECT l.id, a FROM lounges l,
    UNNEST(ARRAY[wifi_id, bar_id, hot_food_id, coffee_id, shower_id, quiet_id, tv_id, news_id, print_id, flight_id]) a
  WHERE l.slug = 'skyteam-lounge-yvr'
  ON CONFLICT DO NOTHING;

  -- Signature Suite (most premium)
  INSERT INTO lounge_amenities (lounge_id, amenity_id)
  SELECT l.id, a FROM lounges l,
    UNNEST(ARRAY[wifi_id, bar_id, hot_food_id, coffee_id, shower_id, spa_id, quiet_id, print_id, tv_id, news_id, flight_id]) a
  WHERE l.slug = 'ac-signature-suite-yyz'
  ON CONFLICT DO NOTHING;

  -- YYZ Maple Leaf lounges
  INSERT INTO lounge_amenities (lounge_id, amenity_id)
  SELECT l.id, a FROM lounges l,
    UNNEST(ARRAY[wifi_id, bar_id, hot_food_id, coffee_id, shower_id, quiet_id, tv_id, news_id, print_id, flight_id]) a
  WHERE l.slug IN (
    'ac-maple-leaf-lounge-domestic-yyz','ac-maple-leaf-lounge-international-yyz',
    'ac-maple-leaf-lounge-transborder-yyz'
  )
  ON CONFLICT DO NOTHING;

END $$;

-- ============================================================
-- LOUNGE IMAGES
-- (storage paths match what the upload script creates)
-- ============================================================

-- YEG
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'ac-maple-leaf-lounge-yeg/01.jpg', 'Air Canada Maple Leaf Lounge Edmonton', true, 1
FROM lounges WHERE slug = 'ac-maple-leaf-lounge-yeg';

-- YOW
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'ac-maple-leaf-lounge-yow/01.jpg', 'Air Canada Maple Leaf Lounge Ottawa', true, 1
FROM lounges WHERE slug = 'ac-maple-leaf-lounge-yow';

-- YYT
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'ac-maple-leaf-lounge-yyt/' || lpad(i::text, 2, '0') || '.jpg',
  'Air Canada Maple Leaf Lounge St. John''s - Photo ' || i, i = 1, i
FROM lounges l, generate_series(1, 5) i WHERE l.slug = 'ac-maple-leaf-lounge-yyt';

-- YTZ
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'ac-cafe-ytz/01.png', 'Air Canada Café Billy Bishop Airport', true, 1
FROM lounges WHERE slug = 'ac-cafe-ytz';

-- YUL Maple Leaf
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'ac-maple-leaf-lounge-yul/' || lpad(i::text, 2, '0') || '.jpg',
  'Air Canada Maple Leaf Lounge Montreal - Photo ' || i, i = 1, i
FROM lounges l, generate_series(1, 7) i WHERE l.slug = 'ac-maple-leaf-lounge-yul';

-- YUL Café
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'ac-cafe-yul/' || lpad(i::text, 2, '0') || ext,
  'Air Canada Café Montreal - Photo ' || i, i = 1, i
FROM lounges l,
  (VALUES (1,'.jpg'),(2,'.png'),(3,'.png')) AS imgs(i, ext)
WHERE l.slug = 'ac-cafe-yul';

-- YVR Maple Leaf
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'ac-maple-leaf-lounge-yvr/' || lpad(i::text, 2, '0') || '.jpg',
  'Air Canada Maple Leaf Lounge Vancouver - Photo ' || i, i = 1, i
FROM lounges l, generate_series(1, 8) i WHERE l.slug = 'ac-maple-leaf-lounge-yvr';

-- Plaza Premium First YVR
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'plaza-premium-first-yvr/' || lpad(i::text, 2, '0') || '.jpg',
  'Plaza Premium First Lounge Vancouver - Photo ' || i, i = 1, i
FROM lounges l, generate_series(1, 4) i WHERE l.slug = 'plaza-premium-first-yvr';

-- Plaza Premium Domestic YVR
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'plaza-premium-domestic-yvr/' || lpad(i::text, 2, '0') || '.jpg',
  'Plaza Premium Lounge Domestic Vancouver - Photo ' || i, i = 1, i
FROM lounges l, generate_series(1, 4) i WHERE l.slug = 'plaza-premium-domestic-yvr';

-- Plaza Premium Domestic Pier C YVR
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'plaza-premium-domestic-pier-c-yvr/' || lpad(i::text, 2, '0') || '.jpg',
  'Plaza Premium Lounge Domestic Pier C Vancouver - Photo ' || i, i = 1, i
FROM lounges l, generate_series(1, 4) i WHERE l.slug = 'plaza-premium-domestic-pier-c-yvr';

-- Plaza Premium International YVR
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'plaza-premium-international-yvr/' || lpad(i::text, 2, '0') || '.jpg',
  'Plaza Premium Lounge International Vancouver - Photo ' || i, i = 1, i
FROM lounges l, generate_series(1, 4) i WHERE l.slug = 'plaza-premium-international-yvr';

-- Plaza Premium US YVR
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'plaza-premium-us-yvr/' || lpad(i::text, 2, '0') || '.jpg',
  'Plaza Premium Lounge US Departures Vancouver - Photo ' || i, i = 1, i
FROM lounges l, generate_series(1, 4) i WHERE l.slug = 'plaza-premium-us-yvr';

-- SkyTeam YVR
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'skyteam-lounge-yvr/' || lpad(i::text, 2, '0') || '.jpg',
  'SkyTeam Lounge Vancouver - Photo ' || i, i = 1, i
FROM lounges l, generate_series(1, 12) i WHERE l.slug = 'skyteam-lounge-yvr';

-- YWG
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'ac-maple-leaf-lounge-ywg/01.jpg', 'Air Canada Maple Leaf Lounge Winnipeg', true, 1
FROM lounges WHERE slug = 'ac-maple-leaf-lounge-ywg';

-- YYZ Signature Suite
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'ac-signature-suite-yyz/' || lpad(i::text, 2, '0') || '.jpg',
  'Air Canada Signature Suite Toronto Pearson - Photo ' || i, i = 1, i
FROM lounges l, generate_series(1, 3) i WHERE l.slug = 'ac-signature-suite-yyz';

-- YYZ Maple Leaf Domestic
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'ac-maple-leaf-lounge-domestic-yyz/' || lpad(i::text, 2, '0') || '.jpg',
  'Air Canada Maple Leaf Lounge Domestic Toronto Pearson - Photo ' || i, i = 1, i
FROM lounges l, generate_series(1, 3) i WHERE l.slug = 'ac-maple-leaf-lounge-domestic-yyz';

-- YYZ Maple Leaf International
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'ac-maple-leaf-lounge-international-yyz/' || lpad(i::text, 2, '0') || '.jpg',
  'Air Canada Maple Leaf Lounge International Toronto Pearson - Photo ' || i, i = 1, i
FROM lounges l, generate_series(1, 3) i WHERE l.slug = 'ac-maple-leaf-lounge-international-yyz';

-- YYZ Maple Leaf Transborder
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'ac-maple-leaf-lounge-transborder-yyz/' || lpad(i::text, 2, '0') || '.jpg',
  'Air Canada Maple Leaf Lounge Transborder Toronto Pearson - Photo ' || i, i = 1, i
FROM lounges l, generate_series(1, 3) i WHERE l.slug = 'ac-maple-leaf-lounge-transborder-yyz';

-- YYZ Café
INSERT INTO lounge_images (lounge_id, storage_path, alt_text, is_primary, sort_order)
SELECT id, 'ac-cafe-yyz/' || lpad(i::text, 2, '0') || ext,
  'Air Canada Café Toronto Pearson - Photo ' || i, i = 1, i
FROM lounges l,
  (VALUES (1,'.jpg'),(2,'.jpg'),(3,'.jpg'),(4,'.png'),(5,'.png')) AS imgs(i, ext)
WHERE l.slug = 'ac-cafe-yyz';
