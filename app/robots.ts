import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account', '/auth/', '/api/'],
      },
    ],
    sitemap: 'https://airportlounges.ca/sitemap.xml',
    host: 'https://airportlounges.ca',
  }
}
