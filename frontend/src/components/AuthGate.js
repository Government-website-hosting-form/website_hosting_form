import { useCallback, useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

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

import OicPortal from "../pages/OicPortal";

import {
  SsoSuccess,
  SsoFailed,
  SsoPending,
  SsoNotActive,
  SsoRejected,
  SsoObjection,
} from "../pages/SsoPages";

import { verifySession, fetchAccess, getSsoId, SSO_BACK_URL } from "../auth";
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

const LAST_PATH_KEY = "bsdc_last_path";

const FORM_PATHS = ["/", ...EDIT_PATHS, "/previewdetails", "/submitted"];
const ACCESS_TTL_MS = 30 * 1000;

function deniedTarget(reason, ssoId) {
  if (reason === "ACCOUNT_INACTIVE") return "/sso/not-active?ssoId=" + ssoId;
  if (reason === "NOT_APPROVED") return "/sso/pending?ssoId=" + ssoId;
  return "/sso/failed?reason=" + encodeURIComponent(reason || "access_denied");
}

function isPublicPath(pathname) {
  return pathname.startsWith("/sso/");
}

function AuthGate() {
  const location = useLocation();
  const { ids, resetForm } = useFormContext();

  const [status, setStatus] = useState("checking");
  const [isOic, setIsOic] = useState(null);
  const isOicRef = useRef(null);
  const [access, setAccess] = useState(null);
  const accessRef = useRef(null);

  const staleSubmitted =
    !!ids.submitted && EDIT_PATHS.includes(location.pathname.toLowerCase());

  useEffect(() => {
    if (staleSubmitted) resetForm({ keepUser: true });
  }, [staleSubmitted, resetForm]);

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (EDIT_PATHS.includes(path)) {
      try {
        localStorage.setItem(LAST_PATH_KEY, path);
      } catch {
        /* ignore storage errors */
      }
    }
  }, [location.pathname]);

  const runCheck = useCallback(async () => {
    if (isPublicPath(location.pathname)) {
      accessRef.current = null;
      setAccess(null);
      setStatus("authorized");
      return;
    }

    setStatus("checking");

    const result = await verifySession();

    if (result.authenticated) {
      const onFormPath = FORM_PATHS.includes(location.pathname.toLowerCase());
      const accessFresh =
        accessRef.current && Date.now() - accessRef.current.at < ACCESS_TTL_MS;

      if (isOicRef.current === null || (onFormPath && !accessFresh)) {
        const info = await fetchAccess();

        if (isOicRef.current === null) {
          const value = info ? !!info.isOic : null;
          isOicRef.current = value;
          setIsOic(value);
        }

        if (onFormPath) {
          if (!info) {
            accessRef.current = null;
            setAccess(null);
            setStatus("offline");
            return;
          }
          accessRef.current = { info, at: Date.now() };
        }
      }

      setAccess(onFormPath && accessRef.current ? accessRef.current.info : null);
      setStatus("authorized");
      return;
    }

    isOicRef.current = null;
    setIsOic(null);
    accessRef.current = null;
    setAccess(null);
    setStatus(result.reason === "server_unreachable" ? "offline" : "denied");
  }, [location.pathname]);

  useEffect(() => {
    runCheck();
  }, [runCheck]);

  useEffect(() => {
    if (location.state?.newForm) sessionStorage.setItem("oicNewForm", "1");
    if (location.pathname.toLowerCase().startsWith("/oic")) {
      sessionStorage.removeItem("oicNewForm");
    }
  }, [location]);

  useEffect(() => {
    function onStorage(event) {
      if (event.key === "ssoToken" || event.key === "ssoId") {
        isOicRef.current = null;
        setIsOic(null);
        accessRef.current = null;
        setAccess(null);
        runCheck();
      }
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

  const path = location.pathname.toLowerCase();
  const onOicPage = path === "/oic" || path.startsWith("/oic/");
  const oicAllowed =
    onOicPage || path === "/sso/success" || path === "/sso/failed";

  const comingFromNewForm = location.state?.newForm === true;
  const oicOnFormFlow = isOic === true && FORM_PATHS.includes(path);
  const oicNewFormActive =
    comingFromNewForm || sessionStorage.getItem("oicNewForm") === "1";

  if (isOic === true && !oicAllowed && !(oicOnFormFlow && oicNewFormActive)) {
    return <Navigate to="/oic" replace />;
  }

  if (isOic === false && onOicPage) return <Navigate to="/" replace />;

  if (FORM_PATHS.includes(path) && access?.access !== "FORM" && isOic !== true) {
    const sso = encodeURIComponent(getSsoId() || "");
    if (access?.access === "MAPPING") {
      return <Navigate to={"/sso/mapping?ssoId=" + sso} replace />;
    }
    if (access?.access === "DENIED") {
      return <Navigate to={deniedTarget(access.reason, sso)} replace />;
    }
    return null;
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
        <Route path="/oic" element={<OicPortal />} />
        <Route
          path="*"
          element={<Navigate to={isOic ? "/oic" : "/"} replace />}
        />
      </Routes>
    </>
  );
}

export default AuthGate;