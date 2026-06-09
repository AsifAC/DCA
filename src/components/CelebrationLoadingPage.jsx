import { useEffect } from "react";
import celebrationGif from "../assets/celebration-transparent.gif";
import { useVis } from "../hooks/useVis";

export function CelebrationLoadingPage({ onComplete }) {
  const v = useVis();

  useEffect(() => {
    const done = setTimeout(onComplete, 5000);
    return () => clearTimeout(done);
  }, [onComplete]);

  return (
    <div className={`page ${v ? "vis" : ""}`}>
      <div className="celebration-loader">
        <div className="badge" style={{ marginBottom: 22 }}>
          Accepted
        </div>
        <img className="celebration-gif" src={celebrationGif} alt="Celebration" />
        <h1 className="df shimmer-txt celebration-title">Preparing Your Date Request</h1>
        <p className="celebration-copy">One moment while the official scheduling portal opens.</p>
        <div className="celebration-progress">
          <div className="celebration-progress-fill" />
        </div>
      </div>
    </div>
  );
}
