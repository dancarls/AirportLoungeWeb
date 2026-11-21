import Link from 'next/link'
import Image from 'next/image'
import type { BlogPost } from '@/lib/blog'

interface Props {
  post: BlogPost
}

/**
 * Home-page "Featured Story" band. Rendered once per home page, between the
 * operational alert strip and the Featured Lounge card. Picks up whichever
 * blog post currently has `featured: true` (`getFeaturedPost()` in lib/blog.ts).
 *
 * Visual language matches the site: navy background, gold eyebrow, portrait
 * cover image, serif headline, bone-white body. Mirrors the "Real-time
 * Intelligence" dark band further down so the home page doesn't gain a new
 * surface vocabulary just for this slot.
 *
 * If no post is flagged `featured`, the home page simply skips this section —
 * the band is never rendered empty.
 */
export default function FeaturedStorySection({ post }: Props) {
  return (
    <section className="py-section-gap bg-aviation-navy text-white overflow-hidden">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center">

          {/* Cover image — 3/5 on desktop, full-width on mobile. Uses next/image
              with `sizes` tuned for the two-column layout. */}
          <Link
            href={`/blog/${post.slug}`}
            className="lg:col-span-3 group relative block aspect-[16/10] overflow-hidden editorial-shadow"
          >
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
            <div className="absolute top-5 left-5 flex items-center gap-2 bg-primary-fixed text-on-primary-fixed px-3 py-1.5 font-label-caps text-[10px] uppercase tracking-widest">
              <span
                className="w-1.5 h-1.5 rounded-full bg-on-primary-fixed animate-pulse"
                aria-hidden="true"
              />
              New in Canada
            </div>
          </Link>

          {/* Copy block — 2/5 on desktop */}
          <div className="lg:col-span-2 space-y-5">
            <span className="font-label-caps text-[10px] uppercase tracking-[0.25em] text-primary-fixed block">
              Featured Story · {post.category}
            </span>

            <h2 className="font-headline-lg text-headline-lg text-white leading-tight">
              <Link href={`/blog/${post.slug}`} className="hover:text-primary-fixed transition-colors">
                {post.title}
              </Link>
            </h2>

            <p className="text-bone-white/75 font-body-lg text-body-lg leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-6 pt-2">
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 bg-primary-fixed text-on-primary-fixed px-8 py-3 font-label-caps text-[11px] uppercase tracking-widest hover:bg-bone-white transition-colors"
              >
                Read the full guide
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
              </Link>

              <time
                dateTime={post.publishedAt}
                className="text-bone-white/50 text-xs font-label-caps uppercase tracking-widest"
              >
                {new Date(post.publishedAt).toLocaleDateString('en-CA', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
                {' · '}
                {post.readingTime}
              </time>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
