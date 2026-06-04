'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import mapboxgl from 'mapbox-gl'
import type { Lounge, Airport } from '@/lib/types'

interface Props {
  lounge: Lounge & { airport?: Airport }
  primaryImageUrl: string | null
}

const DAY_ORDER = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] as const
const DAY_LABELS: Record<string, string> = {
  monday:'Mon',tuesday:'Tue',wednesday:'Wed',thursday:'Thu',friday:'Fri',saturday:'Sat',sunday:'Sun',
}

// ── Details Modal ────────────────────────────────────────
function DetailsModal({ lounge, iata, onClose }: { lounge: Lounge & { airport?: Airport }, iata: string, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-aviation-navy/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bone-white w-full max-w-lg editorial-shadow overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="bg-primary text-white px-8 py-6 flex items-start justify-between">
          <div>
            <p className="font-label-caps text-[10px] text-primary-fixed uppercase tracking-widest mb-1">
              {iata} {lounge.terminal ? `• Terminal ${lounge.terminal}` : ''}
            </p>
            <h2 className="font-headline-md text-headline-md">{lounge.name}</h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors mt-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-8 py-6 space-y-5">
          {/* Location */}
          {lounge.location_detail && (
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-sand-dark" style={{ fontSize: '20px' }}>location_on</span>
              <div>
                <p className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-0.5">Location</p>
                <p className="text-sm text-on-surface">{lounge.location_detail}</p>
              </div>
            </div>
          )}

          {/* Hours */}
          {lounge.opening_hours && Object.keys(lounge.opening_hours).length > 0 && (
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-sand-dark" style={{ fontSize: '20px' }}>schedule</span>
              <div className="flex-1">
                <p className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-2">Opening Hours</p>
                {lounge.opening_hours.is_24_7 ? (
                  <p className="text-sm font-medium text-green-700">Open 24 / 7</p>
                ) : (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
                    {DAY_ORDER.map(day => {
                      const h = lounge.opening_hours[day as keyof typeof lounge.opening_hours]
                      if (!h || typeof h !== 'string') return null
                      const isToday = DAY_ORDER[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] === day
                      return (
                        <div key={day} className={`flex justify-between text-xs py-0.5 ${isToday ? 'font-semibold text-primary' : 'text-secondary'}`}>
                          <span>{DAY_LABELS[day]}</span><span>{h}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
                {lounge.opening_hours.notes && (
                  <p className="text-xs text-secondary/70 mt-1">{lounge.opening_hours.notes}</p>
                )}
              </div>
            </div>
          )}

          {/* Amenities */}
          {lounge.amenities && lounge.amenities.length > 0 && (
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-sand-dark" style={{ fontSize: '20px' }}>star</span>
              <div>
                <p className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-2">Services & Amenities</p>
                <div className="flex flex-wrap gap-1.5">
                  {lounge.amenities.map((a: { id: string; name: string }) => (
                    <span key={a.id} className="bg-champagne-glint text-sand-dark text-[10px] px-2 py-1 uppercase font-semibold">{a.name}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Access */}
          {lounge.access_types && (lounge.access_types as { type: string; name: string }[]).length > 0 && (
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-sand-dark" style={{ fontSize: '20px' }}>badge</span>
              <div>
                <p className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-2">How to Access</p>
                <div className="space-y-1.5">
                  {(lounge.access_types as { type: string; name: string }[]).slice(0, 4).map((at, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <p className="text-xs text-on-surface">{at.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Guest fee */}
          {lounge.guest_fee && (
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-sand-dark" style={{ fontSize: '20px' }}>payments</span>
              <div>
                <p className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-0.5">Day Pass</p>
                <p className="text-sm font-semibold text-on-surface">${lounge.guest_fee} {lounge.guest_fee_currency}</p>
              </div>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
          <Link
            href={`/airports/${iata}/lounges/${lounge.slug}`}
            onClick={onClose}
            className="flex-1 bg-primary text-white text-center py-3 font-label-caps text-[11px] uppercase tracking-widest hover:opacity-90 transition-all"
          >
            Full Lounge Page
          </Link>
          <Link
            href={`/airports/${iata}/lounges/${lounge.slug}#reviews`}
            onClick={onClose}
            className="flex-1 fine-border text-primary text-center py-3 font-label-caps text-[11px] uppercase tracking-widest hover:bg-champagne-glint transition-all"
          >
            Read Reviews
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Map Modal ────────────────────────────────────────────
function MapModal({ lounge, airport, iata, onClose }: { lounge: Lounge, airport: Airport | undefined, iata: string, onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || !airport?.latitude || !airport?.longitude) return
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [airport.longitude, airport.latitude],
      zoom: 14,
    })
    new mapboxgl.Marker({ color: '#003434' })
      .setLngLat([airport.longitude, airport.latitude])
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<div style="padding:10px;font-family:Inter,sans-serif;font-size:12px;font-weight:600;color:#003434;">${lounge.name}</div>`))
      .addTo(map)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, [airport, lounge.name])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-aviation-navy/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bone-white w-full max-w-2xl editorial-shadow">
        <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-label-caps text-[10px] text-primary-fixed uppercase tracking-widest mb-0.5">{iata}</p>
            <h3 className="font-headline-md text-base">{lounge.name}</h3>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div ref={containerRef} className="w-full" style={{ height: '360px' }} />
        <div className="p-5 flex flex-col sm:flex-row gap-3">
          <p className="text-xs text-secondary flex-1 self-center">
            Satellite view of {airport?.name ?? iata}. Lounge pin is at the airport centre — follow terminal signage on arrival.
          </p>
          <div className="flex gap-3 shrink-0">
            {airport?.terminal_map_url && (
              <a href={airport.terminal_map_url} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-all">
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>open_in_new</span>
                Terminal Map
              </a>
            )}
            <Link href={`/airports/${iata}/lounges/${lounge.slug}`} onClick={onClose}
              className="fine-border text-primary px-5 py-2.5 font-label-caps text-[10px] uppercase tracking-widest hover:bg-champagne-glint transition-all">
              Full Lounge Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────
export default function FeaturedLoungeSection({ lounge, primaryImageUrl }: Props) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [mapOpen,     setMapOpen]     = useState(false)

  const iata = lounge.airport?.iata_code ?? ''

  return (
    <>
      <section className="py-section-gap bg-bone-white">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            {/* Image */}
            <div className="w-full lg:w-3/5 relative group">
              <div className="aspect-[16/9] overflow-hidden">
                {primaryImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={primaryImageUrl} alt={lounge.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary" style={{ fontSize: '72px' }}>local_bar</span>
                  </div>
                )}
              </div>
              <div className="absolute top-6 right-6 bg-bone-white/90 backdrop-blur px-4 py-2 editorial-shadow">
                <span className="font-label-caps text-label-caps text-primary">Verified Data</span>
              </div>
            </div>

            {/* Info */}
            <div className="w-full lg:w-2/5">
              {lounge.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-sand-dark text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-bold text-primary">{lounge.rating.toFixed(1)}</span>
                  <span className="text-sand-dark text-sm">({lounge.review_count.toLocaleString()} Reviews)</span>
                </div>
              )}

              <h2 className="font-headline-lg text-headline-lg text-primary mb-4">{lounge.name}</h2>

              {lounge.airport && (
                <p className="font-label-caps text-label-caps text-sand-dark uppercase mb-4">
                  {lounge.airport.iata_code}
                  {lounge.terminal ? ` • Terminal ${lounge.terminal}` : ''}
                  {lounge.location_detail ? ` • ${lounge.location_detail}` : ''}
                </p>
              )}

              {lounge.description && (
                <p className="text-secondary leading-relaxed mb-8 font-body-lg line-clamp-3">{lounge.description}</p>
              )}

              {/* Primary CTA */}
              <Link
                href={iata ? `/airports/${iata}/lounges/${lounge.slug}` : `/lounges/${lounge.slug}`}
                className="block w-full bg-primary text-on-primary text-center py-4 font-label-caps text-label-caps uppercase tracking-widest hover:opacity-90 transition-all mb-4"
              >
                Visit Lounge Page
              </Link>

              {/* Icon buttons */}
              <div className="grid grid-cols-3 gap-3">
                <Link
                  href={iata ? `/airports/${iata}/lounges/${lounge.slug}#reviews` : '#'}
                  className="fine-border py-4 px-2 hover:bg-champagne-glint transition-all flex flex-col items-center gap-2 text-center"
                >
                  <span className="material-symbols-outlined text-primary">rate_review</span>
                  <span className="font-label-caps text-[10px] uppercase leading-tight">Reviews</span>
                </Link>
                <button
                  onClick={() => setMapOpen(true)}
                  className="fine-border py-4 px-2 hover:bg-champagne-glint transition-all flex flex-col items-center gap-2"
                >
                  <span className="material-symbols-outlined text-primary">map</span>
                  <span className="font-label-caps text-[10px] uppercase">Map</span>
                </button>
                <button
                  onClick={() => setDetailsOpen(true)}
                  className="fine-border py-4 px-2 hover:bg-champagne-glint transition-all flex flex-col items-center gap-2"
                >
                  <span className="material-symbols-outlined text-primary">info</span>
                  <span className="font-label-caps text-[10px] uppercase">Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {detailsOpen && (
        <DetailsModal lounge={lounge} iata={iata} onClose={() => setDetailsOpen(false)} />
      )}
      {mapOpen && (
        <MapModal lounge={lounge} airport={lounge.airport} iata={iata} onClose={() => setMapOpen(false)} />
      )}
    </>
  )
}
