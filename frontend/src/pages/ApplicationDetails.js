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
  type_other: "",
  nature: "",
  utility: "",
  utility_other: "",
  purpose: "",
  subdomain: "",
  url: "",
  alternate_url: "",
  approval_authority: "",
  approval_designation: "",
  semt_approved: "",
  mom_ref_no: "",
  mom_date: "",
};

function ApplicationDetails() {
  const navigate = useNavigate();
  const { ids, setId } = useFormContext();
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [momDoc, setMomDoc] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "This field is required.";
    if (!form.type) newErrors.type = "This field is required.";
    if (!form.nature) newErrors.nature = "This field is required.";
    if (!form.utility) newErrors.utility = "This field is required.";
    if (!form.purpose.trim()) newErrors.purpose = "This field is required.";
    if (!form.url.trim()) newErrors.url = "This field is required.";
    if (!form.alternate_url.trim()) newErrors.alternate_url = "This field is required.";
    if (!form.approval_authority.trim()) newErrors.approval_authority = "This field is required.";
    if (!form.approval_designation.trim()) newErrors.approval_designation = "This field is required.";
    if (!form.semt_approved) newErrors.semt_approved = "This field is required.";

    if (form.semt_approved === "Yes") {
      if (!form.mom_ref_no.trim()) newErrors.mom_ref_no = "This field is required.";
      if (!form.mom_date.trim()) newErrors.mom_date = "This field is required.";
      if (!momDoc) newErrors.momDoc = "Please attach the MoM/Document.";
    }

    if (form.type === "Other" && !form.type_other.trim()) {
      newErrors.type_other = "Please specify the application type.";
    }

    if (form.utility === "Other Priority Event" && !form.utility_other.trim()) {
      newErrors.utility_other = "Please specify the priority event.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function Nextpage() {
    if (!validateForm()) return;
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        org_id: ids.orgId || null,
        user_id: ids.userId || null,
      };

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

        <div className="form-section">
          <div className="section-header">
            <span className="section-badge">2.1</span>
            <h3>Basic Information</h3>
          </div>

          <div className="form-section-grid">
            <div className="form-row">
              <label className="required">Application Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Application Name"
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>

            <div className="form-row">
              <label className="required">Application Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="">-- Select Application Type --</option>
                <option value="Website">Website</option>
                <option value="Portal">Portal</option>
                <option value="Application">Application</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Api">Api</option>
                <option value="Other">Other</option>
              </select>
              {form.type === "Other" && (
                <input
                  type="text"
                  name="type_other"
                  placeholder="Please specify"
                  value={form.type_other}
                  onChange={handleChange}
                  maxLength={100}
                />
              )}
              {errors.type_other && <p className="error-message">{errors.type_other}</p>}
              {errors.type && <p className="error-message">{errors.type}</p>}
            </div>

            <div className="form-row">
              <label className="required">Application Nature</label>
              <select name="nature" value={form.nature} onChange={handleChange}>
                <option value="">-- Select Nature of Application --</option>
                <option value="G2G">G2G</option>
                <option value="G2B">G2B</option>
                <option value="G2C">G2C</option>
              </select>
              {errors.nature && <p className="error-message">{errors.nature}</p>}
            </div>
          </div>
        </div>


        <div className="form-section">
          <div className="section-header">
            <span className="section-badge">2.2</span>
            <h3>Utility and Purpose</h3>
          </div>
          <div className="form-section-grid">
            <div className="form-row">
              <label className="required">Application Utility</label>
              <select name="utility" value={form.utility} onChange={handleChange}>
                <option value="">-- Select Application Utility --</option>
                <option value="Budget Announcement">Budget Announcement</option>
                <option value="CM Announcement">CM Announcement</option>
                <option value="General Application">General Application</option>
                <option value="Other Priority Event">Other Priority Event</option>
              </select>
              {form.utility === "Other Priority Event" && (
                <input
                  type="text"
                  name="utility_other"
                  placeholder="Please specify"
                  value={form.utility_other}
                  onChange={handleChange}
                  maxLength={100}
                />

              )}
              {errors.utility_other && <p className="error-message">{errors.utility_other}</p>}
              {errors.utility && <p className="error-message">{errors.utility}</p>}

            </div>
            <div className="form-row purpose-file">
              <label className="required nowrap">Purpose of Application</label>
              <div className="textarea-wrapper">
                <textarea
                  rows="1"
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  placeholder="Enter brief note about the application"
                  maxLength={500}
                ></textarea>
                <span className="char-counter">
                  {form.purpose.length}/500
                </span>
              </div>
              {errors.purpose && <p className="error-message">{errors.purpose}</p>}

              <input type="file" />


            </div>

          </div>

        </div>


        <div className="form-section">
          <div className="section-header">
            <span className="section-badge">2.3</span>
            <h3>Proposed Sub Domain( xyz.rajasthan.gov.in)</h3>
          </div>

          <div className="form-section-grid">

            <div className="form-row">
              <label className="required">Approved Primary URL from Department</label>
              <input
                type="text"
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="Enter approved primary URL"
              />
              {errors.url && <p className="error-message">{errors.url}</p>}
            </div>

            <div className="form-row">
              <label className="required">Alternate URL</label>
              <input
                type="text"
                name="alternate_url"
                value={form.alternate_url}
                onChange={handleChange}
                placeholder="Enter alternate URL"
              />
              {errors.alternate_url && <p className="error-message">{errors.alternate_url}</p>}

              <p className="maintenance-text">
                Alternate URL will be assigned if the primary URL is not available.
              </p>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <span className="section-badge">2.4</span>
            <h3>Domain Name Approval</h3>
          </div>
          <div className="form-section-grid">

            <div className="form-row">
              <label className="required">Authority Name</label>
              <input type="text" name="approval_authority" placeholder="Enter Authority Name" value={form.approval_authority} onChange={handleChange} />
              {errors.approval_authority && <p className="error-message">{errors.approval_authority} </p>}
            </div>

            <div className="form-row">
              <label className="required">Designation</label>
              <input type="text" name="approval_designation" placeholder="Enter Designation" value={form.approval_designation} onChange={handleChange} />
              {errors.approval_designation && <p className="error-message">{errors.approval_designation}</p>}
            </div>

            <div className="form-row">
              <label>Attach Approval Document (if available)</label>
              <input type="file" />
              <p className="maintenance-text">
                File uploads aren't wired up to the backend yet — this field is UI-only for now.
              </p>
            </div>

          </div>

        </div>


        <div className="form-section">
          <div className="section-header">
            <span className="section-badge">2.5</span>
            <h3>Administrative Approval</h3>
          </div>

          <div className="form-section-grid">
            <div className="form-row full-width">
              <label className="required">SEMT / Administrative Approval for Project</label>

              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="semt_approved"
                    value="Yes"
                    checked={form.semt_approved === "Yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="semt_approved"
                    value="No"
                    checked={form.semt_approved === "No"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
              {errors.semt_approved && <p className="error-message">{errors.semt_approved}</p>}
            </div>

            {form.semt_approved === "Yes" && (
              <>
                <div className="form-row">
                  <label className="required">MoM / Document Reference No.</label>
                  <input
                    type="text"
                    name="mom_ref_no"
                    value={form.mom_ref_no}
                    onChange={handleChange}
                  />
                  {errors.mom_ref_no && <p className="error-message">{errors.mom_ref_no}</p>}
                </div>

                <div className="form-row">
                  <label className="required">Date</label>
                  <input
                    type="date"
                    name="mom_date"
                    value={form.mom_date}
                    onChange={handleChange}
                  />
                  {errors.mom_date && <p className="error-message">{errors.mom_date}</p>}
                </div>

                <div className="form-row">
                  <label className="required">Attach MoM / Document</label>
                  <input
                    type="file"
                    onChange={(e) => setMomDoc(e.target.files[0])}
                  />
                  {errors.momDoc && <p className="error-message">{errors.momDoc}</p>}
                </div>
              </>
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

export default ApplicationDetails;