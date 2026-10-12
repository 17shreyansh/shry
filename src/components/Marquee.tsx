const WORDS = ["Build", "Connect", "Operate", "Websites", "Software", "Integrations", "Automation", "Support"];

export function Marquee({ tone = "dark", className = "" }: { tone?: "dark" | "paper"; className?: string }) {
  const row = (
    <ul className="flex shrink-0 items-center" aria-hidden>
      {WORDS.map((w) => (
        <li key={w} className="flex items-center whitespace-nowrap">
          <span className="font-display text-[clamp(1.6rem,3.2vw,3rem)] font-extrabold uppercase tracking-[-0.03em]">{w}</span>
          <span className={`mx-8 h-2.5 w-2.5 shrink-0 rotate-45 ${tone === "paper" ? "bg-obsidian" : "bg-accent"}`} />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`marquee overflow-hidden border-y py-5 ${tone === "paper" ? "border-obsidian/15 bg-bone text-obsidian" : "hairline bg-obsidian text-ink"} ${className}`}>
      <p className="sr-only">Build, connect, operate: websites, software, integrations, automation and support.</p>
      <div className="marquee-track">{row}{row}</div>
    </div>
  );
}
