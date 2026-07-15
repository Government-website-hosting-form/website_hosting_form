import "./CertificateDetails.css";
import FormButtons from "../components/FormButtons";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function CertificateDetails() {
  const navigate = useNavigate();

  function Nextpage() {
    navigate("/infradetails");
  }

  function Backpage() {
    navigate("/maindetails");
  }

  return (
    <Layout>
      <div className="form-container">

        <h2 className="section-heading">
          Safe to Host Certificate Details
        </h2>

        <div className="form-row">
          <label>Name of Certifying Agency</label>

          <div className="radio-group">
            <label>
              <input type="radio" name="safeAgency" />
              DoIT&C
            </label>

            <label>
              <input type="radio" name="safeAgency" />
              Other CERT-In Empanelled Agency
            </label>
          </div>
        </div>

        <div className="two-column">

          <div className="form-row">
            <label>CERT-In Empanelment Number</label>
            <input
              type="text"
              placeholder="Enter Empanelment Number"
            />
          </div>

          <div className="form-row">
            <label>Empanelment Valid Till</label>
            <input type="date" />
          </div>

        </div>

         <div className="two-column">

        <div className="form-row">
          <label>Certificate Reference Number</label>
          <input
            type="text"
            placeholder="Enter Certificate Reference Number"
          />
        </div>

        <div className="form-row">
          <label>Please Attach Copy</label>
          <input
            type="file"
            />
        </div>
      </div>

        <div className="two-column">

          <div className="form-row">
            <label>Certificate Issue Date</label>
            <input type="date" />
          </div>

          <div className="form-row">
            <label>Certificate Valid Till</label>
            <input type="date" />
          </div>

        </div>

        <div className="form-row">
          <hr />
        </div>

      <h2 className="section-heading">
          Load Test Certificate Details
        </h2>

        <div className="form-row">
          <label>Name of Certifying Agency</label>

          <div className="radio-group">
            <label>
              <input type="radio" name="LoadAgency" />
              DoIT&C
            </label>

            <label>
              <input type="radio" name="Agency" />
              Other Agency
            </label>
          </div>
        </div>

        <div className="two-column">

          <div className="form-row">
            <label>Load Tested (Maximum Users)</label>
            <input
              type="number"
              placeholder="Enter Maximum Users"
            />
          </div>

          <div className="form-row">
            <label>Average Response Time</label>
            <input
              type="text"
              placeholder="Enter Response Time"
            />
          </div>

        </div>

       <div className="two-column">

        <div className="form-row">
          <label>Certificate Reference Number</label>
          <input
            type="text"
            placeholder="Enter Certificate Reference Number"
          />
        </div>

        <div className="form-row">
          <label>Please Attach Copy</label>
          <input
            type="file"
            />
        </div>
      </div>

        <div className="two-column">

          <div className="form-row">
            <label>Certificate Issue Date</label>
            <input type="date" />
          </div>

          <div className="form-row">
            <label>Certificate Valid Till</label>
            <input type="date" />
          </div>

        </div>

        <div className="form-row">
          <label>Any Other Certificate Details</label>

          <textarea
            rows="4"
            placeholder="Enter other certificate details (if any)"
          ></textarea>
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

export default CertificateDetails;