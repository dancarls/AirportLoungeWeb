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
  heading: string
  body: string
  ctaLabel: string
}

const COPY: Record<Brand, BrandCopy> = {
  airalo: {
    affiliateKey: 'airalo-esim',
    label: 'Partner · Airalo',
    heading: 'Global eSIM — on arrival, no SIM swap',
    body:
      'Install a destination data plan on your phone before you board. Works alongside your Canadian SIM; no roaming surprises, no searching for an airport SIM counter.',
    ctaLabel: 'Browse eSIM Plans',
  },
  monos: {
    affiliateKey: 'monos-luggage',
    label: 'Partner · Monos',
    heading: 'Monos — Canadian carry-on, lifetime warranty',
    body:
      'Vancouver-designed carry-on and luggage. Fits every Canadian airline overhead bin, in champagne, navy and bone. Quiet premium, no logo noise.',
    ctaLabel: 'See the Collection',
  },
}

/**
 * Single understated partner card for the sidebar. Visually matches the
 * existing "Priority Pass Membership" card in the blog sidebar — fine
 * border, small-caps label, muted copy, one tappable CTA. Hidden entirely
 * when the brand's affiliate code (env var) is not yet set, so the layout
 * stays stable before vs. after each affiliate activation.
 */
export default function SidebarAffiliate({ brand }: Props) {
  const copy = COPY[brand]
  // Only render once the brand's affiliate code is in the environment.
  // Keeps the sidebar quiet until we actually earn commission on the click.
  if (!isAffiliated(copy.affiliateKey)) return null

  return (
    <div className="bg-white fine-border p-6 text-center">
      <span className="font-label-caps text-[9px] text-sand-dark uppercase tracking-widest block mb-3">
        {copy.label}
      </span>
      <h5 className="font-bold text-primary mb-2 leading-snug">{copy.heading}</h5>
      <p className="text-sm text-secondary mb-4 leading-relaxed">{copy.body}</p>
      <a
        href={affiliate(copy.affiliateKey)}
        target="_blank"
        rel={AFFILIATE_REL}
        className="inline-block bg-primary text-white px-6 py-3 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity"
      >
        {copy.ctaLabel}
      </a>
      <p className="text-[9px] text-secondary/50 mt-3">
        Sponsored — we may earn a commission.
      </p>
    </div>
  )
}
