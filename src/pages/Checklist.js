import Layout from "../components/Layout";
import FormButtons from "../components/FormButtons";
import "./Checklist.css";
import { useNavigate } from "react-router-dom";

import {
  securityChecklist,
  otherActionItems,
  implementationGuidelines,
} from "./ChecklistData";

function Checklist() {
  const navigate = useNavigate();

  function Nextpage() {
    navigate("/nextpage");
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
                />
                YES
              </label>

              <label>
                <input
                  type="radio"
                  name={`security-${index}`}
                  value="no"
                />
                NO
              </label>

              <label>
                <input
                  type="radio"
                  name={`security-${index}`}
                  value="na"
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
                />
                YES
              </label>

              <label>
                <input
                  type="radio"
                  name={`other-${index}`}
                  value="no"
                />
                NO
              </label>

              <label>
                <input
                  type="radio"
                  name={`other-${index}`}
                  value="na"
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
                />
                YES
              </label>

              <label>
                <input
                  type="radio"
                  name={`implementation-${index}`}
                  value="no"
                />
                NO
              </label>

              <label>
                <input
                  type="radio"
                  name={`implementation-${index}`}
                  value="na"
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
      />
    </Layout>
  );
}

export default Checklist;