import "../pages.css";

function CertificateDetails() {
  return (
    <div className="organization">

      <div className="title">
        <h2>Certificate Details</h2>
      </div>

      <h3>Safe to Host Certificate Details</h3>

      <label>Name of Certifying Agency</label>

      <div className="radio-group">
        <label><input type="radio" name="safeAgency" /> DoIT&C</label>
        <label><input type="radio" name="safeAgency" /> Other CERT-In Empanelled Agency</label>
      </div>

      <div className="row">

        <div className="field">
          <label>CERT-In Empanelment Number</label>
          <input
            type="text"
            placeholder="Enter Empanelment Number"
          />
        </div>

        <div className="field">
          <label>Empanelment Valid Till</label>
          <input
            type="date"
          />
        </div>

      </div>

      <label>Certificate Reference Number</label>
      <input
        type="text"
        placeholder="Enter Certificate Reference Number"
      />

      <div className="row">

        <div className="field">
          <label>Certificate Issue Date</label>
          <input
            type="date"
          />
        </div>

        <div className="field">
          <label>Certificate Valid Till</label>
          <input
            type="date"
          />
        </div>

      </div>https://prod.liveshare.vsengsaas.visualstudio.com/join?3E88FFC8C19B86634323DEEE5C071E8ADB02

      <hr />

      <h3>Load Test Certificate Details</h3>

      <label>Name of Certifying Agency</label>

      <div className="radio-group">
        <label><input type="radio" name="loadAgency" /> DoIT&C</label>
        <label><input type="radio" name="loadAgency" /> Other Agency</label>
      </div>

      <div className="row">

        <div className="field">
          <label>Load Tested (Maximum Users)</label>
          <input
            type="number"
            placeholder="Enter Maximum Users"
          />
        </div>

        <div className="field">
          <label>Average Response Time</label>
          <input
            type="text"
            placeholder="Enter Response Time"
          />
        </div>

      </div>

      <label>Certificate Reference Number</label>
      <input
        type="text"
        placeholder="Enter Certificate Reference Number"
      />

      <div className="row">

        <div className="field">
          <label>Certificate Issue Date</label>
          <input
            type="date"
          />
        </div>

        <div className="field">
          <label>Certificate Valid Till</label>
          <input
            type="date"
          />
        </div>

      </div>

      <label>Any Other Certificate Details</label>

      <textarea
        rows="4"
        placeholder="Enter other certificate details (if any)"
      ></textarea>

     <div className="save-button">

    </div>
  );
}

export default CertificateDetails;