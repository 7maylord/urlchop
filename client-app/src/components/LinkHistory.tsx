import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { IUrl } from '../types';

const totalClicks = (link: IUrl) =>
  Array.isArray(link.clicks) ? link.clicks.reduce((sum, c) => sum + c.count, 0) : 0;

const LinkHistory = () => {
  const [links, setLinks] = useState<IUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { data } = await axiosInstance.get('/history/me');
        if (active) setLinks(data.urls ?? []);
      } catch {
        if (active) setNotice('Could not load your links. Please refresh.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    const onVisible = () => {
      if (!document.hidden) load();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      active = false;
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const flash = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(null), 2500);
  };

  const copy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      flash('Copy failed — copy the URL manually.');
    }
  };

  const downloadQr = (qrCode: string) => {
    const a = document.createElement('a');
    a.href = qrCode;
    a.download = 'urlchop-qr.png';
    a.click();
  };

  const deleteUrl = async (urlId: string) => {
    try {
      await axiosInstance.delete(`/url/${urlId}`);
      setLinks((prev) => prev.filter((l) => l.urlId !== urlId));
      flash('Link deleted.');
    } catch {
      flash('Could not delete that link. Try again.');
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-5 py-12">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-display text-3xl font-bold tracking-tight">Your links</h1>
        {links.length > 0 && (
          <span className="font-mono text-sm text-muted">{links.length} total</span>
        )}
      </div>

      {notice && (
        <p className="mt-4 rounded-md border border-line bg-white px-4 py-3 text-sm text-ink" role="status">
          {notice}
        </p>
      )}

      {loading ? (
        <p className="mt-10 font-mono text-sm text-muted">Loading…</p>
      ) : links.length === 0 ? (
        <div className="mt-10 uc-card p-10 text-center">
          <p className="text-muted">No links yet.</p>
          <Link to="/" className="mt-3 inline-block font-medium text-accent hover:underline">
            Chop your first one &rarr;
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {links.map((link) => (
            <li key={link._id} className="uc-card p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  src={link.qrCode}
                  alt={`QR code for ${link.shortUrl}`}
                  onClick={() => downloadQr(link.qrCode)}
                  className="h-16 w-16 shrink-0 cursor-pointer rounded-md border border-line bg-white p-1"
                  title="Download QR code"
                />

                <div className="min-w-0 flex-1">
                  <a
                    href={link.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate font-mono text-sm font-medium text-accent hover:underline"
                  >
                    {link.shortUrl}
                  </a>
                  <p className="mt-1 truncate text-sm text-muted" title={link.longUrl}>
                    {link.longUrl}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <Link
                    to={`/analytics/${link.urlId}`}
                    className="text-center font-mono text-sm text-ink hover:text-accent"
                    title="View analytics"
                  >
                    <span className="block text-lg font-medium leading-none">{totalClicks(link)}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted">clicks</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => copy(link.shortUrl, link._id)}
                    className="uc-btn-ghost px-3 py-2 text-xs"
                  >
                    {copiedId === link._id ? 'Copied' : 'Copy'}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteUrl(link.urlId)}
                    className="rounded-md px-2 py-2 text-xs text-muted hover:text-danger"
                    aria-label={`Delete ${link.shortUrl}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default LinkHistory;
