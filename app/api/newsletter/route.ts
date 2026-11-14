import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { db } from '@/lib/db'

interface PgError extends Error {
  code?: string
}

// Rudimentary in-memory rate limit — one submission per IP hash per 60 seconds.
// The 'idle when no traffic' Vercel function lifecycle means this resets
// naturally; a dedicated store (Upstash, KV) is only needed at real scale.
const RATE_LIMIT_MS = 60_000
const seen = new Map<string, number>()

function hashIp(ip: string | null): string {
  if (!ip) return 'unknown'
  return createHash('sha256').update(ip).digest('hex').slice(0, 32)
}

function validEmail(input: unknown): input is string {
  if (typeof input !== 'string') return false
  const s = input.trim().toLowerCase()
  // Permissive RFC-ish check — the source of truth is a delivery attempt.
  return s.length >= 6 && s.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)
}

export async function POST(req: NextRequest) {
  let body: { email?: unknown; source?: unknown; referrer_url?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!validEmail(body.email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  const email = (body.email as string).trim().toLowerCase()

  const source = typeof body.source === 'string' && body.source.length <= 128
    ? body.source
    : 'unknown'
  const referrerUrl = typeof body.referrer_url === 'string' && body.referrer_url.length <= 2048
    ? body.referrer_url
    : null

  // IP is read from the standard Vercel/Cloudflare header. We hash before storing.
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? null
  const ipHash = hashIp(ip)

  const now = Date.now()
  const last = seen.get(ipHash)
  if (last && now - last < RATE_LIMIT_MS) {
    return NextResponse.json({ error: 'Please wait a moment before trying again.' }, { status: 429 })
  }
  seen.set(ipHash, now)

  const userAgent = req.headers.get('user-agent')?.slice(0, 512) ?? null

  try {
    await db`
      INSERT INTO newsletter_subscribers
        (email, source, referrer_url, user_agent, ip_hash)
      VALUES
        (${email}, ${source}, ${referrerUrl}, ${userAgent}, ${ipHash})
    `
  } catch (err) {
    const pgErr = err as PgError
    // Postgres unique_violation code 23505 → email is already on the list.
    if (pgErr.code === '23505') {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 409 })
    }
    console.error('newsletter subscribe failed', { code: pgErr.code, message: pgErr.message })
    return NextResponse.json({ error: 'Could not save that — please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
