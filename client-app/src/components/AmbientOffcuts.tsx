// Faint drifting ribbon offcuts — a quiet callback to the cutting-room
// hero, reused wherever a page needs a bit of atmosphere behind a card.
const STRIPS = [
  { top: '12%', left: '8%', w: 90, r: -18 },
  { top: '68%', left: '4%', w: 70, r: 12 },
  { top: '22%', left: '88%', w: 80, r: 24 },
  { top: '78%', left: '90%', w: 60, r: -10 },
];

const AmbientOffcuts = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    {STRIPS.map((s, i) => (
      <span
        key={i}
        className="uc-drift absolute h-2 rounded-full bg-ink/5"
        style={{
          top: s.top,
          left: s.left,
          width: s.w,
          '--r': `${s.r}deg`,
          transform: `rotate(${s.r}deg)`,
          animationDelay: `${i * 700}ms`,
        } as React.CSSProperties}
      />
    ))}
  </div>
);

export default AmbientOffcuts;
