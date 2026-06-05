import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for AirportLounges.ca — how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="bg-bone-white min-h-screen">
      <div className="max-w-3xl mx-auto px-gutter py-section-gap">

        <div className="mb-12">
          <span className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest">Legal</span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-[42px] text-primary mt-3 mb-4 leading-tight">Privacy Policy</h1>
          <p className="text-secondary">Last updated: June 2025</p>
        </div>

        <div className="prose max-w-none space-y-10 text-on-surface-variant">

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">1. Who We Are</h2>
            <p className="leading-relaxed">AirportLounges.ca is a Canadian online directory that provides information about airport lounges, terminal maps, and travel resources. We are based in Canada and our services are primarily directed at Canadian travellers.</p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">2. Information We Collect</h2>
            <p className="leading-relaxed mb-4">We collect information in the following ways:</p>
            <ul className="space-y-3 list-none">
              {[
                ['Account Information', 'When you create an account, we collect your name, email address, and password. Passwords are encrypted and never stored in plain text.'],
                ['Reviews and Content', 'When you submit a review or crowd report, we store the content you provide along with your account identifier and the date of submission.'],
                ['Usage Data', 'We use Google Analytics (GA4) to collect anonymous data about how visitors use our site, including pages viewed, time on site, and general geographic region. This data does not identify you personally.'],
                ['Cookies', 'We use session cookies for authentication (via Supabase) and analytics cookies (via Google Analytics). You may disable cookies in your browser settings, though some features may not function correctly.'],
              ].map(([title, body]) => (
                <li key={title} className="bg-white border border-outline-variant/30 p-5 rounded-lg">
                  <p className="font-semibold text-primary mb-1">{title}</p>
                  <p className="text-sm leading-relaxed">{body}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">3. How We Use Your Information</h2>
            <ul className="space-y-2 list-disc list-inside">
              {[
                'To create and manage your account',
                'To display your reviews and contributions on the site',
                'To send optional newsletter updates if you have subscribed',
                'To improve our website and services through analytics',
                'To respond to support inquiries',
              ].map(item => <li key={item} className="leading-relaxed">{item}</li>)}
            </ul>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">4. Third-Party Services</h2>
            <p className="leading-relaxed mb-4">We use the following third-party services which have their own privacy policies:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Supabase</strong> — database and authentication hosting</li>
              <li><strong>Vercel</strong> — website hosting and deployment</li>
              <li><strong>Google Analytics (GA4)</strong> — anonymous usage analytics</li>
              <li><strong>Google Maps</strong> — terminal location maps</li>
              <li><strong>Mapbox</strong> — interactive lounge location maps</li>
              <li><strong>Open-Meteo</strong> — weather data (no personal data shared)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">5. Data Retention</h2>
            <p className="leading-relaxed">We retain your account data for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us. Reviews may be retained in anonymized form for the integrity of our directory.</p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">6. Your Rights (PIPEDA)</h2>
            <p className="leading-relaxed mb-4">Under Canada's Personal Information Protection and Electronic Documents Act (PIPEDA), you have the right to:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate information</li>
              <li>Withdraw consent and request deletion of your data</li>
              <li>File a complaint with the Office of the Privacy Commissioner of Canada</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">7. Contact Us</h2>
            <p className="leading-relaxed">For any privacy-related questions or requests, please contact us at <a href="mailto:privacy@airportlounges.ca" className="text-primary underline">privacy@airportlounges.ca</a>.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-outline-variant/30 flex gap-6">
          <Link href="/terms" className="text-primary font-semibold text-sm hover:underline">Terms of Service →</Link>
          <Link href="/"     className="text-secondary text-sm hover:text-primary transition-colors">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
