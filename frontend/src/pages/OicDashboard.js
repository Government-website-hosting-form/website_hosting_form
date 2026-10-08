import React, { useEffect, useState, useCallback } from "react";
import { shortFormId } from "../helpers/formId";

const API = process.env.REACT_APP_API_URL || "http://localhost:3000";
const authHeaders = () => ({
  "Content-Type": "application/json",
  "SSO-TOKEN": localStorage.getItem("ssoToken"),
  "SSO-ID": localStorage.getItem("ssoId"),
});

const CIRCLES = [
  { key: "", label: "All", cls: "all" },
  { key: "pending", label: "Pending", cls: "pending" },
  { key: "approved", label: "Approved", cls: "approved" },
  { key: "rejected", label: "Access Denied", cls: "rejected" },
  { key: "objection", label: "Objection", cls: "objection" },
];

const SECTIONS = [
  { title: "Organization / Department Details", src: "org", fields: [
    ["name", "Department Name"], ["type", "Department Type"], ["officer", "Officer Name"],
    ["officer_designation", "Officer Designation"], ["email", "Email"], ["phone_office", "Office Phone"],
    ["phone", "Mobile"], ["address", "Address"], ["contact_name", "Contact Person"],
    ["contact_designation", "Contact Designation"], ["contact_phone", "Contact Phone"],
    ["contact_email", "Contact Email"]] },
  { title: "Application Details", src: "request", fields: [
    ["name", "Application Name"], ["type", "Application Type"], ["nature", "Nature"],
    ["utility", "Utility"], ["purpose", "Purpose"], ["subdomain", "Subdomain"], ["url", "URL"],
    ["alternate_url", "Alternate URL"], ["approval_authority", "Approval Authority"],
    ["approval_designation", "Approval Designation"], ["semt_approved", "SEMT Approved"],
    ["mom_ref_no", "MOM Ref No"], ["mom_date", "MOM Date"]] },
  { title: "Developer Details", src: "request", fields: [
    ["dev_company", "Company"], ["dev_contact_person", "Contact Person"], ["dev_address", "Address"],
    ["dev_phone_office", "Office Phone"], ["dev_phone", "Mobile"], ["dev_email", "Email"]] },
  { title: "Maintenance Details", src: "request", fields: [
    ["maint_company", "Company"], ["maint_active", "Active"], ["maint_expiry", "Expiry"],
    ["maint_contact_person", "Contact Person"], ["maint_address", "Address"],
    ["maint_phone_office", "Office Phone"], ["maint_phone_mobile", "Mobile"], ["maint_email", "Email"],
    ["maint_contract_attached", "Contract Attached"]] },
  { title: "Safe-to-Host Certificate", src: "request", fields: [
    ["safehost_agency", "Agency"], ["safehost_empanel_no", "Empanelment No"],
    ["safehost_empanel_valid_till", "Empanelment Valid Till"], ["safehost_ref_no", "Reference No"],
    ["safehost_issue_date", "Issue Date"], ["safehost_valid_till", "Valid Till"]] },
  { title: "Load Test", src: "request", fields: [
    ["load_users", "Users"], ["loadtest_agency", "Agency"], ["loadtest_avg_response", "Avg Response"],
    ["loadtest_ref_no", "Reference No"], ["loadtest_issue_date", "Issue Date"],
    ["loadtest_valid_till", "Valid Till"]] },
  { title: "Other", src: "request", fields: [
    ["other_certificate_details", "Other Certificate Details"], ["request_status", "Status"],
    ["objection_remarks", "Objection Remarks"]] },
];

const YESNO = ["semt_approved", "maint_active", "maint_contract_attached"];
const fmt = (k, v) => {
  if (v === null || v === undefined || v === "") return "-";
  if (YESNO.includes(k)) return v === 1 || v === true || v === "1" ? "Yes" : v === 0 || v === false || v === "0" ? "No" : String(v);
  return String(v);
};

// Status ko hamesha ek standard value me badalta hai: pending / approved / rejected / objection
const normStatus = (s) => {
  const v = String(s ?? "").trim().toLowerCase();
  if (!v) return "";
  if (v.includes("pend")) return "pending";
  if (v.includes("approv")) return "approved";
  if (v.includes("reject") || v.includes("deni")) return "rejected";
  if (v.includes("object")) return "objection";
  return v;
};

const RowsTable = ({ rows }) => {
  if (!rows || !rows.length) return <p style={{ color: "#6b7280", margin: 0 }}>No data available</p>;
  const keys = Object.keys(rows[0]).filter((k) => k !== "id" && k !== "app_id");
  return (
    <div className="tablebox">
      <table>
        <thead><tr>{keys.map((k) => <th key={k}>{k.replace(/_/g, " ")}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{keys.map((k) => <td key={k}>{fmt(k, r[k])}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SORT_COLS = [
  ["form_id", "Form ID"], ["url", "URL"], ["officer_name", "Officer Name"],
  ["application", "Application"], ["department", "Department"],
  ["status", "Status"], ["submitted_at", "Submitted"],
];
const fmtDate = (d) => {
  if (!d) return "-";
  const t = new Date(d);
  return isNaN(t) ? "-" : t.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};
const toHref = (u) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);

const css = `
.oic,.oic *,.oic *::before,.oic *::after{box-sizing:border-box}
.oic{--line:#ccd3da;--muted:#666;--primary:#123d6d;font-family:inherit;background:transparent;color:#222;min-height:100vh;padding:20px;font-size:14px}
.oic h2{margin:0 0 14px;font-size:22px;text-align:center}
.oic .sub{color:var(--muted);margin:0 0 14px}
.oic .err{background:#fdecea;color:#b71c1c;border:1px solid #f5c6cb;padding:8px 12px;border-radius:4px;margin-bottom:12px}

/* status filter: simple radio jaise options */
.oic .circles{display:flex;gap:22px;flex-wrap:wrap;align-items:center;margin-bottom:14px}
.oic .circle{--c:#666;display:inline-flex;align-items:center;gap:6px;background:none;border:none;padding:2px 0;cursor:pointer;font-family:inherit;font-size:14px;color:#333}
.oic .circle::before{content:"";width:14px;height:14px;border-radius:50%;border:2px solid var(--c);background:#fff;display:inline-block}
.oic .circle.active::before{background:var(--c)}
.oic .circle.active{font-weight:bold}
.oic .circle .cn::before{content:"("}
.oic .circle .cn::after{content:")"}
.oic .circle.all,.oic .circle.pending,.oic .circle.approved,.oic .circle.rejected,.oic .circle.objection{--c:#123d6d}

.oic .filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.oic .filters input,.oic .filters select{padding:8px 10px;border:1px solid #ccc;border-radius:4px;background:#fff;font-size:14px;font-family:inherit}
.oic .filters input{flex:1;min-width:240px}
.oic .filters input:focus,.oic .filters select:focus,.oic textarea:focus{outline:none;border-color:#123d6d;box-shadow:0 0 0 2px rgba(18,61,109,.2)}

.oic .btn{border:1px solid #bbb;background:#f5f5f5;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;font-family:inherit;color:#222;white-space:nowrap}
.oic .btn:hover:not(:disabled){background:#e6e6e6}
.oic .btn:disabled{opacity:.5;cursor:not-allowed}
.oic .btn.view{background:#123d6d;border-color:#123d6d;color:#fff}
.oic .btn.view:hover:not(:disabled){background:#0d2f55}

/* modal action buttons */
.oic .btn.ok{background:#2e7d32;border-color:#2e7d32;color:#fff}
.oic .btn.ok:hover:not(:disabled){background:#1b5e20}
.oic .btn.deny{background:#b71c1c;border-color:#b71c1c;color:#fff}
.oic .btn.deny:hover:not(:disabled){background:#8e1515}
.oic .btn.warn{background:#e65100;border-color:#e65100;color:#fff}
.oic .btn.warn:hover:not(:disabled){background:#bf4300}

/* table */
.oic .tablebox{background:#fff;border:1px solid var(--line);overflow:auto;max-width:100%}
.oic table{width:100%;border-collapse:collapse}
.oic th{text-align:left;padding:9px 10px;font-size:14px;font-weight:bold;color:#123d6d;background:#e8eff5;border:1px solid var(--line);white-space:nowrap;text-transform:capitalize}
.oic td{padding:9px 10px;border:1px solid var(--line);vertical-align:middle}
.oic .empty{text-align:center;color:var(--muted);padding:24px}
.oic .fid{display:inline-block;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:bottom}
.oic .tablebox > table > tbody > tr > td:nth-child(2){white-space:nowrap}
.oic .tablebox > table > tbody > tr > td:nth-child(7){min-width:120px}
.oic .tablebox > table > tbody > tr > td:last-child{width:1%;white-space:nowrap}

.oic .badge{font-weight:bold;text-transform:capitalize}

.oic .pager{display:flex;align-items:center;gap:10px;margin-top:12px;color:#333;flex-wrap:wrap}
.oic .pinfo{margin-left:auto;font-size:13px;color:var(--muted)}

/* modal */
.oic .overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;justify-content:center;align-items:flex-start;overflow:auto;padding:24px 12px;z-index:50}
.oic .modal{background:#fff;border-radius:6px;padding:20px;width:100%;max-width:800px;height:fit-content}
.oic .modal.small{max-width:440px;margin-top:10vh}
.oic .modal h3{margin:0 0 12px;font-size:18px}
.oic .modal h4{margin:16px 0 6px}
.oic .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(220px,100%),1fr));gap:8px}
.oic .field{background:#f9f9f9;border:1px solid var(--line);padding:8px 10px;word-break:break-word}
.oic .field label{display:block;font-size:11px;color:var(--muted);margin-bottom:2px;text-transform:capitalize}
.oic pre{background:#f3f3f3;padding:10px;overflow:auto;font-size:12px;max-height:200px}
.oic textarea{width:100%;min-height:100px;padding:8px;border:1px solid #ccc;border-radius:4px;font-family:inherit;font-size:14px;resize:vertical}
.oic .modal-actions{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:16px}
.oic a.link{color:#0b5ed7;text-decoration:none}
.oic a.link:hover{text-decoration:underline}
.oic td a.link{display:inline-block;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:bottom}
.oic th.sortable{cursor:pointer;user-select:none}
.oic .tablebox.loading{opacity:.6}
.oic .hover{cursor:help}
.oic .remark{margin-top:4px;font-size:12px;color:var(--muted);max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.oic .remarkbox{background:#fff8e1;border:1px solid #ffe08a;color:#7a5b00;padding:10px 12px;border-radius:4px;margin-bottom:12px}
.oic .toast{position:fixed;bottom:20px;right:20px;background:#333;color:#fff;padding:10px 16px;border-radius:4px;z-index:100}
.oic .mhead{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px}
.oic .mhead h3{margin:0}
.oic .mhead small{color:var(--muted)}
.oic .xbtn{border:none;background:none;font-size:26px;line-height:1;cursor:pointer;color:#666;padding:0 4px}
.oic .fsec{border:1px solid var(--line);margin-bottom:12px;overflow:hidden}
.oic .fhead{background:#e8eff5;color:#123d6d;padding:8px 12px;font-weight:bold}
.oic .fgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr))}
.oic .frow{display:flex;gap:8px;padding:8px 12px;border-top:1px solid var(--line)}
.oic .fl{color:var(--muted);min-width:130px;flex-shrink:0}
.oic .fv{word-break:break-word}

@media (max-width:1400px){
  .oic .fid{max-width:170px}
  .oic td a.link{max-width:170px}
  .oic th,.oic td{padding:9px 8px}
  .oic .btn{padding:5px 9px}
}
@media (max-width:640px){
  .oic{padding:12px}
  .oic .filters input{min-width:100%}
  .oic .filters select{flex:1 1 calc(50% - 4px);min-width:0}
  .oic .frow{flex-direction:column;gap:2px}
  .oic .fl{min-width:0}
  .oic .modal{padding:14px}
  .oic .toast{left:12px;right:12px;bottom:12px}
}
`;

export default function OicDashboard({ embedded = false }) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [f, setF] = useState({ status: "", department: "", application: "" });
  const [opts, setOpts] = useState({ departments: [], applications: [], statuses: [], counts: {} });
  const [selected, setSelected] = useState(null); // view/edit modal
  const [objTarget, setObjTarget] = useState(null); // { type, id, form_id }
  const [objText, setObjText] = useState("");
  const [error, setError] = useState("");
  const [counts, setCounts] = useState({});
  const [sort, setSort] = useState({ by: "submitted_at", dir: "desc" });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const limit = 10;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ search, ...f, page, limit, sort: sort.by, dir: sort.dir });
      const res = await fetch(`${API}/api/oic/requests?${q}`, { headers: authHeaders() });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(`${res.status}: ${data.message || "API failed"}`);
        return;
      }
      setError("");
      setRows(data.rows || []);
      setTotal(data.total || 0);
      setCounts(data.counts || {});
    } catch (e) {
      setError("Unable to connect to the server: " + e.message);
    } finally {
      setLoading(false);
    }
  }, [search, f, page, sort]);

  const loadMeta = useCallback(() => {
    fetch(`${API}/api/oic/filters`, { headers: authHeaders() })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Filters API failed: ${r.status}`);
        return r.json();
      })
      .then((d) =>
        setOpts({
          departments: d.departments || [],
          applications: d.applications || [],
          statuses: d.statuses || [],
          counts: d.counts || {},
        })
      )
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  // rowStatus: list table wale row ka status (fallback ke liye)
  const open = async (id, rowStatus) => {
    try {
      const res = await fetch(`${API}/api/oic/requests/${id}`, { headers: authHeaders() });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(`${res.status}: ${d.message || "Load failed"}`);
        return;
      }
      const app = d.app || {};
      const status = normStatus(app.request_status ?? app.status ?? rowStatus);
      setSelected({
        request: {
          ...app,
          id: app.app_id ?? app.id ?? id,
          request_status: status,
          objection_remarks: app.objection_remarks ?? app.remarks ?? "",
        },
        org: d.org,
        infra: d.infra,
        checklist: d.checklist,
        audit: d.audit,
      });
    } catch (e) {
      setError("Unable to load the form: " + e.message);
    }
  };

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openReason = (type, id, form_id) => {
    setObjTarget({ type, id, form_id });
    setObjText("");
  };
  const openObjection = (id, form_id) => openReason("objection", id, form_id);
  const openReject = (id, form_id) => openReason("reject", id, form_id);

  const submitObjection = async () => {
    const remarks = objText.trim();
    if (!remarks || busy) return;
    const { type, id, form_id } = objTarget;
    setBusy(true);
    try {
      const res = await fetch(`${API}/api/oic/requests/${id}/${type}`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ remarks }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(`${res.status}: ${d.message || "Action failed"}`);
        return;
      }
      setError("");
      setObjTarget(null);
      setSelected(null);
      flash(type === "reject" ? `Form ${form_id} marked as Access Denied` : `Objection raised on form ${form_id}`);
      load();
      loadMeta();
    } catch (e) {
      setError("Action failed: " + e.message);
    } finally {
      setBusy(false);
    }
  };

  const approve = async (id, form_id) => {
    if (!window.confirm(`Are you sure you want to approve form ${form_id}?`)) return;
    try {
      const res = await fetch(`${API}/api/oic/requests/${id}/approve`, {
        method: "POST",
        headers: authHeaders(),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(`${res.status}: ${d.message || "Approve failed"}`);
        return;
      }
      setError("");
      setSelected(null);
      flash(`Form ${form_id} approved successfully`);
      load();
      loadMeta();
    } catch (e) {
      setError("Approval failed: " + e.message);
    }
  };

  // View modal me Approve button hamesha dikhega (approved status par bhi).
  // Objection / Denied sirf tab chhupte hain jab status already wahi ho.
  const canApprove = () => true;
  const canObject = (st) => st !== "objection";
  const canDeny = (st) => st !== "rejected";

  const sortBy = (by) => {
    setSort((s) => ({
      by,
      dir: s.by === by ? (s.dir === "asc" ? "desc" : "asc") : by === "submitted_at" ? "desc" : "asc",
    }));
    setPage(1);
  };
  const arrow = (by) => (sort.by === by ? (sort.dir === "asc" ? " \u25B2" : " \u25BC") : "");

  const clear = () => {
    setF({ status: "", department: "", application: "" });
    setSearch("");
    setPage(1);
  };
  const set = (k) => (e) => {
    setF({ ...f, [k]: e.target.value });
    setPage(1);
  };
  const pickCircle = (key) => {
    setF({ ...f, status: key });
    setPage(1);
  };

  const allCount = Object.values(counts).reduce((a, b) => a + Number(b), 0);
  const countFor = (key) => (key === "" ? allCount : Number(counts[key] || 0));
  const displayId = (r) => shortFormId(r.form_id || r.request_no || `APP-${r.id}`);

  const selStatus = selected ? selected.request.request_status : "";

  return (
    <div className="oic" style={embedded ? { padding: 0, minHeight: "auto", background: "transparent" } : undefined}>
      <style>{css}</style>

      {!embedded && <h2>OIC Dashboard</h2>}
      {error && <div className="err">{error}</div>}

      {/* Filter circles */}
      <div className="circles">
        {CIRCLES.map((c) => (
          <button
            key={c.key || "all"}
            className={`circle ${c.cls} ${f.status === c.key ? "active" : ""}`}
            onClick={() => pickCircle(c.key)}
            title={`Show ${c.label} requests`}
          >
            <span className="cl">{c.label}</span>
            <span className="cn">{countFor(c.key)}</span>
          </button>
        ))}
      </div>

      <div className="filters">
        <input
          placeholder="Search URL, officer, application, department, status..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select value={f.status} onChange={set("status")}>
          <option value="">All Status</option>
          {opts.statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select value={f.department} onChange={set("department")}>
          <option value="">All Departments</option>
          {opts.departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select value={f.application} onChange={set("application")}>
          <option value="">All Applications</option>
          {opts.applications.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <button className="btn" onClick={clear}>
          Clear
        </button>
      </div>

      <div className={loading ? "tablebox loading" : "tablebox"}>
        <table>
          <thead>
            <tr>
              {SORT_COLS.map(([k, label]) => (
                <th key={k} className="sortable" onClick={() => sortBy(k)}>
                  {label}
                  {arrow(k)}
                </th>
              ))}
              <th>Action By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0 && (
              <tr>
                <td colSpan="9" className="empty">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan="9" className="empty">
                  No records found
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <span className="fid" title={displayId(r)}>
                    {displayId(r)}
                  </span>
                </td>
                <td>
                  {r.url ? (
                    <a className="link" href={toHref(r.url)} title={r.url} target="_blank" rel="noreferrer">
                      {r.url}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <span
                    className="hover"
                    title={[r.officer_email, r.officer_phone].filter(Boolean).join(" | ") || undefined}
                  >
                    {r.officer_name}
                  </span>
                </td>
                <td>{r.application}</td>
                <td>{r.department}</td>
                <td>
                  <span className={`badge ${r.status}`}>{r.status}</span>
                  {r.remarks && (normStatus(r.status) === "objection" || normStatus(r.status) === "rejected") && (
                    <div className="remark" title={r.remarks}>
                      {r.remarks}
                    </div>
                  )}
                </td>
                <td>{fmtDate(r.submitted_at)}</td>
                <td>
                  {r.acted_by ? (
                    <>
                      <span>{r.acted_by}</span>
                      <div className="remark" title={r.acted_at || undefined}>
                        {r.acted_at}
                      </div>
                    </>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <button className="btn view" onClick={() => open(r.id, r.status)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <button className="btn" disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} / {Math.max(1, Math.ceil(total / limit))}
        </span>
        <button className="btn" disabled={page * limit >= total} onClick={() => setPage(page + 1)}>
          Next
        </button>
        <span className="pinfo">
          Showing {rows.length ? (page - 1) * limit + 1 : 0}-{(page - 1) * limit + rows.length} of {total}
        </span>
      </div>

      {/* View modal (form jaisa) */}
      {selected && (
        <div className="overlay">
          <div className="modal">
            <div className="mhead">
              <div>
                <h3>Website Hosting Request Form</h3>
                <small>Form ID: {displayId(selected.request)}</small>
              </div>
              <button className="xbtn" aria-label="Close" onClick={() => setSelected(null)}>
                &times;
              </button>
            </div>

            {["objection", "rejected"].includes(selStatus) && selected.request.objection_remarks && (
              <div className="remarkbox">
                <b>
                  {selStatus === "rejected" ? "Reason for Access Denied" : "Reason for Objection"}:
                </b>{" "}
                {selected.request.objection_remarks}
              </div>
            )}

            {SECTIONS.map((sec) => {
              const data = (sec.src === "org" ? selected.org : selected.request) || {};
              return (
                <div className="fsec" key={sec.title}>
                  <div className="fhead">{sec.title}</div>
                  <div className="fgrid">
                    {sec.fields.map(([k, label]) => (
                      <div className="frow" key={k}>
                        <span className="fl">{label}</span>
                        <span className="fv">{fmt(k, data[k])}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <h4>Infra</h4>
            <RowsTable rows={selected.infra} />
            <h4>Checklist</h4>
            <RowsTable rows={selected.checklist} />
            <h4>Audit Log</h4>
            <RowsTable rows={selected.audit} />

            <p>
              <a
                className="link"
                href={`${API}/api/mapping/${selected.request.id}/approval-letter`}
                target="_blank"
                rel="noreferrer"
              >
                Approval Letter
              </a>
            </p>

            <div className="modal-actions">
              {canApprove(selStatus) && (
                <button
                  className="btn ok"
                  onClick={() => approve(selected.request.id, displayId(selected.request))}
                >
                  Approve
                </button>
              )}
              {canObject(selStatus) && (
                <button
                  className="btn warn"
                  onClick={() => openObjection(selected.request.id, displayId(selected.request))}
                >
                  Raise Objection
                </button>
              )}
              {canDeny(selStatus) && (
                <button
                  className="btn deny"
                  onClick={() => openReject(selected.request.id, displayId(selected.request))}
                >
                  Denied
                </button>
              )}
              <button className="btn" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Objection / Access Denied modal */}
      {objTarget && (
        <div className="overlay" style={{ zIndex: 60 }}>
          <div className="modal small">
            <h3>
              {objTarget.type === "reject" ? "Access Denied" : "Raise Objection"} - {objTarget.form_id}
            </h3>
            <textarea
              placeholder={
                objTarget.type === "reject"
                  ? "Enter the reason for Access Denied..."
                  : "Enter the reason for objection..."
              }
              value={objText}
              onChange={(e) => setObjText(e.target.value)}
              autoFocus
            />
            <div className="modal-actions">
              <button
                className={objTarget.type === "reject" ? "btn deny" : "btn warn"}
                disabled={!objText.trim() || busy}
                onClick={submitObjection}
              >
                {busy ? "Please wait..." : objTarget.type === "reject" ? "Submit Denied" : "Submit Objection"}
              </button>
              <button className="btn" onClick={() => setObjTarget(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}