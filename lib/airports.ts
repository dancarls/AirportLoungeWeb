// AirportDB — free, no auth required
// https://airportdb.io/

export interface AirportDBResult {
  iata_code: string
  name: string
  municipality: string
  iso_country: string
  latitude_deg: number
  longitude_deg: number
  elevation_ft: number | null
  wikipedia_link: string | null
  home_link: string | null
}

const CACHE = new Map<string, AirportDBResult>()

export async function getAirportInfo(iataCode: string): Promise<AirportDBResult | null> {
  const code = iataCode.toUpperCase()
  if (CACHE.has(code)) return CACHE.get(code)!

  try {
    const res = await fetch(
      `https://airportdb.io/api/v1/airport/${code}?apiToken=`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    CACHE.set(code, data)
    return data
  } catch {
    return null
  }
}
