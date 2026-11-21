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

/**
 * Exact-host → program-slug map. Keys are compared after `normaliseHost`
 * strips a leading `www.`, so `www.finlywealth.com` and `finlywealth.com`
 * both match `finlywealth.com`.
 *
 * Covers Travelpayouts short links (`booking.tpo.lu`, `airalo.tpo.lu`),
 * the Travelpayouts Drive asset host, and the Impact / partnerlinks hops
 * for TuGo and Airalo. Without these, Travelpayouts/TuGo/Airalo clicks
 * were only firing `outbound_click` in GA4 and were invisible under the
 * `affiliate_click` event — the November 2026 audit flagged this as the
 * reason the GA4 dashboard under-reported partner activity vs the
 * Travelpayouts dashboard.
 *
 * `__suffix` entries below cover redirect-chain hops whose exact
 * subdomain varies (e.g. `monos.sjv.io`, `tugo.pxf.io`). Suffix match
 * runs only when the exact map misses.
 */
const AFFILIATE_PROGRAMS: Record<string, string> = {
  // Primary card partner.
  'finlywealth.com': 'finlywealth',
  // Rate aggregators (keys defined in lib/affiliates.ts; mostly unused at
  // present — kept so a future activation starts counting immediately).
  'ratehub.ca': 'ratehub',
  'creditcardgenius.ca': 'credit_card_genius',
  // Direct brand links.
  'prioritypass.com': 'priority_pass',
  'dragonpass.com': 'dragonpass',
  'amazon.ca': 'amazon_ca',
  'americanexpress.com': 'amex',
  // Hotel / lounge operators.
  'booking.com': 'booking',
  'plazapremiumlounge.com': 'plaza_premium',
  'executivelounges.com': 'aspire',
  'aspirelounges.com': 'aspire',
  'westjet.com': 'westjet',
  // Travelpayouts — short links the live pages actually render.
  'booking.tpo.lu': 'booking_tp',
  'airalo.tpo.lu': 'airalo_tp',
  'tpo.lu': 'travelpayouts',
  'emrldtp.cc': 'travelpayouts_drive',
  'tp.media': 'travelpayouts',
  // Airalo landing + Impact redirect hops.
  'airalo.com': 'airalo',
  // TuGo partnerlinks / Impact flow.
  'partnerlinks.io': 'tugo',
  'tugo.partnerlinks.io': 'tugo',
  'shop.tugo.com': 'tugo',
  'tugo.com': 'tugo',
}

/**
 * Suffix-match fallback for redirect-chain hops whose exact subdomain is
 * dynamic. Checked only when the exact host map misses.
 */
const AFFILIATE_PROGRAM_SUFFIXES: Array<[string, string]> = [
  ['.pxf.io', 'impact'],            // Impact.com redirect (tugo.pxf.io, airalo.pxf.io)
  ['.sjv.io', 'impact'],            // Impact.com redirect (monos.sjv.io, tugo.sjv.io)
  ['.partnerlinks.io', 'tugo'],     // Any TuGo partnerlink subdomain
  ['.tpo.lu', 'travelpayouts'],     // Any Travelpayouts short-link subdomain
]

function normaliseHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, '')
}

function identifyProgram(host: string): string | null {
  const normalised = normaliseHost(host)
  const exact = AFFILIATE_PROGRAMS[normalised]
  if (exact) return exact
  for (const [suffix, program] of AFFILIATE_PROGRAM_SUFFIXES) {
    if (normalised.endsWith(suffix)) return program
  }
  return null
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
