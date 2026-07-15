import { useHub } from '../store.jsx';
import { BEST_TIMES, CADENCE, PLATFORMS as P } from '../constants.js';
import { AREA_FILLS, DATASET, HEAT_ROWS, SERIES, SERIES_MAX, linePoints } from '../data/analytics.js';
import { Hoverable } from '../components/ui.jsx';

const CHANNEL_KEYS = ['all', 'linkedin', 'instagram', 'facebook', 'email', 'youtube'];
const SHOW_WEBSITE = true;

const bestTimes = ['linkedin', 'instagram', 'facebook', 'email', 'youtube'].map((k) => ({
  name: P[k].name,
  dot: P[k].dot,
  slot: BEST_TIMES[k].slot,
  uplift: BEST_TIMES[k].uplift,
}));

const cadence = CADENCE.map((c) => ({
  name: P[c.key].name,
  dot: P[c.key].dot,
  label: c.current + ' → ' + c.suggested + ' /wk',
  note: c.note,
}));

function DateChip({ label, active }) {
  return (
    <Hoverable
      style={{
        padding: '8px 14px',
        borderRadius: 8,
        background: active ? '#14171F' : '#fff',
        border: active ? 'none' : '1px solid #E4E7EE',
        color: active ? '#fff' : '#808080',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
      }}
      hoverStyle={active ? undefined : { borderColor: '#1044FF', color: '#1044FF' }}
    >
      {label}
    </Hoverable>
  );
}

export default function Analytics() {
  const { state, setState } = useHub();
  const ch = state.channel;
  const A = DATASET[ch];

  const liLine = linePoints(SERIES.li, SERIES_MAX);
  const igLine = linePoints(SERIES.ig, SERIES_MAX);
  const fbLine = linePoints(SERIES.fb, SERIES_MAX);
  const emLine = linePoints(SERIES.em, SERIES_MAX);
  const ytLine = linePoints(SERIES.yt, SERIES_MAX);

  const lineOp = (k) => (ch === 'all' ? (k === 'email' || k === 'youtube' ? 0 : 1) : ch === k ? 1 : 0.12);
  const areaSrc = { all: liLine, linkedin: liLine, instagram: igLine, facebook: fbLine, email: emLine, youtube: ytLine };
  const areaPoints = '40,195 ' + areaSrc[ch] + ' 630,195';

  const legend =
    ch === 'all'
      ? [
          { label: 'LinkedIn', color: '#1044FF' },
          { label: 'Instagram', color: '#B049FF' },
          { label: 'Facebook', color: '#00B8F0' },
        ]
      : [
          {
            label: ch === 'email' ? 'Email subscribers' : ch === 'youtube' ? 'YouTube subscribers' : P[ch].name,
            color: P[ch].dot,
          },
        ];

  return (
    <section data-screen-label="Analytics">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 22,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-.01em' }}>Analytics overview</h1>
          <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#808080' }}>{A.sub}</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }} data-print-hide>
          <DateChip label="6 months" active />
          <DateChip label="30 days" />
          <DateChip label="7 days" />
          <Hoverable
            as="button"
            onClick={() => window.print()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid #1044FF',
              background: '#1044FF',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
            hoverStyle={{ background: '#0B33CC' }}
          >
            ↓ Export report
          </Hoverable>
        </div>
      </div>

      {/* Channel tabs */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 16 }}>
        {CHANNEL_KEYS.map((k) => {
          const active = ch === k;
          return (
            <div
              key={k}
              onClick={() => setState({ channel: k })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid ' + (active ? '#14171F' : '#E4E7EE'),
                background: active ? '#14171F' : '#fff',
                color: active ? '#fff' : '#555A66',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: k === 'all' ? '#14171F' : P[k].dot }} />
              {k === 'all' ? 'All channels' : P[k].name}
            </div>
          );
        })}
      </div>

      {/* KPI cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
          gap: 14,
          marginBottom: 14,
        }}
      >
        {A.kpis.map((k) => (
          <div key={k.label} style={{ background: '#fff', border: '1px solid #E4E7EE', borderRadius: 14, padding: '18px 20px' }}>
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: '#808080',
                textTransform: 'uppercase',
                letterSpacing: '.06em',
              }}
            >
              {k.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6, letterSpacing: '-.02em' }}>{k.value}</div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 8,
                padding: '3px 8px',
                borderRadius: 20,
                background: k.deltaBg,
                color: k.deltaColor,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {k.delta}
            </div>
            <span style={{ fontSize: 11, color: '#808080', marginLeft: 6 }}>vs June</span>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14, marginBottom: 14 }}>
        <div style={{ background: '#fff', border: '1px solid #E4E7EE', borderRadius: 14, padding: 20, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{A.chartTitle}</div>
            <div style={{ display: 'flex', gap: 14 }}>
              {legend.map((lg) => (
                <div key={lg.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#555A66' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: lg.color }} />
                  {lg.label}
                </div>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 640 230" style={{ width: '100%', height: 'auto', marginTop: 12, display: 'block' }}>
            <line x1="40" y1="10" x2="40" y2="195" stroke="#E4E7EE" />
            <line x1="40" y1="195" x2="630" y2="195" stroke="#E4E7EE" />
            <line x1="40" y1="149" x2="630" y2="149" stroke="#F0F2F6" />
            <line x1="40" y1="103" x2="630" y2="103" stroke="#F0F2F6" />
            <line x1="40" y1="57" x2="630" y2="57" stroke="#F0F2F6" />
            <text x="34" y="199" textAnchor="end" fontSize="10" fill="#808080">0</text>
            <text x="34" y="153" textAnchor="end" fontSize="10" fill="#808080">2.5K</text>
            <text x="34" y="107" textAnchor="end" fontSize="10" fill="#808080">5K</text>
            <text x="34" y="61" textAnchor="end" fontSize="10" fill="#808080">7.5K</text>
            <text x="34" y="18" textAnchor="end" fontSize="10" fill="#808080">10K</text>
            <polygon points={areaPoints} fill={AREA_FILLS[ch]} />
            <polyline points={liLine} fill="none" stroke="#1044FF" strokeWidth="2.5" strokeLinejoin="round" strokeOpacity={lineOp('linkedin')} />
            <polyline points={igLine} fill="none" stroke="#B049FF" strokeWidth="2.5" strokeLinejoin="round" strokeOpacity={lineOp('instagram')} />
            <polyline points={fbLine} fill="none" stroke="#00B8F0" strokeWidth="2.5" strokeLinejoin="round" strokeOpacity={lineOp('facebook')} />
            <polyline points={emLine} fill="none" stroke="#808080" strokeWidth="2.5" strokeLinejoin="round" strokeOpacity={lineOp('email')} />
            <polyline points={ytLine} fill="none" stroke="#FF4D3D" strokeWidth="2.5" strokeLinejoin="round" strokeOpacity={lineOp('youtube')} />
            <text x="40" y="214" fontSize="10.5" fill="#808080">Feb</text>
            <text x="158" y="214" fontSize="10.5" fill="#808080">Mar</text>
            <text x="276" y="214" fontSize="10.5" fill="#808080">Apr</text>
            <text x="394" y="214" fontSize="10.5" fill="#808080">May</text>
            <text x="512" y="214" fontSize="10.5" fill="#808080">Jun</text>
            <text x="618" y="214" fontSize="10.5" fill="#808080" textAnchor="end">Jul</text>
          </svg>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E4E7EE', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{A.barsTitle}</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 18, padding: '18px 6px 0' }}>
            {A.bars.map((b) => (
              <div key={b.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 800 }}>{b.val}</div>
                <div style={{ width: '100%', maxWidth: 44, height: b.h, borderRadius: '8px 8px 4px 4px', background: b.color }} />
                <div style={{ fontSize: 10.5, fontWeight: 600, color: '#808080' }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best posts + consistency + website */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }}>
        <div style={{ background: '#fff', border: '1px solid #E4E7EE', borderRadius: 14, padding: 20, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Best-performing posts</div>
          {A.posts.map((p) => (
            <div key={p.rank} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderTop: '1px solid #F0F2F6' }}>
              <div style={{ width: 26, fontSize: 12, fontWeight: 800, color: '#B9BEC9' }}>{p.rank}</div>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, flex: 'none' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 11, color: '#808080', marginTop: 2 }}>
                  {p.platform} · {p.date}
                </div>
              </div>
              <div style={{ textAlign: 'right', flex: 'none' }}>
                <div style={{ fontSize: 13, fontWeight: 800 }}>{p.reach}</div>
                <div style={{ fontSize: 10.5, color: '#808080' }}>reach</div>
              </div>
              <div style={{ textAlign: 'right', flex: 'none', width: 64 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#00A83A' }}>{p.eng}</div>
                <div style={{ fontSize: 10.5, color: '#808080' }}>eng.</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <div style={{ background: '#fff', border: '1px solid #E4E7EE', borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Posting consistency</div>
            <div style={{ fontSize: 11, color: '#808080', margin: '2px 0 12px' }}>Posts per day, last 6 weeks</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {HEAT_ROWS.map((row) => (
                <div key={row.label} style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <div style={{ width: 34, fontSize: 9.5, fontWeight: 600, color: '#B9BEC9' }}>{row.label}</div>
                  {row.days.map((d, i) => (
                    <div key={i} title={d.tip} style={{ flex: 1, aspectRatio: '1', borderRadius: 5, background: d.c }} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {SHOW_WEBSITE ? (
            <div style={{ background: '#0E1220', borderRadius: 14, padding: 20, color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00FF57' }} />
                solitair.com
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>38.2K</div>
                  <div style={{ fontSize: 10.5, color: '#808080' }}>sessions</div>
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>42%</div>
                  <div style={{ fontSize: 10.5, color: '#808080' }}>bounce</div>
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#00FF57' }}>1,204</div>
                  <div style={{ fontSize: 10.5, color: '#808080' }}>bookings</div>
                </div>
              </div>
              <svg viewBox="0 0 260 46" style={{ width: '100%', height: 46, marginTop: 12, display: 'block' }}>
                <polyline
                  points="0,38 22,34 44,36 66,28 88,30 110,24 132,26 154,18 176,21 198,14 220,16 242,8 260,10"
                  fill="none"
                  stroke="#00FF57"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : null}
        </div>
      </div>

      {/* Best times + cadence */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
        <div style={{ background: '#fff', border: '1px solid #E4E7EE', borderRadius: 14, padding: 20, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Best time to post</div>
          <div style={{ fontSize: 11, color: '#808080', margin: '2px 0 10px' }}>Based on engagement over your last 90 days</div>
          {bestTimes.map((bt) => (
            <div key={bt.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: '1px solid #F0F2F6' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: bt.dot, flex: 'none' }} />
              <span style={{ fontSize: 12.5, fontWeight: 600, flex: 1 }}>{bt.name}</span>
              <span style={{ fontSize: 12.5, fontWeight: 800 }}>{bt.slot}</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#00A83A', width: 78, textAlign: 'right' }}>{bt.uplift}</span>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', border: '1px solid #E4E7EE', borderRadius: 14, padding: 20, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Suggested cadence</div>
          <div style={{ fontSize: 11, color: '#808080', margin: '2px 0 10px' }}>Posts per week — current → suggested</div>
          {cadence.map((cd) => (
            <div key={cd.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: '1px solid #F0F2F6' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: cd.dot, flex: 'none' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{cd.name}</div>
                <div style={{ fontSize: 10.5, color: '#808080', marginTop: 1 }}>{cd.note}</div>
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 800, flex: 'none' }}>{cd.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
