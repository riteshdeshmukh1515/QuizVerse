export function isSupabaseConfigured() {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
}

export function isOpenRouterConfigured() {
  return Boolean(import.meta.env.VITE_OPENROUTER_API_KEY);
}
