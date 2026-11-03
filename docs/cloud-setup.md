# KageNexus Cloud Setup

KageNexus remains a static GitHub Pages app. Supabase supplies email authentication, the private database row, and realtime change notifications; no always-on application server is required.

The deployed backend is `kagenexus-cloud` (`cklaldidbtroqluhrssp`) in AshtonFarmer's Org on the Free plan. The migration, browser publishable key, exact production Auth URLs, RLS, and Realtime are configured. The following setup instructions also cover creating a separate deployment.

## 1. Create and migrate the project

Create a Supabase project in the intended organization, then apply the checked-in migration:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

The migration at `supabase/migrations/20261102065901_create_kagenexus_user_states.sql` enables row-level security and limits every authenticated user to the row whose `user_id` matches their token. Run the Supabase security and performance advisors after applying it.

## 2. Add browser-safe project values

Copy the project URL and **publishable** key into the `deployment` object in `src/config.js`:

```js
const deployment = {
  supabaseUrl: 'https://YOUR_PROJECT_REF.supabase.co',
  supabasePublishableKey: 'sb_publishable_...'
};
```

The publishable key is designed for browser use and RLS is the authorization boundary. Never add a secret key, service-role key, database password, or access token to the repository.

For local or injected deployments, define the same values on `globalThis.__KAGENEXUS_CONFIG__` before `src/app.js` loads instead of editing the defaults.

## 3. Configure Auth URLs

In **Authentication → URL Configuration** set the production Site URL and add every allowed redirect used for confirmation and password recovery. For this repository the production URL is:

```text
https://ashtonfarmer.github.io/Anime-Haven/
```

Add localhost or beta-preview redirects only while testing. Keep the production URL exact rather than using a broad wildcard.

## 4. Connect production email delivery

The project currently uses Supabase's default email sender. That sender is restricted to project-team email addresses and a low rate limit; it does not support general public registration. Keep email confirmation enabled.

To enable public sign-up and password recovery, configure a custom SMTP sender under **Authentication → Emails → SMTP Settings** with the provider's host, port, username, password, sender address, and sender name. Enter credentials only in the provider/dashboard secret fields, never in browser code or the repository. Verify the sender/domain with the mail provider and adjust the Auth email rate limit for that provider's allowance.

See [Supabase's custom SMTP guide](https://supabase.com/docs/guides/auth/auth-smtp). Provider account credentials and sender verification are the remaining external setup requirements. Until those are supplied, delivery tests and public sign-up cannot be reported as complete.

## 5. Verification

`npm run check` covers the recovery callback on a fresh device, the actual account import button, account switching/sign-out during in-flight requests, edits during uploads, and offline reconnect, in addition to the original tests.

`supabase/tests/user_states.sql` verifies two-account ownership, own-row CRUD, cross-account denial, ownership reassignment denial, optimistic revisions, and missing-identity denial against the deployed database. Run the whole script in one session; fixture users and rows are rolled back. It passed against the production schema on November 3, 2026.

Run desktop/mobile/offline browser checks locally or against the live public release:

```bash
npm run visual:smoke
npm run visual:smoke -- /tmp/kagenexus-live https://ashtonfarmer.github.io/Anime-Haven/
```

After SMTP is connected:

1. Create two separate test accounts.
2. Confirm each account can create and update its own library.
3. Confirm neither account can read or modify the other account's `user_states` row.
4. Import a private `KNX1.` phone code into one account and verify it never appears in Guest mode or the second account.
5. Test sign-out, offline edits, reconnect sync, email confirmation, and password recovery.

An actual phone's existing library is device-local. Its owner must open the updated app on that phone, sign in, and use **Move old data found on this web address**, or paste a previously exported `KNX1.` code into the account import field. The old save is retained and a pre-import safety copy is made.
