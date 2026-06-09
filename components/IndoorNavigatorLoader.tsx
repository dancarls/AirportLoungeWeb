'use client'

import dynamic from 'next/dynamic'

const IndoorNavigator = dynamic(() => import('@/components/IndoorNavigator'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 min-h-0 flex items-center justify-center bg-bone-white">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="font-label-caps text-[11px] text-primary">LOADING NAVIGATOR</span>
      </div>
    </div>
  ),
})

export default IndoorNavigator
