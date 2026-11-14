import { db } from '@/lib/db'
import { cachedRead } from '@/lib/cached-read'
import type { Metadata } from 'next'
import Link from 'next/link'
import AirportMapExplorer from '@/components/AirportMapExplorer'

export const metadata: Metadata = {
  title: 'Canadian Airport Maps — Indoor Navigation',
  description: 'Interactive maps for all major Canadian airports. Select any airport to explore indoor floor plans, locate lounges, and navigate the terminal.',
  alternates: {
    canonical: 'https://www.airportlounges.ca/airports/map',
  },
}

export const revalidate = 600
// No dynamic segment. Stay dynamic so the build does not need Postgres, and
// cache the read so crawler bursts do not each open a connection.
export const dynamic = 'force-dynamic'

interface AirportWithLounges {
  iata_code: string
  name: string
  city: string
  latitude: number
  longitude: number
  terminal_map_url: string | null
  lounges: { id: string }[]
}

export default async function AirportMapPage() {
  let rows: AirportWithLounges[] = []
  try {
    rows = await cachedRead('airport-map', 600, () => db<AirportWithLounges[]>`
      SELECT a.iata_code, a.name, a.city, a.latitude, a.longitude, a.terminal_map_url,
        COALESCE(
          (SELECT json_agg(json_build_object('id', l.id) ORDER BY l.name ASC, l.slug ASC)
           FROM lounges l WHERE l.airport_id = a.id AND l.is_active = true),
          '[]'::json
        ) AS lounges
      FROM airports a
      WHERE a.is_active = true AND a.latitude IS NOT NULL
      ORDER BY a.name ASC, a.iata_code ASC
    `)
  } catch (err) {
    console.error('airport map DB fetch failed', err)
  }
  const valid = rows.filter(
    a => typeof a.latitude === 'number' && typeof a.longitude === 'number'
  )

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
      <h1 className="sr-only">Canadian Airport Maps</h1>
      {/* Breadcrumb / header bar */}
      <div className="border-b border-sand-dark/10 bg-bone-white px-4 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-xs text-secondary">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-sand-dark">›</span>
          <Link href="/airports" className="hover:text-primary transition-colors">Airports</Link>
          <span className="text-sand-dark">›</span>
          <span className="text-primary font-medium flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>public</span>
            All Airport Maps
          </span>
        </div>
        <p className="hidden md:block text-[11px] text-secondary">
          Click any marker to navigate · Gold = Indoor Maps available
        </p>
      </div>

      <AirportMapExplorer airports={valid} />
    </div>
  )
}
