import { useState } from "react";
import Layout from "../components/Layout";
import FormButtons from "../components/FormButtons";
import "./Checklist.css";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { apiPost } from "../api";

import {
  securityChecklist,
  otherActionItems,
  implementationGuidelines,
} from "./ChecklistData";

import {
  securityColumns,
  otherColumns,
  implementationColumns,
} from "../utils/checklistColumns";

function Checklist() {
  const navigate = useNavigate();
  const { ids } = useFormContext();

  // answers keyed by "security-0", "other-0", "implementation-0" ... like the
  // original radio "name" attributes, holding "yes" | "no" | "na"
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleAnswer(e) {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  }

  function buildPayload() {
    const payload = { app_id: ids.appId };
    const mapGroup = (columns, prefix) => {
      columns.forEach((col, index) => {
        const answer = answers[`${prefix}-${index}`];
        payload[col] = answer ? answer.toUpperCase() : "NA"; // matches ENUM('YES','NO','NA')
      });
    };
    mapGroup(securityColumns, "security");
    mapGroup(otherColumns, "other");
    mapGroup(implementationColumns, "implementation");
    return payload;
  }

  async function Nextpage() {
    setError("");
    if (!ids.appId) {
      setError("Application record not found yet — please complete earlier steps first.");
      return;
    }
    setSaving(true);
    try {
      await apiPost("/checklist", buildPayload());
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Could not save the Checklist.");
    } finally {
      setSaving(false);
    }
  }

  function Backpage() {
    navigate("/ssldetails");
  }

  return (
    <Layout>
      <div className="form-container">

        <h2 className="section-heading">
          Website Hosting Request Form Checklist for Secure Code Programming in Applications
        </h2>

        {error && <p className="form-error">{error}</p>}
        {submitted && (
          <p className="form-success">
            Form submitted successfully — all your data has been saved.
          </p>
        )}

    
        {securityChecklist.map((item, index) => (
          <div className="checklist-row" key={index}>

            <div className="question">
              <strong>{index + 1}.</strong> {item}
            </div>

            <div className="radio-group">

              <label>
                <input
                  type="radio"
                  name={`security-${index}`}
                  value="yes"
                  checked={answers[`security-${index}`] === "yes"}
                  onChange={handleAnswer}
                />
                YES
              </label>

              <label>
                <input
                  type="radio"
                  name={`security-${index}`}
                  value="no"
                  checked={answers[`security-${index}`] === "no"}
                  onChange={handleAnswer}
                />
                NO
              </label>

              <label>
                <input
                  type="radio"
                  name={`security-${index}`}
                  value="na"
                  checked={answers[`security-${index}`] === "na"}
                  onChange={handleAnswer}
                />
                Not Applicable
              </label>

            </div>

          </div>
        ))}


        <h3 className="checklist-title">Other Action Item(s)</h3>

        {otherActionItems.map((item, index) => (
          <div className="checklist-row" key={index}>

            <div className="question">
              <strong>{index + 1}.</strong> {item}
            </div>

            <div className="radio-group">

              <label>
                <input
                  type="radio"
                  name={`other-${index}`}
                  value="yes"
                  checked={answers[`other-${index}`] === "yes"}
                  onChange={handleAnswer}
                />
                YES
              </label>

              <label>
                <input
                  type="radio"
                  name={`other-${index}`}
                  value="no"
                  checked={answers[`other-${index}`] === "no"}
                  onChange={handleAnswer}
                />
                NO
              </label>

              <label>
                <input
                  type="radio"
                  name={`other-${index}`}
                  value="na"
                  checked={answers[`other-${index}`] === "na"}
                  onChange={handleAnswer}
                />
                Not Applicable
              </label>

            </div>

          </div>
        ))}


        <h3 className="checklist-title">Implementation Guidelines</h3>

        {implementationGuidelines.map((item, index) => (
          <div className="checklist-row" key={index}>

            <div className="question">
              <strong>{index + 1}.</strong> {item}
            </div>

            <div className="radio-group">

              <label>
                <input
                  type="radio"
                  name={`implementation-${index}`}
                  value="yes"
                  checked={answers[`implementation-${index}`] === "yes"}
                  onChange={handleAnswer}
                />
                YES
              </label>

              <label>
                <input
                  type="radio"
                  name={`implementation-${index}`}
                  value="no"
                  checked={answers[`implementation-${index}`] === "no"}
                  onChange={handleAnswer}
                />
                NO
              </label>

              <label>
                <input
                  type="radio"
                  name={`implementation-${index}`}
                  value="na"
                  checked={answers[`implementation-${index}`] === "na"}
                  onChange={handleAnswer}
                />
                Not Applicable
              </label>

            </div>

          </div>
        ))}

      </div>

      <FormButtons
        showBack={true}
        onBack={Backpage}
        onNext={Nextpage}
        onNextLabel={submitted ? "Submitted" : "Submit"}
        saving={saving}
        disabled={saving || submitted}
      />
    </Layout>
  );
}

export default Checklist;
