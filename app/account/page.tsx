import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LoungeCard from '@/components/LoungeCard'
import ReviewCard from '@/components/ReviewCard'
import { User, Heart, Star } from 'lucide-react'
import type { Lounge, Review } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Account' }

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirectTo=/account')

  const [{ data: profile }, { data: savedLounges }, { data: myReviews }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('saved_lounges').select(`
      lounge:lounges(*, airport:airports(name, iata_code, city), amenities(*), images:lounge_images(*))
    `).eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('reviews').select('*, profile:profiles(display_name)').eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Profile header */}
      <div className="card p-6 mb-8 flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xl">
          {profile?.display_name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{profile?.display_name ?? 'Traveller'}</h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
          {profile?.home_airport && (
            <Link href={`/airports/${profile.home_airport}`} className="text-xs text-brand-600 mt-1 hover:underline">
              Home airport: {profile.home_airport}
            </Link>
          )}
        </div>
      </div>

      {/* Saved lounges */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-400" /> Saved Lounges ({savedLounges?.length ?? 0})
        </h2>
        {savedLounges && savedLounges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedLounges.map(({ lounge }) => lounge && (
              <LoungeCard key={(lounge as Lounge).id} lounge={lounge as Lounge} airportIata={(lounge as Lounge).airport?.iata_code} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-gray-400">
            <p className="font-medium">No saved lounges yet</p>
            <Link href="/lounges" className="btn-secondary text-sm mt-3 inline-flex">Browse lounges</Link>
          </div>
        )}
      </section>

      {/* My reviews */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-gold-500" /> My Reviews ({myReviews?.length ?? 0})
        </h2>
        {myReviews && myReviews.length > 0 ? (
          <div className="space-y-4">
            {(myReviews as Review[]).map(review => <ReviewCard key={review.id} review={review} />)}
          </div>
        ) : (
          <div className="card p-8 text-center text-gray-400">
            <p className="font-medium">No reviews yet</p>
            <p className="text-sm mt-1">Visit a lounge page to leave your first review</p>
          </div>
        )}
      </section>
    </div>
  )
}
