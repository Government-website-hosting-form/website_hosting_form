import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import "../styles/Form.css";
import Layout from "../components/Layout";
import { apiGet, apiPost } from "../api";

import {
  validateText,
  validateEmail,
  validateMobile,
  validateFileType,
  validateFileSize,
} from "../helpers/Validation";
const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000";

const formData = {
  fullName: "",
  mobile: "",
  department: "",
  designation: "",
  email: "",
  remarks: "",
};

function Mapping() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const ssoId =
    searchParams.get("ssoId") ||
    localStorage.getItem("ssoId") ||
    "";

  const [form, setForm] = useState(formData);
  const [userType, setUserType] = useState("");
  const [errors, setErrors] = useState({});
  const [approvalLetter, setApprovalLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [requestNo, setRequestNo] = useState("");
  const [objectionRemarks, setObjectionRemarks] = useState("");

  useEffect(() => {
    if (!ssoId) {
      navigate("/sso/failed?reason=missing_sso_id");
      return;
    }

    localStorage.setItem("ssoId", ssoId);

    getUserDetails();
    loadExistingRequest();
  }, [ssoId]);

  const loadExistingRequest = async () => {
    try {
      const response = await apiGet(
        "/api/sso/mapping/my-request?ssoId=" +
          encodeURIComponent(ssoId)
      );

      if (response.success && response.request) {
        const existing = response.request;

        setForm((prevForm) => ({
          ...prevForm,
          fullName: existing.full_name || prevForm.fullName,
          mobile: existing.mobile || prevForm.mobile,
          department: existing.department || prevForm.department,
          designation: existing.designation || prevForm.designation,
          email: existing.email || prevForm.email,
          remarks: existing.remarks || prevForm.remarks,
        }));

        if (existing.status === "objection") {
          setObjectionRemarks(existing.objection_remarks || "");
        }
      }
    } catch (error) {
    }
  };

  const getUserDetails = async () => {
    try {
      const basicResponse = await apiGet(
        "/api/sso/1/user-basic?ssoId=" +
          encodeURIComponent(ssoId)
      );

      if (basicResponse.success) {
        setUserType(basicResponse.data.userType || "");
      }

      const detailsResponse = await apiGet(
        "/api/sso/2/user-details?ssoId=" + encodeURIComponent(ssoId)
      );

      if (detailsResponse.success && detailsResponse.data) {
        const newForm = {
          ...form,
          department:
            detailsResponse.data.department || "",
          designation:
            detailsResponse.data.designation || "",
          email: detailsResponse.data.mailId || "",
        };

        setForm(newForm);

        apiPost("/api/sso/mapping/init", {
          ssoId,
          department: newForm.department,
          designation: newForm.designation,
          email: newForm.email,
        }).catch((err) =>
          console.error("Draft save failed:", err)
        );
      }
    } catch (error) {
      console.error("Error getting user details:", error);
      setError("Unable to load your details.");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    setApprovalLetter(event.target.files[0]);

    setErrors({
      ...errors,
      approvalLetter: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    const nameError = validateText(form.fullName, 100);
    const mobileError = validateMobile(form.mobile);
    const departmentError = validateText(form.department, 150);
    const designationError = validateText(form.designation, 100);
    const emailError = validateEmail(form.email);

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
    } else if (nameError) {
      newErrors.fullName = nameError;
    }

    if (!form.mobile.trim()) {
      newErrors.mobile = "Mobile Number is required.";
    } else if (mobileError) {
      newErrors.mobile = mobileError;
    }

    if (!form.department.trim()) {
      newErrors.department = "Department is required.";
    } else if (departmentError) {
      newErrors.department = departmentError;
    }

    if (!form.designation.trim()) {
      newErrors.designation = "Designation is required.";
    } else if (designationError) {
      newErrors.designation = designationError;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (emailError) {
      newErrors.email = emailError;
    }

    if (!approvalLetter) {
      newErrors.approvalLetter =
        "Please attach the Approval Letter.";
    } else {
      if (
        validateFileType(approvalLetter, [
          "application/pdf",
          "image/jpeg",
          "image/png",
        ])
      ) {
        newErrors.approvalLetter =
          "Only PDF, JPG or PNG files are allowed.";
      }

      if (
        validateFileSize(
          approvalLetter,
          5 * 1024 * 1024
        )
      ) {
        newErrors.approvalLetter =
          "File size must be under 5 MB.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async () => {
    setError("");

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();

      data.append("ssoId", ssoId);
      data.append("fullName", form.fullName);
      data.append("mobile", form.mobile);
      data.append("department", form.department);
      data.append("designation", form.designation);
      data.append("email", form.email);
      data.append("remarks", form.remarks);
      data.append("approvalLetter", approvalLetter);

      const response = await fetch(
        API_URL + "/api/sso/mapping/submit",
        {
          method: "POST",
          headers: { "SSO-TOKEN": localStorage.getItem("ssoToken") || "" },
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Request submission failed."
        );
      }

      setRequestNo(result.requestNo || "");
      setSubmitted(true);

    } catch (error) {
      console.error("Submit error:", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <h2 className="section-heading">
          Request Submitted
        </h2>

        <p className="form-success">
          Your request has been submitted successfully.
          {requestNo &&
            " Request No: " + requestNo}
        </p>

        <p>
          You will get access to the Web Hosting Form once
          your request is approved.
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="section-heading">
        User Mapping &amp; Approval Request
      </h2>

      <p className="mapping-intro">
        Please confirm your details and attach your
        Approval Letter to request access.
      </p>

      {loading && (
        <p className="mapping-loading">
          Fetching your details...
        </p>
      )}

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      {objectionRemarks && (
        <p className="form-error">
          <strong>Objection Remarks from OIC:</strong> {objectionRemarks}
          <br />
          Please correct the details below and resubmit.
        </p>
      )}

      <div className="form-row">
        <label>SSO ID</label>

        <input
          type="text"
          value={ssoId}
          readOnly
          disabled
        />
      </div>

      {userType && (
        <div className="form-row">
          <label>User Type</label>

          <input
            type="text"
            value={userType}
            readOnly
            disabled
          />
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
          />

          {errors.fullName && (
            <p className="error-message">
              {errors.fullName}
            </p>
          )}
        </div>

        <div className="form-row">
          <label>Mobile Number</label>

          <input
            type="tel"
            name="mobile"
            placeholder="Enter Mobile Number"
            value={form.mobile}
            onChange={handleChange}
          />

          {errors.mobile && (
            <p className="error-message">
              {errors.mobile}
            </p>
          )}
        </div>
      </div>

      <div className="two-column">
        <div className="form-row">
          <label>Department / Organization</label>

          <input
            type="text"
            name="department"
            placeholder="Enter Department / Organization"
            value={form.department}
            onChange={handleChange}
          />

          {errors.department && (
            <p className="error-message">
              {errors.department}
            </p>
          )}
        </div>

        <div className="form-row">
          <label>Designation</label>

          <input
            type="text"
            name="designation"
            placeholder="Enter Designation"
            value={form.designation}
            onChange={handleChange}
          />

          {errors.designation && (
            <p className="error-message">
              {errors.designation}
            </p>
          )}
        </div>
      </div>

      <div className="form-row">
        <label>Email Address</label>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
        />

        {errors.email && (
          <p className="error-message">
            {errors.email}
          </p>
        )}
      </div>

      <div className="form-row">
        <label>Remarks / Justification (optional)</label>

        <textarea
          name="remarks"
          placeholder="Any additional note for the approver"
          value={form.remarks}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="form-row">
        <label>Approval Letter</label>

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />

        <p className="file-hint">
          PDF, JPG or PNG, max 5 MB.
        </p>

        {approvalLetter && (
          <p className="file-selected">
            Selected: {approvalLetter.name}
          </p>
        )}

        {errors.approvalLetter && (
          <p className="error-message">
            {errors.approvalLetter}
          </p>
        )}
      </div>

      <div className="button-group">
        <button
          type="button"
          className="next-btn"
          onClick={submitForm}
          disabled={loading || submitting}
        >
          {submitting
            ? "Submitting..."
            : "Submit for Approval"}
        </button>
      </div>
    </Layout>
  );
}

export default Mapping;