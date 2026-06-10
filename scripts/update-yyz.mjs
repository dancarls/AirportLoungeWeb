import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://ixgbdmrembkrpbkjhtfi.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

const A = {
  wifi:           '18b082fc-6b63-4877-bf17-00723cd2b969',
  shower:         'd422ff48-ef6c-4470-ac80-98494c2ebc91',
  snacks:         'eea851ce-1ee7-4134-9098-834448d8a6dc',
  bar:            'd29f36d1-5821-4347-ae6d-c6200baef097',
  newspapers:     'd6d9d35d-e006-4c4e-b821-05ab487ac2ba',
  tv:             'fa97e2cd-0e64-4539-a8be-60e154e65733',
  wheelchair:     'ae50a6e3-e4d4-4603-8b7f-9d4c422672fe',
  quiet:          'f60e72ab-38e2-43f2-9d8a-4f6172625f14',
  hotfood:        '52fc6fa8-d3f7-42fe-9fa9-42b6949a2ab4',
  flight_screens: 'd93499c8-cfdf-4be7-9780-10943a395a46',
  coffee:         '1e62190f-7047-4f42-8c73-045d3509be08',
  business_centre:'6c0c90da-0bab-4b33-87bb-dfa879c07d9c',
  charging:       '9ff17629-9424-447c-8972-cd29b414b9c2',
  kids_area:      'dca6544c-ff43-490a-b9e7-a498c9181926',
  printing:       '131aad96-7eb3-4620-ac69-071db404d652',
  spa:            '655af7e7-1323-47fa-9978-ec725fbd3e6e',
};

async function setAmenities(loungeId, keys) {
  const { error: delErr } = await sb.from('lounge_amenities').delete().eq('lounge_id', loungeId);
  if (delErr) { console.error('  delete amenities error:', delErr.message); return; }
  const rows = keys.map(k => ({ lounge_id: loungeId, amenity_id: A[k] }));
  const { error } = await sb.from('lounge_amenities').insert(rows);
  if (error) console.error('  insert amenities error:', loungeId, error.message);
  else console.log(`  amenities: ${keys.join(', ')}`);
}

async function updateLounge(id, patch) {
  const { error } = await sb.from('lounges').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) console.error('  UPDATE ERROR:', id, error.message);
  else console.log(`UPDATED: ${patch.name || id}`);
}

async function insertLounge(data) {
  const { data: row, error } = await sb.from('lounges').insert(data).select('id').single();
  if (error) { console.error('  INSERT ERROR:', data.name, error.message); return null; }
  console.log(`INSERTED: ${data.name} → ${row.id}`);
  return row.id;
}

// ─── EXISTING LOUNGE IDs ─────────────────────────────────────────────
const ID = {
  cafe:     '4e3a0875-7913-4de4-9ff8-88190fffc49c',
  mllDom:   'ec83e099-191b-437a-bdb6-1a72ff294e52',
  mllInt:   '74466f09-6212-44b5-86ac-0be3e99e2e86',
  mllTb:    '20433e52-45c3-462a-953d-4209ddd3b3ac',
  sig:      '5e370be4-acf3-4d12-b49b-095028214307',
  ppT3Int:  'c326da82-1b87-4011-882f-228e6a20bac8',
};

const AIRPORT_ID = '840161ae-1301-45f8-ad92-10d7834bef72';
const AC_WEBSITE = 'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges/toronto-pearson.html';
const PP_WEBSITE = 'https://www.plazapremiumlounge.com/en-uk/find/americas/canada/toronto/toronto-pearson-international-airport';

// ════════════════════════════════════════════════════════════════════
// PART 1 — UPDATE EXISTING LOUNGES
// ════════════════════════════════════════════════════════════════════

console.log('\n═══ UPDATING EXISTING LOUNGES ═══\n');

// 1. Air Canada Café
await updateLounge(ID.cafe, {
  location_detail: 'Terminal 1, Domestic departures, Level 2, near Gate D20, post-security, airside',
  opening_hours: {
    monday:'05:00-21:30', tuesday:'05:00-21:30', wednesday:'05:00-21:30',
    thursday:'05:00-21:30', friday:'05:00-21:30', saturday:'05:00-21:30', sunday:'05:00-21:30',
    notes: 'Open daily 5:00 AM – 9:30 PM. Pets welcome in carriers.',
  },
  description: `<p>The Air Canada Café sits along Terminal 1's domestic concourse on Level 2, positioned just past security near Gate D20. Unlike the full-service Maple Leaf Lounge nearby, the Café is a lighter, more casual alternative — a curated coffeehouse experience with specialty coffee, freshly prepared hot and cold plates, snacks, Wi-Fi, and television screens.</p>
<p>Designed for everyday Air Canada travelers, the Café extends access to Aeroplan 50K and 75K members and Star Alliance Gold cardholders on domestic routes, making it one of the more accessible perks in the Air Canada lounge network. The pet-friendly policy for carriers and low-key atmosphere make it an easy choice for travelers who want a proper coffee and a quiet seat without the full buffet experience. Its central position near the domestic security exit makes it a natural first stop regardless of which departure pier you end up at.</p>`,
  access_types: [
    { name: 'Air Canada Business or Premium Rouge', type: 'class_of_service', details: 'Business Class and Premium Rouge passengers on domestic Air Canada flights' },
    { name: 'Aeroplan Elite 50K / 75K', type: 'airline_status', details: 'Aeroplan Elite 50K and 75K members on domestic Air Canada flights' },
    { name: 'Air Canada Super Elite 100K', type: 'airline_status', details: 'Super Elite 100K members on domestic flights' },
    { name: 'Star Alliance Gold', type: 'airline_status', details: 'Star Alliance Gold members on eligible same-day Air Canada domestic flight' },
    { name: 'Eligible Aeroplan Credit Cards', type: 'credit_card', details: 'Primary cardholders of select TD and CIBC Aeroplan Visa Infinite Privilege cards' },
  ],
});
await setAmenities(ID.cafe, ['wifi','snacks','hotfood','coffee','tv','flight_screens','charging']);

// 2. AC Maple Leaf Lounge (Domestic)
await updateLounge(ID.mllDom, {
  location_detail: 'Terminal 1, Domestic departures, Level 2, near Gates D51–D57, post-security, airside',
  opening_hours: {
    monday:'00:00-23:59', tuesday:'00:00-23:59', wednesday:'00:00-23:59',
    thursday:'00:00-23:59', friday:'00:00-23:59', saturday:'00:00-23:59', sunday:'00:00-23:59',
    notes: 'Open 24 hours, 7 days a week. Showers available. Pets welcome in carriers.',
  },
  description: `<p>Located at the heart of Terminal 1's domestic concourse on Level 2 near Gates D51–D57, the Air Canada Maple Leaf Lounge (Domestic) operates around the clock — one of only a handful of domestic lounges in Canada to do so. It serves as the everyday sanctuary for Air Canada's frequent domestic flyers: a full bar, a rotating hot buffet, access to PressReader's digital magazine library, shower suites, business workstations, and a children's play area.</p>
<p>The lounge has a distinctly Canadian warmth, with materials and tones that align with Air Canada's broader design language. A pet-friendly policy for carriers makes it equally accommodating for travelers on the move with furry companions. Whether you're a Super Elite catching a red-eye to Vancouver or a Business Class passenger heading home to Halifax, this lounge earns its reputation as the cornerstone of Air Canada's domestic hospitality at Canada's busiest airport. The 24/7 operation makes it a genuine resource for early-morning departures and late-night connections alike.</p>`,
  access_types: [
    { name: 'Air Canada Domestic Business Class', type: 'class_of_service', details: 'Business Class passengers on domestic Air Canada flights' },
    { name: 'Aeroplan Elite 50K / 75K / Super Elite 100K', type: 'airline_status', details: 'Aeroplan Elite 50K and above on eligible domestic flights' },
    { name: 'Star Alliance Gold', type: 'airline_status', details: 'Star Alliance Gold members on eligible same-day Air Canada domestic flight' },
    { name: 'Emirates Business / First Class', type: 'class_of_service', details: 'Emirates Business and First Class passengers on eligible codeshare flights' },
    { name: 'TD Aeroplan Visa Infinite Privilege', type: 'credit_card', details: 'Primary cardholders and one guest' },
    { name: 'CIBC Aeroplan Visa Infinite Privilege', type: 'credit_card', details: 'Primary cardholders and one guest' },
    { name: 'Paid Add-On Pass ($49–$79)', type: 'membership', details: 'Available for eligible Aeroplan members — see aircanada.com for current pricing and eligibility' },
  ],
  guest_fee: 30,
});
await setAmenities(ID.mllDom, ['wifi','shower','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','printing','business_centre','charging','kids_area','quiet']);

// 3. AC Maple Leaf Lounge (International)
await updateLounge(ID.mllInt, {
  location_detail: 'Terminal 1, International departures, Level 3, near F gates, post-security, airside',
  opening_hours: {
    monday:'04:15-23:00', tuesday:'04:15-23:00', wednesday:'04:15-23:00',
    thursday:'04:15-23:00', friday:'04:15-23:00', saturday:'04:15-23:00', sunday:'04:15-23:00',
    notes: 'Open daily 4:15 AM – 11:00 PM. Shower suites available.',
  },
  description: `<p>The Air Canada Maple Leaf Lounge (International) in Terminal 1 occupies a spacious Level 3 position near the F gates, serving passengers departing on routes across Europe, Asia, the Caribbean, and beyond. As Air Canada's busiest international gateway, the YYZ international Maple Leaf Lounge is built for scale — designed to handle substantial volumes without losing its composure.</p>
<p>Inside, soft lighting, a dining-hall-style food service area with a full hot buffet, an open bar, shower suites, and private work cubicles make it considerably more refined than the concourse below. Business Class passengers on long-haul routes and Star Alliance Gold elite members use the lounge for a proper pre-flight reset: a real meal, a hot shower, and a calm hour away from one of North America's busiest airports. Panoramic airside views and thoughtfully varied seating make it one of the more pleasant airline-operated international lounges in the Air Canada network.</p>`,
  access_types: [
    { name: 'Air Canada International Business Class', type: 'class_of_service', details: 'Business Class passengers on Air Canada international flights' },
    { name: 'Aeroplan Elite 50K / 75K / Super Elite 100K', type: 'airline_status', details: 'Aeroplan Elite 50K and above on eligible international flights' },
    { name: 'Star Alliance Gold', type: 'airline_status', details: 'Star Alliance Gold members on eligible same-day international Air Canada flight' },
    { name: 'Emirates Business / First Class', type: 'class_of_service', details: 'Emirates Business and First Class on eligible codeshare international flights' },
    { name: 'TD Aeroplan Visa Infinite Privilege', type: 'credit_card', details: 'Primary cardholders and one guest' },
    { name: 'CIBC Aeroplan Visa Infinite Privilege', type: 'credit_card', details: 'Primary cardholders and one guest' },
  ],
  guest_fee: 30,
});
await setAmenities(ID.mllInt, ['wifi','shower','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','printing','business_centre','charging','quiet']);

// 4. AC Maple Leaf Lounge (Transborder)
await updateLounge(ID.mllTb, {
  location_detail: 'Terminal 1, US Transborder departures (pre-clearance), Levels 2–3, near Gates F52/F53, post-security, airside',
  opening_hours: {
    monday:'04:45-20:30', tuesday:'04:45-20:30', wednesday:'04:45-20:30',
    thursday:'04:45-20:30', friday:'04:45-20:30', saturday:'04:45-20:30', sunday:'04:45-20:30',
    notes: 'Open daily 4:45 AM – 8:30 PM. US transborder passengers only.',
  },
  description: `<p>For Air Canada passengers heading across the border, the Maple Leaf Lounge (Transborder) sits in Terminal 1's US pre-clearance zone, serving passengers between Canadian security and the US Customs and Border Protection process. Spanning Levels 2–3 near Gates F52/F53, it is one of the more spacious transborder facilities in Air Canada's network — featuring panoramic tarmac views, a children's room, private quiet cubicles, shower suites, a hot buffet, and a full open bar.</p>
<p>Because the lounge sits within the pre-clearance area, guests have already committed to their US-bound flights — making this a particularly purposeful lounge visit. The atmosphere tends to be calmer than the international wing, with a more predictable mix of business travelers and leisure passengers heading south. Business Class passengers, Aeroplan elites, and Star Alliance Gold members on qualifying transborder routes all have complimentary access, making it a well-used stop before early morning flights to major US hubs.</p>`,
  access_types: [
    { name: 'Air Canada Transborder Business Class', type: 'class_of_service', details: 'Business Class passengers on Air Canada US transborder flights' },
    { name: 'Aeroplan Elite 50K / 75K / Super Elite 100K', type: 'airline_status', details: 'Aeroplan Elite 50K and above on eligible US transborder flights' },
    { name: 'Star Alliance Gold', type: 'airline_status', details: 'Star Alliance Gold members on eligible same-day Air Canada transborder flight' },
    { name: 'Emirates Business / First Class', type: 'class_of_service', details: 'Emirates Business and First Class on eligible codeshare transborder flights' },
    { name: 'TD Aeroplan Visa Infinite Privilege', type: 'credit_card', details: 'Primary cardholders and one guest' },
    { name: 'CIBC Aeroplan Visa Infinite Privilege', type: 'credit_card', details: 'Primary cardholders and one guest' },
  ],
  guest_fee: 30,
});
await setAmenities(ID.mllTb, ['wifi','shower','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','printing','business_centre','charging','kids_area','quiet']);

// 5. Air Canada Signature Suite
await updateLounge(ID.sig, {
  location_detail: 'Terminal 1, International departures, Level 2, near Gate E77, post-security, airside (accessed via International Maple Leaf Lounge)',
  opening_hours: {
    monday:'11:00-23:30', tuesday:'14:00-23:30', wednesday:'11:00-23:30',
    thursday:'11:00-23:30', friday:'11:00-23:30', saturday:'14:00-23:30', sunday:'11:00-23:30',
    notes: 'Hours vary by day. No day passes, upgrades, or Star Alliance Gold access. Invitation-level only.',
  },
  description: `<p>The Air Canada Signature Suite is the most exclusive address in Terminal 1 — and one of a small number of genuinely invitation-level lounge experiences in Canada. Accessible near Gate E77 for qualifying international Business Class passengers and Super Elite 100K members, it operates as a full-service restaurant and private lounge hybrid, closer to a members' club than a conventional airport holding area.</p>
<p>Guests are welcomed by name and seated at formally set tables, where a dedicated chef delivers a changing menu of à la carte meals. The drinks program features premium spirits, wines by the glass, and signature cocktails. Private relaxation spaces, concierge assistance, Molton Brown bath products in the shower suites, and a deliberately unhurried pace separate the Signature Suite from the standard Maple Leaf Lounge experience. There is no day pass, no status-only bypass, and no walk-in entry — access is intentionally narrow to preserve the character of the space. For travelers who qualify, it represents one of the best ways to spend the hours before a long-haul departure from Pearson.</p>`,
  access_types: [
    { name: 'Air Canada Super Elite 100K', type: 'airline_status', details: 'Complimentary for Super Elite 100K members on eligible international flights' },
    { name: 'Air Canada International Business Class (select routes)', type: 'class_of_service', details: 'Eligible paid international Business Class fares on qualifying routes. Reward tickets, upgrades, and Economy fares do not qualify — verify at aircanada.com.' },
  ],
});
await setAmenities(ID.sig, ['wifi','bar','hotfood','coffee','shower','spa','quiet','newspapers','tv','charging']);

// 6. Plaza Premium T3 International (correct the wrong SkyTeam data)
await updateLounge(ID.ppT3Int, {
  name: 'Plaza Premium Lounge (International)',
  slug: 'plaza-premium-international-t3-yyz',
  location_detail: 'Terminal 3, International departures, Level 2, near Gate C32, post-security, airside',
  website: PP_WEBSITE,
  opening_hours: {
    monday:'05:30-01:00', tuesday:'05:30-01:00', wednesday:'05:30-01:00',
    thursday:'05:30-01:00', friday:'05:30-01:00', saturday:'05:30-01:00', sunday:'05:30-01:00',
    notes: 'Open daily 5:30 AM – 1:00 AM. Shower suites available for an additional $22. Massages and manicures available on request.',
  },
  description: `<p>The Plaza Premium Lounge (International) in Terminal 3 occupies a two-level space near Gate C32, positioned directly above the international departure hall. Among Pearson's Terminal 3 lounges, it is the most fully equipped option available through independent access programs — combining the amenities of a proper business lounge with facilities that serve families and leisure travelers equally well.</p>
<p>Inside, guests find a live cooking station serving Asian and Western dishes, a full bar, comfortable seating across two floors, shower suites (an additional $22), a children's play area and nursery, Wi-Fi, flight information screens, and on-demand massage and manicure services. Access is available through Priority Pass, DragonPass, LoungeKey, the American Express Platinum card, and a broad selection of premium Canadian credit cards, as well as paid day passes starting from $59. For international travelers departing Terminal 3 who want a lounge with genuine depth rather than just a place to sit, this is the clear choice.</p>`,
  guest_fee: 59,
  access_types: [
    { name: 'Priority Pass', type: 'membership', details: 'All Priority Pass membership tiers accepted' },
    { name: 'DragonPass (Visa Airport Companion)', type: 'membership', details: 'DragonPass and Visa Airport Companion Program members' },
    { name: 'LoungeKey / Mastercard Travel Pass', type: 'membership', details: 'LoungeKey and Mastercard Travel Pass members' },
    { name: 'American Express Platinum', type: 'credit_card', details: 'Unlimited complimentary access for primary cardholders and up to one guest' },
    { name: 'Scotiabank Passport Visa Infinite+', type: 'credit_card', details: 'Up to 6 complimentary visits per year' },
    { name: 'BMO Ascend World Elite Mastercard', type: 'credit_card', details: 'Up to 4 complimentary visits per year' },
    { name: 'Paid Day Pass ($59–$96)', type: 'membership', details: 'Walk-in or pre-book for 2–6 hours. Children aged 2–11 receive 30% discount.' },
  ],
});
await setAmenities(ID.ppT3Int, ['wifi','shower','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','printing','business_centre','charging','kids_area','spa','quiet','wheelchair']);

console.log('\n✓ All 6 existing YYZ lounges updated.\n');

// ════════════════════════════════════════════════════════════════════
// PART 2 — INSERT 8 NEW LOUNGES
// ════════════════════════════════════════════════════════════════════

console.log('═══ INSERTING NEW LOUNGES ═══\n');

// 7. Plaza Premium Lounge (Domestic) — Terminal 1
const ppT1DomId = await insertLounge({
  airport_id: AIRPORT_ID,
  name: 'Plaza Premium Lounge (Domestic)',
  slug: 'plaza-premium-domestic-t1-yyz',
  terminal: '1',
  location_detail: 'Terminal 1, Domestic departures, Level 3, immediately after security, airside',
  website: PP_WEBSITE,
  guest_fee: 59,
  guest_fee_currency: 'CAD',
  is_active: true,
  opening_hours: {
    monday:'05:30-22:00', tuesday:'05:30-22:00', wednesday:'05:30-22:00',
    thursday:'05:30-22:00', friday:'05:30-22:00', saturday:'05:30-22:00', sunday:'05:30-22:00',
    notes: 'Open daily 5:30 AM – 10:00 PM. Shower suites available for an additional $22 fee. Pre-booking online recommended.',
  },
  description: `<p>The Plaza Premium Lounge on Level 3 of Terminal 1 is one of the first things domestic travelers encounter after clearing security — positioned at the top of the escalator before the departure gates spread out across the concourse. As the primary independent lounge option for domestic passengers in Canada's busiest terminal, it serves a broad mix of travelers through Priority Pass, DragonPass, LoungeKey, and a wide selection of Canadian premium credit cards.</p>
<p>Inside, guests will find comfortable seating, a food and beverage selection that includes alcohol, free Wi-Fi, charging stations, flight information screens, a family zone, and shower access for an additional $22. Its early-after-security position makes it equally convenient whether your flight departs from Pier D, E, or F — and the generous operating hours accommodate the full range of domestic schedule slots throughout the day. For travelers who qualify through a card or membership, it offers a straightforward upgrade over the terminal experience below.</p>`,
  access_types: [
    { name: 'Priority Pass', type: 'membership', details: 'All Priority Pass membership tiers accepted' },
    { name: 'DragonPass (Visa Airport Companion)', type: 'membership', details: 'DragonPass and Visa Airport Companion Program members' },
    { name: 'LoungeKey / Mastercard Travel Pass', type: 'membership', details: 'LoungeKey and Mastercard Travel Pass members' },
    { name: 'American Express Platinum', type: 'credit_card', details: 'Unlimited complimentary access for primary cardholders and up to one guest' },
    { name: 'Scotiabank Passport Visa Infinite+', type: 'credit_card', details: 'Up to 6 complimentary visits per year' },
    { name: 'BMO Ascend World Elite Mastercard', type: 'credit_card', details: 'Up to 4 complimentary visits per year' },
    { name: 'RBC Avion Visa Infinite Privilege', type: 'credit_card', details: 'Up to 6 complimentary visits per year' },
    { name: 'Paid Day Pass ($59–$96)', type: 'membership', details: 'Walk-in or pre-book for 2–6 hours. Children aged 2–11 receive 30% discount.' },
  ],
});
if (ppT1DomId) await setAmenities(ppT1DomId, ['wifi','shower','snacks','bar','hotfood','coffee','tv','flight_screens','charging','kids_area','quiet','wheelchair']);

// 8. Plaza Premium Lounge (US Transborder) — Terminal 1
const ppT1TbId = await insertLounge({
  airport_id: AIRPORT_ID,
  name: 'Plaza Premium Lounge (US Transborder)',
  slug: 'plaza-premium-transborder-t1-yyz',
  terminal: '1',
  location_detail: 'Terminal 1, US Transborder departures (pre-clearance), Level 2, near Gates F53/F55, post-security, airside',
  website: PP_WEBSITE,
  guest_fee: 59,
  guest_fee_currency: 'CAD',
  capacity: 66,
  is_active: true,
  opening_hours: {
    monday:'05:30-21:00', tuesday:'05:30-21:00', wednesday:'05:30-21:00',
    thursday:'05:30-21:00', friday:'05:30-21:00', saturday:'05:30-21:00', sunday:'05:30-21:00',
    notes: 'Open daily 5:30 AM – 9:00 PM. Shower suites available for an additional $22. Pre-booking recommended during peak US departure windows.',
  },
  description: `<p>Tucked into Terminal 1's US transborder departure zone near Gates F53/F55, the Plaza Premium Lounge (US Transborder) is the independent alternative for travelers crossing into the United States who aren't flying Air Canada or a Star Alliance partner. Seating up to 66 guests, the lounge sits within the pre-clearance area — meaning those who enter have already committed to their flight and are beyond Canadian security and partway through the US Customs formalities.</p>
<p>Standard Plaza Premium amenities apply: hot and cold food, a full bar serving alcohol, Wi-Fi, charging stations, and shower suites available for an additional $22. The lounge is particularly popular with Priority Pass and DragonPass holders flying US carriers, and pre-booking online can help secure a spot during the busy mid-morning US departure surge. For travelers on any airline heading south who want to step off the concourse before boarding, this is one of Pearson's most consistently used independent lounges.</p>`,
  access_types: [
    { name: 'Priority Pass', type: 'membership', details: 'All Priority Pass membership tiers accepted' },
    { name: 'DragonPass (Visa Airport Companion)', type: 'membership', details: 'DragonPass and Visa Airport Companion Program members' },
    { name: 'LoungeKey / Mastercard Travel Pass', type: 'membership', details: 'LoungeKey and Mastercard Travel Pass members' },
    { name: 'American Express Platinum', type: 'credit_card', details: 'Unlimited complimentary access for primary cardholders and up to one guest' },
    { name: 'Paid Day Pass ($59–$96)', type: 'membership', details: 'Walk-in or pre-book for 2–6 hours. Children aged 2–11 receive 30% discount.' },
  ],
});
if (ppT1TbId) await setAmenities(ppT1TbId, ['wifi','shower','snacks','bar','hotfood','coffee','tv','charging','quiet']);

// 9. Plaza Premium Lounge (International) — Terminal 1
const ppT1IntId = await insertLounge({
  airport_id: AIRPORT_ID,
  name: 'Plaza Premium Lounge (International)',
  slug: 'plaza-premium-international-t1-yyz',
  terminal: '1',
  location_detail: 'Terminal 1, International departures, Level 2, near Gate E77, post-security, airside',
  website: PP_WEBSITE,
  guest_fee: 59,
  guest_fee_currency: 'CAD',
  capacity: 66,
  is_active: true,
  opening_hours: {
    monday:'05:30-01:00', tuesday:'05:30-01:00', wednesday:'05:30-01:00',
    thursday:'05:30-01:00', friday:'05:30-01:00', saturday:'05:30-01:00', sunday:'05:30-01:00',
    notes: 'Open daily 5:30 AM – 1:00 AM. Shower suites available for an additional $22. Note: this location was temporarily closed in late 2025 — verify current status before visiting.',
  },
  description: `<p>The Plaza Premium Lounge (International) in Terminal 1 sits near Gate E77 on Level 2, positioned within the international departures area after security and passport control. At 66 seats, it's a compact but well-equipped lounge that offers a meaningful step up from the open concourse for travelers heading to international destinations from Terminal 1's E and F gate areas.</p>
<p>The standard Plaza Premium package applies: hot and cold food, alcohol, Wi-Fi, charging, flight information screens, and shower suites available for an additional $22. Access is broad — Priority Pass, DragonPass, LoungeKey, the American Express Platinum card, and several Canadian premium co-branded cards all grant entry, as does a paid day pass. Note that this location experienced a temporary closure in late 2025; travelers should verify current operating status through Plaza Premium's website before their visit, as reopening timelines can shift.</p>`,
  access_types: [
    { name: 'Priority Pass', type: 'membership', details: 'All Priority Pass membership tiers accepted' },
    { name: 'DragonPass (Visa Airport Companion)', type: 'membership', details: 'DragonPass and Visa Airport Companion Program members' },
    { name: 'LoungeKey / Mastercard Travel Pass', type: 'membership', details: 'LoungeKey and Mastercard Travel Pass members' },
    { name: 'American Express Platinum', type: 'credit_card', details: 'Unlimited complimentary access for primary cardholders and up to one guest' },
    { name: 'Paid Day Pass ($59–$96)', type: 'membership', details: 'Walk-in or pre-book for 2–6 hours. Children aged 2–11 receive 30% discount.' },
  ],
});
if (ppT1IntId) await setAmenities(ppT1IntId, ['wifi','shower','snacks','bar','hotfood','coffee','tv','flight_screens','charging','quiet','newspapers']);

// 10. Air Canada Maple Leaf Lounge (Express) — Terminal 1
const mllExpressId = await insertLounge({
  airport_id: AIRPORT_ID,
  name: 'Air Canada Maple Leaf Lounge (Express)',
  slug: 'ac-maple-leaf-lounge-express-yyz',
  terminal: '1',
  location_detail: 'Terminal 1, International departures, Level 1, near Gates F84–F99, post-security, airside',
  website: AC_WEBSITE,
  guest_fee: null,
  guest_fee_currency: 'CAD',
  is_active: true,
  opening_hours: {
    monday:'05:00-20:30', tuesday:'05:00-20:30', wednesday:'05:00-20:30',
    thursday:'05:00-20:30', friday:'05:00-20:30', saturday:'05:00-20:30', sunday:'05:00-20:30',
    notes: 'Open daily 5:00 AM – 8:30 PM. Light service only — no showers or full hot buffet.',
  },
  description: `<p>The Air Canada Maple Leaf Lounge (Express) is the smallest and most utilitarian member of the Maple Leaf family at Toronto Pearson — and its greatest asset is purely geographic. Positioned on Level 1 near Gates F84–F99 at the far end of Terminal 1's international concourse, it serves eligible travelers whose gates are too distant to make a trip to the main Maple Leaf Lounge worth the walk.</p>
<p>The Express format is streamlined by design: light snacks, beverages, Wi-Fi, a business centre, television screens, and charging stations — but no showers and no hot buffet. Think of it as a quiet, comfortable alternative to gate seating rather than a full lounge experience. Access follows the same eligibility rules as the main Maple Leaf Lounges — Air Canada, Emirates, and Star Alliance boarding passes with the appropriate class or elite status apply. For travelers departing from the remote F gates, it provides exactly the right amount of comfort in exactly the right place.</p>`,
  access_types: [
    { name: 'Air Canada International Business Class', type: 'class_of_service', details: 'Business Class passengers on qualifying Air Canada international flights' },
    { name: 'Aeroplan Elite 50K / 75K / Super Elite 100K', type: 'airline_status', details: 'Aeroplan Elite 50K and above on eligible flights departing from the F84–F99 gate area' },
    { name: 'Star Alliance Gold', type: 'airline_status', details: 'Star Alliance Gold members on eligible same-day Air Canada international flight' },
    { name: 'Emirates Business / First Class', type: 'class_of_service', details: 'Emirates Business and First Class passengers on eligible codeshare flights' },
    { name: 'TD Aeroplan Visa Infinite Privilege', type: 'credit_card', details: 'Primary cardholders and one guest' },
    { name: 'CIBC Aeroplan Visa Infinite Privilege', type: 'credit_card', details: 'Primary cardholders and one guest' },
  ],
});
if (mllExpressId) await setAmenities(mllExpressId, ['wifi','snacks','bar','coffee','tv','business_centre','charging','quiet']);

// 11. American Airlines Admirals Club — Terminal 3
const admClubId = await insertLounge({
  airport_id: AIRPORT_ID,
  name: 'American Airlines Admirals Club',
  slug: 'american-airlines-admirals-club-yyz',
  terminal: '3',
  location_detail: 'Terminal 3, US Transborder departures (pre-clearance), Level 2, near Gate A10, post-security, airside',
  website: 'https://www.aa.com/i18n/travel-info/clubs/admirals-club.jsp',
  phone: '1-800-237-7971',
  guest_fee: null,
  guest_fee_currency: 'CAD',
  is_active: true,
  opening_hours: {
    monday:'05:00-19:00', tuesday:'05:00-19:00', wednesday:'05:00-19:00',
    thursday:'05:00-19:00', friday:'05:00-19:00', saturday:'05:00-18:45', sunday:'05:00-19:00',
    notes: 'Sunday–Friday 5:00 AM – 7:00 PM; Saturday 5:00 AM – 6:45 PM. US transborder passengers only. Capacity limits may apply.',
  },
  description: `<p>The American Airlines Admirals Club at Toronto Pearson is the only US network carrier–branded lounge at the airport, located near Gate A10 in Terminal 3's US pre-clearance area. For American Airlines passengers and Oneworld travelers heading south, it provides a polished and notably club-like atmosphere that feels closer to the US domestic lounge experience than the contract lounge alternatives nearby.</p>
<p>Inside, guests will find made-to-order food specialties alongside a buffet, a staffed bar, strong Wi-Fi, comfortable seating, business facilities, and a quieter environment than the Terminal 3 departure concourse. The guest policy is notably generous: a spouse or domestic partner and children under 18 are admitted at no additional charge, along with up to two paying guests — making it one of the more family-friendly airline lounges at Pearson. Hours are more limited than some competitors, closing in the early evening, so travelers on late afternoon or evening US departures should plan accordingly.</p>`,
  access_types: [
    { name: 'American Airlines / Oneworld Business or First Class', type: 'class_of_service', details: 'Business and First Class passengers on American Airlines, Aer Lingus, and other Oneworld partner airlines' },
    { name: 'Oneworld Emerald / Sapphire', type: 'airline_status', details: 'Oneworld Emerald and Sapphire elite members on eligible same-day Oneworld flight from Terminal 3' },
    { name: 'AAdvantage Platinum / Platinum Pro / Executive Platinum', type: 'airline_status', details: 'AAdvantage elite tier members on eligible same-day American Airlines flight' },
    { name: 'Admirals Club Membership', type: 'membership', details: 'Annual Admirals Club members and authorized guests' },
    { name: 'Citi / AAdvantage Executive World Elite Mastercard', type: 'credit_card', details: 'Primary cardholders receive complimentary Admirals Club membership' },
    { name: 'Military Personnel', type: 'membership', details: 'Active duty US military personnel with valid ID' },
  ],
});
if (admClubId) await setAmenities(admClubId, ['wifi','snacks','bar','hotfood','coffee','tv','business_centre','charging','kids_area','quiet','printing']);

// 12. Plaza Premium Lounge (US Transborder) — Terminal 3
const ppT3TbId = await insertLounge({
  airport_id: AIRPORT_ID,
  name: 'Plaza Premium Lounge (US Transborder)',
  slug: 'plaza-premium-transborder-t3-yyz',
  terminal: '3',
  location_detail: 'Terminal 3, US Transborder departures (pre-clearance), Level 2, near Gate A10, post-security, airside',
  website: PP_WEBSITE,
  guest_fee: 59,
  guest_fee_currency: 'CAD',
  capacity: 50,
  is_active: true,
  opening_hours: {
    monday:'05:30-19:30', tuesday:'05:30-19:30', wednesday:'05:30-19:30',
    thursday:'05:30-19:30', friday:'05:30-19:30', saturday:'05:30-19:30', sunday:'05:30-19:30',
    notes: 'Open daily 5:30 AM – 7:30 PM. Pre-booking online recommended.',
  },
  description: `<p>Positioned near Gate A10 in Terminal 3's US pre-clearance zone — right alongside the American Airlines Admirals Club — the Plaza Premium Lounge (US Transborder) is the independent lounge option for travelers heading into the United States who aren't on American or a Oneworld partner. Its live cooking station, which produces freshly prepared Asian and American-style dishes to order, sets it apart from the standard buffet format found in many contract lounges.</p>
<p>Seating up to 50 guests across a compact, modern interior, the lounge offers the full Plaza Premium standard: free Wi-Fi, alcohol, hot and cold food, television screens, and charging stations. The live cooking element gives it a fresher, more restaurant-like quality that frequent visitors tend to notice on return trips. Access is available through Priority Pass, DragonPass, LoungeKey, the American Express Platinum card, and paid day passes — covering a wide range of travelers regardless of airline or fare class. Pre-booking is recommended, particularly on busy US departure mornings.</p>`,
  access_types: [
    { name: 'Priority Pass', type: 'membership', details: 'All Priority Pass membership tiers accepted' },
    { name: 'DragonPass (Visa Airport Companion)', type: 'membership', details: 'DragonPass and Visa Airport Companion Program members' },
    { name: 'LoungeKey / Mastercard Travel Pass', type: 'membership', details: 'LoungeKey and Mastercard Travel Pass members' },
    { name: 'American Express Platinum', type: 'credit_card', details: 'Unlimited complimentary access for primary cardholders and up to one guest' },
    { name: 'Paid Day Pass ($59–$96)', type: 'membership', details: 'Walk-in or pre-book for 2–6 hours. Children aged 2–11 receive 30% discount.' },
  ],
});
if (ppT3TbId) await setAmenities(ppT3TbId, ['wifi','snacks','bar','hotfood','coffee','tv','charging','quiet']);

// 13. Plaza Premium Lounge (Domestic) — Terminal 3
const ppT3DomId = await insertLounge({
  airport_id: AIRPORT_ID,
  name: 'Plaza Premium Lounge (Domestic)',
  slug: 'plaza-premium-domestic-t3-yyz',
  terminal: '3',
  location_detail: 'Terminal 3, Domestic departures, Level 3, near Gates B22/B24, post-security, airside',
  website: PP_WEBSITE,
  guest_fee: 59,
  guest_fee_currency: 'CAD',
  capacity: 90,
  is_active: true,
  opening_hours: {
    monday:'05:30-22:00', tuesday:'05:30-22:00', wednesday:'05:30-22:00',
    thursday:'05:30-22:00', friday:'05:30-22:00', saturday:'05:30-22:00', sunday:'05:30-22:00',
    notes: 'Open daily 5:30 AM – 10:00 PM. Pre-booking online recommended during peak periods.',
  },
  description: `<p>The Plaza Premium Lounge (Domestic) in Terminal 3 sits on Level 3 near Gates B22 and B24, serving Canadian domestic departures from Pearson's older and somewhat more compact terminal. At 90 seats, it is one of the larger independent domestic lounges at the airport, with its generous floor plan arranged across a mix of banquettes and club chairs that give the space a more relaxed, lounge-bar feel than the busier Terminal 1 equivalent.</p>
<p>Food, beverages including alcohol, Wi-Fi, television screens, and charging stations are all included. Access is available through Priority Pass, DragonPass, LoungeKey, and a selection of Canadian premium credit cards, as well as paid day passes. For domestic passengers departing Terminal 3, it is the most comfortable independent lounge option in the building — and the generous seating capacity helps it handle moderate crowds better than smaller contract lounges at other airports. Travelers connecting through Terminal 3 on domestic routes find it a reliable and accessible stop before their gate.</p>`,
  access_types: [
    { name: 'Priority Pass', type: 'membership', details: 'All Priority Pass membership tiers accepted' },
    { name: 'DragonPass (Visa Airport Companion)', type: 'membership', details: 'DragonPass and Visa Airport Companion Program members' },
    { name: 'LoungeKey / Mastercard Travel Pass', type: 'membership', details: 'LoungeKey and Mastercard Travel Pass members' },
    { name: 'American Express Platinum', type: 'credit_card', details: 'Unlimited complimentary access for primary cardholders and up to one guest' },
    { name: 'Scotiabank Passport Visa Infinite+', type: 'credit_card', details: 'Up to 6 complimentary visits per year' },
    { name: 'BMO Ascend World Elite Mastercard', type: 'credit_card', details: 'Up to 4 complimentary visits per year' },
    { name: 'Paid Day Pass ($59–$96)', type: 'membership', details: 'Walk-in or pre-book for 2–6 hours. Children aged 2–11 receive 30% discount.' },
  ],
});
if (ppT3DomId) await setAmenities(ppT3DomId, ['wifi','snacks','bar','hotfood','coffee','tv','charging','quiet','wheelchair']);

// 14. Air France / KLM Crown Lounge — Terminal 3
const afKlmId = await insertLounge({
  airport_id: AIRPORT_ID,
  name: 'Air France / KLM Crown Lounge',
  slug: 'air-france-klm-crown-lounge-yyz',
  terminal: '3',
  location_detail: 'Terminal 3, International departures, Level 2, near Gate C33, post-security, airside (above the international departure hall)',
  website: 'https://lounge.airfranceklm.com/en/klm-crown-lounge/toronto',
  guest_fee: 50,
  guest_fee_currency: 'CAD',
  is_active: true,
  opening_hours: {
    monday:'09:00-22:30', tuesday:'09:00-22:30', wednesday:'09:00-22:30',
    thursday:'09:00-22:30', friday:'09:00-22:30', saturday:'09:00-22:30', sunday:'09:00-22:30',
    notes: 'Open daily 9:00 AM – 10:30 PM. International departures only — US transborder passengers are not eligible.',
  },
  description: `<p>Completely redesigned and reopened in September 2023, the KLM Crown Lounge at Terminal 3 is widely regarded as the best international lounge available at Pearson's older terminal. Located near Gate C33 on Level 2, just above the international departure hall, the renovated space reflects KLM's signature blue-and-cream European aesthetic — a sharp visual departure from the contract lounge standard and one of the more distinctive interiors at the airport.</p>
<p>The lounge offers table service alongside a curated food and beverage menu that includes wine, beer, and spirits, along with newspapers, television, Wi-Fi, printing facilities, and charging throughout. Access is available to Air France, KLM, and SkyTeam partner Business and First Class passengers, SkyTeam Elite Plus frequent flyers, and Priority Pass, DragonPass, and Mastercard Travel Pass holders. At a $50 walk-in day pass — notably less than Plaza Premium — it's also one of the more affordable paid-entry lounges at Pearson. For international travelers departing Terminal 3, it consistently ranks as the most pleasant atmosphere in the building.</p>`,
  access_types: [
    { name: 'Air France / KLM Business or First Class', type: 'class_of_service', details: 'Business and First Class passengers on Air France, KLM, and eligible SkyTeam partner airlines' },
    { name: 'SkyTeam Elite Plus', type: 'airline_status', details: 'SkyTeam Elite Plus members on eligible same-day international SkyTeam flight from Terminal 3' },
    { name: 'Priority Pass', type: 'membership', details: 'Priority Pass members; priority given to Business/First Class ticket holders during peak periods' },
    { name: 'DragonPass / Dreamfolks', type: 'membership', details: 'DragonPass and Dreamfolks membership program holders' },
    { name: 'Mastercard Travel Pass', type: 'membership', details: 'Eligible Mastercard Travel Pass cardholders' },
    { name: 'Paid Day Pass ($50)', type: 'membership', details: 'Walk-in entry for any departing international passenger — lowest day-pass rate of any lounge at Pearson Terminal 3' },
  ],
});
if (afKlmId) await setAmenities(afKlmId, ['wifi','snacks','bar','hotfood','coffee','tv','charging','quiet','newspapers','printing']);

console.log('\n✓ All 8 new YYZ lounges inserted.\n');
console.log('═══ COMPLETE — 14 total YYZ lounges in database ═══\n');
