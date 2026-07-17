import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import AmbientOffcuts from './AmbientOffcuts';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus('loading');
    try {
      await register(username, email, password);
      setStatus('success');
      setTimeout(() => navigate('/shorten'), 650);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError('That email is already registered. Try logging in instead.');
      } else {
        setError('Registration failed. Please try again.');
      }
      setStatus('idle');
    }
  };

  return (
    <section className="relative mx-auto flex max-w-sm flex-col px-5 py-16 sm:py-24">
      <AmbientOffcuts />
      <div className="relative uc-fade-up">
        <h1 className="font-display text-3xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-2 text-muted">It takes a second — then start chopping links.</p>

        <div className="mt-8 uc-card overflow-hidden">
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-3 p-10">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="26" fill="none" stroke="var(--color-accent)" strokeWidth="2" className="uc-check-circle" />
                <path d="M17 29 L24 36 L39 20" fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="uc-check-mark" />
              </svg>
              <p className="text-sm text-muted">Account created — redirecting…</p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="p-6">
              <label htmlFor="username" className="uc-label">Username</label>
              <input
                id="username"
                type="text"
                placeholder="maylord"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="uc-input"
                required
              />

              <label htmlFor="email" className="uc-label mt-5">Email</label>
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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="uc-input"
                minLength={6}
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
                {status === 'loading' ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          )}
        </div>

        <p className="mt-5 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent hover:underline">Log in</Link>.
        </p>
      </div>
    </section>
  );
};

export default Register;
