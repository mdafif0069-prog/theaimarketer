import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Baby, Sparkles, MonitorPlay, Play, Star, ArrowRight, Check,
} from 'lucide-react';
import { useI18n } from '../context/LanguageContext.jsx';
import { LanguageSwitcher } from '../components/LanguageSwitcher.jsx';
import { Footer } from '../components/Footer.jsx';
import { CATEGORIES, TITLES } from '../data/catalog.js';
import { gradientStyle } from '../lib/utils.js';

export default function Landing() {
  const { t, dir } = useI18n();
  const preview = TITLES.slice(0, 6);

  const features = [
    { icon: ShieldCheck, title: t('landing.f1.title'), desc: t('landing.f1.desc') },
    { icon: Baby, title: t('landing.f2.title'), desc: t('landing.f2.desc') },
    { icon: Sparkles, title: t('landing.f3.title'), desc: t('landing.f3.desc') },
    { icon: MonitorPlay, title: t('landing.f4.title'), desc: t('landing.f4.desc') },
  ];

  return (
    <div className="min-h-screen">
      {/* Public header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center px-4 sm:px-6 lg:px-10">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-noor-glow text-noor-bg">
              <span className="font-display text-lg font-extrabold">N</span>
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">
              Noor<span className="noor-text-gradient">Stream</span>
            </span>
          </Link>
          <div className="ms-auto flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/login" className="btn-ghost px-4 py-2 text-sm">
              {t('nav.signIn')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <div className="absolute inset-0 bg-noor-glow opacity-[0.13]" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-noor-gold/20 blur-3xl animate-float-slow" />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-noor-emerald/20 blur-3xl animate-float-slow" />

        <div className="relative mx-auto grid max-w-[1600px] items-center gap-12 px-4 py-28 sm:px-6 lg:grid-cols-2 lg:px-10">
          <div className="animate-fade-in text-center lg:text-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-noor-gold/30 bg-noor-gold/10 px-4 py-1.5 text-sm text-noor-gold">
              <Sparkles className="h-4 w-4" /> {t('landing.tagline')}
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
              {t('landing.heroTitle')}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-noor-muted lg:mx-0">
              {t('landing.heroSubtitle')}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link to="/login" className="btn-primary text-base">
                <Play className="h-5 w-5 fill-noor-bg" /> {t('landing.ctaPrimary')}
              </Link>
              <Link to="/plans" className="btn-ghost text-base">
                {t('landing.ctaSecondary')}
                <ArrowRight className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </Link>
            </div>
            <p className="mt-5 text-sm text-noor-muted">{t('landing.trustedBy')}</p>
          </div>

          {/* Floating poster collage */}
          <div className="relative hidden h-[460px] lg:block" aria-hidden>
            {preview.slice(0, 5).map((title, i) => {
              const layout = [
                'left-8 top-4 rotate-[-6deg]',
                'left-40 top-24 rotate-[3deg] z-20',
                'right-24 top-0 rotate-[6deg]',
                'right-8 bottom-8 rotate-[-3deg]',
                'left-24 bottom-0 rotate-[4deg]',
              ][i];
              return (
                <div
                  key={title.id}
                  className={`absolute aspect-[2/3] w-36 overflow-hidden rounded-2xl shadow-card transition-transform duration-500 hover:z-30 hover:scale-105 ${layout}`}
                  style={gradientStyle(title.grad)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 p-3">
                    <p className="text-xs font-semibold text-white">{title.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-10">
        <div className="text-center">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            {t('landing.featuresTitle')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-noor-muted">{t('landing.featuresSubtitle')}</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="card-surface group p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-glow"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-noor-glow text-noor-bg">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-noor-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10">
        <h2 className="text-center font-display text-3xl font-extrabold sm:text-4xl">
          {t('landing.categoriesTitle')}
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((c, i) => (
            <span
              key={c.id}
              className="rounded-full border border-white/10 px-5 py-2.5 font-medium text-noor-text"
              style={gradientStyle(TITLES[i % TITLES.length].grad, 120)}
            >
              {c.label}
            </span>
          ))}
        </div>
      </section>

      {/* Content preview */}
      <section className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            {t('landing.previewTitle')}
          </h2>
          <p className="mt-2 text-noor-muted">{t('landing.previewSubtitle')}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {preview.map((title) => (
            <div key={title.id} className="group relative aspect-[2/3] overflow-hidden rounded-xl shadow-card">
              <div className="absolute inset-0" style={gradientStyle(title.grad)} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
              <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/40 px-1.5 py-0.5 text-[11px] font-semibold text-noor-gold">
                <Star className="h-3 w-3 fill-noor-gold" /> {title.rating}
              </div>
              <div className="absolute bottom-0 p-3">
                <p className="text-sm font-semibold text-white">{title.title}</p>
                <p className="text-[11px] text-white/70">{title.speaker}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-auto max-w-[1600px] px-4 pb-20 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-noor-gold/30 bg-noor-glow/10 p-10 text-center sm:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-noor-gold/20 blur-3xl" />
          <h2 className="relative font-display text-3xl font-extrabold sm:text-4xl">
            {t('landing.ctaBannerTitle')}
          </h2>
          <p className="relative mt-3 text-noor-muted">{t('landing.ctaBannerSubtitle')}</p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/login" className="btn-primary text-base">
              {t('common.startWatching')}
            </Link>
            <span className="flex items-center gap-2 text-sm text-noor-muted">
              <Check className="h-4 w-4 text-noor-emerald" /> {t('landing.ctaBannerSubtitle')}
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
