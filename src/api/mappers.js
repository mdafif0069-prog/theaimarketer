// Pure mappers between Supabase rows and the app's in-memory models.
// Kept side-effect-free so they can be unit-tested without a database
// (see scripts/smoke.mjs).

// Two-letter initials from a name — matches the app's invite logic.
export function deriveInitials(name) {
  return (name || '').trim().slice(0, 2).toUpperCase();
}

// --- team_members ---

export function memberRowToApp(row) {
  return {
    id: row.id,
    initials: row.initials || deriveInitials(row.name),
    name: row.name,
    email: row.email,
    role: row.role,
    perm: row.permission,
  };
}

// Lookup helpers built from the loaded team.
export function buildTeamIndex(members) {
  const idByInitials = {};
  const initialsById = {};
  members.forEach((m) => {
    if (m.id) {
      idByInitials[m.initials] = m.id;
      initialsById[m.id] = m.initials;
    }
  });
  return { idByInitials, initialsById };
}

// --- posts ---

// Combine an app date ("2026-07-15") + time ("10:00") into a timestamp string.
export function toScheduledAt(date, time) {
  if (!date) return null;
  return `${date}T${(time || '00:00')}:00`;
}

// Split a stored timestamp back into { date, time }. Tolerant of trailing
// timezone markers because we read the same first 16 chars we wrote.
export function fromScheduledAt(scheduledAt) {
  if (!scheduledAt) return { date: '', time: '' };
  const s = String(scheduledAt);
  return { date: s.slice(0, 10), time: s.slice(11, 16) };
}

export function postRowToApp(row, initialsById = {}) {
  const { date, time } = fromScheduledAt(row.scheduled_at);
  return {
    id: row.id,
    date,
    time,
    platform: row.platform,
    title: row.copy ?? row.title ?? '',
    status: row.status,
    assignee: initialsById[row.assignee_id] || row.assignee_initials || '',
    campaign: row.campaign || '',
  };
}

// App composer form -> insertable posts row.
export function appPostToRow(form, status, idByInitials = {}) {
  const copy = form.title || '';
  return {
    title: copy.slice(0, 80),
    copy,
    platform: form.platform,
    status,
    scheduled_at: toScheduledAt(form.date, form.time),
    campaign: form.campaign || null,
    assignee_id: idByInitials[form.assignee] || null,
    requires_approval: Boolean(form.requiresApproval),
    approver_id: form.requiresApproval ? idByInitials[form.approver] || null : null,
    publish_mode: form.publishMode || 'auto',
    reminder_minutes: form.reminder === 'none' ? null : Number(form.reminder),
  };
}

// --- connections ---

export function connectionRowsToApp(rows) {
  const out = { linkedin: false, instagram: false, facebook: false, email: false, youtube: false };
  rows.forEach((r) => {
    if (r.platform in out) out[r.platform] = Boolean(r.connected);
  });
  return out;
}

// --- workspace_settings ---

export function settingsRowToApp(row) {
  return {
    wsApproval: Boolean(row.approval_default),
    wsReminder: String(row.reminder_default),
    wsTz: row.timezone,
    notifs: {
      reminders: Boolean(row.notif_reminders),
      approvals: Boolean(row.notif_approvals),
      published: Boolean(row.notif_published),
      weekly: Boolean(row.notif_weekly),
    },
    notifChannel: row.notif_channel,
  };
}

// Map a partial app-settings patch back to row columns for an update.
export function appSettingsPatchToRow(patch) {
  const row = {};
  if ('wsApproval' in patch) row.approval_default = patch.wsApproval;
  if ('wsReminder' in patch) row.reminder_default = Number(patch.wsReminder);
  if ('wsTz' in patch) row.timezone = patch.wsTz;
  if ('notifChannel' in patch) row.notif_channel = patch.notifChannel;
  if ('notifs' in patch) {
    if ('reminders' in patch.notifs) row.notif_reminders = patch.notifs.reminders;
    if ('approvals' in patch.notifs) row.notif_approvals = patch.notifs.approvals;
    if ('published' in patch.notifs) row.notif_published = patch.notifs.published;
    if ('weekly' in patch.notifs) row.notif_weekly = patch.notifs.weekly;
  }
  return row;
}
