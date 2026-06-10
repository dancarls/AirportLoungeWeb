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
  meeting_rooms:  '554cae8d-8678-4498-a774-aec987ede191',
  business_centre:'6c0c90da-0bab-4b33-87bb-dfa879c07d9c',
  charging:       '9ff17629-9424-447c-8972-cd29b414b9c2',
  kids_area:      'dca6544c-ff43-490a-b9e7-a498c9181926',
  printing:       '131aad96-7eb3-4620-ac69-071db404d652',
  spa:            '655af7e7-1323-47fa-9978-ec725fbd3e6e',
};

async function setAmenities(loungeId, keys) {
  await sb.from('lounge_amenities').delete().eq('lounge_id', loungeId);
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

async function insertAirport(data) {
  const { data: row, error } = await sb.from('airports').insert(data).select('id').single();
  if (error) { console.error('  AIRPORT ERROR:', data.name, error.message); return null; }
  console.log(`AIRPORT CREATED: ${data.name} → ${row.id}`);
  return row.id;
}

const AC_WEBSITE = 'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges.html';

// ════════════════════════════════════════════════════════════════════
// PART 1 — FIX YYZ ISSUES
// ════════════════════════════════════════════════════════════════════

console.log('\n═══ YYZ FIXES ═══\n');

// Fix 1: Plaza Premium T1 International — permanently closed Dec 27, 2025
const PP_T1_INT_ID = '32f8b13a-d4f9-4de5-8e72-9fbba7eef435';
await updateLounge(PP_T1_INT_ID, {
  is_active: false,
  opening_hours: {
    monday: null, tuesday: null, wednesday: null, thursday: null,
    friday: null, saturday: null, sunday: null,
    notes: 'PERMANENTLY CLOSED as of December 27, 2025 for full reconstruction. No reopening date confirmed. Check plazapremiumlounge.com for updates.',
  },
  description: `<p>The Plaza Premium Lounge (International) in Terminal 1, previously located near Gate E77 on Level 2, permanently closed on December 27, 2025 for full reconstruction. No confirmed reopening date has been announced as of June 2026.</p>
<p>Travelers who previously used this lounge through Priority Pass, DragonPass, or the American Express Platinum card should note that Terminal 1 international departures are now without an independent lounge option in this zone. The Air Canada Maple Leaf Lounge (International) near the F gates remains available for eligible Air Canada and Star Alliance passengers. Check the Plaza Premium website for reopening updates before your visit.</p>`,
});
console.log('  Plaza Premium T1 International marked permanently closed.');

// Fix 2: Signature Suite — remove shower (no dedicated showers inside Suite)
const SIG_ID = '5e370be4-acf3-4d12-b49b-095028214307';
await setAmenities(SIG_ID, ['wifi','bar','hotfood','coffee','spa','quiet','newspapers','tv','charging']);
console.log('  Signature Suite shower amenity removed (showers are in adjacent MLL, not Suite itself).');

// ════════════════════════════════════════════════════════════════════
// PART 2 — UPDATE EXISTING YTZ / YWG / YOW LOUNGES
// ════════════════════════════════════════════════════════════════════

console.log('\n═══ UPDATING EXISTING LOUNGES ═══\n');

// YTZ — Air Canada Café → Aspire | Air Canada Café
const YTZ_CAFE_ID = '03f2ebbf-f4ca-4037-b988-87ef0f743a23';
await updateLounge(YTZ_CAFE_ID, {
  name: 'Aspire | Air Canada Café',
  slug: 'aspire-ac-cafe-ytz',
  terminal: 'Domestic Terminal',
  location_detail: 'Domestic Terminal, airside — after security, take escalator up; lounge is between Door A and the washrooms on the right',
  website: 'https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges.html',
  guest_fee: 50,
  guest_fee_currency: 'CAD',
  capacity: 133,
  opening_hours: {
    monday:'06:30-20:00', tuesday:'06:30-20:00', wednesday:'06:30-20:00',
    thursday:'06:30-20:00', friday:'06:30-20:00', saturday:'06:30-20:00', sunday:'06:30-20:00',
    notes: 'Open daily 6:30 AM – 8:00 PM. No showers. Priority Pass limited to 3-hour stay. Access permitted from 3 hours prior to departure. Children under 2 free.',
  },
  description: `<p>Opened June 1, 2023, the Aspire | Air Canada Café at Billy Bishop Toronto City Airport is a partnership between Air Canada and Aspire — Swissport's premium global lounge brand — and is the only formal lounge at YTZ. It marked Air Canada's 27th lounge location and stands out as the first LEED-certified lounge in the Aspire network, built to LEED ID+C standards using locally sourced materials and sustainable practices throughout.</p>
<p>The 133-seat lounge is more generous in scope than most domestic-airport lounges, offering lie-flat sofas with pillows, private booth-style nooks, traditional dining tables, armchairs, a private meeting room for six, and a business desk. The food and beverage program is the headline: a fully rotating hot and cold buffet spanning breakfast, lunch, and dinner, paired with a complimentary bar stocked with Ontario wine, craft beer, spirits, cocktails, and specialty coffee. Complimentary luggage storage is also available inside. Unlike the standard Air Canada Café format at other airports, this location accepts Priority Pass, DragonPass, and Amex Platinum — and is open to any domestic passenger regardless of airline for a walk-in day pass of approximately $50 CAD, making it the most open lounge at Billy Bishop by far.</p>`,
  access_types: [
    { name: 'Priority Pass', type: 'membership', details: 'Priority Pass members — maximum 3-hour stay per visit' },
    { name: 'DragonPass (Visa Airport Companion)', type: 'membership', details: 'DragonPass and Visa Airport Companion Program members' },
    { name: 'LoungeKey', type: 'membership', details: 'LoungeKey members' },
    { name: 'American Express Platinum', type: 'credit_card', details: 'Complimentary access for Amex Platinum cardholders' },
    { name: 'Aeroplan Elite 50K / 75K / Super Elite 100K', type: 'airline_status', details: 'Aeroplan Elite 50K and above on eligible Air Canada domestic flights from YTZ' },
    { name: 'Air Canada Business Class', type: 'class_of_service', details: 'Business Class passengers connecting on Air Canada domestic routes through YTZ' },
    { name: 'Star Alliance Gold', type: 'airline_status', details: 'Star Alliance Gold members on eligible same-day Air Canada flight' },
    { name: 'Aeroplan Premium Credit Cards', type: 'credit_card', details: 'Eligible TD and CIBC Aeroplan Visa Infinite Privilege cardholders' },
    { name: 'Paid Day Pass (~$50 CAD)', type: 'membership', details: 'Any domestic departing passenger regardless of airline — walk-in or pre-book online' },
  ],
});
await setAmenities(YTZ_CAFE_ID, ['wifi','snacks','bar','hotfood','coffee','tv','business_centre','charging','quiet','kids_area','meeting_rooms']);

// YWG — Air Canada Maple Leaf Lounge
const YWG_MLL_ID = '30a1a2bb-07e2-4a13-bd94-754fe969f904';
await updateLounge(YWG_MLL_ID, {
  location_detail: 'Main Terminal, Domestic and International departures, concourse level — opposite Gate 9, turn left immediately after clearing security, airside',
  terminal: 'Main Terminal',
  website: AC_WEBSITE,
  capacity: null,
  opening_hours: {
    monday:'04:00-19:30', tuesday:'04:00-19:30', wednesday:'04:00-19:30',
    thursday:'04:00-19:30', friday:'04:00-19:30', saturday:'04:00-18:15', sunday:'04:00-19:30',
    notes: 'Sun–Fri 4:00 AM – 7:30 PM; Sat 4:00 AM – 6:15 PM. No showers. US transborder passengers are not eligible. Cell-phone-free quiet zone available.',
  },
  description: `<p>The Air Canada Maple Leaf Lounge at Winnipeg James Armstrong Richardson International Airport is located on the concourse level directly opposite Gate 9 — a short left turn from the security checkpoint after entering the departure hall. It serves both domestic and international departing passengers, a step up from some smaller-market Maple Leaf Lounges, but is expressly not available to travelers on US-bound transborder flights, who have no dedicated lounge access at YWG.</p>
<p>The space captures the warmth and hospitality of Manitoba, with comfortable seating clusters, large windows providing natural light, and a buffet that highlights Canadian flavours including wraps, pasta salads, cut vegetables, and fruit platters alongside a self-serve bar with wine, beer, and coffee. A full business centre offers computers, printers, fax, and workstations for corporate travelers. A dedicated cell-phone-free quiet zone is one of the lounge's more appreciated features among frequent visitors seeking genuine calm. Showers are not available at this location. Access is open to Air Canada Business Class and Premium Rouge passengers, Aeroplan Elite members (35K and above), Star Alliance Gold travelers on eligible flights, United Club members, Maple Leaf Club members, and select premium Aeroplan cardholders — but no Priority Pass or DragonPass.</p>`,
  access_types: [
    { name: 'Air Canada Business Class / Premium Rouge', type: 'class_of_service', details: 'Business Class and Premium Rouge passengers on Air Canada domestic and international flights' },
    { name: 'Aeroplan Elite 35K / 50K / 75K / Super Elite 100K', type: 'airline_status', details: 'All Aeroplan Elite tiers on eligible Air Canada flights' },
    { name: 'Star Alliance Gold', type: 'airline_status', details: 'Star Alliance Gold members on eligible same-day Air Canada domestic or international flight (not transborder)' },
    { name: 'United Club Membership', type: 'membership', details: 'United Club members on eligible Air Canada flights — domestic and international only' },
    { name: 'Air Canada Maple Leaf Club', type: 'membership', details: 'Annual Maple Leaf Club membership holders' },
    { name: 'TD Aeroplan Visa Infinite Privilege', type: 'credit_card', details: 'Primary cardholders and one guest' },
    { name: 'CIBC Aeroplan Visa Infinite Privilege', type: 'credit_card', details: 'Primary cardholders and one guest' },
    { name: 'Amex Aeroplan Reserve Card', type: 'credit_card', details: 'Primary cardholders on eligible same-day Air Canada flight' },
  ],
  guest_fee: 30,
});
await setAmenities(YWG_MLL_ID, ['wifi','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','business_centre','charging','quiet']);

// YOW — Air Canada Maple Leaf Lounge
const YOW_MLL_ID = '3a34002c-9a08-4894-babf-39adcc66b0db';
await updateLounge(YOW_MLL_ID, {
  location_detail: 'Main Terminal, Domestic departures, Level 2 — between Gates 17 and 18; take elevator or stairs after security, follow signs toward Gate 18, entrance on left',
  terminal: 'Main Terminal',
  website: AC_WEBSITE,
  capacity: null,
  opening_hours: {
    monday:'04:30-19:30', tuesday:'04:30-18:30', wednesday:'04:30-18:30',
    thursday:'04:30-18:30', friday:'04:30-18:30', saturday:'04:30-18:30', sunday:'04:30-19:30',
    notes: 'Tue–Sat 4:30 AM – 6:30 PM; Sun–Mon 4:30 AM – 7:30 PM. Showers available. US transborder passengers not eligible. Directly opposite Aspire Salon Lounge.',
  },
  description: `<p>The Air Canada Maple Leaf Lounge at Ottawa Macdonald-Cartier International Airport occupies Level 2 of the main terminal, accessed via elevator or staircase from the departure concourse after clearing security. Situated between Gates 17 and 18, it is a fitting lounge for the nation's capital — a steady mix of government officials, diplomatic staff, lobbyists, and frequent business flyers make up much of the traffic. It sits directly across from the Aspire Salon Lounge, forming one of the more convenient side-by-side lounge pairings at a Canadian regional airport.</p>
<p>The layout offers a dining area to the left on entry, a sweeping window-side seating bank in the centre with tarmac views, and a private business centre with workstations and printers to the right. Showers are available — a notable distinction from the Saskatoon and Regina Maple Leaf Lounges. The food program leans toward lighter bites with regional touches, paired with a self-serve bar offering wine, beer, and spirits. TVs cycle CTV News, while PressReader provides complimentary access to newspapers and magazines. Hours vary by day of week: the lounge closes earlier Tuesday through Saturday than it does on Sundays and Mondays. US transborder passengers departing YOW cannot access this lounge.</p>`,
  access_types: [
    { name: 'Air Canada Business Class / Premium Rouge', type: 'class_of_service', details: 'Business Class and Premium Rouge passengers on domestic and international Air Canada flights' },
    { name: 'Aeroplan Elite 35K / 50K / 75K / Super Elite 100K', type: 'airline_status', details: 'All Aeroplan Elite tiers on eligible Air Canada flights' },
    { name: 'Star Alliance Gold', type: 'airline_status', details: 'Star Alliance Gold members on eligible same-day Air Canada domestic or international flight' },
    { name: 'Air Canada Maple Leaf Club', type: 'membership', details: 'Annual Maple Leaf Club membership holders' },
    { name: 'TD Aeroplan Visa Infinite Privilege', type: 'credit_card', details: 'Primary cardholders and one guest' },
    { name: 'CIBC Aeroplan Visa Infinite Privilege', type: 'credit_card', details: 'Primary cardholders and one guest' },
    { name: 'Amex Aeroplan Reserve Card', type: 'credit_card', details: 'Primary cardholders on eligible same-day Air Canada flight' },
    { name: 'Paid Day Pass', type: 'membership', details: 'Latitude ($25 CAD), Comfort ($40 CAD), or Flex ($50 CAD) fare add-on. Maple Leaf Club annual membership from $375 CAD.' },
  ],
  guest_fee: 30,
});
await setAmenities(YOW_MLL_ID, ['wifi','shower','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','business_centre','charging','quiet']);

console.log('\n✓ YYZ fixes and existing lounge updates complete.\n');

// ════════════════════════════════════════════════════════════════════
// PART 3 — CREATE AIRPORTS: YXE & YQR
// ════════════════════════════════════════════════════════════════════

console.log('═══ CREATING AIRPORTS ═══\n');

const yxeId = await insertAirport({
  name: 'Saskatoon John G. Diefenbaker International Airport',
  iata_code: 'YXE',
  icao_code: 'CYXE',
  city: 'Saskatoon',
  country: 'Canada',
  country_code: 'CA',
  timezone: 'America/Regina',
  latitude: 52.170834,
  longitude: -106.699997,
  website: 'https://www.skyxe.ca',
  is_active: true,
});

const yqrId = await insertAirport({
  name: 'Regina International Airport',
  iata_code: 'YQR',
  icao_code: 'CYQR',
  city: 'Regina',
  country: 'Canada',
  country_code: 'CA',
  timezone: 'America/Regina',
  latitude: 50.432098,
  longitude: -104.666000,
  website: 'https://www.yqr.ca',
  is_active: true,
});

// ════════════════════════════════════════════════════════════════════
// PART 4 — INSERT 4 NEW LOUNGES
// ════════════════════════════════════════════════════════════════════

console.log('\n═══ INSERTING NEW LOUNGES ═══\n');

// YXE — Air Canada Maple Leaf Lounge
if (yxeId) {
  const yxeId_ = await insertLounge({
    airport_id: yxeId,
    name: 'Air Canada Maple Leaf Lounge',
    slug: 'ac-maple-leaf-lounge-yxe',
    terminal: 'Main Terminal',
    location_detail: 'Main Terminal, Domestic departures, main level — between Gates 5 and 6, adjacent to Tim Hortons, airside (after security)',
    website: AC_WEBSITE,
    phone: '1-888-247-2262',
    guest_fee: null,
    guest_fee_currency: 'CAD',
    capacity: 40,
    is_active: true,
    opening_hours: {
      monday:'04:00-18:30', tuesday:'04:00-18:30', wednesday:'04:00-18:30',
      thursday:'04:00-18:30', friday:'04:00-18:30', saturday:'04:00-18:30', sunday:'04:00-18:30',
      notes: 'Open daily 4:00 AM – 6:30 PM. Showers available. No Priority Pass or DragonPass — Air Canada / Maple Leaf Club access only. No private washroom inside lounge.',
    },
    description: `<p>Tucked between Gates 5 and 6 in the domestic departures area of Saskatoon's John G. Diefenbaker International Airport — right next to the Tim Hortons — the Air Canada Maple Leaf Lounge at YXE is a compact but thoughtfully designed prairie retreat. Seating approximately 40 guests, it offers floor-to-ceiling windows that flood the space with natural light and provide sweeping views of the tarmac and taxiways, making it a surprisingly serene spot for a regional airport lounge.</p>
<p>The interior draws on Saskatchewan's identity, with maple wood screen walls and original artwork by local Saskatchewan artists creating a warm, regional character that sets it apart from generic airport lounges. A curated light buffet provides snacks, hot food, and specialty Lavazza coffee alongside a self-serve bar with spirits, beer, and wine. A business centre with computers, printers, and charging stations serves corporate travelers. Showers are available — a notable amenity for a regional airport of this size. Access is restricted to Air Canada premium passengers, eligible Aeroplan Elite and credit card holders, and Maple Leaf Club members. Priority Pass and DragonPass are not accepted, and there is no walk-in day pass at the door. Note that there is no dedicated washroom inside the lounge; guests use the public restrooms in the terminal.</p>`,
    access_types: [
      { name: 'Air Canada Business Class / Premium Rouge', type: 'class_of_service', details: 'Business Class and Premium Rouge passengers on domestic Air Canada flights' },
      { name: 'Aeroplan Elite 35K / 50K / 75K / Super Elite 100K', type: 'airline_status', details: 'All Aeroplan Elite tiers on eligible Air Canada flights from YXE' },
      { name: 'Star Alliance Gold', type: 'airline_status', details: 'Star Alliance Gold members on eligible same-day Air Canada flight' },
      { name: 'Air Canada Maple Leaf Club', type: 'membership', details: 'Annual Maple Leaf Club membership — from $375 CAD per year' },
      { name: 'TD Aeroplan Visa Infinite Privilege', type: 'credit_card', details: 'Primary cardholders' },
      { name: 'CIBC Aeroplan Visa Infinite Privilege', type: 'credit_card', details: 'Primary cardholders' },
      { name: 'Amex Aeroplan Reserve Card', type: 'credit_card', details: 'Primary cardholders on eligible same-day Air Canada flight' },
      { name: 'Paid Day Pass (fare add-on)', type: 'membership', details: 'Available via Latitude ($25), Comfort ($40), or Flex ($50) fare add-on at time of booking' },
    ],
  });
  if (yxeId_) await setAmenities(yxeId_, ['wifi','shower','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','business_centre','charging','quiet']);
}

// YQR — Air Canada Maple Leaf Lounge
if (yqrId) {
  const yqrId_ = await insertLounge({
    airport_id: yqrId,
    name: 'Air Canada Maple Leaf Lounge',
    slug: 'ac-maple-leaf-lounge-yqr',
    terminal: 'Main Terminal',
    location_detail: 'Main Terminal, Domestic departures, Level 1 — between Gates 4 and 5, directly across from the 306 Bistro and Bar, airside (after security)',
    website: AC_WEBSITE,
    phone: '1-888-247-2262',
    guest_fee: null,
    guest_fee_currency: 'CAD',
    capacity: 20,
    is_active: true,
    opening_hours: {
      monday:'05:00-18:15', tuesday:'05:00-18:15', wednesday:'05:00-18:15',
      thursday:'05:00-18:15', friday:'05:00-18:15', saturday:'05:00-18:15', sunday:'05:00-18:15',
      notes: 'Open daily 5:00 AM – 6:15 PM. No showers. No dedicated washroom inside lounge. Entry via self-serve boarding pass scanner — no staffed reception. No Priority Pass or DragonPass.',
    },
    description: `<p>The Air Canada Maple Leaf Lounge at Regina International Airport holds a notable distinction: it is the smallest lounge in Air Canada's entire Maple Leaf network. Tucked between Gates 4 and 5 on Level 1 of the main terminal — directly across from the 306 Bistro and Bar — it seats just 20 guests across 16 brown couches and two high-top tables with red leather chairs. Entry is managed via a self-serve boarding pass scanner at the door, a distinctive feature for an Air Canada property with no staffed reception counter.</p>
<p>Despite its compact footprint, the lounge delivers the essentials expected of a Maple Leaf location: complimentary Wi-Fi, a rotating buffet with hot and cold food (eggs, bagels, yogurt, fruit, and snacks), a self-serve bar with draft beer taps and spirits (closed during early morning), TVs, newspapers, magazines, and workstations with printers. Showers are not available, and there is no dedicated washroom inside the lounge — guests use the public restrooms in the terminal. Access mirrors the broader Maple Leaf network — Air Canada Business Class, Aeroplan Elite members (35K and above), Star Alliance Gold travelers on same-day flights, Maple Leaf Club members, and eligible premium Aeroplan cardholders. Priority Pass and DragonPass are not accepted. For Regina travelers, this is the only airport lounge in the building.</p>`,
    access_types: [
      { name: 'Air Canada Business Class / Premium Rouge', type: 'class_of_service', details: 'Business Class and Premium Rouge passengers on domestic Air Canada flights' },
      { name: 'Aeroplan Elite 35K / 50K / 75K / Super Elite 100K', type: 'airline_status', details: 'All Aeroplan Elite tiers on eligible Air Canada flights from YQR' },
      { name: 'Star Alliance Gold', type: 'airline_status', details: 'Star Alliance Gold members on eligible same-day Air Canada flight' },
      { name: 'Air Canada Maple Leaf Club', type: 'membership', details: 'Annual Maple Leaf Club membership' },
      { name: 'Amex Aeroplan Reserve Card', type: 'credit_card', details: 'Primary cardholders on eligible same-day Air Canada flight' },
      { name: 'TD / CIBC Aeroplan Business Cards', type: 'credit_card', details: 'One-time guest pass per eligible cardholder' },
      { name: 'Paid Day Pass (fare add-on)', type: 'membership', details: 'Available via Latitude ($25), Comfort ($40), or Flex ($50) fare add-on at time of booking' },
    ],
  });
  if (yqrId_) await setAmenities(yqrId_, ['wifi','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','business_centre','charging','quiet']);
}

// YWG — Plaza Premium Lounge (new)
const YWG_AIRPORT_ID = '12ec4554-7a92-4566-91e4-5d779737e284';
const ppYwgId = await insertLounge({
  airport_id: YWG_AIRPORT_ID,
  name: 'Plaza Premium Lounge',
  slug: 'plaza-premium-lounge-ywg',
  terminal: 'Main Terminal',
  location_detail: 'Main Terminal, Domestic and International departures, concourse level — opposite Gate 6, airside (after security)',
  website: 'https://www.plazapremiumlounge.com/en-uk/find/americas/canada/winnipeg/winnipeg-james-armstrong-richardson-international-airport',
  phone: '1-204-691-7930',
  email: 'loungeywg@plazapremiumgroup.com',
  guest_fee: 50,
  guest_fee_currency: 'CAD',
  capacity: null,
  is_active: true,
  opening_hours: {
    monday:'05:00-20:00', tuesday:'05:00-20:00', wednesday:'05:00-20:00',
    thursday:'05:00-20:00', friday:'05:00-20:00', saturday:'05:00-20:00', sunday:'05:00-20:00',
    notes: 'Open daily 5:00 AM – 8:00 PM. No showers. US transborder passengers not eligible. Draft beer available from 9:00 AM. Priority Pass maximum 3-hour stay. Walk-in day pass from $50 CAD.',
  },
  description: `<p>Located airside directly opposite Gate 6 in Winnipeg Richardson International Airport's Domestic and International Departures area, the Plaza Premium Lounge is Winnipeg's only open-access independent lounge — welcoming any traveler regardless of airline or ticket class through Priority Pass, DragonPass, LoungeKey, or a walk-in day pass starting at $50 CAD. It was the first independent pay-per-use lounge at Winnipeg airport, filling the gap for the many YWG passengers who fly on WestJet, Flair, or other non-Air Canada carriers without status-based lounge access.</p>
<p>The lounge has been curated to reflect Manitoba's culinary identity, with rotating menu items including butter tarts, smoked salmon canapés, and poutine alongside the standard hot and cold buffet. Draft beer and house wine are available from 9 AM, with premium spirits offered at an additional charge. Business travelers are served by computer workstations, internet terminals, TVs, fax, and flight information monitors. Like the Maple Leaf Lounge across the concourse, the Plaza Premium at YWG does not serve US transborder passengers — both lounges are restricted to domestic and international flights only. Pre-booking online is recommended; Priority Pass visits are limited to a 3-hour complimentary stay per visit.</p>`,
  access_types: [
    { name: 'Priority Pass', type: 'membership', details: 'Priority Pass members — maximum 3-hour stay per visit. Domestic and international flights only.' },
    { name: 'DragonPass (Visa Airport Companion)', type: 'membership', details: 'DragonPass and Visa Airport Companion Program members' },
    { name: 'LoungeKey / Mastercard Airport Experiences', type: 'membership', details: 'LoungeKey and Mastercard Airport Experiences members' },
    { name: 'Diners Club', type: 'membership', details: 'Eligible Diners Club cardholders' },
    { name: 'Paid Day Pass (from $50 CAD)', type: 'membership', details: 'Walk-in from $50 CAD or pre-book online for 3 or 6-hour access. Children under 2 free.' },
  ],
});
if (ppYwgId) await setAmenities(ppYwgId, ['wifi','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','business_centre','charging','quiet']);

// YOW — Aspire Salon Lounge (new)
const YOW_AIRPORT_ID = 'f3a410c9-3c65-4ec2-8adf-d59278852433';
const aspireYowId = await insertLounge({
  airport_id: YOW_AIRPORT_ID,
  name: 'Aspire Salon Lounge',
  slug: 'aspire-salon-lounge-yow',
  terminal: 'Main Terminal',
  location_detail: 'Main Terminal, Domestic and International departures, Level 2 — to the right of Gate 18; entrance immediately left after Gate 18, follow signs toward Gate 20, directly opposite Maple Leaf Lounge, airside',
  website: 'https://www.prioritypass.com/en-GB/lounges/canada/ottawa-macdonald-cartier-international/yow2-aspire-salon-lounge',
  guest_fee: 70,
  guest_fee_currency: 'CAD',
  capacity: null,
  is_active: true,
  opening_hours: {
    monday:'05:00-20:00', tuesday:'05:00-20:00', wednesday:'05:00-20:00',
    thursday:'05:00-20:00', friday:'05:00-20:00', saturday:'10:00-18:00', sunday:'10:00-18:00',
    notes: 'Mon–Fri 5:00 AM – 8:00 PM; Sat–Sun 10:00 AM – 6:00 PM. No showers. US transborder passengers not eligible. Pre-booking a 2-hour pass recommended (~CA$69.68 via Expedia or Aspire direct). Max stay 3 hours (Priority Pass).',
  },
  description: `<p>The Aspire Salon Lounge at Ottawa Macdonald-Cartier International Airport sits on Level 2 of the main terminal, to the right of Gate 18, and is directly opposite the Air Canada Maple Leaf Lounge — forming one of the more convenient side-by-side lounge pairings at a Canadian regional airport. As the only independent open-access lounge at YOW, it serves passengers on any airline or ticket class through Priority Pass, DragonPass, or a walk-in day pass, which is particularly valuable for the many travelers arriving at Canada's federal capital on non-Air Canada carriers.</p>
<p>The Aspire Salon delivers a modern, airy interior with hot and cold meal options, plant-based and vegetarian choices, and a complimentary bar of alcoholic and non-alcoholic beverages. Unlike the Maple Leaf Lounge adjacent to it, the Aspire Salon operates significantly reduced weekend hours — opening at 10:00 AM on Saturdays and Sundays versus 5:00 AM on weekdays, making it unavailable to early weekend morning departures. Complimentary Wi-Fi, workstations, flight information monitors, and luggage storage are all available; printers and conference facilities carry an additional charge. Like the Maple Leaf Lounge, the Aspire Salon is restricted to domestic and international departures — US transborder passengers from YOW are not eligible. Full disabled access is confirmed.</p>`,
  access_types: [
    { name: 'Priority Pass', type: 'membership', details: 'Priority Pass members — maximum 3-hour stay per visit. Domestic and international flights only.' },
    { name: 'DragonPass (Visa Airport Companion)', type: 'membership', details: 'DragonPass and Visa Airport Companion Program members' },
    { name: 'LoungeKey / DreamFolks', type: 'membership', details: 'LoungeKey and DreamFolks membership holders' },
    { name: 'American Express Platinum', type: 'credit_card', details: 'Complimentary access for Amex Platinum cardholders' },
    { name: 'Paid Day Pass (~$50–$70 CAD)', type: 'membership', details: 'Pre-book 2-hour pass via Expedia or Aspire website (~CA$69.68). Walk-in also available subject to capacity. Children under 2 free.' },
  ],
});
if (aspireYowId) await setAmenities(aspireYowId, ['wifi','snacks','bar','hotfood','coffee','tv','flight_screens','newspapers','charging','quiet','kids_area','wheelchair']);

console.log('\n✓ All new lounges inserted.\n');
console.log('═══ COMPLETE ═══\n');
console.log('Summary:');
console.log('  - YYZ Plaza Premium T1 International: marked permanently closed');
console.log('  - YYZ Signature Suite: shower removed (no dedicated showers in Suite)');
console.log('  - YTZ Aspire | AC Café: updated with full data, slug updated');
console.log('  - YWG AC MLL: updated with full data');
console.log('  - YOW AC MLL: updated with full data');
console.log('  - Airports created: YXE, YQR');
console.log('  - New lounges: YXE MLL, YQR MLL, YWG Plaza Premium, YOW Aspire Salon');
