import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { backToSso, logout, getSsoId } from "../auth";

const HOME_PATH = "/"; // LandingPage route

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

  function handleHome() {
    if (busy) return;
    if (
      EDIT_PATHS.includes(pathname.toLowerCase()) &&
      !window.confirm(
        "Are you sure you want to go to the Home page? Any unsaved changes on this page may be lost."
      )
    ) {
      return;
    }
    navigate(HOME_PATH);
  }

  function handleBackToSso() {
    if (busy) return;
    setBusy(true);
    backToSso();
  }

  async function handleLogout() {
    if (busy) return;
    setBusy(true);
    await logout();
  }

  return (
    <div className="header">
      <div className="header-top">
        {ssoId && <span className="header-user">SSO ID: {ssoId}</span>}

        {pathname !== HOME_PATH && (
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

      <h1>Website Hosting Requisition Form</h1>
      <p>For Hosting Website / Portal / Applications at State Data Centre</p>
      <p>Department of Information Technology &amp; Communication</p>
    </div>
  );
}

export default Header;