# KageNexus Cloud Setup

KageNexus remains a static GitHub Pages app. Supabase supplies email authentication, the private database row, and realtime change notifications; no always-on application server is required.

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

## 4. Verify before release

1. Create two separate test accounts.
2. Confirm each account can create and update its own library.
3. Confirm neither account can read or modify the other account's `user_states` row.
4. Import a private `KNX1.` phone code into one account and verify it never appears in Guest mode or the second account.
5. Test sign-out, offline edits, reconnect sync, email confirmation, and password recovery.
