import { createClient } from '@/lib/supabase/server'
import LoungeCard from '@/components/LoungeCard'
import { Filter } from 'lucide-react'
import type { Lounge } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'All Airport Lounges' }
export const revalidate = 300

interface Props {
  searchParams: Promise<{ airport?: string; amenity?: string; access?: string; sort?: string }>
}

export default async function LoungesPage({ searchParams }: Props) {
  const { airport, amenity, sort = 'rating' } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('lounges')
    .select('*, airport:airports(name, iata_code, city), amenities(*), images:lounge_images(*)')
    .eq('is_active', true)

  if (airport) query = query.eq('airport.iata_code', airport)
  if (sort === 'rating') query = query.order('rating', { ascending: false })
  else if (sort === 'reviews') query = query.order('review_count', { ascending: false })
  else query = query.order('name')

  const { data: lounges } = await query.limit(50)

  const { data: airports } = await supabase
    .from('airports').select('iata_code, name, city').eq('is_active', true).order('name')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Lounges</h1>
          <p className="text-gray-500 mt-1">{lounges?.length ?? 0} lounges across Canada</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <Filter className="w-4 h-4" /> Filter:
        </div>
        <form className="flex flex-wrap gap-3">
          <select name="airport" defaultValue={airport ?? ''} className="input w-auto py-1.5 text-sm"
            onChange={e => {
              const url = new URL(window.location.href)
              if (e.target.value) url.searchParams.set('airport', e.target.value)
              else url.searchParams.delete('airport')
              window.location.href = url.toString()
            }}>
            <option value="">All airports</option>
            {airports?.map(a => (
              <option key={a.iata_code} value={a.iata_code}>{a.iata_code} — {a.name}</option>
            ))}
          </select>
          <select name="sort" defaultValue={sort} className="input w-auto py-1.5 text-sm"
            onChange={e => {
              const url = new URL(window.location.href)
              url.searchParams.set('sort', e.target.value)
              window.location.href = url.toString()
            }}>
            <option value="rating">Sort: Top rated</option>
            <option value="reviews">Sort: Most reviewed</option>
            <option value="name">Sort: A–Z</option>
          </select>
        </form>
      </div>

      {/* Grid */}
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
