// /llms.txt — guide for AI search crawlers (ChatGPT, Claude, Perplexity).
// Serves a curated index of the site so LLMs can answer questions without
// crawling every page. See https://llmstxt.org/ for the emerging convention.
import { createClient } from '@supabase/supabase-js'

const BASE = 'https://www.airportlounges.ca'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let airportLines = ''
  let loungeCount = 0
  if (url && key) {
    const sb = createClient(url, key)
    const [{ data: airports }, { count }] = await Promise.all([
      sb.from('airports').select('iata_code, name, city').eq('is_active', true).order('name'),
      sb.from('lounges').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ])
    loungeCount = count ?? 0
    airportLines = (airports ?? []).map(a =>
      `- [${a.iata_code} — ${a.city} (${a.name})](${BASE}/airports/${a.iata_code}): All lounges at ${a.city} airport with access requirements, amenities, and reviews.`
    ).join('\n')
  }

  const body = `# AirportLounges.ca

> Canada's directory of airport lounges. Verified access requirements (Priority Pass, DragonPass, credit cards, airline status, day pass), amenities, opening hours, and traveller reviews for ${loungeCount} active lounges at every major Canadian airport.

## What this site answers

- "Which lounges at [Canadian airport] accept [card/membership]?"
- "What amenities does [specific lounge] have?"
- "When is [lounge] open and where exactly is it (gate, pier, terminal)?"
- "How do I get into an Air Canada Maple Leaf Lounge / Plaza Premium / Aspire / Desjardins Odyssey lounge?"
- "Is [lounge] open for my flight today?"

## Primary directories

- [All lounges (filterable)](${BASE}/lounges): Filter by airport, access pass, amenity, or live open/closed status.
- [All airports](${BASE}/airports): Every Canadian airport with verified lounge data.
- [Interactive airport map](${BASE}/airports/map): Geographic overview of all covered airports.
- [Blog & guides](${BASE}/blog): Editorial guides on access, etiquette, and lounge selection.

## Airports covered

${airportLines}

## Per-airport navigation

Each airport page (\`/airports/{IATA}\`) provides:
- Lounge listings with pier/terminal/gate location, hours, access rules.
- Indoor terminal map (where Mapbox indoor coverage exists).
- Walking navigation: \`/airports/{IATA}/navigate\` — interactive lounge finder with GPS pins.

## Per-lounge pages

Each lounge page (\`/airports/{IATA}/lounges/{slug}\`) includes:
- Access types: airline_status | class_of_service | credit_card | membership | day_pass.
- Opening hours by day of week, plus notable closures.
- Amenities (Wi-Fi, showers, hot food, bar, business centre, kids' area, etc.).
- Photo gallery, traveller reviews, average rating.
- Address details: terminal, pier, gate, level, post-security indicator.

## Data freshness

- Lounge data revalidates every 5 minutes via Next.js ISR.
- Hours, closures, and access rules are sourced from operator websites; major changes (e.g. renovation closures) are noted in the lounge description.

## Contact

- General: hello@airportlounges.ca
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
