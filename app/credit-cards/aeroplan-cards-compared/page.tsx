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
const REVIEWED = '2026-09-11'

const CARDS = [
  {
    name: 'CIBC Aeroplan Visa Infinite Privilege',
    fee: '$599',
    aeroplanEarn: '2x on Air Canada, 1.5x on gas / EV / groceries / travel / dining, 1.25x elsewhere',
    otherLoungeNetwork: '6 Visa Airport Companion visits / year (DragonPass, 1,200+ lounges worldwide)',
    guests: '1 guest at Maple Leaf Lounge through Dec. 31, 2026; supplementary card $149',
    bestFor: 'Best overall for lounge-focused eligible Canadians. Cheapest supplementary card ($149). Strongest trip-cancellation insurance ($10,000/trip). Same lounge package as TD.',
    affiliateKey: 'finlywealth-cibc-aeroplan-vip' as const,
  },
  {
    name: 'TD Aeroplan Visa Infinite Privilege',
    fee: '$599',
    aeroplanEarn: '2x on Air Canada, 1.5x on gas / EV / groceries / travel / transit / dining, 1.25x elsewhere',
    otherLoungeNetwork: '6 Visa Airport Companion visits / year (DragonPass, 1,200+ lounges worldwide)',
    guests: '1 guest at Maple Leaf Lounge through Dec. 31, 2026; supplementary card $199',
    bestFor: 'Close second. Same lounge package as CIBC. Better if you bank with TD (fee rebates are common) or the TD welcome offer is stronger on the day.',
    affiliateKey: 'finlywealth-td-aeroplan-vip' as const,
  },
  {
    name: 'American Express Aeroplan Reserve',
    fee: '$599',
    aeroplanEarn: '3x on Air Canada, 2x on dining and food delivery in Canada, 1.25x elsewhere',
    otherLoungeNetwork: 'Priority Pass membership: US$99 annual fee waived; each visit charged at the prevailing rate',
    guests: '1 guest at Maple Leaf Lounge (no end date stated); premium supplementary card $199',
    bestFor: 'Conditional pick. Best for heavy Air Canada spenders (3x), applicants without $150k personal / $200k household income (no published floor), and Toronto Pearson regulars (priority security lane, valet, 15% parking).',
    affiliateKey: 'finlywealth-amex-aeroplan-reserve' as const,
  },
] as const

const FAQS = [
  {
    q: 'Which Aeroplan credit card is best for airport lounge access?',
    a: 'For most eligible Canadians, the CIBC Aeroplan Visa Infinite Privilege is the strongest Aeroplan lounge card. All three $599 Aeroplan cards (CIBC, TD Aeroplan VIP, Amex Aeroplan Reserve) open the Air Canada Maple Leaf Lounge and Air Canada Café network in Canada and the U.S. CIBC and TD each add six complimentary Visa Airport Companion visits a year (DragonPass network) that work on any airline; Amex includes fee-waived Priority Pass membership but every Priority Pass visit is charged at the prevailing rate. CIBC edges TD on supplementary card price ($149 vs $199) and insurance limits.',
  },
  {
    q: 'Do all three Aeroplan credit cards include the Air Canada Maple Leaf Lounge?',
    a: 'Yes. The TD Aeroplan Visa Infinite Privilege, CIBC Aeroplan Visa Infinite Privilege, and American Express Aeroplan Reserve each grant unlimited eligible Maple Leaf Lounge and Air Canada Café access in Canada and the U.S. on a same-day departing Air Canada, Air Canada Rouge, Air Canada Express or Star Alliance ticket. Access excludes the Air Canada Signature Suite and international Maple Leaf Lounges outside North America (London, Paris, Frankfurt).',
  },
  {
    q: 'Which Aeroplan card has the best earn rate on Air Canada?',
    a: 'The American Express Aeroplan Reserve earns 3 points per $1 on Air Canada and Air Canada Vacations purchases — the strongest of the three cards. TD and CIBC each earn 2 points per $1 on Air Canada. For a household putting $10,000 a year on Air Canada fares, Amex earns 30,000 points versus 20,000 on the Visa cards.',
  },
  {
    q: 'Does the Amex Aeroplan Reserve include Priority Pass visits?',
    a: 'The Amex Aeroplan Reserve waives the US$99 annual Priority Pass membership fee, but every Priority Pass lounge visit is charged at the prevailing rate. That is access at a member price, not included visits. If free complimentary lounge visits on non-Air-Canada flights matter, the TD or CIBC Aeroplan VIP each include six Visa Airport Companion visits per year at no extra cost.',
  },
  {
    q: 'Which Aeroplan card is best for families or couples?',
    a: 'The CIBC Aeroplan Visa Infinite Privilege — its premium supplementary card is $149 (versus $199 at TD and Amex), so a couple with independent lounge access pays $748 a year at CIBC versus $798 at the other two. CIBC also publishes the strongest trip-cancellation coverage: up to $10,000 per trip versus $5,000 at TD and $3,000 at Amex.',
  },
  {
    q: 'Is the Amex Aeroplan Reserve worth $599 per year?',
    a: 'It depends on your travel pattern. The Reserve wins for three profiles: heavy Air Canada spenders (3x earn), applicants who cannot show $150,000 personal or $200,000 household income (Amex publishes no fixed floor, though approval still depends on their underwriting), and Toronto Pearson regulars who will use the priority security lane, valet, and 15% parking discount. If none of those apply, CIBC or TD deliver better lounge value at the same $599 fee.',
  },
  {
    q: 'Should I get an Aeroplan credit card if I hold the Amex Platinum already?',
    a: 'Yes if you want Maple Leaf Lounge access — the Amex Platinum does not open the MLL network at any tier. The TD or CIBC Aeroplan VIP pairs efficiently with a Platinum: your Aeroplan card unlocks MLLs, your Platinum covers Priority Pass and the Global Lounge Collection. Note the Amex Platinum caps Priority Pass at 6 visits per year from January 1, 2027 unless you spend $20,000 annually on the Platinum.',
  },
  {
    q: 'Can I use an Aeroplan credit card for lounge access on a WestJet or Delta flight?',
    a: 'Not for the Air Canada Maple Leaf Lounge — MLL access requires the cardholder to be travelling on a same-day Air Canada, Air Canada Rouge, Air Canada Express or Star Alliance operating flight. However, on TD or CIBC you can still use one of your six Visa Airport Companion visits at a DragonPass-partner lounge regardless of airline. Amex Priority Pass visits are per-charge and work regardless of airline as well.',
  },
  {
    q: 'What happens after December 31, 2026 for guest access?',
    a: 'TD and CIBC currently confirm the one complimentary Maple Leaf Lounge guest only through December 31, 2026. Nothing beyond that date is published. Amex publishes one guest with no expiry date, so on paper Amex looks better for couples after 2026 — but Air Canada\'s own lounge page calls complimentary guest admission a limited-time benefit, and any issuer could change its terms. Recheck the issuer pages in December 2026 before making a decision based on guest access.',
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
            <strong>Three cards, all $599 annual fee, all opening the eligible Air Canada Maple Leaf Lounge network in Canada and the U.S.</strong> CIBC wins for most households: same lounge package as TD, cheaper supplementary card ($149), strongest trip-cancellation insurance ($10,000/trip). TD is a close second — a better welcome offer or a TD banking rebate can flip the result. Amex Aeroplan Reserve is the pick for heavy Air Canada spending, applicants below the Visa Infinite Privilege income floor, or Toronto Pearson regulars — its Priority Pass visits are paid, not included. TD and CIBC confirm the one-guest benefit only through December 31, 2026.
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
                    <th className="p-3 font-semibold border border-outline-variant/40">CIBC Aeroplan VIP</th>
                    <th className="p-3 font-semibold border border-outline-variant/40">TD Aeroplan VIP</th>
                    <th className="p-3 font-semibold border border-outline-variant/40">Amex Aeroplan Reserve</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">Annual fee</td><td className="p-3 border border-outline-variant/40">$599</td><td className="p-3 border border-outline-variant/40">$599</td><td className="p-3 border border-outline-variant/40">$599</td></tr>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">Supplementary card (with lounge access)</td><td className="p-3 border border-outline-variant/40 font-semibold text-primary">$149</td><td className="p-3 border border-outline-variant/40">$199</td><td className="p-3 border border-outline-variant/40">$199</td></tr>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">Published income floor</td><td className="p-3 border border-outline-variant/40">$150k / $200k</td><td className="p-3 border border-outline-variant/40">$150k / $200k</td><td className="p-3 border border-outline-variant/40">None published</td></tr>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">Air Canada earn rate</td><td className="p-3 border border-outline-variant/40">2x</td><td className="p-3 border border-outline-variant/40">2x</td><td className="p-3 border border-outline-variant/40 font-semibold text-primary">3x</td></tr>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">Gas / groceries / travel / dining</td><td className="p-3 border border-outline-variant/40">1.5x</td><td className="p-3 border border-outline-variant/40">1.5x (incl. transit)</td><td className="p-3 border border-outline-variant/40">2x dining, 1.25x other</td></tr>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">Maple Leaf Lounge (Canada + U.S.)</td><td className="p-3 border border-outline-variant/40">✅ Unlimited</td><td className="p-3 border border-outline-variant/40">✅ Unlimited</td><td className="p-3 border border-outline-variant/40">✅ Unlimited</td></tr>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">Guest in 2026</td><td className="p-3 border border-outline-variant/40">1, through Dec. 31, 2026</td><td className="p-3 border border-outline-variant/40">1, through Dec. 31, 2026</td><td className="p-3 border border-outline-variant/40">1, no expiry stated</td></tr>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">Other lounge network</td><td className="p-3 border border-outline-variant/40">6 Visa Airport Companion visits / year</td><td className="p-3 border border-outline-variant/40">6 Visa Airport Companion visits / year</td><td className="p-3 border border-outline-variant/40">Priority Pass (fee waived; each visit charged)</td></tr>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">Trip cancellation, per trip</td><td className="p-3 border border-outline-variant/40 font-semibold text-primary">$10,000</td><td className="p-3 border border-outline-variant/40">$5,000</td><td className="p-3 border border-outline-variant/40">$3,000</td></tr>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">Emergency medical, age 65+</td><td className="p-3 border border-outline-variant/40">10 days</td><td className="p-3 border border-outline-variant/40">4 days</td><td className="p-3 border border-outline-variant/40">Not included</td></tr>
                  <tr><td className="p-3 border border-outline-variant/40 font-semibold">Foreign transaction fee</td><td className="p-3 border border-outline-variant/40">2.5%</td><td className="p-3 border border-outline-variant/40">2.5%</td><td className="p-3 border border-outline-variant/40">2.5%</td></tr>
                </tbody>
              </table>
              <p className="text-[10px] text-secondary/60 mt-3 italic">Verified September 11, 2026 against issuer T&C pages, Air Canada Aeroplan benefits and each issuer\'s insurance summary. Extra Visa Airport Companion visits cost US$32. Amex\'s "1,200+ lounges" wording refers to Priority Pass membership; every visit is billed at the prevailing rate.</p>
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
                    <li><strong>Other lounge network:</strong> {c.otherLoungeNetwork}</li>
                    <li><strong>Guest at Maple Leaf Lounge:</strong> {c.guests}</li>
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
              <li><strong>Flying Air Canada most of the time, other airlines a few times a year:</strong> TD or CIBC — both add six Visa Airport Companion visits per year to the Maple Leaf Lounge benefit, on top of any airline.</li>
              <li><strong>A couple who each want independent lounge access:</strong> CIBC — supplementary card is $149, versus $199 at TD and Amex ($748 vs $798 per year).</li>
              <li><strong>Spending $8,000+ per year direct with Air Canada:</strong> Amex Aeroplan Reserve — 3x on Air Canada purchases beats the 2x on the Visa cards by a wide margin at scale.</li>
              <li><strong>Below the Visa Infinite Privilege income floor:</strong> Amex Aeroplan Reserve — no published minimum income (approval still subject to Amex underwriting).</li>
              <li><strong>Booking expensive trips, want the highest cancellation cap:</strong> CIBC — $10,000 per trip vs $5,000 at TD and $3,000 at Amex.</li>
              <li><strong>Age 65 or older:</strong> CIBC — 10 days of included emergency medical, vs 4 at TD and none on Amex Reserve.</li>
              <li><strong>Based at Toronto Pearson:</strong> Amex Aeroplan Reserve — priority security lane, complimentary valet at T1, and 15% off eligible parking.</li>
              <li><strong>Already hold the Amex Platinum:</strong> TD or CIBC Aeroplan VIP — adds the Maple Leaf Lounge benefit the Platinum does not cover, without duplicating your existing Priority Pass on the Platinum.</li>
            </ul>
          </section>

          {/* Break-even */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-6">Break-even math</h2>
            <p className="text-on-surface-variant leading-relaxed mb-3">
              Air Canada sells lounge access on some fares at $49–$79 and charges $59 per extra guest. Using $59 as the benchmark value per entry, break-even on the $599 annual fee looks like this:
            </p>
            <table className="min-w-full text-sm border-collapse mb-3">
              <thead className="bg-primary/5 text-primary text-left">
                <tr>
                  <th className="p-3 font-semibold border border-outline-variant/40">Scenario</th>
                  <th className="p-3 font-semibold border border-outline-variant/40">Fee to cover</th>
                  <th className="p-3 font-semibold border border-outline-variant/40">Visits to break even (@ $59/entry)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-3 border border-outline-variant/40">Solo traveller</td><td className="p-3 border border-outline-variant/40">$599</td><td className="p-3 border border-outline-variant/40">11 per year</td></tr>
                <tr><td className="p-3 border border-outline-variant/40">Cardholder + 1 guest (guest benefit active)</td><td className="p-3 border border-outline-variant/40">$599</td><td className="p-3 border border-outline-variant/40">6 shared per year</td></tr>
                <tr><td className="p-3 border border-outline-variant/40">Two cardholders on CIBC ($599 + $149)</td><td className="p-3 border border-outline-variant/40">$748</td><td className="p-3 border border-outline-variant/40">7 shared per year</td></tr>
                <tr><td className="p-3 border border-outline-variant/40">Two cardholders on TD or Amex ($599 + $199)</td><td className="p-3 border border-outline-variant/40">$798</td><td className="p-3 border border-outline-variant/40">7 shared per year</td></tr>
              </tbody>
            </table>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              These numbers only "pay for the card" if you would otherwise have paid at the door. Aeroplan earning, free first checked bags, insurance and companion vouchers sit on top of this math and often decide the question. Well-timed welcome bonuses can offset the first year\'s fee entirely.
            </p>
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
