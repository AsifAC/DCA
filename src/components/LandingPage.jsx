import { useVis } from "../hooks/useVis";

export function LandingPage({ onStart }) {
  const v = useVis();

  return (
    <div className={`page ${v ? "vis" : ""}`}>
      <div style={{ textAlign: "center", maxWidth: 580 }}>
        <div className="badge" style={{ marginBottom: 36 }}>
          Confidential Assessment
        </div>

        <h1
          className="df"
          style={{
            fontSize: "clamp(38px, 7vw, 72px)",
            fontWeight: 300,
            lineHeight: 1.12,
            marginBottom: 20,
          }}
        >
          Date Compatibility
          <br />
          <span className="shimmer-txt">Assessment</span>
        </h1>

        <p
          style={{
            color: "rgba(240,236,232,0.52)",
            fontSize: 16.5,
            lineHeight: 1.75,
            marginBottom: 52,
            fontWeight: 300,
          }}
        >
          Please complete the following assessment to determine
          <br />
          your eligibility for a very special opportunity.
        </p>

        <div className="float-anim">
          <button className="btn-rose" onClick={onStart} style={{ fontSize: 17, padding: "16px 52px" }}>
            Begin Assessment
          </button>
        </div>

        <p
          style={{
            marginTop: 28,
            fontSize: 11,
            color: "rgba(255,255,255,0.15)",
            letterSpacing: 1.8,
            textTransform: "uppercase",
          }}
        >
          Strictly Confidential - Authorized Nafisas Only
        </p>
      </div>
    </div>
  );
}
