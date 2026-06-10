import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-aviation-navy text-secondary-fixed pt-20 pb-10">
      <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-4 gap-gutter mb-20">

        {/* Brand */}
        <div className="col-span-1">
          <div className="font-headline-md text-headline-md text-bone-white mb-6">AirportLounges.ca</div>
          <p className="text-sm text-secondary-fixed/60 leading-relaxed mb-8">
            The Canadian directory for premium airport lounges, terminal maps, and traveller intelligence. Curated for the discerning transit experience.
          </p>
          <div className="flex gap-4">
            <a
              href="https://x.com/Airportloungeca"
              target="_blank"
              rel="noreferrer"
              aria-label="AirportLounges.ca on X"
              className="w-10 h-10 rounded-full border border-bone-white/10 flex items-center justify-center hover:bg-primary-fixed hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>alternate_email</span>
            </a>
            <a
              href="mailto:hello@airportlounges.ca"
              aria-label="Email AirportLounges.ca"
              className="w-10 h-10 rounded-full border border-bone-white/10 flex items-center justify-center hover:bg-primary-fixed hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span>
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-label-caps text-label-caps text-bone-white uppercase mb-8">Explore</h4>
          <ul className="space-y-4">
            <li><Link href="/lounges"  className="text-secondary-fixed/70 hover:text-primary-fixed transition-colors">Lounges</Link></li>
            <li><Link href="/airports" className="text-secondary-fixed/70 hover:text-primary-fixed transition-colors">Terminal Maps</Link></li>
            <li><Link href="/lounges?access=Priority+Pass" className="text-secondary-fixed/70 hover:text-primary-fixed transition-colors">Priority Pass Lounges</Link></li>
            <li><Link href="/lounges?sort=rating" className="text-secondary-fixed/70 hover:text-primary-fixed transition-colors">Best Rated</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-label-caps text-label-caps text-bone-white uppercase mb-8">Company</h4>
          <ul className="space-y-4">
            <li><Link href="/auth/signup" className="text-secondary-fixed/70 hover:text-primary-fixed transition-colors">Create Account</Link></li>
            <li><Link href="/auth/login"  className="text-secondary-fixed/70 hover:text-primary-fixed transition-colors">Sign In</Link></li>
            <li><Link href="/account"     className="text-secondary-fixed/70 hover:text-primary-fixed transition-colors">My Saved Lounges</Link></li>
            <li><Link href="/privacy" className="text-secondary-fixed/70 hover:text-primary-fixed transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms"   className="text-secondary-fixed/70 hover:text-primary-fixed transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* About / Resources */}
        <div className="col-span-1">
          <h4 className="font-label-caps text-label-caps text-bone-white uppercase mb-8">About</h4>
          <ul className="space-y-4">
            <li><Link href="/about" className="text-secondary-fixed/70 hover:text-primary-fixed transition-colors">About us</Link></li>
            <li><Link href="/about#sourcing" className="text-secondary-fixed/70 hover:text-primary-fixed transition-colors">How we verify data</Link></li>
            <li><Link href="/about#corrections" className="text-secondary-fixed/70 hover:text-primary-fixed transition-colors">Submit a correction</Link></li>
            <li><Link href="/flights" className="text-secondary-fixed/70 hover:text-primary-fixed transition-colors">Flight status</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-container-max mx-auto px-gutter pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-label-caps text-[10px] text-secondary-fixed/40 uppercase tracking-widest">
          © {new Date().getFullYear()} AirportLounges.ca. All rights reserved.
        </span>
        <div className="flex gap-8 text-[10px] font-label-caps uppercase tracking-widest text-secondary-fixed/40">
          <Link href="/sitemap.xml" className="hover:text-primary-fixed transition-colors">Sitemap</Link>
          <Link href="/privacy" className="hover:text-primary-fixed transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-primary-fixed transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
