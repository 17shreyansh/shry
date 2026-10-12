import type { Project } from "@/content/site";

/** Clearly illustrative interface sketch. NOT a screenshot; replaced by `image` when supplied. */
export function Sketch({ variant }: { variant: Project["variant"] }) {
  const ln = "rgba(245,245,240,0.16)";
  return (
    <svg viewBox="0 0 640 400" className="h-full w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
      <rect width="640" height="400" fill="#0d0f13" />
      {variant === "dashboard" ? (
        <g>
          <rect x="0" y="0" width="120" height="400" fill="#111318" />
          {[40, 78, 116, 154].map((y, i) => <rect key={y} x="20" y={y} width={i === 0 ? 70 : 56} height="10" rx="5" fill={i === 0 ? "#BFEA5A" : ln} />)}
          <rect x="150" y="30" width="170" height="64" rx="8" fill="#181a20" stroke={ln} />
          <rect x="336" y="30" width="170" height="64" rx="8" fill="#181a20" stroke={ln} />
          <rect x="522" y="30" width="96" height="64" rx="8" fill="#181a20" stroke={ln} />
          <rect x="166" y="46" width="60" height="8" rx="4" fill={ln} /><rect x="166" y="64" width="90" height="16" rx="4" fill="rgba(245,245,240,0.5)" />
          <rect x="352" y="46" width="60" height="8" rx="4" fill={ln} /><rect x="352" y="64" width="70" height="16" rx="4" fill="rgba(245,245,240,0.5)" />
          <g transform="translate(150 120)">
            {Array.from({ length: 5 }).map((_, r) => (
              <g key={r} transform={`translate(0 ${r * 50})`}>
                <rect width="468" height="38" rx="6" fill="#111318" stroke={ln} />
                <circle cx="22" cy="19" r="8" fill={ln} />
                <rect x="44" y="12" width={110 + (r % 3) * 20} height="7" rx="3.5" fill="rgba(245,245,240,0.4)" />
                <rect x="44" y="24" width="64" height="5" rx="2.5" fill={ln} />
                <rect x="392" y="11" width="56" height="16" rx="8" fill={r % 2 ? "rgba(191,234,90,0.18)" : ln} />
              </g>
            ))}
          </g>
        </g>
      ) : (
        <g>
          <rect x="0" y="0" width="640" height="44" fill="#111318" />
          <rect x="24" y="16" width="56" height="12" rx="6" fill="rgba(245,245,240,0.5)" />
          {[360, 424, 488].map((x) => <rect key={x} x={x} y="18" width="44" height="8" rx="4" fill={ln} />)}
          <rect x="570" y="12" width="52" height="20" rx="10" fill="#BFEA5A" />
          <rect x="56" y="92" width="300" height="24" rx="6" fill="rgba(245,245,240,0.55)" />
          <rect x="56" y="128" width="220" height="24" rx="6" fill="rgba(245,245,240,0.55)" />
          <rect x="56" y="176" width="260" height="8" rx="4" fill={ln} /><rect x="56" y="194" width="230" height="8" rx="4" fill={ln} />
          <rect x="56" y="226" width="110" height="34" rx="17" fill="#BFEA5A" />
          <rect x="390" y="84" width="200" height="230" rx="10" fill="#181a20" stroke={ln} />
          <rect x="410" y="104" width="160" height="96" rx="6" fill="#0d0f13" stroke={ln} />
          <rect x="410" y="214" width="110" height="8" rx="4" fill="rgba(245,245,240,0.4)" /><rect x="410" y="232" width="150" height="6" rx="3" fill={ln} />
          {[0, 1, 2].map((i) => <rect key={i} x={56 + i * 120} y="310" width="104" height="60" rx="8" fill="#111318" stroke={ln} />)}
        </g>
      )}
    </svg>
  );
}
