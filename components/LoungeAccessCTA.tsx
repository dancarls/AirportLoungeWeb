import { affiliate, AFFILIATE_REL } from '@/lib/affiliates'

type Variant = 'sidebar' | 'hero' | 'inline'

interface Props {
  variant?: Variant
  iataCode?: string
  destination?: 'lounge-access' | 'aeroplan' | 'amex-platinum' | 'priority-pass'
}

const COPY = {
  'lounge-access': {
    affiliateKey: 'finlywealth-lounge-access-cards' as const,
    headline: (code?: string) =>
      code ? `Get into every lounge at ${code} — free` : 'Get into the lounge free',
    subhead:
      'Compare the Canadian credit cards with Priority Pass, Plaza Premium or Maple Leaf access — current welcome offers, fees and lounge coverage.',
    benefits: [
      'Priority Pass or DragonPass memberships included',
      'Welcome bonuses worth up to $800 in travel',
      'First-year fee waived on select cards',
    ],
    cta: 'See the best lounge-access cards',
  },
  aeroplan: {
    affiliateKey: 'finlywealth-aeroplan-cards' as const,
    headline: () => 'The best Aeroplan cards, ranked',
    subhead:
      'Air Canada Maple Leaf Lounge access, status fast-tracks, and sign-up bonuses worth up to 100,000 points.',
    benefits: [
      'Maple Leaf Lounge access with select cards',
      'Welcome bonuses from 50,000–100,000 Aeroplan points',
      'Priority boarding + free checked bags',
    ],
    cta: 'Compare Aeroplan cards',
  },
  'amex-platinum': {
    affiliateKey: 'finlywealth-amex-platinum' as const,
    headline: () => 'Amex Platinum — unlimited lounges',
    subhead:
      'Priority Pass, Centurion, Plaza Premium, and Maple Leaf Lounges — all accessible with one card.',
    benefits: [
      'Priority Pass Select — unlimited visits',
      'Centurion Lounge access (US + international)',
      '$200 annual travel credit',
    ],
    cta: 'Read the Platinum review',
  },
  'priority-pass': {
    affiliateKey: 'finlywealth-priority-pass-guide' as const,
    headline: () => 'The Priority Pass playbook',
    subhead:
      'Which Canadian cards give you Priority Pass at no extra cost, and which lounges each tier actually unlocks.',
    benefits: [
      'See which cards include Priority Pass free',
      'Full list of PP lounges in Canada',
      'Tier-by-tier guest pass comparison',
    ],
    cta: 'Read the guide',
  },
}

export default function LoungeAccessCTA({
  variant = 'sidebar',
  iataCode,
  destination = 'lounge-access',
}: Props) {
  const copy = COPY[destination]
  const headline = copy.headline(iataCode)

  if (variant === 'hero') {
    return (
      <section className="relative overflow-hidden bg-primary text-white my-10">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,#94d1d1_0%,transparent_60%)]" />
        <div className="relative grid md:grid-cols-5 gap-8 p-8 md:p-12">
          <div className="md:col-span-3">
            <span className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-primary-fixed-dim block mb-4">
              Sponsored · FinlyWealth
            </span>
            <h2 className="font-headline-lg text-3xl md:text-4xl leading-tight mb-5">
              {headline}
            </h2>
            <p className="text-base md:text-lg text-white/80 leading-relaxed mb-6 max-w-xl">
              {copy.subhead}
            </p>
            <a
              href={affiliate(copy.affiliateKey)}
              target="_blank"
              rel={AFFILIATE_REL}
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-primary px-8 py-4 font-label-caps text-xs uppercase tracking-[0.15em] font-semibold transition-colors"
            >
              {copy.cta}
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                arrow_forward
              </span>
            </a>
            <p className="text-[10px] text-white/40 mt-4">
              Sponsored — we may earn a commission when you apply. Terms apply.
            </p>
          </div>
          <div className="md:col-span-2 flex flex-col justify-center gap-3">
            {copy.benefits.map((b, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white/5 backdrop-blur-sm p-4 border border-white/10"
              >
                <span
                  className="material-symbols-outlined text-primary-fixed-dim shrink-0"
                  style={{ fontSize: '20px' }}
                >
                  check_circle
                </span>
                <span className="text-sm text-white/90 leading-snug">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'inline') {
    return (
      <aside className="not-prose my-8 bg-champagne-glint border-l-4 border-gold-500 p-6 md:p-8">
        <span className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-sand-dark block mb-3">
          Sponsored · FinlyWealth
        </span>
        <h3 className="font-headline-md text-xl md:text-2xl text-primary leading-tight mb-3">
          {headline}
        </h3>
        <p className="text-sm text-secondary leading-relaxed mb-5 max-w-2xl">
          {copy.subhead}
        </p>
        <a
          href={affiliate(copy.affiliateKey)}
          target="_blank"
          rel={AFFILIATE_REL}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-6 py-3 font-label-caps text-xs uppercase tracking-[0.15em] font-semibold transition-colors"
        >
          {copy.cta}
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            arrow_forward
          </span>
        </a>
      </aside>
    )
  }

  // sidebar (default) — dark card, value-anchored headline, trust bar, gold CTA
  const valueAnchor =
    destination === 'aeroplan'
      ? 'Up to 100,000 points'
      : destination === 'amex-platinum'
      ? 'Unlimited lounge visits'
      : destination === 'priority-pass'
      ? '1,500+ lounges worldwide'
      : 'Up to $800 in welcome value'

  return (
    <div className="relative overflow-hidden bg-primary text-white">
      {/* Gold corner badge — welcome offer anchor, draws the eye */}
      <div className="absolute top-0 right-0 bg-gold-500 text-primary px-3 py-1 font-label-caps text-[9px] uppercase tracking-[0.1em] font-bold shadow-md">
        Welcome offer
      </div>
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,#94d1d1_0%,transparent_60%)]" />
      <div className="relative p-6">
        <span className="font-label-caps text-[9px] uppercase tracking-[0.2em] text-primary-fixed-dim block mb-3">
          Sponsored · FinlyWealth
        </span>
        <h4 className="font-headline-md text-xl text-white leading-tight mb-2">
          {headline}
        </h4>
        <p className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold mb-3">
          {valueAnchor}
        </p>
        <ul className="space-y-2 mb-5">
          {copy.benefits.slice(0, 3).map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-white/90">
              <span
                className="material-symbols-outlined text-gold-400 shrink-0 mt-0.5"
                style={{ fontSize: '16px' }}
              >
                check_circle
              </span>
              <span className="leading-snug">{b}</span>
            </li>
          ))}
        </ul>
        <a
          href={affiliate(copy.affiliateKey)}
          target="_blank"
          rel={AFFILIATE_REL}
          className="block w-full text-center bg-gold-500 hover:bg-gold-400 text-primary px-4 py-3 font-label-caps text-[11px] uppercase tracking-[0.15em] font-semibold transition-colors"
        >
          {copy.cta} →
        </a>
        {/* Trust bar */}
        <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-white/10 text-[10px] text-white/60">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-gold-400" style={{ fontSize: '12px' }}>verified</span>
            Canadian cards
          </span>
          <span className="text-white/20">·</span>
          <span>Secure apply</span>
        </div>
        <p className="text-[9px] text-white/40 mt-3 text-center leading-snug">
          Sponsored — we may earn a commission at no cost to you.
        </p>
      </div>
    </div>
  )
}
