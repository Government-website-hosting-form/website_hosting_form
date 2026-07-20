import { useState } from "react";
import "../pages.css";
import Layout from "../components/Layout";
import FormButtons from "../components/FormButtons";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { apiPost } from "../api";


const initialState = {
  name: "",
  type: "",
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
      const payload = { ...form, user_id: ids.userId || null };
      const res = await apiPost("/org", payload);
      setId("orgId", res.id);
      navigate("/ApplicationDetails");
    } catch (err) {
      console.error(err);
      setError("Could not save Organization Details. Please check the backend server and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>
      <h2 className="section-heading">
        Organization Details (Annexure-1)
      </h2>

      {error && <p className="form-error">{error}</p>}

      <div className="form-row">
        <label>Organization Name</label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter Organization Name"
        />
      </div>

      <div className="form-row">
        <label>Organization Type</label>

        <div className="radio-group">

          <label>
            <input type="radio" name="type" value="government" checked={form.type === "government"} onChange={handleChange} />
           Departments of Governement of Rajasthan

          </label>

          <label>
            <input type="radio" name="type" value="psu" checked={form.type === "psu"} onChange={handleChange} />
            Departments/PSU/Agency/Organization of other State Government 

          </label>

          <label>
            <input type="radio" name="type" value="central" checked={form.type === "central"} onChange={handleChange} />
            Departments/PSU/Agency/Organization of Central Governmen
          </label>

          <label>
            <input type="radio" name="type" value="istart" checked={form.type === "istart"} onChange={handleChange} />
            Startups registered under iStart
          </label>

          <label>
            <input type="radio" name="type" value="other_startup" checked={form.type === "other_startup"} onChange={handleChange} />
             Startups of other State/ Central Govt.
          </label>

           <label>
            <input type="radio" name="type" value="msme" checked={form.type === "msme"} onChange={handleChange} />
             MSME Orgarization 
          </label>

           <label>
            <input type="radio" name="type" value="large_enterprise" checked={form.type === "large_enterprise"} onChange={handleChange} />
             Large Enterprise
          </label>

          
           <label>
            <input type="radio" name="type" value="individual" checked={form.type === "individual"} onChange={handleChange} />
             Individuals / Other
          </label>


        </div>
      </div>

      <div className="two-column">

        <div className="form-row">
          <label>Name of Nodal Officer</label>

          <input
            type="text"
            name="officer"
            value={form.officer}
            onChange={handleChange}
            placeholder="Enter Name"
          />
        </div>

        <div className="form-row">
          <label>Designation</label>

          <input
            type="text"
            name="officer_designation"
            value={form.officer_designation}
            onChange={handleChange}
            placeholder="Enter Designation"
          />
        </div>

      </div>

      <div className="two-column">

        <div className="form-row">
          <label>Email Address</label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter Email"
          />
        </div>

        <div className="form-row">
          <label>Phone No. (Office)</label>

          <input
            type="tel"
            name="phone_office"
            value={form.phone_office}
            onChange={handleChange}
            placeholder="Enter Phone"
          />
        </div>

      </div>

      <div className="two-column">

        <div className="form-row">
          <label>Phone No. (Mobile)</label>

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter Mobile Number"
          />
        </div>

        <div className="form-row">
          <label>Postal Address</label>

          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter Address"
          />
        </div>

      </div>

      <div className="form-row">
        <label>
          Name of DoIT&C Officer (If available) / SPOC Person (If DoIT&C Officer is not posted)
        </label>

        <input
          type="text"
          name="contact_name"
          value={form.contact_name}
          onChange={handleChange}
          placeholder="Enter Name"
        />
      </div>

      <div className="two-column">

        <div className="form-row">
          <label>Designation (DoIT&C Officer / SPOC Person)</label>

          <input
            type="text"
            name="contact_designation"
            value={form.contact_designation}
            onChange={handleChange}
            placeholder="Enter Designation"
          />
        </div>

        <div className="form-row">
          <label>Contact Number (DoIT&C Officer / SPOC Person)</label>

          <input
            type="text"
            name="contact_phone"
            value={form.contact_phone}
            onChange={handleChange}
            placeholder="Enter Contact Number"
          />
        </div>

      </div>

      <div className="form-row">
        <label>Email Address (DoIT&C Officer / SPOC Person)</label>

        <input
          type="email"
          name="contact_email"
          value={form.contact_email}
          onChange={handleChange}
          placeholder="Enter Email"
        />
      </div>

      <FormButtons onNext={Nextpage} disabled={saving} saving={saving} />

    </Layout>
  );
}

export default OrganizationDetails;
