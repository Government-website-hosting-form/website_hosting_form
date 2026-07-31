import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import FormButtons from "../components/FormButtons";
import "./SslDetails.css";
import { useFormContext } from "../context/FormContext";
import { apiPut } from "../api";

const initialState = {
  ssl_needed: "",
  ssl_provider_type: "",
  ssl_environment: "",
  ssl_fqdn: "",
  ssl_type: [],
  ssl_tls_version: "",
  ssl_issue_date: "",
  ssl_expiry: "",
  ssl_validity_period: "",
  ssl_ca: "",
  ssl_vendor: "",
  ssl_renewal_responsibility: "",
  ssl_renewal_contact: "",
};

function SslDetails() {
  const navigate = useNavigate();
  const { ids } = useFormContext();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSslTypeChange(value) {
    setForm((prev) => {
      const alreadySelected = prev.ssl_type.includes(value);
      const updated = alreadySelected
        ? prev.ssl_type.filter((item) => item !== value)
        : [...prev.ssl_type, value];
      return { ...prev, ssl_type: updated };
    });
  }

  function validateForm() {
    const newErrors = {};

    if (!form.ssl_needed) newErrors.ssl_needed = "This field is required.";

    if (form.ssl_needed === "Yes") {
      if (!form.ssl_provider_type.trim()) newErrors.ssl_provider_type = "This field is required.";
      if (!form.ssl_environment) newErrors.ssl_environment = "This field is required.";
      if (!form.ssl_fqdn.trim()) newErrors.ssl_fqdn = "This field is required.";
      if (form.ssl_type.length === 0) newErrors.ssl_type = "Please select at least one SSL type.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function Nextpage() {
    if (!validateForm()) return;
    setError("");
    if (!ids.infraId) {
      setError("Infrastructure record not found yet — please go back and fill Infra Details first.");
      return;
    }
    setSaving(true);
    try {
      await apiPut(`/infra/${ids.infraId}`, form);
      navigate("/checklist");
    } catch (err) {
      console.error(err);
      setError("Could not save SSL Details.");
    } finally {
      setSaving(false);
    }
  }

  function Backpage() {
    navigate("/hardwaredetails");
  }

  return (
    <Layout>
      <div className="form-container">
        <h2 className="section-heading">SSL Requirement Details (Annexure-7)</h2>

        {error && <p className="form-error">{error}</p>}

        <div className="form-section">
          <div className="section-header">
            <span className="section-badge">7.1</span>
            <h3>SSL Certificate Details</h3>
          </div>

          <div className="form-section-grid">
            <div className="form-row full-width">
              <label className="required">Dedicated SSL Certificate</label>
              <div className="radio-group">
                <label>
                  <input type="radio" name="ssl_needed" value="Yes" checked={form.ssl_needed === "Yes"} onChange={handleChange} />
                  Yes
                </label>
                <label>
                  <input type="radio" name="ssl_needed" value="No" checked={form.ssl_needed === "No"} onChange={handleChange} />
                  No
                </label>
              </div>
              {errors.ssl_needed && <p className="error-message">{errors.ssl_needed}</p>}
            </div>

            {form.ssl_needed === "Yes" && (
              <>

                <div className="form-row">
                  <label className="required">Environment</label>
                  <div className="ssl-radio-group">
                    <label>
                      <input type="radio" name="ssl_environment" value="Production" checked={form.ssl_environment === "Production"} onChange={handleChange} />
                      Production
                    </label>
                    <label>
                      <input type="radio" name="ssl_environment" value="UAT" checked={form.ssl_environment === "UAT"} onChange={handleChange} />
                      UAT
                    </label>
                    <label>
                      <input type="radio" name="ssl_environment" value="DR" checked={form.ssl_environment === "DR"} onChange={handleChange} />
                      DR
                    </label>
                  </div>
                  {errors.ssl_environment && <p className="error-message">{errors.ssl_environment}</p>}
                </div>

                <div className="form-row">
                  <label className="required">URL / FQDN (Fully Qualified Domain Name)</label>
                  <input type="text" name="ssl_fqdn" value={form.ssl_fqdn} onChange={handleChange} placeholder="Enter URL / FQDN" />
                  {errors.ssl_fqdn && <p className="error-message">{errors.ssl_fqdn}</p>}
                </div>

                <div className="form-row full-width">
                  <label className="required">SSL Type Required</label>
                  <div className="ssl-checkbox-group">
                    <label>
                      <input type="checkbox" checked={form.ssl_type.includes("DV")} onChange={() => handleSslTypeChange("DV")} />
                      Domain Validation (DV)
                    </label>
                    <label>
                      <input type="checkbox" checked={form.ssl_type.includes("OV")} onChange={() => handleSslTypeChange("OV")} />
                      Organization Validation (OV)
                    </label>
                    <label>
                      <input type="checkbox" checked={form.ssl_type.includes("EV")} onChange={() => handleSslTypeChange("EV")} />
                      Extended Validation (EV)
                    </label>
                    <label>
                      <input type="checkbox" checked={form.ssl_type.includes("Wildcard")} onChange={() => handleSslTypeChange("Wildcard")} />
                      Wildcard SSL
                    </label>
                    <label>
                      <input type="checkbox" checked={form.ssl_type.includes("SAN")} onChange={() => handleSslTypeChange("SAN")} />
                      Multi-Domain (SAN) SSL
                    </label>
                  </div>
                  {errors.ssl_type && <p className="error-message">{errors.ssl_type}</p>}
                </div>

                <div className="form-row">
                  <label>TLS Version Required</label>
                  <input type="text" name="ssl_tls_version" value={form.ssl_tls_version} onChange={handleChange} placeholder="Enter TLS Version" />
                </div>

                <div className="form-row">
                  <label>Issue Date</label>
                  <input type="date" name="ssl_issue_date" value={form.ssl_issue_date} onChange={handleChange} />
                </div>

                <div className="form-row">
                  <label>Expiry Date</label>
                  <input type="date" name="ssl_expiry" value={form.ssl_expiry} onChange={handleChange} />
                </div>

                <div className="form-row">
                  <label>Validity Period</label>
                  <input type="text" name="ssl_validity_period" value={form.ssl_validity_period} onChange={handleChange} placeholder="Enter Validity Period" />
                </div>

                <div className="form-row">
                  <label>Certificate Authority (CA)</label>
                  <input type="text" name="ssl_ca" value={form.ssl_ca} onChange={handleChange} placeholder="Enter Certificate Authority" />
                </div>

                <div className="form-row">
                  <label>Certificate Vendor</label>
                  <input type="text" name="ssl_vendor" value={form.ssl_vendor} onChange={handleChange} placeholder="Enter Certificate Vendor" />
                </div>

                <div className="form-row">
                  <label>Renewal Responsibility</label>
                  <input type="text" name="ssl_renewal_responsibility" value={form.ssl_renewal_responsibility} onChange={handleChange} placeholder="Enter Renewal Responsibility" />
                </div>

                <div className="form-row">
                  <label>Renewal Contact Details</label>
                  <textarea rows="2" name="ssl_renewal_contact" value={form.ssl_renewal_contact} onChange={handleChange} placeholder="Enter Renewal Contact Details"></textarea>
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

export default SslDetails;