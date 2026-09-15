// Shared visual bits for the Medium + YouTube rails.
// Keeps the two rails visually consistent and avoids duplicating the
// category color logic, live dot, and chip styling.

import { CATEGORIES, type CategoryKey } from './categories';

/* ------------------------------------------------------------------ */
/*  Category color stripe — runs along the left edge of a card.       */
/* ------------------------------------------------------------------ */
export function CategoryStripe({
  category,
  className = '',
  height = 'h-full',
}: {
  category: CategoryKey;
  className?: string;
  height?: string;
}) {
  return (
    <div
      aria-hidden
      className={`absolute left-0 top-0 w-1 rounded-l-2xl ${height} ${className}`}
      style={{ background: CATEGORIES[category].color }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Category chip — small pill with the category color, clickable.    */
/* ------------------------------------------------------------------ */
export function CategoryChip({
  category,
  active = false,
  onClick,
  size = 'sm',
}: {
  category: CategoryKey;
  active?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}) {
  const c = CATEGORIES[category];
  const sizeCls =
    size === 'md'
      ? 'px-3 py-1 text-[11px]'
      : 'px-2.5 py-0.5 text-[10px]';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-[0.18em] transition-colors ${sizeCls} ${
        active
          ? 'border-transparent text-white'
          : 'border-rule bg-paper text-ink-muted hover:border-ink-faint hover:text-ink'
      }`}
      style={active ? { background: c.color } : undefined}
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: active ? '#fff' : c.color }}
      />
      {c.short}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Live dot — small pulsing green dot for fresh items (< 7 days).    */
/* ------------------------------------------------------------------ */
export function LiveDot({ className = '' }: { className?: string }) {
  return (
    <span
      aria-label="fresh"
      className={`relative inline-flex h-2 w-2 ${className}`}
    >
      <span
        aria-hidden
        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
        style={{ background: '#16a34a' }}
      />
      <span
        aria-hidden
        className="relative inline-flex h-2 w-2 rounded-full"
        style={{ background: '#16a34a' }}
      />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Category badge — small inline label, not clickable.                */
/* ------------------------------------------------------------------ */
export function CategoryBadge({
  category,
  className = '',
}: {
  category: CategoryKey;
  className?: string;
}) {
  const c = CATEGORIES[category];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] ${className}`}
      style={{ color: c.color, background: `${c.color}1a` }}
    >
      <span
        aria-hidden
        className="inline-block h-1 w-1 rounded-full"
        style={{ background: c.color }}
      />
      {c.short}
    </span>
  );
}
