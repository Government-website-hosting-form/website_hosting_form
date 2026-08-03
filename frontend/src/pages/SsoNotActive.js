

import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";

function SsoNotActive() {
  const [params] = useSearchParams();
  const ssoId = params.get("ssoId") || "";

  return (
    <Layout>
      <h2 className="section-heading">Account Not Active</h2>
      <p className="landing-text">
        Your account has been marked inactive. Please contact the concerned
        administrator to reactivate access.
        {ssoId ? ` (SSO ID: ${ssoId})` : ""}
      </p>
    </Layout>
  );
}

export default SsoNotActive;
