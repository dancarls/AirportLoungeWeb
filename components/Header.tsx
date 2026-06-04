'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plane, Menu, X, User, Heart, LogOut } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const NAV = [
  { href: '/airports', label: 'Airports' },
  { href: '/lounges',  label: 'All Lounges' },
  { href: '/flights',  label: 'Flight Status' },
]

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await createClient().auth.signOut()
    setUser(null)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-brand-700 text-lg">
            <Plane className="w-6 h-6" />
            <span>Lounge<span className="text-gold-500">CA</span></span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith(href)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link href="/account" className="btn-secondary text-sm py-2">
                  <User className="w-4 h-4" /> My Account
                </Link>
                <button onClick={signOut} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login"   className="btn-secondary text-sm py-2">Sign in</Link>
                <Link href="/auth/signup"  className="btn-primary  text-sm py-2">Join free</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setOpen(o => !o)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 space-y-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link href="/account" className="btn-secondary text-sm justify-center" onClick={() => setOpen(false)}>
                  <User className="w-4 h-4" /> My Account
                </Link>
                <button onClick={signOut} className="btn-secondary text-sm justify-center">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login"  className="btn-secondary text-sm justify-center" onClick={() => setOpen(false)}>Sign in</Link>
                <Link href="/auth/signup" className="btn-primary  text-sm justify-center" onClick={() => setOpen(false)}>Join free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
