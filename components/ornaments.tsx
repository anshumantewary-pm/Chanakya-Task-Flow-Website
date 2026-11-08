// Decorative pieces drawn as SVG so they stay sharp and follow the theme colours.

function petals(count: number, radius: number, length: number, width: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i;
    const tip = radius + length;
    return (
      <path
        key={`${radius}-${i}`}
        transform={`rotate(${angle} 200 200)`}
        d={`M200 ${200 - radius} C ${200 + width} ${200 - radius - length * 0.35}, ${200 + width * 0.6} ${200 - tip + length * 0.2}, 200 ${200 - tip} C ${200 - width * 0.6} ${200 - tip + length * 0.2}, ${200 - width} ${200 - radius - length * 0.35}, 200 ${200 - radius} Z`}
      />
    );
  });
}

/** Rangoli-style mandala. */
export function Mandala({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" className={className}>
      <g fill="none" stroke="var(--gold)" strokeWidth="1.2">
        <circle cx="200" cy="200" r="196" strokeDasharray="2 6" />
        <circle cx="200" cy="200" r="186" />
        <circle cx="200" cy="200" r="120" />
        <circle cx="200" cy="200" r="62" />
        <circle cx="200" cy="200" r="30" strokeDasharray="3 4" />
        {petals(32, 120, 62, 9)}
      </g>
      <g fill="color-mix(in srgb, var(--saffron) 14%, transparent)" stroke="var(--saffron)" strokeWidth="1.2">
        {petals(16, 62, 56, 16)}
      </g>
      <g fill="color-mix(in srgb, var(--maroon) 16%, transparent)" stroke="var(--maroon)" strokeWidth="1">
        {petals(8, 30, 30, 12)}
      </g>
      <circle cx="200" cy="200" r="10" fill="var(--gold)" />
    </svg>
  );
}

/** Small lotus used in the logo and as list markers. */
export function Lotus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" aria-hidden="true" className={className}>
      <g stroke="var(--saffron)" strokeWidth="1.4" fill="color-mix(in srgb, var(--saffron) 18%, transparent)" strokeLinejoin="round">
        <path d="M24 3 C30 10 30 20 24 28 C18 20 18 10 24 3 Z" />
        <path d="M24 28 C20 20 13 15 6 14 C8 22 15 28 24 28 Z" />
        <path d="M24 28 C28 20 35 15 42 14 C40 22 33 28 24 28 Z" />
        <path d="M24 28 C16 26 7 24 2 22 C6 27 14 30 24 28 Z" />
        <path d="M24 28 C32 26 41 24 46 22 C42 27 34 30 24 28 Z" />
      </g>
      <path d="M10 30.5 H38" stroke="var(--gold)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Ornamental divider: line, dots and a diamond. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-3 text-gold ${className}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/70" />
      <svg viewBox="0 0 60 12" className="h-3 w-14">
        <circle cx="6" cy="6" r="1.6" fill="currentColor" />
        <circle cx="16" cy="6" r="2" fill="currentColor" />
        <path d="M30 0 L36 6 L30 12 L24 6 Z" fill="var(--saffron)" />
        <circle cx="44" cy="6" r="2" fill="currentColor" />
        <circle cx="54" cy="6" r="1.6" fill="currentColor" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/70" />
    </div>
  );
}

/** "चाणक्य Chanakya" wordmark. */
export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Lotus className={size === "lg" ? "h-8 w-12" : "h-5 w-8"} />
      <span className="flex flex-col leading-none">
        <span className={`font-display font-semibold text-maroon ${size === "lg" ? "text-2xl" : "text-lg"}`}>
          चाणक्य
        </span>
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-gold">Chanakya</span>
      </span>
    </span>
  );
}
