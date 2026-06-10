import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import LoungeGrid from '@/components/LoungeGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Canadian Airport Lounges | Filter by Pass, Airline & Amenity',
  description: 'Browse every airport lounge in Canada. Filter by Priority Pass, DragonPass, Air Canada Altitude, credit card, amenity, or airport. Updated daily.',
  alternates: { canonical: 'https://www.airportlounges.ca/lounges' },
}
export const revalidate = 300

export default async function LoungesPage() {
  const supabase = await createClient()

  const [{ data: lounges }, { data: airports }] = await Promise.all([
    supabase
      .from('lounges')
      .select('*, airport:airports(name, iata_code, city), amenities(*), images:lounge_images(*)')
      .eq('is_active', true)
      .order('name'),
    supabase
      .from('airports')
      .select('iata_code, name')
      .eq('is_active', true)
      .order('name'),
  ])

  const datasetLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Canadian Airport Lounges Directory',
    description: `A verified, regularly updated directory of ${lounges?.length ?? 0} airport lounges across ${airports?.length ?? 0} major Canadian airports — including access requirements (Priority Pass, DragonPass, Air Canada Altitude, credit cards, day passes), amenities, opening hours, terminal/gate locations, and traveller reviews.`,
    url: 'https://www.airportlounges.ca/lounges',
    keywords: [
      'airport lounge', 'Canada', 'Priority Pass', 'DragonPass',
      'Air Canada Maple Leaf Lounge', 'Plaza Premium', 'Aspire Lounge',
      'Desjardins Odyssey', 'lounge access', 'credit card lounge',
    ],
    creator: {
      '@type': 'Organization',
      name: 'AirportLounges.ca',
      url: 'https://www.airportlounges.ca',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AirportLounges.ca',
      url: 'https://www.airportlounges.ca',
    },
    isAccessibleForFree: true,
    license: 'https://www.airportlounges.ca/terms',
    spatialCoverage: { '@type': 'Country', name: 'Canada' },
    distribution: [
      { '@type': 'DataDownload', encodingFormat: 'text/html', contentUrl: 'https://www.airportlounges.ca/lounges' },
      { '@type': 'DataDownload', encodingFormat: 'application/xml', contentUrl: 'https://www.airportlounges.ca/sitemap.xml' },
      { '@type': 'DataDownload', encodingFormat: 'text/plain', contentUrl: 'https://www.airportlounges.ca/llms.txt' },
    ],
  }

  return (
    <div className="bg-bone-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }} />
      {/* Page header */}
      <div className="bg-primary text-white py-12">
        <div className="max-w-container-max mx-auto px-gutter">
          <h1 className="font-headline-lg text-headline-lg mb-2">All Lounges</h1>
          <p className="text-primary-fixed/80 font-body-md">
            {lounges?.length ?? 0} lounges across Canada — filter by airport, access pass, amenity, or availability.
          </p>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-gutter py-10">
        <Suspense fallback={
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-sand-dark animate-spin block mb-3" style={{ fontSize: '32px' }}>progress_activity</span>
            <p className="text-secondary">Loading lounges…</p>
          </div>
        }>
          <LoungeGrid
            lounges={lounges ?? []}
            airports={airports ?? []}
          />
        </Suspense>
      </div>
    </div>
  )
}
