

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/Form.css";
import Layout from "../components/Layout";
import { apiGet } from "../api";
import {
  validateText,
  validateEmail,
  validateMobile,
  validateFileType,
  validateFileSize,
} from "../helpers/Validation";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const initialState = {
  fullName: "",
  mobile: "",
  department: "",
  designation: "",
  email: "",
  remarks: "",
};

function Mapping() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const ssoId = params.get("ssoId") || localStorage.getItem("ssoId") || "";

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [approvalLetter, setApprovalLetter] = useState(null);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [autofilled, setAutofilled] = useState({}); // which fields came from the APIs
  const [userType, setUserType] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [requestNo, setRequestNo] = useState(null);

  // Guard: no ssoId in the URL -> this page can't do anything useful.
  useEffect(() => {
    if (!ssoId) {
      navigate("/sso/failed?reason=missing_sso_id");
    } else {
      localStorage.setItem("ssoId", ssoId);
    }

  }, []);


  useEffect(() => {
    if (!ssoId) return;

    let cancelled = false;

    async function loadProfile() {
      setLoadingProfile(true);
      const filled = {};


      try {
        const res = await apiGet(`/api/sso/1/user-basic?ssoId=${encodeURIComponent(ssoId)}`);
        if (res.success && res.data) {
          if (res.data.userType) {
            filled.userType = true;
            if (!cancelled) setUserType(res.data.userType);
          }
        }
      } catch (err) {

        console.warn("user-basic autofill skipped:", err.message);
      }


      try {
        const res = await apiGet(`/api/sso/2/user-details?ssoId=${encodeURIComponent(ssoId)}`);
        if (res.success && res.data) {
          filled.department = !!res.data.department;
          filled.designation = !!res.data.designation;
          filled.email = !!res.data.mailId;
          if (!cancelled) {
            setForm((prev) => ({
              ...prev,
              department: res.data.department || prev.department,
              designation: res.data.designation || prev.designation,
              email: res.data.mailId || prev.email,
            }));
          }
        }


      } catch (err) {
        console.warn("user-details autofill skipped:", err.message);
      }

      if (!cancelled) {
        setAutofilled(filled);
        setLoadingProfile(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [ssoId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e) {
    const file = e.target.files[0] || null;
    setApprovalLetter(file);
    setErrors((prev) => ({ ...prev, approvalLetter: "" }));
  }

  function validateForm() {
    const newErrors = {};

    const fullNameError = validateText(form.fullName, 100);
    if (!form.fullName.trim()) newErrors.fullName = "Full Name is required.";
    else if (fullNameError) newErrors.fullName = fullNameError;

    const mobileError = validateMobile(form.mobile);
    if (!form.mobile.trim()) newErrors.mobile = "Mobile Number is required.";
    else if (mobileError) newErrors.mobile = mobileError;

    const departmentError = validateText(form.department, 150);
    if (!form.department.trim()) newErrors.department = "Department / Organization is required.";
    else if (departmentError) newErrors.department = departmentError;

    const designationError = validateText(form.designation, 100);
    if (!form.designation.trim()) newErrors.designation = "Designation is required.";
    else if (designationError) newErrors.designation = designationError;

    if (!form.email.trim()) newErrors.email = "Email is required.";
    else {
      const emailError = validateEmail(form.email);
      if (emailError) newErrors.email = emailError;
    }

    if (!approvalLetter) {
      newErrors.approvalLetter = "Please attach the Approval Letter.";
    } else {
      const typeError = validateFileType(approvalLetter, ALLOWED_FILE_TYPES);
      if (typeError) newErrors.approvalLetter = "Only PDF, JPG or PNG files are allowed.";
      const sizeError = validateFileSize(approvalLetter, MAX_FILE_SIZE);
      if (sizeError) newErrors.approvalLetter = "File size must be under 5 MB.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    setError("");
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const body = new FormData();
      body.append("ssoId", ssoId);
      body.append("fullName", form.fullName);
      body.append("mobile", form.mobile);
      body.append("department", form.department);
      body.append("designation", form.designation);
      body.append("email", form.email);
      body.append("remarks", form.remarks);
      body.append("approvalLetter", approvalLetter);


      const res = await fetch(`${BASE_URL}/api/sso/mapping/submit`, {
        method: "POST",
        body,
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok || data.success === false) {
        throw new Error(data.message || `Submission failed (${res.status})`);
      }

      setRequestNo(data.requestNo || null);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(
        err.message.includes("404") || err.message.includes("Failed to fetch")
          ? "This form isn't wired up to the backend yet (POST /api/sso/mapping/submit is still to be built). Your entries are safe on screen - please try again once that route is added."
          : `Could not submit your request: ${err.message}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Layout>
        <h2 className="section-heading">Request Submitted</h2>
        <p className="form-success">
          Your request has been submitted successfully and is now on process.
          {requestNo ? ` Request No: ${requestNo}` : ""}
        </p>
        <p>
          You will get access to the Web Hosting Form once your request is approved by the
          concerned authority.
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="section-heading">User Mapping &amp; Approval Request</h2>

      <p className="mapping-intro">
        We couldn't find your details in the approved users list. Please confirm your
        information below and attach your Approval Letter so an administrator can review
        and approve your access.
      </p>

      {loadingProfile && <p className="mapping-loading">Fetching your SSO profile…</p>}
      {error && <p className="form-error">{error}</p>}

      <div className="form-row">
        <label>SSO ID</label>
        <input type="text" value={ssoId} readOnly disabled />
      </div>

      {userType && (
        <div className="form-row">
          <label>User Type</label>
          <input type="text" value={userType} readOnly disabled />
        </div>
      )}

      <div className="two-column">
        <div className="form-row">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter Full Name"
            value={form.fullName}
            onChange={handleChange}
            maxLength={100}
          />
          {errors.fullName && <p className="error-message">{errors.fullName}</p>}
        </div>

        <div className="form-row">
          <label>Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            placeholder="Enter Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            maxLength={10}
          />
          {errors.mobile && <p className="error-message">{errors.mobile}</p>}
        </div>
      </div>

      <div className="two-column">
        <div className="form-row">
          <label>
            Department / Organization {autofilled.department && <span className="badge-autofill">auto-filled</span>}
          </label>
          <input
            type="text"
            name="department"
            placeholder="Enter Department / Organization"
            value={form.department}
            onChange={handleChange}
            maxLength={150}
          />
          {errors.department && <p className="error-message">{errors.department}</p>}
        </div>

        <div className="form-row">
          <label>
            Designation {autofilled.designation && <span className="badge-autofill">auto-filled</span>}
          </label>
          <input
            type="text"
            name="designation"
            placeholder="Enter Designation"
            value={form.designation}
            onChange={handleChange}
            maxLength={100}
          />
          {errors.designation && <p className="error-message">{errors.designation}</p>}
        </div>
      </div>

      <div className="form-row">
        <label>
          Email Address {autofilled.email && <span className="badge-autofill">auto-filled</span>}
        </label>
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
        <label>Remarks / Justification (optional)</label>
        <textarea
          name="remarks"
          placeholder="Any additional note for the approver"
          value={form.remarks}
          onChange={handleChange}
          maxLength={500}
          rows={3}
          className="mapping-textarea"
        />
      </div>

      <div className="form-row">
        <label>Approval Letter</label>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
        <p className="file-hint">PDF, JPG or PNG, max 5 MB.</p>
        {approvalLetter && <p className="file-selected">Selected: {approvalLetter.name}</p>}
        {errors.approvalLetter && <p className="error-message">{errors.approvalLetter}</p>}
      </div>

      <div className="button-group">
        <button
          type="button"
          className="next-btn"
          onClick={handleSubmit}
          disabled={submitting || loadingProfile}
        >
          {submitting ? "Submitting..." : "Submit for Approval"}
        </button>
      </div>
    </Layout>
  );
}

export default Mapping;
