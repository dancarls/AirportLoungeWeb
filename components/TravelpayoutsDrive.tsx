/**
 * Travelpayouts AI Drive — third-party JavaScript that auto-injects contextual
 * travel-affiliate placements (Booking.com, Skyscanner, GetYourGuide, VRBO,
 * etc) into the page based on content.
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
 * WHY IT'S INLINE IN <head> (not next/script):
 *   Travelpayouts' install verifier scans the server-rendered HTML in
 *   <head> for their script tag. Using Next.js's <Script> component with
 *   "afterInteractive" strategy would inject it client-side at the end of
 *   <body>, which fails their check. This implementation exactly matches
 *   the IIFE snippet from their install page, embedded via Server Component
 *   render into <head>. The IIFE sets async=1 on the dynamically-created
 *   script element, so there's no performance penalty for loading in <head>.
 */
export default function TravelpayoutsDrive() {
  const driveId = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_DRIVE_ID
  if (!driveId) return null

  // Travelpayouts encodes the site ID as base64 in the script filename.
  // The ?t= query param mirrors the raw ID.
  const encoded = Buffer.from(driveId).toString('base64').replace(/=+$/, '')

  // Mirrors the exact snippet from Travelpayouts' install page — the IIFE
  // pattern they verify against. Keeping the markup identical to their
  // instructions (including the inline attributes) maximises the chance
  // their checker passes on the first try.
  const inline = `(function(){var s=document.createElement("script");s.async=1;s.setAttribute("data-cmp-ab","2");s.src='https://emrldtp.cc/${encoded}.js?t=${driveId}';document.head.appendChild(s);})();`

  return (
    <script
      data-cmp-ab="2"
      data-noptimize="1"
      data-cfasync="false"
      data-wpfc-render="false"
      data-no-defer="1"
      dangerouslySetInnerHTML={{ __html: inline }}
    />
  )
}
