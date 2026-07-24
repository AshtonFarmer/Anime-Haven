# KageNexus Mobile Suite v22

## Phone upgrades included

- **Continue Watching** on Home with the five most recently updated in-progress series.
- Large **minus episode**, **season**, and **plus episode** controls.
- Quick actions on library cards for **minus episode**, **plus episode**, **change season**, **mark complete**, and **move to Unstarted**.
- Movie cards use **Mark Watched / Mark Unwatched** rather than episode controls.
- A mobile bottom sheet provides the full quick-action set without requiring the desktop-style details editor.
- The bottom navigation respects iPhone safe areas and reserves enough page padding so it does not cover content.
- Search dialogs lock the background, autofocus the search field, remain inside the visible keyboard area, and include a clear Cancel/Close control.
- A custom offline recovery page is cached by the service worker.
- New builds show an **Update Available — Reload** banner rather than silently mixing old and new cached files.

## Progress backup and cross-device transfer

Settings now includes a **Data & Sync** panel with:

- Share Backup
- Export Backup File
- Import Backup File
- Copy Sync Code
- Paste Sync Code
- Restore Pre-Import Backup

Imports merge title-by-title and keep the newest `updatedAt` progress for each title. A safety copy of the pre-import state is saved before merging.

## Automatic cloud sync status

Automatic background sync between phone and laptop still requires a secure account and database provider. GitHub Pages is a static host and cannot privately store each user's changing progress by itself. The manual backup/sync-code system is available immediately and the app's data structure is ready to connect to a cloud backend later.
