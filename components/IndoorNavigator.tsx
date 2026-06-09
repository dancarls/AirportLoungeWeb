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

// ── Position helpers ─────────────────────────────────────────

// When a lounge has no coordinates, spread markers in a small circle
// around the airport centre (~80 m radius) so every marker is clickable.
function getLoungeCoords(
  lounge:  NavigatorLounge,
  index:   number,
  total:   number,
  airport: AirportInfo,
): [number, number] {
  if (lounge.latitude != null && lounge.longitude != null) {
    return [lounge.longitude, lounge.latitude]
  }
  const angle = (index / Math.max(total, 1)) * 2 * Math.PI
  const R = 0.0007                             // ~70 m at Canadian latitudes
  return [
    airport.longitude + R * Math.cos(angle),
    airport.latitude  + R * 0.55 * Math.sin(angle),
  ]
}

// ── Popup HTML builders ──────────────────────────────────────

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

function buildPopupHTML(lounge: NavigatorLounge, iata: string): string {
  const hours = getTodayHours(lounge.opening_hours)

  const chips = (lounge.access_types ?? [])
    .slice(0, 3)
    .map(a => {
      const label = ACCESS_LABELS[a.type] ?? a.type.replace(/_/g, ' ')
      return `<span style="font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;background:#f5f0e8;color:#675d4f;padding:2px 7px;">${label}</span>`
    })
    .join('')

  const img = lounge.primaryImage
    ? `<img src="${lounge.primaryImage}" style="width:100%;height:110px;object-fit:cover;display:block;" loading="lazy" />`
    : `<div style="width:100%;height:52px;background:linear-gradient(135deg,#003434 0%,#1a5454 100%);display:flex;align-items:center;justify-content:center;"><span style="color:#C9A96E;font-size:20px;">✈</span></div>`

  const badge = lounge.terminal
    ? `<span style="font-size:9px;font-weight:700;background:#f5f0e8;color:#675d4f;padding:2px 7px;flex-shrink:0;white-space:nowrap;">T${lounge.terminal}</span>`
    : ''

  const rating = lounge.rating
    ? `<div style="display:flex;align-items:center;gap:3px;margin-bottom:6px;">
         <span style="color:#C9A96E;">★</span>
         <span style="font-size:11px;font-weight:600;color:#003434;">${lounge.rating.toFixed(1)}</span>
         ${lounge.review_count ? `<span style="font-size:10px;color:#675d4f;">(${lounge.review_count})</span>` : ''}
       </div>`
    : ''

  const phone = lounge.phone
    ? `<p style="font-size:10.5px;color:#675d4f;margin:0 0 4px;">📞 ${lounge.phone}</p>`
    : ''

  const todayHours = hours
    ? `<p style="font-size:10.5px;color:#675d4f;margin:0 0 8px;">🕐 Today: ${hours}</p>`
    : ''

  const websiteBtn = lounge.website
    ? `<a href="${lounge.website}" target="_blank" rel="noreferrer"
         style="flex:1;border:1.5px solid #003434;color:#003434;text-align:center;padding:6px 4px;
                font-size:9px;font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:0.05em;">
         Website
       </a>`
    : ''

  return `
<div style="font-family:Inter,-apple-system,sans-serif;width:256px;overflow:hidden;">
  ${img}
  <div style="padding:11px 13px;">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:6px;margin-bottom:4px;">
      <p style="font-size:13px;font-weight:700;color:#003434;margin:0;line-height:1.3;">${lounge.name}</p>
      ${badge}
    </div>
    ${lounge.location_detail ? `<p style="font-size:10.5px;color:#675d4f;margin:0 0 6px;line-height:1.4;">${lounge.location_detail}</p>` : ''}
    ${rating}${phone}${todayHours}
    ${chips ? `<div style="display:flex;flex-wrap:wrap;gap:3px;margin-bottom:9px;">${chips}</div>` : ''}
    <div style="display:flex;gap:5px;">
      ${websiteBtn}
      <a href="/airports/${iata}/lounges/${lounge.slug}"
         style="flex:2;background:#003434;color:white;text-align:center;padding:7px 4px;
                font-size:9px;font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:0.05em;">
        View Details
      </a>
    </div>
  </div>
</div>`
}

// ── Component ────────────────────────────────────────────────

export default function IndoorNavigator({ airport, lounges }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<mapboxgl.Map | null>(null)
  const markersRef   = useRef<mapboxgl.Marker[]>([])
  const markerMapRef = useRef<Record<string, mapboxgl.Marker>>({})

  const [mapReady,     setMapReady]     = useState(false)
  const [activeLounge, setActiveLounge] = useState<string | null>(null)
  const [activeDetail, setActiveDetail] = useState<NavigatorLounge | null>(null)

  // ── Map init ─────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    let started = false

    const startMap = () => {
      if (started) return
      started = true

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

      const map = new mapboxgl.Map({
        container,
        style:   'mapbox://styles/mapbox/standard',
        center:  [airport.longitude, airport.latitude],
        zoom:    15,
        pitch:   0,
        bearing: 0,
        attributionControl: false,
      })
      mapRef.current = map

      map.addControl(new mapboxgl.NavigationControl(), 'top-left')
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')

      map.on('load', () => {
        map.resize()
        // Show gates, terminal labels, and POI names on the Standard style
        try {
          map.setConfigProperty('basemap', 'showPointOfInterestLabels', true)
          map.setConfigProperty('basemap', 'showPlaceLabels', true)
          map.setConfigProperty('basemap', 'showTransitLabels', true)
        } catch {}

        setMapReady(true)

        // Add a marker for every lounge
        lounges.forEach((lounge, i) => {
          const [lng, lat] = getLoungeCoords(lounge, i, lounges.length, airport)

          const el    = document.createElement('div')
          const inner = document.createElement('div')
          Object.assign(el.style,    { width: '32px', height: '32px', cursor: 'pointer' })
          Object.assign(inner.style, {
            width:        '100%',
            height:       '100%',
            background:   '#C9A96E',
            border:       '2.5px solid white',
            borderRadius: '50%',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            boxShadow:    '0 2px 8px rgba(0,0,0,0.3)',
            fontSize:     '15px',
            lineHeight:   '1',
            transition:   'transform 0.15s',
            transformOrigin: 'center',
          })
          inner.textContent = '✈'
          inner.title       = lounge.name
          el.appendChild(inner)
          inner.addEventListener('mouseenter', () => { inner.style.transform = 'scale(1.2)' })
          inner.addEventListener('mouseleave', () => { inner.style.transform = 'scale(1)' })

          const popup = new mapboxgl.Popup({ offset: 18, closeButton: true, maxWidth: '270px' })
            .setHTML(buildPopupHTML(lounge, airport.iata_code))

          popup.on('open',  () => { setActiveLounge(lounge.id); setActiveDetail(lounge) })
          popup.on('close', () => { setActiveLounge(prev => prev === lounge.id ? null : prev) })

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map)

          markersRef.current.push(marker)
          markerMapRef.current[lounge.id] = marker
        })
      })
    }

    // Defer init until the container has real pixel dimensions
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
      markersRef.current.forEach(m => m.remove())
      markersRef.current  = []
      markerMapRef.current = {}
      if (mapRef.current) {
        try { mapRef.current.remove() } catch {}
        mapRef.current = null
      }
    }
  }, [airport, lounges])

  // ── Fly to lounge + open popup ────────────────────────────
  const flyToLounge = useCallback((lounge: NavigatorLounge) => {
    const map = mapRef.current
    if (!map) return

    setActiveLounge(lounge.id)
    setActiveDetail(lounge)

    const idx     = lounges.indexOf(lounge)
    const [lng, lat] = getLoungeCoords(lounge, idx, lounges.length, airport)
    // Zoom to 18 if we have a real coordinate, else 16 to show the whole terminal
    const zoom    = (lounge.latitude != null && lounge.longitude != null) ? 18 : 16

    map.flyTo({ center: [lng, lat], zoom, pitch: 0, duration: 1400 })

    // Open the popup after the fly animation has started
    setTimeout(() => {
      const marker = markerMapRef.current[lounge.id]
      if (marker && !marker.getPopup()?.isOpen()) marker.togglePopup()
    }, 900)
  }, [airport, lounges])

  return (
    <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">

      {/* ── Map ─────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden"
        style={{ minHeight: '50vh' }}
      >
        {!mapReady && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center z-10">
            <div className="bg-white px-6 py-4 shadow-lg flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="font-label-caps text-[11px] text-primary">LOADING MAP</span>
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

        {/* Header */}
        <div className="bg-primary text-white px-5 py-4 shrink-0">
          <p className="font-label-caps text-[10px] text-primary-fixed uppercase tracking-widest mb-0.5">
            {airport.iata_code} · {airport.city}
          </p>
          <h2 className="font-headline-md text-[15px] leading-snug">{airport.name}</h2>
          <p className="text-[11px] text-primary-fixed/70 mt-1">
            Click a lounge below or tap a map marker
          </p>
        </div>

        {/* Active lounge detail strip */}
        {activeDetail && (
          <div className="bg-champagne-glint border-b border-sand-dark/15 px-5 py-4 shrink-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-label-caps text-[9px] text-sand-dark tracking-widest mb-0.5">NAVIGATING TO</p>
                <p className="font-medium text-sm text-primary leading-tight">{activeDetail.name}</p>
              </div>
              <button
                onClick={() => { setActiveLounge(null); setActiveDetail(null) }}
                className="text-sand-dark hover:text-primary shrink-0 mt-0.5"
                aria-label="Clear navigation"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
              </button>
            </div>
            {activeDetail.location_detail && (
              <p className="text-xs text-secondary leading-relaxed flex items-start gap-1.5">
                <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: '14px', marginTop: '1px' }}>
                  directions_walk
                </span>
                {activeDetail.location_detail}
              </p>
            )}
            {activeDetail.terminal && (
              <p className="text-[11px] text-sand-dark mt-1.5 font-label-caps">
                Terminal {activeDetail.terminal}
              </p>
            )}
          </div>
        )}

        {/* Lounge list */}
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
                    <span className="font-label-caps text-[9px] text-sand-dark shrink-0 bg-champagne-glint px-1.5 py-0.5">
                      T{lounge.terminal}
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
                {activeLounge === lounge.id && (
                  <div className="mt-2 flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>my_location</span>
                    <span className="text-[10px] font-label-caps">Located on map</span>
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
      </div>
    </div>
  )
}
