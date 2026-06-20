// Typed mock API layer for NoorStream.
//
// Every function here mirrors the contract in docs/02_Technical_Architecture.md so
// a real backend can be dropped in later without touching the UI. Calls simulate
// network latency and return plain data.

import { TITLES, HOME_ROWS, CATEGORIES } from '../data/catalog.js';

const delay = (ms = 220) => new Promise((r) => setTimeout(r, ms));

const byId = (id) => TITLES.find((t) => t.id === id);
const bySlug = (slug) => TITLES.find((t) => t.slug === slug);

// Tier visibility: a Kids profile may only ever see Kids-tier titles.
function visibleFor(profile) {
  if (profile?.isKids) return TITLES.filter((t) => t.tier === 'kids');
  return TITLES;
}

export const api = {
  async getHome(profile) {
    await delay();
    const pool = visibleFor(profile);
    const allowed = new Set(pool.map((t) => t.id));
    const rows = HOME_ROWS.map((row) => ({
      ...row,
      items: row.titleIds.map(byId).filter((t) => t && allowed.has(t.id)),
    })).filter((row) => row.items.length > 0);
    return { hero: pool.filter((t) => t.featured).slice(0, 4), rows };
  },

  async getCategories() {
    await delay(80);
    return CATEGORIES;
  },

  async browse({ category = 'all', tier = 'all', profile } = {}) {
    await delay();
    let list = visibleFor(profile);
    if (category !== 'all') list = list.filter((t) => t.category === category);
    if (tier !== 'all') list = list.filter((t) => t.tier === tier);
    return list;
  },

  async getTitle(slug, profile) {
    await delay();
    const title = bySlug(slug);
    if (!title) return null;
    // Entitlement: a Kids profile cannot open a non-kids title.
    if (profile?.isKids && title.tier !== 'kids') {
      const err = new Error('This title is not available in Kids Mode.');
      err.code = 'FORBIDDEN';
      throw err;
    }
    const related = TITLES.filter(
      (t) => t.id !== title.id && t.category === title.category,
    ).slice(0, 6);
    return { ...title, related };
  },

  async search({ q = '', category = 'all', tier = 'all', profile } = {}) {
    await delay(160);
    const term = q.trim().toLowerCase();
    let list = visibleFor(profile);
    if (category !== 'all') list = list.filter((t) => t.category === category);
    if (tier !== 'all') list = list.filter((t) => t.tier === tier);
    if (!term) return [];
    return list.filter((t) => {
      const hay = [t.title, t.speaker, t.synopsis, ...(t.topics || [])]
        .join(' ')
        .toLowerCase();
      return hay.includes(term);
    });
  },

  // "Ask NoorStream" — a mock catalog-scoped AI. It NEVER returns anything
  // outside the curated catalog (this preserves the halal-trust guarantee).
  async ask(query, profile) {
    await delay(700);
    const q = query.toLowerCase();
    const pool = visibleFor(profile);

    const wantKids = /(kid|child|little|son|daughter)/.test(q);
    const wantShort = /(short|quick|\b\d+\s?min|commute|brief)/.test(q);
    const wantCalm = /(calm|sleep|relax|peace|tranquil|nasheed)/.test(q);

    const topicHits = pool
      .map((t) => {
        let score = 0;
        const hay = [t.title, t.synopsis, ...(t.topics || [])].join(' ').toLowerCase();
        q.split(/\s+/).forEach((w) => {
          if (w.length > 3 && hay.includes(w)) score += 2;
        });
        if (wantKids && t.tier === 'kids') score += 4;
        if (wantCalm && t.category === 'nasheeds') score += 4;
        if (wantShort && t.durationSec && t.durationSec <= 20 * 60) score += 3;
        return { t, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((x) => x.t);

    const results = topicHits.length ? topicHits : pool.slice(0, 4);
    const reply = topicHits.length
      ? `Here are ${results.length} curated picks I think fit "${query.trim()}". Every result is from our reviewed catalog.`
      : `I couldn't find an exact match for "${query.trim()}", but here are some loved titles to explore. All from our reviewed catalog.`;
    return { reply, results };
  },

  async recommend(profile) {
    await delay();
    const pool = visibleFor(profile);
    return pool.slice().reverse().slice(0, 6);
  },
};
