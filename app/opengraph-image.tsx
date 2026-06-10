import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AirportLounges.ca — Find the right airport lounge before you reach the gate.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OG() {
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
        <div style={{ fontSize: 28, letterSpacing: 8, color: '#C9A96E', textTransform: 'uppercase', marginBottom: 40 }}>
          AirportLounges.ca
        </div>
        <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1.05, maxWidth: 1000 }}>
          Find the right lounge before you reach the gate.
        </div>
        <div style={{ display: 'flex', marginTop: 'auto', fontSize: 28, color: '#C9A96E', gap: 40 }}>
          <span>13 Canadian airports</span>
          <span>·</span>
          <span>50+ verified lounges</span>
          <span>·</span>
          <span>Priority Pass · Maple Leaf · Plaza Premium</span>
        </div>
      </div>
    ),
    size,
  )
}
