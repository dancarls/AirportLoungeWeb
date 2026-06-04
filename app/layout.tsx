import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Airport Lounges Canada — Find & Review Airport Lounges',
    template: '%s | Airport Lounges Canada',
  },
  description: 'Discover airport lounges across Canada. Find which credit cards, airline status, and memberships get you in. Read real reviews, check amenities, and track your flight.',
  keywords: ['airport lounge', 'Canada', 'Priority Pass', 'Air Canada Maple Leaf', 'Plaza Premium', 'lounge access', 'credit card lounge'],
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'Airport Lounges Canada',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v3.10.0/mapbox-gl.css" />
      </head>
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
