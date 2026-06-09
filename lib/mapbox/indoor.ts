import type mapboxgl from 'mapbox-gl'

// Canadian airports covered by mapbox.indoor-v3 (verified June 2026)
export const INDOOR_COVERED = new Set(['YVR', 'YYZ', 'YUL', 'YEG', 'YOW', 'YWG', 'YHZ'])

// Mapbox indoor facility IDs decoded from indoor-v3 tiles
export const FACILITY_IDS: Record<string, string> = {
  YVR: '85dc8d6522994faab24de662',
  YYZ: '673190da446b45f38fcb30ce',
  YUL: '10e6a1e7d2594f52b7322029',
}

// Minimum zoom level to trigger indoor floor plan rendering
export const INDOOR_ZOOM = 17.5

export interface IndoorFloor {
  id: string
  description: string
  level: number
}

export interface IndoorManager {
  floors: IndoorFloor[]
  selectedFloor: IndoorFloor | null
  setFloor: (id: string) => void
}

export function getIndoorManager(map: mapboxgl.Map): IndoorManager | null {
  // map.indoor is available in Mapbox GL JS v3.6+
  return (map as unknown as { indoor?: IndoorManager }).indoor ?? null
}

export function enableIndoor(map: mapboxgl.Map) {
  map.setConfigProperty('basemap', 'showIndoor', true)
  map.setConfigProperty('basemap', 'showIndoorLabels', true)
}
