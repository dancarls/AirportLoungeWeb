import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import { INDOOR_COVERED } from '@/lib/mapbox/indoor'
import type { LoungeSummary } from '@/components/AirportLoungeGridFiltered'
import IndoorNavigator from '@/components/IndoorNavigatorLoader'

interface Props { params: Promise<{ iata: string }> }

const SUPABASE_URL = 'https://ixgbdmrembkrpbkjhtfi.supabase.co'

function getPrimaryImageUrl(
  images: { storage_path: string; is_primary: boolean; sort_order: number }[]
): string | null {
  if (!images?.length) return null
  const primary = images.find(i => i.is_primary)
    ?? [...images].sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99))[0]
  return primary
    ? `${SUPABASE_URL}/storage/v1/object/public/lounge-images/${primary.storage_path}`
    : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { iata } = await params
  const code = iata.toUpperCase()
  const supabase = await createClient()
  const { data: airport } = await supabase
    .from('airports')
    .select('name, city')
    .eq('iata_code', code)
    .single()

  const name = airport?.name ?? `${code} Airport`
  const city = airport?.city ?? code
  const hasIndoor = INDOOR_COVERED.has(code)

  return {
    title: `Navigate ${code} — ${hasIndoor ? 'Indoor Lounge Finder' : 'Terminal Map'} | AirportLounges.ca`,
    description: `${hasIndoor ? 'Interactive indoor floor plan' : 'Terminal map'} for ${name}. Locate lounges, view floor layouts, and get walking directions from your gate.`,
    alternates: {
      canonical: `https://airportlounges.ca/airports/${code}/navigate`,
    },
    openGraph: {
      title: `${code} Terminal Navigator | AirportLounges.ca`,
      description: `Find every lounge at ${name} (${code}) with ${hasIndoor ? 'live indoor floor plans' : 'a terminal map'}.`,
      url: `https://airportlounges.ca/airports/${code}/navigate`,
    },
  }
}

export const revalidate = 300

export default async function NavigatePage({ params }: Props) {
  const { iata } = await params
  const code = iata.toUpperCase()
  const supabase = await createClient()

  const { data: airport } = await supabase
    .from('airports')
    .select('*')
    .eq('iata_code', code)
    .single()

  if (!airport || !airport.latitude || !airport.longitude) notFound()

  const { data: rawLounges } = await supabase
    .from('lounges')
    .select(
      'id, name, slug, terminal, location_detail, description, rating, review_count, access_types, updated_at, images:lounge_images(storage_path, is_primary, sort_order)'
    )
    .eq('airport_id', airport.id)
    .eq('is_active', true)
    .order('rating', { ascending: false, nullsFirst: false })

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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://airportlounges.ca' },
      { '@type': 'ListItem', position: 2, name: 'Airports', item: 'https://airportlounges.ca/airports' },
      { '@type': 'ListItem', position: 3, name: code,       item: `https://airportlounges.ca/airports/${code}` },
      { '@type': 'ListItem', position: 4, name: 'Navigate', item: `https://airportlounges.ca/airports/${code}/navigate` },
    ],
  }

  return (
    <div className="flex flex-col bg-bone-white" style={{ height: 'calc(100vh - 80px)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Compact breadcrumb nav */}
      <div className="border-b border-sand-dark/10 bg-bone-white px-4 py-2.5 flex items-center gap-2 text-xs text-secondary shrink-0">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="text-sand-dark">›</span>
        <Link href="/airports" className="hover:text-primary transition-colors">Airports</Link>
        <span className="text-sand-dark">›</span>
        <Link href={`/airports/${code}`} className="hover:text-primary transition-colors">{code}</Link>
        <span className="text-sand-dark">›</span>
        <span className="text-primary font-medium flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>map</span>
          Navigate
        </span>
        {INDOOR_COVERED.has(code) && (
          <span className="ml-auto bg-primary text-white font-label-caps text-[9px] px-2 py-0.5 tracking-widest">
            INDOOR MAPS
          </span>
        )}
      </div>

      <IndoorNavigator
        airport={{
          iata_code:        airport.iata_code,
          name:             airport.name,
          city:             airport.city,
          latitude:         airport.latitude,
          longitude:        airport.longitude,
          terminal_map_url: airport.terminal_map_url,
        }}
        lounges={lounges}
      />
    </div>
  )
}
