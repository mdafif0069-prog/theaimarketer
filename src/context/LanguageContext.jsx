import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations, LANGUAGES } from '../i18n/translations.js';

const LanguageContext = createContext(null);

const load = () => {
  try {
    return localStorage.getItem('noor.lang') || 'en';
  } catch {
    return 'en';
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(load);

  const dir = useMemo(
    () => LANGUAGES.find((l) => l.code === lang)?.dir || 'ltr',
    [lang],
  );

  // Reflect language + direction onto the document so the whole app flips.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem('noor.lang', lang);
    } catch {
      /* ignore */
    }
  }, [lang, dir]);

  const setLang = useCallback((code) => setLangState(code), []);

  const t = useCallback(
    (key) => translations[lang]?.[key] ?? translations.en[key] ?? key,
    [lang],
  );

  const value = useMemo(
    () => ({ lang, dir, setLang, t, languages: LANGUAGES }),
    [lang, dir, setLang, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider');
  return ctx;
}
