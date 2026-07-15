import { useHub } from '../store.jsx';
import { AVATARS, NOTIF_DEFS, PERM_STYLES } from '../constants.js';
import { Hoverable, Toggle } from '../components/ui.jsx';

function Card({ children, style }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E4E7EE', borderRadius: 14, padding: 20, ...style }}>
      {children}
    </div>
  );
}

const selectStyle = {
  padding: '9px 12px',
  border: '1px solid #E4E7EE',
  borderRadius: 9,
  fontSize: 12,
  fontWeight: 600,
  background: '#fff',
  color: '#14171F',
};

export default function Team() {
  const { state, setState, invite, removeMember, toggleWsApproval, setWsReminder, setWsTz, toggleNotif, setNotifChannel } =
    useHub();
  const { team, inviteEmail, inviteRole, wsApproval, wsReminder, wsTz, notifs, notifChannel } = state;

  const notifChannelLabel = notifChannel === 'both' ? 'Email + Slack' : notifChannel === 'slack' ? 'Slack' : 'Email';

  return (
    <section style={{ maxWidth: 880 }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-.01em' }}>Team settings</h1>
        <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#808080' }}>Manage members, roles and workspace defaults</p>
      </div>

      {/* Members */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Members</div>
        {team.map((tm) => {
          const perm = PERM_STYLES[tm.perm] || PERM_STYLES.Editor;
          const removable = tm.initials !== 'NB';
          return (
            <div
              key={tm.email}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid #F0F2F6' }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: AVATARS[tm.initials] || '#555A66',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  flex: 'none',
                }}
              >
                {tm.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{tm.name}</div>
                <div style={{ fontSize: 11, color: '#808080', marginTop: 1 }}>{tm.email}</div>
              </div>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: '#555A66', flex: 'none' }}>{tm.role}</div>
              <div
                style={{
                  padding: '4px 10px',
                  borderRadius: 14,
                  background: perm.bg,
                  color: perm.color,
                  fontSize: 10.5,
                  fontWeight: 700,
                  flex: 'none',
                }}
              >
                {tm.perm}
              </div>
              {removable ? (
                <Hoverable
                  as="span"
                  onClick={() => removeMember(tm.initials)}
                  style={{ cursor: 'pointer', color: '#B9BEC9', fontSize: 16, lineHeight: 1, flex: 'none', padding: 4 }}
                  hoverStyle={{ color: '#C43C3C' }}
                >
                  ×
                </Hoverable>
              ) : null}
            </div>
          );
        })}
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 14,
            paddingTop: 14,
            borderTop: '1px solid #F0F2F6',
            flexWrap: 'wrap',
          }}
        >
          <input
            type="text"
            placeholder="name@solitair.com"
            value={inviteEmail}
            onChange={(e) => setState({ inviteEmail: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') invite();
            }}
            style={{
              flex: 1,
              minWidth: 180,
              padding: '10px 12px',
              border: '1px solid #E4E7EE',
              borderRadius: 9,
              fontSize: 12.5,
              color: '#14171F',
            }}
          />
          <select
            value={inviteRole}
            onChange={(e) => setState({ inviteRole: e.target.value })}
            style={{ ...selectStyle, padding: '10px 12px', fontSize: 12.5 }}
          >
            <option value="Editor">Editor — create &amp; schedule</option>
            <option value="Approver">Approver — sign off posts</option>
            <option value="Admin">Admin — full access</option>
          </select>
          <Hoverable
            as="button"
            onClick={invite}
            style={{
              padding: '10px 18px',
              border: 'none',
              borderRadius: 9,
              background: '#1044FF',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
            hoverStyle={{ background: '#0B33CC' }}
          >
            Invite
          </Hoverable>
        </div>
      </Card>

      {/* Workspace defaults */}
      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Workspace defaults</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid #F0F2F6' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700 }}>Approval required by default</div>
            <div style={{ fontSize: 11, color: '#808080', marginTop: 1 }}>New posts go to Nabil (CMO) before publishing</div>
          </div>
          <Toggle on={wsApproval} onClick={toggleWsApproval} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid #F0F2F6' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700 }}>Default reminder</div>
            <div style={{ fontSize: 11, color: '#808080', marginTop: 1 }}>Applied to new posts in manual mode</div>
          </div>
          <select value={wsReminder} onChange={(e) => setWsReminder(e.target.value)} style={selectStyle}>
            <option value="10">10 min before</option>
            <option value="30">30 min before</option>
            <option value="60">1 hour before</option>
            <option value="1440">1 day before</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid #F0F2F6' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700 }}>Timezone</div>
            <div style={{ fontSize: 11, color: '#808080', marginTop: 1 }}>All scheduling and best-time suggestions use this</div>
          </div>
          <select value={wsTz} onChange={(e) => setWsTz(e.target.value)} style={selectStyle}>
            <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
            <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
            <option value="Europe/London">Europe/London</option>
            <option value="America/New_York">America/New York</option>
          </select>
        </div>
      </Card>

      {/* Notifications */}
      <Card style={{ marginTop: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Notifications</div>
        <div style={{ fontSize: 11, color: '#808080', marginBottom: 6 }}>Delivered via {notifChannelLabel}</div>
        {NOTIF_DEFS.map((n) => (
          <div
            key={n.key}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid #F0F2F6' }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>{n.title}</div>
              <div style={{ fontSize: 11, color: '#808080', marginTop: 1 }}>{n.desc}</div>
            </div>
            <Toggle on={notifs[n.key]} onClick={() => toggleNotif(n.key)} />
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid #F0F2F6' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700 }}>Delivery channel</div>
            <div style={{ fontSize: 11, color: '#808080', marginTop: 1 }}>Where reminders and alerts are sent</div>
          </div>
          <select value={notifChannel} onChange={(e) => setNotifChannel(e.target.value)} style={selectStyle}>
            <option value="email">Email</option>
            <option value="slack">Slack</option>
            <option value="both">Email + Slack</option>
          </select>
        </div>
      </Card>
    </section>
  );
}
