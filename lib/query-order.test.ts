import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'

const ROOT = path.resolve(import.meta.dirname, '..')

function filesUnder(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) out.push(...filesUnder(full))
    else if (/\.(ts|tsx)$/.test(name)) out.push(full)
  }
  return out
}

const sources = [
  ...filesUnder(path.join(ROOT, 'app')),
  ...filesUnder(path.join(ROOT, 'lib')),
].filter(file => !file.endsWith('.test.ts'))

test('rating sorts name-and-slug tie-break', () => {
  const misses: string[] = []
  for (const file of sources) {
    const text = readFileSync(file, 'utf8')
    if (!text.includes('l.rating DESC')) continue
    if (!text.includes('l.name ASC, l.slug ASC')) misses.push(path.relative(ROOT, file))
  }
  assert.deepEqual(misses, [])
})

test('amenity aggregates follow amenity id, matching live Supabase', () => {
  const misses: string[] = []
  for (const file of sources) {
    const text = readFileSync(file, 'utf8')
    if (text.includes('ORDER BY am.name')) misses.push(path.relative(ROOT, file))
    if (text.includes('ORDER BY la.ctid')) misses.push(path.relative(ROOT, file))
    if (!text.includes('lounge_amenities')) continue
    if (!text.includes('json_agg(')) continue
    if (!text.includes('ORDER BY am.id ASC')) misses.push(`${path.relative(ROOT, file)} missing am.id`)
  }
  assert.deepEqual(misses, [])
})

test('json aggregates declare an order', () => {
  const misses: string[] = []
  for (const file of sources) {
    const text = readFileSync(file, 'utf8')
    const parts = text.split('json_agg(').slice(1)
    for (const part of parts) {
      const window = part.slice(0, 600)
      if (!window.includes('ORDER BY')) {
        misses.push(`${path.relative(ROOT, file)}: json_agg(${window.slice(0, 80)}`)
      }
    }
  }
  assert.deepEqual(misses, [])
})

test('public dynamic routes are on-demand ISR and the sitemap is not prerendered', () => {
  const isr = [
    'app/airports/[iata]/page.tsx',
    'app/airports/[iata]/navigate/page.tsx',
    'app/airports/[iata]/lounges/[slug]/page.tsx',
    'app/lounges/[collection]/page.tsx',
  ]
  for (const rel of isr) {
    const text = readFileSync(path.join(ROOT, rel), 'utf8')
    assert.equal(text.includes("dynamic = 'force-dynamic'"), false, rel)
    assert.match(text, /export function generateStaticParams\(\) \{\s*return \[\]/, rel)
    assert.match(text, /export const revalidate = \d+/, rel)
    assert.match(text, /export const dynamicParams = true/, rel)
  }

  const sitemap = readFileSync(path.join(ROOT, 'app/sitemap.ts'), 'utf8')
  assert.match(sitemap, /export const dynamic = 'force-dynamic'/)
  assert.match(sitemap, /await connection\(\)/)
  assert.match(sitemap, /sitemapDbFailureMode/)

  const lounge = readFileSync(path.join(ROOT, 'app/airports/[iata]/lounges/[slug]/lounge-view.tsx'), 'utf8')
  assert.equal(lounge.includes("@/lib/supabase/server"), false)
  assert.equal(lounge.includes('searchParams'), false)
})
