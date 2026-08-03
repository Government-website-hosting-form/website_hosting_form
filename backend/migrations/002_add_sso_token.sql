-- 002_add_sso_token.sql
-- Replaces the in-memory tokenStore (Map) in ssoAuthController.js with a DB
-- column, so Increase Session / Back To SSO / Signout survive a server
-- restart and work across multiple backend instances.
--
-- Run:
--   mysql -u <user> -p bsdc_hosting < 002_add_sso_token.sql

ALTER TABLE users
  ADD COLUMN sso_token VARCHAR(512) NULL AFTER sso_id;
