# SME Sync Platform — Roadmap

## Architecture (Current)

- **Backend**: Node.js + Express 5 + TypeScript, JSON-file document store, multi-tenant via `businessId` scoping.
- **Frontend**: React 19 + Vite 6 + TypeScript, Axios, React Router 7.
- **Auth**: Header-based auth (`x-demo-user-id`) resolved against local JSON user store.
- **Monorepo**: Root `package.json` with scripts for backend and frontend.

## Phase 1 — Current State (Stabilized)

- [x] Zero external database dependencies — all data in `backend/data/*.json`
- [x] Express 5 with TypeScript 5.7, strict mode
- [x] React 19 with Vite 6, Vitest 3
- [x] JSON file store with atomic writes (temp-file + rename) and write-queue serialization
- [x] Multi-tenant data scoping via `businessId`
- [x] 8 collections: businesses, users, products, feedback, inventoryMovements, notifications, eventLogs, automationRules
- [x] Restock forecasting engine (30-day moving average)
- [x] Event-driven notification system (negative feedback alerts, low-stock alerts)
- [x] Full data export endpoint
- [x] Helmet security headers, CORS, rate limiting
- [x] Backend tests: 2 passed | Frontend tests: 2 passed

## Phase 2 — Optimization (Next 3 months)

- **Read/Write Caching**: Add in-memory LRU cache layer for read-heavy endpoints (feedback list, product list) to reduce file I/O.
- **Concurrent Write Handling**: Replace the current write-queue pattern with proper async-lock per collection.
- **Data Validation Layer**: Add Zod or similar runtime validation on all API inputs beyond current manual checks.
- **Structured Logging Upgrade**: Route logs to a rotating file or stdout with log levels configurable via env.
- **Frontend Error Boundaries**: Wrap each page in React error boundaries with retry logic.
- **Pagination Cursors**: Move from offset-based to cursor-based pagination for feedback list to handle large datasets.

## Phase 3 — Scaling (6-12 months)

- **JSON to NoSQL Migration Path**: The repository pattern (`src/storage/repositories/*`) abstracts storage already. To migrate:
  1. Implement a storage adapter interface matching the current repository API
  2. Create a MongoDB (or SQLite) adapter implementing the same interface
  3. Swap adapters via environment config — zero business logic changes
  4. Data migration script: read from JSON files, batch-insert into the new store
- **Authentication Upgrade**: Replace header-based auth with JWT (access + refresh tokens), bcrypt password hashing, and session management.
- **Real-time Updates**: Add WebSocket support for live notification delivery (no polling).
- **Multi-node Support**: Move JSON store to a shared volume or replace with a database for horizontal scaling.
- **Containerization**: Dockerfile for each service + docker-compose for local dev.

## Future Considerations

- **Voice Feedback**: Audio upload + Whisper API transcription
- **Sentiment Analysis**: Auto-classify feedback using local NLP models
- **Analytics Dashboard**: Charts for feedback trends, stock velocity, top-rated staff
- **Offline PWA**: Service workers for shops with intermittent connectivity
- **Multi-language UI**: i18n support for regional languages
- **Role-based Access**: Granular permissions per module per role

