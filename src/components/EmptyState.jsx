import React from 'react';
import { SearchX } from 'lucide-react';

export function EmptyState({ icon: Icon = SearchX, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
        <Icon className="h-8 w-8 text-noor-muted" />
      </div>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      {message && <p className="mt-2 max-w-md text-noor-muted">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
