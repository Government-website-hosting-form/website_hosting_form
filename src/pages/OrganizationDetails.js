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
        Organization Details (Annexure-1)
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
           Departments of Governement of Rajasthan

          </label>

          <label>
            <input type="radio" name="orgType" value="psu" />
            Departments/PSU/Agency/Organization of other State Government 

          </label>

          <label>
            <input type="radio" name="orgType" value="startup" />
            Departments/PSU/Agency/Organization of Central Governmen
          </label>

          <label>
            <input type="radio" name="orgType" value="msme" />
            Startups registered under iStart
          </label>

          <label>
            <input type="radio" name="orgType" value="other" />
             Startups of other State/ Central Govt.
          </label>

           <label>
            <input type="radio" name="orgType" value="other" />
             MSME Orgarization 
          </label>

           <label>
            <input type="radio" name="orgType" value="other" />
             Large Enterprise
          </label>

          
           <label>
            <input type="radio" name="orgType" value="other" />
             Individuals / Other
          </label>


        </div>
      </div>

      <div className="two-column">

        <div className="form-row">
          <label>Name of Nodal Officer</label>

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
          <label>Phone No. (Office)</label>

          <input
            type="tel"
            placeholder="Enter Phone"
          />
        </div>

      </div>

      <div className="two-column">

        <div className="form-row">
          <label>Phone No. (Mobile)</label>

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