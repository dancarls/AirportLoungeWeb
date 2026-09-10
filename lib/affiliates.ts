/**
 * Central affiliate link registry.
 *
 * Every outbound partner link on the site should be built via `affiliate('key')`
 * — never hardcoded — so that when an affiliate program approves us we swap in
 * the tracking parameters in one place instead of hunting across components.
 *
 * Adding a new program:
 *   1. Add its base URL and (optional) tracking parameters below.
 *   2. Set the affiliate ID via the corresponding env var; without one,
 *      the plain URL still works so the link never breaks.
 *   3. Reference it as `affiliate('priority-pass')` in any component.
 *
 * Environment variables (set in Vercel > Project Settings > Environment Variables
 * once each affiliate approval comes through):
 *   NEXT_PUBLIC_AFF_PRIORITY_PASS      — e.g. impact.com sharedid or partner code
 *   NEXT_PUBLIC_AFF_DRAGONPASS         — DragonPass partner reference
 *   NEXT_PUBLIC_AFF_RATEHUB            — RateHub referral code
 *   NEXT_PUBLIC_AFF_CREDIT_CARD_GENIUS — Credit Card Genius affiliate id
 *   NEXT_PUBLIC_AFF_AMEX_CA            — Amex Canada advocacy code
 *   NEXT_PUBLIC_AFF_AMAZON_CA          — Amazon Associates.ca tag (e.g. airportloung-20)
 *   NEXT_PUBLIC_AFF_BOOKING            — Booking.com aid parameter
 */

type AffiliateKey =
  | 'priority-pass'
  | 'priority-pass-membership'
  | 'dragonpass'
  | 'ratehub-amex-platinum'
  | 'ratehub-amex-aeroplan-reserve'
  | 'ratehub-td-aeroplan-vip'
  | 'ratehub-cibc-aeroplan-vip'
  | 'ratehub-rbc-avion-vip'
  | 'ratehub-scotiabank-passport'
  | 'ratehub-index'
  | 'credit-card-genius'
  | 'amazon-noise-cancelling-headphones'
  | 'amazon-usb-c-charger'
  | 'amazon-packing-cubes'
  | 'booking-hotels'
  // Day-pass booking destinations — commission on booked lounge entries
  | 'plaza-premium-booking'
  | 'aspire-lounge-booking'
  | 'westjet-elevation-booking'
  | 'loungebuddy-booking'

interface AffiliateEntry {
  /** Base destination URL — always renders even without an affiliate ID. */
  url: string
  /**
   * Env var whose value (if set) is spliced into the URL via `paramKey`.
   * When the env var is unset, the plain `url` is returned unchanged.
   */
  envVar?: string
  /** Query-string key used to attach the affiliate ID. */
  paramKey?: string
  /** Optional extra query params always appended (utm_source, etc.). */
  extraParams?: Record<string, string>
}

const REGISTRY: Record<AffiliateKey, AffiliateEntry> = {
  // Priority Pass — the app landing page (join / membership plans)
  'priority-pass': {
    url: 'https://www.prioritypass.com/',
    envVar: 'NEXT_PUBLIC_AFF_PRIORITY_PASS',
    paramKey: 'partnerRef',
    extraParams: { utm_source: 'airportlounges_ca', utm_medium: 'referral' },
  },
  'priority-pass-membership': {
    url: 'https://www.prioritypass.com/en/membership/plans',
    envVar: 'NEXT_PUBLIC_AFF_PRIORITY_PASS',
    paramKey: 'partnerRef',
    extraParams: { utm_source: 'airportlounges_ca', utm_medium: 'referral', utm_campaign: 'membership_plans' },
  },
  dragonpass: {
    url: 'https://www.dragonpass.com/en/lounges',
    envVar: 'NEXT_PUBLIC_AFF_DRAGONPASS',
    paramKey: 'ref',
    extraParams: { utm_source: 'airportlounges_ca' },
  },
  // RateHub — Canadian credit card comparison and CPA marketplace.
  // Each product has its own landing page; the referral code is applied uniformly.
  'ratehub-index': {
    url: 'https://www.ratehub.ca/credit-cards',
    envVar: 'NEXT_PUBLIC_AFF_RATEHUB',
    paramKey: 'ref',
    extraParams: { utm_source: 'airportlounges_ca' },
  },
  'ratehub-amex-platinum': {
    url: 'https://www.ratehub.ca/credit-cards/american-express-platinum-card',
    envVar: 'NEXT_PUBLIC_AFF_RATEHUB',
    paramKey: 'ref',
    extraParams: { utm_source: 'airportlounges_ca', utm_content: 'amex_platinum' },
  },
  'ratehub-amex-aeroplan-reserve': {
    url: 'https://www.ratehub.ca/credit-cards/amex-aeroplan-reserve',
    envVar: 'NEXT_PUBLIC_AFF_RATEHUB',
    paramKey: 'ref',
    extraParams: { utm_source: 'airportlounges_ca', utm_content: 'amex_aeroplan_reserve' },
  },
  'ratehub-td-aeroplan-vip': {
    url: 'https://www.ratehub.ca/credit-cards/td-aeroplan-visa-infinite-privilege',
    envVar: 'NEXT_PUBLIC_AFF_RATEHUB',
    paramKey: 'ref',
    extraParams: { utm_source: 'airportlounges_ca', utm_content: 'td_aeroplan_vip' },
  },
  'ratehub-cibc-aeroplan-vip': {
    url: 'https://www.ratehub.ca/credit-cards/cibc-aeroplan-visa-infinite-privilege',
    envVar: 'NEXT_PUBLIC_AFF_RATEHUB',
    paramKey: 'ref',
    extraParams: { utm_source: 'airportlounges_ca', utm_content: 'cibc_aeroplan_vip' },
  },
  'ratehub-rbc-avion-vip': {
    url: 'https://www.ratehub.ca/credit-cards/rbc-avion-visa-infinite-privilege',
    envVar: 'NEXT_PUBLIC_AFF_RATEHUB',
    paramKey: 'ref',
    extraParams: { utm_source: 'airportlounges_ca', utm_content: 'rbc_avion_vip' },
  },
  'ratehub-scotiabank-passport': {
    url: 'https://www.ratehub.ca/credit-cards/scotiabank-passport-visa-infinite',
    envVar: 'NEXT_PUBLIC_AFF_RATEHUB',
    paramKey: 'ref',
    extraParams: { utm_source: 'airportlounges_ca', utm_content: 'scotia_passport' },
  },
  'credit-card-genius': {
    url: 'https://www.creditcardgenius.ca/',
    envVar: 'NEXT_PUBLIC_AFF_CREDIT_CARD_GENIUS',
    paramKey: 'aff',
    extraParams: { utm_source: 'airportlounges_ca' },
  },
  // Amazon Associates.ca — travel-gear posts. The `tag` parameter is the official
  // Amazon Associates identifier; use the .ca product URLs.
  'amazon-noise-cancelling-headphones': {
    url: 'https://www.amazon.ca/s?k=noise+cancelling+headphones+travel',
    envVar: 'NEXT_PUBLIC_AFF_AMAZON_CA',
    paramKey: 'tag',
  },
  'amazon-usb-c-charger': {
    url: 'https://www.amazon.ca/s?k=usb+c+laptop+charger+travel',
    envVar: 'NEXT_PUBLIC_AFF_AMAZON_CA',
    paramKey: 'tag',
  },
  'amazon-packing-cubes': {
    url: 'https://www.amazon.ca/s?k=packing+cubes+carry+on',
    envVar: 'NEXT_PUBLIC_AFF_AMAZON_CA',
    paramKey: 'tag',
  },
  'booking-hotels': {
    url: 'https://www.booking.com/',
    envVar: 'NEXT_PUBLIC_AFF_BOOKING',
    paramKey: 'aid',
    extraParams: { utm_source: 'airportlounges_ca' },
  },
  // Day-pass booking — commission-eligible programs. Fallback URLs go to the
  // operator's main booking page even without an affiliate ID.
  'plaza-premium-booking': {
    url: 'https://www.plazapremiumlounge.com/en-uk/find',
    envVar: 'NEXT_PUBLIC_AFF_PLAZA_PREMIUM',
    paramKey: 'ref',
    extraParams: { utm_source: 'airportlounges_ca', utm_medium: 'daypass' },
  },
  'aspire-lounge-booking': {
    url: 'https://www.executivelounges.com/',
    envVar: 'NEXT_PUBLIC_AFF_ASPIRE',
    paramKey: 'ref',
    extraParams: { utm_source: 'airportlounges_ca', utm_medium: 'daypass' },
  },
  'westjet-elevation-booking': {
    url: 'https://www.westjet.com/en-ca/travel-info/at-the-airport/lounges',
    envVar: 'NEXT_PUBLIC_AFF_WESTJET',
    paramKey: 'ref',
    extraParams: { utm_source: 'airportlounges_ca', utm_medium: 'daypass' },
  },
  'loungebuddy-booking': {
    url: 'https://www.americanexpress.com/en-us/travel/lounge-buddy',
    envVar: 'NEXT_PUBLIC_AFF_LOUNGEBUDDY',
    paramKey: 'ref',
    extraParams: { utm_source: 'airportlounges_ca', utm_medium: 'daypass' },
  },
}

/**
 * Build the outbound URL for an affiliate destination. If the program's ID
 * has not been set yet, the plain URL still works — the affiliate parameters
 * simply get skipped (no broken link, no `?tag=undefined`).
 */
export function affiliate(key: AffiliateKey): string {
  const entry = REGISTRY[key]
  if (!entry) return '#'
  const url = new URL(entry.url)
  if (entry.envVar && entry.paramKey) {
    const id = process.env[entry.envVar]
    if (id) url.searchParams.set(entry.paramKey, id)
  }
  if (entry.extraParams) {
    for (const [k, v] of Object.entries(entry.extraParams)) {
      url.searchParams.set(k, v)
    }
  }
  return url.toString()
}

/**
 * Whether an affiliate program is currently monetized (env var set). Useful
 * for conditionally rendering an affiliate-badge or disclosure label.
 */
export function isAffiliated(key: AffiliateKey): boolean {
  const entry = REGISTRY[key]
  return !!(entry?.envVar && process.env[entry.envVar])
}

/**
 * Standard rel attributes for any monetized outbound link — sponsored + nofollow
 * covers both Google's compensation-disclosure guidance and safety.
 */
export const AFFILIATE_REL = 'sponsored nofollow noopener'
