import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const BASE = 'https://www.airportlounges.ca'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'AirportLounges.ca | Find the right lounge before you reach the gate.',
    template: '%s | AirportLounges.ca',
  },
  description: 'Search by airport, terminal, access card, or amenity. Verified lounge data, terminal maps, and real traveller reviews for a seamless transit experience.',
  keywords: ['airport lounge', 'Canada', 'Priority Pass', 'Air Canada Maple Leaf', 'Plaza Premium', 'lounge access', 'credit card lounge', 'terminal map'],
  alternates: {
    canonical: BASE,
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'AirportLounges.ca',
    url: BASE,
    images: [
      {
        url: `${BASE}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'AirportLounges.ca — Find the right airport lounge before you reach the gate.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Airportloungeca',
    creator: '@Airportloungeca',
    images: [`${BASE}/opengraph-image`],
  },
  verification: {
    google: 'MqIm81wvmdy1xQCa-LvcLU2-G55iu3uAAxBrpBGwv4k',
  },
  icons: {
    icon: [
      { url: '/favicon.ico',          sizes: 'any' },
      { url: '/favicon.svg',          type: 'image/svg+xml' },
      { url: '/favicon-96x96.png',    type: 'image/png', sizes: '96x96' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AirportLounges.ca',
  url: BASE,
  logo: `${BASE}/favicon.ico`,
  description: 'Canada\'s airport lounge directory — verified lounge data, access requirements, amenities, and traveller reviews for all major Canadian airports.',
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'hello@airportlounges.ca',
    availableLanguage: 'English',
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AirportLounges.ca',
  url: BASE,
  description: 'Find every airport lounge in Canada — access requirements, amenities, hours, and reviews.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE}/lounges?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v3.10.0/mapbox-gl.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="bg-bone-white text-on-surface font-body-md transition-colors duration-300">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-FM95J545RS" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-FM95J545RS');
        `}</Script>
      </body>
    </html>
  )
}
