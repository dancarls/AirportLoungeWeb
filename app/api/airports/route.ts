import { NextRequest, NextResponse } from 'next/server'
import { getAirportDepartures } from '@/lib/flights'

export async function GET(request: NextRequest) {
  const iata = request.nextUrl.searchParams.get('iata')
  if (!iata) return NextResponse.json({ error: 'Missing iata parameter' }, { status: 400 })

  const departures = await getAirportDepartures(iata.toUpperCase())
  return NextResponse.json(departures)
}
