import type { MetadataRoute } from 'next'
import { connection } from 'next/server'
import { db } from '@/lib/db'
import { cachedRead } from '@/lib/cached-read'
import { getAllPosts } from '@/lib/blog'
import { getAllPostsFr } from '@/lib/blog-fr'
import { allCollectionSlugs } from '@/lib/collections'
import { sitemapDbFailureMode } from '@/lib/sitemap-policy'

const BASE = 'https://www.airportlounges.ca'
const NOW  = new Date().toISOString()

// Do not prerender. A build without a reachable database used to catch the
// error and bake the static-only URL list into sitemap.xml forever (127 → 46).
// `connection()` bails that prerender out; the route runs per request and the
// database read is cached for an hour.
export const dynamic = 'force-dynamic'

type AirportRow = { iata_code: string; updated_at: Date | string | null }
type LoungeRow = { slug: string; updated_at: Date | string | null; iata_code: string | null }

function iso(value: Date | string | null | undefined): string {
  if (!value) return NOW
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? NOW : date.toISOString()
}

async function loadSitemapRows(): Promise<{ airports: AirportRow[]; lounges: LoungeRow[] }> {
  try {
    const [airports, lounges] = await Promise.all([
      db<AirportRow[]>`
        SELECT iata_code, updated_at
        FROM airports
        WHERE is_active = true
        ORDER BY iata_code ASC
      `,
      db<LoungeRow[]>`
        SELECT l.slug, l.updated_at, a.iata_code
        FROM lounges l
        JOIN airports a ON a.id = l.airport_id
        WHERE l.is_active = true
        ORDER BY a.iata_code ASC, l.slug ASC
      `,
    ])
    return { airports, lounges }
  } catch (err) {
    console.error('sitemap DB fetch failed', err)
    if (sitemapDbFailureMode({
      nodeEnv: process.env.NODE_ENV,
      nextPhase: process.env.NEXT_PHASE,
    }) === 'throw') {
      throw err
    }
    return { airports: [], lounges: [] }
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                    priority: 1.0, changeFrequency: 'daily',   lastModified: NOW },
    { url: `${BASE}/lounges`,       priority: 0.9, changeFrequency: 'daily',   lastModified: NOW },
    { url: `${BASE}/airports`,      priority: 0.8, changeFrequency: 'weekly',  lastModified: NOW },
    { url: `${BASE}/airports/map`,  priority: 0.7, changeFrequency: 'weekly',  lastModified: NOW },
    { url: `${BASE}/flights`,       priority: 0.7, changeFrequency: 'weekly',  lastModified: NOW },
    { url: `${BASE}/about`,         priority: 0.7, changeFrequency: 'monthly', lastModified: NOW },
    { url: `${BASE}/blog`,          priority: 0.8, changeFrequency: 'weekly',  lastModified: NOW },
    { url: `${BASE}/operators`,     priority: 0.6, changeFrequency: 'monthly', lastModified: NOW },
    { url: `${BASE}/credit-cards`,  priority: 0.85, changeFrequency: 'weekly',  lastModified: NOW },
    { url: `${BASE}/credit-cards/best-for-airport-lounge-access`, priority: 0.9, changeFrequency: 'weekly', lastModified: NOW },
    { url: `${BASE}/credit-cards/aeroplan-cards-compared`,        priority: 0.9, changeFrequency: 'weekly', lastModified: NOW },
    { url: `${BASE}/credit-cards/rebates`,                        priority: 0.85, changeFrequency: 'weekly', lastModified: NOW },
    { url: `${BASE}/travel-insurance`,                            priority: 0.9,  changeFrequency: 'weekly', lastModified: NOW },
    { url: `${BASE}/privacy`,       priority: 0.2, changeFrequency: 'yearly',  lastModified: NOW },
    { url: `${BASE}/terms`,         priority: 0.2, changeFrequency: 'yearly',  lastModified: NOW },
  ]

  // Blog posts — pulled dynamically so new posts appear automatically
  const blogPages: MetadataRoute.Sitemap = getAllPosts().map(post => ({
    url: `${BASE}/blog/${post.slug}`,
    priority: 0.9,
    changeFrequency: 'monthly' as const,
    lastModified: post.publishedAt ? new Date(post.publishedAt).toISOString() : NOW,
  }))

  // French-locale blog posts (`/fr/blog/...`) + the French index page +
  // any French airport hub pages that have been shipped (YUL is the first).
  const blogPagesFr: MetadataRoute.Sitemap = [
    { url: `${BASE}/fr/blog`, priority: 0.7, changeFrequency: 'weekly' as const, lastModified: NOW },
    { url: `${BASE}/fr/airports/YUL`, priority: 0.8, changeFrequency: 'weekly' as const, lastModified: NOW },
    { url: `${BASE}/fr/airports/YYZ`, priority: 0.8, changeFrequency: 'weekly' as const, lastModified: NOW },
    { url: `${BASE}/fr/airports/YVR`, priority: 0.8, changeFrequency: 'weekly' as const, lastModified: NOW },
    ...getAllPostsFr().map(post => ({
      url: `${BASE}/fr/blog/${post.slug}`,
      priority: 0.85,
      changeFrequency: 'monthly' as const,
      lastModified: post.publishedAt ? new Date(post.publishedAt).toISOString() : NOW,
    })),
  ]

  // Collection landing pages — one per curated lounge collection
  const collectionPages: MetadataRoute.Sitemap = allCollectionSlugs().map(slug => ({
    url: `${BASE}/lounges/${slug}`,
    priority: 0.85,
    changeFrequency: 'weekly' as const,
    lastModified: NOW,
  }))

  const { airports, lounges } = await cachedRead('sitemap-rows', 3600, loadSitemapRows)

  const airportPages: MetadataRoute.Sitemap = airports.flatMap(a => [
    {
      url: `${BASE}/airports/${a.iata_code}`,
      priority: 0.8,
      changeFrequency: 'weekly' as const,
      lastModified: iso(a.updated_at),
    },
    {
      url: `${BASE}/airports/${a.iata_code}/navigate`,
      priority: 0.7,
      changeFrequency: 'weekly' as const,
      lastModified: iso(a.updated_at),
    },
  ])

  const loungePages: MetadataRoute.Sitemap = lounges
    .map(l => {
      if (!l.iata_code) return null
      return {
        url: `${BASE}/airports/${l.iata_code}/lounges/${l.slug}`,
        priority: 0.9,
        changeFrequency: 'weekly' as const,
        lastModified: iso(l.updated_at),
      }
    })
    .filter(Boolean) as MetadataRoute.Sitemap

  return [...staticPages, ...blogPages, ...blogPagesFr, ...collectionPages, ...airportPages, ...loungePages]
}
