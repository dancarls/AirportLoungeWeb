import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'
import FlightStatusWidget from '@/components/FlightStatusWidget'

export const metadata: Metadata = {
  title: 'Lounge Guides & Travel Tips | AirportLounges.ca',
  description: 'Expert guides to Canadian airport lounges — Priority Pass, access cards, best lounges by city, and tips for every type of traveller.',
  openGraph: {
    title: 'Lounge Guides & Travel Tips | AirportLounges.ca',
    description: 'Expert guides to Canadian airport lounges — Priority Pass, access cards, best lounges by city, and tips for every type of traveller.',
    url: 'https://airportlounges.ca/blog',
  },
}

export const revalidate = 3600

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="bg-bone-white min-h-screen">

      {/* ── Header ────────────────────────────────────────── */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-container-max mx-auto px-gutter">
          <p className="font-label-caps text-[10px] uppercase tracking-[0.3em] text-primary-fixed mb-4">
            The Lounge Library
          </p>
          <h1 className="font-headline-lg text-headline-lg mb-4">Guides &amp; Insights</h1>
          <p className="text-bone-white/70 max-w-xl">
            Curated guides for navigating airport lounges across Canada — access cards, peak hours, and what to expect at every major hub.
          </p>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────── */}
      <div className="max-w-container-max mx-auto px-gutter py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── Post grid (2-wide) ─────────────────────────── */}
          <div className="lg:col-span-2">
            {posts.length === 0 ? (
              <p className="text-secondary">No posts yet — check back soon.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {posts.map(post => (
                  <article key={post.slug} className="group bg-white fine-border overflow-hidden flex flex-col">
                    <Link href={`/blog/${post.slug}`} className="block aspect-[16/9] overflow-hidden relative bg-secondary-container">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-all duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </Link>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-label-caps text-[9px] text-sand-dark uppercase tracking-widest bg-champagne-glint px-2 py-1">
                          {post.category}
                        </span>
                        <span className="text-[10px] text-secondary">{post.readingTime}</span>
                      </div>
                      <h2 className="font-headline-md text-primary mb-3 leading-snug">
                        <Link href={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link>
                      </h2>
                      <p className="text-secondary text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                        <time className="text-[10px] text-secondary" dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="font-label-caps text-[9px] uppercase tracking-widest text-primary flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          Read <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ────────────────────────────────────── */}
          <aside className="space-y-6">

            {/* Flight status */}
            <div>
              <h3 className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-3">
                Flight Status
              </h3>
              <FlightStatusWidget />
            </div>

            {/* Quick links */}
            <div className="bg-white fine-border p-5">
              <h3 className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-4">
                Browse Lounges
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Priority Pass lounges', href: '/lounges?access=Priority+Pass' },
                  { label: 'Lounges with showers', href: '/lounges?amenity=shower' },
                  { label: 'Best rated in Canada', href: '/lounges?sort=rating' },
                  { label: 'YVR lounges', href: '/airports/YVR' },
                  { label: 'YYZ lounges', href: '/airports/YYZ' },
                  { label: 'YYC lounges', href: '/airports/YYC' },
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
            <div className="bg-champagne-glint fine-border p-5 text-center min-h-[250px] flex flex-col items-center justify-center">
              <span className="font-label-caps text-[9px] text-sand-dark uppercase tracking-widest block mb-2">Advertisement</span>
              <div className="w-full h-[200px] bg-sand-dark/10 flex items-center justify-center">
                <span className="text-xs text-secondary">300 × 200</span>
              </div>
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
