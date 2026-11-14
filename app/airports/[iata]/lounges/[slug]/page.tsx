// On-demand ISR. An empty param list skips the database during `next build`;
// the first request renders the lounge and caches it for `revalidate` seconds.
export const revalidate = 60
export const dynamicParams = true

export function generateStaticParams() {
  return []
}

export { default, generateMetadata } from './lounge-view'
