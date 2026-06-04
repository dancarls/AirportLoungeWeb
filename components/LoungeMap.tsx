'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

interface Props {
  latitude: number
  longitude: number
  name: string
  zoom?: number
}

export default function LoungeMap({ latitude, longitude, name, zoom = 14 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom,
    })

    new mapboxgl.Marker({ color: '#1e3ff5' })
      .setLngLat([longitude, latitude])
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<div class="p-3 font-medium text-sm">${name}</div>`))
      .addTo(map)

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    mapRef.current = map

    return () => { map.remove(); mapRef.current = null }
  }, [latitude, longitude, name, zoom])

  return <div ref={containerRef} className="w-full h-64 rounded-xl overflow-hidden" />
}
