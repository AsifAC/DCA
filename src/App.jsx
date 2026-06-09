import { useState } from "react";
import { ApplicationPage } from "./components/ApplicationPage";
import { CelebrationLoadingPage } from "./components/CelebrationLoadingPage";
import { CountdownPage } from "./components/CountdownPage";
import { FinalQuestionPage } from "./components/FinalQuestionPage";
import { LandingPage } from "./components/LandingPage";
import { ProcessingPage } from "./components/ProcessingPage";
import { QuizPage } from "./components/QuizPage";
import { ResultsPage } from "./components/ResultsPage";
import { Stars } from "./components/Stars";
import { SubmissionsPage } from "./components/SubmissionsPage";
import { SuccessPage } from "./components/SuccessPage";
import { clearCurrentSchedule } from "./data/scheduleStorage";
import { usePersistentState } from "./hooks/usePersistentState";
import { globalCss } from "./styles/globalCss";

const validPages = ["landing", "quiz", "processing", "results", "application", "final", "celebration", "success", "submissions", "countdown"];

function AppMenu({ onRestart, onSubmissions, onCountdown, onHome }) {
  const [open, setOpen] = useState(false);

  const choose = (action) => {
    setOpen(false);
    action();
  };

  return (
    <div className="app-menu">
      <button className="menu-trigger" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Open menu">
        Menu
      </button>
      {open && (
        <div className="menu-panel">
          <button onClick={() => choose(onHome)}>Assessment</button>
          <button onClick={() => choose(onSubmissions)}>Previous Submissions</button>
          <button onClick={() => choose(onCountdown)}>Countdown</button>
          <button onClick={() => choose(onRestart)}>Restart Application</button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [storedPage, setStoredPage] = usePersistentState("dca.currentPage", "landing");
  const page = validPages.includes(storedPage) ? storedPage : "landing";

  const goToPage = (nextPage) => {
    setStoredPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => {
    if (!window.confirm("Start a new application? Your previous submissions will stay saved.")) return;
    clearCurrentSchedule();
    localStorage.removeItem("dca.quizAnswers");
    goToPage("landing");
  };

  const completeQuiz = (answers) => {
    localStorage.setItem("dca.quizAnswers", JSON.stringify(answers));
    goToPage("processing");
  };

  return (
    <>
      <style>{globalCss}</style>
      <div className="app-shell">
        <Stars />
        <AppMenu
          onHome={() => goToPage("landing")}
          onSubmissions={() => goToPage("submissions")}
          onCountdown={() => goToPage("countdown")}
          onRestart={restart}
        />
        <main key={page} className="route-frame">
          {page === "landing" && <LandingPage onStart={() => goToPage("quiz")} />}
          {page === "quiz" && <QuizPage onComplete={completeQuiz} />}
          {page === "processing" && <ProcessingPage onComplete={() => goToPage("results")} />}
          {page === "results" && <ResultsPage onContinue={() => goToPage("application")} onRestart={restart} />}
          {page === "application" && <ApplicationPage onContinue={() => goToPage("final")} />}
          {page === "final" && <FinalQuestionPage onYes={() => goToPage("celebration")} />}
          {page === "celebration" && <CelebrationLoadingPage onComplete={() => goToPage("success")} />}
          {page === "success" && <SuccessPage onRestart={restart} />}
          {page === "submissions" && <SubmissionsPage onBack={() => goToPage("landing")} />}
          {page === "countdown" && <CountdownPage onSubmissions={() => goToPage("submissions")} onRestart={restart} />}
        </main>
      </div>
    </>
  );
}
