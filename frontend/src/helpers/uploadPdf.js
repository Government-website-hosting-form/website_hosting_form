const API = process.env.REACT_APP_API_URL || "";

// target: "apps" or "infra", id: appId or infraId, field: DB column name
export async function uploadFile(file, target, id, field) {
  const fd = new FormData();
  fd.append("target", target);
  fd.append("id", id);
  fd.append("field", field);
  fd.append("file", file);

  const res = await fetch(`${API}/api/upload-file`, {
    method: "POST",
    headers: {
      "SSO-TOKEN": localStorage.getItem("ssoToken"),
      "SSO-ID": localStorage.getItem("ssoId"),
    },
    body: fd, // do not set Content-Type; the browser sets it
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data.path; // e.g. "uploads/form-pdfs/1699-ab12cd.pdf"
}

// Kept only so old imports in other pages don't break the build.
// Remove the stray handlePdfChange from those pages and delete this line.
export { uploadFile as uploadPdf };