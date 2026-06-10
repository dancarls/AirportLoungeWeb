// Reactivate and reconcile the two YVR Air Canada cafés with user-verified data.
//
// DB state on entry:
//   air-canada-cafe-c46-yvr  → "Air Canada Café (Gates C46–C47)"  [active]   ← actually the Petit Café
//   air-canada-cafe-c50-yvr  → "Air Canada Café (Gate C50)"       [inactive] ← the main Café
//   ac-cafe-yvr              → "Air Canada Café"                  [inactive] ← legacy dup of C46, leave off
//
// User's authoritative info:
//   Air Canada Café        — Gate C50/D50, Level 3 Departures, Main Terminal
//                            49.194945015452795, -123.18105896041571
//   Air Canada Petit Café  — Gate C46,      Level 3 Departures, Main Terminal
//                            49.19549412667038, -123.18426343192351
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://ixgbdmrembkrpbkjhtfi.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
)

const CAFE_DESCRIPTION = `<p>Whether you're short on time and want a quick and healthy pre-flight snack and coffee or want to sit back and relax with a glass of wine or beer, the Air Canada Café is the perfect pit stop for travelers on the go.</p>`

const PETIT_DESCRIPTION = `<p>The Air Canada Petit Café offers a compact express stop near Gate C46 for a quick coffee, light bite, or pre-flight glass of wine. A small-format alternative to the larger Air Canada Café — designed for travellers on a tighter connection.</p>`

const updates = [
  {
    matchSlug: 'air-canada-cafe-c50-yvr',
    update: {
      name: 'Air Canada Café',
      slug: 'air-canada-cafe-yvr',
      is_active: true,
      latitude: 49.194945015452795,
      longitude: -123.18105896041571,
      terminal: 'Main',
      location_detail: 'Near Gate C50/D50 • After Security • Level 3 • Departures • Main Terminal',
      description: CAFE_DESCRIPTION,
      updated_at: new Date().toISOString(),
    },
  },
  {
    matchSlug: 'air-canada-cafe-c46-yvr',
    update: {
      name: 'Air Canada Petit Café',
      slug: 'air-canada-petit-cafe-yvr',
      is_active: true,
      latitude: 49.19549412667038,
      longitude: -123.18426343192351,
      terminal: 'Main',
      location_detail: 'Near Gate C46 • After Security • Level 3 • Departures • Main Terminal',
      description: PETIT_DESCRIPTION,
      updated_at: new Date().toISOString(),
    },
  },
]

for (const { matchSlug, update } of updates) {
  const { data, error } = await sb
    .from('lounges')
    .update(update)
    .eq('slug', matchSlug)
    .select('name, slug, is_active, latitude, longitude, location_detail')
    .single()
  if (error) console.error(`✗ ${matchSlug}: ${error.message}`)
  else       console.log(`✓ ${data.name.padEnd(28)} [${data.slug}]  active=${data.is_active}  @ ${data.latitude}, ${data.longitude}`)
}

console.log('\nLegacy duplicate ac-cafe-yvr left inactive (no public exposure).')
