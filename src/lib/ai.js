// AI client seam.
//
// Phase 5 wires these to the Supabase `ai` Edge Function (Anthropic key stays
// server-side). For Phase 1 (local state, no backend) we ship a lightweight
// local fallback so the Assistant and "Refine caption" flows are fully usable.
//
// Set VITE_AI_ENDPOINT to your deployed Edge Function base URL to switch over —
// no UI changes needed. The endpoint is expected to expose:
//   POST {base}/assistant       { system, messages } -> { text }
//   POST {base}/refine-caption  { platform, copy }   -> { text }

import { BEST_TIMES, CADENCE, PLATFORMS } from '../constants.js';

const ENDPOINT = import.meta.env?.VITE_AI_ENDPOINT || '';

// System prompt shape mirrors the prototype's sendAi() so the real Edge
// Function receives the same context the design was built around.
export function buildAssistantSystem(posts) {
  return (
    "You are the AI assistant inside SolitAir's internal social media tool " +
    '(SolitAir is a regional airline). Answer questions about post performance, ' +
    'timing, cadence and content using ONLY this data. Be concise (under 120 words), ' +
    'plain text, no markdown. ' +
    'KPIs Feb–Jul 2026: total followers 24,812 (+3.2% vs June), engagement 4.6%, ' +
    'reach 182.4K. LinkedIn 9,840 followers / 5.8% eng; Instagram 8,450 / 6.4%; ' +
    'Facebook 4,880 / 2.9% (down 0.2pt); Email 9,640 subs / 38% open / 3.1% CTR; ' +
    'YouTube 3,120 subs / 142.6K views. ' +
    'Best posting times: ' + JSON.stringify(BEST_TIMES) + '. ' +
    'Suggested cadence (posts/week): ' + JSON.stringify(CADENCE) + '. ' +
    'Top posts: Instagram carousel "5 tips for stress-free travel" 9 Jul, 24.1K reach, ' +
    '8.2% eng; LinkedIn "Series B announcement" 2 Jul, 19.7K, 7.4%; YouTube "day in the ' +
    'life of our cabin crew" 10 Jul, 48.2K views, 6.8%; Email "July newsletter" 8 Jul, ' +
    '9.4K delivered, 38% open. ' +
    'All posts: ' +
    JSON.stringify(posts.map((p) => ({ date: p.date, time: p.time, platform: p.platform, title: p.title, status: p.status })))
  );
}

async function post(path, body) {
  const res = await fetch(ENDPOINT.replace(/\/$/, '') + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('AI request failed: ' + res.status);
  const data = await res.json();
  return data.text ?? data.completion ?? '';
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// --- Assistant chat ---
export async function assistantComplete({ system, messages, posts }) {
  if (ENDPOINT) return post('/assistant', { system, messages });
  await wait(650);
  return localAssistantAnswer(messages, posts);
}

// --- Caption refinement ---
export async function refineCaption(platformKey, copy) {
  const platform = PLATFORMS[platformKey]?.name || 'social';
  if (ENDPOINT) return post('/refine-caption', { platform: platformKey, copy });
  await wait(650);
  return localRefine(platformKey, platform, copy);
}

// -------------------- Local (offline) fallbacks --------------------

function localAssistantAnswer(messages, posts) {
  const last = [...messages].reverse().find((m) => m.role === 'user');
  const q = (last?.content || '').toLowerCase();

  if (q.includes('reach') || q.includes('most people') || q.includes('best post')) {
    return 'Your top July reach was the Instagram carousel "5 tips for stress-free travel" (9 Jul) at 24.1K reach and 8.2% engagement — your best of the month. Next were the LinkedIn Series B announcement (2 Jul, 19.7K, 7.4%) and the YouTube "day in the life of our cabin crew" (10 Jul, 48.2K views). Carousels and Reels are clearly outperforming single images.';
  }
  if (q.includes('instagram') && (q.includes('when') || q.includes('time'))) {
    return 'Best time to post on Instagram is Thursday around 6:00 PM (Asia/Dubai) — that slot runs about +38% engagement vs your average. Reels do best there. You are posting ~3×/week; bumping to 5 (mostly Reels) is the suggested cadence.';
  }
  if (q.includes('per week') || q.includes('how many') || q.includes('cadence')) {
    return 'Suggested weekly cadence: LinkedIn 2→3, Instagram 3→5 (add two Reels), Facebook 1→2 (cross-post from Instagram), Email 0.5→1 (weekly beats bi-weekly on opens), YouTube 0.5→1. Instagram is your highest-leverage channel to add volume.';
  }
  if (q.includes('facebook') && (q.includes('drop') || q.includes('down') || q.includes('why'))) {
    return 'Facebook engagement slipped 0.2pt to 2.9% — the lowest of your channels. Reach still grew 4.1%, so this is a content-fit issue, not distribution. The cheapest fix is cross-posting your best Instagram Reels/carousels to Facebook rather than original-writing there.';
  }
  const totals = posts.reduce((acc, p) => ((acc[p.status] = (acc[p.status] || 0) + 1), acc), {});
  return (
    'Here is a quick read on your workspace: ' +
    (totals.scheduled || 0) + ' scheduled, ' + (totals.review || 0) + ' in review, ' +
    (totals.draft || 0) + ' drafts and ' + (totals.idea || 0) + ' ideas. ' +
    'Overall engagement is 4.6% (▲0.4pt) on 182.4K reach. Ask me about best times, ' +
    'cadence, why a channel moved, or which post reached the most people.'
  );
}

function localRefine(platformKey, platform, copy) {
  const base = (copy || '').trim().replace(/\s+/g, ' ');
  const punchy = base.charAt(0).toUpperCase() + base.slice(1);
  if (platformKey === 'email') {
    return punchy + '\n\nClear, warm and on-brand — ready to send. (Local preview; connect the AI Edge Function for live refinement.)';
  }
  const tagMap = {
    linkedin: '#SolitAir #RegionalAviation #AvGeek',
    instagram: '#SolitAir #FlySolitAir #TravelMoments',
    facebook: '#SolitAir #FlySolitAir',
    youtube: '#SolitAir #Aviation #BehindTheScenes',
  };
  const tags = tagMap[platformKey] || '#SolitAir';
  return `✈️ ${punchy}\n\n${tags}\n\n(Local preview — connect the AI Edge Function for live, on-brand refinement.)`;
}
