import type { MetadataRoute } from 'next'

// AI crawlers we explicitly welcome — grants them the same access as any other
// bot so citations show up in ChatGPT, Claude, Perplexity, and Google AI Overviews.
// Listed individually so the intent is unambiguous even if a user-agent-specific
// disallow ever gets added elsewhere.
const AI_CRAWLERS = [
  'GPTBot',           // OpenAI / ChatGPT training + search
  'OAI-SearchBot',    // OpenAI SearchGPT
  'ChatGPT-User',     // ChatGPT on-demand fetch (user asks a question)
  'ClaudeBot',        // Anthropic training
  'Claude-Web',       // Claude on-demand fetch
  'anthropic-ai',     // Anthropic legacy UA
  'PerplexityBot',    // Perplexity indexing
  'Perplexity-User',  // Perplexity on-demand fetch
  'Google-Extended',  // Gemini / AI Overviews opt-in
  'Applebot-Extended',// Apple Intelligence
  'Bingbot',          // Bing (Copilot backbone)
  'CCBot',            // Common Crawl (feeds most model training sets)
  'YouBot',           // You.com
  'Meta-ExternalAgent', // Meta AI
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account', '/auth/', '/api/'],
      },
      // Explicit AI-crawler allowlist — same rules as *, stated plainly so
      // there's no ambiguity for the AI-search citation pipeline.
      ...AI_CRAWLERS.map(userAgent => ({
        userAgent,
        allow: '/',
        disallow: ['/account', '/auth/', '/api/'],
      })),
    ],
    sitemap: 'https://www.airportlounges.ca/sitemap.xml',
    host: 'https://www.airportlounges.ca',
  }
}
