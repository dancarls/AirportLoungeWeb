import { db } from '@/lib/db'
import { cachedRead } from '@/lib/cached-read'
import type { Metadata } from 'next'
import LoungeFinderQuiz from '@/components/LoungeFinderQuiz'
import type { MatchableLounge } from '@/lib/card-access'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'

type QuizRow = MatchableLounge & { rating: number | null; reviewCount: number | null }

export const metadata: Metadata = {
  title: 'Lounge Finder — Find Your Perfect Canadian Airport Lounge in 30 Seconds',
  description:
    'Three quick questions and we recommend your best lounge at any Canadian airport — based on what you fly, what you carry, and your airline status.',
  alternates: {
    canonical: 'https://www.airportlounges.ca/tools/lounge-finder',
  },
  openGraph: {
    title: 'Lounge Finder — AirportLounges.ca',
    description: 'Find your best Canadian airport lounge in 30 seconds.',
    url: 'https://www.airportlounges.ca/tools/lounge-finder',
    images: ['https://www.airportlounges.ca/opengraph-image'],
  },
}

export const revalidate = 3600
export const dynamic = 'force-dynamic'

export default async function Page() {
  const [rows, airports] = await cachedRead('lounge-finder', 3600, () => Promise.all([
    db<QuizRow[]>`
      SELECT l.id, l.name, l.slug, l.terminal, l.access_types,
        a.iata_code AS iata,
        l.rating, l.review_count AS "reviewCount"
      FROM lounges l
      JOIN airports a ON a.id = l.airport_id
      WHERE l.is_active = true
      ORDER BY l.rating DESC NULLS LAST, l.name ASC, l.slug ASC
    `,
    db<{ iata_code: string; name: string; city: string }[]>`
      SELECT iata_code, name, city FROM airports
      WHERE is_active = true ORDER BY iata_code ASC
    `,
  ]))

  return (
    <div className="bg-bone-white min-h-screen">
      <header className="bg-primary text-white">
        <div className="max-w-container-max mx-auto px-gutter py-12 md:py-16">
          <span className="font-label-caps text-[11px] uppercase tracking-[0.2em] text-primary-fixed-dim block mb-3">
            Lounge Finder
          </span>
          <h1 className="font-headline-lg text-3xl md:text-5xl leading-tight mb-4">
            Three questions. Your best lounge.
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
            Pick an airport, tell us what you carry, and we&apos;ll recommend the lounge
            that fits you best — including which card would unlock better options.
          </p>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-gutter py-12">
        <AffiliateDisclosure variant="inline" />
        <LoungeFinderQuiz
          lounges={rows}
          airports={airports.map((a) => ({
            iata: a.iata_code,
            name: a.name,
            city: a.city,
          }))}
        />
      </main>
    </div>
  )
}
