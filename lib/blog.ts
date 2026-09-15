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

const sleepPodsContent = `
<p data-speakable="intro"><strong>Canada does not have Napcabs, GoSleep pods or dedicated per-hour nap suites like Munich, Helsinki or Singapore Changi. What we have are five lounges with real rest facilities: individual reclining pods, spa-style rest suites, day-bed corners, or an all-night operating schedule that lets you actually stretch out between flights. Only one of them accepts Priority Pass. Only one is open 24 hours a day. Full breakdown below, with the card that unlocks each. Verified September 12, 2026.</strong></p>

<blockquote>
<p><strong>Editorial disclosure:</strong> AirportLounges.ca may receive compensation if you apply for a card through links on this page. This does not affect the issuer's terms or the price you pay. Rest-facility descriptions were verified against operator pages and our own on-file lounge data on September 12, 2026.</p>
</blockquote>

<h2>What "sleep pod" actually means in a Canadian airport lounge</h2>

<p>The phrase is used loosely across the travel press. In Europe and Asia, a "sleep pod" usually means an enclosed capsule you rent by the hour (Yotel cabins, Napcabs, sleepbox units). None of that infrastructure exists in Canadian airports today. What the term describes at Canadian lounges is one of four distinct things:</p>

<ul>
  <li><strong>Reclining chair pods</strong> — semi-private individual seats that recline nearly flat, spaced for privacy. The Cathay Pacific Lounge at YVR is the only Canadian lounge with these in a purpose-built configuration.</li>
  <li><strong>Spa-style rest suites</strong> — private treatment-room-sized spaces designed for pre-flight rest, often paired with shower facilities. Plaza Premium First at YVR is the Canadian example.</li>
  <li><strong>Day-bed corners</strong> — un-partitioned lounge sections with wide flat seating, dimmed lighting, and quiet-zone rules. Plaza Premium's international 24-hour lounge at YVR uses this format.</li>
  <li><strong>Nap-permissive quiet zones</strong> — lounge sections that explicitly allow sleeping without a formal pod, usually enforced through no-phone quiet-room policies. Plaza Premium at Winnipeg is the clearest Canadian example.</li>
</ul>

<p>If a headline says "airport sleep pods in Canada," it is almost always describing one of these four things, not a Napcab. Set that expectation before booking any flight around a lounge rest.</p>

<h2>Every Canadian airport lounge with a real rest facility</h2>

<h3>1. Cathay Pacific Lounge — Vancouver (YVR)</h3>

<p>The <a href="/airports/YVR/lounges/cathay-pacific-lounge-yvr">Cathay Pacific Lounge at YVR</a> is the closest thing to a purpose-built sleep-pod lounge in Canada. The 108-seat mezzanine above Pier D includes a dedicated Solus Chair area — individual reclining seats spaced for privacy, spec'd by London studio Studioilse. They are semi-enclosed by high partitions, dimmable overhead lighting, and each has a side table with power. This is where Cathay Pacific business-class passengers on a red-eye eastbound to Hong Kong actually sleep before boarding.</p>

<ul>
  <li><strong>Format:</strong> Solus Chair reclining pods (unspecified count; part of the 108-seat lounge)</li>
  <li><strong>Time limit:</strong> Standard lounge stay — up to 4 hours before departure; not sold by the hour</li>
  <li><strong>Access:</strong> Cathay Pacific / Cathay Dragon business or first class same-day ticket, Marco Polo Club Silver / Gold / Diamond, oneworld Sapphire / Emerald status on a same-day oneworld flight. <strong>Priority Pass is not accepted.</strong> No walk-in day pass.</li>
  <li><strong>Extra cost:</strong> None beyond your ticket / status</li>
  <li><strong>Operating hours:</strong> Aligned with Cathay's twice-daily YVR departures (typically morning + evening banks) — not open all day</li>
</ul>

<h3>2. Plaza Premium First — Vancouver (YVR)</h3>

<p><a href="/airports/YVR/lounges/plaza-premium-first-yvr">Plaza Premium First at YVR</a> is Plaza Premium's premium tier — a physically separate lounge next to the standard Plaza Premium International lounge. It offers private spa-style suites specifically designed for pre-flight rest, alongside individual shower rooms with Aesop products. The rest suites are booked at reception on arrival, subject to availability.</p>

<ul>
  <li><strong>Format:</strong> Spa-style private rest suites + reclining seat area</li>
  <li><strong>Time limit:</strong> Standard entry is a two-hour visit; extensions possible if quiet</li>
  <li><strong>Access:</strong> Direct purchase at $110 CAD for a two-hour stay, or a $30 CAD upgrade from the standard Plaza Premium International next door. <strong>Priority Pass is not accepted at the First tier</strong> — the standard PPL next door is Priority Pass-eligible, and you pay the $30 upgrade to cross over.</li>
  <li><strong>Extra cost:</strong> $30 upgrade minimum on top of any card benefit at the standard lounge; $110 direct otherwise</li>
  <li><strong>Operating hours:</strong> Check the Plaza Premium page for current times — typically aligned with international departure banks</li>
</ul>

<h3>3. Plaza Premium International Lounge — Vancouver (YVR), 24-hour</h3>

<p>The <a href="/airports/YVR/lounges/plaza-premium-international-yvr">Plaza Premium Lounge at YVR International</a> is the only Canadian airport lounge open 24 hours a day, every day. It doesn't market itself as a sleep-pod facility, but during overnight layovers on transpacific arrivals it is functionally the only place in Canada where a Priority Pass member can lie down between flights. Shower suites, dimmed sections, and a two-hour Priority Pass stay limit make it a workable overnight rest option.</p>

<ul>
  <li><strong>Format:</strong> Wider-seat lounge sections + shower suites (no dedicated pods)</li>
  <li><strong>Time limit:</strong> 2 hours on Priority Pass; longer if you pay walk-in or hold an Amex-tier entry</li>
  <li><strong>Access:</strong> Priority Pass (via Amex Platinum, Amex Business Platinum, Scotiabank Platinum Amex, or standalone membership), Amex Platinum direct entry, DragonPass via Visa Airport Companion or Mastercard Travel Pass, walk-in day pass at Plaza Premium's published rate.</li>
  <li><strong>Extra cost:</strong> Included with card / membership; walk-in from about $69 CAD</li>
  <li><strong>Operating hours:</strong> 24/7 — the only Canadian lounge that never closes</li>
</ul>

<h3>4. Plaza Premium Lounge — Winnipeg (YWG)</h3>

<p><a href="/airports/YWG/lounges/plaza-premium-lounge-ywg">Plaza Premium at Winnipeg Richardson International</a> is the smallest name on this list but the one most Canadians overlook. Located airside directly opposite Gate 6 in the Domestic and International Departures area, its lounge description explicitly documents a nap section with dimmed lighting. It is not a "pod" — it is a wider-seat quiet corner — but for a red-eye eastbound from Winnipeg it is the only rest facility inside YWG's secure area.</p>

<ul>
  <li><strong>Format:</strong> Quiet nap corner (no pods; expanded seat spacing)</li>
  <li><strong>Time limit:</strong> Standard Plaza Premium 2-hour Priority Pass stay; longer if you pay walk-in</li>
  <li><strong>Access:</strong> Priority Pass (Amex-issued cards + Scotiabank Platinum Amex), Amex Platinum direct, DragonPass, walk-in day pass</li>
  <li><strong>Extra cost:</strong> Included with card; walk-in around $60–65 CAD</li>
  <li><strong>Operating hours:</strong> 04:00 to 21:00 (verify on the day)</li>
</ul>

<h3>5. Air Canada Signature Suite — Toronto Pearson (YYZ Terminal 1)</h3>

<p>The <a href="/airports/YYZ/lounges/ac-signature-suite-yyz">Air Canada Signature Suite</a> is the most exclusive lounge on this list and the one with the strongest documented editorial rest area — private semi-enclosed seating pods with reclining chairs, table lamps, and side privacy. It is invitation-only and impossible to access unless you meet a very narrow criteria: same-day Air Canada Signature Class (international business class) ticket, or Aeroplan Super Elite 100K travelling on a Signature Class routing. No credit card unlocks it. No status alone unlocks it.</p>

<ul>
  <li><strong>Format:</strong> Semi-enclosed private booths with reclining seating; private dining suites</li>
  <li><strong>Time limit:</strong> Standard 3-hour pre-departure window</li>
  <li><strong>Access:</strong> Air Canada Signature Class (international business) same-day ticket only. Not accessible on Aeroplan status alone, not accessible on any Amex or Aeroplan credit card, not accessible on Priority Pass.</li>
  <li><strong>Extra cost:</strong> None beyond your business-class ticket</li>
  <li><strong>Operating hours:</strong> Aligned with Air Canada international departure schedule from YYZ T1</li>
</ul>

<h2>Best lounge for your rest situation</h2>

<table>
  <thead>
    <tr><th>Your situation</th><th>Best rest lounge</th><th>Why</th></tr>
  </thead>
  <tbody>
    <tr><td>Overnight transpacific layover</td><td>Plaza Premium International YVR (24-hour)</td><td>The only lounge in Canada open all night; shower suites available</td></tr>
    <tr><td>Red-eye from YWG</td><td>Plaza Premium Winnipeg</td><td>Only rest facility inside YWG's secure area</td></tr>
    <tr><td>Flying Cathay Pacific business class</td><td>Cathay Pacific Lounge YVR</td><td>Purpose-built Solus Chair reclining pods; only ticket-only lounge with true pods</td></tr>
    <tr><td>Willing to spend $30–$110 for premium rest</td><td>Plaza Premium First YVR</td><td>Private spa-style rest suites + Aesop showers; the closest to a real sleep pod for cardholders</td></tr>
    <tr><td>Flying Air Canada Signature Class international</td><td>AC Signature Suite YYZ</td><td>Private booth seating; not accessible on any card, must be on the ticket</td></tr>
    <tr><td>Any of the above with Priority Pass</td><td>Plaza Premium International YVR (24-hour) or Plaza Premium YWG</td><td>The only two Priority Pass-eligible lounges on this list</td></tr>
  </tbody>
</table>

<h2>Which credit card unlocks which rest lounge?</h2>

<p>Only two of the five lounges here are accessible via a Canadian credit card. Neither requires a specific "sleep pod" upgrade — the cards get you into the lounge and the rest facility is inside.</p>

<ul>
  <li><strong>American Express Platinum ($799) or Business Platinum ($799)</strong> — Direct entry to Plaza Premium at YVR International (24-hour) and Plaza Premium at YWG. Also includes Priority Pass Select. Through December 31, 2026 both are unlimited-visit; from January 1, 2027 they are capped at 6 Priority Pass + 6 Plaza Premium visits per year unless the account is charged $20,000 in a calendar year. Details: <a href="/blog/amex-platinum-airport-lounge-access-canada">Amex Platinum airport lounge access guide</a>.</li>
  <li><strong>Scotiabank Platinum American Express ($399)</strong> — Priority Pass with 10 visits a year covers both Plaza Premium locations above.</li>
  <li><strong>Any Amex-issued Priority Pass Select membership</strong> — Same coverage as the Platinum, minus Plaza Premium direct entry.</li>
</ul>

<blockquote>
<p>The Amex Aeroplan Reserve is worth mentioning because it technically includes a Priority Pass membership — but every Priority Pass visit is charged at the prevailing rate for the cardholder AND guests. That is access at a member price, not free rest. Its actual free lounge benefit is Maple Leaf Lounge, and no Maple Leaf Lounge in Canada has a documented sleep-pod facility.</p>
</blockquote>

<h2>What about the other Canadian airport lounges?</h2>

<p>Most Canadian premium lounges have "quiet rooms" or dimmed areas but no dedicated rest suites. Air Canada Maple Leaf Lounges vary — the YYZ International and YVR International locations enforce cell-free quiet zones but no reclining seats. WestJet Elevation at YYC has a focus space designed for work, not rest. Aspire lounges at YUL, YOW and YHZ (currently closed) have standard seating. If a specific lounge you use has a genuine sleep area that we have missed, <a href="/about#corrections">let us know</a> and we will verify it.</p>

<h2>Alternatives when a lounge is not the right answer</h2>

<ul>
  <li><strong>Airport hotels with day-use rates</strong> — Fairmont YVR, Sheraton Gateway YYZ Terminal 3, ALT Hotel YUL. Day-use rooms typically $89–$149 for four to six hours, book on the hotel's own site. Actually flat, actually quiet, actually private.</li>
  <li><strong>Priority Pass "Rest Zone" partners</strong> — no such partners exist in Canada. This is a European feature.</li>
  <li><strong>Off-airport sleep pods</strong> — none in Canadian airports as of September 2026. GoSleep, Napcabs, Minute Suites — all US and international footprints only.</li>
  <li><strong>Gate-area quiet zones</strong> — YYZ T1's Chapel &amp; Meditation Room, YVR's Level 3 South, YUL's Aeroquay near Gate 47 all get quieter overnight; not private but tolerable if lounges are closed.</li>
</ul>

<h2>Frequently Asked Questions</h2>

<h3>Which Canadian airport lounge has actual sleep pods?</h3>
<p>The <a href="/airports/YVR/lounges/cathay-pacific-lounge-yvr">Cathay Pacific Lounge at Vancouver International (YVR)</a> is the only Canadian airport lounge with purpose-built individual reclining pods (Solus Chair units). Access requires a same-day Cathay Pacific business class ticket or oneworld Sapphire / Emerald status — no credit card and no Priority Pass unlocks it.</p>

<h3>Is there a 24-hour airport lounge in Canada?</h3>
<p>Yes — the <a href="/airports/YVR/lounges/plaza-premium-international-yvr">Plaza Premium Lounge at YVR International Departures</a> is open 24 hours a day, every day. It is Priority Pass-eligible, DragonPass-eligible, Amex Platinum-eligible, and takes walk-in day passes. It is the only Canadian lounge you can access overnight.</p>

<h3>Can I sleep at an airport lounge in Canada?</h3>
<p>You can rest with your eyes closed at most Canadian premium lounges — nobody will wake you unless you are snoring loudly or blocking multiple seats. But "actual bed" facilities are limited to five lounges: Cathay Pacific YVR (Solus Chair pods), Plaza Premium First YVR (private spa suites), Plaza Premium International YVR (day-bed sections + 24-hour operation), Plaza Premium YWG (nap corner), and Air Canada Signature Suite YYZ (private booth seating, invitation-only).</p>

<h3>Which credit card gets me into an airport rest suite?</h3>
<p>The American Express Platinum ($799 annual fee), Business Platinum ($799), and Scotiabank Platinum American Express ($399) all include Priority Pass, which grants entry to the Plaza Premium International (24-hour) lounge at YVR and Plaza Premium YWG. The Amex Platinum also allows direct entry via its own card benefit. None of these cards unlock the Cathay Pacific Lounge YVR or the Air Canada Signature Suite YYZ — those require specific ticket or airline status.</p>

<h3>Can I book an airport nap in Canada by the hour?</h3>
<p>Not in the way Munich, Helsinki, or Singapore Changi offer through Napcabs or GoSleep pods. No Canadian airport has hourly per-pod bookings on either side of security. The closest alternative is an airport-hotel day-use rate (Fairmont YVR, Sheraton Gateway YYZ, ALT Hotel YUL) at roughly $89–$149 for a four- to six-hour daytime stay.</p>

<h3>Are there sleep pods at Toronto Pearson (YYZ)?</h3>
<p>No dedicated sleep pods for the general traveller. The <a href="/airports/YYZ/lounges/ac-signature-suite-yyz">Air Canada Signature Suite</a> at Terminal 1 offers private booth seating but is restricted to Air Canada Signature Class international passengers. Plaza Premium lounges at YYZ T1 and T3 have quiet zones but no sleep suites.</p>

<h3>Are there sleep pods at Montréal (YUL) or Calgary (YYC)?</h3>
<p>No dedicated sleep pods at either. YUL's National Bank Lounge (currently in a temporary reduced-capacity space until about June 2028) and Aspire lounges have standard seating. YYC's WestJet Elevation Lounge and both Aspire lounges are seating-focused. The <a href="/lounges/quiet-workspace">quiet-workspace collection</a> covers focus areas rather than rest.</p>

<h3>What's the cheapest Canadian credit card that gets me into a lounge with rest facilities?</h3>
<p>The Scotiabank Platinum American Express at $399 annual fee. It includes 10 Priority Pass visits per year, which cover both Plaza Premium locations on this list (YVR International 24-hour and YWG). Below that tier, the Scotiabank Passport Visa Infinite ($150) uses DragonPass rather than Priority Pass — DragonPass typically accepts the same two Plaza Premium lounges but each visit uses one of only 6 annual pool entries. <a href="/credit-cards/best-for-airport-lounge-access">Full lounge-access card comparison</a>.</p>

<h2>Methodology</h2>
<p>Lounge rest facilities were verified against operator descriptions (Plaza Premium, Cathay Pacific, Air Canada), AirportLounges.ca's own lounge-page data, and traveller reports on Milesopedia, Prince of Travel, and Frugal Flyer, cross-referenced with the amenities tags in our own Supabase directory. Where a specific facility ("Solus Chair", "spa suite", "nap corner") is named, it comes from an operator page or an on-file description; where it is characterized more loosely, the source is stated. This article intentionally does not list "sleep-pod" claims from third-party aggregators without operator confirmation, because most such claims describe standard Priority Pass lounges without actual rest facilities.</p>

<h2>Change log</h2>
<ul>
  <li><strong>September 12, 2026:</strong> First published. Four Canadian lounges confirmed with rest amenity tagging in Supabase (Cathay Pacific YVR, Plaza Premium First YVR, Plaza Premium International YVR 24-hour, Plaza Premium YWG). Air Canada Signature Suite YYZ documented but not tagged because access is invitation-only.</li>
</ul>

<h2>Sources</h2>
<ul>
  <li>Cathay Pacific Airways — Vancouver lounge page (Solus Chair area, hours, access rules).</li>
  <li>Plaza Premium Group — YVR First lounge ($110 direct, $30 upgrade, Priority Pass not accepted); YVR International 24-hour lounge; YWG lounge (hours, amenities, access).</li>
  <li>Air Canada — Signature Suite YYZ eligibility, Air Canada Signature Class benefits.</li>
  <li>Priority Pass — Canadian directory (which Plaza Premium locations are eligible).</li>
  <li>AirportLounges.ca — <a href="/blog/priority-pass-lounges-canada">Priority Pass lounges in Canada</a>, <a href="/blog/amex-platinum-airport-lounge-access-canada">Amex Platinum airport lounge access in Canada</a>, <a href="/blog/canadian-airport-lounges-shower-access">Canadian airport lounges with shower access</a>.</li>
  <li>Milesopedia, Prince of Travel, Frugal Flyer — traveller reports cross-referenced only where an operator page did not describe a facility explicitly.</li>
</ul>

<p><em>All lounge facts on this page reflect information current as of September 12, 2026. Access rules and hours change without notice — always confirm with the lounge operator before travelling. Next scheduled review: December 2026 (Amex Platinum cap on January 1, 2027).</em></p>
`

const priorityPassContent = `
<p data-speakable="intro"><strong>In Canada, Priority Pass comes only with American Express-branded cards. The Amex Platinum and Business Platinum ($799) include unlimited visits through December 31, 2026. The Scotiabank Platinum American Express ($399) includes 10 visits a year. Every Visa and Mastercard premium card uses DragonPass instead. The Amex Aeroplan Reserve includes the membership but charges every visit. From January 1, 2027, Amex Platinum access drops to 6 Priority Pass and 6 Plaza Premium visits a year. Guests use visits. Only $20,000 of annual spend restores unlimited access, and 2026 spend decides 2027. Priority Pass lists 23 lounges at 8 Canadian airports; Québec City is pending. Bought direct, membership costs US$99, US$329 or US$469 a year, with a US$35 guest fee.</strong></p>

<h2>What changed in this update (September 11, 2026)</h2>

<ul>
  <li><strong>Corrected:</strong> the card list. Three Visa cards previously named as Priority Pass cards are DragonPass cards. Priority Pass is Amex-only in Canada.</li>
  <li><strong>Added:</strong> the January 1, 2027 Amex Platinum caps, the Amex Aeroplan Reserve pay-per-visit trap, the Scotiabank Platinum Amex, direct membership prices and break-even math.</li>
  <li><strong>Corrected:</strong> the guest section. No Canadian Priority Pass card includes two guests; the Amex Platinum includes one.</li>
  <li><strong>Rewritten:</strong> Montréal (National Bank Lounge in a temporary space until about June 2028; two Aspire lounges and the Desjardins transborder lounge added; Air France operator fixed), Québec City moved to pending, and details at Toronto, Vancouver, Calgary, Edmonton, Winnipeg and Ottawa.</li>
  <li><strong>Changed:</strong> the airport count from nine to eight confirmed plus one pending; the network size from one number to the published range.</li>
</ul>

<blockquote>
<p><strong>Editorial disclosure:</strong> AirportLounges.ca may receive compensation if you apply for a card through links on this page. This does not affect the issuer's terms or the price you pay. The cards named as including Priority Pass visits are the Amex Platinum, the Business Platinum and the Scotiabank Platinum American Express. The Amex Aeroplan Reserve includes a Priority Pass membership but charges each visit. Facts verified September 11, 2026.</p>
</blockquote>

<h2>Which Canadian credit cards actually include Priority Pass?</h2>

<h3>Priority Pass is Amex-only in Canada</h3>

<p>Most Canadian lounge guides get this wrong, and it is the one fact this page exists to answer. Priority Pass in Canada comes only through American Express-branded cards. Every Visa and Mastercard premium card uses DragonPass instead. That includes the Scotiabank Passport, the TD Aeroplan Visa Infinite Privilege and the BMO Ascend. DragonPass is sold as Visa Airport Companion or Mastercard Travel Pass. Prince of Travel and Frugal Flyer both say it plainly. Three Canadian cards include Priority Pass, issued by American Express and Scotiabank. If a guide says a Visa card includes Priority Pass, it is describing DragonPass.</p>

<h3>The Amex Aeroplan Reserve includes zero included visits</h3>

<p>The Aeroplan Reserve ($599) is the trap. Its terms say the US$99 Priority Pass membership fee is waived. They also say "all lounge visits are subject to a usage fee at the prevailing rate," and that the fee "applies to the Cardmember and his/her guests." Prince of Travel prices that at US$35 a visit. The Reserve's real lounge benefit is unlimited Maple Leaf Lounge access with one guest. Treat "Priority Pass membership included" on any card page as a question, not an answer: how many visits come with it?</p>

<h3>Scotiabank Platinum Amex: 10 visits without the $799 fee</h3>

<p>The card almost nobody covers. The Scotiabank Platinum American Express costs $399. It includes Priority Pass with 10 visits a year for the primary cardholder and 4 for a supplementary cardholder, counted from the date of enrolment. A cardholder plus one guest counts as two visits. After that, the prevailing retail rate applies. It also charges no foreign transaction fee. If you want Priority Pass a few times a year without the Platinum's fee, it is the only middle option in Canada.</p>

<h3>Full Canadian card comparison</h3>

<table>
  <thead>
    <tr><th>Card</th><th>Annual fee</th><th>Lounge network</th><th>Included visits</th><th>Guests</th></tr>
  </thead>
  <tbody>
    <tr><td>Amex Platinum</td><td>$799</td><td>Priority Pass Select + Plaza Premium + Centurion, Aspire, Delta</td><td>Unlimited through Dec 31, 2026; 6 + 6 from 2027*</td><td>1 included in 2026; uses a visit from 2027</td></tr>
    <tr><td>Business Platinum from Amex</td><td>$799</td><td>Same as Platinum</td><td>Same as Platinum</td><td>Same as Platinum</td></tr>
    <tr><td>Scotiabank Platinum American Express</td><td>$399</td><td>Priority Pass</td><td>10 primary, 4 supplementary, per 12 months</td><td>A guest uses a visit</td></tr>
    <tr><td>Amex Aeroplan Reserve</td><td>$599</td><td>Priority Pass (membership only) + Maple Leaf Lounge</td><td>0; every visit billed at the prevailing rate (about US$35)</td><td>Billed too</td></tr>
    <tr><td>Scotiabank Passport Visa Infinite +</td><td>$150</td><td>DragonPass (Visa Airport Companion)</td><td>6, primary cardholder only</td><td>Uses a visit; US$32 after</td></tr>
    <tr><td>CIBC Aeroplan Visa Infinite Privilege</td><td>$599</td><td>DragonPass (Visa Airport Companion)</td><td>6 per membership year</td><td>Uses a visit; US$32 after</td></tr>
    <tr><td>CIBC Aventura Visa Infinite</td><td>$139</td><td>DragonPass (Visa Airport Companion)</td><td>4 per membership year</td><td>Uses a visit; US$32 after</td></tr>
    <tr><td>TD First Class Travel Visa Infinite</td><td>$139</td><td>DragonPass (Visa Airport Companion)</td><td>4 per year</td><td>Uses a visit</td></tr>
    <tr><td>RBC Avion Visa Infinite Privilege</td><td>$399</td><td>DragonPass (Visa Airport Companion)</td><td>6 per year</td><td>Uses a visit</td></tr>
    <tr><td>Rogers Red World Elite Mastercard</td><td>$0</td><td>DragonPass (Mastercard Travel Pass)</td><td>0; US$32 per person per visit</td><td>US$32 each</td></tr>
  </tbody>
</table>

<p><em>*Unlimited again with one guest once $20,000 is spent on the account in a calendar year. The top three rows are the only Canadian cards with Priority Pass visits included. Fees verified September 11, 2026 on issuer pages; the CIBC Aventura Visa Infinite and TD First Class Travel fees are the issuers' standard fees and are often waived in year one.</em></p>

<h2>What changes for Amex Platinum holders on January 1, 2027</h2>

<blockquote>
<p><strong>2027 alert:</strong> the Amex Platinum's unlimited Priority Pass and Plaza Premium access ends December 31, 2026. From January 1, 2027 it is 6 + 6 visits a year, guests use visits, and only $20,000 of annual spend restores unlimited access. Amex is counting 2026 spend now.</p>
</blockquote>

<h3>The new 6 + 6 visit caps</h3>

<p>A basic cardholder gets 6 Priority Pass visits and 6 Plaza Premium visits per calendar year. That is 12 in total across the two networks. A supplementary cardholder gets 2 of each. Visits reset on January 1 and do not roll over. Centurion Lounges, Delta Sky Club, Aspire, Swissport and the other airline-run lounges stay unlimited. Once your visits are gone, you can still enter by paying the lounge's regular rate.</p>

<table>
  <thead>
    <tr><th>Year and scenario</th><th>Priority Pass visits</th><th>Plaza Premium visits</th><th>Combined</th></tr>
  </thead>
  <tbody>
    <tr><td>2026, any spend level</td><td>Unlimited</td><td>Unlimited</td><td>Unlimited</td></tr>
    <tr><td>2027, spend under $20,000</td><td>6</td><td>6</td><td>12</td></tr>
    <tr><td>2027, supplementary card</td><td>2</td><td>2</td><td>4</td></tr>
    <tr><td>2027, after $20,000 spend in 2026</td><td>Unlimited</td><td>Unlimited</td><td>Unlimited</td></tr>
  </tbody>
</table>

<h3>Guests now consume your visits</h3>

<p>Under the capped model there is no complimentary guest. Each person who enters uses one visit. A couple burns a network's six visits in three trips. This is the single biggest change for anyone who chose the Platinum to bring a partner in.</p>

<h3>How the $20,000 spend threshold restores unlimited access</h3>

<p>Spend $20,000 on the account in a calendar year and unlimited access comes back, with one complimentary guest per network. It lasts for the rest of that year and all of the next. Supplementary cardholder spending counts toward the threshold. Hit $20,000 by March 1, 2027 and you are unlimited for the rest of 2027 and all of 2028.</p>

<h3>Why 2026 spending decides your 2027 access</h3>

<p>Amex is tracking spend from January 1, 2026. Apply in the autumn of 2026 and spend lightly, and you enter 2027 on the capped tier. Put $20,000 on the card in 2026, and you enter 2027 unlimited. Judge the $799 fee against its recurring credits, which published reviews put at roughly $400 to $640 a year depending on which you use. Treat the lounge benefit as the part being reduced. Our full guide: Amex Platinum airport lounge access in Canada.</p>

<h2>Priority Pass vs DragonPass in Canada</h2>

<h3>Visa Airport Companion and Mastercard Travel Pass explained</h3>

<p>Most Canadians with a premium travel card hold DragonPass, not Priority Pass. Most premium cards here are Visa or Mastercard. Visa's version is called Visa Airport Companion. Mastercard's is Mastercard Travel Pass. Both run on DragonPass. The mechanics differ from Priority Pass in three ways. Visits come as a pool, usually 4 to 6 a year. Every person who enters uses one, so a cardholder and guest are two visits. The overage is US$32 per person, against Priority Pass's usual US$35. Some pools belong to the primary cardholder only, as on the Scotiabank Passport Visa Infinite +. Others belong to each cardholder, as on the Scotiabank Passport Visa Infinite Privilege with 10 each.</p>

<table>
  <thead>
    <tr><th>Dimension</th><th>Priority Pass</th><th>DragonPass (Visa Airport Companion / Mastercard Travel Pass)</th></tr>
  </thead>
  <tbody>
    <tr><td>Canadian card issuers</td><td>American Express-branded cards only</td><td>Visa and Mastercard products</td></tr>
    <tr><td>Typical Canadian allotment</td><td>Unlimited on the Platinum through 2026 (6 + 6 from 2027); 10 / 4 on the Scotiabank Platinum Amex</td><td>4 to 6 visits a year; 10 on the Scotiabank Passport Visa Infinite Privilege</td></tr>
    <tr><td>Overage rate</td><td>Prevailing retail rate, commonly US$35</td><td>US$32 per person</td></tr>
    <tr><td>Direct membership</td><td>Yes, three tiers</td><td>Yes, but the entry tier includes no guest access; a no-fee card (Rogers Red World Elite) gives pay-per-visit membership</td></tr>
  </tbody>
</table>

<h3>Which Canadian lounges accept both networks</h3>

<p>In practice the lounge you sit in is often the same. Both networks are accepted at the Aspire lounges at Ottawa, Montréal and Billy Bishop, the WestJet Elevation Lounge at Calgary, the Plaza Premium lounges at Toronto, Vancouver, Edmonton and Winnipeg, the SkyTeam Lounge at Vancouver, and the Desjardins Plaza Premium transborder lounge at Montréal. The network name matters less than how many visits you get and what they cost.</p>

<h2>What Priority Pass costs on its own</h2>

<h3>Standard, Standard Plus and Prestige pricing</h3>

<table>
  <thead>
    <tr><th>Tier</th><th>Annual fee</th><th>Member visits included</th><th>Member overage</th><th>Guest fee</th></tr>
  </thead>
  <tbody>
    <tr><td>Standard</td><td>US$99</td><td>None</td><td>US$35</td><td>US$35</td></tr>
    <tr><td>Standard Plus</td><td>US$329</td><td>10</td><td>US$35</td><td>US$35</td></tr>
    <tr><td>Prestige</td><td>US$469</td><td>Unlimited</td><td>None</td><td>US$35</td></tr>
  </tbody>
</table>

<p><em>Priority Pass prices in US dollars. Verified September 11, 2026. Promotions of up to 30% off appear from time to time.</em></p>

<h3>Break-even: membership vs walk-in vs credit card</h3>

<p>Three comparisons decide it. First, Standard against Prestige: at US$99 plus US$35 a visit, Standard is cheaper below roughly eleven visits a year and dearer above it. Second, membership against walk-in — Plaza Premium lounges in Canada sell walk-in entry at roughly C$60 to C$65 for two hours. Toronto Pearson sells discounted pre-booked passes on its own site. A traveller who visits three times a year is under C$200 and needs no membership at all. Third, membership against a card. Prestige costs US$469 for unlimited solo visits. The Amex Platinum costs $799 but returns about $400 in credits most people use, so its net cost is near $399. It also adds Centurion, Plaza Premium and Aspire access, and one guest through 2026. The Scotiabank Platinum Amex sits between them at $399 for ten visits.</p>

<h2>Every Priority Pass lounge in Canada: quick reference</h2>

<p>Twenty-three lounges at eight airports, from Priority Pass's own directory and operator pages, verified September 11, 2026. Room-level acceptance can change without notice — confirm in the app before you walk over. Québec City is listed separately because it has no confirmed Priority Pass lounge.</p>

<table>
  <thead>
    <tr><th>Airport</th><th>Lounges listed by Priority Pass</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>Toronto Pearson (YYZ)</td><td>5</td><td>+ Be Relax spa; T1 international closed</td></tr>
    <tr><td>Vancouver (YVR)</td><td>5</td><td>Plaza Premium First excluded</td></tr>
    <tr><td>Montréal-Trudeau (YUL)</td><td>5</td><td>National Bank in temporary space</td></tr>
    <tr><td>Calgary (YYC)</td><td>3</td><td>Elevation: no US flights</td></tr>
    <tr><td>Edmonton (YEG)</td><td>2</td><td>US lounge closes 4:30 p.m.</td></tr>
    <tr><td>Ottawa (YOW)</td><td>1</td><td>No US transborder</td></tr>
    <tr><td>Winnipeg (YWG)</td><td>1</td><td>—</td></tr>
    <tr><td>Toronto Billy Bishop (YTZ)</td><td>1</td><td>—</td></tr>
    <tr><td>Québec City (YQB)</td><td>0</td><td>Pending: Boréal Lounge by YQB, fall 2026</td></tr>
  </tbody>
</table>

<h2>Airport-by-airport Priority Pass lounge guide</h2>

<h3>Toronto Pearson (YYZ)</h3>

<p>Priority Pass lists Plaza Premium lounges in both terminals: Terminal 1 Domestic and US Transborder, and Terminal 3 Domestic, International and US Transborder. The Terminal 1 International Plaza Premium closed on December 27, 2025 for a full rebuild, with no reopening date. A T1 international departure currently has no Priority Pass lounge.</p>

<ul>
  <li>Terminal 3 US Transborder sits past security and US customs, upstairs beside the Admirals Club near Gate A10, with a two-hour stay. Once you clear US customs you cannot go back.</li>
  <li>Terminal 1 also has a Be Relax spa on the Priority Pass list, which gives a treatment credit rather than a seat.</li>
  <li>Closing times differ by room. The domestic and international lounges run late; the transborder lounges close earlier in the evening.</li>
  <li>The KLM Crown Lounge in Terminal 3 has been reported as a Priority Pass option for international departures. It did not appear in the directory on our check — confirm in the app.</li>
</ul>

<h3>Toronto Billy Bishop (YTZ)</h3>

<ul>
  <li>One lounge: the Aspire | Air Canada Café, 133 seats, between Door A and the washrooms after security, accessible up to three hours before departure.</li>
  <li>Accepts Priority Pass, DragonPass and Amex Platinum, alongside Air Canada status and premium co-brand cardholders.</li>
  <li>On the Priority Pass pre-book list, which matters on Porter's busy morning bank.</li>
</ul>

<h3>Vancouver (YVR)</h3>

<ul>
  <li><strong>Domestic:</strong> Plaza Premium at Gate B15 (full lounge) and a small Plaza Premium outpost at Gate C29 for short stays.</li>
  <li><strong>International:</strong> Plaza Premium on Level 4 of Pier D between Gates D67 and D68, and the SkyTeam Lounge. The SkyTeam Lounge accepts Priority Pass, DragonPass, LoungeKey and Diners Club, and is international-only. Reviewers rate it among the best Priority Pass lounges anywhere.</li>
  <li><strong>US:</strong> Plaza Premium on Level 3 near Gate E88.</li>
  <li>Priority Pass entry is limited to two hours at the Pier D and Pier E lounges; Amex card entry allows three.</li>
  <li><strong>Plaza Premium First</strong> in international departures <strong>does not accept Priority Pass at all</strong>. Entry is $110 for two hours, or a $30 upgrade from the standard lounge.</li>
</ul>

<h3>Calgary (YYC)</h3>

<ul>
  <li>Aspire Lounge International on Concourse D, 06:30 to 20:30, access three hours before departure, children under 2 free.</li>
  <li>Aspire Lounge Transborder on Concourse E, after US preclearance.</li>
  <li>WestJet Elevation Lounge on Concourse B accepts Priority Pass, DragonPass via Mastercard Travel Pass, Lounge Club and Diners Club, with a three-hour stay. It is not available to passengers flying to the continental US or Hawaii, because of where it sits relative to US customs.</li>
  <li>Capacity is the real risk. Both Aspire lounges can be pre-booked. Do it.</li>
</ul>

<h3>Montréal-Trudeau (YUL)</h3>

<ul>
  <li>The <strong>National Bank Lounge</strong> near Gate 53 closed on July 31, 2026 for a complete renovation. A temporary, reduced-capacity lounge opened in the same spot on August 1, 2026, with a two-hour stay limit. National Bank expects the full lounge back in June 2028.</li>
  <li>Two Aspire lounges are new since 2025. The <strong>Aspire Domestic Lounge</strong> across from Gate 1 opened in July 2025 — a full lounge in the domestic zone on Priority Pass, so domestic flyers are no longer limited to a dining credit. The <strong>Aspire International Lounge</strong> between Gates 52 and 53 accepts Priority Pass, DragonPass, DreamFolks and Amex Platinum, with a three-hour stay. Published hours differ between Priority Pass and reviewers — check the app.</li>
  <li>The <strong>Air France Lounge</strong> between Gates 55 and 57 is an Air France lounge, not a Plaza Premium one. It is closed to everyone but Air France and KLM customers from 3:30 to 6:30 p.m. every day.</li>
  <li><strong>US-bound:</strong> the Desjardins Plaza Premium Lounge above Gate 81, 04:30 to 20:30, two-hour stay, also on DragonPass and Amex.</li>
</ul>

<h3>Ottawa (YOW)</h3>

<ul>
  <li>One lounge: the Aspire Salon Lounge on Level 2 just past Gate 18, 05:00 to 20:00. Accepts Priority Pass, DragonPass, Amex and walk-ins on any airline, three hours before departure. Not available for US transborder departures after preclearance. On the Priority Pass pre-book list.</li>
</ul>

<h3>Edmonton (YEG)</h3>

<ul>
  <li>Plaza Premium, Domestic/International, one level above departures opposite Gate 52, 04:30 to midnight, two-hour stay. The bar is open, but some drinks carry a charge.</li>
  <li>Plaza Premium, US Transborder, near Gate 88 past preclearance, 05:00 to 16:30, two-hour stay, US flights only. An evening US departure leaves after it has closed.</li>
</ul>

<h3>Winnipeg (YWG)</h3>

<ul>
  <li>One lounge: Plaza Premium opposite Gate 6 in domestic and international departures, 04:00 to 21:00 per the airport and Priority Pass. Open bar, hot and cold food, Wi-Fi.</li>
</ul>

<h3>Québec City (YQB): status pending</h3>

<ul>
  <li>The V.I.P. Lounge previously named on this page is listed as temporarily closed.</li>
  <li>Its replacement, the <strong>Boréal Lounge by YQB</strong> near Gates 29 and 30 behind the Lobbie bar, opens in fall 2026 (date has slipped from summer). Access is by purchased day pass — Priority Pass and DragonPass acceptance is unconfirmed.</li>
  <li>Do not confuse it with the Air Canada Café that opened at YQB in June 2026 with Plaza Premium. That one is for Aeroplan 50K+, Star Alliance Gold, premium Aeroplan cardholders and business class, not Priority Pass.</li>
  <li>Québec City stays off the confirmed list until Priority Pass or the airport lists the Boréal Lounge.</li>
</ul>

<h2>How to bring a guest to a Priority Pass lounge in Canada</h2>

<h3>Visits are counted per person</h3>

<p>No Canadian Priority Pass card includes two guests. The Amex Platinum includes one. Any more are charged to the card at the prevailing retail rate. The Scotiabank Platinum Amex counts a cardholder plus guest as two of your ten visits. A direct membership includes no guest at any tier and charges US$35 each. From 2027, a Platinum guest uses one of your six visits. On any capped card, travelling as a pair halves the benefit.</p>

<h3>Children and age thresholds</h3>

<p>Children under 2 are admitted free at Edmonton, the Calgary Aspire lounges, Vancouver's Pier C outpost and Pearson's Terminal 3 transborder lounge, among others. From age 2, a child usually counts as a guest or a full entry. Some lounges require an unaccompanied member to be 21. Rules are set lounge by lounge, so check the listing before you bring the family.</p>

<h3>Where guests are not permitted at all</h3>

<p>Amex's own Corporate Platinum terms note that some lounges admit no guests. Priority Pass's help centre says guest limits and charges vary by lounge and by issuer, and points you to the individual listing. The two universal rules still apply everywhere: a same-day boarding pass, and the cardholder must be present. Guest fees are charged to the payment card linked to your Priority Pass account. For fees by network, see our airport lounge guest fees in Canada guide.</p>

<h2>How to pre-book a Canadian Priority Pass lounge</h2>

<p>Priority Pass now lets members reserve a place in advance at selected lounges, for a small fee, through the app or its pre-book page. As of September 11, 2026 the Canadian list includes the Aspire Lounge International and Aspire Lounge Transborder at Calgary, the Aspire Salon at Ottawa, the Aspire Lounge at Billy Bishop and the National Bank Lounge at Montréal. The list changes, so check the pre-book page. This is the direct answer to the capacity problem: a pre-booked seat is the only one a full lounge cannot refuse.</p>

<h2>Peak hours to avoid at Canadian Priority Pass lounges</h2>

<ul>
  <li><strong>Calgary Elevation Lounge:</strong> WestJet's morning and late-afternoon banks. Priority Pass members are the first refused when it is full.</li>
  <li><strong>Montréal Air France Lounge:</strong> closed to Priority Pass from 3:30 to 6:30 p.m. every day.</li>
  <li><strong>Montréal National Bank Lounge:</strong> reduced capacity in the temporary space until about June 2028; expect queues before the evening Europe departures.</li>
  <li><strong>Toronto Pearson Terminal 3 International:</strong> Priority Pass's most-reviewed Canadian lounge, and its busiest, from mid-afternoon.</li>
  <li><strong>Vancouver Pier D:</strong> the two-hour Priority Pass limit is enforced when the Asia departures bank fills the room.</li>
</ul>

<h2>Pre-flight checklist</h2>

<ol>
  <li>Confirm you actually have Priority Pass. Amex Platinum, Business Platinum or Scotiabank Platinum Amex. A Visa or Mastercard means DragonPass; use its app instead.</li>
  <li>Enrol before the first trip. Amex cards need a one-time enrolment by chat or phone. Download the Priority Pass app and add the digital card.</li>
  <li>Check the lounge for your zone. Domestic, international and US transborder are separate rooms; once you clear US customs you cannot go back.</li>
  <li>Check hours and the stay limit. Edmonton's US lounge closes at 4:30 p.m.; Vancouver's Pier D and E lounges cap Priority Pass at two hours.</li>
  <li>Pre-book where you can. Calgary, Ottawa, Billy Bishop and Montréal's National Bank Lounge.</li>
  <li>Count your visits from 2027. Amex Platinum: 6 Priority Pass plus 6 Plaza Premium a year unless you spend $20,000. A guest uses one.</li>
  <li>Bring a same-day boarding pass and the physical card. Every lounge on this page requires both.</li>
</ol>

<h2>Methodology</h2>
<p>Card facts come from issuer pages and benefits guides (American Express Canada, Scotiabank, CIBC, TD, RBC, Rogers Bank) and Air Canada's co-brand terms, checked September 11, 2026. Lounge facts come from Priority Pass's Canadian airport directory and operator pages (Plaza Premium, Aspire, WestJet, National Bank, Desjardins, Aéroport de Québec, YVR, YWG), with reviews from Milesopedia, Prince of Travel, Frugal Flyer and Flytrippers used only to confirm. Where sources conflict (Aspire International hours at YUL, National Bank renovation dates, room-level acceptance at Pearson, the KLM Crown Lounge), the conflict is stated. Network size is given as a range because published figures range from about 1,600 to 1,900 depending on whether restaurants, spas and sleep pods are counted; never compare cards on advertised lounge counts. Break-even figures are calculations shown in full. No card ratings are displayed.</p>

<h2>Change log</h2>
<ul>
  <li><strong>September 11, 2026:</strong> Full re-verification. Card list corrected to Amex-only; Aeroplan Reserve and Scotiabank Platinum Amex added; January 1, 2027 Amex caps added; direct membership pricing and break-even added; guest section rewritten to one guest maximum; Montréal rewritten (renovation, two Aspire lounges, Desjardins transborder, Air France operator); Québec City moved to pending; Toronto, Vancouver, Calgary, Edmonton, Winnipeg and Ottawa details corrected; airport count changed to eight confirmed plus one pending; network size given as a range; pre-booking section added.</li>
</ul>

<h2>Sources</h2>
<ul>
  <li>Prince of Travel — Priority Pass vs Visa Airport Companion Program and DragonPass lounge access with Visa and Mastercard; Frugal Flyer — Definitive guide: Priority Pass.</li>
  <li>American Express Canada — Platinum Card travel benefits, Business Platinum benefits, Aeroplan Reserve membership benefits, Aeroplan Reserve terms; Air Canada — American Express Aeroplan cards.</li>
  <li>Rewards Canada — Platinum Card lounge access changes effective January 1, 2027.</li>
  <li>Scotiabank — Platinum American Express Card and benefits, Passport Visa Infinite +, Passport Visa Infinite Privilege; CIBC — Aeroplan Visa Infinite Privilege benefits guide and Aventura Visa Infinite benefits guide; Milesopedia — Rogers Red World Elite Mastercard.</li>
  <li>Priority Pass — Canada directory pages for Toronto Pearson, Vancouver, Montréal, Calgary, Edmonton, Ottawa Aspire Salon, Winnipeg, Billy Bishop; Pre-book; guest policy; Chase — Priority Pass membership levels and cost.</li>
  <li>National Bank — National Bank Lounge at Montréal airport; Milesopedia — National Bank Lounge renovation and temporary lounge, Aspire Lounge international zone YUL, YUL and YVR lounge access guides; Aspire — Aspire International Lounge YUL.</li>
  <li>WestJet — Elevation Lounge and access rules; LoungeReview — WestJet Elevation Lounge review.</li>
  <li>Frugal Flyer — Plaza Premium First YVR review; YVR — SkyTeam Lounge; Plaza Premium — Edmonton lounges; Winnipeg Airports Authority — Plaza Premium Lounge; Ottawa International Airport — Lounges; Toronto Pearson — Book a lounge; Rewards Canada — Lounge access guide.</li>
  <li>Aéroport de Québec — Boréal Lounge by YQB and Air Canada Café opens at YQB.</li>
  <li>Priority Pass — network size; Upgraded Points — Priority Pass guide; Amex ICC — Priority Pass programme terms; Amex Canada — Corporate Platinum benefits.</li>
  <li>AirportLounges.ca — Amex Platinum lounge access in Canada, Airport lounge guest fees in Canada, Montréal airport lounges.</li>
</ul>

<p><em>All card and lounge facts on this page reflect information current as of September 11, 2026. Rules change without notice — always confirm with the issuer and operator before travelling. Next scheduled review: December 2026 (Amex Platinum cap on January 1, 2027; Boréal Lounge opening; National Bank renovation status). Quarterly checks on lounge status thereafter.</em></p>
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

<p><em>Access: Air Canada Business/First class; Star Alliance Gold; Aeroplan 50K+; TD, CIBC, or Amex Aeroplan premium cards. Not Priority Pass eligible.</em></p>

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

<p><em>Access: Air Canada Business/First class; Star Alliance Gold; Aeroplan 50K+; Aeroplan premium cards. Domestic only. Not Priority Pass eligible.</em></p>

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

<h2>Related reading</h2>
<ul>
  <li><a href="/blog/canadian-airport-lounges-sleep-pods">Canadian airport lounges with sleep pods and rest facilities</a> — the five lounges with real rest amenities, including the only 24-hour lounge in the country</li>
  <li><a href="/blog/canadian-airport-lounges-shower-access">Canadian airport lounges with shower access</a> — companion guide covering every lounge with a shower</li>
  <li><a href="/blog/amex-platinum-airport-lounge-access-canada">Amex Platinum airport lounge access in Canada</a> — cross-reference for card-based access to the work-friendly lounges</li>
</ul>

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
<p data-speakable="intro"><strong>Canada has no single guest-fee system. The same companion costs $0 at one lounge and $65 plus GST at the next. The price depends on your card as much as the lounge. The benchmarks: US$35 per guest at any Priority Pass lounge, US$32 per person once a DragonPass or Visa Airport Companion pool is used up, $59 for an extra guest at an Air Canada Maple Leaf Lounge, $59 to $65 plus GST at WestJet's Elevation Lounge, and $37 plus tax at the National Bank Lounge in Montréal. No Canadian card includes unlimited Priority Pass guests. The closest one, the Amex Platinum, is capped from January 1, 2027. The cheapest card with a guest built in is the National Bank World Elite Mastercard at $150, for international departures from Montréal.</strong></p>

<h2>What changed in this update (September 11, 2026)</h2>

<p>Four corrections and six additions after a full re-check against operator and issuer terms:</p>

<ul>
  <li><strong>Corrected:</strong> the Amex Aeroplan Reserve does not include a Priority Pass guest. Its membership fee is waived, but every visit — for the cardholder and any guest — is charged at the prevailing rate. Its guest benefit is Maple Leaf Lounge only.</li>
  <li><strong>Corrected:</strong> Priority Pass coverage at YUL's Desjardins Odyssey lounges varies by location; the transborder location appears in Priority Pass's own directory.</li>
  <li><strong>Corrected:</strong> Plaza Premium First at YVR does not accept Priority Pass at all. Entry is $110 for two hours, or a $30 upgrade from the standard lounge.</li>
  <li><strong>Corrected:</strong> Maple Leaf Lounge access can be pre-purchased on some fares, from $25 on Latitude, at booking or 24 hours ahead.</li>
  <li><strong>Added:</strong> the January 1, 2027 Amex Platinum cap, the July 8, 2026 Centurion one-guest rule, the National Bank World Elite Mastercard, Desjardins Odyssey card rules, a children section, guest capacity limits, and current Priority Pass tier pricing.</li>
  <li><strong>Removed:</strong> the Chase Sapphire Reserve rows. It is a US-issued card most Canadians cannot apply for.</li>
</ul>

<blockquote>
<p><strong>Editorial disclosure:</strong> AirportLounges.ca may receive compensation if you apply for a card through links on this page. This does not affect the issuer's terms or the price you pay. Fees on this page were checked against operator and issuer pages on September 11, 2026; they change, so confirm before you travel.</p>
</blockquote>

<h2>Guest fee quick-reference table</h2>

<table>
  <thead>
    <tr><th>Network or lounge</th><th>Guest included?</th><th>Extra guest fee</th><th>Children</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>Priority Pass (direct membership)</td><td>No, at any tier</td><td>US$35 / person</td><td>Set by each lounge; under 2 usually free</td><td>Charged to the membership on file</td></tr>
    <tr><td>Priority Pass Select via Amex Platinum</td><td>1 through Dec 31, 2026</td><td>US$35 / person</td><td>Under 2 usually not counted</td><td>From 2027 a guest uses one of 6 visits</td></tr>
    <tr><td>Priority Pass via Amex Aeroplan Reserve</td><td>No</td><td>Prevailing rate (about US$32–35), cardholder too</td><td>Set by lounge</td><td>Membership fee waived; every visit billed</td></tr>
    <tr><td>DragonPass via Visa Airport Companion or Mastercard Travel Pass</td><td>Guest uses a pool visit</td><td>US$32 / person after the pool</td><td>Set by lounge</td><td>Pool is 4, 6 or 10 visits depending on card</td></tr>
    <tr><td>Plaza Premium (walk-in)</td><td>n/a</td><td>About $60–81 CAD for 2 hours by airport</td><td>Under 2 free at most</td><td>Plaza Premium First YVR: $110 direct, Priority Pass not accepted</td></tr>
    <tr><td>Air Canada Maple Leaf Lounge</td><td>1 with status, Maple Leaf Club or a premium Aeroplan card</td><td>$59 in the lounge's local currency</td><td>50K+ status: up to 5 dependents under 25</td><td>Same-day Air Canada or Star Alliance departure required</td></tr>
    <tr><td>WestJet Elevation Lounge (YYC)</td><td>No standard allowance</td><td>$59 + GST on WestJet; $65 + GST other airlines</td><td>$30 / $33 + GST ages 2–17; under 2 free</td><td>Card guest allowances not confirmed by WestJet</td></tr>
    <tr><td>Desjardins Odyssey Lounges (YUL)</td><td>8 passes / year on World Elite, usable for companions</td><td>$42–44 + tax adult walk-in; 50% off with a Desjardins card</td><td>Under 3 free; $26 child rate</td><td>Zone-restricted; flight delay uses another pass</td></tr>
    <tr><td>National Bank Lounge (YUL international)</td><td>1 guest + 2 children ≤12 with World Elite</td><td>$37 + tax adult; $26 child</td><td>Under 2 free</td><td>International departures only; temporary reduced-capacity lounge until about June 2028</td></tr>
    <tr><td>Centurion Lounge (US; none in Canada)</td><td>1 since July 8, 2026</td><td>Amex sets the fee</td><td>Set by Amex</td><td>Guest must be on the same flight</td></tr>
  </tbody>
</table>

<p><em>Verified September 11, 2026. Currencies as shown: Priority Pass and DragonPass bill in US dollars; everything else is Canadian dollars in Canada.</em></p>

<h2>Before you count on a guest fee: where Priority Pass actually works in Canada</h2>

<p>A guest fee only matters if there is a lounge to enter. Priority Pass lounges operate at nine Canadian airports: Toronto Pearson (YYZ), Toronto Billy Bishop (YTZ), Vancouver (YVR), Calgary (YYC), Montréal (YUL), Ottawa (YOW), Edmonton (YEG), Winnipeg (YWG) and Québec City (YQB — pending). Montréal is the catch — its full Priority Pass lounges sit in the international wing. A domestic or US-bound traveller may find nothing in their zone. See our Priority Pass lounges in Canada guide for the airport-by-airport list before you promise a companion a seat.</p>

<h2>Priority Pass guest fees in Canada</h2>

<p>Priority Pass sells three tiers, and none includes a guest. Standard is US$99 a year and every visit costs US$35. Standard Plus is US$329 with ten included visits, then US$35. Prestige is US$469 with unlimited member visits. Guests cost US$35 per visit at every tier. One way to read Standard: it is a $99 fee that buys the right to pay $35 a visit.</p>

<table>
  <thead>
    <tr><th>Priority Pass tier</th><th>Annual fee</th><th>Member visits</th><th>Guest</th><th>10 trips alone</th><th>10 trips with a guest</th></tr>
  </thead>
  <tbody>
    <tr><td>Standard</td><td>US$99</td><td>US$35 each</td><td>US$35</td><td>US$449</td><td>US$799</td></tr>
    <tr><td>Standard Plus</td><td>US$329</td><td>10 included, then US$35</td><td>US$35</td><td>US$329</td><td>US$679</td></tr>
    <tr><td>Prestige</td><td>US$469</td><td>Unlimited</td><td>US$35</td><td>US$469</td><td>US$819</td></tr>
  </tbody>
</table>

<p>That last column is the number that sends people looking for a credit card. A couple on Prestige pays past US$800 for ten trips. Card-issued Priority Pass Select memberships are different. The Amex Platinum's includes one complimentary guest through 2026. The Amex Aeroplan Reserve's includes none and bills the cardholder too. If you travel as a pair, start with the Canadian cards that include at least one complimentary lounge guest rather than a retail membership.</p>

<h2>DragonPass and the Visa Airport Companion: the pool problem</h2>

<p>Most Canadian bank cards use DragonPass, branded as Visa Airport Companion or Mastercard Travel Pass. You get a pool of visits, and every person who walks in uses one. Scotiabank's terms spell it out: a cardholder and one guest count as two visits. Once the pool is gone, every visit costs US$32 per person, cardholder included.</p>

<p>Two details decide how far a pool stretches. First, size — four visits on the BMO Ascend World Elite, six on the Scotiabank Passport Visa Infinite + and the CIBC and TD Visa Infinite Privilege cards, and ten on the Scotiabank Passport Visa Infinite Privilege. Second, who owns it — the Passport Visa Infinite Privilege grants ten visits per cardholder, so a supplementary cardholder has their own ten. The Passport Visa Infinite + grants six to the primary cardholder only. A spouse travelling alone cannot use them.</p>

<table>
  <thead>
    <tr><th>Card</th><th>Annual fee</th><th>Included visits</th><th>Whose pool</th><th>After the pool</th></tr>
  </thead>
  <tbody>
    <tr><td>Scotiabank Passport Visa Infinite +</td><td>$150</td><td>6</td><td>Primary cardholder only</td><td>US$32 / person</td></tr>
    <tr><td>Scotiabank Passport Visa Infinite Privilege</td><td>$599</td><td>10</td><td>Each cardholder</td><td>US$32 / person</td></tr>
    <tr><td>CIBC Aeroplan Visa Infinite Privilege</td><td>$599</td><td>6</td><td>Each enrolled cardholder</td><td>US$32 / person</td></tr>
    <tr><td>CIBC Aventura Visa Infinite Privilege</td><td>$599</td><td>6</td><td>Cardholder</td><td>US$32 / person</td></tr>
    <tr><td>TD Aeroplan Visa Infinite Privilege</td><td>$599</td><td>6</td><td>Cardholder</td><td>US$32 / person (program rate)</td></tr>
    <tr><td>BMO Ascend World Elite Mastercard</td><td>$150</td><td>4</td><td>Primary, usable for companions</td><td>US$32 / person</td></tr>
  </tbody>
</table>

<p>Six visits is three trips as a couple. Four is two. Retail DragonPass memberships are no help for guests either — the entry tier lists guest access as not available, and only higher tiers allow a paid guest. DragonPass also re-priced its tiers in 2026, so the old US$99, US$219 and US$399 figures are out of date. If the pool math does not work for you, the cards with a guest built in are the alternative.</p>

<h2>Air Canada Maple Leaf Lounge guest fees</h2>

<p>One guest is included with Aeroplan 50K status and above, Star Alliance Gold, Maple Leaf Club membership and the three premium Aeroplan credit cards. Extra guests pay $59 in the lounge's local currency (CAD in Canada, USD in the US, EUR and GBP abroad) plus local taxes. You and your guests need a same-day departing flight on Air Canada or a Star Alliance airline. Paid guests can only be brought into Air Canada's own lounges. Business-class passengers get no guest unless they pay the $59.</p>

<p>You can also buy your own access ahead of time on some fares. Air Canada's booking flow shows the Maple Leaf Lounge travel option at $25 on Latitude and $50 on Flex. Other published schedules run $49 (Latitude and Premium Economy), $59 (Comfort) and $79 (Flex). Prices vary by channel and have moved. Take the range as <strong>$25 to $79</strong>, bought at booking or at least 24 hours before departure. It is not sold at the door.</p>

<p>Two lesser-known routes: Maple Leaf Club members have a legacy guest schedule of $20 before 11 a.m. and $30 after, with dependent children under 12 included. Status holders get one-time guest passes each year: two at 25K (via a Select Benefit) and 35K, three at 50K and 75K, four at Super Elite. TD and CIBC Aeroplan cards also issue a One-Time Guest Pass for every $10,000 spent — it works at Canadian and US Maple Leaf Lounges, but not in international departure zones or Signature Suites.</p>

<h2>WestJet Elevation Lounge guest fees</h2>

<p>WestJet's Calgary lounge publishes the clearest guest prices in the country. A guest on a WestJet flight pays $59 plus GST. A child aged 2 to 17 pays $30 plus GST, and under-2s are free. Guests flying another airline pay $65 plus GST, or $33 plus GST for a child. The lounge accepts Priority Pass, DragonPass via Mastercard Travel Pass, Lounge Club and Diners Club. The maximum stay is three hours. WestJet's page does not say whether a card-issued Priority Pass guest allowance is honoured here — treat that as unconfirmed and budget the fee. Two things to know: Priority Pass members are the first turned away when the lounge is full, and WestJet RBC World Elite Mastercard holders can exchange a companion voucher for two lounge vouchers, a real route to a covered guest.</p>

<h2>Desjardins Odyssey Lounges at YUL</h2>

<p>Montréal has two Desjardins Odyssey lounges. The international lounge near Gate 63 is open only to passengers flying outside Canada and the US. The transborder lounge near Gate 76 opened March 1, 2024, for US-bound passengers from Gates 72 to 89. Neither serves domestic flyers. The Odyssey World Elite Mastercard includes eight passes per account per year, then 50% off entry. On each visit the discount also covers one companion, or another cardholder on the account, plus up to three children under 18. The Odyssey Visa Infinite Privilege has its own pass rules. The Gold Visa and Platinum cards get the 50% discount with no passes.</p>

<p>The rules that bite: every person who enters uses a pass, except children under three. A pass covers only the three hours before your flight. If the flight is delayed, another pass is consumed for you and for each person staying with you. Walk-in entry is about $42 to $44 plus tax for an adult and $26 for a child, with a three-hour limit. On Priority Pass, coverage varies by location and has changed over time — the transborder Desjardins Plaza Premium Lounge appears in Priority Pass's YUL directory as of this update; the international lounge's status has flipped before. Check the Priority Pass app for your concourse on the day; do not rely on a blanket yes or no, including from us.</p>

<h2>The National Bank Lounge at YUL: Canada's cheapest card with a guest included</h2>

<p>If you fly internationally from Montréal, this is the answer to the whole page. The National Bank World Elite Mastercard costs $150 a year, or $50 per additional cardholder. It includes unlimited access to the National Bank Lounge near Gate 53 for the cardholder, one guest and two children aged 12 or under. Additional cardholders get the same access with their own guest.</p>

<p>The constraints: it applies only to departures outside Canada and the US, since the lounge sits past Gate 52. You must show the physical card and a boarding pass. Income requirements are $80,000 personal or $150,000 household. The card also has a 2.5% foreign transaction fee, a $150 annual travel credit, and paid DragonPass access elsewhere. Anyone else pays $37 plus tax per adult and $26 per child, with under-2s free. Priority Pass members can bring guests at those rates; the lounge sets the limit.</p>

<p>One timing note: the lounge closed for a full renovation on July 31, 2026. A temporary, reduced-capacity lounge opened in the same spot on August 1, 2026, with a two-hour maximum stay, and National Bank expects the full lounge back in June 2028. For a reader who just learned a Priority Pass guest is US$35, a $150 card with a guest and two kids included is the strongest value on this page. <a href="https://www.finlywealth.com/credit-cards/reviews/national-bank-world-elite-mastercard?utm_source=airportlounges_ca&utm_content=guest-fees-nbc" target="_blank" rel="sponsored nofollow noopener"><strong>See the current National Bank World Elite offer on FinlyWealth →</strong></a></p>

<h2>Bringing children to a Canadian airport lounge</h2>

<p>Under 2 is free almost everywhere: the National Bank Lounge, the Aspire lounges at YUL, WestJet Elevation and most Priority Pass lounges. With the Amex Platinum, an infant does not count as a guest. Desjardins Odyssey draws the line at under 3. Above that, every operator sets its own rule. WestJet charges a child rate of $30 or $33 plus GST for ages 2 to 17. National Bank charges $26 plus tax per child beyond the two included with a World Elite card. Desjardins counts every child over 3 as one pass or one discounted entry. Some Priority Pass lounges admit ages 2 to 12 free; others charge the full adult guest fee. Check the lounge listing. Aeroplan 50K status and above covers up to five dependent children under 25 in Maple Leaf Lounges. Anyone under the age of majority must be with an adult who has access.</p>

<h2>How many guests can you actually bring?</h2>

<p>Lounges cap the number of guests per cardholder, and the cap is separate from the fee. Guest limits are set lounge by lounge — Priority Pass's own help centre says so and points members to each listing. The Aspire Domestic and International Lounges at YUL and the Air France Lounge run by Plaza Premium list no guest limit for Priority Pass holders, subject to per-person charges and space. Desjardins limits the discount to one companion plus three children per visit. Card benefits are stricter: one guest is the standard allowance on Canadian premium cards, and on the Amex Platinum a second guest pays the retail rate. For a group of four, expect to pay for at least two people at most lounges.</p>

<p>Timing can also block a guest you have paid for. The Air France Lounge at YUL is reserved for Air France and KLM customers every day from 3:30 to 6:30 p.m. Those customers have priority at all other times. Arrive in that window with a paying companion and neither of you gets in.</p>

<h2>Plaza Premium First at YVR: the $110 exception</h2>

<p>Vancouver's Plaza Premium First section is not an upcharge lounge for Priority Pass members — Priority Pass is not accepted there at all. The change is indefinite and was made to control crowding. There are two ways in: pay $110 for a two-hour visit directly, or enter the standard Plaza Premium Lounge next door on a card benefit and pay a $30 upgrade. No card, membership or premium-cabin ticket gets you in without one of those payments. The standard lounge still takes Amex Platinum and Business Platinum, Amex Gold Rewards (four visits a year), DragonPass through Visa Airport Companion and Mastercard Travel Pass, premium cabin tickets, or a walk-in fee from $69. Plaza Premium's US-departures and domestic lounges at YVR still accept Priority Pass. WestJet passengers get 20% off the standard walk-in price with a boarding pass.</p>

<h2>What changes on January 1, 2027 for Amex Platinum holders</h2>

<p>The Amex Platinum is the only Canadian card with unlimited Priority Pass and Plaza Premium visits and a complimentary guest. That ends on January 1, 2027. From that date a basic cardholder gets 6 Plaza Premium and 6 Priority Pass visits per calendar year. A supplementary cardholder gets 2 of each. A guest uses one of those visits, so there is no complimentary guest under the capped model. Spend $20,000 on the account in 2026, or in any later calendar year, and unlimited access with one complimentary guest comes back for the rest of that year and all of the next. Visits reset every January 1 and do not roll over. Once they are gone you can still enter by paying the lounge's regular rate. Centurion Lounges, Delta Sky Club, Aspire, Swissport and other airline-run lounges in the Global Lounge Collection stay unlimited.</p>

<p>The guest-fee consequence is blunt: a couple burns a network's six visits in three trips. Two more things changed in 2026 — on July 8, 2026 the Centurion Lounge guest allowance for Canadian Platinum cardholders dropped from two to one, with the guest required to be on the same flight; and the one-guest rule is not uniform. Our full guide covers the card: Amex Platinum airport lounge access in Canada. If unlimited guests were the reason you wanted the Platinum, compare the cards with at least one complimentary lounge guest before the cap starts.</p>

<h2>Canadian cards that give you at least one complimentary guest visit</h2>

<p>No Canadian card includes unlimited Priority Pass guests. This table lists what the terms actually support, with the constraint that matters beside each card.</p>

<table>
  <thead>
    <tr><th>Card</th><th>Annual fee</th><th>Guest included at</th><th>Key constraint</th></tr>
  </thead>
  <tbody>
    <tr><td>National Bank World Elite Mastercard</td><td>$150</td><td>National Bank Lounge YUL: 1 guest + 2 children ≤12</td><td>International departures only; income $80,000 / $150,000</td></tr>
    <tr><td>Desjardins Odyssey World Elite Mastercard</td><td>About $130</td><td>Odyssey Lounges YUL: 8 passes a year usable for companions</td><td>YUL only; each person over 3 uses a pass; delays cost a pass</td></tr>
    <tr><td>TD Aeroplan Visa Infinite Privilege</td><td>$599</td><td>Maple Leaf Lounge: 1 guest per cardholder</td><td>Confirmed through Dec 31, 2026; income $150,000 / $200,000; 6 DragonPass visits shared with guests</td></tr>
    <tr><td>CIBC Aeroplan Visa Infinite Privilege</td><td>$599</td><td>Maple Leaf Lounge and Air Canada Café: 1 guest per cardholder</td><td>Confirmed through Dec 31, 2026; 6 Visa Airport Companion visits shared with guests</td></tr>
    <tr><td>Amex Aeroplan Reserve</td><td>$599</td><td>Maple Leaf Lounge only: 1 guest</td><td>Priority Pass is pay-per-visit for cardholder and guests</td></tr>
    <tr><td>Amex Platinum (Canada)</td><td>$799</td><td>Priority Pass and Plaza Premium: 1 guest; Centurion: 1 guest on the same flight</td><td>Capped at 6 + 6 visits from Jan 1, 2027 unless $20,000 annual spend; guests use visits</td></tr>
    <tr><td>Aeroplan 50K+ status (not a card)</td><td>n/a</td><td>Maple Leaf Lounge: partner, up to 5 children under 25, plus 1 guest</td><td>Extra guests $59</td></tr>
    <tr><td>WestJet RBC World Elite Mastercard</td><td>$119</td><td>Elevation Lounge via companion voucher exchanged for 2 lounge vouchers</td><td>Voucher exchange required; not a standing allowance</td></tr>
  </tbody>
</table>

<p><em>Fees verified September 11, 2026.</em></p>

<h2>10 guest fee traps nobody warns you about</h2>

<ol>
  <li><strong>"One guest" depends on the network.</strong> One guest is standard at Priority Pass and Plaza Premium on the Amex Platinum. Centurion dropped to one guest on the same flight on July 8, 2026. Some dual-network Canadian lounges let allowances stack. Children under 2 usually do not count.</li>
  <li><strong>The Amex Aeroplan Reserve's Priority Pass is not free for anyone.</strong> The membership fee is waived; every visit, yours included, is billed at the prevailing rate.</li>
  <li><strong>A DragonPass pool counts people, not trips.</strong> You and one guest use two visits. Six visits is three trips as a couple.</li>
  <li><strong>Odyssey lounges are zone-restricted and coverage varies.</strong> The international lounge needs an international boarding pass; the transborder lounge is US-bound only. Priority Pass listing differs by location. Check the app.</li>
  <li><strong>The Amex Platinum 2027 cliff.</strong> Guests consume visits from a six-visit allowance per network. A couple is done in three trips unless the card sees $20,000 of spend.</li>
  <li><strong>The Desjardins delay penalty.</strong> A pass covers three hours before departure. A delay costs another pass for you and everyone with you.</li>
  <li><strong>Retail DragonPass entry tiers allow no guests.</strong> Only higher tiers list a paid guest. A membership does not automatically mean you can bring someone.</li>
  <li><strong>Some pools belong to the primary cardholder only.</strong> Scotiabank Passport Visa Infinite + visits cannot be used by a supplementary cardholder travelling alone. The Privilege version gives ten per cardholder.</li>
  <li><strong>Capacity beats your receipt.</strong> Priority Pass members are the first turned away at WestJet Elevation when it is full, and every lounge on this page admits "subject to space."</li>
  <li><strong>Peak-hour lockouts.</strong> The Air France Lounge at YUL is closed to non-Air France and KLM customers from 3:30 to 6:30 p.m. A paid guest cannot enter a lounge you cannot enter.</li>
</ol>

<h2>Which card gets you and your guest in for the least?</h2>

<p>Run your own numbers. The following table compares what you would pay in guest fees against the annual fee of each card that includes a guest. It ignores your own access and the card's other benefits on purpose. It answers one question: do guest fees alone justify the card?</p>

<table>
  <thead>
    <tr><th>Scenario</th><th>Card</th><th>Annual fee</th><th>Verdict at 6 trips/yr × 1 guest × $59 = $354 in guest fees</th></tr>
  </thead>
  <tbody>
    <tr><td>International from Montréal</td><td>National Bank World Elite Mastercard</td><td>$150</td><td>Cheaper than paying — save ~$204</td></tr>
    <tr><td>Any zone at Montréal, a few trips a year</td><td>Desjardins Odyssey World Elite Mastercard</td><td>~$130</td><td>Cheaper than paying — save ~$224</td></tr>
    <tr><td>Air Canada flyers as a couple</td><td>CIBC or TD Aeroplan VIP</td><td>$599</td><td>Costs $245 more than paying guest fees alone (Aeroplan earning + other benefits stack on top)</td></tr>
    <tr><td>Mixed airlines, frequent trips</td><td>Amex Platinum</td><td>$799</td><td>Costs $445 more than paying alone; break-even improves when $200 travel + $200 dining credits are used</td></tr>
    <tr><td>Occasional trips, guest fees under $150 a year</td><td>None — pay the fee</td><td>—</td><td>Every card above costs more than the guest fees you would otherwise pay</td></tr>
  </tbody>
</table>

<p><em>Table compares your guest fees to each card's annual fee only and ignores the cardholder's own access, points, credits and insurance. Card fees verified September 11, 2026.</em></p>

<p><strong>Filter by what you fly and where:</strong> Canadian cards that include at least one complimentary lounge guest.</p>

<h2>Methodology</h2>
<p>Every fee on this page comes from an operator page (Priority Pass, DragonPass, Air Canada, WestJet, Desjardins, National Bank, Plaza Premium via Frugal Flyer's review) or an issuer's benefits guide or product page, checked on September 11, 2026. Where operator sources conflict (Maple Leaf Lounge pre-purchase prices, the Desjardins walk-in rate, the Aeroplan Reserve per-visit fee, Amex Platinum's Plaza Premium guest allowance), the conflict is stated rather than resolved. Break-even figures are calculations shown in full. No card ratings are displayed.</p>

<h2>Change log</h2>
<ul>
  <li><strong>September 11, 2026:</strong> Full re-verification. Corrected Amex Aeroplan Reserve (Priority Pass pay-per-visit, Maple Leaf guest only), Desjardins Odyssey Priority Pass coverage, Plaza Premium First YVR pricing and access, and Maple Leaf Lounge pre-purchase. Added the January 1, 2027 Amex Platinum cap, the July 8, 2026 Centurion guest change, National Bank World Elite Mastercard, Desjardins card rules, children and capacity sections, current Priority Pass tiers, and per-cardholder vs. per-account DragonPass pools. Removed Chase Sapphire Reserve. Expanded traps from 7 to 10.</li>
  <li><strong>June 6, 2026:</strong> First published.</li>
</ul>

<h2>Sources</h2>
<ul>
  <li>American Express Canada — Aeroplan Reserve Card membership benefits (Priority Pass fee waived, visits at prevailing rate for cardmember and guests); Prince of Travel — How to access Priority Pass lounges.</li>
  <li>Rewards Canada — Platinum Card lounge access changes effective January 1, 2027; Prince of Travel — Centurion Lounge guest and layover rules for Canada; Flytrippers — Amex Platinum lounge access; Milesopedia — Platinum Card benefits.</li>
  <li>Priority Pass — Canada lounges, Montréal-Trudeau lounges, National Bank Lounge, Air France Lounge, Aspire Domestic, Aspire International; Chase — Priority Pass membership levels and cost.</li>
  <li>DragonPass — Memberships; Scotiabank — Passport Visa Infinite + welcome kit and Passport Visa Infinite Privilege; CIBC — Aeroplan Visa Infinite Privilege benefits guide and Aventura Visa Infinite Privilege benefits guide; BMO — Ascend World Elite Mastercard; Air Canada — TD Aeroplan cards.</li>
  <li>Air Canada — Maple Leaf Lounges, Maple Leaf Lounge travel option, Maple Leaf Lounge terms, One-Time Guest Pass; Maple Leaf Club — Worldwide membership; Prince of Travel — How to access Maple Leaf Lounges.</li>
  <li>WestJet — Elevation Lounge and Airport lounges.</li>
  <li>Desjardins — Odyssey Lounges access rules and Desjardins Odyssey Lounge at YUL; Milesopedia — Desjardins Odyssey Lounge, transborder; Rewards Canada — Salon Odyssée Desjardins Plaza Premium Lounge opens.</li>
  <li>National Bank — World Elite Mastercard and National Bank Lounge; Ratehub — National Bank World Elite review; Milesopedia — National Bank World Elite Mastercard.</li>
  <li>Frugal Flyer — Plaza Premium First YVR review (Priority Pass not accepted, $110 / $30); Plaza Premium — Montréal lounges; Rewards Canada — Lounge access guide (Plaza Premium walk-in ranges).</li>
  <li>AirportLounges.ca — Priority Pass lounges in Canada, Montréal airport lounges, Canadian lounges with showers, Best lounges for remote work.</li>
</ul>

<p><em>All fees and rules on this page reflect information current as of September 11, 2026. Rules and offers change without notice — always confirm with the operator and issuer before travelling. Next scheduled review: December 2026 (TD and CIBC guest terms; Amex Platinum cap on January 1, 2027).</em></p>
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
    <tr><td>Centurion Lounges</td><td>None in Canada. Nearest: Seattle, New York JFK / LaGuardia, plus 20+ US and international sites</td><td>Unlimited</td><td>Unlimited</td><td>1, on the same flight (since July 8, 2026)</td></tr>
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

<p>Centurion Lounges are Amex's own. The food and design are a clear step above the rest of the collection. There are none in Canada. The closest for most Canadians are Seattle, New York JFK and LaGuardia, and the rest of the US network. You need a same-day boarding pass and can enter within 3 hours of departure. Since July 8, 2026, Canadian cardholders can bring one guest, and that guest must be on the same flight. Before that date it was two.</p>

<blockquote>
<p>Individual Centurion Lounge rules can still differ by location. Check the specific lounge in the Amex lounge finder before you fly.</p>
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
    <tr><td>Centurion Lounge</td><td>1, on the same flight (since July 8, 2026)</td><td>1, on the same flight</td><td>Canada-issued cards; same-day boarding pass</td></tr>
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
  <li><strong>YUL International:</strong> the Aspire International Lounge between Gates 52 and 53 (3-hour window), and the National Bank Lounge near Gate 53, which is in a temporary reduced-capacity space from August 1, 2026 until about June 2028 with a 2-hour stay. The Air France–KLM Lounge by Plaza Premium is also in the international zone, reserved for Air France and KLM passengers in the late afternoon (closed to others 3:30–6:30 p.m.).</li>
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
    <tr><td>National Bank World Elite Mastercard</td><td>$150</td><td>Unlimited National Bank Lounge at Montreal (international departures only) + DragonPass</td><td>Montreal-based international flyers</td></tr>
  </tbody>
</table>

<p><em>Fees and lounge terms verified September 11, 2026. DragonPass visits are per calendar year; extra visits cost about US$32 each. Income requirements apply to all Visa Infinite Privilege cards.</em></p>

<h2>Who should get the Amex Platinum — and who should not</h2>

<h3>Strengths</h3>
<ul>
  <li>Widest lounge network on any Canadian card: five networks, 1,550+ lounges.</li>
  <li>Unlimited Plaza Premium and Priority Pass visits through December 31, 2026 with one guest included.</li>
  <li>Centurion access with one guest on the same flight (since July 8, 2026) when travelling through the US.</li>
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
<p data-speakable="intro"><strong>For most eligible Canadians, the CIBC Aeroplan Visa Infinite Privilege is the strongest lounge card of the three. It pairs unlimited eligible Maple Leaf Lounge access with six Visa Airport Companion visits a year, and has the cheapest premium supplementary card at $149. TD Aeroplan Visa Infinite Privilege has nearly the same package and wins when its welcome offer or a TD banking rebate is better. Amex Aeroplan Reserve is the pick for heavy Air Canada spending (3 points per $1), for applicants below the Visa Infinite Privilege income floor, and for Toronto Pearson regulars — but its Priority Pass visits are paid, not included. All three cost $599 a year. One caution: TD and CIBC confirm the one-guest benefit only through December 31, 2026.</strong></p>

<blockquote>
<p><strong>Editorial disclosure:</strong> AirportLounges.ca may receive compensation if you apply through links on this page. This does not affect the card issuer's terms or the price you pay. Card details and offers can change; verify the current terms on the application page before applying. Facts on this page were checked against issuer and Air Canada pages on September 11, 2026.</p>
</blockquote>

<blockquote>
<p><strong>2027 guest-access alert:</strong> TD and CIBC currently confirm one complimentary Maple Leaf Lounge guest only through December 31, 2026. Amex publishes one guest with no end date, but Air Canada's own lounge page calls complimentary guest admission a limited-time benefit. Check the current terms before applying if guest access is central to your decision.</p>
</blockquote>

<h2>TD vs CIBC vs Amex: Aeroplan lounge-access comparison</h2>

<p>All three cards are $599 a year and open Air Canada's own Maple Leaf Lounges and Air Canada Cafés in Canada and the United States on a same-day Air Canada or Star Alliance departure. The differences are in supplementary card pricing, the other lounge network each card includes, earn rates, and travel insurance.</p>

<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>TD Aeroplan VIP</th>
      <th>CIBC Aeroplan VIP</th>
      <th>Amex Aeroplan Reserve</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Annual fee</td><td>$599</td><td>$599</td><td>$599</td></tr>
    <tr><td>Additional card with lounge access</td><td>$199</td><td>$149 (up to 9)</td><td>$199 (premium supplementary)</td></tr>
    <tr><td>Published income requirement</td><td>$150,000 personal / $200,000 household</td><td>$150,000 personal / $200,000 household</td><td>None published</td></tr>
    <tr><td>Maple Leaf Lounge and Air Canada Café</td><td>Unlimited, Canada and U.S.</td><td>Unlimited, Canada and U.S.</td><td>Unlimited, Canada and U.S.</td></tr>
    <tr><td>Guest in 2026</td><td>1, through Dec. 31, 2026</td><td>1, through Dec. 31, 2026</td><td>1, no expiry stated</td></tr>
    <tr><td>Other lounge network</td><td>6 Visa Airport Companion visits a year</td><td>6 Visa Airport Companion visits a year</td><td>Priority Pass: US$99 fee waived, each visit charged</td></tr>
    <tr><td>Air Canada purchases</td><td>2x</td><td>2x</td><td>3x</td></tr>
    <tr><td>Dining</td><td>1.5x</td><td>1.5x</td><td>2x (Canada; food delivery included)</td></tr>
    <tr><td>Everything else</td><td>1.25x</td><td>1.25x</td><td>1.25x</td></tr>
    <tr><td>Trip cancellation, per-trip maximum</td><td>$5,000</td><td>$10,000</td><td>$3,000</td></tr>
    <tr><td>Emergency medical, age 65+</td><td>4 days</td><td>10 days</td><td>Not included (confirm with certificate)</td></tr>
    <tr><td>Best lounge use case</td><td>Broad coverage, TD banking rebates</td><td>Broad coverage, cheaper partner card, stronger insurance</td><td>Air Canada spender, Toronto Pearson user</td></tr>
  </tbody>
</table>

<p><em>Verified September 11, 2026 on issuer card pages, Air Canada's issuer benefit pages and the issuers' insurance summaries. Six Visa Airport Companion visits are a pool — a guest's entry uses one. Extra visits cost US$32. Amex's "1,200+ lounges" wording refers to Priority Pass membership; every visit is billed at the prevailing rate.</em></p>

<h2>How Aeroplan credit-card lounge access works</h2>

<h3>Which Maple Leaf Lounges are included?</h3>
<p>All three cards cover eligible Air Canada Maple Leaf Lounges and Air Canada Cafés in Canada and the United States. That includes the international Maple Leaf Lounges at Toronto, Vancouver and Montreal when you fly abroad. It does <strong>not</strong> include Air Canada Signature Suites. It does <strong>not</strong> include Maple Leaf Lounges outside Canada and the U.S., such as London, Paris and Frankfurt. It does <strong>not</strong> include lounges run by other Star Alliance airlines. "Star Alliance lounge access" is the wrong way to describe this benefit — the card opens Air Canada's own lounges only.</p>

<h3>Which flights qualify?</h3>
<p>You need a same-day departing ticket. The flight must be marketed or operated by Air Canada, Air Canada Rouge, Air Canada Express or a Star Alliance airline. Link the card to your Aeroplan account and add that Aeroplan number to the booking. Entry is subject to space. Arriving on Air Canada does not qualify — the benefit is for departures. A connection counts only when the next leg is on a qualifying airline.</p>

<h3>Can you bring a guest?</h3>
<p>Yes, one, and the guest must enter with you. At TD and CIBC, the primary cardholder and each premium additional cardholder can bring one guest through December 31, 2026. Amex's terms say the basic cardmember and each $199 supplementary cardmember may bring one guest, and no end date is stated. A no-fee Amex supplementary card does not carry the lounge benefit. Extra guests pay Air Canada's fee of $59 in the lounge's local currency, subject to change.</p>

<h3>What changes after December 31, 2026?</h3>
<p>TD's and CIBC's Air Canada terms put a date on the guest benefit, not on your own access. After that date, guest access on those two cards is unconfirmed until the issuers publish an extension or a new rule. Amex publishes one guest with no date, but Air Canada's own lounge page calls complimentary guest admission a limited-time benefit. The honest reading: Amex looks better for couples after 2026 today, and any of the three could change. Do not build a decision on guest access you cannot see in writing.</p>

<h2>TD Aeroplan Visa Infinite Privilege review</h2>

<h3>Lounge access and guest rules</h3>
<p>TD gives the primary and each $199 additional cardholder unlimited eligible Maple Leaf Lounge and Air Canada Café access in Canada and the U.S. One guest is included through December 31, 2026. On top of that, you get six Visa Airport Companion visits per membership year. That program, run by DragonPass, covers more than 1,200 lounges worldwide, including over 20 in Canada. It works on any airline. A guest's entry uses one of the six, and extra visits cost US$32 each.</p>

<h3>Fees, income and rewards</h3>
<p>The fee is $599, and TD publishes an income floor of $150,000 personal or $200,000 household. You earn 2 points per $1 direct with Air Canada. You earn 1.5 per $1 on gas, EV charging, groceries, travel, transit and dining, and 1.25 per $1 elsewhere. Caps in TD's terms apply. Travel insurance includes emergency medical up to $5 million: 31 days if you are 64 or under, four days at 65 or older. Trip cancellation is up to $2,500 per person and $5,000 per trip. Trip interruption is up to $5,000 per person and $25,000 per trip. At least 75% of the trip must be charged to the card or paid with Aeroplan points.</p>

<h3>Who should choose TD?</h3>
<p>A high-income Air Canada flyer who wants the full lounge package and banks with TD, where card fee rebates are common. Or one who finds the TD welcome offer stronger on the day. Its one clear drawback against CIBC is the $199 supplementary card versus $149.</p>

<p><a href="https://www.finlywealth.com/credit-cards/reviews/td-aeroplan-visa-infinite-privilege?utm_source=airportlounges_ca&utm_content=aeroplan-inline-td" target="_blank" rel="sponsored nofollow noopener"><strong>View TD Aeroplan VIP offer →</strong></a></p>

<h2>CIBC Aeroplan Visa Infinite Privilege review</h2>

<h3>Lounge access and six global visits</h3>
<p>CIBC's lounge package matches TD's. The primary cardholder and each authorized user with a premium card get unlimited eligible Maple Leaf Lounge and Air Canada Café access. One guest is included through December 31, 2026. Each enrolled cardholder gets six Visa Airport Companion visits per membership year. The six visits can be used by you or an accompanying guest. Extra visits are US$32.</p>

<h3>Supplementary cards and insurance</h3>
<p>Two things separate CIBC from TD. First, price: $149 for each of up to nine additional cards, against TD's and Amex's $199. A couple who both want independent access pay $748 a year at CIBC versus $798 at the other two. Second, insurance. CIBC's premium guide lists emergency medical up to $5 million: 31 days at 64 or under, ten days at 65 or over. Trip cancellation is up to $2,500 per person and $10,000 per trip. Trip interruption or delay is up to $5,000 per person and $25,000 per trip. The per-trip cancellation cap is double TD's and more than three times Amex's.</p>

<table>
  <thead>
    <tr><th>Card</th><th>Trip cancellation maximum per trip</th></tr>
  </thead>
  <tbody>
    <tr><td>CIBC Aeroplan VIP</td><td>$10,000</td></tr>
    <tr><td>TD Aeroplan VIP</td><td>$5,000</td></tr>
    <tr><td>Amex Aeroplan Reserve</td><td>$3,000</td></tr>
  </tbody>
</table>
<p><em>Per-person limits and other conditions apply; read the certificate.</em></p>

<h3>Who should choose CIBC?</h3>
<p>Anyone who meets the income requirement and wants the most lounge coverage per dollar for a household. You get Maple Leaf Lounges, six visits on other airlines, the cheapest partner card and the strongest cancellation cover. Earn rates are the same as TD: 2x Air Canada, 1.5x on gas, EV charging, groceries, travel and dining, 1.25x elsewhere. So the choice between the two comes down to supplementary cards, insurance, the welcome offer and where you bank.</p>

<p><a href="https://www.finlywealth.com/credit-cards/reviews/cibc-aeroplan-visa-infinite-privilege?utm_source=airportlounges_ca&utm_content=aeroplan-inline-cibc" target="_blank" rel="sponsored nofollow noopener"><strong>View CIBC Aeroplan VIP offer →</strong></a></p>

<h2>American Express Aeroplan Reserve review</h2>

<h3>Maple Leaf Lounge and Priority Pass access</h3>
<p>The Reserve gives the basic cardmember and each $199 premium supplementary cardmember the same Maple Leaf Lounge and Air Canada Café access. One guest is included, on a qualifying same-day flight. The other network is where it differs. Amex includes a Priority Pass membership and waives the US$99 annual fee — but every lounge visit is charged at the prevailing rate. That is access at a member price, not included visits. If you fly WestJet, Porter or Flair often and want a lounge on those trips, TD or CIBC cover six of them; Amex covers none.</p>

<h3>Air Canada earning and Pearson benefits</h3>
<p>Amex earns 3 points per $1 direct with Air Canada and Air Canada Vacations. It earns 2 per $1 on eligible dining and food delivery in Canada, and 1.25 per $1 elsewhere. For a household that puts $10,000 a year on Air Canada fares, that is 30,000 points versus 20,000 on the Visa cards. Toronto Pearson adds a local edge. Eligible Amex cardmembers get single-use QR codes for the priority security lane at Terminals 1 and 3, complimentary valet at Terminal 1, and 15% off eligible parking. Those perks are Pearson-only.</p>

<table>
  <thead>
    <tr><th>Category</th><th>TD VIP</th><th>CIBC VIP</th><th>Amex Reserve</th></tr>
  </thead>
  <tbody>
    <tr><td>Air Canada purchases</td><td>2</td><td>2</td><td>3</td></tr>
    <tr><td>Dining in Canada</td><td>1.5</td><td>1.5</td><td>2</td></tr>
    <tr><td>Gas, grocery, travel, transit</td><td>1.5</td><td>1.5</td><td>1.25</td></tr>
    <tr><td>Everything else</td><td>1.25</td><td>1.25</td><td>1.25</td></tr>
  </tbody>
</table>
<p><em>Aeroplan points per $1 by spending category on the three cards, from issuer terms verified September 11, 2026. Amex leads on Air Canada and dining in Canada; TD and CIBC lead on gas, groceries, travel and transit.</em></p>

<p>Insurance is the weak spot. Amex lists emergency medical up to $5 million for travellers under 65, for the first 15 days of a trip. Trip cancellation is up to $1,500 per person and $3,000 per trip. Travellers 65 and older receive no included emergency medical cover on the Reserve — confirm this against the current certificate of insurance before travelling if this matters to you.</p>

<h3>Who should choose Amex?</h3>
<p>Three people. The heavy Air Canada spender who values 3x more than six lounge visits. The applicant who cannot show $150,000 personal or $200,000 household income — Amex publishes no fixed floor, though approval still depends on Amex underwriting. And the Toronto Pearson regular who will use the security lane and valet. A couple who care most about guest access after 2026 may also lean Amex, but Amex can change its terms too.</p>

<p><a href="https://www.finlywealth.com/credit-cards/reviews/amex-aeroplan-reserve?utm_source=airportlounges_ca&utm_content=aeroplan-inline-amex" target="_blank" rel="sponsored nofollow noopener"><strong>View Amex Aeroplan Reserve offer →</strong></a></p>

<h2>Best Aeroplan lounge card by traveller type</h2>

<table>
  <thead>
    <tr><th>You are…</th><th>Pick</th><th>Why</th></tr>
  </thead>
  <tbody>
    <tr><td>Flying Air Canada most of the time, other airlines a few times a year</td><td>TD or CIBC</td><td>Both add six Visa Airport Companion visits to the Maple Leaf Lounge benefit</td></tr>
    <tr><td>A couple who each want to enter alone</td><td>CIBC</td><td>Premium additional card is $149, not $199</td></tr>
    <tr><td>Spending $8,000+ a year direct with Air Canada</td><td>Amex Reserve</td><td>3x versus 2x on Air Canada purchases</td></tr>
    <tr><td>Below the Visa Infinite Privilege income floor</td><td>Amex Reserve</td><td>No published minimum income</td></tr>
    <tr><td>Booking expensive trips and want the highest cancellation cap</td><td>CIBC</td><td>$10,000 per trip versus $5,000 at TD and $3,000 at Amex</td></tr>
    <tr><td>Age 65 or older</td><td>CIBC</td><td>10 days of included emergency medical, versus 4 at TD and none at Amex</td></tr>
    <tr><td>Based at Toronto Pearson</td><td>Amex Reserve</td><td>Priority security lane, valet and parking discount</td></tr>
    <tr><td>Deciding on guest access after 2026</td><td>No safe winner</td><td>TD and CIBC end Dec. 31, 2026; Amex undated; all can change</td></tr>
  </tbody>
</table>

<h2>Is a $599 Aeroplan card worth it for lounge access?</h2>

<p>Put a price on one visit first. Air Canada sells lounge access on some fares: $49 on Premium Economy or Latitude, $59 on Comfort and $79 on Flex. It charges $59 per extra guest. Use $59 as the benchmark. The test is simple:</p>

<table>
  <thead>
    <tr><th>Scenario</th><th>Fee to cover</th><th>Break-even math</th><th>Visits (rounded up)</th></tr>
  </thead>
  <tbody>
    <tr><td>Solo</td><td>$599</td><td>$599 ÷ $59 = 10.2</td><td>11 visits per year</td></tr>
    <tr><td>Cardholder + one guest (guest benefit active)</td><td>$599</td><td>$599 ÷ $118 = 5.1</td><td>6 shared visits per year</td></tr>
    <tr><td>Two cardholders on CIBC ($599 + $149)</td><td>$748</td><td>$748 ÷ $118 = 6.3</td><td>7 shared visits per year</td></tr>
    <tr><td>Two cardholders on TD or Amex ($599 + $199)</td><td>$798</td><td>$798 ÷ $118 = 6.8</td><td>7 shared visits per year</td></tr>
  </tbody>
</table>

<p><em>Break-even visits per year at $59 per person per entry. Calculated from issuer fees; the decimal is the exact result before rounding up.</em></p>

<blockquote>
<p><strong>Two cautions.</strong> Five or six visits do not "pay for the card" unless you would really have paid at the door each time. Lounges can also turn you away when full. Air Canada's own Amex comparison page values five cardholder-plus-guest visits at $590 — that is the issuer's marketing number, not an independent estimate. Free first checked bags, insurance and points sit on top of the lounge math and often decide the question.</p>
</blockquote>

<h3>Illustrative lounge-value scenario</h3>
<p>Take a household with 6 solo Air Canada or Star Alliance departures a year, 2 more with a partner, and 2 departures a year on other airlines where a lounge would be used — 10 lounge-eligible departures. Valuing each entry at $59:</p>

<table>
  <thead>
    <tr><th>Card</th><th>Annual cost</th><th>Lounge value*</th><th>Other-airline visits</th><th>Net</th></tr>
  </thead>
  <tbody>
    <tr><td>CIBC Aeroplan VIP</td><td>$599</td><td>$708</td><td>2 of 2 covered (Visa Airport Companion)</td><td>+$109</td></tr>
    <tr><td>TD Aeroplan VIP</td><td>$599</td><td>$708</td><td>2 of 2 covered (Visa Airport Companion)</td><td>+$109</td></tr>
    <tr><td>Amex Aeroplan Reserve</td><td>$599</td><td>$590</td><td>0 of 2 covered (each Priority Pass visit charged)</td><td>−$9</td></tr>
  </tbody>
</table>
<p><em>*Lounge value = entries × $59. Other-airline visits are covered up to six a year on TD and CIBC through Visa Airport Companion; Amex charges each Priority Pass visit at the prevailing rate. Points, free bags and insurance are not included in this figure. Fees verified September 11, 2026.</em></p>

<h2>How to use the lounge benefit</h2>

<ol>
  <li><em>Link the card to the right Aeroplan account.</em> The cardholder's Aeroplan number must be on the card and on the booking.</li>
  <li><em>Check the flight qualifies.</em> Same-day departure on Air Canada, Rouge, Express or a Star Alliance airline. Arrivals do not count.</li>
  <li><em>Enrol in Visa Airport Companion (TD and CIBC).</em> Use the app or visaairportcompanion.ca with your Visa Infinite Privilege card. Do it before the first trip — the six visits reset each membership year.</li>
  <li><em>Amex: enrol in Priority Pass if you want it.</em> Membership is fee-free, but expect a per-visit charge at the door.</li>
  <li><em>Bring your guest in with you.</em> Guests cannot enter alone. Extra guests pay $59 in the lounge's local currency.</li>
  <li><em>Recheck the terms in December 2026.</em> The TD and CIBC guest benefit is dated. The issuer's Air Canada benefit page is the source of truth.</li>
</ol>

<h2>Final recommendation</h2>

<p><strong>CIBC Aeroplan Visa Infinite Privilege ranks first for lounge-focused, eligible Canadians.</strong> It matches TD's six global visits and Maple Leaf Lounge access. It charges $50 less for each premium supplementary card. It publishes the strongest trip-cancellation limits. <strong>TD Aeroplan Visa Infinite Privilege is a close second</strong>, and a better welcome offer or a TD banking rebate can flip the result for you. <strong>Amex Aeroplan Reserve is the conditional winner</strong> for heavy Air Canada spending, applicants below the Visa Infinite Privilege income floor, and Toronto Pearson users — just know its Priority Pass visits are paid.</p>

<blockquote>
<p>Any verdict that calls TD or CIBC "best for couples" without the December 31, 2026 guest deadline is incomplete. Check the terms again before year-end.</p>
</blockquote>

<h2>Methodology</h2>
<p>Fees, lounge rules, guest terms and insurance limits were taken from issuer card pages, the issuer-specific Aeroplan benefit pages on aircanada.com, the issuers' benefits guides and insurance summaries, and the Visa Airport Companion and Priority Pass terms, in that order of authority. Third-party reviews were used only to confirm current welcome offers. Break-even figures are calculations shown in full above. No card rating is displayed because AirportLounges.ca does not collect user ratings.</p>

<h2>Change log</h2>
<ul>
  <li><strong>September 11, 2026:</strong> Full rewrite. TD and CIBC one-guest benefit dated to December 31, 2026 per issuer terms. Amex Priority Pass clarified as fee-waived membership with paid visits (not "free"). Ranking updated: CIBC first, TD second, Amex conditional.</li>
</ul>

<h2>Sources</h2>
<ul>
  <li>TD, TD Aeroplan Visa Infinite Privilege Card (fee, income, offer) and Maple Leaf Lounge access terms (one guest through December 31, 2026); welcome guide (earn rates); travel insurance summary.</li>
  <li>Air Canada — TD Aeroplan personal cards, CIBC Aeroplan personal cards, American Express Aeroplan cards (lounge and guest terms), and Maple Leaf Lounges (guest fee, purchase prices).</li>
  <li>CIBC — CIBC Aeroplan Visa Infinite Privilege Card (fee, $149 additional cards, income, earn rates); benefits guide (lounge access, US$32 extra visits); insurance summary.</li>
  <li>American Express Canada — Aeroplan Reserve Card (fee, offer, earn rates); membership benefits (lounge terms, Priority Pass fee waived with visits at the prevailing rate, Pearson benefits); insurance coverage and insurance summary booklet.</li>
  <li>Visa Canada — Visa Airport Companion by DragonPass; Milesopedia — Complete guide to the Visa Airport Companion Program.</li>
  <li>Toronto Pearson — American Express priority security lane access; Prince of Travel — Amex priority benefits at Toronto Pearson.</li>
  <li>Welcome offers checked September 11, 2026: Milesopedia — TD Aeroplan Visa Infinite Privilege offer, CIBC Aeroplan Visa Infinite Privilege, Amex Aeroplan Reserve.</li>
  <li>FinlyWealth — TD Aeroplan Visa Infinite Privilege review, CIBC Aeroplan Visa Infinite Privilege review, Amex Aeroplan Reserve review, comparison tool, card finder quiz.</li>
</ul>

<p><em>All fees, offers, benefits and insurance limits in this guide reflect information current as of September 11, 2026. Rules and offers change without notice — always confirm the current terms with the issuer before applying. Next scheduled review: December 2026, when the TD and CIBC guest terms expire.</em></p>
`

export const blogPosts: BlogPost[] = [
  {
    slug: 'best-aeroplan-credit-card-airport-lounge-access',
    title: 'Best Aeroplan Credit Card for Airport Lounge Access in Canada (2026)',
    excerpt: 'CIBC vs TD vs Amex Aeroplan Reserve — all three cost $599, all three open the Maple Leaf Lounge. CIBC wins for most households; Amex wins for heavy Air Canada spend. Verified September 11, 2026.',
    coverImage: '/blog/air-canada-maple-leaf-lounge.png',
    publishedAt: '2026-08-25',
    lastReviewed: '2026-09-11',
    category: 'Credit Cards',
    readingTime: '12 min read',
    metaTitle: 'Best Aeroplan Credit Card for Airport Lounge Access in Canada (2026)',
    metaDescription: 'CIBC Aeroplan VIP vs TD Aeroplan VIP vs Amex Aeroplan Reserve — the three Canadian $599 cards that open the Maple Leaf Lounge, compared with 2027 guest deadlines, insurance, and break-even math. September 2026.',
    content: aeroplanCardsContent,
    authorName: 'AirportLounges.ca Editorial Team',
    authorBio: 'Canadian airport lounge access rules are verified against issuer T&C pages, Air Canada Aeroplan benefits and the issuers\' insurance summaries. Facts dated on every guide; next review December 2026.',
    primaryCta: {
      heading: 'Not sure which $599 card fits your travel?',
      subheading: 'Get a personalized recommendation on FinlyWealth using your spending, income, credit profile and preferred perks.',
      ctaLabel: 'See My Personalized Recommendation',
      affiliateKey: 'finlywealth-quiz',
    },
    comparisonCards: [
      {
        name: 'CIBC Aeroplan Visa Infinite Privilege',
        annualFee: '$599',
        highlight: 'Best overall. Unlimited Maple Leaf Lounge + 6 Visa Airport Companion visits + $149 supplementary card + $10k trip cancellation.',
        affiliateKey: 'finlywealth-cibc-aeroplan-vip',
        ctaLabel: 'View CIBC Aeroplan VIP',
      },
      {
        name: 'TD Aeroplan Visa Infinite Privilege',
        annualFee: '$599',
        highlight: 'Close second. Same lounge package as CIBC. Better if TD banking rebates apply or the welcome offer is stronger.',
        affiliateKey: 'finlywealth-td-aeroplan-vip',
        ctaLabel: 'View TD Aeroplan VIP',
      },
      {
        name: 'American Express Aeroplan Reserve',
        annualFee: '$599',
        highlight: '3x on Air Canada, no published income floor, Toronto Pearson perks — but Priority Pass visits are paid, not included.',
        affiliateKey: 'finlywealth-amex-aeroplan-reserve',
        ctaLabel: 'View Amex Aeroplan Reserve',
      },
    ],
    faqs: [
      {
        question: 'Which credit card offers the best lounge access for Air Canada?',
        answer: 'For most eligible Canadians, the CIBC Aeroplan Visa Infinite Privilege is the strongest Aeroplan lounge card. All three $599 Aeroplan cards (CIBC, TD Aeroplan VIP, Amex Aeroplan Reserve) open the Maple Leaf Lounge and Air Canada Café network in Canada and the U.S. CIBC and TD add six complimentary Visa Airport Companion visits a year that work on any airline; Amex includes fee-waived Priority Pass membership where every lounge visit is charged at the prevailing rate. CIBC edges TD on supplementary card price ($149 vs $199) and insurance limits.',
      },
      {
        question: 'Do all three Aeroplan credit cards give Maple Leaf Lounge access?',
        answer: 'Yes. The TD Aeroplan Visa Infinite Privilege, CIBC Aeroplan Visa Infinite Privilege, and American Express Aeroplan Reserve each grant unlimited access to eligible Air Canada Maple Leaf Lounges and Air Canada Cafés in Canada and the United States on a same-day departing Air Canada, Air Canada Rouge, Air Canada Express or Star Alliance ticket. The Air Canada Signature Suite is not included, and international Maple Leaf Lounges outside North America (London, Paris, Frankfurt) are not included either.',
      },
      {
        question: 'Can I use the lounge when flying United or another Star Alliance airline?',
        answer: 'Yes — the same-day departing ticket must be marketed or operated by Air Canada, Rouge, Express or a Star Alliance member airline. The card opens Air Canada\'s own Maple Leaf Lounges and Cafés only, though. It does not open Star Alliance partner lounges. A United flight from a Canadian or U.S. Maple Leaf Lounge location gets you in; a United flight departing from a non-AC lounge airport does not.',
      },
      {
        question: 'How do you get Air Canada lounge access without paying at the door?',
        answer: 'The Aeroplan credit card fee funds the access — it is not literally free. Four routes exist: (1) a same-day Air Canada Signature Class or eligible business-class ticket includes lounge access; (2) Aeroplan 50K, 75K or Super Elite 100K status includes it; (3) an active Maple Leaf Club membership; or (4) a same-day Air Canada or Star Alliance ticket paired with one of the three $599 Aeroplan premium credit cards. Walk-in day passes are not sold at Maple Leaf Lounges — Air Canada sells advance lounge access with some fare classes at $49 to $79 per visit.',
      },
      {
        question: 'Can a cardholder bring a guest?',
        answer: 'One guest, and the guest must enter with you. At TD and CIBC the primary cardholder and each premium additional cardholder can bring one guest through December 31, 2026. Amex\'s terms allow the basic cardmember and each $199 supplementary cardmember one guest, with no expiry date currently stated. A no-fee Amex supplementary card does not carry the lounge benefit. Extra guests pay Air Canada\'s fee of $59 in the lounge\'s local currency, subject to change.',
      },
      {
        question: 'Which card includes the most non-Air-Canada lounge visits?',
        answer: 'TD and CIBC each include six Visa Airport Companion visits per membership year, through the DragonPass network — 1,200+ lounges worldwide, including more than 20 in Canada. Each visit is per person, so a guest\'s entry uses one of the six; extra visits cost US$32. The Amex Aeroplan Reserve includes fee-waived Priority Pass membership but every Priority Pass visit is billed at the prevailing rate — that is access at a member price, not included visits.',
      },
      {
        question: 'Is a $599 Aeroplan card worth it for lounge access?',
        answer: 'At the $59 walk-in benchmark that Air Canada uses for extra guest fees, a solo traveller needs about 11 lounge visits a year to break even on the $599 fee. A cardholder-plus-guest pair needs about 6 shared visits with the guest benefit active. A couple who each want independent access is $748 a year on CIBC or $798 on TD or Amex — roughly 7 shared visits. Free first checked bags, insurance and Aeroplan earning sit on top of this and often decide the question.',
      },
      {
        question: 'Which card is best after 2026?',
        answer: 'There is no safe winner today. TD and CIBC put a date on their complimentary Maple Leaf Lounge guest — December 31, 2026 — with nothing published beyond that. Amex publishes one guest with no expiry date, which makes it look better for couples after 2026. But Air Canada\'s own lounge page calls complimentary guest admission a limited-time benefit that could change. Recheck the issuer terms in December 2026 before making a decision based on guest access alone.',
      },
    ],
  },
  {
    slug: 'amex-platinum-airport-lounge-access-canada',
    title: 'Amex Platinum Airport Lounge Access in Canada (2026): Lounges, Guests and 2027 Changes',
    excerpt: 'See which airport lounges the Canadian Amex Platinum accesses in 2026, guest rules, the $799 fee, and the confirmed Plaza Premium and Priority Pass limits coming in 2027.',
    coverImage: '/blog/premium-credit-cards-priority-pass.png',
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
        answer: 'Guest rules depend on the network. Through 2026, Plaza Premium and Priority Pass each include one complimentary guest per visit. Centurion Lounges outside Canada allow one guest on the same flight, since July 8, 2026 (previously two). Delta Sky Club includes no free guests — Delta charges per additional person. From January 1, 2027, a guest entry at Plaza Premium or Priority Pass consumes one of the capped visits rather than being free.',
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
    title: "Airport Lounge Guest Fees in Canada (2026): What You'll Actually Pay",
    excerpt: 'Priority Pass US$35 per guest. Air Canada Maple Leaf Lounge $59 in local currency. WestJet Elevation $59–$65 + GST. National Bank Lounge YUL includes a guest and two kids on a $150 card. Full guest-fee breakdown, verified September 11, 2026.',
    coverImage: '/blog/couple-checking-in-lounge.png',
    publishedAt: '2026-06-06',
    lastReviewed: '2026-09-11',
    category: 'Access Guides',
    readingTime: '14 min read',
    metaTitle: "Airport Lounge Guest Fees in Canada (2026): What You'll Actually Pay",
    metaDescription: 'Every airport lounge guest fee in Canada — Priority Pass US$35, Maple Leaf Lounge $59 local, WestJet Elevation $59–$65 + GST, Desjardins Odyssey rules and the National Bank card that includes a guest. Verified September 11, 2026.',
    content: guestFeesContent,
    authorName: 'AirportLounges.ca Editorial Team',
    authorBio: 'Every guest fee on this page comes from an operator page or issuer benefits guide, cross-referenced with Milesopedia, Prince of Travel and Frugal Flyer. Re-verified September 11, 2026; next scheduled review December 2026.',
    primaryCta: {
      heading: 'Cheapest card with a guest built in',
      subheading: 'The National Bank World Elite Mastercard is $150 a year and includes a guest plus two children at the National Bank Lounge YUL (international departures only).',
      ctaLabel: 'See National Bank World Elite on FinlyWealth',
      affiliateKey: 'finlywealth-lounge-access-cards',
    },
    faqs: [
      {
        question: 'Can I bring a guest to the Air Canada lounge?',
        answer: 'Yes, one guest, and the guest must enter with you. Aeroplan 50K status and above, Star Alliance Gold, Maple Leaf Club members, and the three premium Aeroplan credit cards (TD Aeroplan VIP, CIBC Aeroplan VIP, Amex Aeroplan Reserve) all include one complimentary guest per visit on a same-day Air Canada or Star Alliance departure. Extra guests pay $59 in the lounge\'s local currency (CAD in Canada, USD in the US, EUR and GBP abroad) plus local taxes.',
      },
      {
        question: 'How much does it cost to use the Air Canada lounge without status or a card?',
        answer: 'You cannot walk in and pay at the door. Air Canada sells Maple Leaf Lounge access as a travel option on some fares, purchased at booking or at least 24 hours before departure. Published prices range from $25 (on Latitude) to $79 (on Flex), with $49 on Premium Economy and $59 on Comfort common in various channels.',
      },
      {
        question: 'How much is a guest at a Priority Pass lounge in Canada?',
        answer: 'US$35 per guest per visit at every Priority Pass lounge in Canada, at every tier of direct membership (Standard, Standard Plus, Prestige). Card-issued Priority Pass memberships vary: the Amex Platinum includes one complimentary guest through December 31, 2026 (a guest uses one of your six capped visits from 2027); the Amex Aeroplan Reserve charges the cardholder and every guest at the prevailing rate; the Scotiabank Platinum Amex counts a guest as one of your 10 annual visits.',
      },
      {
        question: 'How do I get lounge access at Montréal airport for the least money?',
        answer: 'For international departures out of YUL, the National Bank World Elite Mastercard ($150 annual fee) is the cheapest card in Canada with a guest included. It grants unlimited access to the National Bank Lounge near Gate 53 for the cardholder plus one guest and two children aged 12 or under. The lounge is currently in a temporary reduced-capacity space (August 2026 through about June 2028) during renovation, with a two-hour stay. Income requirements are $80,000 personal or $150,000 household.',
      },
      {
        question: 'Do children pay guest fees at Canadian airport lounges?',
        answer: 'It varies by operator. Children under 2 are admitted free at the National Bank Lounge, the Aspire lounges at YUL, WestJet Elevation and most Priority Pass lounges. Desjardins Odyssey admits under-3s free. WestJet charges a child rate of $30–$33 plus GST for ages 2–17. National Bank charges $26 plus tax per child beyond the two included with a World Elite card. Aeroplan 50K status and above covers up to five dependent children under 25 in Maple Leaf Lounges.',
      },
      {
        question: 'What happens to Amex Platinum guests in 2027?',
        answer: 'On January 1, 2027, the Amex Platinum\'s complimentary guest benefit at Plaza Premium and Priority Pass lounges ends. Under the new capped model, each person who enters — cardholder or guest — uses one of the six Plaza Premium or six Priority Pass visits per calendar year. A couple burns a network\'s six visits in three trips. Unlimited access with one complimentary guest per network returns if the account is charged $20,000 in eligible calendar-year spending. Centurion Lounge access separately dropped from two guests to one on July 8, 2026, with the guest required to be on the same flight.',
      },
      {
        question: 'How do you get Air Canada lounge access without paying at the door?',
        answer: 'The Aeroplan credit card fee funds the access — it is not literally free. Four routes exist: (1) a same-day Air Canada Signature Class or eligible business-class ticket includes access; (2) Aeroplan 50K, 75K or Super Elite 100K status; (3) an active Maple Leaf Club membership; or (4) a same-day Air Canada or Star Alliance ticket paired with a $599 premium Aeroplan credit card (TD Aeroplan VIP, CIBC Aeroplan VIP, or Amex Aeroplan Reserve). Walk-in day passes are not sold at Maple Leaf Lounges.',
      },
    ],
  },
  {
    slug: 'canadian-airport-lounges-sleep-pods',
    title: 'Canadian Airport Lounges with Sleep Pods and Rest Facilities (2026)',
    excerpt: 'The five Canadian airport lounges with real rest facilities — reclining pods, spa suites, day-bed corners, and the only 24-hour lounge in the country. Which cards unlock each, verified September 12, 2026.',
    coverImage: '/blog/plaza-premium-24hr-yvr.png',
    publishedAt: '2026-09-12',
    lastReviewed: '2026-09-12',
    category: 'Lounge Guides',
    readingTime: '10 min read',
    metaTitle: 'Canadian Airport Lounges with Sleep Pods and Rest Facilities (2026)',
    metaDescription: 'Only five Canadian airport lounges have real rest facilities — Cathay Pacific YVR Solus pods, Plaza Premium First YVR spa suites, the 24-hour Plaza Premium YVR, Plaza Premium YWG, and AC Signature Suite YYZ. Which cards unlock each. September 2026.',
    content: sleepPodsContent,
    authorName: 'AirportLounges.ca Editorial Team',
    authorBio: 'Rest-facility descriptions verified against operator pages, our own on-file lounge data, and traveller reports. Reviewed September 12, 2026; next check December 2026.',
    primaryCta: {
      heading: 'Which card unlocks a Canadian rest lounge?',
      subheading: 'Compare Amex Platinum, Scotiabank Platinum American Express, and other Priority Pass–eligible cards that get you into the two Plaza Premium lounges with rest facilities.',
      ctaLabel: 'Compare Priority Pass Cards',
      affiliateKey: 'finlywealth-lounge-access-cards',
    },
    faqs: [
      {
        question: 'Which Canadian airport lounge has actual sleep pods?',
        answer: 'The Cathay Pacific Lounge at Vancouver International (YVR) is the only Canadian airport lounge with purpose-built individual reclining pods — Solus Chair units in a semi-enclosed configuration. Access requires a same-day Cathay Pacific business class ticket or oneworld Sapphire / Emerald status. No Canadian credit card and no Priority Pass tier unlocks it. The other four lounges on our list (Plaza Premium First YVR, Plaza Premium International YVR 24-hour, Plaza Premium YWG, and Air Canada Signature Suite YYZ) have rest facilities of different formats — spa suites, day-bed corners, private booths — but not literal capsule pods.',
      },
      {
        question: 'Is there a 24-hour airport lounge in Canada?',
        answer: 'Yes — the Plaza Premium Lounge at YVR International Departures is open 24 hours a day, every day. It is the only Canadian airport lounge that never closes. It accepts Priority Pass (2-hour stay limit), DragonPass via Visa Airport Companion, Amex Platinum direct entry, and walk-in day passes from about $69 CAD.',
      },
      {
        question: 'Can I sleep at a Canadian airport lounge?',
        answer: 'You can rest with your eyes closed at most Canadian premium lounges without being disturbed. Five lounges have dedicated rest facilities beyond standard seating: Cathay Pacific YVR (Solus Chair pods), Plaza Premium First YVR (private spa suites, $30 upgrade or $110 direct), Plaza Premium International YVR (24-hour operation + day-bed corners), Plaza Premium YWG (nap section opposite Gate 6), and Air Canada Signature Suite YYZ Terminal 1 (private booth seating, invitation-only for Signature Class international passengers).',
      },
      {
        question: 'Which credit card gets me into a Canadian rest lounge?',
        answer: 'Only two of the five rest lounges are accessible via a Canadian credit card. The Amex Platinum ($799 annual fee), Business Platinum ($799), and Scotiabank Platinum American Express ($399, 10 visits/year) all include Priority Pass and cover both Plaza Premium locations with rest facilities (YVR 24-hour and YWG). The Cathay Pacific Lounge and Air Canada Signature Suite are ticket-only — no credit card unlocks either.',
      },
      {
        question: 'Are there Napcabs, GoSleep or hourly sleep pods at any Canadian airport?',
        answer: 'No. Hourly-rental capsule pods like Napcabs (Munich, Helsinki, Vienna), GoSleep (Abu Dhabi, Helsinki) and Minute Suites (multiple US airports) do not have any Canadian airport installations as of September 2026. Every rest option at a Canadian airport is either inside a lounge on the list above or via a nearby airport hotel with a day-use rate.',
      },
      {
        question: 'What is the cheapest way to sleep at a Canadian airport?',
        answer: 'For a Priority Pass holder: the Plaza Premium International (24-hour) lounge at YVR — included at zero marginal cost with an Amex Platinum, Amex Business Platinum, or Scotiabank Platinum Amex. For everyone else: an airport hotel day-use rate at $89–$149 for four to six hours is more comfortable than any Canadian lounge nap. Fairmont Vancouver Airport, Sheraton Gateway at YYZ Terminal 3 (Toronto), and ALT Hotel YUL (Montréal) all publish day-use rates on their own websites.',
      },
      {
        question: 'Do any Air Canada Maple Leaf Lounges have sleep pods?',
        answer: 'No Air Canada Maple Leaf Lounge in Canada has a documented sleep-pod or rest-suite facility. The YYZ International and YVR International Maple Leaf Lounges enforce cell-free quiet zones with genuine noise policing, which makes closed-eye rest feasible, but there are no reclining pods or private rest suites. The Air Canada Signature Suite at YYZ Terminal 1 has private booth seating but is invitation-only for Air Canada Signature Class international passengers.',
      },
      {
        question: 'How long can I stay in a Canadian airport rest lounge?',
        answer: 'Two hours is the standard on Priority Pass at every Plaza Premium location, including the 24-hour lounge at YVR (which lets you re-enter after a gap if space permits). Amex Platinum direct entry typically allows a three-hour stay. Cathay Pacific and Air Canada Signature Suite align with the lounge\'s operating hours — usually opening three to four hours before the associated flight and closing after boarding. There is no hourly sleep-pod booking system in Canada.',
      },
    ],
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
    title: 'Priority Pass Lounges in Canada: Every Airport and Every Card (2026)',
    excerpt: 'Priority Pass in Canada is Amex-only. Every Priority Pass lounge, every card that includes it, and what changes on January 1, 2027 when the Amex Platinum drops to 6 + 6 visits.',
    coverImage: '/blog/guide-priority-pass-canada.png',
    publishedAt: '2026-06-05',
    lastReviewed: '2026-09-11',
    category: 'Lounge Guides',
    readingTime: '16 min read',
    metaTitle: 'Priority Pass Lounges in Canada: Every Airport and Every Card (2026)',
    metaDescription: 'Priority Pass in Canada is Amex-only — the Amex Platinum, Business Platinum and Scotiabank Platinum Amex are the three cards that include visits. 23 lounges at 8 confirmed airports. Verified September 11, 2026.',
    content: priorityPassContent,
    authorName: 'AirportLounges.ca Editorial Team',
    authorBio: 'Card and lounge facts verified against issuer pages and Priority Pass\'s Canadian directory. Re-verified September 11, 2026; next scheduled review December 2026 when the Amex Platinum cap takes effect on January 1, 2027.',
    primaryCta: {
      heading: 'Best cards with Priority Pass',
      subheading: 'Filtered to the three Amex-issued cards that include Priority Pass visits — Amex Platinum, Business Platinum, Scotiabank Platinum Amex.',
      ctaLabel: 'Compare Priority Pass Cards',
      affiliateKey: 'finlywealth-lounge-access-cards',
    },
    faqs: [
      {
        question: 'Which Canadian credit cards offer Priority Pass lounge access?',
        answer: 'As of September 11, 2026, only three Canadian cards include Priority Pass visits: the American Express Platinum ($799), the Business Platinum from Amex ($799), and the Scotiabank Platinum American Express ($399, 10 visits per year). The American Express Aeroplan Reserve ($599) includes a Priority Pass membership with the annual fee waived, but every visit is charged at the prevailing rate. Every Visa and Mastercard premium card in Canada — including the TD Aeroplan Visa Infinite Privilege, CIBC Aeroplan Visa Infinite Privilege, Scotiabank Passport Visa Infinite and RBC Avion Visa Infinite Privilege — uses DragonPass (Visa Airport Companion or Mastercard Travel Pass) instead.',
      },
      {
        question: 'What lounges are under Priority Pass in Canada?',
        answer: 'Priority Pass lists 23 lounges at 8 confirmed Canadian airports as of September 11, 2026: Toronto Pearson (5 Plaza Premium + Be Relax spa; T1 international closed), Vancouver (5, Plaza Premium First excluded), Montréal-Trudeau (5, National Bank in a temporary space), Calgary (3), Edmonton (2), Ottawa (1), Winnipeg (1), and Toronto Billy Bishop (1). Québec City is pending — the Boréal Lounge by YQB opens in fall 2026 but Priority Pass acceptance is unconfirmed.',
      },
      {
        question: 'Is it free to use a lounge with a Priority Pass?',
        answer: 'It is not literally free — the membership fee or the card fee funds it. Direct Priority Pass memberships cost US$99 (Standard, pay-per-visit), US$329 (Standard Plus, 10 included) or US$469 (Prestige, unlimited). Guests always cost US$35 each. On the Amex Platinum, visits are covered by the $799 annual fee. On the Amex Aeroplan Reserve, the membership fee is waived but every visit is billed at the prevailing rate. If a lounge is at capacity, Priority Pass members can be refused entry.',
      },
      {
        question: 'How do I get Priority Pass without paying for a membership in Canada?',
        answer: 'Hold one of the three Canadian cards that include it: the Amex Platinum or Business Platinum ($799, unlimited visits through December 31, 2026, then capped from 2027), or the Scotiabank Platinum Amex ($399 with 10 visits a year). The Amex Aeroplan Reserve technically includes the membership too, but every visit is charged — so it does not replace a paid membership for cost purposes.',
      },
      {
        question: 'Is Priority Pass better than DragonPass in Canada?',
        answer: 'They are different networks with meaningful overlap. In practice the same Canadian lounge — the Aspire lounges at Ottawa, Montréal and Billy Bishop, the WestJet Elevation Lounge at Calgary, Plaza Premium at Toronto/Vancouver/Edmonton/Winnipeg, the SkyTeam Lounge at Vancouver — often accepts both. What differs is the visit allotment on your card and the overage rate: US$35 on Priority Pass vs US$32 on DragonPass. The network name matters less than how many visits your card includes.',
      },
      {
        question: 'What happens to Amex Platinum Priority Pass access in 2027?',
        answer: 'On January 1, 2027, unlimited Priority Pass and Plaza Premium access ends. A basic Amex Platinum cardholder gets 6 Priority Pass visits and 6 Plaza Premium visits per calendar year, with each guest entry consuming one of those visits. A supplementary cardholder gets 2 of each. The escape hatch: spend $20,000 on the account in a calendar year and unlimited access with one complimentary guest per network is restored for the rest of that year and all of the next. Amex is already counting 2026 spend toward the 2027 threshold.',
      },
      {
        question: 'Can I pre-book a Priority Pass lounge in Canada?',
        answer: 'Yes, at select locations. As of September 11, 2026 the Canadian pre-book list includes the Aspire Lounge International and Aspire Lounge Transborder at Calgary (YYC), the Aspire Salon at Ottawa (YOW), the Aspire Lounge at Billy Bishop (YTZ), and the National Bank Lounge at Montréal-Trudeau (YUL). Pre-booking carries a small fee but guarantees a seat that a full lounge cannot refuse.',
      },
    ],
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
