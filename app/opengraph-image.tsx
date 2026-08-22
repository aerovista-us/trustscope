import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TrustScope — Does this look legit?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "58px 66px", background: "radial-gradient(circle at 85% 12%, #12483f 0%, #0b1b20 35%, #061014 76%)", color: "#eef7f5", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", width: 52, height: 52, border: "2px solid #2dd4bf", borderRadius: 16, alignItems: "center", justifyContent: "center", color: "#5eead4", fontSize: 24, fontWeight: 900 }}>TS</div>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 800, letterSpacing: ".12em", color: "#99f6e4" }}>AEROVISTA LOCAL</div>
        </div>
        <div style={{ display: "flex", fontSize: 18, color: "#86efac", border: "1px solid rgba(134,239,172,.35)", borderRadius: 999, padding: "10px 16px" }}>PRIVACY-FIRST CHECK</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 1040 }}>
        <div style={{ display: "flex", fontSize: 86, lineHeight: .95, fontWeight: 900, letterSpacing: "-.055em" }}>TrustScope</div>
        <div style={{ display: "flex", fontSize: 48, marginTop: 18, color: "#c7d8d5", fontWeight: 700 }}>Does this look legit?</div>
        <div style={{ display: "flex", fontSize: 25, marginTop: 26, color: "#8fb0ab" }}>Check the signals before you click, pay, sign in, or reply.</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,.16)", paddingTop: 24 }}>
        <div style={{ display: "flex", gap: 20, fontSize: 20, color: "#b6c9c6" }}><span>Urgency</span><span>•</span><span>Credentials</span><span>•</span><span>Payments</span><span>•</span><span>Links</span></div>
        <div style={{ display: "flex", fontSize: 17, color: "#72918c" }}>Made in Coeur d&apos;Alene · AeroVista</div>
      </div>
    </div>,
    size
  );
}
