const API = process.env.REACT_APP_API_URL || "";

const authHeaders = () => {
  const token = localStorage.getItem("ssoToken");
  const ssoId = localStorage.getItem("ssoId");
  return {
    ...(token ? { "SSO-TOKEN": token } : {}),
    ...(ssoId ? { "SSO-ID": ssoId } : {}),
  };
};

export const fileUrl = (v) =>
  /^https?:\/\//i.test(v) ? v : `${API}/${String(v).replace(/^\/+/, "")}`;

export const isImageFile = (v) => /\.jpe?g(\?.*)?$/i.test(String(v || "").trim());

// Files need the SSO headers, so a plain <a href> or <img src> can't load them.
// Fetch with headers and return a blob: URL (caller must revoke it).
export async function fetchFileObjectUrl(v) {
  const res = await fetch(fileUrl(v), { headers: authHeaders() });
  if (!res.ok) throw new Error(res.status);
  const blob = await res.blob();
  const type = isImageFile(v) ? "image/jpeg" : "application/pdf";
  return URL.createObjectURL(new Blob([blob], { type }));
}

// Opens the file in a new tab. window.open runs first so popup blockers allow it.
export async function openFile(v) {
  const w = window.open("", "_blank");
  try {
    const url = await fetchFileObjectUrl(v);
    if (w) w.location.href = url;
  } catch (e) {
    if (w) w.close();
    alert("Unable to open file: " + e.message);
  }
}