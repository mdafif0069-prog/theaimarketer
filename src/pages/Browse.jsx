import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { api } from '../api/client.js';
import { CATEGORIES, TIERS } from '../data/catalog.js';
import { useApp } from '../context/AppProviders.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { ContentCard } from '../components/ContentCard.jsx';
import { GridSkeleton } from '../components/Skeleton.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { cx, TIER_LABEL } from '../lib/utils.js';

export default function Browse() {
  const { category: routeCategory } = useParams();
  const { activeProfile, activeProfileId, progressFor } = useApp();
  const [category, setCategory] = useState(routeCategory || 'all');
  const [tier, setTier] = useState('all');

  // If navigating to /browse/kids, lock the experience to the kids category.
  const isKidsRoute = routeCategory === 'kids';
  const effectiveCategory = isKidsRoute ? 'kids' : category;

  const { loading, data } = useAsync(
    () => api.browse({ category: effectiveCategory, tier, profile: activeProfile }),
    [effectiveCategory, tier, activeProfileId],
  );

  const progress = activeProfileId ? progressFor(activeProfileId) : {};

  return (
    <div className="px-4 pb-16 pt-24 sm:px-6 lg:px-10">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="font-display text-3xl font-extrabold">
          {isKidsRoute ? 'Kids' : 'Browse'}
        </h1>
        <p className="text-noor-muted">
          {isKidsRoute
            ? 'Safe, joyful content made just for children.'
            : 'Explore our curated, family-safe catalog.'}
        </p>
      </div>

      {/* Filters */}
      {!isKidsRoute && (
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-2 text-sm text-noor-muted">
            <SlidersHorizontal className="h-4 w-4" />
            Category
          </div>
          <div className="flex flex-wrap gap-2">
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

          {!activeProfile?.isKids && (
            <>
              <div className="pt-2 text-sm text-noor-muted">Audience</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTier('all')}
                  className={cx('chip', tier === 'all' && 'chip-active')}
                >
                  All ages
                </button>
                {TIERS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTier(t)}
                    className={cx('chip', tier === t && 'chip-active')}
                  >
                    {TIER_LABEL[t]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <GridSkeleton />
      ) : data?.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {data.map((t) => (
            <ContentCard key={t.id} title={t} width="w-full" progress={progress[t.id] || 0} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No titles here yet"
          message="Try a different category or audience filter."
          action={
            <button onClick={() => { setCategory('all'); setTier('all'); }} className="btn-ghost">
              Reset filters
            </button>
          }
        />
      )}
    </div>
  );
}
