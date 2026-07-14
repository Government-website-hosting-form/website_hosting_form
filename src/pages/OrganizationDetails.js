function OrganizationDetails() {
  return (
    <div className="form-container">

      <h2>ORGANIZATION DETAILS</h2>

      <label>Organization Name</label>
      <input
        type="text"
        placeholder="Enter Organization Name"
      />

      <label>Organization Type</label>

      <div className="radio-group">

        <label>
          <input type="radio" name="orgType" />
          Government Department
        </label>

        <label>
          <input type="radio" name="orgType" />
          PSU
        </label>

        <label>
          <input type="radio" name="orgType" />
          Startup
        </label>

        <label>
          <input type="radio" name="orgType" />
          MSME
        </label>

        <label>
          <input type="radio" name="orgType" />
          Other
        </label>

      </div>

      <label>Nodal Officer</label>
      <input
        type="text"
        placeholder="Enter Nodal Officer Name"
      />

      <label>Designation</label>
      <input
        type="text"
        placeholder="Enter Designation"
      />

      <label>e-Mail Address</label>
      <input
        type="text"
        placeholder="Enter e-Mail Address"
      />

      <label>Phone No.(Office)</label>
      <input
        type="tel"
        placeholder="Enter Phone No.(Office)"
      />

      <label>Phone No.(Mobile)</label>
      <input
        type="tel"
        placeholder="Enter Phone No.(Mobile)"
      />

      <label>Postal Address</label>
      <input
        type="text"
        placeholder="Enter Postal Address"
      />

      
      <label>Name of DoIT&C Officer  (If available) /  SPOC Person (If DoIT&C Officer is not posted)</label>
      <input
        type="text"
        placeholder="Enter Name of DoIT&C Officer/SPOC Person "
      />


    </div>
  );
}

export default OrganizationDetails;