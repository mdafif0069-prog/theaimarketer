// Render-smoke test: mount every screen + the composer modal through React's
// server renderer to catch render-time crashes without a browser.
// Run: npm run smoke  (uses vite-node so JSX + import.meta.env resolve)

import { renderToString } from 'react-dom/server';
import { createElement as h } from 'react';
import { HubProvider, useHub } from '../src/store.jsx';
import Sidebar from '../src/components/Sidebar.jsx';
import ComposerModal from '../src/components/ComposerModal.jsx';
import Analytics from '../src/screens/Analytics.jsx';
import Calendar from '../src/screens/Calendar.jsx';
import Drafts from '../src/screens/Drafts.jsx';
import Connections from '../src/screens/Connections.jsx';
import AiAssistant from '../src/screens/AiAssistant.jsx';
import Team from '../src/screens/Team.jsx';

const screens = { Analytics, Calendar, Drafts, Connections, AiAssistant, Team };

// Force the composer open so it renders in the harness.
function OpenModal() {
  const { setState } = useHub();
  setState({ modalOpen: true });
  return null;
}

let failures = 0;

for (const [name, Screen] of Object.entries(screens)) {
  try {
    const html = renderToString(h(HubProvider, null, h(Sidebar), h(Screen)));
    if (!html || html.length < 50) throw new Error('suspiciously short output');
    console.log(`✓ ${name.padEnd(12)} rendered (${html.length} chars)`);
  } catch (err) {
    failures++;
    console.error(`✗ ${name} failed:`, err.message);
  }
}

try {
  const html = renderToString(h(HubProvider, null, h(OpenModal), h(ComposerModal)));
  if (!html.includes('Schedule a post')) throw new Error('composer heading missing');
  console.log(`✓ ${'Composer'.padEnd(12)} rendered (${html.length} chars)`);
} catch (err) {
  failures++;
  console.error('✗ Composer failed:', err.message);
}

if (failures) {
  console.error(`\n${failures} screen(s) failed to render.`);
  process.exit(1);
}
console.log('\nAll screens rendered cleanly.');
