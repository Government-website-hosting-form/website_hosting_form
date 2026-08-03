import { useState } from "react";
import "./InfraDetails.css";
import FormButtons from "../components/FormButtons";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useFormContext } from "../context/FormContext";
import { apiPost } from "../api";

const emptyServer = { processor: "", ram: "", storage: "", os: "" };

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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  function handleCountChange(env, type, value) {
    const count = parseInt(value) || 0;
    setForm((prev) => {
      const countKey = `${env}_${type}_count`;
      const listKey = `${env}_${type}Servers`;
      const arr = [...prev[listKey]];
      while (arr.length < count) {
        arr.push(type === "db"? { processor: "", ram: "", internal_storage: "", external_storage: "", external_storage_other: "", os: "", version: "" } : { processor: "", ram: "", internal_storage: "", external_storage: "", external_storage_other: "", os: "" }
);
      }
      arr.length = count;
      return { ...prev, [countKey]: value, [listKey]: arr };
});
  }
  function handleServerFieldChange(env, type, index, field, value) {
    setForm((prev) => {
      const key = `${env}_${type}Servers`;
      const arr = [...prev[key]];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [key]: arr };
    });
  }

  function validateServerList(servers, envType, newErrors) {
  servers.forEach((server, index) => {
    const prefix = `${envType}_${index}`;

    if (!server.processor.trim()) newErrors[`${prefix}_processor`] = "This field is required.";
    if (!server.ram.trim()) newErrors[`${prefix}_ram`] = "This field is required.";
    if (!server.internal_storage.trim()) newErrors[`${prefix}_internal_storage`] = "This field is required.";
    if (!server.external_storage) newErrors[`${prefix}_external_storage`] = "This field is required.";
    if (server.external_storage === "Other" && !server.external_storage_other.trim()) {
      newErrors[`${prefix}_external_storage_other`] = "Please specify.";
    }
    if (!server.os) newErrors[`${prefix}_os`] = "This field is required.";
    if (server.version !== undefined && !server.version.trim()) {
      newErrors[`${prefix}_version`] = "This field is required.";
    }
  });
}

  function validateForm() {
  const newErrors = {};

  if (!form.staging_web_count.toString().trim()) newErrors.staging_web_count = "This field is required.";
  validateServerList(form.staging_webServers, "staging_web", newErrors);
  if (!form.staging_app_count.toString().trim()) newErrors.staging_app_count = "This field is required.";
  validateServerList(form.staging_appServers, "staging_app", newErrors);
  if (!form.staging_db_count.toString().trim()) newErrors.staging_db_count = "This field is required.";
  validateServerList(form.staging_dbServers, "staging_db", newErrors);
  if (!form.staging_other_count.toString().trim()) newErrors.staging_other_count = "This field is required.";
  validateServerList(form.staging_otherServers, "staging_other", newErrors);

  if (!form.production_web_count.toString().trim()) newErrors.production_web_count = "This field is required.";
  validateServerList(form.production_webServers, "production_web", newErrors);
  if (!form.production_app_count.toString().trim()) newErrors.production_app_count = "This field is required.";
  validateServerList(form.production_appServers, "production_app", newErrors);
  if (!form.production_db_count.toString().trim()) newErrors.production_db_count = "This field is required.";
  validateServerList(form.production_dbServers, "production_db", newErrors);
  if (!form.production_other_count.toString().trim()) newErrors.production_other_count = "This field is required.";
  validateServerList(form.production_otherServers, "production_other", newErrors);

  if (form.backup === "Yes" && !form.backup_retention.trim()) {
    newErrors.backup_retention = "This field is required.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
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
      const res = await apiPost("/infra", payload);
      setId("infraId", res.id);
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
 function renderServerBlock(env, type, label, errors) {
  const servers = form[`${env}_${type}Servers`];
  return servers.map((server, index) => {
    const prefix = `${env}_${type}_${index}`;
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
            onChange={(e) => handleServerFieldChange(env, type, index, "processor", e.target.value)}
            placeholder="i.e. 2-core, 4-core, 8-core"
          />
          {errors[`${prefix}_processor`] && <p className="error-message">{errors[`${prefix}_processor`]}</p>}
        </div>

        <div className="form-row">
          <label className="required">RAM</label>
          <input
            type="text"
            value={server.ram}
            onChange={(e) => handleServerFieldChange(env, type, index, "ram", e.target.value)}
            placeholder="i.e. 16 GB, 32 GB etc"
          />
          {errors[`${prefix}_ram`] && <p className="error-message">{errors[`${prefix}_ram`]}</p>}
        </div>

        <div className="form-row">
          <label className="required">Internal Storage</label>
          <input
            type="text"
            value={server.internal_storage}
            onChange={(e) => handleServerFieldChange(env, type, index, "internal_storage", e.target.value)}
            placeholder="i.e. 100 GB, 500 GB, 1TB etc"
          />
          {errors[`${prefix}_internal_storage`] && <p className="error-message">{errors[`${prefix}_internal_storage`]}</p>}
        </div>

        <div className="form-row">
          <label className="required">External Storage</label>
          <select
            value={server.external_storage}
            onChange={(e) => handleServerFieldChange(env, type, index, "external_storage", e.target.value)}
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
              onChange={(e) => handleServerFieldChange(env, type, index, "external_storage_other", e.target.value)}
              placeholder="Please specify"
            />
          )}
          {errors[`${prefix}_external_storage`] && <p className="error-message">{errors[`${prefix}_external_storage`]}</p>}
          {errors[`${prefix}_external_storage_other`] && <p className="error-message">{errors[`${prefix}_external_storage_other`]}</p>}
        </div>

        <div className="form-row">
          <label className="required">Operating System</label>
          <select
            value={server.os}
            onChange={(e) => handleServerFieldChange(env, type, index, "os", e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="Windows Server Standard">Windows Server Standard</option>
            <option value="RHEL Standard">RHEL Standard</option>
            <option value="Linux Community">Linux Community</option>
          </select>
          {errors[`${prefix}_os`] && <p className="error-message">{errors[`${prefix}_os`]}</p>}
        </div>

        {type === "db" && (
          <div className="form-row">
            <label className="required">Database Version</label>
            <input
              type="text"
              value={server.version}
              onChange={(e) => handleServerFieldChange(env, type, index, "version", e.target.value)}
              placeholder="i.e. Oracle10g, Sql 2005 etc"
            />
            {errors[`${prefix}_version`] && <p className="error-message">{errors[`${prefix}_version`]}</p>}
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
                <input type="number" min="0" placeholder="Enter Number of Web Servers" value={form.staging_web_count} onChange={(e) => handleCountChange("staging", "web", e.target.value)} />
                {errors.staging_web_count && <p className="error-message">{errors.staging_web_count}</p>}
              </div>

              <div className="form-row">
                <label className="required">No. of Application Servers</label>
                <input type="number" min="0" placeholder="Enter Number of Application Servers" value={form.staging_app_count} onChange={(e) => handleCountChange("staging", "app", e.target.value)} />
                {errors.staging_app_count && <p className="error-message">{errors.staging_app_count}</p>}
                <p className="maintenance-text">Note : If application is having 3 tier architecture then specify Number of App Servers.</p>
              </div>

              <div className="form-row">
                <label className="required">No. of Database Servers</label>
                <input type="number" min="0" placeholder="Enter Number of Database Servers" value={form.staging_db_count} onChange={(e) => handleCountChange("staging", "db", e.target.value)} />
                {errors.staging_db_count && <p className="error-message">{errors.staging_db_count}</p>}
              </div>

              <div className="form-row">
                <label className="required">No. of Other Servers</label>
                <input type="number" min="0" placeholder="Enter Number of Other Servers" value={form.staging_other_count} onChange={(e) => handleCountChange("staging", "other", e.target.value)} />
                {errors.staging_other_count && <p className="error-message">{errors.staging_other_count}</p>}
              </div>
            </div>
{renderServerBlock("staging", "web", "Web Server", errors)}
{renderServerBlock("staging", "app", "Application Server", errors)}
{renderServerBlock("staging", "db", "Database Server", errors)}
{renderServerBlock("staging", "other", "Other Server", errors)}

          </div>

          <div className="form-subsection">
            <div className="subsection-header">
              <span className="subsection-badge">B</span>
              <h3>For Production Server</h3>
            </div>

            <div className="form-section-grid">
              <div className="form-row">
                <label className="required">No. of Web Servers</label>
                <input type="number" min="0" placeholder="Enter Number of Web Servers" value={form.production_web_count} onChange={(e) => handleCountChange("production", "web", e.target.value)} />
                {errors.production_web_count && <p className="error-message">{errors.production_web_count}</p>}
              </div>

              <div className="form-row">
                <label className="required">No. of Application Servers</label>
                <input type="number" min="0" placeholder="Enter Number of Application Servers" value={form.production_app_count} onChange={(e) => handleCountChange("production", "app", e.target.value)} />
                {errors.production_app_count && <p className="error-message">{errors.production_app_count}</p>}
                <p className="maintenance-text">Note : If application is having 3 tier architecture then specify Number of App Servers.</p>
              </div>

              <div className="form-row">
                <label className="required">No. of Database Servers</label>
                <input type="number" min="0" placeholder="Enter Number of Database Servers" value={form.production_db_count} onChange={(e) => handleCountChange("production", "db", e.target.value)} />
                {errors.production_db_count && <p className="error-message">{errors.production_db_count}</p>}
              </div>

              <div className="form-row">
                <label className="required">No. of Other Servers</label>
                <input type="number" min="0" placeholder="Enter Number of Other Servers" value={form.production_other_count} onChange={(e) => handleCountChange("production", "other", e.target.value)} />
                {errors.production_other_count && <p className="error-message">{errors.production_other_count}</p>}
              </div>
            </div>

            {renderServerBlock("production", "web", "Web Server", errors)}
            {renderServerBlock("production", "app", "Application Server", errors)}
            {renderServerBlock("production", "db", "Database Server", errors)}
            {renderServerBlock("production", "other", "Other Server", errors)}
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