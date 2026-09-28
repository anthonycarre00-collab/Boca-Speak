# Melissa — Student Test v0.7

**Aprende en español. Habla en inglés.**

Melissa is a Spanish-first English learning prototype built around a simple idea: give Spanish-speaking learners a temporary written bridge into English pronunciation, then help them remove that bridge and say the English itself.

## What changed in v0.7

- Larger curated pronunciation library and practical phrase library.
- Colombia-aware TH notation: `s̱` = voiceless TH with the tongue between the teeth; `ḏ` = voiced TH. We deliberately do **not** use `z` as a TH cue because Colombian/Latin American Spanish is normally seseante.
- Daily 3-practice goal with light rewards: points, streaks, small achievements and a one-tap celebration. No leagues, leaderboards or competitive pressure.
- Points are capped by the daily goal so the system cannot be profitably “grinded”.
- Quick Review resurfacing difficult/favourited items.
- More useful progress dashboard: today, streak, points, items tried, helpfulness and achievements.
- Student-facing teacher access moved out of the main header to reduce confusion during unguided student testing.
- Student feedback on the Progress page now actually records a response.
- Service-worker cache bumped to v0.7.

## Product boundary

Melissa intentionally does **not** try to become an AI pronunciation-scoring clone. There is no fake pronunciation score, no leaderboard, no AI chat tutor and no social competition in this build.

The prototype instead tests whether students independently understand and value:

**Spanish meaning → English model → Spanish-friendly bridge → say it → remove the bridge**

## Voice

Melissa uses the best available Latin-American Spanish female/coach voice exposed by the learner's browser/device, with preference for `es-CO` / `es-419` when available. English model speech is selected separately.

The browser Speech Synthesis API does not guarantee the same named voice on every device, so this is intentionally a best-match strategy rather than a promise of one universal voice.

## Deployment

The project is structured for Vercel with the application files at the repository root.

```bash
npm install
npm run build
npm run preview
```

## Prototype data

This test build stores practice data in `localStorage` only. Recordings are kept locally in the page during the current session. There is no account or server database.

## Student testing

Hand the app to students without explaining the method first. Observe whether they can:

1. understand the Spanish-first interface;
2. work out what the pronunciation bridge is for;
3. use it without being taught a phonetic notation system;
4. listen, repeat and then try the English without the bridge;
5. return voluntarily to sounds or phrases;
6. tell you which bridges help and which confuse them.
