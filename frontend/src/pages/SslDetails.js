import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import FormButtons from "../components/FormButtons";
import "./SslDetails.css";
import { useFormContext } from "../context/FormContext";
import { apiPut } from "../api";


const initialState = {
  ssl_needed: "No",
  ssl_provider_type: "",
  ssl_environment: "Production",
  ssl_fqdn: "",
  ssl_type: "DV",
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function Nextpage() {
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

        <h2 className="section-heading">
          SSL Certificate Details
        </h2>

        {error && <p className="form-error">{error}</p>}

        <div className="form-row">

          <label>Dedicated SSL Certificate</label>

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

        </div>

        <div className="form-row">

          <label>If Yes then details of Provider</label>

          <input type="text" name="ssl_provider_type" value={form.ssl_provider_type} onChange={handleChange} placeholder="Enter SSL Provider Details" />

        </div>

        <div className="form-row">

  <label>Environment</label>

  <div className="radio-group">

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

</div>

        <div className="form-row">

          <label>URL / FQDN (Fully Qualified Domain Name)</label>

          <input type="text" name="ssl_fqdn" value={form.ssl_fqdn} onChange={handleChange} placeholder="Enter URL / FQDN" />

        </div>

        <h3>SSL Type Required</h3>

        <div className="form-row">
          <div className="radio-group">

            <label>
              <input type="radio" name="ssl_type" value="DV" checked={form.ssl_type === "DV"} onChange={handleChange} />
              Domain Validation (DV)
            </label>

            <label>
              <input type="radio" name="ssl_type" value="OV" checked={form.ssl_type === "OV"} onChange={handleChange} />
              Organization Validation (OV)
            </label>

            <label>
              <input type="radio" name="ssl_type" value="EV" checked={form.ssl_type === "EV"} onChange={handleChange} />
              Extended Validation (EV)
            </label>

            <label>
              <input type="radio" name="ssl_type" value="Wildcard" checked={form.ssl_type === "Wildcard"} onChange={handleChange} />
              Wildcard SSL
            </label>

            <label>
              <input type="radio" name="ssl_type" value="SAN" checked={form.ssl_type === "SAN"} onChange={handleChange} />
              Multi-Domain (SAN) SSL
            </label>

          </div>

        </div>

        <div className="form-row">

          <label>TLS Version Required</label>
          <input type="text" name="ssl_tls_version" value={form.ssl_tls_version} onChange={handleChange} placeholder="Enter TLS Version" />

        </div>

        <div className="two-column">

          <div className="form-row">

            <label>Issue Date</label>

            <input type="date" name="ssl_issue_date" value={form.ssl_issue_date} onChange={handleChange} />

          </div>

          <div className="form-row">

            <label>Expiry Date</label>

            <input type="date" name="ssl_expiry" value={form.ssl_expiry} onChange={handleChange} />

          </div>

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

          <textarea rows="4" name="ssl_renewal_contact" value={form.ssl_renewal_contact} onChange={handleChange} placeholder="Enter Renewal Contact Details"></textarea>

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
