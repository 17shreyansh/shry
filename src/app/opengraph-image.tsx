import { ImageResponse } from "next/og";

export const alt = "SHRY: we build the systems behind growing businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#08090B", color: "#F5F5F0", padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", fontSize: 40, fontWeight: 800, letterSpacing: -2 }}>
          SHRY<span style={{ width: 14, height: 14, borderRadius: 14, background: "#BFEA5A", marginLeft: 6, marginTop: 14 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 96, fontWeight: 800, lineHeight: 0.98, letterSpacing: -4 }}>
          <span>We build the</span>
          <span style={{ color: "#BFEA5A" }}>systems</span>
          <span>behind growing businesses.</span>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#A5A7AE" }}>Build · Connect · Operate</div>
      </div>
    ),
    size
  );
}
