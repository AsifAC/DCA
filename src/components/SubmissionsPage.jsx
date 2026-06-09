import { useMemo, useState } from "react";
import {
  buildScheduleMessage,
  deleteSubmission,
  downloadCalendarFile,
  formatScheduleDate,
  formatScheduleTime,
  getCurrentSchedule,
  getFavoriteSubmissionId,
  getMessageForSubmission,
  getParticipantName,
  getSubmissions,
  saveCurrentSchedule,
  setFavoriteSubmissionId,
  upsertSubmission,
} from "../data/scheduleStorage";
import { useVis } from "../hooks/useVis";

function normalizeSubmissions() {
  const submissions = getSubmissions();
  const current = getCurrentSchedule();

  if (current?.date && current?.time && !submissions.some((submission) => submission.id === current.id)) {
    const normalizedCurrent = current.id ? current : { ...current, id: `submission-${Date.now()}` };
    upsertSubmission(normalizedCurrent);
    saveCurrentSchedule(normalizedCurrent);
    return [normalizedCurrent, ...submissions];
  }

  return submissions;
}

export function SubmissionsPage({ onBack }) {
  const v = useVis();
  const [copyId, setCopyId] = useState("");
  const [favoriteId, setFavoriteId] = useState(getFavoriteSubmissionId());
  const [submissions, setSubmissions] = useState(() => normalizeSubmissions());
  const sortedSubmissions = useMemo(
    () =>
      [...submissions].sort((a, b) => {
        if (a.id === favoriteId) return -1;
        if (b.id === favoriteId) return 1;
        const bTime = new Date(b.submittedAt || 0).getTime();
        const aTime = new Date(a.submittedAt || 0).getTime();
        return bTime - aTime;
      }),
    [favoriteId, submissions],
  );

  const persistSubmission = (submission) => {
    const current = getCurrentSchedule();
    upsertSubmission(submission);
    if (current?.id === submission.id) {
      saveCurrentSchedule(submission);
    }
    setSubmissions((items) => items.map((item) => (item.id === submission.id ? submission : item)));
  };

  const updateSubmission = (submission, patch) => {
    const nextBase = { ...submission, ...patch };
    const nextSubmission = Object.prototype.hasOwnProperty.call(patch, "message")
      ? nextBase
      : {
          ...nextBase,
          message: submission.message ? submission.message : buildScheduleMessage(nextBase),
        };

    persistSubmission(nextSubmission);
    setCopyId("");
  };

  const copySubmission = async (submission) => {
    const message = getMessageForSubmission(submission);

    try {
      await navigator.clipboard.writeText(message);
      setCopyId(submission.id);
    } catch {
      setCopyId(`manual-${submission.id}`);
    }
  };

  const shareSubmission = async (submission) => {
    const message = getMessageForSubmission(submission);

    if (navigator.share) {
      try {
        await navigator.share({ title: "Date Plan", text: message });
        setCopyId(`shared-${submission.id}`);
        return;
      } catch {
        // Fall through to copy.
      }
    }

    await copySubmission(submission);
  };

  const favoriteSubmission = (submission) => {
    const nextFavoriteId = favoriteId === submission.id ? "" : submission.id;
    setFavoriteSubmissionId(nextFavoriteId);
    setFavoriteId(nextFavoriteId);
  };

  const removeSubmission = (submission) => {
    if (!window.confirm("Delete this saved submission?")) return;
    const nextSubmissions = deleteSubmission(submission.id);
    setSubmissions(nextSubmissions);
    if (favoriteId === submission.id) setFavoriteId("");
  };

  return (
    <div className={`page ${v ? "vis" : ""}`}>
      <div style={{ width: "100%", maxWidth: 720 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div className="badge" style={{ marginBottom: 18 }}>
            Saved Plans
          </div>
          <h1 className="df" style={{ fontSize: "clamp(30px, 6vw, 54px)", fontWeight: 300, lineHeight: 1.12 }}>
            Previous Submissions
          </h1>
        </div>

        {sortedSubmissions.length === 0 ? (
          <div className="glass" style={{ padding: "30px 26px", textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 20 }}>
              No date requests have been submitted yet.
            </p>
            <button className="btn-rose" onClick={onBack}>
              Return to Assessment
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {sortedSubmissions.map((submission, index) => {
              const status =
                copyId === submission.id
                  ? "Copied. Paste it in our DMs (^_~)"
                  : copyId === `manual-${submission.id}`
                    ? "Copy manually from the message below."
                    : copyId === `shared-${submission.id}`
                      ? "Shared."
                      : "";
              const message = getMessageForSubmission(submission);
              const isFavorite = favoriteId === submission.id;

              return (
                <div key={submission.id || `${submission.date}-${submission.time}-${index}`} className="glass submission-card">
                  <div className="submission-head">
                    <div>
                      <p className="submission-kicker">{isFavorite ? "Official Plan" : `Submission ${sortedSubmissions.length - index}`}</p>
                      <h2 className="df submission-title">{formatScheduleDate(submission.date)}</h2>
                    </div>
                    <div className="submission-time">{formatScheduleTime(submission.time)}</div>
                  </div>

                  <div className="submission-edit-grid">
                    <label>
                      <span>Participant</span>
                      <input
                        className="txt-inp"
                        value={submission.userName || getParticipantName()}
                        onChange={(e) => updateSubmission(submission, { userName: e.target.value })}
                      />
                    </label>
                    <label>
                      <span>Date</span>
                      <input className="txt-inp time-inp" type="date" value={submission.date || ""} onChange={(e) => updateSubmission(submission, { date: e.target.value })} />
                    </label>
                    <label>
                      <span>Time</span>
                      <input className="txt-inp time-inp" type="time" value={submission.time || ""} onChange={(e) => updateSubmission(submission, { time: e.target.value })} />
                    </label>
                    <label>
                      <span>Food</span>
                      <input className="txt-inp" value={submission.food || ""} onChange={(e) => updateSubmission(submission, { food: e.target.value })} />
                    </label>
                  </div>

                  <label className="submission-field">
                    <span>Notes</span>
                    <textarea
                      className="txt-inp"
                      value={submission.notes || ""}
                      onChange={(e) => updateSubmission(submission, { notes: e.target.value })}
                      rows={2}
                      style={{ resize: "vertical" }}
                    />
                  </label>

                  <label className="submission-field">
                    <span>Plan</span>
                    <textarea
                      className="txt-inp"
                      value={submission.plan || ""}
                      onChange={(e) => updateSubmission(submission, { plan: e.target.value })}
                      rows={3}
                      style={{ resize: "vertical" }}
                    />
                  </label>

                  <label className="submission-field">
                    <span>Text message</span>
                    <textarea
                      className="txt-inp"
                      value={message}
                      onChange={(e) => updateSubmission(submission, { message: e.target.value })}
                      rows={7}
                      style={{ resize: "vertical" }}
                    />
                  </label>

                  <div className="submission-actions">
                    <button className="btn-rose" onClick={() => copySubmission(submission)}>
                      Copy
                    </button>
                    <button className="btn-soft" onClick={() => shareSubmission(submission)}>
                      Share
                    </button>
                    <button className="btn-soft" onClick={() => downloadCalendarFile(submission)}>
                      Calendar
                    </button>
                    <button className="btn-soft" onClick={() => favoriteSubmission(submission)}>
                      {isFavorite ? "Unmark Official" : "Mark Official"}
                    </button>
                    <button className="btn-danger" onClick={() => removeSubmission(submission)}>
                      Delete
                    </button>
                  </div>

                  {status && (
                    <p style={{ marginTop: 10, fontSize: 12, color: status.startsWith("Copied") || status === "Shared." ? "#8ee0a4" : "rgba(255,255,255,0.45)", textAlign: "center" }}>
                      {status}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
