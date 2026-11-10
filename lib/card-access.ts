/**
 * Shared card-access data layer for the "Which lounges can I use?" matcher
 * and the "Lounge finder" quiz. Both tools pull from this single source.
 *
 * Each card declares the set of `accessKeys` it grants. Each lounge in the DB
 * has an `access_types` JSON array of `{ name, type, details? }` objects;
 * the matching logic checks whether any of the user's aggregate access keys
 * appear as a case-insensitive substring in any lounge's access-type names.
 */

import type { AffiliateKey } from './affiliates'

export interface Card {
  slug: string
  name: string
  issuer: string
  network: 'amex' | 'visa' | 'mastercard'
  annualFee: number
  welcomeBonus?: string
  affiliateKey: AffiliateKey
  accessKeys: string[]
  blurb: string
}

export const CARDS: Card[] = [
  {
    slug: 'amex-platinum',
    name: 'American Express Platinum',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 799,
    welcomeBonus: 'Up to 100,000 MR points',
    affiliateKey: 'finlywealth-rebate-amex-platinum',
    accessKeys: ['American Express Platinum', 'Amex Platinum', 'Priority Pass'],
    blurb: 'Unlimited Priority Pass + guests, Plaza Premium, Centurion',
  },
  {
    slug: 'amex-business-platinum',
    name: 'Amex Business Platinum',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 799,
    affiliateKey: 'finlywealth-rebate-amex-platinum',
    accessKeys: ['American Express Business Platinum', 'Amex Platinum', 'Priority Pass'],
    blurb: 'Same lounge perks as personal Platinum, business-coded',
  },
  {
    slug: 'amex-aeroplan-reserve',
    name: 'Amex Aeroplan Reserve',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 599,
    welcomeBonus: 'Up to 85,000 Aeroplan points',
    affiliateKey: 'finlywealth-rebate-amex-aeroplan-reserve',
    accessKeys: ['Amex Aeroplan Reserve', 'Aeroplan Premium Co-brand Cards (TD/CIBC/Amex)', 'Priority Pass'],
    blurb: 'Maple Leaf Lounge on same-day AC flights + Priority Pass',
  },
  {
    slug: 'amex-cobalt',
    name: 'Amex Cobalt',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 156,
    welcomeBonus: 'Up to 30,000 MR points',
    affiliateKey: 'finlywealth-rebate-amex-cobalt',
    accessKeys: [],
    blurb: 'No lounge access — top earning card for daily spend',
  },
  {
    slug: 'amex-gold-rewards',
    name: 'Amex Gold Rewards',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 250,
    affiliateKey: 'finlywealth-rebate-amex-gold-rewards',
    accessKeys: [],
    blurb: 'No standalone lounge access in Canada',
  },
  {
    slug: 'td-aeroplan-vip',
    name: 'TD Aeroplan Visa Infinite Privilege',
    issuer: 'TD',
    network: 'visa',
    annualFee: 599,
    welcomeBonus: 'Up to 75,000 Aeroplan points',
    affiliateKey: 'finlywealth-rebate-td-aeroplan-vip',
    accessKeys: ['Eligible Aeroplan Credit Cards', 'Aeroplan Premium Co-brand Cards (TD/CIBC/Amex)', 'Aeroplan Premium Credit Cards'],
    blurb: 'Maple Leaf Lounge access on same-day AC flights',
  },
  {
    slug: 'cibc-aeroplan-vip',
    name: 'CIBC Aeroplan Visa Infinite Privilege',
    issuer: 'CIBC',
    network: 'visa',
    annualFee: 599,
    welcomeBonus: 'Up to 75,000 Aeroplan points',
    affiliateKey: 'finlywealth-rebate-cibc-aeroplan-vip',
    accessKeys: ['CIBC Aeroplan Visa Infinite Privilege', 'Eligible Aeroplan Credit Cards', 'Aeroplan Premium Co-brand Cards (TD/CIBC/Amex)', 'DragonPass'],
    blurb: 'Maple Leaf Lounge + DragonPass visits',
  },
  {
    slug: 'rbc-avion-vip',
    name: 'RBC Avion Visa Infinite Privilege',
    issuer: 'RBC',
    network: 'visa',
    annualFee: 399,
    affiliateKey: 'finlywealth-rebate-rbc-avion-vip',
    accessKeys: ['Priority Pass', 'DragonPass'],
    blurb: 'Priority Pass + DragonPass included',
  },
  {
    slug: 'scotia-passport',
    name: 'Scotiabank Passport Visa Infinite',
    issuer: 'Scotiabank',
    network: 'visa',
    annualFee: 150,
    affiliateKey: 'finlywealth-rebate-scotia-passport',
    accessKeys: ['Priority Pass'],
    blurb: '6 free Priority Pass visits/yr',
  },
  {
    slug: 'bmo-eclipse-infinite-privilege',
    name: 'BMO eclipse Visa Infinite Privilege',
    issuer: 'BMO',
    network: 'visa',
    annualFee: 499,
    affiliateKey: 'finlywealth-rebate-bmo-eclipse-infinite-privilege',
    accessKeys: ['Priority Pass', 'DragonPass'],
    blurb: '4 free Priority Pass visits/yr',
  },
  {
    slug: 'bmo-ascend-we',
    name: 'BMO Ascend World Elite Mastercard',
    issuer: 'BMO',
    network: 'mastercard',
    annualFee: 150,
    affiliateKey: 'finlywealth-lounge-access-cards',
    accessKeys: ['BMO Ascend World Elite Mastercard', 'LoungeKey'],
    blurb: 'LoungeKey access (Plaza Premium network)',
  },
  {
    slug: 'national-bank-we',
    name: 'National Bank World Elite Mastercard',
    issuer: 'National Bank',
    network: 'mastercard',
    annualFee: 150,
    affiliateKey: 'finlywealth-lounge-access-cards',
    accessKeys: ['National Bank World Elite Mastercard', 'DragonPass'],
    blurb: 'National Bank Lounge YUL + DragonPass visits',
  },
  {
    slug: 'desjardins-odyssey-vip',
    name: 'Desjardins Odyssey Visa Infinite Privilege',
    issuer: 'Desjardins',
    network: 'visa',
    annualFee: 180,
    affiliateKey: 'finlywealth-lounge-access-cards',
    accessKeys: ['Desjardins Odyssey Visa Infinite Privilege', 'Desjardins Odyssey World Elite Mastercard', 'Desjardins Odyssey Gold Visa'],
    blurb: 'Desjardins Odyssey Lounge access at YUL',
  },
  {
    slug: 'westjet-rbc-we',
    name: 'WestJet RBC World Elite Mastercard',
    issuer: 'RBC',
    network: 'mastercard',
    annualFee: 119,
    welcomeBonus: '$250 WestJet dollars + companion voucher',
    affiliateKey: 'finlywealth-rebate-westjet-rbc-world-elite',
    accessKeys: ['WestJet Rewards Elite', 'WestJet Rewards Platinum', 'WestJet Business Class'],
    blurb: 'Companion voucher + fast-track WestJet Rewards tier',
  },
  {
    slug: 'priority-pass-standalone',
    name: 'Priority Pass (standalone membership)',
    issuer: 'Priority Pass',
    network: 'visa',
    annualFee: 99,
    affiliateKey: 'priority-pass-membership',
    accessKeys: ['Priority Pass'],
    blurb: 'Direct membership — pay per visit after plan allowance',
  },
]

export interface AirlineStatus {
  slug: string
  name: string
  accessKeys: string[]
  blurb: string
}

export const AIRLINE_STATUSES: AirlineStatus[] = [
  {
    slug: 'star-alliance-gold',
    name: 'Star Alliance Gold (Aeroplan 25K+)',
    accessKeys: ['Star Alliance Gold', 'Aeroplan 50K / 75K / Super Elite', 'Aeroplan 50K+', 'Aeroplan Elite 35K / 50K / 75K / Super Elite 100K'],
    blurb: 'Maple Leaf Lounge access on same-day AC flights + Star Alliance lounges globally',
  },
  {
    slug: 'aeroplan-50k',
    name: 'Aeroplan 50K / 75K / Super Elite',
    accessKeys: ['Aeroplan 50K / 75K / Super Elite', 'Aeroplan 50K+', 'Aeroplan Elite 50K / 75K', 'Air Canada Aeroplan 50K Elite', 'Air Canada Aeroplan 75K Elite', 'Star Alliance Gold'],
    blurb: 'Full Maple Leaf Lounge access + domestic lounges',
  },
  {
    slug: 'skyteam-elite-plus',
    name: 'SkyTeam Elite Plus (Delta Diamond/Platinum, AF/KL Platinum)',
    accessKeys: ['SkyTeam Elite Plus', 'Flying Blue Gold / Platinum'],
    blurb: 'Air France / KLM / SkyTeam lounge access',
  },
  {
    slug: 'oneworld-emerald-sapphire',
    name: 'Oneworld Emerald / Sapphire (AA Executive Platinum+)',
    accessKeys: ['Oneworld Emerald / Sapphire', 'oneworld Emerald', 'oneworld Sapphire', 'AAdvantage Platinum / Platinum Pro / Executive Platinum'],
    blurb: 'Oneworld lounge access (American Admirals Club etc)',
  },
  {
    slug: 'westjet-rewards-elite',
    name: 'WestJet Rewards Elite / Platinum',
    accessKeys: ['WestJet Rewards Elite', 'WestJet Rewards Platinum'],
    blurb: 'WestJet Elevation Lounge access at YYC',
  },
]

export function aggregateAccessKeys(
  cardSlugs: string[],
  statusSlugs: string[] = [],
): Set<string> {
  const keys = new Set<string>()
  for (const slug of cardSlugs) {
    const card = CARDS.find(c => c.slug === slug)
    if (!card) continue
    card.accessKeys.forEach(k => keys.add(k.toLowerCase()))
  }
  for (const slug of statusSlugs) {
    const status = AIRLINE_STATUSES.find(s => s.slug === slug)
    if (!status) continue
    status.accessKeys.forEach(k => keys.add(k.toLowerCase()))
  }
  return keys
}

export interface LoungeAccessType {
  name: string
  type?: 'class_of_service' | 'airline_status' | 'credit_card'
  details?: string
}

export interface MatchableLounge {
  id: string
  name: string
  slug: string
  terminal: string | null
  iata: string
  access_types: LoungeAccessType[] | null
}

/**
 * Check if a lounge is accessible to a user with the given aggregate access keys.
 * Returns the matched access-type name for display, or null.
 */
export function matchLoungeToAccess(
  lounge: MatchableLounge,
  userKeys: Set<string>,
): string | null {
  if (!lounge.access_types || !Array.isArray(lounge.access_types)) return null
  for (const at of lounge.access_types) {
    if (!at.name) continue
    const atName = at.name.toLowerCase()
    for (const userKey of userKeys) {
      if (atName.includes(userKey) || userKey.includes(atName)) {
        return at.name
      }
    }
  }
  return null
}
