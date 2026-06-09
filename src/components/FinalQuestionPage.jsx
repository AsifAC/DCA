import { useState } from "react";
import { useVis } from "../hooks/useVis";

export function FinalQuestionPage({ onYes }) {
  const v = useVis();
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState(0);

  const dodge = () => {
    setAttempts((a) => a + 1);
    const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    const rangeX = Math.min(110, vw * 0.28);
    const rangeY = Math.min(90, window.innerHeight * 0.15);
    const rX = (Math.random() - 0.5) * rangeX * 2;
    const rY = (Math.random() - 0.5) * rangeY * 2;
    setNoPos({ x: rX, y: rY });
  };

  return (
    <div className={`page ${v ? "vis" : ""}`}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <div className="badge" style={{ marginBottom: 28 }}>
          Final Question
        </div>

        <h1
          className="df float-anim"
          style={{ fontSize: "clamp(36px, 7vw, 66px)", fontWeight: 300, lineHeight: 1.18, marginBottom: 14 }}
        >
          Will you accept
          <br />
          this date?
        </h1>

        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13.5, marginBottom: 52 }}>Please select one of the options below</p>

        <div style={{ display: "flex", gap: 20, justifyContent: "center", alignItems: "center", flexWrap: "nowrap", marginBottom: 8 }}>
          <button className="btn-rose" onClick={onYes} style={{ fontSize: 18, padding: "15px 52px" }}>
            Yes
          </button>

          <button
            onMouseEnter={dodge}
            onTouchStart={(e) => {
              e.preventDefault();
              dodge();
            }}
            className="no-btn"
            style={{
              background: "transparent",
              border: "1px solid rgba(192,118,127,0.28)",
              color: "rgba(255,255,255,0.45)",
              padding: "13px 30px",
              borderRadius: 50,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15.5,
              cursor: "default",
              userSelect: "none",
              whiteSpace: "nowrap",
              display: "inline-block",
              transform: `translate(${noPos.x}px, ${noPos.y}px)`,
              transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            No
          </button>
        </div>

        {attempts > 0 && (
          <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.28)", fontStyle: "italic" }}>
            {attempts === 1
              ? "Hmm, that button seems to disagree with you."
              : attempts === 2
                ? "It really doesn't want to be clicked..."
                : attempts < 5
                  ? "The algorithm has spoken."
                  : "Just click Yes. You know you want to."}
          </p>
        )}
      </div>
    </div>
  );
}
