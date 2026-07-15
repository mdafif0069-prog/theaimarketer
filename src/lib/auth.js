// Thin auth wrapper over Supabase Auth. All calls guard on the client so they
// are safe to import in demo mode (where they are simply never invoked).

import { supabase, isSupabaseEnabled } from './supabase.js';

export async function signIn(email, password) {
  if (!isSupabaseEnabled) throw new Error('Supabase is not configured');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function signOut() {
  if (!isSupabaseEnabled) return;
  await supabase.auth.signOut();
}

export async function getSession() {
  if (!isSupabaseEnabled) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// Subscribe to auth changes; returns an unsubscribe fn.
export function onAuthChange(cb) {
  if (!isSupabaseEnabled) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session));
  return () => data.subscription.unsubscribe();
}
