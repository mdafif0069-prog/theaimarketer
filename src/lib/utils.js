export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function formatDuration(seconds) {
  if (!seconds) return '';
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

export const TIER_LABEL = {
  kids: 'Kids',
  family: 'Family',
  teens: 'Teens',
  general: 'General',
};

export const TIER_COLOR = {
  kids: 'bg-noor-gold/20 text-noor-gold border-noor-gold/30',
  family: 'bg-noor-emerald/20 text-noor-emerald border-noor-emerald/30',
  teens: 'bg-noor-indigo/20 text-noor-indigo border-noor-indigo/30',
  general: 'bg-white/10 text-noor-muted border-white/20',
};

// Deterministic gradient style for posters/heroes.
export function gradientStyle(grad, angle = 145) {
  const [a, b] = grad || ['#1FB58F', '#0E7C63'];
  return { backgroundImage: `linear-gradient(${angle}deg, ${a}, ${b})` };
}
