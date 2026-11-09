/**
 * Audit every lounge's primary image URL and report which ones 404.
 *
 * Checks two sources per lounge:
 *   1. Supabase storage (if lounge_images rows exist for it)
 *   2. Google Places photo (if google_place_data exists)
 *
 * Reports a table of lounge name, source, status, and the failing URL.
 * No writes — purely diagnostic.
 *
 * Run: node --env-file=.env.local scripts/audit-lounge-images.mjs
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY
const GOOGLE_KEY   = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local')
  process.exit(1)
}
if (!GOOGLE_KEY) {
  console.error('⚠  NEXT_PUBLIC_GOOGLE_MAPS_KEY missing — Google photo check will be skipped')
}

const sb = createClient(SUPABASE_URL, SUPABASE_KEY)

function photoUrl(photoName, maxWidthPx = 800) {
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidthPx}&key=${GOOGLE_KEY}`
}

async function check(url) {
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow' })
    return { ok: res.ok, status: res.status, final: res.url !== url ? res.url : null }
  } catch (e) {
    return { ok: false, status: 0, error: e.message }
  }
}

async function main() {
  console.log('Fetching all active lounges + their images...')
  const { data: lounges, error } = await sb
    .from('lounges')
    .select('id, name, slug, airport_id, google_place_data, airports(iata_code), images:lounge_images(storage_path, is_primary, sort_order)')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Query failed:', error.message)
    process.exit(1)
  }

  console.log(`Loaded ${lounges.length} active lounges\n`)

  const results = []

  for (const l of lounges) {
    const iata = l.airports?.iata_code ?? '???'
    const label = `[${iata}] ${l.name}`

    // Which source would the page use?
    let source, url
    if (l.images && l.images.length > 0) {
      const primary = l.images.find(i => i.is_primary)
        ?? [...l.images].sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99))[0]
      source = 'supabase'
      url = `${SUPABASE_URL}/storage/v1/object/public/lounge-images/${primary.storage_path}`
    } else if (l.google_place_data?.photos?.[0]?.name) {
      source = 'google'
      url = photoUrl(l.google_place_data.photos[0].name, 800)
    } else {
      source = 'none'
      url = null
    }

    if (!url) {
      results.push({ label, source, status: '—', note: 'no image source' })
      continue
    }

    const r = await check(url)
    results.push({
      label,
      source,
      status: r.ok ? '✓ ' + r.status : '✗ ' + (r.status || r.error),
      url: r.ok ? null : url,
    })
  }

  // Print grouped by status
  const ok = results.filter(r => r.status.startsWith('✓'))
  const fail = results.filter(r => r.status.startsWith('✗'))
  const none = results.filter(r => r.status === '—')

  console.log('='.repeat(80))
  console.log(`OK:       ${ok.length}`)
  console.log(`FAILING:  ${fail.length}`)
  console.log(`NO IMAGE: ${none.length}`)
  console.log('='.repeat(80))

  if (fail.length) {
    console.log('\n--- FAILING ---')
    for (const r of fail) {
      console.log(`${r.status.padEnd(8)} ${r.source.padEnd(10)} ${r.label}`)
      console.log(`         URL: ${r.url}`)
    }
  }

  if (none.length) {
    console.log('\n--- NO IMAGE SOURCE ---')
    for (const r of none) {
      console.log(`${r.label}  (${r.note})`)
    }
  }

  // Summary by source
  const bySource = {}
  for (const r of results) {
    const key = `${r.source}-${r.status.startsWith('✓') ? 'ok' : r.status === '—' ? 'none' : 'fail'}`
    bySource[key] = (bySource[key] ?? 0) + 1
  }
  console.log('\n--- BREAKDOWN ---')
  for (const [k, v] of Object.entries(bySource).sort()) {
    console.log(`${k.padEnd(20)} ${v}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
