import { generateMetadata as loungeMetadata, renderLoungeDetail } from '../lounge-view'

// Staff layout override (`?v=v1` / `?v=v2`). Middleware rewrites those URLs
// here so the public lounge route can stay cached. This route is dynamic.
export const dynamic = 'force-dynamic'

export const generateMetadata = loungeMetadata

interface Props {
  params: Promise<{ iata: string; slug: string }>
  searchParams: Promise<{ v?: string }>
}

export default async function LoungeLayoutPreview({ params, searchParams }: Props) {
  const sp = await searchParams
  return renderLoungeDetail(params, sp.v)
}
