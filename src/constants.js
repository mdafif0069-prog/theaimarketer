// Design tokens & domain constants, ported verbatim from the prototype
// (SolitAir Social Hub.dc.html). Treated as final per the handoff (README.md).

export const TODAY = '2026-07-15';

export const PLATFORMS = {
  linkedin: { name: 'LinkedIn', dot: '#1044FF', chipBg: 'rgba(16,68,255,.08)' },
  instagram: { name: 'Instagram', dot: '#B049FF', chipBg: 'rgba(176,73,255,.10)' },
  facebook: { name: 'Facebook', dot: '#00B8F0', chipBg: 'rgba(0,184,240,.10)' },
  email: { name: 'Email', dot: '#808080', chipBg: 'rgba(128,128,128,.10)' },
  youtube: { name: 'YouTube', dot: '#FF4D3D', chipBg: 'rgba(255,77,61,.10)' },
};

export const STATUSES = {
  idea: { label: 'Idea', bg: '#EDEFF4', color: '#555A66' },
  draft: { label: 'Draft', bg: 'rgba(128,128,128,.15)', color: '#555A66' },
  review: { label: 'In review', bg: 'rgba(16,68,255,.10)', color: '#1044FF' },
  scheduled: { label: 'Scheduled', bg: 'rgba(0,168,58,.12)', color: '#00A83A' },
  published: { label: 'Published', bg: '#14171F', color: '#FFFFFF' },
};

export const AVATARS = { AF: '#1044FF', AR: '#B049FF', NB: '#14171F' };

// Status flow order for the kanban board.
export const ORDER = ['idea', 'draft', 'review', 'scheduled', 'published'];
export const ADVANCE_LABEL = { idea: 'Draft', draft: 'To review', review: 'Approve', scheduled: 'Publish' };

// Media limits per platform (MB). Validated client-side; re-validate server-side too.
export const MEDIA_SPECS = {
  linkedin: {
    text: 'Image JPG/PNG up to 8 MB · Video MP4 up to 5 GB / 10 min · Document PDF up to 100 MB, 300 pages',
    image: 8,
    video: 5120,
    doc: 100,
  },
  instagram: {
    text: 'Image JPG/PNG up to 30 MB, ideal 1080×1350 · Reel MP4 up to 250 MB / 90 s · Documents not supported',
    image: 30,
    video: 250,
    doc: 0,
  },
  facebook: {
    text: 'Image JPG/PNG up to 4 MB · Video MP4 up to 10 GB / 240 min · Documents not supported',
    image: 4,
    video: 10240,
    doc: 0,
  },
  email: {
    text: 'Inline images up to 1 MB each · Attachments up to 10 MB total per send',
    image: 1,
    video: 10,
    doc: 10,
  },
  youtube: {
    text: 'Video MP4/MOV up to 256 GB / 12 hrs · Thumbnail JPG/PNG up to 2 MB',
    image: 2,
    video: 262144,
    doc: 0,
  },
};

export const BEST_TIMES = {
  linkedin: { slot: 'Tue · 9:00 AM', time: '09:00', uplift: '+41% eng.' },
  instagram: { slot: 'Thu · 6:00 PM', time: '18:00', uplift: '+38% eng.' },
  facebook: { slot: 'Wed · 12:00 PM', time: '12:00', uplift: '+24% eng.' },
  email: { slot: 'Tue · 8:00 AM', time: '08:00', uplift: '+9pt opens' },
  youtube: { slot: 'Sat · 3:00 PM', time: '15:00', uplift: '+33% views' },
};

export const CADENCE = [
  { key: 'linkedin', current: 2, suggested: 3, note: 'Engagement holds up to 3/wk' },
  { key: 'instagram', current: 3, suggested: 5, note: 'Reels are your top format — add 2' },
  { key: 'facebook', current: 1, suggested: 2, note: 'Low effort — cross-post from Instagram' },
  { key: 'email', current: 0.5, suggested: 1, note: 'Weekly beats bi-weekly on open rate' },
  { key: 'youtube', current: 0.5, suggested: 1, note: 'One video a week sustains growth' },
];

export const PERM_STYLES = {
  Admin: { bg: '#14171F', color: '#fff' },
  Approver: { bg: 'rgba(16,68,255,.10)', color: '#1044FF' },
  Editor: { bg: '#EDEFF4', color: '#555A66' },
};

export const NOTIF_DEFS = [
  { key: 'reminders', title: 'Post reminders', desc: 'Before each scheduled post (manual mode)' },
  { key: 'approvals', title: 'Approval requests', desc: 'When a post is submitted for Nabil to review' },
  { key: 'published', title: 'Publish confirmations', desc: 'When an auto-publish goes live or fails' },
  { key: 'weekly', title: 'Weekly performance digest', desc: 'Monday morning summary of all channels' },
];

export const MONTSERRAT = "'Montserrat', system-ui, sans-serif";
