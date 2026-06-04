-- ============================================================
-- Airport Lounges — Initial Schema
-- Run this in your Supabase SQL editor or via Supabase CLI
-- ============================================================

-- Enable UUID extension (already on by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- AIRPORTS
-- ============================================================
CREATE TABLE airports (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  iata_code     CHAR(3) UNIQUE NOT NULL,
  icao_code     CHAR(4),
  city          TEXT NOT NULL,
  country       TEXT NOT NULL,
  country_code  CHAR(2),
  timezone      TEXT,
  latitude      DECIMAL(10, 6),
  longitude     DECIMAL(10, 6),
  terminal_map_url TEXT,
  website       TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_airports_iata ON airports(iata_code);
CREATE INDEX idx_airports_city  ON airports(city);
CREATE INDEX idx_airports_country ON airports(country_code);

-- ============================================================
-- AMENITIES
-- ============================================================
CREATE TABLE amenities (
  id       UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name     TEXT UNIQUE NOT NULL,
  slug     TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'food_drink', 'connectivity', 'wellness',
    'business', 'entertainment', 'accessibility', 'other'
  )),
  icon     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed common amenities
INSERT INTO amenities (name, slug, category, icon) VALUES
  ('Free WiFi',            'free-wifi',         'connectivity',  'wifi'),
  ('Bar',                  'bar',               'food_drink',    'wine'),
  ('Hot Food',             'hot-food',          'food_drink',    'utensils'),
  ('Snacks',               'snacks',            'food_drink',    'cookie'),
  ('Coffee & Tea',         'coffee-tea',        'food_drink',    'coffee'),
  ('Shower',               'shower',            'wellness',      'shower-head'),
  ('Spa Services',         'spa',               'wellness',      'sparkles'),
  ('Quiet Room',           'quiet-room',        'wellness',      'moon'),
  ('Sleeping Pods',        'sleeping-pods',     'wellness',      'bed'),
  ('Printing',             'printing',          'business',      'printer'),
  ('Meeting Rooms',        'meeting-rooms',     'business',      'users'),
  ('TV / News',            'tv-news',           'entertainment', 'tv'),
  ('Newspapers & Magazines', 'newspapers',      'entertainment', 'newspaper'),
  ('Kids Area',            'kids-area',         'entertainment', 'baby'),
  ('Wheelchair Access',    'wheelchair-access', 'accessibility', 'accessibility'),
  ('Prayer Room',          'prayer-room',       'accessibility', 'building'),
  ('Flight Info Screens',  'flight-screens',    'other',         'monitor');

-- ============================================================
-- LOUNGES
-- ============================================================
CREATE TABLE lounges (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name                TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  description         TEXT,
  airport_id          UUID NOT NULL REFERENCES airports(id) ON DELETE CASCADE,
  terminal            TEXT,
  location_detail     TEXT,
  access_types        JSONB DEFAULT '[]',
  opening_hours       JSONB DEFAULT '{}',
  guest_fee           DECIMAL(10, 2),
  guest_fee_currency  TEXT DEFAULT 'CAD',
  capacity            INTEGER,
  rating              DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
  review_count        INTEGER DEFAULT 0,
  is_active           BOOLEAN DEFAULT TRUE,
  website             TEXT,
  phone               TEXT,
  email               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lounges_airport ON lounges(airport_id);
CREATE INDEX idx_lounges_slug    ON lounges(slug);
CREATE INDEX idx_lounges_rating  ON lounges(rating DESC);

-- ============================================================
-- LOUNGE AMENITIES (junction)
-- ============================================================
CREATE TABLE lounge_amenities (
  lounge_id  UUID REFERENCES lounges(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (lounge_id, amenity_id)
);

-- ============================================================
-- LOUNGE IMAGES
-- ============================================================
CREATE TABLE lounge_images (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lounge_id    UUID NOT NULL REFERENCES lounges(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  alt_text     TEXT,
  is_primary   BOOLEAN DEFAULT FALSE,
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lounge_images_lounge ON lounge_images(lounge_id);

-- ============================================================
-- USER PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url   TEXT,
  home_airport TEXT,
  bio          TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE reviews (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lounge_id           UUID NOT NULL REFERENCES lounges(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  body                TEXT NOT NULL,
  overall_rating      SMALLINT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  food_rating         SMALLINT CHECK (food_rating BETWEEN 1 AND 5),
  cleanliness_rating  SMALLINT CHECK (cleanliness_rating BETWEEN 1 AND 5),
  staff_rating        SMALLINT CHECK (staff_rating BETWEEN 1 AND 5),
  wifi_rating         SMALLINT CHECK (wifi_rating BETWEEN 1 AND 5),
  visit_date          DATE NOT NULL,
  visit_type          TEXT CHECK (visit_type IN (
    'business_travel', 'leisure_travel', 'layover', 'day_pass',
    'first_class', 'credit_card_access', 'membership', 'lounge_pass'
  )),
  access_method       TEXT,
  pros                TEXT,
  cons                TEXT,
  would_return        BOOLEAN DEFAULT TRUE,
  helpful_count       INTEGER DEFAULT 0,
  is_verified         BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lounge_id, user_id)
);

CREATE INDEX idx_reviews_lounge ON reviews(lounge_id);
CREATE INDEX idx_reviews_user   ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(overall_rating DESC);

-- Update lounge rating when a review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_lounge_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE lounges SET
    rating       = (SELECT AVG(overall_rating)::DECIMAL(3,2) FROM reviews WHERE lounge_id = COALESCE(NEW.lounge_id, OLD.lounge_id)),
    review_count = (SELECT COUNT(*) FROM reviews WHERE lounge_id = COALESCE(NEW.lounge_id, OLD.lounge_id)),
    updated_at   = NOW()
  WHERE id = COALESCE(NEW.lounge_id, OLD.lounge_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_lounge_rating();

-- ============================================================
-- SAVED LOUNGES (favourites)
-- ============================================================
CREATE TABLE saved_lounges (
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lounge_id  UUID REFERENCES lounges(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, lounge_id)
);

-- ============================================================
-- CROWD REPORTS (quick busy-level check-ins)
-- ============================================================
CREATE TABLE crowd_reports (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lounge_id    UUID NOT NULL REFERENCES lounges(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  crowd_level  SMALLINT NOT NULL CHECK (crowd_level BETWEEN 1 AND 5),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crowd_lounge_time ON crowd_reports(lounge_id, created_at DESC);

-- View: current crowd level = average of last 2 hours
CREATE OR REPLACE VIEW current_crowd_levels AS
SELECT
  lounge_id,
  ROUND(AVG(crowd_level), 1) AS avg_crowd,
  COUNT(*) AS report_count,
  MAX(created_at) AS last_reported
FROM crowd_reports
WHERE created_at > NOW() - INTERVAL '2 hours'
GROUP BY lounge_id;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE airports       ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities      ENABLE ROW LEVEL SECURITY;
ALTER TABLE lounges        ENABLE ROW LEVEL SECURITY;
ALTER TABLE lounge_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE lounge_images  ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_lounges  ENABLE ROW LEVEL SECURITY;
ALTER TABLE crowd_reports  ENABLE ROW LEVEL SECURITY;

-- Public read on non-sensitive tables
CREATE POLICY "Public read airports"         ON airports         FOR SELECT USING (TRUE);
CREATE POLICY "Public read amenities"        ON amenities        FOR SELECT USING (TRUE);
CREATE POLICY "Public read active lounges"   ON lounges          FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read lounge amenities" ON lounge_amenities FOR SELECT USING (TRUE);
CREATE POLICY "Public read lounge images"    ON lounge_images    FOR SELECT USING (TRUE);
CREATE POLICY "Public read reviews"          ON reviews          FOR SELECT USING (TRUE);
CREATE POLICY "Public read crowd reports"    ON crowd_reports    FOR SELECT USING (TRUE);

-- Profiles: users manage their own
CREATE POLICY "Users read own profile"   ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Reviews: users manage their own
CREATE POLICY "Users insert reviews"     ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Saved lounges: users manage their own
CREATE POLICY "Users manage saved lounges" ON saved_lounges
  FOR ALL USING (auth.uid() = user_id);

-- Crowd reports: any authenticated user can submit
CREATE POLICY "Auth users submit crowd reports" ON crowd_reports
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- UPDATED_AT trigger helper
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_airports_updated_at BEFORE UPDATE ON airports FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_lounges_updated_at  BEFORE UPDATE ON lounges  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_reviews_updated_at  BEFORE UPDATE ON reviews  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
