// Dump current DB state for YVR MLL Domestic + YVR Air Canada Cafés + any
// pending content-refresh reminders mentioning YVR. Reads the Supabase
// service key from the environment — never embed it inline. Run with:
//   node --env-file=.env.local scripts/check-yvr-mll-state.mjs
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY,
)

const yvrId = '3f2645da-2c60-4e3e-ad78-3bd268bee576'

const { data: mll } = await sb.from('lounges')
  .select('*')
  .eq('airport_id', yvrId)
  .ilike('slug', '%maple-leaf%')
  .order('slug')

const { data: cafes } = await sb.from('lounges')
  .select('name, slug, is_active, location_detail, description')
  .eq('airport_id', yvrId)
  .ilike('name', '%afé%')
  .order('slug')

const { data: reminders } = await sb.from('content_refresh_reminders')
  .select('*')
  .or('topic.ilike.%YVR%,topic.ilike.%Vancouver%,what_to_check.ilike.%YVR%')
  .order('fire_at')

console.log('=== YVR Maple Leaf Lounges ===')
for (const l of mll ?? []) {
  console.log(`\n[${l.slug}]  active=${l.is_active}`)
  console.log(`  name:                       ${l.name}`)
  console.log(`  temporary_closure_until:    ${l.temporary_closure_until ?? '—'}`)
  console.log(`  closure_notice:             ${l.closure_notice ?? '—'}`)
  console.log(`  closure_reason:             ${l.closure_reason ?? '—'}`)
  console.log(`  closure_reopen_date:        ${l.closure_reopen_date ?? '—'}`)
  console.log(`  closure_alternative_slugs:  ${JSON.stringify(l.closure_alternative_slugs)}`)
  console.log(`  closure_alternative_notes:  ${l.closure_alternative_notes ?? '—'}`)
  console.log(`  location_detail:            ${l.location_detail ?? '—'}`)
}

console.log('\n=== YVR Air Canada Cafés ===')
for (const c of cafes ?? []) {
  console.log(`\n[${c.slug}]  active=${c.is_active}`)
  console.log(`  name:            ${c.name}`)
  console.log(`  location_detail: ${c.location_detail ?? '—'}`)
}

console.log('\n=== Pending content refresh reminders mentioning YVR ===')
console.log(JSON.stringify(reminders, null, 2))
