import { useState } from "react";
import "./CertificateDetails.css";
import FormButtons from "../components/FormButtons";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useFormContext } from "../context/FormContext";
import { apiPut } from "../api";


const initialState = {
  safehost_agency: "",
  safehost_empanel_no: "",
  safehost_empanel_valid_till: "",
  safehost_ref_no: "",
  safehost_issue_date: "",
  safehost_valid_till: "",
  load_users: "",
  loadtest_avg_response: "",
  loadtest_agency: "",
  loadtest_ref_no: "",
  loadtest_issue_date: "",
  loadtest_valid_till: "",
};

function CertificateDetails() {
  const navigate = useNavigate();
  const { ids } = useFormContext();
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
      setError("Application record not found yet — please go back and fill Application Details first.");
      return;
    }
    setSaving(true);
    try {
      await apiPut(`/apps/${ids.appId}`, form);
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
          Safe to Host Certificate Details
        </h2>

        {error && <p className="form-error">{error}</p>}

        <div className="form-row">
          <label>Name of Certifying Agency</label>

          <div className="radio-group">
            <label>
              <input type="radio" name="safehost_agency" value="DoIT&C" checked={form.safehost_agency === "DoIT&C"} onChange={handleChange} />
              DoIT&C
            </label>

            <label>
              <input type="radio" name="safehost_agency" value="Other CERT-In Empanelled Agency" checked={form.safehost_agency === "Other CERT-In Empanelled Agency"} onChange={handleChange} />
              Other CERT-In Empanelled Agency
            </label>
          </div>
        </div>

        <div className="two-column">

          <div className="form-row">
            <label>CERT-In Empanelment Number</label>
            <input
              type="text"
              name="safehost_empanel_no"
              value={form.safehost_empanel_no}
              onChange={handleChange}
              placeholder="Enter Empanelment Number"
            />
          </div>

          <div className="form-row">
            <label>Empanelment Valid Till</label>
            <input type="date" name="safehost_empanel_valid_till" value={form.safehost_empanel_valid_till} onChange={handleChange} />
          </div>

        </div>

         <div className="two-column">

        <div className="form-row">
          <label>Certificate Reference Number</label>
          <input
            type="text"
            name="safehost_ref_no"
            value={form.safehost_ref_no}
            onChange={handleChange}
            placeholder="Enter Certificate Reference Number"
          />
        </div>

        <div className="form-row">
          <label>Please Attach Copy</label>
          <input type="file" />
        </div>
      </div>

        <div className="two-column">

          <div className="form-row">
            <label>Certificate Issue Date</label>
            <input type="date" name="safehost_issue_date" value={form.safehost_issue_date} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Certificate Valid Till</label>
            <input type="date" name="safehost_valid_till" value={form.safehost_valid_till} onChange={handleChange} />
          </div>

        </div>

        <div className="form-row">
          <hr />
        </div>

      <h2 className="section-heading">
          Load Test Certificate Details
        </h2>

        <div className="form-row">
          <label>Name of Certifying Agency</label>

          <div className="radio-group">
            <label>
              <input type="radio" name="loadtest_agency" value="DoIT&C" checked={form.loadtest_agency === "DoIT&C"} onChange={handleChange} />
              DoIT&C
            </label>

            <label>
              <input type="radio" name="loadtest_agency" value="Other Agency" checked={form.loadtest_agency === "Other Agency"} onChange={handleChange} />
              Other Agency
            </label>
          </div>
        </div>

        <div className="two-column">

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

        </div>

       <div className="two-column">

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
      </div>

        <div className="two-column">

          <div className="form-row">
            <label>Certificate Issue Date</label>
            <input type="date" name="loadtest_issue_date" value={form.loadtest_issue_date} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Certificate Valid Till</label>
            <input type="date" name="loadtest_valid_till" value={form.loadtest_valid_till} onChange={handleChange} />
          </div>

        </div>

        <div className="form-row">
          <label>Any Other Certificate Details</label>

          <textarea
            rows="4"
            placeholder="Enter other certificate details (if any)"
          ></textarea>
          <p className="maintenance-text">This note field isn't stored in the DB yet (no matching column).</p>
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
