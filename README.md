# Component Audit

A single-page tool that audits a UI component screenshot for accessibility and design-system consistency, and drafts a documentation entry. The Anthropic API key stays server-side; the browser never talks to `api.anthropic.com` directly.

Architecture: browser → `/api/audit` (Vercel serverless function) → Anthropic API → back to browser.

## Setup

```
npm install
cp .env.example .env
```

Open `.env` and set your real key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

```
npm run dev
```

**Note on local testing:** `npm run dev` runs the Vite frontend only — it does not execute the `/api/audit` serverless function, so "Run audit" will fail locally with a plain `npm run dev`. To test the full flow (including the API call) on your machine, install the Vercel CLI once (`npm i -g vercel`) and run `vercel dev` instead. It serves both the frontend and the `/api` function together, reading the key from `.env`.

## Deploy

1. Push this project to a GitHub repo.
2. In Vercel, import the repo as a new project (framework preset: Vite).
3. Go to Project Settings → Environment Variables and add:
   - `ANTHROPIC_API_KEY` = your real key
4. Deploy. Vercel builds the frontend and deploys `api/audit.js` as a serverless function automatically — no extra config needed.

Every deploy (and redeploy) picks up the current value of `ANTHROPIC_API_KEY` from Vercel's environment variables. If you rotate the key, update it there and redeploy.

## Notes

- No database, no auth, no accounts. State lives only in the browser tab for the duration of a session.
- Uploading a `.md` file for Step 1 sends its raw text to the backend as the source of truth for spacing, palette, and naming, and hides the manual fields. Removing the file (or never uploading one) falls back to the manual fields, exactly as before.
- Vercel's default body size limit for serverless functions is 4.5 MB. Very large screenshots (as base64) can exceed this — if you hit it, compress the screenshot before uploading.
