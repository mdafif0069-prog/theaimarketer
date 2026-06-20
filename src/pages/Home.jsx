import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { api } from '../api/client.js';
import { useApp } from '../context/AppProviders.jsx';
import { useAsk } from '../context/AskContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { Hero } from '../components/Hero.jsx';
import { ContentRow } from '../components/ContentRow.jsx';
import { RowSkeleton } from '../components/Skeleton.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { TITLES } from '../data/catalog.js';

export default function Home() {
  const { activeProfile, activeProfileId, progressFor, watchlistFor } = useApp();
  const { openAsk } = useAsk();
  const { loading, data } = useAsync(() => api.getHome(activeProfile), [activeProfileId]);

  // Build "Continue Watching" + "My List" rows from local state.
  const continueItems = useMemo(() => {
    const progress = activeProfileId ? progressFor(activeProfileId) : {};
    return Object.keys(progress)
      .filter((id) => progress[id] > 0 && progress[id] < 95) // hide unstarted & finished
      .map((id) => TITLES.find((t) => t.id === id))
      .filter((t) => t && (activeProfile?.isKids ? t.tier === 'kids' : true));
  }, [activeProfileId, activeProfile, progressFor]);

  const myListItems = useMemo(() => {
    const myList = activeProfileId ? watchlistFor(activeProfileId) : [];
    return myList.map((id) => TITLES.find((t) => t.id === id)).filter(Boolean);
  }, [activeProfileId, watchlistFor]);

  if (loading || !data) {
    return (
      <div>
        <Skeleton className="h-[78vh] min-h-[520px] w-full rounded-none" />
        <div className="mt-8 px-4 sm:px-6 lg:px-10">
          <RowSkeleton />
          <RowSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <Hero items={data.hero} />

      <div className="relative z-10 -mt-16">
        {continueItems.length > 0 && (
          <ContentRow title="Continue Watching" items={continueItems} />
        )}

        {data.rows.map((row) => (
          <ContentRow key={row.id} title={row.title} items={row.items} ai={row.ai} />
        ))}

        {myListItems.length > 0 && <ContentRow title="My List" items={myListItems} />}

        {/* AI promo strip */}
        <section className="mx-4 mt-6 overflow-hidden rounded-3xl border border-white/10 bg-ai-accent/10 sm:mx-6 lg:mx-10">
          <div className="relative flex flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:text-left">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ai-accent">
              <Sparkles className="h-7 w-7 text-white" />
            </span>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold">Not sure what to watch?</h3>
              <p className="mt-1 text-noor-muted">
                Ask NoorStream in plain words — it finds the perfect title from our curated,
                family-safe catalog.
              </p>
            </div>
            <button onClick={openAsk} className="btn-primary shrink-0">
              <Sparkles className="h-4 w-4" />
              Ask NoorStream
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
