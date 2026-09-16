/**
 * Upload local image files to Supabase Storage and register them in the
 * lounge_images table. Reads a manifest at the top of the script — every
 * entry pairs a source file with a target lounge slug. Filenames on disk
 * can be whatever the user labelled; we normalise the storage path to
 * `<slug>/NN.<ext>` so gallery ordering stays predictable.
 *
 * How to run:
 *   npx tsx scripts/upload-lounge-images.ts            # dry-run — no changes
 *   npx tsx scripts/upload-lounge-images.ts --commit    # actually upload
 *
 * The dry-run prints what WOULD happen. --commit is destructive on the
 * primary flag: if a manifest entry sets `is_primary: true`, that lounge's
 * previous primary is demoted to secondary. Existing lounge_images at the
 * same storage path are overwritten (upsert:true).
 */

import { readFileSync, existsSync, statSync } from 'node:fs'
import { resolve, extname } from 'node:path'

// ─── .env.local loader ───────────────────────────────────────────────────
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
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (key && !(key in process.env)) process.env[key] = value
  }
}

import { createClient } from '@supabase/supabase-js'

interface Upload {
  /** Local absolute path on disk */
  file: string
  /** Lounge.slug to attach to */
  slug: string
  /** Whether this image is the primary cover for the lounge */
  is_primary: boolean
  /** 1-indexed sort order — filenames on disk get numbered NN.<ext> in this order */
  sort_order: number
  /** Human-readable alt text (SEO + accessibility) */
  alt_text: string
  /**
   * True for AI-generated placeholder images. The UI renders a small
   * "AI-generated placeholder" caption below the hero when the primary
   * image on a lounge is flagged this way.
   */
  is_ai_generated?: boolean
}

const AC_CAFE_DIR = 'C:/Users/danca/.claude/jobs/04bcb101/tmp/openart'

const MANIFEST: Upload[] = [
  // ── YUL Air Canada Café (Domestic) — AI-generated placeholders ───────
  { file: `${AC_CAFE_DIR}/ac-cafe-hero-yul.png`,          slug: 'air-canada-cafe-domestic-yul',    is_primary: true,  sort_order: 1, alt_text: 'AI-generated placeholder: modern airport café interior with nitro cold brew tap, self-serve pastry case, and workstations', is_ai_generated: true },
  { file: `${AC_CAFE_DIR}/ac-cafe-pastry-case.png`,       slug: 'air-canada-cafe-domestic-yul',    is_primary: false, sort_order: 2, alt_text: 'AI-generated placeholder: self-serve pastry and grab-and-go case with Montreal bagels and pastries', is_ai_generated: true },
  { file: `${AC_CAFE_DIR}/ac-cafe-workstations.png`,      slug: 'air-canada-cafe-domestic-yul',    is_primary: false, sort_order: 3, alt_text: 'AI-generated placeholder: airport lounge workstations with leather-topped surfaces, brass task lamps, and USB-C charging', is_ai_generated: true },
  // ── YUL Air Canada Café (Transborder) — same AI placeholders ─────────
  { file: `${AC_CAFE_DIR}/ac-cafe-hero-yul.png`,          slug: 'air-canada-cafe-transborder-yul', is_primary: true,  sort_order: 1, alt_text: 'AI-generated placeholder: modern airport café interior with nitro cold brew tap, self-serve pastry case, and workstations', is_ai_generated: true },
  { file: `${AC_CAFE_DIR}/ac-cafe-pastry-case.png`,       slug: 'air-canada-cafe-transborder-yul', is_primary: false, sort_order: 2, alt_text: 'AI-generated placeholder: self-serve pastry and grab-and-go case with Montreal bagels and pastries', is_ai_generated: true },
  { file: `${AC_CAFE_DIR}/ac-cafe-workstations.png`,      slug: 'air-canada-cafe-transborder-yul', is_primary: false, sort_order: 3, alt_text: 'AI-generated placeholder: airport lounge workstations with leather-topped surfaces, brass task lamps, and USB-C charging', is_ai_generated: true },
  // ── (Previous YEG + YUL Desjardins uploads are already in Storage — not re-uploaded here.) ──
  // ── YEG Plaza Premium Lounge (Non-US / International Departures) ─────
  { file: 'C:/Users/danca/Downloads/airportimages/YEG PLaza Premium Lounge Non-Us Departures.1.jpg', slug: 'plaza-premium-lounge-yeg', is_primary: true,  sort_order: 1, alt_text: 'Plaza Premium Lounge YEG (Non-US Departures) — main seating area' },
  { file: 'C:/Users/danca/Downloads/airportimages/YEG PLaza Premium Lounge Non-Us Departures.2.jpg', slug: 'plaza-premium-lounge-yeg', is_primary: false, sort_order: 2, alt_text: 'Plaza Premium Lounge YEG (Non-US Departures) — bar and food service' },
  { file: 'C:/Users/danca/Downloads/airportimages/YEG PLaza Premium Lounge Non-Us Departures.3.jpg', slug: 'plaza-premium-lounge-yeg', is_primary: false, sort_order: 3, alt_text: 'Plaza Premium Lounge YEG (Non-US Departures) — lounge interior' },
  { file: 'C:/Users/danca/Downloads/airportimages/YEG PLaza Premium Lounge Non-Us Departures.4.jpg', slug: 'plaza-premium-lounge-yeg', is_primary: false, sort_order: 4, alt_text: 'Plaza Premium Lounge YEG (Non-US Departures) — dining' },
  { file: 'C:/Users/danca/Downloads/airportimages/YEG PLaza Premium Lounge Non-Us Departures.5.jpg', slug: 'plaza-premium-lounge-yeg', is_primary: false, sort_order: 5, alt_text: 'Plaza Premium Lounge YEG (Non-US Departures) — additional view' },
  // ── YEG Plaza Premium Lounge (US Departures / Transborder) ───────────
  { file: 'C:/Users/danca/Downloads/airportimages/YEG PLaza Premium Lounge Us Departures.1.jpg', slug: 'plaza-premium-transborder-yeg', is_primary: true,  sort_order: 1, alt_text: 'Plaza Premium Lounge YEG (US Departures) — main seating area' },
  { file: 'C:/Users/danca/Downloads/airportimages/YEG PLaza Premium Lounge Us Departures.2.jpg', slug: 'plaza-premium-transborder-yeg', is_primary: false, sort_order: 2, alt_text: 'Plaza Premium Lounge YEG (US Departures) — bar and food service' },
  { file: 'C:/Users/danca/Downloads/airportimages/YEG PLaza Premium Lounge Us Departures.3.jpg', slug: 'plaza-premium-transborder-yeg', is_primary: false, sort_order: 3, alt_text: 'Plaza Premium Lounge YEG (US Departures) — quiet seating area' },
  { file: 'C:/Users/danca/Downloads/airportimages/YEG PLaza Premium Lounge Us Departures.4.jpg', slug: 'plaza-premium-transborder-yeg', is_primary: false, sort_order: 4, alt_text: 'Plaza Premium Lounge YEG (US Departures) — additional view' },
  // ── YUL Desjardins Odyssey Lounge (International, Plaza Premium operated) ──
  // Uploading to BOTH desjardins slugs (international + transborder) because
  // the two share the same Google Place listing and traveller reviews already
  // mix them together. If you find the photos should only attach to one, delete
  // the rows for the other via the Supabase table editor.
  { file: 'C:/Users/danca/Downloads/airportimages/YUL Desjardins Odyssey  plaza premium lounge 1.jpeg', slug: 'desjardins-odyssey-lounge-international-yul', is_primary: true,  sort_order: 1, alt_text: 'Desjardins Odyssey Lounge YUL — main seating area' },
  { file: 'C:/Users/danca/Downloads/airportimages/YUL Desjardins Odyssey  plaza premium lounge 2.jpeg', slug: 'desjardins-odyssey-lounge-international-yul', is_primary: false, sort_order: 2, alt_text: 'Desjardins Odyssey Lounge YUL — bar area' },
  { file: 'C:/Users/danca/Downloads/airportimages/YUL Desjardins Odyssey  plaza premium lounge 3.jpeg', slug: 'desjardins-odyssey-lounge-international-yul', is_primary: false, sort_order: 3, alt_text: 'Desjardins Odyssey Lounge YUL — dining' },
  { file: 'C:/Users/danca/Downloads/airportimages/YUL Desjardins Odyssey  plaza premium lounge 4.webp', slug: 'desjardins-odyssey-lounge-international-yul', is_primary: false, sort_order: 4, alt_text: 'Desjardins Odyssey Lounge YUL — additional view' },
  { file: 'C:/Users/danca/Downloads/airportimages/YUL Desjardins Odyssey  plaza premium lounge 1.jpeg', slug: 'desjardins-odyssey-lounge-transborder-yul', is_primary: true,  sort_order: 1, alt_text: 'Desjardins Odyssey Lounge YUL (Transborder) — main seating area' },
  { file: 'C:/Users/danca/Downloads/airportimages/YUL Desjardins Odyssey  plaza premium lounge 2.jpeg', slug: 'desjardins-odyssey-lounge-transborder-yul', is_primary: false, sort_order: 2, alt_text: 'Desjardins Odyssey Lounge YUL (Transborder) — bar area' },
  { file: 'C:/Users/danca/Downloads/airportimages/YUL Desjardins Odyssey  plaza premium lounge 3.jpeg', slug: 'desjardins-odyssey-lounge-transborder-yul', is_primary: false, sort_order: 3, alt_text: 'Desjardins Odyssey Lounge YUL (Transborder) — dining' },
  { file: 'C:/Users/danca/Downloads/airportimages/YUL Desjardins Odyssey  plaza premium lounge 4.webp', slug: 'desjardins-odyssey-lounge-transborder-yul', is_primary: false, sort_order: 4, alt_text: 'Desjardins Odyssey Lounge YUL (Transborder) — additional view' },
]

function contentType(file: string): string {
  const ext = extname(file).toLowerCase()
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.png')  return 'image/png'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.gif')  return 'image/gif'
  return 'application/octet-stream'
}

async function main() {
  const commit = process.argv.includes('--commit')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_KEY
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local')
    process.exit(1)
  }
  const supabase = createClient(supabaseUrl, serviceKey)

  console.log(`\n${commit ? '★ COMMIT MODE — writing to Supabase' : '(dry-run — pass --commit to actually upload)'}`)
  console.log(`Manifest: ${MANIFEST.length} file(s) across ${new Set(MANIFEST.map(m => m.slug)).size} lounge(s)\n`)

  // Precheck every file + resolve every lounge
  const seenSlugs = new Map<string, string>()
  for (const item of MANIFEST) {
    if (!existsSync(item.file)) {
      console.error(`  ✗ MISSING FILE: ${item.file}`)
      process.exit(1)
    }
    if (!seenSlugs.has(item.slug)) {
      const { data: lounge, error } = await supabase.from('lounges').select('id, name').eq('slug', item.slug).single()
      if (error || !lounge) {
        console.error(`  ✗ UNKNOWN SLUG: ${item.slug} (${error?.message ?? 'no row'})`)
        process.exit(1)
      }
      seenSlugs.set(item.slug, lounge.id)
      console.log(`  ✓ Slug resolved: ${item.slug} → ${lounge.name}`)
    }
  }

  // For each slug that gets a new primary, demote the current primary first
  if (commit) {
    for (const [slug, id] of seenSlugs) {
      const hasNewPrimary = MANIFEST.some(m => m.slug === slug && m.is_primary)
      if (!hasNewPrimary) continue
      const { error } = await supabase.from('lounge_images').update({ is_primary: false }).eq('lounge_id', id).eq('is_primary', true)
      if (error) console.warn(`  ⚠ could not demote existing primary for ${slug}: ${error.message}`)
    }
  }

  // Upload + insert
  for (const item of MANIFEST) {
    const loungeId = seenSlugs.get(item.slug)!
    const ext = extname(item.file).toLowerCase()
    const paddedSort = String(item.sort_order).padStart(2, '0')
    const storagePath = `${item.slug}/${paddedSort}${ext}`
    const size = statSync(item.file).size
    console.log(`\n[${item.slug}]  ${storagePath}  (${(size / 1024).toFixed(1)} KB, primary=${item.is_primary})`)

    if (!commit) continue

    const body = readFileSync(item.file)
    const { error: uploadErr } = await supabase.storage
      .from('lounge-images')
      .upload(storagePath, body, { contentType: contentType(item.file), upsert: true })
    if (uploadErr) {
      console.error(`    ✗ storage upload failed: ${uploadErr.message}`)
      process.exit(1)
    }

    // Delete-then-insert (no schema dependency on a unique constraint)
    await supabase.from('lounge_images').delete().eq('lounge_id', loungeId).eq('storage_path', storagePath)
    const { error: rowErr } = await supabase.from('lounge_images').insert({
      lounge_id:       loungeId,
      storage_path:    storagePath,
      alt_text:        item.alt_text,
      is_primary:      item.is_primary,
      sort_order:      item.sort_order,
      is_ai_generated: item.is_ai_generated ?? false,
    })
    if (rowErr) {
      console.error(`    ✗ row insert failed: ${rowErr.message}`)
      process.exit(1)
    }
    console.log('    ✓ uploaded + registered')
  }

  console.log(`\n${commit ? '★ Done — republish will pick up the new images immediately (revalidate=60s)' : '(dry-run complete — re-run with --commit)'}`)
}

main().catch(err => { console.error(err); process.exit(1) })
