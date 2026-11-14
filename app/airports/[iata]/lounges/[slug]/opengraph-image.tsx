import { ImageResponse } from 'next/og'
import { db } from '@/lib/db'

// nodejs runtime required — the postgres driver uses native TCP+TLS which
// isn't available on the Edge runtime. OG image generation is crawler-only
// and not latency-critical, so nodejs is fine here.
export const runtime = 'nodejs'
export const alt = 'Airport lounge details — AirportLounges.ca'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props { params: { iata: string; slug: string } }

interface OGRow {
  name: string
  terminal: string | null
  rating: number | null
  review_count: number | null
  airport_name: string | null
  airport_city: string | null
}

export default async function OG({ params }: Props) {
  const { iata, slug } = params
  const code = iata.toUpperCase()

  let title  = 'Airport Lounge'
  let sub    = `${code} • AirportLounges.ca`
  let rating = ''

  try {
    const rows = await db<OGRow[]>`
      SELECT l.name, l.terminal, l.rating, l.review_count,
        a.name AS airport_name, a.city AS airport_city
      FROM lounges l
      LEFT JOIN airports a ON a.id = l.airport_id
      WHERE l.slug = ${slug}
      ORDER BY l.id ASC
      LIMIT 1
    `
    const data = rows[0]
    if (data) {
      title = data.name
      sub = data.airport_city
        ? `${code} • ${data.airport_city}${data.terminal ? ` • Terminal ${data.terminal}` : ''}`
        : `${code} ${data.terminal ? `• Terminal ${data.terminal}` : ''}`
      if (data.rating) {
        rating = `★ ${Number(data.rating).toFixed(1)}${data.review_count ? ` · ${data.review_count} review${data.review_count !== 1 ? 's' : ''}` : ''}`
      }
    }
  } catch (err) {
    console.error('OG lookup failed', err)
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #003434 0%, #00504e 100%)',
          color: '#F5EFE6',
          padding: '80px',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 8, color: '#C9A96E', textTransform: 'uppercase', marginBottom: 24 }}>
          AirportLounges.ca
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, maxWidth: 1040 }}>
          {title}
        </div>
        <div style={{ fontSize: 30, color: '#F5EFE6', opacity: 0.85, marginTop: 28 }}>
          {sub}
        </div>
        {rating && (
          <div style={{ fontSize: 28, color: '#C9A96E', marginTop: 20 }}>{rating}</div>
        )}
        <div style={{ display: 'flex', marginTop: 'auto', fontSize: 22, color: '#C9A96E', gap: 24 }}>
          <span>Verified access</span>
          <span>·</span>
          <span>Amenities</span>
          <span>·</span>
          <span>Opening hours</span>
          <span>·</span>
          <span>Reviews</span>
        </div>
      </div>
    ),
    size,
  )
}
