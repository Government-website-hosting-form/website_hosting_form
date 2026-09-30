import { useEffect, useRef, useState } from "react";
import { clearSession } from "../auth";

const IDLE_LIMIT_MS = 20  *60* 1000;
const WARN_AFTER_MS = 18  *60*1000;

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"];

function defaultLogout() {
  clearSession();
  window.location.href = "/sso/failed?reason=SESSION_TIMEOUT";
}

function SessionTimeout({ onTimeout = defaultLogout }) {
  const lastActivity = useRef(Date.now());
  const warningShown = useRef(false);
  const [secondsLeft, setSecondsLeft] = useState(null); 

  useEffect(() => {
    function onActivity() {
  
      if (warningShown.current) return;
      lastActivity.current = Date.now();
    }

    function check() {
      const token = localStorage.getItem("ssoToken");
      if (!token) {

        lastActivity.current = Date.now();
        warningShown.current = false;
        setSecondsLeft(null);
        return;
      }

      const idleFor = Date.now() - lastActivity.current;

      if (idleFor >= IDLE_LIMIT_MS) {
        clearInterval(timer);
        onTimeout();
        return;
      }

      if (idleFor >= WARN_AFTER_MS) {
        warningShown.current = true;
        setSecondsLeft(Math.ceil((IDLE_LIMIT_MS - idleFor) / 1000));
      }
    }

    function onVisible() {

      if (document.visibilityState === "visible") check();
    }

    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, onActivity, true));
    document.addEventListener("visibilitychange", onVisible);

    const timer = setInterval(check, 1000);

    return () => {
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, onActivity, true));
      document.removeEventListener("visibilitychange", onVisible);
      clearInterval(timer);
    };
  }, [onTimeout]);

  function stayLoggedIn() {
    lastActivity.current = Date.now();
    warningShown.current = false;
    setSecondsLeft(null);
  }

  if (secondsLeft === null) return null;

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div style={styles.overlay} role="alertdialog" aria-modal="true" aria-labelledby="session-timeout-title">
      <div style={styles.box}>
        <h3 id="session-timeout-title" style={{ marginTop: 0, color: "#123d6d" }}>
          Session about to expire
        </h3>
        <p>
          You have been inactive for a while. You will be logged out in{" "}
          <strong>{mm}:{ss}</strong>.
        </p>
        <button className="next-btn" onClick={stayLoggedIn}>
          Stay logged in
        </button>{" "}
        <button style={styles.secondary} onClick={onTimeout}>
          Log out now
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  box: {
    background: "#fff",
    padding: "28px 32px",
    borderRadius: "10px",
    maxWidth: "420px",
    boxShadow: "0 4px 16px rgba(0,0,0,.3)",
  },
  secondary: {
    background: "#fff",
    color: "#123d6d",
    border: "1px solid #123d6d",
    padding: "12px 20px",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default SessionTimeout;