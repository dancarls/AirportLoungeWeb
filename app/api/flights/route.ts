import { NextRequest, NextResponse } from 'next/server'
import { getFlightStatus } from '@/lib/flights'

export async function GET(request: NextRequest) {
  const flight = request.nextUrl.searchParams.get('flight')
  if (!flight) return NextResponse.json({ error: 'Missing flight parameter' }, { status: 400 })

  const data = await getFlightStatus(flight)
  if (!data) return NextResponse.json({ error: 'Flight not found' }, { status: 404 })

  return NextResponse.json(data)
}
