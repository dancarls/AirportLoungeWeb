'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import mapboxgl from 'mapbox-gl'
import { INDOOR_COVERED, INDOOR_ZOOM, enableIndoor, getIndoorManager, type IndoorFloor } from '@/lib/mapbox/indoor'

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

// ── Interactive map modal ─────────────────────────────────
function AirportMapModal({ airport, onClose }: { airport: AirportData; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [floors,        setFloors]        = useState<IndoorFloor[]>([])
  const [selectedFloor, setSelectedFloor] = useState<IndoorFloor | null>(null)
  const [indoorActive,  setIndoorActive]  = useState(false)
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)

  const hasIndoor = INDOOR_COVERED.has(airport.iata_code)

  useEffect(() => {
    if (!containerRef.current || !airport.latitude || !airport.longitude) return
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      center: [airport.longitude, airport.latitude],
      zoom:   hasIndoor ? INDOOR_ZOOM : 15,
      pitch:  0,
      attributionControl: false,
    })
    mapInstanceRef.current = map

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')

    map.on('load', () => {
      map.resize()
      if (hasIndoor) {
        enableIndoor(map)
      } else {
        // Satellite: one marker per lounge at airport centre
        airport.lounges.forEach(l => {
          new mapboxgl.Marker({ color: '#C9A96E' })
            .setLngLat([airport.longitude!, airport.latitude!])
            .setPopup(
              new mapboxgl.Popup({ offset: 28, closeButton: false })
                .setHTML(`<div style="font-family:Inter,sans-serif;font-size:12px;font-weight:600;color:#003434;padding:6px 8px;">${l.name}</div>`)
            )
            .addTo(map)
        })
      }
    })

    map.on('indoor.updated', () => {
      const indoor = getIndoorManager(map)
      if (indoor) {
        const fl = indoor.floors ?? []
        setFloors([...fl].sort((a, b) => b.level - a.level))
        setSelectedFloor(indoor.selectedFloor ?? null)
        setIndoorActive(fl.length > 0)
      }
    })

    return () => { try { map.remove() } catch { /* ignore */ } }
  }, [airport, hasIndoor])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const switchFloor = (floor: IndoorFloor) => {
    const map = mapInstanceRef.current
    if (!map) return
    getIndoorManager(map)?.setFloor(floor.id)
    setSelectedFloor(floor)
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-4xl shadow-2xl overflow-hidden"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-label-caps text-[10px] text-primary-fixed uppercase tracking-widest mb-0.5">
              {airport.iata_code} · {airport.city}
              {hasIndoor && (
                <span className="ml-2 bg-white/20 px-1.5 py-0.5">INDOOR MAPS</span>
              )}
            </p>
            <h3 className="font-headline-md text-base">{airport.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Close map"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Map */}
        <div className="relative">
          <div ref={containerRef} style={{ height: '420px', width: '100%' }} />

          {/* Floor selector inside the modal map */}
          {hasIndoor && indoorActive && floors.length > 0 && (
            <div className="absolute bottom-4 left-4 bg-white shadow-lg border border-sand-dark/20 z-10">
              <p className="font-label-caps text-[9px] text-sand-dark px-3 pt-2 pb-1.5 border-b border-sand-dark/10 tracking-widest">FLOOR</p>
              {floors.map(floor => (
                <button
                  key={floor.id}
                  onClick={() => switchFloor(floor)}
                  className={`block w-full text-left px-4 py-2 text-xs transition-colors ${
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

        {/* Footer */}
        <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between border-t border-sand-dark/10">
          <p className="text-xs text-secondary flex-1">
            {hasIndoor
              ? `Indoor floor plans for ${airport.name}. Use the floor selector to explore each level.`
              : `${airport.name} terminal map. Lounge markers are pinned at the airport centre — follow signage on arrival.`
            }
          </p>
          <div className="flex gap-3 shrink-0 flex-wrap">
            <Link
              href={`/airports/${airport.iata_code}/navigate`}
              onClick={onClose}
              className="flex items-center gap-1.5 bg-primary text-white px-5 py-2.5 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>explore</span>
              Full Navigator
            </Link>
            {airport.terminal_map_url && (
              <a
                href={airport.terminal_map_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 fine-border text-primary px-5 py-2.5 font-label-caps text-[10px] uppercase tracking-widest hover:bg-champagne-glint transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                Terminal Map
              </a>
            )}
            <Link
              href={`/airports/${airport.iata_code}`}
              onClick={onClose}
              className="flex items-center gap-1.5 fine-border text-primary px-5 py-2.5 font-label-caps text-[10px] uppercase tracking-widest hover:bg-champagne-glint transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>door_open</span>
              View Lounges
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const IATA_PRIORITY = ['YYZ', 'YVR', 'YUL', 'YEG', 'YOW', 'YWG', 'YHZ']

// ── Main component ────────────────────────────────────────
export default function TerminalMapVisual({ airports }: { airports: AirportData[] }) {
  const valid = airports.filter(a => a.latitude && a.longitude)
  // Only show indoor-covered airports in the quick nav tabs, sorted largest → smallest
  const displayAirports = valid.filter(a => INDOOR_COVERED.has(a.iata_code))
  const unsorted = displayAirports.length > 0 ? displayAirports : valid
  const tabAirports = [...unsorted].sort((a, b) => {
    const ai = IATA_PRIORITY.indexOf(a.iata_code)
    const bi = IATA_PRIORITY.indexOf(b.iata_code)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })

  const [selected,  setSelected]  = useState(tabAirports[0]?.iata_code ?? '')
  const [mapOpen,   setMapOpen]   = useState(false)
  const [mounted,   setMounted]   = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const airport = valid.find(a => a.iata_code === selected) ?? tabAirports[0]
  if (!airport) return null

  // Mapbox Static Images API — standard map, no satellite
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const staticMapUrl = (airport.latitude && airport.longitude && mapboxToken)
    ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${airport.longitude},${airport.latitude},15,0/1280x549@2x?access_token=${mapboxToken}`
    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsUQPE62JEQ3D3Ex8UH4OlUeO8t89NrJixOZWymGb11WbLKrjITTElKtDrjJGXvjyEE1pj8XAPDphNzoDJDOjCD-Jf8g1dczO257Fmsgas6ZdEP9nnMvrdXB8bySGbPRduPvh4PY7ykVLZ0MkLhQOROra6vHGv4nnfp68UnfhK8qOuza-Mgj8dEyzMBRlZunD_-6hklCG2DiZz20gLUUsJFAQCoQUhVmMD0I6vK8dNb6f1EkuFGLWIVbeEeSsaYPa0lRTBcjFaGrf_'

  const dots = getPulseDots(airport.lounges.length)

  return (
    <section id="terminal-navigation" className="py-section-gap bg-secondary-fixed">
      <div className="max-w-container-max mx-auto px-gutter">

        {/* Header */}
        <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Terminal Navigation</h2>
            <p className="text-secondary">
              Interactive indoor floor plans — click any airport to explore, then open the Full Navigator.
            </p>
          </div>
          {/* Airport switcher — indoor-covered airports only */}
          <div className="flex gap-2 flex-wrap">
            {tabAirports.map(a => (
              <button
                key={a.iata_code}
                onClick={() => setSelected(a.iata_code)}
                className={`px-6 py-3 text-sm font-medium transition-all flex items-center gap-1.5 ${
                  selected === a.iata_code
                    ? 'bg-primary text-white'
                    : 'bg-white/50 text-primary hover:bg-white'
                }`}
              >
                {INDOOR_COVERED.has(a.iata_code) && (
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>layers</span>
                )}
                {a.iata_code}
              </button>
            ))}
          </div>
        </div>

        {/* Map preview — clicking opens interactive modal */}
        <button
          type="button"
          onClick={() => setMapOpen(true)}
          className="relative bg-white aspect-[21/9] editorial-shadow overflow-hidden group block w-full text-left"
          aria-label={`Open interactive map for ${airport.name}`}
        >
          {/* Aerial image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={selected}
            src={staticMapUrl}
            alt={`${airport.name} aerial view`}
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
          />

          {/* Dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />

          {/* Pulse lounge markers */}
          {dots.map((dot, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-primary-fixed rounded-full border-2 border-white animate-pulse"
              style={{ top: dot.top, left: dot.left }}
            />
          ))}

          {/* Centre overlay — resting state */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="p-8 bg-bone-white/90 backdrop-blur-lg border border-primary/20 max-w-sm text-center transition-opacity duration-500 group-hover:opacity-0">
              <span className="material-symbols-outlined text-primary mb-4 block" style={{ fontSize: '40px' }}>
                {INDOOR_COVERED.has(airport.iata_code) ? 'layers' : 'map'}
              </span>
              <h3 className="font-headline-md text-primary mb-2">
                {INDOOR_COVERED.has(airport.iata_code) ? 'Indoor Floor Plans' : 'Interactive Map'}
              </h3>
              <p className="text-sm text-secondary">
                Click to explore the terminal layout and lounge locations at {airport.name}.
              </p>
            </div>
          </div>

          {/* Hover CTA */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-3 bg-primary text-white px-8 py-4 editorial-shadow">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>map</span>
              <span className="font-label-caps text-label-caps uppercase tracking-widest">
                Open Interactive Map
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
                {airport.lounges.length} Lounge{airport.lounges.length !== 1 ? 's' : ''} · Click to explore
              </span>
            </div>
          )}

          {/* Indoor maps indicator */}
          {INDOOR_COVERED.has(airport.iata_code) && (
            <div className="absolute top-5 right-5 bg-primary/90 backdrop-blur text-white px-3 py-1.5 editorial-shadow flex items-center gap-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>layers</span>
              <span className="font-label-caps text-[9px] uppercase tracking-widest">Indoor Maps</span>
            </div>
          )}
        </button>

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
          <div className="flex gap-3 flex-wrap">
            <Link
              href={`/airports/${airport.iata_code}/navigate`}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>explore</span>
              Navigate {airport.iata_code}
            </Link>
            <Link
              href={`/airports/${airport.iata_code}`}
              className="flex items-center gap-2 fine-border bg-white text-primary px-5 py-2.5 font-label-caps text-[10px] uppercase tracking-widest hover:bg-champagne-glint transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>door_open</span>
              All Lounges
            </Link>
          </div>
        </div>

        {/* All airports map CTA */}
        <div className="mt-8 text-center border-t border-sand-dark/15 pt-8">
          <Link
            href="/airports/map"
            className="inline-flex items-center gap-2 bg-primary text-white px-10 py-4 font-label-caps text-label-caps uppercase tracking-widest hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>public</span>
            Explore All Airport Maps
          </Link>
          <p className="text-xs text-secondary mt-3">
            View all Canadian airports on one map · Indoor floor plans for {tabAirports.length} airports
          </p>
        </div>
      </div>

      {/* Interactive map modal — portal avoids clipping */}
      {mounted && mapOpen && createPortal(
        <AirportMapModal airport={airport} onClose={() => setMapOpen(false)} />,
        document.body
      )}
    </section>
  )
}
