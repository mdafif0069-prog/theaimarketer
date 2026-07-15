import { useHub } from '../store.jsx';
import { BEST_TIMES, MEDIA_SPECS, PLATFORMS as P } from '../constants.js';
import { Hoverable, Toggle } from './ui.jsx';

const label = (text) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: '#808080', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
    {text}
  </div>
);

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #E4E7EE',
  borderRadius: 9,
  fontSize: 12.5,
  fontWeight: 600,
  color: '#14171F',
};

export default function ComposerModal() {
  const { state, setForm, closeModal, savePost, addMedia, removeMedia, doRefineCaption, useAiCaption } = useHub();
  const { form, connections, aiCaption, refineBusy } = state;

  const fSpec = MEDIA_SPECS[form.platform];
  const fBest = BEST_TIMES[form.platform];
  const connectedNow = connections[form.platform];
  const auto = form.publishMode === 'auto' && connectedNow;

  const publishNote = auto
    ? 'Goes live automatically via the ' + P[form.platform].name + ' API at the set time.'
    : connectedNow
    ? "You'll get a reminder with the copy and media ready to post."
    : P[form.platform].name + " isn't connected — you'll get a reminder to post manually.";

  const approvalNote = form.requiresApproval
    ? 'Post goes to In review — it only publishes once Nabil (CMO) signs off.'
    : 'Post is scheduled directly — no sign-off needed.';

  return (
    <div
      onClick={closeModal}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(14,18,32,.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          width: 520,
          maxWidth: '100%',
          padding: 26,
          boxShadow: '0 20px 60px rgba(14,18,32,.3)',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 17, fontWeight: 800 }}>Schedule a post</div>
          <Hoverable
            onClick={closeModal}
            style={{ cursor: 'pointer', color: '#808080', fontSize: 20, lineHeight: 1, padding: 4 }}
            hoverStyle={{ color: '#14171F' }}
          >
            ×
          </Hoverable>
        </div>

        {/* Channel */}
        <div style={{ marginTop: 18 }}>
          {label('Channel')}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {Object.keys(P).map((k) => {
              const selected = form.platform === k;
              return (
                <div
                  key={k}
                  onClick={() => setForm({ platform: k })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 13px',
                    borderRadius: 9,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1.5px solid ' + (selected ? P[k].dot : '#E4E7EE'),
                    background: selected ? P[k].chipBg : '#fff',
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: P[k].dot }} />
                  {P[k].name}
                </div>
              );
            })}
          </div>
        </div>

        {/* Date / Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
          <div>
            {label('Date')}
            <input type="date" value={form.date} onChange={(e) => setForm({ date: e.target.value })} style={inputStyle} />
          </div>
          <div>
            {label('Time')}
            <input type="time" value={form.time} onChange={(e) => setForm({ time: e.target.value })} style={inputStyle} />
          </div>
        </div>

        {/* Post copy */}
        <div style={{ marginTop: 14 }}>
          {label('Post copy')}
          <textarea
            placeholder="What are we posting?"
            value={form.title}
            onChange={(e) => setForm({ title: e.target.value })}
            style={{ ...inputStyle, minHeight: 76, resize: 'vertical', fontWeight: 400 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <Hoverable
              as="button"
              onClick={doRefineCaption}
              style={{
                border: '1px solid rgba(16,68,255,.35)',
                background: 'rgba(16,68,255,.06)',
                color: '#1044FF',
                borderRadius: 8,
                padding: '7px 12px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
              hoverStyle={{ background: 'rgba(16,68,255,.12)' }}
            >
              ✦ Refine caption with AI
            </Hoverable>
            <span style={{ fontSize: 10.5, color: '#808080', fontWeight: 600 }}>{refineBusy ? 'Thinking…' : ''}</span>
          </div>
          {aiCaption ? (
            <div style={{ marginTop: 8, border: '1px solid rgba(16,68,255,.25)', background: 'rgba(16,68,255,.04)', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#1044FF', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                AI suggestion
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.55, marginTop: 6, whiteSpace: 'pre-wrap' }}>{aiCaption}</div>
              <Hoverable
                as="button"
                onClick={useAiCaption}
                style={{
                  marginTop: 10,
                  border: 'none',
                  background: '#1044FF',
                  color: '#fff',
                  borderRadius: 7,
                  padding: '6px 12px',
                  fontSize: 10.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                hoverStyle={{ background: '#0B33CC' }}
              >
                Use this caption
              </Hoverable>
            </div>
          ) : null}
        </div>

        {/* Media */}
        <div style={{ marginTop: 14 }}>
          {label('Media')}
          <Hoverable
            as="label"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              border: '1.5px dashed #D4D8E0',
              borderRadius: 10,
              padding: 15,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              color: '#555A66',
            }}
            hoverStyle={{ borderColor: '#1044FF', color: '#1044FF' }}
          >
            <input type="file" multiple onChange={addMedia} style={{ display: 'none' }} />
            ⇪ Upload image, video or document
          </Hoverable>
          <div style={{ fontSize: 10.5, color: '#808080', marginTop: 6, lineHeight: 1.5 }}>{fSpec.text}</div>
          {form.media.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 6,
                padding: '7px 10px',
                border: '1px solid ' + (m.ok ? '#E4E7EE' : 'rgba(196,60,60,.4)'),
                borderRadius: 8,
                background: m.ok ? '#fff' : 'rgba(196,60,60,.05)',
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {m.name}
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: m.ok ? '#00A83A' : '#C43C3C', flex: 'none' }}>
                {m.sizeLabel + (m.ok ? ' · OK' : ' · ' + m.reason)}
              </span>
              <span onClick={() => removeMedia(m.id)} style={{ cursor: 'pointer', color: '#808080', fontSize: 15, lineHeight: 1, flex: 'none' }}>
                ×
              </span>
            </div>
          ))}
        </div>

        {/* Best time hint */}
        <Hoverable
          onClick={() => setForm({ time: fBest.time })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 14,
            padding: '10px 12px',
            borderRadius: 10,
            background: 'rgba(0,168,58,.07)',
            border: '1px solid rgba(0,168,58,.25)',
            cursor: 'pointer',
          }}
          hoverStyle={{ background: 'rgba(0,168,58,.13)' }}
        >
          <span style={{ fontSize: 13 }}>⚡</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#14171F' }}>
            Best time for {P[form.platform].name}: <b>{fBest.slot}</b>
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 800, color: '#00A83A' }}>Apply</span>
        </Hoverable>

        {/* Publishing + Reminder */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
          <div>
            {label('Publishing')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div
                onClick={() => setForm({ publishMode: 'auto' })}
                style={{
                  border: '1.5px solid ' + (auto ? '#1044FF' : '#E4E7EE'),
                  background: auto ? 'rgba(16,68,255,.06)' : '#fff',
                  borderRadius: 9,
                  padding: '8px 11px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 11.5, fontWeight: 700 }}>Auto-publish</div>
                <div style={{ fontSize: 10, color: '#808080', marginTop: 1 }}>Goes live via the platform API</div>
              </div>
              <div
                onClick={() => setForm({ publishMode: 'manual' })}
                style={{
                  border: '1.5px solid ' + (!auto ? '#1044FF' : '#E4E7EE'),
                  background: !auto ? 'rgba(16,68,255,.06)' : '#fff',
                  borderRadius: 9,
                  padding: '8px 11px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 11.5, fontWeight: 700 }}>Manual</div>
                <div style={{ fontSize: 10, color: '#808080', marginTop: 1 }}>We remind you to post it yourself</div>
              </div>
            </div>
          </div>
          <div>
            {label('Reminder')}
            <select
              value={form.reminder}
              onChange={(e) => setForm({ reminder: e.target.value })}
              style={{ ...inputStyle, background: '#fff' }}
            >
              <option value="none">No reminder</option>
              <option value="10">10 min before</option>
              <option value="30">30 min before</option>
              <option value="60">1 hour before</option>
              <option value="1440">1 day before</option>
            </select>
            <div style={{ fontSize: 10, color: '#808080', marginTop: 8, lineHeight: 1.5 }}>{publishNote}</div>
          </div>
        </div>

        {/* Campaign + Assignee */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
          <div>
            {label('Campaign')}
            <input
              type="text"
              placeholder="e.g. Summer Launch"
              value={form.campaign}
              onChange={(e) => setForm({ campaign: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            {label('Assignee')}
            <select
              value={form.assignee}
              onChange={(e) => setForm({ assignee: e.target.value })}
              style={{ ...inputStyle, background: '#fff' }}
            >
              <option value="AF">Afif — Marketing executive</option>
              <option value="AR">Arya — Marketing executive</option>
              <option value="NB">Nabil — CMO</option>
            </select>
          </div>
        </div>

        {/* Approval */}
        <div style={{ marginTop: 14 }}>
          {label('Approval')}
          <div style={{ border: '1px solid #E4E7EE', borderRadius: 10, padding: '11px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Toggle on={form.requiresApproval} onClick={() => setForm({ requiresApproval: !form.requiresApproval })} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700 }}>Require approval before publishing</div>
                <div style={{ fontSize: 10, color: '#808080', marginTop: 1 }}>{approvalNote}</div>
              </div>
            </div>
            {form.requiresApproval ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#808080', flex: 'none' }}>Approver</span>
                <select
                  value={form.approver}
                  onChange={(e) => setForm({ approver: e.target.value })}
                  style={{ ...inputStyle, flex: 1, padding: '8px 10px', fontSize: 12, background: '#fff' }}
                >
                  <option value="NB">Nabil — CMO</option>
                </select>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <Hoverable
            as="button"
            onClick={() => savePost('draft')}
            style={{
              flex: 1,
              padding: 12,
              border: '1px solid #E4E7EE',
              background: '#fff',
              borderRadius: 10,
              fontSize: 12.5,
              fontWeight: 700,
              color: '#555A66',
              cursor: 'pointer',
            }}
            hoverStyle={{ borderColor: '#808080' }}
          >
            Save as draft
          </Hoverable>
          <Hoverable
            as="button"
            onClick={() => savePost(form.requiresApproval ? 'review' : 'scheduled')}
            style={{
              flex: 1.4,
              padding: 12,
              border: 'none',
              background: '#1044FF',
              borderRadius: 10,
              fontSize: 12.5,
              fontWeight: 700,
              color: '#fff',
              cursor: 'pointer',
            }}
            hoverStyle={{ background: '#0B33CC' }}
          >
            {form.requiresApproval ? 'Submit for approval' : 'Schedule post'}
          </Hoverable>
        </div>
      </div>
    </div>
  );
}
