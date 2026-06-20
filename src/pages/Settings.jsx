import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Play, Lock, User, Shield, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppProviders.jsx';
import { useToast } from '../context/ToastContext.jsx';

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="font-medium">{label}</p>
        {description && <p className="text-sm text-noor-muted">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-noor-emerald' : 'bg-white/15'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? 'left-[1.375rem]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <section className="card-surface p-5">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-5 w-5 text-noor-gold" />
        <h2 className="font-display text-lg font-semibold">{title}</h2>
      </div>
      <div className="divide-y divide-white/5">{children}</div>
    </section>
  );
}

export default function Settings() {
  const { user, activeProfile } = useApp();
  const { toast } = useToast();
  const [autoplay, setAutoplay] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [language, setLanguage] = useState('English (EN)');

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 sm:px-6">
      <h1 className="mb-8 font-display text-3xl font-extrabold">Settings</h1>

      <div className="space-y-6">
        <Section icon={User} title="Account">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{user?.email || 'Guest'}</p>
              <p className="text-sm text-noor-muted capitalize">{user?.plan || 'free'} plan</p>
            </div>
            <Link to="/plans" className="btn-ghost px-4 py-2 text-sm">Manage plan</Link>
          </div>
          <div className="flex items-center justify-between py-3">
            <p className="font-medium">Active profile</p>
            <Link to="/profiles" className="flex items-center gap-1 text-sm text-noor-gold">
              {activeProfile?.name} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </Section>

        <Section icon={Play} title="Playback">
          <Toggle
            checked={autoplay}
            onChange={setAutoplay}
            label="Autoplay next episode"
            description="Automatically play the next episode in a series."
          />
          <Toggle
            checked={dataSaver}
            onChange={setDataSaver}
            label="Data saver"
            description="Lower video quality to use less data."
          />
        </Section>

        <Section icon={Globe} title="Language & Display">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Language</p>
              <p className="text-sm text-noor-muted">Interface, subtitles & audio preference.</p>
            </div>
            <select
              value={language}
              onChange={(e) => { setLanguage(e.target.value); toast('Language preference saved'); }}
              className="rounded-lg border border-white/10 bg-noor-surface2 px-3 py-2 text-sm outline-none"
            >
              <option>English (EN)</option>
              <option>العربية (AR)</option>
              <option>Français (FR)</option>
              <option>Türkçe (TR)</option>
            </select>
          </div>
          <Toggle
            checked={reduceMotion}
            onChange={setReduceMotion}
            label="Reduce motion"
            description="Minimize animations and transitions."
          />
        </Section>

        <Section icon={Shield} title="Parental Controls">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Parental PIN</p>
              <p className="text-sm text-noor-muted">Required to exit Kids Mode. (Demo PIN: 1379)</p>
            </div>
            <button onClick={() => toast('PIN change is a demo placeholder')} className="btn-ghost px-4 py-2 text-sm">
              <Lock className="h-4 w-4" /> Change PIN
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Maturity ceiling</p>
              <p className="text-sm text-noor-muted">Limit the maturity of content shown on this profile.</p>
            </div>
            <select className="rounded-lg border border-white/10 bg-noor-surface2 px-3 py-2 text-sm outline-none">
              <option>Kids</option>
              <option>Family</option>
              <option>Teens</option>
              <option defaultValue>General</option>
            </select>
          </div>
        </Section>
      </div>
    </div>
  );
}
