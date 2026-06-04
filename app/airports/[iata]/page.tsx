import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoungeCard from '@/components/LoungeCard'
import FlightStatusWidget from '@/components/FlightStatusWidget'
import { MapPin, Globe, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import type { Airport, Lounge } from '@/lib/types'

interface Props { params: Promise<{ iata: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { iata } = await params
  return { title: `${iata.toUpperCase()} Airport Lounges` }
}

export const revalidate = 300

export default async function AirportPage({ params }: Props) {
  const { iata } = await params
  const code = iata.toUpperCase()
  const supabase = await createClient()

  const { data: airport } = await supabase
    .from('airports')
    .select('*')
    .eq('iata_code', code)
    .single()

  if (!airport) notFound()

  const { data: lounges } = await supabase
    .from('lounges')
    .select('*, amenities(*), images:lounge_images(*)')
    .eq('airport_id', airport.id)
    .eq('is_active', true)
    .order('rating', { ascending: false })

  return (
    <div>
      {/* Airport header */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold">{code}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">{(airport as Airport).name}</h1>
              <p className="text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {airport.city}, {airport.country}
                {airport.timezone && <><Clock className="w-4 h-4 ml-2" /> {airport.timezone}</>}
              </p>
              {airport.website && (
                <a href={airport.website} target="_blank" rel="noreferrer"
                  className="text-brand-300 hover:text-brand-200 text-sm mt-2 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Airport website
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lounges */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {lounges?.length ?? 0} Lounge{lounges?.length !== 1 ? 's' : ''} at {code}
            </h2>

            {(!lounges || lounges.length === 0) ? (
              <div className="card p-10 text-center text-gray-400">
                <p className="font-medium">No lounges listed yet</p>
                <p className="text-sm mt-1">Check back soon or suggest a lounge.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {(lounges as Lounge[]).map(lounge => (
                  <LoungeCard key={lounge.id} lounge={lounge} airportIata={code} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: flight status */}
          <div className="space-y-6">
            <FlightStatusWidget />
            {airport.terminal_map_url && (
              <div className="card p-4">
                <h3 className="font-semibold text-sm text-gray-900 mb-3">Terminal Map</h3>
                <a href={airport.terminal_map_url} target="_blank" rel="noreferrer"
                  className="btn-secondary w-full justify-center text-sm">
                  View terminal map →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
