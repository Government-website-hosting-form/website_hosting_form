import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiGet } from "../api";
import Layout from "../components/Layout";
import { useFormContext } from "../context/FormContext";
import { saveSession, clearSession, exchangeLoginCode } from "../auth";

export function SsoSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetForm, setId } = useFormContext();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      clearSession();
      navigate("/sso/failed?reason=missing_sso_credentials", { replace: true });
      return;
    }

    async function completeLogin() {
      let session;
      try {
        session = await exchangeLoginCode(code);
      } catch (error) {
        console.error("Login code exchange failed:", error.message);
        clearSession();
        navigate("/sso/failed?reason=login_code_invalid", { replace: true });
        return;
      }

      const { ssoId, token } = session;

      const prevSsoId = localStorage.getItem("ssoId");

      saveSession(ssoId, token);

      if (prevSsoId && prevSsoId !== ssoId) {
        resetForm();
        apiGet("/api/sso/mapping/me?ssoId=" + encodeURIComponent(ssoId))
          .then((res) => {
            if (res.success && res.user) setId("userId", res.user.user_id);
          })
          .catch(() => {});
      }

      let response;
      try {
        response = await apiGet(
          "/api/sso/2/user-details?ssoId=" + encodeURIComponent(ssoId)
        );
      } catch (error) {
        console.error("User details API error:", error);
        navigate("/sso/failed?reason=user_details_api_failed", {
          replace: true,
        });
        return;
      }

      const access = response.access;
      const reason = response.reason;

      if (access === "FORM") {
        navigate("/", { replace: true });
        return;
      }

      if (access === "DENIED") {
        if (reason === "ACCOUNT_INACTIVE") {
          navigate("/sso/not-active?ssoId=" + encodeURIComponent(ssoId), {
            replace: true,
          });
          return;
        }
        if (reason === "NOT_APPROVED") {
          navigate("/sso/pending?ssoId=" + encodeURIComponent(ssoId), {
            replace: true,
          });
          return;
        }
        navigate(
          "/sso/failed?reason=" + encodeURIComponent(reason || "access_denied"),
          { replace: true }
        );
        return;
      }

      if (access === "MAPPING" && reason === "FIRST_TIME_USER") {
        navigate("/sso/mapping?ssoId=" + encodeURIComponent(ssoId), {
          replace: true,
        });
        return;
      }

      if (access === "MAPPING") {
        try {
          const statusResponse = await apiGet(
            "/api/sso/mapping/status?ssoId=" + encodeURIComponent(ssoId)
          );
          const state = statusResponse.state;

          if (state === "approved") {
            navigate("/", { replace: true });
            return;
          }

          if (state === "pending") {
            navigate("/sso/pending?ssoId=" + encodeURIComponent(ssoId), {
              replace: true,
            });
            return;
          }

          if (state === "inactive") {
            navigate("/sso/not-active?ssoId=" + encodeURIComponent(ssoId), {
              replace: true,
            });
            return;
          }

          if (state === "rejected") {
            navigate("/sso/rejected?ssoId=" + encodeURIComponent(ssoId), {
              replace: true,
            });
            return;
          }

          if (state === "objection") {
            navigate(
              "/sso/objection?ssoId=" +
                encodeURIComponent(ssoId) +
                "&remarks=" +
                encodeURIComponent(statusResponse.remarks || ""),
              { replace: true }
            );
            return;
          }

          navigate("/sso/failed?reason=unknown_mapping_state", {
            replace: true,
          });
        } catch (error) {
          console.error("Status check failed:", error);
          navigate("/sso/failed?reason=status_check_failed", {
            replace: true,
          });
        }
        return;
      }

      navigate("/sso/failed?reason=unknown_access_value", { replace: true });
    }

    completeLogin();
  }, [searchParams, navigate]);

  return (
    <p style={{ textAlign: "center", marginTop: "40px" }}>Logging you in...</p>
  );
}

export function SsoRejected() {
  const [searchParams] = useSearchParams();
  const ssoId = searchParams.get("ssoId");

  return (
    <Layout>
      <h2 className="section-heading">Request Rejected</h2>

      <p className="landing-text">
        Your access request was reviewed and rejected. Please contact the
        concerned authority, or submit a new request with the correct details.
        {ssoId ? " (SSO ID: " + ssoId + ")" : ""}
      </p>
    </Layout>
  );
}

export function SsoPending() {
  const [searchParams] = useSearchParams();
  const ssoId = searchParams.get("ssoId");

  return (
    <Layout>
      <h2 className="section-heading">Request On Process</h2>

      <p className="landing-text">
        Your access request has already been submitted and is currently under
        review by the concerned authority.
      </p>

      <p className="landing-text">
        You will be able to access the Web Hosting Form once your request is
        approved.
        {ssoId ? " (SSO ID: " + ssoId + ")" : ""}
      </p>
    </Layout>
  );
}

export function SsoObjection() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ssoId =
    searchParams.get("ssoId") || localStorage.getItem("ssoId") || "";
  const remarks = searchParams.get("remarks") || "";

  function handleEdit() {
    navigate("/sso/mapping?ssoId=" + encodeURIComponent(ssoId));
  }

  return (
    <Layout>
      <h2 className="section-heading">Objection Raised On Your Request</h2>

      <p className="landing-text">
        The concerned authority (OIC) has raised an objection on your access
        request. Please review the remarks below, correct your details and
        resubmit.
        {ssoId ? " (SSO ID: " + ssoId + ")" : ""}
      </p>

      {remarks && (
        <p className="form-error">
          <strong>Objection Remarks:</strong> {remarks}
        </p>
      )}

      <div className="button-group">
        <button type="button" className="next-btn" onClick={handleEdit}>
          Edit Request
        </button>
      </div>
    </Layout>
  );
}

export function SsoNotActive() {
  const [searchParams] = useSearchParams();
  const ssoId = searchParams.get("ssoId");

  return (
    <Layout>
      <h2 className="section-heading">Account Not Active</h2>

      <p className="landing-text">
        Your account is currently inactive. Please contact the concerned
        administrator to reactivate your access.
        {ssoId ? " (SSO ID: " + ssoId + ")" : ""}
      </p>
    </Layout>
  );
}

export function SsoFailed() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason") || "unknown_error";

  if (reason === "NOT_G2G") {
    return (
      <Layout>
        <h2 className="section-heading">Access Not Authorized</h2>

        <p className="landing-text">
          You are not authorized to access this portal. This service is
          available only for Government (G2G) users, not for citizen logins.
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="section-heading">SSO Login Failed</h2>

      <p className="landing-text">
        {"We could not complete your SSO login (" +
          reason +
          "). Please return to the SSO portal and try logging in again."}
      </p>
    </Layout>
  );
}