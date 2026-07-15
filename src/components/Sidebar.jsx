import { useHub } from '../store.jsx';
import { AVATARS } from '../constants.js';
import { Hoverable } from './ui.jsx';

const NAV = [
  {
    key: 'analytics',
    label: 'Analytics',
    icon: (
      <path d="M2 14V8M8 14V2M14 14v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    ),
  },
  {
    key: 'calendar',
    label: 'Calendar',
    icon: (
      <>
        <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
  },
  {
    key: 'drafts',
    label: 'Drafts & Backlog',
    icon: (
      <>
        <rect x="1.5" y="2" width="3.6" height="12" rx="1" stroke="currentColor" strokeWidth="1.6" />
        <rect x="6.2" y="2" width="3.6" height="8" rx="1" stroke="currentColor" strokeWidth="1.6" />
        <rect x="10.9" y="2" width="3.6" height="10" rx="1" stroke="currentColor" strokeWidth="1.6" />
      </>
    ),
  },
  {
    key: 'connections',
    label: 'Connections',
    icon: (
      <path
        d="M6.5 9.5l3-3M4.5 8L3 9.5a2.5 2.5 0 003.5 3.5L8 11.5M11.5 8L13 6.5A2.5 2.5 0 009.5 3L8 4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    ),
  },
  {
    key: 'ai',
    label: 'AI Assistant',
    icon: (
      <path
        d="M8 1.5l1.6 4.1 4.4.6-3.2 3 .8 4.3L8 11.4l-3.6 2.1.8-4.3-3.2-3 4.4-.6L8 1.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    ),
  },
  {
    key: 'team',
    label: 'Team settings',
    icon: (
      <>
        <circle cx="5.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M1.5 13.5c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M10.5 3a2.5 2.5 0 010 4.6M12 9.8c1.5.6 2.5 2 2.5 3.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
];

export default function Sidebar() {
  const { state, setState, openNewPost, signOut } = useHub();
  const current = state.tab;

  // Signed-in user when wired to Supabase; otherwise the demo persona.
  const me = state.currentUser || { initials: 'AF', name: 'Afif', role: 'Marketing executive' };
  const showSignOut = state.backend && state.session;

  return (
    <aside
      data-print-hide
      style={{
        width: 224,
        flex: 'none',
        background: '#0E1220',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        gap: 8,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px 24px' }}>
        <img
          src="/solitair-logo.svg"
          alt="SolitAir"
          style={{ width: '100%', maxWidth: 170, height: 'auto', display: 'block' }}
        />
      </div>

      {NAV.map((item) => {
        const active = current === item.key;
        return (
          <Hoverable
            key={item.key}
            onClick={() => setState({ tab: item.key })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '11px 12px',
              borderRadius: 10,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              color: active ? '#00FF57' : '#9AA0AE',
              background: active ? 'rgba(0,255,87,.12)' : 'transparent',
            }}
            hoverStyle={active ? undefined : { background: '#1A2033' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {item.icon}
            </svg>
            {item.label}
          </Hoverable>
        );
      })}

      <div style={{ flex: 1 }} />

      <Hoverable
        as="button"
        onClick={openNewPost}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: 13,
          border: 'none',
          borderRadius: 10,
          background: '#00FF57',
          color: '#0E1220',
          fontWeight: 700,
          fontSize: 13,
          cursor: 'pointer',
        }}
        hoverStyle={{ background: '#3DFF7E' }}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New post
      </Hoverable>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 8px 0',
          borderTop: '1px solid #1E2438',
          marginTop: 14,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: AVATARS[me.initials] || '#1044FF',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {me.initials}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {me.name}
          </div>
          <div style={{ fontSize: 10.5, color: '#808080' }}>{me.role}</div>
        </div>
        {showSignOut ? (
          <Hoverable
            as="span"
            onClick={signOut}
            title="Sign out"
            style={{ cursor: 'pointer', color: '#9AA0AE', flex: 'none', display: 'flex', padding: 4 }}
            hoverStyle={{ color: '#fff' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 14H3.5A1.5 1.5 0 012 12.5v-9A1.5 1.5 0 013.5 2H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M10.5 11L14 8l-3.5-3M14 8H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Hoverable>
        ) : null}
      </div>
    </aside>
  );
}
