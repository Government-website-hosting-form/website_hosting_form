import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useFormContext } from "../context/FormContext";
import { apiGet } from "../api";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const { setId, resetForm } = useFormContext();

  const [mode, setMode] = useState("choose");
  const [appIdInput, setAppIdInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function startForm() {
    resetForm({ keepUser: true });
    navigate("/organization");
  }

  async function handleContinue() {
    setError("");
    const appId = appIdInput.trim();

    if (!appId) {
      setError("Please enter your Form ID / Application ID.");
      return;
    }

    setLoading(true);
    try {
      const isNumericId = /^\d+$/.test(appId);
      const app = await apiGet(
        isNumericId ? `/apps/${appId}` : `/apps/by-form-id/${encodeURIComponent(appId)}`
      );

      let infraId = null;
      try {
        const infraList = await apiGet("/infra");
        const match = infraList.find((row) => String(row.app_id) === String(app.app_id));
        if (match) infraId = match.infra_id;
      } catch {
      }

      let checklistId = null;
      try {
        const checklistList = await apiGet("/checklist");
        const match = checklistList.find((row) => String(row.app_id) === String(app.app_id));
        if (match) checklistId = match.checklist_id;
      } catch {
      }

      resetForm({ keepUser: true });
      setId("appId", app.app_id);
      if (app.org_id) setId("orgId", app.org_id);
      if (infraId) setId("infraId", infraId);
      if (checklistId) setId("checklistId", checklistId);

      navigate(app.form_id ? "/submitted" : "/previewdetails");
    } catch (err) {
      console.error(err);
      if (err.status === 404) {
        setError("No form found with this ID, or it does not belong to your account. Please check the ID and try again.");
      } else {
        setError("Could not load this application. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <p className="landing-text">
        Welcome to the Website Hosting Requisition Portal.
        Please read the instructions carefully before proceeding.
      </p>

      {mode === "choose" && (
        <div className="landing-choice">
          <p className="landing-question">Do you already have an Application ID from a previous session?</p>
          <div className="landing-choice-buttons">
            <button className="start-button" onClick={startForm}>
              No, Start New Form
            </button>
            <button className="start-button secondary-button" onClick={() => setMode("continue")}>
              Yes, Continue With My ID
            </button>
          </div>
        </div>
      )}

      {mode === "continue" && (
        <div className="landing-continue">
          <label htmlFor="appIdInput">Enter your Form ID (e.g. WebsiteHostingFormRSDC_ABCDE_0001) or Application ID</label>
          <input
            id="appIdInput"
            type="text"
            value={appIdInput}
            onChange={(e) => setAppIdInput(e.target.value)}
            placeholder="WebsiteHostingFormRSDC_ABCDE_0001"
          />
          {error && <p className="error-message">{error}</p>}
          <div className="landing-choice-buttons">
            <button
              className="start-button secondary-button"
              onClick={() => { setMode("choose"); setError(""); }}
              disabled={loading}
            >
              Back
            </button>
            <button className="start-button" onClick={handleContinue} disabled={loading}>
              {loading ? "Checking..." : "Continue"}
            </button>
          </div>
        </div>
      )}

      <div className="landing-note">
        <h3>Important Instructions</h3>

        <ol>
          <li>Any kind of hardware at SDC will be provided on a shared basis if not mentioned as dedicated.</li>
          <li>Please also attach required configuration of application software (IIS/apache/Jboss / Webshpare /  Weblogic etc).</li>
          <li>Application developer is responsible for first time installation.</li>
          <li>Application developer will provide complete work flow / data flow of application in the form of solution  document for future installation. </li>
          <li> Application fine tuning is sole responsibility of application developer. </li>
          <li> In case of SI/large project re-installation will be the responsibility of SI. </li>
          <li>Load testing report.</li>
        </ol>
      </div>
    </Layout>
  );
}

export default LandingPage;