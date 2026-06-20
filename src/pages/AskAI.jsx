import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Send, BookOpen, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { AI_DATA, aiKey, MADHABS } from '../data/content.js';
import { cx } from '../lib/utils.js';

const CHIPS = [
  { key: 'morning dua', label: 'Morning dua' },
  { key: 'dua for anxiety', label: 'Dua for anxiety' },
  { key: 'is music haram', label: 'Music ruling' },
  { key: 'dua before eating', label: 'Before eating' },
  { key: 'pillars of islam', label: '5 Pillars' },
  { key: 'wudu steps', label: 'Wudu steps' },
  { key: 'morning dua', label: 'دعاء الصباح', ar: true },
  { key: 'dua for anxiety', label: 'دعاء القلق', ar: true },
];

export default function AskAI() {
  const app = useApp();
  const navigate = useNavigate();
  const [ar, setAr] = useState(app.isArabic);
  const [messages, setMessages] = useState([]); // {role, text, dua?, ref?, ar?}
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const reply = (key) => {
    setTyping(true);
    const data = AI_DATA[key] || AI_DATA.default;
    const d = (ar ? data.ar : data.en) || data.en;
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: 'bot', text: d.text, dua: d.dua, ref: d.ref, ar }]);
    }, 900);
  };

  const ask = (key, label) => {
    setMessages((m) => [...m, { role: 'user', text: label, ar }]);
    reply(key);
  };
  const send = () => {
    const v = input.trim();
    if (!v) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: v, ar }]);
    reply(aiKey(v));
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="glass-strong flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ai text-white shadow-glowai">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="font-display text-[15px] font-bold leading-none">Islamic AI Q&A</p>
          <p className="mt-1 text-[11px] text-cloud-dim">Quran · Hadith · Verified scholars</p>
        </div>
        <div className="flex overflow-hidden rounded-full border border-white/15 bg-white/5 text-xs font-semibold">
          {[[false, 'EN'], [true, 'عر']].map(([v, l]) => (
            <button key={l} onClick={() => { setAr(v); app.set({ isArabic: v }); }} className={cx('px-3 py-1.5 transition-colors', ar === v ? 'rounded-full bg-emerald2 text-ink' : 'text-cloud-dim')}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Madhab bar */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-ink-800/60 px-4 py-2.5">
        <span className="shrink-0 text-[11px] text-cloud-dim">Madhab:</span>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {MADHABS.map((m) => (
            <button
              key={m.id}
              onClick={() => app.set({ madhab: m.id })}
              className={cx('shrink-0 rounded-full border px-3 py-1 text-[11px] transition-colors', app.madhab === m.id ? 'border-emerald2 bg-emerald2 text-ink' : 'border-white/15 text-cloud-dim')}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
        <div className="py-2 text-center">
          <p className="arabic text-xl text-emerald2">السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ</p>
          <p className="mt-1 text-xs text-cloud-dim">{ar ? 'اسأل عن الإسلام بالعربية أو الإنجليزية' : 'Ask anything about Islam — in English or Arabic'}</p>
        </div>
        <div className="max-w-[88%] rounded-3xl rounded-bl-md border border-white/10 bg-ink-700 px-4 py-3 text-sm leading-relaxed text-cloud">
          Welcome to NoorStream AI. I answer questions about Islamic rulings, duas, Quran, and Hadith — with authentic references.
          <span className="mt-2 flex items-center gap-1.5 border-t border-white/10 pt-2 text-[11px] text-emerald2">
            <ShieldCheck className="h-3.5 w-3.5" /> All answers cite verified Islamic sources
          </span>
        </div>

        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div key={i} className={cx('ml-auto max-w-[80%] rounded-3xl rounded-br-md bg-emerald2/90 px-4 py-2.5 text-sm text-ink', m.ar && 'arabic text-right text-base')}>
              {m.text}
            </div>
          ) : (
            <div key={i} className={cx('max-w-[90%] rounded-3xl rounded-bl-md border border-white/10 bg-ink-700 px-4 py-3 text-sm leading-relaxed text-cloud', m.ar && 'arabic text-right text-base')}>
              <p>{m.text}</p>
              {m.dua && (
                <div className="mt-2.5 rounded-2xl border border-emerald2/20 bg-emerald2/10 px-3.5 py-3">
                  <p className="arabic mb-1.5 text-lg leading-loose text-emerald2">{m.dua.ar}</p>
                  {m.dua.tr && <p className="mb-1 text-[11px] italic text-cloud-dim">{m.dua.tr}</p>}
                  <p className="text-xs text-cloud-muted">{m.dua.mn}</p>
                </div>
              )}
              <span className="mt-2 flex items-center gap-1.5 border-t border-white/10 pt-2 text-[11px] text-emerald2">
                <BookOpen className="h-3.5 w-3.5" /> {m.ref}
              </span>
              <button onClick={() => navigate('/scholar/khalid')} className="mt-2 flex w-full items-center gap-2 rounded-xl border border-emerald2/15 bg-emerald2/10 px-3 py-2 text-[11px] text-emerald2">
                <UserCheck className="h-4 w-4" />
                <span className="flex-1 text-left">{m.ar ? 'استشر عالماً موثّقاً' : 'Ask a verified scholar'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ),
        )}

        {typing && (
          <div className="flex w-16 items-center justify-center gap-1 rounded-3xl rounded-bl-md border border-white/10 bg-ink-700 px-4 py-3.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-emerald2" style={{ animation: 'typing 0.8s infinite', animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Chips */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2">
        {CHIPS.map((c, i) => (
          <button key={i} onClick={() => ask(c.key, c.label)} className={cx('chip', c.ar && 'arabic text-sm')}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Composer */}
      <div className="flex items-center gap-2.5 border-t border-white/10 bg-ink-800/60 px-4 py-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={ar ? 'اسأل أي سؤال إسلامي...' : 'Ask anything Islamic...'}
          className={cx('flex-1 rounded-full border border-white/12 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-cloud-dim focus:border-emerald2/50', ar && 'arabic text-right text-base')}
        />
        <button onClick={send} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-noor text-ink shadow-glow active:scale-90" aria-label="Send">
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
