import { useMemo, useState } from "react";
import { CelebrationCanvas } from "./CelebrationCanvas";
import { Confetti } from "./Confetti";
import { useVis } from "../hooks/useVis";
import {
  buildScheduleMessage,
  downloadCalendarFile,
  formatScheduleDate,
  formatScheduleTime,
  getCurrentSchedule,
  getMessageForSubmission,
  getParticipantName,
  saveCurrentSchedule,
  saveParticipantName,
  upsertSubmission,
} from "../data/scheduleStorage";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateInputValue(value) {
  if (!value) return new Date();
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getMonthStart(value) {
  const date = fromDateInputValue(value);
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isPastDate(value) {
  const date = fromDateInputValue(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function buildCalendarDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    cells.push({
      day,
      value: toDateInputValue(date),
      isPast: isPastDate(toDateInputValue(date)),
    });
  }

  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function buildDefaultPlan(request) {
  return `Dinner on ${formatScheduleDate(request.date)} at ${formatScheduleTime(request.time)}. Food idea: ${request.food}.`;
}

export function SuccessPage({ onRestart }) {
  const v = useVis();
  const savedSchedule = useMemo(() => {
    const currentSchedule = getCurrentSchedule();
    if (currentSchedule?.date && currentSchedule?.time && !currentSchedule.id) {
      const normalizedSchedule = { ...currentSchedule, id: `submission-${Date.now()}` };
      saveCurrentSchedule(normalizedSchedule);
      upsertSubmission(normalizedSchedule);
      return normalizedSchedule;
    }
    return currentSchedule;
  }, []);
  const initialMonth = savedSchedule?.date || toDateInputValue(new Date());
  const [selectedDate, setSelectedDate] = useState(savedSchedule?.date || "");
  const [calendarMonth, setCalendarMonth] = useState(() => getMonthStart(initialMonth));
  const [userName, setUserName] = useState(savedSchedule?.userName || getParticipantName());
  const [time, setTime] = useState(savedSchedule?.time || "");
  const [food, setFood] = useState(savedSchedule?.food || "");
  const [notes, setNotes] = useState(savedSchedule?.notes || "");
  const [planText, setPlanText] = useState(savedSchedule?.plan || "");
  const [messageText, setMessageText] = useState(savedSchedule?.message || (savedSchedule ? buildScheduleMessage(savedSchedule) : ""));
  const [messageEdited, setMessageEdited] = useState(Boolean(savedSchedule?.message));
  const [submittedRequest, setSubmittedRequest] = useState(savedSchedule?.date && savedSchedule?.time ? savedSchedule : null);
  const [copyStatus, setCopyStatus] = useState("");
  const [showManualCopy, setShowManualCopy] = useState(false);

  const calendarDays = useMemo(() => buildCalendarDays(calendarMonth), [calendarMonth]);
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(calendarMonth);
  const canSubmit = selectedDate && !isPastDate(selectedDate) && time && food.trim();
  const currentRequest = submittedRequest ? { ...submittedRequest, userName: userName.trim() || getParticipantName(), plan: planText.trim(), message: messageText.trim() } : null;
  const textMessage = currentRequest ? getMessageForSubmission(currentRequest) : "";

  const moveMonth = (amount) => {
    setCalendarMonth((date) => new Date(date.getFullYear(), date.getMonth() + amount, 1));
  };

  const chooseDate = (date) => {
    setSelectedDate(date.value);
    setCalendarMonth(getMonthStart(date.value));
    setCopyStatus("");
  };

  const updateUserName = (value) => {
    setUserName(value);
    const savedName = saveParticipantName(value).participantName;
    setCopyStatus("");

    if (!submittedRequest) return;
    const nextRequestBase = { ...submittedRequest, userName: savedName };
    const nextRequest = {
      ...nextRequestBase,
      message: messageEdited ? messageText.trim() : buildScheduleMessage({ ...nextRequestBase, plan: planText.trim() }),
    };
    setSubmittedRequest(nextRequest);
    if (!messageEdited) setMessageText(nextRequest.message);
    saveCurrentSchedule(nextRequest);
    upsertSubmission(nextRequest);
  };

  const submitRequest = () => {
    if (!canSubmit) return;

    const requestBase = {
      userName: userName.trim() || getParticipantName(),
      date: selectedDate,
      time,
      food: food.trim(),
      notes: notes.trim(),
      submittedAt: new Date().toISOString(),
    };
    const request = {
      ...requestBase,
      id: submittedRequest?.id || `submission-${Date.now()}`,
      plan: planText.trim() || buildDefaultPlan(requestBase),
    };
    request.message = messageEdited && messageText.trim() ? messageText.trim() : buildScheduleMessage(request);

    saveCurrentSchedule(request);
    upsertSubmission(request);
    setSubmittedRequest(request);
    setPlanText(request.plan);
    setMessageText(request.message);
    setCopyStatus("");
    setShowManualCopy(false);
  };

  const updatePlanText = (value) => {
    setPlanText(value);
    setCopyStatus("");

    if (!submittedRequest) return;
    const requestBase = { ...submittedRequest, userName: userName.trim() || getParticipantName(), plan: value.trim() };
    const nextRequest = {
      ...requestBase,
      message: messageEdited ? messageText.trim() : buildScheduleMessage(requestBase),
    };
    setSubmittedRequest(nextRequest);
    if (!messageEdited) setMessageText(nextRequest.message);
    saveCurrentSchedule(nextRequest);
    upsertSubmission(nextRequest);
  };

  const updateMessageText = (value) => {
    setMessageText(value);
    setMessageEdited(true);
    setCopyStatus("");

    if (!submittedRequest) return;
    const nextRequest = { ...submittedRequest, userName: userName.trim() || getParticipantName(), plan: planText.trim(), message: value.trim() };
    setSubmittedRequest(nextRequest);
    saveCurrentSchedule(nextRequest);
    upsertSubmission(nextRequest);
  };

  const copyMessage = async () => {
    if (!textMessage) return;

    try {
      await navigator.clipboard.writeText(textMessage);
      setCopyStatus("Copied. Paste it in our DMs (^_~)");
      setShowManualCopy(false);
    } catch {
      setCopyStatus("Copy this message manually.");
      setShowManualCopy(true);
    }
  };

  const shareMessage = async () => {
    if (!currentRequest) return;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Date Plan", text: textMessage });
        setCopyStatus("Shared.");
        return;
      } catch {
        // Fall back to copy if sharing is cancelled or unavailable at runtime.
      }
    }

    await copyMessage();
  };

  const exportCalendar = () => {
    if (!currentRequest) return;
    downloadCalendarFile(currentRequest);
    setCopyStatus("Calendar file downloaded.");
  };

  return (
    <>
      <Confetti on />
      <CelebrationCanvas />
      <div className={`page ${v ? "vis" : ""}`}>
        <div style={{ width: "100%", maxWidth: 560 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div
              className="df shimmer-txt"
              style={{ fontSize: "clamp(38px, 7vw, 68px)", fontWeight: 300, lineHeight: 1.12, marginBottom: 16 }}
            >
              Application
              <br />
              Approved
            </div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.65 }}>
              Congratulations, {userName || "Nafisa"}. You have officially accepted one date.
            </p>
          </div>

          <div className="glass" style={{ padding: "32px 28px" }}>
            <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(224,154,170,0.55)", marginBottom: 24 }}>
              Date Scheduling
            </p>

            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>Participant name:</p>
              <input
                className="txt-inp"
                value={userName}
                onChange={(e) => updateUserName(e.target.value)}
                placeholder="Who is answering?"
                autoComplete="off"
              />
            </div>

            <div style={{ marginBottom: 22 }}>
              <div className="calendar-head">
                <button className="cal-nav" onClick={() => moveMonth(-1)} aria-label="Previous month">
                  &lt;
                </button>
                <p className="cal-title">{monthLabel}</p>
                <button className="cal-nav" onClick={() => moveMonth(1)} aria-label="Next month">
                  &gt;
                </button>
              </div>

              <div className="calendar-grid">
                {weekDays.map((day) => (
                  <span key={day} className="cal-weekday">
                    {day}
                  </span>
                ))}
                {calendarDays.map((date, i) =>
                  date ? (
                    <button
                      key={date.value}
                      className={`cal-day${selectedDate === date.value ? " sel" : ""}`}
                      disabled={date.isPast}
                      onClick={() => chooseDate(date)}
                    >
                      {date.day}
                    </button>
                  ) : (
                    <span key={`blank-${i}`} className="cal-blank" />
                  ),
                )}
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>What time works best?</p>
              <input className="txt-inp time-inp" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>

            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>Favorite food:</p>
              <input
                className="txt-inp"
                value={food}
                onChange={(e) => setFood(e.target.value)}
                placeholder="What would you like to eat?"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>

            <div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>Optional notes:</p>
              <textarea
                className="txt-inp"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything else I should know?"
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>

            <button className="btn-rose" onClick={submitRequest} disabled={!canSubmit} style={{ width: "100%", marginTop: 24 }}>
              {submittedRequest ? "Update Date Request" : "Submit Date Request"}
            </button>

            {!canSubmit && (
              <p style={{ marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.28)", textAlign: "center" }}>
                Choose a date, time, and food idea to submit.
              </p>
            )}

            {submittedRequest && (
              <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "rgba(142,224,164,0.7)",
                    marginBottom: 12,
                  }}
                >
                  Request Submitted
                </p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 12 }}>
                  Edit the plan if you want, then copy the iOS-friendly message into Messages.
                </p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>Date plan:</p>
                <textarea
                  className="txt-inp"
                  value={planText}
                  onChange={(e) => updatePlanText(e.target.value)}
                  placeholder="Type or edit the date plan..."
                  rows={4}
                  style={{ resize: "vertical", marginBottom: 10 }}
                />
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", lineHeight: 1.5, marginBottom: 14 }}>
                  Your edits are saved automatically and included in the copied message.
                </p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>Text message:</p>
                <textarea
                  className="txt-inp"
                  value={messageText}
                  onChange={(e) => updateMessageText(e.target.value)}
                  rows={8}
                  style={{ resize: "vertical", marginBottom: 14 }}
                  onFocus={(e) => e.target.select()}
                />
                <button className="btn-rose" onClick={copyMessage} style={{ width: "100%" }}>
                  Copy Message
                </button>
                <button className="btn-soft" onClick={shareMessage} style={{ width: "100%", marginTop: 10 }}>
                  Share Message
                </button>
                <button className="btn-soft" onClick={exportCalendar} style={{ width: "100%", marginTop: 10 }}>
                  Add to Calendar
                </button>
                <button className="btn-soft" onClick={onRestart} style={{ width: "100%", marginTop: 10 }}>
                  Restart Assessment
                </button>
                {copyStatus && (
                  <p
                    style={{
                      marginTop: 12,
                      fontSize: 12,
                      color: showManualCopy ? "rgba(255,255,255,0.45)" : "#8ee0a4",
                      textAlign: "center",
                    }}
                  >
                    {copyStatus}
                  </p>
                )}
              </div>
            )}
          </div>

          <p
            className="df"
            style={{
              textAlign: "center",
              marginTop: 36,
              color: "rgba(255,255,255,0.42)",
              fontSize: 18,
              lineHeight: 1.75,
              fontStyle: "italic",
            }}
          >
            "Thank you for participating in the assessment.
            <br />
            I can't wait to see you and treat you."
          </p>
        </div>
      </div>
    </>
  );
}
