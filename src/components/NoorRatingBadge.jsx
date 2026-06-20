import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { cx, TIER_COLOR, TIER_LABEL } from '../lib/utils.js';

export function TierBadge({ tier, className }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold',
        TIER_COLOR[tier],
        className,
      )}
    >
      {TIER_LABEL[tier]}
    </span>
  );
}

export function ReviewBadge({ status, className }) {
  const scholar = status === 'Scholar-reviewed';
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium',
        scholar
          ? 'border-noor-emerald/40 bg-noor-emerald/15 text-noor-emerald'
          : 'border-white/15 bg-white/5 text-noor-muted',
        className,
      )}
    >
      <ShieldCheck className="h-3 w-3" />
      {status}
    </span>
  );
}
