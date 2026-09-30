const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads", "approval-letters");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const extOk = ALLOWED_EXTENSIONS.includes(ext);

  if (!mimeOk || !extOk) {
    return cb(
      new Error("Only PDF, JPG, and PNG files are allowed for the approval letter")
    );
  }

  cb(null, true);
}

const uploadApprovalLetter = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
});

function uploadApprovalLetterSingle(fieldName) {
  const handler = uploadApprovalLetter.single(fieldName);

  return function (req, res, next) {
    handler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "Approval letter must be 5MB or smaller",
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Invalid file",
        });
      }

      next();
    });
  };
}

module.exports = {
  uploadApprovalLetter,
  uploadApprovalLetterSingle,
};