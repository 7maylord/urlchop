import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { IUrl } from '../types';
import CuttingScene from './CuttingScene';

const ShortenUrl = () => {
  const [longUrl, setLongUrl] = useState('');
  const [customId, setCustomId] = useState('');
  const [result, setResult] = useState<IUrl | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loggedIn = Boolean(localStorage.getItem('token'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!loggedIn) {
      setError('Please log in to shorten links.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/url', {
        longUrl,
        customId: customId.trim() || undefined,
      });
      setResult(data);
      setLongUrl('');
      setCustomId('');
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.error : null;
      setError(message || 'Could not shorten that link. Check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Copy failed — select the URL and copy it manually.');
    }
  };

  return (
    <section className="grid min-h-[calc(100vh-8rem)] grid-cols-1 lg:grid-cols-2">
      <CuttingScene />

      <div className="flex items-center justify-center px-5 py-14 sm:py-20">
        <div className="uc-fade-up w-full max-w-md">
          <p className="uc-label text-accent">URL shortener</p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Brief is the<br />new black.
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted">
            Paste a long, unruly link. Get a short one back — with a QR code and click analytics.
          </p>

          <div className="mt-10 uc-card overflow-hidden">
            {result ? (
              <div className="p-6 sm:p-7">
                {/* The chop, made real: long in, short out. */}
                <p className="truncate font-mono text-sm text-muted" title={result.longUrl}>
                  {result.longUrl}
                </p>
                <div className="my-3 flex items-center gap-3 text-xs text-muted/70">
                  <span className="h-px flex-1 bg-line" />
                  <span aria-hidden className="font-mono text-accent">&#9986; chopped</span>
                  <span className="h-px flex-1 bg-line" />
                </div>

                <div className="uc-chop-in flex flex-wrap items-center gap-3">
                  <a
                    href={result.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all font-mono text-lg font-medium text-accent hover:underline"
                  >
                    {result.shortUrl}
                  </a>
                  <button
                    type="button"
                    onClick={() => copy(result.shortUrl)}
                    className="uc-btn-ghost px-3 py-2 text-xs transition active:scale-95"
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                  <img
                    src={result.qrCode}
                    alt={`QR code for ${result.shortUrl}`}
                    className="uc-fade-up h-32 w-32 rounded-md border border-line bg-white p-1"
                  />
                  <div className="flex flex-col gap-2 text-sm">
                    <a href={result.qrCode} download="urlchop-qr.png" className="text-accent hover:underline">
                      Download QR code
                    </a>
                    <Link to="/link-history" className="text-muted hover:text-ink">
                      View in your links &rarr;
                    </Link>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { setResult(null); setError(null); }}
                  className="mt-7 uc-btn-ghost w-full transition active:scale-[0.98]"
                >
                  Shorten another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 sm:p-7">
                <label htmlFor="longUrl" className="uc-label">Long URL</label>
                <input
                  id="longUrl"
                  type="url"
                  inputMode="url"
                  placeholder="https://example.com/a/very/long/link"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="uc-input"
                  required
                />

                <label htmlFor="customId" className="uc-label mt-5">Custom slug — optional</label>
                <div className="flex items-stretch overflow-hidden rounded-md border border-line transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
                  <span className="flex select-none items-center bg-paper px-3 font-mono text-sm text-muted">
                    urlchop.co/
                  </span>
                  <input
                    id="customId"
                    type="text"
                    placeholder="my-link"
                    value={customId}
                    onChange={(e) => setCustomId(e.target.value)}
                    className="w-full border-0 bg-white px-3 py-3 font-mono text-sm text-ink placeholder:text-muted/60 focus:outline-none"
                  />
                </div>
                <p className="mt-2 text-xs text-muted">
                  Leave it blank and we&rsquo;ll generate a 7-character slug for you.
                </p>

                {error && (
                  <p className="uc-fade-up mt-5 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">
                    {error}{' '}
                    {!loggedIn && (
                      <Link to="/login" className="font-medium underline">Log in</Link>
                    )}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 uc-btn-accent w-full transition active:scale-[0.98]"
                >
                  {loading ? 'Chopping…' : 'Shorten it'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShortenUrl;
