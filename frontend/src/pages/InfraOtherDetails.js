import { useState, useEffect } from "react";
import FormButtons from "../components/FormButtons";
import "./InfraDetails.css";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useFormContext } from "../context/FormContext";
import { apiGet, apiPut } from "../api";

const initialState = {
    software: "",
    app_server_software: "",
    integration_software: "",
    sftp_needed: "",
    sftp_ip: "",
    sftp_username: "",
    public_ip: "",
    dns_entry: "",
    apm_required: "",
    backup: "",
    backup_retention: "",
};

function InfraOtherDetails() {
    const navigate = useNavigate();
    const { ids } = useFormContext();
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);


    useEffect(() => {
        async function loadExisting() {
            if (!ids.infraId) return;
            try {
                const data = await apiGet(`/infra/${ids.infraId}`);
                if (data) {
                    const cleaned = {};
                    for (const [key, value] of Object.entries(data)) {
                        cleaned[key] = value === null ? "" : value;
                    }
                    setForm((prev) => ({ ...prev, ...cleaned }));
                }
            } catch (err) {
                console.error("Could not load saved infra details:", err);
            }
        }
        loadExisting();
    }, [ids.infraId]);

    function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => {
        const updated = { ...prev, [name]: value };
        if (name === "sftp_needed" && value !== "Yes") {
            updated.sftp_ip = "";
            updated.sftp_username = "";
        }
        if (name === "backup" && value !== "Yes") {
            updated.backup_retention = "";
        }
        return updated;
    });
}
    function validateForm() {
        const newErrors = {};
        if (form.backup === "Yes" && !form.backup_retention.trim()) {
            newErrors.backup_retention = "This field is required.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function Nextpage() {
        setError("");
        if (!validateForm()) return;
        if (!ids.infraId) {
            setError("Infrastructure record not found yet — please complete earlier steps first.");
            return;
        }
        setSaving(true);
        try {
            await apiPut(`/infra/${ids.infraId}`, form);
            navigate("/hardwaredetails");
        } catch (err) {
            console.error(err);
            setError("Could not save Infrastructure Details.");
        } finally {
            setSaving(false);
        }
    }

    function Backpage() {
        navigate("/productiondetails");
    }

    return (
        <Layout>
            <div className="form-container">
                <h2 className="section-heading">Infrastructure Requirements (Annexure-5C)</h2>

                {error && <p className="form-error">{error}</p>}

                <div className="form-section">
                    <div className="section-header">
                        <span className="section-badge">5.2</span>
                        <h3>Software Requirements</h3>
                    </div>

                    <div className="form-subsection">
                        <div className="subsection-header">
                            <span className="subsection-badge">A</span>
                            <h3>Other Software Requirements for Hosting</h3>
                        </div>

                        <div className="form-section-grid">
                            <div className="form-row">
                                <label>Web Server Software with Version</label>
                                <input type="text" name="software" value={form.software} onChange={handleChange} placeholder="i.e. Apache, IIS etc" />
                            </div>

                            <div className="form-row">
                                <label>Application Server with Version</label>
                                <input type="text" name="app_server_software" value={form.app_server_software} onChange={handleChange} placeholder="i.e. Tomcat, JBoss etc" />
                            </div>
                        </div>
                    </div>

                    <div className="form-subsection">
                        <div className="subsection-header">
                            <span className="subsection-badge">B</span>
                            <h3>Integration with Other Software Systems Required</h3>
                        </div>

                        <div className="form-section-grid">
                            <div className="form-row full-width">
                                <label>Specify Details of the Software</label>
                                <textarea rows="1" name="integration_software" value={form.integration_software} onChange={handleChange} placeholder="i.e. DMS, GIS, SMS Gateway etc."></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <div className="section-header">
                        <span className="section-badge">5.3</span>
                        <h3>SFTP Access Required in Demilitarized Zone</h3>
                    </div>

                    <div className="form-section-grid">
                        <div className="form-row full-width">
                            <label>SFTP Access Required over Internet</label>
                            <div className="radio-group">
                                <label>
                                    <input type="radio" name="sftp_needed" value="Yes" checked={form.sftp_needed === "Yes"} onChange={handleChange} />
                                    Yes
                                </label>
                                <label>
                                    <input type="radio" name="sftp_needed" value="No" checked={form.sftp_needed === "No"} onChange={handleChange} />
                                    No
                                </label>
                            </div>
                        </div>

                        {form.sftp_needed === "Yes" && (
                            <>
                                <div className="form-row">
                                    <label>Provide Real IP</label>
                                    <input type="text" name="sftp_ip" value={form.sftp_ip} onChange={handleChange} placeholder="Enter Real IP" />
                                </div>

                                <div className="form-row">
                                    <label>Proposed SFTP User Name demanded by the Department</label>
                                    <input type="text" name="sftp_username" value={form.sftp_username} onChange={handleChange} placeholder="Enter Proposed SFTP User Name" />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="form-section">
                    <div className="section-header">
                        <span className="section-badge">5.4</span>
                        <h3>Network Configuration</h3>
                    </div>

                    <div className="form-section-grid">
                        <div className="form-row">
                            <label>Public IP</label>
                            <input type="text" name="public_ip" value={form.public_ip} onChange={handleChange} placeholder="Enter Public IP Address" />
                        </div>

                        <div className="form-row">
                            <label>DNS Entry</label>
                            <div className="radio-group">
                                <label>
                                    <input type="radio" name="dns_entry" value="Private" checked={form.dns_entry === "Private"} onChange={handleChange} />
                                    Private
                                </label>
                                <label>
                                    <input type="radio" name="dns_entry" value="Public" checked={form.dns_entry === "Public"} onChange={handleChange} />
                                    Public
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <div className="section-header">
                        <span className="section-badge">5.5</span>
                        <h3>Monitoring</h3>
                    </div>

                    <div className="form-section-grid">
                        <div className="form-row full-width">
                            <label>Application Performance Management (APM) Required</label>
                            <div className="radio-group">
                                <label>
                                    <input type="radio" name="apm_required" value="Yes" checked={form.apm_required === "Yes"} onChange={handleChange} />
                                    Yes
                                </label>
                                <label>
                                    <input type="radio" name="apm_required" value="No" checked={form.apm_required === "No"} onChange={handleChange} />
                                    No
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <div className="section-header">
                        <span className="section-badge">5.6</span>
                        <h3>Backup Services</h3>
                    </div>

                    <div className="form-section-grid">
                        <div className="form-row full-width">
                            <label>Backup Services Required</label>
                            <div className="radio-group">
                                <label>
                                    <input type="radio" name="backup" value="Yes" checked={form.backup === "Yes"} onChange={handleChange} />
                                    Yes
                                </label>
                                <label>
                                    <input type="radio" name="backup" value="No" checked={form.backup === "No"} onChange={handleChange} />
                                    No
                                </label>
                            </div>
                        </div>

                        {form.backup === "Yes" && (
                            <div className="form-row">
                                <label className="required">Retention Period Approved from Department</label>
                                <input type="text" placeholder="Enter Retention Period" name="backup_retention" value={form.backup_retention} onChange={handleChange} />
                                {errors.backup_retention && <p className="error-message">{errors.backup_retention}</p>}
                            </div>
                        )}
                    </div>
                </div>

                <FormButtons
                    showBack={true}
                    onBack={Backpage}
                    onNext={Nextpage}
                    disabled={saving} saving={saving}
                />
            </div>
        </Layout>
    );
}

export default InfraOtherDetails;