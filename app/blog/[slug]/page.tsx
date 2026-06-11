import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPost, getAllPosts } from '@/lib/blog'
import FlightStatusWidget from '@/components/FlightStatusWidget'
import WeatherWidget from '@/components/WeatherWidget'
import { getWeather } from '@/lib/weather'

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

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.metaTitle,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    url: `https://www.airportlounges.ca/blog/${post.slug}`,
    image: post.coverImage
      ? { '@type': 'ImageObject', url: post.coverImage, width: 1200, height: 630 }
      : undefined,
    author: {
      '@type': 'Organization',
      name: 'AirportLounges.ca',
      url: 'https://www.airportlounges.ca',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AirportLounges.ca',
      url: 'https://www.airportlounges.ca',
      logo: { '@type': 'ImageObject', url: 'https://www.airportlounges.ca/favicon.ico' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.airportlounges.ca/blog/${post.slug}`,
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

  return (
    <div className="bg-bone-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
            <div
              className="prose-article"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

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

            {/* Ad placement */}
            <div className="bg-champagne-glint fine-border p-5 text-center min-h-[280px] flex flex-col items-center justify-center">
              <span className="font-label-caps text-[9px] text-sand-dark uppercase tracking-widest block mb-2">Advertisement</span>
              <div className="w-full h-[250px] bg-sand-dark/10 flex items-center justify-center">
                <span className="text-xs text-secondary">300 × 250</span>
              </div>
            </div>

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

            {/* Ad placement 2 */}
            <div className="bg-white fine-border p-5 text-center min-h-[300px] flex flex-col items-center justify-center">
              <span className="font-label-caps text-[9px] text-sand-dark uppercase tracking-widest block mb-2">Advertisement</span>
              <div className="w-full h-[250px] bg-sand-dark/10 flex items-center justify-center">
                <span className="text-xs text-secondary">300 × 250</span>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  )
}
