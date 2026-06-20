import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, Plus, Lock, X, Delete } from 'lucide-react';
import { useApp, DEMO_PARENTAL_PIN } from '../context/AppProviders.jsx';

export default function Profiles() {
  const { profiles, activeProfile, selectProfile } = useApp();
  const navigate = useNavigate();
  const [pinFor, setPinFor] = useState(null); // profile pending PIN to switch INTO from kids

  const choose = (p) => {
    // Parental control: leaving a Kids profile for any other profile requires the PIN.
    if (activeProfile?.isKids && !p.isKids) {
      setPinFor(p);
      return;
    }
    selectProfile(p.id);
    navigate('/', { replace: true });
  };

  const onPinSuccess = () => {
    const p = pinFor;
    setPinFor(null);
    selectProfile(p.id);
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Who's watching?</h1>
      <p className="mt-2 text-noor-muted">Choose a profile to continue.</p>

      <div className="mt-12 flex flex-wrap items-start justify-center gap-6">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => choose(p)}
            className="group flex w-28 flex-col items-center gap-3 outline-none sm:w-32"
          >
            <span
              className="relative flex h-28 w-28 items-center justify-center rounded-2xl text-3xl font-extrabold text-noor-bg shadow-card transition-all duration-200 group-hover:scale-105 group-focus-visible:ring-4 group-focus-visible:ring-noor-gold/60 sm:h-32 sm:w-32"
              style={{ background: p.color }}
            >
              {p.name[0].toUpperCase()}
              {p.isKids && (
                <span className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-noor-bg px-2 py-0.5 text-[11px] font-semibold text-noor-gold">
                  <Baby className="h-3 w-3" /> Kids
                </span>
              )}
            </span>
            <span className="font-medium text-noor-muted transition-colors group-hover:text-noor-text">
              {p.name}
            </span>
          </button>
        ))}

        {/* Add profile (decorative for MVP) */}
        <div className="flex w-28 flex-col items-center gap-3 sm:w-32">
          <span className="flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-dashed border-white/15 text-noor-muted sm:h-32 sm:w-32">
            <Plus className="h-8 w-8" />
          </span>
          <span className="font-medium text-noor-muted">Add Profile</span>
        </div>
      </div>

      {activeProfile?.isKids && (
        <p className="mt-10 flex items-center gap-2 rounded-full border border-noor-gold/30 bg-noor-gold/10 px-4 py-2 text-sm text-noor-gold">
          <Lock className="h-4 w-4" />
          Kids Mode is on — a parental PIN is required to switch out.
        </p>
      )}

      {pinFor && (
        <PinPad
          onClose={() => setPinFor(null)}
          onSuccess={onPinSuccess}
          targetName={pinFor.name}
        />
      )}
    </div>
  );
}

function PinPad({ onClose, onSuccess, targetName }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const press = (d) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setError('');
    if (next.length === 4) {
      setTimeout(() => {
        if (next === DEMO_PARENTAL_PIN) {
          onSuccess();
        } else {
          setError('Incorrect PIN. Try again.');
          setPin('');
        }
      }, 150);
    }
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center px-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xs rounded-2xl border border-white/10 bg-noor-surface2 p-6 shadow-2xl animate-fade-in">
        <button onClick={onClose} className="absolute right-4 top-4 text-noor-muted hover:text-noor-text" aria-label="Cancel">
          <X className="h-5 w-5" />
        </button>
        <div className="mb-1 flex justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-noor-gold/15">
            <Lock className="h-6 w-6 text-noor-gold" />
          </span>
        </div>
        <h2 className="text-center font-display text-lg font-bold">Enter parental PIN</h2>
        <p className="mt-1 text-center text-sm text-noor-muted">
          Required to switch to {targetName}.
        </p>

        <div className="my-5 flex justify-center gap-3">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-4 w-4 rounded-full border-2 ${
                pin.length > i ? 'border-noor-gold bg-noor-gold' : 'border-white/25'
              }`}
            />
          ))}
        </div>

        {error && <p className="mb-3 text-center text-sm text-noor-danger">{error}</p>}

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <PinKey key={n} onClick={() => press(String(n))}>
              {n}
            </PinKey>
          ))}
          <span />
          <PinKey onClick={() => press('0')}>0</PinKey>
          <PinKey onClick={() => setPin((p) => p.slice(0, -1))} aria-label="Delete">
            <Delete className="mx-auto h-5 w-5" />
          </PinKey>
        </div>

        <p className="mt-5 text-center text-xs text-noor-muted">Demo PIN: 1379</p>
      </div>
    </div>
  );
}

function PinKey({ children, onClick, ...rest }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl bg-white/5 py-3 text-xl font-semibold transition-colors hover:bg-white/10 active:scale-95"
      {...rest}
    >
      {children}
    </button>
  );
}
