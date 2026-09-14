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
// Booking destination resolution — every "Book Access" button MUST land on a
// working reservation surface. Order of preference:
//   1. Operator-specific affiliate booking flow (Plaza Premium, Aspire, WestJet)
//   2. The lounge's own operator website (lounge.website) — always the truth
//   3. Null — the CTA is hidden entirely (never a fake "Book" button)
//
// The kind flag lets the UI decide when to apply rel="sponsored nofollow" and
// when to show the "Reservation via operator" caption.
// ────────────────────────────────────────────────────────────────────────────
import { affiliate } from './affiliates'

export type BookingKind = 'affiliate' | 'operator_website' | 'none'
export interface BookingDestination {
  url: string | null
  kind: BookingKind
  /** Short label for the CTA button, e.g. "Book on Plaza Premium" */
  ctaLabel: string | null
  /** Human-readable operator hostname for the caption line */
  hostname: string | null
}

const OPERATOR_AFFILIATES: { match: RegExp; key: 'plaza-premium-booking' | 'aspire-lounge-booking' | 'westjet-elevation-booking'; brand: string }[] = [
  { match: /plaza premium/i, key: 'plaza-premium-booking',      brand: 'Plaza Premium' },
  { match: /aspire/i,        key: 'aspire-lounge-booking',       brand: 'Aspire' },
  { match: /westjet/i,       key: 'westjet-elevation-booking',   brand: 'WestJet' },
]

export function getBookingDestination(loungeName: string, loungeWebsite: string | null): BookingDestination {
  // 1. Known operator-affiliate booking flows
  for (const op of OPERATOR_AFFILIATES) {
    if (op.match.test(loungeName)) {
      const url = affiliate(op.key)
      return {
        url,
        kind: 'affiliate',
        ctaLabel: `Book on ${op.brand}`,
        hostname: safeHostname(url),
      }
    }
  }
  // 2. Operator's own website — the source of truth
  if (loungeWebsite) {
    return {
      url: loungeWebsite,
      kind: 'operator_website',
      ctaLabel: 'Reserve on operator site',
      hostname: safeHostname(loungeWebsite),
    }
  }
  // 3. No booking path
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

