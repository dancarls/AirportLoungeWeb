'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import mapboxgl from 'mapbox-gl'

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

interface Props {
  airports: AirportData[]
}

// Spread pins around airport center so they don't stack
function spreadCoord(lat: number, lng: number, index: number, total: number) {
  if (total <= 1) return { lat, lng }
  const angle   = (index / total) * 2 * Math.PI
  const spread  = 0.0018
  return {
    lat: lat + Math.sin(angle) * spread,
    lng: lng + Math.cos(angle) * spread,
  }
}

export default function TerminalMapSection({ airports }: Props) {
  const validAirports = airports.filter(a => a.latitude && a.longitude)
  const [selectedIata, setSelectedIata] = useState(validAirports[0]?.iata_code ?? 'YYZ')

  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<mapboxgl.Map | null>(null)
  const markersRef   = useRef<mapboxgl.Marker[]>([])
  const popupsRef    = useRef<mapboxgl.Popup[]>([])

  const airport = validAirports.find(a => a.iata_code === selectedIata) ?? validAirports[0]

  const buildMap = useCallback(() => {
    if (!mapContainer.current || !airport?.latitude || !airport?.longitude) return
    if (mapRef.current) mapRef.current.remove()
    markersRef.current = []
    popupsRef.current  = []

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style:     'mapbox://styles/mapbox/satellite-streets-v12',
      center:    [airport.longitude, airport.latitude],
      zoom:      14,
    })
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    mapRef.current = map

    map.on('load', () => {
      const total = airport.lounges.length
      airport.lounges.forEach((lounge, i) => {
        const { lat, lng } = spreadCoord(airport.latitude!, airport.longitude!, i, total)

        // Popup content
        const popup = new mapboxgl.Popup({ offset: 15, closeButton: true, maxWidth: '240px' })
          .setHTML(`
            <div style="padding:14px;font-family:Inter,sans-serif;">
              <p style="font-weight:700;color:#003434;font-size:13px;margin:0 0 4px;">${lounge.name}</p>
              ${lounge.terminal ? `<p style="font-size:11px;color:#675d4f;margin:0 0 6px;">Terminal ${lounge.terminal}</p>` : ''}
              ${lounge.rating ? `<p style="font-size:11px;color:#A68D74;margin:0 0 10px;">★ ${lounge.rating.toFixed(1)} (${lounge.review_count} reviews)</p>` : '<p style="font-size:11px;color:#A68D74;margin:0 0 10px;">No reviews yet</p>'}
              ${lounge.guest_fee ? `<p style="font-size:11px;color:#675d4f;margin:0 0 10px;">Day pass: $${lounge.guest_fee} ${lounge.guest_fee_currency}</p>` : ''}
              <a href="/airports/${selectedIata}/lounges/${lounge.slug}" style="display:block;background:#003434;color:#fff;text-align:center;padding:8px;font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;">
                View Lounge →
              </a>
            </div>
          `)

        // Animated pulsing marker
        const el = document.createElement('div')
        el.className = 'lounge-marker'
        el.style.cssText = `
          width:18px;height:18px;background:#003434;border-radius:50%;
          border:2.5px solid #fff;cursor:pointer;
          box-shadow:0 0 0 0 rgba(0,52,52,0.5);
          animation:pulse 2s infinite;
        `

        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map)

        markersRef.current.push(marker)
        popupsRef.current.push(popup)
      })

      // Inject pulse keyframes once
      if (!document.getElementById('mapbox-pulse-style')) {
        const style = document.createElement('style')
        style.id = 'mapbox-pulse-style'
        style.textContent = `
          @keyframes pulse {
            0%   { box-shadow: 0 0 0 0 rgba(0,52,52,0.5); }
            70%  { box-shadow: 0 0 0 10px rgba(0,52,52,0); }
            100% { box-shadow: 0 0 0 0 rgba(0,52,52,0); }
          }
        `
        document.head.appendChild(style)
      }
    })
  }, [airport, selectedIata])

  useEffect(() => {
    buildMap()
    return () => { mapRef.current?.remove(); mapRef.current = null }
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
              Interactive satellite maps with clickable lounge markers. Tap any pin to see details.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {validAirports.map(a => (
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
        <div className="relative editorial-shadow overflow-hidden" style={{ aspectRatio: '21/9' }}>
          <div ref={mapContainer} className="w-full h-full" />

          {/* Overlay when no lounges */}
          {airport.lounges.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10 pointer-events-none">
              <div className="bg-bone-white/95 p-8 text-center max-w-xs">
                <span className="material-symbols-outlined text-primary text-4xl mb-3 block">location_off</span>
                <p className="text-sm text-secondary">No lounges listed for {airport.iata_code} yet.</p>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-bone-white/90 backdrop-blur px-4 py-2 editorial-shadow flex items-center gap-3">
            <div className="w-3 h-3 bg-primary rounded-full border border-white" />
            <span className="font-label-caps text-[10px] text-primary uppercase tracking-widest">
              {airport.lounges.length} Lounge{airport.lounges.length !== 1 ? 's' : ''} at {airport.iata_code}
            </span>
          </div>
        </div>

        {/* Lounge list + terminal map link */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {airport.lounges.map(l => (
              <Link
                key={l.id}
                href={`/airports/${selectedIata}/lounges/${l.slug}`}
                className="bg-white fine-border px-4 py-2 text-xs font-medium text-primary hover:bg-champagne-glint transition-all"
              >
                {l.name}
                {l.terminal && <span className="text-sand-dark ml-1">T{l.terminal}</span>}
              </Link>
            ))}
          </div>
          <div className="flex gap-3">
            {airport.terminal_map_url && (
              <a
                href={airport.terminal_map_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>map</span>
                Official Terminal Map
              </a>
            )}
            <Link
              href={`/airports/${selectedIata}`}
              className="flex items-center gap-2 fine-border bg-white text-primary px-5 py-2.5 font-label-caps text-[10px] uppercase tracking-widest hover:bg-champagne-glint transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
              All {selectedIata} Lounges
            </Link>
          </div>
        </div>

        <p className="text-xs text-secondary/50 mt-3 text-center">
          Satellite imagery courtesy of Mapbox. Lounge pin positions are approximate — follow airport signage on arrival.
        </p>
      </div>
    </section>
  )
}
