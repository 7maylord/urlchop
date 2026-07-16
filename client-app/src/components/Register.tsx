import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/shorten');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError('That email is already registered. Try logging in instead.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-sm flex-col px-5 py-16 sm:py-24">
      <h1 className="font-display text-3xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-2 text-muted">It takes a second — then start chopping links.</p>

      <form onSubmit={handleRegister} className="mt-8 uc-card p-6">
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
          <p className="mt-5 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="mt-6 uc-btn-accent w-full">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-accent hover:underline">Log in</Link>.
      </p>
    </section>
  );
};

export default Register;
