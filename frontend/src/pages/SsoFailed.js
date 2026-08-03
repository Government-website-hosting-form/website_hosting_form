
import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";

function SsoFailed() {
  const [params] = useSearchParams();
  const reason = params.get("reason") || "unknown_error";

  return (
    <Layout>
      <p className="landing-text">
        SSO login failed ({reason}). Please go back and try logging in again
        from the SSO portal.
      </p>
    </Layout>
  );
}

export default SsoFailed;
