import type { Metadata } from 'next'
import { generateMetadata as loungeMetadata, renderLoungeDetail } from '../lounge-view'

// Staff layout override (`?v=v1` / `?v=v2`). Middleware rewrites those URLs
// here so the public lounge route can stay cached. This route is dynamic.
// Direct visits to /preview must not be indexed.
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ iata: string; slug: string }>
  searchParams: Promise<{ v?: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const metadata = await loungeMetadata(props)
  return {
    ...metadata,
    robots: { index: false },
  }
}

export default async function LoungeLayoutPreview({ params, searchParams }: Props) {
  const sp = await searchParams
  return renderLoungeDetail(params, sp.v)
}
