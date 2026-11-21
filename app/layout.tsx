import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import OutboundClickTracker from '@/components/OutboundClickTracker'
import TravelpayoutsDrive from '@/components/TravelpayoutsDrive'

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
    site: '@AirportLoungeca',
    creator: '@AirportLoungeca',
    images: [`${BASE}/opengraph-image`],
  },
  verification: {
    google: 'MqIm81wvmdy1xQCa-LvcLU2-G55iu3uAAxBrpBGwv4k',
    // Impact.com affiliate-network domain verification. Emitted as
    //   <meta name="impact-site-verification" value="…">
    // via Next.js's Metadata API `other` bag (site-specific verifier keys).
    other: {
      // Impact.com publisher site verification for the original general
      // publisher application. The TuGo-labeled tag (2949c39...) was removed
      // 2026-10-27 — TuGo's affiliate program runs on PartnerStack, not
      // Impact, so that verification was never doing attribution for TuGo.
      'impact-site-verification': 'ead76e99-a37c-4586-ad88-09e3af0c3c5e',
    },
  },
  icons: {
    // Small-size PNG is listed FIRST so browsers that honour order pick it
    // for the SERP/tab slot at 16–48px — the thin strokes of the wordmark
    // collapsed to a gold smudge at those sizes before the simplified mark
    // was introduced.
    icon: [
      { url: '/favicon-48x48.png',    type: 'image/png',     sizes: '48x48' },
      { url: '/favicon-96x96.png',    type: 'image/png',     sizes: '96x96' },
      { url: '/favicon.ico',          sizes: 'any' },
      { url: '/favicon.svg',          type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AirportLounges.ca',
  url: BASE,
  // Google wants the publisher logo at a minimum of 112×112 and prefers a
  // PNG/JPG. The ICO's largest frame is only 48×48 and the SVG ships as
  // a multi-megabyte asset; the 512 PNG is the right primary logo. Keep
  // the URL stable — do not rename the file.
  logo: `${BASE}/icon-512.png`,
  description: 'Canada\'s airport lounge directory — verified lounge data, access requirements, amenities, and traveller reviews for all major Canadian airports.',
  sameAs: [
    'https://twitter.com/AirportLoungeca',
    'https://x.com/AirportLoungeca',
  ],
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
    <html
      lang="en-CA"
      className="scroll-smooth"
      // Prevent Google Translate / Chrome auto-translate from wrapping text
      // nodes in <font> elements — the number-one cause of React 19 hydration
      // NotFoundError events in production. Combined with the Sentry ignore
      // filter, this cuts extension-related noise to near zero.
      translate="no"
      suppressHydrationWarning
    >
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
        {/* Travelpayouts AI Drive — gated by NEXT_PUBLIC_TRAVELPAYOUTS_DRIVE_ID.
            In <head> so their install verifier finds it on server-rendered HTML.
            Kill switch: remove the env var in Vercel. */}
        <TravelpayoutsDrive />
        {/* Ahrefs Web Analytics — must live inside <head> for Ahrefs's
            "Recheck installation" verifier to pick it up (the verifier
            server-side-fetches the page and scans only the <head> block).
            Raw <script> here rather than next/script so the server-
            rendered HTML carries it in <head> on the first byte. Async
            so it never blocks render. `data-key` is public by design. */}
        <script
          async
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="VeqcVcUujHD/yvev7a1oNw"
        />
      </head>
      <body className="bg-bone-white text-on-surface font-body-md transition-colors duration-300">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <OutboundClickTracker />
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
