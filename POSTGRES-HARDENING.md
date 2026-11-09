# VPS Postgres Hardening — Tier 1 Runbook

_Last updated: 2026-11-04. Hardens the public-facing Postgres instances on 62.146.175.212 before adding a 4th (AirportLounges). Addresses the 4 containers currently bound to `0.0.0.0` so Vercel can reach them._

## Scope

| Container | Port | DB name | Status |
|---|---|---|---|
| `playaholbox-postgres` | **5434** | `playaholbox` | **In scope** |
| `regina-masonry-postgres` | ~~5440~~ | — | **Stopped 2026-11-04 — out of scope** |
| `easypdfviewer-postgres` | **5450** | `easypdfviewer` | **In scope** |
| `allaboard-postgres` | **5490** | `allaboard` | **In scope** |

Each public-port Postgres gets four hardening layers:

1. **SSL required** — reject every plaintext connection
2. **Strong app-user passwords** — 32-char random, rotated
3. **Fail2ban jail** — auto-ban IPs after 5 failed auths in 10 min
4. **Postgres superuser lockdown** — no `postgres` user accessible from the network

Expected downtime per DB: **~60 seconds** each (container restart). Do them one at a time so if something breaks you only have one site down.

---

## Prep — 10 min, no downtime

### 0.1 Baseline check (so we can roll back)

**VPS:**
```bash
# Current pg_hba.conf for each in-scope DB
for c in playaholbox-postgres easypdfviewer-postgres allaboard-postgres; do
  echo "=== $c ==="
  docker exec $c cat /var/lib/postgresql/data/pg_hba.conf | grep -v '^#' | grep -v '^$'
  echo "--- ssl setting ---"
  docker exec $c psql -U postgres -c "SHOW ssl;" 2>/dev/null \
    || docker exec $c psql -U playaholbox -c "SHOW ssl;" 2>/dev/null \
    || docker exec $c psql -U easypdfviewer -c "SHOW ssl;" 2>/dev/null \
    || docker exec $c psql -U allaboard -c "SHOW ssl;" 2>/dev/null
  echo "--- all roles ---"
  docker exec $c psql -U postgres -c "\du" 2>/dev/null \
    || docker exec $c psql -U playaholbox -c "\du" 2>/dev/null \
    || docker exec $c psql -U easypdfviewer -c "\du" 2>/dev/null \
    || docker exec $c psql -U allaboard -c "\du" 2>/dev/null
done
```

Save the output. If anything goes wrong in step 2 or 3, this is what we restore to.

### 0.2 Snapshot the three DBs

**VPS:**
```bash
mkdir -p ~/backups/hardening-$(date +%Y%m%d)
STAMP=$(date +%Y%m%d-%H%M%S)
for c in playaholbox-postgres easypdfviewer-postgres allaboard-postgres; do
  db=$(echo $c | sed 's/-postgres//')
  echo "Backing up $c/$db ..."
  docker exec $c pg_dump -U $db $db | gzip > ~/backups/hardening-$(date +%Y%m%d)/$db-$STAMP.sql.gz
done
ls -lh ~/backups/hardening-$(date +%Y%m%d)/
```

Three `.sql.gz` files should appear, all non-zero size.

---

## Layer 1 — SSL required (per DB, ~60 sec each)

Docker's `postgres:17-alpine` and `postgres:16-alpine` images ship a self-signed certificate at `/etc/ssl/private/ssl-cert-snakeoil.key` and `/etc/ssl/certs/ssl-cert-snakeoil.pem` — good enough for encrypted transport (the Vercel app pins the connection by hostname, not by certificate authority, when `sslmode=require` is used).

### 1.1 playaholbox (do first — lowest-traffic prod site)

**VPS:**
```bash
# Enable ssl in postgresql.conf
docker exec playaholbox-postgres bash -c "
  echo \"ssl = on\" >> /var/lib/postgresql/data/postgresql.conf
  echo \"ssl_cert_file = '/etc/ssl/certs/ssl-cert-snakeoil.pem'\" >> /var/lib/postgresql/data/postgresql.conf
  echo \"ssl_key_file  = '/etc/ssl/private/ssl-cert-snakeoil.key'\" >> /var/lib/postgresql/data/postgresql.conf
"

# Replace every external 'host' line with 'hostssl' + scram-sha-256
docker exec playaholbox-postgres sed -i -E 's/^host(\s+.*\s+0\.0\.0\.0\/0\s+.*)/hostssl\1/' /var/lib/postgresql/data/pg_hba.conf
docker exec playaholbox-postgres sed -i -E 's/^host(\s+.*\s+::\/0\s+.*)/hostssl\1/' /var/lib/postgresql/data/pg_hba.conf

# Ensure no 'trust' or 'md5' methods remain on external lines
docker exec playaholbox-postgres grep -E '^(hostssl|host)\s' /var/lib/postgresql/data/pg_hba.conf

# Restart just this container
docker restart playaholbox-postgres
sleep 5
docker logs playaholbox-postgres --tail 10
```

**Verify:**
```bash
# From the VPS itself — should succeed WITHOUT sslmode (localhost socket)
docker exec playaholbox-postgres psql -U playaholbox playaholbox -c "SELECT 'local ok';"

# From outside the container — should REQUIRE ssl now
docker run --rm postgres:17-alpine psql "postgres://playaholbox:PASSWORD@62.146.175.212:5434/playaholbox" -c "SELECT 'no-ssl';" 2>&1 | head -5
# Expected: "server does not support SSL, but SSL was required" OR connection refused
# WAIT NO — expected: server now REQUIRES ssl, so a client NOT using sslmode=require fails

docker run --rm postgres:17-alpine psql "postgres://playaholbox:PASSWORD@62.146.175.212:5434/playaholbox?sslmode=require" -c "SELECT 'ssl ok';"
# Expected: "ssl ok" row returned
```

**Update Vercel env var:** append `?sslmode=require` to the PlayaHolbox `DATABASE_URL` in Vercel Settings → Environment Variables. Redeploy. Smoke-test the live site.

### 1.2 easypdfviewer — same procedure, swap the name

```bash
docker exec easypdfviewer-postgres bash -c "
  echo \"ssl = on\" >> /var/lib/postgresql/data/postgresql.conf
  echo \"ssl_cert_file = '/etc/ssl/certs/ssl-cert-snakeoil.pem'\" >> /var/lib/postgresql/data/postgresql.conf
  echo \"ssl_key_file  = '/etc/ssl/private/ssl-cert-snakeoil.key'\" >> /var/lib/postgresql/data/postgresql.conf
"
docker exec easypdfviewer-postgres sed -i -E 's/^host(\s+.*\s+0\.0\.0\.0\/0\s+.*)/hostssl\1/' /var/lib/postgresql/data/pg_hba.conf
docker exec easypdfviewer-postgres sed -i -E 's/^host(\s+.*\s+::\/0\s+.*)/hostssl\1/' /var/lib/postgresql/data/pg_hba.conf
docker restart easypdfviewer-postgres
```

Update Vercel `DATABASE_URL` for EasyPDFViewer, add `?sslmode=require`, smoke-test.

### 1.3 allaboard — same

```bash
docker exec allaboard-postgres bash -c "
  echo \"ssl = on\" >> /var/lib/postgresql/data/postgresql.conf
  echo \"ssl_cert_file = '/etc/ssl/certs/ssl-cert-snakeoil.pem'\" >> /var/lib/postgresql/data/postgresql.conf
  echo \"ssl_key_file  = '/etc/ssl/private/ssl-cert-snakeoil.key'\" >> /var/lib/postgresql/data/postgresql.conf
"
docker exec allaboard-postgres sed -i -E 's/^host(\s+.*\s+0\.0\.0\.0\/0\s+.*)/hostssl\1/' /var/lib/postgresql/data/pg_hba.conf
docker exec allaboard-postgres sed -i -E 's/^host(\s+.*\s+::\/0\s+.*)/hostssl\1/' /var/lib/postgresql/data/pg_hba.conf
docker restart allaboard-postgres
```

Update Vercel `DATABASE_URL` for AllAboard, add `?sslmode=require`, smoke-test.

---

## Layer 2 — Rotate app-user passwords (per DB, no downtime)

The app user (`playaholbox`, `easypdfviewer`, `allaboard`) gets a brand-new 32-char password. The `postgres` superuser gets one too if it has one set.

### 2.1 Generate + rotate

**VPS — one DB at a time:**

```bash
# Example: playaholbox
NEW_PW=$(openssl rand -hex 24)
echo "NEW playaholbox password: $NEW_PW"    # ← write this down, you'll paste it into Vercel

docker exec playaholbox-postgres psql -U playaholbox -c "ALTER USER playaholbox WITH PASSWORD '$NEW_PW';"

# If you can log in as 'postgres' superuser, rotate that one too:
docker exec playaholbox-postgres psql -U postgres -c "ALTER USER postgres WITH PASSWORD '$(openssl rand -hex 24)';" 2>/dev/null \
  && echo "postgres superuser password rotated" \
  || echo "no postgres superuser on this instance (good)"
```

Repeat for `easypdfviewer-postgres` and `allaboard-postgres`, substituting the names.

### 2.2 Update Vercel

For each project, open Vercel → Settings → Environment Variables, replace the password portion of `DATABASE_URL`, redeploy, smoke-test.

Keep the old password typed somewhere for 15 min in case rollback is needed. After 15 min of clean traffic, forget it.

---

## Layer 3 — Fail2ban jail for Postgres

Fail2ban watches Docker container logs for repeated auth failures and adds an iptables rule to drop the offending IP.

### 3.1 Install fail2ban

**VPS:**
```bash
sudo apt update
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
```

### 3.2 Define a Postgres filter

**VPS:**
```bash
sudo tee /etc/fail2ban/filter.d/postgres-docker.conf > /dev/null <<'EOF'
[Definition]
# Matches Postgres auth failure lines inside docker log output
# Example log:
#   2026-11-04 03:48:09.001 UTC [12345] FATAL:  password authentication failed for user "foo"
#   ...  DETAIL:  Connection matched pg_hba.conf line ... from 203.0.113.42
failregex = ^.*password authentication failed for user.*$
            ^.*no pg_hba\.conf entry for host "<HOST>".*$
            ^.*Connection matched pg_hba\.conf line.*from <HOST>.*$
ignoreregex =
EOF
```

### 3.3 Define the jail

**VPS:**
```bash
sudo tee /etc/fail2ban/jail.d/postgres-docker.conf > /dev/null <<'EOF'
[postgres-playaholbox]
enabled  = true
filter   = postgres-docker
backend  = systemd
journalmatch = CONTAINER_NAME=playaholbox-postgres
port     = 5434
maxretry = 5
findtime = 600
bantime  = 86400
action   = iptables-allports[name=postgres-playaholbox]

[postgres-easypdfviewer]
enabled  = true
filter   = postgres-docker
backend  = systemd
journalmatch = CONTAINER_NAME=easypdfviewer-postgres
port     = 5450
maxretry = 5
findtime = 600
bantime  = 86400
action   = iptables-allports[name=postgres-easypdfviewer]

[postgres-allaboard]
enabled  = true
filter   = postgres-docker
backend  = systemd
journalmatch = CONTAINER_NAME=allaboard-postgres
port     = 5490
maxretry = 5
findtime = 600
bantime  = 86400
action   = iptables-allports[name=postgres-allaboard]
EOF
```

### 3.4 Confirm Docker is logging to journald

**VPS:**
```bash
docker info | grep -i "logging driver"
# Expected: "Logging Driver: journald"
# If it says "json-file", fail2ban can't read it via systemd journal — see Note A below.
```

**Note A** — if logging driver is `json-file` (the default on many Docker installs), the jail needs a different backend. Easy fix: set journald globally. Create `/etc/docker/daemon.json`:
```json
{ "log-driver": "journald" }
```
Then `sudo systemctl restart docker`. **This restarts every container on the box** — schedule it. Skip this step for now if that's not acceptable; the per-DB jail still works, we just point `backend = polling` + `logpath = /var/lib/docker/containers/<id>/<id>-json.log` instead, which is uglier but functional.

### 3.5 Reload fail2ban + test

**VPS:**
```bash
sudo systemctl restart fail2ban
sudo fail2ban-client status
sudo fail2ban-client status postgres-playaholbox
```

Expected output: 3 jails active, 0 banned IPs, 0 failed.

**Test the ban works:** from your laptop (or any machine), try 6 wrong-password logins in a row to the playaholbox DB. After the 5th, the 6th should hang/time out — you're banned. Unban yourself:
```bash
# VPS:
sudo fail2ban-client unban YOUR_IP
```

---

## Layer 4 — Verify postgres superuser lockdown (per DB)

**VPS, for each DB:**
```bash
docker exec playaholbox-postgres psql -U postgres -c "SELECT 1;" 2>&1 | head -3
# Expected: either "password authentication failed" (good — superuser has a password set)
# OR "role postgres does not exist" (even better — no network-accessible superuser)
# BAD: returns "1" — means postgres superuser has no password and is network-accessible
```

If any DB returns `1`, rotate that superuser's password immediately (step 2.1 above), OR drop the superuser:
```bash
docker exec playaholbox-postgres psql -U playaholbox -c "REVOKE ALL PRIVILEGES ON DATABASE playaholbox FROM postgres;" 2>/dev/null
```

Note: the `playaholbox` app user is NOT a superuser — don't DROP ROLE postgres, just lock it.

---

## Rollback

If at any step the live site breaks:

### Rollback SSL (Layer 1)
```bash
# VPS, for the affected container:
docker exec <container> sed -i 's/^hostssl/host/' /var/lib/postgresql/data/pg_hba.conf
docker exec <container> sed -i '/^ssl = on$/d' /var/lib/postgresql/data/postgresql.conf
docker restart <container>
# Then revert the ?sslmode=require in the Vercel DATABASE_URL and redeploy.
```

### Rollback password rotation (Layer 2)
```bash
# Set the user back to the old password:
docker exec <container> psql -U <user> -c "ALTER USER <user> WITH PASSWORD 'OLD_PASSWORD';"
# Revert Vercel env + redeploy.
```

### Rollback fail2ban (Layer 3)
```bash
# VPS:
sudo systemctl stop fail2ban
sudo systemctl disable fail2ban
```
No side effects to the DBs.

### Nuclear rollback — restore from snapshot (Layer 0.2)
```bash
STAMP=<the-stamp-from-0.2>
docker exec -i playaholbox-postgres psql -U playaholbox playaholbox < <(gunzip -c ~/backups/hardening-*/playaholbox-$STAMP.sql.gz)
```

---

## Sequence summary — recommended order

1. **Right now** — Layer 0 (prep + snapshot). No risk.
2. **Today, 1 DB at a time** — Layer 1 (SSL). Low risk. ~60 sec downtime each. Update Vercel env between DBs.
3. **This week** — Layer 2 (password rotation). No risk if done one at a time.
4. **This week** — Layer 3 (fail2ban). No downtime, adds protection going forward.
5. **One-time verify** — Layer 4 (superuser lockdown).

Total hands-on time: ~90 min across the three DBs.

---

## What this does NOT protect against

- **Vercel egress IP allowlisting** — Postgres is still reachable from anywhere; we're relying on SSL + strong password + fail2ban. That's good, not perfect.
- **Compromised app user** — if the app's user credentials leak, nothing here stops the attacker from reading everything that user has access to.
- **Zero-day in Postgres** — patch regularly: `docker pull postgres:17-alpine && docker compose up -d` per project.

The **Tier 3 "zero exposed ports" plan** (Cloudflare Tunnel or Tailscale) is the real fix for the exposure risk. That's a separate runbook. These three tiers close the easy attacks.
