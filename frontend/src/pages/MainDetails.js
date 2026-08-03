import { useState } from "react";
import Layout from "../components/Layout";
import "./MainDetails.css";
import FormButtons from "../components/FormButtons";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { apiPut } from "../api";
import { validateText, validateEmail, validateMobile, validatePhone } from "../helpers/Validation";


const initialState = {
  dev_company: "",
  dev_company_other: "",
  dev_contact_person: "",
  dev_address: "",
  dev_phone_office: "",
  dev_phone: "",
  dev_email: "",
  maint_active: "",
  maint_expiry: "",
  maint_company: "",
  maint_contact_person: "",
  maint_address: "",
  maint_phone_office: "",
  maint_phone_mobile: "",
  maint_email: "",
  maint_contract_attached: "",
};

function MainDetails() {

  const navigate = useNavigate();
  const { ids } = useFormContext();
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sameAsDeveloper, setSameAsDeveloper] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  function validateForm() {
  const newErrors = {};

  if (!form.dev_company) newErrors.dev_company = "This field is required.";
  if (form.dev_company === "other" && !form.dev_company_other.trim()) {
    newErrors.dev_company_other = "Please specify the agency.";
  }

 if (!form.dev_contact_person.trim()) {
  newErrors.dev_contact_person = "This field is required.";
} else {
  const err = validateText(form.dev_contact_person, 50);
  if (err) newErrors.dev_contact_person = err;
}

  if (form.dev_phone_office.trim()) {
    const err = validatePhone(form.dev_phone_office);
    if (err) newErrors.dev_phone_office = err;
  }

  if (!form.dev_phone.trim()) {
    newErrors.dev_phone = "This field is required.";
  } else {
    const err = validateMobile(form.dev_phone);
    if (err) newErrors.dev_phone = err;
  }

  if (form.dev_email.trim()) {
    const err = validateEmail(form.dev_email);
    if (err) newErrors.dev_email = err;
  }

  if (!form.maint_active) newErrors.maint_active = "This field is required.";

  if (form.maint_active === "Yes") {
    if (!form.maint_expiry) newErrors.maint_expiry = "This field is required.";
    if (!form.maint_company.trim()) newErrors.maint_company = "This field is required.";

  

    if (form.maint_phone_office.trim()) {
      const err = validatePhone(form.maint_phone_office);
      if (err) newErrors.maint_phone_office = err;
    }

     if (!form.maint_contact_person.trim()) {
  newErrors.maint_contact_person = "This field is required.";
} else {
  const err = validateText(form.maint_contact_person, 50);
  if (err) newErrors.maint_contact_person = err;
}

    if (!form.maint_phone_mobile.trim()) {
      newErrors.maint_phone_mobile = "This field is required.";
    } else {
      const err = validateMobile(form.maint_phone_mobile);
      if (err) newErrors.maint_phone_mobile = err;
    }

    if (form.maint_email.trim()) {
      const err = validateEmail(form.maint_email);
      if (err) newErrors.maint_email = err;
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
}
  function handleSameAsDeveloper(isSame) {
    setSameAsDeveloper(isSame);

    if (isSame) {
      setForm((prev) => ({
        ...prev,
        maint_company: prev.dev_company,
        maint_contact_person: prev.dev_contact_person,
        maint_address: prev.dev_address,
        maint_phone_office: prev.dev_phone_office,
        maint_phone_mobile: prev.dev_phone,
        maint_email: prev.dev_email,
      }));
    }
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
  maint_expiry: form.maint_expiry || null,
  maint_contract_attached: form.maint_contract_attached || null,
};
await apiPut(`/apps/${ids.appId}`, payload);
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
        Developer, Maintenance Team Details (Annexure-3)
      </h2>

      {error && <p className="form-error">{error}</p>}

      <div className="form-section">
        <div className="section-header">
          <span className="section-badge">3.1</span>
          <h3>Application Developed by</h3>
        </div>
        <div className="form-section-grid">
          <div className="form-row">
            <label className="required">Name of the Company / Agency</label>
            <select name="dev_company" value={form.dev_company} onChange={handleChange}>
              <option value="">-- Select --</option>
              <option value="RISL/DOIT">RISL/DOIT</option>
              <option value="NIC">NIC</option>
              <option value="other">Other</option>
            </select>

         {form.dev_company === "other" && (
    <>
      <input type="text" name="dev_company_other" placeholder="Please specify" value={form.dev_company_other} onChange={handleChange} maxLength={100} />
      {errors.dev_company_other && <p className="error-message">{errors.dev_company_other}</p>}
    </>
  )}
  {errors.dev_company && <p className="error-message">{errors.dev_company}</p>}
          </div>

          <div className="form-row">
            <label className="required">Name of Contact Person</label>
            <input type="text" name="dev_contact_person" placeholder="Enter Name of Contract Person" value={form.dev_contact_person} onChange={handleChange} />
               {errors.dev_contact_person && <p className="error-message">{errors.dev_contact_person}</p>}
          </div>
       

          <div className="form-row">
            <label>Address (Company / Agency)</label>
            <input type="text" name="dev_address" placeholder="Enter Address (Company/Agency)" value={form.dev_address} onChange={handleChange} />

          </div>


          <div className="form-row">
            <label>Phone No. (Office)</label>
            <input type="text" name="dev_phone_office" placeholder="Enter Phone No. (Office) " value={form.dev_phone_office} onChange={handleChange} />
            {errors.dev_phone_office && <p className="error-message">{errors.dev_phone_office}</p>}
          </div>

         <div className="form-row">
  <label className="required">Phone No. (Mobile)</label>
  <input type="text" name="dev_phone" placeholder="Enter Phone No. (Mobile) " value={form.dev_phone} onChange={handleChange} />
  {errors.dev_phone && <p className="error-message">{errors.dev_phone}</p>}
</div>


          <div className="form-row">
            <label>E-Mail Address</label>
            <input type="email" name="dev_email" placeholder="Enter E-Mail Address" value={form.dev_email} onChange={handleChange} />
            {errors.dev_email && <p className="error-message">{errors.dev_email}</p>}
          </div>


        </div>
      </div>

      <div className="form-section">
        <div className="section-header">
          <span className="section-badge">3.2</span>
          <h3>Application being Maintained by</h3>

        </div>
        <div className="form-section-grid">
          <div className="form-row full-width">
            <label className="required">Whether Website/Application is Under Maintenance</label>

            <div className="inline-fields">
              <div className="maintenance-radio-group">
                <label>
                  <input type="radio" name="maint_active" value="Yes" checked={form.maint_active === "Yes"} onChange={handleChange} />Yes
                </label>
                <label>
                  <input type="radio" name="maint_active" value="No" checked={form.maint_active === "No"} onChange={handleChange} />
                  No
                </label>
                 {form.maint_active === "Yes" && (
  <div className="expiry-box">
    <span className="required">Expiry</span>
    <input type="date" name="maint_expiry" value={form.maint_expiry} onChange={handleChange} />
    {errors.maint_expiry && <p className="error-message">{errors.maint_expiry}</p>}
  </div>
)}
              </div>
            </div>
             {errors.maint_active && <p className="error-message">{errors.maint_active}</p>}
          </div>
         {form.maint_active === "Yes" && (
  <div className="form-row full-width">
     <div className="inline-label-radio">
    <label>Application Development and Maintainence Team both are same </label>
    
    <div className="maintenance-radio-group">
      <label>
        <input
          type="radio"
          name="same_as_developer"
          value="Yes"
          checked={sameAsDeveloper === true}
          onChange={() => handleSameAsDeveloper(true)}
        />
        Yes
      </label>
      <label>
        <input
          type="radio"
          name="same_as_developer"
          value="No"
          checked={sameAsDeveloper === false}
          onChange={() => handleSameAsDeveloper(false)}
        />
        No
      </label>
    </div>
    </div>
       <p className="maintenance-text">
    Note: If it is maintained by development team only or maintenance only then choose Yes, or if maintenance is done by a different team please enter the details.
  </p>
   
  </div>
)}

{form.maint_active === "Yes" && sameAsDeveloper === false && (
  <>
    <div className="form-row">
      <label className="required">
        Name of the Company / Agency maintaining the Web Site/Application
      </label>
      <input type="text" name="maint_company" placeholder="Enter Name of Company/Agency" value={form.maint_company} onChange={handleChange} />
      {errors.maint_company && <p className="error-message">{errors.maint_company}</p>}
    </div>

    <div className="form-row">
      <label className="required">Name of Contact Person</label>
      <input type="text" name="maint_contact_person" placeholder="Enter Name of Contact Person" value={form.maint_contact_person} onChange={handleChange} />
      {errors.maint_contact_person && <p className="error-message">{errors.maint_contact_person}</p>}
    </div>

    <div className="form-row">
      <label>Address of Contact Person</label>
      <input type="text" name="maint_address" placeholder="Enter of Address of Contact Person" value={form.maint_address} onChange={handleChange} />
    </div>

    <div className="form-row">
      <label>Phone No. (Office)</label>
      <input type="text" name="maint_phone_office" placeholder="Enter Phone No.(Office)" value={form.maint_phone_office} onChange={handleChange} />
      {errors.maint_phone_office && <p className="error-message">{errors.maint_phone_office}</p>}
    </div>

    <div className="form-row">
      <label className="required">Phone No. (Mobile)</label>
      <input type="text" name="maint_phone_mobile" placeholder="Enter Phone No.(Mobile)" value={form.maint_phone_mobile} onChange={handleChange} />
      {errors.maint_phone_mobile && <p className="error-message">{errors.maint_phone_mobile}</p>}
    </div>

    <div className="form-row">
      <label>E-Mail Address</label>
      <input type="email" name="maint_email" placeholder="Enter E-Mail Address" value={form.maint_email} onChange={handleChange} />
      {errors.maint_email && <p className="error-message">{errors.maint_email}</p>}
    </div>
  </>
)}

{form.maint_active === "Yes" && (
  <div className="form-row full-width">
    <label>Contract Copy(ies) Attached</label>

    <div className="maintenance-radio-group">
      <label><input type="radio" name="maint_contract_attached" value="Yes" checked={form.maint_contract_attached === "Yes"} onChange={handleChange} />
        Yes</label>
      <label><input type="radio" name="maint_contract_attached" value="No" checked={form.maint_contract_attached === "No"} onChange={handleChange} />
        No</label>
    </div>
  </div>
)}
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




