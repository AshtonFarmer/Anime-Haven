# KageNexus

Ashton’s anime and movie tracker, progress library, search hub, and 1,778-entry Arsenal.

## KageNexus 2.0 core

The `agent/kagenexus-2-core-rebuild` branch replaces the encoded ZIP/eval startup with static ES modules while preserving the live Release 62 interface and the exact `anime-haven-state-v2` save key.

Core boundaries:

- `src/app.js` — startup, routing, and shared rendering
- `src/store.js` — state compatibility, migration, and safe saving
- `src/library.js` — Home, Archive, Unstarted, cards, and progress
- `src/search.js` — saved-library and AniList search
- `src/settings.js` — backups, sync codes, installation, and settings
- `src/arsenal.js` — lazy-rendered Arsenal UI
- `src/updates.js` — service-worker update lifecycle
- `styles/` — normal static CSS, with no runtime style injection in the new core

## Verification

```bash
npm install
npm run check
npm run visual:smoke
```

The automated suite covers navigation, search, progress, save migration, backups, sync codes, the complete feature runtime, and the 1,778-item Arsenal contract. The Chromium smoke test renders the desktop and mobile routes, rejects browser/runtime errors and layout overflow, and proves an offline service-worker reload.

See [`docs/core-rebuild.md`](docs/core-rebuild.md) for the compatibility and rollout plan.
