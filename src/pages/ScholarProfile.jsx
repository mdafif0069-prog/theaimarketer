import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MoreVertical, Plus, Check, Bell, BellRing, Share2, ShieldCheck,
  Award, Pin, GraduationCap, Play, Eye, Heart, Video, Clock, Users, Star,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { SCHOLARS } from '../data/content.js';
import { VerifiedTick, SectionLabel } from '../components/ui.jsx';
import { cx } from '../lib/utils.js';

const TABS = ['About', 'Videos', 'Courses', 'Reviews'];

export default function ScholarProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const app = useApp();
  const s = SCHOLARS[id] || SCHOLARS.khalid;
  const [tab, setTab] = useState('About');
  const following = !!app.following[s.id];
  const notifying = !!app.notifying[s.id];
  const hasFull = !!s.bio;

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/6 text-cloud-muted" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold">Scholar Profile</span>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/6 text-cloud-muted" aria-label="More">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto">
        {/* Cover */}
        <div className="relative h-28" style={{ background: 'linear-gradient(135deg,#08110D,#0E1526)' }}>
          <div className="absolute right-10 top-2 h-28 w-28 rounded-full bg-emerald2/25 blur-2xl" />
          <span className="arabic absolute left-1/2 top-7 -translate-x-1/2 text-3xl text-emerald2/15">{s.glyph || 'بسم الله'}</span>
          <div className="absolute -bottom-9 left-5">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-ink text-2xl font-semibold text-white" style={{ background: s.color }}>
              {s.initials}
              <span className="absolute bottom-0 right-0"><VerifiedTick size={24} /></span>
            </div>
          </div>
        </div>

        {/* Head */}
        <div className="px-5 pt-12">
          <h1 className="font-display text-xl font-bold">{s.name}</h1>
          <p className="text-sm text-emerald2">{s.role}</p>
          <p className="text-xs text-cloud-dim">{s.inst}</p>

          <div className="mt-4 flex items-center gap-2.5">
            <button
              onClick={() => app.toggleFollow(s.id)}
              className={cx('flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 font-semibold transition-colors', following ? 'border border-white/15 bg-transparent text-cloud-muted' : 'bg-noor text-ink shadow-glow')}
            >
              {following ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {following ? 'Following' : 'Follow'}
            </button>
            <button
              onClick={() => app.toggleNotifying(s.id)}
              className={cx('flex h-12 w-12 items-center justify-center rounded-2xl border', notifying ? 'border-emerald2/40 bg-emerald2/10 text-emerald2' : 'border-white/15 bg-white/5 text-cloud-muted')}
              aria-label="Notifications"
            >
              {notifying ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-cloud-muted" aria-label="Share">
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[[s.followers, 'Followers'], [s.videoCount || '—', 'Videos'], [s.courseCount || '—', 'Courses'], [s.rating, 'Rating']].map(([v, l]) => (
              <div key={l} className="rounded-2xl bg-white/[0.04] py-2.5 text-center">
                <div className="text-base font-semibold">{v}</div>
                <div className="text-[9px] text-cloud-dim">{l}</div>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-emerald2/20 bg-emerald2/10 px-3 py-1 text-[11px] text-emerald2"><ShieldCheck className="h-3.5 w-3.5" /> NoorStream Verified</span>
            <span className="flex items-center gap-1.5 rounded-full border border-gold2/20 bg-gold2/10 px-3 py-1 text-[11px] text-gold2"><Award className="h-3.5 w-3.5" /> Top Scholar 2024</span>
          </div>
        </div>

        {/* Tabs */}
        {hasFull ? (
          <>
            <div className="sticky top-0 z-10 mt-4 flex border-b border-white/10 bg-ink/95 backdrop-blur">
              {TABS.map((t) => (
                <button key={t} onClick={() => setTab(t)} className={cx('flex-1 border-b-2 py-3 text-sm transition-colors', tab === t ? 'border-emerald2 text-emerald2' : 'border-transparent text-cloud-dim')}>
                  {t}
                </button>
              ))}
            </div>
            {tab === 'About' && <About s={s} />}
            {tab === 'Videos' && <Videos s={s} />}
            {tab === 'Courses' && <Courses s={s} />}
            {tab === 'Reviews' && <Reviews s={s} />}
          </>
        ) : (
          <div className="px-5 py-10 text-center text-sm text-cloud-dim">
            Full profile coming soon for {s.name}.
          </div>
        )}
        <div className="h-6" />
      </div>
    </div>
  );
}

function About({ s }) {
  return (
    <div className="animate-fade-in">
      <div className="mx-5 mt-4 flex gap-2.5 rounded-2xl border border-emerald2/15 bg-emerald2/10 p-3.5">
        <Pin className="mt-0.5 h-4 w-4 shrink-0 text-emerald2" />
        <div>
          <p className="arabic mb-1 text-emerald2">{s.pinnedAr}</p>
          <p className="text-xs leading-relaxed text-cloud-muted">{s.pinned}</p>
        </div>
      </div>
      <SectionLabel>Biography</SectionLabel>
      <p className="arabic px-5 pb-2 text-right text-lg text-emerald2/75">{s.bioAr}</p>
      {s.bio.map((p, i) => (
        <p key={i} className="px-5 pb-3 text-sm leading-relaxed text-cloud-muted">{p}</p>
      ))}
      <SectionLabel>Specialisations</SectionLabel>
      <div className="flex flex-wrap gap-2 px-5 pb-2">
        {s.specs.map((sp) => <span key={sp} className="chip">{sp}</span>)}
      </div>
      <SectionLabel>Education & Credentials</SectionLabel>
      {s.education.map((e, i) => (
        <div key={i} className="flex items-center gap-3 border-b border-white/5 px-5 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald2/12 text-emerald2"><GraduationCap className="h-5 w-5" /></span>
          <div>
            <p className="text-sm font-medium">{e.title}</p>
            <p className="text-[11px] text-cloud-dim">{e.meta}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Videos({ s }) {
  return (
    <div className="animate-fade-in">
      <SectionLabel>Most popular</SectionLabel>
      <div className="grid grid-cols-2 gap-2.5 px-5 pb-2">
        {s.videos.map((v, i) => (
          <div key={i} className="overflow-hidden rounded-2xl bg-white/[0.04]">
            <div className="relative flex h-20 items-center justify-center" style={{ background: `${v.tint}1f` }}>
              <span className="arabic text-2xl" style={{ color: v.tint, opacity: 0.7 }}>{v.glyph}</span>
              <span className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-black/55"><Play className="h-4 w-4 fill-white text-white" /></span>
              <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 text-[10px]">{v.dur}</span>
            </div>
            <div className="p-2.5">
              <p className="mb-1.5 text-xs font-medium leading-snug">{v.title}</p>
              <p className="flex items-center gap-2 text-[10px] text-cloud-dim">
                <Eye className="h-3 w-3" />{v.views}<Heart className="h-3 w-3" />{v.likes}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Courses({ s }) {
  return (
    <div className="animate-fade-in">
      <SectionLabel>Featured courses</SectionLabel>
      <div className="space-y-3 px-5 pb-2">
        {s.courses.map((c, i) => <CourseCard key={i} c={c} />)}
      </div>
    </div>
  );
}

function CourseCard({ c }) {
  const [enrolled, setEnrolled] = useState(false);
  return (
    <div className="overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03]">
      <div className="flex h-[72px] items-center justify-between px-4" style={{ background: `${c.tint}` }}>
        <span className="arabic text-3xl text-white/85">{c.glyph}</span>
        <span className="rounded-full bg-emerald2 px-2.5 py-0.5 text-[10px] font-bold text-ink">{c.badge}</span>
      </div>
      <div className="p-4">
        <p className="font-semibold">{c.title}</p>
        <p className="mt-1 text-xs leading-relaxed text-cloud-dim">{c.desc}</p>
        <div className="mt-3 flex gap-3 text-[11px] text-cloud-dim">
          <span className="flex items-center gap-1"><Video className="h-3.5 w-3.5" />{c.lessons}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{c.hrs}</span>
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{c.students}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-emerald2">{c.price}</div>
            <div className="text-[10px] text-cloud-dim">{c.sub}</div>
          </div>
          <button
            onClick={() => { setEnrolled(true); setTimeout(() => setEnrolled(false), 1800); }}
            className={cx('rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors', enrolled ? 'border border-emerald2/30 bg-emerald2/15 text-emerald2' : c.free ? 'border border-emerald2/30 bg-emerald2/15 text-emerald2' : 'bg-noor text-ink')}
          >
            {enrolled ? 'Enrolled!' : c.free ? 'Enrol free' : 'Enrol now'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Reviews({ s }) {
  const dist = [['5', 88], ['4', 9], ['3', 3]];
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-5 px-5 pt-4">
        <div className="text-center">
          <div className="text-4xl font-bold leading-none">{s.rating}</div>
          <div className="my-1 flex justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3 w-3 fill-gold2 text-gold2" />)}
          </div>
          <div className="text-[10px] text-cloud-dim">6,200 reviews</div>
        </div>
        <div className="flex-1 space-y-1.5">
          {dist.map(([n, pct]) => (
            <div key={n} className="flex items-center gap-2">
              <span className="w-2 text-[10px] text-cloud-dim">{n}</span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
                <div className="h-full rounded-full bg-gold2" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-7 text-right text-[10px] text-cloud-dim">{pct}%</span>
            </div>
          ))}
        </div>
      </div>
      <SectionLabel>Student reviews</SectionLabel>
      {s.reviews.map((r, i) => (
        <div key={i} className="border-b border-white/5 px-5 py-3.5">
          <div className="mb-2 flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ background: r.color }}>{r.initials}</span>
            <div className="flex-1">
              <p className="text-sm font-medium">{r.name}</p>
              <p className="text-[10px] text-cloud-dim">{r.meta}</p>
            </div>
            <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-3 w-3 fill-gold2 text-gold2" />)}</div>
          </div>
          <p className="text-xs leading-relaxed text-cloud-muted">{r.text}</p>
        </div>
      ))}
    </div>
  );
}
