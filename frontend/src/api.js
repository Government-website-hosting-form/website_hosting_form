import { clearSession } from "./auth";

const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000";

function clearSessionAndRedirect(reason) {
  clearSession();
  window.location.replace("/sso/failed?reason=" + encodeURIComponent(reason));
}

async function request(path, options = {}) {
  const token = localStorage.getItem("ssoToken");
  const ssoId = localStorage.getItem("ssoId");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "SSO-TOKEN": token } : {}),
    ...(ssoId ? { "SSO-ID": ssoId } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearSessionAndRedirect("session_expired");
    throw new Error("Session expired. Redirecting to login.");
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let parsed = null;

    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
    }

    const error = new Error(
      (parsed && parsed.message) ||
        `API ${options.method || "GET"} ${path} failed (${res.status}): ${text}`
    );

    error.status = res.status;
    error.body = parsed;
    throw error;
  }

  return res.json();
}

export const apiGet = (path) => request(path);

export const apiPost = (path, body) =>
  request(path, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const apiPut = (path, body) =>
  request(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });