// Render-time smoke test: mounts each route through React's server renderer to
// catch crashes in component render logic (the production build already validates
// imports/syntax). Effects do not run under renderToString, so this checks the
// synchronous render path only.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

// Minimal browser globals so context initializers that touch storage don't crash.
globalThis.localStorage = {
  _d: {},
  getItem(k) { return this._d[k] ?? null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; },
};

const { AppProviders } = await import('../src/context/AppProviders.jsx');
const { default: App } = await import('../src/App.jsx');

const routes = ['/', '/login', '/profiles', '/browse', '/browse/kids',
  '/title/the-traveler', '/search', '/watch/the-traveler', '/settings', '/plans', '/nope-404'];

let failures = 0;
for (const route of routes) {
  try {
    const html = renderToStaticMarkup(
      React.createElement(MemoryRouter, { initialEntries: [route] },
        React.createElement(AppProviders, null,
          React.createElement(App))),
    );
    if (!html || html.length < 20) throw new Error('empty render');
    console.log(`  ok   ${route}  (${html.length} bytes)`);
  } catch (err) {
    failures++;
    console.error(`  FAIL ${route}\n       ${err.message}`);
  }
}
console.log(failures ? `\n${failures} route(s) failed to render` : '\nAll routes render cleanly');
process.exit(failures ? 1 : 0);
