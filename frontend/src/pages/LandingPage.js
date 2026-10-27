import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import FormPreviewContent from "../components/FormPreviewContent";
import PdfHeader from "../components/PdfHeader";
import { fetchFormData } from "../hooks/usePreviewData";
import { useFormContext } from "../context/FormContext";
import { apiGet, apiPost, apiDelete } from "../api";
import { downloadPdf } from "../helpers/downloadPdf";
import "./LandingPage.css";
import "./PreviewDetails.css";

const LAST_PATH_KEY = "bsdc_last_path";

// Status badge colours (only the Status column is coloured, rest of the row stays normal).
// Kept here so they always apply, even if LandingPage.css was not updated.
const ROW_COLOR_CSS = `
  .status-badge { display: inline-block; padding: 3px 12px; border-radius: 12px; font-size: 12px; font-weight: 700; white-space: nowrap; }
  .status-ongoing { background: #f0a500; color: #fff; }
  .status-submitted { background: #2e9e4f; color: #fff; }
  .status-approved { background: #1b7f3b; color: #fff; }
  .status-rejected { background: #7a1c1c; color: #fff; }
  .status-objection { background: #d93025; color: #fff; }
  .objection-remark { margin-top: 6px; max-width: 240px; font-size: 12px; line-height: 1.4; color: #b3261e; white-space: normal; word-break: break-word; }
`;

// Statuses where the user has finished the form (not ongoing, not objection).
const DONE_STATUSES = ["submitted", "approved", "rejected"];

// apps.status stays "submitted" after the OIC decides; the OIC decision is stored
// in apps.request_status. Show the OIC decision once the form is submitted.
function effectiveStatus(app) {
  const decision = String(app.request_status || "").trim().toLowerCase();
  if (app.status === "submitted" && ["approved", "rejected", "objection"].includes(decision)) {
    return decision;
  }
  return app.status;
}

function formatSubmittedDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  // If the server only stored a date (time is exactly 00:00 UTC), showing a
  // time would be wrong (it turns into "5:30 AM" in IST), so show the date only.
  const dateOnly =
    d.getUTCHours() === 0 &&
    d.getUTCMinutes() === 0 &&
    d.getUTCSeconds() === 0 &&
    d.getUTCMilliseconds() === 0;

  if (dateOnly) {
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  const datePart = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const timePart = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${datePart}, ${timePart}`;
}

function LandingPage() {
  const navigate = useNavigate();
  const { ids, setId, resetForm } = useFormContext();
  const pdfRef = useRef(null);

  const [forms, setForms] = useState([]);
  const [orgRows, setOrgRows] = useState([]);
  const [infraRows, setInfraRows] = useState([]);
  const [checklistRows, setChecklistRows] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [pdfJob, setPdfJob] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadForms() {
      const [appsRes, orgRes, infraRes, checklistRes] = await Promise.allSettled([
        apiGet("/apps"),
        apiGet("/org"),
        apiGet("/infra"),
        apiGet("/checklist"),
      ]);
      if (cancelled) return;

      if (appsRes.status === "fulfilled") {
        const all = appsRes.value.map((app) => ({
          ...app,
          raw_status: app.status,
          status: effectiveStatus(app),
        }));
        // Ongoing + objection forms first (newest on top), then submitted / approved ones.
        const ongoing = all
          .filter((app) => !DONE_STATUSES.includes(app.status))
          .sort((a, b) => b.app_id - a.app_id);
        const submitted = all
          .filter((app) => DONE_STATUSES.includes(app.status))
          .sort((a, b) => a.app_id - b.app_id);
        setForms([...ongoing, ...submitted]);
      } else {
        console.error("Could not load your forms:", appsRes.reason);
        setError("Could not load your forms. Please try again.");
      }
      if (orgRes.status === "fulfilled") setOrgRows(orgRes.value);
      if (infraRes.status === "fulfilled") setInfraRows(infraRes.value);
      if (checklistRes.status === "fulfilled") setChecklistRows(checklistRes.value);
      setLoaded(true);
    }

    loadForms();
    return () => { cancelled = true; };
  }, []);

  function orgFor(form) {
    return orgRows.find((row) => String(row.org_id) === String(form.org_id)) || null;
  }

  function idsFor(form) {
    const infra = infraRows.find((row) => String(row.app_id) === String(form.app_id));
    const checklist = checklistRows.find((row) => String(row.app_id) === String(form.app_id));
    return {
      orgId: form.org_id || null,
      appId: form.app_id,
      infraId: infra ? infra.infra_id : null,
      checklistId: checklist ? checklist.checklist_id : null,
    };
  }

  // Form is still being filled (not submitted, no objection, not approved / denied).
  function isOngoing(form) {
    return form.status !== "objection" && !DONE_STATUSES.includes(form.status);
  }

  // OIC has raised an objection -> user may edit again.
  function hasObjection(form) {
    return form.status === "objection";
  }

  // OIC has approved the form.
  function isApproved(form) {
    return form.status === "approved";
  }

  // OIC has denied access.
  function isRejected(form) {
    return form.status === "rejected";
  }

  // Reason given by the OIC (objection / access denied).
  function remarksOf(form) {
    return form.objection_remarks || form.rejection_reason || form.remarks || "";
  }

  // Edit is shown only for ongoing forms or forms with an OIC objection.
  function canEdit(form) {
    return isOngoing(form) || hasObjection(form);
  }

  function pdfIdFor(form) {
    return form.form_id || `form-${form.app_id}`;
  }

  async function handleDownload(form) {
    setError("");
    setBusyId(form.app_id);
    try {
      const { data } = await fetchFormData(idsFor(form));
      const pdfId = pdfIdFor(form);
      setPdfJob({ data, filename: `${pdfId}.pdf`, formId: pdfId });
    } catch (err) {
      console.error(err);
      setError("Could not prepare the PDF. Please try again.");
      setBusyId(null);
    }
  }

  useEffect(() => {
    if (!pdfJob || !pdfRef.current) return;
    downloadPdf(pdfRef.current, pdfJob.filename, pdfJob.formId)
      .catch((err) => {
        console.error(err);
        setError("Could not create the PDF. Please try again.");
      })
      .finally(() => {
        setPdfJob(null);
        setBusyId(null);
      });
  }, [pdfJob]);

  // Open a submitted / objection (or already numbered) form for editing -> preview page.
  async function handleEdit(form) {
    setError("");
    setBusyId(form.app_id);
    try {
      if (form.status === "submitted" || form.status === "objection") {
        await apiPost(`/apps/${form.app_id}/reopen`, {});
      }

      const target = idsFor(form);
      resetForm({ keepUser: true });
      setId("appId", target.appId);
      if (target.orgId) setId("orgId", target.orgId);
      if (target.infraId) setId("infraId", target.infraId);
      if (target.checklistId) setId("checklistId", target.checklistId);
      navigate("/previewdetails");
    } catch (err) {
      console.error(err);
      setError("Could not open this form for editing. Please try again.");
      setBusyId(null);
    }
  }

  // Continue an ongoing form from the page the user left on.
  function handleResume(draft) {
    const target = idsFor(draft);
    resetForm({ keepUser: true });
    setId("appId", target.appId);
    if (target.orgId) setId("orgId", target.orgId);
    if (target.infraId) setId("infraId", target.infraId);
    if (target.checklistId) setId("checklistId", target.checklistId);

    let lastPath = null;
    try {
      lastPath = localStorage.getItem(LAST_PATH_KEY);
    } catch {
      /* ignore storage errors */
    }
    navigate(lastPath || "/organization");
  }

  // Ongoing forms without a Form ID continue where the user left off;
  // everything else opens in the preview page, as before.
  function handleEditClick(form) {
    if (!canEdit(form)) return;
    if (isOngoing(form) && !form.form_id) handleResume(form);
    else handleEdit(form);
  }

  async function handleDelete(form) {
    const ok = window.confirm(
      isOngoing(form)
        ? "Delete this ongoing form? This cannot be undone."
        : "Delete this form? It has no Form ID. This cannot be undone."
    );
    if (!ok) return;

    setError("");
    setBusyId(form.app_id);
    try {
      await apiDelete(`/apps/${form.app_id}`);
      setForms((prev) => prev.filter((f) => f.app_id !== form.app_id));

      // If this was the form the browser was still pointing to, forget it.
      if (String(ids.appId) === String(form.app_id)) {
        resetForm({ keepUser: true });
        try {
          localStorage.removeItem(LAST_PATH_KEY);
        } catch {
          /* ignore storage errors */
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err.status === 409
          ? "This form is already submitted and cannot be deleted."
          : "Could not delete this form. Please try again."
      );
    } finally {
      setBusyId(null);
    }
  }

  function handleNewForm() {
    try {
      localStorage.removeItem(LAST_PATH_KEY);
    } catch {
      /* ignore storage errors */
    }
    resetForm({ keepUser: true });
    navigate("/organization");
  }

  return (
    <Layout>
      <style>{ROW_COLOR_CSS}</style>
      <div className="landing-note">
        <h3>Important Instructions</h3>

        <ol>
          <li>Any kind of hardware at SDC will be provided on a shared basis if not mentioned as dedicated.</li>
          <li>Please also attach required configuration of application software (IIS/apache/Jboss / Webshpare / Weblogic etc).</li>
          <li>Application developer is responsible for first time installation.</li>
          <li>Application developer will provide complete work flow / data flow of application in the form of solution document for future installation.</li>
          <li>Application fine tuning is sole responsibility of application developer.</li>
          <li>In case of SI/large project re-installation will be the responsibility of SI.</li>
          <li>Load testing report.</li>
        </ol>
      </div>

      <button className="start-button" onClick={handleNewForm}>
        + New Form
      </button>

      {error && <p className="form-error">{error}</p>}

      <div ref={pdfRef} className="pdf-root" style={{ display: "none" }}>
        {pdfJob && (
          <>
            <PdfHeader formId={pdfJob.formId} />
            <FormPreviewContent {...pdfJob.data} />
          </>
        )}
      </div>

      {!loaded && (
        <p style={{ textAlign: "center" }}>Loading your forms...</p>
      )}

      {loaded && forms.length > 0 && (
        <div className="forms-section">

          <table className="submission-table">
            <thead>
              <tr>
                <th colSpan={8} className="table-caption-row">Your Filled Forms</th>
              </tr>
              <tr>
                <th>Form ID</th>
                <th>URL</th>
                <th>Officer Name</th>
                <th>Application</th>
                <th>Department</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => {
                const busy = busyId === form.app_id;
                const org = orgFor(form);
                const ongoing = isOngoing(form);
                const objection = hasObjection(form);
                const approved = isApproved(form);
                const rejected = isRejected(form);
                const remark = remarksOf(form);
                const badgeClass = objection
                  ? "status-objection"
                  : approved
                  ? "status-approved"
                  : rejected
                  ? "status-rejected"
                  : ongoing
                  ? "status-ongoing"
                  : "status-submitted";
                const badgeText = objection
                  ? "Objection"
                  : approved
                  ? "Approved"
                  : rejected
                  ? "Access Denied"
                  : ongoing
                  ? "Ongoing"
                  : "Submitted";
                return (
                  <tr key={form.app_id} className={ongoing ? "row-ongoing" : "row-submitted"}>
                    <td className="form-id-cell" title={form.form_id || ""}>
                      {form.form_id || (ongoing ? "Not formed yet" : "-")}
                    </td>
                    <td>
                      {form.url ? (
                        <a href={`https://${form.url.replace(/^https?:\/\//, "")}`} target="_blank" rel="noreferrer" className="url-link">
                          {form.url}
                        </a>
                      ) : "-"}
                    </td>
                    <td>{org ? (org.officer || "-") : "-"}</td>
                    <td>{form.name || "-"}</td>
                    <td>{org ? (org.name || "-") : "-"}</td>
                    <td>
                      <span className={`status-badge ${badgeClass}`}>{badgeText}</span>
                      {(objection || rejected) && remark && (
                        <div className="objection-remark">
                          <b>{rejected ? "Reason: " : "Objection: "}</b>
                          {remark}
                        </div>
                      )}
                    </td>
                    <td>{ongoing ? "-" : formatSubmittedDate(form.submitted_at)}</td>
                    <td className="actions-cell">
                      {!ongoing && (
                        <button
                          type="button"
                          className="download-button"
                          disabled={busyId !== null}
                          onClick={() => handleDownload(form)}
                        >
                          {busy && pdfJob ? "Preparing..." : "Download PDF"}
                        </button>
                      )}
                      {canEdit(form) && (
                        <button
                          type="button"
                          className="edit-button"
                          disabled={busyId !== null}
                          onClick={() => handleEditClick(form)}
                        >
                          Edit
                        </button>
                      )}
                      {(ongoing || (!form.form_id && !objection && !approved && !rejected)) && (
                        <button
                          type="button"
                          className="edit-button"
                          disabled={busyId !== null}
                          onClick={() => handleDelete(form)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

export default LandingPage;