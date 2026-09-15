/**
 * Batch-apply Place IDs (fetches full Place Details + writes google_place_data).
 * Used after a batch-text-search or batch-coord-lookup identifies distinct
 * listings for each slug.
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
const envFiles = ['.env.local', '.env'] as const
for (const filename of envFiles) {
  const path = resolve(process.cwd(), filename)
  if (!existsSync(path)) continue
  const contents = readFileSync(path, 'utf-8').replace(/^﻿/, '')
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq < 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
    if (key && !(key in process.env)) process.env[key] = value
  }
}

import { createClient } from '@supabase/supabase-js'
import { getPlaceDetails } from '../lib/google-places'

// YVR shared-Place-ID cleanup batch (verified via batch-text-search 2026-09-15).
// Every entry maps a slug to the specific Google Place ID that matches the
// operator's own listing at that terminal / pier — no more sharing.
const ASSIGNMENTS: { slug: string; placeId: string; label: string }[] = [
  { slug: 'ac-maple-leaf-lounge-international-yvr', placeId: 'ChIJP6r5ynQLhlQRopXo7k8Ec0w', label: 'AC MLL International YVR (270 reviews, 3.6★)' },
  { slug: 'ac-maple-leaf-lounge-domestic-yvr',       placeId: 'ChIJtQoV5EkLhlQRhM0oy6rwsoI', label: 'AC MLL Domestic YVR (2,104 reviews, 3.9★)' },
  { slug: 'ac-maple-leaf-lounge-transborder-yvr',    placeId: 'ChIJw5DVXzULhlQRyIzNLD092JA', label: 'AC MLL Transborder YVR (581 reviews, 3.4★)' },
  { slug: 'plaza-premium-domestic-pier-c-yvr',       placeId: 'ChIJh3m3FzYLhlQRidDwSfht5j4', label: 'Plaza Premium Pier C YVR (1,066 reviews, 4.4★)' },
  { slug: 'plaza-premium-domestic-yvr',              placeId: 'ChIJQWJJhzULhlQROqk-OJVrNnc', label: 'Plaza Premium Domestic (Gate B15) YVR (1,916 reviews, 4.1★)' },
  { slug: 'plaza-premium-international-yvr',         placeId: 'ChIJu2sVCgMLhlQR9x8UvsLQe3I', label: 'Plaza Premium International Pier D YVR (977 reviews, 4.0★)' },
  { slug: 'plaza-premium-first-yvr',                 placeId: 'ChIJY8y1GTULhlQRD6XtoYRcSBM', label: 'Plaza Premium First YVR (644 reviews, 4.8★)' },
  { slug: 'plaza-premium-us-yvr',                    placeId: 'ChIJV9B0xzULhlQR3Pa7Vknmwe0', label: 'Plaza Premium US Departures YVR (1,549 reviews, 3.8★)' },
  { slug: 'cathay-pacific-lounge-yvr',               placeId: 'ChIJ86aguDULhlQRYeWd6jDsUI4', label: 'Cathay Pacific Lounge YVR (188 reviews, 4.5★)' },
  { slug: 'skyteam-lounge-yvr',                      placeId: 'ChIJgSHeX0oLhlQRokPDo9ZwIes', label: 'SkyTeam Lounge YVR (1,613 reviews, 3.8★)' },
]

async function main() {
  const commit = process.argv.includes('--commit')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_KEY
  if (!supabaseUrl || !serviceKey) { console.error('Missing env'); process.exit(1) }
  const supabase = createClient(supabaseUrl, serviceKey)

  console.log(`\n${commit ? '★ COMMIT MODE' : '(dry-run — pass --commit to actually write)'}`)
  console.log(`${ASSIGNMENTS.length} assignments\n`)

  for (const a of ASSIGNMENTS) {
    console.log(`\n▸ ${a.slug}`)
    console.log(`  target: ${a.label}`)
    console.log(`  Place ID: ${a.placeId}`)
    const { data: lounge, error } = await supabase.from('lounges').select('id, name, google_place_id').eq('slug', a.slug).single()
    if (error || !lounge) { console.error(`  ✗ Lounge not found`); continue }
    if (lounge.google_place_id === a.placeId) { console.log(`  ✓ Already correct — no change`); continue }
    console.log(`  Current: ${lounge.google_place_id ?? '(none)'}`)
    if (!commit) continue

    const place = await getPlaceDetails(a.placeId)
    if (!place) { console.error(`  ✗ Place Details returned null`); continue }
    const { error: upErr } = await supabase.from('lounges').update({
      google_place_id: place.id,
      google_place_data: place,
      google_place_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', lounge.id)
    if (upErr) { console.error(`  ✗ Update failed: ${upErr.message}`); continue }
    console.log(`  ✓ Updated · ${place.userRatingCount ?? 0} reviews · ${place.photos?.length ?? 0} photos`)
  }
  console.log(`\n${commit ? '★ Batch complete' : '(dry-run complete)'}`)
}
main().catch(e => { console.error(e); process.exit(1) })
