import type { FlightStatus } from './types'

const BASE = 'https://aerodatabox.p.rapidapi.com'
const HEADERS = {
  'x-rapidapi-host': 'aerodatabox.p.rapidapi.com',
  'x-rapidapi-key': process.env.AERODATABOX_API_KEY!,
}

export async function getFlightStatus(flightNumber: string): Promise<FlightStatus | null> {
  const today = new Date().toISOString().split('T')[0]
  const url = `${BASE}/flights/number/${encodeURIComponent(flightNumber)}/${today}`

  const res = await fetch(url, { headers: HEADERS, next: { revalidate: 60 } })
  if (!res.ok) return null

  const data = await res.json()
  const flight = Array.isArray(data) ? data[0] : data
  if (!flight) return null

  return {
    flightNumber: flight.number ?? flightNumber,
    airline: flight.airline?.name ?? '',
    status: flight.status ?? 'Unknown',
    departure: {
      airport: flight.departure?.airport?.name ?? '',
      iata: flight.departure?.airport?.iata ?? '',
      scheduledTime: flight.departure?.scheduledTime?.local ?? '',
      actualTime: flight.departure?.actualTime?.local ?? null,
      estimatedTime: flight.departure?.revisedTime?.local ?? null,
      gate: flight.departure?.gate ?? null,
      terminal: flight.departure?.terminal ?? null,
      delay: flight.departure?.delay ?? null,
    },
    arrival: {
      airport: flight.arrival?.airport?.name ?? '',
      iata: flight.arrival?.airport?.iata ?? '',
      scheduledTime: flight.arrival?.scheduledTime?.local ?? '',
      actualTime: flight.arrival?.actualTime?.local ?? null,
      estimatedTime: flight.arrival?.revisedTime?.local ?? null,
      gate: flight.arrival?.gate ?? null,
      terminal: flight.arrival?.terminal ?? null,
      delay: flight.arrival?.delay ?? null,
    },
    aircraft: flight.aircraft?.model ?? null,
  }
}

export async function getAirportDepartures(iataCode: string): Promise<FlightStatus[]> {
  const now = new Date()
  const from = now.toISOString().replace('T', ' ').substring(0, 16)
  const to = new Date(now.getTime() + 2 * 60 * 60 * 1000)
    .toISOString().replace('T', ' ').substring(0, 16)

  const url = `${BASE}/flights/airports/iata/${iataCode}/${encodeURIComponent(from)}/${encodeURIComponent(to)}?direction=Departure&withLeg=false&withCancelled=true&withCodeshared=false&withCargo=false&withPrivate=false`

  const res = await fetch(url, { headers: HEADERS, next: { revalidate: 120 } })
  if (!res.ok) return []

  const data = await res.json()
  const departures = data.departures ?? []

  return departures.slice(0, 20).map((f: Record<string, unknown>) => {
    const dep = f.departure as Record<string, unknown> ?? {}
    const arr = f.arrival as Record<string, unknown> ?? {}
    const airline = f.airline as Record<string, unknown> ?? {}
    const depSched = dep.scheduledTime as Record<string, unknown> ?? {}
    const depActual = dep.actualTime as Record<string, unknown> ?? {}
    const depRevised = dep.revisedTime as Record<string, unknown> ?? {}
    const arrSched = arr.scheduledTime as Record<string, unknown> ?? {}
    const arrAirport = arr.airport as Record<string, unknown> ?? {}
    return {
      flightNumber: String(f.number ?? ''),
      airline: String(airline.name ?? ''),
      status: String(f.status ?? 'Scheduled'),
      departure: {
        airport: iataCode,
        iata: iataCode,
        scheduledTime: String(depSched.local ?? ''),
        actualTime: (depActual.local as string) ?? null,
        estimatedTime: (depRevised.local as string) ?? null,
        gate: (dep.gate as string) ?? null,
        terminal: (dep.terminal as string) ?? null,
        delay: (dep.delay as number) ?? null,
      },
      arrival: {
        airport: String(arrAirport.name ?? ''),
        iata: String(arrAirport.iata ?? ''),
        scheduledTime: String(arrSched.local ?? ''),
        actualTime: null,
        estimatedTime: null,
        gate: null,
        terminal: null,
        delay: null,
      },
      aircraft: null,
    }
  })
}
