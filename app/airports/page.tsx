import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CanadaMap, { type AirportMapItem } from '@/components/CanadaMap'

export const metadata: Metadata = {
  title: 'Canadian Airport Lounges by Airport',
  description: 'Find premium airport lounges at every major Canadian airport. Discover Priority Pass, Air Canada Maple Leaf, and independent lounges across Canada.',
  alternates: { canonical: 'https://www.airportlounges.ca/airports' },
  openGraph: {
    title: 'Canadian Airport Lounges by Airport',
    description: 'Find premium airport lounges at every major Canadian airport.',
    url: 'https://www.airportlounges.ca/airports',
    images: ['https://www.airportlounges.ca/opengraph-image'],
  },
}
export const revalidate = 600

// ── Static lookup tables ──────────────────────────────────
const PROVINCE: Record<string, string> = {
  YVR: 'British Columbia',
  YYZ: 'Ontario',
  YTZ: 'Ontario',
  YUL: 'Quebec',
  YYC: 'Alberta',
  YEG: 'Alberta',
  YOW: 'Ontario',
  YWG: 'Manitoba',
  YHZ: 'Nova Scotia',
  YYT: 'Newfoundland & Labrador',
  YXE: 'Saskatchewan',
  YQR: 'Saskatchewan',
  YQB: 'Quebec',
}

const DESCRIPTION: Record<string, string> = {
  YVR: 'A masterclass in airport design, featuring world-renowned Indigenous art and high-luxury lounges.',
  YYZ: "Canada's primary gateway, offering the widest selection of premium lounges in the country.",
  YTZ: 'A convenient downtown Toronto option with Air Canada lounge access for short-haul travellers.',
  YUL: 'Blending European flair with North American efficiency in its diverse lounge portfolio.',
  YYC: 'A modern gateway to the Rockies offering Air Canada, Plaza Premium, and independent lounges.',
  YEG: 'A growing hub for Western Canada with premium Air Canada and international lounge facilities.',
  YOW: "Sophisticated travel amenities at the heart of the nation's capital.",
  YWG: 'A modern prairie gateway with efficient transit lounges and local Canadian flair.',
  YHZ: "Atlantic Canada's primary international hub. Air Canada Maple Leaf Lounge currently closed for renovation (reopening early 2027).",
  YYT: 'Easternmost hub with essential lounges for transatlantic and domestic flyers.',
  YXE: 'Saskatoon John G. Diefenbaker International — serving Saskatchewan with Air Canada lounge access.',
  YQR: 'Regina International — Saskatchewan\'s capital city airport with Air Canada Maple Leaf Lounge.',
  YQB: 'Jean Lesage International — Québec City\'s gateway with growing lounge offerings including an Air Canada Café.',
}

const SB = 'https://ixgbdmrembkrpbkjhtfi.supabase.co/storage/v1/object/public/lounge-images/airports'

const AIRPORT_IMAGE: Record<string, string> = {
  YVR: `${SB}/yvr/hero.jpg`,
  YYZ: `${SB}/yyz/hero.jpg`,
  YTZ: `${SB}/ytz/hero.jpg`,
  YUL: `${SB}/yul/hero.jpg`,
  YEG: `${SB}/yeg/hero.jpg`,
  YYC: `${SB}/yyc/hero.jpg`,
  YOW: `${SB}/yow/hero.jpg`,
  YYT: `${SB}/yyt/hero.jpg`,
  YWG: `${SB}/ywg/hero.jpg`,
  YHZ: `${SB}/yhz/hero.jpg`,
  YXE: `${SB}/yxe/hero.jpg`,
  YQR: `${SB}/yqr/hero.jpg`,
  YQB: `${SB}/yqb/hero.jpg`,
}

const FALLBACK_IMAGE = AIRPORT_IMAGE.YYZ

// ── Data fetch ────────────────────────────────────────────
interface RawLounge {
  id: string
  name: string
  slug: string
  rating: number | null
  is_active: boolean
}

interface RawAirport {
  id: string
  iata_code: string
  name: string
  city: string
  latitude: number | null
  longitude: number | null
  lounges: RawLounge[]
}

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AirportsPage({ searchParams }: Props) {
  const sp      = await searchParams
  const search  = (typeof sp.search  === 'string' ? sp.search  : '').toLowerCase().trim()
  const pFilter = (typeof sp.province === 'string' ? sp.province : '').trim()

  const supabase = await createClient()
  const { data: raw } = await supabase
    .from('airports')
    .select('id, iata_code, name, city, latitude, longitude, lounges:lounges(id, name, slug, rating, is_active)')
    .eq('is_active', true)
    .order('name') as { data: RawAirport[] | null }

  // Build enriched airport list
  const allAirports: AirportMapItem[] = (raw ?? [])
    .filter(a => a.latitude && a.longitude)
    .map(a => {
      const activeLounges = (a.lounges ?? []).filter(l => l.is_active)
      const topLounges = [...activeLounges]
        .sort((x, y) => (y.rating ?? 0) - (x.rating ?? 0))
        .slice(0, 2)
        .map(l => ({ name: l.name, rating: l.rating, slug: l.slug }))

      return {
        iata_code:   a.iata_code,
        name:        a.name,
        city:        a.city,
        province:    PROVINCE[a.iata_code] ?? '',
        latitude:    a.latitude!,
        longitude:   a.longitude!,
        loungeCount: activeLounges.length,
        description: DESCRIPTION[a.iata_code] ?? `Explore premium lounges at ${a.name}.`,
        image:       AIRPORT_IMAGE[a.iata_code] ?? FALLBACK_IMAGE,
        topLounges,
      }
    })
    .sort((a, b) => b.loungeCount - a.loungeCount || a.city.localeCompare(b.city))

  // Unique provinces for the filter dropdown
  const provinces = [...new Set(allAirports.map(a => a.province).filter(Boolean))].sort()

  // Filtered list for the grid
  const filtered = allAirports.filter(a => {
    const matchSearch = !search ||
      a.city.toLowerCase().includes(search) ||
      a.iata_code.toLowerCase().includes(search) ||
      a.name.toLowerCase().includes(search)
    const matchProvince = !pFilter || a.province === pFilter
    return matchSearch && matchProvince
  })

  const totalLounges = allAirports.reduce((s, a) => s + a.loungeCount, 0)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I get into a Canadian airport lounge with a credit card?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Premium travel cards like American Express Platinum, Scotiabank Passport Visa Infinite, and CIBC Aventura Visa Infinite Privilege typically include complimentary Priority Pass or DragonPass memberships. These give you access to most independent lounges across Canada, including Plaza Premium, Aspire, and Desjardins Odyssey lounges.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which airline status gets me into Air Canada Maple Leaf Lounges?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Air Canada Altitude members at 35K, 50K, 75K, Super Elite 100K, and Million Mile levels receive complimentary Maple Leaf Lounge access. Star Alliance Gold members from partner airlines also qualify on international itineraries with a Star Alliance carrier.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is Priority Pass and how does it work at Canadian airports?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Priority Pass is a global lounge membership program with 1,500+ partner lounges worldwide, including Plaza Premium and most independent operators at Canadian airports. Standard, Standard Plus, and Prestige tiers offer different visit allowances. Many premium credit cards include a complimentary Priority Pass membership.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I buy a day pass to a Canadian airport lounge?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Most independent lounges in Canada — including Plaza Premium, Aspire, and Desjardins Odyssey — sell walk-in day passes. Prices typically range from $45 to $85 CAD per visit. Some lounges offer reduced rates if you book online in advance.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: '560px' }}>
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={AIRPORT_IMAGE.YYZ}
          alt="Canadian airport terminal"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-aviation-navy/70" />

        <div className="relative z-10 max-w-container-max mx-auto px-gutter py-32 flex flex-col items-center text-center">
          <span className="font-label-caps text-label-caps text-champagne-glint mb-4">
            AIRPORT LOUNGES ACROSS CANADA
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-bone-white mb-6 leading-tight max-w-3xl">
            Navigate Canada&apos;s<br />Lounge Network
          </h1>
          <p className="font-body-lg text-bone-white/75 mb-12 max-w-xl leading-relaxed">
            {allAirports.length} airports &bull; {totalLounges} premium lounges reviewed and verified
          </p>

          {/* Search form */}
          <form
            action="/airports"
            method="GET"
            className="w-full max-w-3xl bg-bone-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 flex flex-col md:flex-row items-stretch gap-2"
          >
            <div className="flex-1 flex items-center px-4 gap-3 bg-white/90 rounded py-3">
              <span className="material-symbols-outlined text-primary text-xl shrink-0">search</span>
              <input
                name="search"
                type="text"
                defaultValue={search}
                placeholder="Search by city or airport code…"
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-on-surface placeholder:text-secondary/60 text-sm"
              />
            </div>
            <div className="flex-1 flex items-center px-4 gap-3 bg-white/90 rounded py-3">
              <span className="material-symbols-outlined text-primary text-xl shrink-0">map</span>
              <select
                name="province"
                defaultValue={pFilter}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-on-surface text-sm appearance-none cursor-pointer"
              >
                <option value="">All Provinces</option>
                {provinces.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-primary text-bone-white px-10 py-3 font-label-caps text-label-caps hover:bg-primary/90 transition-all rounded whitespace-nowrap"
            >
              SEARCH HUBS
            </button>
          </form>
        </div>
      </section>

      {/* ── Interactive Map ───────────────────────────────── */}
      <section className="py-section-gap bg-bone-white">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="mb-12">
            <span className="font-label-caps text-label-caps text-primary block mb-3">
              INTERACTIVE MAP
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-3">
              Navigate Canada&apos;s Airport Network
            </h2>
            <p className="text-secondary font-body-md max-w-2xl">
              Click any airport pin to preview lounges. Every major hub with verified lounge data is shown below.
            </p>
          </div>

          <CanadaMap airports={allAirports} />
        </div>
      </section>

      {/* ── Airport Directory ─────────────────────────────── */}
      <section className="py-section-gap bg-secondary-fixed">
        <div className="max-w-container-max mx-auto px-gutter">

          {/* Section header */}
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <span className="font-label-caps text-label-caps text-primary block mb-3">
                AIRPORT DIRECTORY
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary">
                Explore All Airports
              </h2>
              {(search || pFilter) && (
                <p className="text-secondary text-sm mt-2">
                  Showing {filtered.length} of {allAirports.length} airports
                  {pFilter && <span> in <strong>{pFilter}</strong></span>}
                  {search && <span> matching &ldquo;{search}&rdquo;</span>}
                  {' — '}
                  <Link href="/airports" className="text-primary underline underline-offset-2">
                    Clear filters
                  </Link>
                </p>
              )}
            </div>
            <p className="text-secondary text-sm">
              {allAirports.length} airports &bull; {totalLounges} lounges
            </p>
          </div>

          {/* Airport cards grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(airport => (
                <Link
                  key={airport.iata_code}
                  href={`/airports/${airport.iata_code}`}
                  className="group bg-bone-white border border-sand-dark/10 rounded-2xl overflow-hidden editorial-shadow hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-[16/10]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={airport.image}
                      alt={airport.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-aviation-navy/60 via-transparent to-transparent" />

                    {/* Province badge */}
                    <div className="absolute top-4 left-4 bg-bone-white/90 backdrop-blur-sm px-3 py-1.5 rounded-sm">
                      <span className="font-label-caps text-[9px] text-primary uppercase tracking-widest">
                        {airport.province}
                      </span>
                    </div>

                    {/* IATA code overlay */}
                    <div className="absolute bottom-4 left-4">
                      <span className="font-display text-4xl text-bone-white/90 font-bold leading-none">
                        {airport.iata_code}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-headline-md text-primary mb-2 leading-snug">
                      {airport.name}
                    </h3>
                    <p className="text-secondary text-sm leading-relaxed mb-5 flex-1">
                      {airport.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-sand-dark/10">
                      <span className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-sm" style={{ fontSize: '16px' }}>door_open</span>
                        <span className="font-label-caps text-label-caps">
                          {airport.loungeCount} Lounge{airport.loungeCount !== 1 ? 's' : ''}
                        </span>
                      </span>
                      <span className="font-label-caps text-label-caps text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        Explore
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <span className="material-symbols-outlined text-sand-dark mb-4 block" style={{ fontSize: '48px' }}>
                flight_land
              </span>
              <p className="font-headline-md text-primary mb-2">No airports found</p>
              <p className="text-secondary mb-6">Try a different search or clear your filters.</p>
              <Link
                href="/airports"
                className="inline-block bg-primary text-bone-white px-8 py-3 font-label-caps text-label-caps hover:opacity-90 transition-all"
              >
                VIEW ALL AIRPORTS
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Access Methods ────────────────────────────────── */}
      <section className="py-section-gap bg-bone-white">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-14">
            <span className="font-label-caps text-label-caps text-primary block mb-3">
              ACCESS OPTIONS
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-4">
              How to Get Into Canadian Lounges
            </h2>
            <p className="text-secondary font-body-md max-w-2xl mx-auto">
              Most Canadian airport lounges can be accessed through one of these four methods.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: 'credit_card',
                title: 'Credit Card',
                desc: 'Premium travel cards like Amex Platinum, Scotiabank Passport Visa, and CIBC Aventura often include Priority Pass or DragonPass memberships.',
              },
              {
                icon: 'airplane_ticket',
                title: 'Airline Status',
                desc: "Air Canada Altitude members (35K and above) receive complimentary Maple Leaf Lounge access. Star Alliance Gold also qualifies at partner lounges.",
              },
              {
                icon: 'badge',
                title: 'Membership',
                desc: 'Priority Pass, DragonPass, and Mastercard Airport Experiences (LoungeKey) provide multi-network access across all Canadian airports.',
              },
              {
                icon: 'sell',
                title: 'Day Pass',
                desc: 'Walk-in day passes are available at most independent lounges. Prices range from $45–$85 CAD. Check individual lounge pages for current rates.',
              },
            ].map(item => (
              <div
                key={item.title}
                className="bg-secondary-fixed border border-sand-dark/10 rounded-2xl p-8 flex flex-col gap-4"
              >
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontSize: '32px', fontVariationSettings: "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <h3 className="font-headline-md text-primary">{item.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Verified-data CTA (replaces newsletter for launch) ──── */}
      <section className="py-section-gap bg-aviation-navy">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="max-w-2xl mx-auto text-center">
            <span className="font-label-caps text-label-caps text-champagne-glint block mb-4">
              EDITORIALLY VERIFIED
            </span>
            <h2 className="font-headline-lg text-headline-lg text-bone-white mb-4">
              Every Lounge. Cross-Referenced. Dated.
            </h2>
            <p className="text-bone-white/65 font-body-md mb-10 leading-relaxed">
              Canadian airport lounges change frequently — new openings, renovations, and access policy updates. We re-verify every listing against operator websites and traveller reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/about#sourcing"
                className="bg-champagne-glint text-aviation-navy px-8 py-3 font-label-caps text-label-caps hover:opacity-90 transition-all whitespace-nowrap"
              >
                HOW WE VERIFY
              </Link>
              <Link
                href="/about#corrections"
                className="border border-bone-white/30 text-bone-white px-8 py-3 font-label-caps text-label-caps hover:bg-white/10 transition-all whitespace-nowrap"
              >
                SUBMIT A CORRECTION
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
