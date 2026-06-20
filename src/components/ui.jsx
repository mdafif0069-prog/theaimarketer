import React from 'react';
import { Check } from 'lucide-react';
import { cx } from '../lib/utils.js';

export function Avatar({ initials, color, size = 44, ring = false, className }) {
  return (
    <span
      className={cx('flex shrink-0 items-center justify-center rounded-full font-semibold text-white', ring && 'ring-2 ring-emerald2', className)}
      style={{ width: size, height: size, background: color, fontSize: size * 0.34 }}
    >
      {initials}
    </span>
  );
}

export function VerifiedTick({ size = 16 }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-emerald2 text-ink"
      style={{ width: size, height: size }}
    >
      <Check style={{ width: size * 0.7, height: size * 0.7 }} strokeWidth={3} />
    </span>
  );
}

export function Toggle({ on, onClick, label }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={cx('relative h-7 w-12 shrink-0 rounded-full transition-colors', on ? 'bg-emerald2' : 'bg-white/15')}
    >
      <span className={cx('absolute top-1 h-5 w-5 rounded-full bg-white transition-all', on ? 'left-6' : 'left-1')} />
    </button>
  );
}

export function SectionLabel({ children, className }) {
  return (
    <p className={cx('px-5 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-wider text-cloud-dim', className)}>
      {children}
    </p>
  );
}
