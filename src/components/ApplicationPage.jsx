import { useVis } from "../hooks/useVis";
import { getParticipantName } from "../data/scheduleStorage";

const requirements = [
  "Great personality",
  "Passed compatibility assessment",
  "Approved by algorithm",
  "Excellent conversation potential",
];

export function ApplicationPage({ onContinue }) {
  const v = useVis();
  const participantName = getParticipantName();

  return (
    <div className={`page ${v ? "vis" : ""}`}>
      <div style={{ width: "100%", maxWidth: 490 }}>
        <div className="glass" style={{ padding: "38px 30px" }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <p
              style={{
                fontSize: 10,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(224,154,170,0.55)",
                marginBottom: 16,
              }}
            >
              Official Document
            </p>
            <h1 className="df" style={{ fontSize: "clamp(22px, 4.5vw, 34px)", fontWeight: 400, lineHeight: 1.28 }}>
              Application for
              <br />
              Official Date Status
            </h1>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              padding: "22px 0",
              marginBottom: 22,
            }}
          >
            {[
              ["Applicant Name", participantName],
              ["Position", "Official Date"],
              ["Status", "Pre-Approved"],
            ].map(([label, val], i) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: i < 2 ? 12 : 0,
                }}
              >
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: i === 1 ? "#e09aaa" : i === 2 ? "#8ee0a4" : "#f0ece8" }}>
                  {val}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 14 }}>
              Requirements Checklist
            </p>
            {requirements.map((r) => (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
                <span style={{ color: "#8ee0a4", fontSize: 15, flexShrink: 0 }}>OK</span>
                <span style={{ fontSize: 14, color: "rgba(240,236,232,0.78)" }}>{r}</span>
              </div>
            ))}
          </div>

          <button className="btn-rose" onClick={onContinue} style={{ width: "100%" }}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
