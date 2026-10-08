const express = require("express");
const cors = require("cors");
require("dotenv").config();

const ssoRoutes = require("./routes/ssoRoutes");
const mappingRoutes = require("./routes/mappingRoutes");
const formRoutes = require("./routes/formRoutes");
const {
  requireSession,
  requireSameSsoId,
  establishSession,
  issueLoginCode,
} = require("./middleware/session");
const { isTestOicBypass } = require("./config/testBypass");
const { requireApprovedUser } = require("./middleware/access");
const { logout, exchangeLoginCode } = require("./controllers/ssoController");

const app = express();
app.set("etag", false);

const PORT = process.env.PORT || 3000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3001";

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "SSO-TOKEN", "SSO-ID", "Authorization"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  res.set("Referrer-Policy", "no-referrer");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});
app.use("/api/oic", requireSession, require("./routes/oicRoutes"));
app.post("/", async (req, res) => {
  try {
    const token = req.body.userdetails;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "SSO token not received",
      });
    }

    const session = await establishSession(token);

    if (!session.ok) {
      const reason =
        session.reason === "SSO_UNREACHABLE"
          ? "sso_unreachable"
          : "token_detail_failed";
      return res.redirect(FRONTEND_URL + "/sso/failed?reason=" + reason);
    }

    const id = session.identity;

    if (id.userType !== "GOVT") {
      return res.redirect(FRONTEND_URL + "/sso/failed?reason=NOT_G2G");
    }

    if (
      id.designation.toUpperCase() === "CITIZEN" &&
      !isTestOicBypass(id.ssoId)
    ) {
      return res.redirect(FRONTEND_URL + "/sso/failed?reason=NOT_G2G");
    }

    const code = issueLoginCode(token);
    return res.redirect(
      FRONTEND_URL + "/sso/success?code=" + encodeURIComponent(code)
    );
  } catch (error) {
    console.error("SSO login error:", error.message);
    return res.redirect(FRONTEND_URL + "/sso/failed?reason=server_error");
  }
});

app.post("/api/sso/exchange", exchangeLoginCode);

app.post("/api/sso/logout", logout);

app.use("/api/sso/mapping", requireSession, mappingRoutes);

app.use("/api/sso", requireSession, requireSameSsoId, ssoRoutes);

app.use(
  ["/org", "/apps", "/infra", "/checklist"],
  requireSession,
  requireApprovedUser
);
app.use(formRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  const status = err.status && err.status < 500 ? err.status : 500;
  res.status(status).json({
    success: false,
    message: status < 500 ? err.message : "Server error",
  });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});