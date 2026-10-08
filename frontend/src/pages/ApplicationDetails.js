import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import FormButtons from "../components/FormButtons";
import "./ApplicationDetails.css";
import { useFormContext } from "../context/FormContext";
import { apiPost, apiGet, apiPut } from "../api";
import { useEffect } from "react";


const initialState = {
  name: "",
  type: [],
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
  const [purposeDoc, setPurposeDoc] = useState(null);
  const [approvalDoc, setApprovalDoc] = useState(null);
  const [domainApprovalDoc, setDomainApprovalDoc] = useState(null);


  useEffect(() => {
    async function loadExisting() {
      if (!ids.appId) return;
      try {
        const data = await apiGet(`/apps/${ids.appId}`);
        if (data) {
          const cleaned = {};
          for (const [key, value] of Object.entries(data)) {
            cleaned[key] = value === null ? "" : value;
          }
          setForm((prev) => ({ ...prev, ...cleaned }));
        }
      } catch (err) {
        console.error("Could not load saved application details:", err);
      }
    }
    loadExisting();
  }, [ids.appId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "type" && value !== "Other") {
        updated.type_other = "";
      }
      if (name === "utility" && value !== "Other Priority Event") {
        updated.utility_other = "";
      }
      if (name === "semt_approved" && value !== "Yes") {
        updated.mom_ref_no = "";
        updated.mom_date = "";
      }

      return updated;
    });

    if (name === "semt_approved" && value !== "Yes") {
      setMomDoc(null);
    }
  }

  function handleTypeChange(value) {
    setForm((prev) => {
      const alreadySelected = prev.type.includes(value);
      const updated = alreadySelected
        ? prev.type.filter((item) => item !== value)
        : [...prev.type, value];
      return { ...prev, type: updated };
    });
  }

  function validateForm() {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "This field is required.";
    if (form.type.length === 0) newErrors.type = "Please select at least one type.";
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

    if (form.type.includes("Other") && !form.type_other.trim()) {
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
      const payload = { ...form, org_id: ids.orgId || null, user_id: ids.userId || null };
      if (ids.appId) {
        await apiPut(`/apps/${ids.appId}`, payload);
      } else {
        const res = await apiPost("/apps", payload);
        setId("appId", res.id);
      }
      navigate("/maindetails");

    } catch (err) {
      console.error(err);
      setError(
        err.status === 409
          ? "This request is already submitted and can no longer be changed. Please go to Home and start a new form."
          : "Could not save Application Details. Please check the backend server and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function saveQuietly() {
    try {
      const payload = { ...form, org_id: ids.orgId || null };
      if (ids.appId) {
        await apiPut(`/apps/${ids.appId}`, payload);
      } else if (form.name && form.name.trim()) {
        const res = await apiPost("/apps", payload);
        setId("appId", res.id);
      }
    } catch (err) {
      console.error("Could not save draft on Back:", err);
    }
  }

  async function Backpage() {
    await saveQuietly();
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
              <div className="checkbox-group">
                <label>
                  <input type="checkbox" checked={form.type.includes("Website")} onChange={() => handleTypeChange("Website")} />
                  Website
                </label>
                <label>
                  <input type="checkbox" checked={form.type.includes("Portal")} onChange={() => handleTypeChange("Portal")} />
                  Portal
                </label>
                <label>
                  <input type="checkbox" checked={form.type.includes("Application")} onChange={() => handleTypeChange("Application")} />
                  Application
                </label>
                <label>
                  <input type="checkbox" checked={form.type.includes("Mobile App")} onChange={() => handleTypeChange("Mobile App")} />
                  Mobile App
                </label>
                <label>
                  <input type="checkbox" checked={form.type.includes("Microservices")} onChange={() => handleTypeChange("Microservices")} />
                  Microservices
                </label>
                <label>
                  <input type="checkbox" checked={form.type.includes("Api")} onChange={() => handleTypeChange("Api")} />
                  Api
                </label>
                <label>
                  <input type="checkbox" checked={form.type.includes("Other")} onChange={() => handleTypeChange("Other")} />
                  Other
                </label>
              </div>
              {form.type.includes("Other") && (
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

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg"
                onChange={(e) => setPurposeDoc(e.target.files[0])}
              />


            </div>

          </div>

        </div>


        <div className="form-section">
          <div className="section-header">
            <span className="section-badge">2.3</span>
            <h3>Proposed Sub Domain</h3>
          </div>

          <div className="form-section-grid">

            <div className="form-row">
              <label className="required">Approved Primary URL from Department</label>
              <input
                type="text"
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="i.e. xyz.rajasthan.gov.in"
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
                Note : Alternate URL will be assigned if the primary URL is not available.
              </p>
            </div>

            <div className="form-row">
              <label>Domain Approval Attachment</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg"
                onChange={(e) => setDomainApprovalDoc(e.target.files[0])}
              />
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
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg"
                onChange={(e) => setApprovalDoc(e.target.files[0])}
              />
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
                    placeholder="Enter MoM / Document Reference No."
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
                    accept=".pdf,.jpg,.jpeg"
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