import { useHub } from '../store.jsx';
import { ADVANCE_LABEL, AVATARS, ORDER, PLATFORMS as P, STATUSES as ST } from '../constants.js';
import { Hoverable } from '../components/ui.jsx';

function columnDot(st) {
  if (st === 'published') return '#14171F';
  if (st === 'scheduled') return '#00A83A';
  if (st === 'review') return '#1044FF';
  return '#808080';
}

export default function Drafts() {
  const { state, advancePost } = useHub();

  const columns = ORDER.map((st) => {
    const cards = state.posts
      .filter((p) => p.status === st)
      .map((p) => ({
        id: p.id,
        title: p.title,
        date: p.date.slice(8) + ' Jul',
        platformName: P[p.platform].name,
        dot: P[p.platform].dot,
        campaign: p.campaign,
        assignee: p.assignee,
        avatarBg: AVATARS[p.assignee] || '#808080',
        canAdvance: st !== 'published',
        advanceLabel: ADVANCE_LABEL[st] || '',
      }));
    return {
      key: st,
      name: ST[st].label === 'Idea' ? 'Idea backlog' : ST[st].label,
      dot: columnDot(st),
      count: cards.length,
      cards,
    };
  });

  return (
    <section>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-.01em' }}>Drafts &amp; backlog</h1>
        <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#808080' }}>
          Move posts through review — click “Advance” to push a card forward
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, alignItems: 'start' }}>
        {columns.map((col) => (
          <div key={col.key} style={{ background: '#EDEFF4', borderRadius: 12, padding: 10, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px 10px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.dot }} />
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                  color: '#555A66',
                }}
              >
                {col.name}
              </span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#808080',
                  background: '#fff',
                  borderRadius: 10,
                  padding: '2px 8px',
                }}
              >
                {col.count}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {col.cards.map((c) => (
                <div key={c.id} style={{ background: '#fff', border: '1px solid #E4E7EE', borderRadius: 10, padding: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.dot, flex: 'none' }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#808080' }}>{c.platformName}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 10, color: '#B9BEC9', fontWeight: 600 }}>{c.date}</span>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.4, marginTop: 8 }}>{c.title}</div>
                  {c.campaign ? (
                    <div
                      style={{
                        display: 'inline-block',
                        marginTop: 8,
                        padding: '3px 9px',
                        borderRadius: 12,
                        background: 'rgba(16,68,255,.08)',
                        color: '#1044FF',
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      {c.campaign}
                    </div>
                  ) : null}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: c.avatarBg,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 9.5,
                        fontWeight: 700,
                      }}
                    >
                      {c.assignee}
                    </div>
                    {c.canAdvance ? (
                      <Hoverable
                        as="button"
                        onClick={() => advancePost(c.id)}
                        style={{
                          marginLeft: 'auto',
                          border: '1px solid #E4E7EE',
                          background: '#fff',
                          borderRadius: 8,
                          padding: '5px 10px',
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: '#1044FF',
                          cursor: 'pointer',
                        }}
                        hoverStyle={{ background: '#1044FF', color: '#fff', borderColor: '#1044FF' }}
                      >
                        {c.advanceLabel} →
                      </Hoverable>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
