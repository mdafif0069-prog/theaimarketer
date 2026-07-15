// Initial local-state fixtures, ported from the prototype. In Phase 2 these are
// replaced by reads from Supabase (see supabase/schema.sql).

export const seedTeam = [
  { initials: 'NB', name: 'Nabil', email: 'nabil@solitair.com', role: 'CMO', perm: 'Admin' },
  { initials: 'AF', name: 'Afif', email: 'afif@solitair.com', role: 'Marketing executive', perm: 'Editor' },
  { initials: 'AR', name: 'Arya', email: 'arya@solitair.com', role: 'Marketing executive', perm: 'Editor' },
];

export const seedPosts = [
  { id: 1, date: '2026-07-02', time: '09:00', platform: 'linkedin', title: 'SolitAir Series B announcement', status: 'published', assignee: 'AF', campaign: 'Brand Awareness' },
  { id: 2, date: '2026-07-03', time: '17:30', platform: 'instagram', title: 'Reel: behind the scenes with our ops team', status: 'published', assignee: 'AF', campaign: 'Summer Launch' },
  { id: 3, date: '2026-07-06', time: '11:00', platform: 'facebook', title: 'Customer story: Meridian Air', status: 'published', assignee: 'AR', campaign: '' },
  { id: 4, date: '2026-07-08', time: '08:00', platform: 'email', title: 'July newsletter', status: 'published', assignee: 'AR', campaign: 'Newsletter Q3' },
  { id: 5, date: '2026-07-09', time: '18:00', platform: 'instagram', title: 'Carousel: 5 tips for stress-free travel', status: 'published', assignee: 'AF', campaign: 'Summer Launch' },
  { id: 6, date: '2026-07-13', time: '09:30', platform: 'linkedin', title: 'Hiring: growth marketer', status: 'published', assignee: 'AF', campaign: '' },
  { id: 7, date: '2026-07-14', time: '17:00', platform: 'instagram', title: 'Summer sale teaser', status: 'published', assignee: 'AF', campaign: 'Summer Launch' },
  { id: 8, date: '2026-07-15', time: '12:00', platform: 'facebook', title: 'Flash sale is live — 48h only', status: 'scheduled', assignee: 'AR', campaign: 'Summer Launch' },
  { id: 9, date: '2026-07-16', time: '10:00', platform: 'linkedin', title: 'CEO op-ed: the future of regional air travel', status: 'review', assignee: 'AF', campaign: 'Brand Awareness' },
  { id: 10, date: '2026-07-17', time: '18:30', platform: 'instagram', title: 'Reel: destination spotlight — Lisbon', status: 'scheduled', assignee: 'AF', campaign: 'Summer Launch' },
  { id: 11, date: '2026-07-20', time: '08:00', platform: 'email', title: 'Mid-month product update', status: 'draft', assignee: 'AR', campaign: 'Newsletter Q3' },
  { id: 12, date: '2026-07-22', time: '09:00', platform: 'linkedin', title: 'Case study: 40% faster bookings', status: 'draft', assignee: 'AR', campaign: 'Brand Awareness' },
  { id: 13, date: '2026-07-24', time: '17:00', platform: 'instagram', title: 'UGC roundup: your summer trips', status: 'idea', assignee: 'AF', campaign: 'Summer Launch' },
  { id: 14, date: '2026-07-27', time: '12:00', platform: 'facebook', title: 'Community Q&A announcement', status: 'draft', assignee: 'AR', campaign: '' },
  { id: 15, date: '2026-07-29', time: '08:00', platform: 'email', title: 'Summer wrap-up newsletter', status: 'idea', assignee: 'AR', campaign: 'Newsletter Q3' },
  { id: 16, date: '2026-07-31', time: '09:00', platform: 'linkedin', title: 'Monthly metrics recap', status: 'idea', assignee: 'AF', campaign: '' },
  { id: 17, date: '2026-07-10', time: '16:00', platform: 'youtube', title: 'Video: a day in the life of our cabin crew', status: 'published', assignee: 'AF', campaign: 'Brand Awareness' },
  { id: 18, date: '2026-07-21', time: '15:00', platform: 'youtube', title: 'Video: how we turn a plane around in 25 minutes', status: 'review', assignee: 'AR', campaign: 'Brand Awareness' },
  { id: 19, date: '2026-07-30', time: '15:00', platform: 'youtube', title: 'Video: Q3 new routes announcement', status: 'idea', assignee: 'AF', campaign: '' },
];

export const seedConnections = { linkedin: true, instagram: true, facebook: true, email: true, youtube: false };

export const initialForm = {
  platform: 'linkedin',
  date: '2026-07-15',
  time: '10:00',
  title: '',
  campaign: '',
  assignee: 'AF',
  media: [],
  publishMode: 'auto',
  reminder: '30',
  requiresApproval: true,
  approver: 'NB',
};

export const initialState = {
  tab: 'calendar',
  calView: 'month',
  filter: 'all',
  channel: 'all',
  modalOpen: false,
  aiMsgs: [],
  aiInput: '',
  aiBusy: false,
  provider: 'claude',
  aiCaption: null,
  refineBusy: false,
  team: seedTeam,
  inviteEmail: '',
  inviteRole: 'Editor',
  wsApproval: true,
  wsReminder: '30',
  wsTz: 'Asia/Dubai',
  notifs: { reminders: true, approvals: true, published: true, weekly: false },
  notifChannel: 'email',
  form: initialForm,
  posts: seedPosts,
  connections: seedConnections,
};
