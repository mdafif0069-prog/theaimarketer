import { useHub } from './store.jsx';
import Sidebar from './components/Sidebar.jsx';
import ComposerModal from './components/ComposerModal.jsx';
import Analytics from './screens/Analytics.jsx';
import Calendar from './screens/Calendar.jsx';
import Drafts from './screens/Drafts.jsx';
import Connections from './screens/Connections.jsx';
import AiAssistant from './screens/AiAssistant.jsx';
import Team from './screens/Team.jsx';

const SCREENS = {
  analytics: Analytics,
  calendar: Calendar,
  drafts: Drafts,
  connections: Connections,
  ai: AiAssistant,
  team: Team,
};

export default function App() {
  const { state } = useHub();
  const Screen = SCREENS[state.tab] || Calendar;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main data-app-main style={{ flex: 1, minWidth: 0, padding: '28px 32px 48px' }}>
        <Screen />
      </main>
      {state.modalOpen ? <ComposerModal /> : null}
    </div>
  );
}
