import { useEffect, useMemo, useState } from "react";
import { getAssessmentResults } from "../data/assessmentData";
import { readJson } from "../data/scheduleStorage";
import { useVis } from "../hooks/useVis";

export function ResultsPage({ onContinue }) {
  const v = useVis();
  const [bars, setBars] = useState(false);
  const results = useMemo(() => getAssessmentResults(readJson("dca.quizAnswers", [])), []);

  useEffect(() => {
    const t = setTimeout(() => setBars(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`page ${v ? "vis" : ""}`}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div className="badge" style={{ marginBottom: 18 }}>
            Assessment Complete
          </div>
          <h1 className="df" style={{ fontSize: "clamp(28px, 5vw, 50px)", fontWeight: 300 }}>
            Compatibility Report
          </h1>
        </div>

        <div className="glass" style={{ padding: "28px 24px", textAlign: "center", marginBottom: 18 }}>
          <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>
            Personalized Score
          </p>
          <div className="df shimmer-txt" style={{ fontSize: 76, fontWeight: 300, lineHeight: 1 }}>
            {results.overall}%
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", marginTop: 8 }}>Exceptional Match Detected</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {results.metrics.map((m, i) => (
            <div key={m.label} className="glass" style={{ padding: "13px 17px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.68)" }}>{m.label}</span>
                <span style={{ fontSize: 13.5, fontWeight: 500, color: "#e09aaa" }}>{m.score}%</span>
              </div>
              <div className="met-track">
                <div className="met-fill" style={{ width: bars ? `${m.score}%` : "0%", transitionDelay: `${i * 0.14}s` }} />
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7, marginBottom: 30 }}>
          {results.summary}
        </p>

        <div style={{ textAlign: "center" }}>
          <button className="btn-rose" onClick={onContinue}>
            View Opportunity
          </button>
        </div>
      </div>
    </div>
  );
}
