import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPostFr, getAllPostsFr } from '@/lib/blog-fr'
import { affiliate, AFFILIATE_REL } from '@/lib/affiliates'

/**
 * Rewrite inline finlywealth.com links in the French post content to route
 * through the /r/<code>?url=<path>&utm_source=blog-fr-<slug> redirect, so
 * FinlyWealth sees French-locale clicks as distinct per-placement rows in
 * their Audience → Devices & UTM reporting. Mirrors the English version but
 * with a `blog-fr-` prefix so the two locales are separable in the report.
 */
function rewriteFinlywealthLinks(html: string, slug: string): string {
  const code = process.env.NEXT_PUBLIC_AFF_FINLYWEALTH
  if (!code) return html
  const placement = `blog-fr-${slug}`.slice(0, 80)
  return html.replace(
    /href="https:\/\/(?:www\.)?finlywealth\.com([^"]*)"/g,
    (match, pathAndQuery: string) => {
      if (pathAndQuery.startsWith('/r/')) return match
      const params = new URLSearchParams()
      params.set('url', pathAndQuery)
      params.set('utm_source', placement)
      return `href="https://www.finlywealth.com/r/${encodeURIComponent(code)}?${params.toString()}"`
    }
  )
}

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllPostsFr().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostFr(slug)
  if (!post) return {}
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `https://www.airportlounges.ca/fr/blog/${post.slug}`,
      // Hreflang alternates — tell Google the EN version is the sibling.
      languages: {
        'en-CA': `https://www.airportlounges.ca/blog/${post.slug}`,
        'fr-CA': `https://www.airportlounges.ca/fr/blog/${post.slug}`,
        'x-default': `https://www.airportlounges.ca/blog/${post.slug}`,
      },
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://www.airportlounges.ca/fr/blog/${post.slug}`,
      locale: 'fr_CA',
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
    },
  }
}

export const revalidate = 3600

export default async function BlogPostPageFr({ params }: Props) {
  const { slug } = await params
  const post = getPostFr(slug)
  if (!post) notFound()

  const dateModified = post.lastReviewed ?? post.publishedAt
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
    inLanguage: 'fr-CA',
    url: `https://www.airportlounges.ca/fr/blog/${post.slug}`,
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
      name: post.authorName ?? 'Équipe éditoriale AirportLounges.ca',
      url: 'https://www.airportlounges.ca/about',
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
      '@id': `https://www.airportlounges.ca/fr/blog/${post.slug}`,
    },
  }

  return (
    <div className="bg-bone-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* Hero */}
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
            <Link href="/fr/blog" className="font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed hover:opacity-80 transition-opacity">
              ← Guide des salons
            </Link>
            <span className="text-bone-white/30">·</span>
            <span className="font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed bg-primary/60 px-2 py-1">
              {post.category}
            </span>
            <span className="text-bone-white/30">·</span>
            <Link
              href={`/blog/${post.slug}`}
              className="font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed hover:opacity-80 transition-opacity underline"
              hrefLang="en-CA"
            >
              Read in English
            </Link>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-white max-w-3xl leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 mt-4 text-bone-white/60 text-xs">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-container-max mx-auto px-gutter py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <article className="lg:col-span-2">
            {post.authorName && (
              <div className="mb-8 pb-6 border-b border-outline-variant/30">
                <p className="font-semibold text-primary text-sm">Par {post.authorName}</p>
                {post.authorBio && (
                  <p className="text-xs text-secondary mt-0.5 leading-relaxed">{post.authorBio}</p>
                )}
                <p className="text-xs text-secondary mt-2">
                  Publié{' '}
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                  {post.lastReviewed && post.lastReviewed !== post.publishedAt && (
                    <>
                      {' · Dernière vérification '}
                      <time dateTime={post.lastReviewed}>
                        {new Date(post.lastReviewed).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </time>
                    </>
                  )}
                </p>
              </div>
            )}

            {post.primaryCta && (
              <div className="mb-10 bg-primary text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                  <span className="font-label-caps text-[10px] uppercase tracking-widest text-primary-fixed/70 block mb-2">Commandité</span>
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

            <div
              data-speakable="intro"
              className="prose-article"
              dangerouslySetInnerHTML={{ __html: rewriteFinlywealthLinks(post.content, post.slug) }}
            />
          </article>

          <aside className="space-y-6">
            <div className="bg-white fine-border p-5">
              <h3 className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-4">
                Lire également
              </h3>
              <div className="space-y-2">
                <Link
                  href={`/blog/${post.slug}`}
                  hrefLang="en-CA"
                  className="flex items-center justify-between text-sm text-secondary hover:text-primary py-1.5 border-b border-outline-variant/20 transition-colors group"
                >
                  Read this in English
                  <span className="material-symbols-outlined text-sand-dark group-hover:text-primary transition-colors" style={{ fontSize: '14px' }}>language</span>
                </Link>
                <Link
                  href="/airports/YUL"
                  className="flex items-center justify-between text-sm text-secondary hover:text-primary py-1.5 border-b border-outline-variant/20 transition-colors group"
                >
                  Salons de l'aéroport YUL
                  <span className="material-symbols-outlined text-sand-dark group-hover:text-primary transition-colors" style={{ fontSize: '14px' }}>arrow_forward</span>
                </Link>
                <Link
                  href="/airports"
                  className="flex items-center justify-between text-sm text-secondary hover:text-primary py-1.5 last:border-0 transition-colors group"
                >
                  Tous les aéroports canadiens
                  <span className="material-symbols-outlined text-sand-dark group-hover:text-primary transition-colors" style={{ fontSize: '14px' }}>arrow_forward</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
