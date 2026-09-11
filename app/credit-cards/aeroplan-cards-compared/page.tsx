import Link from 'next/link'
import type { Metadata } from 'next'
import { affiliate, AFFILIATE_REL, sideBySide, pointsCalculator } from '@/lib/affiliates'
import NewsletterCTA from '@/components/NewsletterCTA'

export const metadata: Metadata = {
  title: 'Best Aeroplan Credit Card in Canada (2026): TD vs CIBC vs Amex Compared',
  description: 'The three Canadian Aeroplan premium cards compared side by side — TD Aeroplan Visa Infinite Privilege, CIBC Aeroplan Visa Infinite Privilege, and Amex Aeroplan Reserve. Earn rates, lounge access, guest rules, and how to choose.',
  keywords: [
    'best aeroplan credit card',
    'aeroplan credit card comparison',
    'td aeroplan visa infinite privilege',
    'cibc aeroplan visa infinite privilege',
    'amex aeroplan reserve',
  ],
  alternates: { canonical: 'https://www.airportlounges.ca/credit-cards/aeroplan-cards-compared' },
  openGraph: {
    title: 'Best Aeroplan Credit Card in Canada (2026): TD vs CIBC vs Amex Compared',
    description: 'The three Canadian Aeroplan premium cards compared side by side.',
    url: 'https://www.airportlounges.ca/credit-cards/aeroplan-cards-compared',
  },
}

export const revalidate = 3600

const PAGE_URL = 'https://www.airportlounges.ca/credit-cards/aeroplan-cards-compared'
const PUBLISHED = '2026-09-10'
const REVIEWED = '2026-09-10'

const CARDS = [
  {
    name: 'American Express Aeroplan Reserve',
    fee: '$599',
    aeroplanEarn: '3x on Air Canada, 1.25x elsewhere',
    priorityPass: '✅ Yes — unlimited visits, unlimited free guests',
    guests: '1 free MLL guest + 4 One-Time Guest Passes/yr',
    bestFor: 'Best all-around Aeroplan card. Only Aeroplan card with Priority Pass built in — and unlimited free PP guests beats even the Amex Platinum.',
    affiliateKey: 'finlywealth-amex-aeroplan-reserve' as const,
  },
  {
    name: 'TD Aeroplan Visa Infinite Privilege',
    fee: '$599',
    aeroplanEarn: '1.5x on Air Canada, 1.5x on groceries/gas/dining',
    priorityPass: '❌ Not included',
    guests: '1 free MLL guest + 4 One-Time Guest Passes/yr',
    bestFor: 'Best Aeroplan card for households — the strongest everyday earn rates on groceries and gas, plus an annual companion voucher for AC flights.',
    affiliateKey: 'finlywealth-td-aeroplan-vip' as const,
  },
  {
    name: 'CIBC Aeroplan Visa Infinite Privilege',
    fee: '$599',
    aeroplanEarn: '2x on Air Canada, 1x elsewhere',
    priorityPass: '❌ Not included',
    guests: '1 free MLL guest + 4 One-Time Guest Passes/yr',
    bestFor: 'Best for high Air Canada spend — 2x earn on AC tickets is the strongest revenue multiplier of the three cards.',
    affiliateKey: 'finlywealth-cibc-aeroplan-vip' as const,
  },
] as const

const FAQS = [
  {
    q: 'Which Aeroplan credit card is best for airport lounge access?',
    a: 'The American Express Aeroplan Reserve is the clear winner for lounge access. It is the only Canadian Aeroplan card that stacks Priority Pass Select on top of Maple Leaf Lounge access — giving cardholders access to 1,600+ Priority Pass lounges globally plus every Air Canada MLL, with unlimited free guests at Priority Pass locations. The TD and CIBC Aeroplan VIP cards include MLL access but do not include Priority Pass.',
  },
  {
    q: 'Do all three Aeroplan credit cards include the Air Canada Maple Leaf Lounge?',
    a: 'Yes. The TD Aeroplan Visa Infinite Privilege, CIBC Aeroplan Visa Infinite Privilege, and American Express Aeroplan Reserve all grant unlimited Maple Leaf Lounge access on same-day Air Canada flights, with one free companion guest per visit and four Air Canada One-Time Guest Passes per calendar year for domestic and US Transborder MLLs.',
  },
  {
    q: 'Which Aeroplan card has the best earn rate on Air Canada?',
    a: 'The CIBC Aeroplan Visa Infinite Privilege earns 2x Aeroplan on Air Canada purchases — the highest revenue multiplier among the two Visa options. The Amex Aeroplan Reserve earns 3x on Air Canada, the strongest of all three, but Amex acceptance is narrower than Visa in Canada.',
  },
  {
    q: 'Which Aeroplan card is best for families?',
    a: 'The TD Aeroplan Visa Infinite Privilege is the strongest family-oriented pick — 1.5x Aeroplan on groceries, gas, and dining outperforms both alternatives on everyday household spending, and the annual worldwide companion voucher pairs well with family travel. Add in the four One-Time MLL Guest Passes for family lounge visits.',
  },
  {
    q: 'Is the Amex Aeroplan Reserve worth $599 per year?',
    a: 'For travellers who use both Priority Pass and Maple Leaf Lounges more than roughly 6 times per year with a companion, yes — the Priority Pass Select benefit alone (with unlimited free guests) is worth $200+ in raw membership fees, and the Maple Leaf Lounge access adds another $600+ in avoided walk-in fees at a moderate visit rate. Plus the 3x Aeroplan earn on Air Canada tickets.',
  },
  {
    q: 'Should I get an Aeroplan credit card if I hold the Amex Platinum already?',
    a: 'The Amex Platinum does not include Maple Leaf Lounge access — so adding an Aeroplan card is the only way to unlock MLL entry. Adding the Amex Aeroplan Reserve alongside the Platinum gives you two Priority Pass memberships, which is redundant; the TD or CIBC Aeroplan VIP pairs more efficiently with a Platinum since you get MLL from the Aeroplan card and PP from the Platinum without overlap.',
  },
  {
    q: 'Can I use an Aeroplan credit card for lounge access on a WestJet or Delta flight?',
    a: 'No. Maple Leaf Lounge access via an Aeroplan credit card requires the cardholder to be travelling on a same-day Air Canada operating flight (which includes AC codeshares with Star Alliance partners). WestJet, Delta, and non-AC operating flights do not qualify, regardless of connection.',
  },
  {
    q: 'How does the annual companion voucher work on the TD Aeroplan VIP?',
    a: 'The TD Aeroplan Visa Infinite Privilege includes an annual worldwide companion voucher usable on paid Air Canada bookings — the second passenger pays only taxes and fees (plus a fixed nominal fare component on some routes). Restrictions apply on high-season dates and certain fare classes. It is not valid on award tickets or Rouge-only routes.',
  },
  {
    q: 'Which Aeroplan card has the best welcome bonus right now?',
    a: 'Aeroplan credit card welcome bonuses change quarterly. As of September 2026, well-timed applications during a promotional window can net 60,000–95,000 Aeroplan points across the three cards — enough for a one-way business class transatlantic flight on Air Canada. Compare current welcome bonuses on FinlyWealth before applying to time the application to the strongest current offer.',
  },
]

export default function AeroplanComparedPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',          item: 'https://www.airportlounges.ca' },
      { '@type': 'ListItem', position: 2, name: 'Credit Cards',  item: 'https://www.airportlounges.ca/credit-cards' },
      { '@type': 'ListItem', position: 3, name: 'Aeroplan Cards Compared', item: PAGE_URL },
    ],
  }

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Aeroplan Credit Card in Canada (2026): TD vs CIBC vs Amex Compared',
    datePublished: PUBLISHED,
    dateModified: REVIEWED,
    inLanguage: 'en-CA',
    url: PAGE_URL,
    author: { '@type': 'Organization', name: 'AirportLounges.ca Editorial Team', url: 'https://www.airportlounges.ca/about' },
    publisher: { '@type': 'Organization', name: 'AirportLounges.ca', url: 'https://www.airportlounges.ca' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE_URL },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  const speakableLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Best Aeroplan Credit Card in Canada (2026)',
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '[data-speakable="intro"]', '[data-speakable="faq-answer"]'] },
    url: PAGE_URL,
  }

  return (
    <div className="bg-bone-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableLd) }} />

      <header className="bg-primary text-white py-16">
        <div className="max-w-container-max mx-auto px-gutter">
          <nav className="text-sm mb-4">
            <Link href="/" className="text-primary-fixed/80 hover:text-primary-fixed underline underline-offset-2">Home</Link>
            <span className="text-primary-fixed/40 mx-2">›</span>
            <Link href="/credit-cards" className="text-primary-fixed/80 hover:text-primary-fixed underline underline-offset-2">Credit Cards</Link>
            <span className="text-primary-fixed/40 mx-2">›</span>
            <span className="text-primary-fixed">Aeroplan Cards Compared</span>
          </nav>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-4 leading-tight max-w-4xl">
            Best Aeroplan Credit Card in Canada (2026): TD vs CIBC vs Amex Compared
          </h1>
          <p data-speakable="intro" className="font-body-lg text-body-lg text-bone-white/85 max-w-3xl leading-relaxed">
            <strong>Three cards, all $599 annual fee, all opening the Air Canada Maple Leaf Lounge — but only one includes Priority Pass and unlimited free lounge guests.</strong> The American Express Aeroplan Reserve wins for most travellers. The TD version is stronger for families with big grocery/gas spend. The CIBC version wins for heavy Air Canada revenue spend. Full head-to-head below.
          </p>
        </div>
      </header>

      <div className="max-w-container-max mx-auto px-gutter py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">

        <article className="lg:col-span-3 space-y-12">

          <div className="pb-6 border-b border-outline-variant/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }}>edit_note</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-primary text-sm">By AirportLounges.ca Editorial Team</p>
                <p className="text-xs text-secondary mt-0.5 leading-relaxed">Card benefits verified against issuer T&C pages, Air Canada Aeroplan program terms, and current cardholder communications.</p>
                <p className="text-xs text-secondary mt-2">
                  Published <time dateTime={PUBLISHED}>September 10, 2026</time>
                  {' · Last verified '}<time dateTime={REVIEWED}>September 10, 2026</time>
                  {' · '}<Link href="/about#sourcing" className="underline underline-offset-2 hover:text-primary">Sourcing methodology</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="bg-primary text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 -my-4">
            <div className="flex-1">
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-primary-fixed/70 block mb-2">Sponsored</span>
              <h3 className="font-headline-md text-headline-md text-primary-fixed mb-2">See current welcome bonuses and rebates</h3>
              <p className="text-bone-white/80 text-sm leading-relaxed">All three Aeroplan premium cards, side by side, with any active FinlyWealth cashback rebates on top of issuer offers.</p>
            </div>
            <a
              href={affiliate('finlywealth-aeroplan-cards')}
              target="_blank"
              rel={AFFILIATE_REL}
              className="shrink-0 bg-primary-fixed text-on-primary-fixed px-8 py-4 font-label-caps text-[10px] uppercase tracking-widest hover:bg-white transition-all"
            >
              Compare Aeroplan Cards
            </a>
          </div>

          {/* Comparison table */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-6">Head-to-head comparison</h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-primary/5 text-primary text-left">
                  <tr>
                    <th className="p-3 font-semibold border border-outline-variant/40">Feature</th>
                    <th className="p-3 font-semibold border border-outline-variant/40">Amex Aeroplan Reserve</th>
                    <th className="p-3 font-semibold border border-outline-variant/40">TD Aeroplan VIP</th>
                    <th className="p-3 font-semibold border border-outline-variant/40">CIBC Aeroplan VIP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">Annual fee</td><td className="p-3 border border-outline-variant/40">$599</td><td className="p-3 border border-outline-variant/40">$599</td><td className="p-3 border border-outline-variant/40">$599</td></tr>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">Air Canada earn rate</td><td className="p-3 border border-outline-variant/40">3x Aeroplan</td><td className="p-3 border border-outline-variant/40">1.5x</td><td className="p-3 border border-outline-variant/40">2x</td></tr>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">Groceries earn</td><td className="p-3 border border-outline-variant/40">1.25x</td><td className="p-3 border border-outline-variant/40">1.5x</td><td className="p-3 border border-outline-variant/40">1x</td></tr>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">Maple Leaf Lounge</td><td className="p-3 border border-outline-variant/40">✅ Unlimited on AC flights, +1 free guest</td><td className="p-3 border border-outline-variant/40">✅ Same</td><td className="p-3 border border-outline-variant/40">✅ Same</td></tr>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">Priority Pass Select</td><td className="p-3 border border-outline-variant/40 font-semibold text-primary">✅ Yes, unlimited free guests</td><td className="p-3 border border-outline-variant/40">❌ No</td><td className="p-3 border border-outline-variant/40">❌ No</td></tr>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">One-Time Guest Passes/yr</td><td className="p-3 border border-outline-variant/40">4</td><td className="p-3 border border-outline-variant/40">4</td><td className="p-3 border border-outline-variant/40">4</td></tr>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">Annual companion voucher</td><td className="p-3 border border-outline-variant/40">❌ Reserve tier only</td><td className="p-3 border border-outline-variant/40">✅ Buy-one-get-one within N. America / Sun / Central Am.</td><td className="p-3 border border-outline-variant/40">✅ (limited routes)</td></tr>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">NEXUS credit</td><td className="p-3 border border-outline-variant/40">Every 48 months</td><td className="p-3 border border-outline-variant/40">Every 48 months</td><td className="p-3 border border-outline-variant/40">Every 48 months</td></tr>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">Foreign transaction fee</td><td className="p-3 border border-outline-variant/40">2.5%</td><td className="p-3 border border-outline-variant/40">2.5%</td><td className="p-3 border border-outline-variant/40">2.5%</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Head-to-head profiles */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-6">Full card profiles</h2>
            <div className="space-y-8">
              {CARDS.map(c => (
                <div key={c.name} className="bg-white border border-outline-variant/30 p-6 md:p-8">
                  <div className="flex flex-wrap items-baseline gap-4 mb-3">
                    <h3 className="font-headline-md text-primary">{c.name}</h3>
                    <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary bg-champagne-glint/50 px-2 py-1">{c.fee}/yr</span>
                  </div>
                  <p className="text-on-surface-variant mb-4 leading-relaxed"><strong className="text-on-surface">{c.bestFor}</strong></p>
                  <ul className="text-sm text-on-surface-variant space-y-1 mb-5">
                    <li><strong>Aeroplan earn:</strong> {c.aeroplanEarn}</li>
                    <li><strong>Priority Pass:</strong> {c.priorityPass}</li>
                    <li><strong>Maple Leaf Lounge guests:</strong> {c.guests}</li>
                  </ul>
                  <a
                    href={affiliate(c.affiliateKey)}
                    target="_blank"
                    rel={AFFILIATE_REL}
                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity"
                  >
                    See {c.name} <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                  </a>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-secondary/60 mt-4 italic">Sponsored — we may earn a commission when you apply. Card benefits and welcome bonuses are subject to change.</p>
          </section>

          {/* Side-by-side + Aeroplan points calculator */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Head-to-head tools</h2>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              Prefer a two-card side-by-side view? Or want to see what a specific Aeroplan welcome bonus is worth in dollars? These FinlyWealth tools handle both:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                { href: sideBySide('amex-aeroplan-reserve', 'td-aeroplan-visa-infinite-privilege'), label: 'Amex Aeroplan Reserve vs TD Aeroplan VIP' },
                { href: sideBySide('amex-aeroplan-reserve', 'cibc-aeroplan-visa-infinite-privilege'), label: 'Amex Aeroplan Reserve vs CIBC Aeroplan VIP' },
                { href: sideBySide('td-aeroplan-visa-infinite-privilege', 'cibc-aeroplan-visa-infinite-privilege'), label: 'TD Aeroplan VIP vs CIBC Aeroplan VIP' },
                { href: pointsCalculator('aeroplan'), label: 'Aeroplan points value calculator' },
                { href: affiliate('finlywealth-combos-calculator'), label: 'Multi-card combos calculator' },
                { href: affiliate('finlywealth-quiz'), label: 'Not sure? Take the recommendation quiz' },
              ].map(c => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target="_blank"
                    rel={AFFILIATE_REL}
                    className="flex items-center justify-between bg-white border border-outline-variant/30 hover:border-primary/40 hover:bg-champagne-glint/20 transition-colors p-4 text-sm group"
                  >
                    <span className="text-primary font-medium">{c.label}</span>
                    <span className="material-symbols-outlined text-sand-dark group-hover:text-primary transition-colors" style={{ fontSize: '16px' }}>arrow_forward</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-secondary/50 italic">Tools hosted on FinlyWealth — sponsored links.</p>
          </section>

          {/* Which is best for */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-6">Which is best for your travel pattern?</h2>
            <ul className="space-y-4 text-on-surface-variant leading-relaxed">
              <li><strong>Multi-carrier international traveller:</strong> Amex Aeroplan Reserve — the Priority Pass Select network is the only way into non-Star Alliance lounges abroad.</li>
              <li><strong>Air Canada exclusively, solo/couple:</strong> CIBC Aeroplan VIP — highest AC-ticket earn rate (2x) and it opens the MLL.</li>
              <li><strong>Family with young children, heavy household spend:</strong> TD Aeroplan VIP — best everyday earn rates on groceries, gas, and dining, plus the annual companion voucher for family AC bookings.</li>
              <li><strong>Frequent traveller who brings a partner to every lounge:</strong> Amex Aeroplan Reserve — unlimited free Priority Pass guests is unmatched by any Canadian card at any price point.</li>
              <li><strong>You already have the Amex Platinum:</strong> TD or CIBC Aeroplan VIP — the Aeroplan card adds MLL access without duplicating your existing Priority Pass benefit.</li>
            </ul>
          </section>

          {/* Break-even */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-6">Break-even math</h2>
            <p className="text-on-surface-variant leading-relaxed mb-3">All three cards cost $599 annually. Break-even value on lounge and travel benefits alone:</p>
            <ul className="space-y-2 text-on-surface-variant leading-relaxed">
              <li>Roughly <strong>10 Maple Leaf Lounge visits per year with a companion</strong> — at avoided $59 CAD walk-in equivalents — covers the fee on any of the three cards.</li>
              <li>The <strong>TD and CIBC companion vouchers</strong> alone typically deliver $200–$400 in value per year if you use them on transborder or continental routes.</li>
              <li>The <strong>Amex Aeroplan Reserve's Priority Pass benefit</strong> shortens the break-even to roughly <strong>6 combined MLL + Priority Pass visits per year</strong>, because two lounge networks for one fee.</li>
              <li>Well-timed applications during a promotional window can net a welcome bonus worth <strong>$700–$1,500 in Aeroplan redemption value</strong> — enough to cover multi-year fees in year one alone.</li>
            </ul>
          </section>

          {/* FAQ */}
          <section className="pt-8 border-t border-outline-variant/30">
            <h2 className="font-headline-md text-headline-md text-primary mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((f, i) => (
                <details key={i} className="group bg-white border border-outline-variant/30 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer p-5 font-semibold text-primary flex items-start justify-between gap-4 hover:bg-champagne-glint/30 transition-colors">
                    <span className="text-base leading-snug">{f.q}</span>
                    <span className="material-symbols-outlined text-sand-dark shrink-0 group-open:rotate-180 transition-transform" style={{ fontSize: '20px' }}>expand_more</span>
                  </summary>
                  <div data-speakable="faq-answer" className="px-5 pb-5 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant/20 pt-4">
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Closing CTA */}
          <div className="bg-champagne-glint/50 border border-primary/20 p-6 md:p-8 text-center">
            <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary block mb-3">Ready to apply?</span>
            <h3 className="font-headline-md text-headline-md text-primary mb-3">Compare all three Aeroplan cards</h3>
            <p className="text-secondary max-w-xl mx-auto mb-6 leading-relaxed">Current welcome bonuses, annual fees, and any active FinlyWealth cashback rebates in one view.</p>
            <a
              href={affiliate('finlywealth-aeroplan-cards')}
              target="_blank"
              rel={AFFILIATE_REL}
              className="inline-block bg-primary text-white px-10 py-4 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Compare Aeroplan Cards on FinlyWealth
            </a>
            <p className="text-[9px] text-secondary/50 mt-4">Sponsored — we may earn a commission when you apply.</p>
          </div>

          <p className="text-xs text-secondary/70 italic leading-relaxed">
            Card benefits, annual fees, welcome bonuses, and rebate amounts reflect terms current as of the last-verified date above. Terms change without notice — always confirm current details with the issuer before applying. AirportLounges.ca may earn a commission on successful referrals.
          </p>
        </article>

        <aside className="space-y-6">
          <NewsletterCTA
            source="cc-landing:aeroplan-compared"
            variant="light"
            heading="Aeroplan bonus alerts"
            subheading="Get notified when TD, CIBC, or Amex Aeroplan welcome bonuses hit a promotional high."
          />
          <div className="bg-white border border-outline-variant/30 p-5">
            <h3 className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-4">Related Guides</h3>
            <ul className="space-y-2">
              <li><Link href="/blog/best-aeroplan-credit-card-airport-lounge-access" className="text-sm text-secondary hover:text-primary transition-colors underline underline-offset-2">Aeroplan card deep-dive</Link></li>
              <li><Link href="/credit-cards/best-for-airport-lounge-access" className="text-sm text-secondary hover:text-primary transition-colors underline underline-offset-2">All lounge-access cards</Link></li>
              <li><Link href="/blog/amex-platinum-airport-lounge-access-canada" className="text-sm text-secondary hover:text-primary transition-colors underline underline-offset-2">Amex Platinum vs Aeroplan Reserve</Link></li>
              <li><Link href="/blog/priority-pass-lounges-canada" className="text-sm text-secondary hover:text-primary transition-colors underline underline-offset-2">Priority Pass lounges in Canada</Link></li>
              <li><Link href="/credit-cards/rebates" className="text-sm text-secondary hover:text-primary transition-colors underline underline-offset-2">Credit card rebates & cashback</Link></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
