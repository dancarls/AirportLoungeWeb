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
