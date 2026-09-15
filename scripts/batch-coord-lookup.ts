/**
 * Batch coordinate lookup — takes a list of (slug, lat, lng) and prints,
 * for each one, the top 3 nearby Google Places that look like a lounge
 * (skipping bathrooms, ATMs, retail). Dry-run only; use scripts/
 * find-place-by-coords.ts --set to actually apply a match after review.
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// ─── .env.local loader ───────────────────────────────────────────────
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

import { kmBetween, type GooglePlace } from '../lib/google-places'

const PLACES_API_BASE = 'https://places.googleapis.com/v1'
const SEARCH_FIELD_MASK = ['places.id','places.displayName','places.formattedAddress','places.location','places.rating','places.userRatingCount','places.types','places.primaryTypeDisplayName'].join(',')

interface Target {
  label: string
  slug: string
  lat: number
  lng: number
}

const TARGETS: Target[] = [
  { label: 'Desjardins Odyssey (Transborder) — near gate 76', slug: 'desjardins-odyssey-lounge-transborder-yul',   lat: 45.45629, lng: -73.7534   },
  { label: 'AC MLL (International) — near gate 52',           slug: 'ac-maple-leaf-lounge-international-yul',      lat: 45.45883, lng: -73.7524   },
  { label: 'AC MLL (Transborder) — near gate 73',             slug: 'ac-maple-leaf-lounge-transborder-yul',        lat: 45.45756, lng: -73.75297  },
  { label: 'Air France / KLM Lounge',                          slug: 'air-france-klm-lounge-yul',                   lat: 45.45918, lng: -73.75416  },
  { label: 'Aspire | Amex Lounge — near gate 1',              slug: 'aspire-amex-lounge-yul',                      lat: 45.45816, lng: -73.74738  },
  { label: 'Aspire International Lounge — near gate 53',       slug: 'aspire-international-lounge-yul',             lat: 45.459,   lng: -73.75317  },
  { label: 'Desjardins Odyssey (International) — near gate 63',slug: 'desjardins-odyssey-lounge-international-yul', lat: 45.45926, lng: -73.75709  },
  { label: 'AC MLL (Domestic) / Salon feuille d\'érable — near gate 1', slug: 'ac-maple-leaf-lounge-domestic-yul',   lat: 45.45848, lng: -73.74675  },
]

const IGNORE_PATTERNS = [
  /bathroom/i, /restroom/i, /^atm$/i, /washroom/i, /toilet/i,
  /^duty free$/i, /^relay$/i, /shoe care/i, /currency exchange/i,
  /starbucks/i, /^tim hortons$/i, /pizza/i,
]

function isRelevant(p: GooglePlace): boolean {
  const name = p.displayName?.text ?? ''
  return !IGNORE_PATTERNS.some(re => re.test(name))
}

async function nearbySearch(lat: number, lng: number, radiusMeters: number) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!
  const res = await fetch(`${PLACES_API_BASE}/places:searchNearby`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': SEARCH_FIELD_MASK,
    },
    body: JSON.stringify({
      locationRestriction: { circle: { center: { latitude: lat, longitude: lng }, radius: radiusMeters } },
      maxResultCount: 20,
      rankPreference: 'DISTANCE',
    }),
  })
  if (!res.ok) throw new Error(`Nearby failed (${res.status}): ${await res.text()}`)
  return (await res.json()) as { places?: GooglePlace[] }
}

async function processOne(t: Target) {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`▸ ${t.label}`)
  console.log(`  slug: ${t.slug}`)
  console.log(`  coord: ${t.lat}, ${t.lng}`)
  let result = await nearbySearch(t.lat, t.lng, 80)
  if (!result.places?.length) result = await nearbySearch(t.lat, t.lng, 250)
  if (!result.places?.length) { console.log('  (no matches at 250m)'); return }
  const scored = result.places.map(p => ({
    p,
    dist: p.location ? kmBetween({ latitude: t.lat, longitude: t.lng }, p.location) * 1000 : 999999,
  })).sort((a,b) => a.dist - b.dist)
  const relevant = scored.filter(s => isRelevant(s.p)).slice(0, 3)
  if (relevant.length === 0) {
    console.log('  ⚠ No relevant lounge candidates found. Top raw matches:')
    scored.slice(0, 3).forEach((s, i) => {
      console.log(`    [${i}] ${s.p.displayName?.text ?? '(unnamed)'} · ${s.dist.toFixed(1)}m · ${s.p.rating?.toFixed(1) ?? '–'}★ (${s.p.userRatingCount ?? 0})`)
      console.log(`         Place ID: ${s.p.id}`)
    })
    return
  }
  console.log(`  Top ${relevant.length} lounge candidate(s):`)
  relevant.forEach((s, i) => {
    console.log(`  [${i}] ${s.p.displayName?.text ?? '(unnamed)'}`)
    console.log(`      ${s.dist.toFixed(1)}m · ${s.p.rating?.toFixed(1) ?? '–'}★ (${s.p.userRatingCount ?? 0} reviews)`)
    console.log(`      Place ID: ${s.p.id}`)
    if (s.p.formattedAddress) console.log(`      ${s.p.formattedAddress}`)
  })
}

async function main() {
  for (const t of TARGETS) {
    try { await processOne(t) } catch (e) { console.error(`  ✗ ${(e as Error).message}`) }
  }
}
main().catch(e => { console.error(e); process.exit(1) })
