import { useState } from "react";
import "./OrganizationDetails.css";
import Layout from "../components/Layout";
import FormButtons from "../components/FormButtons";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { apiPost, apiGet, apiPut } from "../api";
import { useEffect } from "react";
import {
  validateText,
  validateEmail,
  validateMobile,
  validatePhone,
} from "../helpers/Validation";

const initialState = {
  name: "",
  type: "",
  type_other: "",
  officer: "",
  officer_designation: "",
  email: "",
  phone_office: "",
  phone: "",
  address: "",
  contact_name: "",
  contact_designation: "",
  contact_phone: "",
  contact_email: "",
};

function OrganizationDetails() {
  const navigate = useNavigate();
  const { ids, setId } = useFormContext();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


//this function is used to load existing organization details if orgId is present in the context. It fetches the data from the API and populates the form state with the retrieved values. If any value is null, it replaces it with an empty string to avoid issues with controlled components in React.
  useEffect(() => {
    async function loadExisting() {
        if (!ids.orgId) return;
        try {
            const data = await apiGet(`/org/${ids.orgId}`);
            if (data) {
                const cleaned = {};
                //Object.entries(data)- JavaScript converts the object into an array of key-value pairs
                for (const [key, value] of Object.entries(data)) {
                    cleaned[key] = value === null ? "" : value;
                }
                setForm((prev) => ({ ...prev, ...cleaned }));
            }
        } catch (err) {
            console.error("Could not load saved organization details:", err);
        }
    }
    loadExisting();
}, [ids.orgId]);




  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "This field is required.";
    
    }

    if (!form.type) {
      newErrors.type = "Please select an organization type.";
    }

    if (form.type === "other" && !form.type_other.trim()) {
  newErrors.type_other = "Please specify the organization type.";
}

    if (!form.officer.trim()) {
      newErrors.officer = "This field is required.";
    } else {
      const officerError = validateText(form.officer, 100);
      if (officerError) newErrors.officer = officerError;
    }


    if (!form.officer_designation.trim()) {
      newErrors.officer_designation = "This field is required.";
    } else {
      const officerDesignationError = validateText(
        form.officer_designation,
        100
      );
      if (officerDesignationError)
        newErrors.officer_designation = officerDesignationError;
    }


    if (!form.email.trim()) {
      newErrors.email = "This field is required.";
    } else {
      const emailError = validateEmail(form.email);
      if (emailError) newErrors.email = emailError;
    }




    if (!form.phone.trim()) {
      newErrors.phone = "This field is required.";
    } else {
      const mobileError = validateMobile(form.phone);
      if (mobileError) newErrors.phone = mobileError;
    }


    if (!form.address.trim()) {
      newErrors.address = "This field is required.";
    } else {
      const addressError = validateText(form.address, 250);
      if (addressError) newErrors.address = addressError;
    }


    if (!form.contact_name.trim()) {
      newErrors.contact_name = "This field is required.";
    } else {
      const contactNameError = validateText(form.contact_name, 100);
      if (contactNameError) newErrors.contact_name = contactNameError;
    }


    if (!form.contact_designation.trim()) {
      newErrors.contact_designation = "This field is required.";
    } else {
      const contactDesignationError = validateText(
        form.contact_designation,
        100
      );
      if (contactDesignationError)
        newErrors.contact_designation = contactDesignationError;
    }


    if (!form.contact_phone.trim()) {
      newErrors.contact_phone = "This field is required.";
    } else {
      const contactPhoneError = validateMobile(form.contact_phone);
      if (contactPhoneError) newErrors.contact_phone = contactPhoneError;
    }


    if (!form.contact_email.trim()) {
      newErrors.contact_email = "This field is required.";
    } else {
      const contactEmailError = validateEmail(form.contact_email);
      if (contactEmailError) newErrors.contact_email = contactEmailError;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function Nextpage() {
    if (!validateForm()) return;

    setError("");
    setSaving(true);
    try {
      const payload = { ...form, user_id: ids.userId || null };
     if (ids.orgId) {
    await apiPut(`/org/${ids.orgId}`, payload);
} else {
    const res = await apiPost("/org", payload);
    setId("orgId", res.id);
}
      navigate("/ApplicationDetails");
    } catch (err) {
      console.error(err);
      setError(
        "Could not save Organization Details. Please check the backend server and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>
      <h2 className="section-heading">Organization Details (Annexure-1)</h2>

      {error && <p className="form-error">{error}</p>}

      <p className="required-note">
        <span className="required-star">*</span> indicates required fields
      </p>


      <div className="form-section">
        <div className="section-header">
          <span className="section-badge">1.1</span>
          <h3>Basic Information</h3>
        </div>
        <div className="two-column">
          <div className="form-row">
            <label className="required">Organization Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter Organization Name"
              value={form.name}
              onChange={handleChange}
              maxLength={150}
            />

            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div className="form-row">
            <label className="required">Organization Type</label>

            <select name="type" value={form.type} onChange={handleChange}>
              <option value="">-- Select Organization Type --</option>
              <option value="government">Departments of Governement of Rajasthan</option>
              <option value="otherStateGovernment">Departments/PSU/Agency/Organization of other State Government </option>
              <option value="centralGovernment">Departments/PSU/Agency/Organization of Central Government</option>
              <option value="istart">Startups registered under iStart</option>
              <option value="otherStartup">Startups of other State/Central Government</option>
              <option value="msme">MSME Organization</option>
              <option value="largeEnterprise">Large Enterprise</option>
              <option value="individual">Individuals</option>
              <option value="other">Other</option>
            </select>
            {form.type === "other" && (
              <input
                type="text"
                name="type_other"
                placeholder="Please specify"
                value={form.type_other}
                onChange={handleChange}
                maxLength={100}
              />
            )}

            {errors.type && <p className="error-message">{errors.type}</p>}
            {errors.type_other && <p className="error-message">{errors.type_other}</p>}
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">
          <span className="section-badge">1.2</span>
          <h3>Details of Nodal Officer</h3>
        </div>

        <div className="two-column">
          <div className="form-row">
            <label className="required">Name</label>

            <input
              type="text"
              name="officer"
              placeholder="Enter Name"
              value={form.officer}
              onChange={handleChange}
              maxLength={100}
            />

            {errors.officer && (
              <p className="error-message">{errors.officer}</p>
            )}
          </div>

          <div className="form-row">
            <label className="required">Designation</label>

            <input
              type="text"
              name="officer_designation"
              placeholder="Enter Designation"
              value={form.officer_designation}
              onChange={handleChange}
              maxLength={100}
            />

            {errors.officer_designation && (
              <p className="error-message">{errors.officer_designation}</p>
            )}
          </div>
        </div>

        <div className="two-column">
          <div className="form-row">
            <label className="required">Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={handleChange}
              maxLength={100}
            />

            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="form-row">
            <label >Phone No. (Office)</label>

            <input
              type="tel"
              name="phone_office"
              placeholder="Enter Phone"
              value={form.phone_office}
              onChange={handleChange}
              maxLength={20}
            />

            {errors.phone_office && (
              <p className="error-message">{errors.phone_office}</p>
            )}
          </div>
        </div>

        <div className="two-column">
          <div className="form-row">
            <label className="required">Contact Number</label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter Mobile Number"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
            />

            {errors.phone && <p className="error-message">{errors.phone}</p>}
          </div>

          <div className="form-row">
            <label className="required">Office Address</label>

            <input
              type="text"
              name="address"
              placeholder="Enter Address"
              value={form.address}
              onChange={handleChange}
              maxLength={250}
            />

            {errors.address && (
              <p className="error-message">{errors.address}</p>
            )}
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">
          <span className="section-badge">1.3</span>
          <h3>Details of DoIT&C Officer (If available) / SPOC Person (If DoIT&C
            Officer is not posted)</h3>
        </div>

        <div className="two-column">
          <div className="form-row">
            <label className="required">
              Name
            </label>

            <input
              type="text"
              name="contact_name"
              placeholder="Enter Name"
              value={form.contact_name}
              onChange={handleChange}
              maxLength={100}
            />

            {errors.contact_name && (
              <p className="error-message">{errors.contact_name}</p>
            )}
          </div>


          <div className="form-row">
            <label className="required">Designation</label>

            <input
              type="text"
              name="contact_designation"
              placeholder="Enter Designation"
              value={form.contact_designation}
              onChange={handleChange}
              maxLength={100}
            />

            {errors.contact_designation && (
              <p className="error-message">{errors.contact_designation}</p>
            )}
          </div>
        </div>


        <div className="two-column">
          <div className="form-row">
            <label className="required">Contact Number</label>

            <input
              type="tel"
              name="contact_phone"
              placeholder="Enter Contact Number"
              value={form.contact_phone}
              onChange={handleChange}
              maxLength={10}
            />

            {errors.contact_phone && (
              <p className="error-message">{errors.contact_phone}</p>
            )}
          </div>


          <div className="form-row">
            <label className="required">Email Address</label>

            <input
              type="email"
              name="contact_email"
              placeholder="Enter Email"
              value={form.contact_email}
              onChange={handleChange}
              maxLength={100}
            />

            {errors.contact_email && (
              <p className="error-message">{errors.contact_email}</p>
            )}
          </div>
        </div>
      </div>

      <FormButtons onNext={Nextpage} disabled={saving} saving={saving} />
    </Layout>
  );
}

export default OrganizationDetails;