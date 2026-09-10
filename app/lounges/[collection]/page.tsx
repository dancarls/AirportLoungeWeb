import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getCollection, allCollectionSlugs, type Collection } from '@/lib/collections'
import type { Lounge, Airport, Amenity } from '@/lib/types'
import NewsletterCTA from '@/components/NewsletterCTA'
import LoungePlaceholder from '@/components/LoungePlaceholder'

interface Props { params: Promise<{ collection: string }> }

export function generateStaticParams() {
  return allCollectionSlugs().map(collection => ({ collection }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection: slug } = await params
  const c = getCollection(slug)
  if (!c) return { title: 'Collection Not Found' }
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.targetKeywords,
    alternates: { canonical: `https://www.airportlounges.ca/lounges/${c.slug}` },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url: `https://www.airportlounges.ca/lounges/${c.slug}`,
    },
  }
}

export const revalidate = 3600

function getImg(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/lounge-images/${path}`
}

type Row = Lounge & { airport?: Airport; amenities?: Amenity[]; images?: { storage_path: string; is_primary: boolean }[] }

export default async function CollectionPage({ params }: Props) {
  const { collection: slug } = await params
  const c: Collection | undefined = getCollection(slug)
  if (!c) notFound()

  const supabase = await createClient()
  const { data: rawLounges } = await supabase
    .from('lounges')
    .select('*, airport:airports(id, name, iata_code, city), amenities(id, name), images:lounge_images(storage_path, is_primary)')
    .eq('is_active', true)
    .order('rating', { ascending: false, nullsFirst: false })

  const lounges = ((rawLounges ?? []) as Row[]).filter(c.filter)

  // Group by airport for nested display — matches how travellers search
  const byAirport = new Map<string, { airport: Airport; lounges: Row[] }>()
  for (const l of lounges) {
    if (!l.airport) continue
    const key = l.airport.iata_code
    if (!byAirport.has(key)) byAirport.set(key, { airport: l.airport, lounges: [] })
    byAirport.get(key)!.lounges.push(l)
  }
  const airports = Array.from(byAirport.values()).sort((a, b) => a.airport.iata_code.localeCompare(b.airport.iata_code))

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',    item: 'https://www.airportlounges.ca' },
      { '@type': 'ListItem', position: 2, name: 'Lounges', item: 'https://www.airportlounges.ca/lounges' },
      { '@type': 'ListItem', position: 3, name: c.h1,      item: `https://www.airportlounges.ca/lounges/${c.slug}` },
    ],
  }

  const itemListLd = lounges.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: c.h1,
    url: `https://www.airportlounges.ca/lounges/${c.slug}`,
    numberOfItems: lounges.length,
    itemListElement: lounges.slice(0, 50).map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: l.name,
      url: `https://www.airportlounges.ca/airports/${l.airport?.iata_code}/lounges/${l.slug}`,
    })),
  } : null

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  const speakableLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: c.metaTitle,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '[data-speakable="intro"]', '[data-speakable="faq-answer"]'],
    },
    url: `https://www.airportlounges.ca/lounges/${c.slug}`,
  }

  return (
    <div className="bg-bone-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {itemListLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableLd) }} />

      {/* Hero */}
      <div className="bg-primary text-white py-14">
        <div className="max-w-container-max mx-auto px-gutter">
          <nav className="mb-4 text-sm">
            <Link href="/lounges" className="text-primary-fixed/80 hover:text-primary-fixed underline underline-offset-2">All Lounges</Link>
            <span className="text-primary-fixed/40 mx-2">›</span>
            <span className="text-primary-fixed">{c.h1}</span>
          </nav>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-4 leading-tight max-w-4xl">
            {c.h1}
          </h1>
          <p data-speakable="intro" className="font-body-lg text-body-lg text-bone-white/85 max-w-3xl leading-relaxed">
            {c.intro}
          </p>
          <p className="text-primary-fixed/70 font-body-md mt-4">
            {lounges.length} lounge{lounges.length !== 1 ? 's' : ''} across {airports.length} Canadian airport{airports.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-gutter py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Grid — grouped by airport for scannability */}
        <div className="lg:col-span-3 space-y-12">
          {lounges.length === 0 ? (
            <div className="bg-white border border-outline-variant/30 p-12 text-center">
              <span className="material-symbols-outlined text-sand-dark text-4xl mb-3 block">explore_off</span>
              <p className="font-medium text-on-surface mb-2">No matching lounges — yet</p>
              <p className="text-sm text-secondary">
                Data is refreshed continuously. Return in a few weeks or{' '}
                <Link href="/lounges" className="underline underline-offset-2 hover:text-primary">browse all Canadian lounges</Link>.
              </p>
            </div>
          ) : (
            airports.map(({ airport, lounges: airportLounges }) => (
              <section key={airport.iata_code}>
                <div className="flex items-baseline gap-3 mb-6 pb-3 border-b border-outline-variant/30">
                  <h2 className="font-headline-md text-headline-md text-primary">{airport.iata_code}</h2>
                  <Link
                    href={`/airports/${airport.iata_code}`}
                    className="text-sm text-secondary hover:text-primary transition-colors underline underline-offset-2"
                  >
                    {airport.name}
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {airportLounges.map(l => {
                    const primaryImg = l.images?.find(i => i.is_primary) ?? l.images?.[0]
                    return (
                      <Link
                        key={l.id}
                        href={`/airports/${airport.iata_code}/lounges/${l.slug}`}
                        className="bg-white border border-outline-variant/30 group hover:border-primary/40 transition-colors block overflow-hidden"
                      >
                        <div className="aspect-[16/9] bg-secondary-container overflow-hidden">
                          {primaryImg ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={getImg(primaryImg.storage_path)}
                              alt={l.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <LoungePlaceholder name={l.name} />
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-primary leading-snug">{l.name}</h3>
                            {l.rating && (
                              <div className="flex items-center gap-1 text-sm shrink-0 ml-3">
                                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1", fontSize: '14px' }}>star</span>
                                <span className="font-bold">{l.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          {l.terminal && (
                            <p className="text-xs text-secondary uppercase tracking-widest">
                              Terminal {l.terminal}{l.location_detail ? ` · ${l.location_detail.split('—')[0].trim()}` : ''}
                            </p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            ))
          )}

          {/* FAQ block — visible + FAQPage schema-eligible */}
          <section className="mt-16 pt-10 border-t border-outline-variant/30" aria-label="Frequently Asked Questions">
            <h2 className="font-headline-md text-headline-md text-primary mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {c.faqs.map((faq, i) => (
                <details key={i} className="group bg-white border border-outline-variant/30 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer p-5 font-semibold text-primary flex items-start justify-between gap-4 hover:bg-champagne-glint/30 transition-colors">
                    <span className="text-base leading-snug">{faq.question}</span>
                    <span className="material-symbols-outlined text-sand-dark shrink-0 group-open:rotate-180 transition-transform" style={{ fontSize: '20px' }}>expand_more</span>
                  </summary>
                  <div data-speakable="faq-answer" className="px-5 pb-5 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant/20 pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <NewsletterCTA
            source={`collection:${c.slug}`}
            variant="light"
            heading="New lounges. New closures."
            subheading="Access-rule changes, new lounge openings, and Canadian card benefit shifts — monthly."
          />
          <div className="bg-white border border-outline-variant/30 p-5">
            <h3 className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-4">
              Other Collections
            </h3>
            <ul className="space-y-2">
              {allCollectionSlugs().filter(s => s !== c.slug).slice(0, 6).map(otherSlug => {
                const other = getCollection(otherSlug)!
                return (
                  <li key={otherSlug}>
                    <Link
                      href={`/lounges/${otherSlug}`}
                      className="text-sm text-secondary hover:text-primary transition-colors underline underline-offset-2"
                    >
                      {other.h1}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
