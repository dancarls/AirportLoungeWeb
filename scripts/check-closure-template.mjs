// Reference what a filled-in closure record looks like — the Ottawa MLL
// closure (from commit e14ee9c) is our template. Also dump the full
// current record for YVR MLL Domestic to see every column it has.
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY,
)

const { data: yow, error: yowErr } = await sb.from('lounges')
  .select('slug, closure_status, closure_reason, closure_started_on, closure_reopen_estimate, closure_alternatives, closure_source_url')
  .eq('slug', 'ac-maple-leaf-lounge-yow')
  .maybeSingle()
if (yowErr) console.error('yow err:', yowErr)

console.log('Ottawa MLL closure record (template):')
console.log(JSON.stringify(yow, null, 2))

const { data: yvr, error: yvrErr } = await sb.from('lounges')
  .select('slug, closure_status, closure_reason, closure_started_on, closure_reopen_estimate, closure_alternatives, closure_source_url')
  .eq('slug', 'ac-maple-leaf-lounge-domestic-yvr')
  .maybeSingle()
if (yvrErr) console.error('yvr err:', yvrErr)

console.log('\nYVR MLL Domestic current closure fields:')
console.log(JSON.stringify(yvr, null, 2))
