import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { useAsk } from '../context/AskContext.jsx';
import { useApp } from '../context/AppProviders.jsx';
import { api } from '../api/client.js';
import { ContentCard } from './ContentCard.jsx';

const EXAMPLES = [
  'A short lecture on patience for my commute',
  'Something calm for my kids before sleep',
  'A documentary about history',
  'Help me start learning about Islam',
];

export function AskNoorStream() {
  const { open, closeAsk } = useAsk();
  const { activeProfile } = useApp();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]); // {role, text, results?}
  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && closeAsk();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeAsk]);

  const submit = async (text) => {
    const q = (text ?? query).trim();
    if (!q || loading) return;
    setQuery('');
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const { reply, results } = await api.ask(q, activeProfile);
      setMessages((m) => [...m, { role: 'ai', text: reply, results }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'ai', text: 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Ask NoorStream">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={closeAsk} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-noor-bg/95 shadow-2xl animate-fade-in sm:w-[28rem]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ai-accent">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <div>
              <p className="font-display font-semibold leading-none">Ask NoorStream</p>
              <p className="mt-1 text-[11px] text-noor-muted">AI discovery · curated catalog only</p>
            </div>
          </div>
          <button onClick={closeAsk} className="text-noor-muted hover:text-noor-text" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.length === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-noor-muted">
                Tell me what you're in the mood for — I'll find titles from our reviewed,
                family-safe catalog.
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button key={ex} onClick={() => submit(ex)} className="chip text-left">
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'flex justify-end' : ''}>
              {m.role === 'user' ? (
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-noor-indigo/25 px-4 py-2 text-sm">
                  {m.text}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-noor-surface px-4 py-2 text-sm text-noor-text">
                    {m.text}
                  </div>
                  {m.results?.length > 0 && (
                    <div className="grid grid-cols-2 gap-3" onClick={closeAsk}>
                      {m.results.map((t) => (
                        <ContentCard key={t.id} title={t} width="w-full" />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-noor-muted">
              <Loader2 className="h-4 w-4 animate-spin text-noor-indigo" />
              Searching the catalog…
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="border-t border-white/10 p-4"
        >
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-noor-surface px-2 py-1.5 focus-within:border-noor-indigo/60">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask for something to watch…"
              className="flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-noor-muted"
            />
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ai-accent text-white transition-opacity disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
