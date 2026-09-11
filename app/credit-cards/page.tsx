import Link from 'next/link'
import type { Metadata } from 'next'
import { affiliate, AFFILIATE_REL } from '@/lib/affiliates'

export const metadata: Metadata = {
  title: 'Canadian Credit Cards for Airport Lounge Access',
  description: 'Independent, up-to-date guides to Canadian credit cards that unlock airport lounge access — Amex Platinum, Aeroplan cards compared, and where to stack a cashback rebate.',
  alternates: { canonical: 'https://www.airportlounges.ca/credit-cards' },
  openGraph: {
    title: 'Canadian Credit Cards for Airport Lounge Access',
    description: 'Independent guides to Canadian credit cards with airport lounge access.',
    url: 'https://www.airportlounges.ca/credit-cards',
  },
}

const HUB_LINKS = [
  {
    href: '/credit-cards/best-for-airport-lounge-access',
    title: 'Best Credit Cards for Airport Lounge Access',
    desc: 'All six Canadian cards that open airport lounges, compared side by side — Amex Platinum, Aeroplan cards, RBC Avion, Scotia Passport.',
  },
  {
    href: '/credit-cards/aeroplan-cards-compared',
    title: 'Aeroplan Cards Compared',
    desc: 'TD vs CIBC vs Amex Aeroplan Reserve — head-to-head on earn rates, lounge benefits, and Priority Pass inclusion.',
  },
  {
    href: '/credit-cards/rebates',
    title: 'Credit Card Rebates & Cashback',
    desc: 'How to stack a supplementary cashback rebate on top of the card issuer\'s welcome bonus.',
  },
] as const

const RELATED_BLOG_LINKS = [
  { href: '/blog/amex-platinum-airport-lounge-access-canada', title: 'Amex Platinum airport lounge access in Canada' },
  { href: '/blog/best-aeroplan-credit-card-airport-lounge-access', title: 'Best Aeroplan credit card for airport lounge access' },
  { href: '/blog/priority-pass-lounges-canada', title: 'The complete Priority Pass Canada guide' },
  { href: '/blog/airport-lounge-guest-fees-canada', title: 'Airport lounge guest fees in Canada' },
]

export default function CreditCardsHubPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',          item: 'https://www.airportlounges.ca' },
      { '@type': 'ListItem', position: 2, name: 'Credit Cards',  item: 'https://www.airportlounges.ca/credit-cards' },
    ],
  }

  return (
    <div className="bg-bone-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <header className="bg-primary text-white py-16">
        <div className="max-w-container-max mx-auto px-gutter">
          <span className="font-label-caps text-[10px] uppercase tracking-widest text-primary-fixed/70 block mb-4">Credit Cards</span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-4 leading-tight max-w-3xl">
            Canadian Credit Cards for Airport Lounge Access
          </h1>
          <p className="font-body-lg text-body-lg text-bone-white/85 max-w-2xl leading-relaxed">
            Independent guides for choosing the right Canadian credit card to unlock airport lounges — Priority Pass, DragonPass, Air Canada Maple Leaf, and more.
          </p>
        </div>
      </header>

      <div className="max-w-container-max mx-auto px-gutter py-12">
        <section aria-label="Credit card guides">
          <h2 className="font-headline-md text-headline-md text-primary mb-8">Landing pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HUB_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="bg-white border border-outline-variant/30 hover:border-primary/40 transition-colors p-6 block group"
              >
                <h3 className="font-headline-md text-primary mb-3 group-hover:underline underline-offset-2">{l.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{l.desc}</p>
                <span className="inline-flex items-center gap-2 mt-4 font-label-caps text-[10px] uppercase tracking-widest text-primary">
                  Read guide <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section aria-label="Related blog posts" className="mt-16">
          <h2 className="font-headline-md text-headline-md text-primary mb-6">Related blog guides</h2>
          <ul className="space-y-3">
            {RELATED_BLOG_LINKS.map(l => (
              <li key={l.href}>
                <Link href={l.href} className="text-primary hover:underline underline-offset-2 font-medium">
                  {l.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 bg-champagne-glint/60 border border-primary/15 p-8 text-center">
          <h2 className="font-headline-md text-headline-md text-primary mb-3">Not sure which card to apply for?</h2>
          <p className="text-secondary max-w-xl mx-auto mb-6 leading-relaxed">
            FinlyWealth\'s Canadian credit-card comparison tool takes your monthly spending and recommends the best-value cards for your travel pattern.
          </p>
          <a
            href={affiliate('finlywealth-compare-tool')}
            target="_blank"
            rel={AFFILIATE_REL}
            className="inline-block bg-primary text-white px-10 py-4 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Open the Comparison Tool
          </a>
          <p className="text-[9px] text-secondary/50 mt-4">Sponsored — we may earn a commission when you apply.</p>
        </section>

        {/* Additional tools grid */}
        <section className="mt-16" aria-label="More FinlyWealth tools">
          <h2 className="font-headline-md text-headline-md text-primary mb-6 text-center">More decision tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { href: affiliate('finlywealth-quiz'), title: 'Card recommendation quiz', desc: 'Answer a few questions, get a personalized card pick.' },
              { href: affiliate('finlywealth-combos-calculator'), title: 'Multi-card combos calculator', desc: 'Find the best two- or three-card combination for your spending.' },
              { href: 'https://www.finlywealth.com/points-calculator/aeroplan?utm_source=airportlounges_ca', title: 'Aeroplan points calculator', desc: 'See what a specific number of Aeroplan points is worth in cash.' },
            ].map(t => (
              <a
                key={t.title}
                href={t.href}
                target="_blank"
                rel={AFFILIATE_REL}
                className="bg-white border border-outline-variant/30 hover:border-primary/40 transition-colors p-5 block group"
              >
                <h3 className="font-bold text-primary mb-2 group-hover:underline underline-offset-2">{t.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{t.desc}</p>
              </a>
            ))}
          </div>
          <p className="text-[10px] text-secondary/50 mt-3 italic text-center">Tools hosted on FinlyWealth — sponsored links.</p>
        </section>
      </div>
    </div>
  )
}
