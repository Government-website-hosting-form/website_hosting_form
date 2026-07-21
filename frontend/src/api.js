
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${options.method || "GET"} ${path} failed (${res.status}): ${text}`);
  }

  return res.json();
}

export const apiGet = (path) => request(path);

export const apiPost = (path, body) =>
  request(path, { method: "POST", body: JSON.stringify(body) });

export const apiPut = (path, body) =>
  request(path, { method: "PUT", body: JSON.stringify(body) });
