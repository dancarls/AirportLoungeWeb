/**
 * Updates YTZ Aspire | Air Canada Café and YQB lounges with corrected content.
 * Run: node --env-file=.env.local scripts/update-ytz-yqb.mjs
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://ixgbdmrembkrpbkjhtfi.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
)

// ── YTZ Airport ID ─────────────────────────────────────────
const YTZ_ID = 'd783b75a-7455-411b-96c0-abef2e67e4dd'
// ── YQB Airport ID ────────────────────────────────────────
const YQB_ID = 'e326152e-3d9b-4c04-956a-cf052bec748c'

// ── 1. YTZ — Aspire | Air Canada Café ───────────────────────
console.log('\n── YTZ: Updating Aspire | Air Canada Café ──')

const { data: ytzLounge } = await sb
  .from('lounges')
  .select('id, name, slug')
  .eq('airport_id', YTZ_ID)
  .ilike('name', '%aspire%')
  .single()

if (!ytzLounge) {
  console.error('Could not find Aspire lounge at YTZ')
} else {
  console.log(`Found: ${ytzLounge.name} (${ytzLounge.id})`)

  const { error } = await sb.from('lounges').update({
    name: 'Aspire | Air Canada Café',
    terminal: 'Main',
    location_detail: 'Airside — after security, up the escalator to passenger terminal; turn right between Door A and the washrooms',
    is_active: true,
    opening_hours: {
      monday: '06:30-20:00',
      tuesday: '06:30-20:00',
      wednesday: '06:30-20:00',
      thursday: '06:30-20:00',
      friday: '06:30-20:00',
      saturday: '06:30-20:00',
      sunday: '06:30-20:00',
      notes: 'Hours subject to change based on flight schedules. Access from 3 hours prior to departure. Priority Pass and DragonPass holders have a 3-hour maximum stay.',
    },
    guest_fee: 50,
    guest_fee_currency: 'CAD',
    access_types: [
      { name: 'Priority Pass', type: 'membership', details: '3-hour maximum stay per visit' },
      { name: 'DragonPass', type: 'membership', details: '3-hour maximum stay per visit' },
      { name: 'LoungeKey', type: 'membership' },
      { name: 'Amex Platinum', type: 'credit_card' },
      { name: 'Air Canada Aeroplan 50K Elite', type: 'airline_status' },
      { name: 'Air Canada Aeroplan 75K Elite', type: 'airline_status' },
      { name: 'Air Canada Super Elite 100K', type: 'airline_status' },
      { name: 'Star Alliance Gold', type: 'airline_status', details: 'On eligible Air Canada flights' },
      { name: 'Air Canada Business Class', type: 'class_of_service' },
      { name: 'Day Pass (~$50 CAD)', type: 'day_pass', details: 'Available to any domestic passenger regardless of airline' },
    ],
    description: `<p>Opened on June 1, 2023, the Aspire | Air Canada Café at Billy Bishop Toronto City Airport is a landmark partnership between Air Canada and Aspire — Swissport's premium global lounge brand — and stands as the only formal lounge at YTZ. Located airside in the domestic departures terminal, just past security and up the escalator, the lounge sits between Door A and the washrooms on the right-hand side. It marked Air Canada's 27th lounge location in its network and Aspire's 6th Canadian opening.</p>

<p>With 133 seats across a range of seating styles — from traditional dining tables and upright armchairs to lie-flat sofas with pillows and booth-style private nooks — the lounge offers a versatile environment for travellers on quick business hops, long layovers, or early-morning departures. A private meeting room seating six and a business desk complete the workspace options.</p>

<p>The food and beverage program is genuinely impressive for a domestic-only regional airport lounge: a fully rotating hot and cold buffet spanning all-day breakfast, lunch, and dinner, paired with a complimentary bar stocked with local Ontario wine, craft beer, spirits, cocktails, and Lavazza coffee. Locally sourced food and sustainable materials reflect the lounge's LEED certification — the first in Swissport's entire global Aspire network.</p>

<p>Showers are not available. Walk-in paid access is offered at approximately $50 CAD for any domestic passenger regardless of airline, making it uniquely accessible compared to most Air Canada lounges. Priority Pass and DragonPass holders are welcome with a 3-hour maximum stay. Porter Airlines — the dominant carrier at Billy Bishop — does not operate its own lounge at YTZ.</p>`,
    rating: 4.6,
    updated_at: new Date().toISOString(),
  }).eq('id', ytzLounge.id)

  if (error) console.error('Update failed:', error.message)
  else console.log('✓ YTZ Aspire | Air Canada Café updated')
}

// ── 2. YQB — Salon YQB (was "YQB Independent Lounge") ─────
console.log('\n── YQB: Updating Salon YQB ──')

const { data: salonYqb } = await sb
  .from('lounges')
  .select('id, name, slug')
  .eq('airport_id', YQB_ID)
  .ilike('name', '%independent%')
  .maybeSingle()

if (!salonYqb) {
  console.error('Could not find YQB Independent Lounge — checking all YQB lounges...')
  const { data } = await sb.from('lounges').select('id, name, slug').eq('airport_id', YQB_ID)
  console.log(data)
} else {
  console.log(`Found: ${salonYqb.name} (${salonYqb.id})`)

  const { error } = await sb.from('lounges').update({
    name: 'Salon YQB',
    slug: 'salon-yqb',
    terminal: 'Main',
    location_detail: 'Airside — after security checkpoint, near Gates 29–30, behind the Lobbie bar by Blaxton',
    is_active: true,
    opening_hours: {
      notes: 'Hours TBA — check aeroportdequebec.com before travelling. Open to all departing passengers.',
    },
    guest_fee: null,
    guest_fee_currency: 'CAD',
    access_types: [
      { name: 'Day Pass (pre-purchase online for reduced rate)', type: 'day_pass', details: 'Available to all departing passengers regardless of airline or class. Pre-purchase at aeroportdequebec.com for reduced rate. Priority Pass/DragonPass integration not yet announced.' },
    ],
    description: `<p>The Salon YQB is Québec City Jean Lesage International Airport's new independent lounge, announced in December 2025 and confirmed open in early 2026 through a partnership with the Québec City Convention Centre. Situated airside after the security checkpoint near Gates 29–30, directly behind the new Lobbie bar by Blaxton, the lounge accommodates approximately 100 guests in an open-concept space designed primarily with leisure and vacation travellers in mind.</p>

<p>The design centres on abundant natural light, a fireplace, and comfortable group-friendly seating. A rotating food menu accompanies a full bar with beer, wine, spirits, and non-alcoholic beverages available throughout operating hours — a step up from the more restricted service model of the V.I.P. Lounge by Club Med it effectively replaces in the interim.</p>

<p>Access is open to any departing passenger through a paid day pass; pre-purchasing on aeroportdequebec.com unlocks a reduced rate. Priority Pass and DragonPass integration has not been confirmed as of June 2026. Full details on hours and pricing are available at aeroportdequebec.com.</p>`,
    updated_at: new Date().toISOString(),
  }).eq('id', salonYqb.id)

  if (error) console.error('Update failed:', error.message)
  else console.log('✓ Salon YQB updated and set to active')
}

// ── 3. YQB — V.I.P. Lounge by Club Med (CLOSED) ──────────
console.log('\n── YQB: Updating V.I.P. Lounge by Club Med ──')

const { data: clubMed } = await sb
  .from('lounges')
  .select('id, name, slug')
  .eq('airport_id', YQB_ID)
  .ilike('name', '%club med%')
  .maybeSingle()

if (!clubMed) {
  console.error('Could not find Club Med lounge at YQB')
} else {
  console.log(`Found: ${clubMed.name} (${clubMed.id})`)

  const { error } = await sb.from('lounges').update({
    name: 'V.I.P. Lounge by Club Med',
    terminal: 'Main',
    location_detail: 'Level 2, between the two escalators after security — adjacent to Gate 28–29',
    is_active: false,
    opening_hours: {
      notes: '⚠️ CLOSED since August 3, 2025 for renovation. No confirmed reopening date as of June 2026. Check aeroportdequebec.com for updates.',
    },
    access_types: [
      { name: 'Priority Pass (digital QR code only)', type: 'membership', details: 'Physical card not accepted — digital QR code required' },
      { name: 'LoungeKey', type: 'membership' },
      { name: 'DragonPass', type: 'membership' },
      { name: 'Amex Platinum', type: 'credit_card' },
      { name: 'Air Canada 50K+ / Business Class', type: 'airline_status' },
      { name: 'Star Alliance Gold', type: 'airline_status' },
    ],
    description: `<p>⚠️ The V.I.P. Lounge by Club Med has been closed since August 3, 2025 for a complete transformation. No confirmed reopening date has been announced as of June 2026. Check aeroportdequebec.com for the latest updates before travelling through YQB.</p>

<p>When open, the V.I.P. Lounge by Club Med was Québec City Jean Lesage International Airport's primary lounge, located on Level 2 between the two escalators just past security — adjacent to Gates 28–29. It earned a reputation as one of the best small-market airport lounges in North America, consistently ranked #1 in North America in its category by Priority Pass.</p>

<p>Features included made-to-order breakfast items (custom omelets), a fireplace, runway views toward Mont Bélair, a conference room, and full bar service with complimentary alcoholic beverages. Entry was entirely self-serve via digital QR code — physical Priority Pass cards were not accepted.</p>`,
    updated_at: new Date().toISOString(),
  }).eq('id', clubMed.id)

  if (error) console.error('Update failed:', error.message)
  else console.log('✓ V.I.P. Lounge by Club Med updated (is_active=false)')
}

// ── 4. YQB — Air Canada Café (COMING SOON) ───────────────
console.log('\n── YQB: Updating Air Canada Café ──')

const { data: acCafeYqb } = await sb
  .from('lounges')
  .select('id, name, slug')
  .eq('airport_id', YQB_ID)
  .ilike('name', '%air canada%')
  .maybeSingle()

if (!acCafeYqb) {
  console.error('Could not find Air Canada Café at YQB')
} else {
  console.log(`Found: ${acCafeYqb.name} (${acCafeYqb.id})`)

  const { error } = await sb.from('lounges').update({
    name: 'Air Canada Café (Coming Summer 2026)',
    terminal: 'Main',
    location_detail: 'Airside — after security; exact gate location TBA. Under construction as of April 2026.',
    is_active: false,
    opening_hours: {
      notes: '🚧 Under construction as of April 2026. Expected opening Summer 2026. Monitor aircanada.com and aeroportdequebec.com for updates.',
    },
    access_types: [
      { name: 'Air Canada Business Class / Premium Rouge', type: 'class_of_service' },
      { name: 'Aeroplan 50K Elite', type: 'airline_status' },
      { name: 'Aeroplan 75K Elite', type: 'airline_status' },
      { name: 'Super Elite 100K', type: 'airline_status' },
      { name: 'Star Alliance Gold (eligible flights)', type: 'airline_status' },
    ],
    description: `<p>🚧 The Air Canada Café at Québec City Jean Lesage International Airport is currently under construction as of April 2026, with an expected opening during Summer 2026. No specific opening date has been announced.</p>

<p>The Café represents the return of an Air Canada lounge presence to YQB for the first time in many years — an arrival that frequent YQB travellers and Aeroplan Elite members have been anticipating. Announced as part of YQB's December 2025 commercial expansion (alongside the Salon YQB and Lobbie bar), it was confirmed under active construction as of April 2026.</p>

<p>The Café will follow the established Air Canada Café format: a curated bistro-style space with Lavazza specialty coffees, hand-crafted beverages, light food and snacks, and a bar with carefully selected wines and local craft beer. Access is exclusive to eligible Air Canada passengers — Business Class, Aeroplan Elite 50K and above, Star Alliance Gold members on eligible flights, and select Aeroplan co-brand credit card holders. No walk-in paid access is expected, consistent with the AC Café model at YTZ and YUL.</p>

<p>For the latest opening updates, monitor aircanada.com or aeroportdequebec.com.</p>`,
    updated_at: new Date().toISOString(),
  }).eq('id', acCafeYqb.id)

  if (error) console.error('Update failed:', error.message)
  else console.log('✓ Air Canada Café YQB updated (is_active=false, coming soon)')
}

console.log('\n✓ All updates complete.\n')
