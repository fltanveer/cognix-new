import { ImageResponse } from "next/og";

export const alt = "Cognixlab: we modernize operations with structured AI and connected systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded 1200×630 share card. Lanes motif echoes the hero signal field.
export default async function OG() {
  const lanes = Array.from({ length: 11 }, (_, i) => i);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#10120d", color: "#eef1e8", padding: 72, position: "relative" }}>
        {lanes.map((i) => (
          <div key={i} style={{ position: "absolute", left: 520, right: 0, top: 48 + i * 22, height: 1, background: i === 7 ? "#c9f31d" : "rgba(238,241,232,0.14)" }} />
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#c9f31d" }} />
          Cognixlab
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: -3, maxWidth: 820 }}>Your team shouldn’t be the integration layer.</div>
          <div style={{ marginTop: 28, fontSize: 28, color: "rgba(238,241,232,0.66)" }}>AI & workflow automation · Cambridge, MA · Boston & New York</div>
        </div>
      </div>
    ),
    size
  );
}
