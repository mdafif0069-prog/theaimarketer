import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Volume2, VolumeX, Heart, MessageCircle, Share2, Bookmark, ChevronUp, Play,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { REELS, SCHOLARS } from '../data/content.js';
import { Avatar } from '../components/ui.jsx';
import { cx } from '../lib/utils.js';

export default function Feed() {
  const navigate = useNavigate();
  const app = useApp();
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState('foryou');
  const [muted, setMuted] = useState(false);
  const [likes, setLikes] = useState(() => Object.fromEntries(REELS.map((r) => [r.id, false])));
  const areaRef = useRef(null);
  const touch = useRef({ y: 0, dy: 0 });

  const goTo = (i) => setIndex(Math.max(0, Math.min(REELS.length - 1, i)));

  // Wheel + touch + keyboard navigation between reels.
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    let wheelLock = false;
    const onWheel = (e) => {
      e.preventDefault();
      if (wheelLock) return;
      if (Math.abs(e.deltaY) < 24) return;
      wheelLock = true;
      goTo(index + (e.deltaY > 0 ? 1 : -1));
      setTimeout(() => { wheelLock = false; }, 450);
    };
    const onStart = (e) => { touch.current = { y: e.touches[0].clientY, dy: 0 }; };
    const onMove = (e) => { touch.current.dy = e.touches[0].clientY - touch.current.y; };
    const onEnd = () => { if (Math.abs(touch.current.dy) > 50) goTo(index + (touch.current.dy < 0 ? 1 : -1)); };
    const onKey = (e) => {
      if (e.key === 'ArrowDown') goTo(index + 1);
      else if (e.key === 'ArrowUp') goTo(index - 1);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
      window.removeEventListener('keydown', onKey);
    };
  }, [index]);

  const toggleLike = (id) => setLikes((l) => ({ ...l, [id]: !l[id] }));

  return (
    <div ref={areaRef} className="absolute inset-0 touch-none overflow-hidden">
      {/* Segment progress */}
      <div className="absolute inset-x-0 top-0 z-30 flex gap-1 px-3.5 pt-3">
        {REELS.map((r, i) => (
          <div key={r.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
            <div className="h-full bg-emerald2 transition-all duration-500" style={{ width: i < index ? '100%' : i === index ? '40%' : '0%' }} />
          </div>
        ))}
      </div>

      {/* Top bar */}
      <div className="absolute inset-x-0 top-6 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-noor text-ink">
            <span className="font-display text-sm font-extrabold">N</span>
          </span>
          <span className="font-display text-[15px] font-bold">Noor<span className="text-emerald2">Stream</span></span>
        </div>

        <div className="flex overflow-hidden rounded-full border border-white/15 bg-black/40 text-xs backdrop-blur">
          {[['foryou', 'For you'], ['following', 'Following']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cx('px-3.5 py-1.5 font-medium transition-colors', tab === id ? 'rounded-full bg-emerald2 text-ink' : 'text-white/65')}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setMuted((m) => !m)}
          className={cx('flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition-colors', muted ? 'border-emerald2 bg-emerald2/20 text-emerald2' : 'border-white/20 bg-black/40 text-white')}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>

      {/* Reels stack */}
      {REELS.map((reel, i) => {
        const scholar = SCHOLARS[reel.scholar];
        const offset = (i - index) * 100;
        return (
          <article
            key={reel.id}
            className="absolute inset-0 flex flex-col justify-end transition-transform duration-[450ms] ease-[cubic-bezier(.4,0,.2,1)]"
            style={{ transform: `translateY(${offset}%)` }}
            aria-hidden={i !== index}
          >
            {/* Background */}
            <div className="absolute inset-0" style={{ background: reel.bg }}>
              <div className="absolute left-1/2 top-[34%] h-56 w-56 -translate-x-1/2 rounded-full blur-2xl" style={{ background: reel.glyphTint, opacity: 0.18 }} />
              <span className="arabic absolute left-1/2 top-[30%] -translate-x-1/2 text-7xl" style={{ color: reel.glyphTint, opacity: 0.55 }}>
                {reel.glyph}
              </span>
              {/* center play affordance */}
              <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <Play className="h-7 w-7 fill-white/90 text-white/90" />
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />

            {/* Right action rail */}
            <div className="absolute bottom-7 right-3 z-10 flex flex-col items-center gap-5">
              <button onClick={() => navigate(`/scholar/${scholar.id}`)} aria-label={scholar.name}>
                <Avatar initials={scholar.initials} color={scholar.color} size={44} ring />
              </button>
              <Action icon={Heart} active={likes[reel.id]} label={(reel.likes + (likes[reel.id] ? 0.1 : 0)).toFixed(1) + 'K'} onClick={() => toggleLike(reel.id)} activeClass="fill-rose-500 text-rose-500" />
              <Action icon={MessageCircle} label={reel.comments} />
              <Action icon={Share2} label="Share" />
              <Action icon={Bookmark} active={app.saved[reel.id]} label="Save" onClick={() => app.toggleSaved(reel.id)} activeClass="fill-emerald2 text-emerald2" />
            </div>

            {/* Bottom info */}
            <div className="relative z-10 px-4 pb-6">
              <button onClick={() => navigate(`/scholar/${scholar.id}`)} className="mb-2 flex items-center gap-2.5">
                <Avatar initials={scholar.initials} color={scholar.color} size={38} />
                <span className="text-left">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold">{scholar.name}</span>
                    <span className="flex items-center gap-1 rounded-md bg-emerald2 px-1.5 py-0.5 text-[9px] font-bold text-ink">VERIFIED</span>
                  </span>
                  <span className="block text-[11px] text-white/60">{scholar.field}{scholar.followers ? ` · ${scholar.followers} followers` : ''}</span>
                </span>
              </button>
              <p className="mb-2 max-w-[17rem] text-sm leading-relaxed text-white">{reel.caption}</p>
              <div className="flex flex-wrap gap-2.5">
                {reel.tags.map((t) => (
                  <span key={t} className="text-xs font-medium text-emerald2">{t}</span>
                ))}
              </div>
            </div>
          </article>
        );
      })}

      {/* Swipe hint */}
      {index < REELS.length - 1 && (
        <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center text-white/45">
          <ChevronUp className="h-5 w-5 animate-bob" />
          <span className="text-[11px]">Swipe up</span>
        </div>
      )}
    </div>
  );
}

function Action({ icon: Icon, label, active, onClick, activeClass }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1" aria-label={label}>
      <Icon className={cx('h-7 w-7 text-white transition-colors', active && activeClass)} />
      <span className="text-[11px] text-white/85">{label}</span>
    </button>
  );
}
