// Unit tests for the pure Supabase <-> app mappers. Run: npm run test
import assert from 'node:assert/strict';
import {
  deriveInitials,
  memberRowToApp,
  buildTeamIndex,
  toScheduledAt,
  fromScheduledAt,
  postRowToApp,
  appPostToRow,
  connectionRowsToApp,
  settingsRowToApp,
  appSettingsPatchToRow,
} from '../src/api/mappers.js';

let passed = 0;
const t = (name, fn) => {
  fn();
  passed++;
  console.log('✓', name);
};

t('deriveInitials takes first two letters uppercased', () => {
  assert.equal(deriveInitials('afif@x'), 'AF');
  assert.equal(deriveInitials('Arya'), 'AR');
  assert.equal(deriveInitials(''), '');
});

t('memberRowToApp maps permission -> perm and prefers explicit initials', () => {
  const app = memberRowToApp({ id: 'u1', name: 'Nabil', email: 'n@s.com', role: 'CMO', permission: 'Admin', initials: 'NB' });
  assert.deepEqual(app, { id: 'u1', initials: 'NB', name: 'Nabil', email: 'n@s.com', role: 'CMO', perm: 'Admin' });
});

t('buildTeamIndex builds both directions', () => {
  const { idByInitials, initialsById } = buildTeamIndex([
    { id: 'u1', initials: 'NB' },
    { id: 'u2', initials: 'AF' },
  ]);
  assert.equal(idByInitials.NB, 'u1');
  assert.equal(initialsById.u2, 'AF');
});

t('scheduled_at round-trips date + time', () => {
  assert.equal(toScheduledAt('2026-07-15', '10:00'), '2026-07-15T10:00:00');
  assert.deepEqual(fromScheduledAt('2026-07-15T10:00:00'), { date: '2026-07-15', time: '10:00' });
  // tolerant of timezone suffix
  assert.deepEqual(fromScheduledAt('2026-07-15T10:00:00+04:00'), { date: '2026-07-15', time: '10:00' });
  assert.deepEqual(fromScheduledAt(null), { date: '', time: '' });
});

t('postRowToApp resolves assignee via index and uses copy as title', () => {
  const app = postRowToApp(
    { id: 'p1', copy: 'Flash sale', title: 'Flash', platform: 'facebook', status: 'scheduled', scheduled_at: '2026-07-15T12:00:00', campaign: 'Summer Launch', assignee_id: 'u2' },
    { u2: 'AR' },
  );
  assert.deepEqual(app, {
    id: 'p1', date: '2026-07-15', time: '12:00', platform: 'facebook',
    title: 'Flash sale', status: 'scheduled', assignee: 'AR', campaign: 'Summer Launch',
  });
});

t('appPostToRow builds an insertable row with approver + reminder handling', () => {
  const form = {
    platform: 'linkedin', date: '2026-07-16', time: '10:00', title: 'CEO op-ed on regional travel',
    campaign: 'Brand Awareness', assignee: 'AF', publishMode: 'auto', reminder: '30',
    requiresApproval: true, approver: 'NB',
  };
  const row = appPostToRow(form, 'review', { AF: 'u2', NB: 'u1' });
  assert.equal(row.copy, 'CEO op-ed on regional travel');
  assert.equal(row.status, 'review');
  assert.equal(row.scheduled_at, '2026-07-16T10:00:00');
  assert.equal(row.assignee_id, 'u2');
  assert.equal(row.approver_id, 'u1');
  assert.equal(row.requires_approval, true);
  assert.equal(row.reminder_minutes, 30);
});

t('appPostToRow: no-approval clears approver, "none" reminder -> null', () => {
  const row = appPostToRow(
    { platform: 'email', date: '2026-07-20', time: '08:00', title: 'x', assignee: 'AR', reminder: 'none', requiresApproval: false, approver: 'NB', publishMode: 'manual' },
    'draft',
    { AR: 'u3', NB: 'u1' },
  );
  assert.equal(row.approver_id, null);
  assert.equal(row.reminder_minutes, null);
  assert.equal(row.publish_mode, 'manual');
});

t('connectionRowsToApp reduces rows to a platform->bool map', () => {
  const map = connectionRowsToApp([
    { platform: 'linkedin', connected: true },
    { platform: 'youtube', connected: false },
  ]);
  assert.equal(map.linkedin, true);
  assert.equal(map.youtube, false);
  assert.equal(map.instagram, false); // default
});

t('settingsRowToApp maps snake_case columns to app shape', () => {
  const app = settingsRowToApp({
    approval_default: true, reminder_default: 30, timezone: 'Asia/Dubai',
    notif_reminders: true, notif_approvals: true, notif_published: true, notif_weekly: false, notif_channel: 'email',
  });
  assert.equal(app.wsApproval, true);
  assert.equal(app.wsReminder, '30');
  assert.deepEqual(app.notifs, { reminders: true, approvals: true, published: true, weekly: false });
  assert.equal(app.notifChannel, 'email');
});

t('appSettingsPatchToRow only includes provided keys', () => {
  assert.deepEqual(appSettingsPatchToRow({ wsTz: 'Europe/London' }), { timezone: 'Europe/London' });
  assert.deepEqual(appSettingsPatchToRow({ notifs: { weekly: true } }), { notif_weekly: true });
  assert.deepEqual(appSettingsPatchToRow({ wsReminder: '60' }), { reminder_default: 60 });
});

console.log(`\n${passed} mapper tests passed.`);
