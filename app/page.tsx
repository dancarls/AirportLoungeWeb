import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LoungeCard from '@/components/LoungeCard'
import AirportSearchSelect from '@/components/AirportSearchSelect'
import { Plane, Star, MapPin, ShieldCheck } from 'lucide-react'
import type { Lounge, Airport } from '@/lib/types'

export const revalidate = 300

async function getData() {
  const supabase = await createClient()

  const [{ data: airports }, { data: topLounges }] = await Promise.all([
    supabase.from('airports').select('id, name, iata_code, city, country').eq('is_active', true).order('name'),
    supabase.from('lounges').select(`
      *, airport:airports(name, iata_code, city),
      amenities(*),
      images:lounge_images(*)
    `).eq('is_active', true).not('rating', 'is', null).order('rating', { ascending: false }).limit(6),
  ])

  return { airports: airports ?? [], topLounges: topLounges ?? [] }
}

export default async function HomePage() {
  const { airports, topLounges } = await getData()

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
            <Plane className="w-4 h-4" /> Canada's airport lounge directory
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Find the perfect lounge<br />before your flight
          </h1>
          <p className="text-brand-200 text-lg mb-10 max-w-2xl mx-auto">
            Real reviews, up-to-date access info, amenity details, and live flight tracking — all in one place.
          </p>

          {/* Search bar */}
          <AirportSearchSelect airports={airports as Airport[]} />
        </div>
      </section>

      {/* Quick airport links */}
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap gap-2 justify-center">
          {(airports as Airport[]).slice(0, 8).map(a => (
            <Link
              key={a.id}
              href={`/airports/${a.iata_code}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-brand-50 hover:text-brand-700 text-sm text-gray-600 border border-gray-100 transition-colors"
            >
              <MapPin className="w-3 h-3" /> {a.iata_code}
            </Link>
          ))}
          <Link href="/airports" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-sm text-gray-500 border border-gray-100 transition-colors">
            View all →
          </Link>
        </div>
      </section>

      {/* Top-rated lounges */}
      {topLounges.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Top-rated lounges</h2>
              <p className="text-gray-500 mt-1">Highest rated lounges across Canada, based on verified reviews</p>
            </div>
            <Link href="/lounges" className="text-sm text-brand-600 hover:underline font-medium">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(topLounges as Lounge[]).map(lounge => (
              <LoungeCard key={lounge.id} lounge={lounge} airportIata={lounge.airport?.iata_code} />
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Everything you need before you fly</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: 'Know before you go', desc: 'See exactly which credit cards, airline status levels, and memberships get you into each lounge — no surprises.' },
              { icon: Star,        title: 'Real traveller reviews', desc: 'Sub-ratings for food, cleanliness, WiFi, and staff. Filter by access type to find reviews from people like you.' },
              { icon: Plane,       title: 'Live flight status', desc: 'Check your gate, terminal, and any delays right from the lounge page — powered by AeroDataBox real-time data.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
