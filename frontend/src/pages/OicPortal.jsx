import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { apiGet } from "../api";
import OicDashboard from "./OicDashboard";
import OicRequests from "./OicRequests";
import "./OicPortal.css";

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