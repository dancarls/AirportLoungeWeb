'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import mapboxgl from 'mapbox-gl'
import { INDOOR_COVERED, enableIndoor } from '@/lib/mapbox/indoor'

interface AirportPin {
  iata_code: string
  name: string
  city: string
  latitude: number
  longitude: number
  terminal_map_url: string | null
  lounges: { id: string }[]
}

interface Props {
  airports: AirportPin[]
}

export default function AirportMapExplorer({ airports }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [panelOpen, setPanelOpen] = useState(true)

  const indoorAirports = airports.filter(a => INDOOR_COVERED.has(a.iata_code))
  const otherAirports  = airports.filter(a => !INDOOR_COVERED.has(a.iata_code))

  useEffect(() => {
    if (!containerRef.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      center: [-96, 60],
      zoom: 3.5,
      pitch: 0,
      projection: 'mercator',
      attributionControl: false,
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-left')
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')

    map.on('load', () => {
      requestAnimationFrame(() => map.resize())
      enableIndoor(map)
      airports.forEach(airport => {
        const isIndoor = INDOOR_COVERED.has(airport.iata_code)
        const loungeCount = airport.lounges.length

        // Custom marker — outer el is Mapbox's positioning target (do NOT touch its transform)
        const el = document.createElement('div')
        const size = isIndoor ? '40px' : '30px'
        Object.assign(el.style, { width: size, height: size, cursor: 'pointer' })

        // Inner element holds the visual styling and hover animation
        const inner = document.createElement('div')
        Object.assign(inner.style, {
          width:       '100%',
          height:      '100%',
          background:  isIndoor ? '#C9A96E' : '#003434',
          border:      '2.5px solid white',
          borderRadius: '50%',
          display:     'flex',
          alignItems:  'center',
          justifyContent: 'center',
          boxShadow:   '0 2px 10px rgba(0,0,0,0.35)',
          fontFamily:  'Inter, sans-serif',
          fontSize:    isIndoor ? '9.5px' : '8.5px',
          fontWeight:  '700',
          color:       isIndoor ? '#003434' : 'white',
          letterSpacing: '-0.3px',
          transition:  'transform 0.15s',
          transformOrigin: 'center',
        })
        inner.textContent = airport.iata_code
        inner.title = airport.name
        el.appendChild(inner)

        inner.addEventListener('mouseenter', () => { inner.style.transform = 'scale(1.15)' })
        inner.addEventListener('mouseleave', () => { inner.style.transform = 'scale(1)' })

        const popup = new mapboxgl.Popup({ offset: 22, closeButton: false, maxWidth: '220px' })
          .setHTML(`
            <div style="font-family:Inter,sans-serif;padding:10px 12px;">
              <p style="font-size:10px;color:${isIndoor ? '#C9A96E' : '#675d4f'};font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 2px;">
                ${airport.iata_code}${isIndoor ? ' · Indoor Maps' : ''}
              </p>
              <p style="font-size:13px;font-weight:700;color:#003434;margin:0 0 3px;line-height:1.3;">${airport.name}</p>
              <p style="font-size:11px;color:#675d4f;margin:0 0 10px;">
                ${airport.city} · ${loungeCount} lounge${loungeCount !== 1 ? 's' : ''}
              </p>
              <div style="display:flex;gap:8px;">
                ${isIndoor ? `
                  <a href="/airports/${airport.iata_code}/navigate"
                    style="flex:1;background:#003434;color:white;text-align:center;padding:7px 6px;
                           font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;">
                    Navigate
                  </a>
                ` : ''}
                <a href="/airports/${airport.iata_code}"
                  style="flex:1;border:1.5px solid #003434;color:#003434;text-align:center;padding:6px;
                         font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;">
                  Lounges
                </a>
              </div>
            </div>
          `)

        new mapboxgl.Marker({ element: el })
          .setLngLat([airport.longitude, airport.latitude])
          .setPopup(popup)
          .addTo(map)
      })
    })

    return () => { try { map.remove() } catch { /* ignore */ } }
  }, [airports])

  return (
    <div className="relative flex-1 flex overflow-hidden">

      {/* ── Map ─────────────────────────────────────────────── */}
      <div ref={containerRef} className="flex-1 absolute inset-0" />

      {/* ── Toggle panel button (mobile / collapse) ──────────── */}
      <button
        onClick={() => setPanelOpen(o => !o)}
        className="absolute top-4 right-4 z-20 bg-white shadow-lg border border-sand-dark/20 p-2.5 md:hidden"
        aria-label={panelOpen ? 'Hide airport list' : 'Show airport list'}
      >
        <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>
          {panelOpen ? 'close' : 'list'}
        </span>
      </button>

      {/* ── Sidebar panel ────────────────────────────────────── */}
      {panelOpen && (
        <div className="absolute top-4 right-4 z-10 bg-white shadow-xl border border-sand-dark/20 w-64 max-h-[calc(100vh-180px)] flex flex-col overflow-hidden hidden md:flex">

          {/* Legend */}
          <div className="p-4 border-b border-sand-dark/10 shrink-0">
            <p className="font-label-caps text-[10px] text-sand-dark tracking-widest mb-3">LEGEND</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-[#C9A96E] border-2 border-white shadow-sm shrink-0" />
              <span className="text-xs text-primary font-medium">Indoor Maps Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm shrink-0" />
              <span className="text-xs text-secondary">Standard Map</span>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {/* Indoor airports */}
            {indoorAirports.length > 0 && (
              <div className="p-3">
                <p className="font-label-caps text-[9px] text-[#C9A96E] tracking-widest mb-2">
                  INDOOR MAPS ({indoorAirports.length})
                </p>
                <div className="space-y-0.5">
                  {indoorAirports.map(a => (
                    <Link
                      key={a.iata_code}
                      href={`/airports/${a.iata_code}/navigate`}
                      className="flex items-center justify-between px-2 py-2 hover:bg-champagne-glint/40 transition-colors rounded group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#C9A96E] flex items-center justify-center text-[8.5px] font-bold text-primary shrink-0">
                          {a.iata_code}
                        </span>
                        <div>
                          <p className="text-[11px] font-semibold text-primary leading-tight">{a.iata_code}</p>
                          <p className="text-[10px] text-secondary leading-tight">{a.city}</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-sand-dark group-hover:text-primary transition-colors" style={{ fontSize: '14px' }}>navigate_next</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Other airports */}
            {otherAirports.length > 0 && (
              <div className="p-3 border-t border-sand-dark/10">
                <p className="font-label-caps text-[9px] text-sand-dark tracking-widest mb-2">
                  OTHER AIRPORTS ({otherAirports.length})
                </p>
                <div className="space-y-0.5">
                  {otherAirports.map(a => (
                    <Link
                      key={a.iata_code}
                      href={`/airports/${a.iata_code}`}
                      className="flex items-center justify-between px-2 py-2 hover:bg-champagne-glint/40 transition-colors rounded group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                          {a.iata_code.slice(0, 2)}
                        </span>
                        <div>
                          <p className="text-[11px] font-semibold text-primary leading-tight">{a.iata_code}</p>
                          <p className="text-[10px] text-secondary leading-tight">{a.city}</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-sand-dark group-hover:text-primary transition-colors" style={{ fontSize: '14px' }}>navigate_next</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
