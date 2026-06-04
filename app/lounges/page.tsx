import { createClient } from '@/lib/supabase/server'
import LoungeCard from '@/components/LoungeCard'
import LoungeFilters from '@/components/LoungeFilters'
import { Suspense } from 'react'
import type { Lounge } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'All Airport Lounges' }
export const revalidate = 300

interface Props {
  searchParams: Promise<{ airport?: string; sort?: string }>
}

export default async function LoungesPage({ searchParams }: Props) {
  const { airport, sort = 'rating' } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('lounges')
    .select('*, airport:airports(name, iata_code, city), amenities(*), images:lounge_images(*)')
    .eq('is_active', true)

  if (airport) {
    const { data: airportRow } = await supabase
      .from('airports').select('id').eq('iata_code', airport).single()
    if (airportRow) query = query.eq('airport_id', airportRow.id)
  }

  if (sort === 'rating') query = query.order('rating', { ascending: false, nullsFirst: false })
  else if (sort === 'reviews') query = query.order('review_count', { ascending: false })
  else query = query.order('name')

  const { data: lounges } = await query.limit(50)

  const { data: airports } = await supabase
    .from('airports').select('iata_code, name').eq('is_active', true).order('name')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Lounges</h1>
          <p className="text-gray-500 mt-1">{lounges?.length ?? 0} lounges across Canada</p>
        </div>
      </div>

      <Suspense>
        <LoungeFilters
          airports={airports ?? []}
          currentAirport={airport ?? ''}
          currentSort={sort}
        />
      </Suspense>

      {(!lounges || lounges.length === 0) ? (
        <div className="text-center py-20 text-gray-400">
          <p className="font-medium">No lounges found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(lounges as Lounge[]).map(lounge => (
            <LoungeCard key={lounge.id} lounge={lounge} airportIata={lounge.airport?.iata_code} />
          ))}
        </div>
      )}
    </div>
  )
}
