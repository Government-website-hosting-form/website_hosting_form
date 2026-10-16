import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { backToSso, logout, getSsoId } from "../auth";
import { useFormContext } from "../context/FormContext";

const HOME_PATH = "/"; // LandingPage route
const NO_HOME_PATHS = ["/sso/mapping", "/oic", "/sso/success", "/sso/failed", "/sso/mapping", "/sso/pending", "/sso/not-active", "/sso/rejected", "/sso/objection", "/oic/requests"]; // change: pages where Home is hidden 

// Form fill karne wale pages: yahan Home dabane par confirm popup aayega
const EDIT_PATHS = [
  "/organization",
  "/applicationdetails",
  "/maindetails",
  "/certificatedetails",
  "/stagingdetails",
  "/productiondetails",
  "/infraotherdetails",
  "/hardwaredetails",
  "/ssldetails",
  "/checklist",
  "/previewdetails",
];

function Header() {
  const [busy, setBusy] = useState(false);
  const ssoId = getSsoId();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { hasLeaveSaver, runLeaveSaver } = useFormContext();
  // Where the user was heading when the "Leave this form?" popup opened: "home" | "sso" | null
  const [leaveTarget, setLeaveTarget] = useState(null);
  const [leaving, setLeaving] = useState(false);

  function onFormPage() {
    return EDIT_PATHS.includes(pathname.toLowerCase()) && hasLeaveSaver();
  }

  function handleHome() {
    if (busy) return;
    // On a form page: ask what to do with the changes on this page.
    if (onFormPage()) {
      setLeaveTarget("home");
      return;
    }
    navigate(HOME_PATH);
  }

  function goToSso() {
    setBusy(true);
    backToSso();
  }

  function handleBackToSso() {
    if (busy) return;
    if (onFormPage()) {
      setLeaveTarget("sso");
      return;
    }
    goToSso();
  }

  function finishLeave(target) {
    setLeaveTarget(null);
    if (target === "sso") goToSso();
    else navigate(HOME_PATH);
  }

  async function saveAndLeave() {
    if (leaving) return;
    const target = leaveTarget;
    setLeaving(true);
    try {
      await runLeaveSaver();
    } catch (err) {
      console.error("Could not save before leaving:", err);
    }
    setLeaving(false);
    finishLeave(target);
  }

  function leaveWithoutSaving() {
    if (leaving) return;
    finishLeave(leaveTarget);
  }

  function cancelLeave() {
    if (leaving) return;
    setLeaveTarget(null);
  }

  async function handleLogout() {
    if (busy) return;
    setBusy(true);
    await logout();
  }

  return (
    <div className="header">
      <div className="header-top">
        {ssoId && pathname.toLowerCase() !== "/sso/failed" && (
          <span className="header-user">SSO ID: {ssoId}</span>
        )}

        {pathname !== HOME_PATH &&
          !NO_HOME_PATHS.some((p) => {
            const path = pathname.toLowerCase();
            return path === p || path.startsWith(p + "/");
          }) && ( // change // change// change made here to avoid showing Home button on SSO Mapping page
            <button
              type="button"
              className="header-btn"
              onClick={handleHome}
              disabled={busy}
            >
              Home
            </button>
          )}

        <button
          type="button"
          className="header-btn"
          onClick={handleBackToSso}
          disabled={busy}
        >
          Back to SSO
        </button>

        <button
          type="button"
          className="header-btn"
          onClick={handleLogout}
          disabled={busy}
        >
          {busy ? "Logging out..." : "Logout"}
        </button>
      </div>

      {leaveTarget && (
        <div className="leave-overlay" role="dialog" aria-modal="true">
          <div className="leave-modal">
            <h3 className="leave-title">Leave this form?</h3>
            <p className="leave-text">
              Do you want to save what you have filled so far? A saved form will
              appear on the Home page as Ongoing.
            </p>
            <div className="leave-actions">
              <button type="button" className="leave-btn" onClick={cancelLeave} disabled={leaving}>
                Cancel
              </button>
              <button type="button" className="leave-btn" onClick={leaveWithoutSaving} disabled={leaving}>
                Don't save
              </button>
              <button type="button" className="leave-btn leave-btn-primary" onClick={saveAndLeave} disabled={leaving}>
                {leaving ? "Saving..." : leaveTarget === "sso" ? "Save & go to SSO" : "Save & go to Home"}
              </button>
            </div>
          </div>
        </div>
      )}

      <h1>Website Hosting Requisition Form</h1>
      <p>For Hosting Website / Portal / Applications at State Data Centre</p>
      <p>Department of Information Technology &amp; Communication</p>
    </div>
  );
}

export default Header;