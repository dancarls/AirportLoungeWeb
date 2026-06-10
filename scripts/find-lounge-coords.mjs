// Find authoritative coordinates for every active lounge at a given airport, using
// Mapbox Search Box API (category=lounge + per-row name searches as fallback).
// Outputs JSON of { dbId, dbName, terminal, candidates: [...] } for manual review.
// Usage: node scripts/find-lounge-coords.mjs YYZ
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envText = fs.readFileSync('.env.local', 'utf8')
const env = Object.fromEntries(envText.split('\n').filter(l => l && !l.startsWith('#') && l.includes('='))
  .map(l => { const i = l.indexOf('='); return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^"|"$/g,'')] }))
const TOKEN = env.NEXT_PUBLIC_MAPBOX_TOKEN

const AIRPORTS = {
  YYZ: { id:'840161ae-1301-45f8-ad92-10d7834bef72', c:[-79.6248,43.6780], bbox:[-79.640,43.660,-79.595,43.695], city:'Toronto Pearson' },
  YUL: { id:'ccd3abf2-f1c1-41a7-8fc4-eb0a22e7b50c', c:[-73.7410,45.4706], bbox:[-73.760,45.450,-73.722,45.485], city:'Montréal-Trudeau' },
  YEG: { id:'6fb8cf7b-7ec8-47d7-83aa-fabd5b87ffd1', c:[-113.5776,53.3097], bbox:[-113.595,53.300,-113.560,53.320], city:'Edmonton' },
  YOW: { id:'f3a410c9-3c65-4ec2-8adf-d59278852433', c:[-75.6660,45.3224], bbox:[-75.680,45.310,-75.652,45.335], city:'Ottawa Macdonald-Cartier' },
  YWG: { id:'12ec4554-7a92-4566-91e4-5d779737e284', c:[-97.2390,49.9096], bbox:[-97.255,49.900,-97.225,49.920], city:'Winnipeg James Richardson' },
}
const code = (process.argv[2]||'YYZ').toUpperCase()
const A = AIRPORTS[code]; if (!A) { console.error('unknown'); process.exit(1) }

const sb = createClient('https://ixgbdmrembkrpbkjhtfi.supabase.co', env.SUPABASE_SERVICE_KEY)
const { data: lounges } = await sb.from('lounges')
  .select('id, name, slug, terminal, location_detail')
  .eq('airport_id', A.id).eq('is_active', true).order('terminal').order('name')

async function fetchJson(url) {
  const r = await fetch(url)
  if (!r.ok) return { error: `${r.status}` }
  return r.json()
}

// 1. Category=lounge bulk
const catUrl = `https://api.mapbox.com/search/searchbox/v1/category/lounge?proximity=${A.c[0]},${A.c[1]}&bbox=${A.bbox.join(',')}&limit=25&access_token=${TOKEN}`
const catRes = await fetchJson(catUrl)
const allPois = []
for (const f of (catRes.features || [])) {
  allPois.push({
    src: 'category',
    name: f.properties.name,
    addr: f.properties.full_address || f.properties.address || '',
    lng: f.geometry.coordinates[0],
    lat: f.geometry.coordinates[1],
  })
}

// 2. Also try category=cafe for AC Cafe entries
const cafeUrl = `https://api.mapbox.com/search/searchbox/v1/category/cafe?proximity=${A.c[0]},${A.c[1]}&bbox=${A.bbox.join(',')}&limit=25&access_token=${TOKEN}`
const cafeRes = await fetchJson(cafeUrl)
for (const f of (cafeRes.features || [])) {
  if (/air canada|maple leaf|aspire/i.test(f.properties.name)) {
    allPois.push({
      src: 'cafe',
      name: f.properties.name,
      addr: f.properties.full_address || f.properties.address || '',
      lng: f.geometry.coordinates[0],
      lat: f.geometry.coordinates[1],
    })
  }
}

console.log(`\n=== ${code} — ${allPois.length} POIs from category search ===`)
for (const p of allPois) console.log(`  [${p.src}] ${p.name.padEnd(55)} | ${p.lat.toFixed(6)}, ${p.lng.toFixed(6)} | ${p.addr.slice(0,40)}`)

console.log(`\n=== ${code} DB lounges (${lounges.length} active) ===`)
const review = []
for (const l of lounges) {
  // 3. For each DB lounge, also do a name-specific search
  const nameQ = `${l.name} ${code} airport`
  const namedUrl = `https://api.mapbox.com/search/searchbox/v1/forward?q=${encodeURIComponent(nameQ)}&proximity=${A.c[0]},${A.c[1]}&bbox=${A.bbox.join(',')}&limit=3&access_token=${TOKEN}`
  const nameRes = await fetchJson(namedUrl)
  const named = (nameRes.features || []).map(f => ({
    src: 'named',
    name: f.properties.name,
    addr: f.properties.full_address || f.properties.address || '',
    lng: f.geometry.coordinates[0],
    lat: f.geometry.coordinates[1],
  }))
  review.push({
    dbId: l.id, slug: l.slug, name: l.name, terminal: l.terminal,
    loc: l.location_detail?.slice(0, 100),
    named, allPois,
  })
  console.log(`\n--- ${l.name}  (T${l.terminal})  →  ${l.location_detail?.slice(0,80)}`)
  if (named.length) named.forEach((n,i) => console.log(`  named[${i}] ${n.name.padEnd(50)} | ${n.lat.toFixed(6)}, ${n.lng.toFixed(6)}`))
  else console.log(`  named: (no results)`)
}

fs.writeFileSync(`C:\\Users\\danca\\AppData\\Local\\Temp\\${code}-candidates.json`, JSON.stringify(review, null, 2))
console.log(`\nSaved → C:\\Users\\danca\\AppData\\Local\\Temp\\${code}-candidates.json`)
