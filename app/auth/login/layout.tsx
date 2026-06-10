import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to AirportLounges.ca to save lounges, write reviews, and track your favourite Canadian airport lounges.',
  alternates: { canonical: 'https://www.airportlounges.ca/auth/login' },
  robots: { index: false, follow: true },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
