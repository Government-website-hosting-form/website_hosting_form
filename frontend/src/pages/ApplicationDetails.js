import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import FormButtons from "../components/FormButtons";
import "./ApplicationDetails.css";
import { useFormContext } from "../context/FormContext";
import { apiPost } from "../api";

// Field names match the `apps` table columns in web_hosting_db_flow.xlsx
const initialState = {
  name: "",
  type: "",
  nature: "",
  utility: "",
  purpose: "",
  subdomain: "",
  url: "",
  alternate_url: "",
  approval_authority: "",
  approval_designation: "",
  semt_approved: "No",
  mom_ref_no: "",
  mom_date: "",
};

function ApplicationDetails() {
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
    setSaving(true);
    try {
      const payload = {
        ...form,
        org_id: ids.orgId || null,
        user_id: ids.userId || null,
      };
      // This page creates the `apps` row. Later pages (MainDetails,
      // CertificateDetails) will PUT more fields onto this same row.
      const res = await apiPost("/apps", payload);
      setId("appId", res.id);
      navigate("/maindetails");
    } catch (err) {
      console.error(err);
      setError("Could not save Application Details. Please check the backend server and try again.");
    } finally {
      setSaving(false);
    }
  }

  function Backpage() {
    navigate("/organization");
  }

  return (
    <Layout>

      <div className="form-container">

        <h2 className="section-heading">
           Application Details (Annexure-2)
        </h2>

        {error && <p className="form-error">{error}</p>}

        <div className="form-row">
          <label>Application Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter Application Name"
          />
        </div>

        <div className="form-row">
          <label>Type of Application</label>

          <div className="radio-group">
            <label><input type="radio" name="type" value="Website" checked={form.type === "Website"} onChange={handleChange} /> Website</label>
            <label><input type="radio" name="type" value="Portal" checked={form.type === "Portal"} onChange={handleChange} /> Portal</label>
            <label><input type="radio" name="type" value="Application" checked={form.type === "Application"} onChange={handleChange} /> Application</label>
            <label><input type="radio" name="type" value="Other" checked={form.type === "Other"} onChange={handleChange} /> Other</label>
          </div>
        </div>

        <div className="form-row">
          <label>Nature of Application</label>

          <div className="radio-group">
            <label><input type="radio" name="nature" value="G2G" checked={form.nature === "G2G"} onChange={handleChange} /> G2G</label>
            <label><input type="radio" name="nature" value="G2B" checked={form.nature === "G2B"} onChange={handleChange} /> G2B</label>
            <label><input type="radio" name="nature" value="G2C" checked={form.nature === "G2C"} onChange={handleChange} /> G2C</label>
          </div>
        </div>

        <div className="form-row">
          <label>Application Utility</label>

          <div className="radio-group">
            <label><input type="radio" name="utility" value="Budget Announcement" checked={form.utility === "Budget Announcement"} onChange={handleChange} /> Budget Announcement</label>
            <label><input type="radio" name="utility" value="CM Announcement" checked={form.utility === "CM Announcement"} onChange={handleChange} /> CM Announcement</label>
            <label><input type="radio" name="utility" value="General Application" checked={form.utility === "General Application"} onChange={handleChange} /> General Application</label>
            <label><input type="radio" name="utility" value="Other Priority Event" checked={form.utility === "Other Priority Event"} onChange={handleChange} /> Other Priority Event</label>
          </div>
        </div>

        <div className="form-row">
          <label>Purpose of Application</label>

          <textarea
            rows="5"
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            placeholder="Enter the purpose of the application"
          ></textarea>

          <p className="maintenance-text">
            Please also attach a brief note about the application as per Annexure-6.
          </p>
        </div>

        <div className="form-row">
          <label>Proposed Sub Domain ( xyz.rajasthan.gov.in) :</label>
          <input
            type="text"
            name="subdomain"
            value={form.subdomain}
            onChange={handleChange}
            placeholder="Enter proposed sub domain"
          />
        </div>

        <div className="form-row">
          <label>Approved Primary URL from Department</label>
          <input
            type="text"
            name="url"
            value={form.url}
            onChange={handleChange}
            placeholder="Enter approved primary URL"
          />
        </div>

        <div className="form-row">
          <label>Alternate URL</label>
          <input
            type="text"
            name="alternate_url"
            value={form.alternate_url}
            onChange={handleChange}
            placeholder="Enter alternate URL"
          />

          <p className="maintenance-text">
            Alternate URL will be assigned if the primary URL is not available.
          </p>
        </div>

        <div className="form-row">
          <label>Domain Name Approval :</label>
        </div>

        <div className="two-column">

          <div className="form-row">
            <label>Authority Name</label>
            <input type="text" name="approval_authority" value={form.approval_authority} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Designation</label>
            <input type="text" name="approval_designation" value={form.approval_designation} onChange={handleChange} />
          </div>

        </div>

        <div className="form-row">
          <label>Attach Approval Document (if available)</label>
          <input type="file" />
          <p className="maintenance-text">
            File uploads aren't wired up to the backend yet — this field is UI-only for now.
          </p>
        </div>

        <div className="form-row">
          <label>SEMT / Administrative Approval for Project :</label>
        </div>
        

        <div className="form-row">

          <div className="radio-group">
            <label><input type="radio" name="semt_approved" value="Yes" checked={form.semt_approved === "Yes"} onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="semt_approved" value="No" checked={form.semt_approved === "No"} onChange={handleChange} /> No</label>
          </div>
        </div>

        <div className="two-column">

          <div className="form-row">
            <label>MoM / Document Reference No.</label>
            <input type="text" name="mom_ref_no" value={form.mom_ref_no} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Date</label>
            <input type="date" name="mom_date" value={form.mom_date} onChange={handleChange} />
          </div>

        </div>

        <div className="form-row">
          <label>Attach MoM / Document</label>
          <input type="file" />
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

export default ApplicationDetails;