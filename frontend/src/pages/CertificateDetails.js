import { useState } from "react";
import "./CertificateDetails.css";
import FormButtons from "../components/FormButtons";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useFormContext } from "../context/FormContext";
import { validateNumber } from "../helpers/Validation";
import { useEffect } from "react";
import { apiPut, apiGet } from "../api";




const initialState = {
  safehost_agency: "",
  safehost_agency_other: "", //new
  safehost_empanel_no: "",
  safehost_empanel_valid_till: "",
  safehost_ref_no: "",
  safehost_issue_date: "",
  safehost_valid_till: "",
  load_users: "",
  loadtest_avg_response: "",
  loadtest_agency: "",
  loadtest_agency_other: "",  
  loadtest_ref_no: "",
  loadtest_issue_date: "",
  loadtest_valid_till: "",
  other_certificate_details: "",  
};

function CertificateDetails() {
  const navigate = useNavigate();
  const { ids } = useFormContext();
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [safehostDoc, setSafehostDoc] = useState(null);

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
            console.error("Could not load saved certificate details:", err);
        }
    }
    loadExisting();
}, [ids.appId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    const newErrors = {};

    if (!form.safehost_agency) newErrors.safehost_agency = "This field is required.";
    if (form.safehost_agency === "CERT-In Empanelled") {
      if (!form.safehost_empanel_no.trim()) {
        newErrors.safehost_empanel_no = "This field is required.";
      } else {
        const empanelNoError = validateNumber(form.safehost_empanel_no);
        if (empanelNoError) newErrors.safehost_empanel_no = empanelNoError;
      }
      if (!form.safehost_empanel_valid_till) newErrors.safehost_empanel_valid_till = "This field is required.";
    }
    if (!form.safehost_ref_no.trim()) {
      newErrors.safehost_ref_no = "This field is required.";
    } else {
      const refNoError = validateNumber(form.safehost_ref_no);
      if (refNoError) newErrors.safehost_ref_no = refNoError;
    }
    if (!safehostDoc) newErrors.safehostDoc = "Please attach the certificate copy.";
    if (!form.safehost_issue_date) newErrors.safehost_issue_date = "This field is required.";
    if (!form.safehost_valid_till) newErrors.safehost_valid_till = "This field is required.";
    if (form.safehost_agency === "Other Agency" && !form.safehost_agency_other.trim()) {
      newErrors.safehost_agency_other = "Please specify the agency.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function Nextpage() {
    if (!validateForm()) return;
    setError("");
    if (!ids.appId) {
      setError("Application record not found yet — please go back and fill Application Details first.");
      return;
    }
    setSaving(true);
    try {
     const payload = {
  ...form,
  safehost_empanel_valid_till: form.safehost_empanel_valid_till || null,
  loadtest_issue_date: form.loadtest_issue_date || null,
  loadtest_valid_till: form.loadtest_valid_till || null,
  load_users: form.load_users || null,
};
await apiPut(`/apps/${ids.appId}`, payload);
      navigate("/infradetails");
    } catch (err) {
      console.error(err);
      setError("Could not save Certificate Details.");
    } finally {
      setSaving(false);
    }
  }

  function Backpage() {
    navigate("/maindetails");
  }

  return (
    <Layout>
      <div className="form-container">

        <h2 className="section-heading">
          Certificate Details (Annexure-4)
        </h2>


        {error && <p className="form-error">{error}</p>}
        <div className="form-section">
          <div className="section-header">
            <span className="section-badge">4.1</span>
            <h3>Safe to Host Certificate Details</h3>
          </div>




          <div className="form-section-grid">


            <div className="form-row full-width">
              <label className="required">Name of Certifying Agency</label>

              <div className="cert-radio-group">
                <label>
                  <input type="radio" name="safehost_agency" value="DoIT&C" checked={form.safehost_agency === "DoIT&C"} onChange={handleChange} />
                  DoIT&C
                </label>

                <label>
                  <input type="radio" name="safehost_agency" value="CERT-In Empanelled" checked={form.safehost_agency === "CERT-In Empanelled"} onChange={handleChange} />
                  CERT-In Empanelled
                </label>

                <label>
                  <input type="radio" name="safehost_agency" value="Other Agency" checked={form.safehost_agency === "Other Agency"} onChange={handleChange} />
                  Other Agency
                </label>
              </div>
              {form.safehost_agency === "Other Agency" && (
                <>
                  <input
                    type="text"
                    name="safehost_agency_other"
                    placeholder="Please specify"
                    value={form.safehost_agency_other}
                    onChange={handleChange}
                    maxLength={100}
                  />
                  {errors.safehost_agency_other && <p className="error-message">{errors.safehost_agency_other}</p>}
                </>
              )}
              {errors.safehost_agency && <p className="error-message">{errors.safehost_agency}</p>}
            </div>
            {form.safehost_agency === "CERT-In Empanelled" && (
              <>
                <div className="form-row">
                  <label className="required">CERT-In Empanelment Number</label>
                  <input
                    type="text"
                    name="safehost_empanel_no"
                    value={form.safehost_empanel_no}
                    onChange={handleChange}
                    placeholder="Enter Empanelment Number"
                  />
                  {errors.safehost_empanel_no && <p className="error-message">{errors.safehost_empanel_no}</p>}
                </div>

                <div className="form-row">
                  <label className="required">Empanelment Valid Till</label>
                  <input type="date" name="safehost_empanel_valid_till" value={form.safehost_empanel_valid_till} onChange={handleChange} />
                  {errors.safehost_empanel_valid_till && <p className="error-message">{errors.safehost_empanel_valid_till}</p>}
                </div>

              </>
            )}



            <div className="form-row">
              <label className="required">Security Audit Certificate Reference Number</label>
              <input
                type="text"
                name="safehost_ref_no"
                value={form.safehost_ref_no}
                onChange={handleChange}
                placeholder="Enter Certificate Reference Number"
              />
              {errors.safehost_ref_no && <p className="error-message">{errors.safehost_ref_no}</p>}
            </div>

            <div className="form-row">
              <label className="required">Please Attach Copy</label>
              <input
                type="file"
                onChange={(e) => setSafehostDoc(e.target.files[0])}
              />
              {errors.safehostDoc && <p className="error-message">{errors.safehostDoc}</p>}
            </div>



            <div className="form-row">
              <label className="required">Certificate Issue Date</label>
              <input type="date" name="safehost_issue_date" value={form.safehost_issue_date} onChange={handleChange} />
              {errors.safehost_issue_date && <p className="error-message">{errors.safehost_issue_date}</p>}
            </div>

            <div className="form-row">
              <label className="required">Certificate Valid Till</label>
              <input type="date" name="safehost_valid_till" value={form.safehost_valid_till} onChange={handleChange} />
              {errors.safehost_valid_till && <p className="error-message">{errors.safehost_valid_till}</p>}
            </div>


          </div>
        </div>


        <div className="form-row">
          <hr />
        </div>

        <div className="form-section">
          <div className="section-header">
            <span className="section-badge">4.2</span>
            <h3>Load Test Certificate Details</h3>
          </div>

          <div className="form-section-grid">
            <div className="form-row full-width">
              <label>Name of Certifying Agency</label>

              <div className="cert-radio-group">
                <label>
                  <input type="radio" name="loadtest_agency" value="DoIT&C" checked={form.loadtest_agency === "DoIT&C"} onChange={handleChange} />
                  DoIT&C
                </label>

                <label>
                  <input type="radio" name="loadtest_agency" value="Other Agency" checked={form.loadtest_agency === "Other Agency"} onChange={handleChange} />
                  Other Agency
                </label>
              </div>
              {form.loadtest_agency === "Other Agency" && (
                <input
                  type="text"
                  name="loadtest_agency_other"
                  placeholder="Please specify"
                  value={form.loadtest_agency_other}
                  onChange={handleChange}
                  maxLength={100}
                />
              )}
            </div>


            <div className="form-row">
              <label>Load Tested (Maximum Users)</label>
              <input
                type="number"
                name="load_users"
                value={form.load_users}
                onChange={handleChange}
                placeholder="Enter Maximum Users"
              />
            </div>

            <div className="form-row">
              <label>Average Response Time</label>
              <input
                type="text"
                name="loadtest_avg_response"
                value={form.loadtest_avg_response}
                onChange={handleChange}
                placeholder="Enter Response Time"
              />
            </div>





            <div className="form-row">
              <label>Certificate Reference Number</label>
              <input
                type="text"
                name="loadtest_ref_no"
                value={form.loadtest_ref_no}
                onChange={handleChange}
                placeholder="Enter Certificate Reference Number"
              />
            </div>

            <div className="form-row">
              <label>Please Attach Copy</label>
              <input type="file" />
            </div>




            <div className="form-row">
              <label>Certificate Issue Date</label>
              <input type="date" name="loadtest_issue_date" value={form.loadtest_issue_date} onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Certificate Valid Till</label>
              <input type="date" name="loadtest_valid_till" value={form.loadtest_valid_till} onChange={handleChange} />
            </div>


            <div className="form-row ">
              <label>Any Other Certificate Details</label>

              <div className="textarea-wrapper">
                <textarea
                  rows="1"
                  name="other_certificate_details"
                  value={form.other_certificate_details}
                  onChange={handleChange}
                  placeholder="Enter other certificate details (if any)"
                  maxLength={500}
                ></textarea>
                <span className="char-counter">{form.other_certificate_details.length}/500</span>
              </div>

              <p className="maintenance-text">This note field isn't stored in the DB yet (no matching column).</p>
            </div>

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

export default CertificateDetails;
