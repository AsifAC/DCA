export const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { height: -webkit-fill-available; }

  body {
    background: #080912; color: #f0ece8; font-family: 'DM Sans', sans-serif;
    min-height: 100vh; min-height: -webkit-fill-available;
    overflow-x: hidden;
    -webkit-text-size-adjust: 100%;
  }

  button {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    -webkit-appearance: none;
  }

  input, textarea {
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: none;
  }

  .page {
    min-height: 100vh;
    min-height: 100svh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 2rem 1.5rem max(1.5rem, env(safe-area-inset-bottom));
    position: relative; z-index: 1;
    opacity: 0; transform: translateY(18px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .page.vis { opacity: 1; transform: translateY(0); }

  .df { font-family: 'Cormorant Garamond', serif; }

  .glass { background: rgba(255,255,255,0.045); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.09); border-radius: 20px; }

  .btn-rose { background: linear-gradient(135deg, #c0767f 0%, #e09aaa 100%); color: #fff; border: none; padding: 14px 42px; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; letter-spacing: 0.3px; transition: transform 0.2s, box-shadow 0.2s; min-height: 48px; }
  .btn-rose:hover { transform: translateY(-2px); box-shadow: 0 10px 35px rgba(192,118,127,0.4); }
  .btn-rose:active { transform: scale(0.97); }
  .btn-rose:disabled { opacity: 0.42; cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-rose:disabled:hover { transform: none; box-shadow: none; }
  .btn-soft { background: rgba(255,255,255,0.04); color: rgba(240,236,232,0.78); border: 1px solid rgba(255,255,255,0.1); padding: 13px 28px; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; transition: background 0.2s, border-color 0.2s, transform 0.2s; min-height: 46px; }
  .btn-soft:hover { background: rgba(192,118,127,0.14); border-color: rgba(192,118,127,0.34); transform: translateY(-1px); }
  .btn-soft:active { transform: scale(0.98); }
  .btn-danger { background: rgba(200,72,84,0.12); color: rgba(255,210,214,0.86); border: 1px solid rgba(200,72,84,0.28); padding: 13px 22px; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; transition: background 0.2s, border-color 0.2s, transform 0.2s; min-height: 46px; }
  .btn-danger:hover { background: rgba(200,72,84,0.2); border-color: rgba(200,72,84,0.45); transform: translateY(-1px); }

  .app-menu { position: fixed; top: max(16px, env(safe-area-inset-top)); right: 16px; z-index: 1001; }
  .menu-trigger { min-height: 42px; padding: 0 18px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.1); background: rgba(8,9,18,0.58); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); color: rgba(240,236,232,0.78); font-family: 'DM Sans', sans-serif; font-size: 13px; letter-spacing: 0.8px; text-transform: uppercase; cursor: pointer; }
  .menu-panel { position: absolute; top: 50px; right: 0; width: min(230px, calc(100vw - 32px)); padding: 8px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.09); background: rgba(13,14,27,0.88); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); box-shadow: 0 18px 50px rgba(0,0,0,0.32); }
  .menu-panel button { width: 100%; border: 0; border-radius: 11px; background: transparent; color: rgba(240,236,232,0.72); padding: 12px 13px; font-family: 'DM Sans', sans-serif; font-size: 13px; text-align: left; cursor: pointer; transition: background 0.2s, color 0.2s; }
  .menu-panel button:hover { background: rgba(192,118,127,0.14); color: #f0ece8; }

  .ans-card { background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.075); border-radius: 14px; padding: 16px 20px; cursor: pointer; transition: background 0.22s, border-color 0.22s, transform 0.22s; text-align: left; width: 100%; color: rgba(240,236,232,0.88); font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.4; display: flex; align-items: center; gap: 12px; min-height: 52px; }
  .ans-card:hover { background: rgba(192,118,127,0.14); border-color: rgba(192,118,127,0.38); transform: translateX(5px); }
  .ans-card:active { background: rgba(192,118,127,0.2); transform: scale(0.99); }

  .prog-track { height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; width: 100%; }
  .prog-fill { height: 100%; background: linear-gradient(90deg, #c0767f, #e09aaa); border-radius: 2px; transition: width 0.45s ease; }

  .met-track { height: 5px; background: rgba(255,255,255,0.08); border-radius: 3px; margin-top: 7px; }
  .met-fill { height: 100%; background: linear-gradient(90deg, #c0767f, #e8be9a); border-radius: 3px; width: 0%; transition: width 1.1s cubic-bezier(0.22,1,0.36,1); }

  @keyframes confettiFall { 0% { transform: translateY(-30px) rotate(0deg); opacity: 1; } 80% { opacity: 0.8; } 100% { transform: translateY(105vh) rotate(720deg); opacity: 0; } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  @keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes celebrationLoad { from { transform: scaleX(0); } to { transform: scaleX(1); } }

  .float-anim { animation: float 4s ease-in-out infinite; }
  .shimmer-txt { background: linear-gradient(90deg, #e09aaa 0%, #f5d5a4 25%, #e09aaa 50%, #b8c8f0 75%, #e09aaa 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shimmer 5s linear infinite; }

  .day-btn { flex: 1; padding: 12px 8px; border-radius: 11px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: rgba(255,255,255,0.55); font-family: 'DM Sans', sans-serif; font-size: 15px; cursor: pointer; transition: all 0.2s; min-height: 48px; }
  .day-btn.sel { background: rgba(192,118,127,0.18); border-color: rgba(192,118,127,0.5); color: #e09aaa; }
  .day-btn:active { transform: scale(0.97); }

  .txt-inp { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 11px; padding: 14px 16px; color: #f0ece8; font-family: 'DM Sans', sans-serif; font-size: 16px; outline: none; transition: border-color 0.2s; }
  .txt-inp:focus { border-color: rgba(192,118,127,0.45); }
  .txt-inp::placeholder { color: rgba(255,255,255,0.25); }
  .time-inp { color-scheme: dark; }

  .calendar-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .cal-title { color: rgba(240,236,232,0.82); font-size: 15px; font-weight: 500; letter-spacing: 0.2px; }
  .cal-nav { width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.035); color: rgba(240,236,232,0.72); font-family: 'DM Sans', sans-serif; font-size: 16px; cursor: pointer; transition: background 0.2s, border-color 0.2s, transform 0.2s; }
  .cal-nav:hover { background: rgba(192,118,127,0.14); border-color: rgba(192,118,127,0.32); transform: translateY(-1px); }
  .calendar-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 7px; }
  .cal-weekday { text-align: center; color: rgba(255,255,255,0.28); font-size: 10px; letter-spacing: 1px; text-transform: uppercase; padding-bottom: 2px; }
  .cal-blank { min-height: 40px; }
  .cal-day { min-height: 40px; border-radius: 11px; border: 1px solid rgba(255,255,255,0.075); background: rgba(255,255,255,0.035); color: rgba(240,236,232,0.78); font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s; }
  .cal-day:hover { background: rgba(192,118,127,0.14); border-color: rgba(192,118,127,0.34); transform: translateY(-1px); }
  .cal-day.sel { background: linear-gradient(135deg, rgba(192,118,127,0.78), rgba(224,154,170,0.82)); border-color: rgba(245,216,160,0.35); color: #fff; box-shadow: 0 8px 24px rgba(192,118,127,0.22); }
  .cal-day:disabled { opacity: 0.24; cursor: not-allowed; transform: none; }
  .cal-day:disabled:hover { background: rgba(255,255,255,0.035); border-color: rgba(255,255,255,0.075); transform: none; }

  .submission-card { padding: 24px 22px; }
  .submission-head { display: flex; justify-content: space-between; gap: 18px; align-items: flex-start; margin-bottom: 16px; }
  .submission-kicker { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(224,154,170,0.55); margin-bottom: 6px; }
  .submission-title { font-size: clamp(21px, 4vw, 31px); font-weight: 400; line-height: 1.18; color: rgba(240,236,232,0.9); }
  .submission-time { flex-shrink: 0; color: #e09aaa; font-size: 14px; font-weight: 500; padding-top: 3px; }
  .submission-meta { display: grid; gap: 7px; margin-bottom: 16px; color: rgba(255,255,255,0.45); font-size: 13px; line-height: 1.45; }
  .submission-edit-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-bottom: 14px; }
  .submission-edit-grid label, .submission-field { display: grid; gap: 8px; color: rgba(255,255,255,0.45); font-size: 13px; margin-bottom: 14px; }
  .submission-actions { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; margin-top: 4px; }
  .submission-actions button { padding-left: 10px; padding-right: 10px; font-size: 13px; }

  .countdown-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 16px; }
  .countdown-tile { min-height: 128px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 18px 10px; text-align: center; }
  .countdown-value { font-size: clamp(36px, 6vw, 58px); font-weight: 300; line-height: 1; color: #f0ece8; font-variant-numeric: tabular-nums; }
  .countdown-label { margin-top: 10px; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(224,154,170,0.62); }
  .countdown-plan { padding: 26px 24px; margin-top: 16px; }
  .countdown-plan-title { font-size: clamp(23px, 4vw, 34px); font-weight: 400; line-height: 1.18; margin-bottom: 14px; color: rgba(240,236,232,0.92); }
  .countdown-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 16px; }

  .celebration-loader { width: 100%; max-width: 560px; text-align: center; display: flex; flex-direction: column; align-items: center; }
  .celebration-gif { width: min(72vw, 340px); aspect-ratio: 1; object-fit: contain; filter: drop-shadow(0 18px 50px rgba(224,154,170,0.16)); animation: float 4s ease-in-out infinite; }
  .celebration-title { font-size: clamp(28px, 6vw, 52px); font-weight: 300; line-height: 1.12; margin-top: 18px; margin-bottom: 10px; }
  .celebration-copy { color: rgba(255,255,255,0.48); font-size: 14px; line-height: 1.7; margin-bottom: 24px; }
  .celebration-progress { width: min(320px, 80vw); height: 4px; border-radius: 999px; background: rgba(255,255,255,0.08); overflow: hidden; }
  .celebration-progress-fill { width: 100%; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #c0767f, #e09aaa, #f5d5a4); transform-origin: left; animation: celebrationLoad 5s linear forwards; }

  .badge { display: inline-block; background: rgba(192,118,127,0.15); border: 1px solid rgba(192,118,127,0.28); border-radius: 50px; padding: 5px 16px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #e09aaa; }

  @keyframes noGlow { 0%,100% { box-shadow: 0 0 8px rgba(192,118,127,0.25), 0 0 20px rgba(192,118,127,0.1); } 50% { box-shadow: 0 0 14px rgba(192,118,127,0.4), 0 0 32px rgba(192,118,127,0.18); } }
  .no-btn { animation: noGlow 2.8s ease-in-out infinite; }

  @media (max-width: 480px) {
    .page { padding: 1.5rem 1rem max(1rem, env(safe-area-inset-bottom)); }
    .ans-card { font-size: 14.5px; }
    .calendar-grid { gap: 5px; }
    .cal-day, .cal-blank { min-height: 36px; }
    .app-menu { right: 10px; }
    .submission-head { flex-direction: column; gap: 8px; }
    .submission-edit-grid { grid-template-columns: 1fr; }
    .submission-actions { grid-template-columns: 1fr; }
    .countdown-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
    .countdown-tile { min-height: 108px; }
    .countdown-actions { grid-template-columns: 1fr; }
  }
`;
