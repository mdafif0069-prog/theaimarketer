// Workspace repository — the single boundary between the store and Supabase.
//
// Every function is a no-op-safe async call: when Supabase is disabled the
// store never calls these (it uses local state), but they still guard on the
// client so a stray call can't throw.

import { supabase, isSupabaseEnabled } from '../lib/supabase.js';
import {
  appPostToRow,
  appSettingsPatchToRow,
  buildTeamIndex,
  connectionRowsToApp,
  deriveInitials,
  memberRowToApp,
  postRowToApp,
  settingsRowToApp,
} from './mappers.js';

function ensure() {
  if (!isSupabaseEnabled || !supabase) throw new Error('Supabase is not configured');
}

// Load everything the workspace needs in one shot.
export async function loadWorkspace() {
  ensure();
  const [teamRes, postsRes, connRes, settingsRes] = await Promise.all([
    supabase.from('team_members').select('*').order('created_at', { ascending: true }),
    supabase.from('posts').select('*').order('scheduled_at', { ascending: true }),
    supabase.from('connections').select('*'),
    supabase.from('workspace_settings').select('*').limit(1).maybeSingle(),
  ]);

  const firstError = teamRes.error || postsRes.error || connRes.error || settingsRes.error;
  if (firstError) throw firstError;

  const team = (teamRes.data || []).map(memberRowToApp);
  const { initialsById } = buildTeamIndex(team);
  const posts = (postsRes.data || []).map((r) => postRowToApp(r, initialsById));
  const connections = connectionRowsToApp(connRes.data || []);
  const settings = settingsRes.data ? settingsRowToApp(settingsRes.data) : null;

  return { team, posts, connections, settings };
}

// Insert a post; returns the created row mapped to the app model.
export async function createPost(form, status, team) {
  ensure();
  const { idByInitials, initialsById } = buildTeamIndex(team);
  const row = appPostToRow(form, status, idByInitials);
  const { data, error } = await supabase.from('posts').insert(row).select().single();
  if (error) throw error;
  return postRowToApp(data, initialsById);
}

export async function updatePostStatus(id, status) {
  ensure();
  const patch = { status };
  if (status === 'published') patch.published_at = new Date().toISOString();
  const { error } = await supabase.from('posts').update(patch).eq('id', id);
  if (error) throw error;
}

// Demo-mode connect/disconnect (real OAuth arrives in Phase 3).
export async function setConnection(platform, connected) {
  ensure();
  const { error } = await supabase
    .from('connections')
    .update({ connected, last_synced_at: connected ? new Date().toISOString() : null })
    .eq('platform', platform);
  if (error) throw error;
}

export async function inviteMember(email, permission) {
  ensure();
  const nm = email.split('@')[0];
  const name = nm.charAt(0).toUpperCase() + nm.slice(1);
  const row = {
    name,
    email,
    role: 'Invited — pending',
    permission,
    initials: deriveInitials(name),
  };
  const { data, error } = await supabase.from('team_members').insert(row).select().single();
  if (error) throw error;
  return memberRowToApp(data);
}

export async function removeMember(id) {
  ensure();
  const { error } = await supabase.from('team_members').delete().eq('id', id);
  if (error) throw error;
}

export async function updateSettings(patch) {
  ensure();
  const row = appSettingsPatchToRow(patch);
  if (!Object.keys(row).length) return;
  const { error } = await supabase.from('workspace_settings').update(row).eq('id', true);
  if (error) throw error;
}
