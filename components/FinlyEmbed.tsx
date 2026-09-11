import Script from 'next/script'
import { affiliate, AFFILIATE_REL } from '@/lib/affiliates'

interface Props {
  /**
   * Which FinlyWealth tool to embed. As of Sept 2026 the officially supported
   * embeddable tools are:
   *   - "credit-cards-compare"            — full comparison tool
   *   - "credit-card-interest-calculator" — debt payoff calculator
   * See https://www.finlywealth.com/embed for the current list.
   */
  tool: 'credit-cards-compare' | 'credit-card-interest-calculator'

  /**
   * Optional pre-filter attributes. FinlyWealth accepts (as of Sept 2026):
   *   institutions | networks | benefits | insurance | cardTypes
   *   rewardType | hasAnnualFee | creditScore | sortView
   * Exact values map to internal FinlyWealth codes — ask their rep for the
   * correct value strings for "airport lounge access" / "Aeroplan" if unsure.
   */
  filters?: Partial<Record<
    | 'institutions'
    | 'networks'
    | 'benefits'
    | 'insurance'
    | 'cardTypes'
    | 'rewardType'
    | 'hasAnnualFee'
    | 'creditScore'
    | 'sortView',
    string
  >>

  /** Pre-fill monthly spending totals to seed the recommendation engine. */
  spending?: string

  /**
   * Fallback CTA text shown if the embed script fails to load (e.g. blocked
   * by a browser extension, network error, script CDN downtime). The link
   * routes through the affiliate registry so we still earn commission.
   */
  fallbackHeading?: string
  fallbackLabel?: string

  /**
   * Fallback affiliate destination key. Defaults to the general comparison
   * tool. Use a more specific key (e.g. finlywealth-lounge-access-cards) if
   * the embed lives on a topic-specific landing page.
   */
  fallbackAffiliateKey?: Parameters<typeof affiliate>[0]
}

/**
 * Drops FinlyWealth's embedded comparison tool onto the page. Renders the
 * div FinlyWealth's embed.js script targets, loads that script, and shows a
 * fallback CTA button before/until the embed replaces its own content.
 *
 * The fallback stays visible in the initial HTML so:
 *   1. Google's crawler always sees a meaningful call-to-action + affiliate link
 *   2. A viewer with the script blocked (ad blocker, corporate firewall) still
 *      gets a working conversion path
 *   3. There's no cumulative-layout-shift when the embed finally renders
 */
export default function FinlyEmbed({
  tool,
  filters,
  spending,
  fallbackHeading = 'Compare Canadian credit cards',
  fallbackLabel = 'Open the Full Comparison Tool',
  fallbackAffiliateKey = 'finlywealth-compare-tool',
}: Props) {
  const embedAttrs: Record<string, string> = {
    'data-finly-tool': tool,
  }
  if (spending) embedAttrs['data-finly-spending'] = spending
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value) embedAttrs[`data-${key}`] = value
    }
  }

  return (
    <div className="finly-embed-container my-8">
      {/* Fallback CTA — visible until FinlyWealth's embed.js replaces the
          div's contents. Also the crawl-time / no-script conversion path. */}
      <div
        {...embedAttrs}
        className="bg-white border border-outline-variant/30 p-6 md:p-8 text-center min-h-[280px] flex flex-col items-center justify-center"
      >
        <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary block mb-3">
          Sponsored — FinlyWealth
        </span>
        <h3 className="font-headline-md text-primary mb-3">{fallbackHeading}</h3>
        <p className="text-sm text-secondary max-w-md mb-6 leading-relaxed">
          Loading the interactive tool — if it does not appear in a moment, use the button below.
        </p>
        <a
          href={affiliate(fallbackAffiliateKey)}
          target="_blank"
          rel={AFFILIATE_REL}
          className="inline-block bg-primary text-white px-8 py-3 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          {fallbackLabel}
        </a>
      </div>
      <Script
        src="https://finlywealth.com/embed.js"
        strategy="lazyOnload"
        async
      />
    </div>
  )
}
