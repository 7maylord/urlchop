import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { IClick } from '../types';

const Analytics = () => {
  const { urlId } = useParams();
  const [clicks, setClicks] = useState<IClick[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axiosInstance.get(`/analytics/${urlId}`);
        setClicks(data.clicks ?? []);
      } catch {
        setError('Could not load analytics for this link.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [urlId]);

  const total = clicks.reduce((sum, c) => sum + c.count, 0);
  const max = clicks.reduce((m, c) => Math.max(m, c.count), 0) || 1;
  const sorted = [...clicks].sort((a, b) => b.count - a.count);

  return (
    <section className="mx-auto max-w-3xl px-5 py-12">
      <Link to="/link-history" className="text-sm text-muted hover:text-ink">&larr; Back to links</Link>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h1 className="font-display text-3xl font-bold tracking-tight">Analytics</h1>
        <span className="font-mono text-sm text-muted">/{urlId}</span>
      </div>

      {loading ? (
        <p className="mt-10 font-mono text-sm text-muted">Loading…</p>
      ) : error ? (
        <p className="mt-6 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : (
        <>
          <div className="mt-6 uc-card p-6">
            <p className="uc-label">Total clicks</p>
            <p className="font-mono text-4xl font-bold">{total}</p>
          </div>

          <h2 className="mt-10 uc-label">By source</h2>
          {sorted.length === 0 ? (
            <p className="mt-3 text-muted">No clicks yet — share the link to start tracking.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {sorted.map((click, i) => (
                <li key={i} className="uc-card p-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="truncate font-mono text-sm text-ink" title={click.origin}>
                      {click.origin}
                    </span>
                    <span className="shrink-0 font-mono text-sm font-medium">{click.count}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${(click.count / max) * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    Last seen {new Date(click.timestamp).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
};

export default Analytics;
