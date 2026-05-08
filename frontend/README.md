# Frontend

React + Vite frontend for the SME Sync Platform.

## Environment

Use `frontend/.env.example` and set:

```bash
VITE_API_BASE_URL=http://localhost:4000
VITE_DEMO_USER_ID=
```

You can either:
- paste the seeded demo user ID on the login page, or
- prefill `VITE_DEMO_USER_ID` for local demos.

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
npm test
```

## Pages

- `/login`
- `/dashboard`
- `/feedback`
- `/inventory`
- `/notifications`
