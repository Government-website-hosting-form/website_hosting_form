

const multer = require('multer')
const path = require('path')
const fs = require('fs')

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'approval-letters')
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

const ALLOWED_MIME = ['application/pdf', 'image/jpeg', 'image/png']
const MAX_SIZE = 5 * 1024 * 1024

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ssoId = (req.body.ssoId || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_')
    const ext = path.extname(file.originalname)
    cb(null, `${ssoId}_${Date.now()}${ext}`)
  }
})

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    return cb(new Error('Only PDF, JPG or PNG files are allowed.'))
  }
  cb(null, true)
}

const uploadApprovalLetter = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE }
})

module.exports = { uploadApprovalLetter }
