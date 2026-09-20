'use client'

import { useEffect } from 'react'

/**
 * Fires a GA4 `outbound_click` (and, for known affiliate destinations,
 * `affiliate_click`) event on every off-site anchor click. Lets us actually
 * see click volume + which affiliate program in GA4 Reports — the raw
 * `?ref=xxx` on outbound links only tells the DESTINATION site the click
 * came from us; it doesn't reach our own GA4 without an event.
 *
 * Mounted once from the root layout. Uses a document-level capture-phase
 * listener so it survives clicks on nested spans inside <a> tags.
 */

const AFFILIATE_PROGRAMS: Record<string, string> = {
  'finlywealth.com': 'finlywealth',
  'ratehub.ca': 'ratehub',
  'prioritypass.com': 'priority_pass',
  'dragonpass.com': 'dragonpass',
  'creditcardgenius.ca': 'credit_card_genius',
  'amazon.ca': 'amazon_ca',
  'booking.com': 'booking',
  'plazapremiumlounge.com': 'plaza_premium',
  'executivelounges.com': 'aspire',
  'westjet.com': 'westjet',
  'americanexpress.com': 'amex',
}

function normaliseHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, '')
}

function identifyProgram(host: string): string | null {
  return AFFILIATE_PROGRAMS[normaliseHost(host)] ?? null
}

type GtagFn = (command: 'event', name: string, params: Record<string, unknown>) => void

declare global {
  interface Window {
    gtag?: GtagFn
    dataLayer?: unknown[]
  }
}

function sendEvent(name: string, params: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params)
    return
  }
  // Fallback — push to dataLayer directly in case gtag() isn't initialised
  // yet (e.g. early click before the GA script loads).
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ event: name, ...params })
}

export default function OutboundClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null
      if (!target) return
      const anchor = target.closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return

      let url: URL
      try {
        url = new URL(href, window.location.origin)
      } catch {
        return
      }

      // Only interested in http(s) outbound to a different host.
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return
      if (normaliseHost(url.host) === normaliseHost(window.location.host)) return

      const program = identifyProgram(url.host)
      const utmContent = url.searchParams.get('utm_content') ?? undefined
      const utmMedium = url.searchParams.get('utm_medium') ?? undefined
      const linkText = anchor.textContent?.trim().slice(0, 120) ?? undefined
      const pagePath = window.location.pathname

      const commonParams = {
        link_url: url.toString(),
        link_domain: normaliseHost(url.host),
        link_text: linkText,
        page_path: pagePath,
        ...(utmContent ? { utm_content: utmContent } : {}),
        ...(utmMedium ? { utm_medium: utmMedium } : {}),
      }

      sendEvent('outbound_click', commonParams)

      if (program) {
        sendEvent('affiliate_click', {
          ...commonParams,
          affiliate_program: program,
        })
      }
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return null
}
