/**
 * Static stand-in shown when Mapbox cannot create a WebGL context.
 * Same box on every map so a device without WebGL still has a sized placeholder.
 */
export default function MapUnavailable({
  lat,
  lng,
  className = '',
}: {
  lat?: number | null
  lng?: number | null
  className?: string
}) {
  const hasPoint = lat != null && lng != null && String(lat) !== '' && String(lng) !== ''
  return (
    <div className={`flex h-full w-full items-center justify-center bg-bone-white px-4 text-center text-sm text-secondary ${className}`}>
      <div className="border border-sand-dark/20 bg-bone-white px-6 py-5">
        <p>Map unavailable on this device.</p>
        {hasPoint && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener"
            className="mt-2 inline-block underline"
          >
            Open in Google Maps
          </a>
        )}
      </div>
    </div>
  )
}
