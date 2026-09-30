const crypto = require("crypto");

const SSO_API_BASE = (
  process.env.SSO_API_BASE || "https://ssotest.rajasthan.gov.in:4443/SSORESTNEW"
).replace(/\/+$/, "");

const TTL = 5 * 60 * 1000;
const LOGIN_CODE_TTL = 60 * 1000;

const cache = new Map();
const loginCodes = new Map();

const sweeper = setInterval(() => {
  const now = Date.now();
  for (const [token, entry] of cache.entries()) {
    if (entry.exp <= now) cache.delete(token);
  }
  for (const [code, entry] of loginCodes.entries()) {
    if (entry.exp <= now) loginCodes.delete(code);
  }
}, 60 * 1000);
if (sweeper.unref) sweeper.unref();

function basicAuthHeader() {
  return (
    "Basic " +
    Buffer.from(
      process.env.SSO_USERNAME + ":" + process.env.SSO_PASSWORD
    ).toString("base64")
  );
}

function ssoHeaders(token) {
  return {
    "SSO-TOKEN": token,
    Authorization: basicAuthHeader(),
    Accept: "application/json",
  };
}

async function fetchIdentity(token) {
  let tokenRes;
  try {
    tokenRes = await fetch(`${SSO_API_BASE}/TokenDetail`, {
      headers: ssoHeaders(token),
    });
  } catch (error) {
    console.error("SSO TokenDetail unreachable:", error.message);
    return { ok: false, reason: "SSO_UNREACHABLE" };
  }

  if (!tokenRes.ok) {
    console.error("SSO TokenDetail rejected, status:", tokenRes.status);
    return {
      ok: false,
      reason: tokenRes.status >= 500 ? "SSO_UNREACHABLE" : "TOKEN_REJECTED",
      status: tokenRes.status,
    };
  }

  let data;
  try {
    data = await tokenRes.json();
  } catch {
    return { ok: false, reason: "BAD_RESPONSE" };
  }

  const ssoId = data.sAMAccountName;
  if (!ssoId) return { ok: false, reason: "NO_SSO_ID" };

  const identity = {
    ssoId,
    userType: String(data.UserType || "").trim().toUpperCase(),
    roles: Array.isArray(data.Roles)
      ? data.Roles.map((r) => String(r).trim())
      : [],
    department: "",
    designation: "",
    mailId: "",
    profileOk: false,
  };

  try {
    const profileRes = await fetch(
      `${SSO_API_BASE}/Profile/${encodeURIComponent(ssoId)}`,
      { headers: ssoHeaders(token) }
    );

    if (profileRes.ok) {
      const p = await profileRes.json();
      identity.department = String(p.department || "").trim();
      identity.designation = String(p.designation || "").trim();
      identity.mailId = String(p.mailOfficial || p.mailPersonal || "").trim();
      identity.profileOk = true;
    } else {
      console.error("SSO Profile rejected, status:", profileRes.status);
    }
  } catch (error) {
    console.error("SSO Profile error:", error.message);
  }

  return { ok: true, identity };
}

function cacheIdentity(token, identity) {
  if (identity.profileOk) cache.set(token, { identity, exp: Date.now() + TTL });
  else cache.delete(token);
}

async function establishSession(token) {
  if (!token) return { ok: false, reason: "NO_TOKEN" };
  const result = await fetchIdentity(token);
  if (!result.ok) {
    cache.delete(token);
    return result;
  }
  cacheIdentity(token, result.identity);
  return { ok: true, ssoId: result.identity.ssoId, identity: result.identity };
}

async function resolveToken(token) {
  if (!token) return { ok: false, reason: "NO_TOKEN" };

  const hit = cache.get(token);
  if (hit && hit.exp > Date.now()) {
    return { ok: true, ssoId: hit.identity.ssoId, identity: hit.identity, cached: true };
  }

  return establishSession(token);
}

function dropSession(token) {
  if (!token) return false;
  return cache.delete(token);
}

function issueLoginCode(token) {
  const code = crypto.randomBytes(32).toString("base64url");
  loginCodes.set(code, { token, exp: Date.now() + LOGIN_CODE_TTL });
  return code;
}

function redeemLoginCode(code) {
  if (typeof code !== "string" || code.length > 200) return null;
  const entry = loginCodes.get(code);
  loginCodes.delete(code);
  if (!entry || entry.exp <= Date.now()) return null;
  return entry.token;
}

async function requireSession(req, res, next) {
  const token = req.headers["sso-token"];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Login required", reason: "NO_TOKEN" });
  }

  const result = await resolveToken(token);

  if (!result.ok) {
    if (result.reason === "SSO_UNREACHABLE") {
      return res.status(503).json({
        success: false,
        message: "SSO service is temporarily unavailable",
        reason: result.reason,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Session expired. Please log in again through SSO.",
      reason: result.reason,
    });
  }

  req.ssoId = result.ssoId;
  req.identity = result.identity;
  req.ssoToken = token;
  next();
}

function requireSameSsoId(req, res, next) {
  const asked = String(req.query.ssoId || "").trim().toLowerCase();
  const actual = String(req.ssoId || "").trim().toLowerCase();

  if (asked && asked !== actual) {
    return res.status(403).json({
      success: false,
      message: "ssoId does not match the logged-in session",
    });
  }

  next();
}

module.exports = {
  requireSession,
  requireSameSsoId,
  resolveToken,
  establishSession,
  dropSession,
  issueLoginCode,
  redeemLoginCode,
};