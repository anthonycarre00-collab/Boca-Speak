# BocaSpeak — Student Test v0.3.1

A self-contained Vite + React prototype for testing the Boca Bridge with Spanish-speaking English learners.

## IMPORTANT: GitHub / Vercel

The files in THIS directory are the project root. Upload the **contents of this folder** to the root of your GitHub repository — do not put this folder inside another folder.

The repository root must visibly contain:

- `package.json`
- `index.html`
- `vite.config.ts`
- `vercel.json`
- `src/`
- `public/`

For Vercel, leave **Root Directory** as `./` and use the Vite framework/build settings supplied by `vercel.json`.

## Local test

```bash
npm install
npm run build
npm run dev
```

Then open the local URL Vite gives you.

## What this prototype tests

- Spanish-speaker pronunciation bridge
- 80+ curated pronunciation examples
- real-life phrase practice
- listen / speak / hide-the-bridge flow
- local recording where supported
- student feedback capture
- local progress
- teacher studio prototype
- service-worker/offline shell after first successful load

The pronunciation spellings are deliberately experimental learner aids, not IPA or a finished linguistic standard. Student feedback is expected to drive revisions.
