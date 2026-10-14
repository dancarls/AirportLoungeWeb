// Mark the Oct 5 2026 NBC YUL renovation reminder as checked after
// verifying against Milesopedia + updating site content with the corrected
// Oct 4 close / Oct 5 temp-open dates (previous content said Jul 31 / Aug 1).
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY,
)

const { data, error } = await sb.from('content_refresh_reminders')
  .update({
    status: 'checked',
    checked_at: new Date().toISOString(),
    resolution:
      'Verified against Milesopedia (Oct 2026). Corrected timeline across 3 blog posts: ' +
      'original lounge closed 10 p.m. Oct 4 2026 (not Jul 31); temporary space opened Oct 5 ' +
      '(not Aug 1); 2-hr stay (3-hr for NB Private Banking 1859). June 2028 reopening unchanged. ' +
      'Priority Pass acceptance at temp lounge noted as unconfirmed in operator notices.',
  })
  .eq('fire_at', '2026-10-05')
  .eq('topic', 'National Bank Lounge YUL renovation')
  .select('fire_at, topic, status, checked_at')
  .single()

if (error) console.error('✗', error.message)
else console.log('✓ Reminder marked checked:', JSON.stringify(data, null, 2))
