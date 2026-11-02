const runtime = globalThis.__KAGENEXUS_CONFIG__ || {};
const deployment = {
  // These two browser-safe values may be committed for a static GitHub Pages deployment.
  // Never put a privileged backend key in this file.
  supabaseUrl: '',
  supabasePublishableKey: ''
};

export const APP_CONFIG = Object.freeze({
  supabaseUrl: runtime.supabaseUrl || deployment.supabaseUrl,
  supabasePublishableKey: runtime.supabasePublishableKey || deployment.supabasePublishableKey,
  cloudTable: 'user_states'
});
