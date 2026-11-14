'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ReviewForm from '@/components/ReviewForm'

/**
 * Signed-in review form. The server page stays cacheable (it does not read
 * cookies). Logged-out HTML is the sign-in prompt; the client swaps in the
 * form after the browser session resolves.
 */
export default function ReviewAuthGate({
  loungeId,
  code,
  slug,
  loungeName,
  variant,
}: {
  loungeId: string
  code: string
  slug: string
  loungeName?: string
  variant: 'v1' | 'v2'
}) {
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()
    supabase.auth.getUser()
      .then(({ data }) => {
        if (!cancelled) setSignedIn(!!data.user)
      })
      .catch(() => {
        if (!cancelled) setSignedIn(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const loginHref = `/auth/login?redirectTo=/airports/${code}/lounges/${slug}`

  if (variant === 'v2') {
    if (signedIn) {
      return (
        <div className="bg-[#f4f3f0] p-5 rounded-xl">
          <h4 className="font-semibold text-[#0e2a38] mb-4">Share your experience</h4>
          <ReviewForm loungeId={loungeId} />
        </div>
      )
    }
    return (
      <div className="bg-[#f4f3f0] p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[#42474b]">Been to {loungeName}? Sign in to share your experience.</p>
        <Link
          href={loginHref}
          className="inline-flex items-center gap-2 bg-[#0e2a38] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0e2a38]/90 transition-colors shrink-0"
        >
          Sign in to review
        </Link>
      </div>
    )
  }

  if (signedIn) {
    return (
      <div className="bg-white border border-outline-variant/30 p-8 rounded-xl mb-8">
        <h4 className="font-bold text-lg mb-6">Write a Review</h4>
        <ReviewForm loungeId={loungeId} />
      </div>
    )
  }

  return (
    <div className="bg-white border border-outline-variant/30 p-8 rounded-xl mb-8 text-center">
      <p className="text-secondary mb-4">Sign in to share your experience</p>
      <Link
        href={loginHref}
        className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
      >
        Sign In to Review
      </Link>
    </div>
  )
}
