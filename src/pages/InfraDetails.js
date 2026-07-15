import "./InfraDetails.css";
import FormButtons from "../components/FormButtons";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function InfraDetails() {
  const navigate = useNavigate();

  function Nextpage() {
    navigate("/hardwaredetails");
  }

  function Backpage() {
    navigate("/certificatedetails");
  }

  return (
    <Layout>
      <div className="form-container">

        <h2 className="section-heading">
          Infrastructure Requirements for Application Hosting in SDC Environment
        </h2>

        <h2>A. VM (Server) requirements</h2>
        <hr/>
        <h3>Specify No of Servers (Each Web/App/DB/Other):-</h3>

       
        <h3>1. Web Server Configuration</h3>

        <div className="two-column">

          <div className="form-row">
            <label>Processor</label>
            <input
              type="text"
              placeholder="Enter Processor Details"
            />
          </div>

          <div className="form-row">
            <label>RAM</label>
            <input
              type="text"
              placeholder="Enter RAM Capacity"
            />
          </div>

          </div>

        <div className="two-column">

          <div className="form-row">
            <label>Storage Space</label>
            <input
              type="text"
              placeholder="Enter Storage Space"
            />
          </div>

          <div className="form-row">
            <label>Operating System</label>
            <input
              type="text"
              placeholder="Enter Operating System"
            />
          </div>

        </div>

      <h3>2.Application Server Configuration</h3>

        
        <div className="two-column">

          <div className="form-row">
            <label>Processor</label>
            <input
              type="text"
              placeholder="Enter Processor Details"
            />
          </div>

          <div className="form-row">
            <label>RAM</label>
            <input
              type="text"
              placeholder="Enter RAM Capacity"
            />
          </div>

          </div>

        <div className="two-column">

          <div className="form-row">
            <label>Storage Space</label>
            <input
              type="text"
              placeholder="Enter Storage Space"
            />
          </div>

          <div className="form-row">
            <label>Operating System</label>
            <input
              type="text"
              placeholder="Enter Operating System"
            />
          </div>

        </div>

         <h3>3. Database Server Configuration</h3>

          <div className="two-column">

          <div className="form-row">
            <label>Processor</label>
            <input
              type="text"
              placeholder="Enter Processor Details"
            />
          </div>

          <div className="form-row">
            <label>RAM</label>
            <input
              type="text"
              placeholder="Enter RAM Capacity"
            />
          </div>

          </div>

        <div className="two-column">

          <div className="form-row">
            <label>Storage Space</label>
            <input
              type="text"
              placeholder="Enter Storage Space"
            />
          </div>

          <div className="form-row">
            <label>Operating System</label>
            <input
              type="text"
              placeholder="Enter Operating System"
            />
          </div>

        </div>
        
        <div className="two-column">
        <div className="form-row">
            <label>Database Version</label>
            <input
              type="text"
              placeholder="Enter Database Version"
            />
          </div>
        </div>
        


          <div className="form-row">
            <label>Any Other Server Required Also Specify the Usage </label>
            <input type="text" />
          </div>

        <h2>B. Software requirements for hosting</h2>
        <hr/>

       <h3>Other Software Requirements for Hosting</h3>

<div className="form-row">
  <label>Web Server Software with Version</label>
  <input
    type="text"
    placeholder="Example: Apache, IIS, Nginx"
  />
</div>

<div className="form-row">
  <label>Application Server with Version</label>
  <input
    type="text"
    placeholder="Example: Tomcat, JBoss"
  />
</div>

<h3>Integration with Other Software Systems Required</h3>

<div className="form-row">
  <label>Specify details of the Software</label>
  <textarea
    rows="4"
    placeholder="Example: DMS, GIS, SMS Gateway etc."
  ></textarea>
</div>

<h2 className="section-heading">
       SFTP Access Required in Demilitarized Zone
</h2>



<div className="form-row">
  <label>SFTP Access Required over Internet</label>

  <div className="radio-group">
    <label>
      <input type="radio" name="sftpAccess" />
      Yes
    </label>

    <label>
      <input type="radio" name="sftpAccess" />
      No
    </label>
  </div>
</div>

<div className="form-row">
  <label>If Yes, Provide Real IP</label>
  <input
    type="text"
    placeholder="Enter Real IP "
  />
</div>

<div className="form-row">
  <label>Proposed SFTP User Name demanded by the Department</label>
  <input
    type="text"
    placeholder="Enter Proposed SFTP User Name"
  />
</div>

<div className="form-row">
  <label>Web Server Type</label>

  <div className="radio-group">
    <label>
      <input type="radio" name="webServerType" />
      Apache
    </label>

    <label>
      <input type="radio" name="webServerType" />
      Nginx
    </label>

    <label>
      <input type="radio" name="webServerType" />
      IIS
    </label>

    <label>
      <input type="radio" name="webServerType" />
      Tomcat
    </label>

    <label>
      <input type="radio" name="webServerType" />
      JBoss
    </label>
  </div>
</div>

<div className="form-row">
  <label>Public IP</label>
  <input
    type="text"
    placeholder="Enter Public IP Address"
  />
</div>

<div className="form-row">
  <label>DNS Entry (Private / Public)</label>
  <input
    type="text"
    placeholder="Enter DNS Entry"
  />
</div>

<div className="form-row">
  <label>
    Application Performance Management (APM)  for monitoring performance and availability Required :-
  </label>

  <div className="radio-group">
    <label>
      <input type="radio" name="apmRequired" />
      Yes
    </label>

    <label>
      <input type="radio" name="apmRequired" />
      No
    </label>
  </div>
</div>

<div className="form-row">
  <label>Backup Services Required:-</label>

  <div className="radio-group">
    <label>
      <input type="radio" name="backupRequired" />
      Yes
    </label>

    <label>
      <input type="radio" name="backupRequired" />
      No
    </label>
  </div>
</div>

<div className="form-row">
  <label>If required than what is the retention period approved from respective department.
</label>
  <input
    type="text"
  />
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

export default InfraDetails;