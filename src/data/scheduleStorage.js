export const scheduleKey = "dca.schedule";
export const submissionsKey = "dca.submissions";
export const settingsKey = "dca.settings";

const defaultSettings = {
  participantName: "Nafisa",
  favoriteSubmissionId: "",
};

export function readJson(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local interactions still work if storage is unavailable.
  }
}

export function getSettings() {
  return { ...defaultSettings, ...readJson(settingsKey, {}) };
}

export function saveSettings(nextSettings) {
  const settings = { ...getSettings(), ...nextSettings };
  writeJson(settingsKey, settings);
  return settings;
}

export function getParticipantName() {
  return getSettings().participantName || defaultSettings.participantName;
}

export function saveParticipantName(participantName) {
  return saveSettings({ participantName: participantName.trim() || defaultSettings.participantName });
}

export function getFavoriteSubmissionId() {
  return getSettings().favoriteSubmissionId || "";
}

export function setFavoriteSubmissionId(id) {
  return saveSettings({ favoriteSubmissionId: id });
}

export function getCurrentSchedule() {
  return readJson(scheduleKey, null);
}

export function saveCurrentSchedule(request) {
  writeJson(scheduleKey, request);
}

export function clearCurrentSchedule() {
  try {
    localStorage.removeItem(scheduleKey);
  } catch {
    // Ignore unavailable storage.
  }
}

export function getSubmissions() {
  const submissions = readJson(submissionsKey, []);
  return Array.isArray(submissions) ? submissions : [];
}

export function upsertSubmission(request) {
  const submission = {
    ...request,
    id: request.id || `submission-${Date.now()}`,
    userName: request.userName || getParticipantName(),
  };
  const submissions = getSubmissions();
  const existingIndex = submissions.findIndex((item) => item.id === submission.id);
  const nextSubmissions =
    existingIndex >= 0
      ? submissions.map((item, index) => (index === existingIndex ? submission : item))
      : [submission, ...submissions];

  writeJson(submissionsKey, nextSubmissions);
  return nextSubmissions;
}

export function deleteSubmission(id) {
  const nextSubmissions = getSubmissions().filter((submission) => submission.id !== id);
  const current = getCurrentSchedule();
  const settings = getSettings();

  writeJson(submissionsKey, nextSubmissions);
  if (current?.id === id) clearCurrentSchedule();
  if (settings.favoriteSubmissionId === id) saveSettings({ favoriteSubmissionId: "" });
  return nextSubmissions;
}

function parseScheduleDate(value) {
  if (!value) return new Date();
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatScheduleDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parseScheduleDate(value));
}

export function formatScheduleTime(value) {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2026, 0, 1, hours, minutes));
}

export function buildScheduleMessage(request) {
  const name = request.userName || getParticipantName();

  return [
    "Date request approved :)",
    "",
    `${name}'s date plan`,
    `Date: ${formatScheduleDate(request.date)}`,
    `Time: ${formatScheduleTime(request.time)}`,
    `Food idea: ${request.food}`,
    `Plan: ${request.plan || "We can finalize the details together."}`,
    `Notes: ${request.notes || "None"}`,
    "",
    "Looks like we officially have a plan.",
  ].join("\n");
}

export function getMessageForSubmission(request) {
  return request.message?.trim() || buildScheduleMessage(request);
}

function toIcsDateTime(dateValue, timeValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hours, minutes] = timeValue.split(":").map(Number);
  return `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}T${String(hours).padStart(2, "0")}${String(minutes).padStart(2, "0")}00`;
}

function escapeIcsText(value) {
  return String(value || "")
    .replaceAll("\\", "\\\\")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;")
    .replaceAll("\n", "\\n");
}

export function buildCalendarFile(request) {
  const start = toIcsDateTime(request.date, request.time);
  const [hours, minutes] = request.time.split(":").map(Number);
  const endDate = new Date(2026, 0, 1, hours + 2, minutes);
  const end = `${request.date.replaceAll("-", "")}T${String(endDate.getHours()).padStart(2, "0")}${String(endDate.getMinutes()).padStart(2, "0")}00`;
  const summary = `Date with ${request.userName || getParticipantName()}`;
  const description = getMessageForSubmission(request);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DCA//Date Compatibility Assessment//EN",
    "BEGIN:VEVENT",
    `UID:${request.id || Date.now()}@dca.local`,
    `DTSTAMP:${new Date().toISOString().replaceAll("-", "").replaceAll(":", "").split(".")[0]}Z`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadCalendarFile(request) {
  const blob = new Blob([buildCalendarFile(request)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "dca-date-plan.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
