import React from 'react';
import { cx } from '../lib/utils.js';

export function Skeleton({ className }) {
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-xl bg-white/5',
        'after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer',
        'after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent',
        className,
      )}
    />
  );
}

export function RowSkeleton() {
  return (
    <div className="mb-10">
      <Skeleton className="mb-4 h-6 w-44" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[2/3] w-40 shrink-0 sm:w-44" />
        ))}
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-[2/3] w-full" />
      ))}
    </div>
  );
}
