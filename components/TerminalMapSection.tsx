'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'

interface LoungePin {
  id: string
  name: string
  slug: string
  terminal: string | null
  rating: number | null
  review_count: number
  guest_fee: number | null
  guest_fee_currency: string
}

interface AirportData {
  iata_code: string
  name: string
  city: string
  latitude: number | null
  longitude: number | null
  terminal_map_url: string | null
  lounges: LoungePin[]
}

interface Props { airports: AirportData[] }

// Singleton loader — prevents double-loading the script
let mapsPromise: Promise<void> | null = null

function loadGoogleMaps(): Promise<void> {
  if (mapsPromise) return mapsPromise
  if (typeof window !== 'undefined' && window.google?.maps) {
    mapsPromise = Promise.resolve()
    return mapsPromise
  }
  mapsPromise = new Promise((resolve, reject) => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (!key) { reject(new Error('No Google Maps key')); return }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async`
    script.async = true
    script.defer = true
    script.onload  = () => resolve()
    script.onerror = () => reject(new Error('Google Maps failed to load'))
    document.head.appendChild(script)
  })
  return mapsPromise
}

// Spread markers slightly so they don't stack on top of each other
function spreadPos(lat: number, lng: number, i: number, total: number) {
  if (total <= 1) return { lat, lng }
  const angle  = (i / total) * 2 * Math.PI
  const spread = 0.0014
  return { lat: lat + Math.sin(angle) * spread, lng: lng + Math.cos(angle) * spread }
}

export default function TerminalMapSection({ airports }: Props) {
  const valid = airports.filter(a => a.latitude && a.longitude)
  const [selectedIata, setSelectedIata] = useState(valid[0]?.iata_code ?? '')
  const [error, setError] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef        = useRef<google.maps.Map | null>(null)
  const markersRef    = useRef<google.maps.Marker[]>([])
  const infoRef       = useRef<google.maps.InfoWindow | null>(null)

  const airport = valid.find(a => a.iata_code === selectedIata) ?? valid[0]

  const buildMap = useCallback(async () => {
    if (!containerRef.current || !airport?.latitude || !airport?.longitude) return

    try {
      await loadGoogleMaps()
    } catch {
      setError(true)
      return
    }

    // Clear existing markers
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []
    infoRef.current?.close()

    const center = { lat: airport.latitude, lng: airport.longitude }

    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(containerRef.current, {
        center,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit.station.airport', elementType: 'geometry', stylers: [{ color: '#e9edff' }] },
        ],
      })
      infoRef.current = new google.maps.InfoWindow({ maxWidth: 240 })
    } else {
      mapRef.current.setCenter(center)
      mapRef.current.setZoom(17)
    }

    const map  = mapRef.current
    const info = infoRef.current!
    const total = airport.lounges.length

    airport.lounges.forEach((lounge, i) => {
      const pos = spreadPos(airport.latitude!, airport.longitude!, i, total)

      const marker = new google.maps.Marker({
        position: pos,
        map,
        title: lounge.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor:    '#003434',
          fillOpacity:  1,
          strokeColor:  '#ffffff',
          strokeWeight: 2.5,
          scale:        9,
        },
        label: {
          text: lounge.terminal ? `T${lounge.terminal}` : '✦',
          color: '#ffffff',
          fontSize: '9px',
          fontWeight: '700',
        },
        animation: google.maps.Animation.DROP,
      })

      marker.addListener('click', () => {
        info.setContent(`
          <div style="padding:12px 14px;font-family:Inter,sans-serif;">
            <p style="font-weight:700;color:#003434;font-size:13px;margin:0 0 4px;">${lounge.name}</p>
            ${lounge.terminal ? `<p style="font-size:11px;color:#675d4f;margin:0 0 4px;">📍 Terminal ${lounge.terminal}</p>` : ''}
            ${lounge.rating
              ? `<p style="font-size:11px;color:#A68D74;margin:0 0 4px;">★ ${lounge.rating.toFixed(1)} &nbsp;·&nbsp; ${lounge.review_count} review${lounge.review_count !== 1 ? 's' : ''}</p>`
              : `<p style="font-size:11px;color:#A68D74;margin:0 0 4px;">No reviews yet — be first</p>`}
            ${lounge.guest_fee ? `<p style="font-size:11px;color:#675d4f;margin:0 0 8px;">Day pass $${lounge.guest_fee} ${lounge.guest_fee_currency}</p>` : ''}
            <a href="/airports/${airport.iata_code}/lounges/${lounge.slug}"
              style="display:block;background:#003434;color:#fff;text-align:center;padding:8px 12px;
                     font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;
                     text-decoration:none;margin-top:10px;">
              View Lounge →
            </a>
          </div>
        `)
        info.open({ anchor: marker, map })
      })

      markersRef.current.push(marker)
    })
  }, [airport])

  useEffect(() => {
    buildMap()
  }, [buildMap])

  if (!airport) return null

  return (
    <section className="py-section-gap bg-secondary-fixed">
      <div className="max-w-container-max mx-auto px-gutter">

        {/* Header */}
        <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Terminal Navigation</h2>
            <p className="text-secondary">
              Interactive airport maps — zoom in to see indoor terminal floor plans. Click any pin to view lounge details.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {valid.map(a => (
              <button
                key={a.iata_code}
                onClick={() => setSelectedIata(a.iata_code)}
                className={`px-5 py-2.5 text-sm font-medium transition-all ${
                  selectedIata === a.iata_code
                    ? 'bg-primary text-white'
                    : 'bg-white/70 text-primary hover:bg-white'
                }`}
              >
                {a.iata_code} — {a.city}
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="editorial-shadow overflow-hidden relative" style={{ height: '480px' }}>
          <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary-fixed">
              <div className="text-center">
                <span className="material-symbols-outlined text-sand-dark text-4xl mb-3 block">map_off</span>
                <p className="text-sm text-secondary">Map unavailable — check your Google Maps API key.</p>
              </div>
            </div>
          )}
        </div>

        {/* Lounge chips + CTAs */}
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
            {airport.lounges.length === 0 && (
              <p className="text-sm text-secondary/60">No lounges listed for {airport.iata_code} yet.</p>
            )}
          </div>

          <div className="flex gap-3 flex-wrap">
            {airport.terminal_map_url && (
              <a
                href={airport.terminal_map_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>open_in_new</span>
                Official Terminal Map
              </a>
            )}
            <Link
              href={`/airports/${airport.iata_code}`}
              className="flex items-center gap-2 fine-border bg-white text-primary px-5 py-2.5 font-label-caps text-[10px] uppercase tracking-widest hover:bg-champagne-glint transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_forward</span>
              All {airport.iata_code} Lounges
            </Link>
          </div>
        </div>

        <p className="text-xs text-secondary/50 mt-3 text-center">
          Indoor floor plans appear automatically when you zoom in — available where Google has airport data. Pin positions are approximate.
        </p>
      </div>
    </section>
  )
}
