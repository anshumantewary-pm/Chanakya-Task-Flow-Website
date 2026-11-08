// Shared Tailwind class names so every screen looks the same.
// Colours come from the palette in app/globals.css (paper, leaf, ink, saffron, maroon, gold).
export const card =
  "relative rounded-xl border border-line bg-leaf p-5 shadow-[0_1px_0_var(--line),0_8px_24px_-16px_color-mix(in_srgb,var(--maroon)_45%,transparent)]";
export const input =
  "w-full rounded-lg border border-line bg-paper/60 px-3 py-2 text-base text-ink outline-none placeholder:text-ink-soft/60 focus:border-saffron focus:ring-2 focus:ring-saffron/20";
export const label = "flex flex-col gap-1 text-sm font-medium text-ink-soft";
export const primaryButton =
  "rounded-lg bg-saffron px-4 py-2 text-sm font-semibold text-on-accent shadow-sm hover:bg-saffron-deep disabled:opacity-50";
export const secondaryButton =
  "rounded-lg border border-line bg-leaf px-3 py-1.5 text-sm font-medium text-ink hover:border-gold hover:bg-leaf-strong disabled:opacity-50";
export const muted = "text-sm text-ink-soft";
export const errorText = "text-sm text-maroon";
export const heading = "font-display text-3xl font-semibold text-ink";

export const priorityBadge: Record<string, string> = {
  high: "border border-maroon/30 bg-maroon/10 text-maroon",
  medium: "border border-saffron/30 bg-saffron/10 text-saffron-deep",
  low: "border border-line bg-paper text-ink-soft",
};
