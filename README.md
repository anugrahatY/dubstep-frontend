# Dubstep frontend

A standalone React + TypeScript + Vite frontend starter for entering a dialogue line and optionally adding speaker, listener, relationship, pronoun, and emotion context.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Clicking “Adapt this line” sends the Japanese text and optional context to `POST /api/v1/translate`, which returns up to ten ranked Hindi idiom and phrase adaptations from Groq. Automatic timing lets Groq choose a natural spoken length; manual timing sends `slot_seconds`. The Vite dev server proxies `/api` to the backend at `127.0.0.1:8000`.
