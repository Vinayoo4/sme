# SME Sync Platform

A self-contained SME (Small & Medium Enterprise) operations platform for inventory management, customer feedback capture, and operational notifications. Built for small businesses that need a lightweight, zero-infrastructure operations backend.

**Built with:**
- **Backend**: Node.js + Express 5 + TypeScript
- **Frontend**: React 19 + Vite 6 + TypeScript
- **Persistence**: Local JSON document store (no external database required)

## Why SME Sync?

Small businesses rarely have IT budgets for cloud databases or dedicated servers. SME Sync provides a complete operations platform that runs locally with zero external dependencies — no MongoDB, no SQL, no Redis, no cloud services. All data persists as JSON files in `backend/data/`.

## Architecture

```
sme-sync-platform/
├── backend/                  # Express 5 API server
│   ├── src/
│   │   ├── app.ts            # Express app setup (routes, middleware, CORS, rate-limit)
│   │   ├── index.ts          # Server entry point
│   │   ├── config/           # Environment config
│   │   ├── common/           # Types, errors, logger, utilities
│   │   ├── core/             # Auth middleware, health endpoint, models
│   │   ├── storage/          # JSON file store + repositories (8 collections)
│   │   ├── feedback/         # Feedback CRUD routes/controllers/services
│   │   ├── inventory/        # Product/movement CRUD + restock forecasting
│   │   ├── notifications/    # Notification list + mark-seen
│   │   ├── events/           # Event-driven notification triggers
│   │   ├── export/           # Full business data export
│   │   └── scripts/          # Seed and import utilities
│   └── data/                 # JSON file collections (auto-created)
├── frontend/                 # React + Vite SPA
│   └── src/
│       ├── App.tsx           # Router, auth context, layout
│       ├── pages/            # Dashboard, Inventory, Feedback, Notifications, Login
│       ├── components/       # Reusable UI components
│       ├── api/              # Axios API client
│       ├── context/          # React context for auth state
│       └── styles/           # Global CSS
└── scripts/                  # Smoke test script
```

## Data Flow

```
Browser (React SPA) ──HTTP──> Express API ──JSON──> File System
   localhost:5173              localhost:4000        backend/data/*.json
```

- Frontend calls backend via Axios with `x-demo-user-id` header
- Backend validates user against JSON file store
- All collection data is scoped by `businessId` (multi-tenant)
- Events (feedback, inventory movements) auto-generate notifications

## JSON Database Schema

8 collections stored as JSON files in `backend/data/`:

| File | Schema |
|------|--------|
| `businesses.json` | `{ id, name, slug, createdAt, updatedAt }` |
| `users.json` | `{ id, businessId, name, email, passwordHash, role, createdAt, updatedAt }` |
| `products.json` | `{ id, businessId, name, sku, category?, unit, currentStock, reorderLevel?, createdAt, updatedAt }` |
| `feedback.json` | `{ id, businessId, customerPhone?, rating?, transcript?, sentiment?, serviceType?, staffName?, audioUrl?, createdAt, updatedAt }` |
| `inventoryMovements.json` | `{ id, businessId, productId, type, quantity, date, note?, createdAt, updatedAt }` |
| `notifications.json` | `{ id, businessId, type, message, payload?, seen, createdAt, updatedAt }` |
| `eventLogs.json` | `{ id, businessId, type, payload, createdAt, updatedAt }` |
| `automationRules.json` | `{ id, businessId, name, triggerType, conditions, actionType, actionPayload, enabled, createdAt, updatedAt }` |

## Quick Start

### Requirements
- Node.js >= 18.x

### Setup

```bash
# 1. Install dependencies
npm install
cd backend && npm install && cd ../frontend && npm install && cd ..

# 2. Configure environment
cp .env.example .env

# 3. Build backend
cd backend && npm run build

# 4. Seed initial user (copy the printed userId)
node dist/scripts/seedDemoUser.js

# 5. Start backend
npm run dev:backend    # Terminal 1 — runs on :4000

# 6. Start frontend (in separate terminal)
npm run dev:frontend   # Terminal 2 — runs on :5173

# 7. Open http://localhost:5173 and paste the seeded userId
```

## API Reference

All protected endpoints require `x-demo-user-id` header.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Server health check |
| GET | `/api/feedback` | Yes | List feedback (paginated) |
| POST | `/api/feedback` | Yes | Create feedback entry |
| POST | `/api/inventory/products` | Yes | Create product |
| GET | `/api/inventory/products` | Yes | List products |
| POST | `/api/inventory/movements` | Yes | Record stock movement |
| GET | `/api/inventory/restock` | Yes | Get restock suggestions |
| GET | `/api/notifications` | Yes | List notifications |
| PATCH | `/api/notifications/:id/seen` | Yes | Mark notification read |
| GET | `/api/export/all` | Yes | Export all business data as JSON |

## Verification

```bash
cd backend && npm run build   # Must exit 0
cd backend && npm test        # Must pass
cd frontend && npm run build  # Must exit 0
cd frontend && npm test       # Must pass
cd frontend && npm run lint   # Must pass
```

