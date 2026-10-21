/**
 * GA4 traffic + affiliate-click report.
 *
 * Answers "how is my traffic and are my affiliate links getting any clicks"
 * by pulling directly from the Google Analytics Data API for the GA4 property
 * declared in app/layout.tsx (G-FM95J545RS → numeric property id in env).
 *
 * Setup (one-time):
 *   1. npm i -D @google-analytics/data
 *   2. In Google Cloud Console, create a service account, download its JSON key,
 *      and save it OUTSIDE the repo (e.g. C:\Users\danca\.ga4-report-sa.json).
 *   3. In GA4 → Admin → Property → Property access management → add the service
 *      account email as "Viewer".
 *   4. In GA4 → Admin → Property Settings, copy the numeric Property ID
 *      (looks like 456123789 — NOT the "G-…" measurement id).
 *   5. Add to .env.local:
 *        GA4_PROPERTY_ID=456123789
 *        GOOGLE_APPLICATION_CREDENTIALS=C:\Users\danca\.ga4-report-sa.json
 *
 * How to run:
 *   npx tsx scripts/ga4-report.ts                # last 7 days vs previous 7
 *   npx tsx scripts/ga4-report.ts --days=28      # last 28 vs previous 28
 *   npx tsx scripts/ga4-report.ts --days=7 --no-compare
 *
 * What it prints:
 *   - Sessions / users / pageviews with period-over-period delta
 *   - Traffic sources by channel
 *   - Top 10 pages
 *   - outbound_click + affiliate_click event totals
 *   - Affiliate clicks broken down by program (if the custom dimension is
 *     registered in GA4; otherwise by link domain)
 *   - Top outbound destinations
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// ─── Manual .env.local loader (same pattern as other scripts) ────────────────
const envFiles = ['.env.local', '.env'] as const
for (const filename of envFiles) {
  const path = resolve(process.cwd(), filename)
  if (!existsSync(path)) continue
  const contents = readFileSync(path, 'utf-8').replace(/^\uFEFF/, '')
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq < 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (key && !(key in process.env)) {
      process.env[key] = value
    }
  }
}

import { BetaAnalyticsDataClient } from '@google-analytics/data'

// ─── Args ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const daysArg = args.find((a) => a.startsWith('--days='))
const DAYS = daysArg ? Math.max(1, parseInt(daysArg.split('=')[1] ?? '7', 10)) : 7
const COMPARE = !args.includes('--no-compare')

// ─── Env ─────────────────────────────────────────────────────────────────────
const PROPERTY_ID = process.env.GA4_PROPERTY_ID
if (!PROPERTY_ID) {
  console.error('ERROR: GA4_PROPERTY_ID is not set. See header comment for setup.')
  process.exit(1)
}
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('ERROR: GOOGLE_APPLICATION_CREDENTIALS is not set. See header comment.')
  process.exit(1)
}

const property = `properties/${PROPERTY_ID}`
const client = new BetaAnalyticsDataClient()

// ─── Date helpers ────────────────────────────────────────────────────────────
type Range = { startDate: string; endDate: string; label: string }

function currentRange(days: number): Range {
  return { startDate: `${days - 1}daysAgo`, endDate: 'yesterday', label: `last ${days}d` }
}
function previousRange(days: number): Range {
  return {
    startDate: `${days * 2 - 1}daysAgo`,
    endDate: `${days}daysAgo`,
    label: `prev ${days}d`,
  }
}

function delta(current: number, previous: number): string {
  if (previous === 0) return current === 0 ? '  —' : '  new'
  const pct = ((current - previous) / previous) * 100
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(0)}%`
}

function fmt(n: number): string {
  return n.toLocaleString('en-CA')
}

function pad(s: string, n: number): string {
  return s.length >= n ? s.slice(0, n) : s + ' '.repeat(n - s.length)
}

function padL(s: string, n: number): string {
  return s.length >= n ? s : ' '.repeat(n - s.length) + s
}

// ─── Report primitives ──────────────────────────────────────────────────────
async function totals(range: Range) {
  const [res] = await client.runReport({
    property,
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
      { name: 'engagementRate' },
    ],
  })
  const row = res.rows?.[0]
  return {
    sessions: Number(row?.metricValues?.[0]?.value ?? 0),
    users: Number(row?.metricValues?.[1]?.value ?? 0),
    pageviews: Number(row?.metricValues?.[2]?.value ?? 0),
    engagementRate: Number(row?.metricValues?.[3]?.value ?? 0),
  }
}

async function trafficSources(range: Range) {
  const [res] = await client.runReport({
    property,
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10,
  })
  return (
    res.rows?.map((r) => ({
      channel: r.dimensionValues?.[0]?.value ?? '(unknown)',
      sessions: Number(r.metricValues?.[0]?.value ?? 0),
    })) ?? []
  )
}

async function topPages(range: Range, limit = 10) {
  const [res] = await client.runReport({
    property,
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit,
  })
  return (
    res.rows?.map((r) => ({
      path: r.dimensionValues?.[0]?.value ?? '(unknown)',
      views: Number(r.metricValues?.[0]?.value ?? 0),
    })) ?? []
  )
}

async function eventTotals(range: Range) {
  const [res] = await client.runReport({
    property,
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        inListFilter: { values: ['outbound_click', 'affiliate_click'] },
      },
    },
  })
  const out = { outbound_click: 0, affiliate_click: 0 }
  for (const r of res.rows ?? []) {
    const name = r.dimensionValues?.[0]?.value as 'outbound_click' | 'affiliate_click' | undefined
    if (!name) continue
    out[name] = Number(r.metricValues?.[0]?.value ?? 0)
  }
  return out
}

async function affiliateBreakdown(range: Range) {
  const dimensions: Array<{ dimName: string; label: string }> = [
    { dimName: 'customEvent:affiliate_program', label: 'affiliate_program' },
    { dimName: 'customEvent:link_domain', label: 'link_domain' },
  ]
  for (const { dimName, label } of dimensions) {
    try {
      const [res] = await client.runReport({
        property,
        dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
        dimensions: [{ name: dimName }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
          filter: { fieldName: 'eventName', stringFilter: { value: 'affiliate_click' } },
        },
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
        limit: 15,
      })
      const rows =
        res.rows?.map((r) => ({
          key: r.dimensionValues?.[0]?.value ?? '(not set)',
          count: Number(r.metricValues?.[0]?.value ?? 0),
        })) ?? []
      const total = rows.reduce((s, r) => s + r.count, 0)
      if (total > 0) return { label, rows }
    } catch {
      // Dimension not registered in GA4 → try the next one
    }
  }
  return { label: '(unregistered)', rows: [] as Array<{ key: string; count: number }> }
}

async function topOutboundDestinations(range: Range) {
  try {
    const [res] = await client.runReport({
      property,
      dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
      dimensions: [
        { name: 'customEvent:link_domain' },
        { name: 'pagePath' },
      ],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: { fieldName: 'eventName', stringFilter: { value: 'outbound_click' } },
      },
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit: 15,
    })
    return (
      res.rows?.map((r) => ({
        domain: r.dimensionValues?.[0]?.value ?? '(unknown)',
        page: r.dimensionValues?.[1]?.value ?? '(unknown)',
        count: Number(r.metricValues?.[0]?.value ?? 0),
      })) ?? []
    )
  } catch {
    return []
  }
}

// ─── Render ─────────────────────────────────────────────────────────────────
function hr() {
  console.log('─'.repeat(72))
}

function header(title: string) {
  console.log('')
  console.log(title)
  hr()
}

async function main() {
  const cur = currentRange(DAYS)
  const prev = previousRange(DAYS)

  console.log('')
  console.log(`AirportLounges.ca — GA4 report (property ${PROPERTY_ID})`)
  console.log(`Window: ${cur.label}${COMPARE ? `  vs  ${prev.label}` : ''}`)
  hr()

  const [curTotals, prevTotals] = await Promise.all([
    totals(cur),
    COMPARE ? totals(prev) : Promise.resolve(null),
  ])

  const rows: Array<[string, number, number | null]> = [
    ['Sessions', curTotals.sessions, prevTotals?.sessions ?? null],
    ['Users', curTotals.users, prevTotals?.users ?? null],
    ['Pageviews', curTotals.pageviews, prevTotals?.pageviews ?? null],
  ]
  for (const [name, c, p] of rows) {
    const line = `  ${pad(name, 14)} ${padL(fmt(c), 10)}`
    if (p !== null) {
      console.log(`${line}   (prev ${padL(fmt(p), 8)}   ${padL(delta(c, p), 6)})`)
    } else {
      console.log(line)
    }
  }
  console.log(`  ${pad('Engagement', 14)} ${padL((curTotals.engagementRate * 100).toFixed(1) + '%', 10)}`)

  header('Traffic sources')
  const sources = await trafficSources(cur)
  const sourceTotal = sources.reduce((s, r) => s + r.sessions, 0) || 1
  for (const row of sources) {
    const pct = ((row.sessions / sourceTotal) * 100).toFixed(0) + '%'
    console.log(`  ${pad(row.channel, 30)} ${padL(fmt(row.sessions), 8)}   ${padL(pct, 4)}`)
  }

  header(`Top ${Math.min(10, 20)} pages`)
  const pages = await topPages(cur, 10)
  for (const row of pages) {
    console.log(`  ${padL(fmt(row.views), 7)}   ${row.path}`)
  }

  header('Outbound + affiliate events')
  const events = await eventTotals(cur)
  console.log(`  outbound_click    ${padL(fmt(events.outbound_click), 8)}`)
  console.log(`  affiliate_click   ${padL(fmt(events.affiliate_click), 8)}`)

  const aff = await affiliateBreakdown(cur)
  header(`Affiliate clicks by ${aff.label}`)
  if (aff.rows.length === 0) {
    console.log('  (no affiliate_click events recorded, or custom dimensions')
    console.log('   not registered in GA4 → Admin → Custom definitions.')
    console.log('   Register "affiliate_program" and "link_domain" as event-scoped')
    console.log('   custom dimensions to see this breakdown next run.)')
  } else {
    for (const row of aff.rows) {
      console.log(`  ${pad(row.key, 30)} ${padL(fmt(row.count), 6)}`)
    }
  }

  const dests = await topOutboundDestinations(cur)
  if (dests.length > 0) {
    header('Top outbound destinations (domain × page)')
    for (const row of dests) {
      console.log(`  ${padL(fmt(row.count), 5)}   ${pad(row.domain, 26)} ${row.page}`)
    }
  }

  console.log('')
}

main().catch((err) => {
  console.error('')
  console.error('Report failed:', err instanceof Error ? err.message : err)
  if (err instanceof Error && /permission|denied|access/i.test(err.message)) {
    console.error('')
    console.error('If this is a permissions error: the service account email needs')
    console.error('Viewer access in GA4 → Admin → Property access management.')
  }
  process.exit(1)
})
