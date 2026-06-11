import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { getAllPosts } from '@/lib/blog'

const BASE = 'https://www.airportlounges.ca'
const NOW  = new Date().toISOString()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                    priority: 1.0, changeFrequency: 'daily',   lastModified: NOW },
    { url: `${BASE}/lounges`,       priority: 0.9, changeFrequency: 'daily',   lastModified: NOW },
    { url: `${BASE}/airports`,      priority: 0.8, changeFrequency: 'weekly',  lastModified: NOW },
    { url: `${BASE}/airports/map`,  priority: 0.7, changeFrequency: 'weekly',  lastModified: NOW },
    { url: `${BASE}/flights`,       priority: 0.7, changeFrequency: 'weekly',  lastModified: NOW },
    { url: `${BASE}/about`,         priority: 0.7, changeFrequency: 'monthly', lastModified: NOW },
    { url: `${BASE}/blog`,          priority: 0.8, changeFrequency: 'weekly',  lastModified: NOW },
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

  if (!url || !key) return [...staticPages, ...blogPages]

  const supabase = createClient(url, key)

  const [{ data: airports }, { data: lounges }] = await Promise.all([
    supabase.from('airports').select('iata_code, updated_at').eq('is_active', true),
    supabase.from('lounges').select('slug, updated_at, airport:airports!inner(iata_code)').eq('is_active', true),
  ])

  const airportPages: MetadataRoute.Sitemap = (airports ?? []).flatMap(a => [
    {
      url: `${BASE}/airports/${a.iata_code}`,
      priority: 0.8,
      changeFrequency: 'weekly' as const,
      lastModified: a.updated_at ? new Date(a.updated_at).toISOString() : NOW,
    },
    {
      url: `${BASE}/airports/${a.iata_code}/navigate`,
      priority: 0.7,
      changeFrequency: 'weekly' as const,
      lastModified: a.updated_at ? new Date(a.updated_at).toISOString() : NOW,
    },
  ])

  const loungePages: MetadataRoute.Sitemap = (lounges ?? [])
    .map(l => {
      const iata = (l.airport as unknown as { iata_code: string } | null)?.iata_code
      if (!iata) return null
      return {
        url: `${BASE}/airports/${iata}/lounges/${l.slug}`,
        priority: 0.9,
        changeFrequency: 'weekly' as const,
        lastModified: l.updated_at ? new Date(l.updated_at).toISOString() : NOW,
      }
    })
    .filter(Boolean) as MetadataRoute.Sitemap

  return [...staticPages, ...blogPages, ...airportPages, ...loungePages]
}
