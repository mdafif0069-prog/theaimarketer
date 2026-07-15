import { useHub } from '../store.jsx';
import { PLATFORMS as P, STATUSES as ST, TODAY } from '../constants.js';
import { Hoverable } from '../components/ui.jsx';

const FILTER_KEYS = ['all', 'linkedin', 'instagram', 'facebook', 'email', 'youtube'];
const WEEK_STARTS_MONDAY = true;

function chip(p) {
  return {
    id: p.id,
    title: p.time + ' ' + p.title,
    time: p.time,
    platformName: P[p.platform].name,
    dot: P[p.platform].dot,
    chipBg: P[p.platform].chipBg,
    status: ST[p.status].label,
    statusBg: ST[p.status].bg,
    statusColor: ST[p.status].color,
  };
}

export default function Calendar() {
  const { state, setState, openComposer } = useHub();
  const { calView, filter, posts } = state;

  const visible = posts.filter((p) => filter === 'all' || p.platform === filter);
  const byDate = {};
  visible.forEach((p) => {
    (byDate[p.date] = byDate[p.date] || []).push(p);
  });

  // --- Month grid (July 2026) ---
  const first = new Date(2026, 6, 1);
  const dow = first.getDay();
  const offset = WEEK_STARTS_MONDAY ? (dow + 6) % 7 : dow;
  const rows = Math.ceil((offset + 31) / 7);
  const monthCells = [];
  for (let i = 0; i < rows * 7; i++) {
    const d = new Date(2026, 6, 1 - offset + i);
    const iso =
      d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const inMonth = d.getMonth() === 6;
    const isToday = iso === TODAY;
    monthCells.push({
      iso,
      day: d.getDate(),
      bg: inMonth ? '#fff' : '#F0F1F5',
      border: isToday ? '#1044FF' : '#E4E7EE',
      numColor: isToday ? '#fff' : inMonth ? '#14171F' : '#B9BEC9',
      numBg: isToday ? '#1044FF' : 'transparent',
      posts: (byDate[iso] || []).map(chip),
    });
  }
  const dowLabels = WEEK_STARTS_MONDAY
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // --- Week (13–19 July 2026) ---
  const weekCells = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(2026, 6, 13 + i);
    const iso = '2026-07-' + String(d.getDate()).padStart(2, '0');
    const isToday = iso === TODAY;
    weekCells.push({
      iso,
      dow: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
      day: d.getDate(),
      hdBg: isToday ? '#1044FF' : '#fff',
      hdColor: isToday ? '#fff' : '#14171F',
      posts: (byDate[iso] || []).map(chip),
    });
  }

  const toggleBtn = (label, view) => (
    <div
      onClick={() => setState({ calView: view })}
      style={{
        padding: '7px 16px',
        borderRadius: 7,
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
        background: calView === view ? '#14171F' : 'transparent',
        color: calView === view ? '#fff' : '#808080',
      }}
    >
      {label}
    </div>
  );

  return (
    <section>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 18,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-.01em' }}>Content calendar</h1>
          <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#808080' }}>July 2026 · click a day to schedule</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: '#fff', border: '1px solid #E4E7EE', borderRadius: 9, padding: 3 }}>
            {toggleBtn('Month', 'month')}
            {toggleBtn('Week', 'week')}
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {FILTER_KEYS.map((k) => {
              const active = filter === k;
              return (
                <div
                  key={k}
                  onClick={() => setState({ filter: k })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 12px',
                    borderRadius: 20,
                    fontSize: 11.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid ' + (active ? '#14171F' : '#E4E7EE'),
                    background: active ? '#14171F' : '#fff',
                    color: active ? '#fff' : '#555A66',
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: k === 'all' ? '#14171F' : P[k].dot,
                    }}
                  />
                  {k === 'all' ? 'All' : P[k].name}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {calView === 'month' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,minmax(0,1fr))', gap: 6, marginBottom: 6 }}>
            {dowLabels.map((dw) => (
              <div
                key={dw}
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: '#808080',
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                  padding: '0 4px',
                }}
              >
                {dw}
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,minmax(0,1fr))', gap: 6 }}>
            {monthCells.map((cell, i) => (
              <Hoverable
                key={i}
                onClick={() => openComposer(cell.iso)}
                style={{
                  minHeight: 104,
                  minWidth: 0,
                  background: cell.bg,
                  border: '1px solid ' + cell.border,
                  borderRadius: 10,
                  padding: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
                hoverStyle={{ borderColor: '#1044FF' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: cell.numColor,
                      background: cell.numBg,
                      minWidth: 20,
                      height: 20,
                      borderRadius: 6,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                    }}
                  >
                    {cell.day}
                  </span>
                </div>
                {cell.posts.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '4px 6px',
                      borderRadius: 6,
                      background: p.chipBg,
                      fontSize: 10,
                      fontWeight: 600,
                      color: '#14171F',
                      overflow: 'hidden',
                      minWidth: 0,
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.dot, flex: 'none' }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</span>
                  </div>
                ))}
              </Hoverable>
            ))}
          </div>
        </>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,minmax(0,1fr))', gap: 8 }}>
          {weekCells.map((wc, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
              <div style={{ textAlign: 'center', padding: '10px 4px', borderRadius: 10, background: wc.hdBg, color: wc.hdColor }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', opacity: 0.7 }}>
                  {wc.dow}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{wc.day}</div>
              </div>
              <Hoverable
                onClick={() => openComposer(wc.iso)}
                style={{
                  flex: 1,
                  minHeight: 340,
                  background: '#fff',
                  border: '1px solid #E4E7EE',
                  borderRadius: 10,
                  padding: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  cursor: 'pointer',
                }}
                hoverStyle={{ borderColor: '#1044FF' }}
              >
                {wc.posts.map((p) => (
                  <div key={p.id} style={{ borderLeft: '3px solid ' + p.dot, background: p.chipBg, borderRadius: 8, padding: 8 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#555A66' }}>
                      {p.time} · {p.platformName}
                    </div>
                    <div style={{ fontSize: 11.5, fontWeight: 600, marginTop: 3, lineHeight: 1.35 }}>{p.title}</div>
                    <div
                      style={{
                        display: 'inline-block',
                        marginTop: 6,
                        padding: '2px 8px',
                        borderRadius: 12,
                        background: p.statusBg,
                        color: p.statusColor,
                        fontSize: 9.5,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '.05em',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        boxSizing: 'border-box',
                      }}
                    >
                      {p.status}
                    </div>
                  </div>
                ))}
              </Hoverable>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
