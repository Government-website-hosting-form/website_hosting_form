import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import FormPreviewContent from "../components/FormPreviewContent";
import PdfHeader from "../components/PdfHeader";
import { fetchFormData } from "../hooks/usePreviewData";
import { useFormContext } from "../context/FormContext";
import { apiGet, apiPost } from "../api";
import { downloadPdf } from "../helpers/downloadPdf";
import "./LandingPage.css";
import "./PreviewDetails.css";

function formatSubmittedDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
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
        setForms(
          appsRes.value
            .filter((app) => app.form_id)
            .sort((a, b) => a.app_id - b.app_id)
        );
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

  async function handleDownload(form) {
    setError("");
    setBusyId(form.app_id);
    try {
      const { data } = await fetchFormData(idsFor(form));
      setPdfJob({ data, filename: `${form.form_id}.pdf`, formId: form.form_id });
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

  async function handleEdit(form) {
    setError("");
    setBusyId(form.app_id);
    try {
      if (form.status === "submitted") await apiPost(`/apps/${form.app_id}/reopen`, {});

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

  function handleNewForm() {
    resetForm({ keepUser: true });
    navigate("/organization");
  }

  return (
    <Layout>
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
                <th colSpan={7} className="table-caption-row">Your Filled Forms</th>
              </tr>
              <tr>
                <th>Form ID</th>
                <th>URL</th>
                <th>Officer Name</th>
                <th>Application</th>
                <th>Department</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => {
                const busy = busyId === form.app_id;
                const org = orgFor(form);
                return (
                  <tr key={form.app_id}>
                    <td className="form-id-cell" title={form.form_id}>{form.form_id}</td>
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
                    <td>{formatSubmittedDate(form.submitted_at)}</td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="download-button"
                        disabled={busyId !== null}
                        onClick={() => handleDownload(form)}
                      >
                        {busy && pdfJob ? "Preparing..." : "Download PDF"}
                      </button>
                      <button
                        type="button"
                        className="edit-button"
                        disabled={busyId !== null}
                        onClick={() => handleEdit(form)}
                      >
                        Edit
                      </button>
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