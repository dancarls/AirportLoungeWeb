import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LoungeGrid from '@/components/LoungeGrid'
import { COLLECTIONS } from '@/lib/collections'
import { affiliate, AFFILIATE_REL } from '@/lib/affiliates'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Canadian Airport Lounges — All Access Passes, Cards & Amenities',
  description: 'Every airport lounge in Canada in one directory. Filter by Priority Pass, DragonPass, Air Canada Altitude, credit card, amenity, or airport. Verified access rules, hours, and traveller reviews — updated daily.',
  alternates: { canonical: 'https://www.airportlounges.ca/lounges' },
}
export const revalidate = 300

export default async function LoungesPage() {
  const supabase = await createClient()

  const [{ data: lounges }, { data: airports }] = await Promise.all([
    supabase
      .from('lounges')
      .select('*, airport:airports(name, iata_code, city), amenities(*), images:lounge_images(*)')
      .eq('is_active', true)
      .order('name'),
    supabase
      .from('airports')
      .select('iata_code, name')
      .eq('is_active', true)
      .order('name'),
  ])

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',    item: 'https://www.airportlounges.ca' },
      { '@type': 'ListItem', position: 2, name: 'Lounges', item: 'https://www.airportlounges.ca/lounges' },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many airport lounges are there in Canada?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `AirportLounges.ca tracks ${lounges?.length ?? 0} active airport lounges across ${airports?.length ?? 0} major Canadian airports. Every lounge is verified with current access requirements, opening hours, terminal location, and amenities.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Can I get into a Canadian airport lounge without a membership?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Most Plaza Premium, Aspire, and independent lounges in Canada sell a walk-up day pass (typically CAD $45–$75) when space allows. Air Canada Maple Leaf Lounges do not sell walk-up passes — access requires eligible airline status, ticket class, or a supporting credit card. Use the "Day pass" filter to see every lounge with walk-in availability.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which credit cards give free airport lounge access in Canada?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The most common cards granting Canadian lounge access are American Express Platinum (Centurion/Priority Pass), Amex Aeroplan Reserve (Maple Leaf Lounge on Air Canada flights), TD Aeroplan Visa Infinite Privilege (Maple Leaf Lounge passes), CIBC Aeroplan Visa Infinite Privilege, RBC Avion Visa Infinite Privilege (DragonPass), and HSBC World Elite Mastercard (Priority Pass). Filter by "Access pass" to see every lounge each card unlocks.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best airport lounge in Canada?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'By traveller rating the Air Canada Signature Suite at YYZ Terminal 1 is Canada\'s top-rated lounge (invitation-only, for international business class). Among broadly accessible lounges, the Plaza Premium First at YVR International, Plaza Premium International at YYZ T1, and the Air Canada Maple Leaf Lounge (International) at YYZ T1 consistently score highest. Sort this directory by rating to see current rankings.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do all Canadian airports have airport lounges?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every major Canadian hub (YYZ, YVR, YUL, YYC, YEG, YOW, YWG, YHZ, YYT, YXE, YQR, YQB, YTZ) has at least one lounge. Smaller regional airports typically do not. YHZ (Halifax) is currently without a lounge — the Air Canada Maple Leaf Lounge is closed for renovation until early 2027.',
        },
      },
    ],
  }

  const datasetLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Canadian Airport Lounges Directory',
    description: `A verified, regularly updated directory of ${lounges?.length ?? 0} airport lounges across ${airports?.length ?? 0} major Canadian airports — including access requirements (Priority Pass, DragonPass, Air Canada Altitude, credit cards, day passes), amenities, opening hours, terminal/gate locations, and traveller reviews.`,
    url: 'https://www.airportlounges.ca/lounges',
    keywords: [
      'airport lounge', 'Canada', 'Priority Pass', 'DragonPass',
      'Air Canada Maple Leaf Lounge', 'Plaza Premium', 'Aspire Lounge',
      'Desjardins Odyssey', 'lounge access', 'credit card lounge',
    ],
    creator: {
      '@type': 'Organization',
      name: 'AirportLounges.ca',
      url: 'https://www.airportlounges.ca',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AirportLounges.ca',
      url: 'https://www.airportlounges.ca',
    },
    isAccessibleForFree: true,
    license: 'https://www.airportlounges.ca/terms',
    spatialCoverage: { '@type': 'Country', name: 'Canada' },
    distribution: [
      { '@type': 'DataDownload', encodingFormat: 'text/html', contentUrl: 'https://www.airportlounges.ca/lounges' },
      { '@type': 'DataDownload', encodingFormat: 'application/xml', contentUrl: 'https://www.airportlounges.ca/sitemap.xml' },
      { '@type': 'DataDownload', encodingFormat: 'text/plain', contentUrl: 'https://www.airportlounges.ca/llms.txt' },
    ],
  }

  return (
    <div className="bg-bone-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      {/* Page header */}
      <div className="bg-primary text-white py-12">
        <div className="max-w-container-max mx-auto px-gutter">
          <h1 className="font-headline-lg text-headline-lg mb-2">Canadian Airport Lounges</h1>
          <p className="text-primary-fixed/80 font-body-md max-w-3xl">
            Every airport lounge in Canada in one directory — {lounges?.length ?? 0} lounges across {airports?.length ?? 0} major airports.
            Filter by Priority Pass, DragonPass, Air Canada Altitude, credit card, amenity, or day-pass availability.
            Access rules, hours, and photos are verified and updated daily.
          </p>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-gutter py-10">
        {/* Compact affiliate banner — subtle placement, routes commercial-intent
            readers to FinlyWealth's Canadian lounge-access-card comparison. */}
        <div className="mb-8 bg-champagne-glint/60 border border-primary/15 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary shrink-0 mt-0.5" style={{ fontSize: '22px' }}>credit_card</span>
            <div>
              <p className="font-semibold text-primary text-sm">Which credit card gets you in?</p>
              <p className="text-secondary text-xs leading-relaxed">Compare Canadian cards with lounge access, welcome bonuses, and any active cashback rebates.</p>
            </div>
          </div>
          <a
            href={affiliate('finlywealth-lounge-access-cards')}
            target="_blank"
            rel={AFFILIATE_REL}
            className="shrink-0 bg-primary text-white px-5 py-3 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Compare Cards
          </a>
        </div>

        {/* Curated collections — indexable landing pages for specific search intents.
            Placed above the grid so both readers and Google's crawler see them first. */}
        <section className="mb-12" aria-label="Curated lounge collections">
          <h2 className="font-label-caps text-[10px] uppercase tracking-widest text-secondary mb-4">
            Browse by need
          </h2>
          <div className="flex flex-wrap gap-2">
            {COLLECTIONS.map(c => (
              <Link
                key={c.slug}
                href={`/lounges/${c.slug}`}
                className="inline-flex items-center gap-2 border border-outline-variant hover:border-primary hover:bg-primary hover:text-white px-4 py-2 text-sm text-on-surface transition-colors group"
              >
                {c.h1.replace('Canadian Airport Lounges ', '').replace('Airport Lounges ', '')}
                <span className="material-symbols-outlined text-sand-dark group-hover:text-white transition-colors" style={{ fontSize: '14px' }}>
                  arrow_forward
                </span>
              </Link>
            ))}
          </div>
        </section>

        <Suspense fallback={
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-sand-dark animate-spin block mb-3" style={{ fontSize: '32px' }}>progress_activity</span>
            <p className="text-secondary">Loading lounges…</p>
          </div>
        }>
          <LoungeGrid
            lounges={lounges ?? []}
            airports={airports ?? []}
          />
        </Suspense>
      </div>
    </div>
  )
}
