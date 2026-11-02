# KageNexus

🌐 **Live website:** https://ashtonfarmer.github.io/Anime-Haven/

A private, account-ready anime and movie tracker, progress library, search hub, and 1,778-entry Arsenal.

## KageNexus 2.0 core

The `agent/kagenexus-2-core-rebuild` branch replaces the encoded ZIP/eval startup with static ES modules, clean public defaults, isolated account storage, and optional Supabase cloud sync.

Core boundaries:

- `src/app.js` — startup, routing, and shared rendering
- `src/store.js` — guest/account isolation, legacy imports, and safe saving
- `src/library.js` — Home, Archive, Unstarted, cards, and progress
- `src/search.js` — saved-library and AniList search
- `src/settings.js` — backups, sync codes, installation, and settings
- `src/account.js` / `src/cloud.js` — authentication and conflict-safe cloud sync
- `src/arsenal.js` — lazy-rendered Arsenal UI
- `src/updates.js` — service-worker update lifecycle
- `styles/` — normal static CSS, with no runtime style injection in the new core

## Verification

```bash
npm install
npm run check
npm run visual:smoke
```

The automated suite covers navigation, search, progress, account isolation, legacy imports, backups, sync codes, cloud conflict handling, the complete feature runtime, and the 1,778-item Arsenal contract. The Chromium smoke test renders desktop and mobile routes, rejects browser/runtime errors and layout overflow, verifies deferred datasets, and proves an offline service-worker reload.

See [`docs/core-rebuild.md`](docs/core-rebuild.md) for the compatibility and rollout plan.
See [`docs/cloud-setup.md`](docs/cloud-setup.md) to connect a Supabase project without exposing a privileged key.
