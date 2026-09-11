export interface BlogPostFAQ {
  question: string
  answer: string
}

/**
 * Primary affiliate CTA rendered at the top and bottom of the post.
 * `affiliateKey` matches a key in `lib/affiliates.ts` — the render layer
 * calls `affiliate(key)` to produce the tracked URL, so IDs / UTM tagging
 * are centralized rather than embedded in the post body.
 */
export interface BlogPostCta {
  heading: string
  subheading: string
  ctaLabel: string
  affiliateKey: string
}

/**
 * Comparison-cards module for multi-card posts (Aeroplan comparison, best-of
 * lists). Rendered inline near the top of the article. Each card links
 * through the affiliate registry.
 */
export interface BlogPostComparisonCard {
  name: string
  annualFee: string
  highlight: string
  affiliateKey: string
  ctaLabel?: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  coverImage: string
  publishedAt: string
  /** ISO date of the last editorial review; falls back to publishedAt when absent. Used for schema.org dateModified + visible "Last reviewed" byline. */
  lastReviewed?: string
  category: string
  readingTime: string
  metaTitle: string
  metaDescription: string
  content: string
  /** Structured Q&A rendered as an FAQPage schema block + optional visible FAQ section. Feeds Google's PAA and AI Overview citations. */
  faqs?: BlogPostFAQ[]
  /** Optional word count for schema.org Article.wordCount; auto-calculated from content if omitted. */
  wordCount?: number
  /** Byline shown to readers; defaults to "AirportLounges.ca Editorial Team". */
  authorName?: string
  /** Short author bio for the visible byline block. */
  authorBio?: string
  /** Primary affiliate CTA rendered at the top + bottom of the article. */
  primaryCta?: BlogPostCta
  /** Comparison-card module rendered near the top of the article (below byline). */
  comparisonCards?: BlogPostComparisonCard[]
}

const priorityPassContent = `
<p><strong>Every airport. Every lounge. What to expect — and how to avoid being turned away at the door.</strong></p>

<p>If you carry a premium Canadian travel credit card or hold a Priority Pass membership, you have access to some of the best airport lounges in Canada. Free food and drinks, fast Wi-Fi, real seating — it beats standing at a crowded gate every time.</p>

<p>But Priority Pass in Canada does not work the same way at every airport. The lounge you can use depends on which airport you are at, which terminal, and whether you are flying domestic, to the US, or internationally. Walk into the wrong one and staff will turn you away at the door.</p>

<p>This guide covers every Priority Pass lounge in Canada — airport by airport, what each one offers, peak hours to avoid, and how to bring a guest.</p>

<h2>What Is Priority Pass?</h2>

<p>Priority Pass is the world's largest independent airport lounge program, with over 1,600 lounges in more than 140 countries. In Canada, there are two ways to get access.</p>

<p><em>Direct membership</em> is purchased straight from Priority Pass in three tiers: Standard, Standard Plus, and Prestige. Each tier includes a set number of complimentary visits per year, with additional visits and guests charged a flat fee.</p>

<p><em>Credit card membership</em> is bundled as a benefit on many Canadian premium travel cards — the American Express Platinum, the CIBC Aventura Visa Infinite Privilege, the TD First Class Travel Visa Infinite, and the Scotiabank Passport Visa Infinite among them. Guest rules and included visits vary by card, not just by tier.</p>

<p>To enter any lounge, show your Priority Pass card or app alongside a same-day boarding pass. That is it — as long as the lounge is not at capacity.</p>

<blockquote>
<p>Priority Pass does not guarantee entry. Lounges can and do restrict access when they hit capacity. At busy hub airports during peak departure windows, you can be turned away even with a valid membership. Arriving early is the only reliable fix.</p>
</blockquote>

<figure>
  <img src="/blog/guide-priority-pass-canada.png" alt="Priority Pass airport lounge interior in Canada" loading="lazy" />
  <figcaption>Priority Pass gives cardholders access to lounges at nine Canadian airports</figcaption>
</figure>

<h2>Every Priority Pass Lounge in Canada — Quick Reference (2026)</h2>

<p>Nine Canadian airports currently participate in Priority Pass. Here is the full list at a glance.</p>

<table>
  <thead>
    <tr>
      <th>Airport</th>
      <th>Code</th>
      <th>Priority Pass Lounges and Key Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Toronto Pearson International</td>
      <td>YYZ</td>
      <td>6 Plaza Premium locations across T1 and T3 — Domestic, US Transborder, and International in each terminal. Be Relax Spa (T1) also accepts Priority Pass as a spa credit. US Transborder lounge is past customs — visit before clearing the border.</td>
    </tr>
    <tr>
      <td>Toronto Billy Bishop City Airport</td>
      <td>YTZ</td>
      <td>Aspire Lounge / Air Canada Café. Domestic departures only. Great option for Porter and regional Air Canada flights from downtown Toronto.</td>
    </tr>
    <tr>
      <td>Vancouver International</td>
      <td>YVR</td>
      <td>SkyTeam Lounge (International Terminal) — one of the top-rated Priority Pass lounges in the world. Plus Plaza Premium for Domestic (Pier C), International, and US Transborder. Each lounge is terminal-specific.</td>
    </tr>
    <tr>
      <td>Calgary International</td>
      <td>YYC</td>
      <td>WestJet Elevation Lounge (Concourse B/C), Aspire Lounge International (Concourse D), Aspire Lounge US Transborder (Concourse E). Elevation fills up during peak WestJet morning banks.</td>
    </tr>
    <tr>
      <td>Montréal-Trudeau International</td>
      <td>YUL</td>
      <td>National Bank Lounge and Air France Lounge by Plaza Premium — both International departures only. Domestic and US flyers may only qualify for a dining credit depending on their membership tier.</td>
    </tr>
    <tr>
      <td>Ottawa Macdonald-Cartier</td>
      <td>YOW</td>
      <td>Aspire Salon Lounge — covers Domestic and International departures. Confirm hours in the app before arriving.</td>
    </tr>
    <tr>
      <td>Edmonton International</td>
      <td>YEG</td>
      <td>Plaza Premium Lounge (Domestic and International) and Plaza Premium Lounge (US Transborder). US Transborder lounge is past customs — use it before clearing the border.</td>
    </tr>
    <tr>
      <td>Winnipeg James Armstrong Richardson</td>
      <td>YWG</td>
      <td>Plaza Premium Lounge just past the main security checkpoint. Domestic and International departures only — not available for US Transborder flights.</td>
    </tr>
    <tr>
      <td>Québec City Jean Lesage</td>
      <td>YQB</td>
      <td>V.I.P. Lounge by Club Med. Beautifully designed but lighter on food — cold snacks rather than a full buffet. Domestic and International departures.</td>
    </tr>
  </tbody>
</table>

<h2>Airport-by-Airport Priority Pass Lounge Guide</h2>

<h3>Toronto Pearson International Airport (YYZ)</h3>

<p>Pearson has the largest Priority Pass lounge network in Canada. Whether you are flying domestic, across the border, or overseas, there is a dedicated Plaza Premium lounge for your terminal and flight type.</p>

<p>Terminal 1 has three lounges — Domestic, International, and US Transborder — plus the Be Relax Spa option for members who prefer a treatment credit over a traditional lounge. Terminal 3 mirrors that with its own Domestic, International, and US Transborder Plaza Premium lounges.</p>

<blockquote>
<p>Once you clear US Customs for a transborder flight at Pearson, you cannot go back to a domestic or international lounge. Head to the US Transborder lounge before you pass through customs — every time, no exceptions.</p>
</blockquote>

<figure>
  <img src="/blog/plaza-premium-yyz.png" alt="Plaza Premium Lounge at Toronto Pearson Airport (YYZ)" loading="lazy" />
  <figcaption>Plaza Premium Lounge, Toronto Pearson — available across both Terminal 1 and Terminal 3</figcaption>
</figure>

<h3>Toronto Billy Bishop City Airport (YTZ)</h3>

<p>Billy Bishop is the downtown Toronto option for short-haul flying and is often overlooked by Priority Pass holders. The Aspire Lounge here is a newer, well-designed space. If you are flying Porter or regional Air Canada and want to avoid the Pearson experience entirely, this is a solid choice.</p>

<h3>Vancouver International Airport (YVR)</h3>

<p>Vancouver is one of the best Priority Pass airports in the entire world, not just in Canada. If you are travelling internationally through YVR, the lounge experience here is genuinely worth arriving early for.</p>

<p>The SkyTeam Lounge in the International Terminal is the standout. Made-to-order noodle stations, local BC craft beer on tap, and wide runway views. It is consistently rated among the top Priority Pass lounges globally — plan to arrive at least 90 minutes before your flight to use it properly. Plaza Premium covers Domestic (Pier C), International, and US Transborder, each in its own terminal area.</p>

<p>Confirm which lounge matches your departure concourse before heading through security. They are not interchangeable.</p>

<figure>
  <img src="/blog/skyteam-lounge-yvr.png" alt="SkyTeam Lounge at Vancouver International Airport (YVR)" loading="lazy" />
  <figcaption>The SkyTeam Lounge at YVR is consistently ranked among the best Priority Pass lounges in the world</figcaption>
</figure>

<h3>Calgary International Airport (YYC)</h3>

<p>Calgary has Priority Pass coverage across all three departure types, but which lounge you use depends entirely on your concourse. Getting this wrong is the most common mistake at YYC.</p>

<p>The WestJet Elevation Lounge on Concourse B/C covers domestic and some international departures. It is popular and can hit capacity during peak WestJet morning banks. Flying later in the day is considerably quieter. The Aspire Lounge International on Concourse D is the better option for international flights and tends to be calmer. The Aspire Lounge US Transborder on Concourse E is past US Customs — visit it before you clear the border.</p>

<figure>
  <img src="/blog/lounge-calgary-yyc.png" alt="Priority Pass lounge at Calgary International Airport (YYC)" loading="lazy" />
  <figcaption>Calgary International has three separate Priority Pass lounges — one per concourse</figcaption>
</figure>

<h3>Montréal-Trudeau International Airport (YUL)</h3>

<p>Montréal is the one Canadian airport where Priority Pass lounge access has a real limitation worth knowing before you fly. Both full lounges are in the international wing. If you are flying domestic or to the US, you may only qualify for a dining credit at a participating restaurant — that depends on your card or membership tier, and it is a different experience from a real lounge.</p>

<p>The National Bank Lounge covers international and non-US departures. It is one of the better Priority Pass lounges in eastern Canada and allows up to seven guests per cardholder, with fees applying. The Air France Lounge operated by Plaza Premium is also international-only. Official peak hours run daily from 3:00 p.m. to 6:00 p.m. — access may be restricted during this window.</p>

<blockquote>
<p>Flying domestic or connecting through YUL on a US-bound flight? Open the Priority Pass app and search your terminal before heading to the gate. Some membership tiers include a dining credit at participating restaurants — not a lounge, but worth using if it is available.</p>
</blockquote>

<h3>Ottawa Macdonald-Cartier International Airport (YOW)</h3>

<p>Ottawa has one Priority Pass option: the Aspire Salon Lounge, which covers both domestic and international departures. It is a comfortable, well-regarded space. Hours can vary at smaller airports, so check the Priority Pass app the day of your flight.</p>

<h3>Edmonton International Airport (YEG)</h3>

<p>Edmonton has two Plaza Premium lounges covering every departure type. The main lounge serves domestic and international passengers. A separate lounge handles US Transborder departures and is located past US Customs — use it before you clear the border or you will not be able to access it.</p>

<figure>
  <img src="/blog/plaza-premium-general.png" alt="Plaza Premium Lounge at Edmonton International Airport (YEG)" loading="lazy" />
  <figcaption>Plaza Premium Lounge, Edmonton International — domestic, international, and US transborder covered</figcaption>
</figure>

<h3>Winnipeg James Armstrong Richardson International Airport (YWG)</h3>

<p>The Plaza Premium Lounge at Winnipeg sits right past the main security checkpoint — easy to find and a clean, quiet space. It is available for domestic and international departures. It does not serve US Transborder passengers.</p>

<h3>Québec City Jean Lesage International Airport (YQB)</h3>

<p>The V.I.P. Lounge by Club Med is the Priority Pass option at Québec City. It is a beautifully designed space, but the food selection is lighter than a major hub — cold snacks and finger food rather than a hot buffet. Good for the quiet and the Wi-Fi before a shorter flight.</p>

<figure>
  <img src="/blog/vip-lounge-clubmed-yqb.png" alt="V.I.P. Lounge by Club Med at Québec City Airport (YQB)" loading="lazy" />
  <figcaption>The V.I.P. Lounge by Club Med at YQB — lighter on food but a comfortable space before departure</figcaption>
</figure>

<h2>Peak Hours to Avoid at Canadian Priority Pass Lounges</h2>

<p>Timing your lounge visit matters more than most travellers realize. Here is what Priority Pass's own published guidelines say about Canadian locations, plus what regulars have learned the hard way.</p>

<ul>
  <li>Montréal Air France Lounge (YUL) — officially lists peak hours from 3:00 p.m. to 6:00 p.m. daily, when access may be restricted</li>
  <li>Calgary Aspire Transborder Lounge (YYC) — Priority Pass notes capacity restrictions may apply during peak periods</li>
  <li>Calgary Elevation Lounge (YYC) — busiest during WestJet's morning and midday departure banks, roughly 9:00 a.m. to 1:00 p.m.</li>
  <li>Vancouver SkyTeam Lounge (YVR) — tends to fill before late-evening pushes to Asia and Europe, and during mid-afternoon international departure banks</li>
</ul>

<p>The best window at most Canadian airports is mid-morning between 10:00 a.m. and noon, or early afternoon on a weekday. Friday afternoon and Sunday evening are the most likely times to face a capacity issue across the network.</p>

<h2>How to Bring a Guest to a Priority Pass Lounge in Canada</h2>

<p>Most Priority Pass lounges in Canada allow guests, but the exact rules depend on how your membership was issued — not just which lounge you are visiting.</p>

<p>Direct Priority Pass members pay a flat per-person guest fee charged per visit. Credit card memberships vary widely — some cards include two free guests per visit, others charge a fee per guest, and a small number only cover the cardholder with no guests allowed at all. Check your card's specific terms before assuming a guest is included.</p>

<p>Lounge capacity rules apply regardless of membership. Even when your card allows guests, a lounge at capacity can still turn them away. Montréal's National Bank Lounge officially permits up to seven guests per cardholder with fees, while others reserve the right to restrict entry when full.</p>

<p>The universal rule across all Canadian Priority Pass lounges: your guest must be travelling on the same day, and you — the cardholder — must be physically present. You cannot send a guest in on your card without being there yourself.</p>

<h2>5 Things to Check Before Every Lounge Visit in Canada</h2>

<ol>
  <li><em>Open the Priority Pass app the day of your flight.</em> Search your specific airport and terminal to confirm the lounge is open and check for any access restrictions. Hours change without much notice.</li>
  <li><em>Know your flight type before you leave for the airport.</em> Domestic, US Transborder, and International lounges are separate. You cannot move between them after clearing security or customs.</li>
  <li><em>Do not pass through US Customs before visiting the transborder lounge.</em> Every Canadian airport clears US-bound passengers through American customs before departure. Once you are through, you cannot go back. The US Transborder lounge is always first.</li>
  <li><em>Check your card's guest policy at home, not at the door.</em> Call your card issuer or read your benefits guide before you travel if you are planning to bring someone.</li>
  <li><em>Build in extra time at peak airports.</em> At Vancouver, Calgary, and Toronto during busy periods, arriving 20 minutes earlier can be the difference between an easy lounge visit and being turned away.</li>
</ol>

<h2>Frequently Asked Questions: Priority Pass Lounges in Canada</h2>

<h3>Does Priority Pass work at Toronto Pearson Airport?</h3>
<p>Yes. Pearson has six Plaza Premium lounge locations across Terminal 1 and Terminal 3, covering domestic, US Transborder, and international departures from each terminal. Priority Pass holders in T1 can also redeem a Be Relax Spa credit as an alternative to standard lounge entry.</p>

<h3>What is the best Priority Pass lounge in Canada?</h3>
<p>The SkyTeam Lounge at Vancouver International Airport is consistently rated as one of the best Priority Pass lounges in the world — not just in Canada. It has made-to-order food stations, local craft beer, and panoramic runway views from the International Terminal.</p>

<h3>Which Canadian airports have Priority Pass lounges in 2026?</h3>
<p>As of 2026, Priority Pass lounges are available at Toronto Pearson (YYZ), Toronto Billy Bishop (YTZ), Vancouver (YVR), Calgary (YYC), Montréal (YUL), Ottawa (YOW), Edmonton (YEG), Winnipeg (YWG), and Québec City (YQB).</p>

<h3>Can I use Priority Pass for domestic flights in Canada?</h3>
<p>Yes, at most airports. Vancouver, Calgary, Edmonton, Ottawa, Winnipeg, and Toronto Pearson all have Priority Pass lounges that cover domestic departures. Montréal is the exception — the full lounges there are international-only, so domestic flyers may only qualify for a dining credit.</p>

<h3>What happens if the Priority Pass lounge is full?</h3>
<p>You will be turned away regardless of membership type. This is most common at Vancouver and Calgary during peak periods. Ask lounge staff whether a waitlist is available, or check the app for other options in the terminal.</p>

<h3>Can I bring a guest to a Priority Pass lounge in Canada?</h3>
<p>Yes, at most locations — but guest rules and fees depend on your card or membership tier. Direct members pay a per-visit guest fee. Some credit cards include free guest access; others charge or do not allow guests. Check your specific card's terms before you travel.</p>

<h3>Do children get free entry to Priority Pass lounges in Canada?</h3>
<p>Most Canadian Priority Pass lounges admit children under 2 at no charge. Children aged 2 and older typically count as guests and are subject to the same fees as adults, unless your card policy says otherwise.</p>

<h3>Can I use a Priority Pass lounge during a connection in Canada?</h3>
<p>Yes, as long as you have a same-day boarding pass for a departing flight and you are at the lounge that matches your departure terminal and flight type. A connecting layover qualifies — just make sure you visit the correct lounge before clearing any customs or security for your next flight.</p>

<p><em>Last updated June 2026. Lounge availability, hours, and access policies can change at any time — always confirm in the Priority Pass app before your flight.</em></p>
`

const remoteWorkContent = `
<p><em>Ranked by Wi-Fi speed, power access, quiet environment, desk space, and hours. Updated June 2026.</em></p>

<p>Not all airport lounges are built the same — and if you are travelling for work, the difference between a great lounge and a mediocre one can mean the difference between a productive morning and a missed deadline.</p>

<p>Canada's lounge landscape has changed significantly in the last two years. Airlines have started treating remote workers as a priority rather than an afterthought, with some lounges now offering purpose-built workstations, power at every seat, and enforced quiet zones. Others still rely on shared airport Wi-Fi and have nowhere comfortable to open a laptop.</p>

<p>This guide ranks the ten best Canadian airport lounges specifically for remote work, scored across five criteria that actually matter when you need to get things done before boarding.</p>

<h2>How We Scored These Lounges</h2>

<p>Each lounge was scored out of 50 points across five equally weighted categories. Scores are based on official airline documentation, user-reported experiences, and lounge operator information as of June 2026.</p>

<table>
  <thead>
    <tr><th>Category</th><th>Max</th><th>What We Assessed</th></tr>
  </thead>
  <tbody>
    <tr><td>Wi-Fi Quality</td><td>10</td><td>Speed, dedicated lounge network vs shared airport Wi-Fi, reliability</td></tr>
    <tr><td>Power and Charging</td><td>10</td><td>Outlets per seat, USB ports, desk-side access</td></tr>
    <tr><td>Quiet and Focus</td><td>10</td><td>Cell-free zones, noise levels, dedicated work areas, privacy</td></tr>
    <tr><td>Desk and Workstation</td><td>10</td><td>Flat surfaces, ergonomic seating, computer terminals, printers</td></tr>
    <tr><td>Hours and Access</td><td>10</td><td>Hours of operation, flight types covered, how to get in</td></tr>
  </tbody>
</table>

<h2>The Full Rankings at a Glance</h2>

<table>
  <thead>
    <tr><th>#</th><th>Lounge</th><th>Airport</th><th>Score</th><th>Priority Pass</th><th>Best For</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Cathay Pacific Lounge</td><td>YVR</td><td>46/50</td><td>No</td><td>CX / oneworld travellers needing desktop workstations</td></tr>
    <tr><td>2</td><td>Air Canada Maple Leaf Lounge – International</td><td>YYZ</td><td>41/50</td><td>No</td><td>Best Wi-Fi in Canada + enforced quiet zone</td></tr>
    <tr><td>3</td><td>Air Canada Café – Gate C50</td><td>YVR</td><td>40/50</td><td>No</td><td>Power at every seat — best for laptop workers</td></tr>
    <tr><td>4</td><td>Air Canada Maple Leaf Lounge – International</td><td>YVR</td><td>39/50</td><td>No</td><td>Quiet-focused international travellers through YVR</td></tr>
    <tr><td>5</td><td>WestJet Elevation Lounge</td><td>YYC</td><td>38/50</td><td>Yes</td><td>Best Priority Pass work lounge in Canada</td></tr>
    <tr><td>6</td><td>Air Canada Maple Leaf Lounge</td><td>YYC</td><td>37/50</td><td>No</td><td>Quietest Maple Leaf Lounge in the network</td></tr>
    <tr><td>7</td><td>WestJet Elevation Lounge</td><td>YVR</td><td>36/50</td><td>Yes</td><td>PP holders at YVR needing wireless printing</td></tr>
    <tr><td>8</td><td>Plaza Premium – International (24 hr)</td><td>YVR</td><td>33/50</td><td>Yes</td><td>Overnight layovers when every other lounge is closed</td></tr>
    <tr><td>9</td><td>Aspire Salon Lounge</td><td>YOW</td><td>32/50</td><td>Yes</td><td>Ottawa government and consulting travellers</td></tr>
    <tr><td>10</td><td>Air Canada Café – Gate C46/C47</td><td>YVR</td><td>30/50</td><td>No</td><td>Backup when Gate C50 café is full</td></tr>
  </tbody>
</table>

<p><em>Priority Pass eligibility in bold. Scores are out of 10 per category, 50 total. Data as of June 2026.</em></p>

<figure>
  <img src="/blog/business-traveller-airport-lounge.png" alt="Remote worker at a Canadian airport lounge workstation with laptop and tarmac views" loading="lazy" />
  <figcaption>The best Canadian airport lounges now offer purpose-built work areas, fast Wi-Fi, and power at every seat</figcaption>
</figure>

<h2>The Full Lounge Profiles</h2>

<h3>#1 — Cathay Pacific Lounge, Vancouver (YVR) — 46/50</h3>

<p><em>Access: Cathay Pacific First/Business class; Cathay Silver, Gold, or Diamond status; oneworld Sapphire or Emerald. Not Priority Pass eligible.</em></p>

<p>The Cathay Pacific Lounge at YVR is the best airport work lounge in Canada, and it is not particularly close. The reason is a single room called The Bureau — a dedicated workstation suite with iMac computers, ergonomic desk chairs, and a printer. No other lounge in Canada has anything like it. Every seat in the lounge has USB charging built into the side table, power sockets are in a slide drawer beneath each table, and the space is calm enough to take a call without leaving the room.</p>

<p>The lounge opens only around Cathay Pacific's two daily YVR departures — one morning, one evening — which means it never reaches the capacity issues that plague other high-ranking lounges. A made-to-order noodle bar and mountain views make it genuinely enjoyable to be there, not just functional.</p>

<p>The catch is a real one: you need a Cathay Pacific ticket, CX status, or oneworld elite status to get in. There is no Priority Pass access and no walk-in rate. For those who qualify, it is unequivocally Canada's finest work environment before a flight.</p>

<table>
  <thead><tr><th>Category</th><th>Score</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td>Wi-Fi Quality</td><td>9/10</td><td>Dedicated high-speed lounge network, USB at every seat</td></tr>
    <tr><td>Power and Charging</td><td>9/10</td><td>Power sockets in slide drawer under tables, USB at every seat</td></tr>
    <tr><td>Quiet and Focus</td><td>9/10</td><td>Opens 3–4 hrs before CX departures only; never overcrowded</td></tr>
    <tr><td>Desk and Workstation</td><td>10/10</td><td>The Bureau: iMac workstations, printers, ergonomic desk chairs</td></tr>
    <tr><td>Hours and Access</td><td>9/10</td><td>International only; CX/oneworld access; open ~4 hrs before departure</td></tr>
  </tbody>
</table>

<figure>
  <img src="/blog/cathay-pacific-bureau-yvr.png" alt="Cathay Pacific Lounge workstation area at Vancouver International Airport (YVR)" loading="lazy" />
  <figcaption>The Bureau at the Cathay Pacific Lounge — the only purpose-built iMac workstation suite in any Canadian airport lounge</figcaption>
</figure>

<h3>#2 — Air Canada Maple Leaf Lounge International, Toronto Pearson (YYZ) — 41/50</h3>

<p><em>Access: Air Canada Business/First class; Star Alliance Gold; Aeroplan 50K+; TD, CIBC, or Amex Aeroplan premium cards; Chase Sapphire Reserve. Not Priority Pass eligible.</em></p>

<p>The YYZ International Maple Leaf Lounge has the best Wi-Fi of any Canadian lounge. It runs on a dedicated high-capacity network completely separate from Pearson's public infrastructure — users have clocked around 100 Mbps, which is more than enough for video calls, large file transfers, and cloud-based work without interruption.</p>

<p>The enforced cell-free quiet zone is one of the few genuine ones in Canadian aviation and it is actually policed — not just a suggestion on a sign. The dedicated business centre has desktop PCs, colour printing, and ergonomic seating, making it a complete remote office setup. The main weakness is peak-hour crowding at Canada's busiest international hub. Arrive early or during an off-peak departure window for the best experience. Power outlets are being added across the lounge but are not yet at every seat.</p>

<table>
  <thead><tr><th>Category</th><th>Score</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td>Wi-Fi Quality</td><td>9/10</td><td>Dedicated AC network, separate from Pearson public Wi-Fi; ~100 Mbps</td></tr>
    <tr><td>Power and Charging</td><td>7/10</td><td>Business centre has full power; seat-level outlets still being expanded</td></tr>
    <tr><td>Quiet and Focus</td><td>9/10</td><td>Cell-free quiet zone genuinely enforced; business centre separate from dining</td></tr>
    <tr><td>Desk and Workstation</td><td>8/10</td><td>Desktop PCs and colour printers in dedicated business centre</td></tr>
    <tr><td>Hours and Access</td><td>8/10</td><td>05:30–01:00; international passengers only</td></tr>
  </tbody>
</table>

<h3>#3 — Air Canada Café, Gate C50, Vancouver (YVR) — 40/50</h3>

<p><em>Access: Aeroplan premium credit cards (TD, CIBC, or Amex Aeroplan Reserve); Aeroplan 50K+ status; Air Canada Business class. Domestic departures only. Not Priority Pass eligible.</em></p>

<p>Opened April 10, 2026, the Air Canada Café at Gate C50 is the newest lounge at YVR and the first facility in Canada purpose-built with power at every single seat — both AC outlets and USB-C laptop charging. This was not a retrofit. Air Canada designed this capability in from scratch, and it shows. Combined with the dedicated AC Wi-Fi network, it is the most technically well-equipped lounge in Canada for straight laptop work.</p>

<p>The productivity-first seating, eGate self-scan entry, and 84-person capacity keep the space calm and functional. The limitation is access — you need an Aeroplan premium card or status, and it serves domestic flights only.</p>

<table>
  <thead><tr><th>Category</th><th>Score</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td>Wi-Fi Quality</td><td>9/10</td><td>Dedicated AC network; same high-speed infrastructure as Maple Leaf Lounges</td></tr>
    <tr><td>Power and Charging</td><td>10/10</td><td>Power outlet and USB-C laptop charging at every seat — by design</td></tr>
    <tr><td>Quiet and Focus</td><td>8/10</td><td>Productivity-first design; no buffet crowds; eGate self-scan entry</td></tr>
    <tr><td>Desk and Workstation</td><td>8/10</td><td>High-top and productivity seating throughout; designed for working</td></tr>
    <tr><td>Hours and Access</td><td>5/10</td><td>Domestic only; Aeroplan card or status required; opened April 2026</td></tr>
  </tbody>
</table>

<figure>
  <img src="/blog/air-canada-cafe-yvr.png" alt="Air Canada Café at Vancouver Airport Gate C50 with power at every seat" loading="lazy" />
  <figcaption>The Air Canada Café at YVR Gate C50 — the first Canadian lounge purpose-built with power and USB-C charging at every single seat</figcaption>
</figure>

<h3>#4 — Air Canada Maple Leaf Lounge International, Vancouver (YVR) — 39/50</h3>

<p><em>Access: Air Canada Business/First class; Star Alliance Gold; Aeroplan 50K+; Aeroplan premium cards. Not Priority Pass eligible.</em></p>

<p>The YVR International Maple Leaf Lounge earns high marks for its enforced cell-free quiet zone — consistently called out in independent reviews as one of the most genuinely calm environments in Canadian aviation. The business centre with desktop PCs and colour printing is reliable, and the lounge runs notably less frantic than its YYZ counterpart.</p>

<p>The power outlet situation is the known weakness. Seat-level outlets are scarce — a documented issue Air Canada has acknowledged publicly and is working to fix. If you need to run a laptop for a long session, the business centre cubicles are your only guaranteed charging option.</p>

<table>
  <thead><tr><th>Category</th><th>Score</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td>Wi-Fi Quality</td><td>8/10</td><td>Dedicated AC network; same infrastructure as YYZ</td></tr>
    <tr><td>Power and Charging</td><td>5/10</td><td>Known issue — minimal seat-level outlets; business centre cubicles are the reliable option</td></tr>
    <tr><td>Quiet and Focus</td><td>9/10</td><td>Cell-free quiet zone enforced; Signature Suite adds extra seclusion</td></tr>
    <tr><td>Desk and Workstation</td><td>8/10</td><td>Desktop PCs and colour printer in business centre</td></tr>
    <tr><td>Hours and Access</td><td>9/10</td><td>06:00–23:30; international only</td></tr>
  </tbody>
</table>

<h3>#5 — WestJet Elevation Lounge, Calgary (YYC) — 38/50</h3>

<p><em>Access: Priority Pass eligible; WestJet Platinum/Gold; WestJet Business class; walk-in from $59 plus GST. Note: Priority Pass members are the first turned away when the lounge is at capacity — arrive early.</em></p>

<p>The WestJet Elevation Lounge at YYC is the best Priority Pass work lounge in Canada. It is the only lounge in the country offering wireless printing — genuinely useful for boarding passes, contracts, or documents — and the dedicated focus space and private meeting area are features you simply do not find in most PP-accessible lounges.</p>

<p>Personal power outlets are available at seating, and the Wi-Fi is marketed as unlimited and consistently praised in traveller reviews. The significant caveat is capacity: this lounge fills up, and Priority Pass members are explicitly the first group turned away when it does. Arriving at least two hours before departure is the only reliable way to guarantee entry as a PP holder.</p>

<table>
  <thead><tr><th>Category</th><th>Score</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td>Wi-Fi Quality</td><td>8/10</td><td>Unlimited Wi-Fi; consistently positive in traveller reviews</td></tr>
    <tr><td>Power and Charging</td><td>8/10</td><td>Personal power outlets at seating; wireless printing available</td></tr>
    <tr><td>Quiet and Focus</td><td>7/10</td><td>Dedicated focus space; can be crowded at peak hours</td></tr>
    <tr><td>Desk and Workstation</td><td>8/10</td><td>Private meeting spaces; wireless printing; WestJet priority service agents</td></tr>
    <tr><td>Hours and Access</td><td>7/10</td><td>05:00–22:15; domestic and international (not US transborder); PP eligible</td></tr>
  </tbody>
</table>

<figure>
  <img src="/blog/westjet-elevation-lounge.png" alt="WestJet Elevation Lounge focus work area at Calgary International Airport (YYC)" loading="lazy" />
  <figcaption>The WestJet Elevation Lounge at YYC — the top Priority Pass work lounge in Canada, with wireless printing and dedicated focus seating</figcaption>
</figure>

<h3>#6 — Air Canada Maple Leaf Lounge, Calgary (YYC) — 37/50</h3>

<p><em>Access: Air Canada Business/First class; Star Alliance Gold; Aeroplan 50K+; Aeroplan premium cards; Chase Sapphire Reserve. Domestic only. Not Priority Pass eligible.</em></p>

<p>The Calgary Maple Leaf Lounge — fully renovated after a 2024 hailstorm — is consistently described in independent reviews as the quietest and least crowded Maple Leaf Lounge in the entire network. It opens at 04:30, earlier than any other MLL location, which is a real advantage for early-morning domestic departures.</p>

<p>The window pod seating looks great but lacks power outlets — a frustration for laptop workers who want a view. The business centre cubicles with power and printing are the reliable work option.</p>

<table>
  <thead><tr><th>Category</th><th>Score</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td>Wi-Fi Quality</td><td>8/10</td><td>Dedicated AC Wi-Fi network</td></tr>
    <tr><td>Power and Charging</td><td>6/10</td><td>Business centre cubicles have charging; window armchairs do not</td></tr>
    <tr><td>Quiet and Focus</td><td>8/10</td><td>Quietest and least crowded MLL in Canada per multiple reviews</td></tr>
    <tr><td>Desk and Workstation</td><td>7/10</td><td>Business centre cubicles with power and printer post-renovation</td></tr>
    <tr><td>Hours and Access</td><td>8/10</td><td>04:30–00:30 daily — earliest opening of any Maple Leaf Lounge in Canada</td></tr>
  </tbody>
</table>

<h3>#7 — WestJet Elevation Lounge, Vancouver (YVR) — 36/50</h3>

<p><em>Access: Priority Pass eligible; WestJet Platinum/Gold; WestJet Business class; walk-in from $65 plus GST.</em></p>

<p>The YVR WestJet Elevation Lounge delivers the same core work package as the Calgary flagship — personal power outlets, unlimited Wi-Fi, and wireless printing — with Priority Pass eligibility. The difference is a dedicated family and children's space that makes the noise environment less predictable. For remote workers, finding a seat away from that area is the difference between a productive session and a distracted one.</p>

<table>
  <thead><tr><th>Category</th><th>Score</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td>Wi-Fi Quality</td><td>8/10</td><td>Unlimited Wi-Fi; same WestJet infrastructure as YYC</td></tr>
    <tr><td>Power and Charging</td><td>7/10</td><td>Personal power outlets; wireless printing available</td></tr>
    <tr><td>Quiet and Focus</td><td>6/10</td><td>Family/kids space means noise levels are unpredictable</td></tr>
    <tr><td>Desk and Workstation</td><td>7/10</td><td>Focus spaces; wireless printing; interactive AR elements</td></tr>
    <tr><td>Hours and Access</td><td>8/10</td><td>05:00–22:15; domestic and international (not US or Hawaii); PP eligible</td></tr>
  </tbody>
</table>

<h3>#8 — Plaza Premium Lounge International (24 hr), Vancouver (YVR) — 33/50</h3>

<p><em>Access: Priority Pass eligible; walk-in available.</em></p>

<p>The Plaza Premium International Lounge at YVR holds a unique position in this ranking: it is open 24 hours a day, every day of the year. For overnight layovers on transpacific routes — common at YVR — this is often the only lounge option when everything else has closed. Showers are available, which is genuinely useful before a long work session after an overnight arrival.</p>

<p>The Wi-Fi situation needs an honest note. At least one review reported the lounge sharing YVR's public airport Wi-Fi rather than running a dedicated lounge network. Treat the Wi-Fi here as a backup connection and carry a personal hotspot if reliable internet is essential for your work.</p>

<table>
  <thead><tr><th>Category</th><th>Score</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td>Wi-Fi Quality</td><td>6/10</td><td>Reliability inconsistent; dedicated network status contested — bring a hotspot</td></tr>
    <tr><td>Power and Charging</td><td>6/10</td><td>Outlets available but not at every seat</td></tr>
    <tr><td>Quiet and Focus</td><td>6/10</td><td>No cell-free zone; 24-hr access creates varied crowd at all hours</td></tr>
    <tr><td>Desk and Workstation</td><td>7/10</td><td>Computer workstations available; flight info screens</td></tr>
    <tr><td>Hours and Access</td><td>8/10</td><td>00:00–23:59 every day; international only; Priority Pass eligible</td></tr>
  </tbody>
</table>

<figure>
  <img src="/blog/plaza-premium-24hr-yvr.png" alt="Plaza Premium 24-hour lounge at Vancouver International Airport for overnight layovers" loading="lazy" />
  <figcaption>The Plaza Premium International Lounge at YVR is open 24 hours — the only Priority Pass option in Canada available during overnight layovers</figcaption>
</figure>

<h3>#9 — Aspire Salon Lounge, Ottawa (YOW) — 32/50</h3>

<p><em>Access: Priority Pass eligible; unlimited guests per cardholder.</em></p>

<p>The Aspire Salon Lounge at Ottawa is the sleeper pick on this list. Ottawa's traveller mix skews heavily toward government officials, lobbyists, and consultants — which creates a naturally professional, low-noise environment that you do not find in a high-volume hub. Reviewers specifically call out a private work area suitable for calls and focused work, and the conference facilities here are unusual for any Priority Pass lounge in Canada.</p>

<p>The Wi-Fi is the honest weakness — current evidence suggests the lounge uses Ottawa Airport's public network rather than a dedicated connection. Bring a personal hotspot for anything important. The unlimited guest policy is a useful perk for teams travelling together.</p>

<table>
  <thead><tr><th>Category</th><th>Score</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td>Wi-Fi Quality</td><td>6/10</td><td>Likely shared public airport network — bring a hotspot for critical work</td></tr>
    <tr><td>Power and Charging</td><td>5/10</td><td>Mixed reports; not explicitly confirmed at all seats</td></tr>
    <tr><td>Quiet and Focus</td><td>8/10</td><td>Private work area for calls; small and consistently uncrowded; tarmac views</td></tr>
    <tr><td>Desk and Workstation</td><td>6/10</td><td>Conference facilities available — unusual for a PP lounge</td></tr>
    <tr><td>Hours and Access</td><td>7/10</td><td>05:00–20:00; domestic and international (not US); PP eligible; unlimited guests</td></tr>
  </tbody>
</table>

<h3>#10 — Air Canada Café, Gate C46/C47, Vancouver (YVR) — 30/50</h3>

<p><em>Access: Aeroplan premium credit cards (TD, CIBC, or Amex Aeroplan Reserve); Aeroplan 50K+ status; Air Canada Business class. Domestic only. Not Priority Pass eligible.</em></p>

<p>The Gate C46/C47 Air Canada Café shares identical power and Wi-Fi hardware with the higher-ranked C50 location — power at every seat, USB-C laptop charging, and the dedicated AC network. In practice, the 52-person capacity versus 84 at C50 and the grab-and-go positioning create higher turnover and a less settled work environment.</p>

<p>Treat this as the backup option when C50 is full. If you can find a seat away from the main flow, the power and Wi-Fi combination is genuinely excellent — the lower ranking reflects the environment rather than the technical specs.</p>

<table>
  <thead><tr><th>Category</th><th>Score</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td>Wi-Fi Quality</td><td>9/10</td><td>Dedicated AC high-speed network; identical to C50</td></tr>
    <tr><td>Power and Charging</td><td>10/10</td><td>Power at every seat with USB-C laptop charging — same design as C50</td></tr>
    <tr><td>Quiet and Focus</td><td>6/10</td><td>Smaller 52-person capacity; grab-and-go concept creates higher foot traffic</td></tr>
    <tr><td>Desk and Workstation</td><td>6/10</td><td>High-top and productivity seating; no computer terminals or printers</td></tr>
    <tr><td>Hours and Access</td><td>5/10</td><td>Domestic only; Aeroplan card or status required; smaller than C50</td></tr>
  </tbody>
</table>

<h2>Key Takeaways for Remote Workers</h2>

<blockquote>
<p>The Cathay Pacific Lounge at YVR is the best work lounge in Canada — but most travellers cannot access it. The practical picks for most remote workers are the Maple Leaf Lounge at YYZ (#2) for Wi-Fi and quiet, the Air Canada Café at YVR C50 (#3) for guaranteed power at every seat, and the WestJet Elevation Lounge at YYC (#5) for the best Priority Pass work experience in the country.</p>
</blockquote>

<ul>
  <li>Only three lounges in Canada enforce a genuine cell-free quiet zone: the Maple Leaf Lounges at YYZ and YVR International. If uninterrupted focus is the priority, these two are the ones to aim for.</li>
  <li>Power at every seat exists in only one Canadian lounge right now — the Air Canada Café at YVR Gate C50, opened April 2026. It is a domestic-only, Aeroplan-card-required space, but it is the first of its kind.</li>
  <li>Priority Pass holders have four realistic work lounge options in Canada: WestJet Elevation at YYC and YVR, Plaza Premium 24-hour at YVR, and Aspire Salon at YOW. Arrive early at both WestJet locations — PP members are turned away first when capacity is reached.</li>
  <li>If the Wi-Fi matters for your work, do not rely on Plaza Premium YVR or the Aspire Salon at YOW without a backup hotspot. Both likely share public airport networks rather than dedicated lounge connections.</li>
</ul>

<h2>Frequently Asked Questions: Airport Lounges for Remote Work in Canada</h2>

<h3>Which Canadian airport lounge has the best Wi-Fi for working?</h3>
<p>The Air Canada Maple Leaf Lounge International at Toronto Pearson (YYZ) has the fastest and most reliable Wi-Fi of any Canadian lounge, running on a fully dedicated network separate from Pearson's public infrastructure. Users have clocked around 100 Mbps. The Air Canada Café locations at YVR run the same dedicated network and are the best option on the West Coast.</p>

<h3>Which Canadian airport lounge has the most power outlets?</h3>
<p>The Air Canada Café at Vancouver Gate C50, opened in April 2026, is the only lounge in Canada with power at every seat — both AC outlets and USB-C laptop charging built in by design. The Gate C46/C47 café at YVR has the same setup. Both require an Aeroplan premium card or status and serve domestic flights only.</p>

<h3>What is the best airport lounge for remote work in Canada for Priority Pass holders?</h3>
<p>The WestJet Elevation Lounge at Calgary (YYC) is the top Priority Pass work lounge in Canada. It has dedicated focus spaces, personal power outlets, private meeting rooms, and the only wireless printing available in any PP-eligible lounge in the country. Arrive at least two hours before departure — Priority Pass members are the first turned away when the lounge hits capacity.</p>

<h3>Are there any airport lounges in Canada with quiet zones?</h3>
<p>Yes, but only a few. The Air Canada Maple Leaf Lounges at Toronto Pearson International (YYZ) and Vancouver International (YVR) both enforce genuine cell-free quiet zones — these are actually policed, not just posted signs. The Aspire Salon Lounge at Ottawa (YOW) has a private work area suited for calls, though it does not have a formal cell-free policy.</p>

<h3>Can I use an airport lounge in Canada just to work, even on a short domestic flight?</h3>
<p>Yes. Most lounges admit any eligible traveller with a same-day boarding pass, regardless of flight length or destination. The access method — your card, status, or Priority Pass membership — determines whether you can get in, not your ticket type. Always confirm the lounge covers your departure terminal and flight type before heading through security.</p>

<h3>What should I bring to a Canadian airport lounge for a productive work session?</h3>
<p>A laptop charger and a personal mobile hotspot as backup are the two most useful items. Even in higher-ranked lounges, power outlets are not always at every seat, and Wi-Fi reliability varies. Noise-cancelling headphones help in lounges without enforced quiet zones. If you plan to print anything, the WestJet Elevation Lounges at YYC and YVR are currently the only Priority Pass locations in Canada with wireless printing.</p>

<p><em>All data in this guide was compiled as of June 2026. Lounge access policies, hours, Priority Pass eligibility, and physical facilities are subject to change — always verify with the lounge operator or your card issuer before travel.</em></p>
`

const showerAccessContent = `
<p><em>Every lounge in Canada with a shower reviewed — facilities, bath products, who gets in free, and how to avoid a long wait. Updated June 2026.</em></p>

<p>A hot shower before boarding changes everything. After a red-eye from Toronto, a transatlantic connection through Vancouver, or a long drive to the airport, freshening up in a proper shower can completely reset how you feel before a flight.</p>

<p>Not every airport lounge in Canada has shower access, and the quality varies enormously — from the limestone-clad, Aesop-stocked suites at the Cathay Pacific Lounge at YVR to a single functional stall with wall-mounted dispensers. A few lounges charge extra for shower access on top of lounge entry. Some require you to book a slot at the desk. And some major lounges — including the Air Canada Maple Leaf in Calgary — have no shower at all.</p>

<p>This guide covers every Canadian airport lounge that currently offers shower access, what to expect when you get there, who qualifies for free access, and how to avoid waiting.</p>

<h2>What Shower Access Actually Means</h2>

<p>Lounges use different formats, and knowing which you are walking into sets the right expectations.</p>

<ul>
  <li><em>Full shower suite</em> — a private room with its own sink, toilet, and shower. You have the entire space to yourself for the duration.</li>
  <li><em>Shower stall</em> — a walk-in shower only, with shared bathroom facilities outside.</li>
  <li><em>Shower with surcharge</em> — lounge entry is covered by your card, but the shower costs extra on top.</li>
  <li><em>By appointment</em> — you must register at the front desk on arrival. A wait is common at busy times.</li>
</ul>

<h2>Quick-Reference: Every Canadian Lounge with Shower Access (2026)</h2>

<table style="width:100%; border-collapse:collapse; font-size:0.88em;">
  <thead>
    <tr style="background:#1a2e44; color:#ffffff;">
      <th style="padding:9px 10px; text-align:left; width:8%;">Airport</th>
      <th style="padding:9px 10px; text-align:left; width:30%;">Lounge</th>
      <th style="padding:9px 10px; text-align:left; width:22%;">Shower Details</th>
      <th style="padding:9px 10px; text-align:left; width:25%;">Cost / Access</th>
      <th style="padding:9px 10px; text-align:center; width:15%;">Priority Pass / DragonPass</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">YVR</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Cathay Pacific Lounge (Gate D70, International)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">2 full suites, limestone, rain shower, Aesop products, 1 ADA-accessible</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Included in lounge entry; oneworld/CX passengers and elite status only</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; vertical-align:top;">No</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">YVR</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Plaza Premium First (Gate D67–68, International)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Spa-like suites, included in PPF entry. Adjacent PPL shower = +$25 CAD</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">PPF from $110 CAD. PP covers PPL entry; shower = +$25 CAD extra</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; vertical-align:top;">PP with surcharge</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">YVR</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">SkyTeam Lounge (Gate D53, International)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">2 full oversized suites, full amenities, spotlessly maintained</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Included in lounge entry for all eligible guests</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; vertical-align:top; color:#1a7a3a; font-weight:600;">Yes — free</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">YVR</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">AC Maple Leaf Lounge International (Gate D52)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Individual suites, confirmed present</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Included; AC/Aeroplan cards and status holders</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; vertical-align:top;">No</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">YVR</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">AC Maple Leaf Lounge Transborder (Gate E84)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">1 oversized accessible suite; functional, dated tiling, good water pressure</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Included; AC/Aeroplan cards and status holders</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; vertical-align:top;">No</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">YVR</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Plaza Premium Domestic Pier B (Gate B15)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Shower rooms available; Pier C does not have showers</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">PP lounge entry free; shower = +$25 CAD</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; vertical-align:top;">PP with surcharge</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">YYZ</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">AC Maple Leaf Lounge International (Terminal 1, Gate F)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">2 full suites, rain shower, toilet, sink — waitlist common</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Included; AC/Aeroplan cards and status holders</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; vertical-align:top;">No</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">YYZ</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Plaza Premium T3-C (Gate C32, International)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Shower rooms included in entry</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Included for PP/DragonPass members</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; vertical-align:top; color:#1a7a3a; font-weight:600;">Yes — free</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">YYZ</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Plaza Premium T1 Domestic</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Shower rooms included in entry</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Included for PP/DragonPass members</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; vertical-align:top; color:#1a7a3a; font-weight:600;">Yes — free</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">YYZ</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Plaza Premium T3-B (Gates B22–B24, Domestic)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Shower rooms included in entry</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Included for PP/DragonPass members</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; vertical-align:top; color:#1a7a3a; font-weight:600;">Yes — free</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">YUL</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Air France Lounge by Plaza Premium (Gate 57, International)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">3 full private suites, walk-in shower, wall-mounted toiletries, towels provided</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">PP free with 2-hr limit; not during peak 3–6 PM</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; vertical-align:top; color:#1a7a3a; font-weight:600;">Yes — free</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">YUL</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">AC Maple Leaf Lounge International (Gate A52)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Showers confirmed present; limited detail available</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Included; AC/Aeroplan cards and status holders</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; vertical-align:top;">No</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">YYC</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">WestJet Elevation Lounge (Concourse B)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Private room with sink, toilet, and large accessible stall. Rocky Mountain Soap Co. products. Heated towel rack. By appointment.</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Included for PP/DragonPass and WestJet status</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; vertical-align:top; color:#1a7a3a; font-weight:600;">Yes — free</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; vertical-align:top;">YVR</td>
      <td style="padding:9px 10px; vertical-align:top;">WestJet Elevation Lounge (Pier B)</td>
      <td style="padding:9px 10px; vertical-align:top;">Shower facilities confirmed; charge status for PP members unconfirmed — verify at desk</td>
      <td style="padding:9px 10px; vertical-align:top;">PP lounge entry free; shower charge unclear</td>
      <td style="padding:9px 10px; text-align:center; vertical-align:top;">Confirm at desk</td>
    </tr>
  </tbody>
</table>

<p><em>PP upcharge = Priority Pass covers lounge entry but the shower requires an additional payment. Data as of June 2026 — amenities subject to change.</em></p>

<figure>
  <img src="/blog/premium-shower-lounge-hero.png" alt="Premium airport lounge shower suite with limestone tiles, rain shower, and Aesop bath products" loading="lazy" />
  <figcaption>The best Canadian airport lounge showers rival what you would find in a boutique hotel — but you need to know which ones to seek out</figcaption>
</figure>

<h2>The Best Airport Lounge Showers in Canada — Reviewed</h2>

<h3>#1 — Cathay Pacific Lounge, Vancouver (YVR) — Best Shower in Canada</h3>

<p><em>Access: Cathay Pacific or oneworld Business/First class; oneworld Emerald or Sapphire elite status; Marco Polo Club Diamond, Gold, or Silver. Not Priority Pass eligible.</em></p>

<p>The Cathay Pacific Lounge at YVR Gate D70 has the finest shower experience at any Canadian airport, and it is not particularly close. Two full private suites are clad in limestone with a walk-in rain shower, a sink with brass fixtures, and a toilet. One suite is ADA-compliant and fully accessible. Bath products are from Aesop — plush towels and premium amenities are provided in full, and the cleaning standard is consistently praised.</p>

<p>The only quirk noted in reviews: the showerhead placement near the door can cause minor leaking if you are not careful about direction. It does not affect the overall experience. With only two suites and no reservation system, arriving early is the only way to guarantee no wait. The lounge opens in line with Cathay Pacific's two daily YVR departures — morning and evening — so early arrivals almost always walk straight in.</p>

<blockquote>
<p>Aesop bath products in an airport shower are genuinely rare. If you qualify for access, bring a small bag and make the most of it. With only 2 suites and no booking system, arriving early is your only strategy for avoiding a wait.</p>
</blockquote>

<h3>#2 — Plaza Premium First, Vancouver (YVR) — Spa-Like, Worth the Upcharge</h3>

<p><em>Access: Plaza Premium First (PPF) from $110 CAD per person for 2-hour access, bookable at plazapremiumgroup.com. Priority Pass covers entry to the adjacent standard Plaza Premium Lounge (PPL); shower at PPL costs +$25 CAD on top.</em></p>

<p>Plaza Premium First opened at YVR Gate D67–D68 in December 2024 and is the most premium independent lounge in Canada. At just under 1,000 square metres, it is the largest and most architecturally considered lounge space at any Canadian airport — and the shower suites reflect that. PPF describes the shower facilities as spa-like and includes them as a complimentary part of the entry package.</p>

<p>For Priority Pass holders who do not want to pay the full PPF entry fee, the adjacent standard Plaza Premium Lounge (PPL) is free to enter with a PP card, and the shower is available there for a $25 CAD surcharge. Both lounges are in the same building, open from 6:30 AM to 1:30 AM daily (PPF from 9 AM on Saturdays). Booking PPF in advance online is recommended on Fridays and Sundays when the international terminal is busiest.</p>

<figure>
  <img src="/blog/premium-shower-suite-yvr.png" alt="Plaza Premium First lounge shower suite at Vancouver International Airport (YVR)" loading="lazy" />
  <figcaption>Plaza Premium First at YVR opened in December 2024 — the spa-like shower suites are included in the lounge entry fee</figcaption>
</figure>

<h3>#3 — SkyTeam Lounge, Vancouver (YVR) — Best Free Shower on Priority Pass</h3>

<p><em>Access: Priority Pass and DragonPass (international flights only); SkyTeam Elite Plus members; SkyTeam Business class passengers; walk-in day pass available. International departures only — not accessible for domestic or US flights from YVR.</em></p>

<p>The SkyTeam Lounge at YVR is consistently rated one of the top Priority Pass lounges in the world — and its shower suites are a meaningful part of that reputation. Two oversized full suites, each with a large walk-in shower, sink, toilet, towels, and bath amenities. The lounge itself is kept spotlessly clean and the showers are no exception. Both suites are self-contained private rooms with no shared changing areas.</p>

<p>The lounge spans 5,600 square feet with floor-to-ceiling windows, runway and mountain views, a made-to-order noodle bar opening at 11 AM, a quiet day-bed zone, and BC craft beer on tap. Showers are available to all eligible guests at no additional charge — there is no surcharge, no booking requirement, and no separate fee. It is the best free shower available to Priority Pass holders anywhere in Canada.</p>

<blockquote>
<p>With only 2 suites and a lounge that fills up, arrive at least 90 minutes before your flight if a shower is the priority. Peak hours are 10 AM to 2 PM when multiple long-haul departures are preparing. Early morning — before 5 AM — is the least crowded window of the day. Plan your shower before the noodle bar opens at 11 AM to sidestep the busiest period.</p>
</blockquote>

<figure>
  <img src="/blog/premium-shower-suite-generic.png" alt="A premium airport lounge shower suite with rain shower and high-end amenities" loading="lazy" />
  <figcaption>Priority Pass holders can access free shower suites at the SkyTeam Lounge at YVR — two full oversized private suites with no surcharge</figcaption>
</figure>

<h3>#4 — Air Canada Maple Leaf Lounges — Which Locations Actually Have Showers</h3>

<p><em>Access: Air Canada Business/First class; Star Alliance Gold; Aeroplan 50K+ status; TD, CIBC, or Amex Aeroplan premium cards. Not Priority Pass eligible.</em></p>

<p>Air Canada lists showers as a standard Maple Leaf Lounge amenity, but not every location has them and quality varies. Here is a location-by-location breakdown of what you can actually expect.</p>

<table style="width:100%; border-collapse:collapse; font-size:0.88em;">
  <thead>
    <tr style="background:#1a2e44; color:#ffffff;">
      <th style="padding:9px 10px; text-align:left; width:30%;">Location</th>
      <th style="padding:9px 10px; text-align:center; width:15%;">Showers?</th>
      <th style="padding:9px 10px; text-align:left; width:55%;">Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">YYZ International (T1, Gate F)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; color:#1a7a3a; font-weight:600;">Yes — 2 suites</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Rain shower, toilet, and sink. Busy lounge — waitlist common. Ask at the desk immediately on arrival.</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">YYZ Domestic (T1)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; color:#1a7a3a; font-weight:600;">Yes — 2 rooms</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Well-reviewed post-renovation. Early morning visits (5–6 AM) report no wait.</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">YYZ Transborder (T1, Pier F)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; color:#1a7a3a; font-weight:600;">Yes</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Functional standard stalls; smaller than the international suites.</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">YVR International (Gate D52)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; color:#1a7a3a; font-weight:600;">Yes</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Individual suites confirmed. Located in the washroom area near the lounge entrance.</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">YVR Transborder (Gate E84)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; color:#1a7a3a; font-weight:600;">Yes — 1 suite</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Single oversized accessible suite. Tiling is dated but clean. Good water pressure.</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">YVR Domestic (Gate C29)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; color:#1a7a3a; font-weight:600;">Yes</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Basic shower access. Less reviewed than international locations.</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">YUL International (Gate A52)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; color:#1a7a3a; font-weight:600;">Yes</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Showers confirmed but limited reviewer detail available. Ask at the desk on arrival.</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">YYC Domestic</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; color:#b00020; font-weight:600;">No</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Confirmed no showers at the Calgary MLL. Use WestJet Elevation YYC for shower access in Calgary.</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">YOW Domestic/International</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center; color:#b00020; font-weight:600;">No</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Confirmed no shower. Beautiful tarmac views, good food — but no shower facilities.</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">YWG Domestic/International</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">Unconfirmed</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Smaller lounge; shower availability not independently confirmed as of June 2026.</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px;">YEG Domestic/International</td>
      <td style="padding:9px 10px; text-align:center;">Unconfirmed</td>
      <td style="padding:9px 10px;">Smaller lounge; shower availability not independently confirmed as of June 2026.</td>
    </tr>
  </tbody>
</table>

<p>The YYZ International Maple Leaf Lounge is the flagship shower experience in the network — two spacious suites with rain showers, green and brown classic tiling, wall-mounted dispensers, and towels provided. With only two suites serving a large and busy lounge, a waitlist is common. Ask about shower availability the moment you walk in, not when you are ready to use it.</p>

<figure>
  <img src="/blog/shower-stall-toronto-pearson.png" alt="Air Canada Maple Leaf Lounge shower suite at Toronto Pearson Airport (YYZ)" loading="lazy" />
  <figcaption>The Air Canada Maple Leaf Lounge International at YYZ has two rain shower suites — ask at the desk immediately on arrival to join the waitlist</figcaption>
</figure>

<h3>#5 — WestJet Elevation Lounge, Calgary (YYC) — Book the Slot Early</h3>

<p><em>Access: Priority Pass and DragonPass (free); WestJet Rewards Platinum and Gold; WestJet Business class; Delta SkyMiles Diamond, Platinum, and Gold Medallion on WJ/DL itineraries; walk-in from $59 CAD + GST. Domestic and international only — not available for US transborder departures.</em></p>

<p>The WestJet Elevation Lounge at YYC is notable for two reasons. First, it has showers — the nearby Air Canada Maple Leaf Lounge at Calgary does not. Second, showers are by appointment, which is actually useful: you register at the front desk when you arrive, get a time slot, and then go eat and relax until your turn.</p>

<p>The shower room is a private space with a sink, toilet, and large accessible stall. Bath products are Rocky Mountain Soap Company — body wash and conditioner in the shower. A heated towel rack holds both a bath towel and a hand towel. The room is consistently described as clean and bright. The one reported drawback is the lack of a bench or flat surface for laying out a toiletry kit — keep your bag away from the spray zone.</p>

<p>One reviewer reported a 90-minute wait for the next available slot after arriving mid-morning. If your connection is under two hours, head straight to the desk before doing anything else.</p>

<blockquote>
<p>The lounge opens at 5 AM. Arriving early practically guarantees an immediate shower slot with no wait. Do not leave the shower booking until 30 minutes before your flight — slots may already be full for the hour.</p>
</blockquote>

<h3>#6 — Air France Lounge (by Plaza Premium), Montréal (YUL) — Best Shower in Montreal for PP Members</h3>

<p><em>Access: Priority Pass free with a 2-hour time limit — not during peak hours approximately 3–6 PM. Air France and KLM Business class; SkyTeam Elite Plus. International departures only.</em></p>

<p>The Air France Lounge at YUL Gate 57, operated by Plaza Premium Group, is the best shower option in Montréal for Priority Pass holders. Three of the seven bathroom rooms are full private shower suites — each is a self-contained space with a sink, toilet, and walk-in shower with a glass shield. Toiletries are unbranded wall-mounted dispensers. Towels are provided. The rooms are described as compact but clean and private.</p>

<p>The significant caveat is timing. The lounge becomes extremely crowded from 3 PM to 7 PM as Air France and KLM transatlantic departures to Paris (CDG) and Amsterdam (AMS) prepare. Priority Pass members can be denied entry during this window even after arriving three hours early — multiple reviewers confirm this. The best window for Priority Pass shower access is 5 AM to 2 PM, when the lounge is quiet and all three shower rooms are available.</p>

<h3>#7 — WestJet Elevation Lounge, Vancouver (YVR)</h3>

<p><em>Access: Priority Pass (lounge entry free; shower charge status unconfirmed — verify at desk); WestJet Rewards Platinum and Gold; walk-in from $59 CAD + GST. Domestic and international only — not US transborder.</em></p>

<p>The WestJet Elevation Lounge at YVR Pier B includes shower facilities, but the charge situation for Priority Pass members is less clearly documented than at the YYC counterpart. WestJet's official access page states "shower facilities (charges may apply)" — which suggests the shower may not be complimentary for all access types at this location. Confirm at the desk when you arrive.</p>

<p>For PP members flying internationally from YVR, the SkyTeam Lounge at Gate D53 is the more reliable option — confirmed free, two full suites, no ambiguity. For domestic departures, Plaza Premium Pier B with a $25 CAD shower surcharge is the cleaner choice.</p>

<h3>#8 — Plaza Premium Domestic Pier B, Vancouver (YVR)</h3>

<p><em>Access: Priority Pass and DragonPass (lounge free; shower = +$25 CAD); walk-in from $48 CAD for 3 hours with shower included in some packages. Domestic terminal only.</em></p>

<p>For domestic departures at YVR, Plaza Premium at Pier B (Gate B15) is the only Priority Pass shower option available — and it comes with a $25 CAD surcharge on top of lounge entry. The lounge itself is free with a PP or DragonPass card. Shower rooms are confirmed present and available during opening hours (5 AM to 10 PM daily).</p>

<p>One important distinction: Plaza Premium Pier C (Gate C29) at YVR does not have showers. Pier B is the only domestic Plaza Premium location at YVR with shower access. If you find yourself at Pier C, you will need to travel to Pier B or look for another option.</p>

<figure>
  <img src="/blog/modern-lounge-shower-room.png" alt="Clean airport lounge shower room with walk-in stall and towels" loading="lazy" />
  <figcaption>Most Canadian airport lounge shower rooms are private self-contained spaces — all provide towels and basic bath products at minimum</figcaption>
</figure>

<h2>Canadian Airport Lounges That Do Not Have Showers</h2>

<p>These are the notable lounges confirmed to have no shower facilities, so you are not walking across the terminal to find out the hard way.</p>

<table style="width:100%; border-collapse:collapse; font-size:0.88em;">
  <thead>
    <tr style="background:#1a2e44; color:#ffffff;">
      <th style="padding:9px 10px; text-align:left; width:40%;">Lounge</th>
      <th style="padding:9px 10px; text-align:center; width:10%;">Airport</th>
      <th style="padding:9px 10px; text-align:left; width:50%;">Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Air Canada Maple Leaf Lounge — Domestic</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">YYC</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Confirmed no showers. Use WestJet Elevation YYC instead.</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Air Canada Maple Leaf Lounge</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">YOW</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Confirmed no shower. Good food and views — no shower facilities.</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Aspire Salon Lounge</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">YOW</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Priority Pass accessible; no shower confirmed.</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Desjardins Odyssey Lounge — Transborder</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">YUL</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Reviewed as having no bathrooms in the lounge at all — uses terminal facilities.</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Plaza Premium — US Departures (Gate E88)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">YVR</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Priority Pass accessible; no shower listed or confirmed.</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Plaza Premium — Domestic Pier C (Gate C29)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">YVR</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">PP accessible; showers only at Pier B, not Pier C.</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">National Bank Lounge</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">YUL</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">No shower confirmed in multiple reviews. PP and DragonPass accessible.</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px;">AC Maple Leaf Lounge Express — Transborder</td>
      <td style="padding:9px 10px; text-align:center;">YYZ</td>
      <td style="padding:9px 10px;">Express format lounge; no shower access.</td>
    </tr>
  </tbody>
</table>

<h2>7 Tips for Getting a Shower at a Canadian Airport Lounge</h2>

<ol>
  <li><p><em>Ask about shower availability the moment you arrive.</em> Do not wait until you are ready to use it. Walk in, speak to reception immediately, and get on the list or secure a key right away. At the WestJet Elevation YYC, the AC MLL YYZ International, and the SkyTeam Lounge at YVR, shower demand is high enough that waiting costs you your slot.</p></li>
  <li><p><em>Arrive at least 90 minutes before your flight if a shower is the priority.</em> Most lounges require a same-day boarding pass, but shower wait times can eat into your pre-flight window fast. A 90-minute wait was specifically reported at WestJet Elevation YYC during mid-morning. The AC MLL YYZ International has only 2 suites serving a large lounge.</p></li>
  <li><p><em>Early morning is almost always low-wait.</em> Across all reviewed Canadian lounges, 5 AM to 7 AM is consistently the quietest window. If your schedule allows an early arrival, this is the most reliable way to walk straight into a shower. The SkyTeam Lounge at YVR specifically peaks between 10 AM and 2 PM — early morning is the opposite of that.</p></li>
  <li><p><em>Book Plaza Premium First online in advance.</em> Plaza Premium First at YVR can be pre-booked at plazapremiumgroup.com up to 24 hours ahead. On busy travel days — Fridays and Sundays especially — this is worth doing if you want the best shower experience in Canada and are paying out of pocket.</p></li>
  <li><p><em>Bring your own kit if product quality matters to you.</em> Most Canadian lounges provide shampoo, conditioner, and body wash in unbranded wall-mounted dispensers. The exceptions are the Cathay Pacific Lounge at YVR (Aesop) and WestJet Elevation YYC (Rocky Mountain Soap Company). Everywhere else, bring a travel kit if you have preferences.</p></li>
  <li><p><em>You do not need to bring a towel.</em> Every Canadian airport lounge with shower access provides towels — bath towel and floor mat at minimum. The WestJet Elevation YYC also provides a hand towel on a heated rack. You will not need your own.</p></li>
  <li><p><em>No hard time limits — but keep it to 20 minutes if there is a queue.</em> None of the reviewed Canadian lounges impose a hard time limit on shower use. Staff generally do not knock unless there is a significant delay. If you can see people waiting, 20 minutes is the reasonable courtesy guideline used by frequent lounge travellers.</p></li>
</ol>

<h2>Frequently Asked Questions: Airport Lounge Showers in Canada</h2>

<h3>Which Canadian airport lounge has the best shower?</h3>
<p>The Cathay Pacific Lounge at Vancouver International Airport (YVR) has the finest shower experience in Canada — two private limestone-clad suites with Aesop bath products, rain showers, and brass fixtures. Access requires a Cathay Pacific or oneworld Business/First class ticket or elite status. For Priority Pass holders, the SkyTeam Lounge at YVR is the best free option with two full oversized suites at no extra charge.</p>

<h3>Can I use a Priority Pass lounge shower for free in Canada?</h3>
<p>Yes, at several locations. The SkyTeam Lounge at YVR, the Air France Lounge by Plaza Premium at YUL, the WestJet Elevation Lounge at YYC, and multiple Plaza Premium locations at YYZ all include shower access at no additional charge for Priority Pass members. Plaza Premium Pier B at YVR charges a $25 CAD shower surcharge on top of free lounge entry.</p>

<h3>Does the Air Canada Maple Leaf Lounge in Calgary have a shower?</h3>
<p>No. The Air Canada Maple Leaf Lounge at Calgary International Airport (YYC) does not have shower facilities. The only lounge with showers in Calgary is the WestJet Elevation Lounge, which accepts Priority Pass, DragonPass, and WestJet status members. Showers there are by appointment — register at the front desk as soon as you arrive.</p>

<h3>Do I need to bring my own towel to an airport lounge shower in Canada?</h3>
<p>No. Every Canadian airport lounge with shower access provides at least a bath towel and floor mat. Most also provide a hand towel. You do not need to bring your own. If product quality matters to you, bring your own toiletry kit — most lounges use unbranded wall-mounted dispensers, with the Cathay Pacific Lounge (Aesop) and WestJet Elevation YYC (Rocky Mountain Soap Company) as the notable exceptions.</p>

<h3>How long is the wait for a shower at a Canadian airport lounge?</h3>
<p>It depends on the lounge and time of day. Early morning before 7 AM is consistently low-wait at all reviewed locations. Mid-morning at the WestJet Elevation YYC and the AC MLL YYZ International can involve a 90-minute wait. At the SkyTeam Lounge at YVR, the peak window of 10 AM to 2 PM sees the highest shower demand. Arriving early and registering at the desk immediately is the most reliable strategy across all locations.</p>

<h3>Is the Plaza Premium shower at YVR free for Priority Pass members?</h3>
<p>Partially. Priority Pass covers lounge entry at standard Plaza Premium locations at YVR at no charge. However, the shower is an additional $25 CAD on top of that free entry at Plaza Premium Pier B. Plaza Premium First (PPF) at Gate D67–D68 is the premium-tier lounge where showers are included — but PPF requires a separate entry fee from approximately $110 CAD, which Priority Pass does not cover.</p>

<h3>Can I shower at an airport lounge if I am only flying domestically in Canada?</h3>
<p>Yes, at certain locations. WestJet Elevation YYC, Plaza Premium Pier B at YVR (with shower surcharge), the AC Maple Leaf Lounge domestics at YYZ and YVR, and multiple Plaza Premium locations at YYZ all serve domestic passengers and have shower access. The SkyTeam Lounge and the Air France Lounge at YUL are international-only and not available for domestic or US transborder flights.</p>

<p><em>All amenity details in this guide are accurate as of June 2026. Lounge facilities, access policies, and shower availability are subject to change — always confirm with the lounge directly or check the Priority Pass app before travelling.</em></p>
`

const guestFeesContent = `
<p><em>Priority Pass, DragonPass, Air Canada Maple Leaf, WestJet Elevation, Desjardins Odyssey — every guest fee spelled out. Updated June 2026.</em></p>

<p>You have lounge access. Maybe through a premium credit card, a Priority Pass membership, or Aeroplan elite status. Then your travel companion shows up — and you realize you have no idea what bringing them inside is going to cost.</p>

<p>Canadian airport lounges do not use a single guest fee system. Priority Pass, DragonPass, Air Canada, WestJet, and independent lounges each have their own rules, and those rules change depending on which card you used to get in. A guest who costs you nothing at one lounge can cost $65 CAD at the next terminal over.</p>

<p>This guide covers every guest fee structure in use at Canadian airports today — with the specific dollar amounts, which cards give you a free guest visit, and the seven traps that catch even experienced travellers off guard.</p>

<h2>Guest Fee Quick-Reference Table</h2>

<p>All fees quoted in USD where networks set them (Priority Pass and DragonPass bill in USD). CAD fees are lounge-specific walk-in rates.</p>

<table style="width:100%; border-collapse:collapse; font-size:0.9em;">
  <thead>
    <tr style="background:#1a2e44; color:#ffffff;">
      <th style="padding:10px 12px; text-align:left; width:35%;">Lounge / Network</th>
      <th style="padding:10px 12px; text-align:left; width:35%;">Your Access Method</th>
      <th style="padding:10px 12px; text-align:left; width:30%;">Guest Fee</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#ffffff;">
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Priority Pass lounge (any Canadian airport)</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">PP Standard, Standard+, or Prestige direct membership</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">$35 USD per guest per visit</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Priority Pass lounge</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Amex Platinum Canada ($799 card)</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">1st guest FREE; additional guests ~$35 USD each</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Priority Pass lounge</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Amex Aeroplan Reserve ($599 card)</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">1st guest FREE (PP lounges only)</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Priority Pass lounge</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">TD/CIBC Aeroplan VIP or most other Canadian cards</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">$35 USD per guest</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">DragonPass lounge (Visa Airport Companion)</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Scotiabank Passport VI / CIBC Aventura VIP / BMO Ascend WE</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">$32 USD per extra visit — pool is shared with guests</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Air Canada Maple Leaf (domestic or US transborder)</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">TD/CIBC Aeroplan VIP or Amex Aeroplan Reserve</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">1 guest FREE (TD/CIBC benefit through Dec 2026)</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Air Canada Maple Leaf (any location)</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Walk-in / no card benefit</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">$59 CAD per guest</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Air Canada Maple Leaf</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">One-Time Guest Pass (earned via card spend)</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">FREE — domestic and US transborder MLL only; not valid at international MLL</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">WestJet Elevation (YVR and YYC)</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Any Priority Pass card</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">You enter free; guest pays $59–$65 CAD + GST walk-in rate</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">WestJet Elevation</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Walk-in (WestJet boarding pass)</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">$59 CAD + GST adult / $30 CAD + GST child (2–17) / FREE under 2</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Desjardins Odyssey (YUL — DragonPass only)</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Walk-in (any airline)</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">$42 CAD adult / $26 CAD child (3–11) / FREE under 3</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Plaza Premium First (YVR Gate D67)</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Standard Priority Pass</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Upcharge required even for cardholder — not covered by standard PP</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Plaza Premium (standard locations)</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">Priority Pass member</td>
      <td style="padding:10px 12px; border-bottom:1px solid #e0e0e0; vertical-align:top;">$35 USD per guest</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:10px 12px; vertical-align:top;">AC Signature Suite (YVR, YYZ, YUL International)</td>
      <td style="padding:10px 12px; vertical-align:top;">Any pass or status</td>
      <td style="padding:10px 12px; vertical-align:top;">No guest access — Business class ticket required for all occupants</td>
    </tr>
  </tbody>
</table>

<figure>
  <img src="/blog/couple-checking-in-lounge.png" alt="Two travellers checking into a Canadian airport lounge together" loading="lazy" />
  <figcaption>Guest fees vary significantly depending on which lounge network and which card you use — knowing the rules before you travel saves money at the door</figcaption>
</figure>

<h2>Priority Pass Guest Fees in Canada</h2>

<p>Priority Pass covers the majority of independent lounges in Canada — all standard Plaza Premium locations, the SkyTeam Lounge at YVR, and the WestJet Elevation Lounges at both YVR and YYC. What your guest costs depends entirely on how you got your membership.</p>

<h3>If you bought Priority Pass directly</h3>

<p>All three direct-purchase tiers — Standard, Standard Plus, and Prestige — charge the same flat guest fee: $35 USD per guest per visit. There is no first-guest-free benefit on any direct-purchase tier. Every guest, every time, costs $35 USD.</p>

<h3>If your card includes Priority Pass as a benefit</h3>

<p>Most Canadian premium travel cards bundle a Priority Pass membership, but the guest rules attached to that membership vary by card — and they are often different from what the same card offers in the United States.</p>

<table style="width:100%; border-collapse:collapse; font-size:0.88em;">
  <thead>
    <tr style="background:#1a2e44; color:#ffffff;">
      <th style="padding:9px 10px; text-align:left; width:38%;">Credit Card</th>
      <th style="padding:9px 10px; text-align:center; width:12%;">Annual Fee</th>
      <th style="padding:9px 10px; text-align:left; width:25%;">PP Visits Included</th>
      <th style="padding:9px 10px; text-align:left; width:25%;">Guest Policy</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Amex Platinum (Canada)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">$799</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Unlimited</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">1 guest FREE per visit; additional at ~$35 USD each</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Amex Aeroplan Reserve</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">$599</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Unlimited PP + unlimited MLL</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">1 PP guest FREE; 1 MLL guest FREE</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">TD Aeroplan Visa Infinite Privilege</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">$599</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Unlimited MLL + 6 DragonPass</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">1 MLL guest FREE; DragonPass pool shared with guests</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">CIBC Aeroplan Visa Infinite Privilege</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">$599</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Unlimited MLL + 6 DragonPass</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Same as TD Aeroplan VIP</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Scotiabank Passport Visa Infinite</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">$150</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">6 DragonPass</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">6 visits shared with guests; $32 USD per extra</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Scotiabank Passport Visa Infinite Privilege</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">$599</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">10 DragonPass</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">10 visits shared with guests; $32 USD per extra</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">CIBC Aventura Visa Infinite Privilege</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">$599</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">6 DragonPass</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">6 visits shared with guests; $32 USD per extra</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">BMO Ascend World Elite MC</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">$150</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">4 DragonPass</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">4 visits shared with guests; $32 USD per extra</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px;">Chase Sapphire Reserve (US card, usable in Canada)</td>
      <td style="padding:9px 10px; text-align:center;">$795 USD</td>
      <td style="padding:9px 10px;">Unlimited PP</td>
      <td style="padding:9px 10px;">1 guest FREE; additional ~$60 CAD equivalent</td>
    </tr>
  </tbody>
</table>

<blockquote style="border-left: 4px solid #c8a96e; margin: 24px 0; padding: 14px 20px; background: #faf7f2;">
<p>Canadian Amex Platinum is not the same as American Amex Platinum. The US version gives 2 free guests per visit. The Canadian version gives 1. If you have been reading US cardholder forums or comparison sites, double-check the Canadian benefit guide before you travel with two companions.</p>
</blockquote>

<figure>
  <img src="/blog/premium-credit-cards-priority-pass.png" alt="Canadian travel credit card and Priority Pass membership card used for airport lounge access" loading="lazy" />
  <figcaption>The guest fee you pay depends on your card, not just the lounge — and the rules vary significantly across Canadian issuers</figcaption>
</figure>

<h2>DragonPass and the Visa Airport Companion — The Pool Problem</h2>

<p>DragonPass is the network behind the Visa Airport Companion program used by Scotiabank, CIBC, and BMO cards in Canada. It looks like Priority Pass but works very differently when guests are involved.</p>

<h3>How the shared visit pool works</h3>

<p>When a card advertises six complimentary visits, that is not six visits for you plus six for each guest. It is a combined pool. If you bring one guest, you both enter — but that counts as two visits from your allocation, leaving you four remaining. Once the pool runs out, every subsequent visit for anyone costs $32 USD per person.</p>

<p>Some cards issue separate allocations to supplementary cardholders rather than drawing from the primary holder's pool. This varies by issuer and product year — check your specific card's benefit guide before assuming your companion draws from a separate pool.</p>

<blockquote style="border-left: 4px solid #c8a96e; margin: 24px 0; padding: 14px 20px; background: #faf7f2;">
<p>To stretch a DragonPass allocation: use visits solo when travelling without a companion to preserve the pool. If your guest also holds an eligible card, have them enter on their own allocation rather than yours. Supplementary cardholders on some Scotiabank Passport VIP cards get their own separate allocation — worth checking against the extra card fee.</p>
</blockquote>

<p>DragonPass lounges in Canada largely overlap with Priority Pass lounges — most Plaza Premium locations, WestJet Elevation, and the SkyTeam Lounge at YVR are accessible through both networks. One major exception: Desjardins Odyssey lounges at YUL are DragonPass only. Priority Pass members cannot use them regardless of tier.</p>

<h2>Air Canada Maple Leaf Lounge Guest Fees</h2>

<p>The Maple Leaf Lounge is Air Canada's own network, entirely separate from Priority Pass. Access comes through Aeroplan elite status, a premium credit card, or walk-in payment. Guest fees vary substantially depending on how you got in.</p>

<p>The walk-in guest fee is $59 CAD per person, at any Maple Leaf Lounge in Canada — YVR, YYZ, YUL, YYC, or any other location. There is no online pre-purchase for walk-in guests. You pay at the desk.</p>

<h3>Who gets a free guest at the Maple Leaf Lounge</h3>

<table style="width:100%; border-collapse:collapse; font-size:0.88em;">
  <thead>
    <tr style="background:#1a2e44; color:#ffffff;">
      <th style="padding:9px 10px; text-align:left; width:50%;">Access Method</th>
      <th style="padding:9px 10px; text-align:left; width:50%;">Free Guest Entitlement</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Aeroplan 50K+ status (Super Elite, Elite, 50K)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Spouse/partner + up to 5 children under 24 + 1 additional guest FREE</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Star Alliance Gold (flying non-AC carrier)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">1 guest FREE</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">TD or CIBC Aeroplan Visa Infinite Privilege ($599)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">1 guest FREE — time-limited extension currently through Dec 2026</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Amex Aeroplan Reserve ($599)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">1 guest FREE at MLL</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">AC One-Time Guest Pass (earned via card spend)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">1 guest FREE — domestic and US transborder MLL only; not valid at international MLL</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Chase Sapphire Reserve (US card)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">1 guest FREE at eligible lounges</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Business class same-day ticket (Air Canada)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">All travelling companions in business class</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px;">Walk-in or no qualifying benefit</td>
      <td style="padding:9px 10px;">$59 CAD per guest — no exceptions</td>
    </tr>
  </tbody>
</table>

<h3>The Air Canada One-Time Guest Pass — and where it does not work</h3>

<p>Air Canada's One-Time Guest Pass is an underused benefit earned through Aeroplan credit card spending: one pass per $10,000 CAD spent on an eligible card, up to four passes per year. The pass admits one guest when the cardholder is also present.</p>

<p>The critical limitation: One-Time Guest Passes are explicitly excluded from the Maple Leaf Lounge International locations — YVR Gate D, YYZ Gate F, and YUL International. They are valid at domestic and US transborder Maple Leaf Lounges only. If you are flying internationally and attempt to use one, it will be declined at the door.</p>

<h3>The TD and CIBC free guest benefit — a time-limited extension</h3>

<p>The one-free-guest benefit on the TD and CIBC Aeroplan Visa Infinite Privilege cards has existed since approximately 2023 as a time-limited annual extension from Air Canada. The current extension runs through December 2026. It has been renewed every year it has existed, but it is worth confirming on your card's current benefits page before travelling with a guest — particularly if you are reading this after mid-2026.</p>

<h3>The Signature Suite — no guests, no exceptions</h3>

<p>The AC Signature Suite, located within the MLL International at YVR Gate D52, YYZ, and YUL, admits only passengers booked in Business Class on an intercontinental Air Canada flight departing the same day. No credit card, no status, no guest pass overrides this. The only way to bring a companion is if they are also ticketed in Business Class on the same flight.</p>

<h2>WestJet Elevation Lounge Guest Fees (YVR and YYC)</h2>

<p>WestJet operates Elevation Lounges at Vancouver (YVR Pier B) and Calgary (YYC Concourse B). Both accept Priority Pass for the cardholder — but Priority Pass covers entry for the cardholder only. Guests always pay WestJet's own walk-in pricing, regardless of your PP tier or card.</p>

<table style="width:100%; border-collapse:collapse; font-size:0.88em;">
  <thead>
    <tr style="background:#1a2e44; color:#ffffff;">
      <th style="padding:9px 10px; text-align:left; width:30%;">Guest Type</th>
      <th style="padding:9px 10px; text-align:center; width:35%;">WestJet Boarding Pass</th>
      <th style="padding:9px 10px; text-align:center; width:35%;">Other Airline Boarding Pass</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Adult</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">$59 CAD + GST</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">$65 CAD + GST</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Child (ages 2–17)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">$30 CAD + GST</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">$33 CAD + GST</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px;">Infant (under 2)</td>
      <td style="padding:9px 10px; text-align:center;">FREE</td>
      <td style="padding:9px 10px; text-align:center;">FREE</td>
    </tr>
  </tbody>
</table>

<p>This applies even to Amex Platinum cardholders, who normally receive one free guest at Priority Pass lounges. WestJet's own pricing schedule is explicit — the PP guest benefit does not extend to the Elevation Lounge. If you are planning to bring a companion to WestJet Elevation, budget for the walk-in rate regardless of your card.</p>

<figure>
  <img src="/blog/couple-enjoying-lounge.png" alt="Two travellers in a WestJet Elevation Lounge at a Canadian airport" loading="lazy" />
  <figcaption>WestJet Elevation Lounges at YVR and YYC charge guests the walk-in rate even when you enter on a Priority Pass card</figcaption>
</figure>

<h2>Desjardins Odyssey Lounges at YUL — DragonPass Only</h2>

<p>Desjardins operates two Odyssey Lounges at Montreal-Trudeau (YUL) — one domestic, one international. These are among the most underrated lounges in Canada, but they are only accessible through DragonPass (Visa Airport Companion). Priority Pass members cannot use them regardless of membership tier.</p>

<h3>Walk-in guest fees</h3>

<table style="width:100%; border-collapse:collapse; font-size:0.88em;">
  <thead>
    <tr style="background:#1a2e44; color:#ffffff;">
      <th style="padding:9px 10px; text-align:left; width:50%;">Guest Age</th>
      <th style="padding:9px 10px; text-align:left; width:50%;">Walk-In Fee (before tax)</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Age 12 and over</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">$42 CAD</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Ages 3 to 11</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">$26 CAD</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px;">Under 3 years old</td>
      <td style="padding:9px 10px;">FREE</td>
    </tr>
  </tbody>
</table>

<h3>Desjardins cardholder discounts</h3>

<p>Desjardins cardholders receive meaningful discounts beyond the walk-in rate. The Odyssey Gold Visa gives 50% off the walk-in rate for the cardholder and one companion, plus up to three children under 18. The Odyssey World Elite Mastercard includes eight free passes per year with 50% off after the allocation is used. The Odyssey Visa Infinite Privilege includes twelve free passes per year, again with 50% off after that. The cardholder's pass covers the cardholder and one companion — family pricing is built into the discount structure.</p>

<h2>Plaza Premium First — The YVR Gate D67 Upcharge</h2>

<p>Plaza Premium operates more lounges at Canadian airports than any other independent operator — with standard locations at YVR, YYZ, YUL, YYC, YEG, and more. All standard Plaza Premium lounges are covered by Priority Pass and DragonPass at no additional charge, with guests paying the standard $35 or $32 USD fee.</p>

<p>The exception is Plaza Premium First at YVR Gate D67. This is a premium-tier lounge with enhanced food, private seating, and superior finishes. Standard Priority Pass access does not cover it — even Prestige-tier cardholders must pay an upcharge to enter, and guests pay an additional fee on top of that. Walk-in rates run approximately $80–120 CAD depending on time of day and booking method.</p>

<blockquote style="border-left: 4px solid #c8a96e; margin: 24px 0; padding: 14px 20px; background: #faf7f2;">
<p>If you want standard Plaza Premium access at YVR, the 24-hour International lounge, the US Transborder lounge at Gate E88, and the Domestic lounges at Pier B and Pier C are all fully covered by Priority Pass and DragonPass at no extra charge. Plaza Premium First at Gate D67 is a deliberate upsell — you may be directed toward it from the standard entrance if you are not paying attention.</p>
</blockquote>

<h2>Canadian Cards That Give You at Least One Free Guest Visit</h2>

<p>Only a handful of Canadian-issued cards provide a free guest benefit at any lounge network. If travelling with a companion regularly, these are the options worth knowing.</p>

<table style="width:100%; border-collapse:collapse; font-size:0.88em;">
  <thead>
    <tr style="background:#1a2e44; color:#ffffff;">
      <th style="padding:9px 10px; text-align:left; width:35%;">Card</th>
      <th style="padding:9px 10px; text-align:center; width:13%;">Annual Fee</th>
      <th style="padding:9px 10px; text-align:left; width:22%;">Free Guest At</th>
      <th style="padding:9px 10px; text-align:left; width:30%;">Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Amex Platinum (Canada)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">$799</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">PP lounges</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">1 free guest per visit; no limit on how often</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Amex Aeroplan Reserve</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">$599</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">PP lounges + AC MLL</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">1 free PP guest; 1 free MLL guest</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">TD Aeroplan Visa Infinite Privilege</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">$599</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">AC MLL only</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">1 free MLL guest; time-limited through Dec 2026</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">CIBC Aeroplan Visa Infinite Privilege</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">$599</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">AC MLL only</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Same as TD Aeroplan VIP</td>
    </tr>
    <tr style="background:#ffffff;">
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">Chase Sapphire Reserve (US card, usable in Canada)</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0; text-align:center;">$795 USD</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">PP lounges</td>
      <td style="padding:9px 10px; border-bottom:1px solid #e0e0e0;">1 free guest; additional ~$60 CAD equivalent</td>
    </tr>
    <tr style="background:#f7f9fb;">
      <td style="padding:9px 10px;">Aeroplan 50K+ status (no card required)</td>
      <td style="padding:9px 10px; text-align:center;">n/a</td>
      <td style="padding:9px 10px;">AC MLL only</td>
      <td style="padding:9px 10px;">Spouse + up to 5 children + 1 extra guest FREE</td>
    </tr>
  </tbody>
</table>

<p>BMO Ascend, Scotiabank Passport, and CIBC Aventura cards are not on this list. They do not include a free guest benefit — your guest's entry draws from the same shared visit pool as yours.</p>

<figure>
  <img src="/blog/air-canada-maple-leaf-lounge.png" alt="Two travellers in an Air Canada Maple Leaf Lounge at a Canadian airport" loading="lazy" />
  <figcaption>Only a handful of Canadian credit cards provide a genuinely free guest benefit at the Air Canada Maple Leaf Lounge</figcaption>
</figure>

<h2>7 Guest Fee Traps Nobody Warns You About</h2>

<p>Each of these has cost real travellers money — usually at the lounge entrance with no time to fix it.</p>

<ol>
  <li>
    <p><em>Canadian Amex Platinum gives 1 free guest, not 2.</em> US comparison sites and cardholder forums consistently state the Amex Platinum provides 2 free guests per visit. That is the US benefit. The Canadian card gives 1. If you are reading US sources to research Canadian cards, verify against the Canadian benefit guide specifically.</p>
  </li>
  <li>
    <p><em>DragonPass pool visits are shared, not per person.</em> A card advertising 6 complimentary visits means 6 combined entries for you and any guests combined. Bring a friend and you have used 2 of your 6, leaving 4 for the rest of the year. Many cardholders do not realize this until they are turned away mid-trip with an exhausted allocation.</p>
  </li>
  <li>
    <p><em>AC One-Time Guest Passes do not work at international Maple Leaf Lounges.</em> These passes — earned at $10,000 CAD spent per pass — are explicitly excluded from the MLL International at YVR Gate D, YYZ Gate F, and YUL International. Attempting to use one on an international departure will be declined. Domestic and US transborder only.</p>
  </li>
  <li>
    <p><em>Desjardins Odyssey at YUL does not accept Priority Pass.</em> Both Odyssey Lounges in Montreal are DragonPass only. If you transit through YUL regularly and carry only a Priority Pass, you have no access regardless of your membership tier.</p>
  </li>
  <li>
    <p><em>WestJet Elevation charges your guest walk-in rates even with Amex Platinum.</em> Priority Pass covers the cardholder only at WestJet Elevation. The PP free-guest benefit that normally applies at most other lounges does not extend here. Your companion pays $59–$65 CAD + GST regardless of which card you are holding.</p>
  </li>
  <li>
    <p><em>The TD and CIBC Aeroplan VIP free-guest benefit is not permanent.</em> The one-free-guest benefit at MLL is a time-limited annual extension from Air Canada, not a permanent card feature. It has been renewed every year since approximately 2023 and runs through December 2026. Confirm it is still active on your card's current benefits page before you count on it.</p>
  </li>
  <li>
    <p><em>The AC Signature Suite has no guest mechanism whatsoever.</em> No credit card, elite status, or pass overrides the Business Class ticket requirement. Both you and your companion must hold a same-day Business Class ticket on an intercontinental Air Canada flight. There is no workaround.</p>
  </li>
</ol>

<h2>Which Card Gets You and Your Guest In for the Least</h2>

<p>If you travel regularly with a companion, here is how the major options stack up.</p>

<p><em>Best for unlimited free-guest access at Priority Pass lounges:</em> The Amex Platinum Canada at $799 per year gives unlimited PP visits for the cardholder plus one free guest on every visit. Additional guests pay around $35 USD each. If you travel as a pair and visit lounges more than a few times a year, this is the only Canadian card that makes every PP visit effectively free for two people.</p>

<p><em>Best for Air Canada Maple Leaf plus PP guest coverage:</em> The Amex Aeroplan Reserve at $599 per year covers both networks — unlimited MLL access with one free MLL guest, plus unlimited PP with one free PP guest. If you fly Air Canada frequently and want full coverage across both networks on a single card, this is the most comprehensive option.</p>

<p><em>Best entry-level option with any lounge access:</em> The Scotiabank Passport Visa Infinite at $150 per year includes six DragonPass visits shared between you and a guest, with a $32 USD overage fee per additional visit. No free-guest benefit, but at $150 the math often still works if you only visit lounges a few times a year as a pair.</p>

<p><em>Best for families flying Air Canada with status:</em> Aeroplan 50K+ status combined with a TD or CIBC Aeroplan VIP card gives unlimited MLL access, immediate family free, and one extra guest free — on top of the DragonPass allocation on the card. This is the highest-value scenario for families travelling regularly on Air Canada routes.</p>

<blockquote style="border-left: 4px solid #c8a96e; margin: 24px 0; padding: 14px 20px; background: #faf7f2;">
<p>Quick decision guide: At a PP lounge with Amex Platinum Canada — your first guest is free, second and beyond pay ~$35 USD each. At a PP lounge with any other Canadian card — every guest pays ~$35 USD. At an Air Canada MLL with Amex Reserve or TD/CIBC VIP — first guest is free. At an MLL with no qualifying benefit — $59 CAD per guest. At WestJet Elevation with any PP card — your guest always pays $59–$65 CAD + GST. At Desjardins Odyssey with Priority Pass — not accepted at all.</p>
</blockquote>

<h2>Frequently Asked Questions: Airport Lounge Guest Fees in Canada</h2>

<h3>How much does it cost to bring a guest to a Priority Pass lounge in Canada?</h3>
<p>The standard guest fee at any Priority Pass lounge in Canada is $35 USD per person per visit. This applies whether you hold a direct Priority Pass membership or access through most Canadian credit cards. The exception is the Amex Platinum Canada and the Amex Aeroplan Reserve, both of which include one free guest per visit at PP lounges.</p>

<h3>Does Amex Platinum Canada give free guest access to airport lounges?</h3>
<p>Yes — the Canadian Amex Platinum ($799 annual fee) includes one free guest per visit at Priority Pass lounges, with no limit on how many times you can use it. A second or third guest pays the standard ~$35 USD each. Note that this is different from the US Amex Platinum, which provides two free guests per visit.</p>

<h3>Can I bring a guest to the Air Canada Maple Leaf Lounge for free?</h3>
<p>Yes, if you hold the right card or status. The Amex Aeroplan Reserve, TD Aeroplan Visa Infinite Privilege, and CIBC Aeroplan Visa Infinite Privilege all include one free MLL guest. Aeroplan 50K+ status holders can bring their immediate family and one additional guest free. Anyone else pays $59 CAD per guest at the door.</p>

<h3>Does my Priority Pass cover a guest at WestJet Elevation lounges?</h3>
<p>No. WestJet Elevation accepts Priority Pass for the cardholder's entry only. Guests pay WestJet's own walk-in rate — $59 CAD + GST for adults with a WestJet boarding pass, $65 CAD + GST with any other airline's boarding pass. This applies even to Amex Platinum cardholders, who would normally receive one free PP guest at other lounges.</p>

<h3>What is the DragonPass visit pool and how does it affect guest fees?</h3>
<p>DragonPass cards that include a set number of complimentary visits — such as 6 visits on the Scotiabank Passport Visa Infinite — share that allocation between the cardholder and any guests. Bringing one guest on a single trip uses two visits from your pool. Once the pool is exhausted, every subsequent entry costs $32 USD per person. This catches many cardholders off guard mid-year.</p>

<h3>Can I use an Air Canada One-Time Guest Pass at an international Maple Leaf Lounge?</h3>
<p>No. AC One-Time Guest Passes — earned at a rate of one pass per $10,000 CAD spent on an eligible Aeroplan card, up to four per year — are only valid at domestic and US transborder Maple Leaf Lounges. They are explicitly excluded from the international MLL locations at YVR Gate D, YYZ Gate F, and YUL International. Attempting to use one before an international flight will be declined.</p>

<h3>Does Priority Pass work at the Desjardins Odyssey Lounges in Montreal?</h3>
<p>No. The Desjardins Odyssey Lounges at Montreal-Trudeau (YUL) accept DragonPass (Visa Airport Companion) only. Priority Pass members have no access to these lounges regardless of membership tier. If you travel through YUL regularly and want Odyssey Lounge access, a Desjardins card or a card with DragonPass access is required.</p>

<h3>Are guest fees at Canadian airport lounges charged in CAD or USD?</h3>
<p>It depends on the network. Priority Pass and DragonPass charge guest fees in USD — currently around $35 USD and $32 USD respectively — which will appear on your statement converted to CAD at the rate used on the day of the visit. Walk-in guest fees at Air Canada Maple Leaf, WestJet Elevation, and Desjardins Odyssey are set in CAD.</p>

<p><em>All fees and benefit details in this guide are accurate as of June 2026. Lounge access policies, guest fee structures, and credit card benefits are subject to change — always confirm with your card issuer and the lounge operator before travelling with a guest.</em></p>

`

const amexPlatinumContent = `
<p data-speakable="intro"><strong>The Canadian Platinum Card from American Express costs $799 a year. It opens Plaza Premium, Priority Pass Select, Aspire, Centurion and Delta Sky Club lounges plus other partners. Through December 31, 2026 Plaza Premium and Priority Pass visits are unlimited, with one guest included. From January 1, 2027 those two networks are capped at 6 visits each per year (2 each on a supplementary card) unless you spend $20,000 in a calendar year. Amex is already counting 2026 spend. There are no Centurion Lounges in Canada, Delta Sky Club needs a same-day Delta flight, and the card does not open Maple Leaf Lounges. After the $200 travel and $200 dining credits, the net cost is about $399 — roughly 8 lounge entries a year at $50 each.</strong></p>

<p>You are not paying $799 for a card. You are paying for a quieter place to sit before a flight, and the fee is fair only if you use it. This guide answers the questions people actually search: which lounges the card opens in Canada, how many guests you can bring, what the January 2027 cap means, and how many visits it takes to come out ahead.</p>

<h2>Amex Platinum lounge access at a glance</h2>

<table>
  <thead>
    <tr><th>Network</th><th>Where it matters for Canadians</th><th>Visits in 2026</th><th>Visits from Jan 1, 2027</th><th>Guests</th></tr>
  </thead>
  <tbody>
    <tr><td>Plaza Premium</td><td>Toronto Pearson, Vancouver, Edmonton, Winnipeg — plus Asia, UK and Middle East hubs</td><td>Unlimited</td><td>6 / year (2 on a supplementary card)*</td><td>1 included through 2026; uses a visit from 2027</td></tr>
    <tr><td>Priority Pass Select</td><td>Most independent lounges worldwide; enrolment required</td><td>Unlimited</td><td>6 / year (2 supplementary)*</td><td>1 included through 2026; uses a visit from 2027</td></tr>
    <tr><td>Aspire / Swissport</td><td>Calgary, Montreal, Ottawa, Halifax, Winnipeg; many European airports</td><td>Unlimited</td><td>Unlimited</td><td>Usually 1 companion — confirm on the lounge page</td></tr>
    <tr><td>Centurion Lounges</td><td>None in Canada. Nearest: Seattle, New York JFK / LaGuardia, plus 20+ US and international sites</td><td>Unlimited</td><td>Unlimited</td><td>Up to 2 for Canadian cardholders</td></tr>
    <tr><td>Delta Sky Club</td><td>US hubs, only when flying Delta same day, within 3 hours of departure</td><td>Unlimited</td><td>Unlimited</td><td>None included; pay per guest</td></tr>
    <tr><td>Lufthansa lounges</td><td>Frankfurt, Munich, other Lufthansa Group airports</td><td>Ends Oct 1, 2026</td><td>Not included</td><td>n/a</td></tr>
  </tbody>
</table>

<p><em>*Unlimited again for the rest of the year and the whole following year once $20,000 is spent on the account in a calendar year. Verified September 11, 2026.</em></p>

<h2>The major lounge-access change coming in 2027</h2>

<p>In October 2025, American Express Canada put a cap on the two busiest networks on the card. From January 1, 2027, a basic cardholder gets 6 Plaza Premium visits and 6 Priority Pass visits per calendar year. A supplementary cardholder gets 2 of each. Each person who walks in uses one visit, so a guest costs you a visit or pays the lounge's own entry fee.</p>

<p>There is an escape hatch: spend $20,000 on the account in a calendar year and access is unlimited for the rest of that year and all of the next. Amex is already counting 2026 spend, so $20,000 charged in 2026 buys unlimited access for 2027. That is about $1,670 a month. Centurion, Delta Sky Club, Aspire, Swissport and the other partner lounges keep their current rules.</p>

<table>
  <thead>
    <tr><th>Year and scenario</th><th>Plaza Premium visits</th><th>Priority Pass visits</th><th>Combined</th></tr>
  </thead>
  <tbody>
    <tr><td>2026, any spend level</td><td>Unlimited</td><td>Unlimited</td><td>Unlimited</td></tr>
    <tr><td>2027, spend under $20,000</td><td>6</td><td>6</td><td>12 combined visits</td></tr>
    <tr><td>2027, on a supplementary card</td><td>2</td><td>2</td><td>4 combined visits</td></tr>
    <tr><td>2027, after $20,000 spend in 2026</td><td>Unlimited</td><td>Unlimited</td><td>Unlimited</td></tr>
  </tbody>
</table>

<p>One more date matters: Lufthansa lounges leave the Global Lounge Collection on October 1, 2026. A Frankfurt or Munich connection after that will not open a Lufthansa Business Lounge with this card.</p>

<h2>Which airport lounges does Amex Platinum Canada include?</h2>

<h3>Plaza Premium lounges</h3>

<p>Plaza Premium is the network you will use most in Canada. It runs the independent lounges at Toronto Pearson, Vancouver, Edmonton and Winnipeg, and big hubs across Asia, London and the Middle East. Show your physical Platinum Card and a same-day boarding pass at the door. No enrolment is needed. Access is subject to space, and busy lounges do turn people away at peak times.</p>

<h3>Priority Pass Select lounges</h3>

<p>Priority Pass is the largest independent lounge program in the world. The Platinum Card includes a Priority Pass Select membership, but you must enrol first — through Amex chat or by phone. Then use the Priority Pass app or digital card at the lounge. Some Priority Pass locations now also accept the Platinum Card itself, but do not count on it: enrol before your first trip. Priority Pass restaurant credits are not part of the Amex version of the membership.</p>

<h3>Centurion Lounges</h3>

<p>Centurion Lounges are Amex's own. The food and design are a clear step above the rest of the collection. There are none in Canada. The closest for most Canadians are Seattle, New York JFK and LaGuardia, and the rest of the US network. You need a same-day boarding pass and can enter within 3 hours of departure. Canadian cardholders can bring up to two guests, which is more generous than the US card's current rule at many locations.</p>

<blockquote>
<p>Centurion guest rules have become a source of contradictory third-party reporting. American Express's Canadian benefits language allows up to two companions at US and selected international locations, but individual lounge rules can differ. Check the specific Centurion Lounge in the Amex lounge finder before you fly.</p>
</blockquote>

<h3>Delta Sky Clubs</h3>

<p>This is airline-conditional access, not general access. You get in only when flying Delta that day, within 3 hours of departure, or any time during a layover. No guests are included; Delta charges per guest at the door (roughly US$50 per person as of publication). For a Canadian who flies Air Canada or WestJet, this benefit is worth little.</p>

<h3>Aspire, Swissport and other partners</h3>

<p>Aspire runs the Platinum-eligible lounges at Calgary, Montreal (domestic), Ottawa and Halifax. Executive Lounges by Swissport cover many European and UK regional airports. Escape lounges are part of the broader collection where available. None of these are affected by the 2027 cap. Check each lounge's page in the Amex lounge finder for hours, terminal and guest policy before you go.</p>

<h2>Amex Platinum lounge guest rules</h2>

<table>
  <thead>
    <tr><th>Lounge</th><th>Guests included, 2026</th><th>Guests from 2027</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>Plaza Premium</td><td>1</td><td>Uses one of your visits</td><td>Children under 2 usually admitted with an adult</td></tr>
    <tr><td>Priority Pass Select</td><td>1</td><td>Uses one of your visits</td><td>Extra guests pay the lounge's fee</td></tr>
    <tr><td>Centurion Lounge</td><td>Up to 2</td><td>Up to 2</td><td>Canada-issued cards; same-day boarding pass</td></tr>
    <tr><td>Aspire (YYC, YUL, YOW, YHZ)</td><td>1 companion (varies)</td><td>1 companion (varies)</td><td>Confirm on the lounge page</td></tr>
    <tr><td>Delta Sky Club</td><td>0</td><td>0</td><td>Pay per guest; same-day Delta flight</td></tr>
  </tbody>
</table>

<p>A guest is anyone travelling with you, including your spouse and older children. Take a family of four. In 2026, one Platinum Card plus a supplementary card covers two people and two guests. In 2027 that same trip burns four visits from your two allotments.</p>

<h2>How to activate and use lounge access</h2>

<ol>
  <li><em>Enrol in Priority Pass now.</em> Open the Amex app or website, use chat, or call the number on the back of the card and ask for Priority Pass Select enrolment. Download the Priority Pass app and add the digital card. This is the step most new cardholders skip.</li>
  <li><em>Carry the physical Platinum Card.</em> Plaza Premium, Aspire and Centurion Lounges check the card itself plus a same-day boarding pass. A photo of the card is not accepted.</li>
  <li><em>Check the lounge finder before you leave home.</em> Amex Canada's lounge finder lists every eligible lounge with its terminal, hours and guest rule. Lounges close, move and change terms — Toronto Pearson lost its Terminal 1 international Plaza Premium on December 27, 2025.</li>
  <li><em>Arrive inside the entry window.</em> Centurion, Aspire and Delta lounges admit you within 3 hours of departure. Plaza Premium and Priority Pass lounges usually do not set a window but can refuse entry when full.</li>
  <li><em>Track your visits from 2027.</em> Amex will show remaining visits in your account. Two networks, two counters. A guest counts.</li>
</ol>

<h2>Which Canadian airports have useful coverage?</h2>

<h3>Toronto Pearson (YYZ)</h3>

<ul>
  <li><strong>Terminal 1 domestic and transborder:</strong> Plaza Premium lounges in both zones, plus the Plaza Premium Infield lounge for bus-gate flights.</li>
  <li><strong>Terminal 1 international:</strong> the Plaza Premium lounge near Gate E77 closed on December 27, 2025 for a full rebuild. No reopening date as of September 11, 2026. Priority Pass lists no replacement in this zone — a T1 international departure currently has no Amex-eligible lounge.</li>
  <li><strong>Terminal 3:</strong> Plaza Premium domestic, international and transborder lounges. The KLM Crown Lounge is a Priority Pass option for international departures.</li>
</ul>

<p>No Maple Leaf Lounge access with this card, in either terminal.</p>

<h3>Vancouver (YVR)</h3>

<ul>
  <li><strong>Domestic:</strong> Plaza Premium at Gate B15 (full lounge, 5 am to 10 pm) and a smaller Plaza Premium outpost at Gate C29 built for short stays.</li>
  <li><strong>International and US departures:</strong> Plaza Premium options in these zones have changed several times. Check the finder for the current Priority Pass options.</li>
</ul>

<h3>Calgary (YYC)</h3>

<ul>
  <li><strong>International, Concourse D:</strong> Aspire Lounge, entry within 3 hours of departure.</li>
  <li><strong>Transborder (US), Concourse E:</strong> Aspire Lounge, 4:30 am to 7 pm.</li>
  <li><strong>Domestic:</strong> the WestJet Elevation Lounge admits Priority Pass cardholders only (no guests on the Priority Pass benefit) and only for domestic flights.</li>
</ul>

<p>No Maple Leaf Lounge access. Aspire visits are not part of the 2027 cap.</p>

<h3>Montreal-Trudeau (YUL) and Ottawa (YOW)</h3>

<ul>
  <li><strong>YUL Domestic:</strong> the Aspire American Express Lounge near Gates 1 and 2, 5 am to 9 pm, entry within 3 hours of departure.</li>
  <li><strong>YUL International:</strong> the National Bank Lounge near Gate 53 (an Aspire lounge), same 3-hour window. The Air France–KLM Lounge by Plaza Premium is also in the international zone, reserved for Air France and KLM passengers in the late afternoon.</li>
  <li><strong>YOW:</strong> Aspire Salon on Level 2 by Gate 18. Primary cardholder plus one travelling companion. Not available for US-bound departures after pre-clearance.</li>
</ul>

<h2>Does Amex Platinum include Maple Leaf Lounge access?</h2>

<p>No, and this is the most common misunderstanding about the card. Air Canada's Maple Leaf Lounges are not in the Global Lounge Collection. The Platinum Card earns Membership Rewards points that convert to Aeroplan, but points are not lounge access.</p>

<p>If Maple Leaf Lounge access is the goal, the cards that deliver it are the American Express Aeroplan Reserve Card ($599) and the TD Aeroplan Visa Infinite Privilege Card ($599) — both require a same-day Air Canada or Star Alliance flight. Many frequent flyers hold both: the Platinum for everything else, and an Aeroplan card for Maple Leaf Lounges.</p>

<h2>Is Amex Platinum worth $799 for lounge access?</h2>

<p>Start with the net cost. Most people find the $200 travel credit and the $200 dining credit easy to use. That brings the card down to $399. The NEXUS credit, hotel status and insurance are worth something too, but only you know how much. Then price a lounge entry: walk-in rates at Canadian independent lounges run roughly $45 to $85 per person. Plaza Premium walk-ins at Pearson and Vancouver are usually higher. $50 per entry is a fair, conservative number.</p>

<table>
  <thead>
    <tr><th>What you count against the fee</th><th>Net cost</th><th>Solo entries at $50</th><th>Couple trips at $100</th></tr>
  </thead>
  <tbody>
    <tr><td>Full fee, no credits used</td><td>$799</td><td>16</td><td>8</td></tr>
    <tr><td>Fee minus one $200 credit</td><td>$599</td><td>12</td><td>6</td></tr>
    <tr><td>Fee minus travel and dining credits</td><td>$399</td><td>8</td><td>4</td></tr>
  </tbody>
</table>

<blockquote>
<p><strong>The 2027 catch:</strong> without $20,000 of spend, a basic cardholder gets 12 capped visits across Plaza Premium and Priority Pass. Twelve visits at $50 is $600 — still above the $399 net cost. But a couple who fly together will use all twelve in six trips. Aspire, Centurion, Swissport and Delta visits are not capped, so a mixed lounge strategy stays viable.</p>
</blockquote>

<h3>Solo traveller</h3>
<p>Roughly 8 lounge entries a year at $50 each covers the $399 net cost. If you fly 6+ times a year through Canadian hubs where Plaza Premium is available, the card breaks even comfortably.</p>

<h3>Couple</h3>
<p>Four trips a year at two entries each covers the fee. Watch the 2027 cap: 12 combined visits is six couple trips. After that, Aspire and Centurion visits still count.</p>

<h3>Family</h3>
<p>Model extra guest charges and location rules. Beginning in 2027, guest entries at Plaza Premium and Priority Pass consume visit entitlements, so a six-visit allowance disappears fast. A $250 supplementary Platinum can give a second adult independent access, but the supplementary card's 2027 allowance is only 2+2 visits.</p>

<h2>Amex Platinum versus other Canadian lounge cards</h2>

<table>
  <thead>
    <tr><th>Card</th><th>Annual fee</th><th>Lounge access</th><th>Best for</th></tr>
  </thead>
  <tbody>
    <tr><td>Amex Platinum</td><td>$799</td><td>Global Lounge Collection; unlimited Plaza / Priority Pass in 2026, 6 + 6 from 2027 (unlimited with $20,000 spend)</td><td>Frequent flyers on any airline who use the credits</td></tr>
    <tr><td>Amex Business Platinum</td><td>$799</td><td>Same lounge terms as the personal card</td><td>Owners who can put business spend toward the $20,000</td></tr>
    <tr><td>Amex Aeroplan Reserve</td><td>$599</td><td>Maple Leaf Lounges on same-day Air Canada / Star Alliance flights</td><td>Air Canada loyalists</td></tr>
    <tr><td>TD Aeroplan Visa Infinite Privilege</td><td>$599</td><td>Unlimited Maple Leaf Lounge on Air Canada flights + 6 DragonPass visits</td><td>Air Canada flyers who also fly other airlines</td></tr>
    <tr><td>BMO eclipse Visa Infinite Privilege</td><td>$599</td><td>6 DragonPass visits; $200 annual lifestyle credit</td><td>BMO clients who want a flat credit</td></tr>
    <tr><td>CIBC Aventura Visa Infinite Privilege</td><td>$499</td><td>6 DragonPass visits</td><td>Higher-income CIBC clients ($150k personal / $200k household)</td></tr>
    <tr><td>RBC Avion Visa Infinite Privilege</td><td>$399</td><td>6 DragonPass visits</td><td>RBC clients who fly a few times a year</td></tr>
    <tr><td>Scotiabank Passport Visa Infinite</td><td>$150 (first year sometimes waived)</td><td>6 DragonPass visits; no foreign transaction fee</td><td>Occasional travellers who want no FX fee</td></tr>
    <tr><td>National Bank World Elite Mastercard</td><td>$150</td><td>Unlimited National Bank Lounge at Montreal + DragonPass</td><td>Montreal-based flyers</td></tr>
  </tbody>
</table>

<p><em>Fees and lounge terms verified September 11, 2026. DragonPass visits are per calendar year; extra visits cost about US$32 each. Income requirements apply to all Visa Infinite Privilege cards.</em></p>

<h2>Who should get the Amex Platinum — and who should not</h2>

<h3>Strengths</h3>
<ul>
  <li>Widest lounge network on any Canadian card: five networks, 1,550+ lounges.</li>
  <li>Unlimited Plaza Premium and Priority Pass visits through December 31, 2026 with one guest included.</li>
  <li>Centurion access with two guests when travelling through the US.</li>
  <li>$400 of credits most people can use naturally, cutting the real cost to about $399.</li>
  <li>Aspire and Swissport lounges are not affected by the 2027 cap.</li>
</ul>

<h3>Weaknesses</h3>
<ul>
  <li>$799 is the highest fee among Canadian lounge cards.</li>
  <li>No Maple Leaf Lounge access. No Centurion Lounge in Canada.</li>
  <li>From 2027, 6 + 6 Plaza / Priority Pass visits unless you spend $20,000 a year on the card.</li>
  <li>Priority Pass needs a separate enrolment many people forget.</li>
  <li>2.5% foreign exchange fee; the Scotiabank Passport charges none.</li>
</ul>

<h3>Verdict</h3>
<p>The Amex Platinum is still the best lounge card in Canada for one type of person: someone who flies often on more than one airline and will use the $200 travel and $200 dining credits. In 2026 the access is unlimited and the math is easy. In 2027 the card stays worth it for two groups. The first spends $20,000 a year on the card. The second needs fewer than twelve Plaza Premium and Priority Pass visits and leans on Aspire, Centurion or Swissport lounges for the rest. If you fly Air Canada almost exclusively, or fly less than five times a year, a cheaper card does the job.</p>

<h2>How to check access before every trip</h2>

<ul>
  <li>Is the lounge in my departure zone (domestic, transborder, or international) open today? Check the Amex Canada lounge finder.</li>
  <li>Am I inside the 3-hour window for Aspire, Centurion or Delta lounges?</li>
  <li>Do I have the physical Platinum Card, a same-day boarding pass, and (for Priority Pass) the app?</li>
  <li>From 2027: how many Plaza Premium and Priority Pass visits are left, and does my guest need one?</li>
  <li>Has Amex changed the terms since the "last verified" date on this article? The Platinum travel benefits page is the source of truth.</li>
</ul>

<h2>Sources</h2>

<ul>
  <li>American Express Canada — Platinum Card travel benefits (lounge networks, guest rules, 2027 terms). Accessed September 11, 2026.</li>
  <li>American Express Canada — The Platinum Card (annual fee, welcome offer, credits, earn rates). Accessed September 11, 2026.</li>
  <li>American Express Canada — Global Lounge Collection finder (YYZ T1 international closure, YVR B15 and C29, YYC Concourse D and E, YUL international, YOW Aspire Salon).</li>
  <li>Rewards Canada — Platinum Card lounge access benefit changes effective January 1, 2027.</li>
  <li>Prince of Travel — Amex Canada to limit lounge access for Platinum cardholders in 2027; Priority Pass and Centurion access guides.</li>
  <li>Milesopedia — Airport lounge access limit in 2027.</li>
  <li>LoyaltyLobby — Amex discontinues Lufthansa lounge access from October 1, 2026.</li>
  <li>Issuer pages for the comparison table: Amex Aeroplan Reserve, TD Aeroplan VIP, CIBC Aventura VIP, RBC Avion VIP, Scotiabank Passport Visa Infinite, National Bank World Elite Mastercard.</li>
</ul>

<p><em>All card benefits, fees, credits, welcome offers, lounge terms and rebate amounts in this guide reflect information current as of September 11, 2026. Rules change without notice — always confirm with American Express Canada and the lounge operator before travelling. Next scheduled review: January 2027, when the new visit caps take effect.</em></p>
`

const aeroplanCardsContent = `
<p data-speakable="intro"><strong>The three Canadian Aeroplan credit cards that unlock the Air Canada Maple Leaf Lounge — TD Aeroplan Visa Infinite Privilege, CIBC Aeroplan Visa Infinite Privilege, and American Express Aeroplan Reserve — compared side by side. Which is worth the fee, and which lounge benefits actually matter. Updated August 2026.</strong></p>

<p>The Air Canada Maple Leaf Lounge is the only major Canadian lounge network that Priority Pass, DragonPass, and Amex Platinum cannot open. To enter without an Air Canada Business Class ticket or Aeroplan Elite status, you need a qualifying Aeroplan credit card — and only three Canadian cards qualify: the TD Aeroplan Visa Infinite Privilege ($599 annual fee), the CIBC Aeroplan Visa Infinite Privilege ($599), and the American Express Aeroplan Reserve ($599).</p>

<p>All three carry the same $599 sticker price. All three grant access to Maple Leaf Lounges on same-day Air Canada flights. And all three throw in one guest per visit. But the details — earn rates, guest allowances at non-MLL lounges, sign-up bonuses, and how they interact with Priority Pass — differ enough that the wrong choice can cost hundreds of dollars over a year of travel.</p>

<p>This guide breaks down exactly which Aeroplan card is best for your travel pattern, what each unlocks at Canadian airports, and where the real value tradeoffs land in 2026.</p>

<h2>The Short Answer: Which Aeroplan Card for Lounge Access?</h2>

<blockquote>
<p><strong>Amex Aeroplan Reserve</strong> is the strongest lounge card of the three for most travellers because it stacks unlimited-guest Priority Pass Select on top of Maple Leaf Lounge access, which the two Visa Infinite Privilege cards do not. The <strong>TD Aeroplan Visa Infinite Privilege</strong> wins if you fly with a family — its four annual One-Time Guest Passes and higher Aeroplan earn rates on groceries and gas serve larger household spend. <strong>CIBC Aeroplan Visa Infinite Privilege</strong> is the tie-breaker for CIBC banking customers who want everything in one place.</p>
</blockquote>

<h2>Head-to-Head: All Three Cards at a Glance</h2>

<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>TD Aeroplan Visa Infinite Privilege</th>
      <th>CIBC Aeroplan Visa Infinite Privilege</th>
      <th>Amex Aeroplan Reserve</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Annual fee</td>
      <td>$599</td>
      <td>$599</td>
      <td>$599</td>
    </tr>
    <tr>
      <td>Maple Leaf Lounge access</td>
      <td>✅ Unlimited, same-day AC flights, +1 free guest</td>
      <td>✅ Unlimited, same-day AC flights, +1 free guest</td>
      <td>✅ Unlimited, same-day AC flights, +1 free guest</td>
    </tr>
    <tr>
      <td>One-Time MLL Guest Passes</td>
      <td>4 per year</td>
      <td>4 per year</td>
      <td>4 per year</td>
    </tr>
    <tr>
      <td>Priority Pass Select</td>
      <td>❌ Not included</td>
      <td>❌ Not included</td>
      <td>✅ Unlimited visits + unlimited free guests</td>
    </tr>
    <tr>
      <td>Air Canada Concierge phone line</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Annual worldwide companion pass</td>
      <td>Buy-one-get-one voucher within North America / Sun / Central America</td>
      <td>Buy-one-get-one voucher (limited routes)</td>
      <td>Not included at Reserve tier (upgrade to Amex Aeroplan Reserve Elite tier for this)</td>
    </tr>
    <tr>
      <td>Base earn rate on Air Canada / Aeroplan partners</td>
      <td>1.5x Aeroplan points</td>
      <td>2x Aeroplan points</td>
      <td>3x Aeroplan points</td>
    </tr>
    <tr>
      <td>Everyday earn (groceries, gas)</td>
      <td>1.5x</td>
      <td>1.5x on groceries; 1x elsewhere</td>
      <td>1.25x</td>
    </tr>
    <tr>
      <td>Foreign transaction fee</td>
      <td>2.5%</td>
      <td>2.5%</td>
      <td>2.5%</td>
    </tr>
    <tr>
      <td>NEXUS credit</td>
      <td>Every 48 months</td>
      <td>Every 48 months</td>
      <td>Every 48 months</td>
    </tr>
  </tbody>
</table>

<h2>Full Card Profiles</h2>

<h3>TD Aeroplan Visa Infinite Privilege — $599 / year</h3>

<p>The TD Aeroplan Visa Infinite Privilege is a strong all-around Aeroplan card, particularly for families and everyday spenders. It matches every other Aeroplan premium card on Maple Leaf Lounge access and One-Time Guest Passes, but its differentiators are outside the lounge: the annual companion voucher for a paid Air Canada flight, plus 1.5x Aeroplan points on eligible grocery, gas, and dining spend.</p>

<p><strong>Lounge benefits</strong></p>
<ul>
  <li>Unlimited Maple Leaf Lounge access on same-day Air Canada flights (Canada, US, and international)</li>
  <li>One free guest per visit</li>
  <li>Four Air Canada One-Time Guest Passes per year for domestic and US Transborder MLL entry</li>
  <li>No Priority Pass — Amex Platinum or Amex Aeroplan Reserve is required for that</li>
</ul>

<p><strong>Best for</strong></p>
<ul>
  <li>Travellers whose household spends heavily on groceries, gas, and dining (higher everyday earn)</li>
  <li>Frequent domestic Air Canada flyers who don't need Priority Pass abroad</li>
  <li>TD banking customers who want to consolidate</li>
</ul>

<h3>CIBC Aeroplan Visa Infinite Privilege — $599 / year</h3>

<p>The CIBC Aeroplan VIP mirrors the TD version on Maple Leaf Lounge access and One-Time Guest Passes but pushes harder on Aeroplan earn rates for Air Canada spend — 2x points on eligible Air Canada purchases vs 1.5x on the TD card. That difference matters if you buy a lot of Air Canada tickets on the card each year.</p>

<p><strong>Lounge benefits</strong></p>
<ul>
  <li>Unlimited Maple Leaf Lounge access on same-day Air Canada flights</li>
  <li>One free guest per visit</li>
  <li>Four Air Canada One-Time Guest Passes per year (domestic and US Transborder only)</li>
  <li>No Priority Pass — same limitation as the TD card</li>
</ul>

<p><strong>Best for</strong></p>
<ul>
  <li>Travellers who put significant Air Canada revenue spend on the card each year</li>
  <li>Existing CIBC banking customers</li>
</ul>

<h3>American Express Aeroplan Reserve — $599 / year</h3>

<p>The Amex Aeroplan Reserve is the only Canadian Aeroplan card that includes complimentary Priority Pass Select membership. That single feature is worth roughly $99 USD per year in raw membership fees alone — before you count the unlimited free guests it grants at Priority Pass lounges (a benefit the Amex Platinum's own Priority Pass tier does not include after February 2025).</p>

<p><strong>Lounge benefits</strong></p>
<ul>
  <li>Unlimited Maple Leaf Lounge access on same-day Air Canada flights, one free guest per visit</li>
  <li>Four Air Canada One-Time Guest Passes per year (domestic and US Transborder)</li>
  <li><strong>Priority Pass Select</strong>: unlimited visits, <strong>unlimited free guests</strong> at Priority Pass lounges worldwide — including Plaza Premium, Aspire, SkyTeam Lounge YVR, WestJet Elevation, and National Bank Lounge YUL</li>
  <li>Highest Aeroplan earn rate on Air Canada spend of the three cards (3x)</li>
</ul>

<p><strong>Best for</strong></p>
<ul>
  <li>Travellers who fly both Air Canada and other airlines regularly</li>
  <li>Frequent international travellers using Priority Pass abroad</li>
  <li>Travellers who bring a companion — the unlimited PP guest allowance is uniquely valuable</li>
</ul>

<blockquote>
<p><strong>Why the Amex Reserve wins on lounges alone:</strong> the Priority Pass Select benefit gets you into every Plaza Premium, Aspire, and SkyTeam Lounge in Canada plus 1,600 more worldwide, with unlimited free guests — while still unlocking Maple Leaf Lounges. The two Visa Infinite Privilege cards only cover MLLs. For the same $599 fee, the Amex covers roughly 3× more Canadian lounges and offers vastly better guest terms.</p>
</blockquote>

<h2>Which Aeroplan Card Is Best for Your Travel Pattern?</h2>

<table>
  <thead>
    <tr><th>Your typical travel</th><th>Best Aeroplan card</th><th>Why</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>Air Canada domestic + occasional international</td>
      <td>Amex Aeroplan Reserve</td>
      <td>Priority Pass unlocks Plaza Premium at every major Canadian airport in addition to MLLs</td>
    </tr>
    <tr>
      <td>Air Canada exclusively + you rarely travel with a guest</td>
      <td>TD Aeroplan Visa Infinite Privilege</td>
      <td>Better everyday earn on groceries and gas; companion voucher works when you do bring one</td>
    </tr>
    <tr>
      <td>Heavy Air Canada spender ($20k+ / year on AC tickets)</td>
      <td>CIBC Aeroplan Visa Infinite Privilege</td>
      <td>Highest revenue-spend multiplier on Air Canada tickets among the two Visa options</td>
    </tr>
    <tr>
      <td>Multi-carrier international traveller</td>
      <td>Amex Aeroplan Reserve</td>
      <td>Priority Pass Select is the only way to access non-Star Alliance lounges abroad</td>
    </tr>
    <tr>
      <td>Family of four, want maximum lounge visits per year</td>
      <td>Amex Aeroplan Reserve</td>
      <td>Unlimited free PP guests + MLL guest + 4 One-Time MLL passes stacks the best</td>
    </tr>
  </tbody>
</table>

<h2>The Guest-Rule Details That Actually Matter</h2>

<p>Card marketing usually collapses "one guest per visit" into a single line. In practice, the guest rules differ meaningfully between the Maple Leaf Lounge network and Priority Pass lounges.</p>

<ul>
  <li><strong>Maple Leaf Lounge, all three cards:</strong> One free guest per cardholder visit, on the same-day Air Canada flight. Additional guests are charged the standard $59 CAD walk-in rate at the door.</li>
  <li><strong>One-Time Guest Passes (all three cards):</strong> Four passes per calendar year, valid at Maple Leaf Lounges in Canada and the US only. Not valid at international MLLs (YVR Gate D, YYZ Gate F, YUL International).</li>
  <li><strong>Priority Pass — Amex Reserve only:</strong> Unlimited visits, unlimited free guests. This is the strongest PP guest allowance of any Canadian card, including the Amex Platinum ($799 annual fee) which limits you to one free guest through 2026 and caps Priority Pass at 6 visits per year from January 1, 2027 unless you spend $20,000 annually on the card.</li>
</ul>

<h2>Break-Even Math: Is $599 Worth It for Lounge Access?</h2>

<p>Reasonable break-even math for each card, assuming the average Canadian airport lounge visit is worth about $50 (walk-in day pass equivalent):</p>

<ul>
  <li><strong>TD or CIBC Aeroplan Visa Infinite Privilege ($599):</strong> Roughly 12 MLL visits per year with a companion breaks even on the lounge benefit alone. Add the annual companion voucher ($200+ value) and the earn-rate uplift, and 8 lounge visits per year covers the fee comfortably.</li>
  <li><strong>Amex Aeroplan Reserve ($599):</strong> Roughly 6 lounge visits per year — split between MLL and Priority Pass — covers the fee, because you effectively get two lounge networks for one price. The unlimited free-guest allowance halves that math for anyone travelling with a partner.</li>
</ul>

<h2>What None of These Cards Do</h2>

<p>Setting expectations at the door:</p>

<ul>
  <li>None grant access to the <strong>Air Canada Signature Suite</strong> at YYZ (invitation-only for AC Signature Class international passengers).</li>
  <li>None grant access to the <strong>Cathay Pacific Lounge at YVR</strong> (oneworld / CX-ticket only).</li>
  <li>None open the <strong>Desjardins Odyssey Lounges at YUL</strong> (DragonPass network — the RBC Avion Visa Infinite Privilege or Scotiabank Passport Visa Infinite are the Canadian cards that grant DragonPass access).</li>
  <li>None provide access to <strong>Amex Centurion Lounges</strong> — that requires the Amex Platinum, and there are no Centurion Lounges in Canada regardless.</li>
</ul>

<h2>Practical Checklist Before You Apply</h2>

<ol>
  <li><em>Confirm your Air Canada flight volume for the coming 12 months.</em> If you take fewer than 4 Air Canada flights per year, an Aeroplan card is not the highest-value lounge card — the Amex Platinum with Priority Pass often wins for occasional travellers.</li>
  <li><em>Count who you fly with.</em> Solo travellers get less incremental value from the Amex Reserve's unlimited PP guest benefit. Couples and families get significantly more.</li>
  <li><em>Check your existing card portfolio for Priority Pass duplication.</em> If you already carry the Amex Platinum, adding the Amex Aeroplan Reserve gives you two Priority Pass memberships — one of which is redundant. Consider dropping the Platinum and keeping the Reserve alone.</li>
  <li><em>Check the current sign-up bonus timing.</em> All three cards run promotional welcome bonuses periodically; a well-timed bonus can offset the first-year fee entirely.</li>
</ol>

<p><em>Card benefit details in this guide reflect published cardholder terms as of August 2026. Annual fees, earn rates, and lounge access rules are subject to change without notice — always confirm directly with the issuer before applying.</em></p>
`

export const blogPosts: BlogPost[] = [
  {
    slug: 'best-aeroplan-credit-card-airport-lounge-access',
    title: 'Best Aeroplan Credit Card for Airport Lounge Access in Canada (2026)',
    excerpt: 'TD Aeroplan Visa Infinite Privilege, CIBC Aeroplan Visa Infinite Privilege, and Amex Aeroplan Reserve — the three Canadian cards that open the Maple Leaf Lounge, compared side by side. Updated August 2026.',
    coverImage: '/blog/couple-checking-in-lounge.png',
    publishedAt: '2026-08-25',
    lastReviewed: '2026-08-25',
    category: 'Credit Cards',
    readingTime: '12 min read',
    metaTitle: 'Best Aeroplan Credit Card for Airport Lounge Access in Canada (2026)',
    metaDescription: 'TD Aeroplan Visa Infinite Privilege vs CIBC Aeroplan VIP vs Amex Aeroplan Reserve — which Canadian Aeroplan card is best for airport lounge access, guest fees, and Priority Pass. August 2026.',
    content: aeroplanCardsContent,
    authorName: 'AirportLounges.ca Editorial Team',
    authorBio: 'Canadian airport lounge access rules are verified against operator sources, cardholder benefit terms, and in-person visits — reviewed continuously and dated on every guide.',
    primaryCta: {
      heading: 'Compare Aeroplan cards side by side',
      subheading: 'See current welcome bonuses, annual fees, and lounge benefits — with any active FinlyWealth rebates factored in.',
      ctaLabel: 'Compare Aeroplan Cards',
      affiliateKey: 'finlywealth-aeroplan-cards',
    },
    comparisonCards: [
      {
        name: 'Amex Aeroplan Reserve',
        annualFee: '$599',
        highlight: 'Only Aeroplan card with Priority Pass + Maple Leaf Lounge access',
        affiliateKey: 'finlywealth-amex-aeroplan-reserve',
        ctaLabel: 'See Amex Aeroplan Reserve',
      },
      {
        name: 'TD Aeroplan Visa Infinite Privilege',
        annualFee: '$599',
        highlight: 'Companion voucher + 4 Maple Leaf Lounge One-Time Guest Passes',
        affiliateKey: 'finlywealth-td-aeroplan-vip',
        ctaLabel: 'See TD Aeroplan VIP',
      },
      {
        name: 'CIBC Aeroplan Visa Infinite Privilege',
        annualFee: '$599',
        highlight: 'Highest Aeroplan earn on Air Canada tickets (2x)',
        affiliateKey: 'finlywealth-cibc-aeroplan-vip',
        ctaLabel: 'See CIBC Aeroplan VIP',
      },
    ],
    faqs: [
      {
        question: 'Which Aeroplan credit card is best for airport lounge access?',
        answer: 'The Amex Aeroplan Reserve ($599 annual fee) is the strongest lounge card of the three Canadian Aeroplan premium cards because it is the only one that stacks Priority Pass Select on top of Maple Leaf Lounge access. That gives cardholders unlimited access to both the Air Canada MLL network and 1,600+ Priority Pass lounges worldwide — including Plaza Premium at every Canadian airport, with unlimited free guests at PP lounges.',
      },
      {
        question: 'Does the TD Aeroplan Visa Infinite Privilege include Priority Pass?',
        answer: 'No. The TD Aeroplan Visa Infinite Privilege includes Maple Leaf Lounge access but does not include Priority Pass. To pair Maple Leaf Lounge access with Priority Pass, choose the Amex Aeroplan Reserve, or hold the TD card alongside an Amex Platinum for the Priority Pass side.',
      },
      {
        question: 'Which Canadian credit cards get you into the Air Canada Maple Leaf Lounge?',
        answer: 'Only three Canadian cards unlock the Maple Leaf Lounge: the TD Aeroplan Visa Infinite Privilege, the CIBC Aeroplan Visa Infinite Privilege, and the American Express Aeroplan Reserve. Amex Platinum, Amex Cobalt, Priority Pass, DragonPass, and non-Aeroplan Amex cards do not grant MLL access at any tier.',
      },
      {
        question: 'How many free lounge visits does the Amex Aeroplan Reserve give per year?',
        answer: 'Unlimited. The Amex Aeroplan Reserve grants unlimited visits to Air Canada Maple Leaf Lounges on same-day Air Canada flights (with one free guest per visit) plus unlimited visits to Priority Pass lounges worldwide (with unlimited free guests). Cardholders also receive four Air Canada One-Time Guest Passes per calendar year for domestic and US Transborder MLL entry.',
      },
      {
        question: 'Is the Amex Aeroplan Reserve better than the Amex Platinum for airport lounge access?',
        answer: 'For Canadian lounge access, yes — often. The Amex Aeroplan Reserve ($599/yr) unlocks both the Maple Leaf Lounge network and Priority Pass with unlimited free guests, while the Amex Platinum ($799/yr) only unlocks Priority Pass (with a 1-free-guest limit and a 6-visits-per-year cap starting January 1, 2027 unless you spend $20,000/yr on the card). The Platinum is the better card if you also need Amex Centurion Lounge access when travelling to the US or want the additional non-lounge benefits.',
      },
      {
        question: 'Can I bring more than one guest to the Maple Leaf Lounge with an Aeroplan credit card?',
        answer: 'Yes, but only the first is free. All three Aeroplan premium cards include one free companion guest per visit. Additional guests pay the standard Air Canada Maple Leaf Lounge walk-in rate ($59 CAD per guest). Cardholders also receive four One-Time Guest Passes per year for domestic and US Transborder MLL entry — usable as full lounge entries for named guests, without the cardholder needing to be present.',
      },
      {
        question: 'Do Aeroplan credit cards work at the Air Canada Signature Suite in Toronto?',
        answer: 'No. The Air Canada Signature Suite at YYZ Terminal 1 is exclusively for Air Canada Signature Class (international business class) passengers on same-day AC flights. No credit card grants access at any tier, and Aeroplan Elite status does not qualify.',
      },
      {
        question: 'Can I use the Air Canada One-Time Guest Pass at any Maple Leaf Lounge?',
        answer: 'No — One-Time Guest Passes issued with Aeroplan credit cards are valid at Canadian and US Transborder Maple Leaf Lounges only. They are explicitly excluded from international MLL locations (YVR Gate D, YYZ Gate F, YUL International). Guests must be travelling on a same-day Air Canada flight and have their own boarding pass.',
      },
      {
        question: 'Which Aeroplan credit card has the best sign-up bonus?',
        answer: 'Sign-up bonuses rotate frequently across all three issuers — TD, CIBC, and American Express. Compare current offers at RateHub or CreditCardGenius before applying, and confirm the earning window and minimum spend requirements. Well-timed applications during a promotional period can offset the first-year annual fee entirely.',
      },
    ],
  },
  {
    slug: 'amex-platinum-airport-lounge-access-canada',
    title: 'Amex Platinum Airport Lounge Access in Canada (2026): Lounges, Guests and 2027 Changes',
    excerpt: 'See which airport lounges the Canadian Amex Platinum accesses in 2026, guest rules, the $799 fee, and the confirmed Plaza Premium and Priority Pass limits coming in 2027.',
    coverImage: '/blog/guide-priority-pass-canada.png',
    publishedAt: '2026-08-25',
    lastReviewed: '2026-09-11',
    category: 'Credit Cards',
    readingTime: '12 min read',
    metaTitle: 'Amex Platinum Airport Lounge Access in Canada (2026): Lounges, Guests and 2027 Changes',
    metaDescription: 'See which airport lounges the Canadian Amex Platinum accesses in 2026, guest rules, the $799 fee, and the confirmed Plaza Premium and Priority Pass limits coming in 2027.',
    content: amexPlatinumContent,
    authorName: 'AirportLounges.ca Editorial Team',
    authorBio: 'Canadian airport lounge access rules are verified against operator sources, cardholder benefit terms, and in-person visits — reviewed continuously and dated on every guide.',
    primaryCta: {
      heading: 'Compare the Amex Platinum Offer',
      subheading: 'Review the current welcome offer, annual fee and card terms on FinlyWealth before applying. Offers can change.',
      ctaLabel: 'Compare the Amex Platinum Offer',
      affiliateKey: 'finlywealth-amex-platinum',
    },
    faqs: [
      {
        question: 'Does the Amex Platinum Card give you airport lounge access in Canada?',
        answer: 'Yes. The Canadian Platinum Card includes the American Express Global Lounge Collection — five networks and more than 1,550 lounges across 140 countries. In Canada that means Plaza Premium lounges at Toronto Pearson, Vancouver, Edmonton and Winnipeg, plus Aspire lounges at Calgary, Montreal, Ottawa and Halifax, plus most Priority Pass locations once you enrol. You must present the physical Platinum Card and a same-day boarding pass at the door.',
      },
      {
        question: 'Is Amex Platinum lounge access unlimited?',
        answer: 'Through December 31, 2026, yes — Plaza Premium and Priority Pass visits are unlimited with one guest included. Starting January 1, 2027, a basic cardholder is capped at 6 Plaza Premium visits and 6 Priority Pass visits per calendar year (2 each on a supplementary card) unless the account reaches $20,000 in eligible calendar-year spending, which restores unlimited access for the rest of the year and the following year.',
      },
      {
        question: 'How many guests can I bring with Amex Platinum?',
        answer: 'Guest rules depend on the network. Through 2026, Plaza Premium and Priority Pass each include one complimentary guest per visit. Centurion Lounges outside Canada allow up to two guests on the Canadian card. Delta Sky Club includes no free guests — Delta charges per additional person. From January 1, 2027, a guest entry at Plaza Premium or Priority Pass consumes one of the capped visits rather than being free.',
      },
      {
        question: 'Does Amex Platinum get you into Maple Leaf Lounges?',
        answer: 'No. Air Canada Maple Leaf Lounges are not part of the American Express Global Lounge Collection. The Platinum Card earns Membership Rewards points that transfer to Aeroplan, but points do not equal lounge access. For Maple Leaf Lounge entry, hold an American Express Aeroplan Reserve, TD Aeroplan Visa Infinite Privilege, or CIBC Aeroplan Visa Infinite Privilege — access requires a same-day Air Canada or Star Alliance flight.',
      },
      {
        question: 'Is the Amex Platinum worth it just for lounge access?',
        answer: 'For a solo traveller who uses both the $200 travel credit and $200 dining credit each year, the net cost is about $399. At an illustrative $50 value per lounge entry, roughly 8 solo entries or 4 couple trips a year cover the fee — a reasonable target for anyone flying 5+ times a year through a Canadian hub. If you fly Air Canada almost exclusively, or fewer than 5 times a year, a cheaper Canadian lounge card is usually the better choice.',
      },
      {
        question: 'What will change for Amex Platinum lounge access in 2027?',
        answer: 'Starting January 1, 2027, Plaza Premium and Priority Pass access will be capped at 6 visits each per calendar year on a basic card, and 2 each on a supplementary card. Each person who enters counts as one visit, so a guest costs you a visit. Aspire, Swissport, Centurion and Delta Sky Club lounges are not affected by the cap. The account can restore unlimited access by reaching $20,000 in eligible calendar-year spending; Amex is already counting 2026 spend toward the 2027 threshold.',
      },
    ],
  },
  {
    slug: 'airport-lounge-guest-fees-canada',
    title: 'Airport Lounge Guest Fees in Canada (2026): What You Will Actually Pay',
    excerpt: "Priority Pass, DragonPass, Air Canada Maple Leaf, WestJet Elevation, Desjardins Odyssey — every guest fee spelled out. Updated June 2026.",
    coverImage: '/blog/couple-checking-in-lounge.png',
    publishedAt: '2026-06-06',
    lastReviewed: '2026-08-25',
    category: 'Access Guides',
    readingTime: '15 min read',
    metaTitle: "Airport Lounge Guest Fees in Canada (2026): What You'll Actually Pay",
    metaDescription: 'Every airport lounge guest fee in Canada explained — Priority Pass, DragonPass, Air Canada Maple Leaf, WestJet Elevation and more. Updated June 2026.',
    content: guestFeesContent,
    primaryCta: {
      heading: 'Skip the guest fees',
      subheading: 'Cards that include one or more free lounge guests per visit — compared side by side.',
      ctaLabel: 'See Cards With Free Guests',
      affiliateKey: 'finlywealth-lounge-access-cards',
    },
  },
  {
    slug: 'canadian-airport-lounges-shower-access',
    title: 'Canadian Airport Lounges with Shower Access (2026)',
    excerpt: 'Every Canadian airport lounge with shower access reviewed — facilities, bath products, who gets in free, and how to avoid a long wait. Updated June 2026.',
    coverImage: '/blog/premium-shower-lounge-hero.png',
    publishedAt: '2026-06-05',
    lastReviewed: '2026-08-25',
    category: 'Lounge Guides',
    readingTime: '11 min read',
    metaTitle: 'Canadian Airport Lounges with Showers (2026): Every Location Reviewed',
    metaDescription: 'Every Canadian airport lounge with shower access reviewed — facilities, bath products, who gets in free, and how to avoid a long wait. June 2026.',
    content: showerAccessContent,
    primaryCta: {
      heading: 'Which cards get you free access?',
      subheading: 'Compare the Canadian credit cards that unlock the shower-equipped lounges above.',
      ctaLabel: 'Compare Lounge-Access Cards',
      affiliateKey: 'finlywealth-lounge-access-cards',
    },
  },
  {
    slug: 'best-airport-lounges-remote-work-canada',
    title: 'Top 10 Airport Lounges for Remote Work in Canada (2026)',
    excerpt: 'The 10 best Canadian airport lounges for remote workers — ranked by Wi-Fi, power outlets, quiet zones, and desk space. Updated June 2026.',
    coverImage: '/blog/business-traveller-airport-lounge.png',
    publishedAt: '2026-06-05',
    lastReviewed: '2026-08-25',
    category: 'Lounge Guides',
    readingTime: '14 min read',
    metaTitle: 'Top 10 Airport Lounges for Remote Work in Canada (2026)',
    metaDescription: 'The 10 best Canadian airport lounges for remote workers — ranked by Wi-Fi, power outlets, quiet zones, and desk space. Updated June 2026.',
    content: remoteWorkContent,
    primaryCta: {
      heading: 'The card that unlocks the most work-friendly lounges',
      subheading: 'The Amex Aeroplan Reserve stacks Priority Pass + Maple Leaf Lounge access on one card — see current terms.',
      ctaLabel: 'See Amex Aeroplan Reserve',
      affiliateKey: 'finlywealth-amex-aeroplan-reserve',
    },
  },
  {
    slug: 'priority-pass-lounges-canada',
    title: 'The Complete Guide to Priority Pass Lounges in Canada (2026)',
    excerpt: 'Every Priority Pass lounge in Canada listed by airport — Toronto, Vancouver, Calgary, Montreal and more. Peak hours, guest rules, and what to expect.',
    coverImage: '/blog/guide-priority-pass-canada.png',
    publishedAt: '2026-06-05',
    lastReviewed: '2026-08-25',
    category: 'Lounge Guides',
    readingTime: '12 min read',
    metaTitle: 'Priority Pass Lounges in Canada: Every Airport Guide (2026)',
    metaDescription: 'Every Priority Pass lounge in Canada listed by airport — Toronto, Vancouver, Calgary, Montreal and more. Peak hours, guest rules, and what to expect. 2026.',
    content: priorityPassContent,
    primaryCta: {
      heading: 'Get Priority Pass with a Canadian credit card',
      subheading: 'The Amex Platinum and Amex Aeroplan Reserve both include Priority Pass Select — compare current benefits.',
      ctaLabel: 'Compare Priority Pass Cards',
      affiliateKey: 'finlywealth-lounge-access-cards',
    },
  },
]

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug)
}

export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}
