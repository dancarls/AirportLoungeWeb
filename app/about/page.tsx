import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'About AirportLounges.ca — Who We Are & How We Verify Lounge Data',
  description: 'AirportLounges.ca is an independent Canadian directory of airport lounges. Learn who runs the site, how we verify lounge access requirements and amenities, and how often we update.',
  alternates: { canonical: 'https://www.airportlounges.ca/about' },
  openGraph: {
    title: 'About AirportLounges.ca',
    description: 'Independent Canadian airport lounge directory — sourcing methodology and editorial standards.',
    url: 'https://www.airportlounges.ca/about',
  },
}

export const revalidate = 3600

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AirportLounges.ca',
  url: 'https://www.airportlounges.ca',
  logo: 'https://www.airportlounges.ca/icon-512.png',
  description: 'Canada\'s independent airport lounge directory — verified access requirements, amenities, opening hours, and traveller reviews for every major Canadian airport.',
  foundingDate: '2025',
  areaServed: { '@type': 'Country', name: 'Canada' },
  knowsAbout: [
    'Airport lounges',
    'Priority Pass',
    'Air Canada Maple Leaf Lounge',
    'Plaza Premium Lounge',
    'DragonPass',
    'Star Alliance Gold',
    'Aspire Lounge',
    'Desjardins Odyssey Lounge',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'hello@airportlounges.ca',
    availableLanguage: 'English',
  },
}

export default async function AboutPage() {
  const supabase = await createClient()
  const [{ count: loungeCount }, { count: airportCount }] = await Promise.all([
    supabase.from('lounges').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('airports').select('*', { count: 'exact', head: true }).eq('is_active', true),
  ])

  return (
    <div className="bg-bone-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />

      <section className="max-w-3xl mx-auto px-gutter py-section-gap">
        <nav className="flex items-center gap-2 mb-8 text-xs text-secondary">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>›</span>
          <span className="text-primary font-medium">About</span>
        </nav>

        <span className="font-label-caps text-label-caps text-primary block mb-3">
          INDEPENDENT · CANADIAN · EDITORIALLY VERIFIED
        </span>
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary leading-tight mb-8">
          About AirportLounges.ca
        </h1>

        <div className="space-y-10 font-body-lg text-on-surface-variant leading-relaxed">
          <p className="text-lg">
            AirportLounges.ca is an independent directory of {loungeCount ?? 50}+ verified airport
            lounges across {airportCount ?? 13} major Canadian airports. We exist to make one decision easier:
            <strong className="text-on-surface"> which lounge can you actually get into today, and is it worth your time?</strong>
          </p>

          <div id="who" className="border-l-2 border-champagne-glint pl-6">
            <h2 className="font-headline-md text-headline-md text-primary mb-3">Who runs the site</h2>
            <p>
              AirportLounges.ca is independently operated from Canada and is not affiliated with
              Air Canada, Plaza Premium, Priority Pass, DragonPass, Aspire, Desjardins, or any
              other lounge operator or airline. We accept no payment from lounge operators in
              exchange for editorial coverage. Affiliate links to third-party membership programs
              (e.g. Priority Pass) are clearly disclosed and never influence which lounges we
              list or how we describe them.
            </p>
          </div>

          <div id="sourcing" className="border-l-2 border-champagne-glint pl-6">
            <h2 className="font-headline-md text-headline-md text-primary mb-3">How we verify lounge data</h2>
            <p className="mb-4">
              Every lounge listing is built from a combination of:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong className="text-on-surface">Operator websites</strong> — Air Canada Maple
                Leaf Lounge, Plaza Premium Group, Aspire, Desjardins, and airline lounge pages
                are checked for the canonical opening hours and access policy.
              </li>
              <li>
                <strong className="text-on-surface">Airport authority publications</strong> —
                YVR, GTAA, ADM, Calgary Airport Authority, Ottawa Airport Authority, and others
                publish terminal maps that locate each lounge to a specific pier and gate.
              </li>
              <li>
                <strong className="text-on-surface">Direct traveller reports</strong> — submitted
                reviews and corrections from members. We don&apos;t republish reviews without
                consent and we don&apos;t pay for reviews.
              </li>
              <li>
                <strong className="text-on-surface">On-the-ground verification</strong> for the
                lounge coordinates shown on our terminal maps.
              </li>
            </ul>
            <p>
              When operator information conflicts with traveller reports, we flag the lounge
              page with a notice and reach out to the operator for clarification.
            </p>
          </div>

          <div id="cadence" className="border-l-2 border-champagne-glint pl-6">
            <h2 className="font-headline-md text-headline-md text-primary mb-3">Update cadence</h2>
            <p>
              Lounge data is revalidated on the site every 5 minutes from our editorial database.
              Major operational changes — closures, renovations, access policy changes — are
              reflected within 24 hours of confirmation. Each lounge page shows a
              <em> &ldquo;Last verified&rdquo;</em> date so you know how fresh the listing is.
            </p>
          </div>

          <div id="corrections" className="border-l-2 border-champagne-glint pl-6">
            <h2 className="font-headline-md text-headline-md text-primary mb-3">Corrections &amp; contact</h2>
            <p>
              Spotted an error, closed door, or outdated hours? Email
              {' '}
              <a className="text-primary underline underline-offset-2 hover:no-underline" href="mailto:hello@airportlounges.ca">
                hello@airportlounges.ca
              </a>
              {' '}with the lounge name, what you saw, and the date — we update the same week.
            </p>
          </div>

          <div id="data" className="border-l-2 border-champagne-glint pl-6">
            <h2 className="font-headline-md text-headline-md text-primary mb-3">Open data for AI &amp; researchers</h2>
            <p className="mb-3">
              We publish an{' '}
              <Link href="/llms.txt" className="text-primary underline underline-offset-2 hover:no-underline">
                llms.txt
              </Link>
              {' '}index aimed at AI search systems (ChatGPT, Claude, Perplexity, Google AI Overviews)
              so they can cite accurate Canadian airport lounge information.
            </p>
            <p>
              We also publish a{' '}
              <Link href="/sitemap.xml" className="text-primary underline underline-offset-2 hover:no-underline">
                sitemap
              </Link>
              {' '}with all {airportCount ?? 13} airport hubs and every active lounge.
            </p>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-sand-dark/10 flex flex-wrap gap-4">
          <Link
            href="/airports"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 font-label-caps text-[11px] uppercase tracking-widest hover:opacity-90 transition-all"
          >
            Browse All Airports
          </Link>
          <Link
            href="/lounges"
            className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-4 font-label-caps text-[11px] uppercase tracking-widest hover:bg-primary/5 transition-all"
          >
            All Lounges
          </Link>
        </div>
      </section>
    </div>
  )
}
