function ApplicationDetails() {
  return (
    <div className="form-container">
      <h2>Application Details</h2>

      {/* Application Name */}
      <label>Application Name</label>
      <input
        type="text"
        name="applicationName"
        placeholder="Enter Application Name"
      />

      {/* Type of Application */}
      <label>Type of Application</label>
      <div className="radio-group">
        <label>
          <input type="radio" name="applicationType" value="website" />
          Website
        </label>

        <label>
          <input type="radio" name="applicationType" value="portal" />
          Portal
        </label>

        <label>
          <input type="radio" name="applicationType" value="application" />
          Application
        </label>

        <label>
          <input type="radio" name="applicationType" value="other" />
          Other
        </label>
      </div>

      {/* Nature */}
      <label>Nature of Application</label>
      <div className="radio-group">
        <label>
          <input type="radio" name="applicationNature" value="g2g" />
          G2G
        </label>

        <label>
          <input type="radio" name="applicationNature" value="g2b" />
          G2B
        </label>

        <label>
          <input type="radio" name="applicationNature" value="g2c" />
          G2C
        </label>
      </div>

      {/* Utility */}
      <label>Application Utility</label>
      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="applicationUtility"
            value="budgetAnnouncement"
          />
          Budget Announcement
        </label>

        <label>
          <input
            type="radio"
            name="applicationUtility"
            value="cmAnnouncement"
          />
          CM Announcement
        </label>

        <label>
          <input
            type="radio"
            name="applicationUtility"
            value="generalApplication"
          />
          General Application
        </label>

        <label>
          <input
            type="radio"
            name="applicationUtility"
            value="otherPriorityEvent"
          />
          Other Priority Event
        </label>
      </div>

      {/* Purpose */}
      <label>Purpose of Application</label>
      <textarea
        rows="5"
        name="purpose"
        placeholder="Enter the purpose of the application"
      ></textarea>

      <small>
        Please also attach a brief note about the application as per Annexure-6.
      </small>

      <hr />

      {/* Proposed Sub Domain */}
      <label>Proposed Sub Domain</label>
      <input
        type="text"
        name="subDomain"
        placeholder="xyz.rajasthan.gov.in"
      />

      {/* URLs */}
      <label>Approved Primary URL from Department</label>
      <input
        type="text"
        name="primaryUrl"
        placeholder="Enter approved primary URL"
      />

      <label>Alternate URL</label>
      <input
        type="text"
        name="alternateUrl"
        placeholder="Enter alternate URL"
      />

      <small>
        Alternate URL will be assigned if the primary URL is not available.
      </small>

      <hr />

      {/* Domain Name Approval */}
      <h3>Domain Name Approval</h3>

      <label>Authority Name</label>
      <input
        type="text"
        name="authorityName"
        placeholder="Enter authority name"
      />

      <label>Designation</label>
      <input
        type="text"
        name="designation"
        placeholder="Enter designation"
      />

      <label>Approval Document</label>
      <input type="file" name="approvalDocument" />

      <hr />

      {/* SEMT Approval */}
      <label>SEMT / Administrative Approval for Project</label>

      <div className="radio-group">
        <label>
          <input type="radio" name="semtApproval" value="yes" />
          Yes
        </label>

        <label>
          <input type="radio" name="semtApproval" value="no" />
          No
        </label>
      </div>

      <label>MoM / Document Reference No.</label>
      <input
        type="text"
        name="documentRefNo"
        placeholder="Enter reference number"
      />

      <label>Date</label>
      <input type="date" name="approvalDate" />

      <label>Attach MoM / Document</label>
      <input type="file" name="momDocument" />
    </div>
  );
}

export default ApplicationDetails;