import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import LoungeFinderQuiz from '@/components/LoungeFinderQuiz'
import type { MatchableLounge } from '@/lib/card-access'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'

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

export default async function Page() {
  const supabase = await createClient()
  const [{ data: lounges }, { data: airports }] = await Promise.all([
    supabase
      .from('lounges')
      .select('id, name, slug, terminal, rating, review_count, access_types, airports(iata_code, name, city)')
      .eq('is_active', true)
      .order('rating', { ascending: false, nullsFirst: false }),
    supabase
      .from('airports')
      .select('iata_code, name, city')
      .eq('is_active', true)
      .order('iata_code'),
  ])

  const rows = (lounges ?? []).map((l) => {
    const airport = Array.isArray(l.airports) ? l.airports[0] : l.airports
    return {
      ...({
        id: l.id,
        name: l.name,
        slug: l.slug,
        terminal: l.terminal,
        iata: airport?.iata_code ?? '???',
        access_types: l.access_types as MatchableLounge['access_types'],
      } as MatchableLounge),
      rating: l.rating as number | null,
      reviewCount: l.review_count as number | null,
    }
  })

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
          airports={(airports ?? []).map((a) => ({
            iata: a.iata_code as string,
            name: a.name as string,
            city: a.city as string,
          }))}
        />
      </main>
    </div>
  )
}
