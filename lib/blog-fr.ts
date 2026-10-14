// French-Canadian blog posts. Separate file from lib/blog.ts so the English
// blogPosts array stays untouched and the two locales can diverge independently.
// A FR post keyed by the same slug as its EN counterpart is a translation; the
// FR/EN switcher in the article template uses that match to show the link.
import type { BlogPost } from './blog'

const yulLoungeAccessContentFr = `
<p data-speakable="intro"><strong>Six salons sont en opération à l'aéroport Montréal-Trudeau (YUL) et chacun a ses propres règles d'accès par carte ou par statut. Pour un voyageur montréalais qui prend l'avion deux ou trois fois par année, la <a href="https://www.finlywealth.com/credit-cards/reviews/national-bank-world-elite-mastercard" target="_blank" rel="sponsored nofollow noopener">Mastercard Mondiale Élite Banque Nationale</a> (150 $) est la carte de salon offrant le meilleur rapport qualité-prix au Canada — accès illimité au Salon Banque Nationale pour le titulaire principal avec un invité et deux enfants. Pour les voyageurs internationaux qui veulent des options à chaque aéroport canadien, la <a href="https://www.finlywealth.com/credit-cards/reviews/amex-platinum" target="_blank" rel="sponsored nofollow noopener">Carte Platine American Express</a> (799 $) demeure la plus forte — Priority Pass, Plaza Premium et Aspire. Pour les habitués d'Air Canada, la <a href="https://www.finlywealth.com/credit-cards/reviews/amex-aeroplan-reserve" target="_blank" rel="sponsored nofollow noopener">Carte Aéroplan Réserve American Express</a> (599 $) est la seule carte canadienne qui combine l'accès au Salon Feuille d'érable avec Priority Pass. Note opérationnelle : le Salon Banque Nationale a été déplacé dans un espace temporaire à capacité réduite près de la porte 53 le 5 octobre 2026 et y restera jusqu'à la réouverture du salon rénové en juin 2028, avec une limite de séjour de 2 heures.</strong></p>

<blockquote>
<p><strong>Divulgation éditoriale :</strong> AirportLounges.ca peut recevoir une compensation si vous faites une demande de carte via les liens de cette page. Cela n'affecte pas les conditions de l'émetteur ni le prix que vous payez. Les faits sur les cartes et les règles d'accès aux salons ont été vérifiés par rapport aux pages des émetteurs, à l'avis de la Banque Nationale et à l'article de Milesopedia d'octobre 2026, le 13 octobre 2026.</p>
</blockquote>

<h2>Tous les salons à YUL et la carte qui vous y donne accès</h2>

<table>
  <thead>
    <tr><th>Salon</th><th>Zone</th><th>Accès direct par carte</th><th>Réseaux d'adhésion</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Salon Banque Nationale</strong> (près de la porte 53, espace temporaire oct. 2026 – juin 2028)</td><td>International</td><td>Mastercard Mondiale Élite Banque Nationale (illimité, +1 invité, +2 enfants)</td><td>L'acceptation de Priority Pass au salon temporaire n'est pas confirmée dans les avis de l'opérateur — à vérifier dans l'application Priority Pass avant de vous y rendre</td></tr>
    <tr><td><strong>Salon International Aspire</strong> (portes 52-53)</td><td>International</td><td>Amex Platine, Business Platine (entrée directe)</td><td>Priority Pass, DragonPass, DreamFolks, laissez-passer d'un jour à l'entrée</td></tr>
    <tr><td><strong>Salon American Express Aspire</strong> (portes 1-2, ouvert en juillet 2025)</td><td>Domestique</td><td>Amex Platine, Business Platine (entrée directe)</td><td>Priority Pass, DragonPass, DreamFolks, laissez-passer d'un jour à l'entrée</td></tr>
    <tr><td><strong>Salon Air France – KLM par Plaza Premium</strong> (portes 55-57)</td><td>International</td><td>Billet Classe Affaires Air France / KLM uniquement ; fermé à Priority Pass de 15 h 30 à 18 h 30 chaque jour</td><td>Priority Pass en dehors de la plage AF/KL — téléphonez à l'avance</td></tr>
    <tr><td><strong>Salon Odyssée Desjardins</strong> par Plaza Premium (au-dessus de la porte 81)</td><td>Transfrontalier (États-Unis)</td><td>Visa Infinite Odyssée Desjardins (directe), <a href="https://www.finlywealth.com/credit-cards/reviews/amex-platinum" target="_blank" rel="sponsored nofollow noopener">Amex Platine</a></td><td>Priority Pass, DragonPass, laissez-passer d'un jour (4 h 30 – 20 h 30, séjour 2 h)</td></tr>
    <tr><td><strong>Salon Feuille d'érable Air Canada</strong> (porte 53 international, portes 1-2 domestique, portes 73-74 transfrontalier)</td><td>Les trois zones</td><td><a href="https://www.finlywealth.com/credit-cards/reviews/td-aeroplan-visa-infinite-privilege" target="_blank" rel="sponsored nofollow noopener">Visa Infinite Privilège Aéroplan TD</a>, <a href="https://www.finlywealth.com/credit-cards/reviews/cibc-aeroplan-visa-infinite-privilege" target="_blank" rel="sponsored nofollow noopener">Visa Infinite Privilège Aéroplan CIBC</a>, <a href="https://www.finlywealth.com/credit-cards/reviews/amex-aeroplan-reserve" target="_blank" rel="sponsored nofollow noopener">Amex Aéroplan Réserve</a></td><td>Non admissible à Priority Pass ; Aéroplan 50K+, Star Alliance Gold ou billet Classe Affaires</td></tr>
    <tr><td><strong>Café Air Canada</strong> — Domestique (porte A2, depuis mars 2025) et Transfrontalier (portes 73-74, depuis mars 2026)</td><td>Domestique + Transfrontalier</td><td>Même accès que le Salon Feuille d'érable</td><td>Non admissible à Priority Pass ; entrée eGate, pas de comptoir d'enregistrement</td></tr>
  </tbody>
</table>

<p>Sept espaces distincts à travers trois zones. Celui qui s'applique à vous dépend d'où vous volez, à quelle fréquence et quelle carte est déjà dans votre portefeuille.</p>

<h2>Les six cartes à considérer pour YUL</h2>

<h3>1. Mastercard Mondiale Élite Banque Nationale — 150 $</h3>

<p>C'est la seule meilleure carte de salon au Canada si votre aéroport d'attache est YUL et que la plupart de vos vols sont internationaux. Le <a href="/airports/YUL/lounges/national-bank-lounge-yul">Salon Banque Nationale</a> est le seul salon à marque privée de Montréal, et c'est la seule carte qui l'ouvre sans frais supplémentaires. Le titulaire principal, un invité et deux enfants accompagnateurs entrent gratuitement. Les titulaires secondaires bénéficient aussi d'un accès gratuit avec la même règle +1+2.</p>

<p>Mise en garde actuelle : depuis le 5 octobre 2026, le salon fonctionne dans un espace temporaire à capacité réduite (même emplacement près de la porte 53) avec une limite de séjour de 2 heures, jusqu'à la réouverture du salon rénové en juin 2028. Les clients de la Banque Privée 1859 Banque Nationale bénéficient d'une limite de 3 heures.</p>

<ul>
  <li><strong>Frais annuels :</strong> 150 $ (standard 150 $ ; souvent en promotion à 0 $ la première année)</li>
  <li><strong>Revenu minimum :</strong> 80 000 $ personnel / 150 000 $ ménage</li>
  <li><strong>Accès au salon :</strong> Salon Banque Nationale illimité à YUL ; inclut également une adhésion DragonPass avec 4 visites par année</li>
  <li><strong>À qui elle convient :</strong> voyageurs internationaux basés à Montréal ; résidents du Québec ; toute personne ayant une relation bancaire avec la Banque Nationale</li>
</ul>

<h3>2. Carte Platine American Express — 799 $</h3>

<p>La carte à la couverture la plus large. À YUL seulement, <a href="https://www.finlywealth.com/credit-cards/reviews/amex-platinum" target="_blank" rel="sponsored nofollow noopener">la Carte Platine American Express</a> vous donne accès aux deux salons Aspire (International et Domestique), au Salon Odyssée Desjardins par le biais de son avantage Priority Pass, et au Salon Air France – KLM en dehors de la plage 15 h 30 – 18 h 30. À travers le Canada, elle ajoute l'entrée directe Plaza Premium, l'accès Centurion lors de voyages aux États-Unis et la plupart des salons non reliés à une compagnie aérienne dans le monde.</p>

<p>À partir du 1er janvier 2027, les deux réseaux les plus utilisés (Priority Pass et Plaza Premium) seront plafonnés à 6 + 6 visites par année, à moins de 20 000 $ de dépenses sur le compte. Aspire n'est pas plafonné — un véritable avantage pour les voyageurs basés à Montréal puisque YUL compte deux salons Aspire.</p>

<ul>
  <li><strong>Frais annuels :</strong> 799 $ (net ~399 $ après les crédits de 200 $ voyage et 200 $ restauration)</li>
  <li><strong>Accès au salon :</strong> Global Lounge Collection — 1 550+ salons à travers Priority Pass, Plaza Premium, Aspire, Centurion, Delta Sky Club, Lufthansa (prend fin le 1er octobre 2026)</li>
</ul>

<h3>3. Amex Aéroplan Réserve — 599 $</h3>

<p>La seule carte canadienne qui combine une adhésion Priority Pass Select avec l'accès au Salon Feuille d'érable. Attention : chaque visite Priority Pass est facturée à votre carte au tarif en vigueur (environ 35 $ US) — les frais d'adhésion sont annulés, mais les visites ne le sont pas. Pour un voyageur YUL qui vole régulièrement avec Air Canada, l'accès au Salon Feuille d'érable est la vraie valeur.</p>

<h3>4. Platine American Express Scotiabank — 399 $</h3>

<p>L'option intermédiaire sous-couverte. Priority Pass avec 10 visites par année pour le titulaire principal et 4 pour un titulaire supplémentaire, aucun frais de transaction étrangère, et environ la moitié du coût de l'Amex Platine. Pour un voyageur montréalais qui fait 2 à 4 voyages internationaux par année, c'est suffisant.</p>

<h3>5. Visa Infinite Privilège Aéroplan TD ou CIBC — 599 $</h3>

<p>Les deux ouvrent les Salons Feuille d'érable (et les Cafés Air Canada) au Canada et aux États-Unis, plus six visites Visa Compagnon Aéroport (DragonPass) par année. <a href="https://www.finlywealth.com/credit-cards/reviews/cibc-aeroplan-visa-infinite-privilege" target="_blank" rel="sponsored nofollow noopener">CIBC</a> devance <a href="https://www.finlywealth.com/credit-cards/reviews/td-aeroplan-visa-infinite-privilege" target="_blank" rel="sponsored nofollow noopener">TD</a> sur le coût de la carte supplémentaire (149 $ contre 199 $). Une mise en garde : les deux émetteurs confirment l'avantage à un invité jusqu'au 31 décembre 2026 seulement — la politique de 2027 n'est pas annoncée.</p>

<h3>6. Visa Infinite Passeport Scotiabank — 150 $</h3>

<p>Le choix économique. Six visites DragonPass par année, aucun frais de transaction étrangère, et souvent la première année offerte. À YUL, elle couvre les deux salons Aspire et le Salon Odyssée Desjardins transfrontalier.</p>

<h2>Choisir la bonne carte selon votre situation</h2>

<table>
  <thead>
    <tr><th>Votre situation</th><th>Meilleure carte</th><th>Pourquoi</th></tr>
  </thead>
  <tbody>
    <tr><td>Basé à Montréal, 2-6 voyages internationaux/année, souvent en famille</td><td><a href="https://www.finlywealth.com/credit-cards/reviews/national-bank-world-elite-mastercard" target="_blank" rel="sponsored nofollow noopener">Mastercard Mondiale Élite Banque Nationale</a></td><td>Seulement 150 $. Accès illimité au Salon Banque Nationale avec +1 invité +2 enfants. Inclut DragonPass pour les autres salons.</td></tr>
    <tr><td>Voyageur fréquent sur plusieurs compagnies aériennes et aéroports</td><td><a href="https://www.finlywealth.com/credit-cards/reviews/amex-platinum" target="_blank" rel="sponsored nofollow noopener">Amex Platine</a></td><td>Couvre les deux salons Aspire + Odyssée Desjardins + salon Air France + couverture mondiale. Attention au plafond de 2027.</td></tr>
    <tr><td>Fidèle à Air Canada (Aéroplan 50K+ ou Classe Affaires)</td><td><a href="https://www.finlywealth.com/credit-cards/reviews/amex-aeroplan-reserve" target="_blank" rel="sponsored nofollow noopener">Amex Aéroplan Réserve</a></td><td>Seule carte qui ouvre le Salon Feuille d'érable ET combine Priority Pass.</td></tr>
    <tr><td>Voyageur occasionnel (2-4 voyages/année), veut Priority Pass</td><td><a href="https://www.finlywealth.com/credit-cards/reviews/scotia-passport-visa-infinite" target="_blank" rel="sponsored nofollow noopener">Platine American Express Scotiabank</a></td><td>399 $ avec 10 visites Priority Pass incluses.</td></tr>
    <tr><td>Vous voulez simplement la carte la moins chère avec un accès au salon</td><td><a href="https://www.finlywealth.com/credit-cards/reviews/scotia-passport-visa-infinite" target="_blank" rel="sponsored nofollow noopener">Visa Infinite Passeport Scotiabank</a></td><td>150 $ (souvent 0 $ la première année). 6 visites DragonPass couvrent les deux Aspire de YUL et le salon transfrontalier.</td></tr>
  </tbody>
</table>

<h2>Questions fréquentes</h2>

<h3>Quelle est la meilleure carte de crédit pour accéder aux salons de l'aéroport de Montréal (YUL) ?</h3>
<p>Pour les voyageurs basés à Montréal qui font quelques voyages internationaux par année, la <a href="https://www.finlywealth.com/credit-cards/reviews/national-bank-world-elite-mastercard" target="_blank" rel="sponsored nofollow noopener">Mastercard Mondiale Élite Banque Nationale</a> à 150 $ est inégalée. C'est la seule carte canadienne qui ouvre le Salon Banque Nationale à YUL — visites illimitées pour le titulaire principal, un invité et deux enfants de moins de 12 ans.</p>

<h3>Combien de salons l'aéroport Montréal-Trudeau compte-t-il ?</h3>
<p>Sept espaces distincts à travers trois zones : le Salon Banque Nationale (international, espace temporaire), le Salon International Aspire, le Salon American Express Aspire (domestique, ouvert en juillet 2025), le Salon Air France-KLM par Plaza Premium, le Salon Odyssée Desjardins (transfrontalier), les trois Salons Feuille d'érable Air Canada, et les deux Cafés Air Canada.</p>

<h3>Est-ce que Priority Pass fonctionne au Salon Banque Nationale à YUL en ce moment ?</h3>
<p>L'acceptation de Priority Pass au Salon Banque Nationale temporaire (en opération depuis le 5 octobre 2026) n'est pas confirmée dans les avis de l'opérateur en date du 13 octobre 2026. À vérifier dans l'application Priority Pass avant de vous y rendre.</p>

<h3>Puis-je entrer dans un salon à YUL sans carte de crédit ?</h3>
<p>Oui, aux salons Aspire (International et Domestique) et au Salon Odyssée Desjardins. Les laissez-passer d'un jour à l'entrée se situent entre environ 55 $ et 75 $ CAD pour un séjour de 3 heures.</p>

<h2>Sources</h2>
<ul>
  <li><a href="https://milesopedia.com/en/news/airports/national-bank-lounge-yul-renovation/">Milesopedia — Salon Banque Nationale à YUL : rénovation et salon temporaire</a>.</li>
  <li>Banque Nationale du Canada — Salon Banque Nationale à l'aéroport de Montréal et conditions de la Mastercard Mondiale Élite.</li>
  <li>American Express Canada — Carte Platine et conditions d'accès au salon Aéroplan Réserve.</li>
  <li>AirportLounges.ca — <a href="/airports/YUL">Guide des salons de l'aéroport YUL de Montréal</a>, <a href="/blog/best-credit-card-montreal-yul-airport-lounge-access">Best Credit Card for Montreal (YUL) Airport Lounge Access (version anglaise)</a>.</li>
</ul>

<p><em>Tous les faits et règles d'accès de cette page reflètent les informations en vigueur au 13 octobre 2026. Les règles changent sans préavis — toujours confirmer auprès de l'émetteur et de l'opérateur du salon avant de voyager.</em></p>
`

export const blogPostsFr: BlogPost[] = [
  {
    slug: 'best-credit-card-montreal-yul-airport-lounge-access',
    title: 'Meilleure carte de crédit pour accéder aux salons de l\'aéroport de Montréal (YUL) en 2026',
    excerpt:
      'La Mastercard Mondiale Élite Banque Nationale est la meilleure carte-salon au Canada pour les voyageurs montréalais. L\'Amex Platine gagne pour la couverture mondiale ; l\'Amex Aéroplan Réserve pour les habitués d\'Air Canada. Chaque salon de YUL mis en correspondance avec la carte qui l\'ouvre. Vérifié le 13 octobre 2026.',
    coverImage: '/blog/yul-montreal-lounge-hero.png',
    publishedAt: '2026-10-13',
    lastReviewed: '2026-10-13',
    category: 'Cartes de crédit',
    readingTime: '10 min de lecture',
    metaTitle: 'Meilleure carte de crédit pour les salons de Montréal (YUL) 2026',
    metaDescription:
      'Chaque salon de l\'aéroport Montréal-Trudeau (YUL) mis en correspondance avec la carte qui l\'ouvre — Mastercard Mondiale Élite Banque Nationale, Amex Platine, Aéroplan Réserve, Platine Amex Scotiabank, Visa Infinite Privilège Aéroplan TD et CIBC. Inclut la mise à jour de la rénovation du Salon Banque Nationale d\'octobre 2026.',
    content: yulLoungeAccessContentFr,
    authorName: 'Équipe éditoriale AirportLounges.ca',
    authorBio:
      'Règles d\'accès aux salons de YUL vérifiées auprès des pages des émetteurs Banque Nationale, Aspire, Plaza Premium et Air Canada ainsi que du reportage de Milesopedia d\'octobre 2026 sur la rénovation du Salon Banque Nationale. Prochaine révision prévue : mai 2028, avant la réouverture du Salon Banque Nationale rénové.',
  },
]

export function getPostFr(slug: string): BlogPost | undefined {
  return blogPostsFr.find(p => p.slug === slug)
}

export function getAllPostsFr(): BlogPost[] {
  return [...blogPostsFr].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

/** EN slugs that have a FR translation. Used for hreflang + language switcher. */
export const SLUGS_WITH_FR = new Set(blogPostsFr.map(p => p.slug))
