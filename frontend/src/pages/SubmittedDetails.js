import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import FormPreviewContent from "../components/FormPreviewContent";
import { fetchFormData } from "../hooks/usePreviewData";
import "./PreviewDetails.css";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import html2pdf from "html2pdf.js";
import { apiGet, apiPost } from "../api";


function SubmittedDetails() {

    const navigate = useNavigate();
    const { ids, setId, resetForm } = useFormContext();
    const pdfRef = useRef(null);
 
    const leaving = useRef(false);

    const [forms, setForms] = useState([]);
    const [infraRows, setInfraRows] = useState([]);
    const [checklistRows, setChecklistRows] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState("");
    const [busyId, setBusyId] = useState(null);  
    const [pdfJob, setPdfJob] = useState(null);   

    useEffect(() => {
        let cancelled = false;

        async function loadForms() {
            const [appsRes, infraRes, checklistRes] = await Promise.allSettled([
                apiGet("/apps"),
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
            if (infraRes.status === "fulfilled") setInfraRows(infraRes.value);
            if (checklistRes.status === "fulfilled") setChecklistRows(checklistRes.value);
            setLoaded(true);
        }

        loadForms();
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (!loaded || leaving.current || error || forms.length > 0) return;
        navigate(ids.appId ? "/previewdetails" : "/", { replace: true });
    }, [loaded]);

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
            setPdfJob({ data, filename: `${form.form_id}.pdf` });
        } catch (err) {
            console.error(err);
            setError("Could not prepare the PDF. Please try again.");
            setBusyId(null);
        }
    }

    useEffect(() => {
        if (!pdfJob || !pdfRef.current) return;
        const el = pdfRef.current;
        el.style.display = "block";

        const done = () => {
            el.style.display = "none";
            setPdfJob(null);
            setBusyId(null);
        };

        Promise.resolve(
            html2pdf()
                .set({
                    margin: 7,
                    filename: pdfJob.filename,
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: {
                        scale: 2,
                        ignoreElements: (element) => element.classList.contains("edit-section-button"),
                    },
                    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                    pagebreak: { mode: ["css", "legacy"] },
                })
                .from(el)
                .save()
        ).then(done, (err) => {
            console.error(err);
            setError("Could not create the PDF. Please try again.");
            done();
        });
    }, [pdfJob]);

    async function handleEdit(form) {
        setError("");
        setBusyId(form.app_id);
        try {
            if (form.status === "submitted") await apiPost(`/apps/${form.app_id}/reopen`, {});

            const target = idsFor(form);
            leaving.current = true;
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
        leaving.current = true;
        resetForm({ keepUser: true });
        navigate("/organization");
    }

    if (!loaded) {
        return (
            <Layout>
                <p style={{ textAlign: "center", marginTop: "40px" }}>Loading your forms...</p>
            </Layout>
        );
    }

    const justSubmitted = forms.some(
        (form) => String(form.app_id) === String(ids.appId) && form.status === "submitted"
    );

    return (
        <Layout>

            <div ref={pdfRef} style={{ display: "none" }}>
                {pdfJob && <FormPreviewContent {...pdfJob.data} />}
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="box submission-summary">
                <h3>{justSubmitted ? "Your form has been submitted successfully!" : "Your Forms"}</h3>
                {justSubmitted && <label className="grey">All forms filled with your account are listed below.</label>}

                <div className="submission-scroll">
                    <table className="submission-table">
                        <thead>
                            <tr>
                                <th>Form</th>
                                <th>Form ID</th>
                                <th>Status</th>
                                <th>Download</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {forms.map((form, index) => {
                                const locked = form.status === "submitted";
                                const busy = busyId === form.app_id;
                                return (
                                    <tr key={form.app_id} className={String(form.app_id) === String(ids.appId) ? "current-form-row" : undefined}>
                                        <td>Form {index + 1}</td>
                                        <td>{form.form_id}</td>
                                        <td>
                                            <span className={locked ? "status-pill" : "status-pill editing"}>
                                                {locked ? "Submitted" : "Editing"}
                                            </span>
                                        </td>
                                        <td>
                                            <button type="button" className="download-button" disabled={busyId !== null} onClick={() => handleDownload(form)}>
                                                {busy && pdfJob ? "Preparing..." : "Download PDF"}
                                            </button>
                                        </td>
                                        <td>
                                            <button type="button" className="edit-button" disabled={busyId !== null} onClick={() => handleEdit(form)}>
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <button type="button" className="new-form-button" onClick={handleNewForm}>+ New Form</button>
            </div>
        </Layout>
    );
}

export default SubmittedDetails;