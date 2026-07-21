import "../pages.css";
import Layout from "../components/Layout";
import FormButtons from "../components/FormButtons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  validateText,
  validateEmail,
  validateMobile,
  validatePhone,
} from "../helpers/Validation";

function OrganizationDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validateForm() {
    const newErrors = {};

    const nameError = validateText(formData.name, 150);
    if (nameError) newErrors.name = nameError;

    const officerError = validateText(formData.officer, 100);
    if (officerError) newErrors.officer = officerError;

    const officerDesignationError = validateText(
      formData.officer_designation,
      100
    );
    if (officerDesignationError)
      newErrors.officer_designation = officerDesignationError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const officePhoneError = validatePhone(formData.phone_office);
    if (officePhoneError) newErrors.phone_office = officePhoneError;

    const mobileError = validateMobile(formData.phone);
    if (mobileError) newErrors.phone = mobileError;

    const addressError = validateText(formData.address, 250);
    if (addressError) newErrors.address = addressError;

    const contactNameError = validateText(formData.contact_name, 100);
    if (contactNameError) newErrors.contact_name = contactNameError;

    const contactDesignationError = validateText(
      formData.contact_designation,
      100
    );
    if (contactDesignationError)
      newErrors.contact_designation = contactDesignationError;

    const contactPhoneError = validateMobile(formData.contact_phone);
    if (contactPhoneError) newErrors.contact_phone = contactPhoneError;

    const contactEmailError = validateEmail(formData.contact_email);
    if (contactEmailError) newErrors.contact_email = contactEmailError;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function Nextpage() {
    if (validateForm()) {
      navigate("/ApplicationDetails");
    }
  }


  return (
    <Layout>
      <h2 className="section-heading">
        Organization Details (Annexure-1)
      </h2>

     <div className="form-row">
  <label>Organization Name</label>

  <input
    type="text"
    name="name"
    placeholder="Enter Organization Name"
    value={formData.name}
    onChange={handleChange}
    maxLength={150}
  />

  {errors.name && (
    <p className="error-message">{errors.name}</p>
  )}
</div>

<div className="form-row">
  <label>Organization Type</label>

  <div className="radio-group">
    <label>
      <input
        type="radio"
        name="type"
        value="government"
        checked={formData.type === "government"}
        onChange={handleChange}
      />
      Departments of Government of Rajasthan
    </label>

    <label>
      <input
        type="radio"
        name="type"
        value="otherStateGovernment"
        checked={formData.type === "otherStateGovernment"}
        onChange={handleChange}
      />
      Departments/PSU/Agency/Organization of other State Government
    </label>

    <label>
      <input
        type="radio"
        name="type"
        value="centralGovernment"
        checked={formData.type === "centralGovernment"}
        onChange={handleChange}
      />
      Departments/PSU/Agency/Organization of Central Government
    </label>

    <label>
      <input
        type="radio"
        name="type"
        value="istart"
        checked={formData.type === "istart"}
        onChange={handleChange}
      />
      Startups registered under iStart
    </label>

    <label>
      <input
        type="radio"
        name="type"
        value="otherStartup"
        checked={formData.type === "otherStartup"}
        onChange={handleChange}
      />
      Startups of other State/Central Government
    </label>

    <label>
      <input
        type="radio"
        name="type"
        value="msme"
        checked={formData.type === "msme"}
        onChange={handleChange}
      />
      MSME Organization
    </label>

    <label>
      <input
        type="radio"
        name="type"
        value="largeEnterprise"
        checked={formData.type === "largeEnterprise"}
        onChange={handleChange}
      />
      Large Enterprise
    </label>

    <label>
      <input
        type="radio"
        name="type"
        value="individual"
        checked={formData.type === "individual"}
        onChange={handleChange}
      />
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
      placeholder="Enter Name"
      value={formData.officer}
      onChange={handleChange}
      maxLength={100}
    />

    {errors.officer && (
      <p className="error-message">{errors.officer}</p>
    )}
  </div>

  <div className="form-row">
    <label>Designation</label>

    <input
      type="text"
      name="officer_designation"
      placeholder="Enter Designation"
      value={formData.officer_designation}
      onChange={handleChange}
      maxLength={100}
    />

    {errors.officer_designation && (
      <p className="error-message">
        {errors.officer_designation}
      </p>
    )}
  </div>
</div>


      <div className="two-column">

  <div className="form-row">
    <label>Email Address</label>

    <input
      type="email"
      name="email"
      placeholder="Enter Email"
      value={formData.email}
      onChange={handleChange}
      maxLength={100}
    />

    {errors.email && (
      <p className="error-message">{errors.email}</p>
    )}
  </div>

  <div className="form-row">
    <label>Phone No. (Office)</label>

    <input
      type="tel"
      name="phone_office"
      placeholder="Enter Phone"
      value={formData.phone_office}
      onChange={handleChange}
      maxLength={15}
    />

    {errors.phone_office && (
      <p className="error-message">{errors.phone_office}</p>
    )}
  </div>

</div>

<div className="two-column">

  <div className="form-row">
    <label>Phone No. (Mobile)</label>

    <input
      type="tel"
      name="phone"
      placeholder="Enter Mobile Number"
      value={formData.phone}
      onChange={handleChange}
      maxLength={10}
    />

    {errors.phone && (
      <p className="error-message">{errors.phone}</p>
    )}
  </div>

  <div className="form-row">
    <label>Postal Address</label>

    <input
      type="text"
      name="address"
      placeholder="Enter Address"
      value={formData.address}
      onChange={handleChange}
      maxLength={250}
    />

    {errors.address && (
      <p className="error-message">{errors.address}</p>
    )}
  </div>

</div>

<div className="form-row">
  <label>
    Name of DoIT&C Officer (If available) / SPOC Person (If DoIT&C Officer is not posted)
  </label>

  <input
    type="text"
    name="contact_name"
    placeholder="Enter Name"
    value={formData.contact_name}
    onChange={handleChange}
    maxLength={100}
  />

  {errors.contact_name && (
    <p className="error-message">{errors.contact_name}</p>
  )}
</div>

<div className="two-column">

  <div className="form-row">
    <label>Designation (DoIT&C Officer / SPOC Person)</label>

    <input
      type="text"
      name="contact_designation"
      placeholder="Enter Designation"
      value={formData.contact_designation}
      onChange={handleChange}
      maxLength={100}
    />

    {errors.contact_designation && (
      <p className="error-message">
        {errors.contact_designation}
      </p>
    )}
  </div>

  <div className="form-row">
    <label>Contact Number (DoIT&C Officer / SPOC Person)</label>

    <input
      type="tel"
      name="contact_phone"
      placeholder="Enter Contact Number"
      value={formData.contact_phone}
      onChange={handleChange}
      maxLength={10}
    />

    {errors.contact_phone && (
      <p className="error-message">{errors.contact_phone}</p>
    )}
  </div>

</div>

<div className="form-row">
  <label>Email Address (DoIT&C Officer / SPOC Person)</label>

  <input
    type="email"
    name="contact_email"
    placeholder="Enter Email"
    value={formData.contact_email}
    onChange={handleChange}
    maxLength={100}
  />

  {errors.contact_email && (
    <p className="error-message">{errors.contact_email}</p>
  )}
</div>


      <FormButtons onNext={Nextpage} />

    </Layout>
  );
}

export default OrganizationDetails;