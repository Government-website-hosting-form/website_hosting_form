import React, { useEffect, useState, useCallback } from "react";
import { shortFormId } from "../helpers/formId";
import FormPreviewContent from "../components/FormPreviewContent";
import "./OicDashboard.css";

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

// type / ssl_type come from the DB as JSON text
const parseJson = (v, fallback) => {
  if (!v) return fallback;
  if (typeof v === "object") return v;
  try { return JSON.parse(v); } catch { return [v]; }
};

const RowsTable = ({ rows }) => {
  if (!rows || !rows.length) return <p className="nodata">No data available</p>;
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
        stagingServers: d.stagingServers,
        productionServers: d.productionServers,
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
    <div className={embedded ? "oic embedded" : "oic"}>
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

            {/* Same document as the PDF (read-only: no Edit buttons) */}
            <FormPreviewContent
              readOnly
              org={selected.org}
              app={{ ...selected.request, type: parseJson(selected.request.type, []) }}
              infra={selected.infra && selected.infra[0] ? { ...selected.infra[0], ssl_type: parseJson(selected.infra[0].ssl_type, []) } : null}
              stagingServers={selected.stagingServers}
              productionServers={selected.productionServers}
              checklist={selected.checklist && selected.checklist[0] ? selected.checklist[0] : null}
            />

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
        <div className="overlay overlay-top">
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