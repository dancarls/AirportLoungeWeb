import Link from 'next/link'
import { Plane } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <Plane className="w-5 h-5" />
              <span>Lounge<span className="text-gold-400">CA</span></span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Canada's most complete airport lounge directory. Real reviews, up-to-date access info, and live flight tracking.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/airports"        className="hover:text-white transition-colors">All Airports</Link></li>
              <li><Link href="/lounges"          className="hover:text-white transition-colors">All Lounges</Link></li>
              <li><Link href="/flights"          className="hover:text-white transition-colors">Flight Status</Link></li>
              <li><Link href="/lounges?access=priority-pass" className="hover:text-white transition-colors">Priority Pass Lounges</Link></li>
              <li><Link href="/lounges?access=amex"          className="hover:text-white transition-colors">Amex Platinum Lounges</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auth/signup" className="hover:text-white transition-colors">Create account</Link></li>
              <li><Link href="/auth/login"  className="hover:text-white transition-colors">Sign in</Link></li>
              <li><Link href="/account"     className="hover:text-white transition-colors">My saved lounges</Link></li>
              <li><Link href="/account"     className="hover:text-white transition-colors">My reviews</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-xs text-center">
          © {new Date().getFullYear()} LoungeCA. Lounge details subject to change — always verify with the lounge before travelling.
        </div>
      </div>
    </footer>
  )
}
