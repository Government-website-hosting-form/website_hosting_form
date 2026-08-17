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

    securityColumns.forEach((column, index) => {
      const answer = answers[`security-${index}`];
      payload[column] = answer ? answer.toUpperCase() : "NA";
    });

    otherColumns.forEach((column, index) => {
      const answer = answers[`other-${index}`];
      payload[column] = answer ? answer.toUpperCase() : "NA";
    });

    implementationColumns.forEach((column, index) => {
      const answer = answers[`implementation-${index}`];
      payload[column] = answer ? answer.toUpperCase() : "NA";
    });

    return payload;
  }

  //.some(), .every(), and .forEach() are standard built-in JavaScript array methods which are commonly used when working with arrays
  //.forEach()	Do something for each item	, .every()	Are ALL items satisfying this condition?	true / false, .some()	Is AT LEAST ONE item satisfying this condition?	true / false, .map()	Transform every item

  function validateForm() {
    //if security answered will be false that is return false then error message will be shown as that will mean that particular field is empty 
    const securityAnswered = securityChecklist.every(
      //element,index // .every() has 2 parameters-> (_, index) => ...
      (_, index) => answers[`security-${index}`]
    );
    const otherAnswered = otherActionItems.every(
      (_, index) => answers[`other-${index}`]
    );
    const implementationAnswered = implementationGuidelines.every(
      (_, index) => answers[`implementation-${index}`]
    );

    if (!securityAnswered || !otherAnswered || !implementationAnswered) {
      setError("Please select an option for all the fields.");
      return false;
    }

    return true;
  }

  async function Nextpage() {
    setError("");
    if (!validateForm()) return;
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
      <h2 className="section-heading">
        Website Hosting Request Form Checklist for Secure Code Programming in Applications (Annexure 8)
      </h2>

      {error && <p className="form-error">{error}</p>}
      {submitted && (
        <p className="form-success">
          Form submitted successfully — all your data has been saved.
        </p>
      )}

      <div className="form-section">
        <div className="section-header">
          <span className="section-badge">8.1</span>
          <h3>Action Item(s)</h3>
        </div>

        {securityChecklist.map((item, index) => (
          <div className="checklist-row" key={index}>
            <div className="question required">
              <strong>{index + 1}.</strong> {item}
            </div>

            <div className="radio-group">
              <label>
                <input type="radio" name={`security-${index}`} value="yes" checked={answers[`security-${index}`] === "yes"} onChange={handleAnswer} />
                YES
              </label>
              <label>
                <input type="radio" name={`security-${index}`} value="no" checked={answers[`security-${index}`] === "no"} onChange={handleAnswer} />
                NO
              </label>
              <label>
                <input type="radio" name={`security-${index}`} value="na" checked={answers[`security-${index}`] === "na"} onChange={handleAnswer} />
                Not Applicable
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="form-section">
        <div className="section-header">
          <span className="section-badge">8.2</span>
          <h3>Other Action Item(s)</h3>
        </div>

        {otherActionItems.map((item, index) => (
          <div className="checklist-row" key={index}>
            <div className="question required">
              <strong>{index + 1}.</strong> {item}
            </div>

            <div className="radio-group">
              <label>
                <input type="radio" name={`other-${index}`} value="yes" checked={answers[`other-${index}`] === "yes"} onChange={handleAnswer} />
                YES
              </label>
              <label>
                <input type="radio" name={`other-${index}`} value="no" checked={answers[`other-${index}`] === "no"} onChange={handleAnswer} />
                NO
              </label>
              <label>
                <input type="radio" name={`other-${index}`} value="na" checked={answers[`other-${index}`] === "na"} onChange={handleAnswer} />
                Not Applicable
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="form-section">
        <div className="section-header">
          <span className="section-badge">8.3</span>
          <h3>Implementation Guidelines</h3>
        </div>

        {implementationGuidelines.map((item, index) => (
          <div className="checklist-row" key={index}>
            <div className="question required">
              <strong>{index + 1}.</strong> {item}
            </div>

            <div className="radio-group">
              <label>
                <input type="radio" name={`implementation-${index}`} value="yes" checked={answers[`implementation-${index}`] === "yes"} onChange={handleAnswer} />
                YES
              </label>
              <label>
                <input type="radio" name={`implementation-${index}`} value="no" checked={answers[`implementation-${index}`] === "no"} onChange={handleAnswer} />
                NO
              </label>
              <label>
                <input type="radio" name={`implementation-${index}`} value="na" checked={answers[`implementation-${index}`] === "na"} onChange={handleAnswer} />
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