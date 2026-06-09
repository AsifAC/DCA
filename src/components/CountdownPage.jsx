import { useEffect, useMemo, useState } from "react";
import {
  formatScheduleDate,
  formatScheduleTime,
  getFavoriteSubmissionId,
  getSubmissions,
} from "../data/scheduleStorage";
import { useVis } from "../hooks/useVis";

function getOfficialSubmission() {
  const favoriteId = getFavoriteSubmissionId();
  const submissions = getSubmissions();

  if (favoriteId) {
    return submissions.find((submission) => submission.id === favoriteId) || null;
  }

  return null;
}

function getTargetDate(submission) {
  if (!submission?.date || !submission?.time) return null;
  const [year, month, day] = submission.date.split("-").map(Number);
  const [hours, minutes] = submission.time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

function getCountdownParts(targetDate, now) {
  const diff = Math.max(0, targetDate.getTime() - now.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, complete: diff === 0 };
}

function pad(value) {
  return String(value).padStart(2, "0");
}

export function CountdownPage({ onSubmissions, onRestart }) {
  const v = useVis();
  const officialSubmission = useMemo(getOfficialSubmission, []);
  const targetDate = useMemo(() => getTargetDate(officialSubmission), [officialSubmission]);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!officialSubmission || !targetDate) {
    return (
      <div className={`page ${v ? "vis" : ""}`}>
        <div style={{ width: "100%", maxWidth: 520, textAlign: "center" }}>
          <div className="badge" style={{ marginBottom: 18 }}>
            Countdown
          </div>
          <h1 className="df" style={{ fontSize: "clamp(32px, 6vw, 58px)", fontWeight: 300, lineHeight: 1.12, marginBottom: 18 }}>
            No Official Plan Yet
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 28 }}>
            Mark one previous submission as the official plan to start the countdown.
          </p>
          <button className="btn-rose" onClick={onSubmissions}>
            View Previous Submissions
          </button>
        </div>
      </div>
    );
  }

  const countdown = getCountdownParts(targetDate, now);
  const tiles = [
    ["Days", countdown.days],
    ["Hours", pad(countdown.hours)],
    ["Minutes", pad(countdown.minutes)],
    ["Seconds", pad(countdown.seconds)],
  ];

  return (
    <div className={`page ${v ? "vis" : ""}`}>
      <div style={{ width: "100%", maxWidth: 700 }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div className="badge" style={{ marginBottom: 18 }}>
            Official Plan
          </div>
          <h1 className="df shimmer-txt" style={{ fontSize: "clamp(38px, 7vw, 72px)", fontWeight: 300, lineHeight: 1.08, marginBottom: 14 }}>
            Date Countdown
          </h1>
          <p style={{ color: "rgba(255,255,255,0.52)", fontSize: 15, lineHeight: 1.7 }}>
            {formatScheduleDate(officialSubmission.date)} at {formatScheduleTime(officialSubmission.time)}
          </p>
        </div>

        <div className="countdown-grid">
          {tiles.map(([label, value]) => (
            <div key={label} className="glass countdown-tile">
              <div className="df countdown-value">{value}</div>
              <div className="countdown-label">{label}</div>
            </div>
          ))}
        </div>

        <div className="glass countdown-plan">
          <p className="submission-kicker">{countdown.complete ? "It Is Time" : "Plan Details"}</p>
          <h2 className="df countdown-plan-title">
            {officialSubmission.userName || "Nafisa"}'s official date plan
          </h2>
          <div className="submission-meta">
            <span>Food: {officialSubmission.food}</span>
            <span>Notes: {officialSubmission.notes || "None"}</span>
          </div>
          <p style={{ color: "rgba(240,236,232,0.78)", fontSize: 14, lineHeight: 1.7 }}>
            {officialSubmission.plan || "The plan is still open for edits."}
          </p>
        </div>

        <div className="countdown-actions">
          <button className="btn-rose" onClick={onSubmissions}>
            Edit Official Plan
          </button>
          <button className="btn-soft" onClick={onRestart}>
            Restart Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
