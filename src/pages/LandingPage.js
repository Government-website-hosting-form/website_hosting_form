import { useNavigate } from "react-router-dom";

function LandingPage() {

  const navigate = useNavigate();

  function startForm() {
    navigate("/organization");
  }

  return (
    <div className="container">

      <div className="header">

        <h2 className="government">
          GOVERNMENT OF RAJASTHAN
        </h2>

        <h1>Website Hosting Requisition Form</h1>

        <p>
          For Hosting Website / Portal / Applications at State Data Centre
        </p>

        <p>
          Department of Information Technology & Communication
        </p>

      </div>

      <button
        className="start-button"
        onClick={startForm}
      >
        Fill Website Hosting Form
      </button>

      <div className="note">

        <h2>Note</h2>

        <ol>
          <li>Any kind of hardware at SDC will be provided on a shared basis if not mentioned as dedicated.</li>

          <li>Please also attach required configuration of application software (IIS/Apache/JBoss/WebSphere/WebLogic etc.).</li>

          <li>Application developer is responsible for first time installation.</li>

          <li>Application developer will provide complete workflow/data flow of application in the form of a solution document.</li>

          <li>Application fine tuning is the sole responsibility of the application developer.</li>

          <li>In case of SI/Large Project, re-installation will be the responsibility of SI.</li>

          <li>Load testing report is required.</li>
        </ol>

      </div>

    </div>
  );
}

export default LandingPage;