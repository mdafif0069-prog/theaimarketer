// Mock catalog for NoorStream. Posters are rendered with CSS gradients (see
// ContentCard / posterGradient) so the app is fully self-contained and offline.

export const CATEGORIES = [
  { id: 'lectures', label: 'Lectures' },
  { id: 'documentaries', label: 'Documentaries' },
  { id: 'series', label: 'Series' },
  { id: 'kids', label: 'Kids' },
  { id: 'quran', label: 'Quran & Tafsir' },
  { id: 'nasheeds', label: 'Nasheeds' },
  { id: 'family', label: 'Family Movies' },
];

export const TIERS = ['kids', 'family', 'teens', 'general'];

// Curated gradient pairs used to render distinct, attractive posters.
const G = [
  ['#1FB58F', '#0E7C63'],
  ['#5B6CFF', '#1FB58F'],
  ['#F5C451', '#0E7C63'],
  ['#5B6CFF', '#0B1020'],
  ['#1FB58F', '#5B6CFF'],
  ['#F5C451', '#FF6B6B'],
  ['#0E7C63', '#0B1020'],
  ['#FFE3A3', '#1FB58F'],
  ['#5B6CFF', '#F5C451'],
  ['#1FB58F', '#121A2E'],
];

let _id = 0;
const make = (t) => {
  _id += 1;
  const grad = G[_id % G.length];
  return {
    id: `t${_id}`,
    slug: t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    grad,
    year: 2021 + (_id % 5),
    rating: (4.2 + ((_id * 7) % 8) / 10).toFixed(1),
    durationSec: t.type === 'series' ? null : (8 + (_id % 6) * 6) * 60,
    languagesAvailable: ['English', 'العربية'],
    subtitleLanguages: ['English', 'العربية', 'Français', 'Türkçe'],
    suitability: {
      music: t.tier === 'kids' ? 'Vocal-only nasheeds' : 'No instrumental music',
      modesty: 'Modest throughout',
      language: 'Clean language',
      themes: t.themes || 'Faith, family, character',
      reviewStatus: _id % 3 === 0 ? 'Scholar-reviewed' : 'Editorially-reviewed',
    },
    episodes:
      t.type === 'series'
        ? Array.from({ length: 6 }, (_, i) => ({
            id: `${t.title}-e${i + 1}`,
            season: 1,
            number: i + 1,
            name: `Episode ${i + 1}`,
            durationSec: (22 + (i % 3) * 6) * 60,
            synopsis: 'A new chapter unfolds with wisdom, heart, and beautiful storytelling.',
          }))
        : null,
    ...t,
  };
};

export const TITLES = [
  make({
    title: 'Light Upon Light',
    type: 'series',
    category: 'series',
    tier: 'family',
    speaker: 'NoorStream Originals',
    topics: ['spirituality', 'history', 'inspiration'],
    synopsis:
      'A landmark original series tracing the moments of light that shaped a civilization of mercy, knowledge, and beauty.',
    themes: 'History, faith, inspiration',
    featured: true,
  }),
  make({
    title: 'The Patient Heart',
    type: 'lecture',
    category: 'lectures',
    tier: 'general',
    speaker: 'Shaykh Ibrahim Yusuf',
    topics: ['patience', 'character', 'self-development'],
    synopsis: 'A moving reflection on sabr — turning hardship into nearness and strength.',
  }),
  make({
    title: 'Stars of the Sahara',
    type: 'documentary',
    category: 'documentaries',
    tier: 'family',
    speaker: 'NoorStream Studios',
    topics: ['nature', 'history', 'science'],
    synopsis: 'A breathtaking journey across the desert and the scholars who mapped the heavens.',
    featured: true,
  }),
  make({
    title: 'Little Lanterns',
    type: 'kids',
    category: 'kids',
    tier: 'kids',
    speaker: 'NoorKids',
    topics: ['manners', 'stories', 'fun'],
    synopsis: 'Cheerful adventures teaching kindness, honesty, and good manners — made for little ones.',
    featured: true,
  }),
  make({
    title: 'The Beautiful Names',
    type: 'series',
    category: 'quran',
    tier: 'family',
    speaker: 'Ustadha Maryam Khan',
    topics: ['quran', 'reflection', 'names of allah'],
    synopsis: 'A gentle, illustrated journey through the meanings of the 99 names.',
  }),
  make({
    title: 'Hearts at Rest',
    type: 'nasheed',
    category: 'nasheeds',
    tier: 'family',
    speaker: 'Noor Voices',
    topics: ['nasheed', 'vocals', 'calm'],
    synopsis: 'Soothing vocal-only nasheeds to bring tranquility to your day.',
  }),
  make({
    title: 'The Traveler',
    type: 'movie',
    category: 'family',
    tier: 'family',
    speaker: 'NoorStream Originals',
    topics: ['drama', 'journey', 'family'],
    synopsis: 'A young man crosses lands and tests of faith to keep a promise to his mother.',
    featured: true,
  }),
  make({
    title: 'Knowledge & Mercy',
    type: 'lecture',
    category: 'lectures',
    tier: 'general',
    speaker: 'Dr. Amina Saleh',
    topics: ['knowledge', 'ethics', 'community'],
    synopsis: 'How seeking knowledge becomes a path of mercy for oneself and others.',
  }),
  make({
    title: 'Gardens of Andalusia',
    type: 'documentary',
    category: 'documentaries',
    tier: 'teens',
    speaker: 'NoorStream Studios',
    topics: ['history', 'art', 'architecture'],
    synopsis: 'The art, science, and gardens of a golden age — beautifully retold.',
  }),
  make({
    title: 'Tiny Reciters',
    type: 'kids',
    category: 'kids',
    tier: 'kids',
    speaker: 'NoorKids',
    topics: ['quran', 'kids', 'learning'],
    synopsis: 'Fun, colorful lessons helping children love and memorize short surahs.',
  }),
  make({
    title: 'The Honest Merchant',
    type: 'movie',
    category: 'family',
    tier: 'family',
    speaker: 'NoorStream Originals',
    topics: ['drama', 'honesty', 'business'],
    synopsis: 'A merchant learns that true wealth is built on trust and integrity.',
  }),
  make({
    title: 'Whispers of Dawn',
    type: 'series',
    category: 'series',
    tier: 'general',
    speaker: 'NoorStream Originals',
    topics: ['drama', 'faith', 'community'],
    synopsis: 'Lives intertwine in a neighborhood awakened by the call to fajr.',
  }),
  make({
    title: 'Tafsir Made Simple',
    type: 'series',
    category: 'quran',
    tier: 'teens',
    speaker: 'Shaykh Ibrahim Yusuf',
    topics: ['quran', 'tafsir', 'learning'],
    synopsis: 'Clear, relatable explanations of beloved surahs for everyday life.',
  }),
  make({
    title: 'Calm Nasheeds for Sleep',
    type: 'nasheed',
    category: 'nasheeds',
    tier: 'kids',
    speaker: 'Noor Voices',
    topics: ['nasheed', 'sleep', 'calm'],
    synopsis: 'Soft, vocal lullaby-style nasheeds to help little ones drift to sleep.',
  }),
  make({
    title: 'Builders of Civilization',
    type: 'documentary',
    category: 'documentaries',
    tier: 'general',
    speaker: 'NoorStream Studios',
    topics: ['history', 'science', 'innovation'],
    synopsis: 'The scientists, doctors, and dreamers who lit the path of progress.',
  }),
  make({
    title: 'The Grateful Garden',
    type: 'kids',
    category: 'kids',
    tier: 'kids',
    speaker: 'NoorKids',
    topics: ['gratitude', 'nature', 'stories'],
    synopsis: 'A magical garden teaches children to say alhamdulillah for every blessing.',
  }),
];

// Curated home rows
export const HOME_ROWS = [
  { id: 'foryou', title: 'For You', ai: true, titleIds: ['t2', 't7', 't15', 't3', 't9'] },
  { id: 'new', title: 'New This Week', titleIds: ['t1', 't12', 't15', 't11', 't9'] },
  { id: 'ramadan', title: 'Seasonal Picks', titleIds: ['t5', 't6', 't13', 't8', 't2'] },
  { id: 'kids', title: "Kids' Favorites", titleIds: ['t4', 't10', 't14', 't16'] },
  { id: 'start', title: 'Start Here', titleIds: ['t8', 't2', 't5', 't15', 't13'] },
];
