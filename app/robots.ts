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
    sitemap: 'https://www.airportlounges.ca/sitemap.xml',
    host: 'https://www.airportlounges.ca',
  }
}
