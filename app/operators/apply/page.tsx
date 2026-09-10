import Link from 'next/link'
import type { Metadata } from 'next'
import OperatorApplyForm from '@/components/OperatorApplyForm'

interface Props {
  searchParams: Promise<{ tier?: string }>
}

export const metadata: Metadata = {
  title: 'Apply — AirportLounges.ca Operator Portal',
  description: 'Apply to claim, verify, or enhance your lounge listing on AirportLounges.ca. Reply within two business days.',
  alternates: { canonical: 'https://www.airportlounges.ca/operators/apply' },
  robots: { index: false, follow: true },
}

const ALLOWED = new Set(['basic', 'enhanced', 'featured'] as const)
type Tier = 'basic' | 'enhanced' | 'featured'

export default async function OperatorApplyPage({ searchParams }: Props) {
  const sp = await searchParams
  const tier: Tier = ALLOWED.has(sp.tier as Tier) ? (sp.tier as Tier) : 'basic'

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',      item: 'https://www.airportlounges.ca' },
      { '@type': 'ListItem', position: 2, name: 'Operators', item: 'https://www.airportlounges.ca/operators' },
      { '@type': 'ListItem', position: 3, name: 'Apply',     item: 'https://www.airportlounges.ca/operators/apply' },
    ],
  }

  return (
    <div className="bg-bone-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="max-w-3xl mx-auto px-gutter py-16">
        <Link
          href="/operators"
          className="inline-flex items-center gap-2 font-label-caps text-[10px] uppercase tracking-widest text-secondary hover:text-primary transition-colors mb-8"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_back</span>
          Back to plans
        </Link>

        <h1 className="font-headline-lg text-headline-lg text-primary mb-3">Claim your lounge listing</h1>
        <p className="text-secondary mb-10 leading-relaxed">
          Tell us about your lounge. We verify each application by email within two business days.
          {tier === 'enhanced' && ' You selected the Enhanced tier — $99 CAD / month.'}
          {tier === 'featured' && ' You selected the Featured tier — $499 CAD / month.'}
        </p>

        <div className="bg-white border border-outline-variant/30 p-8">
          <OperatorApplyForm defaultTier={tier} />
        </div>
      </div>
    </div>
  )
}
