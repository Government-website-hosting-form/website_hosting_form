-- 001_add_mapping_approval_fields.sql
-- Diagram: "USER MAPPING TABLE" + "PROFILE E-DATA (AUTOFILL) + APPROVAL LETTER" boxes.
-- ssoAuthController.js already reads/writes status + is_approved on `users`;
-- these columns don't exist yet in the real DB (confirmed against current schema
-- via /users, /org routes) — this migration adds them plus the fields the
-- Mapping.js form collects (full name, mobile, remarks, approval letter file path).
--
-- Run this once against bsdc_hosting before testing the mapping/submit route:
--   mysql -u <user> -p bsdc_hosting < 001_add_mapping_approval_fields.sql

ALTER TABLE users
  ADD COLUMN status ENUM('active', 'inactive') NOT NULL DEFAULT 'active' AFTER email,
  ADD COLUMN is_approved TINYINT(1) NOT NULL DEFAULT 0 AFTER status,
  ADD COLUMN full_name VARCHAR(100) NULL AFTER is_approved,
  ADD COLUMN mobile VARCHAR(15) NULL AFTER full_name,
  ADD COLUMN department VARCHAR(150) NULL AFTER mobile,
  ADD COLUMN remarks VARCHAR(500) NULL AFTER department,
  ADD COLUMN approval_letter_path VARCHAR(255) NULL AFTER remarks,
  ADD COLUMN mapping_submitted_at DATETIME NULL AFTER approval_letter_path;

-- NOTE: `department` here is the value entered on the Mapping/approval page —
-- it's a placeholder until the real `org` row exists (created later via the
-- Organization Details step in the main hosting-form flow). getUserDetails()
-- in ssoController.js now COALESCEs org.name first, falling back to this column.
