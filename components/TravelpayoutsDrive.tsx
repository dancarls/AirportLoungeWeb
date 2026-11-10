'use client'

import Script from 'next/script'

/**
 * Travelpayouts AI Drive — third-party JavaScript that auto-injects contextual
 * travel-affiliate placements (hotels via Booking.com, flights via Skyscanner,
 * activities via GetYourGuide, etc) into the page based on content.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * SECURITY / TRUST NOTES (read before touching):
 * ────────────────────────────────────────────────────────────────────────────
 * This script, once loaded, has full DOM access on airportlounges.ca. It can
 * read any DOM content, set cookies, inject content anywhere, and make
 * requests to Travelpayouts' network. Travelpayouts (emrldtp.cc) is a
 * legitimate aggregator but the usual third-party-JS cautions apply:
 *
 *   - The script content is pulled from emrldtp.cc and can change without
 *     a new deploy of our site (no SRI hash available).
 *   - It will inject affiliate markup that may compete with our own
 *     Finlywealth placements — watch the Finly dashboard for click drops.
 *   - It will set cookies and track visitors across the site.
 *
 * KILL SWITCH:
 *   Unset NEXT_PUBLIC_TRAVELPAYOUTS_DRIVE_ID in Vercel env and redeploy.
 *   The component renders nothing without the env var.
 *
 * STRATEGY:
 *   `afterInteractive` — loads after the page is interactive so it doesn't
 *   block LCP or TTI on content pages.
 */
export default function TravelpayoutsDrive() {
  const driveId = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_DRIVE_ID
  if (!driveId) return null

  // Travelpayouts encodes the site ID as base64 in the script filename.
  // The ?t= query param mirrors the raw ID.
  const encoded = Buffer.from(driveId).toString('base64').replace(/=+$/, '')
  const src = `https://emrldtp.cc/${encoded}.js?t=${driveId}`

  return (
    <Script
      src={src}
      strategy="afterInteractive"
      data-cmp-ab="2"
      data-noptimize="1"
      data-cfasync="false"
      data-no-defer="1"
    />
  )
}
