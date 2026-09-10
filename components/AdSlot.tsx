/**
 * Reserved layout slot for a future display-ad network (Mediavine Journey /
 * Raptive / AdSense). Renders nothing visible until an ad network is enabled,
 * so the reader sees no placeholder text yet contributes no cumulative layout
 * shift (CLS) when ads later fill the space.
 *
 * Activation:
 *   1. Set NEXT_PUBLIC_AD_NETWORK to 'mediavine' or 'raptive' or 'adsense' in Vercel.
 *   2. Add the ad-network loader <Script> in app/layout.tsx head.
 *   3. Ad slots identified by `slot` prop will be filled by the network scripts.
 *
 * Until then, the reserved-height div preserves layout stability for the day
 * ads switch on — no page reflow, no reader disruption.
 */

interface Props {
  /** Ad network's slot identifier (Mediavine placeholder id, AdSense slot, etc.). */
  slot: string
  /** Visual size — matches the ad network's fixed unit sizes. */
  size?: 'sidebar' | 'in-article' | 'leaderboard' | 'sticky'
  className?: string
}

const SIZE_STYLES: Record<NonNullable<Props['size']>, string> = {
  sidebar:     'min-h-[280px] max-w-[300px]',   // 300 × 250 / 300 × 600
  'in-article':'min-h-[280px] w-full',           // Responsive in-content
  leaderboard: 'min-h-[100px] w-full max-w-[970px]', // 728 × 90 / 970 × 90
  sticky:      'min-h-[60px] w-full',            // Anchor
}

export default function AdSlot({ slot, size = 'in-article', className = '' }: Props) {
  const network = process.env.NEXT_PUBLIC_AD_NETWORK
  if (!network) {
    // No ad network configured — render an invisible reserved slot so future
    // ads land without shifting page content. Zero visual weight for readers.
    return (
      <div
        data-ad-slot={slot}
        data-ad-size={size}
        className={`ad-slot-reserved opacity-0 pointer-events-none ${SIZE_STYLES[size]} ${className}`}
        aria-hidden="true"
      />
    )
  }
  // When an ad network is enabled, this container is what the network fills.
  // The exact class / attribute pattern depends on the chosen network — set
  // during network activation.
  return (
    <div
      data-ad-slot={slot}
      data-ad-size={size}
      data-ad-network={network}
      className={`ad-slot ${SIZE_STYLES[size]} ${className}`}
    />
  )
}
