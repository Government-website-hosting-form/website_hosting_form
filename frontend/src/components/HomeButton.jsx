import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function HomeButton({ to = "/" }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (pathname === to) return null; // home page par button nahi dikhega

  return (
    <button
      onClick={() => navigate(to)}
      style={{
        position: "fixed",
        top: 12,
        left: 12,
        zIndex: 40,
        padding: "6px 14px",
        background: "#123d6d",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        fontSize: 13,
      }}
    >
      &#8962; Home
    </button>
  );
}