import "../pages.css";
import Layout from "../components/Layout";
import FormButtons from "../components/FormButtons";
import { useNavigate } from "react-router-dom";

function OrganizationDetails() {
  const navigate = useNavigate();

  function Nextpage() {
    navigate("/ApplicationDetails");
  }

  return (
    <Layout>
      <h2 className="section-heading">
        2. Organization Details
      </h2>

      <div className="form-row">
        <label>Organization Name</label>

        <input
          type="text"
          placeholder="Enter Organization Name"
        />
      </div>

      <div className="form-row">
        <label>Organization Type</label>

        <div className="radio-group">

          <label>
            <input type="radio" name="orgType" value="government" />
            Government Department
          </label>

          <label>
            <input type="radio" name="orgType" value="psu" />
            PSU
          </label>

          <label>
            <input type="radio" name="orgType" value="startup" />
            Startup
          </label>

          <label>
            <input type="radio" name="orgType" value="msme" />
            MSME
          </label>

          <label>
            <input type="radio" name="orgType" value="other" />
            Other
          </label>

        </div>
      </div>

      <div className="two-column">

        <div className="form-row">
          <label>Nodal Officer</label>

          <input
            type="text"
            placeholder="Enter Name"
          />
        </div>

        <div className="form-row">
          <label>Designation</label>

          <input
            type="text"
            placeholder="Enter Designation"
          />
        </div>

      </div>

      <div className="two-column">

        <div className="form-row">
          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter Email"
          />
        </div>

        <div className="form-row">
          <label>Office Phone</label>

          <input
            type="tel"
            placeholder="Enter Phone"
          />
        </div>

      </div>

      <div className="two-column">

        <div className="form-row">
          <label>Mobile Number</label>

          <input
            type="tel"
            placeholder="Enter Mobile Number"
          />
        </div>

        <div className="form-row">
          <label>Postal Address</label>

          <input
            type="text"
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
          placeholder="Enter Name"
        />
      </div>

      <div className="two-column">

        <div className="form-row">
          <label>Designation (DoIT&C Officer / SPOC Person)</label>

          <input
            type="text"
            placeholder="Enter Designation"
          />
        </div>

        <div className="form-row">
          <label>Contact Number (DoIT&C Officer / SPOC Person)</label>

          <input
            type="text"
            placeholder="Enter Contact Number"
          />
        </div>

      </div>

      <div className="form-row">
        <label>Email Address (DoIT&C Officer / SPOC Person)</label>

        <input
          type="email"
          placeholder="Enter Email"
        />
      </div>

      <FormButtons onNext={Nextpage} />

    </Layout>
  );
}

export default OrganizationDetails;