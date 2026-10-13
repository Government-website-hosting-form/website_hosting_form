// Ye roles mapping/approval skip karte hain aur seedha FORM paate hain.
const OIC_ROLES = [
  "PROGRAMMER",
  "ANALYST CUM PROGRAMMER",
  "ADDITIONAL DIRECTOR",
  "SYSTEM ANALYST",
  "SECRETARY OF I.T.",
  "COMMISSIONER OF I.T.",
  "TECHNICAL DIRECTOR",
];

// Sirf in roles ko OIC dashboard (/oic) milta hai.
// Abhi khali hai: roles tay hone par .env mein comma se daalo, jaise
// OIC_DASHBOARD_ROLES=DIRECTOR,JOINT DIRECTOR
// (designation RajSSO jaisi exact spelling mein, case ka farak nahi padta)
const DASHBOARD_ROLES = (process.env.OIC_DASHBOARD_ROLES || "")
  .split(",")
  .map((r) => r.trim().toUpperCase())
  .filter(Boolean);

module.exports = { OIC_ROLES, DASHBOARD_ROLES };