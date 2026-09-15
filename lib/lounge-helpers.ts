/**
 * Shared helpers for lounge detail pages (V1 legacy + V2 editorial layout).
 * Extracted so both renderers use identical icon logic and image URLs — a
 * V1/V2 mismatch in these would risk a real SEO or a11y regression when
 * flipping the layout flag per slug.
 */

export function getImageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/lounge-images/${path}`
}

// Reliable Material Symbols icon names for airport lounge amenities.
// We intentionally ignore the DB icon field — many stored values use
// names that are not valid Material Symbols ligatures (e.g. "wine", "utensils").
const AMENITY_ICON_MAP: [string[], string][] = [
  [['wifi', 'wi-fi', 'internet', 'wireless'],                            'wifi'],
  [['free wifi', 'high-speed'],                                          'wifi'],
  [['bar', 'cocktail', 'alcohol', 'spirits', 'wine', 'beer', 'drinks'], 'local_bar'],
  [['hot food', 'buffet', 'hot buffet', 'dining', 'restaurant', 'meal'],'soup_kitchen'],
  [['snack', 'light bites', 'sandwiches'],                              'bakery_dining'],
  [['coffee', 'barista', 'espresso', 'latte'],                          'local_cafe'],
  [['tea'],                                                              'emoji_food_beverage'],
  [['shower'],                                                           'shower'],
  [['spa', 'massage', 'wellness', 'relaxation'],                        'spa'],
  [['gym', 'fitness', 'exercise'],                                       'fitness_center'],
  [['pool', 'swimming'],                                                 'pool'],
  [['business center', 'business centre', 'work'],                      'business_center'],
  [['printing', 'printer', 'print'],                                    'print'],
  [['conference', 'meeting room'],                                       'meeting_room'],
  [['phone', 'telephone', 'landline'],                                   'phone'],
  [['charging', 'power outlet', 'usb'],                                  'electrical_services'],
  [['tv', 'television'],                                                  'tv'],
  [['news', 'newspaper', 'magazine', 'press', 'periodical'],            'newspaper'],
  [['flight info', 'departure', 'arrivals board', 'flight screen'],      'flight'],
  [['quiet', 'silent', 'rest zone'],                                     'do_not_disturb'],
  [['sleep', 'nap', 'daybed', 'day bed'],                               'hotel'],
  [['family', 'kids', 'children'],                                       'family_restroom'],
  [['accessible', 'wheelchair', 'disability'],                           'accessible'],
  [['luggage', 'storage', 'bag drop'],                                   'luggage'],
  [['atm', 'cash machine'],                                              'local_atm'],
  [['smoking'],                                                          'smoking_rooms'],
  [['outdoor', 'terrace', 'deck'],                                       'deck'],
  [['lounge', 'seating'],                                                'chair'],
]

export function amenityIcon(name: string): string {
  const lower = name.toLowerCase().trim()
  for (const [keys, sym] of AMENITY_ICON_MAP) {
    if (keys.some(k => lower.includes(k))) return sym
  }
  return 'check_circle'
}

const ACCESS_ICON_MAP: Record<string, string> = {
  elite: 'stars', status: 'stars', gold: 'stars', silver: 'stars',
  credit: 'credit_card', card: 'credit_card', amex: 'credit_card', visa: 'credit_card',
  class: 'confirmation_number', business: 'confirmation_number', ticket: 'confirmation_number',
}

export function accessIcon(type: string): string {
  const lower = type.toLowerCase()
  for (const [key, sym] of Object.entries(ACCESS_ICON_MAP)) {
    if (lower.includes(key)) return sym
  }
  return 'confirmation_number'
}

export const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
export type DayKey = typeof DAY_ORDER[number]

// Access-type icon mapper specific to the V2 "editorial tier list" style.
// Distinct from the compact accessIcon() — chooses larger, more brand-forward icons.
export function accessTierIcon(type: string): string {
  switch (type) {
    case 'class_of_service': return 'flight_class'
    case 'airline_status':   return 'workspace_premium'
    case 'membership':       return 'card_membership'
    case 'day_pass':         return 'payments'
    case 'credit_card':      return 'credit_card'
    default:                 return 'confirmation_number'
  }
}

// Categorises an access type as complimentary vs paid vs conditional.
// Used to render the tier badge on the V2 access accordion.
export function accessTierBadge(type: string, name: string): { label: string; tone: 'complimentary' | 'paid' | 'conditional' } {
  const lname = name.toLowerCase()
  if (type === 'day_pass' || /walk[- ]in|day pass|paid/i.test(lname)) {
    return { label: 'Paid Access', tone: 'paid' }
  }
  if (type === 'class_of_service') return { label: 'Complimentary', tone: 'complimentary' }
  if (type === 'airline_status')   return { label: 'Member + Guest', tone: 'complimentary' }
  if (type === 'credit_card')      return { label: 'Cardholder', tone: 'complimentary' }
  if (type === 'membership')       return { label: 'Member Entry', tone: 'complimentary' }
  return { label: 'Conditional', tone: 'conditional' }
}

// ────────────────────────────────────────────────────────────────────────────
// Booking-destination resolution — every "Book / View / Reserve" button MUST
// land on a page that actually resolves. Empirical audit (2026-09-14) showed
// that a large fraction of operator URLs we had in the DB now 404 (Air Canada,
// WestJet, Cathay Pacific, SkyTeam regional, KLM Crown, aspireairportlounges).
// So the resolver is now URL-rot-resilient:
//
//   1. Real, verified affiliate booking flow (Plaza Premium, Aspire → Executive
//      Lounges) — return a "Book on X" CTA.
//   2. Priority Pass hosts a per-lounge page for many network lounges; when
//      the lounge.website is a prioritypass.com URL, use it (verified working).
//   3. When we have a Google Place ID, use its Google Maps listing — it is
//      always live, always current on hours/photos/reviews, and functions as
//      a reliable "learn more / get directions" surface for every lounge.
//   4. Only if we have no google_place_id AND we have a lounge.website that
//      is on a first-party operator domain we consider stable (aa.com, nbc.ca,
//      desjardins.com, aeroportdequebec.com) do we fall back to that.
//   5. Otherwise the CTA is hidden — no fake booking button, ever.
//
// The `kind` flag drives (a) whether we apply rel="sponsored nofollow" and
// (b) the caption line under the button.
// ────────────────────────────────────────────────────────────────────────────
import { affiliate } from './affiliates'

export type BookingKind = 'affiliate' | 'priority_pass' | 'google_maps' | 'operator_website' | 'none'
export interface BookingDestination {
  url: string | null
  kind: BookingKind
  /** Short label for the CTA button, e.g. "Book on Plaza Premium" */
  ctaLabel: string | null
  /** Human-readable operator hostname for the caption line */
  hostname: string | null
}

const OPERATOR_AFFILIATES: { match: RegExp; key: 'plaza-premium-booking' | 'aspire-lounge-booking'; brand: string; cta: string; primaryHost: string }[] = [
  { match: /plaza premium/i, key: 'plaza-premium-booking', brand: 'Plaza Premium',    cta: 'View on Plaza Premium',    primaryHost: 'plazapremiumlounge.com' },
  { match: /aspire/i,        key: 'aspire-lounge-booking', brand: 'Executive Lounges', cta: 'View on Executive Lounges', primaryHost: 'executivelounges.com' },
]

/**
 * Whether the operator brand ACTUALLY sells walk-in day passes to the general
 * public. Used by the UI to decide whether to display `guest_fee` as a
 * prominent "Book Now $XX" price on the primary card. Air Canada MLLs have
 * a `guest_fee` in the DB — but that is the additional-guest fee an eligible
 * *member* pays to bring a companion, NOT a walk-in ticket price. Showing it
 * as "Book Now $59" would be misleading to a non-member reader.
 */
export function sellsWalkInDayPass(loungeName: string, accessTypes: readonly { type: string; name: string }[]): boolean {
  const n = loungeName.toLowerCase()
  if (n.includes('plaza premium')) return true
  if (n.includes('aspire'))         return true
  if (n.includes('westjet'))        return true
  // Fall-through: only if the DB explicitly marks a day_pass access type NOT
  // labelled as an "add-on" or "fare" (which are fare-conditional, not walk-in)
  return accessTypes.some(at =>
    at.type === 'day_pass' && !/add[- ]on|fare/i.test(at.name)
  )
}

// Domains we treat as verified stable operator sites — checked 2026-09-14.
// Any lounge.website hostname not on this list is treated as suspect and we
// prefer the Google Maps listing instead. Add to this list ONLY after verifying
// the URL resolves 200.
const VERIFIED_OPERATOR_HOSTS = new Set([
  'prioritypass.com',
  'aa.com',
  'americanairlines.com',
  'desjardins.com',
  'nbc.ca',
  'aeroportdequebec.com',
  'plazapremiumlounge.com',
  'executivelounges.com',
])

interface BookingContext {
  name: string
  website: string | null
  googlePlaceId: string | null
}

export function getBookingDestination(ctx: BookingContext): BookingDestination {
  // 1. Real operator-affiliate booking flow (Plaza Premium, Aspire).
  //    Empirical finding (2026-09-14 curl audit): the generic affiliate search
  //    URLs (plazapremiumlounge.com/en-uk/find?utm_source=...) redirect to
  //    a soft-404 when hit with UTM params. But the per-lounge URLs stored in
  //    lounge.website (…/en-uk/find/americas/canada/toronto/…) all return 200.
  //    So: when the DB has a lounge.website on the operator's own hostname,
  //    prefer it — it's per-lounge specific AND verified working. Fall back
  //    to the affiliate registry only if lounge.website is missing.
  for (const op of OPERATOR_AFFILIATES) {
    if (op.match.test(ctx.name)) {
      const websiteHost = ctx.website ? safeHostname(ctx.website) : null
      if (ctx.website && websiteHost === op.primaryHost) {
        return { url: ctx.website, kind: 'affiliate', ctaLabel: op.cta, hostname: op.primaryHost }
      }
      const url = affiliate(op.key)
      return { url, kind: 'affiliate', ctaLabel: op.cta, hostname: safeHostname(url) }
    }
  }

  // 2. Priority Pass network lounges — their per-lounge page is verified working
  if (ctx.website && /prioritypass\.com/i.test(ctx.website)) {
    return {
      url: ctx.website,
      kind: 'priority_pass',
      ctaLabel: 'View on Priority Pass',
      hostname: 'prioritypass.com',
    }
  }

  // 3. Google Maps place listing — the reliable universal fallback. Always
  //    resolves, always current on hours/photos/reviews/directions.
  if (ctx.googlePlaceId) {
    return {
      url: `https://www.google.com/maps/place/?q=place_id:${ctx.googlePlaceId}`,
      kind: 'google_maps',
      ctaLabel: 'View on Google Maps',
      hostname: 'google.com',
    }
  }

  // 4. Fall back to lounge.website ONLY when it's on our verified-stable list
  const host = ctx.website ? safeHostname(ctx.website) : null
  if (ctx.website && host && VERIFIED_OPERATOR_HOSTS.has(host)) {
    return {
      url: ctx.website,
      kind: 'operator_website',
      ctaLabel: 'View on operator site',
      hostname: host,
    }
  }

  // 5. No verified path — the CTA is hidden
  return { url: null, kind: 'none', ctaLabel: null, hostname: null }
}

function safeHostname(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Live open/closed computation — respects the airport's own timezone. Never
// invents information: when hours are unparseable or the timezone is unknown,
// returns kind: 'unknown' so the UI can gracefully fall back to just showing
// the schedule.
// ────────────────────────────────────────────────────────────────────────────
export type LiveStatusKind = 'open_247' | 'open' | 'closing_soon' | 'closed' | 'unknown'
export interface LiveStatus {
  kind: LiveStatusKind
  /** Short label, e.g. "Open · closes at 19:30", "Opens tomorrow at 04:30" */
  label: string
  /** Whether to render a green pulse (open) or amber static (closed) */
  tone: 'open' | 'closed' | 'unknown'
}

export function getLiveStatus(
  openingHoursRaw: unknown,
  timezone: string | null,
): LiveStatus {
  const openingHours = openingHoursRaw as
    | { [k: string]: string | boolean | undefined; is_24_7?: boolean }
    | null
    | undefined

  if (!openingHours) return { kind: 'unknown', label: 'See schedule below', tone: 'unknown' }
  if (openingHours.is_24_7) return { kind: 'open_247', label: 'Always open · 24 / 7', tone: 'open' }
  if (!timezone) return { kind: 'unknown', label: 'See schedule below', tone: 'unknown' }

  // Extract current time in the airport's timezone. Intl gives us the fields
  // without needing a full temporal library.
  const now = new Date()
  let tzParts: Intl.DateTimeFormatPart[]
  try {
    tzParts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(now)
  } catch {
    return { kind: 'unknown', label: 'See schedule below', tone: 'unknown' }
  }
  const weekday = tzParts.find(p => p.type === 'weekday')?.value.toLowerCase() ?? ''
  const hourStr = tzParts.find(p => p.type === 'hour')?.value ?? '00'
  const minuteStr = tzParts.find(p => p.type === 'minute')?.value ?? '00'
  const nowMinutes = parseInt(hourStr, 10) * 60 + parseInt(minuteStr, 10)

  const todayHours = openingHours[weekday as keyof typeof openingHours]
  if (typeof todayHours !== 'string' || !todayHours) {
    // Closed today — look at tomorrow's schedule so we can say "Opens tomorrow at …"
    const nextOpen = findNextOpenSlot(openingHours, weekday)
    if (nextOpen) return { kind: 'closed', label: `Closed · opens ${nextOpen.day} at ${nextOpen.open}`, tone: 'closed' }
    return { kind: 'closed', label: 'Closed today', tone: 'closed' }
  }

  const parsed = parseHoursRange(todayHours)
  if (!parsed) return { kind: 'unknown', label: 'See schedule below', tone: 'unknown' }

  const { openMin, closeMin, openStr, closeStr } = parsed
  if (nowMinutes < openMin) {
    return { kind: 'closed', label: `Closed · opens at ${openStr}`, tone: 'closed' }
  }
  if (nowMinutes >= closeMin) {
    const nextOpen = findNextOpenSlot(openingHours, weekday)
    if (nextOpen) return { kind: 'closed', label: `Closed · opens ${nextOpen.day} at ${nextOpen.open}`, tone: 'closed' }
    return { kind: 'closed', label: 'Closed for the day', tone: 'closed' }
  }
  // Open. Within 30 minutes of close?
  if (closeMin - nowMinutes <= 30) {
    return { kind: 'closing_soon', label: `Closing soon · at ${closeStr}`, tone: 'open' }
  }
  return { kind: 'open', label: `Open · closes at ${closeStr}`, tone: 'open' }
}

function parseHoursRange(raw: string): { openMin: number; closeMin: number; openStr: string; closeStr: string } | null {
  const trimmed = raw.trim()
  if (!trimmed || /^closed$/i.test(trimmed)) return null
  // Match formats like "04:30 – 19:30", "4:30-19:30", "04:30 - 19:30"
  const m = trimmed.match(/(\d{1,2}):?(\d{2})?\s*[-–—]\s*(\d{1,2}):?(\d{2})?/)
  if (!m) return null
  const openH = parseInt(m[1], 10)
  const openM = m[2] ? parseInt(m[2], 10) : 0
  const closeH = parseInt(m[3], 10)
  const closeM = m[4] ? parseInt(m[4], 10) : 0
  if ([openH, openM, closeH, closeM].some(n => Number.isNaN(n))) return null
  const openMin = openH * 60 + openM
  // Handle "22:00 – 02:00" overnight ranges by treating close < open as next-day
  let closeMin = closeH * 60 + closeM
  if (closeMin <= openMin) closeMin += 24 * 60
  const fmt = (h: number, mm: number) => `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
  return { openMin, closeMin, openStr: fmt(openH, openM), closeStr: fmt(closeH, closeM) }
}

const WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
function findNextOpenSlot(
  openingHours: { [k: string]: string | boolean | undefined },
  today: string,
): { day: string; open: string } | null {
  const startIdx = WEEK.indexOf(today.toLowerCase())
  if (startIdx < 0) return null
  for (let i = 1; i <= 7; i++) {
    const dayName = WEEK[(startIdx + i) % 7]
    const val = openingHours[dayName]
    if (typeof val !== 'string' || !val) continue
    const parsed = parseHoursRange(val)
    if (!parsed) continue
    const label = i === 1 ? 'tomorrow' : dayName[0].toUpperCase() + dayName.slice(1)
    return { day: label, open: parsed.openStr }
  }
  return null
}

