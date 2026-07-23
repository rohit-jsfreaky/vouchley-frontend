# Vouchley — Architecture Rules (READ BEFORE BUILDING)

Two repos, one product. **Where code goes is not a preference — it's a rule.**

```
Vouchley/
  backend/    FastAPI + Postgres + Redis  — the ONLY place for logic, data, jobs
  frontend/   Next.js                      — presentation + a thin client of the API
```

## The rule

**All business logic, data, verification, external-service calls, background
jobs, and schedulers live in the BACKEND.** The frontend calls the backend and
renders the result. Nothing else.

### Backend (`backend/`) owns — no exceptions
- Every API and all business logic (verification, scoring, disposable/IP/domain checks).
- All datasets and their refresh (disposable lists, IP feeds, free-provider lists).
  Data lives in `app/data/` (or Redis/Postgres), refreshed by in-process
  schedulers (see "Scheduled work" below).
- All calls to external/3rd-party services (dns, free lookup APIs, MaxMind, Dodo…).
- Auth, credits, rate-limiting, persistence, caching (Redis), background workers.
- Public, keyless, IP-rate-limited endpoints for anything the marketing site needs
  to call without a login (e.g. `POST /v1/check` powers the hero + free tool).

### Frontend (`frontend/`) owns — and only this
- Pages, components, styling, SEO metadata, JSON-LD, sitemap, marketing copy.
- Calling the backend: browser via `lib/api.ts` (`apiGet`/`apiPost`, session cookie),
  or public endpoints via `fetch(${SITE.apiUrl}/v1/...)`.
- Static published assets that are genuinely files, not logic (e.g. a downloadable
  `public/disposable-domains.json` snapshot for SEO/devs — a *download*, never the
  source of truth for a live check).

### ❌ NEVER in the frontend
- **No business logic in Next.js API routes.** A `app/api/*` route may only proxy
  to the backend or do trivial BFF glue. It must never implement verification,
  disposable detection, MX/DNS lookups, external-API fallbacks, or own a dataset.
  (This exact mistake was made once — a full disposable-email checker was built as
  a Next route with the list in `public/`. It was moved to the backend. Don't repeat.)
- No datasets as the source of truth. No direct 3rd-party API calls for product logic.
- No cron/worker/scheduler logic.

> Litmus test before writing code in the frontend: *"Is this presentation, or is it
> logic/data/a network call for the product?"* If it's the latter, it goes in the backend
> and the frontend calls it.

## Scheduled / background work (the "worker + scheduler")

The backend runs a **single Uvicorn worker** (see `scripts/entrypoint.sh`) and deploys
as **one Docker container via Dokku** (`git:from-image`, see `.github/workflows/deploy.yml`).
Because of that, scheduled refresh is done with **in-process `asyncio` loops started in
the FastAPI lifespan** — this is the app's established pattern (`app/services/ip_intel/loader.py`
literally notes it "mirrors how the app already backgrounds work with asyncio").

- New scheduled job → add a loader module with `startup()`/`shutdown()` that launches an
  `asyncio` loop, and wire it into `app/main.py`'s `lifespan`. Run once on startup +
  on an interval. See `app/services/disposable/loader.py` for the disposable-list example.
- This needs **no Procfile process scaling** and works the instant you push. A standalone
  worker (`Procfile` `worker:` + `dokku ps:scale`) is available for future separation but
  is NOT required — the in-process loop is the default and the source of truth.
- Every refresh must write atomically (temp file + rename) and hot-reload the in-memory
  copy, and must **fail safe** (keep the last-good data if a source is down).

## Deploy

- **Backend:** push `main` → GitHub Actions builds the image → GHCR → Dokku auto-deploys
  (~1 min). Migrations run on container start (`alembic upgrade head`).
- **Frontend:** push `main` → auto-deploys (~30–40s).
- Monitoring: https://monitoring.getrevlio.com · Backend Actions:
  https://github.com/rohit-jsfreaky/vouchley-backend/actions
