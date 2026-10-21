import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import SidebarAffiliate from '@/components/SidebarAffiliate'
import { affiliate, AFFILIATE_REL } from '@/lib/affiliates'

/**
 * French-locale (fr-CA) hub page for Toronto Pearson (YYZ). Mirrors the
 * YUL French hub structure but hard-wired to YYZ with its own content
 * (9 lounge spaces across T1 and T3; the T1 International Plaza Premium
 * closure since Dec 2025).
 */

const CODE = 'YYZ'
const BASE = 'https://www.airportlounges.ca'
const CANONICAL = `${BASE}/fr/airports/${CODE}`
const EN_URL = `${BASE}/airports/${CODE}`
const HERO_IMAGE =
  'https://ixgbdmrembkrpbkjhtfi.supabase.co/storage/v1/object/public/lounge-images/airports/yyz/hero.jpg'

export const metadata: Metadata = {
  title:
    'Salons de l\'aéroport Toronto Pearson (YYZ) — Accès, cartes et horaires 2026 | AirportLounges.ca',
  description:
    'Guide des salons de l\'aéroport Toronto Pearson (YYZ) en français. Neuf espaces lounge à travers les Terminaux 1 et 2. Règles d\'accès par carte de crédit, horaires et fermeture du Plaza Premium T1 International. Vérifié le 14 octobre 2026.',
  alternates: {
    canonical: CANONICAL,
    languages: {
      'en-CA': EN_URL,
      'fr-CA': CANONICAL,
      'x-default': EN_URL,
    },
  },
  openGraph: {
    title: 'Salons de l\'aéroport Toronto Pearson (YYZ) en 2026',
    description:
      'Neuf salons à YYZ — Suite Signature Air Canada, trois Salons Feuille d\'érable, cinq Plaza Premium, Aspire T3, AF-KLM, Admirals Club. Règles d\'accès par carte et fermeture du Plaza Premium T1 International.',
    url: CANONICAL,
    locale: 'fr_CA',
    images: [{ url: HERO_IMAGE, width: 1200, height: 630, alt: 'Salons de l\'aéroport Toronto Pearson' }],
  },
}

export const revalidate = 3600

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'Guides français', item: `${BASE}/fr/blog` },
    { '@type': 'ListItem', position: 3, name: 'YYZ — Toronto Pearson', item: CANONICAL },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage: 'fr-CA',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Combien de salons l\'aéroport Toronto Pearson (YYZ) compte-t-il ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Neuf espaces distincts plus un crédit spa Be Relax. Terminal 1 : Suite Signature Air Canada, trois Salons Feuille d\'érable (international, domestique, transfrontalier), deux Plaza Premium (le Plaza Premium T1 International est fermé pour reconstruction depuis décembre 2025), et le Café Air Canada. Terminal 3 : trois Plaza Premium (Landmark international, domestique, transfrontalier), Admirals Club American Airlines, Salon KLM Crown, et Aspire Lounge T3.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quelle est la meilleure carte de crédit pour les salons de YYZ ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'L\'Amex Platine à 799 $ (coût net environ 399 $ après crédits) est la plus forte — accès direct à 5 des 9 salons de YYZ, plus Aspire T3 via Priority Pass. Pour les fidèles d\'Air Canada à T1, la CIBC Aéroplan Visa Infinite Privilège ou l\'Amex Aéroplan Réserve à 599 $ ouvrent les trois Salons Feuille d\'érable.',
      },
    },
    {
      '@type': 'Question',
      name: 'La Suite Signature Air Canada à YYZ est-elle accessible avec Priority Pass ou une carte de crédit ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Non. La Suite Signature est réservée aux passagers titulaires d\'un billet Classe Signature internationale d\'Air Canada et aux Super Elite 100K Aéroplan voyageant sur un itinéraire Signature Class. Aucune carte de crédit et aucune adhésion (Priority Pass, DragonPass, Amex Platine, Centurion) ne donne accès.',
      },
    },
    {
      '@type': 'Question',
      name: 'Le Plaza Premium T1 International à YYZ est-il toujours fermé ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Oui, en date du 14 octobre 2026. Le Plaza Premium T1 International (près de la porte E77) a fermé le 27 décembre 2025 pour une reconstruction complète sans date de réouverture annoncée. Les détenteurs de Priority Pass partant à l\'international de T1 n\'ont actuellement aucun salon dans leur zone.',
      },
    },
  ],
}

export default async function YyzAirportHubFr() {
  const supabase = await createClient()
  const yyzId = '840161ae-1301-45f8-ad92-10d7834bef72'

  const { data: lounges } = await supabase
    .from('lounges')
    .select('id, name, slug, terminal, is_active, closure_status, closure_reopen_estimate')
    .eq('airport_id', yyzId)
    .eq('is_active', true)
    .order('terminal', { ascending: true, nullsFirst: false })
    .order('name')

  return (
    <div className="bg-bone-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="relative h-[420px] bg-aviation-navy overflow-hidden">
        <Image src={HERO_IMAGE} alt="Terminal de l'aéroport Toronto Pearson" fill className="object-cover opacity-55" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-aviation-navy/85 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-container-max mx-auto px-gutter pb-10">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Link href="/fr/blog" className="font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed hover:opacity-80 transition-opacity">
              ← Guides français
            </Link>
            <span className="text-bone-white/30">·</span>
            <span className="font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed bg-primary/60 px-2 py-1">
              YYZ · Ontario
            </span>
            <span className="text-bone-white/30">·</span>
            <Link href={EN_URL} hrefLang="en-CA" className="font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed hover:opacity-80 transition-opacity underline underline-offset-4">
              Read in English
            </Link>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-white max-w-3xl leading-tight">
            Salons de l'aéroport Toronto Pearson (YYZ)
          </h1>
          <p className="mt-3 text-bone-white/85 max-w-2xl text-sm leading-relaxed">
            Neuf espaces lounge à travers les Terminaux 1 et 2 — le plus grand réseau de salons au Canada. Règles d'accès par carte de crédit, horaires et mises à jour opérationnelles. Vérifié le 14 octobre 2026.
          </p>
        </div>
      </div>

      {/* Alerte opérationnelle — fermeture Plaza Premium T1 International */}
      <section className="bg-amber-50 border-y border-amber-200">
        <div className="max-w-container-max mx-auto px-gutter py-5">
          <div className="flex items-start md:items-center gap-4">
            <span className="material-symbols-outlined text-amber-700 shrink-0 mt-0.5 md:mt-0" style={{ fontSize: '22px' }} aria-hidden="true">construction</span>
            <div className="flex-1 min-w-0">
              <p className="font-label-caps text-[9px] uppercase tracking-widest text-amber-800 mb-0.5">
                Alerte opérationnelle · YYZ
              </p>
              <p className="text-sm text-amber-900 leading-snug">
                <strong>Le Plaza Premium T1 International (porte E77) est fermé pour reconstruction depuis le 27 décembre 2025</strong>, sans date de réouverture annoncée. Les voyageurs internationaux de T1 avec Priority Pass n'ont actuellement aucun salon dans leur zone — options : Salon Feuille d'érable International (cartes Aéroplan premium) ou aucun salon.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-container-max mx-auto px-gutter py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <article className="lg:col-span-2 space-y-10">

            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">
                Les salons de YYZ par terminal
              </h2>
              <p className="text-secondary leading-relaxed mb-6">
                YYZ est le plus grand aéroport canadien avec neuf espaces lounge distincts à travers Terminal 1 (Air Canada / Star Alliance) et Terminal 3 (SkyTeam, Oneworld, WestJet, Transat). Les salons ne sont généralement pas inter-terminaux — votre carte compte seulement dans le terminal de départ de votre vol.
              </p>

              <h3 className="font-headline-md text-primary mb-3">Terminal 1 — Air Canada / Star Alliance</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-champagne-glint/30 text-left">
                    <tr>
                      <th className="p-3 border-b border-sand-dark/20 font-semibold text-primary">Salon</th>
                      <th className="p-3 border-b border-sand-dark/20 font-semibold text-primary">Zone</th>
                      <th className="p-3 border-b border-sand-dark/20 font-semibold text-primary">Accès principal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border-b border-sand-dark/10"><strong className="text-primary">Suite Signature Air Canada</strong></td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Internationale (Pier F)</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Billet Classe Signature internationale AC uniquement — aucune carte n'y donne accès</td>
                    </tr>
                    <tr className="bg-champagne-glint/10">
                      <td className="p-3 border-b border-sand-dark/10"><strong className="text-primary">Salon Feuille d'érable Air Canada</strong> (3 emplacements)</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Les trois zones</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Visa Infinite Privilège Aéroplan TD/CIBC, Amex Aéroplan Réserve, Aéroplan 50K+, Star Alliance Gold</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-sand-dark/10"><strong className="text-primary">Plaza Premium T1</strong> (Domestique + Transfrontalier)</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Domestique + Transfrontalier</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Amex Platine (directe), Priority Pass, DragonPass, laissez-passer d'un jour</td>
                    </tr>
                    <tr className="bg-amber-50/50">
                      <td className="p-3 border-b border-sand-dark/10">
                        <strong className="text-primary">Plaza Premium T1 International</strong>
                        <span className="block text-xs text-amber-700 mt-0.5">Fermé depuis déc. 2025</span>
                      </td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Internationale (porte E77)</td>
                      <td className="p-3 border-b border-sand-dark/10 text-amber-700" colSpan={1}>En reconstruction — aucune date de réouverture</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-headline-md text-primary mb-3">Terminal 3 — SkyTeam / Oneworld / WestJet / Transat</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-champagne-glint/30 text-left">
                    <tr>
                      <th className="p-3 border-b border-sand-dark/20 font-semibold text-primary">Salon</th>
                      <th className="p-3 border-b border-sand-dark/20 font-semibold text-primary">Zone</th>
                      <th className="p-3 border-b border-sand-dark/20 font-semibold text-primary">Accès principal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border-b border-sand-dark/10">
                        <strong className="text-primary">Plaza Premium Landmark T3</strong>
                        <span className="block text-xs text-secondary mt-0.5">Salon phare de YYZ</span>
                      </td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Internationale (porte C32)</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Amex Platine (directe), Priority Pass, DragonPass, laissez-passer d'un jour</td>
                    </tr>
                    <tr className="bg-champagne-glint/10">
                      <td className="p-3 border-b border-sand-dark/10"><strong className="text-primary">Plaza Premium T3 Domestique</strong></td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Domestique (porte B24)</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Amex Platine (directe), Priority Pass, DragonPass</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-sand-dark/10"><strong className="text-primary">Plaza Premium T3 Transfrontalier</strong></td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Transfrontalier (près porte A10)</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Amex Platine (directe), Priority Pass, DragonPass</td>
                    </tr>
                    <tr className="bg-champagne-glint/10">
                      <td className="p-3 border-b border-sand-dark/10"><strong className="text-primary">Aspire Lounge T3</strong></td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Internationale</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Amex Platine (directe), Priority Pass, DragonPass</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-sand-dark/10"><strong className="text-primary">Salon KLM Crown (Air France-KLM)</strong></td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Internationale</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Billet Classe Affaires AF/KL, SkyTeam Élite Plus, Flying Blue Platinum</td>
                    </tr>
                    <tr className="bg-champagne-glint/10">
                      <td className="p-3 border-b border-sand-dark/10"><strong className="text-primary">Admirals Club American Airlines</strong></td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Transfrontalier</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Adhésion Admirals Club, Oneworld Emerald, Classe Affaires AA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-champagne-glint/30 border-l-4 border-sand-dark p-6">
              <h3 className="font-label-caps text-label-caps text-primary mb-3">Guide d'accès YYZ</h3>
              <p className="text-sm text-secondary leading-relaxed">
                Terminal 1 est le domaine d'Air Canada et Star Alliance ; Terminal 3 est le domaine de SkyTeam, Oneworld, WestJet et Air Transat. Confirmez votre terminal de départ avant de choisir une carte — les salons ne se croisent généralement pas entre les terminaux. Pour une analyse carte par carte, consultez notre{' '}
                <Link href="/blog/best-credit-card-toronto-pearson-yyz-airport-lounge-access" className="underline font-semibold text-primary">
                  guide dédié sur la meilleure carte pour YYZ (en anglais)
                </Link>.
              </p>
            </section>

            {/* Liste des salons depuis Supabase */}
            {lounges && lounges.length > 0 && (
              <section>
                <h2 className="font-headline-md text-headline-md text-primary mb-4">
                  Tous les salons actuellement en service
                </h2>
                <ul className="divide-y divide-outline-variant/20 bg-white border border-outline-variant/30">
                  {lounges.map(l => (
                    <li key={l.id} className="p-5 flex items-start justify-between gap-4 hover:bg-champagne-glint/20 transition-colors">
                      <div className="min-w-0">
                        <Link href={`/airports/YYZ/lounges/${l.slug}`} className="font-semibold text-primary hover:underline">
                          {l.name}
                        </Link>
                        {l.terminal && (
                          <p className="text-xs text-secondary mt-0.5 uppercase tracking-widest">Terminal {l.terminal}</p>
                        )}
                      </div>
                      <span className="material-symbols-outlined text-sand-dark shrink-0" style={{ fontSize: '18px' }}>arrow_forward</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-secondary/60 mt-3 italic">
                  Note : les pages détaillées des salons sont actuellement en anglais seulement.
                </p>
              </section>
            )}

            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">Questions fréquentes</h2>
              <div className="space-y-4">
                <details className="group bg-white border border-outline-variant/30 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer p-5 font-semibold text-primary flex items-start justify-between gap-4 hover:bg-champagne-glint/30 transition-colors">
                    <span className="leading-snug">Combien de salons l'aéroport Toronto Pearson (YYZ) compte-t-il ?</span>
                    <span className="material-symbols-outlined text-sand-dark shrink-0 group-open:rotate-180 transition-transform" style={{ fontSize: '20px' }}>expand_more</span>
                  </summary>
                  <div className="px-5 pb-5 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant/20 pt-4">
                    Neuf espaces distincts plus un crédit spa Be Relax. Terminal 1 : Suite Signature Air Canada, trois Salons Feuille d'érable, deux Plaza Premium (international fermé pour reconstruction depuis déc. 2025), et le Café Air Canada. Terminal 3 : trois Plaza Premium (Landmark international, domestique, transfrontalier), Admirals Club, Salon KLM Crown, et Aspire Lounge T3.
                  </div>
                </details>

                <details className="group bg-white border border-outline-variant/30 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer p-5 font-semibold text-primary flex items-start justify-between gap-4 hover:bg-champagne-glint/30 transition-colors">
                    <span className="leading-snug">Quelle est la meilleure carte de crédit pour les salons de YYZ ?</span>
                    <span className="material-symbols-outlined text-sand-dark shrink-0 group-open:rotate-180 transition-transform" style={{ fontSize: '20px' }}>expand_more</span>
                  </summary>
                  <div className="px-5 pb-5 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant/20 pt-4">
                    L'<a href="https://www.finlywealth.com/credit-cards/reviews/amex-platinum" target="_blank" rel="sponsored nofollow noopener" className="underline">Amex Platine</a> à 799 $ (coût net environ 399 $ après crédits) est la plus forte — accès direct à 5 des 9 salons de YYZ, plus Aspire T3 via Priority Pass. Pour les fidèles d'Air Canada à T1, la <a href="https://www.finlywealth.com/credit-cards/reviews/cibc-aeroplan-visa-infinite-privilege" target="_blank" rel="sponsored nofollow noopener" className="underline">CIBC Aéroplan VIP</a> ou l'<a href="https://www.finlywealth.com/credit-cards/reviews/amex-aeroplan-reserve" target="_blank" rel="sponsored nofollow noopener" className="underline">Amex Aéroplan Réserve</a> à 599 $ ouvrent les trois Salons Feuille d'érable.
                  </div>
                </details>

                <details className="group bg-white border border-outline-variant/30 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer p-5 font-semibold text-primary flex items-start justify-between gap-4 hover:bg-champagne-glint/30 transition-colors">
                    <span className="leading-snug">La Suite Signature Air Canada à YYZ est-elle accessible avec une carte ?</span>
                    <span className="material-symbols-outlined text-sand-dark shrink-0 group-open:rotate-180 transition-transform" style={{ fontSize: '20px' }}>expand_more</span>
                  </summary>
                  <div className="px-5 pb-5 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant/20 pt-4">
                    Non. La Suite Signature est réservée aux passagers titulaires d'un billet Classe Signature internationale d'Air Canada et aux Super Elite 100K Aéroplan voyageant sur un itinéraire Signature Class. Aucune carte de crédit et aucune adhésion (Priority Pass, DragonPass, Amex Platine, Centurion) ne donne accès.
                  </div>
                </details>

                <details className="group bg-white border border-outline-variant/30 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer p-5 font-semibold text-primary flex items-start justify-between gap-4 hover:bg-champagne-glint/30 transition-colors">
                    <span className="leading-snug">Le Plaza Premium T1 International à YYZ est-il toujours fermé ?</span>
                    <span className="material-symbols-outlined text-sand-dark shrink-0 group-open:rotate-180 transition-transform" style={{ fontSize: '20px' }}>expand_more</span>
                  </summary>
                  <div className="px-5 pb-5 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant/20 pt-4">
                    Oui, en date du 14 octobre 2026. Le Plaza Premium T1 International (près de la porte E77) a fermé le 27 décembre 2025 pour une reconstruction complète sans date de réouverture annoncée. Les détenteurs de Priority Pass partant à l'international de T1 n'ont actuellement aucun salon dans leur zone.
                  </div>
                </details>
              </div>
            </section>

          </article>

          <aside className="space-y-6">
            <div className="bg-white border border-outline-variant/30 p-6 text-center">
              <span className="font-label-caps text-[9px] text-sand-dark uppercase tracking-widest block mb-3">
                Commandité · FinlyWealth
              </span>
              <h5 className="font-bold text-primary mb-2 leading-snug">
                Cartes qui ouvrent les salons de YYZ
              </h5>
              <p className="text-sm text-secondary mb-4 leading-relaxed">
                Comparez les cartes canadiennes qui ouvrent les salons Plaza Premium, Priority Pass, DragonPass et Salon Feuille d'érable à Toronto Pearson.
              </p>
              <a
                href={affiliate('finlywealth-lounge-access-cards')}
                target="_blank"
                rel={AFFILIATE_REL}
                className="inline-block bg-primary text-white px-6 py-3 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Comparer les cartes
              </a>
              <p className="text-[9px] text-secondary/50 mt-3">
                Commandité — nous pouvons gagner une commission.
              </p>
            </div>

            <SidebarAffiliate brand="airalo" />

            <div className="bg-white fine-border p-5">
              <h3 className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-4">
                Lectures recommandées
              </h3>
              <div className="space-y-2">
                <Link
                  href={EN_URL}
                  hrefLang="en-CA"
                  className="flex items-center justify-between text-sm text-secondary hover:text-primary py-1.5 border-b border-outline-variant/20 transition-colors group"
                >
                  English edition of this hub
                  <span className="material-symbols-outlined text-sand-dark group-hover:text-primary transition-colors" style={{ fontSize: '14px' }}>language</span>
                </Link>
                <Link
                  href="/fr/airports/YUL"
                  className="flex items-center justify-between text-sm text-secondary hover:text-primary py-1.5 border-b border-outline-variant/20 transition-colors group"
                >
                  Salons de l'aéroport de Montréal (YUL)
                  <span className="material-symbols-outlined text-sand-dark group-hover:text-primary transition-colors" style={{ fontSize: '14px' }}>arrow_forward</span>
                </Link>
                <Link
                  href="/airports"
                  className="flex items-center justify-between text-sm text-secondary hover:text-primary py-1.5 last:border-0 transition-colors group"
                >
                  Tous les aéroports canadiens
                  <span className="material-symbols-outlined text-sand-dark group-hover:text-primary transition-colors" style={{ fontSize: '14px' }}>arrow_forward</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
