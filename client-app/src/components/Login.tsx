import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/shorten');
    } catch {
      setError('Login failed. Check your email and password.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-sm flex-col px-5 py-16 sm:py-24">
      <h1 className="font-display text-3xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-muted">Log in to shorten links and see their stats.</p>

      <form onSubmit={handleLogin} className="mt-8 uc-card p-6">
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
          <p className="mt-5 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="mt-6 uc-btn-accent w-full">
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        No account yet?{' '}
        <Link to="/register" className="font-medium text-accent hover:underline">Create one</Link>.
      </p>
    </section>
  );
};

export default Login;
