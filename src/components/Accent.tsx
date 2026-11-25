/** Renders a heading string with its last word set in the serif accent. */
export function AccentLast({ text, className = "text-accent" }: { text: string; className?: string }) {
  const cut = text.trimEnd().lastIndexOf(" ");
  if (cut < 0) return <>{text}</>;
  return <>{text.slice(0, cut)} <em className={`serif ${className}`}>{text.slice(cut + 1)}</em></>;
}
