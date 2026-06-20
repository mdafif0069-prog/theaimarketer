// Render-time smoke test: render each screen through React's server renderer
// inside the app provider + router stack, catching render-time crashes.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

globalThis.localStorage = {
  _d: {},
  getItem(k) { return this._d[k] ?? null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; },
};

const { AppProvider } = await import('../src/context/AppContext.jsx');

const pages = {
  Onboarding: ['../src/pages/Onboarding.jsx', '/'],
  Feed: ['../src/pages/Feed.jsx', '/feed'],
  Search: ['../src/pages/Search.jsx', '/search'],
  AskAI: ['../src/pages/AskAI.jsx', '/ai'],
  MyProfile: ['../src/pages/MyProfile.jsx', '/me'],
  ScholarProfile: ['../src/pages/ScholarProfile.jsx', '/scholar/khalid', '/scholar/:id'],
};

let failures = 0;
for (const [name, [mod, path, pattern]] of Object.entries(pages)) {
  try {
    const { default: Page } = await import(new URL(mod, import.meta.url).href);
    const html = renderToStaticMarkup(
      React.createElement(MemoryRouter, { initialEntries: [path] },
        React.createElement(AppProvider, null,
          React.createElement(Routes, null,
            React.createElement(Route, { path: pattern || path, element: React.createElement(Page) })))),
    );
    if (!html || html.length < 20) throw new Error('empty render');
    console.log(`  ok   ${name.padEnd(15)} -> ${html.length} bytes`);
  } catch (err) {
    failures++;
    console.error(`  FAIL ${name}: ${err.message}`);
  }
}
console.log(failures ? `\n${failures} page(s) failed` : '\nAll screens render cleanly');
process.exit(failures ? 1 : 0);
