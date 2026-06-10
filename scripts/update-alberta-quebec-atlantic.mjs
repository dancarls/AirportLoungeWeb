import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

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
  meeting_rooms:  '554cae8d-8678-4498-a774-aec987ede191',
  business_centre:'6c0c90da-0bab-4b33-87bb-dfa879c07d9c',
  charging:       '9ff17629-9424-447c-8972-cd29b414b9c2',
  kids_area:      'dca6544c-ff43-490a-b9e7-a498c9181926',
  printing:       '131aad96-7eb3-4620-ac69-071db404d652',
  spa:            '655af7e7-1323-47fa-9978-ec725fbd3e6e',
};

async function setAmenities(loungeId, keys) {
  await sb.from('lounge_amenities').delete().eq('lounge_id', loungeId);
  if (!keys.length) return;
  const rows = keys.map(k => ({ lounge_id: loungeId, amenity_id: A[k] }));
  const { error } = await sb.from('lounge_amenities').insert(rows);
  if (error) console.error('  amenity error:', loungeId, error.message);
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

const AC_WEB = 'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges.html';
const PP_WEB = 'https://www.plazapremiumlounge.com/en-uk/find/americas/canada';

// ════════════════════════════════════════════════════════════════════
// CALGARY HERO IMAGE — Upload to Supabase Storage
// ════════════════════════════════════════════════════════════════════

console.log('\n═══ UPLOADING CALGARY HERO IMAGE ═══\n');

let yyc_hero_url = null;
try {
  const imgPath = 'C:\\Users\\danca\\Downloads\\TorontoPearsonInternationalAirportYYC.png';
  const imgBuffer = readFileSync(imgPath);
  const storagePath = 'airports/yyc/hero.jpg';
  const { error: uploadErr } = await sb.storage
    .from('lounge-images')
    .upload(storagePath, imgBuffer, { contentType: 'image/jpeg', upsert: true });
  if (uploadErr) {
    console.error('  Upload error:', uploadErr.message);
  } else {
    yyc_hero_url = `https://ixgbdmrembkrpbkjhtfi.supabase.co/storage/v1/object/public/lounge-images/${storagePath}`;
    console.log('  YYC hero uploaded:', yyc_hero_url);
  }
} catch (e) {
  console.error('  Image read/upload failed:', e.message);
}

// ════════════════════════════════════════════════════════════════════
// PART 1 — YEG EDMONTON (1 update, 2 inserts)
// ════════════════════════════════════════════════════════════════════

console.log('\n═══ YEG EDMONTON ═══\n');

const YEG_ID = '6fb8cf7b-7ec8-47d7-83aa-fabd5b87ffd1';
const YEG_MLL_ID = '8eeae3a1-991b-4e08-bbf1-fb75118614c0';

await updateLounge(YEG_MLL_ID, {
  terminal: 'Main Terminal',
  location_detail: 'Main Terminal, Domestic and International departures, Level 2 — exit security, glass double doors on the left; take elevator or stairs; turn left at the top. Plaza Premium is on the right on the same floor.',
  website: AC_WEB,
  phone: '1-888-247-2262',
  capacity: 100,
  opening_hours: {
    monday:'04:30-23:15', tuesday:'04:30-23:15', wednesday:'04:30-23:15',
    thursday:'04:30-23:15', friday:'04:30-23:15', saturday:'04:30-23:15', sunday:'04:30-23:15',
    notes: 'Open daily 4:30 AM – 11:15 PM. No showers. US transborder passengers not eligible. Family washroom available near entrance.',
  },
  description: `<p>The Air Canada Maple Leaf Lounge at Edmonton International Airport is the first thing passengers see after clearing security — the glass double doors are immediately to the left as you exit the checkpoint. Head up the elevator or stairs to Level 2, turn left at the top, and you're at the lounge entrance. (The Plaza Premium Lounge sits just to the right at the same junction, making this one of the most clearly signed lounge corridors in Western Canada.)</p>
<p>The lounge's standout design feature is the faux fireplace that greets guests in the first seating section — a warm and fitting nod to Edmonton's notorious winters — paired with floor-to-ceiling windows offering tarmac views throughout. The space seats approximately 90 to 100 guests across a rectangular open-plan layout with thoughtful dividers for partial separation. A rotating themed buffet (Mediterranean, Asian-inspired, and Canadian comfort) has steadily improved the food program, and a self-serve bar offers complimentary spirits, beer, and wine. No showers are available. The business centre has computers, printers, and flight monitors. Access is for Air Canada premium cabin passengers, Aeroplan Elite members (35K and above), Star Alliance Gold travelers on eligible flights, Maple Leaf Club members, and select premium Aeroplan credit card holders — no Priority Pass or DragonPass.</p>`,
  access_types: [
    { name: 'Air Canada Business Class / Premium Rouge', type: 'class_of_service', details: 'Business Class and Premium Rouge passengers on domestic and international Air Canada flights' },
    { name: 'Aeroplan Elite 35K / 50K / 75K / Super Elite 100K', type: 'airline_status', details: 'All Aeroplan Elite tiers on eligible Air Canada flights' },
    { name: 'Star Alliance Gold', type: 'airline_status', details: 'Star Alliance Gold members on eligible same-day Air Canada domestic or international flight' },
    { name: 'Air Canada Maple Leaf Club', type: 'membership', details: 'Annual Maple Leaf Club membership — from $375 CAD per year' },
    { name: 'Amex Aeroplan Reserve Card', type: 'credit_card', details: 'Primary cardholders on eligible same-day Air Canada flight' },
    { name: 'TD Aeroplan Visa Infinite Privilege', type: 'credit_card', details: 'Primary cardholders and one guest' },
    { name: 'CIBC Aeroplan Visa Infinite Privilege', type: 'credit_card', details: 'Primary cardholders and one guest' },
    { name: 'Chase Sapphire Reserve (Star Alliance flights)', type: 'credit_card', details: 'Eligible cardholders on same-day Star Alliance flight' },
    { name: 'Paid Day Pass (fare add-on)', type: 'membership', details: 'Latitude ($25), Comfort ($40), or Flex ($50) fare add-on at booking' },
  ],
  guest_fee: 30,
});
await setAmenities(YEG_MLL_ID, ['wifi','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','business_centre','charging','quiet']);

// YEG Plaza Premium — Domestic/International
const ppYegDomId = await insertLounge({
  airport_id: YEG_ID,
  name: 'Plaza Premium Lounge',
  slug: 'plaza-premium-lounge-yeg',
  terminal: 'Main Terminal',
  location_detail: 'Main Terminal, Domestic and International departures, Level 2 — same entrance corridor as Maple Leaf Lounge; turn right at the top of the stairs/elevator (Maple Leaf is on the left)',
  website: `${PP_WEB}/edmonton/edmonton-international-airport`,
  guest_fee: 65, guest_fee_currency: 'CAD', capacity: 80, is_active: true,
  opening_hours: {
    monday:'04:30-00:00', tuesday:'04:30-00:00', wednesday:'04:30-00:00',
    thursday:'04:30-00:00', friday:'04:30-00:00', saturday:'04:30-00:00', sunday:'04:30-00:00',
    notes: 'Open daily 4:30 AM – midnight. Showers available. US transborder passengers not eligible. Priority Pass maximum 2-hour stay. Pre-book online: 3-hour (~$65–75 CAD) or 6-hour passes.',
  },
  description: `<p>Sharing the Level 2 lounge corridor with the Air Canada Maple Leaf Lounge — turn right at the top of the stairs versus left for Maple Leaf — the Plaza Premium Lounge at YEG is the go-to choice for WestJet, Flair, and other non-Air Canada passengers, as well as Priority Pass or DragonPass holders departing on domestic or international (non-US) routes. At 4,500 square feet and 80 seats, it is slightly larger than the Maple Leaf Lounge beside it and consistently receives stronger food and beverage reviews.</p>
<p>The buffet rotates through hearty Canadian-inspired dishes, with a well-regarded breakfast service featuring eggs, sausage, and bacon, and a lunch and dinner spread incorporating dishes like teriyaki chicken, lentil stew, and fresh salad stations. Alberta craft beer is available on tap alongside the full self-serve bar. Showers are available — a meaningful differentiator from the adjacent Maple Leaf Lounge — for travelers needing a refresh before long hauls. Three computer workstations and full flight information monitors serve business travelers. The lounge operates until midnight, making it the better option for evening international departures from YEG. Children under 2 are free; children aged 2–11 are admitted with a paying adult.</p>`,
  access_types: [
    { name: 'Priority Pass', type: 'membership', details: 'Priority Pass members — maximum 2-hour stay per visit' },
    { name: 'DragonPass (Visa Airport Companion)', type: 'membership', details: 'DragonPass and Visa Airport Companion Program members' },
    { name: 'LoungeKey', type: 'membership', details: 'LoungeKey members' },
    { name: 'American Express Platinum (Canada)', type: 'credit_card', details: 'Unlimited complimentary access for Amex Platinum cardholders' },
    { name: 'Capital One Venture X', type: 'credit_card', details: 'Eligible Capital One Venture X cardholders' },
    { name: 'Paid Day Pass ($65–$75 CAD)', type: 'membership', details: '3-hour or 6-hour pass — pre-book online for best availability. Children under 2 free; under 11 with paying adult.' },
  ],
});
if (ppYegDomId) await setAmenities(ppYegDomId, ['wifi','shower','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','business_centre','charging','quiet','kids_area']);

// YEG Plaza Premium — US Transborder
const ppYegUsId = await insertLounge({
  airport_id: YEG_ID,
  name: 'Plaza Premium Lounge (US Transborder)',
  slug: 'plaza-premium-transborder-yeg',
  terminal: 'Main Terminal',
  location_detail: 'Main Terminal, US Transborder departures (pre-clearance) — past Gate 88, at the very end of the US Transborder hall after US Customs. Two-level lounge with upper reception and lower seating level.',
  website: `${PP_WEB}/edmonton/edmonton-international-airport`,
  guest_fee: 65, guest_fee_currency: 'CAD', capacity: 75, is_active: true,
  opening_hours: {
    monday:'05:00-16:30', tuesday:'05:00-16:30', wednesday:'05:00-16:30',
    thursday:'05:00-16:30', friday:'05:00-16:30', saturday:'05:00-16:30', sunday:'05:00-16:30',
    notes: '⚠️ Open daily 5:00 AM – 4:30 PM ONLY. No lounge access for afternoon or evening US departures. Priority Pass maximum 2-hour stay. No dedicated washrooms inside lounge — use public terminal facilities.',
  },
  description: `<p>Positioned at the very end of Edmonton's US Transborder departures hall past Gate 88, the Plaza Premium Lounge (US Transborder) is the only lounge option for passengers flying from YEG to US destinations. The two-level layout is architecturally distinctive — a dramatic staircase connects the upper reception level to the lower main lounge, where floor-to-ceiling windows provide sweeping views of the airfield and create a bright, open atmosphere despite the compact 2,500-square-foot footprint.</p>
<p>The food program spans Asian-inspired dishes alongside North American breakfast and comfort food classics, with a rotating hot buffet and a full bar from opening. Four computer workstations, flight information monitors, and charging stations serve business travelers. One critical operational caveat for every traveler: this lounge closes at 4:30 PM daily. Passengers on afternoon or evening US-bound flights have no lounge option in YEG's transborder area. Pre-booking a 3-hour pass online is strongly recommended during peak morning US departure waves. Note: there is no dedicated washroom inside the lounge — guests must use the public restrooms in the departure hall.</p>`,
  access_types: [
    { name: 'Priority Pass', type: 'membership', details: 'Priority Pass members — maximum 2-hour stay per visit. US transborder boarding pass required.' },
    { name: 'DragonPass (Visa Airport Companion)', type: 'membership', details: 'DragonPass and Visa Airport Companion Program members' },
    { name: 'LoungeKey', type: 'membership', details: 'LoungeKey members' },
    { name: 'American Express Platinum (Canada & US)', type: 'credit_card', details: 'Amex Platinum cardholders (both Canadian and US-issued)' },
    { name: 'Capital One Venture X', type: 'credit_card', details: 'Eligible Capital One Venture X cardholders' },
    { name: 'Paid Day Pass ($65–$75 CAD)', type: 'membership', details: '3-hour or 6-hour pass — pre-book online. Children under 1 free; under 11 with paying adult.' },
  ],
});
if (ppYegUsId) await setAmenities(ppYegUsId, ['wifi','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','business_centre','charging','quiet']);

console.log('\n✓ YEG complete.\n');

// ════════════════════════════════════════════════════════════════════
// PART 2 — YHZ HALIFAX (update existing — CLOSED)
// ════════════════════════════════════════════════════════════════════

console.log('═══ YHZ HALIFAX ═══\n');

const YHZ_MLL_ID = 'f12af537-dcb2-496d-810e-87f48385627c';
await updateLounge(YHZ_MLL_ID, {
  terminal: 'Terminal 1',
  location_detail: 'Terminal 1, Domestic and International departures, Level 3 — take elevator or staircase from departures level after security; near Gate 20, centre of the terminal',
  website: AC_WEB,
  phone: '1-888-247-2262',
  is_active: false,
  opening_hours: {
    monday: null, tuesday: null, wednesday: null, thursday: null,
    friday: null, saturday: null, sunday: null,
    notes: '⚠️ CLOSED since October 1, 2025 for full renovation. Expected to reopen early 2027. When open: Daily 4:15 AM – 5:50 PM. Domestic and International passengers only — US transborder not eligible.',
  },
  description: `<p>The Air Canada Maple Leaf Lounge at Halifax Stanfield International Airport — the only lounge in Nova Scotia and across all four Atlantic provinces — has been closed since October 1, 2025 for its first full transformation in 30 years. It is expected to remain closed until early 2027. Eligible travelers are advised to plan their Halifax visits without lounge access until the reopening.</p>
<p>When open, the lounge occupied Level 3 of the terminal's centre section near Gate 20, serving domestic and international passengers exclusively — those on US transborder flights were not eligible as the lounge sits before the pre-clearance area. The previous lounge had a reliable if modest food and beverage program: rotational hot dishes, a salad bar, a self-serve bar with spirits, wine, and beer, and Lavazza coffee machines. Occasional regional highlights — lobster rolls and donairs — appeared on the menu and were appreciated by frequent Halifax visitors. A business centre with computers, printers, and fax, plus high-top workstations, served corporate travelers. No showers were available.</p>
<p>The 2027 renovation will nearly double the lounge's size, introduce a full-service curated cocktail and wine bar, and feature a Nova Scotia coastal design aesthetic. No Priority Pass or DragonPass access is offered.</p>`,
  access_types: [
    { name: 'Air Canada Business Class / Premium Rouge', type: 'class_of_service', details: 'Business Class and Premium Rouge passengers on domestic and international Air Canada flights' },
    { name: 'Aeroplan Elite 35K / 50K / 75K / Super Elite 100K', type: 'airline_status', details: 'All Aeroplan Elite tiers on eligible Air Canada flights' },
    { name: 'Star Alliance Gold', type: 'airline_status', details: 'Star Alliance Gold members on eligible same-day domestic or international Air Canada flight' },
    { name: 'Air Canada Maple Leaf Club', type: 'membership', details: 'Annual Maple Leaf Club membership' },
    { name: 'Amex Aeroplan Reserve Card', type: 'credit_card', details: 'Primary cardholders on eligible same-day Air Canada flight' },
    { name: 'TD / CIBC Aeroplan Visa Infinite Privilege', type: 'credit_card', details: 'Primary cardholders and one guest' },
    { name: 'Paid Day Pass (fare add-on)', type: 'membership', details: 'Latitude ($25), Comfort ($40), or Flex ($50) fare add-on — not applicable during renovation closure' },
  ],
  guest_fee: 30,
});
await setAmenities(YHZ_MLL_ID, ['wifi','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','business_centre','charging','quiet']);

console.log('\n✓ YHZ complete.\n');

// ════════════════════════════════════════════════════════════════════
// PART 3 — YYT ST. JOHN'S (update existing)
// ════════════════════════════════════════════════════════════════════

console.log('═══ YYT ST. JOHN\'S ═══\n');

const YYT_MLL_ID = '8b6df72e-5501-4590-84ee-94aa23329109';
await updateLounge(YYT_MLL_ID, {
  terminal: 'Main Terminal',
  location_detail: 'Main Terminal, Domestic and International departures, Level 2 — above Gates 1 and 2; take the elevator or staircase from the departures level near Gate 10; lounge is on the right after ascending',
  website: AC_WEB,
  phone: '1-888-247-2262',
  capacity: 70,
  opening_hours: {
    monday:'04:00-22:00', tuesday:'04:00-22:00', wednesday:'04:00-22:00',
    thursday:'04:00-22:00', friday:'04:00-22:00', saturday:'04:00-22:00', sunday:'04:00-22:00',
    notes: 'Open daily 4:00 AM – 10:00 PM. No showers. Unmanned lounge — obtain access code from Air Canada check-in agent before proceeding upstairs. No Priority Pass or DragonPass. Alcohol available after 11:00 AM.',
  },
  description: `<p>The Air Canada Maple Leaf Lounge at St. John's International Airport is the easternmost Maple Leaf Lounge in Canada — and the only lounge in all of Newfoundland and Labrador. Opened in December 2018 as a purpose-built replacement for a much smaller predecessor, the current lounge is 77% larger with 46 additional seats and sweeping panoramic views of iconic Signal Hill and the North Atlantic Ocean through floor-to-ceiling windows. Its design is among the most distinctive in the Maple Leaf network for a regional airport.</p>
<p>The interior draws on Newfoundland's identity through maple-wood screen walls, a slated wood partition separating the main seating area from the food and drink station, and a large fisherman photograph greeting guests on entry. A self-serve bar with Canadian wines and Lavazza specialty coffee is available from opening, with premium spirits from 11:00 AM. The buffet rotates through items like cheese omelets, bacon, and cold snacks. A business centre with desktop PCs, a printer, and workstations is available, and PressReader provides digital access to over 7,000 newspapers and magazines.</p>
<p>One critical note unique to this lounge: it is <strong>unmanned</strong>. There is no reception staff at the door. Eligible passengers must obtain a lounge access code from the Air Canada check-in agent at the departure level before heading upstairs — the self-scan gate opens automatically once a valid boarding pass and code are entered. No showers are available. No Priority Pass or DragonPass access is offered.</p>`,
  access_types: [
    { name: 'Air Canada Business Class (+1 guest)', type: 'class_of_service', details: 'Business Class passengers may bring one complimentary guest' },
    { name: 'Aeroplan Elite 35K / 50K / 75K / Super Elite 100K', type: 'airline_status', details: 'All Aeroplan Elite tiers — may bring spouse/domestic partner, up to 5 dependent children under 25, and one additional guest' },
    { name: 'Star Alliance Gold', type: 'airline_status', details: 'Star Alliance Gold members on eligible same-day Air Canada flight' },
    { name: 'Air Canada Maple Leaf Club', type: 'membership', details: 'Annual Maple Leaf Club membership (no guests)' },
    { name: 'Amex Aeroplan Reserve / Platinum / Corporate Platinum', type: 'credit_card', details: 'Primary cardholders on eligible same-day Air Canada flight' },
    { name: 'Paid Day Pass (fare add-on)', type: 'membership', details: 'Latitude, Comfort, or Flex fare add-on — purchasable during booking or up to 24 hours before departure' },
  ],
  guest_fee: 30,
});
await setAmenities(YYT_MLL_ID, ['wifi','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','business_centre','charging','quiet']);

console.log('\n✓ YYT complete.\n');

// ════════════════════════════════════════════════════════════════════
// PART 4 — YUL MONTRÉAL (2 updates, 7 inserts)
// ════════════════════════════════════════════════════════════════════

console.log('═══ YUL MONTRÉAL ═══\n');

const YUL_ID = 'ccd3abf2-f1c1-41a7-8fc4-eb0a22e7b50c';
const YUL_MLL_ID = 'ade77f09-36c0-4b37-b980-a9fc7a1b048e';   // ac-maple-leaf-lounge-yul → Domestic
const YUL_CAFE_ID = '588f5dec-da2c-43a2-88e9-3b3363379975';  // ac-cafe-yul → Aspire AMEX

// Update: AC MLL → YUL Domestic
await updateLounge(YUL_MLL_ID, {
  name: 'Air Canada Maple Leaf Lounge (Domestic)',
  slug: 'ac-maple-leaf-lounge-domestic-yul',
  terminal: 'Main Terminal',
  location_detail: 'Main Terminal, Domestic departures, Level 2 — between Gates 1 and 3, after Security Checkpoint A, airside',
  website: AC_WEB,
  phone: '1-888-247-2262',
  opening_hours: {
    monday:'04:15-22:00', tuesday:'04:15-22:00', wednesday:'04:15-22:00',
    thursday:'04:15-22:00', friday:'04:15-22:00', saturday:'04:15-22:00', sunday:'04:15-22:00',
    notes: 'Open daily 4:15 AM – 10:00 PM. No showers. Domestic flights only — international and US transborder passengers not eligible. Draft beer available from 11:00 AM.',
  },
  description: `<p>Situated on Level 2 of YUL's domestic terminal between Gates 1 and 3, just past Security Checkpoint A, the Air Canada Maple Leaf Lounge serves as the primary premium retreat for domestic flyers at one of Canada's busiest airports. The layout provides a clear separation between seating, dining, and business areas, with draft beer flowing from 11 AM and a self-serve bar offering spirits, wines, and juices throughout the day.</p>
<p>For nearly 15 years, this was the only lounge accessible in YUL's domestic zone. The arrival of the Aspire AMEX Lounge just a few steps away in 2025 finally gave Priority Pass and DragonPass holders an open-access alternative — though the Maple Leaf Lounge retains its status as the Air Canada flagship domestic space. No showers are available. Access follows the national Maple Leaf standard: Air Canada premium cabin passengers, Aeroplan 50K and above, Star Alliance Gold travelers, and eligible Aeroplan premium credit card holders. Domestic flights only — international and US transborder passengers must use the dedicated lounges in their respective zones.</p>`,
  access_types: [
    { name: 'Air Canada Business Class / Signature Class / Premium Rouge', type: 'class_of_service', details: 'Business and premium cabin passengers on domestic Air Canada flights' },
    { name: 'Aeroplan Elite 50K / 75K / Super Elite 100K', type: 'airline_status', details: 'Aeroplan Elite 50K and above on eligible domestic flights' },
    { name: 'Star Alliance Gold', type: 'airline_status', details: 'Star Alliance Gold members on eligible same-day Air Canada domestic flight' },
    { name: 'Air Canada Maple Leaf Club', type: 'membership', details: 'Annual Maple Leaf Club membership holders' },
    { name: 'Amex Aeroplan Reserve Card', type: 'credit_card', details: 'Primary cardholders on eligible same-day domestic Air Canada flight' },
    { name: 'TD / CIBC Aeroplan Infinite Privilege', type: 'credit_card', details: 'Primary cardholders and one guest' },
  ],
  guest_fee: 30,
});
await setAmenities(YUL_MLL_ID, ['wifi','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','business_centre','charging','quiet']);

// Update: ac-cafe-yul → Aspire AMEX Lounge
await updateLounge(YUL_CAFE_ID, {
  name: 'Aspire | American Express Lounge',
  slug: 'aspire-amex-lounge-yul',
  terminal: 'Main Terminal',
  location_detail: 'Main Terminal, Domestic departures, Level 2 — between Gates 1 and 2, behind Starbucks and YUL Pizza, after Security Checkpoint A, airside',
  website: 'https://www.aspireairportlounges.com',
  guest_fee: 70, guest_fee_currency: 'CAD',
  capacity: 100, is_active: true,
  opening_hours: {
    monday:'05:00-21:00', tuesday:'05:00-21:00', wednesday:'05:00-21:00',
    thursday:'05:00-21:00', friday:'05:00-21:00', saturday:'05:00-21:00', sunday:'05:00-21:00',
    notes: 'Open daily 5:00 AM – 9:00 PM (official). Alcohol from 11:00 AM only. American Express Platinum and Centurion: priority access regardless of occupancy. Priority Pass / DragonPass: space-available basis, 3-hour maximum. Domestic departing boarding pass required. Soft-opened August 2025.',
  },
  description: `<p>Opened in soft launch in August 2025, the Aspire | American Express Lounge at Montréal-Trudeau is a milestone for Canadian airport lounges: it is the first lounge accessible to all travelers in YUL's domestic terminal, and the first American Express co-branded Aspire lounge in Canada. Located between Gates 1 and 2 on Level 2 — just behind Starbucks and YUL Pizza, steps from the Air Canada Maple Leaf Lounge — the 100-seat space is designed in distinct zones: a dining area, a productivity workspace, a comfortable living room section with panoramic ramp views, and a relaxation corner.</p>
<p>Unlike most airport buffet lounges, this lounge operates a table service model: guests order food and drinks from a mobile menu via QR code at their seat, with items delivered to them. The menu spans grab-and-go bites, full meals, Montréal-brewed craft beers and ciders, cocktails, and specialty coffees. A grab-and-go counter serves passengers with tight connections. Alcoholic beverages are available from 11:00 AM only. American Express Platinum and Centurion cardholders receive priority access regardless of occupancy; Priority Pass, DragonPass, and Visa Airport Companion members are admitted on a space-available basis with a 3-hour stay limit. There are no showers and no dedicated washrooms inside the lounge.</p>`,
  access_types: [
    { name: 'American Express Platinum (Canada)', type: 'credit_card', details: 'Priority access regardless of occupancy. Domestic departing boarding pass required.' },
    { name: 'American Express Business Platinum', type: 'credit_card', details: 'Priority access — same as personal Platinum' },
    { name: 'American Express Centurion Card', type: 'credit_card', details: 'Priority access for Centurion cardholders' },
    { name: 'Priority Pass', type: 'membership', details: 'Space-available basis only (Amex Platinum holders take priority) — 3-hour maximum stay' },
    { name: 'DragonPass (Visa Airport Companion)', type: 'membership', details: 'Space-available basis — 3-hour maximum stay' },
    { name: 'Paid Day Pass', type: 'membership', details: 'Check aspireairportlounges.com or Expedia for current pricing. Domestic boarding pass required. Children under 2 free; under 18 must be with adult.' },
  ],
});
await setAmenities(YUL_CAFE_ID, ['wifi','snacks','bar','hotfood','coffee','tv','business_centre','charging','quiet','kids_area','meeting_rooms']);

// INSERT: AC MLL Transborder
const yulMllTbId = await insertLounge({
  airport_id: YUL_ID,
  name: 'Air Canada Maple Leaf Lounge (Transborder)',
  slug: 'ac-maple-leaf-lounge-transborder-yul',
  terminal: 'Main Terminal',
  location_detail: 'Main Terminal, US Transborder departures (pre-clearance), Level 2 — near Gate 73; after exiting US Customs, turn right into departure hall, enter doors marked "56–73", elevator or stairs to Level 2',
  website: AC_WEB, phone: '1-888-247-2262',
  guest_fee: 30, guest_fee_currency: 'CAD', is_active: true,
  opening_hours: {
    monday:'05:15-19:30', tuesday:'05:15-19:30', wednesday:'05:15-19:30',
    thursday:'05:15-19:30', friday:'05:15-19:30', saturday:'04:30-19:30', sunday:'05:15-19:30',
    notes: 'Daily 5:15 AM – 7:30 PM; Saturday opens 4:30 AM. US transborder boarding pass required. No showers confirmed.',
  },
  description: `<p>Located on Level 2 near Gate 73 in YUL's US Transborder zone, the Air Canada Maple Leaf Lounge (Transborder) is a compact but well-maintained space for pre-clearance crowds heading to US destinations. After clearing US Customs and Border Protection, passengers turn right into the departure hall and look for the large "56–73" gate sign — the lounge entrance is before that sign, with stairs and an elevator inside leading to Level 2.</p>
<p>The lounge operates from 5:15 AM to 7:30 PM daily, with an earlier 4:30 AM Saturday opening to catch weekend early-morning US flights. The food and beverage area offers a self-serve bar with beer, wine, and spirits, light snacks, and hot food selections during peak hours. United Club members are included on the access list — a useful feature for travelers connecting through Montréal on United codeshare or Star Alliance routes. The Desjardins Odyssey Lounge (near Gate 76) is the open-access alternative in the same zone for Priority Pass and DragonPass holders.</p>`,
  access_types: [
    { name: 'Air Canada Business Class / Premium Rouge', type: 'class_of_service', details: 'Business Class and Premium Rouge passengers on Air Canada US transborder flights' },
    { name: 'Aeroplan Elite 35K / 50K / 75K / Super Elite 100K', type: 'airline_status', details: 'All Aeroplan Elite tiers on eligible US transborder flights' },
    { name: 'Star Alliance Gold', type: 'airline_status', details: 'Star Alliance Gold members on eligible same-day Star Alliance US transborder flight' },
    { name: 'United Club Membership', type: 'membership', details: 'United Club members on eligible Air Canada transborder flights' },
    { name: 'Air Canada Maple Leaf Club', type: 'membership', details: 'Annual Maple Leaf Club members' },
    { name: 'TD / CIBC Aeroplan Infinite Privilege', type: 'credit_card', details: 'Primary cardholders and one guest' },
  ],
});
if (yulMllTbId) await setAmenities(yulMllTbId, ['wifi','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','business_centre','charging','quiet']);

// INSERT: Desjardins Odyssey — Transborder
const desjTbId = await insertLounge({
  airport_id: YUL_ID,
  name: 'Desjardins Odyssey Lounge (Transborder)',
  slug: 'desjardins-odyssey-lounge-transborder-yul',
  terminal: 'Main Terminal',
  location_detail: 'Main Terminal, US Transborder departures (pre-clearance) — near Gates 76–77, in the extension of the transborder departures area; after passport control and security, proceed through duty free and turn left',
  website: 'https://www.desjardins.com/en/credit-cards/desjardins-odyssey-lounges.html',
  phone: '(514) 633-3077',
  guest_fee: 42, guest_fee_currency: 'CAD', capacity: 80, is_active: true,
  opening_hours: {
    monday:'04:30-21:00', tuesday:'04:30-21:00', wednesday:'04:30-21:00',
    thursday:'04:30-21:00', friday:'04:30-21:00', saturday:'04:30-21:00', sunday:'04:30-21:00',
    notes: 'Open daily 4:30 AM – 9:00 PM. US transborder boarding pass (Gates 72–89) required. Maximum 3-hour stay for most access programs. 1 complimentary alcoholic drink per guest on arrival.',
  },
  description: `<p>Opened March 1, 2024, the Desjardins Odyssey Lounge (Transborder) is the newest lounge in YUL's US Transborder zone — a unique Québec-flavoured hospitality partnership between Desjardins Group and Plaza Premium. Located near Gates 76–77, accessible after duty free by turning left, the lounge is specifically available to passengers holding US-bound boarding passes for Gates 72 to 89.</p>
<p>At first glance it resembles a well-designed restaurant or café rather than a traditional airport lounge — a full bar sits at the entrance, with food options along the right wall. One complimentary alcoholic drink is included per guest on arrival. The food selection is light but varied: hot dishes like stir-fried beef and penne during evening visits, snacks, salads, and soups. Desjardins Odyssey cardholders benefit from 8–12 free visits per year before a 50% discount kicks in, making it particularly attractive for frequent Montréal–US travelers. Amex Platinum and DragonPass holders also have access. There are no dedicated washrooms inside the lounge — a limitation worth noting for longer stays.</p>`,
  access_types: [
    { name: 'Desjardins Odyssey Visa Infinite Privilege', type: 'credit_card', details: '12 free passes per year; additional visits at 50% discount' },
    { name: 'Desjardins Odyssey World Elite Mastercard', type: 'credit_card', details: '8 free passes per year; additional visits at 50% discount' },
    { name: 'Desjardins Odyssey Gold Visa', type: 'credit_card', details: '50% discount on all visits' },
    { name: 'American Express Platinum (Global Lounge Collection)', type: 'credit_card', details: 'Complimentary access for Amex Platinum cardholders' },
    { name: 'DragonPass', type: 'membership', details: 'DragonPass membership holders' },
    { name: 'Paid Day Pass ($42 CAD adults / $26 CAD ages 3–17)', type: 'membership', details: 'Walk-in. Children under 3 free. Maximum 3-hour stay per visit.' },
  ],
});
if (desjTbId) await setAmenities(desjTbId, ['wifi','snacks','bar','hotfood','coffee','tv','flight_screens','charging','quiet']);

// INSERT: AC MLL International
const yulMllIntId = await insertLounge({
  airport_id: YUL_ID,
  name: 'Air Canada Maple Leaf Lounge (International)',
  slug: 'ac-maple-leaf-lounge-international-yul',
  terminal: 'Main Terminal',
  location_detail: 'Main Terminal, International departures (Gates 50–68) — near Gate 52, after security and passport control, signposted from the main corridor, airside',
  website: AC_WEB, phone: '1-866-556-9504',
  guest_fee: 30, guest_fee_currency: 'CAD', is_active: true,
  opening_hours: {
    monday:'06:30-23:00', tuesday:'06:30-23:00', wednesday:'06:30-23:00',
    thursday:'06:30-23:00', friday:'06:30-21:30', saturday:'06:30-21:30', sunday:'06:30-21:30',
    notes: 'Tue–Thu open until 11:00 PM; Mon/Fri/Sat/Sun until 9:30 PM. Showers available. International flights only — domestic and US transborder passengers not eligible.',
  },
  description: `<p>The Air Canada Maple Leaf Lounge (International) at Montréal-Trudeau is widely considered the best Maple Leaf Lounge in YUL's network and one of the stronger examples of the brand on the East Coast. Positioned near Gate 52 in the international departures zone, it serves passengers on long-haul flights to Europe, the Caribbean, North Africa, and beyond. The food and beverage program notably exceeds the domestic counterpart — a proper buffet with full hot meals, salads, and soups rather than snacks — and showers are available for travelers needing a refresh before or after long hauls.</p>
<p>The lounge operates later on Tuesdays, Wednesdays, and Thursdays (until 11:00 PM) to accommodate the bulk of long-haul European night departures. Clean architectural lines, comfortable furnishings, tarmac views, and a business centre with workstations and printers complete the experience. Access follows the standard international Maple Leaf policy: Air Canada international premium cabin passengers, Aeroplan Elite 50K and above, Star Alliance Gold travelers on international flights, and eligible Aeroplan premium credit card holders. International Premium Economy passengers are not eligible.</p>`,
  access_types: [
    { name: 'Air Canada International Business Class / Signature Class', type: 'class_of_service', details: 'Business and Signature Class passengers on Air Canada international flights' },
    { name: 'Aeroplan Elite 50K / 75K / Super Elite 100K', type: 'airline_status', details: 'Aeroplan Elite 50K and above on eligible international flights' },
    { name: 'Star Alliance Gold', type: 'airline_status', details: 'Star Alliance Gold members on eligible same-day international Air Canada flight' },
    { name: 'Air Canada Maple Leaf Club', type: 'membership', details: 'Annual Maple Leaf Club members' },
    { name: 'Amex Aeroplan Reserve Card', type: 'credit_card', details: 'Primary cardholders on eligible same-day international Air Canada flight' },
    { name: 'TD / CIBC Aeroplan Infinite Privilege', type: 'credit_card', details: 'Primary cardholders and one guest' },
  ],
});
if (yulMllIntId) await setAmenities(yulMllIntId, ['wifi','shower','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','business_centre','charging','quiet']);

// INSERT: Desjardins Odyssey — International
const desjIntId = await insertLounge({
  airport_id: YUL_ID,
  name: 'Desjardins Odyssey Lounge (International)',
  slug: 'desjardins-odyssey-lounge-international-yul',
  terminal: 'Main Terminal',
  location_detail: 'Main Terminal, International departures (Gates 51–68) — near Gate 63, international concourse, after security and passport control',
  website: 'https://www.desjardins.com/en/credit-cards/desjardins-odyssey-lounges.html',
  guest_fee: 42, guest_fee_currency: 'CAD', capacity: 260, is_active: true,
  opening_hours: {
    monday:'04:00-22:00', tuesday:'04:00-22:00', wednesday:'04:00-22:00',
    thursday:'04:00-22:00', friday:'04:00-22:00', saturday:'04:00-22:00', sunday:'04:00-22:00',
    notes: 'Open daily 4:00 AM – last flight (approximately 10:00 PM). International boarding pass for Gates 51–68 required. Maximum 3-hour stay. Children under 3 free.',
  },
  description: `<p>The Desjardins Odyssey Lounge (International) is one of the largest independent lounges in Montréal's airport network, accommodating up to 260 guests near Gate 63 in the international departures concourse — after security and passport control. It is the open-access companion to the nearby Air Canada Maple Leaf Lounge (Gate 52) and serves any international traveler on any airline or class with a Priority Pass, DragonPass, Desjardins Odyssey card, or walk-in day pass.</p>
<p>The food and beverage offering is thoughtfully curated, with vegetarian, gluten-free, and locally sourced options alongside standard hot dishes, soups, pastries, and fruit. A full bar serves beer, wine, sparkling wine, and spirits throughout the day. At 260 seats it is substantially larger than most lounges in this terminal zone, making it the more reliable option during busy evening international departures. Desjardins Odyssey cardholders receive 8–12 free passes per year before a 50% discount applies, making it especially attractive for Québec-based travelers who frequently fly internationally from YUL.</p>`,
  access_types: [
    { name: 'Desjardins Odyssey Visa Infinite Privilege', type: 'credit_card', details: '12 free passes per year; additional visits at 50% discount' },
    { name: 'Desjardins Odyssey World Elite Mastercard', type: 'credit_card', details: '8 free passes per year; additional visits at 50% discount' },
    { name: 'Desjardins Odyssey Gold Visa', type: 'credit_card', details: '50% discount on all visits' },
    { name: 'Priority Pass', type: 'membership', details: 'Priority Pass members — 3-hour maximum stay per visit' },
    { name: 'DragonPass', type: 'membership', details: 'DragonPass membership holders' },
    { name: 'Paid Day Pass ($42 CAD adults / $26 CAD ages 12–17)', type: 'membership', details: 'Walk-in. Children under 3 free. Maximum 3-hour stay.' },
  ],
});
if (desjIntId) await setAmenities(desjIntId, ['wifi','snacks','bar','hotfood','coffee','tv','flight_screens','charging','quiet','newspapers']);

// INSERT: Air France/KLM Lounge — International
const afKlmYulId = await insertLounge({
  airport_id: YUL_ID,
  name: 'Air France / KLM Lounge',
  slug: 'air-france-klm-lounge-yul',
  terminal: 'Main Terminal',
  location_detail: 'Main Terminal, International departures — near Gate 57, after security and passport control, international concourse',
  website: 'https://www.airfrance.ca',
  phone: null,
  guest_fee: null, guest_fee_currency: 'CAD', is_active: true,
  opening_hours: {
    monday:'05:00-22:00', tuesday:'05:00-22:00', wednesday:'05:00-22:00',
    thursday:'05:00-22:00', friday:'05:00-22:00', saturday:'05:00-22:00', sunday:'05:00-22:00',
    notes: 'Open daily 5:00 AM – 10:00 PM. Priority Pass and DragonPass access restricted 3:00 PM – 6:00 PM (Air France/KLM priority passengers only during this window). Showers available for a fee. Operated by Plaza Premium. International departures only.',
  },
  description: `<p>Operated by Plaza Premium under Air France and KLM branding, the Air France/KLM Lounge near Gate 57 is the SkyTeam flagship lounge at Montréal-Trudeau and one of the more well-appointed independent-operated airline lounges in YUL's international zone. Open daily from 5:00 AM to 10:00 PM, the lounge serves SkyTeam Elite Plus, Flying Blue Gold and Platinum members, and Air France/KLM premium cabin passengers throughout the day.</p>
<p>The food program is a highlight: a full-service restaurant component with sit-down meal options complements the hot buffet and finger food selections, with complimentary house wine, beer, and spirits available throughout. Showers — available for a fee — set this lounge apart from many others in the same terminal zone. One important operational note: Priority Pass and DragonPass holders are welcome throughout most of the day, but access is restricted between 3:00 PM and 6:00 PM when the lounge is reserved exclusively for Air France/KLM priority passengers. Travelers using access programs should plan around this window, particularly before popular evening European departures.</p>`,
  access_types: [
    { name: 'Air France / KLM Business or First Class', type: 'class_of_service', details: 'Business and First Class passengers on Air France and KLM flights' },
    { name: 'Flying Blue Gold / Platinum', type: 'airline_status', details: 'Flying Blue Gold and Platinum elite members on eligible same-day SkyTeam flight' },
    { name: 'SkyTeam Elite Plus', type: 'airline_status', details: 'SkyTeam Elite Plus members on eligible same-day international SkyTeam flight' },
    { name: 'Priority Pass', type: 'membership', details: 'Priority Pass members — access restricted 3:00 PM–6:00 PM for airline priority passengers only' },
    { name: 'DragonPass', type: 'membership', details: 'DragonPass members — same 3:00–6:00 PM restriction applies' },
  ],
});
if (afKlmYulId) await setAmenities(afKlmYulId, ['wifi','shower','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','business_centre','charging','quiet']);

// INSERT: National Bank Lounge (Temporary — opens Aug 1, 2026)
const nbkId = await insertLounge({
  airport_id: YUL_ID,
  name: 'National Bank Lounge',
  slug: 'national-bank-lounge-yul',
  terminal: 'Main Terminal',
  location_detail: 'Main Terminal, International departures — near Gate 53, international concourse, after security and passport control',
  website: 'https://www.nbc.ca',
  guest_fee: 60, guest_fee_currency: 'CAD', is_active: true,
  opening_hours: {
    monday:'05:00-21:00', tuesday:'05:00-21:00', wednesday:'05:00-21:00',
    thursday:'05:00-21:00', friday:'05:00-21:00', saturday:'05:00-21:00', sunday:'05:00-21:00',
    notes: '⚠️ Permanent lounge closes July 31, 2026 for full renovation (est. completion 2027). Temporary lounge opens August 1, 2026 at same location with reduced services: no alcohol, no showers, no meeting rooms, self-service snacks and non-alcoholic beverages only, reduced seating. International departing boarding pass (Gates 52+) required.',
  },
  description: `<p>The National Bank Lounge near Gate 53 in YUL's international zone has been a popular option for cardholders and Priority Pass members for years. However, as of July 31, 2026, the permanent lounge closes for a comprehensive renovation expected to run through 2027. A temporary lounge opens on August 1, 2026 at the same location near Gate 53 with significantly reduced services.</p>
<p>The temporary replacement lounge maintains access for National Bank World Elite Mastercard holders, Priority Pass, and DragonPass — but offers only self-service snacks and non-alcoholic beverages, with no alcohol bar, no showers, no meeting rooms, and a 2-hour stay limit for standard cardholders (3 hours for Private Banking 1859 World Elite holders). Travelers who relied on the National Bank Lounge for YUL international departures are advised to consider the Desjardins Odyssey Lounge (Gate 63), the Air France/KLM Lounge (Gate 57), or the Aspire International Lounge (Gate 52) as alternatives during the renovation period. The renovated permanent lounge is expected to re-open with upgraded facilities in 2027.</p>`,
  access_types: [
    { name: 'National Bank World Elite Mastercard', type: 'credit_card', details: 'Complimentary access — 2-hour standard stay. Up to 7 guests per cardholder.' },
    { name: 'National Bank Private Banking 1859 World Elite Mastercard', type: 'credit_card', details: 'Complimentary access — 3-hour stay' },
    { name: 'Priority Pass', type: 'membership', details: 'Priority Pass members' },
    { name: 'DragonPass', type: 'membership', details: 'DragonPass membership holders' },
    { name: 'Paid Day Pass (~$60 CAD)', type: 'membership', details: 'Walk-in 3-hour pass. International departing boarding pass (Gates 52+) required.' },
  ],
});
if (nbkId) await setAmenities(nbkId, ['wifi','snacks','coffee','tv','flight_screens','charging','quiet']);

// INSERT: Aspire International Lounge
const aspireYulIntId = await insertLounge({
  airport_id: YUL_ID,
  name: 'Aspire International Lounge',
  slug: 'aspire-international-lounge-yul',
  terminal: 'Main Terminal',
  location_detail: 'Main Terminal, International departures — near Gate 52, Level 2, same area as the Air Canada Maple Leaf Lounge (International), after security and passport control',
  website: 'https://www.aspireairportlounges.com',
  guest_fee: null, guest_fee_currency: 'CAD', is_active: true,
  opening_hours: {
    monday:'04:00-22:00', tuesday:'04:00-22:00', wednesday:'04:00-22:00',
    thursday:'04:00-22:00', friday:'04:00-22:00', saturday:'04:00-22:00', sunday:'04:00-22:00',
    notes: 'Open daily 4:00 AM – 10:00 PM. No showers. Priority Pass / DragonPass: 3-hour maximum stay. Smart casual dress expected. International departing boarding pass required.',
  },
  description: `<p>The Aspire International Lounge at YUL is located near Gate 52 in the international departures zone, sharing its concourse area with the Air Canada Maple Leaf Lounge (International). It functions as the open-access Priority Pass and DragonPass option for passengers who don't qualify for Air Canada's or Desjardins' programs, operating from 4:00 AM to 10:00 PM daily — one of the earlier opening times in the international zone.</p>
<p>The food and beverage offering is standard for an Aspire location: a light buffet with complimentary standard alcoholic beverages included, and premium spirits available at a surcharge. There are no showers. For Priority Pass or DragonPass holders with multiple lounge options in YUL's international zone, the Desjardins Odyssey Lounge (Gate 63) is the larger and generally preferred choice for its greater capacity (260 seats) and broader food selection, while the Air France/KLM Lounge (Gate 57) offers the most premium food program with shower access during off-peak hours.</p>`,
  access_types: [
    { name: 'Priority Pass', type: 'membership', details: 'Priority Pass members — 3-hour maximum stay per visit' },
    { name: 'DragonPass (Visa Airport Companion)', type: 'membership', details: 'DragonPass and Visa Airport Companion Program members' },
    { name: 'American Express Platinum', type: 'credit_card', details: 'Amex Platinum cardholders' },
    { name: 'Paid Day Pass', type: 'membership', details: 'Check aspireairportlounges.com for current pricing. International departing boarding pass required.' },
  ],
});
if (aspireYulIntId) await setAmenities(aspireYulIntId, ['wifi','snacks','bar','coffee','tv','charging','quiet']);

console.log('\n✓ YUL complete.\n');

// ════════════════════════════════════════════════════════════════════
// PART 5 — YQB QUÉBEC CITY (create airport + 3 lounges)
// ════════════════════════════════════════════════════════════════════

console.log('═══ YQB QUÉBEC CITY ═══\n');

const { data: yqbRow, error: yqbErr } = await sb.from('airports').insert({
  name: 'Québec City Jean Lesage International Airport',
  iata_code: 'YQB',
  icao_code: 'CYQB',
  city: 'Québec City',
  country: 'Canada',
  country_code: 'CA',
  timezone: 'America/Toronto',
  latitude: 46.7911,
  longitude: -71.3933,
  website: 'https://www.aeroportdequebec.com',
  is_active: true,
}).select('id').single();
if (yqbErr) { console.error('Airport error:', yqbErr.message); }
else {
  console.log(`AIRPORT CREATED: YQB → ${yqbRow.id}`);
  const YQB_ID = yqbRow.id;

  // VIP Lounge by Club Med — CLOSED
  const vipId = await insertLounge({
    airport_id: YQB_ID,
    name: 'V.I.P. Lounge by Club Med',
    slug: 'vip-lounge-club-med-yqb',
    terminal: 'Main Terminal',
    location_detail: 'Main Terminal, 2nd Floor — between the two escalators after security, entrance on the left-hand side, airside',
    website: 'https://www.aeroportdequebec.com/en/faq/vip-lounge',
    guest_fee: 47, guest_fee_currency: 'CAD', is_active: false,
    opening_hours: {
      monday: null, tuesday: null, wednesday: null, thursday: null,
      friday: null, saturday: null, sunday: null,
      notes: '⚠️ TEMPORARILY CLOSED since August 3, 2025 for complete renovation. No confirmed reopening date. When open: Daily 4:00 AM – 6:00 PM. Entry via self-serve scan (Priority Pass QR code required — physical cards NOT accepted).',
    },
    description: `<p>The V.I.P. Lounge by Club Med was the sole airport lounge at Québec City Jean Lesage International Airport from its opening in December 2021 until its temporary closure on August 3, 2025. Located on the 2nd floor between the two escalators after the security checkpoint, the lounge was recognized as a standout regional airport lounge — notably ranked #1 in North America in its Priority Pass category. Its open-concept design, fireplace, runway and Mount Bélair views, made-to-order breakfast service with custom omelets, and table service by Québec City caterer Nourcy set it apart from typical airport lounges in smaller Canadian markets.</p>
<p>Entry was self-serve via digital scanning — no staff stationed at the door — with Priority Pass members required to use the app's QR code rather than a physical card. The lounge closed August 3, 2025 for a complete overhaul of the product offering, with no official reopening date confirmed as of June 2026. YQB is replacing its lounge ecosystem with a new independent lounge near Gates 29–30 and a new Air Canada Café, both expected to open Summer 2026. Check aeroportdequebec.com for the latest updates.</p>`,
    access_types: [
      { name: 'Priority Pass (QR code via app only)', type: 'membership', details: 'Physical Priority Pass cards NOT accepted — must present QR code from Priority Pass app' },
      { name: 'LoungeKey', type: 'membership', details: 'LoungeKey members' },
      { name: 'DragonPass', type: 'membership', details: 'DragonPass members' },
      { name: 'American Express Platinum', type: 'credit_card', details: 'Amex Platinum cardholders' },
      { name: 'Air Canada Business Class', type: 'class_of_service', details: 'Air Canada Business Class passengers' },
      { name: 'Aeroplan Elite 50K / 75K / Super Elite', type: 'airline_status', details: 'Aeroplan Elite 50K and above' },
    ],
  });
  if (vipId) await setAmenities(vipId, ['wifi','snacks','bar','hotfood','coffee','tv','flight_screens','quiet','meeting_rooms']);

  // New YQB Independent Lounge — Opening Summer 2026
  const newYqbId = await insertLounge({
    airport_id: YQB_ID,
    name: 'YQB Independent Lounge',
    slug: 'qqb-independent-lounge-yqb',
    terminal: 'Main Terminal',
    location_detail: 'Main Terminal, airside — near Gates 29 and 30, behind the Lobbie bar by Blaxton restaurant, after security',
    website: 'https://www.aeroportdequebec.com',
    guest_fee: null, guest_fee_currency: 'CAD', capacity: 100, is_active: false,
    opening_hours: {
      monday: null, tuesday: null, wednesday: null, thursday: null,
      friday: null, saturday: null, sunday: null,
      notes: '⚠️ Opening Summer 2026 — hours and pricing TBA. Pre-purchase day passes via aeroportdequebec.com for a discounted rate. Full bar (beer, wine, spirits, soft drinks) available at all hours. Open to all passengers via paid day pass regardless of airline or class.',
    },
    description: `<p>Announced in December 2025 and slated to open Summer 2026, the new YQB Independent Lounge is located airside near Gates 29 and 30, immediately behind the new Lobbie bar by Blaxton restaurant. The concept is designed to replace and upgrade the experience previously provided by the V.I.P. Lounge by Club Med, which closed in August 2025. Seating approximately 100 guests, the lounge features an open-concept layout with abundant natural light, a fireplace, and a design philosophy explicitly tailored to vacationers — appropriate for YQB's strong leisure and sun-destination traveler base.</p>
<p>Access will be available through day passes purchased on the YQB website at a discounted pre-book rate, through travel agents, or at the lounge door on the day of travel. A full bar with beer, wine, spirits, and soft drinks at all hours is a confirmed feature. Integration with membership programs such as Priority Pass and DragonPass has not been announced as of June 2026. Full details on hours, pricing, and access will be published on aeroportdequebec.com ahead of the official opening.</p>`,
    access_types: [
      { name: 'Paid Day Pass (all passengers)', type: 'membership', details: 'Any departing passenger regardless of airline or class. Pre-book via aeroportdequebec.com for discounted rate; walk-in also available. Pricing TBA.' },
    ],
  });
  if (newYqbId) await setAmenities(newYqbId, ['wifi','snacks','bar','hotfood','coffee','tv','charging','quiet']);

  // Air Canada Café — YQB (Opening Summer 2026)
  const acCafeYqbId = await insertLounge({
    airport_id: YQB_ID,
    name: 'Air Canada Café',
    slug: 'ac-cafe-yqb',
    terminal: 'Main Terminal',
    location_detail: 'Main Terminal, Domestic departures, airside — after security checkpoint; exact gate location TBA',
    website: 'https://www.aircanada.com/ca/en/aco/home/fly/airport-experience/lounges.html',
    guest_fee: null, guest_fee_currency: 'CAD', is_active: false,
    opening_hours: {
      monday: null, tuesday: null, wednesday: null, thursday: null,
      friday: null, saturday: null, sunday: null,
      notes: '⚠️ Opening Summer 2026 — hours TBA. Expected to follow standard Air Canada Café access model. No showers (standard for AC Café format). Domestic flights only (expected).',
    },
    description: `<p>The Air Canada Café coming to Québec City Jean Lesage International Airport in Summer 2026 marks the return of an Air Canada lounge presence to YQB — a city that previously had an Air Canada Maple Leaf Lounge before its closure. Announced by YQB in December 2025 as part of a three-concept commercial expansion (alongside the new independent lounge near Gates 29–30 and the Lobbie bar), the Café follows the Air Canada Café brand established at Billy Bishop (YTZ) and Montréal-Trudeau (YUL).</p>
<p>Expect Lavazza specialty coffee, curated grab-and-go and light food options, a clean modern bistro aesthetic, and access restricted to Air Canada Business Class passengers, Aeroplan Elite members (50K and above), Star Alliance Gold members, and select Aeroplan premium credit card holders. No walk-in paid access is expected based on the standard AC Café model. Full details on hours, exact location, and access rules will be published by Air Canada and YQB ahead of the Summer 2026 opening.</p>`,
    access_types: [
      { name: 'Air Canada Business Class', type: 'class_of_service', details: 'Business Class passengers on Air Canada domestic flights from YQB' },
      { name: 'Aeroplan Elite 50K / 75K / Super Elite 100K', type: 'airline_status', details: 'Aeroplan Elite 50K and above on eligible Air Canada flights' },
      { name: 'Star Alliance Gold', type: 'airline_status', details: 'Star Alliance Gold members on eligible same-day Air Canada flight' },
      { name: 'Eligible Aeroplan Premium Credit Cards', type: 'credit_card', details: 'Select TD and CIBC Aeroplan Visa Infinite Privilege cardholders' },
    ],
  });
  if (acCafeYqbId) await setAmenities(acCafeYqbId, ['wifi','snacks','coffee','tv','charging','quiet']);
}

console.log('\n✓ YQB complete.\n');
console.log('═══ ALL DONE ═══');
console.log('YYC hero URL:', yyc_hero_url || '(upload failed — update manually)');
