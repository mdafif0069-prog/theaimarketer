// Deeper smoke test: render each page component directly (bypassing lazy/Suspense)
// inside the real provider + router stack, so the page's own render logic runs.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

globalThis.localStorage = {
  _d: {},
  getItem(k) { return this._d[k] ?? null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; },
};

const { AppProviders } = await import('../src/context/AppProviders.jsx');
const { AskProvider } = await import('../src/context/AskContext.jsx');

const pages = {
  Home: ['../src/pages/Home.jsx', '/'],
  Browse: ['../src/pages/Browse.jsx', '/browse'],
  BrowseKids: ['../src/pages/Browse.jsx', '/browse/kids', '/browse/:category'],
  Detail: ['../src/pages/Detail.jsx', '/title/the-traveler', '/title/:slug'],
  Search: ['../src/pages/Search.jsx', '/search'],
  Player: ['../src/pages/Player.jsx', '/watch/the-traveler', '/watch/:slug'],
  Profiles: ['../src/pages/Profiles.jsx', '/profiles'],
  Login: ['../src/pages/Login.jsx', '/login'],
  Settings: ['../src/pages/Settings.jsx', '/settings'],
  Plans: ['../src/pages/Plans.jsx', '/plans'],
  NotFound: ['../src/pages/NotFound.jsx', '/x'],
};

let failures = 0;
for (const [name, [mod, path, pattern]] of Object.entries(pages)) {
  try {
    const { default: Page } = await import(new URL(mod, import.meta.url).href);
    const html = renderToStaticMarkup(
      React.createElement(MemoryRouter, { initialEntries: [path] },
        React.createElement(AppProviders, null,
          React.createElement(AskProvider, null,
            React.createElement(Routes, null,
              React.createElement(Route, { path: pattern || path, element: React.createElement(Page) }),
            )))),
    );
    if (!html || html.length < 20) throw new Error('empty render');
    console.log(`  ok   ${name.padEnd(11)} -> ${html.length} bytes`);
  } catch (err) {
    failures++;
    console.error(`  FAIL ${name}: ${err.message}`);
  }
}
console.log(failures ? `\n${failures} page(s) failed` : '\nAll pages render their own content cleanly');
process.exit(failures ? 1 : 0);
