// Supabase client (Phase 2).
//
// The client is created only when both VITE_SUPABASE_URL and
// VITE_SUPABASE_ANON_KEY are present. With them unset the app runs in
// "demo mode" on local seed data (no login, no persistence) — this keeps the
// project runnable with zero config and keeps the test suite backend-free.
//
// The anon key is browser-safe by design; Row Level Security (see
// supabase/schema.sql) is what actually protects the data. Platform tokens and
// the Anthropic key never live here — they stay in Edge Functions / Vault.

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env?.VITE_SUPABASE_URL || '';
const anonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseEnabled = Boolean(url && anonKey);

export const supabase = isSupabaseEnabled
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
