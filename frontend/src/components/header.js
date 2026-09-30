import { useState } from "react";
import { backToSso, logout, getSsoId } from "../auth";

function Header() {
  const [busy, setBusy] = useState(false);
  const ssoId = getSsoId();

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
