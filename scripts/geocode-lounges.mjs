// For each active lounge at the given airport, query Mapbox Search Box API to find its precise coordinate.
// Usage: node geocode-lounges.mjs YYZ
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envPath = 'C:\\Users\\danca\\airport-lounges-web\\.env.local'
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8').split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')] })
)
const TOKEN = env.NEXT_PUBLIC_MAPBOX_TOKEN
const SUPABASE_KEY = env.SUPABASE_SERVICE_KEY

const AIRPORTS = {
  YYZ: { id: '840161ae-1301-45f8-ad92-10d7834bef72', center: [-79.6248, 43.6780], city: 'Toronto Pearson' },
  YUL: { id: 'ccd3abf2-f1c1-41a7-8fc4-eb0a22e7b50c', center: [-73.7410, 45.4706], city: 'Montréal-Trudeau' },
  YEG: { id: '6fb8cf7b-7ec8-47d7-83aa-fabd5b87ffd1', center: [-113.5776, 53.3097], city: 'Edmonton' },
  YOW: { id: 'f3a410c9-3c65-4ec2-8adf-d59278852433', center: [-75.6660, 45.3224], city: 'Ottawa' },
  YWG: { id: '12ec4554-7a92-4566-91e4-5d779737e284', center: [-97.2390, 49.9096], city: 'Winnipeg' },
}

const code = (process.argv[2] || 'YYZ').toUpperCase()
const config = AIRPORTS[code]
if (!config) { console.error('unknown airport'); process.exit(1) }

const sb = createClient('https://ixgbdmrembkrpbkjhtfi.supabase.co', SUPABASE_KEY)
const { data: lounges } = await sb.from('lounges')
  .select('id, name, slug, terminal, location_detail')
  .eq('airport_id', config.id).eq('is_active', true)

console.log(`Querying Mapbox Search Box for ${lounges.length} lounges at ${code}\n`)

async function searchMapbox(q) {
  // Use v6 forward geocoding (no session token needed)
  const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(q)}&proximity=${config.center[0]},${config.center[1]}&types=poi&limit=5&access_token=${TOKEN}`
  const r = await fetch(url)
  if (!r.ok) return { error: `${r.status} ${r.statusText}` }
  const j = await r.json()
  return j.features?.map(f => ({
    name: f.properties?.name,
    address: f.properties?.full_address,
    coord: f.geometry?.coordinates, // [lng, lat]
    category: f.properties?.feature_type,
  })) ?? []
}

const results = []
for (const l of lounges) {
  // Build a query likely to hit the indoor POI. Try several variants.
  const variants = [
    `${l.name} ${code} airport`,
    `${l.name} ${config.city}`,
    l.name,
  ]
  let best = null
  for (const q of variants) {
    const r = await searchMapbox(q)
    if (Array.isArray(r) && r.length > 0) { best = { query: q, hits: r }; break }
  }
  results.push({ slug: l.slug, name: l.name, terminal: l.terminal, location: l.location_detail?.slice(0, 80), best })
  console.log(`\n--- ${l.name} (${l.terminal}) ---`)
  console.log(`  loc: ${l.location_detail?.slice(0, 100)}`)
  if (best) {
    console.log(`  query: "${best.query}"`)
    best.hits.slice(0, 3).forEach((h, i) => {
      console.log(`    [${i+1}] ${h.name}  →  ${h.coord?.[1]?.toFixed(6)}, ${h.coord?.[0]?.toFixed(6)}  (${h.address || ''})`)
    })
  } else {
    console.log('  NO HITS')
  }
}

fs.writeFileSync(`C:\\Users\\danca\\AppData\\Local\\Temp\\${code}-geocode.json`, JSON.stringify(results, null, 2))
console.log(`\nSaved → ${code}-geocode.json`)
