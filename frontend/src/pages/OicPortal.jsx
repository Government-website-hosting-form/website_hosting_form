import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { apiGet } from "../api";
import OicDashboard from "./OicDashboard";
import OicRequests from "./OicRequests";

const css = `
.portal{padding:0}
.portal h2{margin:0 0 14px;font-size:22px;text-align:center}
.portal-tabs{display:flex;gap:4px;border-bottom:1px solid #e5e7eb;margin-bottom:16px}
.portal-tabs button{background:none;border:none;padding:10px 16px;cursor:pointer;font-size:14px;
  color:#6b7280;border-bottom:2px solid transparent;margin-bottom:-1px;font-family:inherit}
.portal-tabs button:hover{color:#111827}
.portal-tabs button.active{color:#111827;font-weight:600;border-bottom-color:#111827}
`;

export default function OicPortal() {
  const [tab, setTab] = useState("hosting");
  const [userCount, setUserCount] = useState(null);

  // tab badge ke liye pending User Requests ka count (page khulte hi)
  useEffect(() => {
    let alive = true;
    apiGet("/api/sso/mapping/requests?status=pending")
      .then((res) => {
        if (alive && res && res.success) setUserCount((res.requests || []).length);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const tabs = [
    { key: "hosting", label: "Website Hosting Requests" },
    {
      key: "users",
      label: userCount > 0 ? `User Requests (${userCount})` : "User Requests",
    },
  ];

  return (
    <Layout>
      <style>{css}</style>
      <div className="portal">
        <h2>OIC Dashboard</h2>

        <div className="portal-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={tab === t.key ? "active" : ""}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "hosting" ? (
          <OicDashboard embedded />
        ) : (
          <OicRequests embedded onCountChange={setUserCount} />
        )}
      </div>
    </Layout>
  );
}