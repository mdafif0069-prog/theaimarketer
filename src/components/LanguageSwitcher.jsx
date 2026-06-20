import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useI18n } from '../context/LanguageContext.jsx';

export function LanguageSwitcher({ compact = false }) {
  const { lang, setLang, languages } = useI18n();
  const [open, setOpen] = useState(false);
  const current = languages.find((l) => l.code === lang);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm text-noor-muted transition-colors hover:text-noor-text"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" />
        {!compact && <span>{current?.native}</span>}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute end-0 z-20 mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-noor-surface2 shadow-card animate-fade-in">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-start text-sm transition-colors hover:bg-white/5"
              >
                <span>{l.native}</span>
                {l.code === lang && <Check className="h-4 w-4 text-noor-emerald" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
