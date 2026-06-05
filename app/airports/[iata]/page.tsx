import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getWeather } from '@/lib/weather'
import LoungeCard from '@/components/LoungeCard'
import WeatherWidget from '@/components/WeatherWidget'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Airport, Lounge } from '@/lib/types'

interface Props { params: Promise<{ iata: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { iata } = await params
  const code = iata.toUpperCase()
  return {
    title: `${code} Airport Lounges`,
    description: `Find and review every airport lounge at ${code}. Access info, hours, amenities, and real traveller reviews.`,
  }
}

export const revalidate = 300

export default async function AirportPage({ params }: Props) {
  const { iata } = await params
  const code     = iata.toUpperCase()
  const supabase = await createClient()

  const { data: airport } = await supabase
    .from('airports')
    .select('*')
    .eq('iata_code', code)
    .single()

  if (!airport) notFound()

  const [{ data: lounges }, weather] = await Promise.all([
    supabase
      .from('lounges')
      .select('*, amenities(*), images:lounge_images(*)')
      .eq('airport_id', airport.id)
      .eq('is_active', true)
      .order('rating', { ascending: false }),
    airport.latitude && airport.longitude
      ? getWeather(airport.latitude, airport.longitude)
      : Promise.resolve(null),
  ])

  return (
    <div className="bg-bone-white min-h-screen">

      {/* ── Airport Header ─────────────────────────────────── */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">

            {/* Name + location */}
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-white/10 flex items-center justify-center shrink-0">
                <span className="font-headline-lg text-headline-lg font-bold">{code}</span>
              </div>
              <div>
                <h1 className="font-headline-lg text-headline-lg mb-1">{(airport as Airport).name}</h1>
                <p className="text-primary-fixed/80 text-sm flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                    {airport.city}, {airport.country}
                  </span>
                  {airport.timezone && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span>
                      {airport.timezone}
                    </span>
                  )}
                  {airport.website && (
                    <a href={airport.website} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 hover:text-white transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
                      Airport website
                    </a>
                  )}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Main Content ────────────────────────────────────── */}
      <div className="max-w-container-max mx-auto px-gutter py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Lounges grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline-md text-headline-md text-primary">
                {lounges?.length ?? 0} Lounge{lounges?.length !== 1 ? 's' : ''} at {code}
              </h2>
              <Link href="/lounges" className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest hover:text-primary transition-colors">
                All airports →
              </Link>
            </div>

            {(!lounges || lounges.length === 0) ? (
              <div className="fine-border bg-white p-10 text-center">
                <span className="material-symbols-outlined text-sand-dark text-4xl mb-3 block">local_bar</span>
                <p className="font-medium text-on-surface">No lounges listed yet</p>
                <p className="text-sm text-secondary mt-1">Check back soon or suggest a lounge.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {(lounges as Lounge[]).map(lounge => (
                  <LoungeCard key={lounge.id} lounge={lounge} airportIata={code} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Weather */}
            <WeatherWidget weather={weather} city={airport.city} iata={code} />

            {/* Terminal map link */}
            {airport.terminal_map_url && (
              <div className="bg-white fine-border p-5">
                <h3 className="font-label-caps text-[11px] text-sand-dark uppercase tracking-widest mb-3">
                  Official Terminal Map
                </h3>
                <a
                  href={airport.terminal_map_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary text-white w-full py-3 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>open_in_new</span>
                  View Terminal Map
                </a>
              </div>
            )}

            {/* Access guide */}
            <div className="bg-champagne-glint fine-border p-5">
              <h3 className="font-label-caps text-[11px] text-sand-dark uppercase tracking-widest mb-2">Quick Access Guide</h3>
              <p className="text-xs text-secondary leading-relaxed mb-3">
                Many lounges at {code} accept Priority Pass, DragonPass, and major Canadian credit cards. Check each lounge for specific access rules.
              </p>
              <Link
                href={`/lounges?airport=${code}`}
                className="font-label-caps text-[10px] text-primary uppercase tracking-widest border-b border-primary/20 hover:border-primary transition-all pb-0.5"
              >
                Filter {code} lounges →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
