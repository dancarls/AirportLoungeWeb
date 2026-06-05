import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for AirportLounges.ca — your rights and responsibilities when using our platform.',
}

export default function TermsPage() {
  return (
    <div className="bg-bone-white min-h-screen">
      <div className="max-w-3xl mx-auto px-gutter py-section-gap">

        <div className="mb-12">
          <span className="font-label-caps text-[10px] text-sand-dark uppercase tracking-widest">Legal</span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-[42px] text-primary mt-3 mb-4 leading-tight">Terms of Service</h1>
          <p className="text-secondary">Last updated: June 2025</p>
        </div>

        <div className="prose max-w-none space-y-10 text-on-surface-variant">

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">By accessing or using AirportLounges.ca ("the Site"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Site.</p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">2. Use of the Site</h2>
            <p className="leading-relaxed mb-4">You may use this Site for personal, non-commercial purposes. You agree not to:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Scrape, crawl, or systematically download content from the Site</li>
              <li>Submit false, misleading, or defamatory reviews or content</li>
              <li>Attempt to gain unauthorized access to any part of the Site or its systems</li>
              <li>Use the Site for any unlawful purpose</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">3. User Accounts</h2>
            <p className="leading-relaxed">You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must notify us immediately of any unauthorized use. We reserve the right to suspend or terminate accounts that violate these Terms.</p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">4. User-Generated Content</h2>
            <p className="leading-relaxed mb-4">When you submit a review, comment, or other content to the Site:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>You grant AirportLounges.ca a non-exclusive, royalty-free licence to display, reproduce, and distribute that content on the Site</li>
              <li>You confirm the content is accurate to the best of your knowledge and does not infringe any third-party rights</li>
              <li>You understand we may remove content that violates these Terms or our editorial standards</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">5. Accuracy of Information</h2>
            <p className="leading-relaxed">Lounge information on this Site — including access rules, operating hours, amenities, and pricing — is provided for informational purposes only. Conditions change frequently; we strongly recommend confirming details directly with the lounge or airport before travel. AirportLounges.ca is not responsible for inaccuracies or outdated information.</p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">6. Intellectual Property</h2>
            <p className="leading-relaxed">All content on this Site not contributed by users — including editorial copy, design, graphics, and code — is the property of AirportLounges.ca and is protected by Canadian copyright law. Lounge names and airline names are trademarks of their respective owners.</p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">7. Disclaimer of Warranties</h2>
            <p className="leading-relaxed">The Site is provided "as is" without any warranties, express or implied. We do not guarantee uninterrupted access to the Site or the accuracy of any content.</p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">8. Limitation of Liability</h2>
            <p className="leading-relaxed">To the maximum extent permitted by law, AirportLounges.ca shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Site, including damages from denied lounge access, travel disruption, or reliance on inaccurate information.</p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">9. Governing Law</h2>
            <p className="leading-relaxed">These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict of law principles.</p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">10. Changes to These Terms</h2>
            <p className="leading-relaxed">We may update these Terms from time to time. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms. The date at the top of this page indicates when the Terms were last updated.</p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">11. Contact</h2>
            <p className="leading-relaxed">Questions about these Terms? Contact us at <a href="mailto:legal@airportlounges.ca" className="text-primary underline">legal@airportlounges.ca</a>.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-outline-variant/30 flex gap-6">
          <Link href="/privacy" className="text-primary font-semibold text-sm hover:underline">Privacy Policy →</Link>
          <Link href="/"        className="text-secondary text-sm hover:text-primary transition-colors">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
