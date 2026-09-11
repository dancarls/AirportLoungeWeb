import Link from 'next/link'
import type { Metadata } from 'next'
import { affiliate, AFFILIATE_REL } from '@/lib/affiliates'
import NewsletterCTA from '@/components/NewsletterCTA'

export const metadata: Metadata = {
  title: 'Canadian Credit Card Rebates & Cashback (2026): Stack on Top of Welcome Bonuses',
  description: 'The Canadian credit card cashback rebate landscape — how to stack an extra rebate on top of the issuer welcome bonus, which cards currently qualify, and where the airport-lounge cards fit in.',
  keywords: [
    'credit card cashback canada',
    'credit card rebate canada',
    'finlywealth rebate',
    'credit card sign-up cashback canada',
  ],
  alternates: { canonical: 'https://www.airportlounges.ca/credit-cards/rebates' },
  openGraph: {
    title: 'Canadian Credit Card Rebates & Cashback (2026)',
    description: 'Stack a rebate on top of your credit card welcome bonus.',
    url: 'https://www.airportlounges.ca/credit-cards/rebates',
  },
}

export const revalidate = 3600

const PAGE_URL = 'https://www.airportlounges.ca/credit-cards/rebates'
const PUBLISHED = '2026-09-10'
const REVIEWED = '2026-09-10'

const LOUNGE_ACCESS_CARDS_WITH_REBATES = [
  { name: 'American Express Platinum', tag: 'Priority Pass + Centurion (US)', affiliateKey: 'finlywealth-amex-platinum' as const },
  { name: 'American Express Aeroplan Reserve', tag: 'Priority Pass + Maple Leaf Lounge', affiliateKey: 'finlywealth-amex-aeroplan-reserve' as const },
  { name: 'TD Aeroplan Visa Infinite Privilege', tag: 'Maple Leaf Lounge + companion voucher', affiliateKey: 'finlywealth-td-aeroplan-vip' as const },
  { name: 'CIBC Aeroplan Visa Infinite Privilege', tag: 'Maple Leaf Lounge + 2x AC earn', affiliateKey: 'finlywealth-cibc-aeroplan-vip' as const },
  { name: 'RBC Avion Visa Infinite Privilege', tag: 'DragonPass + YUL Odyssey', affiliateKey: 'finlywealth-rbc-avion-vip' as const },
  { name: 'Scotiabank Passport Visa Infinite', tag: 'DragonPass + no FX fees', affiliateKey: 'finlywealth-scotia-passport' as const },
]

const FAQS = [
  {
    q: 'What is a credit card rebate in Canada?',
    a: 'A credit card rebate is a supplementary cashback payment made by a third-party comparison platform (like FinlyWealth) on top of any welcome bonus offered by the card issuer itself. The rebate is funded from the platform\'s referral commission — the platform pays the customer a share of what they earn from the bank for a successful application. The card issuer\'s welcome bonus is separate and stacks on top.',
  },
  {
    q: 'How does a rebate stack on top of a card welcome bonus?',
    a: 'The two are independent. The card issuer pays you the welcome bonus (typically in points or cash) for meeting a minimum spending requirement — that\'s tied to your card account. The comparison platform separately pays you the rebate for having applied through their referral link, usually deposited to a bank account, PayPal, or as a gift card. Both can be earned on the same card application.',
  },
  {
    q: 'Are Canadian card rebates guaranteed?',
    a: 'No. Rebate payouts are conditional — typically the customer must be approved for the card, activate it, meet a minimum retention period (often 90–180 days), and comply with the platform\'s terms. Rebate amounts also change over time as campaigns rotate. Any specific rebate amount displayed on this page should be verified on FinlyWealth or the platform hosting the offer before applying.',
  },
  {
    q: 'Which Canadian credit cards typically have rebates?',
    a: 'Rebates most commonly appear on premium cards with $99+ annual fees — Amex Platinum, Amex Aeroplan Reserve, TD Aeroplan Visa Infinite Privilege, CIBC Aeroplan Visa Infinite Privilege, RBC Avion Visa Infinite Privilege, and Scotiabank Passport Visa Infinite are all common candidates for rebate campaigns. Cash-back everyday cards (MBNA, Rogers, Tangerine) less often.',
  },
  {
    q: 'Do rebates affect my credit score or card approval?',
    a: 'No. The rebate is a payout from the comparison platform, not from the bank. Applying through a rebate link does not change how the issuer evaluates your credit application — approval rules, credit score checks, and income requirements are identical whether you apply directly or through a partner site.',
  },
  {
    q: 'Which platforms currently offer credit card rebates in Canada?',
    a: 'FinlyWealth is the primary Canadian platform specializing in credit card rebates as of 2026. Great Canadian Rebates and RakutenCanada also operate rebate offers on select card applications. Ratehub does not offer end-user rebates. Coverage overlaps significantly — the same card may appear on multiple platforms at different rebate amounts.',
  },
  {
    q: 'When do rebate payouts arrive?',
    a: 'Timing varies by platform and card. Typical windows: 60–120 days after the customer has been approved for the card, activated it, and completed any minimum retention period. FinlyWealth publishes payout status in their affiliate dashboard so customers can track approval, pending, and paid stages.',
  },
  {
    q: 'Can I churn a card by cancelling right after collecting the rebate?',
    a: 'This is against most platform terms and often against card issuer terms. Rebate platforms typically require a minimum holding period (90–180 days) before the rebate is paid, and card issuers may reclaim welcome bonuses or blacklist future applications for immediate cancellations. Treat rebate-eligible cards as multi-year decisions.',
  },
]

export default function RebatesPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.airportlounges.ca' },
      { '@type': 'ListItem', position: 2, name: 'Credit Cards', item: 'https://www.airportlounges.ca/credit-cards' },
      { '@type': 'ListItem', position: 3, name: 'Rebates & Cashback', item: PAGE_URL },
    ],
  }
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Canadian Credit Card Rebates & Cashback (2026)',
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
    name: 'Canadian Credit Card Rebates & Cashback (2026)',
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
            <span className="text-primary-fixed">Rebates & Cashback</span>
          </nav>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-4 leading-tight max-w-4xl">
            Canadian Credit Card Rebates & Cashback (2026)
          </h1>
          <p data-speakable="intro" className="font-body-lg text-body-lg text-bone-white/85 max-w-3xl leading-relaxed">
            <strong>A credit card rebate is extra cashback the referral platform pays you on top of the card issuer\'s welcome bonus.</strong> On premium Canadian cards — Amex Platinum, Amex Aeroplan Reserve, TD/CIBC Aeroplan VIP — a rebate stack can add hundreds of dollars in value beyond the card\'s own welcome offer. Here\'s how the mechanics work, which cards qualify, and how the rebate-eligible cards line up against the airport lounge access needs of AirportLounges.ca readers.
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
                <p className="text-xs text-secondary mt-0.5 leading-relaxed">Rebate mechanics and platform terms verified against FinlyWealth, Great Canadian Rebates, and card issuer documentation.</p>
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
              <h3 className="font-headline-md text-headline-md text-primary-fixed mb-2">Current rebate catalog</h3>
              <p className="text-bone-white/80 text-sm leading-relaxed">See every Canadian credit card with an active FinlyWealth cashback rebate — plus the current rebate amount for each.</p>
            </div>
            <a
              href={affiliate('finlywealth-rebates-catalog')}
              target="_blank"
              rel={AFFILIATE_REL}
              className="shrink-0 bg-primary-fixed text-on-primary-fixed px-8 py-4 font-label-caps text-[10px] uppercase tracking-widest hover:bg-white transition-all"
            >
              See Full Rebate Catalog
            </a>
          </div>

          {/* How rebates work */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">How Canadian credit card rebates work</h2>
            <p className="text-on-surface-variant leading-relaxed mb-3">
              When you apply for a credit card through a referral link on a platform like FinlyWealth, the platform earns a commission from the card issuer for the successful referral. Rebate programs split that commission — a portion goes to the customer (you), the rest stays with the platform.
            </p>
            <p className="text-on-surface-variant leading-relaxed mb-3">
              This is a genuinely additive value stream. The <strong>card issuer\'s welcome bonus</strong> (say 60,000 Aeroplan points for spending $5,000 in the first three months) is unchanged — you earn it exactly the way you would applying directly. The <strong>rebate</strong> is a second payout, funded by the platform, deposited separately to a bank account, PayPal, or as a gift card.
            </p>
            <blockquote className="border-l-2 border-primary p-4 my-4 bg-champagne-glint/30">
              <p className="text-on-surface leading-relaxed"><strong>Real example:</strong> If a card offers a 60,000-point welcome bonus (worth roughly $900 in redemption value) and FinlyWealth adds a $150 CAD rebate on top, the total inbound value of the application is $1,050 — plus whatever ongoing card benefits (lounge access, insurance, earn rates) you get for the annual fee.</p>
            </blockquote>
          </section>

          {/* Rebated lounge-access cards */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Rebate-eligible cards with airport lounge access</h2>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              These Canadian premium cards commonly appear in the FinlyWealth rebate catalog <em>and</em> unlock airport lounge access — the intersection that matters most for AirportLounges.ca readers. Rebate amounts change; the destination link below always shows the current amount.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LOUNGE_ACCESS_CARDS_WITH_REBATES.map(c => (
                <div key={c.name} className="bg-white border border-outline-variant/30 p-5 flex flex-col">
                  <h3 className="font-bold text-primary mb-1">{c.name}</h3>
                  <p className="text-xs uppercase tracking-widest text-secondary mb-4">{c.tag}</p>
                  <a
                    href={affiliate(c.affiliateKey)}
                    target="_blank"
                    rel={AFFILIATE_REL}
                    className="mt-auto inline-block text-center bg-primary text-white px-4 py-3 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity"
                  >
                    Check current rebate
                  </a>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-secondary/60 mt-4 italic">Sponsored — we may earn a commission when you apply. Rebate amounts and availability change without notice.</p>
          </section>

          {/* Watch out for */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">What to watch out for</h2>
            <ul className="space-y-3 text-on-surface-variant leading-relaxed">
              <li><strong>Minimum retention periods:</strong> most rebate platforms require you to hold the card for 90–180 days before the rebate is paid. Cancelling early forfeits the rebate.</li>
              <li><strong>Approval risk:</strong> the rebate is contingent on card approval. If the issuer declines you, the rebate does not pay out — the platform earned no commission to share.</li>
              <li><strong>Churning restrictions:</strong> issuers commonly track and block applicants who repeatedly cancel cards immediately after collecting welcome bonuses. This can affect future applications with the same issuer.</li>
              <li><strong>Cookie window:</strong> click-through tracking typically expires after 24-30 days. If you click today but apply next month, the rebate may not attribute properly. Apply within the same session where possible.</li>
              <li><strong>Payout timing:</strong> budget 2-4 months from approval to rebate deposit. Track pending status in the platform dashboard.</li>
            </ul>
          </section>

          {/* How to claim */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">How to claim your rebate</h2>
            <ol className="space-y-3 text-on-surface-variant leading-relaxed list-decimal pl-5">
              <li><strong>Sign up for a FinlyWealth account</strong> (or the rebate platform of your choice). This is where the rebate deposits.</li>
              <li><strong>Click through to the card offer</strong> from the rebate catalog. The tracking cookie attaches your account to the referral.</li>
              <li><strong>Complete the card application</strong> in the same browser session. Do not open the card page in a different browser tab from a different source.</li>
              <li><strong>Wait for approval.</strong> Rebate status will show as "pending" until the issuer confirms your approval.</li>
              <li><strong>Hold the card for the required retention window</strong> — typically 90–180 days. Meeting the card\'s own welcome bonus spend requirement is independent of the rebate.</li>
              <li><strong>Rebate deposits</strong> to your FinlyWealth account 2–4 months after approval, once retention conditions are confirmed.</li>
            </ol>
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
            <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary block mb-3">Ready to stack a rebate?</span>
            <h3 className="font-headline-md text-headline-md text-primary mb-3">See the full FinlyWealth rebate catalog</h3>
            <p className="text-secondary max-w-xl mx-auto mb-6 leading-relaxed">Every rebate-eligible Canadian card with current cashback amounts.</p>
            <a
              href={affiliate('finlywealth-rebates-catalog')}
              target="_blank"
              rel={AFFILIATE_REL}
              className="inline-block bg-primary text-white px-10 py-4 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              See Rebate Catalog
            </a>
            <p className="text-[9px] text-secondary/50 mt-4">Sponsored — we may earn a commission when you apply.</p>
          </div>

          <p className="text-xs text-secondary/70 italic leading-relaxed">
            Rebate amounts, eligibility rules, and card benefits are subject to change without notice. Verify current terms on the platform hosting the offer and with the card issuer before applying. AirportLounges.ca may earn a commission on successful referrals through the affiliate links on this page.
          </p>
        </article>

        <aside className="space-y-6">
          <NewsletterCTA
            source="cc-landing:rebates"
            variant="light"
            heading="Rebate boost alerts"
            subheading="Get notified when a Canadian credit card rebate hits a promotional high."
          />
          <div className="bg-white border border-outline-variant/30 p-5">
            <h3 className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-4">Related Guides</h3>
            <ul className="space-y-2">
              <li><Link href="/credit-cards/best-for-airport-lounge-access" className="text-sm text-secondary hover:text-primary transition-colors underline underline-offset-2">Best cards for lounge access</Link></li>
              <li><Link href="/credit-cards/aeroplan-cards-compared" className="text-sm text-secondary hover:text-primary transition-colors underline underline-offset-2">Aeroplan cards compared</Link></li>
              <li><Link href="/blog/amex-platinum-airport-lounge-access-canada" className="text-sm text-secondary hover:text-primary transition-colors underline underline-offset-2">Amex Platinum guide</Link></li>
              <li><Link href="/blog/best-aeroplan-credit-card-airport-lounge-access" className="text-sm text-secondary hover:text-primary transition-colors underline underline-offset-2">Aeroplan card deep-dive</Link></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
