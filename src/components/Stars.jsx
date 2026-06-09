import { useMemo } from "react";

export function Stars() {
  const s = useMemo(
    () =>
      Array.from({ length: 55 }, (_, i) => ({
        id: i,
        l: Math.random() * 100,
        t: Math.random() * 100,
        sz: 1 + Math.random() * 1.8,
        op: 0.08 + Math.random() * 0.35,
        del: Math.random() * 5,
      })),
    [],
  );

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {s.map((x) => (
        <div
          key={x.id}
          style={{
            position: "absolute",
            left: `${x.l}%`,
            top: `${x.t}%`,
            width: x.sz,
            height: x.sz,
            borderRadius: "50%",
            background: "#fff",
            opacity: x.op,
            animation: `pulse ${2.5 + x.del}s ease-in-out infinite`,
            animationDelay: `${x.del}s`,
          }}
        />
      ))}
    </div>
  );
}
