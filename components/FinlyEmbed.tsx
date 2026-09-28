import Script from 'next/script'
import { affiliate, AFFILIATE_REL } from '@/lib/affiliates'

/**
 * FinlyWealth embed filter values. Attribute names must be camelCase or all
 * lowercase (never hyphenated) per Shang @ FinlyWealth's onboarding email
 * 2026-09-27. Array-valued filters (benefits, networks, cardTypes, insurance,
 * institutions) accept a single string or a list — we serialise to a JSON
 * array string exactly as FinlyWealth expects. Plain-string filters
 * (rewardType, searchTerm, hasAnnualFee, creditScore, sortView) go in as-is.
 *
 * Notable values:
 *   - benefits: 'airport-lounge' shows every lounge-access card. Free-visit
 *     variants: 'airport-lounge-4', 'airport-lounge-6', 'airport-lounge-10',
 *     'airport-lounge-unlimited'. NOT 'lounge_access' — that value is
 *     rejected and the tool shows all cards unfiltered.
 *   - networks: 'amex' | 'visa' | 'mastercard'
 *   - rewardType: 'cashback' | 'points' | 'both'
 *   - searchTerm: any string, e.g. 'aeroplan'. Overrides `benefits`.
 */
export interface FinlyEmbedFilters {
  institutions?: string | string[]
  networks?: string | string[]
  benefits?: string | string[]
  insurance?: string | string[]
  cardTypes?: string | string[]
  rewardType?: 'cashback' | 'points' | 'both'
  hasAnnualFee?: 'true' | 'false'
  creditScore?: string
  sortView?: string
  searchTerm?: string
}

const ARRAY_FILTER_KEYS = new Set<keyof FinlyEmbedFilters>([
  'institutions',
  'networks',
  'benefits',
  'insurance',
  'cardTypes',
])

interface Props {
  /**
   * Which FinlyWealth tool to embed. Two are officially supported as of
   * Sept 2026:
   *   - "credit-cards-compare"            — full comparison tool
   *   - "credit-card-interest-calculator" — debt payoff calculator
   */
  tool: 'credit-cards-compare' | 'credit-card-interest-calculator'

  /** Optional pre-filters — see FinlyEmbedFilters for the accepted values. */
  filters?: FinlyEmbedFilters

  /** Pre-fill monthly spending totals to seed the recommendation engine. */
  spending?: string

  /** Fallback CTA text shown if the embed script fails to load. */
  fallbackHeading?: string
  fallbackLabel?: string

  /**
   * Fallback affiliate destination key. Defaults to the general comparison
   * tool. Use a more specific key (e.g. finlywealth-lounge-access-cards) if
   * the embed lives on a topic-specific landing page.
   */
  fallbackAffiliateKey?: Parameters<typeof affiliate>[0]
}

function serialiseFilterValue(key: keyof FinlyEmbedFilters, value: unknown): string | null {
  if (value === undefined || value === null || value === '') return null
  if (ARRAY_FILTER_KEYS.has(key)) {
    const arr = Array.isArray(value) ? value : [String(value)]
    if (arr.length === 0) return null
    return JSON.stringify(arr)
  }
  return String(value)
}

/**
 * Drops FinlyWealth's embedded comparison tool onto the page. Renders the
 * div FinlyWealth's embed.js script targets, loads that script, and shows a
 * fallback CTA button before/until the embed replaces its own content.
 *
 * Attribution: `data-affiliate` is set from NEXT_PUBLIC_AFF_FINLYWEALTH so
 * every link inside the rendered tool — card buttons and the "Powered by
 * FinlyWealth" footer — is credited to us. Without the env var set, the
 * embed still works but conversions are unattributed.
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

  const affiliateCode = process.env.NEXT_PUBLIC_AFF_FINLYWEALTH
  if (affiliateCode) embedAttrs['data-affiliate'] = affiliateCode

  if (spending) embedAttrs['data-finly-spending'] = spending

  if (filters) {
    for (const key of Object.keys(filters) as (keyof FinlyEmbedFilters)[]) {
      const serialised = serialiseFilterValue(key, filters[key])
      if (serialised !== null) embedAttrs[`data-${key}`] = serialised
    }
  }

  return (
    <div className="finly-embed-container my-8">
      {/* The target div. embed.js APPENDS the tool inside this div and leaves
          any existing children in place, so we keep the pre-load contents
          inside <noscript>. In a JS-enabled browser the div renders empty
          until embed.js populates it; script-blocked users get the fallback
          CTA (the crawl-time / affiliate-link conversion path). */}
      <div {...embedAttrs}>
        <noscript>
          <div className="bg-white border border-outline-variant/30 p-6 md:p-8 text-center min-h-[280px] flex flex-col items-center justify-center">
            <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary block mb-3">
              Sponsored — FinlyWealth
            </span>
            <h3 className="font-headline-md text-primary mb-3">{fallbackHeading}</h3>
            <p className="text-sm text-secondary max-w-md mb-6 leading-relaxed">
              This interactive tool needs JavaScript enabled. Use the button below to open the full comparison on FinlyWealth.
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
        </noscript>
      </div>
      <Script
        src="https://finlywealth.com/embed.js"
        strategy="lazyOnload"
        async
      />
    </div>
  )
}
