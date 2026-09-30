import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { apiGet, apiPost } from "../api";

function OicRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingOn, setActingOn] = useState(null);

  const loadRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiGet(
        "/api/sso/mapping/requests?status=pending"
      );

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
        currentRequests.filter(
          (request) => request.request_id !== requestId
        )
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

  return (
    <Layout>
      <div className="oic-requests-page">
        <h2 className="section-heading">
          OIC — Pending Requests
        </h2>

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "16px",
              }}
            >
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    borderBottom: "2px solid #ccc",
                  }}
                >
                  <th style={{ padding: "10px" }}>
                    Request No
                  </th>

                  <th style={{ padding: "10px" }}>
                    Name
                  </th>

                  <th style={{ padding: "10px" }}>
                    SSO ID
                  </th>

                  <th style={{ padding: "10px" }}>
                    Department
                  </th>

                  <th style={{ padding: "10px" }}>
                    Designation
                  </th>

                  <th style={{ padding: "10px" }}>
                    Mobile
                  </th>

                  <th style={{ padding: "10px" }}>
                    Email
                  </th>

                  <th style={{ padding: "10px" }}>
                    Submitted
                  </th>

                  <th style={{ padding: "10px" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => {
                  const isUpdating =
                    actingOn === request.request_id;

                  return (
                    <tr
                      key={request.request_id}
                      style={{
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <td style={{ padding: "10px" }}>
                        {request.request_id}
                      </td>

                      <td style={{ padding: "10px" }}>
                        {request.full_name || "-"}
                      </td>

                      <td style={{ padding: "10px" }}>
                        {request.sso_id || "-"}
                      </td>

                      <td style={{ padding: "10px" }}>
                        {request.department || "-"}
                      </td>

                      <td style={{ padding: "10px" }}>
                        {request.designation || "-"}
                      </td>

                      <td style={{ padding: "10px" }}>
                        {request.mobile || "-"}
                      </td>

                      <td style={{ padding: "10px" }}>
                        {request.email || "-"}
                      </td>

                      <td style={{ padding: "10px" }}>
                        {request.submitted_at
                          ? new Date(
                              request.submitted_at
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td
                        style={{
                          padding: "10px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            handleDecision(
                              request.request_id,
                              "approve"
                            )
                          }
                          style={{
                            marginRight: "8px",
                            padding: "7px 12px",
                            cursor: isUpdating
                              ? "not-allowed"
                              : "pointer",
                          }}
                        >
                          {isUpdating
                            ? "Working..."
                            : "Approve"}
                        </button>

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            handleDecision(
                              request.request_id,
                              "reject"
                            )
                          }
                          style={{
                            marginRight: "8px",
                            padding: "7px 12px",
                            cursor: isUpdating
                              ? "not-allowed"
                              : "pointer",
                          }}
                        >
                          {isUpdating
                            ? "Working..."
                            : "Access Denied"}
                        </button>

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            handleObjection(request.request_id)
                          }
                          style={{
                            padding: "7px 12px",
                            backgroundColor: "#f0ad4e",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: isUpdating
                              ? "not-allowed"
                              : "pointer",
                          }}
                        >
                          {isUpdating
                            ? "Working..."
                            : "Raise Objection"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default OicRequests;