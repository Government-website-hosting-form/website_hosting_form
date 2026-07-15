import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import FormButtons from "../components/FormButtons";
import "./ApplicationDetails.css";

function ApplicationDetails() {
  const navigate = useNavigate();

  function Nextpage() {
    navigate("/maindetails");
  }
  function Backpage() {
    navigate("/organization");
  }

  return (
    <Layout>

      <div className="form-container">

        <h2 className="section-heading">
           Application Details (Annexure-2)
        </h2>

        <div className="form-row">
          <label>Application Name</label>
          <input
            type="text"
            placeholder="Enter Application Name"
          />
        </div>

        <div className="form-row">
          <label>Type of Application</label>

          <div className="radio-group">
            <label><input type="radio" name="applicationType" /> Website</label>
            <label><input type="radio" name="applicationType" /> Portal</label>
            <label><input type="radio" name="applicationType" /> Application</label>
            <label><input type="radio" name="applicationType" /> Other</label>
          </div>
        </div>

        <div className="form-row">
          <label>Nature of Application</label>

          <div className="radio-group">
            <label><input type="radio" name="applicationNature" /> G2G</label>
            <label><input type="radio" name="applicationNature" /> G2B</label>
            <label><input type="radio" name="applicationNature" /> G2C</label>
          </div>
        </div>

        <div className="form-row">
          <label>Application Utility</label>

          <div className="radio-group">
            <label><input type="radio" name="applicationUtility" /> Budget Announcement</label>
            <label><input type="radio" name="applicationUtility" /> CM Announcement</label>
            <label><input type="radio" name="applicationUtility" /> General Application</label>
            <label><input type="radio" name="applicationUtility" /> Other Priority Event</label>
          </div>
        </div>

        <div className="form-row">
          <label>Purpose of Application</label>

          <textarea
            rows="5"
            placeholder="Enter the purpose of the application"
          ></textarea>

          <p className="maintenance-text">
            Please also attach a brief note about the application as per Annexure-6.
          </p>
        </div>

        <div className="form-row">
          <label>Proposed Sub Domain ( xyz.rajasthan.gov.in) :</label>
        </div>

        <div className="form-row">
          <label>Approved Primary URL from Department</label>
          <input
            type="text"
            placeholder="Enter approved primary URL"
          />
        </div>

        <div className="form-row">
          <label>Alternate URL</label>
          <input
            type="text"
            placeholder="Enter alternate URL"
          />

          <p className="maintenance-text">
            Alternate URL will be assigned if the primary URL is not available.
          </p>
        </div>

        <div className="form-row">
          <label>Domain Name Approval :</label>
        </div>

        <div className="two-column">

          <div className="form-row">
            <label>Authority Name</label>
            <input type="text" />
          </div>

          <div className="form-row">
            <label>Designation</label>
            <input type="text" />
          </div>

        </div>

        <div className="form-row">
          <label>Attach Approval Document (if available)</label>
          <input type="file" />
        </div>

        <div className="form-row">
          <label>SEMT / Administrative Approval for Project :</label>
        </div>
        

        <div className="form-row">

          <div className="radio-group">
            <label><input type="radio" name="approval" /> Yes</label>
            <label><input type="radio" name="approval" /> No</label>
          </div>
        </div>

        <div className="two-column">

          <div className="form-row">
            <label>MoM / Document Reference No.</label>
            <input type="text" />
          </div>

          <div className="form-row">
            <label>Date</label>
            <input type="date" />
          </div>

        </div>

        <div className="form-row">
          <label>Attach MoM / Document</label>
          <input type="file" />
        </div>

      </div>

     <FormButtons
    showBack={true}
    onBack={Backpage}
    onNext={Nextpage}
/>

    </Layout>
  );
}

export default ApplicationDetails;