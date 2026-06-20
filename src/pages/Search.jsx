import React, { useEffect, useMemo, useState } from 'react';
import { Search as SearchIcon, Sparkles, X } from 'lucide-react';
import { api } from '../api/client.js';
import { CATEGORIES } from '../data/catalog.js';
import { useApp } from '../context/AppProviders.jsx';
import { useAsk } from '../context/AskContext.jsx';
import { ContentCard } from '../components/ContentCard.jsx';
import { GridSkeleton } from '../components/Skeleton.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { cx } from '../lib/utils.js';

const SUGGESTIONS = ['patience', 'history', 'kids', 'quran', 'nasheed', 'documentary'];

export default function Search() {
  const { activeProfile, activeProfileId } = useApp();
  const { openAsk } = useAsk();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  // Debounced instant search.
  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = setTimeout(async () => {
      const r = await api.search({ q, category, profile: activeProfile });
      setResults(r);
      setLoading(false);
    }, 250);
    return () => clearTimeout(id);
  }, [q, category, activeProfile, activeProfileId]);

  const showEmpty = useMemo(
    () => touched && q.trim() && !loading && results.length === 0,
    [touched, q, loading, results],
  );

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-16 pt-24 sm:px-6 lg:px-10">
      {/* Search input */}
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-noor-surface px-4 py-1 focus-within:border-noor-gold/60">
          <SearchIcon className="h-5 w-5 text-noor-muted" />
          <input
            autoFocus
            value={q}
            onChange={(e) => { setQ(e.target.value); setTouched(true); }}
            placeholder="Search titles, speakers, topics…"
            className="flex-1 bg-transparent py-3 text-lg outline-none placeholder:text-noor-muted"
            aria-label="Search"
          />
          {q && (
            <button onClick={() => setQ('')} className="text-noor-muted hover:text-noor-text" aria-label="Clear">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Category filter chips */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setCategory('all')}
            className={cx('chip', category === 'all' && 'chip-active')}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={cx('chip', category === c.id && 'chip-active')}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results / states */}
      <div className="mt-10">
        {loading ? (
          <GridSkeleton count={10} />
        ) : results.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-noor-muted">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{q}"
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {results.map((t) => (
                <ContentCard key={t.id} title={t} width="w-full" />
              ))}
            </div>
          </>
        ) : showEmpty ? (
          <EmptyState
            title={`No results for "${q}"`}
            message="Try different keywords, or let our AI find something for you."
            action={
              <button onClick={openAsk} className="btn-primary">
                <Sparkles className="h-4 w-4" /> Ask NoorStream
              </button>
            }
          />
        ) : (
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-noor-muted">Popular searches</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => { setQ(s); setTouched(true); }} className="chip capitalize">
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={openAsk}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ai-accent px-5 py-2.5 font-semibold text-white transition-transform hover:scale-105"
            >
              <Sparkles className="h-4 w-4" /> Or ask in your own words
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
