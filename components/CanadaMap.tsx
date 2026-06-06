'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export interface AirportMapItem {
  iata_code: string
  name: string
  city: string
  province: string
  latitude: number
  longitude: number
  loungeCount: number
  description: string
  image: string
  topLounges: { name: string; rating: number | null; slug: string }[]
}

// Singleton promise — prevents loading the Maps script twice
let _mapsPromise: Promise<void> | null = null
function loadGoogleMaps(): Promise<void> {
  if (_mapsPromise) return _mapsPromise
  if (typeof window !== 'undefined' && (window as { google?: { maps?: { Map?: unknown } } }).google?.maps?.Map) {
    _mapsPromise = Promise.resolve()
    return _mapsPromise
  }
  _mapsPromise = new Promise((resolve, reject) => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (!key) { reject(new Error('no key')); return }
    ;(window as unknown as Record<string, unknown>).__googleMapsInit = resolve
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=__googleMapsInit`
    s.async = true
    s.defer = true
    s.onerror = () => reject(new Error('failed to load'))
    document.head.appendChild(s)
  })
  return _mapsPromise
}

export default function CanadaMap({ airports }: { airports: AirportMapItem[] }) {
  const mapDivRef   = useRef<HTMLDivElement>(null)
  const mapObjRef   = useRef<google.maps.Map | null>(null)
  const markersRef  = useRef<Map<string, google.maps.Marker>>(new Map())
  const [selected, setSelected]   = useState(airports[0]?.iata_code ?? '')
  const [mapReady, setMapReady]   = useState(false)
  const [mapError, setMapError]   = useState(false)

  const panel = airports.find(a => a.iata_code === selected) ?? airports[0]

  // Initialize map once on mount
  useEffect(() => {
    if (!mapDivRef.current || airports.length === 0) return
    let cancelled = false

    loadGoogleMaps()
      .then(() => {
        if (cancelled || !mapDivRef.current) return

        const map = new google.maps.Map(mapDivRef.current, {
          center: { lat: 58, lng: -96 },
          zoom: 4,
          mapTypeId: 'roadmap',
          restriction: {
            latLngBounds: { north: 84, south: 40, east: -48, west: -146 },
            strictBounds: false,
          },
          styles: [
            { elementType: 'geometry',            stylers: [{ color: '#eef2f7' }] },
            { elementType: 'labels.text.fill',    stylers: [{ color: '#546e7a' }] },
            { elementType: 'labels.text.stroke',  stylers: [{ color: '#f5f5f5' }] },
            { featureType: 'water',               elementType: 'geometry', stylers: [{ color: '#b3cde3' }] },
            { featureType: 'road',                stylers: [{ visibility: 'simplified' }] },
            { featureType: 'poi',                 stylers: [{ visibility: 'off' }] },
            { featureType: 'transit',             stylers: [{ visibility: 'off' }] },
            { featureType: 'landscape.natural',   elementType: 'geometry', stylers: [{ color: '#f0ede8' }] },
            { featureType: 'administrative.country',  elementType: 'geometry.stroke', stylers: [{ color: '#003434' }, { weight: 1.5 }] },
            { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#b0bec5' }, { weight: 0.7 }] },
          ],
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        })
        mapObjRef.current = map

        airports.forEach(airport => {
          const marker = new google.maps.Marker({
            map,
            position: { lat: airport.latitude, lng: airport.longitude },
            label: {
              text: airport.iata_code,
              color: '#ffffff',
              fontSize: '9px',
              fontWeight: '700',
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#003434',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 16,
            },
            title: `${airport.name} (${airport.iata_code})`,
            zIndex: 1,
          })

          marker.addListener('click', () => {
            setSelected(airport.iata_code)
          })

          markersRef.current.set(airport.iata_code, marker)
        })

        setMapReady(true)
      })
      .catch(() => { if (!cancelled) setMapError(true) })

    return () => { cancelled = true }
  }, [airports])

  // Update marker styles whenever selection changes
  useEffect(() => {
    if (!mapReady) return
    markersRef.current.forEach((marker, iata) => {
      const isSelected = iata === selected
      marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: isSelected ? '#c8a96e' : '#003434',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: isSelected ? 3 : 2,
        scale: isSelected ? 20 : 16,
      })
      marker.setZIndex(isSelected ? 100 : 1)
    })

    // Pan map to selected airport
    const airport = airports.find(a => a.iata_code === selected)
    if (airport && mapObjRef.current) {
      mapObjRef.current.panTo({ lat: airport.latitude, lng: airport.longitude })
    }
  }, [selected, mapReady, airports])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

      {/* ── Map container ────────────────────────────────────── */}
      <div className="lg:col-span-8 relative rounded-2xl overflow-hidden bg-bone-white border border-sand-dark/20 aspect-[16/10] shadow-sm">
        {mapError ? (
          // Fallback static Canada map
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="https://lh3.googleusercontent.com/aida/AP1WRLsUS-GcXyoY8Eh-Su1o24LyZd5N9U0pPtbWSQstorfA3wwWSt3UNCHLQw_F0WMLiGLueBIvy6JSbT3c70HM7Sx27fOotzhpusCWVHIlw271EDguHtpp0k4805C8E1cOQfEkoYrghh4SKBIbey9A_jTMLJ4hSBV9tFotXkhbpV_hlM_bcqocT0OMFbw4kgBjngN9CNiHsFXJpLrQPELtY6NoyY-KDHSVWqXB6BZcLDSRrgEciuurzmOBVndi"
            alt="Map of Canada"
            className="w-full h-full object-cover"
          />
        ) : (
          <div ref={mapDivRef} className="w-full h-full" />
        )}
      </div>

      {/* ── Detail panel ─────────────────────────────────────── */}
      <div className="lg:col-span-4" id="map-detail-panel">
        {panel && (
          <div className="bg-surface-container-low border border-sand-dark/10 rounded-2xl overflow-hidden flex flex-col shadow-sm">
            <div className="h-56 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={panel.image}
                alt={panel.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
            <div className="p-8 flex flex-col">
              <span className="font-label-caps text-label-caps text-primary mb-2">Featured Hub</span>
              <h3 className="font-headline-lg text-headline-lg text-primary mb-4">
                {panel.city} ({panel.iata_code})
              </h3>
              <p className="font-body-md text-secondary mb-6 leading-relaxed text-sm">
                {panel.description}
              </p>

              {panel.topLounges.length > 0 && (
                <div className="space-y-3 mb-6">
                  {panel.topLounges.slice(0, 2).map(lounge => (
                    <Link
                      key={lounge.slug}
                      href={`/airports/${panel.iata_code}/lounges/${lounge.slug}`}
                      className="flex items-center justify-between p-4 bg-white rounded border border-sand-dark/10 shadow-sm hover:border-primary/30 transition-all"
                    >
                      <span className="font-label-caps text-label-caps text-on-surface text-[10px]">
                        {lounge.name}
                      </span>
                      {lounge.rating && (
                        <span className="text-primary font-bold text-sm">
                          {lounge.rating.toFixed(1)} ★
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              <Link
                href={`/airports/${panel.iata_code}`}
                className="inline-block border-b border-primary text-primary font-label-caps text-label-caps pb-1 w-fit hover:border-b-2 transition-all"
              >
                VIEW ALL {panel.loungeCount} LOUNGE{panel.loungeCount !== 1 ? 'S' : ''}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
