import { useEffect } from "react";
import Layout from "../components/Layout";
import FormPreviewContent from "../components/FormPreviewContent";
import usePreviewData from "../hooks/usePreviewData";
import "./PreviewDetails.css";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { apiPost } from "../api";


function PreviewDetails() {

    const navigate = useNavigate();
    const { ids, setId } = useFormContext();
    const { org, app, infra, stagingServers, productionServers, checklist, error, setError, loaded } = usePreviewData(ids);

    useEffect(() => {
        if (loaded && app && app.status === "submitted" && app.form_id) {
            setId("submitted", true);
            navigate("/submitted", { replace: true });
        }
    }, [loaded, app]);

    function Backpage() {
        navigate("/checklist");
    }

    async function handleSubmit() {
        setError("");
        try {
            await apiPost(`/apps/${ids.appId}/submit`, {});
            setId("submitted", true);
            navigate("/submitted");
        } catch (err) {
            console.error(err);
            if (err.status === 409) {
                setId("submitted", true);
                navigate("/submitted");
            } else if (err.status === 400) {
                setError(err.message || "Please complete all sections before submitting.");
            } else {
                setError("Could not finalize your submission. Please try again.");
            }
        }
    }

    if (!loaded) {
        return (
            <Layout>
                <p style={{ textAlign: "center", marginTop: "40px" }}>Loading your form...</p>
            </Layout>
        );
    }

    return (
        <Layout>

            <div className="box">
                <h3>This is a preview of your submission. It has not been submitted yet!</h3>
                <label className="grey">Please take a moment to verify your information. You can also go back to make changes.</label>
            </div>

            <div>
                <FormPreviewContent
                    org={org}
                    app={app}
                    infra={infra}
                    stagingServers={stagingServers}
                    productionServers={productionServers}
                    checklist={checklist}
                />
            </div>

            {error && <p className="form-error">{error}</p>}

            <input type="button" value="Previous" onClick={Backpage} className="back-button" />
            <input type="button" value="Submit" onClick={handleSubmit} className="submit-button" />
        </Layout>
    );
}

export default PreviewDetails;