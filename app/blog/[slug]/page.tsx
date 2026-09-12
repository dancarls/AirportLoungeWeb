import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPost, getAllPosts } from '@/lib/blog'
import FlightStatusWidget from '@/components/FlightStatusWidget'
import WeatherWidget from '@/components/WeatherWidget'
import NewsletterCTA from '@/components/NewsletterCTA'
import AdSlot from '@/components/AdSlot'
import { getWeather } from '@/lib/weather'
import { affiliate, AFFILIATE_REL } from '@/lib/affiliates'

/**
 * Any inline FinlyWealth link inside the blog content HTML gets the affiliate
 * `ref` parameter injected at render time — the registry can't touch links
 * that live in HTML string constants, so this bridge closes the gap. If the
 * NEXT_PUBLIC_AFF_FINLYWEALTH env var is unset the content is untouched.
 */
function injectFinlyWealthRef(html: string): string {
  const id = process.env.NEXT_PUBLIC_AFF_FINLYWEALTH
  if (!id) return html
  // Match href="https://(www.)?finlywealth.com/…". Add ref=<id> only if the
  // URL does not already carry a ref parameter.
  return html.replace(
    /href="(https:\/\/(?:www\.)?finlywealth\.com\/[^"]*)"/g,
    (match, url: string) => {
      if (/[?&]ref=/.test(url)) return match
      const separator = url.includes('?') ? '&' : '?'
      return `href="${url}${separator}ref=${encodeURIComponent(id)}"`
    }
  )
}

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `https://www.airportlounges.ca/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://www.airportlounges.ca/blog/${post.slug}`,
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
    },
  }
}

export const revalidate = 3600

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const weather = await getWeather(49.1947, -123.1792)

  const authorName = post.authorName ?? 'AirportLounges.ca Editorial Team'
  const authorBio = post.authorBio
    ?? 'The AirportLounges.ca Editorial Team verifies Canadian airport lounge access rules, hours, and amenities against operator sources, on-the-ground reader reports, and in-person visits — updated continuously.'
  const dateModified = post.lastReviewed ?? post.publishedAt
  // Word count is used for schema.org Article.wordCount — a signal Google reads.
  // We auto-calculate from HTML content if the post did not set an explicit override.
  const wordCount = post.wordCount
    ?? post.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.metaTitle,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified,
    articleSection: post.category,
    wordCount,
    inLanguage: 'en-CA',
    url: `https://www.airportlounges.ca/blog/${post.slug}`,
    image: post.coverImage
      ? {
          '@type': 'ImageObject',
          url: post.coverImage.startsWith('http')
            ? post.coverImage
            : `https://www.airportlounges.ca${post.coverImage}`,
          width: 1200,
          height: 630,
        }
      : undefined,
    author: {
      '@type': 'Organization',
      name: authorName,
      url: 'https://www.airportlounges.ca/about',
      description: authorBio,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AirportLounges.ca',
      url: 'https://www.airportlounges.ca',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.airportlounges.ca/favicon.ico',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.airportlounges.ca/blog/${post.slug}`,
    },
    isPartOf: {
      '@type': 'Blog',
      name: 'The AirportLounges.ca Lounge Library',
      url: 'https://www.airportlounges.ca/blog',
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',          item: 'https://www.airportlounges.ca' },
      { '@type': 'ListItem', position: 2, name: 'Lounge Library', item: 'https://www.airportlounges.ca/blog' },
      { '@type': 'ListItem', position: 3, name: post.title,      item: `https://www.airportlounges.ca/blog/${post.slug}` },
    ],
  }

  // Speakable schema — signals which sections voice assistants and AI Overviews
  // should read aloud. We mark the intro paragraph and every FAQ answer.
  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: post.metaTitle,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '[data-speakable="intro"]', '[data-speakable="faq-answer"]'],
    },
    url: `https://www.airportlounges.ca/blog/${post.slug}`,
  }

  // FAQPage schema — direct route into Google PAA and AI Overview citations.
  // Only emitted when the post opted into structured FAQs.
  const faqSchema = post.faqs && post.faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      }
    : null

  return (
    <div className="bg-bone-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="relative h-[380px] bg-aviation-navy overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover opacity-60"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-aviation-navy/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-container-max mx-auto px-gutter pb-10">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/blog"
              className="font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed hover:opacity-80 transition-opacity"
            >
              ← Lounge Library
            </Link>
            <span className="text-bone-white/30">·</span>
            <span className="font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed bg-primary/60 px-2 py-1">
              {post.category}
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-white max-w-3xl leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 mt-4 text-bone-white/60 text-xs">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
        </div>
      </div>

      {/* ── Content + sidebar ─────────────────────────────── */}
      <div className="max-w-container-max mx-auto px-gutter py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── Article body ──────────────────────────────── */}
          <article className="lg:col-span-2">
            {/* Byline block — visible E-E-A-T signal (author, publish date, last-verified) */}
            <div className="mb-8 pb-6 border-b border-outline-variant/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }}>edit_note</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-primary text-sm">By {authorName}</p>
                  <p className="text-xs text-secondary mt-0.5 leading-relaxed">{authorBio}</p>
                  <p className="text-xs text-secondary mt-2">
                    Published{' '}
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                    {post.lastReviewed && post.lastReviewed !== post.publishedAt && (
                      <>
                        {' · Last verified '}
                        <time dateTime={post.lastReviewed}>
                          {new Date(post.lastReviewed).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                      </>
                    )}
                    {' · '}
                    <a href="/about#sourcing" className="underline underline-offset-2 hover:text-primary">
                      Sourcing methodology
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Primary affiliate CTA — appears right below the byline for
                readers who arrive with commercial intent. Also repeats at
                the bottom of the article (before FAQ). */}
            {post.primaryCta && (
              <div className="mb-10 bg-primary text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                  <span className="font-label-caps text-[10px] uppercase tracking-widest text-primary-fixed/70 block mb-2">Sponsored</span>
                  <h3 className="font-headline-md text-headline-md text-primary-fixed mb-2">{post.primaryCta.heading}</h3>
                  <p className="text-bone-white/80 text-sm leading-relaxed">{post.primaryCta.subheading}</p>
                </div>
                <a
                  href={affiliate(post.primaryCta.affiliateKey as Parameters<typeof affiliate>[0])}
                  target="_blank"
                  rel={AFFILIATE_REL}
                  className="shrink-0 bg-primary-fixed text-on-primary-fixed px-8 py-4 font-label-caps text-[10px] uppercase tracking-widest hover:bg-white transition-all"
                >
                  {post.primaryCta.ctaLabel}
                </a>
              </div>
            )}

            {/* Comparison cards — for multi-card comparison posts. Each card
                is a mini-profile with an individual "See on FinlyWealth" CTA. */}
            {post.comparisonCards && post.comparisonCards.length > 0 && (
              <div className="mb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {post.comparisonCards.map((c, i) => (
                    <div key={i} className="bg-white border border-outline-variant/30 p-5 flex flex-col">
                      <div className="mb-3">
                        <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary block mb-1">{c.annualFee}/yr</span>
                        <h4 className="font-bold text-primary leading-snug">{c.name}</h4>
                      </div>
                      <p className="text-secondary text-xs leading-relaxed flex-1 mb-4">{c.highlight}</p>
                      <a
                        href={affiliate(c.affiliateKey as Parameters<typeof affiliate>[0])}
                        target="_blank"
                        rel={AFFILIATE_REL}
                        className="block text-center bg-primary text-white py-3 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity"
                      >
                        {c.ctaLabel ?? `See ${c.name}`}
                      </a>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-secondary/50 mt-3 text-center">Sponsored — we may earn a commission when you apply through these links.</p>
              </div>
            )}

            <div
              data-speakable="intro"
              className="prose-article"
              dangerouslySetInnerHTML={{ __html: injectFinlyWealthRef(post.content) }}
            />

            {/* Closing affiliate CTA — same primary CTA repeated after content,
                before FAQs. Readers who scrolled the whole article are the
                highest-intent conversion cohort. */}
            {post.primaryCta && (
              <div className="mt-12 bg-champagne-glint/50 border border-primary/20 p-6 md:p-8 text-center">
                <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary block mb-3">Ready to apply?</span>
                <h3 className="font-headline-md text-headline-md text-primary mb-3">{post.primaryCta.heading}</h3>
                <p className="text-secondary max-w-xl mx-auto mb-6 leading-relaxed">{post.primaryCta.subheading}</p>
                <a
                  href={affiliate(post.primaryCta.affiliateKey as Parameters<typeof affiliate>[0])}
                  target="_blank"
                  rel={AFFILIATE_REL}
                  className="inline-block bg-primary text-white px-10 py-4 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  {post.primaryCta.ctaLabel}
                </a>
                <p className="text-[9px] text-secondary/50 mt-4">Sponsored — we may earn a commission when you apply.</p>
              </div>
            )}

            {/* Structured FAQ block — feeds FAQPage schema + gives readers scannable Q&A */}
            {post.faqs && post.faqs.length > 0 && (
              <section className="mt-12 pt-10 border-t border-outline-variant/30" aria-label="Frequently Asked Questions">
                <h2 className="font-headline-md text-headline-md text-primary mb-8">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {post.faqs.map((faq, i) => (
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
            )}

            {/* AI image disclaimer */}
            <p className="mt-10 text-xs text-secondary/60 italic">
              Images in this article were created using AI image generation tools for illustrative purposes. Actual lounge interiors, facilities, and appearances may differ from those shown.
            </p>

            {/* Back to guides */}
            <div className="mt-6 pt-6 border-t border-outline-variant/30">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-label-caps text-[10px] uppercase tracking-widest text-primary border-b border-primary/20 hover:border-primary transition-all pb-1"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_back</span>
                Back to Lounge Library
              </Link>
            </div>
          </article>

          {/* ── Sidebar ───────────────────────────────────── */}
          <aside className="space-y-6">

            {/* Weather */}
            {weather && (
              <div>
                <h3 className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-3">
                  Airport Weather
                </h3>
                <WeatherWidget weather={weather} city="Vancouver" iata="YVR" />
              </div>
            )}

            {/* Flight status */}
            <div>
              <h3 className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-3">
                Flight Status
              </h3>
              <FlightStatusWidget />
            </div>

            {/* Related links */}
            <div className="bg-white fine-border p-5">
              <h3 className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-4">
                Related Lounges
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'All Priority Pass lounges', href: '/lounges?access=Priority+Pass' },
                  { label: 'YVR SkyTeam Lounge', href: '/airports/YVR/lounges/skyteam-lounge-yvr' },
                  { label: 'YYZ Plaza Premium', href: '/airports/YYZ' },
                  { label: 'YYC Aspire Lounge', href: '/airports/YYC' },
                  { label: 'Browse all airports', href: '/airports' },
                ].map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between text-sm text-secondary hover:text-primary py-1.5 border-b border-outline-variant/20 last:border-0 transition-colors group"
                  >
                    {link.label}
                    <span className="material-symbols-outlined text-sand-dark group-hover:text-primary transition-colors" style={{ fontSize: '14px' }}>
                      arrow_forward
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter capture — replaces the pre-launch ad placeholder. */}
            <NewsletterCTA source={`blog:${post.slug}`} variant="light" />

            {/* Reserved sidebar ad slot — invisible until a display-ad network
                (Mediavine Journey / Raptive / AdSense) is enabled site-wide. */}
            <AdSlot slot="blog-sidebar" size="sidebar" />

            {/* CTA */}
            <div className="bg-primary p-6 text-white">
              <h4 className="font-headline-md text-primary-fixed mb-2">Find Your Lounge</h4>
              <p className="text-bone-white/70 text-sm mb-4">Search Priority Pass, Business Class, and more across Canadian airports.</p>
              <Link
                href="/lounges?access=Priority+Pass"
                className="block text-center bg-primary-fixed text-on-primary-fixed px-6 py-3 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
              >
                View Priority Pass Lounges
              </Link>
            </div>

            {/* Monetized outbound — routed through the affiliate registry so the
                same link swaps in a tracking parameter automatically once the
                Priority Pass partner ID is approved and set as an env var. */}
            <div className="bg-white fine-border p-6 text-center">
              <span className="font-label-caps text-[9px] text-sand-dark uppercase tracking-widest block mb-3">Partner</span>
              <h5 className="font-bold text-primary mb-2">Priority Pass Membership</h5>
              <p className="text-sm text-secondary mb-4 leading-relaxed">
                1,600+ lounges worldwide, including 20+ across Canada. Membership from $99 USD / yr.
              </p>
              <a
                href={affiliate('priority-pass-membership')}
                target="_blank"
                rel={AFFILIATE_REL}
                className="inline-block bg-primary text-white px-6 py-3 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Compare Plans
              </a>
              <p className="text-[9px] text-secondary/50 mt-3">Sponsored — we may earn a commission.</p>
            </div>

          </aside>
        </div>
      </div>
    </div>
  )
}
