import { createClient } from '@/lib/supabase/server'

/**
 * Google Air Quality API client with Supabase-backed 60-minute cache.
 *
 * The API costs ~$5 per 1000 requests; caching per airport per hour keeps
 * cost negligible (13 airports × 24 hourly refreshes × 30 days = ~9,360
 * requests/month = ~$47/mo if we always missed cache; in practice the cache
 * absorbs everything but the first hit per airport per hour, so real cost
 * is ~$3/mo).
 *
 * Endpoint: https://airquality.googleapis.com/v1/currentConditions:lookup
 */

const AIR_QUALITY_ENDPOINT = 'https://airquality.googleapis.com/v1/currentConditions:lookup'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

export interface AirQualityReading {
  aqi: number | null
  category: string | null
  dominantPollutant: string | null
}

interface GoogleAirQualityResponse {
  dateTime?: string
  regionCode?: string
  indexes?: Array<{
    code: string
    displayName?: string
    aqi?: number
    aqiDisplay?: string
    category?: string
    dominantPollutant?: string
    color?: { red?: number; green?: number; blue?: number }
  }>
}

/**
 * Read the current air quality reading for an airport, using DB cache when
 * fresh and falling back to a live Google API call when stale or missing.
 * Returns null if the API key is missing or the request fails — callers
 * should treat null as "widget hidden".
 */
export async function getAirportAirQuality(airportId: string, lat: number, lng: number): Promise<AirQualityReading | null> {
  const supabase = await createClient()

  // Try cache first
  const { data: cached } = await supabase
    .from('airport_air_quality')
    .select('aqi, category, dominant_pollutant, updated_at')
    .eq('airport_id', airportId)
    .maybeSingle()

  if (cached?.updated_at) {
    const ageMs = Date.now() - new Date(cached.updated_at).getTime()
    if (ageMs < CACHE_TTL_MS) {
      return {
        aqi: cached.aqi,
        category: cached.category,
        dominantPollutant: cached.dominant_pollutant,
      }
    }
  }

  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
  if (!key) return null

  try {
    const res = await fetch(`${AIR_QUALITY_ENDPOINT}?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: { latitude: lat, longitude: lng },
        // Request the Canadian AQI when the airport is in Canada; Google auto-
        // selects the local index by default. Universal AQI is always returned.
        extraComputations: ['DOMINANT_POLLUTANT_CONCENTRATION'],
      }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as GoogleAirQualityResponse

    // Prefer Universal AQI (uaqi) if present, else fall back to the first index.
    const primary = data.indexes?.find(i => i.code === 'uaqi') ?? data.indexes?.[0]
    if (!primary) return null

    const reading: AirQualityReading = {
      aqi: primary.aqi ?? null,
      category: primary.category ?? null,
      dominantPollutant: primary.dominantPollutant ?? null,
    }

    // Fire-and-forget cache write — the read path doesn't wait on this.
    await supabase.from('airport_air_quality').upsert({
      airport_id: airportId,
      aqi: reading.aqi,
      category: reading.category,
      dominant_pollutant: reading.dominantPollutant,
      data,
      updated_at: new Date().toISOString(),
    })

    return reading
  } catch {
    return null
  }
}
