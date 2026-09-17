# Mahapath — System Design Overview

A quick reference for explaining the architecture in interviews.

## Architecture Pattern: MVC (Model-View-Controller)

```
Request → Route → Middleware (auth/role checks) → Controller → Model (MongoDB) → View (EJS) → Response
```

- **Models** (`models/`) — Mongoose schemas, one per entity (Event, User, Facility, Incident, etc.)
- **Controllers** (`controllers/`) — business logic; talk to models, prepare data for views
- **Routes** (`routes/`) — map URLs + HTTP methods to controller functions, apply middleware
- **Views** (`views/`) — EJS templates, server-rendered HTML (not a separate frontend SPA)
- **Middleware** (`middleware/`) — cross-cutting concerns: auth (`requireAuth`, `requireRole`),
  notifications banner, applied globally or per-route

## Why server-rendered EJS instead of a separate React frontend?

For a project this size, server-rendered views mean one codebase, one deploy, no separate API
layer to maintain, and simpler auth (sessions instead of JWT + refresh tokens). The tradeoff:
less interactive/SPA-like feel. Worth mentioning you *understand* this tradeoff, not just that
you picked EJS by default.

## Data Model Design Decisions

- **Facility is one unified model** (not 5 separate collections for Ghat/Hospital/Police
  Booth/Parking/Medical Camp) — differentiated by a `type` enum field. Avoids schema duplication;
  the tradeoff is slightly less type-specific validation (e.g. `capacity` only makes sense for
  some types, so it's optional rather than required).
- **CrowdReport is append-only** — every report is a new document, not an update to a single
  "current density" field on Facility. This preserves history (useful for a "density over time"
  chart later) and avoids race conditions from concurrent updates. "Current" density is computed
  by querying the most recent report per facility, not stored redundantly.
- **Role-based access via a single `role` enum on User** (`visitor` / `organizer` / `admin`)
  rather than a separate permissions/roles collection — appropriate for 3 fixed roles; would
  need to change to a proper RBAC system with a permissions table if roles became dynamic/custom.

## Auth Flow

1. Password hashed with bcrypt at registration (`authController.register`)
2. Login compares hash, stores `{ id, username, role }` in `req.session.user` (server-side session,
   default in-memory store — see "Known Limitations" below)
3. `middleware/auth.js` — `attachUser` makes the session user available to every view;
   `requireAuth` blocks unauthenticated access; `requireRole([...])` blocks by role
4. Session persisted via a signed cookie (`express-session`, cookie doesn't contain the actual
   session data — just a signed ID referencing server-side storage)

## Key Algorithms/Logic Worth Mentioning

- **Nearest-facility search** (`utils/geo.js`) — Haversine formula computes great-circle distance
  between two lat/lng points; results sorted ascending, sliced to top 10. Runs at query time over
  all facilities (fine at this scale — would need a geospatial index, e.g. MongoDB's `2dsphere`,
  if the facility count grew into the tens of thousands).
- **Chatbot** (`controllers/chatbotController.js`) — rule-based, not ML/LLM-based: quick-intent
  keyword matching first, then a simple word-overlap score against FAQ content, with a graceful
  fallback. Deliberately simple and free to run — worth being honest about this distinction if asked.

## Known Limitations (good to be upfront about)

- **Sessions use the default in-memory store** — works for a single server instance and local
  dev, but doesn't persist across restarts and won't work correctly if you ever scale to multiple
  server instances. Production fix: swap in `connect-mongo` to store sessions in MongoDB.
- **No geospatial indexing** — nearest-facility search is O(n) over all facilities. Fine at
  current scale; a MongoDB `2dsphere` index + `$near` query would be the next step at scale.
- **No caching layer** — every request hits MongoDB directly. A Redis cache in front of
  read-heavy, rarely-changing data (e.g. Helplines, Nearby Places) would reduce DB load at scale.
- **No rate limiting** — `/login`, `/register`, and the chatbot endpoint could be abused. Worth
  adding `express-rate-limit` before any public deployment.
- **No automated tests yet** — see Phase 6 for planned basic Jest/Supertest coverage.

## Deployment Shape (once live)

```
User → Render/Railway (Node/Express app) → MongoDB Atlas (managed, not self-hosted)
```

Static assets (CSS/images) served directly by Express from `public/` — fine at this scale;
a CDN would be the next step if traffic grew significantly.

## Utility Scripts (`scripts/`)

These aren't part of the running app — they're one-off CLI tools run manually during
development:

- `seedResources.js` / `seedNearbyPlaces.js` — populate curated, factual content (real
  facilities, helplines, nearby places). Idempotent — safe to re-run, skips if data exists.
- `seedDemoData.js` — populates realistic-looking fictional data (Faker.js) for demos. Never
  touches Helplines or Nearby Places, since fabricating those would be misleading rather than
  just "filler."
- `promoteUser.js` — CLI role management, used before the Admin Dashboard's user-management UI
  existed, kept as a fallback (e.g. recovering access if the last admin account is ever lost).
- `dropDatabase.js` — connects using the app's own `MONGO_URI` from `.env` before dropping,
  specifically to avoid a real mistake made during development: running `mongosh` with no
  arguments connects to a local MongoDB instance by default, which can silently be the *wrong*
  database if the app's actual data lives elsewhere (or even just under a differently-cased
  database name — MongoDB database names are case-sensitive).
