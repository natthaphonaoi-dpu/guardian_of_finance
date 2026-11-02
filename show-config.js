// Supabase project URL and public anon/publishable key. NEVER place service_role keys here.
window.GUARDIAN_SHOW_CONFIG = {
  SUPABASE_URL: 'https://ntsevlaedzhccqilmpst.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_z9qUOIPsgjhrXA-8x27Kkg_NdLld7f4',
  POLL_MS: 2500
};

// Explicit same-browser rehearsal only; never sends commands to the online service.
if (new URLSearchParams(location.search).get('demo') === '1') {
 window.GUARDIAN_SHOW_CONFIG={...window.GUARDIAN_SHOW_CONFIG,SUPABASE_URL:'',SUPABASE_ANON_KEY:''};
}
