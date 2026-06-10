import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create your free account',
  description: 'Join AirportLounges.ca free — save lounges, write reviews, and get verified Canadian airport lounge data.',
  alternates: { canonical: 'https://www.airportlounges.ca/auth/signup' },
  robots: { index: false, follow: true },
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
