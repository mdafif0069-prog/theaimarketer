import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, Check, Star } from 'lucide-react';
import { cx, gradientStyle, formatDuration } from '../lib/utils.js';
import { TierBadge } from './NoorRatingBadge.jsx';
import { useApp } from '../context/AppProviders.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function ContentCard({ title, progress = 0, width = 'w-40 sm:w-44' }) {
  const { activeProfileId, isInWatchlist, toggleWatchlist } = useApp();
  const { toast } = useToast();
  const inList = activeProfileId ? isInWatchlist(activeProfileId, title.id) : false;

  const onToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!activeProfileId) return;
    toggleWatchlist(activeProfileId, title.id);
    toast(inList ? `Removed "${title.title}" from My List` : `Added "${title.title}" to My List`);
  };

  return (
    <Link
      to={`/title/${title.slug}`}
      className={cx(
        'group relative block shrink-0',
        width,
        'rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-noor-gold/70',
      )}
      aria-label={`${title.title} — open details`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-card transition-transform duration-300 group-hover:scale-[1.04] group-hover:shadow-glow">
        {/* Gradient poster */}
        <div className="absolute inset-0" style={gradientStyle(title.grad)} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {/* Top badges */}
        <div className="absolute left-2 top-2 flex items-center gap-1">
          <TierBadge tier={title.tier} />
        </div>
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/40 px-1.5 py-0.5 text-[11px] font-semibold text-noor-gold backdrop-blur">
          <Star className="h-3 w-3 fill-noor-gold" />
          {title.rating}
        </div>

        {/* Title text */}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="font-display text-sm font-semibold leading-tight text-white drop-shadow">
            {title.title}
          </p>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-white/70">
            {title.speaker}
            {title.durationSec ? ` · ${formatDuration(title.durationSec)}` : ' · Series'}
          </p>
        </div>

        {/* Hover overlay actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-noor-glow text-noor-bg shadow-glow">
            <Play className="h-5 w-5 fill-noor-bg" />
          </span>
          <button
            onClick={onToggle}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white transition-colors hover:bg-black/60"
            aria-label={inList ? 'Remove from My List' : 'Add to My List'}
          >
            {inList ? <Check className="h-5 w-5 text-noor-emerald" /> : <Plus className="h-5 w-5" />}
          </button>
        </div>

        {/* Progress bar */}
        {progress > 0 && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-black/50">
            <div className="h-full bg-noor-glow" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </Link>
  );
}
