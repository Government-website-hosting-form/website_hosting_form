import { useState } from "react";
import "./InfraDetails.css";
import FormButtons from "../components/FormButtons";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useFormContext } from "../context/FormContext";
import { apiPost } from "../api";

const emptyServer = { processor: "", ram: "", storage: "", os: "" };

const initialState = {
  staging_web_count: "",
  staging_app_count: "",
  staging_db_count: "",
  staging_other_count: "",
  staging_webServers: [],
  staging_appServers: [],
  staging_dbServers: [],
  staging_otherServers: [],

  production_web_count: "",
  production_app_count: "",
  production_db_count: "",
  production_other_count: "",
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
        arr.push(type === "db" ? { processor: "", ram: "", storage: "", os: "", version: "" } : { processor: "", ram: "", storage: "", os: "" });
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

  async function Nextpage() {
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
function renderServerBlock(env, type, label) {
  const servers = form[`${env}_${type}Servers`];
  return servers.map((server, index) => (
    <div className="form-section-grid" key={index}>
    <div className="form-row full-width">
  <h4 className="server-block-heading">{label} {index + 1} Configuration Details : </h4>
</div>

      <div className="form-row">
        <label>Processor</label>
        <input
          type="text"
          value={server.processor}
          onChange={(e) => handleServerFieldChange(env, type, index, "processor", e.target.value)}
          placeholder="Enter Processor Details"
        />
      </div>

      <div className="form-row">
        <label>RAM</label>
        <input
          type="text"
          value={server.ram}
          onChange={(e) => handleServerFieldChange(env, type, index, "ram", e.target.value)}
          placeholder="Enter RAM Capacity"
        />
      </div>

      <div className="form-row">
        <label>Storage Space</label>
        <input
          type="text"
          value={server.storage}
          onChange={(e) => handleServerFieldChange(env, type, index, "storage", e.target.value)}
          placeholder="Enter Storage Space"
        />
      </div>

      <div className="form-row">
        <label>Operating System</label>
        <input
          type="text"
          value={server.os}
          onChange={(e) => handleServerFieldChange(env, type, index, "os", e.target.value)}
          placeholder="Enter Operating System"
        />
      </div>

      {type === "db" && (
        <div className="form-row">
          <label>Database Version</label>
          <input
            type="text"
            value={server.version}
            onChange={(e) => handleServerFieldChange(env, type, index, "version", e.target.value)}
            placeholder="Enter Database Version"
          />
        </div>
      )}
    </div>
  ));
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

  <div className="form-subsection">
    <div className="subsection-header">
      <span className="subsection-badge">A</span>
      <h3>For Staging Server</h3>
    </div>

    <div className="form-section-grid">
      <div className="form-row">
        <label>No. of Web Servers</label>
        <input type="number" min="0" placeholder="Enter Number of Web Servers" value={form.staging_web_count} onChange={(e) => handleCountChange("staging", "web", e.target.value)} />
      </div>

      <div className="form-row">
        <label>No. of Application Servers</label>
        <input type="number" min="0" placeholder="Enter Number of Application Servers" value={form.staging_app_count} onChange={(e) => handleCountChange("staging", "app", e.target.value)} />
      </div>

      <div className="form-row">
        <label>No. of Database Servers</label>
        <input type="number" min="0" placeholder="Enter Number of Database Servers" value={form.staging_db_count} onChange={(e) => handleCountChange("staging", "db", e.target.value)} />
      </div>

      <div className="form-row">
        <label>No. of Other Servers</label>
        <input type="number" min="0" placeholder="Enter Number of Other Servers" value={form.staging_other_count} onChange={(e) => handleCountChange("staging", "other", e.target.value)} />
      </div>
    </div>

    {renderServerBlock("staging", "web", "Web Server")}
    {renderServerBlock("staging", "app", "Application Server")}
    {renderServerBlock("staging", "db", "Database Server")}
    {renderServerBlock("staging", "other", "Other Server")}
  </div>

  <div className="form-subsection">
    <div className="subsection-header">
      <span className="subsection-badge">B</span>
      <h3>For Production Server</h3>
    </div>

    <div className="form-section-grid">
      <div className="form-row">
        <label>No. of Web Servers</label>
        <input type="number" min="0" placeholder="Enter Number of Web Servers" value={form.production_web_count} onChange={(e) => handleCountChange("production", "web", e.target.value)} />
      </div>

      <div className="form-row">
        <label>No. of Application Servers</label>
        <input type="number" min="0" placeholder="Enter Number of Application Servers" value={form.production_app_count} onChange={(e) => handleCountChange("production", "app", e.target.value)} />
      </div>

      <div className="form-row">
        <label>No. of Database Servers</label>
        <input type="number" min="0" placeholder="Enter Number of Database Servers" value={form.production_db_count} onChange={(e) => handleCountChange("production", "db", e.target.value)} />
      </div>

      <div className="form-row">
        <label>No. of Other Servers</label>
        <input type="number" min="0" placeholder="Enter Number of Other Servers" value={form.production_other_count} onChange={(e) => handleCountChange("production", "other", e.target.value)} />
      </div>
    </div>

    {renderServerBlock("production", "web", "Web Server")}
    {renderServerBlock("production", "app", "Application Server")}
    {renderServerBlock("production", "db", "Database Server")}
    {renderServerBlock("production", "other", "Other Server")}
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
        <input type="text" name="software" value={form.software} onChange={handleChange} placeholder="Example: Apache, IIS, Nginx" />
      </div>

      <div className="form-row">
        <label>Application Server with Version</label>
        <input type="text" name="app_server_software" value={form.app_server_software} onChange={handleChange} placeholder="Example: Tomcat, JBoss" />
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
        <textarea rows="4" name="integration_software" value={form.integration_software} onChange={handleChange} placeholder="Example: DMS, GIS, SMS Gateway etc."></textarea>
      </div>
    </div>
  </div>
</div>

        <div className="form-section">
          <div className="section-header">
            <span className="section-badge">5.3</span>
            <h3>Network & Access Requirements</h3>
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
              <div className="form-row">
                <label>Provide Real IP</label>
                <input type="text" name="sftp_ip" value={form.sftp_ip} onChange={handleChange} placeholder="Enter Real IP" />
              </div>
            )}

            <div className="form-row">
              <label>Proposed SFTP User Name demanded by the Department</label>
              <input type="text" name="sftp_username" value={form.sftp_username} onChange={handleChange} placeholder="Enter Proposed SFTP User Name" />
            </div>

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

            <div className="form-row">
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

            <div className="form-row">
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
                <label>Retention Period Approved from Department</label>
                <input type="text" name="backup_retention" value={form.backup_retention} onChange={handleChange} />
              </div>
            )}
          </div>
        </div>
      </div>

      <FormButtons
        showBack={true}
        onBack={Backpage}
        onNext={Nextpage}
        disabled={saving} saving={saving}
      />
    </Layout>
  );
}

export default InfraDetails;