'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import mapboxgl from 'mapbox-gl'
import type { LoungeSummary } from '@/components/AirportLoungeGridFiltered'

// Extended lounge type used only on the navigate page
export interface NavigatorLounge extends LoungeSummary {
  latitude:      number | null
  longitude:     number | null
  website:       string | null
  phone:         string | null
  opening_hours: Record<string, string> | null
}

interface AirportInfo {
  iata_code:        string
  name:             string
  city:             string
  latitude:         number
  longitude:        number
  terminal_map_url: string | null
}

interface Props {
  airport:  AirportInfo
  lounges:  NavigatorLounge[]
}

// ── Terminal centre coordinates ───────────────────────────────
const TERMINAL_CENTER: Record<string, [number, number]> = {
  YVR: [-123.1752, 49.1944],
  YYZ: [-79.6248, 43.6780],
  YUL: [-73.7410, 45.4706],
  YEG: [-113.5776, 53.3097],
  YOW: [-75.6660, 45.3224],
  YWG: [-97.2390, 49.9096],
  YHZ: [-63.5083, 44.8797],
  YYT: [-52.7519, 47.6186],
  YTZ: [-79.3962, 43.6275],
}

function terminalCenter(airport: AirportInfo): [number, number] {
  return TERMINAL_CENTER[airport.iata_code] ?? [airport.longitude, airport.latitude]
}

function getLoungeCoords(
  lounge:  NavigatorLounge,
  _index:  number,
  _total:  number,
  airport: AirportInfo,
): [number, number] {
  if (lounge.latitude != null && lounge.longitude != null) {
    return [lounge.longitude, lounge.latitude]
  }
  return terminalCenter(airport)
}

// ── Terminal label formatter ──────────────────────────────────
function fmtTerminal(t: string): string {
  const map: Record<string, string> = {
    'international': 'International Terminal',
    'domestic':      'Domestic Terminal',
    'transborder':   'Transborder',
    'us':            'US Departures',
  }
  return map[t.toLowerCase()] ?? `${t} Terminal`
}

// ── Brand pin icons ───────────────────────────────────────────
// Lounges in this map render a brand-specific circular badge instead of the
// generic champagne drop pin. Keys are lounge slugs OR partial slug regexes;
// add new entries as more operators provide approved iconography.
const BRAND_PIN: { match: (slug: string, name: string) => boolean; src: string; size: number }[] = [
  // Air Canada Signature Suite — any IATA
  {
    match: (slug, name) => /signature[- ]?(suite|lounge)/i.test(name) || /signature/i.test(slug),
    src: '/icons/lounges/ac-signature.png',
    size: 56,
  },
  // Air Canada Café / Petit Café — any IATA
  {
    match: (slug, name) =>
      /^(air[- ]canada|ac)[- ](petit[- ])?caf[eé]/i.test(name) ||
      /^(ac|air-canada)-(petit-)?cafe(-|$)/i.test(slug),
    src: '/icons/lounges/ac-cafe.png',
    size: 48,
  },
]

function getBrandPin(slug: string, name: string): { src: string; size: number } | null {
  for (const entry of BRAND_PIN) {
    if (entry.match(slug, name)) return { src: entry.src, size: entry.size }
  }
  return null
}

// ── Lounge map-pin SVG ────────────────────────────────────────
// width/height MUST be explicit — without them browsers default to 300×150px,
// causing the SVG to overflow the marker div and the anchor point to be wrong.
function buildLoungePinSVG(isPremium: boolean, pinW: number, pinH: number): string {
  const fill   = isPremium ? '#9A7020' : '#C9A96E'
  const border = isPremium ? '#F5E0A0' : 'white'
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${pinW}" height="${pinH}" viewBox="0 0 52 64" fill="none" style="display:block">
    <path d="M26 2C13.9 2 4 11.9 4 24c0 12.4 22 40 22 40s22-27.6 22-40C48 11.9 38.1 2 26 2z"
      fill="${fill}" stroke="${border}" stroke-width="2"/>
    <circle cx="35" cy="13" r="5" fill="white"/>
    <rect x="10" y="17" width="5.5" height="19" rx="2.75" fill="white"/>
    <path d="M14.5 21.5 L30 17 L31.5 21 L16 25.5Z" fill="white"/>
    <rect x="10" y="33" width="22" height="5" rx="2.5" fill="white"/>
    <rect x="25" y="22" width="13" height="4" rx="2" fill="white"/>
  </svg>`
}

// ── Hours helpers ─────────────────────────────────────────────
function fmtHour(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const period = h < 12 ? 'AM' : 'PM'
  return `${h % 12 || 12}:${String(m ?? 0).padStart(2, '0')} ${period}`
}

function getTodayHours(hours: Record<string, string> | null): string | null {
  if (!hours) return null
  const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
  const raw  = hours[days[new Date().getDay()]]
  if (!raw || !raw.includes('-')) return null
  const [open, close] = raw.split('-')
  return `${fmtHour(open)} – ${fmtHour(close)}`
}

const ACCESS_LABELS: Record<string, string> = {
  airline_status:   'Airline Status',
  class_of_service: 'Business / First',
  credit_card:      'Credit Card',
  membership:       'Membership',
  day_pass:         'Day Pass',
}

// ── Component ────────────────────────────────────────────────

export default function IndoorNavigator({ airport, lounges }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<mapboxgl.Map | null>(null)
  const markersRef   = useRef<mapboxgl.Marker[]>([])
  const markerMapRef = useRef<Record<string, mapboxgl.Marker>>({})

  const [mapReady,     setMapReady]     = useState(false)
  const [mapError,     setMapError]     = useState<string | null>(null)
  const [activeLounge, setActiveLounge] = useState<string | null>(null)
  const [activeDetail, setActiveDetail] = useState<NavigatorLounge | null>(null)

  // Keep a stable ref to flyToLounge so marker click handlers stay current
  const flyToLoungeRef = useRef<((l: NavigatorLounge) => void) | null>(null)

  // ── Map init ─────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    let started = false
    let loadTimeoutId: ReturnType<typeof setTimeout> | null = null

    const startMap = () => {
      if (started) return
      started = true

      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
      if (!token) {
        setMapError('Mapbox access token is missing. Set NEXT_PUBLIC_MAPBOX_TOKEN in the deployment environment.')
        return
      }
      mapboxgl.accessToken = token

      const [tcLng, tcLat] = terminalCenter(airport)
      const map = new mapboxgl.Map({
        container,
        style:   'mapbox://styles/mapbox/standard',
        center:  [tcLng, tcLat],
        zoom:    16,
        pitch:   0,
        bearing: 0,
        attributionControl: false,
      })
      mapRef.current = map

      map.addControl(new mapboxgl.NavigationControl(), 'top-left')
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')

      map.on('error', (e) => {
        console.error('Mapbox error:', e?.error ?? e)
        setMapError(e?.error?.message ?? 'Failed to load the map.')
      })

      loadTimeoutId = setTimeout(() => {
        setMapError(prev => prev ?? 'Map is taking longer than expected to load. Check your connection or try refreshing.')
      }, 15000)

      map.on('load', () => {
        if (loadTimeoutId) { clearTimeout(loadTimeoutId); loadTimeoutId = null }
        setMapError(null)
        map.resize()
        try {
          map.setConfigProperty('basemap', 'showPointOfInterestLabels', true)
          map.setConfigProperty('basemap', 'showPlaceLabels', true)
          map.setConfigProperty('basemap', 'showTransitLabels', true)
        } catch {}

        setMapReady(true)

        // Build pin markers — no floating popup; detail shows in sidebar on click
        lounges.forEach((lounge, i) => {
          const [lng, lat] = getLoungeCoords(lounge, i, lounges.length, airport)
          const brand = getBrandPin(lounge.slug, lounge.name)

          // Brand badges are circular and anchor at centre; the default drop pin
          // anchors at bottom so its tip touches the lat/lng.
          const isPremium  = /first|platinum|signature|premier/i.test(lounge.name)
          const pinW = brand ? brand.size : (isPremium ? 46 : 40)
          const pinH = brand ? brand.size : Math.round(pinW * (64 / 52))

          // Mapbox writes a `transform: translate(...)` to the marker root every frame to
          // keep it pinned to its lng/lat. Touching `el.style.transform` here (e.g. for hover
          // scaling) wipes that positioning — markers fly to the map's top-left and drift on
          // zoom. So scale a child wrapper instead and leave the root entirely to Mapbox.
          const el = document.createElement('div')
          el.style.cssText = [`width:${pinW}px`, `height:${pinH}px`, 'cursor:pointer'].join(';')
          el.title = lounge.name

          const inner = document.createElement('div')
          if (brand) {
            inner.style.cssText = [
              'width:100%',
              'height:100%',
              'transition:transform 0.15s',
              'transform-origin:center center',
              'filter:drop-shadow(0 3px 5px rgba(0,0,0,0.38))',
              'background:white',
              'border-radius:50%',
              'overflow:hidden',
            ].join(';')
            const img = document.createElement('img')
            img.src = brand.src
            img.alt = lounge.name
            img.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;'
            img.draggable = false
            inner.appendChild(img)
          } else {
            inner.style.cssText = [
              'width:100%',
              'height:100%',
              'transition:transform 0.15s',
              'transform-origin:center bottom',
              'filter:drop-shadow(0 3px 5px rgba(0,0,0,0.38))',
            ].join(';')
            inner.innerHTML = buildLoungePinSVG(isPremium, pinW, pinH)
          }
          el.appendChild(inner)

          el.addEventListener('mouseenter', () => { inner.style.transform = 'scale(1.15)' })
          el.addEventListener('mouseleave', () => { inner.style.transform = '' })
          // Use ref so the click always calls the latest flyToLounge
          el.addEventListener('click', () => flyToLoungeRef.current?.(lounge))

          const marker = new mapboxgl.Marker({
            element: el,
            anchor: brand ? 'center' : 'bottom',
          })
            .setLngLat([lng, lat])
            .addTo(map)

          markersRef.current.push(marker)
          markerMapRef.current[lounge.id] = marker
        })
      })
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      if (width > 0 && height > 0) {
        startMap()
        if (mapRef.current) mapRef.current.resize()
      }
    })
    ro.observe(container)
    const rect = container.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) startMap()

    return () => {
      ro.disconnect()
      if (loadTimeoutId) clearTimeout(loadTimeoutId)
      markersRef.current.forEach(m => m.remove())
      markersRef.current  = []
      markerMapRef.current = {}
      if (mapRef.current) {
        try { mapRef.current.remove() } catch {}
        mapRef.current = null
      }
    }
  }, [airport, lounges])

  // ── Fly to lounge and open sidebar detail ─────────────────
  const flyToLounge = useCallback((lounge: NavigatorLounge) => {
    const map = mapRef.current
    if (!map) return

    setActiveLounge(lounge.id)
    setActiveDetail(lounge)

    const marker = markerMapRef.current[lounge.id]
    const lngLat = marker?.getLngLat()
    const [fbLng, fbLat] = terminalCenter(airport)
    const lng = lngLat?.lng ?? fbLng
    const lat = lngLat?.lat ?? fbLat

    const hasRealCoord = lounge.latitude != null && lounge.longitude != null
    map.flyTo({ center: [lng, lat], zoom: hasRealCoord ? 17.5 : 16, pitch: 0, duration: 1200 })
  }, [airport])

  // Keep the ref in sync with the latest callback
  flyToLoungeRef.current = flyToLounge

  const clearDetail = useCallback(() => {
    setActiveLounge(null)
    setActiveDetail(null)
  }, [])

  return (
    <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">

      {/* ── Map ─────────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden" style={{ minHeight: '50vh' }}>
        {/* mapbox-gl.css forces `.mapboxgl-map { position: relative }`, which neutralises `absolute inset-0`
            on the container and collapses its height to 0. Use `h-full w-full` so size comes from the
            parent's definite flex height instead of from inset positioning. */}
        <div ref={containerRef} className="h-full w-full" />

        {!mapReady && !mapError && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-white px-6 py-4 shadow-lg flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="font-label-caps text-[11px] text-primary">LOADING MAP</span>
            </div>
          </div>
        )}
        {mapError && (
          <div className="absolute inset-0 bg-bone-white flex items-center justify-center z-20 p-6">
            <div className="bg-white border border-red-200 px-6 py-4 shadow-lg max-w-sm text-center">
              <p className="font-label-caps text-[11px] text-red-600 mb-2 tracking-widest">MAP UNAVAILABLE</p>
              <p className="text-sm text-secondary">{mapError}</p>
            </div>
          </div>
        )}
        {mapReady && lounges.length > 0 && (
          <div className="absolute top-4 right-4 pointer-events-none z-10">
            <span className="bg-black/60 text-white text-[10px] font-label-caps px-3 py-1.5 shadow-lg">
              {lounges.length} LOUNGE{lounges.length !== 1 ? 'S' : ''} MARKED
            </span>
          </div>
        )}
      </div>

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <div className="w-full md:w-80 lg:w-96 bg-bone-white border-l border-sand-dark/10 flex flex-col md:overflow-hidden">

        {activeDetail ? (
          /* ── Lounge detail card ── */
          <div className="flex flex-col flex-1 min-h-0">

            {/* Header */}
            <div className="bg-primary px-4 py-4 flex items-start gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <svg width="22" height="22" viewBox="0 0 52 64" fill="none">
                  <circle cx="35" cy="13" r="5" fill="white"/>
                  <rect x="10" y="17" width="5.5" height="19" rx="2.75" fill="white"/>
                  <path d="M14.5 21.5 L30 17 L31.5 21 L16 25.5Z" fill="white"/>
                  <rect x="10" y="33" width="22" height="5" rx="2.5" fill="white"/>
                  <rect x="25" y="22" width="13" height="4" rx="2" fill="white"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-label-caps text-[9px] text-champagne-glint/60 tracking-widest mb-0.5">LOUNGE</p>
                <p className="font-semibold text-[14px] text-bone-white leading-tight">{activeDetail.name}</p>
              </div>
              <button
                onClick={clearDetail}
                className="text-bone-white/60 hover:text-bone-white shrink-0 mt-0.5 transition-colors"
                aria-label="Close"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>

            {/* Location rows */}
            {(activeDetail.location_detail || activeDetail.terminal || activeDetail.rating) && (
              <div className="px-4 py-3 border-b border-sand-dark/10 space-y-2 shrink-0">
                {activeDetail.location_detail && (
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-sand-dark shrink-0" style={{ fontSize: '14px', marginTop: '1px' }}>pin_drop</span>
                    <p className="text-xs text-secondary leading-snug">{activeDetail.location_detail}</p>
                  </div>
                )}
                {activeDetail.terminal && (
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-sand-dark shrink-0" style={{ fontSize: '14px' }}>apartment</span>
                    <p className="text-xs text-secondary">{fmtTerminal(activeDetail.terminal)}</p>
                  </div>
                )}
                {activeDetail.rating && (
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-sand-dark shrink-0" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>star</span>
                    <p className="text-xs text-secondary">
                      {activeDetail.rating.toFixed(1)}
                      {activeDetail.review_count ? ` (${activeDetail.review_count} reviews)` : ''}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* View full profile CTA */}
            <div className="px-4 py-3 shrink-0 border-b border-sand-dark/10">
              <Link
                href={`/airports/${airport.iata_code}/lounges/${activeDetail.slug}`}
                className="flex items-center justify-center gap-2 w-full bg-primary text-bone-white py-3 font-label-caps text-[11px] uppercase tracking-widest hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                View Full Profile
              </Link>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">

              {/* Photo */}
              {activeDetail.primaryImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeDetail.primaryImage}
                  alt={activeDetail.name}
                  className="w-full object-cover"
                  style={{ height: '160px' }}
                />
              )}

              {/* Description */}
              {activeDetail.description && (
                <div className="px-4 py-4 border-b border-sand-dark/10">
                  <p className="text-xs text-secondary leading-relaxed line-clamp-5">
                    {activeDetail.description}
                  </p>
                </div>
              )}

              {/* Information section */}
              {(activeDetail.phone || activeDetail.website || getTodayHours(activeDetail.opening_hours)) && (
                <>
                  <div className="px-4 py-2 bg-champagne-glint/50">
                    <p className="font-label-caps text-[9px] text-sand-dark tracking-widest">INFORMATION</p>
                  </div>
                  <div className="px-4 py-3 space-y-3 border-b border-sand-dark/10">
                    {activeDetail.website && (
                      <div className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-sand-dark shrink-0" style={{ fontSize: '14px', marginTop: '1px' }}>language</span>
                        <a
                          href={activeDetail.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary hover:underline break-all line-clamp-2 leading-relaxed"
                        >
                          {activeDetail.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        </a>
                      </div>
                    )}
                    {activeDetail.phone && (
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-sand-dark shrink-0" style={{ fontSize: '14px' }}>call</span>
                        <span className="text-xs text-secondary">{activeDetail.phone}</span>
                      </div>
                    )}
                    {getTodayHours(activeDetail.opening_hours) && (
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-sand-dark shrink-0" style={{ fontSize: '14px' }}>schedule</span>
                        <span className="text-xs text-secondary">Today: {getTodayHours(activeDetail.opening_hours)}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Access type chips */}
              {activeDetail.access_types && activeDetail.access_types.length > 0 && (
                <div className="px-4 py-3">
                  <p className="font-label-caps text-[9px] text-sand-dark tracking-widest mb-2">ACCESS</p>
                  <div className="flex flex-wrap gap-2">
                    {activeDetail.access_types.map((a, idx) => (
                      <span key={idx} className="text-[10px] px-2.5 py-1 bg-champagne-glint text-secondary font-label-caps">
                        {ACCESS_LABELS[a.type] ?? a.type.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Footer: back to list */}
            <div className="px-4 py-3 border-t border-sand-dark/10 shrink-0">
              <button
                onClick={clearDetail}
                className="flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors group"
              >
                <span
                  className="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform"
                  style={{ fontSize: '14px' }}
                >
                  arrow_back
                </span>
                Back to lounge list
              </button>
            </div>

          </div>
        ) : (
          /* ── Lounge list ── */
          <>
            {/* Header */}
            <div className="bg-primary text-white px-5 py-4 shrink-0">
              <p className="font-label-caps text-[10px] text-primary-fixed uppercase tracking-widest mb-0.5">
                {airport.iata_code} · {airport.city}
              </p>
              <h2 className="font-headline-md text-[15px] leading-snug">{airport.name}</h2>
              <p className="text-[11px] text-primary-fixed/70 mt-1">
                Click a lounge or tap a marker to explore
              </p>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 pt-4 pb-2">
                <p className="font-label-caps text-[10px] text-sand-dark tracking-widest">
                  LOUNGES — CLICK TO LOCATE
                </p>
              </div>

              {lounges.length === 0 && (
                <p className="px-5 py-4 text-sm text-secondary">No lounges listed for {airport.iata_code}.</p>
              )}

              <div className="px-4 pb-4 space-y-2">
                {lounges.map(lounge => (
                  <button
                    key={lounge.id}
                    onClick={() => flyToLounge(lounge)}
                    className={`w-full text-left p-4 border transition-all ${
                      activeLounge === lounge.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-sand-dark/20 bg-white hover:border-primary/40 hover:bg-champagne-glint/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-sm text-primary leading-tight">{lounge.name}</p>
                      {lounge.terminal && (
                        <span className="font-label-caps text-[9px] text-sand-dark shrink-0 bg-champagne-glint px-1.5 py-0.5 whitespace-nowrap">
                          {fmtTerminal(lounge.terminal)}
                        </span>
                      )}
                    </div>
                    {lounge.location_detail && (
                      <p className="text-xs text-secondary leading-relaxed mt-1 line-clamp-2">
                        {lounge.location_detail}
                      </p>
                    )}
                    {lounge.rating && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="material-symbols-outlined text-sand-dark" style={{ fontSize: '11px', fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-label-caps text-[10px] text-sand-dark">{lounge.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-sand-dark/10 space-y-2 shrink-0">
              {airport.terminal_map_url && (
                <a
                  href={airport.terminal_map_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full border border-primary/25 text-primary py-2.5 font-label-caps text-[10px] uppercase tracking-widest hover:bg-champagne-glint transition-all"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>open_in_new</span>
                  Official Terminal Map
                </a>
              )}
              <Link
                href={`/airports/${airport.iata_code}`}
                className="flex items-center justify-center gap-1.5 w-full bg-primary text-white py-2.5 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>door_open</span>
                All Lounges at {airport.iata_code}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
