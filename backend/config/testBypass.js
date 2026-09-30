function testIds() {
  return (process.env.TEST_OIC_SSO_IDS || "")
    .split(",")
    .map((id) => id.trim().toUpperCase())
    .filter(Boolean);
}

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function isTestOicBypass(ssoId) {
  if (isProduction()) return false;
  return testIds().includes(String(ssoId || "").trim().toUpperCase());
}

if (isProduction() && testIds().length) {
  console.warn(
    "WARNING: TEST_OIC_SSO_IDS is set but ignored because NODE_ENV=production. Remove it from .env."
  );
}

module.exports = { isTestOicBypass };