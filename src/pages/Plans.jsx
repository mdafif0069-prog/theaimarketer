import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['Limited catalog', 'Standard definition', 'House ads', '1 profile'],
    cta: 'Current plan',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '$7.99',
    period: '/ month',
    features: [
      'Full curated catalog',
      'Full HD streaming',
      'No ads',
      'Up to 5 profiles + Kids Mode',
      'AI discovery (Ask NoorStream)',
      'Watch on any device',
    ],
    cta: 'Upgrade to Premium',
    highlight: true,
  },
  {
    name: 'Family Annual',
    price: '$69',
    period: '/ year',
    features: ['Everything in Premium', '2 months free', 'Priority support', 'Early access to originals'],
    cta: 'Go Annual',
    highlight: false,
  },
];

export default function Plans() {
  const { toast } = useToast();
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-10">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-noor-gold/30 bg-noor-gold/10 px-4 py-1.5 text-sm text-noor-gold">
          <Sparkles className="h-4 w-4" /> Simple, honest pricing
        </span>
        <h1 className="mt-5 font-display text-4xl font-extrabold sm:text-5xl">
          Choose your <span className="noor-text-gradient">NoorStream</span> plan
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-noor-muted">
          Cancel anytime. Every plan gives your family a safe place to press play without worry.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`relative flex flex-col rounded-3xl border p-7 ${
              p.highlight
                ? 'border-noor-gold/50 bg-gradient-to-b from-noor-gold/10 to-transparent shadow-glow'
                : 'border-white/10 bg-noor-surface'
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-noor-glow px-3 py-1 text-xs font-bold text-noor-bg">
                Most popular
              </span>
            )}
            <h2 className="font-display text-xl font-bold">{p.name}</h2>
            <div className="mt-3 flex items-end gap-1">
              <span className="font-display text-4xl font-extrabold">{p.price}</span>
              <span className="mb-1 text-noor-muted">{p.period}</span>
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-noor-emerald" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => toast(`${p.name} selected (demo checkout)`)}
              className={`mt-7 w-full ${p.highlight ? 'btn-primary' : 'btn-ghost'}`}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
