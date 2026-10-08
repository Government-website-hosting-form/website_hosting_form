const db = require("../config/db"); // <- mappingController jaisa hi

const BASE = `
  FROM apps a
  JOIN org o ON o.org_id = a.org_id
  WHERE a.status <> 'draft'`;

const EDIT_APP = ["name","type","type_other","nature","utility","utility_other","purpose",
  "subdomain","url","alternate_url","approval_authority","approval_designation","semt_approved",
  "mom_ref_no","mom_date","dev_company","dev_company_other","dev_contact_person","dev_address",
  "dev_phone_office","dev_phone","dev_email","maint_company","maint_active","maint_expiry",
  "maint_contact_person","maint_address","maint_phone_office","maint_phone_mobile","maint_email",
  "maint_contract_attached","safehost_agency","safehost_agency_other","safehost_empanel_no",
  "safehost_empanel_valid_till","safehost_ref_no","safehost_issue_date","safehost_valid_till",
  "load_users","loadtest_agency","loadtest_agency_other","loadtest_avg_response","loadtest_ref_no",
  "loadtest_issue_date","loadtest_valid_till","other_certificate_details"];

const EDIT_ORG = ["name","type","type_other","officer","officer_designation","email",
  "phone_office","phone","address","contact_name","contact_designation","contact_phone","contact_email"];

const pad = (n) => String(n).padStart(2, "0");
const clean = (row) => {
  if (!row) return row;
  const out = {};
  for (const [k, v] of Object.entries(row))
    out[k] = v instanceof Date
      ? `${v.getFullYear()}-${pad(v.getMonth() + 1)}-${pad(v.getDate())}` : v;
  return out;
};

// ---- audit log helpers ----
// NOTE: sso id wahi bharosemand hai jo requireOicRole ne verify karke req par set kiya ho.
const actor = (req) =>
  req.user?.sso_id || req.user?.ssoId || req.ssoId || req.headers["sso-id"] || null;
const clientIp = (req) =>
  (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.ip || null;

// Action karne wale OIC ka naam + designation (us waqt ka snapshot)
const getActor = async (req) => {
  const ssoId = actor(req);
  if (!ssoId) return { ssoId: null, name: null, designation: null };
  try {
    const [[u]] = await db.query(
      "SELECT full_name, designation FROM users WHERE sso_id = ?", [ssoId]);
    return { ssoId, name: u?.full_name || null, designation: u?.designation || null };
  } catch (e) {
    console.error("getActor failed:", e.message);
    return { ssoId, name: null, designation: null };
  }
};

const logAudit = async (req, appId, action, oldStatus, newStatus, remarks = null) => {
  try {
    const who = await getActor(req);
    await db.query(
      `INSERT INTO oic_audit_log
         (app_id, action, old_status, new_status, remarks, sso_id, ip_address, acted_by_name, acted_by_designation)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [appId, action, oldStatus, newStatus, remarks, who.ssoId, clientIp(req), who.name, who.designation]);
  } catch (e) { console.error("AUDIT LOG FAILED:", e.message); }
};

exports.list = async (req, res) => {
  try {
    const { search = "", status = "", department = "", application = "", page = 1, limit = 10, sort = "submitted_at", dir = "desc" } = req.query;
    let w = "", params = [];

    if (search) {
      const cols = ["a.form_id","a.request_no","a.name","a.url","a.alternate_url","a.subdomain",
        "a.purpose","a.utility","a.type","a.request_status","a.dev_company","a.maint_company",
        "a.safehost_agency","o.name","o.officer","o.officer_designation","o.email","o.phone",
        "o.contact_name","o.address"];
      w += ` AND (${cols.map(c => `${c} LIKE ?`).join(" OR ")})`;
      cols.forEach(() => params.push(`%${search}%`));
    }
    const wBase = w, paramsBase = [...params]; // circles ke counts: status filter ke bina
    if (status)      { w += " AND a.request_status = ?"; params.push(status); }
    if (department)  { w += " AND o.name = ?";           params.push(department); }
    if (application) { w += " AND a.name = ?";           params.push(application); }

    const offset = (Number(page) - 1) * Number(limit);
    const SORTABLE = { form_id: "a.form_id", url: "a.url", officer_name: "o.officer",
      application: "a.name", department: "o.name", status: "a.request_status", submitted_at: "a.submitted_at" };
    const orderBy = `${SORTABLE[sort] || "a.submitted_at"} ${String(dir).toLowerCase() === "asc" ? "ASC" : "DESC"}, a.app_id DESC`;
    // form_id NULL/empty ho to request_no, warna APP-0001 style fallback
    // acted_by / acted_at: is request par aakhri action kisne aur kab kiya (audit log se)
    const [rows] = await db.query(
      `SELECT a.app_id AS id,
              COALESCE(NULLIF(a.form_id, ''), NULLIF(a.request_no, ''),
                       CONCAT('APP-', LPAD(a.app_id, 4, '0'))) AS form_id,
              a.url, o.officer AS officer_name, o.email AS officer_email, o.phone AS officer_phone, a.objection_remarks AS remarks,
              a.name AS application, o.name AS department,
              a.request_status AS status, a.submitted_at,
              (SELECT COALESCE(l.acted_by_name, u.full_name, l.sso_id)
                 FROM oic_audit_log l
                 LEFT JOIN users u ON u.sso_id = l.sso_id
                WHERE l.app_id = a.app_id ORDER BY l.id DESC LIMIT 1) AS acted_by,
              (SELECT DATE_FORMAT(l.created_at, '%d-%m-%Y %H:%i')
                 FROM oic_audit_log l
                WHERE l.app_id = a.app_id ORDER BY l.id DESC LIMIT 1) AS acted_at
       ${BASE}${w} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]);
    const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total ${BASE}${w}`, params);
    const [cnt] = await db.query(
      `SELECT a.request_status AS s, COUNT(*) AS c ${BASE}${wBase} GROUP BY a.request_status`, paramsBase);
    const counts = {};
    cnt.forEach(r => { if (r.s) counts[r.s] = Number(r.c); });
    res.json({ rows, total, counts });
  } catch (e) { console.error("oic list:", e.message); res.status(500).json({ message: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const [[app]] = await db.query("SELECT * FROM apps WHERE app_id = ?", [req.params.id]);
    if (!app) return res.status(404).json({ message: "Not found" });
    const [[org]] = await db.query("SELECT * FROM org WHERE org_id = ?", [app.org_id]);
    const safe = async (sql) => {
      try { const [r] = await db.query(sql, [app.app_id]); return r.map(clean); }
      catch (e) { console.error("oic getOne:", e.message); return []; }
    };
    const infra = await safe("SELECT * FROM infra WHERE app_id = ?");
    const checklist = await safe("SELECT * FROM checklist WHERE app_id = ?");
    // purane rows me snapshot NULL ho sakta hai, isliye users table se fallback
    const audit = await safe(
      `SELECT l.action, l.old_status, l.new_status, l.remarks, l.sso_id,
              COALESCE(l.acted_by_name, u.full_name) AS acted_by_name,
              COALESCE(l.acted_by_designation, u.designation) AS acted_by_designation,
              DATE_FORMAT(l.created_at, '%d-%m-%Y %H:%i:%s') AS time
       FROM oic_audit_log l
       LEFT JOIN users u ON u.sso_id = l.sso_id
       WHERE l.app_id = ? ORDER BY l.id DESC`);
    res.json({ app: clean(app), org: clean(org), infra, checklist, audit });
  } catch (e) { console.error("oic getOne:", e.message); res.status(500).json({ message: e.message }); }
};

const buildSet = (obj = {}, allowed) => {
  const keys = Object.keys(obj).filter(k => allowed.includes(k));
  return { keys, vals: keys.map(k => (obj[k] === "" ? null : obj[k])) };
};

exports.update = async (req, res) => {
  try {
    const [[app]] = await db.query("SELECT app_id, org_id FROM apps WHERE app_id = ?", [req.params.id]);
    if (!app) return res.status(404).json({ message: "Not found" });

    const a = buildSet(req.body.app, EDIT_APP);
    const o = buildSet(req.body.org, EDIT_ORG);
    if (a.keys.length)
      await db.query(`UPDATE apps SET ${a.keys.map(k => `${k}=?`).join(",")} WHERE app_id=?`, [...a.vals, app.app_id]);
    if (o.keys.length)
      await db.query(`UPDATE org SET ${o.keys.map(k => `${k}=?`).join(",")} WHERE org_id=?`, [...o.vals, app.org_id]);
    res.json({ message: "Updated" });
  } catch (e) { console.error("oic update:", e.message); res.status(500).json({ message: e.message }); }
};

// Ab kisi bhi status se kisi bhi doosre status me ja sakte hain (naya OIC purana decision badal sake).
// Sirf wahi status dobara set nahi hoga jo already hai.
exports.objection = async (req, res) => {
  try {
    const remarks = (req.body.remarks || "").trim();
    if (!remarks) return res.status(400).json({ message: "Remarks required" });
    const [[app]] = await db.query("SELECT request_status FROM apps WHERE app_id=?", [req.params.id]);
    if (!app) return res.status(404).json({ message: "Not found" });
    if (app.request_status === "objection")
      return res.status(400).json({ message: "Is request par objection pehle hi raise ho chuka hai" });

    const [r] = await db.query(
      "UPDATE apps SET request_status='objection', objection_remarks=?, reviewed_at=NOW() WHERE app_id=? AND request_status=?",
      [remarks, req.params.id, app.request_status]);
    if (!r.affectedRows) return res.status(400).json({ message: "Request ka status badal chuka hai, page refresh karo" });

    await logAudit(req, req.params.id, "objection", app.request_status, "objection", remarks);
    res.json({ message: "Objection raised" });
  } catch (e) { console.error("oic objection:", e.message); res.status(500).json({ message: e.message }); }
};

exports.approve = async (req, res) => {
  try {
    const [[app]] = await db.query("SELECT request_status FROM apps WHERE app_id=?", [req.params.id]);
    if (!app) return res.status(404).json({ message: "Not found" });
    if (app.request_status === "approved")
      return res.status(400).json({ message: "Request pehle hi approved hai" });

    const [r] = await db.query(
      "UPDATE apps SET request_status='approved', reviewed_at=NOW() WHERE app_id=? AND request_status=?",
      [req.params.id, app.request_status]);
    if (!r.affectedRows) return res.status(400).json({ message: "Request ka status badal chuka hai, page refresh karo" });

    await logAudit(req, req.params.id, "approved", app.request_status, "approved");
    res.json({ message: "Approved" });
  } catch (e) { console.error("oic approve:", e.message); res.status(500).json({ message: e.message }); }
};

exports.reject = async (req, res) => {
  try {
    const remarks = (req.body.remarks || "").trim();
    if (!remarks) return res.status(400).json({ message: "Remarks required" });
    const [[app]] = await db.query("SELECT request_status FROM apps WHERE app_id=?", [req.params.id]);
    if (!app) return res.status(404).json({ message: "Not found" });
    if (app.request_status === "rejected")
      return res.status(400).json({ message: "Request pehle hi denied hai" });

    // reason objection_remarks column me hi save hota hai (alag column nahi hai)
    const [r] = await db.query(
      "UPDATE apps SET request_status='rejected', objection_remarks=?, reviewed_at=NOW() WHERE app_id=? AND request_status=?",
      [remarks, req.params.id, app.request_status]);
    if (!r.affectedRows) return res.status(400).json({ message: "Request ka status badal chuka hai, page refresh karo" });

    await logAudit(req, req.params.id, "rejected", app.request_status, "rejected", remarks);
    res.json({ message: "Access denied" });
  } catch (e) { console.error("oic reject:", e.message); res.status(500).json({ message: e.message }); }
};

exports.filterOptions = async (_req, res) => {
  try {
    const [dept] = await db.query(
      "SELECT DISTINCT o.name FROM org o JOIN apps a ON a.org_id=o.org_id WHERE a.status <> 'draft' ORDER BY o.name");
    const [apps] = await db.query("SELECT DISTINCT name FROM apps WHERE status <> 'draft' ORDER BY name");
    const [cnt] = await db.query(
      "SELECT request_status, COUNT(*) AS c FROM apps WHERE status <> 'draft' GROUP BY request_status");
    const counts = {};
    cnt.forEach(r => { if (r.request_status) counts[r.request_status] = r.c; });
    res.json({
      departments: dept.map(d => d.name),
      applications: apps.map(a => a.name),
      statuses: ["pending", "approved", "rejected", "objection"],
      counts,
    });
  } catch (e) { console.error("oic filters:", e.message); res.status(500).json({ message: e.message }); }
};