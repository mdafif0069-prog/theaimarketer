// Analytics fixtures + chart geometry, ported from the prototype's renderVals().
// In production these come from analytics_daily / post_metrics (README backend jobs).

import { PLATFORMS as P } from '../constants.js';

// --- KPI / bar / best-post shapers (match prototype mk / mkBars / mkPosts) ---
const mk = (arr) =>
  arr.map((a) => ({
    label: a[0],
    value: a[1],
    delta: a[2],
    deltaBg: a[3] ? 'rgba(0,168,58,.12)' : 'rgba(220,60,60,.10)',
    deltaColor: a[3] ? '#00A83A' : '#C43C3C',
  }));

const mkBars = (arr, max) =>
  arr.map((b) => ({ label: b[0], val: b[1], color: b[2], h: Math.round((b[3] / max) * 170) }));

const mkPosts = (arr) =>
  arr.map((p, i) => ({
    rank: '0' + (i + 1),
    title: p[0],
    platform: P[p[1]].name,
    color: P[p[1]].dot,
    date: p[2],
    reach: p[3],
    eng: p[4],
  }));

// Per-channel analytics dataset.
export const DATASET = {
  all: {
    sub: 'All channels · 1 Feb – 15 Jul 2026',
    chartTitle: 'Follower growth',
    kpis: mk([
      ['Total followers', '24,812', '▲ 3.2%', true],
      ['Engagement rate', '4.6%', '▲ 0.4pt', true],
      ['Total reach', '182.4K', '▲ 11.0%', true],
      ['Email subscribers', '9,640', '▼ 0.8%', false],
    ]),
    barsTitle: 'Engagement rate by channel',
    bars: mkBars(
      [
        ['LinkedIn', '5.8%', '#1044FF', 5.8],
        ['Instagram', '6.4%', '#B049FF', 6.4],
        ['Facebook', '2.9%', '#00B8F0', 2.9],
        ['Email CTR', '3.1%', '#808080', 3.1],
        ['YouTube', '4.9%', '#FF4D3D', 4.9],
      ],
      8,
    ),
    posts: mkPosts([
      ['Carousel: 5 tips for stress-free travel', 'instagram', '9 Jul', '24.1K', '8.2%'],
      ['SolitAir Series B announcement', 'linkedin', '2 Jul', '19.7K', '7.4%'],
      ['Customer story: Meridian Air', 'facebook', '6 Jul', '12.3K', '4.1%'],
      ['July newsletter', 'email', '8 Jul', '9.4K', '38% open'],
    ]),
  },
  linkedin: {
    sub: 'LinkedIn · 1 Feb – 15 Jul 2026',
    chartTitle: 'Follower growth',
    kpis: mk([
      ['Followers', '9,840', '▲ 8.1%', true],
      ['Engagement rate', '5.8%', '▲ 0.6pt', true],
      ['Impressions', '84.2K', '▲ 12.4%', true],
      ['Profile visits', '3,214', '▲ 5.2%', true],
    ]),
    barsTitle: 'Engagement breakdown',
    bars: mkBars(
      [
        ['Likes', '3.4K', '#1044FF', 3400],
        ['Comments', '1.1K', '#1044FF', 1100],
        ['Reposts', '412', '#1044FF', 412],
        ['Clicks', '2.0K', '#1044FF', 2000],
      ],
      4000,
    ),
    posts: mkPosts([
      ['SolitAir Series B announcement', 'linkedin', '2 Jul', '19.7K', '7.4%'],
      ['Case study: 40% faster bookings', 'linkedin', '24 Jun', '11.2K', '6.1%'],
      ['Hiring: growth marketer', 'linkedin', '13 Jul', '8.9K', '5.2%'],
    ]),
  },
  instagram: {
    sub: 'Instagram · 1 Feb – 15 Jul 2026',
    chartTitle: 'Follower growth',
    kpis: mk([
      ['Followers', '8,450', '▲ 15.8%', true],
      ['Engagement rate', '6.4%', '▲ 0.9pt', true],
      ['Reach', '78.9K', '▲ 18.2%', true],
      ['Saves', '2,140', '▲ 22.0%', true],
    ]),
    barsTitle: 'Engagement breakdown',
    bars: mkBars(
      [
        ['Likes', '5.8K', '#B049FF', 5800],
        ['Comments', '940', '#B049FF', 940],
        ['Shares', '1.2K', '#B049FF', 1200],
        ['Saves', '2.1K', '#B049FF', 2100],
      ],
      6000,
    ),
    posts: mkPosts([
      ['Carousel: 5 tips for stress-free travel', 'instagram', '9 Jul', '24.1K', '8.2%'],
      ['Reel: destination spotlight — Lisbon', 'instagram', '17 Jun', '18.6K', '7.8%'],
      ['Reel: behind the scenes with our ops team', 'instagram', '3 Jul', '15.2K', '6.9%'],
    ]),
  },
  facebook: {
    sub: 'Facebook · 1 Feb – 15 Jul 2026',
    chartTitle: 'Follower growth',
    kpis: mk([
      ['Followers', '4,880', '▲ 3.8%', true],
      ['Engagement rate', '2.9%', '▼ 0.2pt', false],
      ['Reach', '32.6K', '▲ 4.1%', true],
      ['Link clicks', '1,872', '▲ 6.3%', true],
    ]),
    barsTitle: 'Engagement breakdown',
    bars: mkBars(
      [
        ['Likes', '2.2K', '#00B8F0', 2200],
        ['Comments', '310', '#00B8F0', 310],
        ['Shares', '540', '#00B8F0', 540],
        ['Clicks', '1.9K', '#00B8F0', 1900],
      ],
      2400,
    ),
    posts: mkPosts([
      ['Customer story: Meridian Air', 'facebook', '6 Jul', '12.3K', '4.1%'],
      ['Flash sale is live — 48h only', 'facebook', '15 Jul', '9.8K', '3.6%'],
      ['Community Q&A announcement', 'facebook', '18 Jun', '6.2K', '2.8%'],
    ]),
  },
  email: {
    sub: 'Email · 1 Feb – 15 Jul 2026',
    chartTitle: 'Subscriber growth',
    kpis: mk([
      ['Subscribers', '9,640', '▼ 0.8%', false],
      ['Open rate', '38.0%', '▲ 2.1pt', true],
      ['Click rate', '3.1%', '▲ 0.3pt', true],
      ['Unsubscribes', '42', '▼ 12.0%', true],
    ]),
    barsTitle: 'Email funnel — July newsletter',
    bars: mkBars(
      [
        ['Delivered', '9.5K', '#808080', 9500],
        ['Opened', '3.7K', '#808080', 3660],
        ['Clicked', '299', '#808080', 299],
        ['Booked', '84', '#00A83A', 84],
      ],
      9600,
    ),
    posts: mkPosts([
      ['July newsletter', 'email', '8 Jul', '9.4K', '38% open'],
      ['Mid-June product update', 'email', '15 Jun', '9.3K', '34% open'],
      ['Summer kickoff newsletter', 'email', '1 Jun', '9.1K', '41% open'],
    ]),
  },
  youtube: {
    sub: 'YouTube · 1 Feb – 15 Jul 2026',
    chartTitle: 'Subscriber growth',
    kpis: mk([
      ['Subscribers', '3,120', '▲ 9.4%', true],
      ['Views', '142.6K', '▲ 21.0%', true],
      ['Watch time', '8.4K hrs', '▲ 14.2%', true],
      ['Avg. view duration', '3:42', '▲ 6.0%', true],
    ]),
    barsTitle: 'Engagement breakdown',
    bars: mkBars(
      [
        ['Likes', '4.2K', '#FF4D3D', 4200],
        ['Comments', '610', '#FF4D3D', 610],
        ['Shares', '890', '#FF4D3D', 890],
        ['New subs', '268', '#FF4D3D', 268],
      ],
      4400,
    ),
    posts: mkPosts([
      ['Video: a day in the life of our cabin crew', 'youtube', '10 Jul', '48.2K', '6.8%'],
      ['Video: cockpit tour with Capt. Elena', 'youtube', '12 Jun', '39.5K', '5.9%'],
      ['Video: why regional air travel is back', 'youtube', '28 May', '27.1K', '4.7%'],
    ]),
  },
};

// --- Follower-growth line series (Feb–Jul), 0–10K scale ---
export const SERIES = {
  li: [6200, 6800, 7600, 8300, 9100, 9840],
  ig: [4100, 4600, 5400, 6200, 7300, 8450],
  fb: [3900, 4100, 4300, 4500, 4700, 4880],
  em: [8900, 9100, 9300, 9500, 9700, 9640],
  yt: [1900, 2150, 2400, 2650, 2900, 3120],
};
export const SERIES_MAX = 10000;

export const AREA_FILLS = {
  all: 'rgba(16,68,255,.07)',
  linkedin: 'rgba(16,68,255,.07)',
  instagram: 'rgba(176,73,255,.08)',
  facebook: 'rgba(0,184,240,.08)',
  email: 'rgba(128,128,128,.10)',
  youtube: 'rgba(255,77,61,.08)',
};

// Convert a value series to an SVG polyline "x,y x,y ..." string.
export function linePoints(vals, max) {
  const x0 = 40;
  const x1 = 630;
  const y0 = 195;
  const y1 = 10;
  return vals
    .map((v, i) => {
      const x = x0 + (i / (vals.length - 1)) * (x1 - x0);
      const y = y0 - (v / max) * (y0 - y1);
      return Math.round(x) + ',' + Math.round(y);
    })
    .join(' ');
}

// --- Posting-consistency heatmap (6 weeks × 7 days) ---
export const HEAT_COLORS = ['#EEF0F4', '#B4F5CB', '#4FE388', '#00C34A'];
const HEAT_DATA = [
  [1, 0, 2, 0, 1, 0, 0],
  [0, 2, 1, 1, 0, 1, 0],
  [2, 1, 0, 3, 1, 0, 0],
  [1, 0, 2, 1, 2, 0, 1],
  [0, 3, 1, 0, 2, 1, 0],
  [1, 1, 0, 2, 1, 0, 0],
];
const WEEK_LABELS = ['8 Jun', '15 Jun', '22 Jun', '29 Jun', '6 Jul', '13 Jul'];
export const HEAT_ROWS = HEAT_DATA.map((row, i) => ({
  label: WEEK_LABELS[i],
  days: row.map((v) => ({ c: HEAT_COLORS[v], tip: v + (v === 1 ? ' post' : ' posts') })),
}));
