// Set YVR MLL Domestic to the Oct 14 2026 → early 2028 renovation closure.
// Fact source: Milesopedia + LoyaltyLobby + Air Canada's own Oct 2026 notice.
// Last day for guests is Oct 13, 2026; closes Oct 14; reopens early 2028.
// The two Air Canada Cafés at YVR (Gate C50 and Gate C46) handle alternate
// pre-flight service for eligible travellers.
//
// The LoungeClosureBanner shows an "Upcoming closure" variant automatically
// while closure_started_on is in the future, then flips to "Currently closed"
// on and after that date — so this script is safe to run any time before
// Oct 14 and the user-facing copy stays accurate.
//
// Run with:
//   node --env-file=.env.local scripts/apply-yvr-mll-domestic-closure.mjs

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY,
)

const SLUG = 'ac-maple-leaf-lounge-domestic-yvr'

const update = {
  closure_status: 'temporary_closure',
  closure_reason: 'Full-scale renovation',
  closure_started_on: '2026-10-14',
  closure_reopen_estimate: 'Early 2028',
  closure_alternatives:
    "Last day for guests is October 13, 2026. From October 14 the Domestic Maple Leaf Lounge is closed through early 2028 for a full renovation that will add quiet work zones, improved accessibility, a central fireplace gathering area, locally inspired culinary offerings and a full-service bar. In the meantime, eligible travellers (Business/First class same-day, Star Alliance Gold, Aeroplan 50K+/Super Elite, Maple Leaf Club) can use the Air Canada Café near Gate C50/D50 (full-size) or the Air Canada Petit Café near Gate C46 — both in Level 3 Departures of the Main Terminal. The YVR International Maple Leaf Lounge, Transborder Maple Leaf Lounge, and Signature Suite all remain open as usual.",
  closure_source_url: 'https://milesopedia.com/en/news/airports/vancouver-domestic-maple-leaf-lounge-closure/',
}

const { data, error } = await sb
  .from('lounges')
  .update(update)
  .eq('slug', SLUG)
  .select('slug, closure_status, closure_started_on, closure_reopen_estimate')
  .single()

if (error) {
  console.error(`✗ Failed to apply closure to ${SLUG}:`, error.message)
  process.exit(1)
}

console.log(`✓ ${data.slug} → ${data.closure_status}`)
console.log(`  closes:        ${data.closure_started_on}`)
console.log(`  reopens:       ${data.closure_reopen_estimate}`)

// Schedule two content-refresh reminders so this doesn't rot in prod:
//  - 2027-12-01: start checking Air Canada for a confirmed re-opening date
//  - 2028-03-01: expected return; if open, clear the closure fields
const reminders = [
  {
    fire_at: '2027-12-01',
    topic: 'YVR Domestic MLL — reopening date confirmation',
    what_to_check:
      'Air Canada should have a confirmed reopening date 1-3 months before early 2028. Check https://www.aircanada.com/ca/en/aco/home/fly/airport-and-city-guides/airport-lounges.html and Milesopedia for a specific month/day. Tighten closure_reopen_estimate from "Early 2028" to the exact month if announced.',
    affected_urls: [
      'https://www.airportlounges.ca/airports/YVR/lounges/ac-maple-leaf-lounge-domestic-yvr',
      'https://www.airportlounges.ca/airports/YVR',
      'https://www.airportlounges.ca/blog/priority-pass-lounges-canada',
      'https://www.airportlounges.ca/blog/amex-platinum-airport-lounge-access-canada',
    ],
  },
  {
    fire_at: '2028-03-01',
    topic: 'YVR Domestic MLL — expected reopening; verify and clear closure fields',
    what_to_check:
      'If the renovated lounge has reopened, set closure_status=open and clear closure_reason/closure_started_on/closure_reopen_estimate/closure_alternatives/closure_source_url. Also update location_detail and description with the new amenities (quiet work zones, central fireplace gathering area, improved accessibility, full-service bar, locally inspired culinary offerings). If still closed, extend closure_reopen_estimate.',
    affected_urls: [
      'https://www.airportlounges.ca/airports/YVR/lounges/ac-maple-leaf-lounge-domestic-yvr',
      'https://www.airportlounges.ca/airports/YVR',
    ],
  },
]

for (const r of reminders) {
  const { error: rErr } = await sb
    .from('content_refresh_reminders')
    .insert(r)
  if (rErr) console.error(`✗ Reminder ${r.fire_at}: ${rErr.message}`)
  else      console.log(`✓ Reminder scheduled: ${r.fire_at} — ${r.topic}`)
}
