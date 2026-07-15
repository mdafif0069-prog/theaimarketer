import { useState } from 'react';
import { signIn } from '../lib/auth.js';
import { Hoverable } from '../components/ui.jsx';

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  border: '1px solid #E4E7EE',
  borderRadius: 10,
  fontSize: 13,
  color: '#14171F',
  background: '#fff',
};

// Rendered only when Supabase is configured but no session exists.
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await signIn(email.trim(), password);
      // On success the store's auth listener loads the workspace and swaps views.
    } catch (err) {
      setError(err?.message || 'Could not sign in. Check your email and password.');
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#0E1220',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div style={{ width: 380, maxWidth: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
          <img src="/solitair-logo.svg" alt="SolitAir" style={{ width: 200, height: 'auto' }} />
        </div>
        <form
          onSubmit={submit}
          style={{ background: '#fff', borderRadius: 16, padding: 26, boxShadow: '0 20px 60px rgba(14,18,32,.3)' }}
        >
          <div style={{ fontSize: 17, fontWeight: 800 }}>Sign in</div>
          <div style={{ fontSize: 12, color: '#808080', marginTop: 4, marginBottom: 18 }}>
            Social Hub is for the SolitAir marketing team.
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: '#808080', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
            Work email
          </div>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@solitair.com"
            style={{ ...inputStyle, marginBottom: 14 }}
          />

          <div style={{ fontSize: 11, fontWeight: 700, color: '#808080', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
            Password
          </div>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputStyle}
          />

          {error ? (
            <div
              style={{
                marginTop: 14,
                padding: '10px 12px',
                borderRadius: 9,
                background: 'rgba(196,60,60,.06)',
                border: '1px solid rgba(196,60,60,.35)',
                color: '#C43C3C',
                fontSize: 11.5,
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          ) : null}

          <Hoverable
            as="button"
            type="submit"
            disabled={busy}
            style={{
              width: '100%',
              marginTop: 20,
              padding: 13,
              border: 'none',
              borderRadius: 10,
              background: busy ? '#6E86FF' : '#1044FF',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: busy ? 'default' : 'pointer',
            }}
            hoverStyle={busy ? undefined : { background: '#0B33CC' }}
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </Hoverable>
        </form>
      </div>
    </div>
  );
}
