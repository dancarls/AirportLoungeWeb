import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import AirportMapExplorer from '@/components/AirportMapExplorer'

export const metadata: Metadata = {
  title: 'Canadian Airport Maps — Indoor Navigation | AirportLounges.ca',
  description: 'Interactive maps for all major Canadian airports. Select any airport to explore indoor floor plans, locate lounges, and navigate the terminal.',
  alternates: {
    canonical: 'https://www.airportlounges.ca/airports/map',
  },
}

export const revalidate = 600

export default async function AirportMapPage() {
  const supabase = await createClient()

  const { data: airports } = await supabase
    .from('airports')
    .select('iata_code, name, city, latitude, longitude, terminal_map_url, lounges(id)')
    .eq('is_active', true)
    .not('latitude', 'is', null)
    .order('name')

  const valid = (airports ?? []).filter(
    a => typeof a.latitude === 'number' && typeof a.longitude === 'number'
  ) as {
    iata_code: string
    name: string
    city: string
    latitude: number
    longitude: number
    terminal_map_url: string | null
    lounges: { id: string }[]
  }[]

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
