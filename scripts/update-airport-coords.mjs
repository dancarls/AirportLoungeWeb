// Update lounge GPS coordinates for YYZ, YUL, YEG, YOW, YWG.
// Each entry is tagged: 'mapbox' = directly from Mapbox Search Box,
// 'estimate' = derived from documented gate/terminal location.
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://ixgbdmrembkrpbkjhtfi.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
)

const updates = [
  // ═══════════════════════════════════════════════════ YYZ ═══════════════════════════════════════════════════
  // T1
  { slug:'ac-cafe-yyz',                                 lat:43.681636, lng:-79.614434, src:'mapbox',   note:'AC Cafe T1 D20' },
  { slug:'ac-maple-leaf-lounge-domestic-yyz',           lat:43.681473, lng:-79.612835, src:'mapbox',   note:'MLL Domestic T1 D51-D57' },
  { slug:'ac-maple-leaf-lounge-international-yyz',      lat:43.676884, lng:-79.612419, src:'mapbox',   note:'MLL International T1 F-gates L3' },
  { slug:'ac-maple-leaf-lounge-transborder-yyz',        lat:43.677500, lng:-79.609800, src:'estimate', note:'MLL Transborder T1 F52/F53 — between Sig Suite E77 and Express F84+' },
  { slug:'ac-maple-leaf-lounge-express-yyz',            lat:43.679629, lng:-79.607908, src:'mapbox',   note:'MLL Express T1 F84-F99' },
  { slug:'ac-signature-suite-yyz',                      lat:43.676816, lng:-79.610996, src:'mapbox',   note:'Signature Suite T1 E77' },
  { slug:'plaza-premium-domestic-t1-yyz',               lat:43.682200, lng:-79.614200, src:'estimate', note:'Plaza Premium Domestic T1 L3 — central D-pier security exit area' },
  { slug:'plaza-premium-transborder-t1-yyz',            lat:43.680490, lng:-79.612824, src:'mapbox',   note:'Plaza Premium Transborder T1 F53/F55' },
  // T3
  { slug:'air-france-klm-crown-lounge-yyz',             lat:43.682612, lng:-79.620578, src:'mapbox',   note:'AF/KLM Crown T3 C33' },
  { slug:'american-airlines-admirals-club-yyz',         lat:43.686025, lng:-79.622203, src:'mapbox',   note:'AA Admirals T3 A10' },
  { slug:'plaza-premium-domestic-t3-yyz',               lat:43.685931, lng:-79.621632, src:'mapbox',   note:'Plaza Premium Domestic T3 B22/B24' },
  { slug:'plaza-premium-international-t3-yyz',          lat:43.682613, lng:-79.620472, src:'mapbox',   note:'Plaza Premium International T3 C32' },
  { slug:'plaza-premium-transborder-t3-yyz',            lat:43.686694, lng:-79.622228, src:'mapbox',   note:'Plaza Premium Transborder T3 A10' },

  // ═══════════════════════════════════════════════════ YUL ═══════════════════════════════════════════════════
  { slug:'ac-maple-leaf-lounge-domestic-yul',           lat:45.458481, lng:-73.746657, src:'mapbox',   note:'MLL Domestic — Gates 1-3' },
  { slug:'ac-maple-leaf-lounge-international-yul',      lat:45.457388, lng:-73.752962, src:'mapbox',   note:'MLL International — Gate 52' },
  { slug:'ac-maple-leaf-lounge-transborder-yul',        lat:45.458773, lng:-73.752724, src:'mapbox',   note:'MLL Transborder — Gate 73 (Mapbox: Air Canada Lounge)' },
  { slug:'air-france-klm-lounge-yul',                   lat:45.458300, lng:-73.755000, src:'estimate', note:'AF/KLM — Gate 57, between MLL Int (52) and Desjardins Int (63)' },
  { slug:'aspire-amex-lounge-yul',                      lat:45.460320, lng:-73.748121, src:'mapbox',   note:'Aspire AMEX — Domestic Gates 1-2' },
  { slug:'aspire-international-lounge-yul',             lat:45.457600, lng:-73.752800, src:'estimate', note:'Aspire International — Gate 52 area, near MLL Int' },
  { slug:'desjardins-odyssey-lounge-international-yul', lat:45.459182, lng:-73.757069, src:'mapbox',   note:'Desjardins Odyssey International — Gate 63 (Salon Odyssée)' },
  { slug:'desjardins-odyssey-lounge-transborder-yul',   lat:45.456506, lng:-73.753526, src:'mapbox',   note:'Desjardins Odyssey Transborder — Gates 76-77' },
  { slug:'national-bank-lounge-yul',                    lat:45.458799, lng:-73.753105, src:'mapbox',   note:'National Bank — Gate 53' },

  // ═══════════════════════════════════════════════════ YEG ═══════════════════════════════════════════════════
  { slug:'ac-maple-leaf-lounge-yeg',                    lat:53.306915, lng:-113.583685, src:'mapbox',  note:'MLL — main terminal L2' },
  { slug:'plaza-premium-lounge-yeg',                    lat:53.307003, lng:-113.584444, src:'mapbox',  note:'PP — same entrance as MLL' },
  { slug:'plaza-premium-transborder-yeg',               lat:53.304538, lng:-113.578329, src:'mapbox',  note:'PP US Transborder — past Gate 88' },

  // ═══════════════════════════════════════════════════ YOW ═══════════════════════════════════════════════════
  { slug:'ac-maple-leaf-lounge-yow',                    lat:45.322600, lng:-75.667800, src:'estimate', note:'MLL — Gates 17/18 L2, opposite Aspire' },
  { slug:'aspire-salon-lounge-yow',                     lat:45.322777, lng:-75.667704, src:'mapbox',   note:'Aspire — right of Gate 18 L2' },

  // ═══════════════════════════════════════════════════ YWG ═══════════════════════════════════════════════════
  { slug:'ac-maple-leaf-lounge-ywg',                    lat:49.906048, lng:-97.225639, src:'mapbox',   note:'MLL — opposite Gate 9 concourse' },
  { slug:'plaza-premium-lounge-ywg',                    lat:49.905950, lng:-97.226000, src:'estimate', note:'PP — opposite Gate 6, west of MLL' },
]

let mapboxCount = 0, estCount = 0, errCount = 0
for (const u of updates) {
  const { data, error } = await sb.from('lounges')
    .update({ latitude: u.lat, longitude: u.lng, updated_at: new Date().toISOString() })
    .eq('slug', u.slug)
    .select('name')
    .single()
  if (error) { console.error(`✗ ${u.slug}: ${error.message}`); errCount++ }
  else {
    const tag = u.src === 'mapbox' ? '🗺️ ' : '📐'
    console.log(`${tag} ${data.name.padEnd(50)} → ${u.lat}, ${u.lng}  (${u.note})`)
    if (u.src === 'mapbox') mapboxCount++; else estCount++
  }
}
console.log(`\nApplied: ${mapboxCount} from Mapbox, ${estCount} estimated, ${errCount} errors`)
