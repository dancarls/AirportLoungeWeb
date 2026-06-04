import FlightStatusWidget from '@/components/FlightStatusWidget'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plane } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Flight Status' }

export default async function FlightsPage() {
  const supabase = await createClient()
  const { data: airports } = await supabase
    .from('airports').select('iata_code, name, city').eq('is_active', true).order('name')

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Plane className="w-7 h-7 text-brand-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Flight Status</h1>
        <p className="text-gray-500">Check your flight's real-time status, gate, and delay info while relaxing in the lounge.</p>
      </div>

      <FlightStatusWidget />

      <div className="mt-10">
        <h2 className="font-semibold text-gray-900 mb-4">Departures by airport</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {airports?.map(a => (
            <Link
              key={a.iata_code}
              href={`/airports/${a.iata_code}`}
              className="card p-3 text-center hover:border-brand-200 transition-colors"
            >
              <p className="font-bold text-brand-700 text-lg">{a.iata_code}</p>
              <p className="text-xs text-gray-500">{a.city}</p>
            </Link>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-8">
        Flight data powered by AeroDataBox via RapidAPI. Updates every 60 seconds.
      </p>
    </div>
  )
}
