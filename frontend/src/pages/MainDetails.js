import { useState } from "react";
import Layout from "../components/Layout";
import "./MainDetails.css";
import FormButtons from "../components/FormButtons";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { apiPut } from "../api";


const initialState = {
  dev_company: "",
  dev_contact_person: "",
  dev_address: "",
  dev_phone_office: "",
  dev_phone: "",
  dev_email: "",
  maint_active: "No",
  maint_expiry: "",
  maint_company: "",
  maint_contact_person: "",
  maint_address: "",
  maint_phone_office: "",
  maint_phone_mobile: "",
  maint_email: "",
  maint_contract_attached: "No",
};

function MainDetails() {

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
      navigate("/certificatedetails");
    } catch (err) {
      console.error(err);
      setError("Could not save Developer/Maintenance Details.");
    } finally {
      setSaving(false);
    }
  }

  function Backpage() {
    navigate("/ApplicationDetails");
  }

  return (
    <Layout>
      <h2 className="section-heading">
     Application Developed by
      </h2>

      {error && <p className="form-error">{error}</p>}

      <div className="form-row">
        <label>Name of the Company / Agency</label>

        <input
          type="text"
          name="dev_company"
          value={form.dev_company}
          onChange={handleChange}
          placeholder="RISL/DOIT, NIC, or Other — Specify"
        />
      </div>

      <div className="form-row">
        <label>Name of Contact Person</label>
        <input type="text" name="dev_contact_person" value={form.dev_contact_person} onChange={handleChange} />
      </div>

      <div className="form-row">
        <label>Address (Company / Agency)</label>
        <input type="text" name="dev_address" value={form.dev_address} onChange={handleChange} />
      </div>

      <div className="two-column">
        <div className="form-row">
          <label>Phone No. (Office)</label>
          <input type="text" name="dev_phone_office" value={form.dev_phone_office} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label>Phone No. (Mobile)</label>
          <input type="text" name="dev_phone" value={form.dev_phone} onChange={handleChange} />
        </div>
      </div>

      <div className="form-row">
        <label>E-Mail Address</label>
        <input type="email" name="dev_email" value={form.dev_email} onChange={handleChange} />
      </div>

      <div className="form-row">
        <label>Maintenance Team</label>

       <p className="maintenance-text">
            If Different than development team, please fill annexure -2
     </p>
    </div>

      <h2 className="section-heading">
        Application being Maintained by
      </h2>

      <div className="form-row">
        <label>Whether Website/Application is Under Maintenance</label>

        <div className="maintenance-row">
          <label>
            <input type="radio" name="maint_active" value="Yes" checked={form.maint_active === "Yes"} onChange={handleChange} />
            Yes
          </label>

          <label>
            <input type="radio" name="maint_active" value="No" checked={form.maint_active === "No"} onChange={handleChange} />
            No
          </label>

          <div className="expiry-box">
            <span>Expiry</span>
            <input type="date" name="maint_expiry" value={form.maint_expiry} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="form-row">
        <label>
          Name of the Company / Agency maintaining the Web Site/Application
        </label>
        <input type="text" name="maint_company" value={form.maint_company} onChange={handleChange} />
      </div>

      <div className="form-row">
        <label>Name of Contact Person</label>
        <input type="text" name="maint_contact_person" value={form.maint_contact_person} onChange={handleChange} />
      </div>

      <div className="form-row">
        <label>Address of Contact Person</label>
        <input type="text" name="maint_address" value={form.maint_address} onChange={handleChange} />
      </div>

      <div className="two-column">
        <div className="form-row">
          <label>Phone No. (Office)</label>
          <input type="text" name="maint_phone_office" value={form.maint_phone_office} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label>Phone No. (Mobile)</label>
          <input type="text" name="maint_phone_mobile" value={form.maint_phone_mobile} onChange={handleChange} />
        </div>
      </div>

      <div className="form-row">
        <label>E-Mail Address</label>
        <input type="email" name="maint_email" value={form.maint_email} onChange={handleChange} />
      </div>

      <div className="form-row">
        <label>Contract Copy(ies) Attached</label>

        <div className="checkbox-group">
          <label><input type="radio" name="maint_contract_attached" value="Yes" checked={form.maint_contract_attached === "Yes"} onChange={handleChange} /> Yes</label>
          <label><input type="radio" name="maint_contract_attached" value="No" checked={form.maint_contract_attached === "No"} onChange={handleChange} /> No</label>
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

export default MainDetails;
