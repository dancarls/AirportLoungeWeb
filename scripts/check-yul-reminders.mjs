import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY,
)

const { data } = await sb.from('content_refresh_reminders')
  .select('*')
  .or('topic.ilike.%YUL%,topic.ilike.%Montreal%,topic.ilike.%National Bank%,what_to_check.ilike.%YUL%')
  .order('fire_at')
console.log(JSON.stringify(data, null, 2))
