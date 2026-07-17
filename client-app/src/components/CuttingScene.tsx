import { useEffect, useRef } from 'react';

const LONG_URL = 'https://example.com/campaigns/summer-sale?ref=newsletter&utm_source=email-2026';
const SHORT_TAG = 'urlchop.co/x7Kp9';

// A pair of geometric blades pivoting at (0,0); authored pointing straight
// down so the CSS keyframes (uc-cut-blade-a/-b, defined in index.css) read
// as shears descending onto the tape and snapping shut.
const Blade = ({ className }: { className: string }) => (
  <path d="M -1.6 0 L 1.6 0 L 0.7 24 L -0.7 24 Z" className={className} fill="url(#uc-steel)" />
);

const CuttingScene = () => {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !window.matchMedia('(pointer: fine)').matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        stage.style.setProperty('--tilt', `${Math.max(-6, Math.min(6, (x - 50) / 8))}deg`);
      });
    };

    stage.addEventListener('pointermove', onMove);
    return () => {
      stage.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      style={{ '--tilt': '0deg' } as React.CSSProperties}
      className="relative flex h-full min-h-[22rem] flex-col justify-center overflow-hidden bg-paper px-8 py-16 sm:min-h-[28rem]"
    >
      <p className="relative uc-label">The chop</p>

      <div className="relative mt-6 flex items-center">
        {/* the kept tag */}
        <div className="uc-cut-tag flex shrink-0 items-center gap-2 rounded-md border border-line bg-white py-2 pl-3 pr-4 shadow-sm">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="font-mono text-sm font-medium text-ink">{SHORT_TAG}</span>
        </div>

        {/* the blades, pivoting right at the cut */}
        <div className="relative -mx-1 shrink-0">
          <svg
            aria-hidden
            width="40"
            height="40"
            viewBox="-20 -8 40 40"
            className="relative z-10"
          >
            <defs>
              <linearGradient id="uc-steel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-steel)" />
                <stop offset="100%" stopColor="var(--color-steel-dark)" />
              </linearGradient>
            </defs>
            <g style={{ transform: 'rotate(var(--tilt))', transformOrigin: '0px 0px' }}>
              <g className="uc-cut-blade-a" style={{ transformOrigin: '0px 0px' }}>
                <Blade className="" />
              </g>
              <g className="uc-cut-blade-b" style={{ transformOrigin: '0px 0px' }}>
                <Blade className="" />
              </g>
              <circle r="1.6" fill="var(--color-steel-dark)" />
            </g>
          </svg>
          <span
            aria-hidden
            className="uc-cut-spark absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, #fff, var(--color-accent) 60%, transparent 70%)' }}
          />
        </div>

        {/* the offcut — falls away and fades */}
        <div className="uc-cut-waste min-w-0 flex-1 truncate rounded-r-md border border-dashed border-line py-2 pl-4 pr-3">
          <span className="truncate font-mono text-sm text-muted">{LONG_URL}</span>
        </div>
      </div>

      <p className="relative mt-8 max-w-xs text-sm text-muted">
        {LONG_URL.length} characters in, {SHORT_TAG.length} out.{' '}
        <span className="text-ink">That&rsquo;s the chop.</span>
      </p>
    </div>
  );
};

export default CuttingScene;
