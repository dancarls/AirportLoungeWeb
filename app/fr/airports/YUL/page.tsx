import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import SidebarAffiliate from '@/components/SidebarAffiliate'
import TugoBannerAd from '@/components/TugoBannerAd'
import { affiliate, AFFILIATE_REL } from '@/lib/affiliates'

/**
 * French-locale (fr-CA) hub page for Montréal-Trudeau (YUL). Mirrors the
 * core structure of the English dynamic `[iata]/page.tsx` but is hard-wired
 * to YUL only, with Québécois-French strings and simpler widget set — no
 * weather / departure board / security wait times (those live on the EN
 * page; Québec-French travellers typically read our editorial content for
 * card-choice decisions, then follow through to the live-data widgets on
 * the EN hub if needed). Primary monetisation: the FinlyWealth lounge-cards
 * CTA + Airalo partner card, same placements as the EN sidebar.
 */

const YUL_IATA = 'YUL'
const BASE = 'https://www.airportlounges.ca'
const CANONICAL = `${BASE}/fr/airports/${YUL_IATA}`
const EN_URL = `${BASE}/airports/${YUL_IATA}`
const HERO_IMAGE =
  'https://ixgbdmrembkrpbkjhtfi.supabase.co/storage/v1/object/public/lounge-images/airports/yul/hero.jpg'

export const metadata: Metadata = {
  title:
    'Salons de l\'aéroport Montréal-Trudeau (YUL) — Accès, cartes et horaires 2026 | AirportLounges.ca',
  description:
    'Guide des salons de l\'aéroport de Montréal (YUL) en français. Sept espaces lounge à travers les zones domestique, internationale et transfrontalière. Règles d\'accès par carte de crédit, horaires et mise à jour sur la rénovation du Salon Banque Nationale. Vérifié le 13 octobre 2026.',
  alternates: {
    canonical: CANONICAL,
    languages: {
      'en-CA': EN_URL,
      'fr-CA': CANONICAL,
      'x-default': EN_URL,
    },
  },
  openGraph: {
    title: 'Salons de l\'aéroport Montréal-Trudeau (YUL) en 2026',
    description:
      'Sept salons à YUL — National Bank, Aspire International, Aspire Amex, Air France-KLM, Desjardins Odyssey, trois Salons Feuille d\'érable Air Canada. Règles d\'accès par carte, horaires et rénovation du Salon Banque Nationale.',
    url: CANONICAL,
    locale: 'fr_CA',
    images: [{ url: HERO_IMAGE, width: 1200, height: 630, alt: 'Salons de l\'aéroport Montréal-Trudeau' }],
  },
}

export const revalidate = 3600

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'Guides français', item: `${BASE}/fr/blog` },
    { '@type': 'ListItem', position: 3, name: 'YUL — Montréal-Trudeau', item: CANONICAL },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage: 'fr-CA',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Combien de salons l\'aéroport de Montréal (YUL) compte-t-il ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Sept espaces distincts à travers trois zones : le Salon Banque Nationale (international, espace temporaire), le Salon International Aspire, le Salon American Express Aspire (domestique, ouvert en juillet 2025), le Salon Air France-KLM par Plaza Premium, le Salon Odyssée Desjardins (transfrontalier), les trois Salons Feuille d\'érable Air Canada, et les deux Cafés Air Canada.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quelle est la meilleure carte de crédit pour les salons de YUL ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'La Mastercard Mondiale Élite Banque Nationale à 150 $ pour les voyageurs montréalais occasionnels (accès illimité au Salon Banque Nationale avec un invité et deux enfants). L\'Amex Platine à 799 $ pour les voyageurs fréquents sur plusieurs compagnies. L\'Amex Aéroplan Réserve à 599 $ pour les fidèles d\'Air Canada.',
      },
    },
    {
      '@type': 'Question',
      name: 'Est-ce que le Salon Banque Nationale est ouvert en 2026 ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Oui, mais dans un espace temporaire à capacité réduite depuis le 5 octobre 2026, jusqu\'à la réouverture du salon rénové prévue en juin 2028. La limite de séjour est de 2 heures (3 heures pour les clients de la Banque Privée 1859).',
      },
    },
    {
      '@type': 'Question',
      name: 'Est-ce que Priority Pass fonctionne à YUL ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Oui, à cinq salons : Aspire International, Aspire American Express, Air France-KLM (en dehors de 15 h 30 – 18 h 30), Salon Banque Nationale (acceptation au salon temporaire non confirmée en date d\'octobre 2026 — à vérifier dans l\'application), et Salon Odyssée Desjardins (transfrontalier).',
      },
    },
  ],
}

export default async function YulAirportHubFr() {
  const supabase = await createClient()
  const yulId = '3f2645da-2c60-4e3e-ad78-3bd268bee576'

  const { data: lounges } = await supabase
    .from('lounges')
    .select('id, name, slug, terminal, is_active, closure_status, closure_reopen_estimate')
    .eq('airport_id', yulId)
    .eq('is_active', true)
    .order('terminal', { ascending: true, nullsFirst: false })
    .order('name')

  return (
    <div className="bg-bone-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <div className="relative h-[420px] bg-aviation-navy overflow-hidden">
        <Image src={HERO_IMAGE} alt="Terminal de l'aéroport Montréal-Trudeau" fill className="object-cover opacity-55" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-aviation-navy/85 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-container-max mx-auto px-gutter pb-10">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Link href="/fr/blog" className="font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed hover:opacity-80 transition-opacity">
              ← Guides français
            </Link>
            <span className="text-bone-white/30">·</span>
            <span className="font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed bg-primary/60 px-2 py-1">
              YUL · Québec
            </span>
            <span className="text-bone-white/30">·</span>
            <Link href={EN_URL} hrefLang="en-CA" className="font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed hover:opacity-80 transition-opacity underline underline-offset-4">
              Read in English
            </Link>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-white max-w-3xl leading-tight">
            Salons de l'aéroport Montréal-Trudeau (YUL)
          </h1>
          <p className="mt-3 text-bone-white/85 max-w-2xl text-sm leading-relaxed">
            Sept espaces salon à travers trois zones terminal. Règles d'accès par carte de crédit, horaires, et toutes les mises à jour opérationnelles — vérifié le 13 octobre 2026.
          </p>
        </div>
      </div>

      {/* Alerte opérationnelle — rénovation Salon Banque Nationale */}
      <section className="bg-amber-50 border-y border-amber-200">
        <div className="max-w-container-max mx-auto px-gutter py-5">
          <div className="flex items-start md:items-center gap-4">
            <span className="material-symbols-outlined text-amber-700 shrink-0 mt-0.5 md:mt-0" style={{ fontSize: '22px' }} aria-hidden="true">schedule</span>
            <div className="flex-1 min-w-0">
              <p className="font-label-caps text-[9px] uppercase tracking-widest text-amber-800 mb-0.5">
                Alerte opérationnelle · YUL
              </p>
              <p className="text-sm text-amber-900 leading-snug">
                <strong>Le Salon Banque Nationale fonctionne dans un espace temporaire à capacité réduite depuis le 5 octobre 2026</strong>, limite de séjour de 2 heures (3 heures pour les clients de la Banque Privée 1859). Réouverture du salon complet rénové prévue en juin 2028.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu + barre latérale */}
      <div className="max-w-container-max mx-auto px-gutter py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <article className="lg:col-span-2 space-y-10">

            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">
                Les salons de YUL en un coup d'œil
              </h2>
              <p className="text-secondary leading-relaxed mb-6">
                YUL (Aéroport international Pierre-Elliott-Trudeau) compte sept espaces salon exploités par cinq opérateurs différents, répartis sur les zones Domestique, Internationale et Transfrontalière (États-Unis). Chacun a ses propres règles d'accès — carte de crédit, statut aérien, abonnement ou laissez-passer d'un jour.
              </p>

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
                        <Link href="/airports/YUL/lounges/national-bank-lounge-yul" className="font-semibold text-primary hover:underline">
                          Salon Banque Nationale
                        </Link>
                        <span className="block text-xs text-amber-700 mt-0.5">Espace temporaire oct. 2026 – juin 2028</span>
                      </td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Internationale</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Mastercard Mondiale Élite Banque Nationale (illimité, +1 invité, +2 enfants)</td>
                    </tr>
                    <tr className="bg-champagne-glint/10">
                      <td className="p-3 border-b border-sand-dark/10">
                        <Link href="/airports/YUL/lounges/aspire-international-lounge-yul" className="font-semibold text-primary hover:underline">
                          Salon International Aspire
                        </Link>
                      </td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Internationale</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Amex Platine (directe), Priority Pass, DragonPass, laissez-passer d'un jour</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-sand-dark/10">
                        <Link href="/airports/YUL/lounges/aspire-amex-lounge-yul" className="font-semibold text-primary hover:underline">
                          Salon American Express Aspire
                        </Link>
                        <span className="block text-xs text-secondary mt-0.5">Ouvert juillet 2025</span>
                      </td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Domestique</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Amex Platine (directe), Priority Pass, DragonPass, laissez-passer d'un jour</td>
                    </tr>
                    <tr className="bg-champagne-glint/10">
                      <td className="p-3 border-b border-sand-dark/10">
                        <Link href="/airports/YUL/lounges/air-france-klm-lounge-yul" className="font-semibold text-primary hover:underline">
                          Salon Air France – KLM
                        </Link>
                        <span className="block text-xs text-amber-700 mt-0.5">Fermé à Priority Pass de 15 h 30 à 18 h 30</span>
                      </td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Internationale</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Billet Classe Affaires Air France / KLM ; Priority Pass hors plage AF/KL</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-sand-dark/10">
                        <Link href="/airports/YUL/lounges/desjardins-odyssey-lounge-transborder-yul" className="font-semibold text-primary hover:underline">
                          Salon Odyssée Desjardins
                        </Link>
                      </td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Transfrontalier (É.-U.)</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Visa Infinite Odyssée Desjardins, Priority Pass, DragonPass, Amex Platine</td>
                    </tr>
                    <tr className="bg-champagne-glint/10">
                      <td className="p-3 border-b border-sand-dark/10">
                        <strong className="text-primary">Salon Feuille d'érable Air Canada</strong>
                        <span className="block text-xs text-secondary mt-0.5">Un dans chaque zone</span>
                      </td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Les trois zones</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Visa Infinite Privilège Aéroplan TD/CIBC, Amex Aéroplan Réserve, Aéroplan 50K+, Classe Affaires AC/Star Alliance</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-sand-dark/10">
                        <strong className="text-primary">Café Air Canada</strong>
                        <span className="block text-xs text-secondary mt-0.5">Domestique (porte A2) + Transfrontalier (portes 73-74)</span>
                      </td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Domestique + Transfrontalier</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Même accès que le Salon Feuille d'érable ; entrée eGate</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-champagne-glint/30 border-l-4 border-sand-dark p-6">
              <h3 className="font-label-caps text-label-caps text-primary mb-3">Guide d'accès YUL</h3>
              <p className="text-sm text-secondary leading-relaxed">
                Les piers de départ internationaux et vers les États-Unis ont des installations de salon séparées. Les options Air Canada Maple Leaf et indépendantes sont disponibles. Plusieurs acceptent Priority Pass avec certaines cartes de crédit — confirmez auprès de votre émetteur. Pour une analyse détaillée carte par carte, consultez notre guide dédié{' '}
                <Link href="/fr/blog/best-credit-card-montreal-yul-airport-lounge-access" className="underline font-semibold text-primary">
                  Meilleure carte de crédit pour accéder aux salons de YUL
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
                        <Link href={`/airports/YUL/lounges/${l.slug}`} className="font-semibold text-primary hover:underline">
                          {l.name}
                        </Link>
                        {l.terminal && (
                          <p className="text-xs text-secondary mt-0.5 uppercase tracking-widest">Terminal {l.terminal}</p>
                        )}
                        {l.closure_status && l.closure_status !== 'open' && (
                          <p className="text-xs text-amber-700 mt-1">
                            Statut : {l.closure_status === 'temporary_closure' ? 'fermeture temporaire' : l.closure_status === 'reduced_capacity' ? 'capacité réduite' : 'fermeture permanente'}
                            {l.closure_reopen_estimate && ` · retour prévu ${l.closure_reopen_estimate}`}
                          </p>
                        )}
                      </div>
                      <span className="material-symbols-outlined text-sand-dark shrink-0" style={{ fontSize: '18px' }}>arrow_forward</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-secondary/60 mt-3 italic">
                  Note : les pages détaillées des salons sont actuellement en anglais seulement. La traduction française est en cours.
                </p>
              </section>
            )}

            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">Questions fréquentes</h2>
              <div className="space-y-4">
                <details className="group bg-white border border-outline-variant/30 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer p-5 font-semibold text-primary flex items-start justify-between gap-4 hover:bg-champagne-glint/30 transition-colors">
                    <span className="leading-snug">Combien de salons l'aéroport de Montréal (YUL) compte-t-il ?</span>
                    <span className="material-symbols-outlined text-sand-dark shrink-0 group-open:rotate-180 transition-transform" style={{ fontSize: '20px' }}>expand_more</span>
                  </summary>
                  <div className="px-5 pb-5 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant/20 pt-4">
                    Sept espaces distincts à travers trois zones : le Salon Banque Nationale (international, espace temporaire), le Salon International Aspire, le Salon American Express Aspire (domestique, ouvert en juillet 2025), le Salon Air France-KLM par Plaza Premium, le Salon Odyssée Desjardins (transfrontalier), les trois Salons Feuille d'érable Air Canada, et les deux Cafés Air Canada.
                  </div>
                </details>

                <details className="group bg-white border border-outline-variant/30 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer p-5 font-semibold text-primary flex items-start justify-between gap-4 hover:bg-champagne-glint/30 transition-colors">
                    <span className="leading-snug">Quelle est la meilleure carte de crédit pour les salons de YUL ?</span>
                    <span className="material-symbols-outlined text-sand-dark shrink-0 group-open:rotate-180 transition-transform" style={{ fontSize: '20px' }}>expand_more</span>
                  </summary>
                  <div className="px-5 pb-5 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant/20 pt-4">
                    La <a href="https://www.finlywealth.com/credit-cards/reviews/national-bank-world-elite-mastercard" target="_blank" rel="sponsored nofollow noopener" className="underline">Mastercard Mondiale Élite Banque Nationale</a> à 150 $ pour les voyageurs montréalais occasionnels. L'<a href="https://www.finlywealth.com/credit-cards/reviews/amex-platinum" target="_blank" rel="sponsored nofollow noopener" className="underline">Amex Platine</a> à 799 $ pour les voyageurs fréquents. L'<a href="https://www.finlywealth.com/credit-cards/reviews/amex-aeroplan-reserve" target="_blank" rel="sponsored nofollow noopener" className="underline">Amex Aéroplan Réserve</a> à 599 $ pour les fidèles d'Air Canada. Analyse complète dans notre <Link href="/fr/blog/best-credit-card-montreal-yul-airport-lounge-access" className="underline">guide des cartes de crédit pour YUL</Link>.
                  </div>
                </details>

                <details className="group bg-white border border-outline-variant/30 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer p-5 font-semibold text-primary flex items-start justify-between gap-4 hover:bg-champagne-glint/30 transition-colors">
                    <span className="leading-snug">Est-ce que le Salon Banque Nationale est ouvert en 2026 ?</span>
                    <span className="material-symbols-outlined text-sand-dark shrink-0 group-open:rotate-180 transition-transform" style={{ fontSize: '20px' }}>expand_more</span>
                  </summary>
                  <div className="px-5 pb-5 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant/20 pt-4">
                    Oui, mais dans un espace temporaire à capacité réduite depuis le 5 octobre 2026, jusqu'à la réouverture du salon rénové prévue en juin 2028. La limite de séjour est de 2 heures (3 heures pour les clients de la Banque Privée 1859 Banque Nationale).
                  </div>
                </details>

                <details className="group bg-white border border-outline-variant/30 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer p-5 font-semibold text-primary flex items-start justify-between gap-4 hover:bg-champagne-glint/30 transition-colors">
                    <span className="leading-snug">Est-ce que Priority Pass fonctionne à YUL ?</span>
                    <span className="material-symbols-outlined text-sand-dark shrink-0 group-open:rotate-180 transition-transform" style={{ fontSize: '20px' }}>expand_more</span>
                  </summary>
                  <div className="px-5 pb-5 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant/20 pt-4">
                    Oui, à cinq salons : Aspire International, Aspire American Express (domestique), Air France-KLM (en dehors de 15 h 30 – 18 h 30), Salon Banque Nationale (acceptation au salon temporaire non confirmée en date d'octobre 2026 — à vérifier dans l'application Priority Pass), et Salon Odyssée Desjardins (transfrontalier).
                  </div>
                </details>
              </div>
            </section>

          </article>

          {/* Barre latérale */}
          <aside className="space-y-6">

            {/* CTA FinlyWealth — cartes qui ouvrent les salons de YUL */}
            <div className="bg-white border border-outline-variant/30 p-6 text-center">
              <span className="font-label-caps text-[9px] text-sand-dark uppercase tracking-widest block mb-3">
                Commandité · FinlyWealth
              </span>
              <h5 className="font-bold text-primary mb-2 leading-snug">
                Cartes qui ouvrent les salons de YUL
              </h5>
              <p className="text-sm text-secondary mb-4 leading-relaxed">
                Comparez les cartes canadiennes avec accès Priority Pass, Plaza Premium ou Salon Feuille d'érable — frais actuels, offres de bienvenue et plafonds de 2027.
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

            {/* Airalo — rendu une fois NEXT_PUBLIC_AFF_AIRALO configuré */}
            <SidebarAffiliate brand="airalo" />

            {/* TuGo — bannière française pour l'assurance voyage */}
            <TugoBannerAd locale="fr" />

            {/* Lectures recommandées */}
            <div className="bg-white fine-border p-5">
              <h3 className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-4">
                Lectures recommandées
              </h3>
              <div className="space-y-2">
                <Link
                  href="/fr/blog/best-credit-card-montreal-yul-airport-lounge-access"
                  className="flex items-center justify-between text-sm text-secondary hover:text-primary py-1.5 border-b border-outline-variant/20 transition-colors group"
                >
                  Meilleure carte pour YUL
                  <span className="material-symbols-outlined text-sand-dark group-hover:text-primary transition-colors" style={{ fontSize: '14px' }}>arrow_forward</span>
                </Link>
                <Link
                  href={EN_URL}
                  hrefLang="en-CA"
                  className="flex items-center justify-between text-sm text-secondary hover:text-primary py-1.5 border-b border-outline-variant/20 transition-colors group"
                >
                  English edition of this hub
                  <span className="material-symbols-outlined text-sand-dark group-hover:text-primary transition-colors" style={{ fontSize: '14px' }}>language</span>
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
