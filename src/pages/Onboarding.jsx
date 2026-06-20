import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, ShieldCheck, Sparkles, Lock, Check, BadgeCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { Icon } from '../lib/icons.jsx';
import { Toggle } from '../components/ui.jsx';
import { INTERESTS, MADHABS, LANGUAGES, NOTIF_TYPES } from '../data/content.js';
import { cx } from '../lib/utils.js';

const STEPS = ['welcome', 'interests', 'madhab', 'language', 'notifs', 'done'];

export default function Onboarding() {
  const app = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const go = (n) => setStep(Math.max(0, Math.min(STEPS.length - 1, n)));
  const finish = () => {
    app.set({ onboarded: true });
    navigate('/feed', { replace: true });
  };

  const name = STEPS[step];

  return (
    <div className="flex h-full flex-col">
      {step > 0 && step < 5 && <Progress step={step} />}
      {step > 0 && step < 5 && (
        <button onClick={() => go(step - 1)} className="flex items-center gap-1.5 px-6 pt-3 text-sm text-cloud-dim">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      )}

      {name === 'welcome' && <Welcome key="w" onNext={() => go(1)} />}
      {name === 'interests' && <Interests key="i" app={app} onNext={() => go(2)} />}
      {name === 'madhab' && <Madhab key="m" app={app} onNext={() => go(3)} />}
      {name === 'language' && <Language key="l" app={app} onNext={() => go(4)} />}
      {name === 'notifs' && <Notifs key="n" app={app} onNext={() => go(5)} />}
      {name === 'done' && <Done key="d" app={app} onEnter={finish} />}
    </div>
  );
}

function Progress({ step }) {
  return (
    <div className="flex gap-1.5 px-6 pt-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald2 transition-all duration-500"
            style={{ width: i < step ? '100%' : i === step ? '55%' : '0%' }}
          />
        </div>
      ))}
    </div>
  );
}

function StepBody({ children }) {
  return <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-4 pt-3 animate-slide-in">{children}</div>;
}
function StepFooter({ children }) {
  return <div className="shrink-0 px-6 pb-7 pt-2">{children}</div>;
}
function H({ children }) {
  return <h1 className="font-display text-[26px] font-bold leading-tight">{children}</h1>;
}
function Sub({ children }) {
  return <p className="mt-2 text-sm leading-relaxed text-cloud-muted">{children}</p>;
}

/* ---------- Welcome ---------- */
function Welcome({ onNext }) {
  const features = [
    { icon: ShieldCheck, t: 'Scholar-verified content', d: 'Every creator vetted by qualified scholars' },
    { icon: Sparkles, t: 'AI Q&A with Hadith sources', d: 'Instant answers from Quran & Sunnah' },
    { icon: Lock, t: '100% halal environment', d: 'No inappropriate ads, music, or content' },
  ];
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center animate-fade-up">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-noor text-ink shadow-glow">
          <span className="font-display text-4xl font-extrabold">N</span>
        </div>
        <p className="arabic mb-3 text-2xl text-emerald2/90">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <h1 className="font-display text-3xl font-bold">
          Welcome to <span className="noor-gradient-text">NoorStream</span>
        </h1>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-cloud-muted">
          The world's first verified Islamic content platform. Scholar-verified. Halal-only.
        </p>
        <div className="mt-8 w-full space-y-2.5">
          {features.map((f) => (
            <div key={f.t} className="glass flex items-center gap-3 rounded-2xl p-3.5 text-left">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald2/15 text-emerald2">
                <f.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{f.t}</p>
                <p className="text-xs text-cloud-dim">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <StepFooter>
        <button onClick={onNext} className="btn-noor w-full">
          Get started <ArrowRight className="h-5 w-5" />
        </button>
        <button onClick={onNext} className="mt-2 w-full py-2.5 text-sm text-cloud-dim">
          Already have an account? Sign in
        </button>
      </StepFooter>
    </>
  );
}

/* ---------- Interests ---------- */
function Interests({ app, onNext }) {
  return (
    <>
      <StepBody>
        <H>What interests you?</H>
        <Sub>Choose topics to personalise your feed. Select as many as you like.</Sub>
        <p className="mb-4 mt-3 text-xs text-cloud-dim">
          Selected: <b className="text-emerald2">{app.interests.length}</b> topics
        </p>
        <div className="grid grid-cols-2 gap-3">
          {INTERESTS.map((it) => {
            const on = app.interests.includes(it.id);
            return (
              <button
                key={it.id}
                onClick={() => app.toggleInterest(it.id)}
                className={cx('rounded-2xl border p-3.5 text-left transition-all', on ? 'border-emerald2/60 bg-emerald2/10' : 'border-white/10 bg-white/[0.03]')}
              >
                <div className="mb-2.5 flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${it.tint}22`, color: it.tint }}>
                    <Icon name={it.icon} className="h-5 w-5" />
                  </span>
                  <span className={cx('flex h-5 w-5 items-center justify-center rounded-full border', on ? 'border-emerald2 bg-emerald2 text-ink' : 'border-white/25')}>
                    {on && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                </div>
                <p className={cx('text-sm font-semibold', on && 'text-emerald2')}>{it.label}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-cloud-dim">{it.desc}</p>
              </button>
            );
          })}
        </div>
      </StepBody>
      <StepFooter>
        <button onClick={onNext} disabled={app.interests.length === 0} className="btn-noor w-full">
          Continue <ArrowRight className="h-5 w-5" />
        </button>
        <button onClick={onNext} className="mt-2 w-full py-2 text-sm text-cloud-dim">Skip for now</button>
      </StepFooter>
    </>
  );
}

/* ---------- Madhab ---------- */
function Madhab({ app, onNext }) {
  return (
    <>
      <StepBody>
        <H>Your school of thought</H>
        <Sub>Select your madhab so the AI gives rulings aligned with your tradition. Change anytime.</Sub>
        <p className="my-3 rounded-xl bg-white/5 px-3 py-2 text-center text-xs text-cloud-dim">
          Not sure? Choose Hanafi — the most widely followed globally.
        </p>
        <div className="space-y-2.5">
          {MADHABS.map((m) => {
            const on = app.madhab === m.id;
            return (
              <button
                key={m.id}
                onClick={() => app.set({ madhab: m.id })}
                className={cx('flex w-full items-center gap-3.5 rounded-2xl border p-3.5 text-left transition-all', on ? 'border-emerald2/60 bg-emerald2/10' : 'border-white/10 bg-white/[0.03]')}
              >
                <span className="arabic flex h-11 w-11 items-center justify-center rounded-xl bg-emerald2/12 text-2xl text-emerald2">{m.glyph}</span>
                <span className="flex-1">
                  <span className={cx('block text-sm font-semibold', on && 'text-emerald2')}>{m.name}</span>
                  <span className="block text-xs text-cloud-dim">{m.imam}</span>
                  <span className="block text-[11px] text-cloud-dim/70">{m.region}</span>
                </span>
                <span className={cx('flex h-5 w-5 items-center justify-center rounded-full border', on ? 'border-emerald2' : 'border-white/25')}>
                  {on && <span className="h-2.5 w-2.5 rounded-full bg-emerald2" />}
                </span>
              </button>
            );
          })}
        </div>
      </StepBody>
      <StepFooter>
        <button onClick={onNext} className="btn-noor w-full">Continue <ArrowRight className="h-5 w-5" /></button>
      </StepFooter>
    </>
  );
}

/* ---------- Language ---------- */
function Language({ app, onNext }) {
  return (
    <>
      <StepBody>
        <H>Preferred language</H>
        <Sub>Your primary language for content and AI responses.</Sub>
        <p className="my-3 rounded-xl bg-white/5 px-3 py-2 text-center text-xs text-cloud-dim">
          Arabic script is always shown for Quranic text regardless of your choice.
        </p>
        <div className="space-y-2.5">
          {LANGUAGES.map((l) => {
            const on = app.lang === l.id;
            const rtl = l.id === 'ar' || l.id === 'ur';
            return (
              <button
                key={l.id}
                onClick={() => app.set({ lang: l.id, isArabic: l.id === 'ar' })}
                className={cx('flex w-full items-center gap-3.5 rounded-2xl border p-3.5 text-left transition-all', on ? 'border-emerald2/60 bg-emerald2/10' : 'border-white/10 bg-white/[0.03]')}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-xl">{l.flag}</span>
                <span className="flex-1">
                  <span className={cx('block text-sm font-semibold', on && 'text-emerald2')}>{l.name}</span>
                  <span className={cx('block text-xs text-cloud-dim', rtl && 'arabic text-sm')}>{l.native}</span>
                  <span className="block text-[11px] text-cloud-dim/70">{l.meta}</span>
                </span>
                <span className={cx('flex h-5 w-5 items-center justify-center rounded-full border', on ? 'border-emerald2 bg-emerald2 text-ink' : 'border-white/25')}>
                  {on && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>
      </StepBody>
      <StepFooter>
        <button onClick={onNext} className="btn-noor w-full">Continue <ArrowRight className="h-5 w-5" /></button>
      </StepFooter>
    </>
  );
}

/* ---------- Notifications ---------- */
function Notifs({ app, onNext }) {
  return (
    <>
      <StepBody>
        <H>Stay connected</H>
        <Sub>Choose what you'd like to be reminded about. Change in settings anytime.</Sub>
        <div className="mt-4 space-y-2.5">
          {NOTIF_TYPES.map((n) => {
            const on = !!app.notifs[n.id];
            return (
              <div key={n.id} className={cx('flex items-center gap-3.5 rounded-2xl border p-3.5 transition-all', on ? 'border-emerald2/40 bg-emerald2/[0.07]' : 'border-white/10 bg-white/[0.03]')}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald2/12 text-emerald2">
                  <Icon name={n.icon} className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-[11px] text-cloud-dim">{n.desc}</p>
                </div>
                <Toggle on={on} onClick={() => app.toggleNotif(n.id)} label={n.title} />
              </div>
            );
          })}
        </div>
      </StepBody>
      <StepFooter>
        <button onClick={onNext} className="btn-noor w-full">Complete setup <Check className="h-5 w-5" /></button>
        <button onClick={onNext} className="mt-2 w-full py-2 text-sm text-cloud-dim">Skip notifications</button>
      </StepFooter>
    </>
  );
}

/* ---------- Done ---------- */
function Done({ app, onEnter }) {
  const interestNames = app.interests.length
    ? app.interests.slice(0, 3).map((i) => INTERESTS.find((x) => x.id === i)?.label).join(', ') + (app.interests.length > 3 ? ' +more' : '')
    : 'General feed';
  const madhab = MADHABS.find((m) => m.id === app.madhab)?.name || 'General';
  const lang = LANGUAGES.find((l) => l.id === app.lang)?.name || 'English';

  const rows = [
    ['Interests', interestNames],
    ['Madhab', madhab],
    ['Language', lang],
    ['Notifications', 'Configured'],
  ];

  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center animate-fade-up">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-emerald2/30 bg-emerald2/12">
          <BadgeCheck className="h-12 w-12 text-emerald2" />
        </div>
        <p className="arabic mb-2 text-2xl text-emerald2">جزاك الله خيراً</p>
        <h1 className="font-display text-2xl font-bold">You're all set!</h1>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-cloud-muted">
          Your NoorStream is personalised and ready. May Allah bless your journey of knowledge.
        </p>
        <div className="mt-7 w-full space-y-2">
          {rows.map(([k, v]) => (
            <div key={k} className="glass flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm">
              <span className="text-cloud-muted">{k}:</span>
              <b className="truncate font-semibold text-cloud">{v}</b>
            </div>
          ))}
        </div>
      </div>
      <StepFooter>
        <button onClick={onEnter} className="btn-noor w-full">Enter NoorStream <ArrowRight className="h-5 w-5" /></button>
      </StepFooter>
    </>
  );
}
