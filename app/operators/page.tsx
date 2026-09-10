import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Operator Portal — Claim Your Lounge Listing',
  description: 'Claim, verify, and enhance your lounge listing on AirportLounges.ca — the Canadian directory reaching premium travellers monthly. Free basic listing, plus enhanced and featured tiers.',
  alternates: { canonical: 'https://www.airportlounges.ca/operators' },
  openGraph: {
    title: 'Operator Portal — Claim Your Lounge Listing on AirportLounges.ca',
    description: 'Claim, verify, and enhance your lounge listing on Canada\'s premium airport lounge directory. Free basic listing, plus enhanced and featured tiers.',
    url: 'https://www.airportlounges.ca/operators',
  },
}

const TIERS = [
  {
    id: 'basic',
    name: 'Basic Listing',
    price: 'Free',
    tagline: 'Get on the map. Verified operator badge, editable info.',
    features: [
      'Verified operator badge on the lounge page',
      'Directly edit access rules, hours, amenities, and contact info',
      'Reply to traveller reviews',
      'Standard placement in airport lounge lists',
    ],
    cta: 'Claim your listing',
    highlight: false,
  },
  {
    id: 'enhanced',
    name: 'Enhanced Listing',
    price: '$99 CAD / month',
    tagline: 'Priority placement, unlimited photos, direct booking button.',
    features: [
      'Everything in Basic, plus:',
      'Top-of-airport-page priority placement',
      'Unlimited photo gallery (vs. 5 photo cap on Basic)',
      'Direct "Book / Buy Day Pass" button with your affiliate link',
      'Custom promotional banner on your lounge page',
      'Monthly performance report — visits, clicks, reviews',
    ],
    cta: 'Choose Enhanced',
    highlight: true,
  },
  {
    id: 'featured',
    name: 'Featured Lounge',
    price: '$499 CAD / month',
    tagline: 'Homepage rotation, airport-page banner, priority editorial coverage.',
    features: [
      'Everything in Enhanced, plus:',
      'Rotating placement on the AirportLounges.ca homepage',
      'Top banner on your airport\'s hub page',
      'Priority editorial coverage — one guaranteed feature or news article per quarter',
      'Included in relevant blog posts, guides, and comparison tables',
      'Newsletter feature — one dedicated slot per quarter to ~5k Canadian travellers',
    ],
    cta: 'Choose Featured',
    highlight: false,
  },
] as const

export default function OperatorsPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',      item: 'https://www.airportlounges.ca' },
      { '@type': 'ListItem', position: 2, name: 'Operators', item: 'https://www.airportlounges.ca/operators' },
    ],
  }

  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'AirportLounges.ca Operator Listing',
    provider: {
      '@type': 'Organization',
      name: 'AirportLounges.ca',
      url: 'https://www.airportlounges.ca',
    },
    areaServed: { '@type': 'Country', name: 'Canada' },
    description: 'Verified lounge listings for airport lounge operators across Canada, with Basic, Enhanced, and Featured tiers.',
    offers: TIERS.map(t => ({
      '@type': 'Offer',
      name: t.name,
      description: t.tagline,
      ...(t.price !== 'Free' && {
        price: t.price.replace(/[^0-9]/g, ''),
        priceCurrency: 'CAD',
      }),
    })),
  }

  return (
    <div className="bg-bone-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />

      {/* Hero */}
      <div className="bg-primary text-white py-20">
        <div className="max-w-container-max mx-auto px-gutter">
          <span className="font-label-caps text-[10px] uppercase tracking-widest text-primary-fixed/70 block mb-4">
            Operator Portal
          </span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-tight max-w-3xl">
            Reach Canadian premium travellers where they plan their transit.
          </h1>
          <p className="font-body-lg text-body-lg text-bone-white/80 max-w-2xl leading-relaxed">
            AirportLounges.ca is the independent Canadian directory for airport lounge discovery.
            Claim your listing to control your access rules, hours, and amenities — or upgrade to
            reach travellers actively planning to visit your lounge.
          </p>
        </div>
      </div>

      {/* Tiers */}
      <div className="max-w-container-max mx-auto px-gutter py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TIERS.map(tier => (
            <div
              key={tier.id}
              className={`bg-white border p-8 flex flex-col ${
                tier.highlight
                  ? 'border-primary border-2 shadow-lg relative'
                  : 'border-outline-variant/30'
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-8 bg-primary text-white text-[10px] font-label-caps uppercase tracking-widest px-3 py-1">
                  Most popular
                </span>
              )}
              <h2 className="font-headline-md text-headline-md text-primary mb-2">{tier.name}</h2>
              <div className="font-display-lg text-headline-lg text-primary mb-2">{tier.price}</div>
              <p className="text-secondary text-sm mb-6 leading-relaxed">{tier.tagline}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex gap-3 text-sm text-on-surface leading-relaxed">
                    <span className="material-symbols-outlined text-primary shrink-0 mt-0.5" style={{ fontSize: '18px' }}>
                      check_circle
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/operators/apply?tier=${tier.id}`}
                className={
                  tier.highlight
                    ? 'block text-center bg-primary text-white py-4 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity'
                    : 'block text-center border border-primary text-primary py-4 font-label-caps text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all'
                }
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <section className="mt-24 max-w-3xl mx-auto" aria-label="Operator Portal FAQ">
          <h2 className="font-headline-md text-headline-md text-primary mb-8 text-center">Common questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Do I have to pay to be listed?',
                a: 'No. Every verified lounge in Canada is eligible for a free Basic Listing. Paid tiers add visibility and features — the underlying directory data stays free for travellers to browse.',
              },
              {
                q: 'How is my listing verified?',
                a: 'We verify operator identity via a company email address matching the operator domain, or a phone call to the published lounge contact number. Verification is one-time and takes 2–3 business days.',
              },
              {
                q: 'Can I edit my listing myself once verified?',
                a: 'Yes. Verified operators receive a login to update access rules, hours, amenities, and photos directly. Changes are reviewed within one business day before going live.',
              },
              {
                q: 'Do you take a cut of day-pass bookings?',
                a: 'No. Enhanced and Featured tiers include a direct "Book / Buy Day Pass" button that links to your own booking system or affiliate URL. We do not intermediate the transaction.',
              },
              {
                q: 'How many people visit AirportLounges.ca?',
                a: 'Traffic grows monthly; we publish a current traffic snapshot for prospective advertisers on request. Contact hello@airportlounges.ca for the latest audience report.',
              },
              {
                q: 'What happens if I upgrade mid-month?',
                a: 'You are prorated for the remainder of the current month, and the full monthly rate begins the following billing cycle.',
              },
            ].map((f, i) => (
              <details key={i} className="group bg-white border border-outline-variant/30 rounded-lg overflow-hidden">
                <summary className="cursor-pointer p-5 font-semibold text-primary flex items-start justify-between gap-4 hover:bg-champagne-glint/30 transition-colors">
                  <span className="text-base leading-snug">{f.q}</span>
                  <span className="material-symbols-outlined text-sand-dark shrink-0 group-open:rotate-180 transition-transform" style={{ fontSize: '20px' }}>expand_more</span>
                </summary>
                <div className="px-5 pb-5 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant/20 pt-4">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="mt-24 bg-primary text-white p-12 text-center">
          <h2 className="font-headline-md text-headline-md text-primary-fixed mb-4">Ready to claim your listing?</h2>
          <p className="text-bone-white/70 mb-8 max-w-xl mx-auto">
            Applications take under three minutes and go directly to our editorial desk.
          </p>
          <Link
            href="/operators/apply"
            className="inline-block bg-primary-fixed text-on-primary-fixed px-10 py-4 font-label-caps text-[10px] uppercase tracking-widest hover:bg-white transition-all"
          >
            Start Application
          </Link>
        </div>
      </div>
    </div>
  )
}
