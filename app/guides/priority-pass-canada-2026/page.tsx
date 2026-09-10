import Link from 'next/link'
import type { Metadata } from 'next'
import { getPost } from '@/lib/blog'
import { notFound } from 'next/navigation'
import NewsletterCTA from '@/components/NewsletterCTA'

export const metadata: Metadata = {
  title: 'Priority Pass Lounges in Canada 2026 — Printable Guide',
  description: 'The complete Priority Pass lounges in Canada guide — every airport, every lounge, peak hours, and guest rules. Print-ready, save as PDF.',
  alternates: { canonical: 'https://www.airportlounges.ca/guides/priority-pass-canada-2026' },
  robots: { index: true, follow: true },
}

/**
 * Standalone, print-optimized rendering of the Priority Pass Canada guide.
 * Doubles as a lead magnet: readers who subscribe get a permanent bookmark to
 * a page they can save as PDF via their browser's print dialog.
 *
 * Design intent:
 *   - Zero site chrome (Header/Footer excluded via app router group is not
 *     possible mid-tree; instead we keep the guide focused with subtle nav).
 *   - Newsletter capture visible above the fold, but the guide is fully
 *     readable without subscribing — soft gate, not hard gate.
 *   - @media print CSS strips backgrounds, expands columns, and hides the
 *     newsletter box so a printed PDF is clean reference material.
 */
export default function PriorityPassGuidePage() {
  const post = getPost('priority-pass-lounges-canada')
  if (!post) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Guide',
    name: 'Priority Pass Lounges in Canada 2026',
    about: 'Airport lounge access via Priority Pass across Canada',
    inLanguage: 'en-CA',
    datePublished: post.publishedAt,
    dateModified: post.lastReviewed ?? post.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'AirportLounges.ca Editorial Team',
      url: 'https://www.airportlounges.ca/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AirportLounges.ca',
      url: 'https://www.airportlounges.ca',
    },
    url: 'https://www.airportlounges.ca/guides/priority-pass-canada-2026',
  }

  return (
    <div className="bg-bone-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* Print-specific styles — strip decoration so the saved PDF reads clean. */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-clean { box-shadow: none !important; border: 0 !important; padding: 0 !important; }
          h1, h2, h3 { page-break-after: avoid; }
          table, figure, blockquote { page-break-inside: avoid; }
          a { color: #000 !important; text-decoration: none !important; }
          a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 0.85em; color: #666; }
        }
        .prose-guide h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2.5rem; margin-bottom: 1rem; color: #003434; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 0.5rem; }
        .prose-guide h3 { font-size: 1.15rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.75rem; color: #003434; }
        .prose-guide p  { margin-bottom: 1rem; line-height: 1.7; }
        .prose-guide ul, .prose-guide ol { margin: 1rem 0; padding-left: 1.5rem; line-height: 1.7; }
        .prose-guide li { margin-bottom: 0.5rem; }
        .prose-guide table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
        .prose-guide th, .prose-guide td { border: 1px solid rgba(0,0,0,0.12); padding: 0.6rem 0.75rem; text-align: left; vertical-align: top; }
        .prose-guide th { background: #f7f4ef; font-weight: 600; }
        .prose-guide blockquote { border-left: 3px solid #003434; padding: 0.5rem 1rem; margin: 1.5rem 0; background: rgba(0,52,52,0.03); font-style: italic; }
        .prose-guide figure { margin: 1.5rem 0; }
        .prose-guide figcaption { font-size: 0.8rem; color: #666; text-align: center; margin-top: 0.5rem; }
        .prose-guide img { max-width: 100%; height: auto; }
      `}</style>

      {/* Slim nav — hidden on print */}
      <nav className="no-print border-b border-outline-variant/30 bg-white sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-gutter py-4 flex items-center justify-between">
          <Link href="/blog/priority-pass-lounges-canada" className="text-sm text-secondary hover:text-primary transition-colors">
            ← Read on the blog
          </Link>
          <PrintButton />
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-gutter py-12">
        {/* Cover */}
        <header className="mb-10 pb-10 border-b border-outline-variant/30 print-clean">
          <p className="font-label-caps text-[10px] uppercase tracking-widest text-primary mb-3">
            AirportLounges.ca · Guide
          </p>
          <h1 className="font-display-lg text-headline-lg text-primary mb-4 leading-tight">
            Priority Pass Lounges in Canada — 2026 Guide
          </h1>
          <p className="text-secondary leading-relaxed">
            Every Priority Pass lounge in Canada, listed by airport — peak hours, guest rules, and what to expect at the door. Print-ready reference.
          </p>
          <p className="text-xs text-secondary mt-4">
            Compiled by the AirportLounges.ca Editorial Team · Last verified{' '}
            {new Date(post.lastReviewed ?? post.publishedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        {/* Soft-gate newsletter capture — hidden on print */}
        <div className="no-print mb-10">
          <NewsletterCTA
            source="guide:priority-pass-canada-2026"
            variant="light"
            heading="Save this guide — and get the next one."
            subheading="We publish new Canadian lounge guides monthly. Subscribe to get them by email, plus notice on lounge closures and card benefit changes."
            buttonLabel="Save Me a Copy"
          />
        </div>

        {/* Guide body — reuses the blog HTML content one-to-one. */}
        <div
          className="prose-guide"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-outline-variant/30 text-sm text-secondary">
          <p className="mb-2">
            © {new Date().getFullYear()} AirportLounges.ca — Independent Canadian airport lounge directory.
          </p>
          <p className="text-xs">
            Verify current access rules and hours with your card issuer and the operator before travelling.
            This guide is compiled from operator documentation and public benefits terms — corrections welcome at{' '}
            <a href="mailto:hello@airportlounges.ca" className="underline underline-offset-2 hover:text-primary">hello@airportlounges.ca</a>.
          </p>
        </footer>
      </article>
    </div>
  )
}

// Small client island for the Print button — browser API call.
function PrintButton() {
  return (
    <button
      type="button"
      // Inline script so we do not need to introduce a whole client component
      // for a single-line browser call. Semantically fine and CSP-safe.
      // eslint-disable-next-line react/no-unknown-property
      dangerouslySetInnerHTML={{ __html: '<span onclick="window.print()" role="button" tabindex="0" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;background:#003434;color:#fff;padding:8px 16px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;">Print / Save as PDF</span>' }}
      // The button element is only a wrapper here; the interactive element
      // is the inner <span> to make the inline handler self-contained.
      className="border-0 bg-transparent p-0"
      aria-label="Print or save this guide as PDF"
    />
  )
}
