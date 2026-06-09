import { useMemo } from "react";

const COLORS = ["#e09aaa", "#d4a055", "#9ecfeb", "#a4e0b4", "#d0a0e8", "#f5d8a0", "#e8a0b4"];

export function Confetti({ on }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 110 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 4.5,
        dur: 2.8 + Math.random() * 3.2,
        color: COLORS[i % COLORS.length],
        sz: 5 + Math.random() * 9,
        circle: Math.random() > 0.45,
      })),
    [],
  );

  if (!on) return null;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 998 }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: -25,
            width: p.sz,
            height: p.sz,
            background: p.color,
            borderRadius: p.circle ? "50%" : "2px",
            animation: `confettiFall ${p.dur}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}
