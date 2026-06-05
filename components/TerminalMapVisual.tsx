'use client'

import { useState } from 'react'
import Link from 'next/link'

interface LoungeItem {
  id: string
  name: string
  slug: string
  terminal: string | null
}

interface AirportData {
  iata_code: string
  name: string
  city: string
  latitude: number | null
  longitude: number | null
  terminal_map_url: string | null
  lounges: LoungeItem[]
}

// Pulse dot positions that look natural on an aerial airport image
// Different patterns for different lounge counts
function getPulseDots(count: number): { top: string; left: string }[] {
  const patterns = [
    [{ top: '35%', left: '40%' }],
    [{ top: '30%', left: '35%' }, { top: '55%', left: '62%' }],
    [{ top: '28%', left: '38%' }, { top: '50%', left: '60%' }, { top: '40%', left: '22%' }],
    [{ top: '28%', left: '35%' }, { top: '45%', left: '58%' }, { top: '60%', left: '28%' }, { top: '35%', left: '70%' }],
    [{ top: '25%', left: '30%' }, { top: '40%', left: '55%' }, { top: '58%', left: '25%' }, { top: '35%', left: '72%' }, { top: '65%', left: '55%' }],
  ]
  const idx = Math.min(count - 1, patterns.length - 1)
  return idx < 0 ? [] : patterns[idx]
}

export default function TerminalMapVisual({ airports }: { airports: AirportData[] }) {
  const valid = airports.filter(a => a.latitude && a.longitude)
  const [selected, setSelected] = useState(valid[0]?.iata_code ?? '')

  const airport = valid.find(a => a.iata_code === selected) ?? valid[0]
  if (!airport) return null

  const apiKey  = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
  const mapUrl  = apiKey && airport.latitude && airport.longitude
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${airport.latitude},${airport.longitude}&zoom=15&size=1280x549&scale=2&maptype=hybrid&key=${apiKey}`
    : null

  // Fallback image when no API key
  const fallbackImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsUQPE62JEQ3D3Ex8UH4OlUeO8t89NrJixOZWymGb11WbLKrjITTElKtDrjJGXvjyEE1pj8XAPDphNzoDJDOjCD-Jf8g1dczO257Fmsgas6ZdEP9nnMvrdXB8bySGbPRduPvh4PY7ykVLZ0MkLhQOROra6vHGv4nnfp68UnfhK8qOuza-Mgj8dEyzMBRlZunD_-6hklCG2DiZz20gLUUsJFAQCoQUhVmMD0I6vK8dNb6f1EkuFGLWIVbeEeSsaYPa0lRTBcjFaGrf_'

  const dots = getPulseDots(airport.lounges.length)
  const officialMapUrl = airport.terminal_map_url ?? '#'

  return (
    <section id="terminal-navigation" className="py-section-gap bg-secondary-fixed">
      <div className="max-w-container-max mx-auto px-gutter">

        {/* Header */}
        <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Terminal Navigation</h2>
            <p className="text-secondary">Precision aerial views of terminal layouts and lounge locations.</p>
          </div>
          {/* Airport switcher */}
          <div className="flex gap-2 flex-wrap">
            {valid.map(a => (
              <button
                key={a.iata_code}
                onClick={() => setSelected(a.iata_code)}
                className={`px-6 py-3 text-sm font-medium transition-all ${
                  selected === a.iata_code
                    ? 'bg-primary text-white'
                    : 'bg-white/50 text-primary hover:bg-white'
                }`}
              >
                {a.iata_code}
              </button>
            ))}
          </div>
        </div>

        {/* Map container — exact stitch design */}
        <a
          href={officialMapUrl}
          target="_blank"
          rel="noreferrer"
          className="relative bg-white aspect-[21/9] editorial-shadow overflow-hidden group block"
        >
          {/* Aerial image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={selected}
            src={mapUrl ?? fallbackImg}
            alt={`${airport.name} aerial view`}
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
          />

          {/* Dark gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />

          {/* Pulse lounge markers */}
          {dots.map((dot, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-primary-fixed rounded-full border-2 border-white animate-pulse"
              style={{ top: dot.top, left: dot.left }}
            />
          ))}

          {/* Centre overlay — only visible before hover */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="p-8 bg-bone-white/90 backdrop-blur-lg border border-primary/20 max-w-sm text-center transition-opacity duration-500 group-hover:opacity-0">
              <span className="material-symbols-outlined text-primary mb-4 block" style={{ fontSize: '40px' }}>touch_app</span>
              <h3 className="font-headline-md text-primary mb-2">View Terminal Map</h3>
              <p className="text-sm text-secondary">
                Click to explore gates, quiet zones, and lounge locations at {airport.name}.
              </p>
            </div>
          </div>

          {/* Hover state — revealed CTA */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-3 bg-primary text-white px-8 py-4 editorial-shadow">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>open_in_new</span>
              <span className="font-label-caps text-label-caps uppercase tracking-widest">
                Open Official Terminal Map
              </span>
            </div>
          </div>

          {/* Airport badge */}
          <div className="absolute top-5 left-5 bg-primary text-white px-4 py-2">
            <span className="font-headline-md text-sm font-bold">{airport.iata_code}</span>
            <span className="font-label-caps text-[10px] text-primary-fixed ml-2 uppercase tracking-widest">
              {airport.city}
            </span>
          </div>

          {/* Lounge count badge */}
          {airport.lounges.length > 0 && (
            <div className="absolute bottom-5 right-5 bg-bone-white/90 backdrop-blur px-4 py-2 editorial-shadow">
              <span className="font-label-caps text-[10px] text-primary uppercase tracking-widest">
                {airport.lounges.length} Lounge{airport.lounges.length !== 1 ? 's' : ''} · Click pins to explore
              </span>
            </div>
          )}
        </a>

        {/* Lounge chips below map */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {airport.lounges.map(l => (
              <Link
                key={l.id}
                href={`/airports/${airport.iata_code}/lounges/${l.slug}`}
                className="bg-white fine-border px-4 py-2 text-xs font-medium text-primary hover:bg-champagne-glint transition-all"
              >
                {l.name}
                {l.terminal && <span className="text-sand-dark ml-1 font-normal">T{l.terminal}</span>}
              </Link>
            ))}
          </div>
          <Link
            href={`/airports/${airport.iata_code}`}
            className="flex items-center gap-2 fine-border bg-white text-primary px-5 py-2.5 font-label-caps text-[10px] uppercase tracking-widest hover:bg-champagne-glint transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_forward</span>
            All {airport.iata_code} Lounges
          </Link>
        </div>
      </div>
    </section>
  )
}
