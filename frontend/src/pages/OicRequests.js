import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { apiGet, apiPost } from "../api";

const css = `
.oic{--line:#e5e7eb;--muted:#6b7280;--primary:#4f46e5;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  background:#f9fafb;color:#111827;min-height:100vh;padding:20px;font-size:14px}
.oic h2{margin:0 0 14px;font-size:22px;text-align:center}
.oic .sub{color:var(--muted);margin:0 0 14px}
.oic .err{background:#fef2f2;color:#b91c1c;padding:8px 12px;border-radius:6px;margin-bottom:12px}

.oic .circles{display:flex;gap:18px;flex-wrap:wrap;align-items:center;margin-bottom:14px}
.oic .circle{display:inline-flex;align-items:center;gap:6px;background:none;border:none;padding:2px 0;cursor:pointer;font-family:inherit;font-size:13px;color:#374151}
.oic .circle i{width:14px;height:14px;border-radius:50%;border:2px solid #6b7280;background:#fff;display:inline-block}
.oic .circle.active i{background:#111827;border-color:#111827}
.oic .circle.active{font-weight:600;color:#111827}
.oic .circle.all{--c:#4f46e5}.oic .circle.pending{--c:#f59e0b}.oic .circle.approved{--c:#16a34a}
.oic .circle.rejected{--c:#dc2626}.oic .circle.objection{--c:#ea580c}

.oic .filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.oic .filters input,.oic .filters select{padding:8px 10px;border:1px solid var(--line);border-radius:6px;background:#fff;font-size:14px}
.oic .filters input{flex:1;min-width:240px}

.oic .btn{border:1px solid var(--line);background:#fff;padding:5px 12px;border-radius:6px;cursor:pointer;font-size:13px;font-family:inherit}
.oic .btn:disabled{opacity:.5;cursor:not-allowed}
.oic .btn.ok{background:#f0fdf4;border-color:#86efac;color:#15803d}
.oic .btn.warn{background:#fff7ed;border-color:#fdba74;color:#c2410c}

.oic .tablebox{background:#fff;border:1px solid var(--line);border-radius:8px;overflow:auto}
.oic table{width:100%;border-collapse:collapse}
.oic th{text-align:left;padding:10px 12px;font-size:12px;color:var(--muted);border-bottom:1px solid var(--line);white-space:nowrap}
.oic td{padding:10px 12px;border-bottom:1px solid var(--line)}
.oic tbody tr:last-child td{border-bottom:none}
.oic .empty{text-align:center;color:var(--muted);padding:24px}
.oic .actions{display:flex;gap:6px}

.oic .badge{padding:2px 9px;border-radius:999px;font-size:12px;text-transform:capitalize}
.oic .badge.pending{background:#fef3c7;color:#b45309}.oic .badge.approved{background:#dcfce7;color:#15803d}
.oic .badge.rejected{background:#fee2e2;color:#b91c1c}.oic .badge.objection{background:#ffedd5;color:#c2410c}

.oic .pager{display:flex;align-items:center;gap:10px;margin-top:12px;color:var(--muted)}

.oic .overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;justify-content:center;overflow:auto;padding:24px 12px;z-index:50}
.oic .modal{background:#fff;border-radius:8px;padding:20px;width:100%;max-width:800px;height:fit-content}
.oic .modal.small{max-width:440px;margin-top:10vh}
.oic .modal h3{margin:0 0 12px;font-size:18px}
.oic .modal h4{margin:16px 0 6px}
.oic .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px}
.oic .field{background:#f9fafb;border:1px solid var(--line);border-radius:6px;padding:8px 10px;word-break:break-word}
.oic .field label{display:block;font-size:11px;color:var(--muted);margin-bottom:2px;text-transform:capitalize}
.oic pre{background:#f3f4f6;padding:10px;border-radius:6px;overflow:auto;font-size:12px;max-height:200px}
.oic textarea{width:100%;min-height:100px;padding:8px;border:1px solid var(--line);border-radius:6px;font-family:inherit;box-sizing:border-box}
.oic .modal-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:16px}
.oic a.link{color:var(--primary);text-decoration:none}
.oic .mhead{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
.oic .mhead h3{margin:0}
.oic .mhead small{color:var(--muted)}
.oic .xbtn{border:none;background:none;font-size:26px;line-height:1;cursor:pointer;color:#6b7280;padding:0 4px}
.oic .fsec{border:1px solid var(--line);border-radius:6px;margin-bottom:12px;overflow:hidden}
.oic .fhead{background:#f3f4f6;padding:8px 12px;font-weight:600}
.oic .fgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
.oic .frow{display:flex;gap:8px;padding:8px 12px;border-top:1px solid var(--line)}
.oic .fl{color:var(--muted);min-width:130px;flex-shrink:0}
.oic .fv{word-break:break-word}
`;

function OicRequests({ embedded = false, onCountChange }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingOn, setActingOn] = useState(null);

  const loadRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiGet("/api/sso/mapping/requests?status=pending");

      if (response.success) {
        setRequests(response.requests || []);
      } else {
        setError(response.message || "Unable to load requests.");
      }
    } catch (error) {
      console.error("Error loading requests:", error);
      setError("Unable to load requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // pending count parent (tab badge) ko batao
  useEffect(() => {
    if (!loading && onCountChange) onCountChange(requests.length);
  }, [loading, requests, onCountChange]);

  const handleDecision = async (requestId, decision, payload = {}) => {
    setActingOn(requestId);
    setError("");

    try {
      const response = await apiPost(
        `/api/sso/mapping/${requestId}/${decision}`,
        payload
      );

      if (!response.success) {
        setError(response.message || "Unable to update the request.");
        return;
      }

      setRequests((currentRequests) =>
        currentRequests.filter((request) => request.request_id !== requestId)
      );
    } catch (error) {
      console.error("Error updating request:", error);
      setError("Unable to update the request. Please try again.");
    } finally {
      setActingOn(null);
    }
  };

  const handleObjection = (requestId) => {
    const remarks = window.prompt(
      "Enter the reason for objection (this will be shown to the requester):"
    );

    if (remarks === null) {
      return;
    }

    if (!remarks.trim()) {
      setError("Objection reason cannot be empty.");
      return;
    }

    handleDecision(requestId, "objection", { remarks: remarks.trim() });
  };

  const page = (
    <div
      className="oic"
      style={embedded ? { padding: 0, minHeight: "auto", background: "transparent" } : undefined}
    >
      <style>{css}</style>

      {!embedded && <h2>OIC — Pending Requests</h2>}

      {error && <div className="err">{error}</div>}

      {loading ? (
        <p className="empty">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="empty">No pending requests.</p>
      ) : (
        <div className="tablebox">
          <table>
            <thead>
              <tr>
                <th>Request No</th>
                <th>Name</th>
                <th>SSO ID</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => {
                const isUpdating = actingOn === request.request_id;

                return (
                  <tr key={request.request_id}>
                    <td>{request.request_id}</td>
                    <td>{request.full_name || "-"}</td>
                    <td>{request.sso_id || "-"}</td>
                    <td>{request.department || "-"}</td>
                    <td>{request.designation || "-"}</td>
                    <td>{request.mobile || "-"}</td>
                    <td>{request.email || "-"}</td>
                    <td>
                      {request.submitted_at
                        ? new Date(request.submitted_at).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          type="button"
                          className="btn ok"
                          disabled={isUpdating}
                          onClick={() => handleDecision(request.request_id, "approve")}
                        >
                          {isUpdating ? "Working..." : "Approve"}
                        </button>

                        <button
                          type="button"
                          className="btn"
                          disabled={isUpdating}
                          onClick={() => handleDecision(request.request_id, "reject")}
                        >
                          {isUpdating ? "Working..." : "Access Denied"}
                        </button>

                        <button
                          type="button"
                          className="btn warn"
                          disabled={isUpdating}
                          onClick={() => handleObjection(request.request_id)}
                        >
                          {isUpdating ? "Working..." : "Raise Objection"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return embedded ? page : <Layout>{page}</Layout>;
}

export default OicRequests;