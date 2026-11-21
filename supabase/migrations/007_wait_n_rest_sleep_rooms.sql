-- ============================================================
-- 007 — Wait N' Rest at Toronto Pearson T3 + sleep-rooms taxonomy
-- Date: 2026-11-21
--
-- Adds the first Canadian sleep-room facility as a lounge directory
-- listing, introduces six new amenity labels used by sleep rooms, and
-- adds a `booking_only` flag on `lounges` so the listing can hide the
-- card-match CTA block (no card gets you into Wait N' Rest — it's paid
-- hourly booking only).
--
-- Order: safe to apply before deploying the matching code. The new
-- column has a `DEFAULT FALSE` so every existing lounge keeps the
-- current Card Match block visible until explicitly flipped.
--
-- Run (VPS Postgres, port 5501):
--   PGSSLMODE=require psql "$DATABASE_URL" \
--     -f supabase/migrations/007_wait_n_rest_sleep_rooms.sql
-- ============================================================

BEGIN;

-- ─── 1. Schema addition ────────────────────────────────────────────
ALTER TABLE lounges
  ADD COLUMN IF NOT EXISTS booking_only BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN lounges.booking_only IS
  'When TRUE, the lounge detail page hides the "Cards that get you into this lounge" sidebar block. Set for facilities with paid booking only (Wait N'' Rest, future sleep-room / rent-by-the-hour concepts) where no credit card, Priority Pass, or airline status grants access.';

-- ─── 2. New amenity rows (idempotent) ──────────────────────────────
-- Six amenities introduced for sleep-room listings. The icon strings
-- resolve against the Material Symbols map in lounge-view.tsx
-- AMENITY_ICON_MAP (name-substring matching), so no icon field churn
-- is needed — "private rooms" → door_sliding, "beds" → hotel, etc.
INSERT INTO amenities (name, slug, category, icon) VALUES
  ('Private Rooms',    'private-rooms',    'other',         'door_sliding'),
  ('Beds',             'beds',             'other',         'hotel'),
  ('Workspace',        'workspace',        'business',      'work'),
  ('Soundproofing',    'soundproofing',    'other',         'hearing_disabled'),
  ('Climate Control',  'climate-control',  'other',         'thermostat'),
  ('Luggage in Room',  'luggage-in-room',  'other',         'luggage')
ON CONFLICT (slug) DO NOTHING;

-- ─── 3. Wait N' Rest lounge row ────────────────────────────────────
-- YYZ airport_id from app/fr/airports/YYZ/page.tsx:
--   '840161ae-1301-45f8-ad92-10d7834bef72'
-- Prices + room counts + hours + access facts from the directory
-- listing handoff (Nov 21, 2026). Website is the operator's Toronto
-- booking page; the paid "Book Day Pass · $55 CAD" sidebar button
-- gets the user to the booking flow via the Wait N' Rest override
-- added to dayPassAffiliate() in lounge-view.tsx.
INSERT INTO lounges (
  slug,
  name,
  description,
  airport_id,
  terminal,
  location_detail,
  access_types,
  opening_hours,
  guest_fee,
  guest_fee_currency,
  capacity,
  is_active,
  booking_only,
  website,
  phone,
  email
) VALUES (
  'wait-n-rest-t3-yyz',
  'Wait N'' Rest',
  '<p><strong>Private sleep rooms you book by the hour, past security in Terminal 3 near Gate B26.</strong> Five rooms total: four solo rooms (listed as "Dual" in the booking system, one guest each) and one step-free group room (listed as "Barrier Free") for up to four guests. Open 24 hours, with bookings from three to twelve hours. Base rates start at CAD $55 an hour for one guest, and an eight-hour rate brings the hourly cost down for long waits.</p><p>You need a same-day flight departing from Terminal 3, and leaving the facility ends your stay. A booking isn''t a lounge pass and doesn''t include meals — grab food before you check in. A private shower with fresh towels is available on site through the front desk.</p><p>For the full guide including the step-by-step booking flow, a 16-question FAQ, and how it compares with Pearson''s other rest options, see our <a href="/blog/wait-n-rest-toronto-pearson">Wait N'' Rest Toronto Pearson guide</a>.</p>',
  '840161ae-1301-45f8-ad92-10d7834bef72',
  '3',
  'Terminal 3, Canadian and international departures, near Gate B26, post-security',
  '[
    {"type":"paid_booking","name":"Hourly room booking","details":"From $55 CAD/hour base for one guest. 3-hour minimum, 12-hour maximum. Book online at least 6 hours ahead."},
    {"type":"paid_booking","name":"Extended stay (8 hours)","details":"One flat rate for 8 full hours. From $300 CAD base for one guest."}
  ]'::jsonb,
  '{
    "is_24_7": true,
    "notes": "Open 24 hours, every day. Bookings run 3 to 12 hours."
  }'::jsonb,
  55.00,
  'CAD',
  5,
  TRUE,
  TRUE,
  'https://www.waitnrest.com/en/toronto',
  '+1-647-633-3044',
  'toronto@waitnrest.com'
)
ON CONFLICT (slug) DO UPDATE SET
  description         = EXCLUDED.description,
  terminal            = EXCLUDED.terminal,
  location_detail     = EXCLUDED.location_detail,
  access_types        = EXCLUDED.access_types,
  opening_hours       = EXCLUDED.opening_hours,
  guest_fee           = EXCLUDED.guest_fee,
  guest_fee_currency  = EXCLUDED.guest_fee_currency,
  capacity            = EXCLUDED.capacity,
  is_active           = EXCLUDED.is_active,
  booking_only        = EXCLUDED.booking_only,
  website             = EXCLUDED.website,
  phone               = EXCLUDED.phone,
  email               = EXCLUDED.email,
  updated_at          = NOW();

-- ─── 4. Lounge → amenity joins ─────────────────────────────────────
-- Six existing amenities (Wi-Fi, Charging Stations, Shower,
-- Wheelchair Access, Snacks, TV / News) + six new amenities inserted
-- above. Matched by slug so the migration is idempotent and tolerant
-- of future icon tweaks.
INSERT INTO lounge_amenities (lounge_id, amenity_id)
SELECT l.id, a.id
FROM lounges l
CROSS JOIN amenities a
WHERE l.slug = 'wait-n-rest-t3-yyz'
  AND a.slug IN (
    'free-wifi',       -- existing — may be stored as 'wifi' or 'free-wifi'; see WHERE below
    'wifi',
    'charging-stations',
    'shower',
    'wheelchair-access',
    'snacks',
    'tv',
    'tv-news',
    'private-rooms',
    'beds',
    'workspace',
    'soundproofing',
    'climate-control',
    'luggage-in-room'
  )
ON CONFLICT DO NOTHING;

COMMIT;

-- ─── Verification queries (run separately, no-op if successful) ────
-- SELECT slug, name, booking_only, guest_fee, guest_fee_currency
-- FROM lounges WHERE slug = 'wait-n-rest-t3-yyz';
--
-- SELECT a.name
-- FROM lounge_amenities la
-- JOIN amenities a ON a.id = la.amenity_id
-- JOIN lounges   l ON l.id = la.lounge_id
-- WHERE l.slug = 'wait-n-rest-t3-yyz'
-- ORDER BY a.name;
