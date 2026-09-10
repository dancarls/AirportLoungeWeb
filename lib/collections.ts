import type { Lounge, Amenity, AccessType } from './types'

/**
 * Curated lounge collections rendered at `/lounges/<slug>`.
 *
 * Each entry is one indexable landing page that captures a specific search
 * intent: "airport lounge with shower Canada", "24 hour airport lounge Toronto",
 * "airport lounge day pass", etc.
 *
 * The `filter` predicate is applied server-side to a single Supabase read of
 * all active lounges, so adding new collections requires no schema changes and
 * no additional queries — just append a definition here and it's live.
 */

type LoungeWithRelations = Lounge & {
  amenities?: Pick<Amenity, 'id' | 'name'>[]
}

export interface Collection {
  /** URL segment — must match the `[collection]` param. */
  slug: string
  /** Visible page H1. */
  h1: string
  /** Editorial intro paragraph — rendered under the H1 for both readers and AI Overview extraction. */
  intro: string
  /** <title> — targeted for search snippet. */
  metaTitle: string
  /** <meta name="description">. */
  metaDescription: string
  /** Primary SEO keyword(s) the page targets — used for internal analytics + subheadings. */
  targetKeywords: string[]
  /** Predicate applied to the full active-lounge set to build this collection. */
  filter: (l: LoungeWithRelations) => boolean
  /** Structured Q&A rendered under the lounge grid + emitted as FAQPage schema. */
  faqs: { question: string; answer: string }[]
}

function amenityMatch(l: LoungeWithRelations, keywords: string[]): boolean {
  const names = (l.amenities ?? []).map(a => a.name.toLowerCase())
  return keywords.some(k => names.some(n => n.includes(k.toLowerCase())))
}

function hasDayPassAccess(l: LoungeWithRelations): boolean {
  if (l.guest_fee != null) return true
  const accessTypes = (l.access_types ?? []) as AccessType[]
  return accessTypes.some(at =>
    at.type === 'day_pass' ||
    /day pass|walk[- ]in|walk[- ]up/i.test(at.name)
  )
}

function is24Hours(l: LoungeWithRelations): boolean {
  return l.opening_hours?.is_24_7 === true
}

function acceptsAccessName(l: LoungeWithRelations, needles: string[]): boolean {
  const accessTypes = (l.access_types ?? []) as AccessType[]
  return accessTypes.some(at =>
    needles.some(n =>
      at.name.toLowerCase().includes(n.toLowerCase()) ||
      (at.details ?? '').toLowerCase().includes(n.toLowerCase())
    )
  )
}

export const COLLECTIONS: Collection[] = [
  {
    slug: 'with-showers',
    h1: 'Canadian Airport Lounges with Showers',
    intro: 'Every airport lounge in Canada with a shower on-site — from the limestone rain-shower suites at the Cathay Pacific Lounge YVR to the standard shower rooms at Plaza Premium across every major Canadian hub. Filter by airport and access type below.',
    metaTitle: 'Canadian Airport Lounges with Showers (2026): Every Location',
    metaDescription: 'Every Canadian airport lounge with shower access on-site — YYZ, YVR, YUL, YYC, YEG and more. Filter by access pass and check availability before you fly.',
    targetKeywords: ['airport lounge with shower canada', 'shower lounge yyz', 'shower lounge yvr'],
    filter: l => amenityMatch(l, ['shower']),
    faqs: [
      {
        question: 'Which Canadian airport lounges have showers?',
        answer: 'Showers are available at Plaza Premium lounges across YYZ, YVR, YUL, YEG, YWG, and YOW; at both Air Canada Maple Leaf Lounge International locations (YYZ and YVR); at the Cathay Pacific Lounge YVR; at the SkyTeam Lounge YVR; and at the WestJet Elevation Lounges in YYC and YVR. Some lounges include shower access in standard entry; a small number charge an additional shower surcharge on top of lounge entry.',
      },
      {
        question: 'Do I need to book a shower slot in advance?',
        answer: 'Most Canadian lounges operate showers on a first-come basis — request at the reception desk on arrival. During peak international departure banks (typically 15:00–19:00 at YVR and YYZ) there can be a 20–40 minute wait for a shower suite. Arriving 30 minutes earlier avoids the wait entirely.',
      },
      {
        question: 'Are shower amenities included with a Priority Pass entry?',
        answer: 'At most Priority Pass Canadian lounges, yes — shower access is part of standard entry. The Plaza Premium Lounge YVR International is a documented exception: PP entry covers lounge access but a shower surcharge of approximately $25 CAD applies. Confirm at the reception desk on arrival.',
      },
      {
        question: 'What toiletries and towels are provided?',
        answer: 'All showered Canadian lounges provide fresh towels. Toiletries vary: Cathay Pacific YVR uses Aesop products; SkyTeam Lounge YVR uses full-size shampoo/conditioner/body wash; Plaza Premium lounges typically provide branded amenity kits. Amex Centurion Lounges are US-only.',
      },
    ],
  },
  {
    slug: 'quiet-workspace',
    h1: 'Canadian Airport Lounges for Quiet Work',
    intro: 'The Canadian airport lounges built for productive work — power at every seat, dedicated focus zones, quiet rooms, and business centres. Purpose-built for laptop workers, remote employees, and consulting travellers between meetings.',
    metaTitle: 'Best Canadian Airport Lounges for Quiet Work (2026)',
    metaDescription: 'The Canadian airport lounges with dedicated quiet rooms, business centres, and power at every seat — YYZ, YVR, YYC, YOW. For remote workers and business travellers.',
    targetKeywords: ['quiet lounge yyz', 'airport lounge for working', 'business lounge canada'],
    filter: l => amenityMatch(l, ['quiet', 'business centre', 'business center', 'meeting rooms', 'charging stations']),
    faqs: [
      {
        question: 'Which Canadian airport lounge has the best Wi-Fi for working?',
        answer: 'The Air Canada Maple Leaf Lounge International at Toronto Pearson (YYZ) runs a fully dedicated network separate from the airport public Wi-Fi, consistently clocked around 100 Mbps. The Air Canada Café at YVR Gate C50 uses the same infrastructure and adds power at every seat — the strongest single work environment in Canada.',
      },
      {
        question: 'Which Canadian lounges have enforced quiet zones?',
        answer: 'Only three Canadian lounges enforce genuine cell-free quiet zones: the Air Canada Maple Leaf Lounges at YYZ International and YVR International, plus a smaller focus space at the WestJet Elevation Lounge YYC. All three actually police the policy rather than only posting signs.',
      },
      {
        question: 'Are there lounges with private meeting rooms in Canadian airports?',
        answer: 'Yes. The WestJet Elevation Lounges at YYC and YVR both include private meeting rooms available on request. The Air Canada Signature Suite YYZ has a private meeting nook available for Signature Class passengers only. Aspire Salon Lounge YOW has conference facilities — unusual for a Priority Pass lounge.',
      },
      {
        question: 'Which Canadian lounge has power at every seat?',
        answer: 'The Air Canada Café at YVR Gate C50, opened April 2026, is the only Canadian lounge purpose-built with an AC outlet and USB-C laptop charging at every single seat. The Gate C46/C47 café has the same setup. Both require an Aeroplan premium credit card or Aeroplan Elite status.',
      },
    ],
  },
  {
    slug: 'day-pass',
    h1: 'Canadian Airport Lounges with Walk-in Day Pass',
    intro: 'Every Canadian airport lounge that sells a walk-in day pass — no membership, no elite status, no premium ticket required. Just walk up, pay, and enter, capacity permitting.',
    metaTitle: 'Canadian Airport Lounges with Walk-in Day Passes (2026)',
    metaDescription: 'Every Canadian airport lounge selling a walk-in day pass — YYZ, YVR, YUL, YYC and more. Prices, capacity policies, and how to buy.',
    targetKeywords: ['day pass airport lounge', 'airport lounge passes', 'walk in airport lounge canada'],
    filter: hasDayPassAccess,
    faqs: [
      {
        question: 'How much does an airport lounge day pass cost in Canada?',
        answer: 'Walk-in day passes at Canadian airport lounges typically cost $45–$75 CAD. Plaza Premium day passes generally run $45–$59 CAD depending on airport and duration. WestJet Elevation Lounge day passes are $59 CAD + GST with a WestJet boarding pass or $65 CAD + GST with any other airline. Air Canada Maple Leaf Lounges do not sell walk-in day passes at any location.',
      },
      {
        question: 'Can I buy an airport lounge day pass online before I fly?',
        answer: 'Yes. Plaza Premium, Aspire, and WestJet Elevation all accept online pre-booking through their operator websites or via the Priority Pass and DragonPass apps. Pre-booking guarantees entry when capacity would otherwise turn walk-ins away.',
      },
      {
        question: 'Do all Canadian airport lounges sell day passes?',
        answer: 'No. Air Canada Maple Leaf Lounges and the Air Canada Signature Suite do not sell walk-in day passes at any location — access requires an eligible ticket, status, or credit card. Cathay Pacific Lounge YVR is oneworld-only. Desjardins Odyssey lounges at YUL require DragonPass or a Desjardins-issued card.',
      },
      {
        question: 'Which is cheaper — a day pass or a Priority Pass membership?',
        answer: 'For occasional users (fewer than 3 lounge visits per year), a walk-in day pass is cheaper. For 4+ visits per year, a Priority Pass Standard membership ($99 USD/yr plus per-visit fees) or a credit card that bundles Priority Pass Select as a benefit (Amex Platinum, Amex Aeroplan Reserve) becomes more cost-effective per visit.',
      },
    ],
  },
  {
    slug: 'with-sleep-pods',
    h1: 'Canadian Airport Lounges with Sleep Pods & Nap Areas',
    intro: 'The Canadian airport lounges designed for rest — day beds, sleeping pods, individual reclining chairs, and dedicated rest zones. For overnight layovers, red-eye recoveries, and long transatlantic connections.',
    metaTitle: 'Canadian Airport Lounges with Sleep Pods & Nap Areas (2026)',
    metaDescription: 'Every Canadian airport lounge with sleep pods, day beds, or dedicated rest zones — where to nap between flights at YYZ, YVR, YUL, YYC.',
    targetKeywords: ['airport lounge with sleeping pods', 'nap lounge yyz', 'sleep pod airport canada'],
    filter: l => amenityMatch(l, ['sleeping pods', 'sleep', 'nap']),
    faqs: [
      {
        question: 'Where can I sleep at a Canadian airport between flights?',
        answer: 'The Plaza Premium Lounge International at YVR is open 24 hours and is the only Priority Pass–accessible option for overnight layovers in Canada. The Cathay Pacific Lounge YVR has individual Solus Chair reclining pods designed for pre-flight rest. Sleep pods are also available at the Plaza Premium First lounge at YVR.',
      },
      {
        question: 'Are there any 24-hour airport lounges in Canada?',
        answer: 'The Plaza Premium Lounge International at YVR is currently the only Canadian airport lounge open 24 hours a day, every day. All other major Canadian lounges follow airline or Priority Pass operator hours, typically 05:00–23:00.',
      },
      {
        question: 'Which credit cards give access to airport lounges with sleep facilities?',
        answer: 'Priority Pass Select — bundled with Amex Platinum, Amex Aeroplan Reserve, and several other Canadian premium credit cards — unlocks the Plaza Premium International 24-hour lounge at YVR. The Cathay Pacific Lounge is not accessible on any credit card and requires a Cathay/oneworld ticket or status.',
      },
    ],
  },
  {
    slug: 'family-friendly',
    h1: 'Family-Friendly Canadian Airport Lounges',
    intro: 'The Canadian airport lounges with dedicated family zones, kids areas, and family-appropriate amenities. Where to bring children between flights without feeling like you\'re in the way.',
    metaTitle: 'Family-Friendly Canadian Airport Lounges (2026)',
    metaDescription: 'Every Canadian airport lounge with a kids area or family-friendly amenities — plus which lounges charge and which are free for children.',
    targetKeywords: ['airport lounge with kids area canada', 'family lounge yyz', 'child friendly airport lounge canada'],
    filter: l => amenityMatch(l, ['kids area', 'family']),
    faqs: [
      {
        question: 'Are children admitted free to airport lounges in Canada?',
        answer: 'It varies by lounge. Most Priority Pass Canadian lounges admit children under 2 free and treat older children as paying guests. Air Canada Maple Leaf Lounges admit immediate family free for Aeroplan 50K+ members. WestJet Elevation Lounges have a dedicated family and children area.',
      },
      {
        question: 'Which Canadian airport lounges have dedicated kids areas?',
        answer: 'The WestJet Elevation Lounges at YYC and YVR both include dedicated family and children zones. Plaza Premium lounges typically do not have separate kids areas but are child-welcoming.',
      },
      {
        question: 'Are the Cathay Pacific and Air Canada Signature Suite lounges child-friendly?',
        answer: 'Both admit children as accompanying guests, but neither has dedicated kids facilities. The Air Canada Signature Suite is designed for pre-flight fine dining — better suited for older children and adults. The Cathay Pacific Lounge YVR is compact and calm — appropriate for well-behaved children but not designed as a family destination.',
      },
    ],
  },
  {
    slug: 'priority-pass',
    h1: 'Canadian Airport Lounges Accepting Priority Pass',
    intro: 'Every airport lounge in Canada that accepts Priority Pass Select membership — the Amex Platinum, Amex Aeroplan Reserve, Scotiabank Passport, and standalone Priority Pass membership all grant access here.',
    metaTitle: 'Canadian Airport Lounges Accepting Priority Pass (2026)',
    metaDescription: 'Every Canadian airport lounge that accepts Priority Pass — Toronto, Vancouver, Calgary, Montreal and more. Peak hours, guest rules, and what to expect.',
    targetKeywords: ['priority pass lounges canada', 'priority pass yyz', 'priority pass yvr'],
    filter: l => acceptsAccessName(l, ['priority pass']),
    faqs: [
      {
        question: 'How many Canadian airports have Priority Pass lounges?',
        answer: 'Nine Canadian airports currently participate in Priority Pass: Toronto Pearson (YYZ), Toronto Billy Bishop (YTZ), Vancouver (YVR), Calgary (YYC), Montréal (YUL), Ottawa (YOW), Edmonton (YEG), Winnipeg (YWG), and Québec City (YQB).',
      },
      {
        question: 'Which Priority Pass lounge in Canada is the best?',
        answer: 'The SkyTeam Lounge at Vancouver International (YVR) is consistently rated among the top Priority Pass lounges in the world — with made-to-order noodle bar, local BC craft beer on tap, and panoramic runway views. Plaza Premium First at YVR is a strong runner-up.',
      },
      {
        question: 'Can I bring a guest to a Priority Pass lounge in Canada for free?',
        answer: 'It depends on your card. The Amex Aeroplan Reserve permits unlimited free guests. The Amex Platinum Canada permits one free guest per visit as of February 2025. Standalone Priority Pass memberships charge approximately $35 USD per guest per visit.',
      },
    ],
  },
  {
    slug: 'open-24-hours',
    h1: 'Canadian Airport Lounges Open 24 Hours',
    intro: 'The Canadian airport lounges open every hour of every day — for overnight layovers, red-eye arrivals, and transpacific connections when everything else has closed.',
    metaTitle: 'Airport Lounges Open 24 Hours in Canada (2026)',
    metaDescription: 'The Canadian airport lounges open 24 hours a day — where to wait through an overnight layover in comfort.',
    targetKeywords: ['24 hour airport lounge canada', 'overnight lounge yvr', 'all night airport lounge canada'],
    filter: is24Hours,
    faqs: [
      {
        question: 'Are there any 24-hour airport lounges in Canada?',
        answer: 'The Plaza Premium Lounge International at Vancouver (YVR) is currently the only Canadian airport lounge open 24 hours a day, every day of the year. All other Canadian lounges follow airline or Priority Pass operator hours, typically closing at 22:00–23:00.',
      },
      {
        question: 'Can I access a 24-hour airport lounge on Priority Pass?',
        answer: 'Yes — the Plaza Premium International 24-hour lounge at YVR is Priority Pass eligible. Amex Platinum, Amex Aeroplan Reserve, and standalone Priority Pass memberships all grant access. Note the lounge is in the international terminal and requires an international boarding pass.',
      },
    ],
  },
]

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find(c => c.slug === slug)
}

export function allCollectionSlugs(): string[] {
  return COLLECTIONS.map(c => c.slug)
}
