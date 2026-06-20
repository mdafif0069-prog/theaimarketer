import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ChevronRight, TrendingUp } from 'lucide-react';
import { SCHOLARS, TRENDING } from '../data/content.js';
import { Avatar, VerifiedTick, SectionLabel } from '../components/ui.jsx';

const TOP = ['khalid', 'yasmin', 'nouman', 'omar'];

export default function Search() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return TOP;
    return TOP.filter((id) => {
      const s = SCHOLARS[id];
      return [s.name, s.field, s.role].join(' ').toLowerCase().includes(term);
    });
  }, [q]);

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pb-2 pt-4">
        <div className="flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 px-4 py-3 focus-within:border-emerald2/50">
          <SearchIcon className="h-5 w-5 text-cloud-dim" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search scholars, topics, duas..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-cloud-dim"
          />
        </div>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
        {!q && (
          <>
            <SectionLabel className="px-0">Trending topics</SectionLabel>
            <div className="mb-3 flex flex-wrap gap-2">
              {TRENDING.map((t) => (
                <button key={t} onClick={() => setQ(t.replace('#', ''))} className="chip chip-on">
                  <TrendingUp className="h-3.5 w-3.5" /> {t}
                </button>
              ))}
            </div>
          </>
        )}

        <SectionLabel className="px-0">{q ? 'Results' : 'Top scholars'}</SectionLabel>
        <div className="space-y-2.5">
          {results.map((id) => {
            const s = SCHOLARS[id];
            return (
              <button
                key={id}
                onClick={() => navigate(`/scholar/${id}`)}
                className="card flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-ink-600"
              >
                <Avatar initials={s.initials} color={s.color} size={46} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-semibold">{s.name}</span>
                    <VerifiedTick size={15} />
                  </div>
                  <p className="truncate text-[11px] text-cloud-dim">{s.followers} followers · {s.field}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-cloud-dim" />
              </button>
            );
          })}
          {results.length === 0 && (
            <p className="py-10 text-center text-sm text-cloud-dim">No scholars match "{q}".</p>
          )}
        </div>
      </div>
    </div>
  );
}
