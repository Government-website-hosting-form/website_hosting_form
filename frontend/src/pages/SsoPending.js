

import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";

function SsoPending() {
  const [params] = useSearchParams();
  const ssoId = params.get("ssoId") || "";

  return (
    <Layout>
      <h2 className="section-heading">Request On Process</h2>
      <p className="landing-text">
        Your access request has already been submitted and is currently under review
        by the concerned authority.
      </p>
      <p className="landing-text">
        You'll be able to access the Web Hosting Form once your request is approved.
        {ssoId ? ` (SSO ID: ${ssoId})` : ""}
      </p>
    </Layout>
  );
}

export default SsoPending;
