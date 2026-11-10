# PRD — Hotels, Parking & Food Sections on Airport Hub Pages

_Status: Draft · 2026-11-09 · Owner: AirportLounges.ca_

## 1. Goal

Extend each of the 13 airport hub pages (`/airports/[iata]`) with three new monetizable sections: **airport hotels**, **airport parking**, and **airport food**. Same visitor, same intent moment, 3× the revenue per page view. Keep the existing lounge content as the primary hero; the new sections slot in below the lounge grid or into a dedicated sub-page per airport.

## 2. Why now

- **13 airport hub pages already rank**. Google sees us as the authority for Canadian airport info. Adding parking/hotel/food to the same URL harvests additional long-tail queries (e.g., *"parking at YVR"*, *"hotels near YYZ"*, *"best food at YUL before flight"*) without earning new backlinks.
- **Existing visitor intent overlaps.** Someone looking at lounges at YUL is already planning a trip — they also need parking and (often) a hotel. Co-locating converts multiple decisions on one page.
- **Affiliate programs are easier than the lounge/CC space.** Booking.com, hotel chains, and parking providers have fewer approval hurdles than Priority Pass or Finlywealth.

## 3. Scope

### In scope (v1)

- **Hotels**: Top 3-5 hotels at or near each airport, with price range, distance, and a Booking.com affiliate link. Focus on on-airport and shuttle-accessible hotels.
- **Parking**: Official on-site parking (airport authority link), plus off-site options (Park'N Fly, WallyPark equivalents, airport authority partners). Pricing bands + distance.
- **Food**: Editorial pre-security and post-security dining guide. Short list (5-10 spots), brand names, terminal locations, "best for" tags (quick, sit-down, local, late-night).

### Out of scope (v1)

- Hotel search widget / live pricing (deferred to v2)
- Parking reservation flow (link out only)
- Food reservations / booking (editorial only — no affiliate)
- Pet relief areas, nursing rooms, prayer rooms, etc. (separate PRD if demand)

## 4. Data model

### `airports` table additions

```sql
-- new columns on existing airports table
alter table airports add column hotels_data jsonb;      -- array of Hotel objects
alter table airports add column parking_data jsonb;     -- array of ParkingOption objects
alter table airports add column food_data jsonb;        -- array of FoodSpot objects
alter table airports add column data_updated_at timestamptz;
```

### TypeScript shapes (`lib/airport-amenities.ts` — new file)

```ts
export interface Hotel {
  name: string
  chain?: string                    // 'Marriott', 'Fairmont', etc
  distance: string                  // "On-airport", "2 km shuttle", etc
  priceBand: 'budget' | 'mid' | 'premium' | 'luxury'
  bookingAffiliate?: string         // affiliate key or direct URL
  bookingUrl?: string               // falls back if no affiliate
  highlights?: string[]             // ["Shuttle 24/7", "Pool", "Day rooms"]
}

export interface ParkingOption {
  name: string
  type: 'economy' | 'daily' | 'premium' | 'valet' | 'off-site'
  operator: string                  // "YVR Airport Authority", "Park'N Fly"
  priceBand: string                 // "$15-25/day"
  shuttleFreq?: string              // "every 15 min"
  affiliateUrl?: string
  bookingUrl?: string
}

export interface FoodSpot {
  name: string
  cuisine: string                   // "Canadian comfort", "Sushi", etc
  terminal: string
  area: 'pre-security' | 'post-security' | 'arrivals'
  priceBand: '$' | '$$' | '$$$'
  bestFor: string[]                 // ["Quick bite", "Business meeting"]
  openingHours?: string
}
```

## 5. UI

### Airport hub page extensions

New sections added below the existing lounge grid on `app/airports/[iata]/page.tsx`:

```
[existing: hero + lounge grid + hero band CTA]

<AirportHotelsSection airport={airport} />
<AirportParkingSection airport={airport} />
<AirportFoodSection airport={airport} />

[existing: sidebar unchanged]
```

Each section:
- H2 headline (e.g., *"Where to stay at YUL"*)
- 2-3 sentence editorial intro
- Grid of 3-5 cards with image/icon, name, key fact, price band, affiliate CTA
- "See all hotels at YUL →" link to dedicated sub-page if more than 5

### Dedicated sub-pages

- `/airports/[iata]/hotels`
- `/airports/[iata]/parking`
- `/airports/[iata]/food`

Each sub-page = full list + filters + editorial intro. SEO target: *"best hotels at YYZ"*, *"parking YVR long term"*, etc.

## 6. Affiliate model

| Section | Partner | Model | Est. commission |
|---|---|---|---|
| Hotels | Booking.com (primary) | CPA — 25-40% of Booking's commission | ~$5-15 per booking |
| Hotels | Hotels.com (fallback) | CPA via Impact | ~5-7% of stay value |
| Hotels | Expedia Canada | CPA via EAN | ~4-8% |
| Parking | Park'N Fly | CPA | $2-4 per booking |
| Parking | Airport authority | None (editorial) | — |
| Parking | ParkingAdvisor | CPA | Variable |
| Food | None | Editorial only | — |

**Priority**: wire Booking.com first (easy approval, highest volume). Park'N Fly second. Food stays editorial — trust signal, not revenue.

## 7. Data sourcing

- **Hotels**: Scrape top-rated hotels within 10 km of each airport from Google Places + manual curation. 1-time ingest, quarterly refresh.
- **Parking**: Airport authority websites publish current rates. 1-time scrape → stored → semi-annual refresh.
- **Food**: Manually curated once per airport (editorial). ~2 hrs per airport = 26 hrs total one-time.

Store in `airports.{hotels,parking,food}_data` JSONB. Avoid a separate normalized table for v1 — the data doesn't change often enough to justify it.

## 8. Phased rollout

| Phase | Scope | Est time |
|---|---|---|
| **v1.0** | Hotels on YUL, YYZ, YVR only (top 3 traffic). Booking.com wired. | 4-6 hrs |
| **v1.1** | Parking on same 3 airports. Park'N Fly affiliate applied + wired. | 3-4 hrs |
| **v1.2** | Food editorial on same 3 airports. | 4-6 hrs |
| **v1.3** | Hotels + parking on remaining 10 airports. | 6-8 hrs |
| **v2** | Live hotel pricing widget (Booking.com API). Filters on sub-pages. | 1-2 weeks |

Total v1 (top 3 airports, all 3 categories): **~15-20 hrs active work**.

## 9. Success metrics

Measured in Google Analytics + Finlywealth/Booking.com dashboards:

- **Traffic**: Airport hub pages +15-30% sessions in 90 days (new long-tail queries ranking)
- **Conversion**: Booking.com clicks / airport hub session ≥ 1%
- **Revenue**: $100-300/mo from Booking.com within 6 months (conservative floor)
- **Engagement**: Avg scroll depth on hub pages +20% (more content below the fold)

## 10. Risks + mitigations

| Risk | Mitigation |
|---|---|
| Booking.com affiliate rejects us for low traffic | Apply with current traffic numbers; if rejected, use Hotels.com via Impact as fallback |
| Food section becomes stale (restaurants close/open) | Mark each food entry with `verified_at`; quarterly refresh cron; prominent "verified Qx 2026" badge |
| Parking prices change frequently | Price **bands** ($15-25/day), not exact prices. Link out to live pricing. |
| Section bloat slows airport hub LCP | Lazy-load sections below the fold; keep per-section JS < 10 KB |

## 11. Open questions

1. **Booking.com account**: do you already have a partner ID, or do we need to apply? (If apply: 3-5 business days typical.)
2. **Park'N Fly / airport parking affiliate**: any existing relationship, or start fresh?
3. **Editorial voice for food**: first-person ("I like Café Stella because…") or brand voice ("AirportLounges.ca recommends…")? Default: brand voice per the no-public-name rule.

## 12. First milestone trigger

Approve this PRD + answer §11 questions → I build the v1.0 YUL Hotels section end-to-end as a template. Once proven, v1.1-v1.3 clone the pattern.
