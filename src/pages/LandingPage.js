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
      <li>Please attach required configuration of application software.</li>
      <li>Application developer is responsible for first time installation.</li>
      <li>Application developer will provide complete workflow/data flow.</li>
      <li>Application fine tuning is the sole responsibility of the application developer.</li>
      <li>In case of SI/Large Project, re-installation will be the responsibility of SI.</li>
      <li>Load testing report is required.</li>
    </ol>
  </div>
</Layout>
  );
}

export default LandingPage;