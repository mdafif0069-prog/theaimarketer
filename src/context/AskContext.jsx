import React, { createContext, useCallback, useContext, useState } from 'react';

const AskContext = createContext(null);

export function AskProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openAsk = useCallback(() => setOpen(true), []);
  const closeAsk = useCallback(() => setOpen(false), []);
  return (
    <AskContext.Provider value={{ open, openAsk, closeAsk }}>
      {children}
    </AskContext.Provider>
  );
}

export function useAsk() {
  const ctx = useContext(AskContext);
  if (!ctx) throw new Error('useAsk must be used within AskProvider');
  return ctx;
}
