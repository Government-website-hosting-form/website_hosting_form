import { useRef } from "react";
import "./FileUploadField.css";
import { openFile } from "../helpers/fileView";

// Stored names look like "1793091484872-e211083ce88a-MyFile.pdf".
// Show only the original part ("MyFile.pdf"); older files without it show as-is.
export function displayFileName(p) {
  if (!p) return "";
  const base = String(p).split("/").pop();
  const m = base.match(/^\d+-[a-f0-9]{12}-(.+)$/i);
  return m ? m[1] : base;
}

// File name as a link; click opens the file in a new tab.
export function FileLink({ value }) {
  if (!value) return null;
  const name = displayFileName(value);
  return (
    <button type="button" className="file-link" onClick={() => openFile(value)} title={name}>
      {name}
    </button>
  );
}

export default function FileUploadField({
  value,
  uploading = false,
  disabled = false,
  onChange,
  accept = ".pdf,.jpg,.jpeg",
}) {
  const ref = useRef(null);
  const name = displayFileName(value);
  const busy = uploading || disabled;

  return (
    <div className={`file-field ${name && !uploading ? "has-file" : ""}`}>
      <input
        ref={ref}
        type="file"
        accept={accept}
        onChange={onChange}
        disabled={busy}
        style={{ display: "none" }}
      />
      <button
        type="button"
        className="file-field-btn"
        onClick={() => ref.current && ref.current.click()}
        disabled={busy}
      >
        {name ? "Change file" : "Choose file"}
      </button>
      <span className="file-field-name" title={name || undefined}>
        {uploading ? "Uploading..." : name ? <FileLink value={value} /> : "No file chosen"}
      </span>
    </div>
  );
}