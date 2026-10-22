import Image from 'next/image'
import { affiliate, AFFILIATE_REL, isAffiliated } from '@/lib/affiliates'

interface Props {
  /**
   * Which locale creative to show. English version on default EN routes,
   * French version on `/fr/*` routes. TuGo supplied both as 300×250 PNGs
   * ("Holiday planning? We've got an all inclusive holiday package for you."
   * and the French equivalent "Vacances à l'horizon?").
   */
  locale?: 'en' | 'fr'
}

/**
 * TuGo "All-Inclusive Holiday Package" 300×250 medium-rectangle banner.
 * Renders a TuGo-supplied creative as a clickable image ad, routed through
 * the central affiliate() dispatcher so it goes to the Impact.com-tracked
 * TuGo URL (or falls back to the direct TuGo all-inclusive product page).
 *
 * Hidden entirely when neither the specific all-inclusive deeplink env var
 * nor the master TuGo env var is set — same visual-weight-zero pattern as
 * SidebarAffiliate so the layout is stable before/after affiliate
 * activation.
 */
export default function TugoBannerAd({ locale = 'en' }: Props) {
  // Prefer the product-specific deeplink; fall back to the master link.
  const hasSpecific = isAffiliated('tugo-all-inclusive')
  const hasMaster = isAffiliated('tugo-travel-insurance')
  if (!hasSpecific && !hasMaster) return null

  const href = hasSpecific
    ? affiliate('tugo-all-inclusive')
    : affiliate('tugo-travel-insurance')

  const creative =
    locale === 'fr'
      ? {
          src: '/ads/tugo-all-inclusive-300x250-fr.png',
          alt: 'TuGo — Vacances à l\'horizon? Nous avons un forfait vacances complet pour vous. Apprenez-en plus.',
          sponsoredLabel: 'Commandité · TuGo®',
        }
      : {
          src: '/ads/tugo-all-inclusive-300x250-en.png',
          alt: 'TuGo — Holiday planning? We\'ve got an all inclusive holiday package for you. Learn more.',
          sponsoredLabel: 'Sponsored · TuGo®',
        }

  return (
    <div className="flex flex-col items-center">
      <a
        href={href}
        target="_blank"
        rel={AFFILIATE_REL}
        className="block rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        aria-label={creative.alt}
      >
        <Image
          src={creative.src}
          alt={creative.alt}
          width={300}
          height={250}
          className="block"
          sizes="300px"
        />
      </a>
      <p className="font-label-caps text-[9px] uppercase tracking-widest text-secondary/60 mt-2">
        {creative.sponsoredLabel}
      </p>
    </div>
  )
}
