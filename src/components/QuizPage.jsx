import { useState } from "react";
import { questions } from "../data/assessmentData";
import { useVis } from "../hooks/useVis";

export function QuizPage({ onComplete }) {
  const v = useVis();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [busy, setBusy] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const [cardVis, setCardVis] = useState(true);

  const pick = (opt) => {
    if (busy) return;
    setBusy(true);
    setCardVis(false);
    const next = [...answers, opt];

    setTimeout(() => {
      if (idx + 1 >= questions.length) {
        onComplete(next);
        return;
      }

      setAnswers(next);
      setIdx((i) => i + 1);
      setCardKey((k) => k + 1);
      setCardVis(true);
      setBusy(false);
    }, 280);
  };

  const q = questions[idx];
  const pct = (idx / questions.length) * 100;

  return (
    <div className={`page ${v ? "vis" : ""}`}>
      <div style={{ width: "100%", maxWidth: 510 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.32)",
            }}
          >
            Assessment
          </span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.32)" }}>
            {idx + 1} / {questions.length}
          </span>
        </div>
        <div className="prog-track" style={{ marginBottom: 38 }}>
          <div className="prog-fill" style={{ width: `${pct}%` }} />
        </div>

        <div
          key={cardKey}
          style={{
            opacity: cardVis ? 1 : 0,
            transform: cardVis ? "translateY(0)" : "translateY(-10px)",
            transition: "opacity 0.28s ease, transform 0.28s ease",
          }}
        >
          <div className="glass" style={{ padding: "30px 26px", marginBottom: 16 }}>
            <p
              style={{
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "rgba(224,154,170,0.65)",
                marginBottom: 14,
              }}
            >
              Question {idx + 1}
            </p>
            <h2 className="df" style={{ fontSize: "clamp(21px, 4vw, 29px)", fontWeight: 400, lineHeight: 1.32 }}>
              {q.q}
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {q.opts.map((opt, i) => (
              <button key={opt} className="ans-card" onClick={() => pick(opt)}>
                <span style={{ color: "rgba(192,118,127,0.65)", fontSize: 11.5, fontWeight: 500, flexShrink: 0 }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
