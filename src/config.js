const runtime = globalThis.__KAGENEXUS_CONFIG__ || {};
const cloudDisabled = runtime.disableCloud === true;
const deployment = {
  // These two browser-safe values may be committed for a static GitHub Pages deployment.
  // Never put a privileged backend key in this file.
  supabaseUrl: 'https://cklaldidbtroqluhrssp.supabase.co',
  supabasePublishableKey: 'sb_publishable_OzBkdJjIzuSi_UlNaHHcMw_dexesE0K'
};

export const APP_CONFIG = Object.freeze({
  supabaseUrl: cloudDisabled ? '' : (runtime.supabaseUrl || deployment.supabaseUrl),
  supabasePublishableKey: cloudDisabled ? '' : (runtime.supabasePublishableKey || deployment.supabasePublishableKey),
  cloudTable: 'user_states'
});
