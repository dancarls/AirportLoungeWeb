# AirportLounges.ca — Supabase → VPS Migration Plan

_Revised 2026-11-05. Zero-risk, phased, seamless cutover (~60 sec visible downtime). Everything is built beside production; the cutover is a Vercel env-var swap. Supabase stays alive for 7 days as a rollback safety net._

---

## End state

| What | From | To |
|---|---|---|
| Database | Supabase Postgres | `airportlounges-postgres` on VPS port **5500**, DB `airportlounges`, user `airportlounges` |
| Auth | Supabase Auth (`@supabase/ssr`) | Auth.js magic-link (same pattern as ManageSM / PlayaHolbox / EasyPDFViewer) |
| Storage | Supabase Storage `lounge-images` bucket | Reuse existing VPS `minio` container; new bucket `airportlounges-images`, exposed at `cdn.airportlounges.ca` via Caddy |
| ORM | `@supabase/supabase-js` queries | Drizzle ORM + `postgres` driver |
| Next.js hosting | Vercel | **Vercel (unchanged)** |

**Cost delta:** –$25/mo Supabase, +$0 VPS (already paid), +$0.15/mo optional off-VPS backup.

---

## Infrastructure facts (from VPS audit 2026-11-04)

- Host: Contabo VMI, Ubuntu 24, kernel 6.8, 11 GB RAM (4.5 GB free), 193 GB disk (157 GB free)
- Reverse proxy: **Caddy** at `/opt/reverse-proxy/` with site snippets in `/opt/reverse-proxy/sites.d/`
- Object storage: **Minio** already running (container `minio`, console 127.0.0.1:9001, API on docker network)
- Postgres ports in use: 5432, 5433, 5434, 5440, 5450, 5460, 5470, 5480, 5490
- **Next free: 5500** (fits the gap pattern)
- Project directory convention: `/opt/<project>/`
- Backup script convention: `/opt/<project>/backup.sh` → `/opt/<project>/backups/<project>-YYYYMMDDTHHMMSSZ.sql.gz` via cron at 3-4am
- Postgres public-exposure pattern (used by playaholbox, easypdfviewer, allaboard): bind 0.0.0.0, enforce SSL + scram-sha-256 (see POSTGRES-HARDENING.md)

---

## Phase overview

| Phase | What | Risk | Time | Touches prod? |
|---|---|---|---|---|
| 1 | Spin up VPS Postgres + Minio bucket + Caddy site | None | 30 min | No |
| 2 | Dump Supabase schema + data, restore to VPS | None | 30 min | No |
| 3 | Rewrite data layer in app to Drizzle (on a feature branch) | None | 3-4 hrs | No |
| 4 | Swap Supabase Auth → Auth.js (on same branch) | None | 2-3 hrs | No |
| 5 | Move image files to Minio + rewrite URL constants | None | 1-2 hrs | No |
| 6 | **Pre-flight preview deploy** (Vercel preview pointing at VPS) | None | 24-48 hrs soak | No (preview URL only) |
| 7 | **Cutover**: delta sync + env swap + redeploy | ~60 sec downtime | 15 min window | **Yes** |
| 8 | Monitor 7 days, then shut down Supabase | None | 1 week elapsed | No |

Phases 1–6 can span several days; nothing is time-pressed. Phase 7 is scheduled for a quiet window (recommend 3am Pacific / 11am UTC Tuesday — low AirportLounges traffic).

---

## Phase 1 — VPS infrastructure (30 min, no prod impact)

### 1.1 Create the project directory

**VPS:**
```bash
sudo mkdir -p /opt/airport-lounges/{postgres/data,backups}
sudo chown -R danadmin:danadmin /opt/airport-lounges
cd /opt/airport-lounges
```

### 1.2 Postgres container

**VPS:** create `/opt/airport-lounges/docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:17-alpine
    container_name: airportlounges-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: airportlounges
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: airportlounges
      POSTGRES_INITDB_ARGS: "--auth-host=scram-sha-256"
    command:
      - postgres
      - -c
      - ssl=on
      - -c
      - ssl_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
      - -c
      - ssl_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
    ports:
      - "0.0.0.0:5500:5432"
    volumes:
      - ./postgres/data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U airportlounges"]
      interval: 10s
      timeout: 5s
      retries: 5
```

```bash
# VPS:
echo "POSTGRES_PASSWORD=$(openssl rand -hex 32)" > /opt/airport-lounges/.env
chmod 600 /opt/airport-lounges/.env
cd /opt/airport-lounges && docker compose up -d
docker compose logs --tail 20
```

Verify `docker ps | grep airportlounges-postgres` shows `(healthy)` and port 5500 is listening.

**After init, force hostssl in pg_hba.conf** (matches POSTGRES-HARDENING.md Layer 1):
```bash
docker exec airportlounges-postgres sed -i -E 's/^host(\s+.*\s+0\.0\.0\.0\/0\s+.*)/hostssl\1/' /var/lib/postgresql/data/pg_hba.conf
docker exec airportlounges-postgres sed -i -E 's/^host(\s+.*\s+::\/0\s+.*)/hostssl\1/' /var/lib/postgresql/data/pg_hba.conf
docker restart airportlounges-postgres
```

### 1.3 Minio bucket (reuse existing container)

**VPS:**
```bash
# Grab the Minio root creds from wherever your minio compose lives — probably ~/minio or /opt/minio
cat ~/minio/.env 2>/dev/null || cat /opt/minio/.env 2>/dev/null
# Paste the MINIO_ROOT_USER / MINIO_ROOT_PASSWORD into the next command:

docker exec minio mc alias set local http://localhost:9000 MINIO_ROOT_USER MINIO_ROOT_PASSWORD
docker exec minio mc mb local/airportlounges-images
docker exec minio mc anonymous set download local/airportlounges-images

# Create a scoped service account for the app (NOT root creds)
docker exec minio mc admin user svcacct add local MINIO_ROOT_USER --name airportlounges-app
# → outputs ACCESS_KEY and SECRET_KEY — write these down, going to Vercel env in Phase 7
```

### 1.4 Caddy site for cdn.airportlounges.ca

**Dan** — add a DNS A record `cdn.airportlounges.ca → 62.146.175.212` in your DNS panel (Cloudflare or wherever).

Then on VPS, create `/opt/reverse-proxy/sites.d/airportlounges.caddy`:

```caddy
cdn.airportlounges.ca {
    encode gzip zstd
    header Cache-Control "public, max-age=2592000, immutable"
    reverse_proxy minio:9000 {
        header_up Host {upstream_hostport}
    }
}
```

```bash
# VPS: the minio container needs to be reachable on the caddy docker network
docker network connect reverse-proxy_default minio 2>/dev/null || true
docker exec caddy caddy reload --config /etc/caddy/Caddyfile
# Test:
curl -I https://cdn.airportlounges.ca
# Expect: HTTP/2 403 or similar from Minio (meaning the proxy works, bucket just needs a path)
```

*If the Caddy network name is different*, run `docker inspect caddy --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}{{"\n"}}{{end}}'` to find it.

### 1.5 Backup script (match existing pattern)

**VPS:** `/opt/airport-lounges/backup.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
cd /opt/airport-lounges
docker exec airportlounges-postgres pg_dump -U airportlounges airportlounges \
  | gzip > backups/airportlounges-$STAMP.sql.gz
find backups -name 'airportlounges-*.sql.gz' -mtime +14 -delete
```

```bash
chmod +x /opt/airport-lounges/backup.sh
mkdir -p /opt/airport-lounges/backups
(crontab -l 2>/dev/null; echo "45 3 * * * /opt/airport-lounges/backup.sh >> /opt/airport-lounges/backups/backup.log 2>&1") | crontab -
crontab -l | grep airport
```

*Off-VPS B2 backup optional — $0.15/mo — add rclone block later if you want.*

**Phase 1 complete when:**
- `airportlounges-postgres` is `(healthy)` on port 5500
- `cdn.airportlounges.ca` returns HTTP (not DNS error)
- Manual run of `./backup.sh` produces a non-zero `.sql.gz`

---

## Phase 2 — Schema + data dump + restore (30 min, no prod impact)

### 2.1 Get Supabase Postgres connection string

Supabase Dashboard → Project Settings → Database → Connection string → **Session** (direct, not pooler). It looks like:
```
postgres://postgres.<ref>:<db-password>@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

(This is the DB password, **not** the `SUPABASE_SECRET_KEY`.)

### 2.2 Dump

**LOCAL:**
```bash
cd /c/Users/danca/airport-lounges-web
mkdir -p migration
# Schema (no owners, no RLS policies — we don't need Supabase-specific ACLs)
pg_dump --no-owner --no-acl --schema-only --schema=public \
  "postgres://postgres.<ref>:<password>@aws-0-us-east-1.pooler.supabase.com:5432/postgres" \
  > migration/schema.sql

# Data
pg_dump --no-owner --no-acl --data-only --schema=public --disable-triggers \
  "postgres://postgres.<ref>:<password>@aws-0-us-east-1.pooler.supabase.com:5432/postgres" \
  > migration/data.sql

ls -lh migration/
```

### 2.3 Restore to VPS

**LOCAL → VPS:**
```bash
scp migration/schema.sql migration/data.sql danadmin@62.146.175.212:/opt/airport-lounges/
```

**VPS:**
```bash
cd /opt/airport-lounges
cat schema.sql | docker exec -i airportlounges-postgres psql -U airportlounges airportlounges
cat data.sql   | docker exec -i airportlounges-postgres psql -U airportlounges airportlounges
```

### 2.4 Verify row counts

**VPS:**
```bash
docker exec airportlounges-postgres psql -U airportlounges airportlounges -c "
  SELECT schemaname, relname AS table, n_live_tup AS rows
  FROM pg_stat_user_tables
  ORDER BY n_live_tup DESC;"
```

**LOCAL:** compare against Supabase via a tiny node script using `SUPABASE_SECRET_KEY`. Every table's count must match. If not, stop and investigate.

**Phase 2 complete when:** row counts on VPS equal row counts on Supabase.

---

## Phase 3 — Rewrite data layer in Drizzle (3-4 hrs, feature branch)

### 3.1 Branch + install

**LOCAL:**
```bash
cd /c/Users/danca/airport-lounges-web
git checkout -b migrate-to-vps
npm install drizzle-orm postgres
npm install -D drizzle-kit @types/pg
```

### 3.2 Drizzle config + schema introspect

Create `drizzle.config.ts`:
```ts
import type { Config } from 'drizzle-kit'
export default {
  schema: './lib/db/schema.ts',
  out: './migration/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,  // postgres://airportlounges:PW@62.146.175.212:5500/airportlounges?sslmode=require
  },
} satisfies Config
```

Then:
```bash
export DATABASE_URL='postgres://airportlounges:<pw>@62.146.175.212:5500/airportlounges?sslmode=require'
npx drizzle-kit introspect
# → creates lib/db/schema.ts matching VPS tables
```

### 3.3 Create the db client

**LOCAL:** `lib/db/index.ts`:
```ts
import 'server-only'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is not set')

const client = postgres(connectionString, { prepare: false, max: 10 })
export const db = drizzle(client, { schema })
```

### 3.4 Query-by-query rewrite

List the Supabase call sites to migrate:
```bash
grep -rln "from '@/lib/supabase" app lib components scripts
```

For each file, convert Supabase `from('x').select()` calls to Drizzle `db.select().from(x)` equivalents. Target files:
- `app/page.tsx`
- `app/airports/page.tsx`, `app/airports/[iata]/page.tsx` (+ `app/fr/airports/{YUL,YYZ,YVR}/page.tsx`)
- `app/airports/[iata]/lounges/[slug]/page.tsx`
- `app/lounges/page.tsx`, `app/lounges/[collection]/page.tsx`
- `app/api/newsletter/route.ts`
- `app/api/operator-application/route.ts`
- `app/sitemap.ts`
- `lib/air-quality.ts`
- `lib/blog.ts` (if it reads DB)
- `scripts/*.mjs|.ts` (22 files — bulk sed where they share patterns)

### 3.5 Build + run

```bash
npm run build       # must pass
npm run dev
# Open localhost:3000 — every page should render from VPS Postgres
```

Keep `lib/supabase/admin.ts` + `lib/supabase/server.ts` **in the tree** through Phase 7 — they're the rollback safety net. Delete them in Phase 8.

**Phase 3 complete when:** `npm run build` is clean and every page renders real data from VPS.

---

## Phase 4 — Auth.js (2-3 hrs, same branch)

Follows the exact pattern you already have in ManageSM / PlayaHolbox / EasyPDFViewer. Install `next-auth@beta`, add the magic-link email provider, Drizzle adapter, `app/api/auth/[...nextauth]/route.ts`, update the `<Header>` sign-in widget.

Open question: **Resend vs Zoho SMTP** for the magic-link email transport (Zoho's transactional allowance covers this — not cold outreach).

If there are no real end-user accounts yet (only you as admin), we skip user export and start fresh.

**Phase 4 complete when:** sign-in works end-to-end on dev, `/account/*` protected routes redirect correctly.

---

## Phase 5 — Minio + image migration (1-2 hrs)

### 5.1 Migrate files from Supabase Storage

**LOCAL:** `scripts/migrate-storage.mjs` lists every file in the Supabase `lounge-images` bucket, downloads it, uploads to Minio `airportlounges-images`, verifies by size/count.

### 5.2 Rewrite URL constants

Across the repo, swap:
```
https://<supabase-ref>.supabase.co/storage/v1/object/public/lounge-images/...
→
https://cdn.airportlounges.ca/airportlounges-images/...
```

Grep sweep:
```bash
grep -rln "storage/v1/object/public/lounge-images" .
```
Hit: `app/airports/[iata]/page.tsx` HERO_IMAGE map + French mirrors, `scripts/upload-hero-image.mjs`, `scripts/upload-lounge-images.ts`, any `<Image src>` with a hardcoded URL.

Also update `next.config.js` `images.remotePatterns` to include `cdn.airportlounges.ca`.

**Phase 5 complete when:** every image on `localhost:3000` loads from `cdn.airportlounges.ca`, no Supabase storage URL in rendered HTML.

---

## Phase 6 — Pre-flight preview (24-48 hrs soak, no prod impact)

### 6.1 Push the `migrate-to-vps` branch

**LOCAL:**
```bash
git add -A
git commit -m "feat: migrate data layer to VPS Postgres + Auth.js + Minio

Behind-the-scenes rewrite of the data + auth + storage layers for Phase 7
cutover. Vercel preview deploy points at VPS; production remains on
Supabase until the env swap in Phase 7.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
git push -u origin migrate-to-vps
```

Vercel auto-deploys the branch to a preview URL like `airport-lounges-web-git-migrate-to-vps.vercel.app`.

### 6.2 Add VPS env vars to Vercel **Preview** scope (NOT Production yet)

- `DATABASE_URL = postgres://airportlounges:PW@62.146.175.212:5500/airportlounges?sslmode=require`
- `MINIO_ENDPOINT = https://cdn.airportlounges.ca`
- `MINIO_ACCESS_KEY = ...`
- `MINIO_SECRET_KEY = ...`
- `AUTH_SECRET = <openssl rand -hex 32>`
- `AUTH_URL = https://airport-lounges-web-git-migrate-to-vps.vercel.app`
- `AUTH_RESEND_KEY` **or** `AUTH_SMTP_*` (depending on email transport choice)

### 6.3 Smoke test the preview URL

- [ ] Home page loads with featured lounges
- [ ] `/airports/YUL`, `/airports/YYZ`, `/airports/YVR` render
- [ ] One lounge detail page with map + images
- [ ] French mirrors (`/fr/airports/YUL`)
- [ ] `/blog/*` posts render
- [ ] Newsletter signup form (write a test row, verify in VPS `newsletter_subscribers`)
- [ ] Operator-application form (same)
- [ ] Sign-in flow (magic link email arrives, click, session created)
- [ ] Air-quality widget writes to VPS `airport_air_quality`
- [ ] `/sitemap.xml` has every expected URL

Leave the preview running 24-48 hrs. Zero errors in Sentry.

**Phase 6 complete when:** every checkbox passes + 24+ hrs of no errors.

---

## Phase 7 — Cutover (15 min window, ~60 sec visible downtime)

Schedule for a low-traffic window — **recommend 3am Pacific Tuesday** (11am UTC).

### 7.1 Preflight — T-15 min

```bash
# LOCAL: last full backup from Supabase (safety net snapshot)
pg_dump --no-owner --no-acl --data-only --schema=public --disable-triggers \
  "postgres://postgres.<ref>:<pw>@aws-0-us-east-1.pooler.supabase.com:5432/postgres" \
  > migration/data-final.sql
wc -l migration/data-final.sql
```

### 7.2 Enable maintenance mode — T-2 min

Flip `MAINTENANCE_MODE=true` in Vercel → the newsletter + operator-application form components show "briefly unavailable, back in 2 min" banner. Read-only pages stay fully functional via ISR cache. Redeploy.

*(The maintenance flag gets added in Phase 3 as part of the branch so this is ready.)*

### 7.3 Delta sync — T-1 min

```bash
# LOCAL: re-dump the 3 tables that could've changed in-flight
for t in newsletter_subscribers operator_applications airport_air_quality; do
  pg_dump --no-owner --no-acl --data-only --table=public.$t \
    "postgres://postgres.<ref>:<pw>@..." > migration/delta-$t.sql
done
scp migration/delta-*.sql danadmin@62.146.175.212:/opt/airport-lounges/

# VPS: truncate + reinsert these 3 tables from fresh Supabase export
for t in newsletter_subscribers operator_applications airport_air_quality; do
  docker exec airportlounges-postgres psql -U airportlounges airportlounges -c "TRUNCATE $t CASCADE;"
  cat /opt/airport-lounges/delta-$t.sql | docker exec -i airportlounges-postgres psql -U airportlounges airportlounges
done
```

### 7.4 Flip Vercel env — T-0

In Vercel Settings → Environment Variables → **Production**:
- Add: `DATABASE_URL`, `MINIO_*`, `AUTH_*` (same values as preview)
- **Keep** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SECRET_KEY` for 7 days (rollback net)
- Set `MAINTENANCE_MODE=false`

Trigger a production deploy of the `migrate-to-vps` branch (merge to main or promote the preview).

### 7.5 Smoke test production — T+2 min

Repeat the Phase 6.3 checklist on `https://www.airportlounges.ca`. Every item must pass.

### 7.6 Rollback trigger (if smoke test fails)

1. Revert Vercel env vars `DATABASE_URL`, etc. — back to Supabase (Supabase vars still there)
2. Re-promote the previous production deploy (one click in Vercel)
3. Total rollback time: ~90 sec

**Phase 7 complete when:** production URL serves from VPS Postgres with zero Sentry errors for 30 min.

---

## Phase 8 — Monitor + cleanup (1 week elapsed, 1 hr at end)

### 8.1 Watch for 7 days

Daily:
```bash
# VPS:
docker logs airportlounges-postgres --since 24h 2>&1 | grep -i error
docker stats --no-stream airportlounges-postgres
```

### 8.2 Day 7 — final cleanup

1. Remove Supabase env vars from Vercel (all 3)
2. Delete `lib/supabase/admin.ts` and `lib/supabase/server.ts`
3. Remove `@supabase/supabase-js` and `@supabase/ssr` from `package.json`
4. Commit: `chore: remove Supabase dependencies after successful VPS migration`
5. Supabase Dashboard → **Pause project** (NOT delete yet)
6. Calendar reminder for 2026-12-05: **Delete paused Supabase project**

---

## Open decisions (need Dan's answer before Phase 1)

1. **Off-VPS backup to Backblaze B2?** ~$0.15/mo. Current VPS backups are on-box only (matches your other sites). Yes / No / Defer.
2. **Magic-link email transport (Phase 4)?** Resend (if you have an account) or Zoho SMTP.
3. **Pre-existing Supabase user accounts?** Any real users to preserve, or just you as admin?

---

## Sites still on Supabase — plan after AirportLounges is live

Based on project memories; needs a per-project `.env` audit to confirm:

| Site | DB today | Supabase use | Migration priority |
|---|---|---|---|
| **AirportLounges.ca** | Supabase | DB + Auth + Storage | **In flight** |
| **Solar-Quotes** | Supabase/Drizzle hybrid | Full | **Next** (easier — already partly Drizzle) |
| **Moringa.co** | Unknown | TBD | Audit after Solar-Quotes |
| Carlson's Travel | MDX files | None | N/A |
| PlayaHolbox, EasyPDFViewer, WalletMapper, OpportunityOS, AllAboard, ManageSM, Memebot | VPS | None | **Done** |

Once this runbook executes clean once, it becomes the template: Solar-Quotes clones it with different names, and should run in ~1/3 the time (schema smaller, no Supabase Auth to replace).

---

## Timeline estimate

- **Day 1**: Phase 1 + 2 → infra + data on VPS. **1 hr.**
- **Day 2-3**: Phase 3 + 4 + 5 → code rewrite. **6-9 hrs** split however you like.
- **Day 4**: Phase 6 → preview deploy. **10 min** to set up, then 24-48 hrs soak.
- **Day 5-6 (quiet Tuesday 3am)**: Phase 7 cutover. **15 min active, 60 sec visible downtime.**
- **Day 7-13**: Phase 8 watch.
- **Day 14**: Final cleanup. **30 min.**

**Total active work: ~12-15 hrs across 2 weeks. Visible downtime at cutover: ~60 seconds.**
