/**
 * Batch text search — for each target, run Google Places Text Search
 * (bias to airport lat/lng), print top matches with distance from the
 * airport center. Used when we don't have exact coordinates for a lounge
 * but can name it uniquely.
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

import { kmBetween, type GooglePlace } from '../lib/google-places'

interface Target {
  slug: string
  query: string
  /** Airport lat/lng — locationBias center */
  center: { lat: number; lng: number }
}

// YVR terminal center coordinate
const YVR = { lat: 49.194717, lng: -123.184074 }
// YUL center
const YUL = { lat: 45.4658, lng: -73.7415 }

const TARGETS: Target[] = [
  // YVR — lounges the user identified by gate but not coord
  { slug: 'ac-maple-leaf-lounge-international-yvr', query: 'Air Canada Maple Leaf Lounge International YVR Vancouver Gate D53',      center: YVR },
  { slug: 'ac-maple-leaf-lounge-domestic-yvr',       query: 'Air Canada Maple Leaf Lounge Domestic Vancouver Gate C29',              center: YVR },
  { slug: 'ac-maple-leaf-lounge-transborder-yvr',    query: 'Air Canada Maple Leaf Lounge Transborder US Vancouver Gate E88',       center: YVR },
  { slug: 'plaza-premium-domestic-yvr',              query: 'Plaza Premium Lounge Vancouver Domestic Gate C29',                      center: YVR },
  { slug: 'plaza-premium-domestic-pier-c-yvr',       query: 'Plaza Premium Lounge Vancouver Pier C Domestic',                        center: YVR },
  { slug: 'plaza-premium-international-yvr',         query: 'Plaza Premium Lounge Vancouver International Gate D59',                 center: YVR },
  { slug: 'plaza-premium-us-yvr',                    query: 'Plaza Premium Lounge Vancouver US Departures Gate E88',                 center: YVR },
  { slug: 'plaza-premium-first-yvr',                 query: 'Plaza Premium First Lounge Vancouver YVR',                              center: YVR },
  { slug: 'cathay-pacific-lounge-yvr',               query: 'Cathay Pacific Lounge Vancouver YVR Gate D70',                          center: YVR },
  { slug: 'skyteam-lounge-yvr',                      query: 'SkyTeam Lounge Vancouver YVR Gate D53',                                 center: YVR },
  // YUL — the two newly created Air Canada Cafés
  { slug: 'air-canada-cafe-domestic-yul',            query: 'Air Canada Cafe YUL Montreal Domestic Gate A2',                         center: YUL },
  { slug: 'air-canada-cafe-transborder-yul',         query: 'Air Canada Cafe YUL Montreal Transborder Gate 73',                      center: YUL },
]

const FIELD_MASK = 'places.id,places.displayName,places.rating,places.userRatingCount,places.location,places.formattedAddress'

async function textSearch(t: Target) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': FIELD_MASK },
    body: JSON.stringify({
      textQuery: t.query,
      locationBias: { circle: { center: { latitude: t.center.lat, longitude: t.center.lng }, radius: 2000 } },
      maxResultCount: 8,
    }),
  })
  if (!res.ok) throw new Error(`Text search failed (${res.status}): ${await res.text()}`)
  return ((await res.json()) as { places?: GooglePlace[] }).places ?? []
}

async function processOne(t: Target) {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`▸ ${t.slug}`)
  console.log(`  query: "${t.query}"`)
  const places = await textSearch(t)
  if (places.length === 0) { console.log('  (no matches)'); return }
  const scored = places.map(p => ({
    p,
    dist: p.location ? kmBetween({ latitude: t.center.lat, longitude: t.center.lng }, p.location) * 1000 : 999999,
  })).sort((a, b) => a.dist - b.dist)
  const airportOnly = scored.filter(s => s.dist < 3000).slice(0, 5) // 3 km bubble
  if (airportOnly.length === 0) {
    console.log('  ⚠ Nothing within 3km of airport center.')
    scored.slice(0, 3).forEach((s, i) => {
      console.log(`  [${i}] ${s.p.displayName?.text ?? '(?)'} · ${(s.dist / 1000).toFixed(1)}km · ${s.p.rating?.toFixed(1) ?? '–'}★ (${s.p.userRatingCount ?? 0})  ${s.p.id}`)
    })
    return
  }
  airportOnly.forEach((s, i) => {
    console.log(`  [${i}] ${s.p.displayName?.text ?? '(?)'}  ${s.dist.toFixed(0)}m from airport center`)
    console.log(`       ${s.p.rating?.toFixed(1) ?? '–'}★ (${s.p.userRatingCount ?? 0} reviews)  ${s.p.id}`)
    if (s.p.formattedAddress) console.log(`       ${s.p.formattedAddress}`)
  })
}

async function main() {
  for (const t of TARGETS) {
    try { await processOne(t) } catch (e) { console.error(`  ✗ ${(e as Error).message}`) }
  }
}
main().catch(e => { console.error(e); process.exit(1) })
