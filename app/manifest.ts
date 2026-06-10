import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AirportLounges.ca',
    short_name: 'Lounges',
    description: 'Find the right Canadian airport lounge before you reach the gate.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5EFE6',
    theme_color: '#003434',
    orientation: 'portrait',
    categories: ['travel', 'lifestyle'],
    icons: [
      { src: '/icon-192.png',          sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png',          sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/apple-touch-icon.png',  sizes: '180x180', type: 'image/png' },
    ],
  }
}
