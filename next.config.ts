import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  async redirects() {
    return [
      // Short IATA code URLs → airport pages
      { source: '/yvr', destination: '/airports/YVR', permanent: true },
      { source: '/yyz', destination: '/airports/YYZ', permanent: true },
      { source: '/yyc', destination: '/airports/YYC', permanent: true },
      { source: '/yul', destination: '/airports/YUL', permanent: true },
      { source: '/yeg', destination: '/airports/YEG', permanent: true },
      { source: '/yow', destination: '/airports/YOW', permanent: true },
      { source: '/ywg', destination: '/airports/YWG', permanent: true },
      { source: '/yyt', destination: '/airports/YYT', permanent: true },
      { source: '/yhz', destination: '/airports/YHZ', permanent: true },
      { source: '/ytz', destination: '/airports/YTZ', permanent: true },
      { source: '/yxe', destination: '/airports/YXE', permanent: true },
      { source: '/yqr', destination: '/airports/YQR', permanent: true },
      { source: '/yqb', destination: '/airports/YQB', permanent: true },
      // City name shortcuts
      { source: '/vancouver',   destination: '/airports/YVR', permanent: true },
      { source: '/toronto',     destination: '/airports/YYZ', permanent: true },
      { source: '/calgary',     destination: '/airports/YYC', permanent: true },
      { source: '/montreal',    destination: '/airports/YUL', permanent: true },
      { source: '/edmonton',    destination: '/airports/YEG', permanent: true },
      { source: '/ottawa',      destination: '/airports/YOW', permanent: true },
      { source: '/winnipeg',    destination: '/airports/YWG', permanent: true },
      { source: '/halifax',     destination: '/airports/YHZ', permanent: true },
      { source: '/stjohns',     destination: '/airports/YYT', permanent: true },
      { source: '/saskatoon',   destination: '/airports/YXE', permanent: true },
      { source: '/regina',      destination: '/airports/YQR', permanent: true },
      { source: '/quebec-city', destination: '/airports/YQB', permanent: true },
      { source: '/quebeccity',  destination: '/airports/YQB', permanent: true },
    ]
  },
}

// Wrap with Sentry only when a DSN is configured — keeps local dev fast.
export default process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: !process.env.CI,
      widenClientFileUpload: true,
      disableLogger: true,
      automaticVercelMonitors: true,
      sourcemaps: { disable: false },
    })
  : nextConfig
