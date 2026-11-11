/**
 * Airport-adjacent hotels per IATA code, hand-curated for AirportLounges.ca's
 * "Where to stay at {IATA}" sections on each airport hub page.
 *
 * Each airport gets 3 picks (budget / mid / premium) to keep the section
 * compact and decision-friendly. All go to Booking.com via the Travelpayouts
 * short link (lib/affiliates.ts → 'booking-airport-hotels').
 *
 * Verification policy: every hotel name must be a real brand/property at or
 * near the airport. Prices change too often to be useful here, so we use
 * price bands ($/$$/$$$) and verify annually.
 */

export type PriceBand = 'budget' | 'mid' | 'premium'

export interface AirportHotel {
  name: string
  distance: string
  priceBand: PriceBand
  highlights: string[]
}

/**
 * Display the price band in UI.
 */
export function priceBandLabel(b: PriceBand): string {
  return b === 'budget' ? '$' : b === 'mid' ? '$$' : '$$$'
}

export const AIRPORT_HOTELS: Record<string, AirportHotel[]> = {
  YVR: [
    {
      name: 'Hampton Inn & Suites Vancouver Airport',
      distance: '5 min free shuttle',
      priceBand: 'budget',
      highlights: ['24/7 shuttle', 'Free breakfast', 'Fitness centre'],
    },
    {
      name: 'Pacific Gateway Hotel at Vancouver Airport',
      distance: '5 min free shuttle · YVR Richmond',
      priceBand: 'mid',
      highlights: ['Airport shuttle', 'Day rooms', 'Restaurant'],
    },
    {
      name: 'Fairmont Vancouver Airport',
      distance: 'On-airport (connected to terminal)',
      priceBand: 'premium',
      highlights: ['Soundproof rooms', 'Day rooms', 'Pool + spa', 'Walk to gates'],
    },
  ],
  YYZ: [
    {
      name: 'Alt Hotel Toronto Pearson Airport',
      distance: 'On-airport (connected to T3 via UP Express)',
      priceBand: 'budget',
      highlights: ['Direct terminal access', 'Modern design', 'Grab-and-go'],
    },
    {
      name: 'Sheraton Gateway Toronto International Airport',
      distance: 'On-airport (connected to T3)',
      priceBand: 'mid',
      highlights: ['Walk to gates', 'Soundproof', 'Pool', 'Day rooms'],
    },
    {
      name: 'Fairmont Toronto Airport Hotel',
      distance: 'On-airport (connected to T1)',
      priceBand: 'premium',
      highlights: ['Direct T1 access', 'Spa', 'Signature lounge', 'Suites'],
    },
  ],
  YUL: [
    {
      name: 'Holiday Inn Montreal-Airport',
      distance: '10 min free shuttle',
      priceBand: 'budget',
      highlights: ['Free shuttle', 'Breakfast', 'Restaurant'],
    },
    {
      name: 'Courtyard by Marriott Montreal Airport',
      distance: '8 min free shuttle',
      priceBand: 'mid',
      highlights: ['24/7 shuttle', 'Pool', 'Fitness centre'],
    },
    {
      name: 'Marriott Montreal Airport',
      distance: 'On-airport (connected to terminal)',
      priceBand: 'premium',
      highlights: ['Direct terminal access', 'Soundproof', 'M Club lounge'],
    },
  ],
  YYC: [
    {
      name: 'Delta Hotels Calgary Airport In-Terminal',
      distance: 'On-airport (connected to terminal)',
      priceBand: 'mid',
      highlights: ['Walk to gates', 'Soundproof rooms', 'Day rooms'],
    },
    {
      name: 'Marriott Calgary Airport In-Terminal',
      distance: 'On-airport (connected to terminal)',
      priceBand: 'premium',
      highlights: ['Direct terminal access', 'M Club lounge', 'Suites'],
    },
    {
      name: 'Hilton Garden Inn Calgary Airport',
      distance: '5 min free shuttle',
      priceBand: 'budget',
      highlights: ['Free shuttle', 'Breakfast available', 'Fitness centre'],
    },
  ],
  YEG: [
    {
      name: 'Renaissance Edmonton Airport Hotel',
      distance: 'On-airport (connected to terminal)',
      priceBand: 'premium',
      highlights: ['Direct terminal access', 'Soundproof', 'Fitness centre'],
    },
    {
      name: 'Hampton Inn & Suites Edmonton International Airport',
      distance: '5 min free shuttle',
      priceBand: 'mid',
      highlights: ['24/7 shuttle', 'Free breakfast', 'Pool'],
    },
    {
      name: 'Holiday Inn Express & Suites Edmonton Airport',
      distance: '5 min free shuttle',
      priceBand: 'budget',
      highlights: ['Free shuttle', 'Breakfast', 'Parking'],
    },
  ],
  YOW: [
    {
      name: 'Alt Hotel Ottawa Airport',
      distance: 'On-airport (connected via skywalk)',
      priceBand: 'mid',
      highlights: ['Skywalk to terminal', 'Modern design', '24/7 grab-and-go'],
    },
    {
      name: 'Hilton Garden Inn Ottawa Airport',
      distance: '5 min free shuttle',
      priceBand: 'budget',
      highlights: ['Free shuttle', 'Breakfast available', 'Fitness centre'],
    },
    {
      name: 'Hampton Inn by Hilton Ottawa Airport',
      distance: '5 min free shuttle',
      priceBand: 'budget',
      highlights: ['24/7 shuttle', 'Free breakfast', 'Pool'],
    },
  ],
  YWG: [
    {
      name: 'Four Points by Sheraton Winnipeg Airport',
      distance: 'On-airport (walk to terminal)',
      priceBand: 'mid',
      highlights: ['Walk to gates', 'Pool', 'Restaurant', 'Day rooms'],
    },
    {
      name: 'Grand Winnipeg Airport Hotel',
      distance: '3 min free shuttle',
      priceBand: 'budget',
      highlights: ['Free shuttle', 'Pool', 'Breakfast available'],
    },
    {
      name: 'Holiday Inn Winnipeg Airport West',
      distance: '8 min free shuttle',
      priceBand: 'budget',
      highlights: ['Free shuttle', 'Restaurant', 'Pool'],
    },
  ],
  YHZ: [
    {
      name: 'Alt Hotel Halifax Airport',
      distance: 'On-airport (connected to terminal)',
      priceBand: 'mid',
      highlights: ['Direct terminal access', 'Modern design', 'Day rooms'],
    },
    {
      name: 'Hampton Inn Halifax Airport',
      distance: '5 min free shuttle',
      priceBand: 'budget',
      highlights: ['24/7 shuttle', 'Free breakfast', 'Fitness centre'],
    },
    {
      name: 'Holiday Inn Express & Suites Halifax Airport',
      distance: '5 min free shuttle',
      priceBand: 'budget',
      highlights: ['Free shuttle', 'Breakfast', 'Pool'],
    },
  ],
  YYT: [
    {
      name: 'Comfort Inn Airport St. Johns',
      distance: '5 min free shuttle',
      priceBand: 'budget',
      highlights: ['Free shuttle', 'Free breakfast', 'Restaurant nearby'],
    },
    {
      name: 'Courtyard by Marriott St. Johns Newfoundland',
      distance: '10 min to airport · Downtown',
      priceBand: 'mid',
      highlights: ['Downtown location', 'Restaurant', 'Fitness centre'],
    },
    {
      name: 'Delta Hotels St. Johns Conference Centre',
      distance: '10 min to airport · Downtown',
      priceBand: 'premium',
      highlights: ['Harbour views', 'Restaurant', 'Spa'],
    },
  ],
  YTZ: [
    {
      name: 'Hotel X Toronto',
      distance: '15 min to ferry',
      priceBand: 'premium',
      highlights: ['Lakefront views', 'Rooftop pool', 'Spa', 'Full fitness'],
    },
    {
      name: 'Delta Hotels Toronto',
      distance: '10 min to ferry · Downtown',
      priceBand: 'mid',
      highlights: ['Downtown core', 'Fitness centre', 'Restaurant'],
    },
    {
      name: 'The Rex Hotel',
      distance: '15 min to ferry · Entertainment District',
      priceBand: 'budget',
      highlights: ['Walkable downtown', 'Live jazz bar', 'Breakfast'],
    },
  ],
  YXE: [
    {
      name: 'Hilton Garden Inn Saskatoon Downtown',
      distance: '15 min to airport · Downtown',
      priceBand: 'mid',
      highlights: ['Downtown location', 'Pool', 'Restaurant'],
    },
    {
      name: 'Hampton Inn & Suites Saskatoon Airport',
      distance: '5 min to airport',
      priceBand: 'budget',
      highlights: ['Near airport', 'Free breakfast', 'Pool'],
    },
    {
      name: 'Delta Hotels Saskatoon Downtown',
      distance: '15 min to airport · Downtown',
      priceBand: 'premium',
      highlights: ['Downtown riverfront', 'Restaurant', 'Fitness centre'],
    },
  ],
  YQR: [
    {
      name: 'Holiday Inn Express & Suites Regina Airport',
      distance: '3 min to airport',
      priceBand: 'budget',
      highlights: ['Near airport', 'Free breakfast', 'Fitness centre'],
    },
    {
      name: 'Hilton Garden Inn Regina',
      distance: '10 min to airport',
      priceBand: 'mid',
      highlights: ['Pool', 'Restaurant', 'Fitness centre'],
    },
    {
      name: 'Delta Hotels Regina',
      distance: '15 min to airport · Downtown',
      priceBand: 'premium',
      highlights: ['Downtown', 'Full spa', 'Restaurant'],
    },
  ],
  YQB: [
    {
      name: 'Hôtel Alt Québec',
      distance: '15 min to airport · Downtown core',
      priceBand: 'mid',
      highlights: ['Modern design', '24/7 grab-and-go', 'Walkable downtown'],
    },
    {
      name: 'Hilton Québec',
      distance: '20 min to airport · Downtown',
      priceBand: 'premium',
      highlights: ['Old Québec views', 'Pool', 'Spa', 'Fine dining'],
    },
    {
      name: 'Holiday Inn Express Québec City-Sainte Foy',
      distance: '10 min to airport',
      priceBand: 'budget',
      highlights: ['Near airport', 'Free breakfast', 'Pool'],
    },
  ],
}
