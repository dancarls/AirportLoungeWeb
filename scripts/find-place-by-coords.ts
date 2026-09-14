/**
 * Find a Google Place ID by exact coordinates and assign it to a lounge.
 *
 * Use this to fix "shared Place ID" cases where the automatic backfill matched
 * a generic listing (e.g. all 3 YYZ Maple Leaf Lounges got one "Air Canada YYZ"
 * result). Provide the specific lat/long from Google Maps (right-click the pin
 * → "Copy coordinates") and the script will search a tight 50 m radius, list
 * the top matches, and — with `--set` — assign the best match to the lounge.
 *
 * How to run:
 *   Dry run (see candidates, no DB write):
 *     npx tsx scripts/find-place-by-coords.ts <slug> <lat> <lng>
 *
 *   Set the top match on the lounge row:
 *     npx tsx scripts/find-place-by-coords.ts <slug> <lat> <lng> --set
 *
 *   Or pick a specific rank from the list (0-indexed):
 *     npx tsx scripts/find-place-by-coords.ts <slug> <lat> <lng> --set=2
 *
 * Example (Air Canada Signature Suite YYZ):
 *   npx tsx scripts/find-place-by-coords.ts ac-signature-suite-yyz 43.67698463489763 -79.61129007235598 --set
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// ─── Manual .env.local loader ────────────────────────────────────────────────
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
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (key && !(key in process.env)) {
      process.env[key] = value
    }
  }
}

import { createClient } from '@supabase/supabase-js'
import { getPlaceDetails, kmBetween, type GooglePlace } from '../lib/google-places'

const PLACES_API_BASE = 'https://places.googleapis.com/v1'
const SEARCH_FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.rating',
  'places.userRatingCount',
  'places.types',
  'places.primaryTypeDisplayName',
].join(',')

async function nearbySearch(lat: number, lng: number, radiusMeters: number) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!
  const body = {
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: radiusMeters,
      },
    },
    maxResultCount: 15,
    rankPreference: 'DISTANCE',
  }
  const res = await fetch(`${PLACES_API_BASE}/places:searchNearby`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': SEARCH_FIELD_MASK,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Nearby Search failed (${res.status}): ${text.slice(0, 300)}`)
  }
  return (await res.json()) as { places?: GooglePlace[] }
}

async function main() {
  const [, , slug, latStr, lngStr, setFlag] = process.argv
  const lat = latStr ? parseFloat(latStr) : NaN
  const lng = lngStr ? parseFloat(lngStr) : NaN
  if (!slug || Number.isNaN(lat) || Number.isNaN(lng)) {
    console.error(`Usage: npx tsx scripts/find-place-by-coords.ts <slug> <lat> <lng> [--set | --set=N]`)
    process.exit(1)
  }

  const shouldSet = setFlag?.startsWith('--set')
  const rankIndex = setFlag && setFlag.includes('=')
    ? parseInt(setFlag.split('=')[1], 10)
    : 0

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_KEY
  const googleKey   = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
  if (!supabaseUrl || !serviceKey || !googleKey) {
    console.error('Missing env vars. Run: vercel env pull .env.local --environment=production')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceKey)
  const { data: lounge, error } = await supabase
    .from('lounges')
    .select('id, slug, name, google_place_id')
    .eq('slug', slug)
    .single()
  if (error || !lounge) {
    console.error(`Lounge not found: ${slug}`)
    process.exit(1)
  }
  console.log(`\nTarget: ${lounge.name} (${lounge.slug})`)
  console.log(`Current Place ID: ${lounge.google_place_id ?? '(none)'}`)
  console.log(`Coords: ${lat}, ${lng}\n`)

  // Search 50 m first — a lounge is typically in a specific corner of a terminal
  let result = await nearbySearch(lat, lng, 50)
  if (!result.places || result.places.length === 0) {
    console.log('No matches at 50 m — expanding to 200 m…')
    result = await nearbySearch(lat, lng, 200)
  }
  if (!result.places || result.places.length === 0) {
    console.log('Still no matches at 200 m — the coords may not be near any indexed Place.')
    process.exit(1)
  }

  const scored = result.places
    .map(p => ({
      p,
      distance_m: p.location ? kmBetween({ latitude: lat, longitude: lng }, p.location) * 1000 : 999999,
    }))
    .sort((a, b) => a.distance_m - b.distance_m)

  console.log(`Found ${scored.length} nearby Places:\n`)
  scored.slice(0, 10).forEach((s, i) => {
    const marker = i === rankIndex ? '► ' : '  '
    console.log(`${marker}[${i}] ${s.p.displayName?.text ?? '(no name)'}`)
    console.log(`     Place ID: ${s.p.id}`)
    console.log(`     ${s.distance_m.toFixed(1)} m · ${s.p.rating?.toFixed(1) ?? '–'}★ (${s.p.userRatingCount ?? 0} reviews)`)
    if (s.p.formattedAddress) console.log(`     ${s.p.formattedAddress}`)
    console.log()
  })

  if (!shouldSet) {
    console.log(`Dry run. To set match [${rankIndex}] as the Place ID, re-run with --set${rankIndex === 0 ? '' : '=' + rankIndex}`)
    return
  }

  const chosen = scored[rankIndex]
  if (!chosen) {
    console.error(`No result at index ${rankIndex}.`)
    process.exit(1)
  }

  console.log(`\nFetching full Place Details for ${chosen.p.id}...`)
  const details = await getPlaceDetails(chosen.p.id)
  if (!details) {
    console.error(`Place Details unavailable for ${chosen.p.id}`)
    process.exit(1)
  }

  const { error: upErr } = await supabase
    .from('lounges')
    .update({
      google_place_id: details.id,
      google_place_data: details,
      google_place_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', lounge.id)
  if (upErr) throw upErr

  console.log(`\n✓ Updated ${slug}`)
  console.log(`  Name:   ${details.displayName?.text ?? '(no name)'}`)
  console.log(`  Rating: ${details.rating?.toFixed(1) ?? '–'}★ (${details.userRatingCount ?? 0} reviews)`)
  console.log(`  Photos: ${details.photos?.length ?? 0}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
