import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Sparkles, User, Plus } from 'lucide-react';
import { cx } from '../lib/utils.js';

const ITEMS = [
  { to: '/feed', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/ai', label: 'Ask AI', icon: Sparkles },
  { to: '/me', label: 'Profile', icon: User },
];

export function BottomNav() {
  const navigate = useNavigate();
  return (
    <nav className="relative z-30 shrink-0">
      <div className="glass-strong flex items-stretch border-t border-white/10 px-2 pb-5 pt-2.5">
        <NavItem {...ITEMS[0]} />
        <NavItem {...ITEMS[1]} />

        {/* Center FAB */}
        <div className="relative flex w-16 shrink-0 justify-center">
          <button
            onClick={() => navigate('/ai')}
            className="absolute -top-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-noor text-ink shadow-glow ring-4 ring-ink transition-transform active:scale-90"
            aria-label="Ask NoorStream AI"
          >
            <Plus className="h-7 w-7" strokeWidth={2.5} />
          </button>
        </div>

        <NavItem {...ITEMS[2]} />
        <NavItem {...ITEMS[3]} />
      </div>
    </nav>
  );
}

function NavItem({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cx(
          'flex flex-1 flex-col items-center gap-1 py-1.5 transition-colors',
          isActive ? 'text-emerald2' : 'text-cloud-dim hover:text-cloud-muted',
        )
      }
    >
      <Icon className="h-6 w-6" />
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
}
