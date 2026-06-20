import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'noorstream.v2';

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

const DEFAULTS = {
  onboarded: false,
  interests: [],
  madhab: 'hanafi',
  lang: 'en', // primary content language
  isArabic: false, // AI answer language
  notifs: { prayer: true, daily: true, scholar: false, ramadan: false, live: false },
  following: {}, // scholarId -> bool
  notifying: {}, // scholarId -> bool
  saved: {}, // reelId -> bool
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(() => ({ ...DEFAULTS, ...load() }));

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const set = useCallback((patch) => {
    setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  const toggleInterest = useCallback((id) => {
    setState((s) => ({
      ...s,
      interests: s.interests.includes(id)
        ? s.interests.filter((x) => x !== id)
        : [...s.interests, id],
    }));
  }, []);

  const toggleNotif = useCallback((id) => {
    setState((s) => ({ ...s, notifs: { ...s.notifs, [id]: !s.notifs[id] } }));
  }, []);

  const toggleFollow = useCallback((id) => {
    setState((s) => {
      const following = { ...s.following, [id]: !s.following[id] };
      const notifying = { ...s.notifying };
      if (!following[id]) notifying[id] = false;
      return { ...s, following, notifying };
    });
  }, []);

  const toggleNotifying = useCallback((id) => {
    setState((s) => {
      if (!s.following[id]) {
        return { ...s, following: { ...s.following, [id]: true }, notifying: { ...s.notifying, [id]: true } };
      }
      return { ...s, notifying: { ...s.notifying, [id]: !s.notifying[id] } };
    });
  }, []);

  const toggleSaved = useCallback((id) => {
    setState((s) => ({ ...s, saved: { ...s.saved, [id]: !s.saved[id] } }));
  }, []);

  const resetOnboarding = useCallback(() => {
    setState((s) => ({ ...s, onboarded: false }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      set,
      toggleInterest,
      toggleNotif,
      toggleFollow,
      toggleNotifying,
      toggleSaved,
      resetOnboarding,
    }),
    [state, set, toggleInterest, toggleNotif, toggleFollow, toggleNotifying, toggleSaved, resetOnboarding],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
