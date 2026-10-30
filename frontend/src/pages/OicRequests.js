import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { apiGet, apiPost } from "../api";
import "./OicRequests.css";



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