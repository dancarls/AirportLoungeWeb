import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE = 'https://airportlounges.ca'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,               priority: 1.0, changeFrequency: 'daily' },
    { url: `${BASE}/lounges`,  priority: 0.9, changeFrequency: 'daily' },
    { url: `${BASE}/airports`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${BASE}/blog`,     priority: 0.8, changeFrequency: 'weekly' },
    { url: `${BASE}/blog/priority-pass-lounges-canada`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE}/privacy`,  priority: 0.2, changeFrequency: 'yearly' },
    { url: `${BASE}/terms`,    priority: 0.2, changeFrequency: 'yearly' },
  ]

  if (!url || !key) return staticPages

  const supabase = createClient(url, key)

  const [{ data: airports }, { data: lounges }] = await Promise.all([
    supabase.from('airports').select('iata_code').eq('is_active', true),
    supabase.from('lounges').select('slug, airport:airports!inner(iata_code)').eq('is_active', true),
  ])

  const airportPages: MetadataRoute.Sitemap = (airports ?? []).map(a => ({
    url: `${BASE}/airports/${a.iata_code}`,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }))

  const loungePages: MetadataRoute.Sitemap = (lounges ?? [])
    .map(l => {
      const iata = (l.airport as unknown as { iata_code: string } | null)?.iata_code
      if (!iata) return null
      return {
        url: `${BASE}/airports/${iata}/lounges/${l.slug}`,
        priority: 0.9,
        changeFrequency: 'weekly' as const,
      }
    })
    .filter(Boolean) as MetadataRoute.Sitemap

  return [...staticPages, ...airportPages, ...loungePages]
}
