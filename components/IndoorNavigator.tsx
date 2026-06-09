'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import mapboxgl from 'mapbox-gl'
import { INDOOR_COVERED, INDOOR_ZOOM, enableIndoor, getIndoorManager, type IndoorFloor } from '@/lib/mapbox/indoor'
import type { LoungeSummary } from '@/components/AirportLoungeGridFiltered'

interface AirportInfo {
  iata_code: string
  name: string
  city: string
  latitude: number
  longitude: number
  terminal_map_url: string | null
}

interface Props {
  airport: AirportInfo
  lounges: LoungeSummary[]
}

interface LoungeFeature {
  name: string
  lng: number
  lat: number
  floorId: string
}

export default function IndoorNavigator({ airport, lounges }: Props) {
  const containerRef    = useRef<HTMLDivElement>(null)
  const mapRef          = useRef<mapboxgl.Map | null>(null)
  const markersRef      = useRef<mapboxgl.Marker[]>([])

  const [mapReady,       setMapReady]       = useState(false)
  const [floors,         setFloors]         = useState<IndoorFloor[]>([])
  const [selectedFloor,  setSelectedFloor]  = useState<IndoorFloor | null>(null)
  const [indoorActive,   setIndoorActive]   = useState(false)
  const [activeLounge,   setActiveLounge]   = useState<string | null>(null)
  const [activeDetail,   setActiveDetail]   = useState<LoungeSummary | null>(null)
  const [loungeFeatures, setLoungeFeatures] = useState<LoungeFeature[]>([])

  const isIndoorCovered = INDOOR_COVERED.has(airport.iata_code)

  // ── Map init ──────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/standard',
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
      requestAnimationFrame(() => map.resize())
      if (isIndoorCovered) enableIndoor(map)
      setMapReady(true)
    })

    // Floor updates (Mapbox GL JS ≥ 3.6)
    map.on('indoor.updated', () => {
      const indoor = getIndoorManager(map)
      if (indoor) {
        const fl = indoor.floors ?? []
        setFloors(fl)
        setSelectedFloor(indoor.selectedFloor ?? null)
        setIndoorActive(fl.length > 0)
      }
    })

    // Harvest lounge features from indoor_label source
    const tryHarvestLounges = () => {
      try {
        const features = map.querySourceFeatures('indoor', {
          sourceLayer: 'indoor_label',
          filter: ['==', ['get', 'icon'], 'lounge'],
        })
        if (features.length > 0) {
          const found: LoungeFeature[] = features
            .filter(f => f.geometry.type === 'Point')
            .map(f => {
              const [lng, lat] = (f.geometry as GeoJSON.Point).coordinates
              return {
                name:    f.properties?.name ?? '',
                lng,
                lat,
                floorId: f.properties?.floor_id ?? '',
              }
            })
          setLoungeFeatures(found)
        }
      } catch { /* source not yet tiled into view */ }
    }

    map.on('sourcedata', (e: mapboxgl.MapSourceDataEvent) => {
      if (e.sourceId === 'indoor' && e.isSourceLoaded) tryHarvestLounges()
    })
    map.on('moveend', tryHarvestLounges)

    return () => {
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []
      try { map.remove() } catch { /* ignore */ }
    }
  }, [airport, isIndoorCovered])

  // ── Clear markers helper ──────────────────────────────────
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []
  }, [])

  // ── Switch floor ──────────────────────────────────────────
  const switchFloor = useCallback((floor: IndoorFloor) => {
    const map = mapRef.current
    if (!map) return
    const indoor = getIndoorManager(map)
    indoor?.setFloor(floor.id)
    setSelectedFloor(floor)
  }, [])

  // ── Fly to lounge ─────────────────────────────────────────
  const flyToLounge = useCallback((lounge: LoungeSummary) => {
    const map = mapRef.current
    if (!map) return

    setActiveLounge(lounge.id)
    setActiveDetail(lounge)
    clearMarkers()

    // Try to find lounge in harvested indoor features
    const lowerName = lounge.name.toLowerCase()
    const match = loungeFeatures.find(f => {
      const fn = f.name.toLowerCase()
      return fn.includes(lowerName) || lowerName.includes(fn) ||
        // partial match on last two words (e.g. "Maple Leaf Lounge")
        lowerName.split(' ').slice(-2).some(word => fn.includes(word))
    })

    if (match) {
      map.flyTo({ center: [match.lng, match.lat], zoom: 19.5, pitch: 0, duration: 1800 })

      // Switch floor if we can
      if (match.floorId) {
        const indoor = getIndoorManager(map)
        indoor?.setFloor(match.floorId)
      }

      const marker = new mapboxgl.Marker({ color: '#C9A96E', scale: 1.3 })
        .setLngLat([match.lng, match.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 28, closeButton: false })
            .setHTML(
              `<div style="font-family:Inter,sans-serif;font-size:12px;font-weight:600;color:#003434;padding:6px 8px;">${lounge.name}</div>`
            )
        )
        .addTo(map)
      marker.getPopup()?.addTo(map)
      markersRef.current.push(marker)
    } else {
      // Fallback: zoom to airport at indoor level
      map.flyTo({
        center:   [airport.longitude, airport.latitude],
        zoom:     isIndoorCovered ? INDOOR_ZOOM : 15,
        pitch:    0,
        duration: 1500,
      })
    }
  }, [airport, isIndoorCovered, loungeFeatures, clearMarkers])

  // ── Sorted floors — highest level first ──────────────────
  const sortedFloors = [...floors].sort((a, b) => b.level - a.level)

  return (
    <div className="h-full flex flex-col md:flex-row">

      {/* ── Map ─────────────────────────────────────────────── */}
      <div className="relative h-[50vh] md:flex-1 md:min-h-0">
        <div ref={containerRef} className="absolute inset-0" />

        {/* Loading overlay */}
        {!mapReady && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center z-10">
            <div className="bg-white px-6 py-4 shadow-lg flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="font-label-caps text-[11px] text-primary">LOADING MAP</span>
            </div>
          </div>
        )}

        {/* Status badge */}
        {mapReady && (
          <div className="absolute top-4 right-4 pointer-events-none z-10">
            {isIndoorCovered && indoorActive ? (
              <span className="bg-primary text-white text-[10px] font-label-caps px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>layers</span>
                INDOOR MAPS ACTIVE
              </span>
            ) : isIndoorCovered ? (
              <span className="bg-black/70 text-white text-[10px] font-label-caps px-3 py-1.5 shadow-lg">
                ZOOM IN FOR INDOOR
              </span>
            ) : (
              <span className="bg-black/70 text-white text-[10px] font-label-caps px-3 py-1.5 shadow-lg">
                MAP VIEW
              </span>
            )}
          </div>
        )}

        {/* Floor selector — only when indoor is active */}
        {indoorActive && sortedFloors.length > 0 && (
          <div className="absolute bottom-8 left-4 z-10 bg-white shadow-xl border border-sand-dark/20">
            <p className="font-label-caps text-[9px] text-sand-dark px-3 pt-2.5 pb-1.5 border-b border-sand-dark/10 tracking-widest">
              FLOOR
            </p>
            {sortedFloors.map(floor => (
              <button
                key={floor.id}
                onClick={() => switchFloor(floor)}
                className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  selectedFloor?.id === floor.id
                    ? 'bg-primary text-white font-semibold'
                    : 'text-primary hover:bg-champagne-glint'
                }`}
              >
                {floor.description || `Level ${floor.level}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Sidebar panel ────────────────────────────────────── */}
      <div className="w-full md:w-80 lg:w-96 bg-bone-white border-l border-sand-dark/10 flex flex-col md:overflow-hidden">

        {/* Panel header */}
        <div className="bg-primary text-white px-5 py-4 shrink-0">
          <p className="font-label-caps text-[10px] text-primary-fixed uppercase tracking-widest mb-0.5">
            {airport.iata_code} · {airport.city}
          </p>
          <h2 className="font-headline-md text-[15px] leading-snug">{airport.name}</h2>
          {isIndoorCovered ? (
            <p className="text-[11px] text-primary-fixed/80 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>layers</span>
              Interactive indoor floor plans
            </p>
          ) : (
            <p className="text-[11px] text-primary-fixed/70 mt-1">Standard map · Indoor coming soon</p>
          )}
        </div>

        {/* Directions panel — shown when lounge is selected */}
        {activeDetail && (
          <div className="bg-champagne-glint border-b border-sand-dark/15 px-5 py-4 shrink-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-label-caps text-[9px] text-sand-dark tracking-widest mb-0.5">NAVIGATING TO</p>
                <p className="font-medium text-sm text-primary leading-tight">{activeDetail.name}</p>
              </div>
              <button
                onClick={() => { setActiveLounge(null); setActiveDetail(null); clearMarkers() }}
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

        {/* Panel footer */}
        <div className="px-4 py-4 border-t border-sand-dark/10 space-y-2 shrink-0">
          {!isIndoorCovered && (
            <p className="text-[11px] text-secondary text-center pb-1">
              Indoor floor plans not yet available for {airport.iata_code}.
            </p>
          )}
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
