# DCA

Date Compatibility Assessment is a React/Vite app that turns a playful compatibility quiz into a personalized date-planning flow.

## Features

- Interactive compatibility quiz with personalized scoring.
- Simulated processing and compatibility report screens.
- Final date acceptance prompt with a playful moving "No" button.
- Five-second celebration loading screen after accepting the date.
- Date request form with calendar, time, food, notes, editable plan, and editable text message.
- Copy/share-friendly iOS text message generation.
- Local submission history with full editing, delete, official-plan selection, and calendar export.
- Countdown page for the official date plan.

All state is stored locally in the browser with `localStorage`.

## Requirements

- Node.js
- npm

On Windows PowerShell, use `npm.cmd` if `npm` is blocked by the script execution policy.

## Run Locally

```powershell
npm.cmd install
npm.cmd run dev
```

Then open:

```text
http://127.0.0.1:5173
```

## Build

```powershell
npm.cmd run build
```

## Preview Production Build

```powershell
npm.cmd run preview
```

## Project Structure

```text
src/
  App.jsx
  main.jsx
  assets/
  components/
  data/
  hooks/
  styles/
```

- `src/App.jsx` controls the page flow.
- `src/components/` contains the individual pages and visual effects.
- `src/data/assessmentData.js` stores quiz questions and scoring logic.
- `src/data/scheduleStorage.js` stores schedule, submission, message, and calendar helpers.
- `src/styles/globalCss.js` contains shared global styles.
