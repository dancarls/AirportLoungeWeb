import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getAllPostsFr } from '@/lib/blog-fr'

export const metadata: Metadata = {
  title: 'Guide des salons d\'aéroport | AirportLounges.ca',
  description:
    'Guides éditoriaux sur les salons d\'aéroport au Canada — accès par carte de crédit, abonnements, horaires et conseils de voyage. Version française.',
  alternates: {
    canonical: 'https://www.airportlounges.ca/fr/blog',
    languages: {
      'en-CA': 'https://www.airportlounges.ca/blog',
      'fr-CA': 'https://www.airportlounges.ca/fr/blog',
      'x-default': 'https://www.airportlounges.ca/blog',
    },
  },
  openGraph: {
    locale: 'fr_CA',
    url: 'https://www.airportlounges.ca/fr/blog',
  },
}

export default function BlogIndexFr() {
  const posts = getAllPostsFr()

  return (
    <div className="bg-bone-white min-h-screen">
      <section className="relative bg-aviation-navy text-white py-20">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex items-center gap-3 mb-4">
            <p className="font-label-caps text-[10px] uppercase tracking-[0.3em] text-primary-fixed">
              Guide des salons · Édition française
            </p>
            <span className="text-bone-white/30">·</span>
            <Link
              href="/blog"
              hrefLang="en-CA"
              className="font-label-caps text-[10px] uppercase tracking-widest text-primary-fixed hover:opacity-80 transition-opacity underline"
            >
              English edition
            </Link>
          </div>
          <h1 className="font-headline-lg text-headline-lg max-w-3xl">
            Guides sur les salons d'aéroport au Canada
          </h1>
          <p className="mt-4 text-bone-white/80 max-w-2xl leading-relaxed">
            Guides éditoriaux vérifiés sur l'accès aux salons d'aéroport canadiens par carte de crédit, abonnement ou statut. Les règles d'accès et les frais sont vérifiés auprès des émetteurs et des opérateurs de salon.
          </p>
        </div>
      </section>

      <section className="max-w-container-max mx-auto px-gutter py-16">
        {posts.length === 0 ? (
          <p className="text-secondary">Aucun article disponible pour le moment. Consultez l'<Link href="/blog" className="underline text-primary">édition anglaise</Link>.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map(post => (
              <article key={post.slug}>
                <Link href={`/fr/blog/${post.slug}`} className="block aspect-[3/4] overflow-hidden mb-6 editorial-shadow relative">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover hover:scale-105 transition-all duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>
                <Link href={`/fr/blog/${post.slug}`}>
                  <h2 className="font-headline-md text-primary mb-3 hover:underline leading-snug">{post.title}</h2>
                </Link>
                <p className="text-secondary text-sm mb-4 leading-relaxed line-clamp-3">{post.excerpt}</p>
                <Link
                  href={`/fr/blog/${post.slug}`}
                  className="text-primary font-bold text-[10px] uppercase tracking-widest border-b border-primary/20 hover:border-primary transition-all pb-1 inline-block"
                >
                  Lire le guide
                </Link>
              </article>
            ))}
          </div>
        )}

        <div className="mt-16 pt-10 border-t border-outline-variant/30 text-center">
          <p className="text-secondary text-sm">
            Vous cherchez un autre article ? La bibliothèque complète est disponible dans la{' '}
            <Link href="/blog" hrefLang="en-CA" className="underline text-primary">version anglaise</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}
