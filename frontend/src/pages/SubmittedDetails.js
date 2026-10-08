import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import FormPreviewContent from "../components/FormPreviewContent";
import PdfHeader from "../components/PdfHeader";
import { fetchFormData } from "../hooks/usePreviewData";
import "./PreviewDetails.css";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { apiGet } from "../api";
import { downloadPdf } from "../helpers/downloadPdf";
import useAutosave from "../hooks/useAutosave"; 

function SubmittedDetails() {

    const navigate = useNavigate();
    const { ids } = useFormContext();
    const pdfRef = useRef(null);

    const [form, setForm] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState("");
    const [downloading, setDownloading] = useState(false);
    const [pdfJob, setPdfJob] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadForm() {
            if (!ids.appId) {
                navigate("/", { replace: true });
                return;
            }
            try {
                const app = await apiGet(`/apps/${ids.appId}`);
                if (cancelled) return;

                if (!app || !app.form_id) {
                    navigate("/previewdetails", { replace: true });
                    return;
                }

                setForm(app);
                setLoaded(true);
            } catch (err) {
                if (cancelled) return;
                console.error("Could not load your submitted form:", err);
                setError("Could not load your submitted form. Please try again.");
                setLoaded(true);
            }
        }

        loadForm();
        return () => { cancelled = true; };
    }, [ids.appId, navigate]);

    async function handleDownload() {
        setError("");
        setDownloading(true);
        try {
            const { data } = await fetchFormData(ids);
            setPdfJob({ data, filename: `${form.form_id}.pdf`, formId: form.form_id });
        } catch (err) {
            console.error(err);
            setError("Could not prepare the PDF. Please try again.");
            setDownloading(false);
        }
    }

    useEffect(() => {
        if (!pdfJob || !pdfRef.current) return;
        const el = pdfRef.current;
        el.style.display = "block";

        const done = () => {
            el.style.display = "none";
            setPdfJob(null);
            setDownloading(false);
        };

        downloadPdf(el, pdfJob.filename, pdfJob.formId).then(done, (err) => {
            console.error(err);
            setError("Could not create the PDF. Please try again.");
            done();
        });
    }, [pdfJob]);

    function handleGoHome() {
        navigate("/");
    }

    if (!loaded) {
        return (
            <Layout>
                <p style={{ textAlign: "center", marginTop: "40px" }}>Loading your submission...</p>
            </Layout>
        );
    }

    return (
        <Layout>

            <div ref={pdfRef} className="pdf-root" style={{ display: "none" }}>
                {pdfJob && (
                    <>
                        <PdfHeader formId={pdfJob.formId} />
                        <FormPreviewContent {...pdfJob.data} />
                    </>
                )}
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="box">
                <h3>Your form has been submitted successfully!</h3>
                {form && (
                    <p>Your Form ID: <strong>{form.form_id}</strong></p>
                )}
                <label className="grey">You can download a PDF copy of your submission below for your records.</label>
                <div>
                    <button
                        type="button"
                        className="download-button"
                        disabled={downloading}
                        onClick={handleDownload}
                    >
                        {downloading ? "Preparing..." : "Download PDF"}
                    </button>
                    <button type="button" className="back-button" onClick={handleGoHome}>
                        Go to Home
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default SubmittedDetails;