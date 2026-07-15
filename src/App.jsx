import { useHub } from './store.jsx';
import Sidebar from './components/Sidebar.jsx';
import ComposerModal from './components/ComposerModal.jsx';
import Analytics from './screens/Analytics.jsx';
import Calendar from './screens/Calendar.jsx';
import Drafts from './screens/Drafts.jsx';
import Connections from './screens/Connections.jsx';
import AiAssistant from './screens/AiAssistant.jsx';
import Team from './screens/Team.jsx';
import Login from './screens/Login.jsx';

const SCREENS = {
  analytics: Analytics,
  calendar: Calendar,
  drafts: Drafts,
  connections: Connections,
  ai: AiAssistant,
  team: Team,
};

function Loading() {
  return (
    <div style={{ minHeight: '100vh', background: '#0E1220', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src="/solitair-logo.svg" alt="SolitAir" style={{ width: 180, opacity: 0.9 }} />
    </div>
  );
}

// A transient banner for backend errors / permission blocks.
function Notice({ text }) {
  if (!text) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 60,
        maxWidth: 520,
        padding: '11px 16px',
        borderRadius: 10,
        background: '#14171F',
        color: '#fff',
        fontSize: 12.5,
        fontWeight: 600,
        boxShadow: '0 12px 30px rgba(14,18,32,.35)',
      }}
    >
      {text}
    </div>
  );
}

export default function App() {
  const { state } = useHub();

  // Backend mode: gate on auth, show a splash while the first load runs.
  if (state.backend) {
    if (state.loading) return <Loading />;
    if (!state.session) return <Login />;
  }

  const Screen = SCREENS[state.tab] || Calendar;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main data-app-main style={{ flex: 1, minWidth: 0, padding: '28px 32px 48px' }}>
        <Screen />
      </main>
      {state.modalOpen ? <ComposerModal /> : null}
      <Notice text={state.notice} />
    </div>
  );
}
