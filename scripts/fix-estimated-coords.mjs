// Replace the 6 estimated coords with user-verified coords.
// These supersede the 'estimate' entries from update-airport-coords.mjs.
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://ixgbdmrembkrpbkjhtfi.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
)

const updates = [
  { slug: 'ac-maple-leaf-lounge-transborder-yyz',        lat: 43.68019607312982,  lng: -79.61183130033102, note: 'YYZ MLL Transborder' },
  { slug: 'plaza-premium-domestic-t1-yyz',               lat: 43.6813817921247,   lng: -79.61459225927106, note: 'YYZ Plaza Premium Domestic T1' },
  { slug: 'air-france-klm-lounge-yul',                   lat: 45.45920100944756,  lng: -73.75416959538401, note: 'YUL Air France/KLM' },
  { slug: 'aspire-international-lounge-yul',             lat: 45.45825910384957,  lng: -73.74741872749166, note: 'YUL Aspire International' },
  { slug: 'ac-maple-leaf-lounge-yow',                    lat: 45.321608496291105, lng: -75.66647099658886, note: 'YOW Maple Leaf Lounge' },
  { slug: 'plaza-premium-lounge-ywg',                    lat: 49.90612257395868,  lng: -97.22361252798535, note: 'YWG Plaza Premium' },
]

let ok = 0, err = 0
for (const u of updates) {
  const { data, error } = await sb.from('lounges')
    .update({ latitude: u.lat, longitude: u.lng, updated_at: new Date().toISOString() })
    .eq('slug', u.slug)
    .select('name, latitude, longitude')
    .single()
  if (error) { console.error(`✗ ${u.slug}: ${error.message}`); err++ }
  else { console.log(`✓ ${data.name.padEnd(50)} → ${data.latitude}, ${data.longitude}  (${u.note})`); ok++ }
}
console.log(`\nApplied: ${ok} verified, ${err} errors`)
