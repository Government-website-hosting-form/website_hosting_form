import { apiGet } from "../api";

// Pages jo bina login/status check ke khulte hain (login callback + error page).
// Baaki har /sso/* page ab status ke hisaab se gated hai.
const PUBLIC_PATHS = ["/sso/success", "/sso/failed"];

export function isPublicPath(pathname) {
  return PUBLIC_PATHS.includes((pathname || "").toLowerCase());
}

// Har status ke liye kaun se pages khul sakte hain.
// "form" = /sso/* ke bahar ke saare pages (form, OIC portal, etc.)
const ALLOWED_SSO_PATHS = {
  mapping: ["/sso/mapping"],
  objection: ["/sso/objection", "/sso/mapping"], // objection ke baad edit karke resubmit
  pending: ["/sso/pending"],
  rejected: ["/sso/rejected"],
  inactive: ["/sso/not-active"],
  denied: ["/sso/failed"],
};

export function isPathAllowed(kind, pathname) {
  const path = (pathname || "").toLowerCase();

  if (isPublicPath(path)) return true;

  if (kind === "form") return !path.startsWith("/sso/");

  return (ALLOWED_SSO_PATHS[kind] || []).includes(path);
}

function withSsoId(path, ssoId) {
  return ssoId ? path + "?ssoId=" + encodeURIComponent(ssoId) : path;
}

// Server se current status nikaal ke batata hai ki user ko kahan hona chahiye.
// Returns { kind, path, isOic }
//   kind: form | mapping | pending | rejected | objection | inactive | denied
export async function resolveDestination(ssoId) {
  const details = await apiGet("/api/sso/2/user-details");
  const isOic = !!details.isOic;

  const result = (kind, path) => ({ kind, path, isOic });

  if (details.access === "FORM") return result("form", "/");

  if (details.access === "DENIED") {
    if (details.reason === "ACCOUNT_INACTIVE") {
      return result("inactive", withSsoId("/sso/not-active", ssoId));
    }
    if (details.reason === "NOT_APPROVED") {
      return result("pending", withSsoId("/sso/pending", ssoId));
    }
    return result(
      "denied",
      "/sso/failed?reason=" + encodeURIComponent(details.reason || "access_denied")
    );
  }

  if (details.access === "MAPPING") {
    // users row approval ke baad hi banti hai, isliye latest request dekho
    const status = await apiGet("/api/sso/mapping/status");

    switch (status.state) {
      case "none":
        return result("mapping", withSsoId("/sso/mapping", ssoId));
      case "pending":
        return result("pending", withSsoId("/sso/pending", ssoId));
      case "rejected":
        return result("rejected", withSsoId("/sso/rejected", ssoId));
      case "objection":
        return result("objection", withSsoId("/sso/objection", ssoId));
      case "inactive":
        return result("inactive", withSsoId("/sso/not-active", ssoId));
      case "approved":
        // Approved user, par RajSSO ki department/designation badal gayi
        // -> naya mapping chahiye. Warna user row sync hone tak wait.
        return details.reason === "USER_MAPPING_REQUIRED"
          ? result("mapping", withSsoId("/sso/mapping", ssoId))
          : result("pending", withSsoId("/sso/pending", ssoId));
      default:
        return result("denied", "/sso/failed?reason=unknown_mapping_state");
    }
  }

  return result("denied", "/sso/failed?reason=unknown_access_value");
}