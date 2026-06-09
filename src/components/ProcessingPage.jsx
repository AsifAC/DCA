import { useEffect, useState } from "react";
import { processingMessages } from "../data/assessmentData";
import { useVis } from "../hooks/useVis";

export function ProcessingPage({ onComplete }) {
  const v = useVis();
  const [msgIdx, setMsgIdx] = useState(0);
  const [prog, setProg] = useState(0);

  useEffect(() => {
    const mi = setInterval(() => setMsgIdx((i) => Math.min(i + 1, processingMessages.length - 1)), 880);
    const pi = setInterval(() => {
      setProg((p) => {
        if (p >= 100) {
          clearInterval(pi);
          return 100;
        }
        return p + 2;
      });
    }, 85);
    const done = setTimeout(onComplete, 5000);

    return () => {
      clearInterval(mi);
      clearInterval(pi);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <div className={`page ${v ? "vis" : ""}`}>
      <div style={{ textAlign: "center", maxWidth: 380 }}>
        <div style={{ position: "relative", width: 84, height: 84, margin: "0 auto 36px" }}>
          {[0, 10, 20, 30].map((inset, i) => (
            <div
              key={inset}
              style={{
                position: "absolute",
                inset,
                borderRadius: "50%",
                border: `1.5px solid rgba(192,118,127,${0.2 + i * 0.2})`,
                animation: "pulse 1.6s ease-in-out infinite",
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              inset: 32,
              borderRadius: "50%",
              background: "rgba(192,118,127,0.5)",
              animation: "pulse 1.6s ease-in-out infinite",
              animationDelay: "0.9s",
            }}
          />
        </div>

        <h2 className="df" style={{ fontSize: 30, fontWeight: 400, marginBottom: 16 }}>
          Processing Results
        </h2>
        <p style={{ color: "#e09aaa", fontSize: 15, marginBottom: 44, minHeight: 22, animation: "pulse 1.8s ease-in-out infinite" }}>
          {processingMessages[msgIdx]}
        </p>

        <div className="prog-track" style={{ maxWidth: 320, margin: "0 auto 10px" }}>
          <div className="prog-fill" style={{ width: `${prog}%`, transition: "width 0.1s linear" }} />
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)" }}>{Math.round(prog)}% Complete</p>
      </div>
    </div>
  );
}
