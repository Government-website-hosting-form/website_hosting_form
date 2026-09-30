import { useCallback, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import OrganizationDetails from "../pages/OrganizationDetails";
import ApplicationDetails from "../pages/ApplicationDetails";
import MainDetails from "../pages/MainDetails";
import CertificateDetails from "../pages/CertificateDetails";
import StagingDetails from "../pages/StagingDetails";
import ProductionDetails from "../pages/ProductionDetails";
import InfraOtherDetails from "../pages/InfraOtherDetails";
import HardwareDetails from "../pages/HardwareDetails";
import SslDetails from "../pages/SslDetails";
import Checklist from "../pages/Checklist";
import PreviewDetails from "../pages/PreviewDetails";
import SubmittedDetails from "../pages/SubmittedDetails";
import Mapping from "../pages/Mapping";
import OicRequests from "../pages/OicRequests";
import {
  SsoSuccess,
  SsoFailed,
  SsoPending,
  SsoNotActive,
  SsoRejected,
  SsoObjection,
} from "../pages/SsoPages";

import { verifySession, SSO_BACK_URL } from "../auth";
import SessionTimeout from "./SessionTimeout";
import { useFormContext } from "../context/FormContext";

const EDIT_PATHS = [
  "/organization",
  "/applicationdetails",
  "/maindetails",
  "/certificatedetails",
  "/stagingdetails",
  "/productiondetails",
  "/infraotherdetails",
  "/hardwaredetails",
  "/ssldetails",
  "/checklist",
];

function isPublicPath(pathname) {
  return pathname.startsWith("/sso/");
}

function AuthGate() {
  const location = useLocation();
  const { ids, resetForm } = useFormContext();

  const [status, setStatus] = useState("checking");

  const staleSubmitted =
    !!ids.submitted && EDIT_PATHS.includes(location.pathname.toLowerCase());

  useEffect(() => {
    if (staleSubmitted) resetForm({ keepUser: true });
  }, [staleSubmitted, resetForm]);

  const runCheck = useCallback(async () => {
    if (isPublicPath(location.pathname)) {
      setStatus("authorized");
      return;
    }

    setStatus("checking");

    const result = await verifySession();

    if (result.authenticated) {
      setStatus("authorized");
      return;
    }

    setStatus(result.reason === "server_unreachable" ? "offline" : "denied");
  }, [location.pathname]);

  useEffect(() => {
    runCheck();
  }, [runCheck]);

  useEffect(() => {
    function onStorage(event) {
      if (event.key === "ssoToken" || event.key === "ssoId") runCheck();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [runCheck]);

  if (status === "checking") {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <p>Verifying your SSO session...</p>
      </div>
    );
  }

  if (status === "offline") {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <h2>Unable to Verify Session</h2>
        <p>
          We could not reach the server to confirm your SSO session. Please
          check your connection and try again.
        </p>
        <button className="next-btn" onClick={runCheck}>
          Retry
        </button>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <h2>Access Not Authorized</h2>
        <p>
          Your session is not valid or has expired. Please log in again through
          the official SSO (G2G) portal.
        </p>
        <p>
          <a href={SSO_BACK_URL}>Go to SSO Portal</a>
        </p>
      </div>
    );
  }

  if (staleSubmitted) return null;

  return (
    <>
      {!isPublicPath(location.pathname) && <SessionTimeout />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/organization" element={<OrganizationDetails />} />
        <Route path="/applicationdetails" element={<ApplicationDetails />} />
        <Route path="/maindetails" element={<MainDetails />} />
        <Route path="/certificatedetails" element={<CertificateDetails />} />
        <Route path="/stagingdetails" element={<StagingDetails />} />
        <Route path="/productiondetails" element={<ProductionDetails />} />
        <Route path="/infraotherdetails" element={<InfraOtherDetails />} />
        <Route path="/hardwaredetails" element={<HardwareDetails />} />
        <Route path="/ssldetails" element={<SslDetails />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/previewdetails" element={<PreviewDetails />} />
        <Route path="/submitted" element={<SubmittedDetails />} />
        <Route path="/sso/success" element={<SsoSuccess />} />
        <Route path="/sso/failed" element={<SsoFailed />} />
        <Route path="/sso/mapping" element={<Mapping />} />
        <Route path="/sso/pending" element={<SsoPending />} />
        <Route path="/sso/not-active" element={<SsoNotActive />} />
        <Route path="/sso/rejected" element={<SsoRejected />} />
        <Route path="/sso/objection" element={<SsoObjection />} />
        <Route path="/oic/requests" element={<OicRequests />} />
      </Routes>
    </>
  );
}

export default AuthGate;