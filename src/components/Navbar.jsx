import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Menu, X, LogOut, UserCog, Settings } from 'lucide-react';
import { cx } from '../lib/utils.js';
import { useApp } from '../context/AppProviders.jsx';
import { useAsk } from '../context/AskContext.jsx';
import { useI18n } from '../context/LanguageContext.jsx';
import { LanguageSwitcher } from './LanguageSwitcher.jsx';

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="NoorStream home">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-noor-glow text-noor-bg">
        <span className="font-display text-lg font-extrabold">N</span>
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight">
        Noor<span className="noor-text-gradient">Stream</span>
      </span>
    </Link>
  );
}

const NAV = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/browse', key: 'nav.browse' },
  { to: '/browse/kids', key: 'nav.kids' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, activeProfile } = useApp();
  const { openAsk } = useAsk();
  const { t } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'glass shadow-card' : 'bg-gradient-to-b from-black/70 to-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 sm:px-6 lg:px-10">
        <Logo />

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cx(
                  'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-white/10 text-noor-text' : 'text-noor-muted hover:text-noor-text',
                )
              }
            >
              {t(n.key)}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={openAsk}
            className="hidden items-center gap-2 rounded-full bg-ai-accent px-3.5 py-2 text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(91,108,255,0.6)] transition-transform hover:scale-105 sm:flex"
          >
            <Sparkles className="h-4 w-4" />
            {t('nav.ask')}
          </button>
          <button
            onClick={openAsk}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ai-accent text-white sm:hidden"
            aria-label="Ask NoorStream"
          >
            <Sparkles className="h-4 w-4" />
          </button>

          <button
            onClick={() => navigate('/search')}
            className="flex h-9 w-9 items-center justify-center rounded-full text-noor-muted hover:bg-white/10 hover:text-noor-text"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Profile menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-9 items-center gap-2 rounded-full pl-1 pr-2 hover:bg-white/10"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-noor-bg"
                style={{ background: activeProfile?.color || '#1FB58F' }}
              >
                {(activeProfile?.name || user?.email || 'N')[0].toUpperCase()}
              </span>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-noor-surface2 shadow-card animate-fade-in">
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="text-sm font-semibold">{activeProfile?.name || 'Guest'}</p>
                    <p className="truncate text-xs text-noor-muted">{user?.email || 'Not signed in'}</p>
                  </div>
                  <MenuItem onClick={() => { setMenuOpen(false); navigate('/profiles'); }} icon={UserCog}>
                    {t('nav.switchProfile')}
                  </MenuItem>
                  <MenuItem onClick={() => { setMenuOpen(false); navigate('/settings'); }} icon={Settings}>
                    {t('nav.settings')}
                  </MenuItem>
                  <MenuItem onClick={() => { setMenuOpen(false); logout(); navigate('/welcome'); }} icon={LogOut}>
                    {t('nav.signOut')}
                  </MenuItem>
                </div>
              </>
            )}
          </div>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function MenuItem({ icon: Icon, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-noor-muted transition-colors hover:bg-white/5 hover:text-noor-text"
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-noor-muted hover:bg-white/10 hover:text-noor-text md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-noor-surface2 p-5 shadow-2xl animate-fade-in">
            <div className="mb-6 flex justify-end">
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6 text-noor-muted" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cx(
                      'rounded-lg px-3 py-2.5 text-base font-medium',
                      isActive ? 'bg-white/10 text-noor-text' : 'text-noor-muted',
                    )
                  }
                >
                  {t(n.key)}
                </NavLink>
              ))}
              <NavLink to="/plans" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-base font-medium text-noor-muted">
                {t('nav.plans')}
              </NavLink>
              <div className="mt-4 border-t border-white/10 pt-4">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
