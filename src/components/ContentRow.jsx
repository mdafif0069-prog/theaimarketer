import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ContentCard } from './ContentCard.jsx';
import { useApp } from '../context/AppProviders.jsx';

export function ContentRow({ title, items, ai = false }) {
  const scroller = useRef(null);
  const { activeProfileId, progressFor } = useApp();
  const progress = activeProfileId ? progressFor(activeProfileId) : {};

  const scroll = (dir) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  if (!items?.length) return null;

  return (
    <section className="group/row relative mb-10">
      <div className="mb-3 flex items-center gap-2 px-4 sm:px-6 lg:px-10">
        {ai && (
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ai-accent">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </span>
        )}
        <h2 className="font-display text-lg font-semibold sm:text-xl">{title}</h2>
        {ai && <span className="text-xs font-medium text-noor-indigo">AI picks</span>}
      </div>

      <div className="relative">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-1 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-opacity hover:bg-black/80 group-hover/row:opacity-100 md:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          ref={scroller}
          className="no-scrollbar flex snap-x gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-6 lg:px-10"
        >
          {items.map((t) => (
            <div key={t.id} className="snap-start">
              <ContentCard title={t} progress={progress[t.id] || 0} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll(1)}
          className="absolute right-1 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-opacity hover:bg-black/80 group-hover/row:opacity-100 md:flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
