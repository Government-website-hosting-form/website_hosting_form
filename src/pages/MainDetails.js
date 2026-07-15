import Layout from "../components/Layout";
import "./MainDetails.css";

function MainDetails() {

   
  return (
    <Layout>
      <h2 className="section-heading">
     Application Developed by
      </h2>

      <div className="form-row">
        <label>Name of the Company / Agency</label>

        <div className="checkbox-group">
          <label><input type="checkbox" /> RISL/DOIT</label>
          <label><input type="checkbox" /> NIC</label>
          <label><input type="checkbox" /> Other</label>

          <input
            type="text"
            placeholder="Specify"
            className="small-input"
          />
        </div>
      </div>

      <div className="form-row">
        <label>Name of Contact Person</label>
        <input type="text" />
      </div>

      <div className="form-row">
        <label>Address (Company / Agency)</label>
        <input type="text" />
      </div>

      <div className="two-column">
        <div className="form-row">
          <label>Phone No. (Office)</label>
          <input type="text" />
        </div>

        <div className="form-row">
          <label>Phone No. (Mobile)</label>
          <input type="text" />
        </div>
      </div>

      <div className="form-row">
        <label>E-Mail Address</label>
        <input type="email" />
      </div>

      <div className="form-row">
        <label>Maintenance Team</label>

       <p className="maintenance-text">
            If Different than development team, please fill annexure -2
     </p>
    </div>

      <h2 className="section-heading">
        Application being Maintained by
      </h2>

      <div className="form-row">
        <label>Whether Website/Application is Under Maintenance</label>

        <div className="maintenance-row">
          <label>
            <input type="checkbox" />
            Yes
          </label>

          <label>
            <input type="checkbox" />
            No
          </label>

          <div className="expiry-box">
            <span>Expiry</span>
            <input type="date" />
          </div>
        </div>
      </div>

      <div className="form-row">
        <label>
          Name of the Company / Agency maintaining the Web Site/Application
        </label>
        <input type="text" />
      </div>

      <div className="form-row">
        <label>Name of Contact Person</label>
        <input type="text" />
      </div>

      <div className="form-row">
        <label>Address of Contact Person</label>
        <input type="text" />
      </div>

      <div className="two-column">
        <div className="form-row">
          <label>Phone No. (Office)</label>
          <input type="text" />
        </div>

        <div className="form-row">
          <label>Phone No. (Mobile)</label>
          <input type="text" />
        </div>
      </div>

      <div className="form-row">
        <label>E-Mail Address</label>
        <input type="email" />
      </div>

      <div className="form-row">
        <label>Contract Copy(ies) Attached</label>

        <div className="checkbox-group">
          <label><input type="checkbox" /> Yes</label>
          <label><input type="checkbox" /> No</label>
        </div>
      </div>


    </Layout>
    
  );
}

export default MainDetails;