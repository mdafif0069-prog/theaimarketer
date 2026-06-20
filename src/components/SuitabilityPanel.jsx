import React from 'react';
import { Music, Eye, MessageSquare, Heart, ShieldCheck } from 'lucide-react';

const ROWS = [
  { key: 'music', label: 'Music', icon: Music },
  { key: 'modesty', label: 'Modesty', icon: Eye },
  { key: 'language', label: 'Language', icon: MessageSquare },
  { key: 'themes', label: 'Themes', icon: Heart },
  { key: 'reviewStatus', label: 'Review status', icon: ShieldCheck },
];

export function SuitabilityPanel({ suitability }) {
  if (!suitability) return null;
  return (
    <div className="card-surface overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/5 bg-noor-emerald/10 px-5 py-3">
        <ShieldCheck className="h-5 w-5 text-noor-emerald" />
        <h3 className="font-display font-semibold">Why is this suitable?</h3>
      </div>
      <dl className="divide-y divide-white/5">
        {ROWS.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center gap-3 px-5 py-3">
            <Icon className="h-4 w-4 shrink-0 text-noor-gold" />
            <dt className="w-28 shrink-0 text-sm text-noor-muted">{label}</dt>
            <dd className="text-sm font-medium text-noor-text">{suitability[key]}</dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-white/5 px-5 py-3 text-xs text-noor-muted">
        Every title is reviewed against the NoorStream content-suitability standard.
      </p>
    </div>
  );
}
