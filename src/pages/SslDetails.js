import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import FormButtons from "../components/FormButtons";
import "./SslDetails.css";

function SslDetails() {

  const navigate = useNavigate();

  function Nextpage() {
    navigate("/checklist");
  }

  function Backpage() {
    navigate("/HardwareDetails");
  }

  return (

    <Layout>

      <div className="form-container">

        <h2 className="section-heading">
          SSL Certificate Details
        </h2>

        <div className="form-row">

          <label>Dedicated SSL Certificate</label>

          <div className="radio-group">

            <label>
              <input type="radio" name="sslCertificate" />
              Yes
            </label>

            <label>
              <input type="radio" name="sslCertificate" />
              No
            </label>

          </div>

        </div>

        <div className="form-row">

          <label>If Yes then details of Provider</label>

          <input
            type="text"
            placeholder="Enter SSL Provider Details"
          />

        </div>

        <div className="form-row">

  <label>Environment</label>

  <div className="radio-group">

    <label>
      <input type="radio" name="environment" />
      Production
    </label>

    <label>
      <input type="radio" name="environment" />
      UAT
    </label>

    <label>
      <input type="radio" name="environment" />
      DR
    </label>

  </div>

</div>

        <div className="form-row">

          <label>URL / FQDN (Fully Qualified Domain Name)</label>

          <input
            type="text"
            placeholder="Enter URL / FQDN"
          />

        </div>

        <h3>SSL Type Required</h3>

        <div className="form-row">

          <label>Domain Validation (DV)</label>

          <div className="radio-group">

            <label>
              <input type="radio" name="dv" />
              Yes
            </label>

            <label>
              <input type="radio" name="dv" />
              No
            </label>

          </div>

        </div>

        <div className="form-row">

          <label>Organization Validation (OV)</label>

          <div className="radio-group">

            <label>
              <input type="radio" name="ov" />
              Yes
            </label>

            <label>
              <input type="radio" name="ov" />
              No
            </label>

          </div>

        </div>

        <div className="form-row">

          <label>Extended Validation (EV)</label>

          <div className="radio-group">

            <label>
              <input type="radio" name="ev" />
              Yes
            </label>

            <label>
              <input type="radio" name="ev" />
              No
            </label>

          </div>

        </div>

        <div className="form-row">

          <label>Wildcard SSL</label>

          <div className="radio-group">

            <label>
              <input type="radio" name="wildcard" />
              Yes
            </label>

            <label>
              <input type="radio" name="wildcard" />
              No
            </label>

          </div>

        </div>

        <div className="form-row">

          <label>Multi-Domain (SAN) SSL</label>

          <div className="radio-group">

            <label>
              <input type="radio" name="san" />
              Yes
            </label>

            <label>
              <input type="radio" name="san" />
              No
            </label>

          </div>

        </div>

        <div className="form-row">

          <label>TLS Version Required</label>
          <input
            type="text"
            placeholder="Enter TLS Version"
          />

        </div>

        <div className="two-column">

          <div className="form-row">

            <label>Issue Date</label>

            <input
              type="date"
            />

          </div>

          <div className="form-row">

            <label>Expiry Date</label>

            <input
              type="date"
            />

          </div>

        </div>

                <div className="form-row">

          <label>Validity Period</label>

          <input
            type="text"
            placeholder="Enter Validity Period"
          />

        </div>

        <div className="form-row">

          <label>Certificate Authority (CA)</label>

          <input
            type="text"
            placeholder="Enter Certificate Authority"
          />

        </div>

        <div className="form-row">

          <label>Certificate Vendor</label>

          <input
            type="text"
            placeholder="Enter Certificate Vendor"
          />

        </div>

        <div className="form-row">

          <label>Renewal Responsibility</label>

          <input
            type="text"
            placeholder="Enter Renewal Responsibility"
          />

        </div>

        <div className="form-row">

          <label>Renewal Contact Details</label>

          <textarea
            rows="4"
            placeholder="Enter Renewal Contact Details"
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

export default SslDetails;