# LifeSpring Admin

Internal admin and operations portal for LifeSpring staff — manage doctors,
appointments, patients, payments, and reports. It is a thin Next.js frontend: it
does not talk to the database directly, it calls the LifeSpring backend API.

## Where it fits

LifeSpring is a telemedicine platform. This app is one of several frontends; it
reads and writes everything through the backend REST API (`/v1`). It renders no
data of its own.

For the full system map (all repos, how they connect), see the website repo:
https://github.com/lifespring-apps/lifespring-website#readme

## Tech stack

- **Next.js 14** (React 18, App Router, `output: standalone`)
- **Ant Design** + Tailwind CSS for UI, ECharts for charts
- Runs on **port 3008** in development (`next dev -p 3008`)

> Note on ports: the dev server and the deployed/tester instance both use
> **3008**. The production Docker image, however, listens on **3001** internally
> (see its `Dockerfile`). The `docker compose` setup below publishes the
> container on the familiar **3008** so nothing else changes for you.

## Prerequisites

- **Node.js 20** and **npm** (`node -v` should print `v20.x`)
- **Git**
- **Docker** — only needed for the "Run in Docker" section and full-stack testing

## Set up & run locally

### 1. Clone the repo

```bash
git clone git@github.com:lifespring-apps/lifespring-admin.git
cd lifespring-admin
```

**Expected output**

```
Cloning into 'lifespring-admin'...
remote: Enumerating objects: ...
Receiving objects: 100% ...
Resolving deltas: 100% ...
```

### 2. Install dependencies

This project pins some peer dependencies loosely, so install with
`--legacy-peer-deps` (npm otherwise errors on peer-dependency conflicts):

```bash
npm install --legacy-peer-deps
```

**Expected output**

```
added 512 packages, and audited 513 packages in 25s

found 0 vulnerabilities
```

### 3. Create your environment file

There is no `.env.example` in this repo. Create a `.env.local` (Next.js loads it
automatically in development and it is git-ignored) with the one variable the app
needs to reach the backend:

```bash
cat > .env.local <<'EOF'
# Backend API base URL — MUST end with a trailing slash.
# The app builds request paths as `${NEXT_PUBLIC_API_BASE_URL}v1/...`.
NEXT_PUBLIC_API_BASE_URL=https://api.staging.lifespringint.com/
EOF
```

Point it at the shared **staging** backend (above), or at a local backend you are
running yourself (e.g. `http://localhost:3002/`). The trailing slash matters.

See [Environment variables](#environment-variables) for the other optional vars.

### 4. Start the dev server

```bash
npm run dev
```

This first installs a local `pre-push` git hook (runs `npm run build` before every
push), then starts Next.js on port 3008.

**Expected output**

```
> admin@0.1.0 dev
> npm run setup-pre-push && next dev -p 3008

  ▲ Next.js 14.2.35
  - Local:        http://localhost:3008

 ✓ Starting...
 ✓ Ready in 2.1s
```

Open http://localhost:3008 in your browser.

## Tests & checks

There is no unit-test suite yet (Jest will be added as it lands). Today the
blocking check is lint:

```bash
npm run lint
```

**Expected output**

```
> admin@0.1.0 lint
> next lint

✔ No ESLint warnings or errors
```

For end-to-end testing across all services, use the Docker tester environment in
**lifespring-website** — it builds every app from source and runs the whole stack
locally. See `lifespring-website/README.md` and `tester/TESTING.md`.

## Deployment

Branch flow: `feature → main` (PR). Every merge to `main` deploys the staging box
(`staging.yml`). Production = a **GitHub Release** (tag `vX.Y.Z`, target `main`):
`release.yml` builds that tag and deploys it (the tag must be on `main` and that commit
must have a green staging deploy). PRs run the install+build check; a merge to `main` goes
straight to the Docker build + deploy — the image build is the check. CI builds
`ghcr.io/lifespring-apps/lifespring-admin:<staging|production>` and redeploys by SSH
(`docker compose pull admin && docker compose up -d --no-deps admin`).

`NEXT_PUBLIC_*` values are baked into the image by the workflow's `build-args` — a
value change is a rebuild, not an env edit. Full procedure and checklists:
[Production Release Runbook](https://github.com/lifespring-apps/lifespring-website/blob/main/docs/CUTOVER-RUNBOOK.md).

## Run in Docker

Run this frontend standalone (built from its own `Dockerfile`). It has no
dependencies of its own — it just needs a backend URL, which defaults to staging.

```bash
docker compose up --build
```

**Expected output**

```
[+] Building 0.0s (0/0)
 => [admin builder 5/6] RUN npm ci
 => [admin builder 6/6] RUN npm run build
 => [admin production ...] exporting to image
[+] Running 1/1
 ✔ Container lifespring-admin  Created
admin  |   ▲ Next.js 14.2.35
admin  |   - Local:        http://localhost:3001
admin  |  ✓ Ready in 300ms
```

Then open http://localhost:3008 (compose maps host **3008** → container **3001**).

Override the backend without editing files:

```bash
NEXT_PUBLIC_API_BASE_URL=http://host.docker.internal:3002/ docker compose up --build
```

> The API URL is a **client-bundle** value, so it is baked in at build time. The
> `docker-compose.yml` passes it as both a build arg and a runtime env var. Note:
> the current `Dockerfile` only declares `NEXT_PUBLIC_GOOGLE_MAP_KEY` and
> `NEXT_PUBLIC_PAHO` as build args — until it also declares
> `ARG NEXT_PUBLIC_API_BASE_URL`, the build-arg override only takes effect for
> server-side calls (server actions / server components), not the client bundle.

For the full multi-service stack, use the **lifespring-website** tester
environment (see [Tests & checks](#tests--checks)).

## Environment variables

This app reads the following. Only `NEXT_PUBLIC_API_BASE_URL` is required for local
dev. `NEXT_PUBLIC_*` vars are exposed to the browser and are baked in at build
time; the rest are read server-side. Secrets come from the team secret manager and
are never committed.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | **yes** | Backend API base URL (client + server). Must end with `/`. |
| `API_BASE_URL` | no | Server-side backend URL used by `src/types/Config.ts`; defaults to an internal service host. |
| `NEXT_PUBLIC_GOOGLE_MAP_KEY` | no | Google Maps JS API key (map features). |
| `NEXT_PUBLIC_PAHO` | no | MQTT/PAHO endpoint for real-time features. |
| `APP_MODE` | no | App mode flag (e.g. `production`). |
| `ADMIN_PUBLIC_URL` | no | Public URL of this admin instance. |
| `AMARLAB_PARTNER_ID`, `MEDEASY_BASE_URL`, `MEDEASY_PARTNER_TOKEN` | no | Third-party partner integrations. |

The repo ships a `.env.docker` with the container-oriented defaults for reference.

## Config (environments)

Production runs only on our stack since 2026-08-17 (`STACK=AWS` retired). Public URLs
are baked at build time; internal ones live in the box's `admin.env`.

| Variable | Class | staging | production |
|---|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` (client-side calls: exports, schedule actions) | PUBLIC, build-arg | `https://api.staging.lifespringint.com/` | `https://api2.lifespringint.com/` |
| `API_BASE_URL` (server-side) | INTERNAL, runtime env | `http://backend:3000` | `http://backend:3000` |
| `ADMIN_PUBLIC_URL` | PUBLIC, runtime env | `https://admin2.staging.lifespringint.com` | `https://admin2.lifespringint.com` |

Do not set `NEXT_PUBLIC_API_BASE_URL` in `admin.env` — it is ignored at runtime.
Hub: [Config & environments](https://github.com/lifespring-apps/lifespring-website#config--environments) · [Production Release Runbook](https://github.com/lifespring-apps/lifespring-website/blob/main/docs/CUTOVER-RUNBOOK.md).

