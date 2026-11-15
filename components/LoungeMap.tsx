'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import MapUnavailable from '@/components/MapUnavailable'

interface Props {
  latitude: number
  longitude: number
  name: string
  zoom?: number
}

export default function LoungeMap({ latitude, longitude, name, zoom = 14 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<mapboxgl.Map | null>(null)
  const [mapFailed, setMapFailed] = useState(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

    let map: mapboxgl.Map | null = null
    try {
      const created = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [longitude, latitude],
        zoom,
      })
      map = created

      new mapboxgl.Marker({ color: '#1e3ff5' })
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<div class="p-3 font-medium text-sm">${name}</div>`))
        .addTo(created)

      created.addControl(new mapboxgl.NavigationControl(), 'top-right')
      mapRef.current = created
    } catch {
      // Device has no WebGL. Not an application bug — do not report it.
      setMapFailed(true)
      if (map) {
        try { map.remove() } catch { /* ignore */ }
        map = null
      } else {
        containerRef.current?.replaceChildren()
      }
      mapRef.current = null
    }

    return () => {
      if (map) {
        map.remove()
        mapRef.current = null
      }
    }
  }, [latitude, longitude, name, zoom])

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
      {mapFailed && (
        <MapUnavailable lat={latitude} lng={longitude} className="absolute inset-0" />
      )}
    </div>
  )
}
