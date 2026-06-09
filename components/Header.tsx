'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const NAV = [
  { href: '/lounges',      label: 'Lounges' },
  { href: '/airports',     label: 'Airports' },
  { href: '/airports/map', label: 'Maps' },
  { href: '/blog',         label: 'Guides' },
]

export default function Header() {
  const pathname = usePathname()
  const [dark, setDark]   = useState(false)
  const [open, setOpen]   = useState(false)
  const [user, setUser]   = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  const toggleDark = () => {
    const html = document.documentElement
    html.classList.toggle('dark')
    setDark(html.classList.contains('dark'))
  }

  const signOut = async () => {
    await createClient().auth.signOut()
    setUser(null)
  }

  return (
    <header className="sticky top-0 z-50 bg-bone-white/95 dark:bg-aviation-navy/95 border-b border-sand-dark/20 dark:border-outline-variant/20 h-20 flex items-center">
      <div className="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto">

        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">
              AirportLounges.ca
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={label}
                href={href}
                className={`font-label-caps text-label-caps transition-colors pb-1 ${
                  active
                    ? 'text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed'
                    : 'text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-full hover:bg-champagne-glint dark:hover:bg-primary-container transition-colors"
            aria-label="Toggle dark mode"
          >
            <span className="material-symbols-outlined text-primary dark:text-primary-fixed" style={{ fontSize: '22px' }}>
              {dark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Auth */}
          {user ? (
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/account" className="font-label-caps text-label-caps text-secondary hover:text-primary transition-colors">
                My Account
              </Link>
              <button onClick={signOut} className="font-label-caps text-label-caps text-secondary hover:text-primary transition-colors">
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="hidden lg:block font-label-caps text-label-caps text-secondary hover:text-primary transition-colors">
              Sign in
            </Link>
          )}

          <Link
            href="/lounges"
            className="hidden lg:block bg-primary text-on-primary px-6 py-3 font-label-caps text-label-caps hover:opacity-90 transition-all uppercase tracking-widest"
          >
            Find a Lounge
          </Link>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setOpen(o => !o)} aria-label="Menu">
            <span className="material-symbols-outlined text-primary">
              {open ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-20 left-0 w-full bg-bone-white dark:bg-aviation-navy border-b border-sand-dark/20 px-gutter pb-6 space-y-4 md:hidden">
          {NAV.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="block font-label-caps text-label-caps text-secondary hover:text-primary transition-colors py-2"
            >
              {label}
            </Link>
          ))}
          <Link href="/lounges" onClick={() => setOpen(false)} className="block bg-primary text-on-primary px-6 py-3 font-label-caps text-label-caps uppercase tracking-widest text-center">
            Find a Lounge
          </Link>
          {user ? (
            <>
              <Link href="/account" className="block text-sm text-secondary py-1">My Account</Link>
              <button onClick={signOut} className="block text-sm text-secondary py-1">Sign out</button>
            </>
          ) : (
            <Link href="/auth/login" className="block text-sm text-secondary py-1">Sign in</Link>
          )}
        </div>
      )}
    </header>
  )
}
