import { ImageResponse } from "next/og";

export const alt = "Jordflix — Find something worth watching";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px", background: "#080909", color: "#f5f3ed", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: "linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
      <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: 30, fontWeight: 800, zIndex: 1 }}><div style={{ width: 52, height: 52, borderRadius: 999, background: "#ff4d30", color: "#080909", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 900 }}>J</div>Jordflix</div>
      <div style={{ display: "flex", flexDirection: "column", zIndex: 1 }}><div style={{ color: "#ff6b51", fontSize: 18, letterSpacing: 5, textTransform: "uppercase", fontWeight: 700, marginBottom: 24 }}>Movie & series discovery</div><div style={{ display: "flex", fontSize: 86, lineHeight: .95, letterSpacing: -5, maxWidth: 930, fontWeight: 600 }}>Find something worth watching.</div><div style={{ display: "flex", color: "#aaa79f", fontSize: 24, marginTop: 28 }}>Regional streaming availability · powered by TMDB</div></div>
      <div style={{ position: "absolute", width: 330, height: 330, borderRadius: 999, right: -80, top: -90, background: "#ff4d30", opacity: .12 }} />
    </div>,
    size,
  );
}
