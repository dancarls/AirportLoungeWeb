/**
 * Manual Place ID override — assign a specific Google Place ID to a lounge
 * and refresh its enrichment. Use this when the automatic backfill matched
 * a wrong or generic Place (e.g. all 3 YYZ Maple Leaf Lounges got the same
 * "Air Canada YYZ" listing) and you found a better Place ID via Google's
 * Place ID Finder.
 *
 * How to find the correct Place ID:
 *   1. Go to https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
 *   2. Search for the specific lounge — e.g. "Plaza Premium Lounge Terminal 3 International Toronto"
 *   3. Click on the pin — the Place ID (starts with `ChIJ...`) appears in the info box
 *   4. Copy that Place ID
 *
 * How to run:
 *   npx tsx scripts/set-lounge-place-id.ts <slug> <ChIJ-place-id>
 *   npx tsx scripts/set-lounge-place-id.ts <slug> clear
 *
 * Examples:
 *   npx tsx scripts/set-lounge-place-id.ts ac-maple-leaf-lounge-domestic-yyz ChIJk9m...
 *   npx tsx scripts/set-lounge-place-id.ts plaza-premium-transborder-t3-yyz clear
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// ─── Load .env.local (same pattern as the backfill script) ────────────────
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
import { getPlaceDetails } from '../lib/google-places'

async function main() {
  const [, , slug, arg] = process.argv
  if (!slug || !arg) {
    console.error(`Usage: npx tsx scripts/set-lounge-place-id.ts <lounge-slug> <ChIJ-place-id | clear>`)
    process.exit(1)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_KEY
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing Supabase env vars — run `vercel env pull .env.local --environment=production` first.')
    process.exit(1)
  }
  const supabase = createClient(supabaseUrl, serviceKey)

  // Verify the lounge exists
  const { data: lounge, error } = await supabase
    .from('lounges')
    .select('id, slug, name, google_place_id')
    .eq('slug', slug)
    .single()
  if (error || !lounge) {
    console.error(`Lounge not found: ${slug}`)
    process.exit(1)
  }
  console.log(`Found: ${lounge.name} (currently ${lounge.google_place_id ?? '<no place>'})`)

  // "clear" action — remove Place data entirely (falls back to un-enriched sidebar)
  if (arg.toLowerCase() === 'clear') {
    const { error: upErr } = await supabase
      .from('lounges')
      .update({
        google_place_id: null,
        google_place_data: null,
        google_place_synced_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', lounge.id)
    if (upErr) throw upErr
    console.log(`✓ Cleared Google Place data for ${slug}`)
    return
  }

  // Set a specific Place ID (must start with ChIJ per Places API New convention)
  if (!arg.startsWith('ChIJ')) {
    console.error(`Place ID should start with "ChIJ". Got: ${arg}`)
    console.error(`If you have a Google Maps share URL instead, find the ChIJ ID using:`)
    console.error(`https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder`)
    process.exit(1)
  }

  console.log(`Fetching Place Details for ${arg}...`)
  const place = await getPlaceDetails(arg)
  if (!place) {
    console.error(`Place ID not found or Details unavailable: ${arg}`)
    process.exit(1)
  }

  const { error: upErr } = await supabase
    .from('lounges')
    .update({
      google_place_id: place.id,
      google_place_data: place,
      google_place_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', lounge.id)
  if (upErr) throw upErr

  console.log(`✓ Updated ${slug}`)
  console.log(`  Name:   ${place.displayName?.text ?? '(no name)'}`)
  console.log(`  Rating: ${place.rating?.toFixed(1) ?? '–'}★ (${place.userRatingCount ?? 0} reviews)`)
  console.log(`  Photos: ${place.photos?.length ?? 0}`)
  console.log(`  Address: ${place.formattedAddress ?? '(no address)'}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
