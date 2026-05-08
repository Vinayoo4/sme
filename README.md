# SME Sync Platform

A self-contained SME operations platform built with:
- backend: Node.js + Express + TypeScript
- frontend: React + Vite + TypeScript
- persistence: local JSON documents in `backend/data`

## Key rules

- No external database
- No MongoDB, SQL, Redis, or third-party connectors
- Each collection is stored as a JSON file in `backend/data`
- All app data behaves like a small NoSQL document store

## Project structure

- `backend/src/storage/*` - JSON file storage layer and repositories
- `backend/data/*.json` - persistent collections on disk
- `backend/src/*` - API modules and business logic
- `frontend/src/*` - app shell, pages, API client, and UI components

## Local setup

### 1. Install dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Seed demo data

```bash
cd backend
npm run seed
```

Copy the printed `userId` value.

### 3. Run the backend

```bash
cd backend
npm run dev
```

### 4. Run the frontend

```bash
cd frontend
npm run dev
```

Paste the seeded demo user ID into the login page.

## Backend data files

The backend creates these files automatically if they do not exist:
- `backend/data/businesses.json`
- `backend/data/users.json`
- `backend/data/feedback.json`
- `backend/data/products.json`
- `backend/data/inventoryMovements.json`
- `backend/data/eventLogs.json`
- `backend/data/automationRules.json`
- `backend/data/notifications.json`

## Core API

- `GET /api/health`
- `POST /api/feedback`
- `GET /api/feedback`
- `POST /api/inventory/products`
- `GET /api/inventory/products`
- `POST /api/inventory/movements`
- `GET /api/inventory/restock`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/seen`
- `GET /api/export/all`

All protected routes require the `x-demo-user-id` header.

## Restore / import workflow

To restore the backend from an exported JSON payload:

```bash
cd backend
npm run build
node dist/scripts/importData.js /absolute/path/to/export.json
```

## Smoke test

```bash
npm run smoke
```

The smoke test installs backend dependencies, builds the backend, seeds demo data, starts the API, checks health, and verifies an authenticated read.

## Verification checklist

- [ ] `cd backend && npm run build`
- [ ] `cd backend && npm test`
- [ ] `cd frontend && npm run build`
- [ ] `cd frontend && npm run lint`
- [ ] `cd frontend && npm test`
- [ ] `npm run smoke`
- [ ] seed output returns a valid demo `userId`
- [ ] export downloads JSON successfully from the dashboard
