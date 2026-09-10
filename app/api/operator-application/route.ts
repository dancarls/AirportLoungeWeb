import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { createClient } from '@/lib/supabase/server'

const RATE_LIMIT_MS = 30_000
const seen = new Map<string, number>()

function hashIp(ip: string | null): string {
  if (!ip) return 'unknown'
  return createHash('sha256').update(ip).digest('hex').slice(0, 32)
}

function str(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null
  const s = v.trim()
  if (!s) return null
  return s.slice(0, max)
}

function validEmail(input: unknown): input is string {
  if (typeof input !== 'string') return false
  const s = input.trim().toLowerCase()
  return s.length >= 6 && s.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)
}

const VALID_TIERS = new Set(['basic', 'enhanced', 'featured'])

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const loungeName = str(body.lounge_name, 200)
  const operatorCompany = str(body.operator_company, 200)
  const contactName = str(body.contact_name, 200)
  const contactEmail = validEmail(body.contact_email) ? (body.contact_email as string).trim().toLowerCase() : null
  const contactPhone = str(body.contact_phone, 60)
  const airportIata = str(body.airport_iata, 8)?.toUpperCase() ?? null
  const message = str(body.message, 4000)
  const tierRaw = str(body.tier_requested, 30)?.toLowerCase() ?? 'basic'
  const tierRequested = VALID_TIERS.has(tierRaw) ? tierRaw : 'basic'
  const referrerUrl = typeof body.referrer_url === 'string' && body.referrer_url.length <= 2048
    ? body.referrer_url
    : null

  if (!loungeName || !operatorCompany || !contactName || !contactEmail) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  const ipHash = hashIp(ip)
  const now = Date.now()
  const last = seen.get(ipHash)
  if (last && now - last < RATE_LIMIT_MS) {
    return NextResponse.json({ error: 'Please wait a moment before submitting again.' }, { status: 429 })
  }
  seen.set(ipHash, now)

  const supabase = await createClient()
  const { error } = await supabase.from('operator_applications').insert({
    lounge_name: loungeName,
    airport_iata: airportIata,
    operator_company: operatorCompany,
    contact_name: contactName,
    contact_email: contactEmail,
    contact_phone: contactPhone,
    tier_requested: tierRequested,
    message,
    referrer_url: referrerUrl,
  })

  if (error) {
    console.error('operator application failed', { code: error.code, message: error.message })
    return NextResponse.json({ error: 'Could not save that — please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
