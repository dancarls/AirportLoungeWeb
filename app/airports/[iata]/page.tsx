import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getWeather } from '@/lib/weather'
import Link from 'next/link'
import type { Metadata } from 'next'
import AirportLoungeGridFiltered, { type LoungeSummary } from '@/components/AirportLoungeGridFiltered'
import WeatherWidget from '@/components/WeatherWidget'

interface Props { params: Promise<{ iata: string }> }

// ── Static lookups ────────────────────────────────────────
const PROVINCE: Record<string, string> = {
  YVR: 'British Columbia', YYZ: 'Ontario', YTZ: 'Ontario',
  YUL: 'Quebec', YYC: 'Alberta', YEG: 'Alberta',
  YOW: 'Ontario', YWG: 'Manitoba', YHZ: 'Nova Scotia', YYT: 'Newfoundland & Labrador',
}

const HERO_DESCRIPTION: Record<string, string> = {
  YVR: "Canada's gateway to Asia Pacific, serving 26 million passengers annually with world-renowned Indigenous art and a collection of premium lounges across the Domestic, US, and International wings.",
  YYZ: "Canada's primary global gateway and its largest travel hub. Terminal 1 and Terminal 3 each host a curated collection of premium sanctuaries — from Air Canada's Signature Suite to Plaza Premium's panoramic retreats.",
  YTZ: "Downtown Toronto's city-centre airport, offering quick check-in and a quiet Air Canada lounge for short-haul business travellers. Minutes from the Financial District via the ferry.",
  YUL: "Montréal-Trudeau blends French-Canadian culture with international sophistication. Select from Air Canada Maple Leaf and independent lounges across the international and US departure piers.",
  YYC: "Calgary International Airport — the gateway to the Rockies and Alberta's business capital. Serving over 17 million passengers annually with a growing portfolio of premium lounges.",
  YEG: "Edmonton International Airport connects the Prairies to the world. Access premium Air Canada facilities before heading to northern Alberta, the Rockies, or international destinations.",
  YOW: "Ottawa Macdonald-Cartier International Airport — the gateway to the nation's capital. A well-organized facility with solid lounge options for government and business travellers.",
  YWG: "Winnipeg Richardson International Airport — the Prairie gateway. A modern, efficient hub serving the heart of Canada with Air Canada lounge access.",
  YHZ: "Halifax Stanfield International Airport — Atlantic Canada's primary international gateway. Note: the Air Canada Maple Leaf Lounge is currently closed for major renovation, expected to reopen early 2027.",
  YYT: "St. John's International Airport — Canada's easternmost major hub, serving transatlantic routes and domestic travel throughout Newfoundland and Labrador.",
}

const HERO_IMAGE: Record<string, string> = {
  YVR: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXFnLE17iBdV_-CU8Kyip1Y0ksnv_oxgsQxpb9UksaH_B8zHRCwlBT6k8sLx5rokAMyoZP-4d7tebs0e1MZ0ZImTfvfrj-Yx6nRXcKs4_8cOFc2VHodbsdQMEh1s0aEnrLSDw1vJD6eUFQo4YlIICE1SwEnJkXi3BDHPckPQ4IpHcwUIzNw5S04hpCaO_mghJ6a71hLIziVPQCPFa68csyUthMwf1ItKoyJkqjysIF6SnXlYrhSRqTOjTbQLfRzNSKjrFhFr41vSju',
  YYZ: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbovCqE7us0SisaDJHkSxwZMRbTk1sYfZWVlSblUqoNrnJRYSlAlOf_wwqw5NeR8-NMYpVjnbn8kltnapwews_SG3ef4C_njrHFWvAWk4zAuPR0POU89GfrqDO4Lp3efRdPmOoEnYfejoYpNYf0CDPfkWp0TNv73gx0TyawGmGYdwIqWnArvAeA3IWwMXhAHeKuSK81Bv_Lia8G2J4CkqDtoLnP-Sd6O2Y5DR7X6gruual8xC7jbM-f-6OMm76GlU8jDgLrX-KXgIV',
  YTZ: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbovCqE7us0SisaDJHkSxwZMRbTk1sYfZWVlSblUqoNrnJRYSlAlOf_wwqw5NeR8-NMYpVjnbn8kltnapwews_SG3ef4C_njrHFWvAWk4zAuPR0POU89GfrqDO4Lp3efRdPmOoEnYfejoYpNYf0CDPfkWp0TNv73gx0TyawGmGYdwIqWnArvAeA3IWwMXhAHeKuSK81Bv_Lia8G2J4CkqDtoLnP-Sd6O2Y5DR7X6gruual8xC7jbM-f-6OMm76GlU8jDgLrX-KXgIV',
  YUL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFXjz71KK8tpXS2xkgzu2SJYFAlVA5khvLBwxx1qsdqnTR7ePznYSo-tHyd9LLr3VKg77LnVsRmSSS5_zEd6UJJ1fTYBTOCnfj38mM7hI5qqHniAVT8m4c4A58BG60VnAoWdFFTDqZNS-MolrysNWQOtsWrIkZRCmQCs39lEFu8jUuT5QP0Kxe-4e8frx6KE689JjwAtbn7nJcBxzJWe5kcl8_9sliLGyOWzVkzrRfWDXCbGbzfaCPAh2AhTDWmyt2WX5wedovMZgs',
  YYC: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMVqe5uZVkd62eU5zrOH0da2ehRsLgUxPdlWZtDugz-SgFmpqZYFzMSiWhqmavt6slp0IP8ylZfB2Yfe8V3E9-GpdaZnmU4mmUyX4dv7rNKHdwMaVmk6XnXrkx3tDw7RR5FqIrmN8wMzV_4MncYJpfzAS1_7TvtqH6ivQDU23EUyOAz68n40aMcIn3B7JXWX7BqBzvtcJkxSHUqKo5OF-zLHVsM0C90ltlX6jz9cxFFflZzhUEl7BhwKErNbExUu4g2e46rZA7NyrQ',
  YEG: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMVqe5uZVkd62eU5zrOH0da2ehRsLgUxPdlWZtDugz-SgFmpqZYFzMSiWhqmavt6slp0IP8ylZfB2Yfe8V3E9-GpdaZnmU4mmUyX4dv7rNKHdwMaVmk6XnXrkx3tDw7RR5FqIrmN8wMzV_4MncYJpfzAS1_7TvtqH6ivQDU23EUyOAz68n40aMcIn3B7JXWX7BqBzvtcJkxSHUqKo5OF-zLHVsM0C90ltlX6jz9cxFFflZzhUEl7BhwKErNbExUu4g2e46rZA7NyrQ',
  YOW: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZY5JLjcLHfS0lwT-U6IfMTNo7LwttyKULSzANzSEhugDq_ECYvD7_RM08FgljX9oZS5rp1TzfqwHU62m74dKmPIpI7ZClLmXxqrgjRJoDlJ0plh_B-XQHIeYFAc7Q1AUQCsrah2WCgMIWs7RBYlziVidDNPAfZCf6MQBWgpDION5cCF9QwLE4s10G50krpC1Fo0vLXZGxIPggcQXpwsuBlDzFzzF9XKUZkdRTN3xtPaZRyt6MeAJrY6UVTIVzV38NzSPf7qCqCTkp',
  YWG: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBomsxVophU8psS6w_DgjIiYrLxLWC9qPuBrPKVeuB0eJjAM5XDripIxdVae_nByT7iF3-OqUdYvQjXnUuEngTlAfhD_ErHviEg12cU5YreGzo_nXXNofvvgqaZ75H1IJfThDmhah1bI0U7uUcjQRpG9-581jXWwbSxdc9piUcWqgBZ_cUgVXIHkgsUK2mVaExNA0g39IC-FgcQyEFEfuEWMLeXjFNWF8tg8WCYb2yw6jvaqyv6TRgQJmIJlgVJ1ieIqHNhCgS_5Ys',
  YHZ: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZY5JLjcLHfS0lwT-U6IfMTNo7LwttyKULSzANzSEhugDq_ECYvD7_RM08FgljX9oZS5rp1TzfqwHU62m74dKmPIpI7ZClLmXxqrgjRJoDlJ0plh_B-XQHIeYFAc7Q1AUQCsrah2WCgMIWs7RBYlziVidDNPAfZCf6MQBWgpDION5cCF9QwLE4s10G50krpC1Fo0vLXZGxIPggcQXpwsuBlDzFzzF9XKUZkdRTN3xtPaZRyt6MeAJrY6UVTIVzV38NzSPf7qCqCTkp',
  YYT: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGBcRfWNR1hrkH0Oq8U1oDQz2i5rHnFeccdgckHg4UMB6-_E6cz8dAXtyRbd-mpCPacfT4XQff83cvQegLJlKCzFlCoE8vbny94j8xN6mg2ByfATh6qQSsifId8HJJ5irlqVTTI1OUDY7GtCQaA4IlojTjlpdh2wgOH9mqHPqYYsNOfetNiBLR59zK3fbbI9JN7sIF9QrHS9iKhZ6Xc_TWH0xwh9ne2_Y2bls1heUZMa1bLQKmbMM7aoxDPD5i5boYedRmLg2d_hHi',
}

const ACCESS_GUIDE: Record<string, string> = {
  YVR: "International departures are in the main terminal. Domestic and US piers have dedicated Air Canada facilities. Most Plaza Premium lounges accept Priority Pass and DragonPass. Confirm credit-card eligibility with your bank before travelling.",
  YYZ: "Terminal 1 primarily handles Star Alliance (Air Canada) and Terminal 3 handles SkyTeam, Oneworld, and WestJet. Most Plaza Premium lounges at YYZ accept Priority Pass and DragonPass — check your specific card's eligibility before travel.",
  YTZ: "Billy Bishop is a single-concourse airport. The lounge is compact but comfortable, accessible via Air Canada Altitude status or eligible credit cards. No Priority Pass acceptance at this location.",
  YUL: "International and US departure piers have separate lounge facilities. Air Canada Maple Leaf and independent options are available. Many accept Priority Pass with certain credit cards — confirm with your issuer.",
  YYC: "Calgary's terminal has Air Canada and independent lounge options. Most accept Priority Pass and DragonPass. Check individual lounge pages for current access requirements and hours.",
  YEG: "Edmonton airport's lounge facilities are primarily in the international departures zone. Air Canada Altitude members and eligible credit card holders have the widest access.",
  YOW: "Ottawa airport has limited but quality lounge options. The Air Canada Maple Leaf Lounge is the primary facility. Priority Pass and Amex Platinum cardholders may have complimentary access.",
  YWG: "Winnipeg's lounge is in the domestic departures area. Primary access is via Air Canada Altitude status or compatible premium credit cards. Day passes are available.",
  YHZ: "Halifax's Air Canada Maple Leaf Lounge is currently closed for renovation (expected reopen early 2027). Contact Air Canada directly for alternative arrangements during this period.",
  YYT: "St. John's has a small but welcoming lounge in the domestic area. Access via Air Canada Altitude status or eligible credit cards. Day passes available at the door.",
}

const SUPABASE_URL = 'https://ixgbdmrembkrpbkjhtfi.supabase.co'

function getPrimaryImageUrl(images: { storage_path: string; is_primary: boolean; sort_order: number }[]): string | null {
  if (!images || images.length === 0) return null
  const primary = images.find(img => img.is_primary)
    ?? [...images].sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99))[0]
  if (!primary) return null
  return `${SUPABASE_URL}/storage/v1/object/public/lounge-images/${primary.storage_path}`
}

// ── Metadata ──────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { iata } = await params
  const code      = iata.toUpperCase()
  const supabase  = await createClient()
  const { data: airport } = await supabase
    .from('airports').select('name, city').eq('iata_code', code).single()

  const name  = airport?.name ?? `${code} Airport`
  const city  = airport?.city ?? code
  const title = `${city} Airport Lounges (${code}) | AirportLounges.ca`
  const desc  = `Find every premium lounge at ${name} (${code}). Access requirements, amenities, opening hours, and traveller reviews for all ${city} airport lounges.`

  return {
    title,
    description: desc,
    openGraph: {
      title: `${code} Lounges — ${city} | AirportLounges.ca`,
      description: desc,
      url: `https://airportlounges.ca/airports/${code}`,
    },
  }
}

export const revalidate = 300

// ── Page ──────────────────────────────────────────────────
export default async function AirportPage({ params }: Props) {
  const { iata } = await params
  const code      = iata.toUpperCase()
  const supabase  = await createClient()

  const { data: airport } = await supabase
    .from('airports')
    .select('*')
    .eq('iata_code', code)
    .single()

  if (!airport) notFound()

  const [{ data: rawLounges }, weather] = await Promise.all([
    supabase
      .from('lounges')
      .select('id, name, slug, terminal, location_detail, description, rating, review_count, access_types, updated_at, images:lounge_images(storage_path, is_primary, sort_order)')
      .eq('airport_id', airport.id)
      .eq('is_active', true)
      .order('rating', { ascending: false, nullsFirst: false }),
    airport.latitude && airport.longitude
      ? getWeather(airport.latitude, airport.longitude)
      : Promise.resolve(null),
  ])

  const lounges: LoungeSummary[] = (rawLounges ?? []).map(l => ({
    id:             l.id,
    name:           l.name,
    slug:           l.slug,
    terminal:       l.terminal,
    location_detail: l.location_detail ?? null,
    description:    l.description,
    rating:         l.rating,
    review_count:   l.review_count,
    access_types:   l.access_types as LoungeSummary['access_types'],
    updated_at:     l.updated_at ?? null,
    primaryImage:   getPrimaryImageUrl(l.images ?? []),
  }))

  // Unique terminals for the hero badge row
  const terminals = [...new Set(lounges.map(l => l.terminal).filter(Boolean) as string[])].sort()

  const heroImage   = HERO_IMAGE[code]        ?? HERO_IMAGE.YYZ
  const province    = PROVINCE[code]           ?? airport.country
  const heroDesc    = HERO_DESCRIPTION[code]   ?? `Explore premium lounges at ${airport.name}.`
  const accessGuide = ACCESS_GUIDE[code]       ?? `Many lounges at ${code} accept Priority Pass, DragonPass, and major Canadian credit cards. Check each lounge for specific access rules.`

  return (
    <div className="bg-bone-white min-h-screen">

      {/* ── Hero ──────────────────────────────────────────── */}
      <header className="relative w-full flex items-end overflow-hidden" style={{ height: '70vh', minHeight: '500px' }}>
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt={`${airport.name} terminal`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(26,36,47,0.35) 0%, rgba(26,36,47,0.82) 100%)' }} />

        <div className="relative w-full max-w-container-max mx-auto px-gutter pb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">

            {/* Left: name + description */}
            <div className="max-w-3xl">
              <span className="inline-block font-label-caps text-label-caps text-primary-fixed mb-4 tracking-widest bg-primary-container/40 backdrop-blur-sm px-3 py-1">
                {province.toUpperCase()}, CANADA
              </span>
              <h1 className="font-display-lg md:text-display-lg text-display-lg-mobile text-bone-white mb-4 leading-none">
                {airport.name}
              </h1>
              <p className="font-body-lg text-body-lg text-bone-white/75 max-w-2xl leading-relaxed">
                {heroDesc}
              </p>
            </div>

            {/* Right: IATA code + terminal badges */}
            <div className="flex flex-col items-start md:items-end shrink-0">
              <div className="font-display-lg text-display-lg text-bone-white opacity-[0.15] leading-none mb-3">
                {code}
              </div>
              {terminals.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-end">
                  {terminals.map(t => (
                    <span
                      key={t}
                      className="px-3 py-1 border border-bone-white/30 text-bone-white font-label-caps text-label-caps rounded-full backdrop-blur-sm"
                    >
                      T - {t}
                    </span>
                  ))}
                </div>
              )}
              {lounges.length > 0 && (
                <p className="text-bone-white/50 font-label-caps text-[10px] mt-3">
                  {lounges.length} LOUNGE{lounges.length !== 1 ? 'S' : ''} LISTED
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Breadcrumb ────────────────────────────────────── */}
      <div className="bg-secondary-fixed border-b border-sand-dark/10">
        <div className="max-w-container-max mx-auto px-gutter py-3 flex items-center gap-2 text-xs text-secondary">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-sand-dark">›</span>
          <Link href="/airports" className="hover:text-primary transition-colors">Airports</Link>
          <span className="text-sand-dark">›</span>
          <span className="text-primary font-medium">{code}</span>
        </div>
      </div>

      {/* ── Main Grid ─────────────────────────────────────── */}
      <main className="max-w-container-max mx-auto px-gutter py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* ── Left: Lounge grid (client component) ───────── */}
        <div className="lg:col-span-8">
          {lounges.length === 0 ? (
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-8">
                Lounges at {code}
              </h2>
              <div className="border border-sand-dark/20 bg-white p-12 text-center">
                <span className="material-symbols-outlined text-sand-dark text-4xl mb-3 block">local_bar</span>
                <p className="font-medium text-on-surface mb-2">No lounges listed yet</p>
                <p className="text-sm text-secondary">
                  We&apos;re working on adding lounge data for {code}. Check back soon.
                </p>
              </div>
            </div>
          ) : (
            <AirportLoungeGridFiltered lounges={lounges} iata={code} />
          )}
        </div>

        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className="lg:col-span-4 space-y-8">

          {/* Weather */}
          {weather && (
            <div className="bg-surface border border-sand-dark/10 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h4 className="font-label-caps text-label-caps text-sand-dark">CURRENT WEATHER</h4>
                  <p className="font-headline-md text-headline-md text-primary mt-0.5">
                    {airport.city}
                  </p>
                </div>
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontSize: '48px', fontVariationSettings: `'FILL' 1, 'wght' 300`, color: '#003434' }}
                >
                  {weather.icon === 'clear_day' ? 'sunny' : weather.icon}
                </span>
              </div>
              <div className="flex items-end gap-3">
                <span className="font-bold text-primary" style={{ fontSize: '36px', lineHeight: 1 }}>
                  {weather.temperature}°C
                </span>
                <span className="text-secondary pb-1 text-sm">{weather.label}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-sand-dark/10 flex gap-5 text-xs text-secondary">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>air</span>
                  {weather.windSpeed} km/h
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>water_drop</span>
                  {weather.humidity}%
                </span>
              </div>
            </div>
          )}

          {/* Flight status */}
          <div className="bg-surface border border-sand-dark/10 p-6 shadow-sm">
            <h4 className="font-label-caps text-label-caps text-sand-dark mb-4">FLIGHT STATUS</h4>
            <p className="text-sm text-secondary mb-5 leading-relaxed">
              Check live departure and arrival information for {code} on FlightAware, the most reliable source for real-time flight tracking.
            </p>
            <a
              href={`https://www.flightaware.com/live/airport/${code}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-primary text-bone-white py-3 font-label-caps text-label-caps hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>flight</span>
              CHECK LIVE FLIGHTS
            </a>
            {airport.website && (
              <a
                href={airport.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full mt-3 border border-primary/20 text-primary py-3 font-label-caps text-label-caps hover:bg-champagne-glint transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
                AIRPORT WEBSITE
              </a>
            )}
          </div>

          {/* Access guide */}
          <div className="bg-champagne-glint/30 border-l-4 border-sand-dark p-6">
            <h4 className="font-label-caps text-label-caps text-primary mb-3">ACCESS GUIDE</h4>
            <p className="text-sm text-secondary leading-relaxed">
              {accessGuide}
            </p>
          </div>

          {/* Terminal map link */}
          {airport.terminal_map_url && (
            <div className="bg-surface border border-sand-dark/10 p-6 shadow-sm">
              <h4 className="font-label-caps text-label-caps text-sand-dark mb-4">TERMINAL MAP</h4>
              <p className="text-sm text-secondary mb-5">
                View the official terminal map to plan your path to the lounge from check-in and security.
              </p>
              <a
                href={airport.terminal_map_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-primary text-bone-white py-3 font-label-caps text-label-caps hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
                VIEW TERMINAL MAP
              </a>
            </div>
          )}

          {/* Back to all airports */}
          <Link
            href="/airports"
            className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform" style={{ fontSize: '16px' }}>arrow_back</span>
            All Canadian Airports
          </Link>
        </aside>
      </main>

    </div>
  )
}
