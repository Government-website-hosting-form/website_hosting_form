import { useState } from "react";
import "./InfraDetails.css";
import FormButtons from "../components/FormButtons";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useFormContext } from "../context/FormContext";
import { apiPost } from "../api";


const initialState = {
  web_processor: "",
  web_ram: "",
  web_storage: "",
  web_os: "",
  app_processor: "",
  app_ram: "",
  app_storage: "",
  app_os: "",
  db_processor: "",
  db_ram: "",
  db_storage: "",
  db_os: "",
  db_version: "",
  other_server_note: "",
  software: "",
  app_server_software: "",
  integration_software: "",
  sftp_needed: "No",
  sftp_ip: "",
  sftp_username: "",
  public_ip: "",
  dns_entry: "Private",
  apm_required: "No",
  backup: "No",
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

  async function Nextpage() {
    setError("");
    if (!ids.appId) {
      setError("Application record not found yet — please complete earlier steps first.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, app_id: ids.appId };
      // This page creates the `infra` row. HardwareDetails and SslDetails
      // will PUT more fields onto this same row.
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

  return (
    <Layout>
      <div className="form-container">

        <h2 className="section-heading">
          Infrastructure Requirements for Application Hosting in SDC Environment
        </h2>

        {error && <p className="form-error">{error}</p>}

        <h2>A. VM (Server) requirements</h2>
        <hr/>
        <h3>Specify No of Servers (Each Web/App/DB/Other):-</h3>

       
        <h3>1. Web Server Configuration</h3>

        <div className="two-column">

          <div className="form-row">
            <label>Processor</label>
            <input type="text" name="web_processor" value={form.web_processor} onChange={handleChange} placeholder="Enter Processor Details" />
          </div>

          <div className="form-row">
            <label>RAM</label>
            <input type="text" name="web_ram" value={form.web_ram} onChange={handleChange} placeholder="Enter RAM Capacity" />
          </div>

          </div>

        <div className="two-column">

          <div className="form-row">
            <label>Storage Space</label>
            <input type="text" name="web_storage" value={form.web_storage} onChange={handleChange} placeholder="Enter Storage Space" />
          </div>

          <div className="form-row">
            <label>Operating System</label>
            <input type="text" name="web_os" value={form.web_os} onChange={handleChange} placeholder="Enter Operating System" />
          </div>

        </div>

      <h3>2.Application Server Configuration</h3>

        
        <div className="two-column">

          <div className="form-row">
            <label>Processor</label>
            <input type="text" name="app_processor" value={form.app_processor} onChange={handleChange} placeholder="Enter Processor Details" />
          </div>

          <div className="form-row">
            <label>RAM</label>
            <input type="text" name="app_ram" value={form.app_ram} onChange={handleChange} placeholder="Enter RAM Capacity" />
          </div>

          </div>

        <div className="two-column">

          <div className="form-row">
            <label>Storage Space</label>
            <input type="text" name="app_storage" value={form.app_storage} onChange={handleChange} placeholder="Enter Storage Space" />
          </div>

          <div className="form-row">
            <label>Operating System</label>
            <input type="text" name="app_os" value={form.app_os} onChange={handleChange} placeholder="Enter Operating System" />
          </div>

        </div>

         <h3>3. Database Server Configuration</h3>

          <div className="two-column">

          <div className="form-row">
            <label>Processor</label>
            <input type="text" name="db_processor" value={form.db_processor} onChange={handleChange} placeholder="Enter Processor Details" />
          </div>

          <div className="form-row">
            <label>RAM</label>
            <input type="text" name="db_ram" value={form.db_ram} onChange={handleChange} placeholder="Enter RAM Capacity" />
          </div>

          </div>

        <div className="two-column">

          <div className="form-row">
            <label>Storage Space</label>
            <input type="text" name="db_storage" value={form.db_storage} onChange={handleChange} placeholder="Enter Storage Space" />
          </div>

          <div className="form-row">
            <label>Operating System</label>
            <input type="text" name="db_os" value={form.db_os} onChange={handleChange} placeholder="Enter Operating System" />
          </div>

        </div>
        
        <div className="two-column">
        <div className="form-row">
            <label>Database Version</label>
            <input type="text" name="db_version" value={form.db_version} onChange={handleChange} placeholder="Enter Database Version" />
          </div>
        </div>
        


          <div className="form-row">
            <label>Any Other Server Required Also Specify the Usage </label>
            <input type="text" name="other_server_note" value={form.other_server_note} onChange={handleChange} />
          </div>

        <h2>B. Software requirements for hosting</h2>
        <hr/>

       <h3>Other Software Requirements for Hosting</h3>

<div className="form-row">
  <label>Web Server Software with Version</label>
  <input type="text" name="software" value={form.software} onChange={handleChange} placeholder="Example: Apache, IIS, Nginx" />
</div>

<div className="form-row">
  <label>Application Server with Version</label>
  <input type="text" name="app_server_software" value={form.app_server_software} onChange={handleChange} placeholder="Example: Tomcat, JBoss" />
</div>

<h3>Integration with Other Software Systems Required</h3>

<div className="form-row">
  <label>Specify details of the Software</label>
  <textarea rows="4" name="integration_software" value={form.integration_software} onChange={handleChange} placeholder="Example: DMS, GIS, SMS Gateway etc."></textarea>
</div>

<h2 className="section-heading">
       SFTP Access Required in Demilitarized Zone
</h2>



<div className="form-row">
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

<div className="form-row">
  <label>If Yes, Provide Real IP</label>
  <input type="text" name="sftp_ip" value={form.sftp_ip} onChange={handleChange} placeholder="Enter Real IP " />
</div>

<div className="form-row">
  <label>Proposed SFTP User Name demanded by the Department</label>
  <input type="text" name="sftp_username" value={form.sftp_username} onChange={handleChange} placeholder="Enter Proposed SFTP User Name" />
</div>

<div className="form-row">
  <label>Public IP</label>
  <input type="text" name="public_ip" value={form.public_ip} onChange={handleChange} placeholder="Enter Public IP Address" />
</div>

<div className="form-row">
  <label>DNS Entry (Private / Public)</label>
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
  <label>
    Application Performance Management (APM)  for monitoring performance and availability Required :-
  </label>

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
  <label>Backup Services Required:-</label>

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

<div className="form-row">
  <label>If required than what is the retention period approved from respective department.
</label>
  <input type="text" name="backup_retention" value={form.backup_retention} onChange={handleChange} />
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
