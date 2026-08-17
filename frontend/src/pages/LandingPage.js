import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "./LandingPage.css";
function LandingPage() {
  const navigate = useNavigate();

  function startForm() {
    navigate("/organization");
  }

  return (
  <Layout>
  <p className="landing-text">
    Welcome to the Website Hosting Requisition Portal.
    Please read the instructions carefully before proceeding.
  </p>

  <button className="start-button" onClick={startForm}>
    Fill Website Hosting Form
  </button>

  <div className="landing-note">
    <h3>Important Instructions</h3>

    <ol>
      <li>Any kind of hardware at SDC will be provided on a shared basis if not mentioned as dedicated.</li>
      <li>Please also attach required configuration of application software (IIS/apache/Jboss / Webshpare /  Weblogic etc).</li>
      <li>Application developer is responsible for first time installation.</li>
      <li>Application developer will provide complete work flow / data flow of application in the form of solution  document for future installation. </li>
      <li> Application fine tuning is sole responsibility of application developer. </li>
      <li> In case of SI/large project re-installation will be the responsibility of SI. </li>
      <li>Load testing report.</li>
    </ol>
  </div>
</Layout>
  );
}

export default LandingPage;