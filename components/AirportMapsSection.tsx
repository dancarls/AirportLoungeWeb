import Link from 'next/link'
import { getWeather } from '@/lib/weather'

interface AirportData {
  iata_code: string
  name: string
  city: string
  latitude: number | null
  longitude: number | null
  terminal_map_url: string | null
  lounges: { id: string }[]
}

// Official interactive terminal map URLs for each airport
const OFFICIAL_MAPS: Record<string, string> = {
  YYZ: 'https://www.torontopearson.com/en/airport-information/terminal-maps',
  YVR: 'https://www.yvr.ca/en/passengers/terminal/maps-and-directions',
  YUL: 'https://www.admtl.com/en/map',
  YEG: 'https://www.flyeia.com/departures/maps-and-directions',
  YOW: 'https://www.ottawaairport.ca/passengers/terminal-guide/terminal-maps',
  YWG: 'https://www.waa.ca/flights-and-travel/at-the-airport/airport-maps',
  YYT: 'https://stjohnsairport.com/at-the-airport/maps',
  YTZ: 'https://www.billybishopairport.com/the-airport',
  YYC: 'https://www.yyc.com/en-us/terminal/terminal-maps.html',
  YHZ: 'https://halifaxstanfield.ca/airport/terminal/maps',
}

// Static colours per airport for visual variety
const ACCENT: Record<string, string> = {
  YYZ: 'bg-primary',
  YVR: 'bg-primary',
  YUL: 'bg-primary',
  YEG: 'bg-primary',
  YOW: 'bg-primary',
  YWG: 'bg-primary',
  YYT: 'bg-primary',
  YTZ: 'bg-primary',
}

interface WeatherSnippet {
  iata: string
  temperature: number
  icon: string
  label: string
}

interface Props {
  airports: AirportData[]
  weatherData: WeatherSnippet[]
}

export default function AirportMapsSection({ airports, weatherData }: Props) {
  if (!airports.length) return null

  return (
    <section className="py-section-gap bg-secondary-fixed">
      <div className="max-w-container-max mx-auto px-gutter">

        {/* Header */}
        <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Terminal Navigation</h2>
            <p className="text-secondary max-w-xl">
              Direct links to each airport's official interactive terminal map — gates, concourses, lounges, security, and dining all in one place.
            </p>
          </div>
          <Link
            href="/airports"
            className="font-label-caps text-[11px] text-primary uppercase tracking-widest border-b border-primary/30 hover:border-primary transition-all pb-0.5"
          >
            All airports →
          </Link>
        </div>

        {/* Airport grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {airports.map(airport => {
            const mapUrl      = OFFICIAL_MAPS[airport.iata_code] ?? airport.terminal_map_url
            const weather     = weatherData.find(w => w.iata === airport.iata_code)
            const loungeCount = airport.lounges.length

            return (
              <div key={airport.iata_code} className="bg-white fine-border group overflow-hidden flex flex-col">

                {/* Coloured header */}
                <div className={`${ACCENT[airport.iata_code] ?? 'bg-primary'} px-5 py-4 flex items-center justify-between`}>
                  <div>
                    <p className="font-headline-lg text-headline-lg text-white font-bold leading-none">
                      {airport.iata_code}
                    </p>
                    <p className="font-label-caps text-[10px] text-primary-fixed/80 uppercase tracking-widest mt-0.5">
                      {airport.city}
                    </p>
                  </div>
                  {weather && (
                    <div className="flex items-center gap-1.5 text-white/90">
                      <span className="material-symbols-outlined" style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}>
                        {weather.icon}
                      </span>
                      <span className="font-headline-md text-base font-bold">{weather.temperature}°</span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="px-5 py-4 flex-1 flex flex-col gap-3">
                  <p className="text-xs text-secondary leading-snug line-clamp-2">{airport.name}</p>

                  <div className="flex items-center gap-2 text-xs text-secondary/70">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>local_bar</span>
                    {loungeCount} lounge{loungeCount !== 1 ? 's' : ''} listed
                  </div>

                  {weather && (
                    <p className="font-label-caps text-[9px] text-sand-dark uppercase tracking-wide">
                      {weather.label}
                    </p>
                  )}
                </div>

                {/* CTAs */}
                <div className="px-5 pb-5 flex flex-col gap-2 mt-auto">
                  {mapUrl && (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 bg-primary text-white py-2.5 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>map</span>
                      Terminal Map
                    </a>
                  )}
                  <Link
                    href={`/airports/${airport.iata_code}`}
                    className="flex items-center justify-center gap-2 fine-border text-primary py-2.5 font-label-caps text-[10px] uppercase tracking-widest hover:bg-champagne-glint transition-all"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>local_bar</span>
                    View Lounges
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-secondary/50 mt-8">
          Terminal maps open on each airport's official website. All data verified by airport authorities.
        </p>
      </div>
    </section>
  )
}
