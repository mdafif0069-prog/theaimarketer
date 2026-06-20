import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ToastProvider } from './ToastContext.jsx';
import { LanguageProvider } from './LanguageContext.jsx';

/* ------------------------------------------------------------------ */
/* Persistence helper                                                  */
/* ------------------------------------------------------------------ */
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
};

/* ------------------------------------------------------------------ */
/* Profiles                                                            */
/* ------------------------------------------------------------------ */
export const DEFAULT_PROFILES = [
  { id: 'p1', name: 'Aisha', isKids: false, color: '#1FB58F' },
  { id: 'p2', name: 'Yusuf', isKids: false, color: '#5B6CFF' },
  { id: 'p3', name: 'Little Noor', isKids: true, color: '#F5C451' },
];

// In a real app the PIN is hashed + verified server-side (see Security doc).
// Here it is a demo-only constant for the parental-control flow.
export const DEMO_PARENTAL_PIN = '1379';

const AppContext = createContext(null);

export function AppProviders({ children }) {
  /* --- Auth --- */
  const [user, setUser] = useState(() => load('noor.user', null));
  useEffect(() => save('noor.user', user), [user]);

  const login = useCallback((email) => {
    setUser({ email, plan: 'premium' });
  }, []);
  const logout = useCallback(() => {
    setUser(null);
    setActiveProfileId(null);
  }, []);

  /* --- Profiles --- */
  const [profiles] = useState(DEFAULT_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState(() =>
    load('noor.activeProfile', null),
  );
  useEffect(() => save('noor.activeProfile', activeProfileId), [activeProfileId]);

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId) || null,
    [profiles, activeProfileId],
  );
  const selectProfile = useCallback((id) => setActiveProfileId(id), []);

  /* --- Watchlist (per profile) --- */
  const [watchlist, setWatchlist] = useState(() => load('noor.watchlist', {}));
  useEffect(() => save('noor.watchlist', watchlist), [watchlist]);

  const watchlistFor = useCallback(
    (pid) => watchlist[pid] || [],
    [watchlist],
  );
  const isInWatchlist = useCallback(
    (pid, titleId) => (watchlist[pid] || []).includes(titleId),
    [watchlist],
  );
  const toggleWatchlist = useCallback((pid, titleId) => {
    setWatchlist((prev) => {
      const cur = prev[pid] || [];
      const next = cur.includes(titleId)
        ? cur.filter((id) => id !== titleId)
        : [...cur, titleId];
      return { ...prev, [pid]: next };
    });
  }, []);

  /* --- Watch progress (per profile) --- */
  const [progress, setProgress] = useState(() => load('noor.progress', {}));
  useEffect(() => save('noor.progress', progress), [progress]);

  const progressFor = useCallback(
    (pid) => progress[pid] || {},
    [progress],
  );
  const setTitleProgress = useCallback((pid, titleId, percent) => {
    setProgress((prev) => ({
      ...prev,
      [pid]: { ...(prev[pid] || {}), [titleId]: percent },
    }));
  }, []);

  const value = useMemo(
    () => ({
      // auth
      user,
      login,
      logout,
      // profiles
      profiles,
      activeProfile,
      activeProfileId,
      selectProfile,
      // watchlist
      watchlistFor,
      isInWatchlist,
      toggleWatchlist,
      // progress
      progressFor,
      setTitleProgress,
    }),
    [
      user,
      login,
      logout,
      profiles,
      activeProfile,
      activeProfileId,
      selectProfile,
      watchlistFor,
      isInWatchlist,
      toggleWatchlist,
      progressFor,
      setTitleProgress,
    ],
  );

  return (
    <AppContext.Provider value={value}>
      <LanguageProvider>
        <ToastProvider>{children}</ToastProvider>
      </LanguageProvider>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProviders');
  return ctx;
}
