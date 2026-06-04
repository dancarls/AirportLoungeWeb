import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MapPin, Building2 } from 'lucide-react'
import type { Airport } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'All Canadian Airports' }
export const revalidate = 600

export default async function AirportsPage() {
  const supabase = await createClient()

  const { data: airports } = await supabase
    .from('airports')
    .select(`*, lounges:lounges(count)`)
    .eq('is_active', true)
    .order('name')

  const byCity = (airports ?? []).reduce<Record<string, Airport[]>>((acc, a) => {
    const key = a.city
    if (!acc[key]) acc[key] = []
    acc[key].push(a)
    return acc
  }, {})

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Canadian Airports</h1>
        <p className="text-gray-500">{airports?.length ?? 0} airports with lounge information</p>
      </div>

      <div className="space-y-10">
        {Object.entries(byCity).sort(([a],[b]) => a.localeCompare(b)).map(([city, cityAirports]) => (
          <div key={city}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-500" /> {city}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cityAirports.map(airport => (
                <Link
                  key={airport.id}
                  href={`/airports/${airport.iata_code}`}
                  className="card p-5 group flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
                    <span className="text-brand-700 font-bold text-sm">{airport.iata_code}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors text-sm leading-snug mb-1 line-clamp-2">
                      {airport.name}
                    </h3>
                    <p className="text-xs text-gray-400">{airport.city}, {airport.country}</p>
                    <p className="text-xs text-brand-600 mt-1 font-medium flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {(airport as Airport & { lounges?: { count: number }[] }).lounges?.[0]?.count ?? 0} lounge(s)
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
