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
  // Ratehub via Impact.com — legacy fallback + backup for cards FinlyWealth doesn't monetize.
  | 'ratehub-amex-platinum'
  | 'ratehub-amex-aeroplan-reserve'
  | 'ratehub-td-aeroplan-vip'
  | 'ratehub-cibc-aeroplan-vip'
  | 'ratehub-rbc-avion-vip'
  | 'ratehub-scotiabank-passport'
  | 'ratehub-index'
  | 'credit-card-genius'
  // FinlyWealth — primary Canadian credit-card affiliate. URLs confirmed by rep 2026-09-09.
  // Each will be wrapped by the FinlyWealth link generator once we have the affiliate ID —
  // until then the plain URL still works and the ID slots in via NEXT_PUBLIC_AFF_FINLYWEALTH.
  | 'finlywealth-compare-tool'
  | 'finlywealth-rebates-catalog'
  | 'finlywealth-lounge-access-cards'
  | 'finlywealth-aeroplan-cards'
  | 'finlywealth-priority-pass-guide'
  | 'finlywealth-amex-platinum'
  | 'finlywealth-amex-aeroplan-reserve'
  | 'finlywealth-td-aeroplan-vip'
  | 'finlywealth-cibc-aeroplan-vip'
  | 'finlywealth-rbc-avion-vip'
  | 'finlywealth-scotia-passport'
  // FinlyWealth interactive tools (destination pages, not embeds).
  | 'finlywealth-quiz'
  | 'finlywealth-combos-calculator'
  | 'finlywealth-rewards-calculator-index'
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
  /**
   * When set, the entry is routed through FinlyWealth's redirect at
   *   https://finlywealth.com/r/<code>?url=<path>&utm_source=<placement>
   * per Shang's onboarding note (2026-09-27). `url` in this case is the
   * destination path *inside* finlywealth.com; `placement` becomes utm_source
   * (the only UTM axis their affiliate hub reports on per-link).
   *
   * FinlyWealth does not attribute clicks that go directly to a
   * finlywealth.com page with `?ref=<code>` — the `/r/` redirect is
   * mandatory. Do NOT set both `finlywealthRedirect` and `envVar`/`paramKey`.
   */
  finlywealthRedirect?: { placement: string }
}

const FINLYWEALTH_REDIRECT_HOST = 'https://finlywealth.com'
const FINLYWEALTH_DIRECT_HOST = 'https://www.finlywealth.com'

/**
 * Build a FinlyWealth affiliate URL that routes through their /r/ redirect.
 * Every FinlyWealth outbound link on the site MUST go through this shape:
 *   https://finlywealth.com/r/<code>?url=<path>&utm_source=<placement>
 * Only `utm_source` reaches FinlyWealth's per-placement reporting; other
 * UTM params added here are dropped by their redirect.
 */
function buildFinlywealthUrl(destPath: string, placement: string): string {
  const code = process.env.NEXT_PUBLIC_AFF_FINLYWEALTH
  if (!code) {
    // Direct fallback so links still resolve; not attributed.
    return `${FINLYWEALTH_DIRECT_HOST}${destPath}`
  }
  const params = new URLSearchParams()
  params.set('url', destPath)
  params.set('utm_source', placement)
  // URLSearchParams percent-encodes `/`; FinlyWealth's documented example
  // uses literal slashes in the `url` param. Restore them to match.
  const qs = params.toString().replace(/%2F/g, '/')
  return `${FINLYWEALTH_REDIRECT_HOST}/r/${encodeURIComponent(code)}?${qs}`
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
  // FinlyWealth destinations — routed through /r/<code>?url=<path> per Shang's
  // 2026-09-27 onboarding note. Attribution to the affiliate account happens
  // via the /r/ redirect, NOT via a ?ref= parameter on a direct link. The
  // placement string becomes utm_source in FinlyWealth's per-link reporting.
  'finlywealth-compare-tool': {
    url: '/credit-cards/compare',
    finlywealthRedirect: { placement: 'compare-tool' },
  },
  'finlywealth-rebates-catalog': {
    url: '/rebates',
    finlywealthRedirect: { placement: 'rebates-catalog' },
  },
  'finlywealth-lounge-access-cards': {
    url: '/best-credit-cards/lounge-access',
    finlywealthRedirect: { placement: 'lounge-access-cards' },
  },
  'finlywealth-aeroplan-cards': {
    url: '/best-credit-cards/aeroplan',
    finlywealthRedirect: { placement: 'aeroplan-cards' },
  },
  'finlywealth-priority-pass-guide': {
    url: '/blog/credit-cards/priority-pass',
    finlywealthRedirect: { placement: 'priority-pass-guide' },
  },
  'finlywealth-amex-platinum': {
    url: '/credit-cards/reviews/amex-platinum',
    finlywealthRedirect: { placement: 'amex-platinum' },
  },
  'finlywealth-amex-aeroplan-reserve': {
    url: '/credit-cards/reviews/amex-aeroplan-reserve',
    finlywealthRedirect: { placement: 'amex-aeroplan-reserve' },
  },
  'finlywealth-td-aeroplan-vip': {
    url: '/credit-cards/reviews/td-aeroplan-visa-infinite-privilege',
    finlywealthRedirect: { placement: 'td-aeroplan-vip' },
  },
  'finlywealth-cibc-aeroplan-vip': {
    url: '/credit-cards/reviews/cibc-aeroplan-visa-infinite-privilege',
    finlywealthRedirect: { placement: 'cibc-aeroplan-vip' },
  },
  'finlywealth-rbc-avion-vip': {
    url: '/credit-cards/reviews/rbc-avion-visa-infinite-privilege',
    finlywealthRedirect: { placement: 'rbc-avion-vip' },
  },
  'finlywealth-scotia-passport': {
    url: '/credit-cards/reviews/scotia-passport-visa-infinite',
    finlywealthRedirect: { placement: 'scotia-passport' },
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
  // FinlyWealth interactive tools — destination pages, not embeds.
  'finlywealth-quiz': {
    url: '/credit-cards/quiz',
    finlywealthRedirect: { placement: 'quiz' },
  },
  'finlywealth-combos-calculator': {
    url: '/credit-cards/combos-calculator',
    finlywealthRedirect: { placement: 'combos-calculator' },
  },
  'finlywealth-rewards-calculator-index': {
    url: '/credit-cards',
    finlywealthRedirect: { placement: 'rewards-calc-index' },
  },
}

/**
 * Construct a tracked link to FinlyWealth's side-by-side comparison page for
 * any two cards. URL pattern verified against
 * `/credit-cards/side-by-side/amex-cobalt-vs-amex-gold` — deterministic, so
 * we build these on demand without registering each pair individually.
 *
 *   sideBySide('amex-platinum', 'amex-aeroplan-reserve')
 */
export function sideBySide(cardA: string, cardB: string): string {
  const placement = `side-by-side-${cardA}-vs-${cardB}`.replace(/[^a-z0-9-]/g, '-')
  return buildFinlywealthUrl(`/credit-cards/side-by-side/${cardA}-vs-${cardB}`, placement)
}

/**
 * Tracked link to FinlyWealth's per-program points value calculator.
 *
 *   pointsCalculator('aeroplan')
 */
export function pointsCalculator(programSlug: string): string {
  const placement = `points-calc-${programSlug}`.replace(/[^a-z0-9-]/g, '-')
  return buildFinlywealthUrl(`/points-calculator/${programSlug}`, placement)
}

/**
 * Tracked link to FinlyWealth's per-card rewards calculator.
 *
 *   rewardsCalculator('amex-aeroplan-reserve')
 */
export function rewardsCalculator(cardSlug: string): string {
  const placement = `rewards-calc-${cardSlug}`.replace(/[^a-z0-9-]/g, '-')
  return buildFinlywealthUrl(`/credit-cards/rewards-calculator/${cardSlug}`, placement)
}

/**
 * Build the outbound URL for an affiliate destination. If the program's ID
 * has not been set yet, the plain URL still works — the affiliate parameters
 * simply get skipped (no broken link, no `?tag=undefined`).
 */
export function affiliate(key: AffiliateKey): string {
  const entry = REGISTRY[key]
  if (!entry) return '#'
  if (entry.finlywealthRedirect) {
    return buildFinlywealthUrl(entry.url, entry.finlywealthRedirect.placement)
  }
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
  if (!entry) return false
  if (entry.finlywealthRedirect) return !!process.env.NEXT_PUBLIC_AFF_FINLYWEALTH
  return !!(entry.envVar && process.env[entry.envVar])
}

/**
 * Standard rel attributes for any monetized outbound link — sponsored + nofollow
 * covers both Google's compensation-disclosure guidance and safety.
 */
export const AFFILIATE_REL = 'sponsored nofollow noopener'
