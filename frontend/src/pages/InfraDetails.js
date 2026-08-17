import { useState } from "react";
import "./InfraDetails.css";
import FormButtons from "../components/FormButtons";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useFormContext } from "../context/FormContext";
import { apiPost, apiGet, apiPut } from "../api";
import { useEffect } from "react";

function makeEmptyServer(needVersion) {
    const base = {
        processor: "",
        ram: "",
        internal_storage: "",
        external_storage: "",
        external_storage_other: "",
        os: "",
    };
    return needVersion ? { ...base, version: "" } : base;
}

function validateServer(server) {
  const fieldErrors = {};
  if (!server.processor.trim()) fieldErrors.processor = "This field is required.";
  if (!server.ram.trim()) fieldErrors.ram = "This field is required.";
  if (!server.internal_storage.trim()) fieldErrors.internal_storage = "This field is required.";
  if (!server.external_storage) fieldErrors.external_storage = "This field is required.";
  if (server.external_storage === "Other" && !server.external_storage_other.trim()) {
    fieldErrors.external_storage_other = "Please specify.";
  }
  if (!server.os) fieldErrors.os = "This field is required.";
  if (server.version !== undefined && !server.version.trim()) {
    fieldErrors.version = "This field is required.";
  }
  return fieldErrors;
}

function validateServerList(servers) {
  return servers.map(validateServer);
}


// chceks all staging web servers, staging db servers etc basically one server type's list 
function listHasErrors(errorList) {
  for (let i = 0; i < errorList.length; i++) {
    const fieldErrors = errorList[i];
    if (Object.keys(fieldErrors).length > 0) {
      return true;
    }
  }
  return false;
}


//this checks all web, app, db , other for staging and server
function hasAnyServerErrors(serverErrorLists) {
  for (let i = 0; i < serverErrorLists.length; i++) {
    if (listHasErrors(serverErrorLists[i])) {
      return true;
    }
  }
  return false;
}



//will check count, backup retention 
function hasAnyTopLevelErrors(errorsObject) {
  const keys = Object.keys(errorsObject);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (typeof errorsObject[key] === "string") {
      return true;
    }
  }
  return false;
}

const initialState = {
    staging_web_count: "0",
    staging_app_count: "0",
    staging_db_count: "0",
    staging_other_count: "0",
    staging_webServers: [],
    staging_appServers: [],
    staging_dbServers: [],
    staging_otherServers: [],

    production_web_count: "0",
    production_app_count: "0",
    production_db_count: "0",
    production_other_count: "0",
    production_webServers: [],
    production_appServers: [],
    production_dbServers: [],
    production_otherServers: [],

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

function InfraDetails() {

    const navigate = useNavigate();
    const { ids, setId } = useFormContext();
    const [form, setForm] = useState(initialState);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);


    //
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
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function validateForm() {
    const newErrors = {};

    if (!form.staging_web_count.toString().trim()) newErrors.staging_web_count = "This field is required.";
    const stagingWebErrors = validateServerList(form.staging_webServers);
    newErrors.staging_web = stagingWebErrors;

    if (!form.staging_app_count.toString().trim()) newErrors.staging_app_count = "This field is required.";
    const stagingAppErrors = validateServerList(form.staging_appServers);
    newErrors.staging_app = stagingAppErrors;

    if (!form.staging_db_count.toString().trim()) newErrors.staging_db_count = "This field is required.";
    const stagingDbErrors = validateServerList(form.staging_dbServers);
    newErrors.staging_db = stagingDbErrors;

    if (!form.staging_other_count.toString().trim()) newErrors.staging_other_count = "This field is required.";
    const stagingOtherErrors = validateServerList(form.staging_otherServers);
    newErrors.staging_other = stagingOtherErrors;

    if (!form.production_web_count.toString().trim()) newErrors.production_web_count = "This field is required.";
    const productionWebErrors = validateServerList(form.production_webServers);
    newErrors.production_web = productionWebErrors;

    if (!form.production_app_count.toString().trim()) newErrors.production_app_count = "This field is required.";
    const productionAppErrors = validateServerList(form.production_appServers);
    newErrors.production_app = productionAppErrors;

    if (!form.production_db_count.toString().trim()) newErrors.production_db_count = "This field is required.";
    const productionDbErrors = validateServerList(form.production_dbServers);
    newErrors.production_db = productionDbErrors;

    if (!form.production_other_count.toString().trim()) newErrors.production_other_count = "This field is required.";
    const productionOtherErrors = validateServerList(form.production_otherServers);
    newErrors.production_other = productionOtherErrors;

    if (form.backup === "Yes" && !form.backup_retention.trim()) {
      newErrors.backup_retention = "This field is required.";
    }

    setErrors(newErrors);

    const anyServerErrors = hasAnyServerErrors([
      stagingWebErrors,
      stagingAppErrors,
      stagingDbErrors,
      stagingOtherErrors,
      productionWebErrors,
      productionAppErrors,
      productionDbErrors,
      productionOtherErrors,
    ]);

    const anyTopLevelErrors = hasAnyTopLevelErrors(newErrors);

    return !anyServerErrors && !anyTopLevelErrors;
  }

    function StagingServerChangeWeb(e) {
        const value = e.target.value;
        const count = parseInt(value) || 0;
        setForm((prev) => {
            const servers = [...prev.staging_webServers];
            while (servers.length < count) servers.push(makeEmptyServer(false));
            servers.length = count;
            return { ...prev, staging_web_count: value, staging_webServers: servers };
        });
    }

    function StagingServerChangeApp(e) {
        const value = e.target.value;
        const count = parseInt(value) || 0;
        setForm((prev) => {
            const servers = [...prev.staging_appServers];
            while (servers.length < count) servers.push(makeEmptyServer(false));
            servers.length = count;
            return { ...prev, staging_app_count: value, staging_appServers: servers };
        });
    }


    function StagingServerChangeDB(e) {
        const value = e.target.value;
        const count = parseInt(value) || 0;
        setForm((prev) => {
            const servers = [...prev.staging_dbServers];
            while (servers.length < count) servers.push(makeEmptyServer(true));
            servers.length = count;
            return { ...prev, staging_db_count: value, staging_dbServers: servers };
        });
    }

    function StagingServerChangeOther(e) {
        const value = e.target.value;
        const count = parseInt(value) || 0;
        setForm((prev) => {
            const servers = [...prev.staging_otherServers];
            while (servers.length < count) servers.push(makeEmptyServer(false));
            servers.length = count;
            return { ...prev, staging_other_count: value, staging_otherServers: servers };
        });
    }

    function ProductionServerChangeWeb(e) {
        const value = e.target.value;
        const count = parseInt(value) || 0;
        setForm((prev) => {
            const servers = [...prev.production_webServers];
            while (servers.length < count) servers.push(makeEmptyServer(false));
            servers.length = count;
            return { ...prev, production_web_count: value, production_webServers: servers };
        });
    }

    function ProductionServerChangeApp(e) {
        const value = e.target.value;
        const count = parseInt(value) || 0;
        setForm((prev) => {
            const servers = [...prev.production_appServers];
            while (servers.length < count) servers.push(makeEmptyServer(false));
            servers.length = count;
            return { ...prev, production_app_count: value, production_appServers: servers };
        });
    }

    function ProductionServerChangeDB(e) {
        const value = e.target.value;
        const count = parseInt(value) || 0;
        setForm((prev) => {
            const servers = [...prev.production_dbServers];
            while (servers.length < count) servers.push(makeEmptyServer(true));
            servers.length = count;
            return { ...prev, production_db_count: value, production_dbServers: servers };
        });
    }

    function ProductionServerChangeOther(e) {
        const value = e.target.value;
        const count = parseInt(value) || 0;
        setForm((prev) => {
            const servers = [...prev.production_otherServers];
            while (servers.length < count) servers.push(makeEmptyServer(false));
            servers.length = count;
            return { ...prev, production_other_count: value, production_otherServers: servers };
        });
    }


    function StagingWebFieldChange(index, field, value) {
        setForm((prev) => {
            const servers = [...prev.staging_webServers];
            servers[index] = { ...servers[index], [field]: value };
            return { ...prev, staging_webServers: servers };
        });
    }

    function StagingAppFieldChange(index, field, value) {
        setForm((prev) => {
            const servers = [...prev.staging_appServers];
            servers[index] = { ...servers[index], [field]: value };
            return { ...prev, staging_appServers: servers };
        });
    }

    function StagingDbFieldChange(index, field, value) {
        setForm((prev) => {
            const servers = [...prev.staging_dbServers];
            servers[index] = { ...servers[index], [field]: value };
            return { ...prev, staging_dbServers: servers };
        });
    }

    function StagingOtherFieldChange(index, field, value) {
        setForm((prev) => {
            const servers = [...prev.staging_otherServers];
            servers[index] = { ...servers[index], [field]: value };
            return { ...prev, staging_otherServers: servers };
        });
    }


    function ProductionWebFieldChange(index, field, value) {
        setForm((prev) => {
            const servers = [...prev.production_webServers];
            servers[index] = { ...servers[index], [field]: value };
            return { ...prev, production_webServers: servers };
        });
    }

    function ProductionAppFieldChange(index, field, value) {
        setForm((prev) => {
            const servers = [...prev.production_appServers];
            servers[index] = { ...servers[index], [field]: value };
            return { ...prev, production_appServers: servers };
        });
    }

    function ProductionDbFieldChange(index, field, value) {
        setForm((prev) => {
            const servers = [...prev.production_dbServers];
            servers[index] = { ...servers[index], [field]: value };
            return { ...prev, production_dbServers: servers };
        });
    }

    function ProductionOtherFieldChange(index, field, value) {
        setForm((prev) => {
            const servers = [...prev.production_otherServers];
            servers[index] = { ...servers[index], [field]: value };
            return { ...prev, production_otherServers: servers };
        });
    }


   async function Nextpage() {
    if (!validateForm()) return;
    setError("");
    if (!ids.appId) {
        setError("Application record not found yet — please complete earlier steps first.");
        return;
    }
    setSaving(true);
    try {
        const payload = { ...form, app_id: ids.appId };
        if (ids.infraId) {
            await apiPut(`/infra/${ids.infraId}`, payload);
        } else {
            const res = await apiPost("/infra", payload);
            setId("infraId", res.id);
        }
        navigate("/hardwaredetails");
    } catch (err) {
        console.error(err);
        setError("Could not save Infrastructure Details.");
    } finally {
        setSaving(false);
    }
}

    

    function Backpage() {
        navigate("/certificatedetails");
    }

    function renderServerBlock(servers, onFieldChange, isDatabase, label, errorList) {
        return servers.map((server, index) => {
            const fieldErrors = (errorList && errorList[index]) || {};
            return (
                <div className="form-section-grid" key={index}>
                    <div className="form-row full-width">
                        <h4 className="server-block-heading">{label} {index + 1} Configuration Details : </h4>
                    </div>

                    <div className="form-row">
                        <label className="required">Processor</label>
                        <input
                            type="text"
                            value={server.processor}
                            onChange={(e) => onFieldChange(index, "processor", e.target.value)}
                            placeholder="i.e. 2-core, 4-core, 8-core"
                        />
                        {fieldErrors.processor && <p className="error-message">{fieldErrors.processor}</p>}
                    </div>

                    <div className="form-row">
                        <label className="required">RAM</label>
                        <input
                            type="text"
                            value={server.ram}
                            onChange={(e) => onFieldChange(index, "ram", e.target.value)}
                            placeholder="i.e. 16 GB, 32 GB etc"
                        />
                        {fieldErrors.ram && <p className="error-message">{fieldErrors.ram}</p>}
                    </div>

                    <div className="form-row">
                        <label className="required">Internal Storage</label>
                        <input
                            type="text"
                            value={server.internal_storage}
                            onChange={(e) => onFieldChange(index, "internal_storage", e.target.value)}
                            placeholder="i.e. 100 GB, 500 GB, 1TB etc"
                        />
                        {fieldErrors.internal_storage && <p className="error-message">{fieldErrors.internal_storage}</p>}
                    </div>

                    <div className="form-row">
                        <label className="required">External Storage</label>
                        <select
                            value={server.external_storage}
                            onChange={(e) => onFieldChange(index, "external_storage", e.target.value)}
                        >
                            <option value="">-- Select --</option>
                            <option value="SAN">SAN</option>
                            <option value="NAS">NAS</option>
                            <option value="Unified">Unified</option>
                            <option value="Other">Other</option>
                        </select>

                        {server.external_storage === "Other" && (
                            <input
                                type="text"
                                value={server.external_storage_other}
                                onChange={(e) => onFieldChange(index, "external_storage_other", e.target.value)}
                                placeholder="Please specify"
                            />
                        )}
                        {fieldErrors.external_storage && <p className="error-message">{fieldErrors.external_storage}</p>}
                        {fieldErrors.external_storage_other && <p className="error-message">{fieldErrors.external_storage_other}</p>}
                    </div>

                    <div className="form-row">
                        <label className="required">Operating System</label>
                        <select
                            value={server.os}
                            onChange={(e) => onFieldChange(index, "os", e.target.value)}
                        >
                            <option value="">-- Select --</option>
                            <option value="Windows Server Standard">Windows Server Standard</option>
                            <option value="RHEL Standard">RHEL Standard</option>
                            <option value="Linux Community">Linux Community</option>
                        </select>
                        {fieldErrors.os && <p className="error-message">{fieldErrors.os}</p>}
                    </div>

                    {isDatabase && (
                        <div className="form-row">
                            <label className="required">Database Version</label>
                            <input
                                type="text"
                                value={server.version}
                                onChange={(e) => onFieldChange(index, "version", e.target.value)}
                                placeholder="i.e. Oracle10g, Sql 2005 etc"
                            />
                            {fieldErrors.version && <p className="error-message">{fieldErrors.version}</p>}
                        </div>
                    )}
                </div>
            );
        });
    }

    return (
        <Layout>
            <div className="form-container">
                <h2 className="section-heading">Infrastructure Requirements (Annexure-5)</h2>

                {error && <p className="form-error">{error}</p>}

                <div className="form-section">
                    <div className="section-header">
                        <span className="section-badge">5.1</span>
                        <h3>VM / Server Requirements</h3>
                    </div>
                    <p className="maintenance-text">Note: Fill 0 if not required.</p>

                    <div className="form-subsection">
                        <div className="subsection-header">
                            <span className="subsection-badge">A</span>
                            <h3>For Staging Server</h3>
                        </div>

                        <div className="form-section-grid">
                            <div className="form-row">
                                <label className="required">No. of Web Servers</label>
                                <input type="number" min="0" placeholder="Enter Number of Web Servers" value={form.staging_web_count} onChange={StagingServerChangeWeb} />
                                {errors.staging_web_count && <p className="error-message">{errors.staging_web_count}</p>}
                            </div>

                            <div className="form-row">
                                <label className="required">No. of Application Servers</label>
                                <input type="number" min="0" placeholder="Enter Number of Application Servers" value={form.staging_app_count} onChange={StagingServerChangeApp} />
                                {errors.staging_app_count && <p className="error-message">{errors.staging_app_count}</p>}
                                <p className="maintenance-text">Note : If application is having 3 tier architecture then specify Number of App Servers.</p>
                            </div>

                            <div className="form-row">
                                <label className="required">No. of Database Servers</label>
                                <input type="number" min="0" placeholder="Enter Number of Database Servers" value={form.staging_db_count} onChange={StagingServerChangeDB} />
                                {errors.staging_db_count && <p className="error-message">{errors.staging_db_count}</p>}
                            </div>

                            <div className="form-row">
                                <label className="required">No. of Other Servers</label>
                                <input type="number" min="0" placeholder="Enter Number of Other Servers" value={form.staging_other_count} onChange={StagingServerChangeOther} />
                                {errors.staging_other_count && <p className="error-message">{errors.staging_other_count}</p>}
                            </div>
                        </div>
                        {renderServerBlock(form.staging_webServers, StagingWebFieldChange, false, "Web Server", errors.staging_web)}
                        {renderServerBlock(form.staging_appServers, StagingAppFieldChange, false, "Application Server", errors.staging_app)}
                        {renderServerBlock(form.staging_dbServers, StagingDbFieldChange, true, "Database Server", errors.staging_db)}
                        {renderServerBlock(form.staging_otherServers, StagingOtherFieldChange, false, "Other Server", errors.staging_other)}
                    </div>

                    <div className="form-subsection">
                        <div className="subsection-header">
                            <span className="subsection-badge">B</span>
                            <h3>For Production Server</h3>
                        </div>

                        <div className="form-section-grid">
                            <div className="form-row">
                                <label className="required">No. of Web Servers</label>
                                <input type="number" min="0" placeholder="Enter Number of Web Servers" value={form.production_web_count} onChange={ProductionServerChangeWeb} />
                                {errors.production_web_count && <p className="error-message">{errors.production_web_count}</p>}
                            </div>

                            <div className="form-row">
                                <label className="required">No. of Application Servers</label>
                                <input type="number" min="0" placeholder="Enter Number of Application Servers" value={form.production_app_count} onChange={ProductionServerChangeApp} />
                                {errors.production_app_count && <p className="error-message">{errors.production_app_count}</p>}
                                <p className="maintenance-text">Note : If application is having 3 tier architecture then specify Number of App Servers.</p>
                            </div>

                            <div className="form-row">
                                <label className="required">No. of Database Servers</label>
                                <input type="number" min="0" placeholder="Enter Number of Database Servers" value={form.production_db_count} onChange={ProductionServerChangeDB} />
                                {errors.production_db_count && <p className="error-message">{errors.production_db_count}</p>}
                            </div>

                            <div className="form-row">
                                <label className="required">No. of Other Servers</label>
                                <input type="number" min="0" placeholder="Enter Number of Other Servers" value={form.production_other_count} onChange={ProductionServerChangeOther} />
                                {errors.production_other_count && <p className="error-message">{errors.production_other_count}</p>}
                            </div>
                        </div>

                        {renderServerBlock(form.production_webServers, ProductionWebFieldChange, false, "Web Server", errors.production_web)}
                        {renderServerBlock(form.production_appServers, ProductionAppFieldChange, false, "Application Server", errors.production_app)}
                        {renderServerBlock(form.production_dbServers, ProductionDbFieldChange, true, "Database Server", errors.production_db)}
                        {renderServerBlock(form.production_otherServers, ProductionOtherFieldChange, false, "Other Server", errors.production_other)}
                    </div>
                </div>

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
                                <label>Specify Details</label>
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

export default InfraDetails;

