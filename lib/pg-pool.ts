/**
 * Serverless pool budget for the Contabo app role (30 connections).
 *
 * A Vercel isolate serves one page render at a time, but a burst opens many
 * isolates. `max: 1` caps each isolate at a single socket (20 concurrent
 * renders = 20 connections, under the role limit). `idleTimeoutSeconds`
 * closes that socket quickly once the render is done and the isolate stays
 * warm; `lib/db.ts` also ends the pool in `after()` so a frozen isolate does
 * not leave the socket open until TCP timeout.
 */
export const PG_POOL = {
  max: 1,
  idleTimeoutSeconds: 5,
  maxLifetimeSeconds: 60 * 5,
  connectTimeoutSeconds: 10,
  // Long enough for the next awaited query in the same render to reuse the
  // client, short enough that an idle isolate does not sit on a socket.
  idleCloseDelayMs: 50,
} as const
