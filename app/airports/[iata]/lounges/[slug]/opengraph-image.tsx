import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const alt = 'Airport lounge details — AirportLounges.ca'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props { params: { iata: string; slug: string } }

export default async function OG({ params }: Props) {
  const { iata, slug } = params
  const code = iata.toUpperCase()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let title  = 'Airport Lounge'
  let sub    = `${code} • AirportLounges.ca`
  let rating = ''

  if (url && key) {
    const sb = createClient(url, key)
    const { data } = await sb
      .from('lounges')
      .select('name, terminal, rating, review_count, airport:airports(name, city)')
      .eq('slug', slug)
      .single()

    if (data) {
      const airport = data.airport as unknown as { name: string; city: string } | null
      title = data.name
      sub = airport
        ? `${code} • ${airport.city}${data.terminal ? ` • Terminal ${data.terminal}` : ''}`
        : `${code} ${data.terminal ? `• Terminal ${data.terminal}` : ''}`
      if (data.rating) {
        rating = `★ ${Number(data.rating).toFixed(1)}${data.review_count ? ` · ${data.review_count} review${data.review_count !== 1 ? 's' : ''}` : ''}`
      }
    }
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
