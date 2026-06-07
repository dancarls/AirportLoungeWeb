import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import LoungeGrid from '@/components/LoungeGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Canadian Airport Lounges | Filter by Pass, Airline & Amenity',
  description: 'Browse every airport lounge in Canada. Filter by Priority Pass, DragonPass, Air Canada Altitude, credit card, amenity, or airport. Updated daily.',
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

  return (
    <div className="bg-bone-white min-h-screen">
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
