import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';
import { gradientStyle, formatDuration } from '../lib/utils.js';
import { TierBadge, ReviewBadge } from './NoorRatingBadge.jsx';

export function Hero({ items = [] }) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 6500);
    return () => clearInterval(id);
  }, [items.length]);

  if (!items.length) return null;
  const t = items[index];

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
      {/* Backdrop */}
      <div key={t.id} className="absolute inset-0 animate-fade-in" style={gradientStyle(t.grad, 125)} />
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_70%_20%,transparent,rgba(11,16,32,0.6))]" />
      <div className="absolute inset-0 bg-gradient-to-t from-noor-bg via-noor-bg/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-noor-bg/90 via-noor-bg/30 to-transparent" />

      {/* Content */}
      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-20 sm:px-6 lg:px-10">
        <div className="max-w-2xl animate-fade-in">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-noor-glow px-3 py-1 text-xs font-bold uppercase tracking-wide text-noor-bg">
              Featured
            </span>
            <TierBadge tier={t.tier} />
            <ReviewBadge status={t.suitability.reviewStatus} />
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-tight drop-shadow-lg sm:text-5xl lg:text-6xl">
            {t.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-noor-text/80">
            <span className="flex items-center gap-1 font-semibold text-noor-gold">
              <Star className="h-4 w-4 fill-noor-gold" /> {t.rating}
            </span>
            <span>{t.year}</span>
            <span>{t.durationSec ? formatDuration(t.durationSec) : 'Series'}</span>
            <span className="text-noor-muted">{t.speaker}</span>
          </div>

          <p className="mt-4 max-w-xl text-base text-noor-text/85 sm:text-lg">{t.synopsis}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button onClick={() => navigate(`/watch/${t.slug}`)} className="btn-primary text-base">
              <Play className="h-5 w-5 fill-noor-bg" />
              Play
            </button>
            <button onClick={() => navigate(`/title/${t.slug}`)} className="btn-ghost text-base">
              <Info className="h-5 w-5" />
              More Info
            </button>
          </div>
        </div>

        {/* Dots */}
        {items.length > 1 && (
          <div className="mt-8 flex gap-2">
            {items.map((it, i) => (
              <button
                key={it.id}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-8 bg-noor-gold' : 'w-4 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Show featured ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
