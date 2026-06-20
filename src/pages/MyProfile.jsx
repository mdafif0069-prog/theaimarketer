import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark, History, GraduationCap, MessageCircleQuestion, Scale, Bell, Settings, RefreshCw, ChevronRight, LogOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { MADHABS } from '../data/content.js';

export default function MyProfile() {
  const navigate = useNavigate();
  const app = useApp();
  const madhab = MADHABS.find((m) => m.id === app.madhab)?.name || 'General';
  const savedCount = Object.values(app.saved).filter(Boolean).length;

  const rows = [
    { icon: Bookmark, label: 'Saved content', meta: savedCount ? `${savedCount}` : null },
    { icon: History, label: 'Watch history' },
    { icon: GraduationCap, label: 'My courses' },
    { icon: MessageCircleQuestion, label: 'AI conversation history', onClick: () => navigate('/ai') },
    { icon: Scale, label: `Madhab: ${madhab}` },
    { icon: Bell, label: 'Notification settings' },
    { icon: Settings, label: 'Settings' },
    { icon: RefreshCw, label: 'Restart onboarding demo', onClick: () => { app.resetOnboarding(); navigate('/', { replace: true }); } },
  ];

  return (
    <div className="no-scrollbar h-full overflow-y-auto">
      {/* Header */}
      <div className="relative flex flex-col items-center px-6 pb-6 pt-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-noor opacity-[0.10] blur-2xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet2 to-emerald2 text-2xl font-semibold text-white shadow-glow">
          MA
        </div>
        <h1 className="mt-3 font-display text-xl font-bold">Mohammad Afif</h1>
        <p className="text-xs text-cloud-dim">Following {madhab} · {app.interests.length} interests</p>
      </div>

      {/* Stat strip */}
      <div className="mx-5 mb-2 grid grid-cols-3 gap-2">
        {[[savedCount, 'Saved'], [Object.values(app.following).filter(Boolean).length, 'Following'], [app.interests.length, 'Interests']].map(([v, l]) => (
          <div key={l} className="rounded-2xl bg-white/[0.04] py-3 text-center">
            <div className="text-lg font-semibold text-emerald2">{v}</div>
            <div className="text-[10px] text-cloud-dim">{l}</div>
          </div>
        ))}
      </div>

      <div className="mt-2">
        {rows.map((r) => (
          <button
            key={r.label}
            onClick={r.onClick}
            className="flex w-full items-center gap-3.5 border-b border-white/5 px-6 py-4 text-left transition-colors hover:bg-white/[0.03]"
          >
            <r.icon className="h-5 w-5 text-emerald2" />
            <span className="flex-1 text-sm">{r.label}</span>
            {r.meta && <span className="rounded-full bg-emerald2/15 px-2 py-0.5 text-[11px] text-emerald2">{r.meta}</span>}
            <ChevronRight className="h-4 w-4 text-cloud-dim" />
          </button>
        ))}
        <button className="flex w-full items-center gap-3.5 px-6 py-4 text-left text-rose-400">
          <LogOut className="h-5 w-5" />
          <span className="flex-1 text-sm">Sign out</span>
        </button>
      </div>
      <div className="h-4" />
    </div>
  );
}
