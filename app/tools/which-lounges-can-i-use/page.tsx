import { db } from '@/lib/db'
import type { Metadata } from 'next'
import LoungeMatcherClient from '@/components/LoungeMatcherClient'
import type { MatchableLounge } from '@/lib/card-access'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'

export const metadata: Metadata = {
  title: 'Which Lounges Can I Use? — Match Your Cards to Canadian Airport Lounges',
  description:
    'Tell us your credit cards and status. We show you every Canadian airport lounge you can walk into — with the access rule for each one.',
  alternates: {
    canonical: 'https://www.airportlounges.ca/tools/which-lounges-can-i-use',
  },
  openGraph: {
    title: 'Which Lounges Can I Use? — AirportLounges.ca',
    description:
      'Match your Canadian credit cards and airline status to every lounge you can access.',
    url: 'https://www.airportlounges.ca/tools/which-lounges-can-i-use',
    images: ['https://www.airportlounges.ca/opengraph-image'],
  },
}

export const revalidate = 3600
export const dynamic = 'force-dynamic'

export default async function Page() {
  const rows = await db<MatchableLounge[]>`
    SELECT l.id, l.name, l.slug, l.terminal, l.access_types,
      a.iata_code AS iata
    FROM lounges l
    JOIN airports a ON a.id = l.airport_id
    WHERE l.is_active = true
    ORDER BY l.name
  `

  return (
    <div className="bg-bone-white min-h-screen">
      <header className="bg-primary text-white">
        <div className="max-w-container-max mx-auto px-gutter py-12 md:py-16">
          <span className="font-label-caps text-[11px] uppercase tracking-[0.2em] text-primary-fixed-dim block mb-3">
            Lounge Access Tool
          </span>
          <h1 className="font-headline-lg text-3xl md:text-5xl leading-tight mb-4">
            Which lounges can you walk into?
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
            Tell us what&apos;s in your wallet. We&apos;ll show you every Canadian airport
            lounge you can access right now — plus the one card that would unlock the
            rest.
          </p>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-gutter py-12">
        <AffiliateDisclosure variant="inline" />
        <LoungeMatcherClient lounges={rows} />
      </main>
    </div>
  )
}
