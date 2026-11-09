import { affiliate, AFFILIATE_REL, isAffiliated } from '@/lib/affiliates'

interface Props {
  /**
   * Which locale copy to show. English by default; French mirror pages pass 'fr'.
   */
  locale?: 'en' | 'fr'
}

const COPY = {
  en: {
    label: 'Sponsored · TuGo®',
    headline: 'Trip trouble? We\'ve got you.',
    subhead: 'Medical, cancellation, baggage and more — the Canadian travel insurance travellers trust.',
    benefits: [
      'Emergency medical from $17',
      'Trip cancellation + interruption',
      '24/7 Canadian claims team',
    ],
    cta: 'Get a TuGo quote',
    trust: ['A+ BBB rated', '70+ years in Canada'],
  },
  fr: {
    label: 'Commandité · TuGo®',
    headline: 'Un pépin en voyage? On vous couvre.',
    subhead: 'Soins médicaux, annulation, bagages — l\'assurance voyage canadienne de confiance.',
    benefits: [
      'Médical d\'urgence dès 17 $',
      'Annulation + interruption',
      'Équipe de réclamations 24/7',
    ],
    cta: 'Obtenez un devis TuGo',
    trust: ['Coté A+ BBB', '70+ ans au Canada'],
  },
}

/**
 * TuGo travel-insurance CTA — replaces the earlier static 300×250 banner with
 * a conversion-optimized card matching the site's editorial design DNA.
 * Routes through the Impact.com-tracked TuGo URL when the env var is set;
 * falls back to the direct TuGo all-inclusive product page.
 */
export default function TugoBannerAd({ locale = 'en' }: Props) {
  const copy = COPY[locale]
  const hasSpecific = isAffiliated('tugo-all-inclusive')
  const hasMaster = isAffiliated('tugo-travel-insurance')
  if (!hasSpecific && !hasMaster) return null

  const href = hasSpecific
    ? affiliate('tugo-all-inclusive')
    : affiliate('tugo-travel-insurance')

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
          href={href}
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
      </div>
    </div>
  )
}
