import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import SidebarAffiliate from '@/components/SidebarAffiliate'
import TugoBannerAd from '@/components/TugoBannerAd'
import { affiliate, AFFILIATE_REL } from '@/lib/affiliates'

const CODE = 'YVR'
const BASE = 'https://www.airportlounges.ca'
const CANONICAL = `${BASE}/fr/airports/${CODE}`
const EN_URL = `${BASE}/airports/${CODE}`
const HERO_IMAGE =
  'https://ixgbdmrembkrpbkjhtfi.supabase.co/storage/v1/object/public/lounge-images/airports/yvr/hero.jpg'

export const metadata: Metadata = {
  title:
    'Salons de l\'aéroport Vancouver (YVR) — Accès, cartes et horaires 2026 | AirportLounges.ca',
  description:
    'Guide des salons de l\'aéroport de Vancouver (YVR) en français. Dix salons incluant Plaza Premium First, Cathay Pacific et le Salon SkyTeam. Fermeture du Salon Feuille d\'érable Domestique AC du 14 octobre 2026 à début 2028. Vérifié octobre 2026.',
  alternates: {
    canonical: CANONICAL,
    languages: {
      'en-CA': EN_URL,
      'fr-CA': CANONICAL,
      'x-default': EN_URL,
    },
  },
  openGraph: {
    title: 'Salons de l\'aéroport Vancouver (YVR) en 2026',
    description:
      'Dix salons à YVR — Plaza Premium (5 emplacements), Salons Feuille d\'érable Air Canada, SkyTeam, Cathay Pacific. Mise à jour sur la fermeture du Salon Feuille d\'érable Domestique YVR pour rénovation.',
    url: CANONICAL,
    locale: 'fr_CA',
    images: [{ url: HERO_IMAGE, width: 1200, height: 630, alt: 'Salons de l\'aéroport Vancouver' }],
  },
}

export const revalidate = 3600

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'Guides français', item: `${BASE}/fr/blog` },
    { '@type': 'ListItem', position: 3, name: 'YVR — Vancouver', item: CANONICAL },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage: 'fr-CA',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Combien de salons l\'aéroport de Vancouver (YVR) compte-t-il ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Dix salons distincts — cinq Plaza Premium (Pier B Domestique, Pier C outpost, Pier D International, Pier E US, Plaza Premium First), trois Salons Feuille d\'érable Air Canada (International, Domestique en fermeture, Transfrontalier), le Salon Cathay Pacific et le Salon SkyTeam.',
      },
    },
    {
      '@type': 'Question',
      name: 'Le Salon Feuille d\'érable Domestique à YVR ferme-t-il ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Oui. Le Salon Feuille d\'érable Domestique d\'Air Canada à YVR ferme pour une rénovation majeure du 14 octobre 2026 jusqu\'au début de 2028. Dernier jour pour les clients : 13 octobre 2026. Pendant la fermeture, les voyageurs admissibles peuvent utiliser les deux Cafés Air Canada à YVR.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quelle est la meilleure carte de crédit pour les salons de YVR ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'L\'Amex Platine à 799 $ pour la couverture la plus large — entrée directe aux cinq Plaza Premium (y compris Plaza Premium First via le surclassement de 30 $) et Priority Pass pour les lounges Cathay et SkyTeam. Pour les fidèles d\'Air Canada, les cartes Aéroplan VIP TD/CIBC ou l\'Amex Aéroplan Réserve ouvrent les Salons Feuille d\'érable International et Transfrontalier.',
      },
    },
    {
      '@type': 'Question',
      name: 'Est-ce que Priority Pass fonctionne au Plaza Premium First à YVR ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Non — Plaza Premium First à YVR n\'accepte PAS Priority Pass. L\'entrée directe coûte 110 $ CAD pour un séjour de 2 heures, ou vous pouvez surclasser depuis le Plaza Premium International voisin pour 30 $. L\'Amex Platine donne accès via son avantage de carte direct.',
      },
    },
  ],
}

export default async function YvrAirportHubFr() {
  const supabase = await createClient()
  const yvrId = '3f2645da-2c60-4e3e-ad78-3bd268bee576'

  const { data: lounges } = await supabase
    .from('lounges')
    .select('id, name, slug, terminal, is_active, closure_status, closure_reopen_estimate')
    .eq('airport_id', yvrId)
    .eq('is_active', true)
    .order('terminal', { ascending: true, nullsFirst: false })
    .order('name')

  return (
    <div className="bg-bone-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="relative h-[420px] bg-aviation-navy overflow-hidden">
        <Image src={HERO_IMAGE} alt="Terminal de l'aéroport Vancouver" fill className="object-cover opacity-55" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-aviation-navy/85 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-container-max mx-auto px-gutter pb-10">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Link href="/fr/blog" className="font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed hover:opacity-80 transition-opacity">
              ← Guides français
            </Link>
            <span className="text-bone-white/30">·</span>
            <span className="font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed bg-primary/60 px-2 py-1">
              YVR · Colombie-Britannique
            </span>
            <span className="text-bone-white/30">·</span>
            <Link href={EN_URL} hrefLang="en-CA" className="font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed hover:opacity-80 transition-opacity underline underline-offset-4">
              Read in English
            </Link>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-white max-w-3xl leading-tight">
            Salons de l'aéroport Vancouver (YVR)
          </h1>
          <p className="mt-3 text-bone-white/85 max-w-2xl text-sm leading-relaxed">
            Dix salons incluant la seule Plaza Premium First au Canada, le Salon Cathay Pacific avec ses chaises Solus et le Salon SkyTeam. Fermeture importante du Salon Feuille d'érable Domestique du 14 octobre 2026 au début 2028. Vérifié octobre 2026.
          </p>
        </div>
      </div>

      {/* Alerte opérationnelle — fermeture Salon Feuille d'érable Domestique */}
      <section className="bg-amber-50 border-y border-amber-200">
        <div className="max-w-container-max mx-auto px-gutter py-5">
          <Link href="/blog/yvr-domestic-maple-leaf-lounge-closure-2026" className="flex items-start md:items-center gap-4 group">
            <span className="material-symbols-outlined text-amber-700 shrink-0 mt-0.5 md:mt-0" style={{ fontSize: '22px' }} aria-hidden="true">schedule</span>
            <div className="flex-1 min-w-0">
              <p className="font-label-caps text-[9px] uppercase tracking-widest text-amber-800 mb-0.5">
                Alerte opérationnelle · YVR
              </p>
              <p className="text-sm text-amber-900 leading-snug">
                <strong>Le Salon Feuille d'érable Domestique d'Air Canada ferme le 14 octobre 2026</strong> pour une rénovation complète et rouvrira au début 2028. Dernier jour 13 octobre. Alternatives : les deux Cafés Air Canada (porte C50 et porte C46) ou le Plaza Premium Pier B (Priority Pass).
              </p>
            </div>
          </Link>
        </div>
      </section>

      <div className="max-w-container-max mx-auto px-gutter py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <article className="lg:col-span-2 space-y-10">

            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">
                Les salons de YVR en un coup d'œil
              </h2>
              <p className="text-secondary leading-relaxed mb-6">
                Vancouver (YVR) possède le réseau Plaza Premium le plus complet au Canada — cinq emplacements à travers Pier B (Domestique), Pier C (Domestique outpost), Pier D (International + Plaza Premium First) et Pier E (US). Air Canada opère trois Salons Feuille d'érable (un dans chaque zone) et deux Cafés Air Canada. Les porteurs de Cathay Pacific et de SkyTeam ont également des options internationales.
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
                      <td className="p-3 border-b border-sand-dark/10"><strong className="text-primary">Plaza Premium Pier B</strong> (Gate B15)</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Domestique</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Amex Platine, Priority Pass, DragonPass, laissez-passer d'un jour</td>
                    </tr>
                    <tr className="bg-champagne-glint/10">
                      <td className="p-3 border-b border-sand-dark/10"><strong className="text-primary">Plaza Premium Pier C outpost</strong> (Gate C29)</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Domestique</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Amex Platine, Priority Pass, DragonPass</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-sand-dark/10"><strong className="text-primary">Plaza Premium Pier D International</strong></td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Internationale (ouvert 24 h)</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Amex Platine, Priority Pass, DragonPass — seul salon canadien ouvert 24 h</td>
                    </tr>
                    <tr className="bg-amber-50/60">
                      <td className="p-3 border-b border-sand-dark/10">
                        <strong className="text-primary">Plaza Premium First</strong>
                        <span className="block text-xs text-amber-700 mt-0.5">Priority Pass NON accepté</span>
                      </td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Internationale (niveau premium)</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">110 $ CAD directe (2 h), 30 $ surclassement, Amex Platine</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-sand-dark/10"><strong className="text-primary">Plaza Premium Pier E US</strong></td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Transfrontalier (après douane US)</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Amex Platine, Priority Pass, DragonPass</td>
                    </tr>
                    <tr className="bg-amber-50">
                      <td className="p-3 border-b border-sand-dark/10">
                        <strong className="text-primary">Salon Feuille d'érable Domestique</strong>
                        <span className="block text-xs text-amber-700 mt-0.5">Fermé 14 oct. 2026 – début 2028</span>
                      </td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Domestique (Pier C)</td>
                      <td className="p-3 border-b border-sand-dark/10 text-amber-700">Utilisez un Café Air Canada ou Plaza Premium Pier B pendant la rénovation</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-sand-dark/10"><strong className="text-primary">Salon Feuille d'érable International</strong></td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Internationale (Pier D)</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Cartes Aéroplan VIP TD/CIBC, Amex Aéroplan Réserve, Aéroplan 50K+, Classe Affaires AC</td>
                    </tr>
                    <tr className="bg-champagne-glint/10">
                      <td className="p-3 border-b border-sand-dark/10"><strong className="text-primary">Salon Feuille d'érable Transfrontalier</strong></td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Transfrontalier (Pier E)</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Même accès que International — pas Priority Pass</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-sand-dark/10"><strong className="text-primary">Salon Cathay Pacific</strong> (Pier D)</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Internationale</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Billet Classe Affaires Cathay, Oneworld Sapphire+, Marco Polo Silver+</td>
                    </tr>
                    <tr className="bg-champagne-glint/10">
                      <td className="p-3 border-b border-sand-dark/10"><strong className="text-primary">Salon SkyTeam</strong> (Pier D)</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Internationale uniquement</td>
                      <td className="p-3 border-b border-sand-dark/10 text-secondary">Priority Pass, DragonPass, SkyTeam Élite Plus, Classe Affaires SkyTeam</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-champagne-glint/30 border-l-4 border-sand-dark p-6">
              <h3 className="font-label-caps text-label-caps text-primary mb-3">Guide d'accès YVR</h3>
              <p className="text-sm text-secondary leading-relaxed">
                Les départs internationaux se trouvent dans le terminal principal, Pier D. Les piers domestiques et américains ont leurs propres installations Air Canada. La plupart des Plaza Premium acceptent Priority Pass et DragonPass. Confirmez l'admissibilité de votre carte avant de voyager. Pour la fermeture du Salon Feuille d'érable Domestique :{' '}
                <Link href="/blog/yvr-domestic-maple-leaf-lounge-closure-2026" className="underline font-semibold text-primary">
                  guide complet de la fermeture YVR (en anglais)
                </Link>.
              </p>
            </section>

            {lounges && lounges.length > 0 && (
              <section>
                <h2 className="font-headline-md text-headline-md text-primary mb-4">
                  Tous les salons actuellement en service
                </h2>
                <ul className="divide-y divide-outline-variant/20 bg-white border border-outline-variant/30">
                  {lounges.map(l => (
                    <li key={l.id} className="p-5 flex items-start justify-between gap-4 hover:bg-champagne-glint/20 transition-colors">
                      <div className="min-w-0">
                        <Link href={`/airports/YVR/lounges/${l.slug}`} className="font-semibold text-primary hover:underline">
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
                  Note : les pages détaillées des salons sont actuellement en anglais seulement.
                </p>
              </section>
            )}

            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-4">Questions fréquentes</h2>
              <div className="space-y-4">
                <details className="group bg-white border border-outline-variant/30 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer p-5 font-semibold text-primary flex items-start justify-between gap-4 hover:bg-champagne-glint/30 transition-colors">
                    <span className="leading-snug">Combien de salons l'aéroport de Vancouver (YVR) compte-t-il ?</span>
                    <span className="material-symbols-outlined text-sand-dark shrink-0 group-open:rotate-180 transition-transform" style={{ fontSize: '20px' }}>expand_more</span>
                  </summary>
                  <div className="px-5 pb-5 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant/20 pt-4">
                    Dix salons distincts — cinq Plaza Premium (Pier B Domestique, Pier C outpost, Pier D International 24 h, Plaza Premium First, Pier E US), trois Salons Feuille d'érable Air Canada (International, Domestique en fermeture pour rénovation, Transfrontalier), le Salon Cathay Pacific et le Salon SkyTeam.
                  </div>
                </details>

                <details className="group bg-white border border-outline-variant/30 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer p-5 font-semibold text-primary flex items-start justify-between gap-4 hover:bg-champagne-glint/30 transition-colors">
                    <span className="leading-snug">Le Salon Feuille d'érable Domestique à YVR ferme-t-il ?</span>
                    <span className="material-symbols-outlined text-sand-dark shrink-0 group-open:rotate-180 transition-transform" style={{ fontSize: '20px' }}>expand_more</span>
                  </summary>
                  <div className="px-5 pb-5 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant/20 pt-4">
                    Oui. Le Salon Feuille d'érable Domestique d'Air Canada à YVR ferme pour une rénovation majeure du 14 octobre 2026 jusqu'au début de 2028. Dernier jour pour les clients : 13 octobre 2026. Pendant la fermeture, les voyageurs admissibles peuvent utiliser les deux Cafés Air Canada à YVR. Détails complets dans notre <Link href="/blog/yvr-domestic-maple-leaf-lounge-closure-2026" className="underline">guide de la fermeture YVR</Link>.
                  </div>
                </details>

                <details className="group bg-white border border-outline-variant/30 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer p-5 font-semibold text-primary flex items-start justify-between gap-4 hover:bg-champagne-glint/30 transition-colors">
                    <span className="leading-snug">Quelle est la meilleure carte de crédit pour les salons de YVR ?</span>
                    <span className="material-symbols-outlined text-sand-dark shrink-0 group-open:rotate-180 transition-transform" style={{ fontSize: '20px' }}>expand_more</span>
                  </summary>
                  <div className="px-5 pb-5 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant/20 pt-4">
                    L'<a href="https://www.finlywealth.com/credit-cards/reviews/amex-platinum" target="_blank" rel="sponsored nofollow noopener" className="underline">Amex Platine</a> à 799 $ pour la couverture la plus large — entrée directe aux cinq Plaza Premium et Priority Pass pour SkyTeam et Cathay. Pour les fidèles d'Air Canada, les cartes Aéroplan VIP <a href="https://www.finlywealth.com/credit-cards/reviews/cibc-aeroplan-visa-infinite-privilege" target="_blank" rel="sponsored nofollow noopener" className="underline">CIBC</a> ou <a href="https://www.finlywealth.com/credit-cards/reviews/amex-aeroplan-reserve" target="_blank" rel="sponsored nofollow noopener" className="underline">Amex Aéroplan Réserve</a> ouvrent les Salons Feuille d'érable International et Transfrontalier.
                  </div>
                </details>

                <details className="group bg-white border border-outline-variant/30 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer p-5 font-semibold text-primary flex items-start justify-between gap-4 hover:bg-champagne-glint/30 transition-colors">
                    <span className="leading-snug">Est-ce que Priority Pass fonctionne au Plaza Premium First à YVR ?</span>
                    <span className="material-symbols-outlined text-sand-dark shrink-0 group-open:rotate-180 transition-transform" style={{ fontSize: '20px' }}>expand_more</span>
                  </summary>
                  <div className="px-5 pb-5 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant/20 pt-4">
                    Non — Plaza Premium First à YVR n'accepte PAS Priority Pass. L'entrée directe coûte 110 $ CAD pour un séjour de 2 heures, ou vous pouvez surclasser depuis le Plaza Premium International voisin pour 30 $. L'<a href="https://www.finlywealth.com/credit-cards/reviews/amex-platinum" target="_blank" rel="sponsored nofollow noopener" className="underline">Amex Platine</a> donne accès via son avantage de carte direct.
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
                Cartes qui ouvrent les salons de YVR
              </h5>
              <p className="text-sm text-secondary mb-4 leading-relaxed">
                Comparez les cartes avec accès Plaza Premium (direct ou Priority Pass), DragonPass et Salon Feuille d'érable à Vancouver.
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

            {/* TuGo — bannière française pour l'assurance voyage */}
            <TugoBannerAd locale="fr" />

            <div className="bg-white fine-border p-5">
              <h3 className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest mb-4">
                Lectures recommandées
              </h3>
              <div className="space-y-2">
                <Link href={EN_URL} hrefLang="en-CA" className="flex items-center justify-between text-sm text-secondary hover:text-primary py-1.5 border-b border-outline-variant/20 transition-colors group">
                  English edition of this hub
                  <span className="material-symbols-outlined text-sand-dark group-hover:text-primary transition-colors" style={{ fontSize: '14px' }}>language</span>
                </Link>
                <Link href="/fr/airports/YUL" className="flex items-center justify-between text-sm text-secondary hover:text-primary py-1.5 border-b border-outline-variant/20 transition-colors group">
                  Salons de l'aéroport de Montréal (YUL)
                  <span className="material-symbols-outlined text-sand-dark group-hover:text-primary transition-colors" style={{ fontSize: '14px' }}>arrow_forward</span>
                </Link>
                <Link href="/fr/airports/YYZ" className="flex items-center justify-between text-sm text-secondary hover:text-primary py-1.5 border-b border-outline-variant/20 transition-colors group">
                  Salons de l'aéroport de Toronto (YYZ)
                  <span className="material-symbols-outlined text-sand-dark group-hover:text-primary transition-colors" style={{ fontSize: '14px' }}>arrow_forward</span>
                </Link>
                <Link href="/airports" className="flex items-center justify-between text-sm text-secondary hover:text-primary py-1.5 last:border-0 transition-colors group">
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
