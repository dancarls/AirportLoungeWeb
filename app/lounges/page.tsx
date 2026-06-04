import { createClient } from '@/lib/supabase/server'
import LoungeGrid from '@/components/LoungeGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'All Airport Lounges' }
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
            {lounges?.length ?? 0} lounges across Canada — filter by airport, access type, amenity, or availability.
          </p>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-gutter py-10">
        <LoungeGrid
          lounges={lounges ?? []}
          airports={airports ?? []}
        />
      </div>
    </div>
  )
}
