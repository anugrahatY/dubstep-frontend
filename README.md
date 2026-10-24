# Dubstep frontend

A standalone React + TypeScript + Vite frontend starter for entering a dialogue line and optionally adding speaker, listener, relationship, pronoun, and emotion context.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Choose Groq or the local Dubstep model by clicking the profile picture. Clicking “Adapt this line” sends the Japanese text, structured context, and selected provider to `POST /api/v1/translate`; the API returns up to ten ranked Hindi adaptations. Automatic timing lets the provider choose a natural spoken length; manual timing sends `slot_seconds`.

## Deploy to Vercel

Create a Vercel project from this repository and set **Root Directory** to `frontend`. Vercel builds with `npm run build` and serves `dist` (also declared in `vercel.json`). Add this project environment variable in Vercel:

```text
VITE_API_BASE_URL=https://your-backend.example.com
```

Use the backend's public origin only; do not add `/api/v1`. Vite embeds `VITE_*` values into the frontend at build time, so adding or changing this value requires a redeploy. Keep `GROQ_API_KEY` and other provider credentials in the backend environment, never in Vercel frontend variables.

Allow the deployed Vercel origin in the backend's `CORS_ORIGINS` setting if the backend does not already permit it. For local development, leave `VITE_API_BASE_URL` unset; Vite proxies `/api` to `127.0.0.1:8000`.
