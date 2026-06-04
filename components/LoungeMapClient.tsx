'use client'

import dynamic from 'next/dynamic'

const LoungeMap = dynamic(() => import('./LoungeMap'), { ssr: false })

export default function LoungeMapClient(props: {
  latitude: number
  longitude: number
  name: string
  zoom?: number
}) {
  return <LoungeMap {...props} />
}
