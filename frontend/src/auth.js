const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const SSO_BACK_URL =
  process.env.REACT_APP_SSO_BACK_URL || "https://ssotest.rajasthan.gov.in/sso";

const SSO_SIGNOUT_URL =
  process.env.REACT_APP_SSO_SIGNOUT_URL ||
  "https://ssotest.rajasthan.gov.in/sso/signout";

const TOKEN_KEY = "ssoToken";
const SSO_ID_KEY = "ssoId";
const FORM_IDS_KEY = "bsdc_form_ids";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getSsoId() {
  return localStorage.getItem(SSO_ID_KEY);
}

export function saveSession(ssoId, token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (ssoId) localStorage.setItem(SSO_ID_KEY, ssoId);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SSO_ID_KEY);
  localStorage.removeItem(FORM_IDS_KEY);
  ["ssoUserType", "ssoRoles", "ssoDepartment", "ssoDesignation"].forEach(
    (key) => localStorage.removeItem(key)
  );
}

const exchanges = new Map();

export function exchangeLoginCode(code) {
  if (!exchanges.has(code)) {
    const request = fetch(`${BASE_URL}/api/sso/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    }).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success || !data.token || !data.ssoId) {
        throw new Error(data.reason || "exchange_failed");
      }
      return { ssoId: data.ssoId, token: data.token };
    });
    exchanges.set(code, request);
  }
  return exchanges.get(code);
}

export async function verifySession() {
  const token = getToken();
  const ssoId = getSsoId();

  if (!token || !ssoId) {
    return { authenticated: false, reason: "no_local_session" };
  }

  try {
    const res = await fetch(
      `${BASE_URL}/api/sso/session?ssoId=${encodeURIComponent(ssoId)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "SSO-TOKEN": token,
          "SSO-ID": ssoId,
        },
      }
    );

    if (res.status === 401 || res.status === 403) {
      clearSession();
      return { authenticated: false, reason: "session_expired" };
    }

    if (!res.ok) {
      return { authenticated: false, reason: "server_unreachable" };
    }

    const data = await res.json();

    if (!data.authenticated) {
      clearSession();
      return { authenticated: false, reason: "session_expired" };
    }

    return { authenticated: true, ssoId: data.ssoId };
  } catch (error) {
    console.error("verifySession failed:", error);
    return { authenticated: false, reason: "server_unreachable" };
  }
}

export function backToSso() {
  window.location.assign(SSO_BACK_URL);
}

export async function logout() {
  const token = getToken();

  try {
    await fetch(`${BASE_URL}/api/sso/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "SSO-TOKEN": token } : {}),
      },
      body: JSON.stringify({ token }),
      keepalive: true,
    });
  } catch (error) {
    console.error("Backend logout call failed, continuing anyway:", error);
  } finally {
    clearSession();
    window.location.replace(SSO_SIGNOUT_URL);
  }
}

export { SSO_BACK_URL, SSO_SIGNOUT_URL };