import { useHub } from '../store.jsx';
import { PLATFORMS as P } from '../constants.js';

const CARDS = [
  { key: 'linkedin', account: 'SolitAir · Company page', scopes: 'Post, comments, page analytics', api: 'LinkedIn Marketing API' },
  { key: 'instagram', account: '@solitair · Business account', scopes: 'Publish, reels, insights', api: 'Instagram Graph API' },
  { key: 'facebook', account: 'SolitAir · Page', scopes: 'Publish, page insights', api: 'Meta Graph API' },
  { key: 'youtube', account: 'SolitAir · Channel', scopes: 'Upload, channel analytics', api: 'YouTube Data API' },
  { key: 'email', account: 'hello@solitair.com', scopes: 'Campaigns, opens, clicks', api: 'ESP integration (e.g. Mailchimp)' },
];

const HOW = [
  {
    title: '1 · Authorize once',
    body: "Sign in to each platform via OAuth. We never see your password — the platform grants a revocable token with only the permissions listed.",
  },
  {
    title: '2 · Publish via official APIs',
    body: "Scheduled posts go out through each platform's approved publishing API at the set time — no browser automation, no policy risk.",
  },
  {
    title: '3 · Analytics sync back',
    body: 'Reach, engagement and follower data refresh automatically and roll up into the Analytics section, normalized across channels.',
  },
];

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <span style={{ color: '#B9BEC9', flex: 'none', width: 72, fontWeight: 600 }}>{label}</span>
      {value}
    </div>
  );
}

export default function Connections() {
  const { state, toggleConnection } = useHub();

  return (
    <section>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-.01em' }}>Platform connections</h1>
        <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#808080' }}>
          Link each channel once via its official API — posts publish and analytics sync automatically
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
          gap: 14,
          marginBottom: 14,
        }}
      >
        {CARDS.map((c) => {
          const on = state.connections[c.key];
          return (
            <div
              key={c.key}
              style={{
                background: '#fff',
                border: '1px solid #E4E7EE',
                borderRadius: 14,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: P[c.key].chipBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: P[c.key].dot }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{P[c.key].name}</div>
                  <div style={{ fontSize: 11, color: '#808080', marginTop: 1 }}>{c.account}</div>
                </div>
                <div
                  style={{
                    padding: '4px 10px',
                    borderRadius: 14,
                    background: on ? 'rgba(0,168,58,.12)' : '#EDEFF4',
                    color: on ? '#00A83A' : '#808080',
                    fontSize: 10.5,
                    fontWeight: 700,
                  }}
                >
                  {on ? 'Connected' : 'Not connected'}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 11.5, color: '#555A66' }}>
                <Row label="API" value={c.api} />
                <Row label="Permissions" value={c.scopes} />
                <Row label="Sync" value={on ? 'Last synced 8 min ago' : '—'} />
              </div>
              <button
                onClick={() => toggleConnection(c.key)}
                style={{
                  alignSelf: 'flex-start',
                  padding: '9px 16px',
                  borderRadius: 9,
                  border: '1px solid ' + (on ? '#E4E7EE' : '#1044FF'),
                  background: on ? '#fff' : '#1044FF',
                  color: on ? '#C43C3C' : '#fff',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {on ? 'Disconnect' : 'Connect via OAuth'}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ background: '#0E1220', borderRadius: 14, padding: 22, color: '#fff' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#00FF57', textTransform: 'uppercase', letterSpacing: '.08em' }}>
          How connections work
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
            gap: 18,
            marginTop: 14,
          }}
        >
          {HOW.map((h) => (
            <div key={h.title}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{h.title}</div>
              <div style={{ fontSize: 11.5, color: '#9AA0AE', lineHeight: 1.6, marginTop: 4 }}>{h.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
