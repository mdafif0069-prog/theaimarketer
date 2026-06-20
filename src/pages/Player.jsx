import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play, Pause, Volume2, VolumeX, Maximize, ArrowLeft,
  Subtitles, Settings2, SkipBack, SkipForward, Loader2,
} from 'lucide-react';
import { api } from '../api/client.js';
import { useApp } from '../context/AppProviders.jsx';
import { gradientStyle, formatTime } from '../lib/utils.js';

const SPEEDS = [0.5, 1, 1.25, 1.5, 2];

export default function Player() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { activeProfile, activeProfileId, progressFor, setTitleProgress } = useApp();

  const [title, setTitle] = useState(null);
  const [loadErr, setLoadErr] = useState(false);
  const duration = title?.durationSec || 24 * 60; // series episodes default to 24m

  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [captions, setCaptions] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [showSpeed, setShowSpeed] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const containerRef = useRef(null);
  const hideTimer = useRef(null);
  const savedStartRef = useRef(false);

  // Load title metadata.
  useEffect(() => {
    let active = true;
    api
      .getTitle(slug, activeProfile)
      .then((t) => active && setTitle(t))
      .catch(() => active && setLoadErr(true));
    return () => {
      active = false;
    };
  }, [slug, activeProfile]);

  // Resume from saved progress once, when title + duration are known.
  useEffect(() => {
    if (!title || savedStartRef.current || !activeProfileId) return;
    savedStartRef.current = true;
    const pct = progressFor(activeProfileId)[title.id] || 0;
    if (pct > 0 && pct < 95) setTime((pct / 100) * duration);
  }, [title, activeProfileId, duration, progressFor]);

  // Simulated playback clock.
  useEffect(() => {
    if (!playing || !title) return;
    const id = setInterval(() => {
      setTime((t) => {
        const next = t + speed;
        if (next >= duration) {
          clearInterval(id);
          setPlaying(false);
          return duration;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, speed, duration, title]);

  // Persist progress as it advances.
  useEffect(() => {
    if (!title || !activeProfileId || time <= 0) return;
    const pct = Math.min(100, Math.round((time / duration) * 100));
    setTitleProgress(activeProfileId, title.id, pct);
  }, [time, title, activeProfileId, duration, setTitleProgress]);

  // Auto-hide controls while playing.
  const nudgeControls = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (playing) setControlsVisible(false);
    }, 2800);
  }, [playing]);

  useEffect(() => {
    nudgeControls();
    return () => clearTimeout(hideTimer.current);
  }, [nudgeControls, playing]);

  const seek = (delta) =>
    setTime((t) => Math.min(duration, Math.max(0, t + delta)));

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  // Keyboard shortcuts.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === ' ' || e.key === 'k') { e.preventDefault(); setPlaying((p) => !p); }
      else if (e.key === 'ArrowRight') seek(10);
      else if (e.key === 'ArrowLeft') seek(-10);
      else if (e.key === 'm') setMuted((m) => !m);
      else if (e.key === 'f') toggleFullscreen();
      else if (e.key === 'Escape' && !document.fullscreenElement) navigate(-1);
      nudgeControls();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nudgeControls]);

  if (loadErr) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-black text-center">
        <p className="text-noor-muted">This title isn't available to play on this profile.</p>
        <button onClick={() => navigate(-1)} className="btn-primary">Go back</button>
      </div>
    );
  }

  if (!title) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-noor-gold" />
      </div>
    );
  }

  const pct = (time / duration) * 100;

  return (
    <div
      ref={containerRef}
      onMouseMove={nudgeControls}
      onClick={nudgeControls}
      className="relative h-screen w-full select-none overflow-hidden bg-black"
    >
      {/* Simulated video surface */}
      <div className="absolute inset-0" style={gradientStyle(title.grad, 130)} />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center opacity-80">
          <p className="font-display text-3xl font-extrabold sm:text-5xl">{title.title}</p>
          <p className="mt-2 text-noor-text/70">{title.speaker}</p>
        </div>
      </div>

      {/* Captions */}
      {captions && playing && (
        <div className="absolute bottom-28 left-1/2 max-w-2xl -translate-x-1/2 px-4 text-center">
          <span className="rounded bg-black/70 px-3 py-1 text-base text-white sm:text-lg">
            Bismillah — welcome to {title.title}.
          </span>
        </div>
      )}

      {/* Center play/pause tap target */}
      <button
        onClick={() => setPlaying((p) => !p)}
        className={`absolute inset-0 flex items-center justify-center transition-opacity ${
          playing ? 'opacity-0' : 'opacity-100'
        }`}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {!playing && (
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-noor-glow text-noor-bg shadow-glow">
            <Play className="h-9 w-9 fill-noor-bg" />
          </span>
        )}
      </button>

      {/* Controls */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-4 pb-5 pt-20 transition-opacity duration-300 sm:px-8 ${
          controlsVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {/* Seek bar */}
        <div className="mb-3 flex items-center gap-3 text-xs text-white/80">
          <span className="w-12 text-right tabular-nums">{formatTime(time)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
            className="noor-range flex-1"
            style={{ '--pct': `${pct}%` }}
            aria-label="Seek"
          />
          <span className="w-12 tabular-nums">{formatTime(duration)}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <Ctrl onClick={() => setPlaying((p) => !p)} label={playing ? 'Pause' : 'Play'}>
            {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-white" />}
          </Ctrl>
          <Ctrl onClick={() => seek(-10)} label="Back 10s"><SkipBack className="h-5 w-5" /></Ctrl>
          <Ctrl onClick={() => seek(10)} label="Forward 10s"><SkipForward className="h-5 w-5" /></Ctrl>

          <div className="flex items-center gap-2">
            <Ctrl onClick={() => setMuted((m) => !m)} label={muted ? 'Unmute' : 'Mute'}>
              {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Ctrl>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }}
              className="noor-range hidden w-24 sm:block"
              style={{ '--pct': `${(muted ? 0 : volume) * 100}%` }}
              aria-label="Volume"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Ctrl
              onClick={() => setCaptions((c) => !c)}
              label="Captions"
              active={captions}
            >
              <Subtitles className="h-5 w-5" />
            </Ctrl>

            <div className="relative">
              <Ctrl onClick={() => setShowSpeed((s) => !s)} label="Playback speed">
                <Settings2 className="h-5 w-5" />
              </Ctrl>
              {showSpeed && (
                <div className="absolute bottom-12 right-0 w-28 overflow-hidden rounded-xl border border-white/10 bg-noor-surface2 shadow-card">
                  {SPEEDS.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSpeed(s); setShowSpeed(false); }}
                      className={`block w-full px-4 py-2 text-left text-sm hover:bg-white/10 ${
                        s === speed ? 'text-noor-gold' : 'text-noor-text'
                      }`}
                    >
                      {s === 1 ? 'Normal' : `${s}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Ctrl onClick={toggleFullscreen} label="Fullscreen"><Maximize className="h-5 w-5" /></Ctrl>
          </div>
        </div>
      </div>

      {/* Top bar */}
      <div
        className={`absolute inset-x-0 top-0 flex items-center gap-3 bg-gradient-to-b from-black/80 to-transparent px-4 py-4 transition-opacity duration-300 sm:px-8 ${
          controlsVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/90 hover:text-white">
          <ArrowLeft className="h-6 w-6" />
          <span className="hidden font-medium sm:inline">{title.title}</span>
        </button>
      </div>
    </div>
  );
}

function Ctrl({ children, onClick, label, active }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 ${
        active ? 'text-noor-gold' : ''
      }`}
    >
      {children}
    </button>
  );
}
