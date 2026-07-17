import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { IClick } from '../types';
import { useCountUp } from '../hooks/useCountUp';

const Analytics = () => {
  const { urlId } = useParams();
  const [clicks, setClicks] = useState<IClick[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);

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

  useEffect(() => {
    if (!loading) {
      const raf = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [loading]);

  const total = clicks.reduce((sum, c) => sum + c.count, 0);
  const totalCount = useCountUp(total);
  const max = clicks.reduce((m, c) => Math.max(m, c.count), 0) || 1;
  const sorted = [...clicks].sort((a, b) => b.count - a.count);

  return (
    <section className="mx-auto max-w-3xl px-5 py-12">
      <Link to="/link-history" className="text-sm text-muted transition hover:text-ink">&larr; Back to links</Link>

      <div className="uc-fade-up mt-4 flex items-baseline justify-between gap-4">
        <h1 className="font-display text-3xl font-bold tracking-tight">Analytics</h1>
        <span className="font-mono text-sm text-muted">/{urlId}</span>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          <div className="uc-shimmer h-24 rounded-xl" />
          <div className="uc-shimmer h-16 rounded-xl" />
          <div className="uc-shimmer h-16 rounded-xl" />
        </div>
      ) : error ? (
        <p className="uc-fade-up mt-6 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : (
        <>
          <div className="uc-fade-up mt-6 uc-card p-6">
            <p className="uc-label">Total clicks</p>
            <p className="font-mono text-4xl font-bold">{totalCount}</p>
          </div>

          <h2 className="uc-fade-up mt-10 uc-label">By source</h2>
          {sorted.length === 0 ? (
            <p className="mt-3 text-muted">No clicks yet — share the link to start tracking.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {sorted.map((click, i) => (
                <li
                  key={i}
                  className="uc-card uc-fade-up uc-stagger p-4"
                  style={{ '--i': i } as React.CSSProperties}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="truncate font-mono text-sm text-ink" title={click.origin}>
                      {click.origin}
                    </span>
                    <span className="shrink-0 font-mono text-sm font-medium">{click.count}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out"
                      style={{
                        width: revealed ? `${(click.count / max) * 100}%` : '0%',
                        transitionDelay: `${i * 80}ms`,
                      }}
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
