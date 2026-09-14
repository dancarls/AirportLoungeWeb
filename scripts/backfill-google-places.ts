/**
 * One-shot backfill: resolve every active lounge to a Google Place ID and
 * cache its Place Details on the lounge row.
 *
 * How to run (Windows PowerShell or bash):
 *   npx tsx scripts/backfill-google-places.ts
 *
 * Auto-loads .env.local from the project root — no flags needed. If any of
 * these are missing, the script tells you exactly which one:
 *   NEXT_PUBLIC_GOOGLE_MAPS_KEY   — Places API (New) enabled, no HTTP-referrer restriction
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_KEY          — admin write access to lounges + airports
 *
 * Cost: about $2 total (one Text Search + one Place Details per lounge across
 * 53 lounges = ~106 requests × ~$0.017/request average = ~$1.80).
 *
 * Idempotent: skips lounges that already have google_place_id AND were synced
 * in the last 30 days. Pass `--force` to re-sync everything.
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// ─── Manual .env.local loader ────────────────────────────────────────────────
// Loaded before any other imports so the Supabase/Google modules see the vars.
// tsx's --env-file flag misfires on Windows with CRLF line endings, so we
// parse the file ourselves and only fill in vars that aren't already set
// (real env vars from the shell always win).
const envFiles = ['.env.local', '.env'] as const
for (const filename of envFiles) {
  const path = resolve(process.cwd(), filename)
  if (!existsSync(path)) continue
  const contents = readFileSync(path, 'utf-8').replace(/^﻿/, '') // strip BOM
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq < 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    // Strip surrounding quotes
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

// Now safe to import modules that read env vars at load time.
import { createClient } from '@supabase/supabase-js'
import { searchPlaces, getPlaceDetails, kmBetween, type GooglePlace } from '../lib/google-places'

const FORCE = process.argv.includes('--force')
const MAX_KM_FROM_AIRPORT = 8 // reject any Place candidate further than 8 km from the airport

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_KEY
  const googleKey   = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

  // Detect BOTH missing and empty-string values — Vercel returns empty strings
  // for env vars that are scoped to a different environment than the one you
  // pulled, which is a very common gotcha.
  const missing: string[] = []
  const empty: string[] = []
  const check = (name: string, val: string | undefined) => {
    if (val == null)   missing.push(name)
    else if (val === '') empty.push(name)
  }
  check('NEXT_PUBLIC_SUPABASE_URL',    supabaseUrl)
  check('SUPABASE_SERVICE_KEY',         serviceKey)
  check('NEXT_PUBLIC_GOOGLE_MAPS_KEY',  googleKey)

  if (missing.length + empty.length > 0 || !supabaseUrl || !serviceKey || !googleKey) {
    if (missing.length > 0) {
      console.error(`Missing env vars (not in .env.local at all): ${missing.join(', ')}`)
    }
    if (empty.length > 0) {
      console.error(`Empty env vars (in .env.local but blank): ${empty.join(', ')}`)
      console.error(`These are set to "" in .env.local, which usually means they're scoped only to a different Vercel environment.`)
      console.error(`Try:  vercel env pull .env.local --environment=production`)
    }
    console.error(`Working directory: ${process.cwd()}`)
    process.exit(1)
  }
  const supabase = createClient(supabaseUrl, serviceKey)

  const { data: lounges, error } = await supabase
    .from('lounges')
    .select('id, name, slug, google_place_id, google_place_synced_at, airport:airports(id, iata_code, name, city, latitude, longitude)')
    .eq('is_active', true)
    .order('name')
  if (error) throw error
  if (!lounges) { console.log('No lounges found.'); return }

  console.log(`Backfilling Google Places for ${lounges.length} active lounges…\n`)

  let updated = 0
  let skipped = 0
  let failed = 0

  for (const l of lounges) {
    const airport = (l.airport as unknown as {
      id: string; iata_code: string; name: string; city: string;
      latitude: number | null; longitude: number | null;
    } | null)
    if (!airport?.latitude || !airport.longitude) {
      console.log(`SKIP  ${l.slug} — airport has no coordinates`)
      skipped++
      continue
    }

    // Skip if already synced recently, unless --force
    if (!FORCE && l.google_place_id && l.google_place_synced_at) {
      const ageDays = (Date.now() - new Date(l.google_place_synced_at).getTime()) / 86400000
      if (ageDays < 30) {
        console.log(`SKIP  ${l.slug} — synced ${ageDays.toFixed(0)}d ago`)
        skipped++
        continue
      }
    }

    try {
      let place: GooglePlace | null = null

      // If we already have a Place ID, just refresh the Details.
      if (l.google_place_id && !FORCE) {
        place = await getPlaceDetails(l.google_place_id)
      }

      // Otherwise, search by "<lounge name> <airport name>" biased to airport lat/long.
      if (!place) {
        const query = `${l.name} ${airport.name}`
        const candidates = await searchPlaces(query, {
          latitude: airport.latitude,
          longitude: airport.longitude,
          radiusMeters: 10000,
        })

        // Filter to candidates within 8km of the airport (lounges are inside the terminal,
        // so anything further is a hotel with the same name or a false match).
        const scored = candidates
          .map(p => ({
            p,
            km: p.location
              ? kmBetween(
                  { latitude: airport.latitude!, longitude: airport.longitude! },
                  p.location,
                )
              : 999,
          }))
          .filter(x => x.km <= MAX_KM_FROM_AIRPORT)
          .sort((a, b) => a.km - b.km)

        if (scored.length === 0) {
          console.log(`MISS  ${l.slug} — no candidate within ${MAX_KM_FROM_AIRPORT} km`)
          failed++
          continue
        }

        const top = scored[0].p
        // Now fetch full details for the winning Place ID
        place = await getPlaceDetails(top.id)
      }

      if (!place) {
        console.log(`FAIL  ${l.slug} — no Place Details returned`)
        failed++
        continue
      }

      const { error: upErr } = await supabase
        .from('lounges')
        .update({
          google_place_id: place.id,
          google_place_data: place,
          google_place_synced_at: new Date().toISOString(),
        })
        .eq('id', l.id)
      if (upErr) throw upErr

      console.log(
        `OK    ${l.slug} → ${place.id.slice(0, 20)}…  ${place.rating?.toFixed(1) ?? '–'}★ (${place.userRatingCount ?? 0})`,
      )
      updated++

      // Be nice to Google — 200ms between requests.
      await new Promise(r => setTimeout(r, 200))
    } catch (err) {
      console.log(`ERR   ${l.slug} — ${(err as Error).message}`)
      failed++
    }
  }

  console.log(`\n✓ Done. Updated ${updated}, skipped ${skipped}, failed ${failed}.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
