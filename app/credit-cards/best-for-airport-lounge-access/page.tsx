import Link from 'next/link'
import type { Metadata } from 'next'
import { affiliate, AFFILIATE_REL, sideBySide } from '@/lib/affiliates'
import NewsletterCTA from '@/components/NewsletterCTA'
import FinlyEmbed from '@/components/FinlyEmbed'

export const metadata: Metadata = {
  title: 'Best Credit Cards for Airport Lounge Access in Canada (2026)',
  description: 'The six Canadian credit cards that unlock airport lounge access — Amex Platinum, Amex Aeroplan Reserve, TD/CIBC Aeroplan VIP, RBC Avion VIP, Scotia Passport — compared side by side with fees, guest rules, and current rebates.',
  keywords: [
    'best credit card for airport lounge access canada',
    'credit card lounge access canada',
    'canadian credit card airport lounge',
    'priority pass credit card canada',
  ],
  alternates: { canonical: 'https://www.airportlounges.ca/credit-cards/best-for-airport-lounge-access' },
  openGraph: {
    title: 'Best Credit Cards for Airport Lounge Access in Canada (2026)',
    description: 'The six Canadian credit cards that unlock airport lounge access, compared side by side.',
    url: 'https://www.airportlounges.ca/credit-cards/best-for-airport-lounge-access',
  },
}

export const revalidate = 3600

const PAGE_URL = 'https://www.airportlounges.ca/credit-cards/best-for-airport-lounge-access'
const PUBLISHED = '2026-09-10'
const REVIEWED = '2026-09-10'

const CARDS = [
  {
    name: 'American Express Platinum',
    fee: '$799',
    lounges: 'Global Lounge Collection: Plaza Premium, Priority Pass Select, Aspire, Centurion (outside Canada), Delta Sky Club (on Delta flights). Unlimited Plaza Premium + Priority Pass through Dec 31, 2026; capped at 6 + 6 visits from Jan 1, 2027 (unlimited restored with $20k annual spend). Lufthansa access ends Oct 1, 2026.',
    guests: '1 free guest at Plaza Premium + Priority Pass through 2026 (uses a visit from 2027); up to 2 at Centurion; 0 free at Delta Sky Club',
    mll: '❌ No',
    highlight: 'Widest lounge network on any Canadian card. Best for frequent multi-airline travellers who use the $200 travel and $200 dining credits (net cost ≈ $399).',
    affiliateKey: 'finlywealth-amex-platinum' as const,
  },
  {
    name: 'American Express Aeroplan Reserve',
    fee: '$599',
    lounges: 'Air Canada Maple Leaf Lounge and Air Canada Café (unlimited, Canada + U.S.); Priority Pass — annual fee waived, but every visit charged at the prevailing rate',
    guests: '1 guest at Maple Leaf Lounge (no end date stated); Priority Pass guest visits also billed at the prevailing rate',
    mll: '✅ Yes',
    highlight: 'Conditional pick — best for heavy Air Canada spenders (3x on AC), applicants below the $150k / $200k income floor (no published minimum on Amex), and Toronto Pearson regulars (priority security lane, valet, 15% parking). Priority Pass visits are paid, not included.',
    affiliateKey: 'finlywealth-amex-aeroplan-reserve' as const,
  },
  {
    name: 'TD Aeroplan Visa Infinite Privilege',
    fee: '$599',
    lounges: 'Air Canada Maple Leaf Lounge on AC flights',
    guests: '1 free MLL guest per visit; 4 One-Time MLL Guest Passes/yr',
    mll: '✅ Yes',
    highlight: 'Best Aeroplan card for households — 1.5x earn on groceries/gas + annual companion voucher.',
    affiliateKey: 'finlywealth-td-aeroplan-vip' as const,
  },
  {
    name: 'CIBC Aeroplan Visa Infinite Privilege',
    fee: '$599',
    lounges: 'Air Canada Maple Leaf Lounge on AC flights',
    guests: '1 free MLL guest per visit; 4 One-Time MLL Guest Passes/yr',
    mll: '✅ Yes',
    highlight: 'Best Aeroplan card for high AC spend — 2x Aeroplan on Air Canada tickets, the strongest revenue multiplier of the three.',
    affiliateKey: 'finlywealth-cibc-aeroplan-vip' as const,
  },
  {
    name: 'RBC Avion Visa Infinite Privilege',
    fee: '$399',
    lounges: 'DragonPass (6 complimentary visits/yr); Desjardins Odyssey Lounges at YUL',
    guests: 'Shared visit pool — bringing a guest uses two of your 6 annual visits',
    mll: '❌ No',
    highlight: 'Best DragonPass card — the only major Canadian route into Desjardins Odyssey lounges at YUL.',
    affiliateKey: 'finlywealth-rbc-avion-vip' as const,
  },
  {
    name: 'Scotiabank Passport Visa Infinite',
    fee: '$150',
    lounges: 'DragonPass / Visa Airport Companion (6 complimentary visits/yr)',
    guests: 'Shared visit pool — bring a guest costs two of your six visits',
    mll: '❌ No',
    highlight: 'Lowest annual fee lounge card in Canada with lounge access + no foreign transaction fees. Best for occasional lounge users.',
    affiliateKey: 'finlywealth-scotia-passport' as const,
  },
] as const

const FAQS = [
  {
    q: 'Which Canadian credit card is best for airport lounge access?',
    a: 'For most eligible Canadians who want a single lounge-focused Aeroplan card, the CIBC Aeroplan Visa Infinite Privilege ($599 annual fee) is the strongest pick: unlimited Maple Leaf Lounge access, six complimentary Visa Airport Companion (DragonPass) visits per year that work on any airline, the cheapest supplementary card at $149, and the strongest trip-cancellation insurance. The TD Aeroplan Visa Infinite Privilege ($599) is a close second with the same lounge package. The Amex Aeroplan Reserve ($599) wins conditionally — for heavy Air Canada spenders (3x), applicants without $150k personal / $200k household income (no published Amex floor), and Toronto Pearson regulars. Amex Priority Pass visits are paid, not included. The Amex Platinum ($799) is a different card entirely — no Maple Leaf Lounge access, and the Global Lounge Collection is capped at 6 Plaza Premium + 6 Priority Pass visits per year from January 1, 2027 without $20k in annual card spend.',
  },
  {
    q: 'Which Canadian credit cards include Priority Pass?',
    a: 'As of September 2026, Priority Pass Select is included on the American Express Platinum, American Express Aeroplan Reserve, and the Scotiabank Passport Visa Infinite (though the Scotia version uses the DragonPass / Visa Airport Companion network, which overlaps heavily with Priority Pass in Canada). The RBC Avion Visa Infinite Privilege uses DragonPass rather than Priority Pass.',
  },
  {
    q: 'Which credit card gets you into the Air Canada Maple Leaf Lounge?',
    a: 'Only three Canadian credit cards grant Maple Leaf Lounge access: the Amex Aeroplan Reserve, TD Aeroplan Visa Infinite Privilege, and CIBC Aeroplan Visa Infinite Privilege — all $599 annual fee. Amex Platinum, RBC Avion, and Scotia Passport do not open MLLs at any tier. Access requires a same-day Air Canada operating flight in addition to holding the card.',
  },
  {
    q: 'How many lounge visits does a Canadian credit card usually include?',
    a: 'Priority Pass Select membership (Amex Platinum, Amex Aeroplan Reserve) is unlimited. DragonPass on RBC Avion and Scotia Passport typically includes 6 complimentary visits per calendar year, shared between cardholder and guests. Maple Leaf Lounge access on the three Aeroplan premium cards is unlimited on same-day Air Canada flights.',
  },
  {
    q: 'Do Canadian credit cards give free guest access to airport lounges?',
    a: 'It depends on the network and the card. At Air Canada Maple Leaf Lounges, TD Aeroplan VIP and CIBC Aeroplan VIP each include one complimentary guest through December 31, 2026; Amex Aeroplan Reserve includes one guest with no end date currently stated. The Amex Platinum permits one complimentary guest at Plaza Premium and Priority Pass through 2026 (a guest entry consumes one of the capped visits from 2027). RBC Avion and Scotia Passport share their DragonPass visit pool — bringing a guest uses two of your six annual visits. Extra guests at Air Canada lounges pay $59 in the lounge\'s local currency.',
  },
  {
    q: 'Which is cheaper — a lounge credit card or paying per visit?',
    a: 'Break-even math: at ~$45–$75 CAD per walk-in day pass and roughly $35 USD per Priority Pass guest fee, the $599 Aeroplan Reserve pays for itself in 8–10 lounge visits per year with a companion. The Scotia Passport at $150 breaks even in as few as 3 visits per year for its 6 complimentary DragonPass entries, making it the most cost-effective card for occasional lounge users.',
  },
  {
    q: 'Are Amex Centurion Lounges accessible in Canada with an Amex Platinum?',
    a: 'No. There are currently no Amex Centurion Lounges anywhere in Canada. Canadian Amex Platinum cardholders can use Centurion Lounges when travelling to or from the US on a same-day flight, but no Canadian airport has one on-site. Priority Pass Select is the practical Canadian lounge benefit on the Amex Platinum.',
  },
  {
    q: 'Should I get two credit cards to cover both Priority Pass and Maple Leaf Lounge?',
    a: 'For most travellers, the single Amex Aeroplan Reserve ($599) covers both networks and is the simpler choice. Splitting into two cards — for example the TD Aeroplan VIP for MLL + the Amex Platinum for Priority Pass — costs $1,498/year for benefits that overlap significantly with the single Reserve. The two-card stack only makes sense if you specifically need Centurion Lounge access in the US.',
  },
]

export default function BestCreditCardsForLoungeAccessPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',          item: 'https://www.airportlounges.ca' },
      { '@type': 'ListItem', position: 2, name: 'Credit Cards',  item: 'https://www.airportlounges.ca/credit-cards' },
      { '@type': 'ListItem', position: 3, name: 'Best for Airport Lounge Access', item: PAGE_URL },
    ],
  }

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Credit Cards for Airport Lounge Access in Canada (2026)',
    datePublished: PUBLISHED,
    dateModified: REVIEWED,
    inLanguage: 'en-CA',
    url: PAGE_URL,
    author: {
      '@type': 'Organization',
      name: 'AirportLounges.ca Editorial Team',
      url: 'https://www.airportlounges.ca/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AirportLounges.ca',
      url: 'https://www.airportlounges.ca',
      logo: { '@type': 'ImageObject', url: 'https://www.airportlounges.ca/favicon.ico' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE_URL },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const speakableLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Best Credit Cards for Airport Lounge Access in Canada (2026)',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '[data-speakable="intro"]', '[data-speakable="faq-answer"]'],
    },
    url: PAGE_URL,
  }

  return (
    <div className="bg-bone-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableLd) }} />

      {/* Hero — editorial background image + dark overlay keeps the text
          legible while lifting the page above a flat-colour band. Overlay
          uses primary at 85% opacity so the palette stays on-brand. */}
      <header
        className="relative bg-primary text-white py-16 overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,52,52,0.86), rgba(0,52,52,0.86)), url(/blog/best-for-lounge-access-hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-container-max mx-auto px-gutter relative">
          <nav className="text-sm mb-4">
            <Link href="/" className="text-primary-fixed/80 hover:text-primary-fixed underline underline-offset-2">Home</Link>
            <span className="text-primary-fixed/40 mx-2">›</span>
            <Link href="/credit-cards" className="text-primary-fixed/80 hover:text-primary-fixed underline underline-offset-2">Credit Cards</Link>
            <span className="text-primary-fixed/40 mx-2">›</span>
            <span className="text-primary-fixed">Best for Airport Lounge Access</span>
          </nav>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-4 leading-tight max-w-4xl">
            Best Credit Cards for Airport Lounge Access in Canada (2026)
          </h1>
          <p data-speakable="intro" className="font-body-lg text-body-lg text-bone-white/85 max-w-3xl leading-relaxed">
            <strong>The Amex Aeroplan Reserve ($599 annual fee) is the strongest all-around lounge card in Canada in 2026 — the only card that stacks Priority Pass Select (with unlimited free guests) on top of Air Canada Maple Leaf Lounge access.</strong> The Amex Platinum ($799) wins for US-heavy travellers who need Centurion Lounge access; the Scotia Passport ($150) is the cheapest way in for occasional lounge users. Below: full side-by-side of every Canadian card worth considering for lounge access.
          </p>
        </div>
      </header>

      <div className="max-w-container-max mx-auto px-gutter py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Main content */}
        <article className="lg:col-span-3 space-y-12">

          {/* Byline */}
          <div className="pb-6 border-b border-outline-variant/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }}>edit_note</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-primary text-sm">By AirportLounges.ca Editorial Team</p>
                <p className="text-xs text-secondary mt-0.5 leading-relaxed">
                  Card benefits verified against issuer T&C pages, Air Canada Aeroplan program terms, and Priority Pass Canada policy — reviewed continuously.
                </p>
                <p className="text-xs text-secondary mt-2">
                  Published <time dateTime={PUBLISHED}>September 10, 2026</time>
                  {' · Last verified '}<time dateTime={REVIEWED}>September 10, 2026</time>
                  {' · '}<Link href="/about#sourcing" className="underline underline-offset-2 hover:text-primary">Sourcing methodology</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Primary affiliate CTA — top of article */}
          <div className="bg-primary text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 -my-4">
            <div className="flex-1">
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-primary-fixed/70 block mb-2">Sponsored</span>
              <h3 className="font-headline-md text-headline-md text-primary-fixed mb-2">Compare all six cards side by side</h3>
              <p className="text-bone-white/80 text-sm leading-relaxed">See current welcome bonuses, annual fees, and any active FinlyWealth rebates on top of card issuer offers.</p>
            </div>
            <a
              href={affiliate('finlywealth-lounge-access-cards')}
              target="_blank"
              rel={AFFILIATE_REL}
              className="shrink-0 bg-primary-fixed text-on-primary-fixed px-8 py-4 font-label-caps text-[10px] uppercase tracking-widest hover:bg-white transition-all"
            >
              Compare Cards
            </a>
          </div>

          {/* Live FinlyWealth comparison tool embed — pre-filtered to lounge
              cards. Falls back to a plain CTA if the embed script is blocked. */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-6">Compare cards for your spending</h2>
            <p className="text-on-surface-variant mb-6 leading-relaxed">
              Set your monthly spending in each category and see which of these six cards recommends best for you. The tool factors in earn rates, welcome bonuses, and any active FinlyWealth cashback rebates.
            </p>
            <FinlyEmbed
              tool="credit-cards-compare"
              filters={{ benefits: 'lounge_access' }}
              fallbackHeading="Compare cards for airport lounge access"
              fallbackLabel="Open the Comparison Tool"
              fallbackAffiliateKey="finlywealth-lounge-access-cards"
            />
            <p className="text-xs text-secondary italic mt-2">
              The tool is powered by FinlyWealth. If you would rather see all cards side by side without inputs, use the fallback button above.
            </p>
          </section>

          {/* Side-by-side quick links — construct on demand via sideBySide()
              helper. All routes match FinlyWealth's card slugs. */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-6">Head-to-head: which vs which?</h2>
            <p className="text-on-surface-variant mb-4 leading-relaxed">
              The most-searched card comparisons among AirportLounges.ca readers, one click away:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { a: 'amex-platinum', b: 'amex-aeroplan-reserve', label: 'Amex Platinum vs Amex Aeroplan Reserve' },
                { a: 'amex-aeroplan-reserve', b: 'td-aeroplan-visa-infinite-privilege', label: 'Amex Aeroplan Reserve vs TD Aeroplan VIP' },
                { a: 'td-aeroplan-visa-infinite-privilege', b: 'cibc-aeroplan-visa-infinite-privilege', label: 'TD Aeroplan VIP vs CIBC Aeroplan VIP' },
                { a: 'amex-aeroplan-reserve', b: 'cibc-aeroplan-visa-infinite-privilege', label: 'Amex Aeroplan Reserve vs CIBC Aeroplan VIP' },
                { a: 'amex-platinum', b: 'scotia-passport-visa-infinite', label: 'Amex Platinum vs Scotia Passport' },
                { a: 'rbc-avion-visa-infinite-privilege', b: 'scotia-passport-visa-infinite', label: 'RBC Avion VIP vs Scotia Passport' },
              ].map(c => (
                <li key={c.label}>
                  <a
                    href={sideBySide(c.a, c.b)}
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
            <p className="text-[10px] text-secondary/50 mt-3 italic">Comparisons hosted on FinlyWealth — sponsored links.</p>
          </section>

          {/* Comparison table */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-6">Which card unlocks which lounge network?</h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-primary/5 text-primary text-left">
                  <tr>
                    <th className="p-3 font-semibold border border-outline-variant/40">Card</th>
                    <th className="p-3 font-semibold border border-outline-variant/40">Annual Fee</th>
                    <th className="p-3 font-semibold border border-outline-variant/40">Priority Pass / DragonPass</th>
                    <th className="p-3 font-semibold border border-outline-variant/40">Maple Leaf Lounge</th>
                    <th className="p-3 font-semibold border border-outline-variant/40">Guests</th>
                  </tr>
                </thead>
                <tbody>
                  {CARDS.map(c => (
                    <tr key={c.name} className="align-top">
                      <td className="p-3 border border-outline-variant/40 font-semibold text-primary">{c.name}</td>
                      <td className="p-3 border border-outline-variant/40 whitespace-nowrap">{c.fee}</td>
                      <td className="p-3 border border-outline-variant/40 text-on-surface-variant leading-relaxed">{c.lounges}</td>
                      <td className="p-3 border border-outline-variant/40 whitespace-nowrap">{c.mll}</td>
                      <td className="p-3 border border-outline-variant/40 text-on-surface-variant leading-relaxed">{c.guests}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Best by traveler type */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-6">Best card by traveller type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { type: 'Solo domestic Canadian traveller', pick: 'Scotia Passport Visa Infinite', why: 'At $150/yr with 6 DragonPass visits, it covers 3–4 domestic trips per year with room to spare. No FX fees on international bookings.' },
                { type: 'Frequent traveller with a companion', pick: 'Amex Aeroplan Reserve', why: 'Unlimited free Priority Pass guests means your partner enters every lounge at no cost. Also unlocks Maple Leaf Lounges on Air Canada flights.' },
                { type: 'US business traveller', pick: 'Amex Platinum', why: 'Amex Centurion Lounge access when travelling to the US, plus Delta Sky Club on Delta flights (through Feb 2027) and full Priority Pass.' },
                { type: 'Air Canada loyalist', pick: 'CIBC or TD Aeroplan Visa Infinite Privilege', why: 'Highest Aeroplan earn rates on Air Canada spend, plus Maple Leaf Lounge access. CIBC wins on AC tickets specifically (2x), TD wins on everyday spending.' },
                { type: 'YUL / Quebec-based traveller', pick: 'RBC Avion Visa Infinite Privilege', why: 'Only major Canadian card that unlocks Desjardins Odyssey lounges at Montreal via DragonPass. Plus 6 DragonPass visits/yr elsewhere.' },
                { type: 'Two lounge trips per year (occasional)', pick: 'Scotia Passport Visa Infinite', why: 'Breaks even in 3 visits. If you fly rarely, don\'t pay $599–$799 for benefits you won\'t use.' },
              ].map((row) => (
                <div key={row.type} className="bg-white border border-outline-variant/30 p-5">
                  <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary block mb-1">{row.type}</span>
                  <h3 className="font-bold text-primary mb-2">{row.pick}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{row.why}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Head-to-head profiles */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-6">Head-to-head profiles</h2>
            <div className="space-y-8">
              {CARDS.map(c => (
                <div key={c.name} className="bg-white border border-outline-variant/30 p-6 md:p-8">
                  <div className="flex flex-wrap items-baseline gap-4 mb-3">
                    <h3 className="font-headline-md text-primary">{c.name}</h3>
                    <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary bg-champagne-glint/50 px-2 py-1">{c.fee}/yr</span>
                  </div>
                  <p className="text-on-surface-variant mb-3 leading-relaxed"><strong className="text-on-surface">{c.highlight}</strong></p>
                  <p className="text-sm text-on-surface-variant mb-2"><strong>Lounge networks:</strong> {c.lounges}</p>
                  <p className="text-sm text-on-surface-variant mb-5"><strong>Guests:</strong> {c.guests}</p>
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
            <p className="text-[10px] text-secondary/60 mt-4 italic">Sponsored — we may earn a commission when you apply through the links above. Card benefits, welcome bonuses, and rebates are subject to change; verify current terms with the issuer before applying.</p>
          </section>

          {/* Break-even */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-6">Break-even math: which fee is worth it?</h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              A walk-in day pass at a Canadian airport lounge typically costs $45–$75 CAD. Priority Pass guest fees run approximately $35 USD each. Applying that to each card:
            </p>
            <ul className="space-y-3 text-on-surface-variant leading-relaxed">
              <li><strong>Scotia Passport ($150):</strong> Breaks even in <strong>3 lounge visits per year</strong>. The cheapest way into a Canadian airport lounge for anyone who travels 3+ times annually.</li>
              <li><strong>RBC Avion VIP ($399):</strong> Breaks even in <strong>7 visits per year</strong>. Add DragonPass Desjardins Odyssey access at YUL for the strongest Quebec-based value.</li>
              <li><strong>TD or CIBC Aeroplan VIP ($599):</strong> Breaks even in <strong>10 MLL visits per year</strong> with a companion. Add the annual Air Canada companion voucher (~$300 value) and 8 lounge visits pays the card off.</li>
              <li><strong>Amex Aeroplan Reserve ($599):</strong> Breaks even in <strong>6 combined MLL + Priority Pass visits</strong> per year, because you effectively get two lounge networks for one fee.</li>
              <li><strong>Amex Platinum ($799):</strong> After the $200 travel credit and $200 dining credit, the net cost is about <strong>$399</strong>. At $50 per lounge entry, that is roughly <strong>8 solo visits or 4 couple trips per year</strong> to break even on lounges alone. A major benefit change on January 1, 2027 caps Plaza Premium and Priority Pass at 6 visits each per calendar year unless you spend $20,000/year on the card — factor that into the math before applying.</li>
            </ul>
          </section>

          {/* What none of these do */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-6">What none of these cards do</h2>
            <p className="text-on-surface-variant leading-relaxed mb-3">Setting expectations at the door:</p>
            <ul className="space-y-2 text-on-surface-variant leading-relaxed">
              <li>None grant access to the <strong>Air Canada Signature Suite</strong> at YYZ (invitation-only for Signature Class international passengers).</li>
              <li>None open the <strong>Cathay Pacific Lounge at YVR</strong> (oneworld / CX-ticket only).</li>
              <li>None guarantee entry when a lounge hits capacity — even paying members are turned away.</li>
              <li>Amex Platinum, Amex Aeroplan Reserve, and Scotia Passport do <strong>not</strong> open <strong>Air Canada Maple Leaf Lounges</strong>.</li>
              <li>TD Aeroplan VIP, CIBC Aeroplan VIP, and RBC Avion do <strong>not</strong> include <strong>Priority Pass</strong>.</li>
              <li>None include <strong>Amex Centurion Lounge</strong> access in Canada — because there are no Centurion Lounges in Canada as of 2026.</li>
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
            <h3 className="font-headline-md text-headline-md text-primary mb-3">Compare all Canadian lounge-access cards</h3>
            <p className="text-secondary max-w-xl mx-auto mb-6 leading-relaxed">See current welcome bonuses, annual fees, and any active cashback rebates.</p>
            <a
              href={affiliate('finlywealth-lounge-access-cards')}
              target="_blank"
              rel={AFFILIATE_REL}
              className="inline-block bg-primary text-white px-10 py-4 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Compare Cards on FinlyWealth
            </a>
            <p className="text-[9px] text-secondary/50 mt-4">Sponsored — we may earn a commission when you apply.</p>
          </div>

          <p className="text-xs text-secondary/70 italic leading-relaxed">
            All card benefits, annual fees, welcome bonuses, and rebate amounts in this guide are accurate as of the last-verified date shown at the top. Terms and offers change without notice — always confirm current details with the issuer before applying. AirportLounges.ca may earn a commission on successful referrals through the affiliate links on this page.
          </p>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          <NewsletterCTA
            source="cc-landing:best-for-lounge-access"
            variant="light"
            heading="Card benefit changes, monthly."
            subheading="Welcome bonus updates, rebate changes, and new lounge access rules — delivered monthly."
          />
          <div className="bg-white border border-outline-variant/30 p-5">
            <h3 className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-4">Related Guides</h3>
            <ul className="space-y-2">
              <li><Link href="/blog/amex-platinum-airport-lounge-access-canada" className="text-sm text-secondary hover:text-primary transition-colors underline underline-offset-2">Amex Platinum lounge access — deep dive</Link></li>
              <li><Link href="/blog/best-aeroplan-credit-card-airport-lounge-access" className="text-sm text-secondary hover:text-primary transition-colors underline underline-offset-2">Aeroplan cards compared</Link></li>
              <li><Link href="/blog/priority-pass-lounges-canada" className="text-sm text-secondary hover:text-primary transition-colors underline underline-offset-2">Every Priority Pass lounge in Canada</Link></li>
              <li><Link href="/blog/airport-lounge-guest-fees-canada" className="text-sm text-secondary hover:text-primary transition-colors underline underline-offset-2">Airport lounge guest fees</Link></li>
              <li><Link href="/credit-cards/rebates" className="text-sm text-secondary hover:text-primary transition-colors underline underline-offset-2">Credit card rebates & cashback</Link></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
