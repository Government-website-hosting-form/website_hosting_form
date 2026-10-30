const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const db = require("../config/db");

const router = express.Router();
const DIR = path.join(__dirname, "..", "uploads", "form-pdfs");
fs.mkdirSync(DIR, { recursive: true });

const TARGETS = {
  apps: {
    idCol: "app_id",
    fields: ["app_purpose_doc", "app_domain_doc", "app_approval_doc", "mom_doc", "safehost_doc", "loadtest_doc"],
  },
  infra: {
    idCol: "infra_id",
    fields: ["hw_fms_contract_doc", "hw_amc_contract_doc"],
  },
};

const EXT = { "application/pdf": ".pdf", "image/jpeg": ".jpg" };

const upload = multer({
  storage: multer.diskStorage({
    destination: DIR,
    filename: (req, file, cb) => {
      const ext = EXT[file.mimetype];
      const safe = path
        .basename(file.originalname, path.extname(file.originalname))
        .replace(/[^A-Za-z0-9_-]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 60) || "file";
      cb(null, Date.now() + "-" + crypto.randomBytes(6).toString("hex") + "-" + safe + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    EXT[file.mimetype] ? cb(null, true) : cb(new Error("Only PDF or JPG files are allowed")),
});

router.post("/upload-file", (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      const message = err.code === "LIMIT_FILE_SIZE" ? "File must be 5 MB or smaller" : err.message;
      return res.status(400).json({ success: false, message });
    }

    try {
      if (!req.file) return res.status(400).json({ success: false, message: "No file received" });

      const { target, id, field } = req.body;
      const t = TARGETS[target];

      if (!t || !t.fields.includes(field) || !id) {
        fs.unlink(req.file.path, () => {});
        return res.status(400).json({ success: false, message: "Invalid upload request" });
      }

      const stored = "uploads/form-pdfs/" + req.file.filename;
      const [result] = await db.query(
        `UPDATE \`${target}\` SET \`${field}\` = ? WHERE \`${t.idCol}\` = ?`,
        [stored, id]
      );

      if (!result.affectedRows) {
        fs.unlink(req.file.path, () => {});
        return res.status(404).json({ success: false, message: "Record not found" });
      }

      return res.json({ success: true, path: stored });
    } catch (e) {
      console.error("upload-file error:", e.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  });
});

module.exports = router;