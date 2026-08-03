
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function SsoSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const ssoId = params.get("ssoId");
    if (!ssoId) {
      navigate("/sso/failed");
      return;
    }





    localStorage.setItem("ssoId", ssoId);

    navigate("/organization");

  }, []);

  return <p style={{ textAlign: "center", marginTop: "40px" }}>Logging you in...</p>;
}

export default SsoSuccess;
