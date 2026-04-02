# Frontend (Supabase Auth Only)

This frontend uses Supabase only for authentication.

## Setup

1. Copy `.env.example` to `.env`.
2. Fill:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Run

```bash
npm install
npm run dev
```

The app lets you sign up/sign in with Supabase and then call `GET /api/auth/me` on your own backend with a bearer token.
The app lets you sign up, sign in, and sign out with Supabase and shows the active session.
