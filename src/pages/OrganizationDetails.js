import "../pages.css";
import {useNavigate} from "react-router-dom";

function OrganizationDetails() {
    const navigate = useNavigate();

    function Nextpage()
    {
       navigate("/application");
    }

  return (
    <div className="organization">

      <div className="title">
        <h2>Organization Details</h2>
      </div>

      <label>Organization Name</label>

      <input
        type="text"
        placeholder="Enter Organization Name"
      />

      <label>Organization Type</label>

      <div className="radio-group">

        <label><input type="radio" name="orgType" /> Government Department</label>

        <label><input type="radio" name="orgType" /> PSU</label>

        <label><input type="radio" name="orgType" /> Startup</label>

        <label><input type="radio" name="orgType" /> MSME</label>

        <label><input type="radio" name="orgType" /> Other</label>

      </div>

      <div className="row">

        <div className="field">
          <label>Nodal Officer</label>
          <input
            type="text"
            placeholder="Enter Name"
          />
        </div>

        <div className="field">
          <label>Designation</label>
          <input
            type="text"
            placeholder="Enter Designation"
          />
        </div>

      </div>

      <div className="row">

        <div className="field">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter Email"
          />
        </div>

        <div className="field">
          <label>Office Phone</label>
          <input
            type="tel"
            placeholder="Enter Phone"
          />
        </div>

      </div>

      <div className="row">

        <div className="field">
          <label>Mobile Number</label>
          <input
            type="tel"
            placeholder="Enter Mobile Number"
          />
        </div>

        <div className="field">
          <label>Postal Address</label>
          <input
            type="text"
            placeholder="Enter Address"
          />
        </div>

      </div>

      <label>Name of DoIT&C Officer  (If available) /  SPOC Person (If DoIT&C Officer is not posted)</label>

      <input
        type="text"
        placeholder="Enter Name"
      />

      <div className="row">

        <div className="field">
          <label>Designation(DoIT&C Officer / SPOC Person)</label>
          <input
            type="text"
            placeholder="Enter Designation"
          />
        </div>

        <div className="field">
          <label>Contact Number(DoIT&C Officer / SPOC Person)</label>
          <input
            type="text"
            placeholder="Enter Contact Number"
          />
        </div>

      </div>

      <label>Email Address(DoIT&C Officer / SPOC Person)</label>

      <input
        type="email"
        placeholder="Enter Email"
      />
    

      <div className="button-group">

  <button className="save-btn">
    Save
  </button>

  <button className="next-btn" onClick={Nextpage} >Save & Next</button>

</div>

    </div>

      
  
  );
}



export default OrganizationDetails;