# Dubstep frontend

A standalone React + TypeScript + Vite frontend starter for entering a dialogue line and optionally adding speaker, listener, relationship, pronoun, and emotion context.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

The selected context fields are sent as the API's `context` string. Automatic timing omits a timing hint so the model estimates a syllable target from the English line length. Manual timing sends `slot_seconds`. The Vite dev server proxies `/api` to the backend at `127.0.0.1:8000`.
