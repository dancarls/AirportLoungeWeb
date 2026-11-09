import { affiliate, AFFILIATE_REL, isAffiliated } from '@/lib/affiliates'

type Brand = 'airalo' | 'monos'

interface Props {
  /**
   * Which travel-adjacent partner to render. The component picks the right
   * registry key, copy, and CTA label for the brand. When the brand's env
   * var is NOT set (affiliate code not yet obtained), the card renders
   * nothing — no visual placeholder, no layout shift, no partner link that
   * is not actually tracked.
   */
  brand: Brand
}

interface BrandCopy {
  affiliateKey: Parameters<typeof affiliate>[0]
  label: string
  headline: string
  subhead: string
  benefits: string[]
  cta: string
  trust: string[]
}

const COPY: Record<Brand, BrandCopy> = {
  airalo: {
    affiliateKey: 'airalo-esim',
    label: 'Sponsored · Airalo',
    headline: 'Data abroad in 60 seconds',
    subhead: 'Install a destination eSIM before you board. No SIM swap, no roaming bill, no searching for a counter on arrival.',
    benefits: [
      '190+ countries supported',
      'Works beside your Canadian SIM',
      'Activate from the app on landing',
    ],
    cta: 'Browse eSIM plans',
    trust: ['Trusted by 10M+ travellers', 'Instant activation'],
  },
  monos: {
    affiliateKey: 'monos-luggage',
    label: 'Sponsored · Monos',
    headline: 'Canadian carry-on. Lifetime warranty.',
    subhead: 'Vancouver-designed luggage that fits every Canadian airline overhead — in champagne, navy and bone.',
    benefits: [
      'Fits every Canadian airline overhead',
      'Lifetime warranty',
      '100-day free trial',
    ],
    cta: 'See the collection',
    trust: ['4.9★ TrustPilot', 'Free CA shipping'],
  },
}

/**
 * High-conversion partner CTA for the sidebar. Matches the editorial design
 * of LoungeAccessCTA and the redesigned TugoBannerAd — champagne-glint band,
 * gold accent border, benefit bullets, primary CTA, trust bar. Hidden entirely
 * when the brand's affiliate code (env var) is not yet set, so the layout
 * stays stable before vs. after each affiliate activation.
 */
export default function SidebarAffiliate({ brand }: Props) {
  const copy = COPY[brand]
  if (!isAffiliated(copy.affiliateKey)) return null

  return (
    <div className="relative overflow-hidden bg-champagne-glint border-l-4 border-gold-500">
      <div className="p-6">
        <span className="font-label-caps text-[9px] uppercase tracking-[0.2em] text-sand-dark block mb-3">
          {copy.label}
        </span>
        <h4 className="font-headline-md text-xl text-primary leading-tight mb-2">
          {copy.headline}
        </h4>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
          {copy.subhead}
        </p>
        <ul className="space-y-2 mb-5">
          {copy.benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
              <span
                className="material-symbols-outlined text-gold-500 shrink-0 mt-0.5"
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
          className="block w-full text-center bg-primary hover:bg-primary-container text-white px-4 py-3 font-label-caps text-[11px] uppercase tracking-[0.15em] font-semibold transition-colors"
        >
          {copy.cta} →
        </a>
        <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-sand-dark/20 text-[10px] text-sand-dark">
          {copy.trust.map((t, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-sand-dark/40">·</span>}
              <span>{t}</span>
            </span>
          ))}
        </div>
        <p className="text-[9px] text-sand-dark/60 mt-3 text-center leading-snug">
          Sponsored — we may earn a commission at no cost to you.
        </p>
      </div>
    </div>
  )
}
