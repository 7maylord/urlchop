import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import AmbientOffcuts from './AmbientOffcuts';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus('loading');
    try {
      await login(email, password);
      setStatus('success');
      setTimeout(() => navigate('/shorten'), 650);
    } catch {
      setError('Login failed. Check your email and password.');
      setPassword('');
      setStatus('idle');
    }
  };

  return (
    <section className="relative mx-auto flex max-w-sm flex-col px-5 py-16 sm:py-24">
      <AmbientOffcuts />
      <div className="relative uc-fade-up">
        <h1 className="font-display text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-muted">Log in to shorten links and see their stats.</p>

        <div className="mt-8 uc-card overflow-hidden">
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-3 p-10">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="26" fill="none" stroke="var(--color-accent)" strokeWidth="2" className="uc-check-circle" />
                <path d="M17 29 L24 36 L39 20" fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="uc-check-mark" />
              </svg>
              <p className="text-sm text-muted">Logged in — redirecting…</p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="p-6">
              <label htmlFor="email" className="uc-label">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="uc-input"
                required
              />

              <label htmlFor="password" className="uc-label mt-5">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="uc-input"
                required
              />

              {error && (
                <p className="uc-fade-up mt-5 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="mt-6 uc-btn-accent w-full transition active:scale-[0.98]"
              >
                {status === 'loading' ? 'Logging in…' : 'Log in'}
              </button>
            </form>
          )}
        </div>

        <p className="mt-5 text-center text-sm text-muted">
          No account yet?{' '}
          <Link to="/register" className="font-medium text-accent hover:underline">Create one</Link>.
        </p>
      </div>
    </section>
  );
};

export default Login;
