import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, ShieldCheck, Play } from 'lucide-react';
import { useApp } from '../context/AppProviders.jsx';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    login(email);
    navigate('/profiles', { replace: true });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-noor-glow opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_30%_20%,transparent,rgba(11,16,32,0.85))]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2 text-noor-bg">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-noor-bg/90 text-noor-gold">
              <span className="font-display text-xl font-extrabold">N</span>
            </span>
            <span className="font-display text-2xl font-extrabold">NoorStream</span>
          </Link>
          <div className="text-noor-bg">
            <h1 className="font-display text-4xl font-extrabold leading-tight">
              Press play
              <br />
              without worry.
            </h1>
            <p className="mt-4 max-w-sm text-noor-bg/80">
              Halal, family-safe streaming — curated lectures, documentaries, series, and content
              your whole family can enjoy.
            </p>
            <ul className="mt-8 space-y-3 text-noor-bg/90">
              <Feature icon={ShieldCheck}>Every title reviewed for suitability</Feature>
              <Feature icon={Sparkles}>AI discovery, scoped to the curated catalog</Feature>
              <Feature icon={Play}>Kids Mode with parental controls</Feature>
            </ul>
          </div>
          <p className="text-sm text-noor-bg/70">© {new Date().getFullYear()} NoorStream</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-noor-glow text-noor-bg">
                <span className="font-display text-xl font-extrabold">N</span>
              </span>
              <span className="font-display text-2xl font-extrabold">
                Noor<span className="noor-text-gradient">Stream</span>
              </span>
            </Link>
          </div>

          <h2 className="font-display text-2xl font-bold">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-1 text-sm text-noor-muted">
            {mode === 'signin' ? 'Sign in to continue watching.' : 'Start streaming in seconds.'}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <Field
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              label="Email"
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-noor-muted">Password</label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-noor-surface px-3 focus-within:border-noor-gold/60">
                <Lock className="h-4 w-4 text-noor-muted" />
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-noor-muted"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="text-noor-muted hover:text-noor-text"
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-noor-danger/15 px-3 py-2 text-sm text-noor-danger">{error}</p>
            )}

            <button type="submit" className="btn-primary w-full">
              {mode === 'signin' ? 'Sign in' : 'Sign up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-noor-muted">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
              className="font-semibold text-noor-gold hover:underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          <p className="mt-4 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-center text-xs text-noor-muted">
            Demo: enter any valid email + a 6+ char password to continue.
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, children }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-noor-bg/20">
        <Icon className="h-4 w-4" />
      </span>
      {children}
    </li>
  );
}

function Field({ icon: Icon, label, type, placeholder, value, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-noor-muted">{label}</label>
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-noor-surface px-3 focus-within:border-noor-gold/60">
        <Icon className="h-4 w-4 text-noor-muted" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-noor-muted"
        />
      </div>
    </div>
  );
}
