-- ============================================================
-- "Typical Busy Times" editorial widget
-- Adds a busy_times JSONB column to lounges and populates it
-- for lounges where peak/quiet-hour research already exists
-- in the blog content. Shape: { busiest?, quietest?, note }
-- ============================================================

ALTER TABLE lounges ADD COLUMN IF NOT EXISTS busy_times JSONB;

-- WestJet Elevation Lounge (YYC)
UPDATE lounges SET busy_times = '{
  "busiest": "9:00 AM – 1:00 PM",
  "quietest": "After 2:00 PM",
  "note": "Fills up fast during WestJet''s morning and midday departure banks — Priority Pass members are turned away first once the lounge reaches capacity. Arrive at least 2 hours before departure, or visit after 2 PM for a calmer experience."
}'::jsonb
WHERE slug = 'westjet-elevation-lounge-yyc';

-- Aspire Lounge International (YYC, Concourse D)
UPDATE lounges SET busy_times = '{
  "note": "Generally calmer than the Elevation Lounge — a good alternative for international departures when Elevation is at capacity."
}'::jsonb
WHERE slug = 'aspire-lounge-yyc-international';

-- Aspire Lounge US Transborder (YYC, Concourse E)
UPDATE lounges SET busy_times = '{
  "note": "Priority Pass notes capacity restrictions may apply during peak periods. Visit before clearing US Customs, since you cannot return to other lounges once through."
}'::jsonb
WHERE slug = 'aspire-lounge-yyc-us-transborder';

-- Air France / KLM Lounge (YUL, Gate 57, International)
UPDATE lounges SET busy_times = '{
  "busiest": "3:00 PM – 7:00 PM",
  "quietest": "5:00 AM – 2:00 PM",
  "note": "Becomes extremely crowded as Air France and KLM transatlantic departures to Paris and Amsterdam prepare — Priority Pass members can be denied entry during this window even after arriving early. Visit between 5 AM and 2 PM for the best chance of entry."
}'::jsonb
WHERE slug = 'air-france-klm-lounge-yul';

-- SkyTeam Lounge (YVR)
UPDATE lounges SET busy_times = '{
  "busiest": "10:00 AM – 2:00 PM",
  "quietest": "Before 5:00 AM",
  "note": "Multiple long-haul departures to Asia and Europe prepare during this window and the noodle bar opens at 11 AM. Arrive at least 90 minutes early if a shower is the priority, or visit before 5 AM for the quietest experience."
}'::jsonb
WHERE slug = 'skyteam-lounge-yvr';

-- Air Canada Maple Leaf Lounge International (YYZ)
UPDATE lounges SET busy_times = '{
  "note": "One of the busiest lounges in the Maple Leaf network — an enforced cell-free quiet zone helps with focus, but shower suites see a common waitlist. Ask about shower availability immediately on arrival."
}'::jsonb
WHERE slug = 'ac-maple-leaf-lounge-international-yyz';

-- Air Canada Maple Leaf Lounge International (YVR)
UPDATE lounges SET busy_times = '{
  "note": "Runs noticeably less frantic than its Toronto counterpart, with an enforced cell-free quiet zone — one of the calmer international lounges in the network."
}'::jsonb
WHERE slug = 'ac-maple-leaf-lounge-international-yvr';

-- Air Canada Maple Leaf Lounge Domestic (YYC)
UPDATE lounges SET busy_times = '{
  "quietest": "Right after the 4:30 AM opening",
  "note": "Rated the quietest and least crowded Maple Leaf Lounge in Canada, especially right after its 4:30 AM opening — the earliest of any Maple Leaf Lounge — making it a strong pick for early-morning domestic departures."
}'::jsonb
WHERE slug = 'ac-maple-leaf-lounge-yyc';

-- Plaza Premium First (YVR)
UPDATE lounges SET busy_times = '{
  "note": "24-hour access creates a varied crowd at all hours, with no enforced quiet zone. Book online at plazapremiumgroup.com in advance, especially on busy travel days like Fridays and Sundays."
}'::jsonb
WHERE slug = 'plaza-premium-first-yvr';

-- Aspire Salon Lounge (YOW)
UPDATE lounges SET busy_times = '{
  "note": "Small and consistently uncrowded, with a private work area suited for calls — a reliable quiet pick even without a formal cell-free policy."
}'::jsonb
WHERE slug = 'aspire-salon-lounge-yow';

-- Cathay Pacific Lounge (YVR)
UPDATE lounges SET busy_times = '{
  "note": "Opens only 3–4 hours before Cathay Pacific departures, so it never gets overcrowded — one of the calmest premium lounges in Canada."
}'::jsonb
WHERE slug = 'cathay-pacific-lounge-yvr';

-- Air Canada Café, Gate C50 (YVR)
UPDATE lounges SET busy_times = '{
  "note": "Power at every seat keeps this lounge popular with laptop workers. The grab-and-go concept keeps lines moving quickly even when busy."
}'::jsonb
WHERE slug = 'air-canada-cafe-yvr';

-- Air Canada Petit Café, Gate C46/C47 (YVR)
UPDATE lounges SET busy_times = '{
  "note": "Smaller and grab-and-go focused, which means higher foot traffic relative to its size — expect a busier feel than the larger AC Café at Gate C50."
}'::jsonb
WHERE slug = 'air-canada-petit-cafe-yvr';
